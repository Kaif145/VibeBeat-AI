import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kaifurrahaman145_db_user:YOUR_PASSWORD@cluster0.isbqz5q.mongodb.net/myDatabase";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }

  app.use(express.json());
  app.use(cookieParser());

  // Spotify Config
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "df827e99f9cb45ed8b6a80e8bbdafb24";
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SCOPES = "user-read-private user-read-email user-library-read user-library-modify";

  let clientAccessToken = "";
  let tokenExpiry = 0;

  const getClientAccessToken = async () => {
    if (clientAccessToken && Date.now() < tokenExpiry) {
      return clientAccessToken;
    }

    if (!SPOTIFY_CLIENT_SECRET) {
      console.warn("SPOTIFY_CLIENT_SECRET is not defined. Spotify search might fail.");
      return null;
    }

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({ grant_type: "client_credentials" }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        }
      );

      clientAccessToken = response.data.access_token;
      tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000; // Subtract 1 min for safety
      return clientAccessToken;
    } catch (err: any) {
      console.error("Failed to get Spotify Client Access Token:", err.response?.data || err.message);
      return null;
    }
  };

  // Spotify Search Endpoint
  app.get("/api/spotify/search", async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query required" });

    const token = await getClientAccessToken();
    if (!token) return res.status(500).json({ error: "Spotify authentication failed" });

    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        params: {
          q: q as string,
          type: "track",
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tracks = response.data.tracks.items
        .map((item: any) => ({
          id: item.id,
          title: item.name,
          artist: item.artists[0].name,
          album: item.album.name,
          coverUrl: item.album.images[0]?.url,
          previewUrl: item.preview_url,
          spotifyUrl: item.external_urls.spotify,
        }))
        .sort((a: any, b: any) => {
          // Prioritize tracks with previews
          if (a.previewUrl && !b.previewUrl) return -1;
          if (!a.previewUrl && b.previewUrl) return 1;
          return 0;
        })
        .slice(0, 5);

      res.json({ tracks });
    } catch (err: any) {
      console.error("Spotify Search Error:", err.response?.data || err.message);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // 1. Get Spotify Auth URL
  const getRedirectUri = (req: express.Request) => {
    // In this environment, we should use the APP_URL if provided, 
    // otherwise fallback to the request host
    const appUrl = process.env.APP_URL;
    if (appUrl) {
      return `${appUrl.replace(/\/$/, "")}/callback`;
    }
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    return `${protocol}://${host}/callback`;
  };

  // 1. Get Spotify Auth URL
  app.get("/api/auth/spotify/url", (req, res) => {
    const redirectUri = getRedirectUri(req);
    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: SCOPES,
      show_dialog: "true",
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${params.toString()}` });
  });

  // 2. Callback Handler
  app.get("/callback", async (req, res) => {
    const { code, error } = req.query;

    if (error) {
      return res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: "SPOTIFY_AUTH_ERROR", error: "${error}" }, "*");
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send("No code provided");
    }

    try {
      const redirectUri = getRedirectUri(req);
      
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: redirectUri,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Send tokens back to the frontend via postMessage
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: "SPOTIFY_AUTH_SUCCESS", 
                  payload: { 
                    accessToken: "${access_token}", 
                    refreshToken: "${refresh_token}",
                    expiresIn: ${expires_in}
                  } 
                }, "*");
                window.close();
              } else {
                window.location.href = "/";
              }
            </script>
            <p>Authentication successful! You can close this window.</p>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error("Spotify Token Exchange Error:", err.response?.data || err.message);
      res.status(500).send("Failed to exchange token");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

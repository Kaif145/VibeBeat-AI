
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeMood = async (moodText: string): Promise<AIRecommendation> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a world-class music curator. Analyze the following mood description and curate a list of 10 tracks that perfectly capture this emotional landscape.
    
    Mood: "${moodText}"
    
    1. Identify a primary "vibe" keyword.
    2. Provide 10 real, popular tracks.
    3. For each track, write a compelling 1-sentence explanation of how it complements the specific emotions or setting in the user's description.
    4. Include 2-3 specific tags per song (e.g., "Mellow", "High Energy", "Lyrical").`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vibe: { type: Type.STRING },
          suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          recommendedTracks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                whyMatch: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "artist", "whyMatch", "tags"]
            }
          }
        },
        required: ["vibe", "suggestedTags", "description", "recommendedTracks"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const analyzePhoto = async (base64Image: string): Promise<AIRecommendation> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } },
        { text: "As a visual-to-audio expert, analyze the lighting, composition, and 'feel' of this photo. Suggest 10 real, popular songs that act as the perfect soundtrack for this visual aesthetic. For each, explain the visual-audio connection and provide relevant tags like 'Cinématographie', 'Gritty', or 'Ethereal'." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vibe: { type: Type.STRING },
          suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          recommendedTracks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                whyMatch: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "artist", "whyMatch", "tags"]
            }
          }
        },
        required: ["vibe", "suggestedTags", "description", "recommendedTracks"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

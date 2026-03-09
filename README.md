# 🎧 VibeBeat AI

VibeBeat AI is a mood-based music recommendation app that uses AI to suggest songs based on how you feel.

## 🚀 Features
- AI mood detection using Gemini API
- Song recommendations from Spotify
- Clean and responsive UI
- Fast search and playback links

## 🛠 Tech Stack
- Node.js
- TypeScript
- Vite
- Spotify Web API
- Google Gemini API

## 📦 Installation

Clone the repository:

git clone https://github.com/Kaif145/VibeBeat-AI.git

Go into the project folder:

cd VibeBeat-AI

Install dependencies:

npm install

## 🔑 Environment Variables

Create a `.env` file and add (do not commit this file to git):

GEMINI_API_KEY=your_gemini_key  
SPOTIFY_CLIENT_ID=your_spotify_client_id  
SPOTIFY_CLIENT_SECRET=your_spotify_secret  

> ⚠️ **Security note:** never store actual API keys in source control. If you've accidentally committed secrets (like a Spotify client ID/secret), rotate them immediately via the provider dashboard and clean your git history (see next section).

## ▶ Run the project

npm run dev

The server will start at:

http://localhost:3000

## 📌 Project Goal

This project was built to explore how AI can personalize music recommendations based on user mood and emotions.
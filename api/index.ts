import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// API Recommendations endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    const { userPreferences } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key missing" });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `
      You are an AI chef for a futuristic restaurant called ALFLIX. 
      User preferences: ${userPreferences || 'Likes futuristic, spicy, and high-tech food'}
      Recommend 3 creative futuristic meal names and short 1-sentence descriptions. 
      Return as JSON array: [{ "name": "...", "description": "...", "category": "..." }]. 
      Categories: Burgers, Pizza, BBQ, Drinks, Desserts.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text || "[]";
    let recommendations = [];
    try {
      recommendations = JSON.parse(text);
    } catch (e) {
      // Fallback for non-strict JSON output if somehow it still returns markdown
      const jsonMatch = text.match(/\[.*\]/s);
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    res.json({ recommendations });
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Fantasy Worldbuilding Bible PWA" });
  });

  // Server-side Gemini API endpoint for AI Worldbuilding Assistance
  app.post("/api/ai/brainstorm", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured in environment settings."
        });
      }

      const { prompt, contextType } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are an expert fantasy author and worldbuilder assistant. Your role is to generate creative, cohesive fantasy lore, character descriptions, magic rules, or timeline events for a multi-book fantasy series bible. Format output in markdown with rich descriptive prose, evocative quotes, and bold entities.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nTask (${contextType || 'lore'}): ${prompt}` }]
          }
        ]
      });

      const text = response.text || "No lore generated.";
      res.json({ result: text });
    } catch (err: unknown) {
      console.error("Gemini API Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate fantasy lore.";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

// server.js
import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* ------------------------------------
   Serve React build (for Vite /dist)
------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

/* ------------------------------------
   Optional OpenAI Client
   (Does NOT crash if API key missing)
------------------------------------- */
let client = null;
if (process.env.OPENAI_API_KEY) {
  console.log("🔑 OpenAI API Key detected → AI chat ENABLED");
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.log("⚠️ No OpenAI API Key found → AI chat DISABLED");
}

/* ------------------------------------
   Support Chat API
------------------------------------- */
app.post("/api/support-chat", async (req, res) => {
  // No key? Return safe message
  if (!client) {
    return res.json({
      reply: {
        role: "assistant",
        content:
          "AI support chat is disabled because no OpenAI API key is configured.",
      },
    });
  }

  try {
    const { messages } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    res.json({ reply: completion.choices[0].message });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "OpenAI error" });
  }
});

/* ------------------------------------
   Fallback for React Router SPA
------------------------------------- */
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

/* ------------------------------------
   Start server
------------------------------------- */
const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

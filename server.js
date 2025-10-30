import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/emojis", async (req, res) => {
  const sampleFile = path.join(__dirname, "data/sample_emojis.json");
  try {
    const resp = await fetch("https://api.github.com/emojis", {
      headers: { "User-Agent": "EmojiVerse" },
    });
    if (!resp.ok) throw new Error("GitHub API failed");
    const data = await resp.json();
    const map = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data/categories.map.json"))
    );
    const out = [];
    for (const [name, url] of Object.entries(data)) {
      const cat = Object.entries(map).find(([_, pats]) =>
        pats.some((p) => new RegExp(p, "i").test(name))
      );
      out.push({ name, url, cat: cat ? cat[0] : "Objects" });
    }
    res.json(out);
  } catch (err) {
    console.warn("⚠️ Using fallback sample:", err.message);
    const sample = JSON.parse(fs.readFileSync(sampleFile));
    res.json(sample);
  }
});

app.listen(PORT, () =>
  console.log(`🌌 EmojiVerse running at http://localhost:${PORT}`)
);

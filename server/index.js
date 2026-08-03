// ─────────────────────────────────────────────────────────────────────────────
//  PROVIDED BACKEND  —  not part of the Week 1 frontend curriculum.
//
//  In the bootcamp, students receive the backend as a ready-made repo (Week 1,
//  Slide 3). Its only job is to keep the secret AI key OFF the browser
//  (Week 1, Slide 23: "secrets live on the server, never in the frontend").
//
//  Contract the frontend depends on:
//    POST /api/memes   body: { category }   ->   { memes: [{ id, imageUrl, caption }] }
// ─────────────────────────────────────────────────────────────────────────────
import 'dotenv/config'
import express from 'express'
import { generateMemeTexts } from './openrouter.js'
import { pickTemplates, buildMemeImages } from './memegen.js'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8787

// A short human description per category. We keep this on the server so the
// prompt (and any tweaks to it) stay out of the frontend.
const CATEGORY_THEMES = {
  bollywood: 'Bollywood movies, iconic actors, dramatic dialogues and filmy songs',
  cartoon: 'classic cartoons and childhood animated TV shows',
  'viral-songs': 'viral songs and internet music trends everyone has stuck in their head',
  sports: 'sports fandom — cricket, football and big tournament moments',
}

app.post('/api/memes', async (req, res) => {
  const category = req.body?.category
  const theme = CATEGORY_THEMES[category]

  if (!theme) {
    return res.status(400).json({ error: 'Unknown category' })
  }

  try {
    // 1. Pick meme templates (each with its joke format).
    // 2. Ask the AI for text written to each template's structure.
    // 3. Paint the text onto the templates via memegen.link.
    const templates = await pickTemplates(5)
    const texts = await generateMemeTexts(theme, templates)
    const memes = buildMemeImages(category, templates, texts)
    res.json({ memes })
  } catch (err) {
    console.error('[/api/memes] failed:', err.message)
    res.status(502).json({ error: 'Failed to generate memes' })
  }
})

app.listen(PORT, () => {
  console.log(`🔥 Meme backend listening on http://localhost:${PORT}`)
})

# 🔥 AI Meme Generator

> Naukri AI Bootcamp · Week 01

Pick a vibe — Bollywood, cartoons, viral songs, or sports — and get five fresh memes in seconds. Captions are written by an LLM (via [OpenRouter](https://openrouter.ai)) and printed onto classic meme templates from [memegen.link](https://memegen.link).

Built as a two-process app: a Vite/React/TypeScript frontend and a small Express backend that keeps the AI API key server-side, never exposed to the browser.

## Features

- **4 meme categories** — Bollywood, Cartoons, Viral Songs, Sports — each generating 5 memes at a time
- **AI-written captions** fitted to each template's joke structure (not generic one-liners), with a Hinglish, relatable tone
- **Click-to-preview modal** with the full uncropped image, keyboard (Esc) and click-outside dismissal, and an "open in new tab" link
- **Shuffle again** to regenerate a fresh batch for the same category
- **"Paper Brutalism"** design system — hard ink shadows, dashed borders, bold type — implemented entirely in hand-written CSS (no UI framework)
- Accessible by default: proper `role`s (`status`, `alert`, `dialog`), `aria-live`/`aria-modal` regions, focus handling, `prefers-reduced-motion` support, and real `<button>` controls throughout

## Tech stack

| Layer    | Tech                                                              |
| -------- | ------------------------------------------------------------------ |
| Frontend | React 19, TypeScript, Vite 8                                       |
| Backend  | Node.js, Express 5                                                  |
| AI       | [OpenRouter](https://openrouter.ai) chat completions (free-tier models) |
| Images   | [memegen.link](https://memegen.link) template + caption rendering API |

## How it works

```
Browser (Vite, :5173)                 Backend (Express, :8787)
┌─────────────────────┐   POST /api/memes   ┌──────────────────────────┐
│ CategoryPicker click │ ───────────────────▶│ 1. pick 5 meme templates │
│  useMemeGenerator()  │                     │ 2. ask OpenRouter for    │
│                      │◀─────────────────── │    captions per template│
│  MemeGallery/Modal   │   { memes: [...] }  │ 3. build memegen.link    │
└─────────────────────┘                     │    image URLs            │
                                             └──────────────────────────┘
```

In dev, Vite proxies any `/api/*` request to `http://localhost:8787` (see `vite.config.ts`), so the frontend only ever talks to relative `/api` paths — the backend URL and the OpenRouter key live server-side only.

## Getting started

### Prerequisites

- Node.js 20+ and npm
- A free [OpenRouter](https://openrouter.ai/keys) API key

### Setup

```bash
git clone <this-repo-url>
cd meme_generator
npm install
```

Create your local env file and add your key:

```bash
cp .env.example .env
```

```ini
# .env
OPEN_ROUTER_API_KEY=sk-or-...   # required
OPENROUTER_MODEL=               # optional: pin a specific free model
PORT=                           # optional: defaults to 8787
```

### Run it

```bash
npm run dev
```

This starts the Vite dev server (`:5173`) and the Express API (`:8787`) together, with color-coded logs. Open **http://localhost:5173**.

## Available scripts

| Command           | What it does                                              |
| ------------------ | ----------------------------------------------------------- |
| `npm run dev`      | Runs frontend + backend together (`concurrently`)          |
| `npm run dev:web`  | Frontend only (Vite)                                        |
| `npm run dev:api`  | Backend only (`node --watch server/index.js`)               |
| `npm run build`    | Type-checks (`tsc`) then builds the production bundle       |
| `npm run preview`  | Serves the production build locally                          |

## Project structure

```
meme_generator/
├── index.html              # Vite entry HTML
├── vite.config.ts          # React plugin + /api → :8787 proxy
├── tsconfig.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx             # React root
│   ├── App.tsx               # Top-level layout + state wiring
│   ├── style.css             # "Paper Brutalism" design system
│   ├── types.ts              # Meme type
│   ├── categories.ts         # CategoryId union + CATEGORIES data
│   ├── api/
│   │   └── memes.ts          # generateMemes() — POST /api/memes
│   ├── hooks/
│   │   └── useMemeGenerator.ts  # memes/activeCategory/loading/error state
│   └── components/
│       ├── Header.tsx
│       ├── CategoryPicker.tsx
│       ├── Spinner.tsx
│       ├── EmptyState.tsx
│       ├── Button.tsx
│       ├── MemeGallery.tsx
│       ├── MemeCard.tsx
│       └── MemeModal.tsx
└── server/                  # Provided backend — keeps the AI key off the browser
    ├── index.js               # Express app, POST /api/memes
    ├── openrouter.js          # AI caption generation
    └── memegen.js             # memegen.link template + image URL builder
```

## API

The backend exposes a single endpoint the frontend depends on:

```
POST /api/memes
Content-Type: application/json

{ "category": "bollywood" | "cartoon" | "viral-songs" | "sports" }
```

**Response**

```json
{
  "memes": [
    { "id": "bollywood-0-...", "imageUrl": "https://api.memegen.link/images/...", "caption": "..." }
  ]
}
```

A 4xx/5xx response is surfaced in the UI as `Couldn't generate memes. Please try again.`

## Design system

CSS custom properties in `src/style.css` define the whole "Paper Brutalism" palette: warm paper/card backgrounds, near-black ink, a teal accent, a yellow highlight, hard offset shadows (`5px`/`8px`), and thick `2.5px` ink borders. Interactive elements (category cards, buttons, meme cards) share one hover/press/focus-visible interaction pattern; motion is disabled under `prefers-reduced-motion`.

## Credits

Built for the **Naukri AI Bootcamp**. Captions by AI via [OpenRouter](https://openrouter.ai) · Images by [memegen.link](https://memegen.link).

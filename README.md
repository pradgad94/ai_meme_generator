# 🔥 AI Meme Generator

[![CI](https://github.com/pradgad94/ai_meme_generator/actions/workflows/ci.yml/badge.svg)](https://github.com/pradgad94/ai_meme_generator/actions/workflows/ci.yml)

> Naukri AI Bootcamp · Week 01

Pick a vibe — Bollywood, cartoons, viral songs, or sports — and get five fresh memes in seconds. Captions are written by an LLM (via [OpenRouter](https://openrouter.ai)) and printed onto classic meme templates from [memegen.link](https://memegen.link).

Built as a containerized full-stack application with a Vite/React/TypeScript frontend and an Express backend. Docker Compose manages local multi-container development, while GitHub Actions validates builds and publishes versioned Docker images to GitHub Container Registry (GHCR). API keys remain server-side and are injected at runtime rather than baked into container images.

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
| Containerization | Docker, Docker Compose |
| CI | GitHub Actions |
| Container Registry | GitHub Container Registry (GHCR) |

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

Vite proxies any `/api/*` request to `http://backend:8787` (see `vite.config.ts`) — the `backend` hostname is resolved via Docker Compose's internal network, so this proxy only works when the frontend is running in its container.

The frontend always makes relative `/api` requests, keeping the backend URL
and OpenRouter API key server-side.

## Docker

The application is containerized as two separate services, each with its own Dockerfile:

- **`frontend`** — built from `Dockerfile.frontend`, runs the Vite dev server on port `5173`
- **`backend`** — built from `Dockerfile.backend`, runs the Express API on port `8787` and reads secrets from `.env` via `env_file` (so the OpenRouter key never gets baked into the image)

`compose.yaml` builds and runs both services locally. The `image:` configuration
tags the resulting images as:

- `ghcr.io/pradgad94/meme-backend:${IMAGE_TAG:-latest}`
- `ghcr.io/pradgad94/meme-frontend:${IMAGE_TAG:-latest}`

A second file, `compose.ci.yaml`, is used only by CI to build/push those same images without starting containers.

```text
Browser
   |
   v
Frontend container (:5173)
   |
   | /api requests
   v
Backend container (:8787)
   |
   v
OpenRouter API
```

## CI & Container Publishing

`.github/workflows/ci.yml` runs on:

- pushes to `master`
- pull requests targeting `master`

1. **`build`** — runs `npm ci` and `npm run build` to install dependencies and validate the frontend build.

2. **`docker`** — after the build job succeeds, builds both Docker images via `compose.ci.yaml`. On pushes to `master`, the workflow logs into GHCR and publishes the images tagged with the Git commit SHA.

### Published Images

The CI workflow publishes commit-tagged container images to GitHub Container Registry:

- `ghcr.io/pradgad94/meme-backend:<commit-sha>`
- `ghcr.io/pradgad94/meme-frontend:<commit-sha>`

Using the Git commit SHA as the image tag provides a direct mapping between a
Docker image and the source code used to build it.

## Getting started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (to run the app as containers, the intended path)
- Node.js 20+ and npm (only needed if you want to run the frontend/backend directly on the host instead)
- A free [OpenRouter](https://openrouter.ai/keys) API key

### Setup

```bash
git clone <this-repo-url>
cd meme_generator
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
docker compose up --build
```

This builds and starts both containers — frontend on `:5173`, backend on `:8787`. Open **http://localhost:5173**.

> **Note:** `npm run dev` (see [Available scripts](#available-scripts)) is no longer a drop-in alternative — the Vite proxy in `vite.config.ts` points at `http://backend:8787`, a hostname that only resolves inside the Docker Compose network. Running the frontend directly on the host will fail to reach the API unless that proxy target is changed back to `localhost`.

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
├── .dockerignore            # Files excluded from Docker build context
├── compose.yaml             # Local dev: builds + runs frontend/backend containers
├── compose.ci.yaml          # CI-only: builds/pushes images, no containers started
├── Dockerfile.frontend      # Frontend image (Vite dev server on :5173)
├── Dockerfile.backend       # Backend image (Express API on :8787)
├── .github/
│   └── workflows/
│       └── ci.yml           # Build + Docker build/push to GHCR
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

## My Contributions

This project was originally developed as part of the Naukri AI Bootcamp. I independently extended the project with the following infrastructure and DevOps work:

- Containerized the frontend and backend using separate Dockerfiles
- Created a multi-container Docker Compose setup for local development
- Configured frontend-to-backend communication within the Docker network
- Added `.dockerignore` to optimize Docker build contexts
- Separated local runtime configuration from CI configuration using:
  - `compose.yaml`
  - `compose.ci.yaml`
- Kept API secrets out of Docker images and configured them as runtime environment variables
- Designed and implemented a GitHub Actions CI workflow
- Added frontend dependency installation and build validation
- Configured dependent CI jobs using `needs`
- Added conditional image publishing for pushes to `master`
- Configured authentication and permissions for GitHub Container Registry
- Implemented commit SHA-based Docker image tagging
- Published frontend and backend container images to GHCR

## Credits

Built for the **Naukri AI Bootcamp**. Captions by AI via [OpenRouter](https://openrouter.ai) · Images by [memegen.link](https://memegen.link).

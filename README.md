# Śrīmad Bhāgavatam — The Living Chronicle

A dark-themed reading experience for the Śrīmad Bhāgavatam with Sage chat and verse-by-verse narration in Indian languages.

## Features

- Pure black theme with gold accents and Framer Motion transitions
- Chapter and verse reading, with Gnani AI Timbre v2.5 narration
- Verse translation through the configured Sage LLM provider
- Search, local bookmarks, gallery, and Sage chat
- Responsive pages for the Bhāgavatam, Rāmāyaṇa, Mahābhārata, Devī Purāṇa, and Śiva Purāṇa

## Pages and routes

- `/` — Home
- `/cantos` and `/canto/[canto]` — Canto and chapter navigation
- `/story/[canto]/[chapter]` — Chapter verses and narration
- `/gallery`, `/search`, `/bookmarks`, `/ask` — Gallery, search, saved stories, and Sage chat
- `POST /api/narrate` — Translate when needed and synthesize WAV audio with Gnani
- `POST /api/sage` — Generate Sage responses with the configured LLM provider

## Setup

Use Node.js and pnpm. Copy `.env.example` to `.env.local`, set the required credentials, then run:

```bash
pnpm install
pnpm dev
```

`GNANI_API_KEY`, `NVIDIA_API_KEY`, and `SARVAM_API_KEY` are server-only. Sage Q&A uses NVIDIA NIM by default; narration translation uses Sarvam's India-focused `sarvam-105b-conversations` model. Set the corresponding keys in `.env.local`. Get the NVIDIA key from [build.nvidia.com](https://build.nvidia.com) and the Sarvam key from the [Sarvam dashboard](https://dashboard.sarvam.ai/). Existing Sage providers remain selectable with `SAGE_PROVIDER` (`openrouter`, `ollama`, `replicate`, or local); see [SETUP_TTS.md](SETUP_TTS.md) for details.

## Data

The repository-root `srimad_bhagavatam.json` is statically imported by the story and canto pages. The README's former `/data/` path was incorrect. Chapter verses are English meanings; narration translates those meanings into the chosen language. Sanskrit text is not sent to TTS.

## Build and deploy

```bash
pnpm build
```

Set the environment variables in your hosting provider. Narration audio and translations are cached under the server's temporary directory and may be cleared when an instance restarts. Browsers also cache audio locally.

# Śrīmad Bhāgavatam — The Living Chronicle

A dark-themed reading experience for the Śrīmad Bhāgavatam with Sage chat and verse-by-verse narration in Indian languages.

## Features

- Pure black theme with gold accents and Framer Motion transitions
- Chapter and verse reading, with Gnani AI Timbre v2.5 narration
- Verse translation through the configured Sage LLM provider
- Search, local bookmarks, gallery, text-based Sage chat, and Gnani-powered voice chat
- Responsive pages for the Bhāgavatam, Rāmāyaṇa, Mahābhārata, Devī Purāṇa, and Śiva Purāṇa

## Pages and routes

- `/` — Home
- `/cantos` and `/canto/[canto]` — Canto and chapter navigation
- `/story/[canto]/[chapter]` — Chapter verses and narration
- `/gallery`, `/search`, `/bookmarks`, `/ask`, `/voice-chat` — Gallery, search, saved stories, Sage chat, and voice conversation
- `POST /api/narrate` — Translate when needed and synthesize WAV audio with Gnani
- `POST /api/sage` — Generate Sage responses with the configured LLM provider
- `/api/voice-chat/transcribe` and `/api/voice-chat/respond` — Transcribe short microphone clips with Gnani Prisma and answer with Sage

## Setup

Use Node.js and pnpm. Copy `.env.example` to `.env.local`, set the required credentials, then run:

```bash
pnpm install
pnpm dev
```

`GNANI_API_KEY`, `NVIDIA_API_KEY`, and `SARVAM_API_KEY` are server-only. Sage Q&A uses NVIDIA NIM by default; narration translation uses Sarvam's India-focused `sarvam-105b-conversations` model. Set the corresponding keys in `.env.local`. Get the NVIDIA key from [build.nvidia.com](https://build.nvidia.com) and the Sarvam key from the [Sarvam dashboard](https://dashboard.sarvam.ai/). Existing Sage providers remain selectable with `SAGE_PROVIDER` (`openrouter`, `ollama`, `replicate`, or local); see [SETUP_TTS.md](SETUP_TTS.md) for details.

Voice Chat asks for microphone permission only after you tap to speak. It sends a short recording to Gnani Prisma speech recognition, then sends the transcript to Sage and reads the answer through Gnani Timbre v2.5. The default response language follows the detected speech (including natural code-switching); the language selector can explicitly request one of the supported narration languages. Use **Interrupt & speak** to stop the current answer and start a new recording. See [SETUP_TTS.md](SETUP_TTS.md) for the Gnani speech-recognition limits and setup notes.

## Data

The repository-root `srimad_bhagavatam.json` is statically imported by the story and canto pages. The README's former `/data/` path was incorrect. Chapter verses are English meanings; narration translates those meanings into the chosen language. Sanskrit text is not sent to TTS.

## Build and deploy

```bash
pnpm build
```

Set the environment variables in your hosting provider. Narration audio and translations are cached under the server's temporary directory and may be cleared when an instance restarts. Browsers also cache audio locally.

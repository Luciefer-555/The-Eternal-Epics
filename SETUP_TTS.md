# Gnani AI narration setup

Narration uses Gnani AI Timbre v2.5 through the server-only `POST /api/narrate` route. The route translates English verse meanings through NVIDIA NIM by default, then requests WAV audio from Gnani. Sage Q&A also uses NVIDIA NIM by default. NVIDIA and Gnani credentials are only read in server routes; they are never exposed to browser code. Audio and translations are cached under the operating system temporary directory; browsers also cache audio in Cache Storage.

## Configure locally

Copy `.env.example` to `.env.local` and set:

```env
GNANI_API_KEY=your_gnani_api_key
NVIDIA_API_KEY=your_nvidia_api_key
SAGE_PROVIDER=nvidia
SAGE_MODEL=nvidia/nemotron-3-super-120b-a12b
TRANSLATE_MODEL=nvidia/nemotron-3-super-120b-a12b
```

Create an NVIDIA API key at [build.nvidia.com](https://build.nvidia.com). The key is sent only from the server to `https://integrate.api.nvidia.com/v1/chat/completions` as a Bearer token. `SAGE_MODEL` controls Q&A and `TRANSLATE_MODEL` controls narration translation. Both default to `nvidia/nemotron-3-super-120b-a12b`.

Existing providers remain available. For OpenRouter, set `SAGE_PROVIDER=openrouter`, `SAGE_API_KEY`, and optionally `SAGE_API_URL=https://openrouter.ai/api/v1`. For Ollama, set `SAGE_PROVIDER=ollama`, `SAGE_API_URL=http://localhost:11434`, and leave `SAGE_API_KEY` empty. Replicate and the local completion provider are also retained. The NVIDIA model runs with a limited reasoning budget for Q&A and thinking disabled for translation; only final message content is returned.

Install and start the app with pnpm:

```bash
pnpm install
pnpm dev
```

Open a story page, select one of Gnani's supported languages, and use Play, Pause, and Stop. Hindi is selected by default. Selecting a different language stops current playback; the preference is saved in localStorage.

## Gnani model and voices

The server sends `model: "timbre-v2.5"`, a language-specific v2.5 voice, an explicit `language`, speed `0.95`, and mono 48 kHz WAV settings. Defaults are Hindi Nalini, English Girish, Tamil Asmita, Telugu Suhana, Kannada Saanvi, Malayalam Reshma, Marathi Zahira, Punjabi Mehuli, Bengali Kirra, and Gujarati Falak.

Supported choices: Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Punjabi, Bengali, and Gujarati. See Gnani's [REST TTS guide](https://docs.gnani.ai/api/TTS/tts-inference), [voice catalog](https://docs.gnani.ai/api/TTS/available-voices), and [input formatting guide](https://docs.gnani.ai/api/TTS/tts-input-formating).

## NVIDIA model availability note

The NVIDIA catalog lists `nvidia/nemotron-3-super-120b-a12b` and its hosted NIM API reference. Its published language list does not explicitly include Hindi or Kannada, so translations should be reviewed for quality. The catalog also lists `sarvamai/sarvam-m`, which is designed for Indian-language tasks, but the Build model page currently marks its free endpoint as deprecated and lists only a partner endpoint as available. It is therefore not configured as the default for this NVIDIA API-key integration. No live Hindi/Kannada sample translations have been quality-checked without an NVIDIA API key.

## Test the endpoint

```bash
curl -X POST http://localhost:3000/api/narrate `
  -H "Content-Type: application/json" `
  -d '{"text":"The Lord is the well-wisher of all living beings.","lang":"hi-IN"}' `
  --output narration.wav
```

The response is a WAV binary. Errors are returned as JSON. The route rejects empty input, unsupported languages, and text longer than 5,000 characters. Each verse is normally sent in one request; unusually long verses are split at sentence boundaries in the browser.

The server cache uses the SHA-256 hash of language plus original text for both translation and audio. On Vercel, `/tmp` is ephemeral and may be reset between instances; browser Cache Storage provides a second cache in the same browser. There is no shared durable cache between separate server instances.

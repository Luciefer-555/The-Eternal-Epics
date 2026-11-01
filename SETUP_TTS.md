# Gnani AI narration setup

Narration uses Gnani AI Timbre v2.5 through the server-only `POST /api/narrate` route. The route translates English verse meanings through the configured Sage provider, then requests WAV audio from Gnani. Audio and translations are cached under the operating system temporary directory; browsers also cache audio in Cache Storage.

## Configure locally

Copy `.env.example` to `.env.local` and set:

```env
GNANI_API_KEY=your_gnani_api_key
SAGE_PROVIDER=openrouter
SAGE_API_KEY=your_sage_provider_api_key
SAGE_API_URL=https://openrouter.ai/api/v1
```

For Ollama, use `SAGE_PROVIDER=ollama`, set `SAGE_API_URL=http://localhost:11434`, and leave `SAGE_API_KEY` empty. The Sage configuration is used for both the `/ask` chat and verse translation.

Install and start the app with pnpm:

```bash
pnpm install
pnpm dev
```

Open a story page, select one of Gnani's supported languages, and use Play, Pause, and Stop. Hindi is selected by default. Selecting a different language stops current playback; the preference is saved in localStorage.

## Gnani model and voices

The server sends `model: "timbre-v2.5"`, a language-specific v2.5 voice, an explicit `language`, speed `0.95`, and mono 48 kHz WAV settings. Defaults are Hindi Nalini, English Girish, Tamil Asmita, Telugu Suhana, Kannada Saanvi, Malayalam Reshma, Marathi Zahira, Punjabi Mehuli, Bengali Kirra, and Gujarati Falak.

Supported choices: Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Punjabi, Bengali, and Gujarati. See Gnani's [REST TTS guide](https://docs.gnani.ai/api/TTS/tts-inference), [voice catalog](https://docs.gnani.ai/api/TTS/available-voices), and [input formatting guide](https://docs.gnani.ai/api/TTS/tts-input-formating).

## Test the endpoint

```bash
curl -X POST http://localhost:3000/api/narrate `
  -H "Content-Type: application/json" `
  -d '{"text":"The Lord is the well-wisher of all living beings.","lang":"hi-IN"}' `
  --output narration.wav
```

The response is a WAV binary. Errors are returned as JSON. The route rejects empty input, unsupported languages, and text longer than 5,000 characters. Each verse is normally sent in one request; unusually long verses are split at sentence boundaries in the browser.

The server cache uses the SHA-256 hash of language plus original text for both translation and audio. On Vercel, `/tmp` is ephemeral and may be reset between instances; browser Cache Storage provides a second cache in the same browser. There is no shared durable cache between separate server instances.

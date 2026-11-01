import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { type NextRequest, NextResponse } from "next/server"
import { generateSageText } from "@/lib/sage-provider"

export const runtime = "nodejs"

const TTS_URL = "https://api.vachana.ai/api/v1/tts/inference"
const MAX_TEXT_LENGTH = 5_000
const CACHE_DIR = path.join(tmpdir(), "eternal-epics-gnani-cache")
const SUPPORTED_LANGUAGES = {
  "hi-IN": { label: "Hindi", voice: "Nalini" },
  "en-IN": { label: "English", voice: "Girish" },
  "ta-IN": { label: "Tamil", voice: "Asmita" },
  "te-IN": { label: "Telugu", voice: "Suhana" },
  "kn-IN": { label: "Kannada", voice: "Saanvi" },
  "ml-IN": { label: "Malayalam", voice: "Reshma" },
  "mr-IN": { label: "Marathi", voice: "Zahira" },
  "pa-IN": { label: "Punjabi", voice: "Mehuli" },
  "bn-IN": { label: "Bengali", voice: "Kirra" },
  "gu-IN": { label: "Gujarati", voice: "Falak" },
} as const

const inFlight = new Map<string, Promise<Buffer>>()

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

function cacheKey(lang: string, text: string) {
  return createHash("sha256").update(`${lang}\0${text}`).digest("hex")
}

function responseFromAudio(audio: Buffer, cache: "HIT" | "MISS") {
  const bytes = audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength) as ArrayBuffer
  return new Response(bytes, { headers: { "Content-Type": "audio/wav", "Cache-Control": "private, max-age=31536000", "X-Audio-Cache": cache } })
}

async function cachedAudio(key: string) {
  try {
    return await readFile(path.join(CACHE_DIR, `${key}.wav`))
  } catch {
    return null
  }
}

async function translate(text: string, lang: keyof typeof SUPPORTED_LANGUAGES) {
  const language = SUPPORTED_LANGUAGES[lang].label
  return generateSageText(
    [
      {
        role: "user",
        content: `Translate the following Śrīmad Bhāgavatam verse meaning into ${language} for reverent narration aloud. Preserve every idea and devotional meaning faithfully; do not add commentary or omit details. Render all numbers, verse references, and numeric expressions as spoken words in ${language}. Keep sacred names respectful and natural. Return plain text only, with no heading, quotes, markdown, or explanation.\n\n${text}`,
      },
    ],
    "Faithful, reverent translation for spoken narration. Plain text only.",
    { temperature: 1, maxTokens: 900, purpose: "translation" },
  )
}

async function generateAudio(key: string, text: string, lang: keyof typeof SUPPORTED_LANGUAGES) {
  const cached = await cachedAudio(key)
  if (cached) return cached

  const pending = inFlight.get(key)
  if (pending) return pending

  const generation = (async () => {
    const apiKey = process.env.GNANI_API_KEY
    if (!apiKey) throw new Error("Narration is not configured yet. Please try again later.")

    await mkdir(CACHE_DIR, { recursive: true })
    const response = await fetch(TTS_URL, {
      method: "POST",
      headers: { "X-API-Key-ID": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice: SUPPORTED_LANGUAGES[lang].voice,
        model: "timbre-v2.5",
        language: lang,
        speed: 0.95,
        audio_config: {
          sample_rate: 48000,
          num_channels: 1,
          sample_width: 2,
          encoding: "linear_pcm",
          container: "wav",
        },
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("Gnani TTS request failed", { status: response.status, detail: detail.slice(0, 500) })
      throw new Error("Gnani could not create audio for this verse.")
    }

    const audio = Buffer.from(await response.arrayBuffer())
    if (audio.length === 0) throw new Error("Gnani returned an empty audio file.")
    await writeFile(path.join(CACHE_DIR, `${key}.wav`), audio).catch(() => undefined)
    return audio
  })()

  inFlight.set(key, generation)
  try {
    return await generation
  } finally {
    inFlight.delete(key)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== "object") return errorResponse("A JSON request body is required.", 400)

    const { text, lang, translated } = body as { text?: unknown; lang?: unknown; translated?: unknown }
    if (typeof text !== "string" || !text.trim()) return errorResponse("Text is required.", 400)
    if (text.length > MAX_TEXT_LENGTH) return errorResponse(`Text must be ${MAX_TEXT_LENGTH} characters or fewer.`, 400)
    if (typeof lang !== "string" || !Object.hasOwn(SUPPORTED_LANGUAGES, lang)) {
      return errorResponse("Choose a Gnani-supported language.", 400)
    }
    if (translated !== undefined && typeof translated !== "boolean") {
      return errorResponse("The translated field must be a boolean.", 400)
    }

    const language = lang as keyof typeof SUPPORTED_LANGUAGES
    const key = cacheKey(language, text.trim())
    const hit = await cachedAudio(key)
    if (hit) return responseFromAudio(hit, "HIT")

    let narrationText = text.trim()
    if (translated !== true && language !== "en-IN") {
      const translationPath = path.join(CACHE_DIR, `${key}.txt`)
      try {
        narrationText = await readFile(translationPath, "utf8")
      } catch {
        narrationText = (await translate(narrationText, language)).trim()
        if (!narrationText) return errorResponse("The translation service returned no narration text.", 502)
        await mkdir(CACHE_DIR, { recursive: true })
        await writeFile(translationPath, narrationText, "utf8").catch(() => undefined)
      }
    }

    const audio = await generateAudio(key, narrationText, language)
    return responseFromAudio(audio, "MISS")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Narration could not be generated."
    const status = message.includes("not configured") ? 503 : 502
    console.error("Narration request failed", error)
    return errorResponse(message, status)
  }
}

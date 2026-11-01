import { NextResponse, type NextRequest } from "next/server"

export const runtime = "nodejs"

const STT_URL = "https://api.vachana.ai/stt/v3"
const MAX_UPLOAD_BYTES = 2_000_000

export async function POST(request: NextRequest) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "A multipart voice recording is required." }, { status: 400 })
  }

  const audio = form.get("audio")
  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "Record a short voice message first." }, { status: 400 })
  }
  if (audio.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "That recording is too large. Please keep voice messages under 30 seconds." }, { status: 413 })
  }

  const apiKey = process.env.GNANI_API_KEY
  if (!apiKey) return NextResponse.json({ error: "Voice recognition is not configured." }, { status: 503 })

  try {
    const upstreamForm = new FormData()
    upstreamForm.append("audio_file", audio, "voice-message.wav")
    upstreamForm.append("model", "prisma-v3.0")
    upstreamForm.append("language_code", "indic-auto")
    upstreamForm.append("format", "verbatim")

    const response = await fetch(STT_URL, {
      method: "POST",
      headers: { "X-API-Key-ID": apiKey },
      body: upstreamForm,
      signal: AbortSignal.timeout(20_000),
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.error("Gnani speech recognition failed", { status: response.status, detail: detail.slice(0, 300) })
      return NextResponse.json({ error: "I could not understand that recording. Please try again." }, { status: response.status === 504 ? 504 : 502 })
    }

    const data = await response.json()
    if (typeof data.transcript !== "string" || !data.transcript.trim()) {
      return NextResponse.json({ error: "I didn't hear any words. Please try again." }, { status: 422 })
    }
    return NextResponse.json({
      transcript: data.transcript.trim().slice(0, 4_000),
      language: typeof data.detected_language_code === "string" ? data.detected_language_code : null,
    })
  } catch (error) {
    const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
    console.error("Voice transcription request failed", error)
    return NextResponse.json({ error: timeout ? "Speech recognition took too long. Please try a shorter message." : "Voice recognition is temporarily unavailable." }, { status: timeout ? 504 : 502 })
  }
}

import { NextResponse, type NextRequest } from "next/server"
import { generateSageText } from "@/lib/sage-provider"
import { translateVoiceAnswer } from "@/lib/voice-translation"

const SUPPORTED_LANGUAGES: Record<string, string> = {
  "hi-IN": "Hindi", "en-IN": "English", "ta-IN": "Tamil", "te-IN": "Telugu", "kn-IN": "Kannada",
  "ml-IN": "Malayalam", "mr-IN": "Marathi", "pa-IN": "Punjabi", "bn-IN": "Bengali", "gu-IN": "Gujarati",
}

type Message = { role: "user" | "assistant"; content: string }

const LANGUAGE_REQUESTS: Array<{ code: string; names: string[] }> = [
  { code: "hi-IN", names: ["hindi", "हिंदी", "हिन्दी"] },
  { code: "en-IN", names: ["english", "अंग्रेज़ी"] },
  { code: "ta-IN", names: ["tamil", "தமிழ்"] },
  { code: "te-IN", names: ["telugu", "తెలుగు"] },
  { code: "kn-IN", names: ["kannada", "ಕನ್ನಡ"] },
  { code: "ml-IN", names: ["malayalam", "മലയാളം"] },
  { code: "mr-IN", names: ["marathi", "मराठी"] },
  { code: "pa-IN", names: ["punjabi", "ਪੰਜਾਬੀ", "ਪੰਜਾਬੀ"] },
  { code: "bn-IN", names: ["bengali", "বাংলা", "বাঙালি"] },
  { code: "gu-IN", names: ["gujarati", "ગુજરાતી"] },
]

function getExplicitLanguageRequest(text: string) {
  const normalized = text.toLocaleLowerCase()
  const asksForLanguage = /\b(in|using|speak|answer|reply|respond|switch to)\b|में|भाषा|ಮಾತನಾಡಿ|ಭಾಷೆಯಲ್ಲಿ|மொழியில்|பேசு|భాషలో|మాట్లాడు|ഭാഷയിൽ|സംസാരിക്കുക|भाषेत|बोला|ਵਿੱਚ|ਬੋਲੋ|ভাষায়|বলুন|ભાષામાં|બોલો/i.test(normalized)
  if (!asksForLanguage) return null
  return LANGUAGE_REQUESTS.find(({ names }) => names.some((name) => normalized.includes(name)))?.code || null
}

function inferScriptLanguage(text: string) {
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN"
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN"
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN"
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml-IN"
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu-IN"
  if (/[\u0980-\u09FF]/.test(text)) return "bn-IN"
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa-IN"
  if (/[\u0900-\u097F]/.test(text)) return /मराठी|मराठीत|marathi/i.test(text) ? "mr-IN" : "hi-IN"
  if (/[A-Za-z]/.test(text)) return "en-IN"
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== "object") return NextResponse.json({ error: "A message is required." }, { status: 400 })
    const { messages, detectedLanguage, preferredLanguage } = body as {
      messages?: unknown
      detectedLanguage?: unknown
      preferredLanguage?: unknown
    }
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return NextResponse.json({ error: "Send up to 12 recent messages." }, { status: 400 })
    }
    const safeMessages: Message[] = []
    for (const message of messages) {
      if (!message || typeof message !== "object") return NextResponse.json({ error: "Messages are invalid." }, { status: 400 })
      const item = message as Record<string, unknown>
      if ((item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string" || !item.content.trim() || item.content.length > 4_000) {
        return NextResponse.json({ error: "Messages are invalid." }, { status: 400 })
      }
      safeMessages.push({ role: item.role, content: item.content.trim() })
    }

    const detected = typeof detectedLanguage === "string" && SUPPORTED_LANGUAGES[detectedLanguage] ? detectedLanguage : null
    const preferred = typeof preferredLanguage === "string" && SUPPORTED_LANGUAGES[preferredLanguage] ? preferredLanguage : null
    const latestUserText = [...safeMessages].reverse().find((message) => message.role === "user")?.content || ""
    const outputLanguage = preferred || getExplicitLanguageRequest(latestUserText) || detected || inferScriptLanguage(latestUserText)
    const languageInstruction = outputLanguage && outputLanguage !== "en-IN"
      ? `Draft a concise, accurate English answer to the user's latest message for translation into ${SUPPORTED_LANGUAGES[outputLanguage]}. Do not discuss language selection or your drafting process. Write numbers and verse references as spoken words.`
      : "Answer the user's latest message in concise, natural English. Do not discuss language selection or your drafting process. Write numbers and verse references as spoken words."

    const draft = await generateSageText(safeMessages, languageInstruction, { purpose: "qa", maxTokens: 1_000, reasoningBudget: 256 })
    const language = outputLanguage || "en-IN"
    const latestUserMessage = [...safeMessages].reverse().find((message) => message.role === "user")?.content || ""
    const response = await translateVoiceAnswer(draft, language, latestUserMessage)
    return NextResponse.json({ response, language })
  } catch (error) {
    console.error("Voice chat response failed", error)
    const message = error instanceof Error ? error.message : "Sage could not complete this response."
    const status = /timed out/i.test(message) ? 504 : /not configured/i.test(message) ? 503 : 502
    return NextResponse.json({ error: message }, { status })
  }
}

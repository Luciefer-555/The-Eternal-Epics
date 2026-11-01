import { generateSageText } from "@/lib/sage-provider"

const SARVAM_CHAT_URL = "https://api.sarvam.ai/v1/chat/completions"
const LANGUAGES: Record<string, { name: string; script: RegExp }> = {
  "hi-IN": { name: "Hindi", script: /[\u0900-\u097F]/ },
  "en-IN": { name: "English", script: /[A-Za-z]/ },
  "ta-IN": { name: "Tamil", script: /[\u0B80-\u0BFF]/ },
  "te-IN": { name: "Telugu", script: /[\u0C00-\u0C7F]/ },
  "kn-IN": { name: "Kannada", script: /[\u0C80-\u0CFF]/ },
  "ml-IN": { name: "Malayalam", script: /[\u0D00-\u0D7F]/ },
  "mr-IN": { name: "Marathi", script: /[\u0900-\u097F]/ },
  "pa-IN": { name: "Punjabi", script: /[\u0A00-\u0A7F]/ },
  "bn-IN": { name: "Bengali", script: /[\u0980-\u09FF]/ },
  "gu-IN": { name: "Gujarati", script: /[\u0A80-\u0AFF]/ },
}

function promptFor(language: string, userText: string) {
  const details = LANGUAGES[language]
  if (!details) throw new Error("The requested spoken language is not supported.")
  const hasIndicAndEnglish = /[\u0900-\u0D7F]/.test(userText) && /[A-Za-z]/.test(userText)
  return `Translate the assistant's final answer into natural, fluent ${details.name} for a spoken devotional chat. The user's latest message was: ${userText}\n\nUse ${details.name} as the main language${hasIndicAndEnglish ? ", preserving the user's natural Indic-English code-switching" : "; do not leave English sentences untranslated"}. Preserve the meaning, sacred names, and any factual details. Remove drafting notes, self-corrections, instructions to the model, or commentary about choosing a language. Write numbers as spoken words. Return only the final spoken answer in ${details.name}, with no headings or explanation.`
}

function cleanText(value: unknown) {
  return typeof value === "string"
    ? value.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<think>[\s\S]*$/gi, "").trim()
    : ""
}

export async function translateVoiceAnswer(answer: string, language: string, userText: string) {
  if (language === "en-IN") return answer
  const system = promptFor(language, userText)
  const provider = process.env.TRANSLATE_PROVIDER || "sarvam"
  let translated: string

  if (provider === "sarvam") {
    const apiKey = process.env.SARVAM_API_KEY
    if (!apiKey) throw new Error("SARVAM_API_KEY is not configured for multilingual voice chat.")
    const response = await fetch(SARVAM_CHAT_URL, {
      method: "POST",
      headers: { "api-subscription-key": apiKey, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        model: process.env.TRANSLATE_MODEL || "sarvam-105b-conversations",
        max_tokens: 700,
        temperature: 0.2,
        reasoning_effort: "low",
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: answer },
        ],
      }),
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.error("Voice answer translation failed", { status: response.status, detail: detail.slice(0, 300) })
      throw new Error("I could not prepare the reply in the requested language. Please try again.")
    }
    const data = await response.json()
    translated = cleanText(data.choices?.[0]?.message?.content)
  } else {
    translated = cleanText(await generateSageText(
      [{ role: "user", content: answer }],
      system,
      { purpose: "translation", provider, maxTokens: 700, temperature: 0.2 },
    ))
  }

  if (!translated) throw new Error("The translation service returned no spoken reply.")
  if (!LANGUAGES[language].script.test(translated)) {
    throw new Error(`The translation service did not return a ${LANGUAGES[language].name} reply. Please try again.`)
  }
  return translated
}

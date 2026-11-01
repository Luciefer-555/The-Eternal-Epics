type SageMessage = { role: "user" | "assistant"; content: string }
type SagePurpose = "qa" | "translation"

const SAGE_SYSTEM_PROMPT = `You are the Sage, a keeper of the divine wisdom of the Srimad Bhagavatam. You respond in a calm, devotional tone with references to scripture and verses when appropriate. Format your responses in clear, thoughtful paragraphs. When citing verses, include the canto and chapter. Guide seekers on the path of righteousness (dharma) and spiritual knowledge.`
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b"

function cleanFinalText(value: unknown) {
  if (typeof value !== "string") return ""
  return value.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<think>[\s\S]*$/gi, "").trim()
}

export async function generateSageText(
  messages: SageMessage[],
  context?: string,
  options: { provider?: string; temperature?: number; maxTokens?: number; reasoningBudget?: number; purpose?: SagePurpose; model?: string } = {},
) {
  const purpose = options.purpose || "qa"
  const provider = options.provider || (purpose === "translation" ? process.env.TRANSLATE_PROVIDER : undefined) || process.env.SAGE_PROVIDER || "nvidia"
  const apiKey = process.env.SAGE_API_KEY
  const apiUrl = process.env.SAGE_API_URL
  const temperature = options.temperature ?? 0.7
  const maxTokens = options.maxTokens ?? 500
  const system = purpose === "translation"
    ? (context || "Translate faithfully and return plain text only.")
    : `${SAGE_SYSTEM_PROMPT}${context ? `\n\nContext: ${context}` : ""}`
  const requestMessages = [{ role: "system", content: system }, ...messages]
  let response: Response

  if (provider === "nvidia") {
    const nvidiaKey = process.env.NVIDIA_API_KEY
    if (!nvidiaKey) throw new Error("NVIDIA_API_KEY is not configured.")
    const model = options.model || (purpose === "translation"
      ? process.env.TRANSLATE_MODEL || "google/gemma-4-31b-it"
      : process.env.SAGE_MODEL || DEFAULT_NVIDIA_MODEL)
    const isTranslation = purpose === "translation"
    const isRivaTranslation = model === "nvidia/riva-translate-4b-instruct-v2"
    try {
      response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${nvidiaKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(isTranslation ? 60_000 : 35_000),
        body: JSON.stringify({
          model,
          messages: requestMessages,
          temperature: isTranslation ? 0.2 : 1,
          ...(isRivaTranslation ? {} : { top_p: isTranslation ? 0.8 : 0.95 }),
          max_tokens: isTranslation ? 300 : options.maxTokens ?? 1400,
          ...(isRivaTranslation
            ? {}
            : isTranslation
              ? { chat_template_kwargs: { enable_thinking: false } }
              : { chat_template_kwargs: { enable_thinking: true, low_effort: true }, reasoning_budget: options.reasoningBudget ?? 512 }),
          stream: false,
        }),
      })
    } catch (error) {
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
        throw new Error("Sage request timed out. Please try again.")
      }
      throw new Error("Sage could not reach NVIDIA NIM. Please try again.")
    }
  } else if (provider !== "ollama" && !apiKey) {
    throw new Error("Sage provider API key is not configured.")
  } else if (provider === "openrouter") {
    response = await fetch(`${apiUrl || "https://openrouter.ai/api/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://srimad-bhagavatam.app",
        "X-Title": "Srimad Bhagavatam - The Living Chronicle",
      },
      body: JSON.stringify({ model: "meta-llama/llama-2-7b-chat", messages: requestMessages, temperature, top_p: 0.9, max_tokens: maxTokens }),
    })
  } else if (provider === "ollama") {
    response = await fetch(`${apiUrl || "http://localhost:11434"}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama2-mini:3b", messages: requestMessages, options: { temperature }, stream: false }),
    })
  } else if (provider === "replicate") {
    response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        version: "e951f18578850b652510200860fc4ea62b3b16fac280f83ff32282f87bbd2e48",
        input: { prompt: `${system}\n\n${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}\n\nSage:`, max_length: maxTokens, temperature },
      }),
    })
  } else {
    response = await fetch(`${apiUrl || "http://localhost:8000"}/completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${system}\n\n${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}`, max_tokens: maxTokens, temperature }),
    })
  }

  if (!response.ok) {
    if (response.status === 408 || response.status === 504) throw new Error("Sage request timed out. Please try again.")
    const detail = await response.text().catch(() => "")
    console.error("Sage provider request failed", { provider, status: response.status, detail: detail.slice(0, 300) })
    throw new Error("Sage could not complete this request. Please try again.")
  }
  const data = await response.json()
  const output = provider === "nvidia"
    ? data.choices?.[0]?.message?.content
    : data.message?.content || data.content || data.choices?.[0]?.message?.content || data.output?.join("") || data.text
  const finalText = cleanFinalText(output)
  if (!finalText) throw new Error("Sage returned no final response.")
  return finalText
}

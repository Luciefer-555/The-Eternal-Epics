type SageMessage = { role: "user" | "assistant"; content: string }

const SAGE_SYSTEM_PROMPT = `You are the Sage, a keeper of the divine wisdom of the Srimad Bhagavatam. You respond in a calm, devotional tone with references to scripture and verses when appropriate. Format your responses in clear, thoughtful paragraphs. When citing verses, include the canto and chapter. Guide seekers on the path of righteousness (dharma) and spiritual knowledge.`

export async function generateSageText(
  messages: SageMessage[],
  context?: string,
  options: { provider?: string; temperature?: number; maxTokens?: number } = {},
) {
  const provider = options.provider || process.env.SAGE_PROVIDER || "openrouter"
  const apiKey = process.env.SAGE_API_KEY
  const apiUrl = process.env.SAGE_API_URL
  const temperature = options.temperature ?? 0.7
  const maxTokens = options.maxTokens ?? 500
  if (provider !== "ollama" && !apiKey) throw new Error("Sage translation is not configured yet.")

  const system = `${SAGE_SYSTEM_PROMPT}${context ? `\n\nContext: ${context}` : ""}`
  let response: Response

  if (provider === "openrouter") {
    response = await fetch(`${apiUrl || "https://openrouter.ai/api/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://srimad-bhagavatam.app",
        "X-Title": "Srimad Bhagavatam - The Living Chronicle",
      },
      body: JSON.stringify({ model: "meta-llama/llama-2-7b-chat", messages: [{ role: "system", content: system }, ...messages], temperature, top_p: 0.9, max_tokens: maxTokens }),
    })
  } else if (provider === "ollama") {
    response = await fetch(`${apiUrl || "http://localhost:11434"}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama2-mini:3b", messages: [{ role: "system", content: system }, ...messages], options: { temperature }, stream: false }),
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

  if (!response.ok) throw new Error("Sage could not translate this verse.")
  const data = await response.json()
  const output = data.message?.content || data.content || data.choices?.[0]?.message?.content || data.output?.join("") || data.text
  if (typeof output !== "string" || !output.trim()) throw new Error("Sage returned no translation.")
  return output.trim()
}

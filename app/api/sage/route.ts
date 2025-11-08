import { type NextRequest, NextResponse } from "next/server"

// Sage AI endpoint - supports multiple LLM providers
// Providers: openrouter, ollama, replicate, local

const SAGE_SYSTEM_PROMPT = `You are the Sage, a keeper of the divine wisdom of the Srimad Bhagavatam. 
You respond in a calm, devotional tone with references to scripture and verses when appropriate.
Format your responses in clear, thoughtful paragraphs. When citing verses, include the canto and chapter.
Guide seekers on the path of righteousness (dharma) and spiritual knowledge.`

export async function POST(request: NextRequest) {
  try {
    const { messages, provider, context } = await request.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    const sageProvider = provider || process.env.SAGE_PROVIDER || "openrouter"
    const apiKey = process.env.SAGE_API_KEY
    const apiUrl = process.env.SAGE_API_URL

    if (!apiKey) {
      return NextResponse.json({ error: "SAGE_API_KEY not configured" }, { status: 500 })
    }

    let response: Response

    if (sageProvider === "openrouter") {
      response = await callOpenRouter(messages, apiKey, apiUrl, context)
    } else if (sageProvider === "ollama") {
      response = await callOllama(messages, apiUrl || "http://localhost:11434", context)
    } else if (sageProvider === "replicate") {
      response = await callReplicate(messages, apiKey, context)
    } else {
      response = await callLocal(messages, apiUrl || "http://localhost:8000", context)
    }

    if (!response.ok) {
      const error = await response.text()
      console.error("Sage provider error:", error)
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      response: data.content || data.choices?.[0]?.message?.content || data.text || "Unable to parse response",
    })
  } catch (error) {
    console.error("Sage error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function callOpenRouter(
  messages: any[],
  apiKey: string,
  apiUrl: string | undefined,
  context: string | undefined,
) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://srimad-bhagavatam.app",
      "X-Title": "Srimad Bhagavatam - The Living Chronicle",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-2-7b-chat",
      messages: [
        { role: "system", content: SAGE_SYSTEM_PROMPT + (context ? `\n\nContext: ${context}` : "") },
        ...messages,
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 500,
    }),
  })
  return response
}

async function callOllama(messages: any[], apiUrl: string, context: string | undefined) {
  const response = await fetch(`${apiUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama2-mini:3b",
      messages: [
        { role: "system", content: SAGE_SYSTEM_PROMPT + (context ? `\n\nContext: ${context}` : "") },
        ...messages,
      ],
      stream: false,
    }),
  })
  return response
}

async function callReplicate(messages: any[], apiKey: string, context: string | undefined) {
  const userMessage = messages[messages.length - 1]?.content || ""

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "e951f18578850b652510200860fc4ea62b3b16fac280f83ff32282f87bbd2e48",
      input: {
        prompt: `${SAGE_SYSTEM_PROMPT}${context ? `\n\nContext: ${context}` : ""}\n\nUser: ${userMessage}\n\nSage:`,
        max_length: 500,
        temperature: 0.7,
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Replicate request failed")
  }

  const data = await response.json()
  return new Response(
    JSON.stringify({
      choices: [{ message: { content: data.output?.join("") || "" } }],
    }),
    { headers: { "Content-Type": "application/json" } },
  )
}

async function callLocal(messages: any[], apiUrl: string, context: string | undefined) {
  const response = await fetch(`${apiUrl}/completion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `${SAGE_SYSTEM_PROMPT}${context ? `\n\nContext: ${context}` : ""}\n\n${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n")}`,
      max_tokens: 500,
      temperature: 0.7,
    }),
  })
  return response
}

import { type NextRequest, NextResponse } from "next/server"
import { generateSageText } from "@/lib/sage-provider"

export async function POST(request: NextRequest) {
  try {
    const { messages, context, provider } = await request.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    const response = await generateSageText(messages, typeof context === "string" ? context : undefined, {
      provider: typeof provider === "string" ? provider : undefined,
      purpose: "qa",
    })
    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error("Sage error:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    const status = /timed out/i.test(message) ? 504 : /not configured/i.test(message) ? 503 : 502
    return NextResponse.json({ error: message }, { status })
  }
}

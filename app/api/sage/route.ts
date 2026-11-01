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
    })
    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error("Sage error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 })
  }
}

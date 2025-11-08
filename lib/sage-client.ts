export async function askSage(messages: Array<{ role: "user" | "sage"; content: string }>, context?: string) {
  try {
    const response = await fetch("/api/sage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role === "sage" ? "assistant" : "user",
          content: m.content,
        })),
        context,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get response from Sage")
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error asking Sage:", error)
    throw error
  }
}

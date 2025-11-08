import { type NextRequest, NextResponse } from "next/server"

// Hume AI Text-to-Speech API integration
// Documentation: https://dev.hume.ai/reference/text-to-speech-tts/synthesize-json

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "serene_monk" } = await request.json()

    console.log("[TTS] Request received:", { textLength: text?.length, voice })

    if (!text) {
      console.error("[TTS] No text provided")
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const humeApiKey = process.env.HUME_API_KEY
    if (!humeApiKey) {
      console.error("[TTS] HUME_API_KEY not found in environment variables")
      return NextResponse.json({ 
        error: "HUME_API_KEY not configured. Please add it to .env.local" 
      }, { status: 500 })
    }

    console.log("[TTS] API Key found:", humeApiKey.substring(0, 10) + "...")

    // Voice descriptions for Hume TTS
    const voiceDescriptions: Record<string, string> = {
      serene_monk: "A calm, meditative voice with a gentle and peaceful tone, speaking slowly with clarity and warmth",
      bhakti_narrator: "A devotional, warm voice with reverence and emotional depth, conveying spiritual wisdom",
      epic_storyteller: "A grand, dramatic voice with authority and gravitas, perfect for epic narratives",
    }

    const selectedVoiceDesc = voiceDescriptions[voice] || voiceDescriptions["serene_monk"]
    console.log("[TTS] Using voice description:", selectedVoiceDesc.substring(0, 50) + "...")

    // Truncate text if too long (Hume has limits)
    const maxLength = 3000
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text

    const requestBody = {
      utterances: [
        {
          text: truncatedText,
          description: selectedVoiceDesc,
        },
      ],
      format: {
        type: "mp3",
      },
      num_generations: 1,
    }

    console.log("[TTS] Calling Hume API...")

    const response = await fetch("https://api.hume.ai/v0/tts", {
      method: "POST",
      headers: {
        "X-Hume-Api-Key": humeApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[TTS] Hume API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[TTS] Hume API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      return NextResponse.json({ 
        error: `Hume API error: ${response.status} - ${errorText}` 
      }, { status: 500 })
    }

    const data = await response.json()
    console.log("[TTS] Hume response structure:", {
      hasGenerations: !!data.generations,
      generationsLength: data.generations?.length,
      firstGeneration: data.generations?.[0] ? Object.keys(data.generations[0]) : null,
    })

    // Extract audio from first generation
    if (data.generations && data.generations.length > 0) {
      const generation = data.generations[0]
      // Audio is directly in generation.audio
      const audio = generation.audio

      console.log("[TTS] Audio extraction:", {
        hasAudio: !!audio,
        audioLength: audio?.length,
        generationKeys: Object.keys(generation),
      })

      if (audio) {
        console.log("[TTS] Success! Audio generated")
        return NextResponse.json({
          success: true,
          audioUrl: `data:audio/mp3;base64,${audio}`,
          voice: voice,
        })
      }
    }

    console.error("[TTS] No audio in response:", JSON.stringify(data, null, 2))
    return NextResponse.json({ error: "No audio generated in response" }, { status: 500 })
  } catch (error) {
    console.error("[TTS] Unexpected error:", error)
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 })
  }
}

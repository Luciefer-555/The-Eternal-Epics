import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { VoiceChat } from "@/components/voice-chat"

export const metadata: Metadata = {
  title: "Voice Chat with the Sage | The Eternal Epics",
  description: "Speak with the Sage using Gnani speech recognition and narration.",
}

export default function VoiceChatPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-6">
        <VoiceChat />
      </main>
    </>
  )
}

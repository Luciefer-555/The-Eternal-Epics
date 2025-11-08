"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AudioPlayer } from "@/components/audio-player"
import { VoiceSelector } from "@/components/voice-selector"

type Voice = "serene_monk" | "bhakti_narrator" | "epic_storyteller"

interface StoryClientProps {
  story: {
    title: string
    verses: string[]
  }
  selectedVoice: Voice
}

export function StoryClient({ story, selectedVoice: initialVoice }: StoryClientProps) {
  const [selectedVoice, setSelectedVoice] = useState<Voice>(initialVoice)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)

  const allText = story.verses.join(" ")

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <button
          onClick={() => setShowAudioPlayer(!showAudioPlayer)}
          className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition font-semibold text-sm"
        >
          {showAudioPlayer ? "Hide Narration" : "Listen to Chapter"}
        </button>
      </motion.div>

      {showAudioPlayer && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-3">
          <VoiceSelector onSelectVoice={setSelectedVoice} selectedVoice={selectedVoice} />
          <AudioPlayer
            text={allText}
            title={story.title}
            voice={selectedVoice}
            onClose={() => setShowAudioPlayer(false)}
          />
        </motion.div>
      )}
    </>
  )
}

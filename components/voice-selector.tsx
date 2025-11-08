"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface VoiceSelectorProps {
  onSelectVoice: (voice: "serene_monk" | "bhakti_narrator" | "epic_storyteller") => void
  selectedVoice?: string
}

const VOICES = [
  { id: "serene_monk", name: "Serene Monk", description: "Calm, meditative, peaceful" },
  { id: "bhakti_narrator", name: "Bhakti Narrator", description: "Devotional, warm, reverent" },
  { id: "epic_storyteller", name: "Epic Storyteller", description: "Grand, dramatic, authoritative" },
] as const

export function VoiceSelector({ onSelectVoice, selectedVoice = "serene_monk" }: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selected = VOICES.find((v) => v.id === selectedVoice) || VOICES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground hover:border-accent transition"
      >
        <div className="text-left">
          <p className="font-semibold text-xs text-muted-foreground">Voice</p>
          <p className="text-sm">{selected.name}</p>
        </div>
        <ChevronDown size={16} className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-border rounded-lg bg-card shadow-lg z-10">
          {VOICES.map((voice) => (
            <button
              key={voice.id}
              onClick={() => {
                onSelectVoice(voice.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-3 py-2 border-b border-border last:border-b-0 hover:bg-muted transition ${
                selectedVoice === voice.id ? "bg-muted border-l-2 border-l-accent" : ""
              }`}
            >
              <p className="font-semibold text-sm text-foreground">{voice.name}</p>
              <p className="text-xs text-muted-foreground">{voice.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

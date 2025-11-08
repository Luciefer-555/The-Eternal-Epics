"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, X } from "lucide-react"

interface AudioPlayerProps {
  text: string
  title?: string
  voice?: "serene_monk" | "bhakti_narrator" | "epic_storyteller"
  onClose?: () => void
}

export function AudioPlayer({ text, title, voice = "serene_monk", onClose }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const generateAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    if (audioRef.current?.src) {
      audioRef.current.play()
      setIsPlaying(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("[AudioPlayer] Requesting narration...", { voice, textLength: text.length })
      
      const response = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      })

      const data = await response.json()
      console.log("[AudioPlayer] API response:", { ok: response.ok, data })

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate audio")
      }

      if (audioRef.current && data.audioUrl) {
        audioRef.current.src = data.audioUrl
        await audioRef.current.play()
        setIsPlaying(true)
        console.log("[AudioPlayer] Audio playing successfully")
      } else {
        throw new Error("No audio URL in response")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "TTS unavailable — try again"
      setError(errorMessage)
      console.error("[AudioPlayer] Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="border border-border rounded-lg p-4 bg-card gold-glow space-y-3"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="text-accent" size={18} />
          <div>
            <p className="text-sm font-semibold text-foreground">{title || "Narration"}</p>
            <p className="text-xs text-muted-foreground">Voice: {voice.replace(/_/g, " ")}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Play Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={generateAudio}
          disabled={isLoading}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-accent text-accent-foreground rounded-full hover:shadow-lg hover:shadow-accent/30 transition disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      {/* Loading Animation */}
      {isPlaying && (
        <div className="flex gap-1 items-center justify-start">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 0.6, delay: i * 0.1, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-3 bg-accent rounded-full"
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

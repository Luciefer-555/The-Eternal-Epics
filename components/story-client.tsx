"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Pause, Play, Square, Volume2 } from "lucide-react"
import { toast } from "sonner"

const LANGUAGES = [
  ["hi-IN", "Hindi"], ["en-IN", "English"], ["ta-IN", "Tamil"], ["te-IN", "Telugu"],
  ["kn-IN", "Kannada"], ["ml-IN", "Malayalam"], ["mr-IN", "Marathi"], ["pa-IN", "Punjabi"],
  ["bn-IN", "Bengali"], ["gu-IN", "Gujarati"],
] as const
const LANGUAGE_STORAGE_KEY = "eternal-epics-narration-language"
const MAX_CHUNK_LENGTH = 4_500

interface StoryClientProps {
  story: { title: string; verses: string[] }
  onCurrentVerseChange?: (index: number | null) => void
}

function splitVerse(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [text]
  const chunks: string[] = []
  for (const sentence of sentences) {
    if (sentence.length <= MAX_CHUNK_LENGTH) {
      chunks.push(sentence)
      continue
    }
    let remainder = sentence
    while (remainder.length > MAX_CHUNK_LENGTH) {
      let splitAt = remainder.lastIndexOf(" ", MAX_CHUNK_LENGTH)
      if (splitAt < MAX_CHUNK_LENGTH * 0.6) splitAt = MAX_CHUNK_LENGTH
      chunks.push(remainder.slice(0, splitAt).trim())
      remainder = remainder.slice(splitAt).trim()
    }
    if (remainder) chunks.push(remainder)
  }
  return chunks
}

async function digest(text: string, lang: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${lang}\0${text}`))
  return [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("")
}

async function getAudio(text: string, lang: string) {
  const key = await digest(text, lang)
  const cacheUrl = new URL(`/api/narrate?cache=${key}`, window.location.origin).toString()
  const cacheRequest = new Request(cacheUrl)
  const audioCache = "caches" in window ? await window.caches.open("eternal-epics-narration-v2") : null
  const cached = audioCache ? await audioCache.match(cacheRequest) : undefined
  if (cached) return cached.blob()

  const response = await fetch("/api/narrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang, translated: false }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(typeof data?.error === "string" ? data.error : "This verse could not be prepared for narration.")
  }
  const audio = await response.blob()
  if (audioCache) await audioCache.put(cacheRequest, new Response(audio, { headers: { "Content-Type": "audio/wav" } }))
  return audio
}

export function StoryClient({ story, onCurrentVerseChange }: StoryClientProps) {
  const [language, setLanguage] = useState("hi-IN")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const runRef = useRef(0)
  const audioUrlRef = useRef<string | null>(null)
  const languageRef = useRef(language)

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (saved && LANGUAGES.some(([code]) => code === saved)) setLanguage(saved)
  }, [])

  useEffect(() => { languageRef.current = language }, [language])

  const stop = useCallback(() => {
    runRef.current += 1
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.onended = null
      audio.onerror = null
      audio.removeAttribute("src")
      audio.load()
    }
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    audioUrlRef.current = null
    setIsPlaying(false)
    setIsLoading(false)
    onCurrentVerseChange?.(null)
  }, [onCurrentVerseChange])

  const playVerse = useCallback(async (verseIndex: number, chunkIndex: number, run: number) => {
    if (run !== runRef.current || verseIndex >= story.verses.length) {
      if (run === runRef.current) {
        const audio = audioRef.current
        if (audio) {
          audio.pause()
          audio.removeAttribute("src")
          audio.load()
        }
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
        setIsPlaying(false)
        setIsLoading(false)
        onCurrentVerseChange?.(null)
      }
      return
    }

    onCurrentVerseChange?.(verseIndex)
    const chunks = splitVerse(story.verses[verseIndex])
    if (chunkIndex >= chunks.length) return playVerse(verseIndex + 1, 0, run)

    setIsLoading(true)
    try {
      const blob = await getAudio(chunks[chunkIndex], languageRef.current)
      if (run !== runRef.current) return
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url
      const audio = audioRef.current
      if (!audio) return
      audio.src = url
      audio.onended = () => {
        if (chunkIndex + 1 < chunks.length) void playVerse(verseIndex, chunkIndex + 1, run)
        else void playVerse(verseIndex + 1, 0, run)
      }
      audio.onerror = () => {
        if (run !== runRef.current) return
        toast.error("We couldn't play that verse. Continuing to the next one.")
        void playVerse(verseIndex + 1, 0, run)
      }
      await audio.play()
      if (run !== runRef.current) return
      setIsLoading(false)
      setIsPlaying(true)

      if (chunkIndex === 0 && verseIndex + 1 < story.verses.length) {
        const nextChunk = splitVerse(story.verses[verseIndex + 1])[0]
        void getAudio(nextChunk, languageRef.current).catch(() => undefined)
      }
    } catch (error) {
      if (run !== runRef.current) return
      toast.error("We couldn't prepare this verse. Continuing to the next one.")
      console.error("Narration verse failed", error)
      void playVerse(verseIndex + 1, 0, run)
    }
  }, [onCurrentVerseChange, story.verses])

  useEffect(() => () => {
    runRef.current += 1
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
  }, [])

  const start = () => {
    const audio = audioRef.current
    if (audio?.src) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => undefined)
      return
    }
    const run = ++runRef.current
    void playVerse(0, 0, run)
  }

  const pause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const changeLanguage = (nextLanguage: string) => {
    stop()
    setLanguage(nextLanguage)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 rounded-xl border border-border bg-card p-4 gold-glow">
      <audio ref={audioRef} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-accent">
          <Volume2 size={18} />
          <span className="text-sm font-semibold text-foreground">Listen to this chapter</span>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Language</span>
          <select value={language} onChange={(event) => changeLanguage(event.target.value)} className="rounded-md border border-border bg-black px-3 py-2 text-foreground focus:border-accent focus:outline-none">
            {LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button onClick={start} disabled={isLoading} aria-label="Play narration" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-black disabled:opacity-50"><Play size={18} /></button>
          <button onClick={pause} disabled={!isPlaying} aria-label="Pause narration" className="flex h-10 w-10 items-center justify-center rounded-full border border-accent text-accent disabled:opacity-40"><Pause size={18} /></button>
          <button onClick={stop} aria-label="Stop narration" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"><Square size={16} /></button>
          {isLoading && <span className="text-xs text-muted-foreground">Preparing verse…</span>}
          {isPlaying && <span className="text-xs text-accent">Playing</span>}
        </div>
      </div>
    </motion.section>
  )
}

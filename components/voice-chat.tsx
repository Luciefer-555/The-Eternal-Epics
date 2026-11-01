"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AudioLines, LoaderCircle, Mic, MicOff, Send, Square, Volume2 } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"

const LANGUAGES = [
  ["auto", "Auto · match my speech"], ["hi-IN", "Hindi"], ["en-IN", "English"], ["ta-IN", "Tamil"],
  ["te-IN", "Telugu"], ["kn-IN", "Kannada"], ["ml-IN", "Malayalam"], ["mr-IN", "Marathi"],
  ["pa-IN", "Punjabi"], ["bn-IN", "Bengali"], ["gu-IN", "Gujarati"],
] as const

type ChatMessage = { id: string; role: "user" | "assistant"; content: string }
type Phase = "idle" | "listening" | "transcribing" | "thinking" | "speaking"
const LANGUAGE_KEY = "eternal-epics-voice-language"

function makeWavBlob(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextConstructor) return reject(new Error("Audio recording is not supported in this browser."))
    const context = new AudioContextConstructor()
    blob.arrayBuffer().then((bytes) => context.decodeAudioData(bytes)).then((decoded) => {
      const rate = 16_000
      const sampleCount = Math.ceil(decoded.duration * rate)
      const samples = new Float32Array(sampleCount)
      const channels = Array.from({ length: decoded.numberOfChannels }, (_, index) => decoded.getChannelData(index))
      for (let i = 0; i < sampleCount; i++) {
        const position = i * decoded.sampleRate / rate
        const low = Math.floor(position)
        const high = Math.min(low + 1, decoded.length - 1)
        const fraction = position - low
        let sample = 0
        for (const channel of channels) sample += (channel[low] * (1 - fraction) + channel[high] * fraction) / channels.length
        samples[i] = Math.max(-1, Math.min(1, sample))
      }
      const wav = new ArrayBuffer(44 + samples.length * 2)
      const view = new DataView(wav)
      const write = (offset: number, value: string) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)))
      write(0, "RIFF"); view.setUint32(4, 36 + samples.length * 2, true); write(8, "WAVE")
      write(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true)
      view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true)
      view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, "data")
      view.setUint32(40, samples.length * 2, true)
      samples.forEach((sample, index) => view.setInt16(44 + index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true))
      resolve(new Blob([wav], { type: "audio/wav" }))
    }).catch(reject).finally(() => { void context.close() })
  })
}

export function VoiceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [phase, setPhase] = useState<Phase>("idle")
  const [preferredLanguage, setPreferredLanguage] = useState("auto")
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [spokenText, setSpokenText] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const recordingTimeoutRef = useRef<number | null>(null)
  const busyRef = useRef(false)

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    if (saved && LANGUAGES.some(([code]) => code === saved)) setPreferredLanguage(saved)
    return () => {
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
      audioRef.current?.pause()
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
      if (recordingTimeoutRef.current) window.clearTimeout(recordingTimeoutRef.current)
    }
  }, [])

  function stopAudio(clearTranscript = true) {
    if (audioRef.current) {
      audioRef.current.onplay = null
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    audioRef.current = null
    audioUrlRef.current = null
    if (clearTranscript) setSpokenText(null)
  }

  async function speak(text: string, language: string) {
    const ttsLanguage = LANGUAGES.some(([code]) => code === language && code !== "auto") ? language : "en-IN"
    const response = await fetch("/api/narrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang: ttsLanguage, translated: true }),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(typeof data.error === "string" ? data.error : "Gnani could not speak this response.")
    }
    const audioBlob = await response.blob()
    stopAudio(false)
    const url = URL.createObjectURL(audioBlob)
    audioUrlRef.current = url
    const audio = new Audio(url)
    audioRef.current = audio
    setSpokenText(text)
    audio.onplay = () => setPhase("speaking")
    audio.onended = () => { setPhase("idle"); setSpokenText(null) }
    audio.onerror = () => { setPhase("idle"); setSpokenText(null); setError("Audio playback failed. Please try again.") }
    await audio.play()
  }

  async function submitTurn(history: ChatMessage[], transcript: string, language: string | null) {
    if (busyRef.current) return
    busyRef.current = true
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: transcript }
    setMessages((current) => [...current, userMessage])
    setPhase("thinking")
    setError(null)
    setSpokenText(null)
    const recent = [...history, userMessage].slice(-12).map(({ role, content }) => ({ role, content }))
    try {
      const response = await fetch("/api/voice-chat/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recent, detectedLanguage: language, preferredLanguage }),
      })
      const data = await response.json()
      if (!response.ok || typeof data.response !== "string") throw new Error(data.error || "Sage could not answer just now.")
      const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: data.response }
      setMessages((current) => [...current, assistantMessage])
      await speak(data.response, typeof data.language === "string" ? data.language : language || "en-IN")
    } catch (caught) {
      setPhase("idle")
      setError(caught instanceof Error ? caught.message : "Voice chat could not complete that turn.")
    } finally {
      busyRef.current = false
    }
  }

  async function startRecording() {
    setError(null)
    stopAudio()
    setSpokenText(null)
    if (busyRef.current) return
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Microphone recording is not supported in this browser. You can type a message instead.")
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        recorderRef.current = null
        if (recordingTimeoutRef.current) window.clearTimeout(recordingTimeoutRef.current)
        const clip = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
        chunksRef.current = []
        if (clip.size === 0) { setPhase("idle"); return }
        setPhase("transcribing")
        try {
          const wav = await makeWavBlob(clip)
          const form = new FormData()
          form.append("audio", new File([wav], "voice-message.wav", { type: "audio/wav" }))
          const response = await fetch("/api/voice-chat/transcribe", { method: "POST", body: form })
          const data = await response.json()
          if (!response.ok || typeof data.transcript !== "string") throw new Error(data.error || "Speech recognition failed.")
          await submitTurn(messages, data.transcript, typeof data.language === "string" ? data.language : null)
        } catch (caught) {
          setPhase("idle")
          setError(caught instanceof Error ? caught.message : "I could not process that recording.")
        }
      }
      recorder.start()
      setPhase("listening")
      recordingTimeoutRef.current = window.setTimeout(() => recorder.state === "recording" && recorder.stop(), 25_000)
    } catch (caught) {
      setPhase("idle")
      setError(caught instanceof Error && caught.name === "NotAllowedError" ? "Microphone access was blocked. Allow it in your browser or type a message instead." : "Could not start the microphone. Please try again.")
    }
  }

  function stopRecording() {
    if (recordingTimeoutRef.current) window.clearTimeout(recordingTimeoutRef.current)
    if (recorderRef.current?.state === "recording") recorderRef.current.stop()
  }

  async function sendTypedMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || busyRef.current || phase === "listening" || phase === "transcribing") return
    stopAudio()
    setInput("")
    await submitTurn(messages, text, null)
  }

  const isBusy = phase === "transcribing" || phase === "thinking"

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-accent/25 bg-black/80 shadow-[0_0_50px_rgba(212,175,55,0.08)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
        <div>
          <h1 className="font-serif text-2xl text-accent sm:text-3xl">Voice Chat with the Sage</h1>
          <p className="mt-1 text-sm text-white/60">Speak naturally. Sage replies in your language.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <span className="sr-only">Response language</span>
          <select
            aria-label="Response language"
            value={preferredLanguage}
            onChange={(event) => { setPreferredLanguage(event.target.value); localStorage.setItem(LANGUAGE_KEY, event.target.value) }}
            className="rounded-full border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-accent"
          >
            {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
        </label>
      </header>

      <div className="border-b border-white/10 px-5 py-5 sm:px-7">
        <div className="flex h-20 items-center justify-center gap-1.5" aria-label={`Voice chat state: ${phase}`} role="status">
          {Array.from({ length: 21 }, (_, index) => (
            <motion.span
              key={index}
              className={`w-1.5 rounded-full ${phase === "listening" ? "bg-emerald-300" : phase === "speaking" ? "bg-accent" : phase === "thinking" || phase === "transcribing" ? "bg-yellow-100/80" : "bg-accent/50"}`}
              animate={{ height: phase === "listening" || phase === "speaking" ? [10 + (index % 3) * 4, 22 + ((index * 7) % 38), 12 + (index % 5) * 5] : phase === "thinking" || phase === "transcribing" ? [10, 28, 10] : 10 }}
              transition={{ duration: phase === "speaking" ? 0.45 : 0.8, repeat: phase === "idle" ? 0 : Infinity, delay: index * 0.025, ease: "easeInOut" }}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-2 text-center text-sm text-white/70">
          {phase === "listening" ? "Listening · tap when you’re done" : phase === "transcribing" ? "Recognizing your speech…" : phase === "thinking" ? <motion.span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.45), #d4af37, rgba(255,255,255,.45))", backgroundSize: "200% 100%" }} animate={{ backgroundPosition: ["100% 50%", "0% 50%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}>Sage is gathering a response…</motion.span> : phase === "speaking" ? "Sage is speaking · interrupt any time" : "Gnani transcribes your voice; Sage prepares its reply."}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-7" aria-live="polite">
        {messages.length === 0 && (
          <div className="py-10 text-center text-white/65">
            <AudioLines className="mx-auto mb-3 text-accent" size={34} />
            <p>Ask about the Bhāgavatam, dharma, or Krishna’s teachings.</p>
            <p className="mt-1 text-sm text-white/45">Your spoken language is detected automatically. Choose a language above to request it explicitly.</p>
          </div>
        )}
        {messages.map((message) => (
          <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed ${message.role === "user" ? "border border-accent/30 bg-accent/10 text-white" : "border border-white/10 bg-white/[0.06] text-white/90"}`}>
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-widest text-accent/80">{message.role === "assistant" ? <><AudioLines size={13} /> Sage</> : "You"}</div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {spokenText && phase === "speaking" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-2xl border border-accent/30 bg-accent/[0.07] p-4 text-sm leading-relaxed text-white/75">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent"><Volume2 size={14} /> Spoken transcript</div>
              <p>{spokenText}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-4 mb-3 rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-100 sm:mx-7">{error}</motion.div>}
      </AnimatePresence>

      <div className="border-t border-white/10 p-4 sm:p-6">
        <form onSubmit={sendTypedMessage} className="flex gap-2">
          <input value={input} onChange={(event) => setInput(event.target.value)} disabled={isBusy || phase === "listening"} placeholder="Type a message instead…" aria-label="Type a message" className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-accent disabled:opacity-50" />
          <button type="submit" disabled={!input.trim() || isBusy} aria-label="Send typed message" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent transition hover:bg-accent hover:text-black disabled:opacity-40"><Send size={18} /></button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-3">
          {phase === "listening" ? (
            <button onClick={stopRecording} className="flex min-w-48 items-center justify-center gap-2 rounded-full bg-red-500/90 px-6 py-3 font-medium text-white transition hover:bg-red-400"><Square size={16} /> Finish speaking</button>
          ) : phase === "speaking" ? (
            <button onClick={() => { stopAudio(); void startRecording() }} className="flex min-w-48 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"><Mic size={18} /> Interrupt & speak</button>
          ) : (
            <button onClick={() => void startRecording()} disabled={isBusy} className="flex min-w-48 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-50">
              {isBusy ? <LoaderCircle className="animate-spin" size={18} /> : phase === "idle" ? <Mic size={18} /> : <MicOff size={18} />}
              {phase === "transcribing" ? "Transcribing…" : phase === "thinking" ? "Sage is thinking…" : "Tap to speak"}
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-white/40">Microphone audio is sent to Gnani for transcription. Clips stop at 25 seconds. You can interrupt a spoken answer at any time.</p>
      </div>
    </section>
  )
}

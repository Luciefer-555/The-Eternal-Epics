"use client"

import { Navbar } from "@/components/navbar"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Lightbulb } from "lucide-react"
import { askSage } from "@/lib/sage-client"

interface Message {
  id: string
  text: string
  sender: "user" | "sage"
}

const SUGGESTED_QUESTIONS = [
  "What is the path of dharma (righteousness)?",
  "How can I practice bhakti (devotion) in daily life?",
  "What does the Bhagavad Gita teach about duty?",
  "How do I understand my eternal nature (atman)?",
  "What is the significance of Krishna's teachings?",
]

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Namaste, seeker. I am the Sage, keeper of the divine wisdom of the Srimad Bhagavatam. Ask me anything about the teachings, Krishna's wisdom, or the path of righteousness. What weighs upon your heart?",
      sender: "sage",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const messageContext = messages
        .slice(-4)
        .map((m) => `${m.sender === "user" ? "User" : "Sage"}: ${m.text}`)
        .join("\n")

      const response = await askSage(
        [...messages.map((m) => ({ role: m.sender, content: m.text })), { role: "user", content: text }],
        messageContext,
      )

      const sageMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "sage",
      }
      setMessages((prev) => [...prev, sageMessage])
    } catch (err) {
      setError("Unable to reach the Sage. Please try again.")
      console.error("Error:", err)
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] flex flex-col">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-2 text-balance">Ask the Sage</h1>
            <p className="text-sm sm:text-base text-muted-foreground text-pretty">
              Seek guidance from the eternal wisdom of the Bhāgavatam
            </p>
          </div>

          {/* Chat Container */}
          <div
            ref={scrollRef}
            className="flex-1 border border-border rounded-lg bg-card p-3 sm:p-6 overflow-y-auto mb-4 sm:mb-6 space-y-4"
          >
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm ${
                      msg.sender === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted border border-border text-foreground"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-muted border border-border text-foreground px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-accent rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-accent rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-xs sm:text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 sm:mb-4 space-y-2"
            >
              <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                <Lightbulb size={14} /> Suggested
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-xs px-2 py-1.5 border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-accent transition focus-visible-ring"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="Ask..."
              disabled={isLoading}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground text-sm sm:text-base placeholder-muted-foreground focus:outline-none focus:border-accent transition disabled:opacity-50 focus-visible-ring"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-2 sm:px-4 py-2 sm:py-3 bg-accent text-accent-foreground rounded-lg hover:shadow-lg hover:shadow-accent/30 transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible-ring"
            >
              <Send size={18} className="sm:hidden" />
              <Send size={20} className="hidden sm:block" />
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

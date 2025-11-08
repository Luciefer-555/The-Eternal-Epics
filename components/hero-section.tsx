"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-tight text-balance mb-8">
            The Eternal Epics —
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200">
              Ramayana, Mahabharata, Shiva Purana & Devi Bhagavatam
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed text-pretty font-light mb-12">
            Experience divine stories through sight, sound, and spirit — a living library of India&apos;s sacred wisdom.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cantos"
              className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 text-center shadow-xl"
            >
              Begin Reading
            </Link>
            <Link
              href="/cantos"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all text-center"
            >
              Explore Cantos
            </Link>
          </div>
        </motion.div>

        {/* Daily Verse Widget */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 sm:mt-20 p-4 sm:p-6 border border-border rounded-lg bg-card gold-glow max-w-2xl mx-auto"
        >
          <p className="text-xs sm:text-sm font-inter text-accent mb-3 font-semibold uppercase tracking-wide">
            Today's Verse
          </p>
          <p className="text-base sm:text-lg font-inter text-foreground italic mb-4 leading-relaxed text-pretty font-light">
            "The soul is neither born, and nor can it die. All paths lead to me."
          </p>
          <button className="text-accent hover:text-accent/80 transition font-inter font-semibold text-xs sm:text-sm focus-visible-ring rounded px-2 py-1">
            Listen to this verse
          </button>
        </motion.div>
      </div>
    </section>
  )
}

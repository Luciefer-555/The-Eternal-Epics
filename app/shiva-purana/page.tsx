"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

export default function ShivaPuranaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground">
              शिवपुराणम् · Shiva Purana
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-serif text-foreground">
              Sacred Narratives Coming Soon
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              The auspicious tales of Lord Shiva are on their way. Very soon, you will be able to read and listen to the
              Shiva Purana within this sanctuary of Vedic wisdom.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 rounded-3xl border border-border/70 bg-card/70 p-8 backdrop-blur"
          >
            <p className="text-sm text-muted-foreground">
              For now, continue your journey through the Śrīmad Bhāgavatam via the Bhagavatam tab. Additional Purana
              collections will arrive shortly.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

"use client"

import { Navbar } from "@/components/navbar"
import { useBookmarks } from "@/lib/hooks"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookmarkCheck } from "lucide-react"

interface SavedChapter {
  id: string
  canto: number
  chapter: number
  title: string
}

export default function BookmarksPage() {
  const { bookmarks, isLoaded } = useBookmarks()
  const [savedItems, setSavedItems] = useState<SavedChapter[]>([])

  useEffect(() => {
    if (!isLoaded) return
    const ids = [...bookmarks]
    const parseId = (id: string): SavedChapter | null => {
      const match = /^story_(\d+)_(\d+)$/.exec(id)
      if (!match) return null
      const canto = Number(match[1])
      const chapter = Number(match[2])
      return { id, canto, chapter, title: `Chapter ${chapter}` }
    }
    const fallbackItems = ids.map(parseId).filter((item): item is SavedChapter => item !== null)
    setSavedItems(fallbackItems)
    if (!ids.length) return

    const controller = new AbortController()
    fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) return
      const data = await response.json()
      if (Array.isArray(data.items) && !controller.signal.aborted) setSavedItems(data.items)
    }).catch((error) => {
      if (!controller.signal.aborted) console.error("Could not load saved chapter titles", error)
    })

    return () => controller.abort()
  }, [bookmarks, isLoaded])

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif text-foreground mb-2">Saved Stories</h1>
          <p className="text-muted-foreground mb-8">
            {savedItems.length} saved chapter{savedItems.length !== 1 ? "s" : ""}
          </p>

          {savedItems.length === 0 ? (
            <div className="text-center py-12 border border-border rounded-lg">
              <BookmarkCheck className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">No bookmarks yet. Start saving your favorite chapters!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/story/${item.canto}/${item.chapter}`}>
                    <div className="group border border-border rounded-lg p-4 bg-card gold-glow-hover cursor-pointer transition">
                      <p className="text-sm text-accent font-semibold mb-1">
                        Canto {item.canto}, Chapter {item.chapter}
                      </p>
                      <h3 className="text-lg font-serif text-foreground group-hover:text-accent transition">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

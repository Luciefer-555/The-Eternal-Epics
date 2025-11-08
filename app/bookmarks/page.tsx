"use client"

import { Navbar } from "@/components/navbar"
import { useBookmarks } from "@/lib/hooks"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookmarkCheck } from "lucide-react"

const BOOKMARKABLE_ITEMS: Record<string, { canto: number; chapter: number; title: string }> = {
  story_1_1: { canto: 1, chapter: 1, title: "Questions by the Sages" },
  story_1_2: { canto: 1, chapter: 2, title: "Divinity and Divine Service" },
  story_2_1: { canto: 2, chapter: 1, title: "The First Step in God Realization" },
}

export default function BookmarksPage() {
  const { bookmarks, isLoaded } = useBookmarks()
  const [savedItems, setSavedItems] = useState<typeof BOOKMARKABLE_ITEMS>({})

  useEffect(() => {
    const items: typeof BOOKMARKABLE_ITEMS = {}
    bookmarks.forEach((id) => {
      if (BOOKMARKABLE_ITEMS[id]) {
        items[id] = BOOKMARKABLE_ITEMS[id]
      }
    })
    setSavedItems(items)
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
            {Object.keys(savedItems).length} saved chapter{Object.keys(savedItems).length !== 1 ? "s" : ""}
          </p>

          {Object.keys(savedItems).length === 0 ? (
            <div className="text-center py-12 border border-border rounded-lg">
              <BookmarkCheck className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">No bookmarks yet. Start saving your favorite chapters!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(savedItems).map(([id, item], idx) => (
                <motion.div
                  key={id}
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

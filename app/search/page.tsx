"use client"

import { Navbar } from "@/components/navbar"
import { useState, useMemo } from "react"
import { SearchIcon } from "lucide-react"
import { SearchResults } from "@/components/search-results"

const SEARCH_DATABASE = [
  {
    id: "1_1_1",
    canto: 1,
    chapter: 1,
    title: "Questions by the Sages",
    type: "chapter" as const,
    excerpt: "O king, as we sit here on this sacred bank, we hear the divine word of the Lord",
  },
  {
    id: "1_1_2",
    canto: 1,
    chapter: 1,
    title: "Divine Wisdom",
    type: "verse" as const,
    excerpt: "Through the teachings of the Vedas and the wisdom of the sages, we understand truth",
  },
  {
    id: "1_2_1",
    canto: 1,
    chapter: 2,
    title: "Divinity and Divine Service",
    type: "chapter" as const,
    excerpt: "The service to the Lord is the highest form of existence",
  },
  {
    id: "2_1_1",
    canto: 2,
    chapter: 1,
    title: "The First Step in God Realization",
    type: "chapter" as const,
    excerpt: "The beginning of spiritual knowledge lies in understanding our nature",
  },
  {
    id: "10_1_1",
    canto: 10,
    chapter: 1,
    title: "Birth of Krishna",
    type: "chapter" as const,
    excerpt: "The divine Lord Krishna, the source of all creation, appeared in this world",
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    return SEARCH_DATABASE.filter(
      (item) => item.title.toLowerCase().includes(lowerQuery) || item.excerpt.toLowerCase().includes(lowerQuery),
    )
  }, [query])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-foreground mb-6">Search</h1>

            {/* Search Input */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search verses, chapters, and topics..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition text-lg"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <SearchResults results={results} query={query} />
        </div>
      </main>
    </>
  )
}

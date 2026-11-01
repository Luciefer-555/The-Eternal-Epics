"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { SearchIcon } from "lucide-react"
import { SearchResults } from "@/components/search-results"

interface SearchResultItem {
  id: string
  canto: number
  chapter: number
  title: string
  type: "verse" | "chapter"
  excerpt: string
  verseIndex?: number
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
      setResults([])
      setTotalResults(0)
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`, { signal: controller.signal })
        if (!response.ok) throw new Error("Search could not be completed.")
        const data = await response.json()
        setResults(Array.isArray(data.results) ? data.results : [])
        setTotalResults(typeof data.total === "number" ? data.total : 0)
      } catch (error) {
        if (!controller.signal.aborted) {
          setResults([])
          setTotalResults(0)
          console.error("Search request failed", error)
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-foreground mb-6">Search</h1>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search verses, chapters, and topics..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition text-lg"
                autoFocus
              />
            </div>
          </div>
          <SearchResults results={results} query={query} totalResults={totalResults} isSearching={isSearching} />
        </div>
      </main>
    </>
  )
}

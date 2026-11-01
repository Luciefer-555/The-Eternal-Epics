"use client"

import { useState, useEffect } from "react"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("bhagavatam_bookmarks")
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          setBookmarks(new Set(parsed))
        }
      } catch {
        localStorage.removeItem("bhagavatam_bookmarks")
      }
    }
    setIsLoaded(true)
  }, [])

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      localStorage.setItem("bhagavatam_bookmarks", JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  return { bookmarks, isLoaded, toggleBookmark }
}

export function useSearch(items: any[], searchFields: string[]) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(items)

  useEffect(() => {
    if (!query.trim()) {
      setResults(items)
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = items.filter((item) =>
      searchFields.some((field) => {
        const value = field.split(".").reduce((obj, key) => obj?.[key], item)
        return String(value).toLowerCase().includes(lowerQuery)
      }),
    )
    setResults(filtered)
  }, [query, items, searchFields])

  return { query, setQuery, results }
}

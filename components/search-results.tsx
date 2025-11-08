"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

interface SearchResultItem {
  id: string
  canto: number
  chapter: number
  title: string
  type: "verse" | "chapter" | "canto"
  excerpt: string
}

interface SearchResultsProps {
  results: SearchResultItem[]
  query: string
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Enter a search term to find verses and chapters</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found for "{query}"</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
      </p>

      {results.map((result, idx) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Link href={`/story/${result.canto}/${result.chapter}`}>
            <div className="group border border-border rounded-lg p-4 bg-card gold-glow-hover cursor-pointer transition">
              <div className="flex items-start gap-3">
                <BookOpen className="text-accent mt-1 flex-shrink-0" size={18} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-xs text-accent font-semibold">
                      Canto {result.canto}, Chapter {result.chapter}
                    </p>
                    <span className="text-xs text-muted-foreground">{result.type}</span>
                  </div>
                  <h3 className="text-lg font-serif text-foreground group-hover:text-accent transition mb-2">
                    {result.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{result.excerpt}</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

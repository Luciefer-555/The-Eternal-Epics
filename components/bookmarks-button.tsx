"use client"

import { Bookmark } from "lucide-react"
import { useBookmarks } from "@/lib/hooks"
import { useEffect, useState } from "react"

interface BookmarksButtonProps {
  id: string
  className?: string
  showLabel?: boolean
}

export function BookmarksButton({ id, className = "", showLabel = false }: BookmarksButtonProps) {
  const { bookmarks, isLoaded, toggleBookmark } = useBookmarks()
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      setIsBookmarked(bookmarks.has(id))
    }
  }, [bookmarks, isLoaded, id])

  if (!isLoaded) return null

  return (
    <button
      onClick={() => toggleBookmark(id)}
      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition font-semibold text-sm ${
        isBookmarked
          ? "border-accent text-accent bg-accent/10"
          : "border-border text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
      {showLabel && (isBookmarked ? "Saved" : "Save")}
    </button>
  )
}

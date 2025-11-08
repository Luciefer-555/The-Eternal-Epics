"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Volume2 } from "lucide-react"

interface CantoCardProps {
  canto: number
  title: string
  description: string
  chapterCount: number
  imagePath?: string
}

export function CantoCard({ canto, title, description, chapterCount, imagePath }: CantoCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Link href={`/canto/${canto}`}>
        <div className="group h-full border border-border rounded-lg overflow-hidden bg-card gold-glow-hover transition cursor-pointer">
          {/* Image */}
          <div className="aspect-video bg-muted relative overflow-hidden">
            {imagePath ? (
              <img
                src={imagePath || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-accent/40 text-sm uppercase tracking-wide">
                Image loading
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            <div className="flex items-baseline gap-2">
              <p className="text-sm text-accent font-semibold">Canto {canto}</p>
              <p className="text-xs text-muted-foreground">{chapterCount} chapters</p>
            </div>

            <h3 className="text-xl font-serif text-foreground group-hover:text-accent transition">{title}</h3>

            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

            <div className="flex gap-3 pt-4">
              <button className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition">
                <BookOpen size={16} />
                Read
              </button>
              <button className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition">
                <Volume2 size={16} />
                Listen
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const links = [
    { label: "Cantos", href: "/cantos" },
    { label: "Gallery", href: "/gallery" },
    { label: "Ask the Sage", href: "/ask" },
    { label: "Voice Chat", href: "/voice-chat" },
    { label: "Search", href: "/search" },
    { label: "Bookmarks", href: "/bookmarks" },
  ]

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-muted-foreground hover:text-foreground transition p-2"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 border-b border-border bg-background/95 backdrop-blur-sm md:hidden"
          >
            <nav className="flex flex-col divide-y divide-border">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 text-sm transition ${
                    isActive(link.href) ? "text-accent font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

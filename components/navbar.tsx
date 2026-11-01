"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bookmark, AudioLines } from "lucide-react"
import { MobileMenu } from "./mobile-menu"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto">
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-6 shadow-2xl">
        <div className="flex justify-between items-center h-14">
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-sans transition ${
                isActive("/") ? "text-yellow-400 font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/cantos"
              className={`text-sm font-sans transition ${
                isActive("/cantos") ? "text-yellow-400 font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              Bhagavatam
            </Link>
            <Link
              href="/ramayana"
              className={`text-sm font-sans transition ${
                isActive("/ramayana") ? "text-yellow-400 font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              Ramayana
            </Link>
            <Link
              href="/mahabharata"
              className={`text-sm font-sans transition ${
                isActive("/mahabharata") ? "text-yellow-400 font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              Mahabharata
            </Link>
            <Link
              href="/shiva-purana"
              className={`text-sm font-sans transition ${
                isActive("/shiva-purana") ? "text-yellow-400 font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              Shiva Purana
            </Link>
            <Link
              href="/devi-purana"
              className={`text-sm font-sans transition ${
                isActive("/devi-purana") ? "text-yellow-400 font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              Devi Purana
            </Link>
            <Link
              href="/gallery"
              className={`text-sm font-sans transition ${
                isActive("/gallery") ? "text-yellow-400 font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              Gallery
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex gap-2 items-center">
            <Link href="/search" className="text-white/80 hover:text-white transition p-2 hidden sm:block">
              <Search size={20} />
            </Link>
            <Link
              href="/bookmarks"
              className="text-white/80 hover:text-white transition p-2 hidden sm:block"
            >
              <Bookmark size={20} />
            </Link>
            <Link
              href="/voice-chat"
              aria-label="Voice chat with Sage"
              title="Voice chat"
              className={`transition p-2 hidden sm:block ${isActive("/voice-chat") ? "text-yellow-400" : "text-white/80 hover:text-white"}`}
            >
              <AudioLines size={20} />
            </Link>
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}

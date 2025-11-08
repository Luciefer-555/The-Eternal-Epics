"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="font-inter font-bold text-lg text-foreground">Bhāgavatam</span>
            </Link>
            <p className="text-xs sm:text-sm font-inter text-muted-foreground font-light">
              The Living Chronicle of divine wisdom
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-inter font-semibold text-sm mb-3 text-accent">Navigation</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-inter">
              <li>
                <Link href="/cantos" className="hover:text-foreground transition">
                  Cantos
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-foreground transition">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-inter font-semibold text-sm mb-3 text-accent">Resources</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-inter">
              <li>
                <Link href="/search" className="hover:text-foreground transition">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-foreground transition">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-inter font-semibold text-sm mb-3 text-accent">About</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-inter font-light">
              A sacred digital archive exploring the eternal wisdom of Lord Krishna's teachings
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 sm:pt-8">
          <p className="text-xs sm:text-sm text-muted-foreground text-center font-inter font-light">
            © 2025 Śrīmad Bhāgavatam — The Living Chronicle. All verses and teachings are honored as sacred.
          </p>
        </div>
      </div>
    </footer>
  )
}

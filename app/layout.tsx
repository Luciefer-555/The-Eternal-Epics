"use client"

import type React from "react"
import { Zen_Antique } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import "./globals.css"

const zenAntique = Zen_Antique({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-antique"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Śrīmad Bhāgavatam — The Living Chronicle (Dark Edition)" />
        <title>Śrīmad Bhāgavatam — The Living Chronicle</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${zenAntique.variable} font-sans antialiased bg-background text-foreground relative`}>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
          <Footer />
        </div>

        <Analytics />
      </body>
    </html>
  )
}

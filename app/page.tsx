"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import dynamic from "next/dynamic"

const Galaxy = dynamic(() => import("@/components/galaxy-background"), { ssr: false })

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Full Page Galaxy Background */}
      <Galaxy
        density={0.8}
        hueShift={45}
        speed={0.8}
        glowIntensity={0.5}
        twinkleIntensity={0.5}
        rotationSpeed={0.08}
        mouseInteraction={true}
        mouseRepulsion={true}
        repulsionStrength={5}
      />
      
      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
        </main>
      </div>
    </div>
  )
}

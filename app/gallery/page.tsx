"use client"

import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import Image from "next/image"
import InfiniteScroll from "@/components/infinite-scroll"
import { useMemo } from "react"

type GalleryImage = {
  id: number
  src: string
  title: string
  description: string
  aspectRatio: number
}

const BASE_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: "/images/cantos/canto-1.jpg",
    title: "Creation and Cosmology",
    description: "Canto 1 · Creation and Cosmology",
    aspectRatio: 16 / 9,
  },
  {
    id: 2,
    src: "/images/cantos/canto-2.jpg",
    title: "The Cosmic Manifestation",
    description: "Canto 2 · The Cosmic Manifestation",
    aspectRatio: 10 / 16,
  },
  {
    id: 3,
    src: "/images/cantos/canto-3.jpg",
    title: "Vishnu's Rest",
    description: "Canto 3 · The Status Quo",
    aspectRatio: 1,
  },
  {
    id: 4,
    src: "/images/cantos/canto-4.jpg",
    title: "Lord Shiva in Meditation",
    description: "Canto 4 · The Creation of the Fourth Order",
    aspectRatio: 16 / 9,
  },
  {
    id: 5,
    src: "/images/cantos/canto-5.jpg",
    title: "Vidura's Counsel",
    description: "Canto 5 · Fruitive Results of Vedic Rituals",
    aspectRatio: 4 / 5,
  },
  {
    id: 6,
    src: "/images/cantos/canto-6.jpg",
    title: "Assembly of Duties",
    description: "Canto 6 · Prescribed Duties for Mankind",
    aspectRatio: 4 / 3,
  },
  {
    id: 7,
    src: "/images/cantos/canto-7.jpg",
    title: "Narasimha's Protection",
    description: "Canto 7 · The Science of God Realization",
    aspectRatio: 16 / 9,
  },
  {
    id: 8,
    src: "/images/cantos/canto-8.jpg",
    title: "Aftermath of Battle",
    description: "Canto 8 · Withdrawal of the Cosmic Creations",
    aspectRatio: 16 / 9,
  },
  {
    id: 9,
    src: "/images/cantos/canto-9.jpg",
    title: "Royal Assembly",
    description: "Canto 9 · Liberation",
    aspectRatio: 4 / 3,
  },
  {
    id: 10,
    src: "/images/cantos/canto-10.jpg",
    title: "Krishna & Arjuna",
    description: "Canto 10 · Lord Krishna's Pastimes",
    aspectRatio: 16 / 9,
  },
  {
    id: 11,
    src: "/images/cantos/canto-11.jpg",
    title: "Krishna's Final Teachings",
    description: "Canto 11 · The General History",
    aspectRatio: 4 / 5,
  },
  {
    id: 12,
    src: "/images/cantos/canto-12.jpg",
    title: "Chariot of the Sun",
    description: "Canto 12 · The Age of Deterioration",
    aspectRatio: 16 / 9,
  },
]

export default function GalleryPage() {
  const columns = useMemo(() => {
    const columnCount = 3
    const grouped: GalleryImage[][] = Array.from({ length: columnCount }, () => [])
    BASE_IMAGES.forEach((img, index) => {
      grouped[index % columnCount].push(img)
    })
    return grouped.map((images, columnIndex) => {
      const items = images.map((image, idx) => ({
        content: (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.2) }}
            className="h-full"
          >
            <div className="group border border-border/70 rounded-2xl overflow-hidden bg-card/80 backdrop-blur gold-glow-hover transition">
              <div
                className="relative w-full bg-muted flex items-center justify-center overflow-hidden"
                style={{ aspectRatio: image.aspectRatio }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 40vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={columnIndex === 0 && idx < 4}
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-base font-sans font-semibold text-foreground group-hover:text-accent transition">
                  {image.title}
                </h3>
                <p className="text-sm font-sans text-muted-foreground font-light">{image.description}</p>
              </div>
            </div>
          </motion.div>
        ),
      }))

      // duplicate list to ensure seamless looping
      const duplicated = [...items, ...items]
      return duplicated
    })
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-sans font-bold text-foreground mb-4">Sacred Imagery</h1>
            <p className="text-muted-foreground text-lg font-sans font-light">
              A living gallery of the Śrīmad Bhāgavatam — divine visions flowing in endless procession.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center gap-10">
            {columns.map((items, index) => (
              <InfiniteScroll
                key={index}
                width="24rem"
                itemMinHeight={260}
                negativeMargin="-2rem"
                maxHeight="60vh"
                items={items}
                isTilted={false}
                autoplay
                autoplaySpeed={0.6 + index * 0.2}
                autoplayDirection={index % 2 === 0 ? "down" : "up"}
                pauseOnHover
              />
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Hover over a column to pause the flow. Scroll or drag to explore every detail.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

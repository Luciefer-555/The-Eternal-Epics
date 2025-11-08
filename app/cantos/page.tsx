"use client"

import { Navbar } from "@/components/navbar"
import ChromaGrid, { ChromaItem } from "@/components/chroma-grid"

const CANTOS_DATA = [
  {
    canto: 1,
    title: "Creation and Cosmology",
    description: "The creation of the universe and the cosmic manifestation",
    chapters: 19,
    image: "/images/cantos/canto-1.jpg",
  },
  {
    canto: 2,
    title: "The Cosmic Manifestation",
    description: "Understanding the nature of Brahman and manifestation",
    chapters: 10,
    image: "/images/cantos/canto-2.jpg",
  },
  { 
    canto: 3, 
    title: "The Status Quo", 
    description: "The role of Brahma in creation", 
    chapters: 33,
    image: "/images/cantos/canto-3.jpg",
  },
  { 
    canto: 4, 
    title: "The Creation of the Fourth Order", 
    description: "The descendants of Brahma", 
    chapters: 31,
    image: "/images/cantos/canto-4.jpg",
  },
  {
    canto: 5,
    title: "The Predominator of the Fruitive Results of the Vedic Rituals",
    description: "Yamaraja's governance",
    chapters: 26,
    image: "/images/cantos/canto-5.jpg",
  },
  { 
    canto: 6, 
    title: "Prescribed Duties for Mankind", 
    description: "The path of righteousness", 
    chapters: 19,
    image: "/images/cantos/canto-6.jpg",
  },
  { 
    canto: 7, 
    title: "The Science of God Realization", 
    description: "Prahlada's teachings and devotion", 
    chapters: 15,
    image: "/images/cantos/canto-7.jpg",
  },
  {
    canto: 8,
    title: "Withdrawal of the Cosmic Creations",
    description: "The cosmic dissolution and recreation",
    chapters: 24,
    image: "/images/cantos/canto-8.jpg",
  },
  { 
    canto: 9, 
    title: "Liberation", 
    description: "The path to liberation and moksha", 
    chapters: 24,
    image: "/images/cantos/canto-9.jpg",
  },
  {
    canto: 10,
    title: "The Pastimes of Lord Krishna",
    description: "Krishna's divine activities and teachings",
    chapters: 90,
    image: "/images/cantos/canto-10.jpg",
  },
  { 
    canto: 11, 
    title: "The General History", 
    description: "Teachings of Lord Krishna", 
    chapters: 31,
    image: "/images/cantos/canto-11.jpg",
  },
  { 
    canto: 12, 
    title: "The Age of Deterioration", 
    description: "The Kali Yuga and its characteristics", 
    chapters: 13,
    image: "/images/cantos/canto-12.jpg",
  },
]

export default function CantosPage() {
  // Transform CANTOS_DATA to ChromaItem format
  const chromaItems: ChromaItem[] = CANTOS_DATA.map((canto) => ({
    image: canto.image,
    title: canto.title,
    subtitle: canto.description,
    handle: `Canto ${canto.canto}`,
    location: `${canto.chapters} chapters`,
    borderColor: '#d4af37',
    gradient: 'linear-gradient(145deg, rgba(0,0,0,0.9), rgba(0,0,0,1))',
    url: `/canto/${canto.canto}`
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-serif text-foreground mb-3 sm:mb-4 text-balance">
              The Twelve Cantos
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground text-pretty">
              Journey through the sacred narrative of the Śrīmad Bhāgavatam
            </p>
          </div>

          {/* Chroma Grid */}
          <ChromaGrid 
            items={chromaItems} 
            radius={350}
            damping={0.5}
            fadeOut={0.7}
          />
        </div>
      </main>
    </>
  )
}

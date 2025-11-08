"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import bhagavatamDataRaw from "@/srimad_bhagavatam.json"

// Type the imported data
const bhagavatamData = bhagavatamDataRaw as Array<{
  canto: number
  chapter: number
  title: string
  url: string
  verses: Array<{ verse_number: number; text: string; url: string }>
}>

// Load chapter data from the dataset
const loadChaptersData = () => {
  const chaptersData: Record<number, Array<{ chapter: number; title: string; verses: number; excerpt: string }>> = {}
  
  bhagavatamData.forEach((chapterData) => {
    if (!chaptersData[chapterData.canto]) {
      chaptersData[chapterData.canto] = []
    }
    
    // Get first verse as excerpt
    const firstVerse = chapterData.verses[0]?.text.replace('Translation ', '').substring(0, 100) + '...' || 'Explore this chapter...'
    
    chaptersData[chapterData.canto].push({
      chapter: chapterData.chapter,
      title: chapterData.title,
      verses: chapterData.verses.length,
      excerpt: firstVerse
    })
  })
  
  return chaptersData
}

const CHAPTERS_DATA_ACTUAL = loadChaptersData()

// Fallback chapter data
const CHAPTERS_DATA_FALLBACK: Record<number, Array<{ chapter: number; title: string; verses: number; excerpt: string }>> = {
  1: [
    { chapter: 1, title: "Questions by the Sages", verses: 45, excerpt: "King Parikshit asks the sages about eternal truth..." },
    { chapter: 2, title: "Divinity and Divine Service", verses: 34, excerpt: "Understanding the nature of divine consciousness..." },
    { chapter: 3, title: "The Post-Incarnational Pastimes", verses: 43, excerpt: "The activities of the Lord and His devotees..." },
  ],
  2: [
    { chapter: 1, title: "The First Step in God Realization", verses: 42, excerpt: "The beginning of spiritual knowledge..." },
    { chapter: 2, title: "The Cosmic Manifestation", verses: 34, excerpt: "The nature of service to the Divine..." },
    { chapter: 3, title: "Pure Devotional Service", verses: 38, excerpt: "The path of pure devotion to the Supreme..." },
  ],
  3: [
    { chapter: 1, title: "Questions by Vidura", verses: 44, excerpt: "Vidura inquires about the creation of the universe..." },
    { chapter: 2, title: "Remembrance of Lord Krishna", verses: 35, excerpt: "The glories of remembering the Supreme Lord..." },
    { chapter: 3, title: "The Lord's Pastimes", verses: 29, excerpt: "Divine activities beyond material comprehension..." },
  ],
  4: [
    { chapter: 1, title: "Genealogical Table", verses: 36, excerpt: "The lineage of great souls and devotees..." },
    { chapter: 2, title: "Daksha Curses Lord Shiva", verses: 31, excerpt: "The conflict between Daksha and Lord Shiva..." },
    { chapter: 3, title: "Talks Between Lord Shiva and Sati", verses: 28, excerpt: "Divine conversation on duty and devotion..." },
  ],
  5: [
    { chapter: 1, title: "Activities of Maharaja Priyavrata", verses: 40, excerpt: "The great king's devotion and duties..." },
    { chapter: 2, title: "The Activities of Maharaja Agnidhra", verses: 33, excerpt: "Royal service in devotion to the Supreme..." },
    { chapter: 3, title: "Rsabhadeva's Teachings", verses: 38, excerpt: "Instructions on the goal of human life..." },
  ],
  6: [
    { chapter: 1, title: "The History of Ajamila", verses: 42, excerpt: "Redemption through the holy name..." },
    { chapter: 2, title: "Ajamila Delivered by Vishnu", verses: 36, excerpt: "The power of divine mercy and grace..." },
    { chapter: 3, title: "Yamaraja Instructs His Messengers", verses: 35, excerpt: "The principles of dharma and karma..." },
  ],
  7: [
    { chapter: 1, title: "The Supreme Lord is Equal to Everyone", verses: 38, excerpt: "Understanding the Lord's impartial nature..." },
    { chapter: 2, title: "Hiranyakashipu, King of the Demons", verses: 41, excerpt: "The story of the great demon king..." },
    { chapter: 3, title: "Hiranyakashipu's Plan to Become Immortal", verses: 39, excerpt: "Austerities performed for material gain..." },
  ],
  8: [
    { chapter: 1, title: "The Manus, Administrators of the Universe", verses: 33, excerpt: "The great souls who govern creation..." },
    { chapter: 2, title: "The Elephant Gajendra's Crisis", verses: 36, excerpt: "Surrender in the moment of greatest need..." },
    { chapter: 3, title: "Gajendra's Prayers of Surrender", verses: 32, excerpt: "The elephant's devotional prayers..." },
  ],
  9: [
    { chapter: 1, title: "King Sudyumna Becomes a Woman", verses: 35, excerpt: "The mysterious transformations of karma..." },
    { chapter: 2, title: "The Dynasties of the Sons of Manu", verses: 38, excerpt: "Great lineages of devotional kings..." },
    { chapter: 3, title: "The Marriage of Sukanya and Cyavana Muni", verses: 34, excerpt: "Divine union and spiritual transformation..." },
  ],
  10: [
    { chapter: 1, title: "The Advent of Lord Krishna", verses: 44, excerpt: "The Supreme Lord appears in this world..." },
    { chapter: 2, title: "Prayers by the Demigods", verses: 42, excerpt: "Celestial beings glorify the Lord's appearance..." },
    { chapter: 3, title: "The Birth of Lord Krishna", verses: 52, excerpt: "The most auspicious moment in history..." },
  ],
  11: [
    { chapter: 1, title: "The Curse Upon the Yadu Dynasty", verses: 38, excerpt: "The inevitable end of a great lineage..." },
    { chapter: 2, title: "Krishna and Uddhava", verses: 45, excerpt: "Final instructions before departure..." },
    { chapter: 3, title: "Liberation from the Illusory Energy", verses: 41, excerpt: "Transcending material existence..." },
  ],
  12: [
    { chapter: 1, title: "The Degraded Dynasties of Kali-yuga", verses: 40, excerpt: "The decline of civilization in the age of quarrel..." },
    { chapter: 2, title: "The Symptoms of Kali-yuga", verses: 38, excerpt: "Characteristics of the age of darkness..." },
    { chapter: 3, title: "The Bhumi-gita", verses: 36, excerpt: "The Earth's song of wisdom and detachment..." },
  ],
}

const cantoTitles: Record<number, string> = {
  1: "Creation and Cosmology",
  2: "The Cosmic Manifestation",
  3: "The Status Quo",
  4: "The Creation of the Fourth Order",
  5: "The Predominator of the Fruitive Results",
  6: "Prescribed Duties for Mankind",
  7: "The Science of God Realization",
  8: "Withdrawal of the Cosmic Creations",
  9: "Liberation",
  10: "The Pastimes of Lord Krishna",
  11: "The General History",
  12: "The Age of Deterioration",
}

export default function CantoPage({ params }: { params: Promise<{ canto: string }> }) {
  const [cantoNum, setCantoNum] = React.useState<number>(0)
  const [chapters, setChapters] = React.useState<Array<{ chapter: number; title: string; verses: number; excerpt: string }>>([])

  React.useEffect(() => {
    params.then(({ canto }) => {
      const num = Number.parseInt(canto)
      setCantoNum(num)
      // Try actual data first, then fallback
      setChapters(CHAPTERS_DATA_ACTUAL[num] || CHAPTERS_DATA_FALLBACK[num] || [])
    })
  }, [params])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="text-accent mb-2 font-semibold">Canto {cantoNum}</p>
            <h1 className="text-5xl font-serif text-foreground mb-4">{cantoTitles[cantoNum]}</h1>
            <p className="text-muted-foreground text-lg">{chapters.length} chapters exploring this sacred narrative</p>
          </motion.div>

          {/* Chapters Grid */}
          <div className="space-y-4">
            {chapters.length > 0 ? (
              chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.chapter}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="space-y-2">
                    <Link href={`/story/${cantoNum}/${chapter.chapter}`}>
                      <div className="group border border-border rounded-lg p-6 bg-card gold-glow-hover cursor-pointer transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-accent font-semibold mb-2">Chapter {chapter.chapter}</p>
                            <h3 className="text-xl font-serif text-foreground group-hover:text-accent transition mb-2">
                              {chapter.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">{chapter.excerpt}</p>
                            <p className="text-xs text-muted-foreground">{chapter.verses} verses</p>
                          </div>
                          <ChevronRight className="text-accent/50 group-hover:text-accent group-hover:translate-x-1 transition mt-1 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chapters coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

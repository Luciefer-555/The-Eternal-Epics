"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { BookmarksButton } from "@/components/bookmarks-button"
import { StoryClient } from "@/components/story-client"
import bhagavatamDataRaw from "@/srimad_bhagavatam.json"

// Type the imported data
const bhagavatamData = bhagavatamDataRaw as Array<{
  canto: number
  chapter: number
  title: string
  verses: Array<{ verse_number: number; text: string; url: string }>
}>

// Load actual verses from the dataset
const loadStoryData = () => {
  const storyData: Record<string, { title: string; verses: string[] }> = {}
  
  bhagavatamData.forEach((chapter) => {
    const key = `${chapter.canto}_${chapter.chapter}`
    storyData[key] = {
      title: chapter.title,
      verses: chapter.verses.map((v) => v.text.replace('Translation ', ''))
    }
  })
  
  return storyData
}

const STORY_DATA = loadStoryData()

// Fallback data for chapters not in the dataset
const FALLBACK_DATA: Record<string, { title: string; verses: string[] }> = {
  // Canto 1
  "1_1": {
    title: "Questions by the Sages",
    verses: [
      "O king, as we sit here on this sacred bank, we hear the divine word of the Lord, and our hearts become cleansed of all material desires.",
      "Through the teachings of the Vedas and the wisdom of the sages, we come to understand the nature of the eternal soul.",
      "In devotion to Lord Krishna, all suffering is overcome, and the soul finds its eternal home in the divine realm.",
      "The Supreme Lord, though unborn and eternal, appears in this world for the benefit of all living beings.",
      "By hearing and chanting the glories of the Lord, one attains liberation from the cycle of birth and death.",
    ],
  },
  "1_2": {
    title: "Divinity and Divine Service",
    verses: [
      "The service to the Lord is the highest form of existence, for in serving the Divine, we serve all of creation.",
      "Through bhakti, the heart opens to the infinite love that sustains all beings.",
      "The path of devotion is available to all, regardless of birth or circumstance.",
      "Pure devotional service is the natural occupation of the living entity and brings supreme bliss.",
    ],
  },
  "1_3": {
    title: "The Post-Incarnational Pastimes",
    verses: [
      "After the Lord's departure from this world, His devotees continue to spread His glories throughout the universe.",
      "The activities of the Lord and His devotees are transcendental and purify all who hear them.",
      "Even in separation, the devotees remain connected to the Lord through love and remembrance.",
    ],
  },
  // Canto 2
  "2_1": {
    title: "The First Step in God Realization",
    verses: [
      "The first step in spiritual realization is to understand that we are not this material body but eternal spirit souls.",
      "By engaging the senses in the service of the Lord, one gradually develops pure consciousness.",
      "The process of devotional service begins with hearing about the Supreme Lord from authorized sources.",
    ],
  },
  "2_2": {
    title: "The Cosmic Manifestation",
    verses: [
      "The entire cosmic creation is but a manifestation of the Lord's external energy.",
      "Within this material world, the Supreme Lord resides as the Supersoul in every living being.",
      "Understanding the Lord's role in creation leads to detachment from material existence.",
    ],
  },
  "2_3": {
    title: "Pure Devotional Service",
    verses: [
      "Pure devotional service is unmotivated and uninterrupted, free from all material desires.",
      "The devotee seeks only to please the Lord, without expectation of personal gain.",
      "Such devotion awakens the dormant love for God that lies within every heart.",
    ],
  },
  // Canto 3
  "3_1": {
    title: "Questions by Vidura",
    verses: [
      "Vidura, the great devotee, approached the sage Maitreya to inquire about the creation of the universe.",
      "O learned sage, please explain how the Supreme Lord manifests this cosmic creation.",
      "What is the nature of time, and how does it influence the material world?",
    ],
  },
  "3_2": {
    title: "Remembrance of Lord Krishna",
    verses: [
      "Constant remembrance of Lord Krishna purifies the heart and removes all material contamination.",
      "The Lord's pastimes are so attractive that they captivate even the greatest yogis and sages.",
      "By meditating on the Lord's form, qualities, and activities, one attains the supreme destination.",
    ],
  },
  "3_3": {
    title: "The Lord's Pastimes",
    verses: [
      "The Lord's pastimes in the material world are performed for the benefit of the conditioned souls.",
      "Though the Lord is beyond material nature, He appears to act like an ordinary human being.",
      "These divine activities are meant to attract the hearts of all living entities back to the spiritual realm.",
    ],
  },
  // Canto 4
  "4_1": {
    title: "Genealogical Table",
    verses: [
      "The great sages and devotees descend in various dynasties to maintain dharma in the world.",
      "Each generation of devotees carries forward the torch of spiritual knowledge.",
      "The lineage of pure devotees is more valuable than any material inheritance.",
    ],
  },
  "4_2": {
    title: "Daksha Curses Lord Shiva",
    verses: [
      "Daksha, blinded by false pride, insulted Lord Shiva in the assembly of great personalities.",
      "Unable to tolerate the disrespect shown to her husband, Sati decided to give up her body.",
      "This incident demonstrates the dangers of material pride and the importance of respecting all devotees.",
    ],
  },
  "4_3": {
    title: "Talks Between Lord Shiva and Sati",
    verses: [
      "Lord Shiva advised Sati not to attend her father's sacrifice, knowing she would be insulted.",
      "Sati, torn between duty to her father and loyalty to her husband, struggled with her decision.",
      "This conversation reveals the complexities of dharma and the supremacy of devotion to the Lord.",
    ],
  },
  // Canto 5
  "5_1": {
    title: "Activities of Maharaja Priyavrata",
    verses: [
      "Maharaja Priyavrata, though fully qualified for liberation, accepted the duties of a king at his father's request.",
      "He ruled the world with perfect justice while maintaining complete detachment from material enjoyment.",
      "His life exemplifies how one can perform worldly duties without becoming entangled in material consciousness.",
    ],
  },
  "5_2": {
    title: "The Activities of Maharaja Agnidhra",
    verses: [
      "Maharaja Agnidhra performed severe austerities to attain the association of celestial beings.",
      "His dedication to spiritual practice while fulfilling royal duties inspired his subjects.",
      "The king's life shows that material success and spiritual advancement can go hand in hand.",
    ],
  },
  "5_3": {
    title: "Rsabhadeva's Teachings",
    verses: [
      "Lord Rsabhadeva taught that human life is meant for austerity and spiritual realization, not sense gratification.",
      "One should not work hard like animals merely to maintain the body, which is destined to perish.",
      "The goal of human life is to revive our eternal relationship with the Supreme Lord.",
    ],
  },
  // Canto 6
  "6_1": {
    title: "The History of Ajamila",
    verses: [
      "Ajamila, though born in a pious family, fell into sinful life due to bad association.",
      "At the time of death, he called out the name of his son Narayana, which is also the Lord's name.",
      "The messengers of Vishnu appeared to save him from the messengers of Yamaraja.",
    ],
  },
  "6_2": {
    title: "Ajamila Delivered by Vishnu",
    verses: [
      "The Vishnudutas explained that chanting the Lord's name, even unknowingly, purifies all sins.",
      "Ajamila was given a second chance at life and became a great devotee.",
      "This story demonstrates the unlimited mercy of the Supreme Lord and the power of His holy name.",
    ],
  },
  "6_3": {
    title: "Yamaraja Instructs His Messengers",
    verses: [
      "Yamaraja told his servants never to approach the devotees of Lord Vishnu.",
      "The devotees of the Lord are beyond the jurisdiction of material laws and karma.",
      "True religion means surrendering to the Supreme Lord and following His instructions.",
    ],
  },
  // Canto 7
  "7_1": {
    title: "The Supreme Lord is Equal to Everyone",
    verses: [
      "The Lord does not favor anyone nor is He envious of anyone; He is equal to all.",
      "Those who worship Him with devotion receive His special mercy and protection.",
      "Material happiness and distress are results of one's own karma, not the Lord's partiality.",
    ],
  },
  "7_2": {
    title: "Hiranyakashipu, King of the Demons",
    verses: [
      "Hiranyakashipu, the powerful demon king, terrorized the three worlds with his strength.",
      "He harbored intense hatred for Lord Vishnu, who had killed his brother.",
      "Despite his power, he could not harm the devotees protected by the Lord.",
    ],
  },
  "7_3": {
    title: "Hiranyakashipu's Plan to Become Immortal",
    verses: [
      "The demon king performed severe austerities to obtain benedictions from Lord Brahma.",
      "He asked for protection from death in various circumstances, thinking he could become immortal.",
      "However, the Lord appeared as Nrsimhadeva in a form that circumvented all these conditions.",
    ],
  },
  // Canto 8
  "8_1": {
    title: "The Manus, Administrators of the Universe",
    verses: [
      "In each day of Brahma, fourteen Manus appear to govern the universe in succession.",
      "Each Manu is accompanied by great sages, demigods, and devotees who assist in universal management.",
      "The Manus ensure that dharma is maintained and that living entities have opportunities for spiritual advancement.",
    ],
  },
  "8_2": {
    title: "The Elephant Gajendra's Crisis",
    verses: [
      "Gajendra, the king of elephants, was attacked by a crocodile while bathing in a lake.",
      "After struggling for a thousand years, he realized that only the Supreme Lord could save him.",
      "In complete surrender, he called out to the Lord for protection.",
    ],
  },
  "8_3": {
    title: "Gajendra's Prayers of Surrender",
    verses: [
      "Gajendra offered beautiful prayers glorifying the Supreme Lord's transcendental qualities.",
      "He acknowledged his helplessness and complete dependence on the Lord's mercy.",
      "The Lord immediately appeared and delivered him from the crocodile, granting him liberation.",
    ],
  },
  // Canto 9
  "9_1": {
    title: "King Sudyumna Becomes a Woman",
    verses: [
      "King Sudyumna entered a forest where Lord Shiva was enjoying pastimes with his consort.",
      "Due to a curse, he and his companions were transformed into women.",
      "This story illustrates the mysterious workings of karma and divine will.",
    ],
  },
  "9_2": {
    title: "The Dynasties of the Sons of Manu",
    verses: [
      "The great dynasties of kings descended from Manu spread throughout the world.",
      "These royal families maintained dharma and protected the citizens with righteous governance.",
      "Many of these kings were great devotees who ruled according to spiritual principles.",
    ],
  },
  "9_3": {
    title: "The Marriage of Sukanya and Cyavana Muni",
    verses: [
      "Sukanya, though young and beautiful, faithfully served her elderly husband Cyavana Muni.",
      "The Ashvini-kumaras offered to make the sage young and handsome, testing Sukanya's devotion.",
      "She remained faithful to her husband, demonstrating the power of chastity and dedication.",
    ],
  },
  // Canto 10
  "10_1": {
    title: "The Advent of Lord Krishna",
    verses: [
      "When the earth became overburdened by demonic kings, the demigods prayed to Lord Vishnu for relief.",
      "The Supreme Lord agreed to descend to the earth in His original form as Lord Krishna.",
      "His appearance would bring joy to the devotees and destruction to the demons.",
    ],
  },
  "10_2": {
    title: "Prayers by the Demigods",
    verses: [
      "The demigods offered beautiful prayers glorifying the Lord's decision to appear on earth.",
      "They described His transcendental form, qualities, and pastimes that attract all living beings.",
      "The entire universe rejoiced at the news of the Lord's imminent appearance.",
    ],
  },
  "10_3": {
    title: "The Birth of Lord Krishna",
    verses: [
      "On the eighth day of the dark fortnight, at midnight, Lord Krishna appeared in the prison of Kamsa.",
      "Vasudeva and Devaki beheld the Lord's four-armed form before He assumed the appearance of a baby.",
      "The Lord's birth brought auspiciousness to the entire world and marked the beginning of His earthly pastimes.",
    ],
  },
  // Canto 11
  "11_1": {
    title: "The Curse Upon the Yadu Dynasty",
    verses: [
      "The Yadu dynasty, though protected by Lord Krishna, was cursed by sages to destroy itself.",
      "The Lord allowed this to happen as part of His plan to conclude His earthly pastimes.",
      "This demonstrates that even the Lord's associates must respect the words of great sages.",
    ],
  },
  "11_2": {
    title: "Krishna and Uddhava",
    verses: [
      "Before leaving this world, Lord Krishna imparted final instructions to His dear devotee Uddhava.",
      "These teachings, known as the Uddhava Gita, contain the essence of spiritual knowledge.",
      "The Lord explained the path of devotion and how to transcend material existence.",
    ],
  },
  "11_3": {
    title: "Liberation from the Illusory Energy",
    verses: [
      "The Lord explained how the living entity becomes entangled in material existence through false identification.",
      "By understanding one's true nature as spirit soul and engaging in devotional service, one attains liberation.",
      "The illusory energy has no power over those who take shelter of the Supreme Lord.",
    ],
  },
  // Canto 12
  "12_1": {
    title: "The Degraded Dynasties of Kali-yuga",
    verses: [
      "In the age of Kali, the royal dynasties will become degraded and lose their noble qualities.",
      "Kings will become like thieves, more interested in exploiting citizens than protecting them.",
      "The traditional values of dharma will gradually disappear from society.",
    ],
  },
  "12_2": {
    title: "The Symptoms of Kali-yuga",
    verses: [
      "In Kali-yuga, people will be short-lived, quarrelsome, lazy, and misguided.",
      "Religion, truthfulness, cleanliness, and mercy will decrease with each passing day.",
      "However, chanting the holy names of the Lord will remain the most effective spiritual practice.",
    ],
  },
  "12_3": {
    title: "The Bhumi-gita",
    verses: [
      "The Earth personified sings about the temporary nature of material possessions and relationships.",
      "She reminds us that everything in this world is transient and ultimately belongs to the Supreme Lord.",
      "True wisdom lies in detachment from material things and attachment to the eternal Supreme.",
    ],
  },
}

export default function StoryPage({
  params,
}: {
  params: Promise<{ canto: string; chapter: string }>
}) {
  const [canto, setCanto] = React.useState<string>("")
  const [chapter, setChapter] = React.useState<string>("")
  const [story, setStory] = React.useState<{ title: string; verses: string[] }>({ title: "Story", verses: ["Content coming soon..."] })
  const [bookmarkId, setBookmarkId] = React.useState<string>("")
  const [activeVerse, setActiveVerse] = React.useState<number | null>(null)

  React.useEffect(() => {
    params.then(({ canto: c, chapter: ch }) => {
      setCanto(c)
      setChapter(ch)
      const storyKey = `${c}_${ch}`
      // Try actual data first, then fallback data, then default
      setStory(STORY_DATA[storyKey] || FALLBACK_DATA[storyKey] || { title: "Story", verses: ["Content coming soon..."] })
      setBookmarkId(`story_${c}_${ch}`)
    })
  }, [params])

  React.useEffect(() => {
    if (activeVerse !== null) {
      document.getElementById(`verse-${activeVerse}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [activeVerse])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-accent mb-2 font-semibold">
              Canto {canto}, Chapter {chapter}
            </p>
            <h1 className="text-4xl font-serif text-foreground mb-6">{story.title}</h1>

            {/* Controls */}
            <div className="flex gap-3 flex-wrap">
              <BookmarksButton id={bookmarkId} showLabel />
            </div>
          </motion.div>

          {/* Client-side Interactive Content */}
          <StoryClient story={story} onCurrentVerseChange={setActiveVerse} />

          {/* Verses */}
          <div className="space-y-4">
            {story.verses.map((verse, index) => (
              <motion.div
                key={index}
                id={`verse-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={activeVerse === index ? "scroll-mt-28 rounded-lg ring-2 ring-accent shadow-[0_0_24px_rgba(212,175,55,0.2)]" : "scroll-mt-28"}
              >
                <div className="p-6 border border-border rounded-lg bg-card gold-glow">
                  <p className="text-sm text-accent font-semibold mb-3">Verse {index + 1}</p>
                  <p className="text-lg text-foreground leading-relaxed mb-3">{verse}</p>
                  <p className="text-xs text-muted-foreground italic">"[Sanskrit transliteration would appear here]"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

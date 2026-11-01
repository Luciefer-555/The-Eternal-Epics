import { type NextRequest, NextResponse } from "next/server"
import bhagavatamDataRaw from "@/srimad_bhagavatam.json"

type Verse = { verse_number: number; text: string }
type Chapter = { canto: number; chapter: number; title: string; verses: Verse[] }
type SearchResult = {
  id: string
  canto: number
  chapter: number
  title: string
  type: "chapter" | "verse"
  excerpt: string
  verseIndex?: number
}

const chapters = bhagavatamDataRaw as Chapter[]
const MAX_RESULTS = 50

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 100) || ""
  if (!query) return NextResponse.json({ results: [], total: 0 })

  const normalizedQuery = query.toLocaleLowerCase()
  const chapterMatches: SearchResult[] = []
  const verseMatches: SearchResult[] = []

  for (const chapter of chapters) {
    if (chapter.title.toLocaleLowerCase().includes(normalizedQuery)) {
      const firstVerse = chapter.verses[0]?.text.replace(/^Translation\s*/i, "") || "Read this chapter of the Śrīmad Bhāgavatam."
      chapterMatches.push({
        id: `chapter_${chapter.canto}_${chapter.chapter}`,
        canto: chapter.canto,
        chapter: chapter.chapter,
        title: chapter.title,
        type: "chapter",
        excerpt: firstVerse,
      })
    }

    chapter.verses.forEach((verse, verseIndex) => {
      const text = verse.text.replace(/^Translation\s*/i, "")
      if (!text.toLocaleLowerCase().includes(normalizedQuery)) return
      verseMatches.push({
        id: `verse_${chapter.canto}_${chapter.chapter}_${verse.verse_number}`,
        canto: chapter.canto,
        chapter: chapter.chapter,
        title: `Verse ${verse.verse_number} · ${chapter.title}`,
        type: "verse",
        excerpt: text,
        verseIndex,
      })
    })
  }

  const matches = [...chapterMatches, ...verseMatches]
  return NextResponse.json({ results: matches.slice(0, MAX_RESULTS), total: matches.length, limit: MAX_RESULTS })
}

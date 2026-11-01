import { type NextRequest, NextResponse } from "next/server"
import bhagavatamDataRaw from "@/srimad_bhagavatam.json"

type Chapter = { canto: number; chapter: number; title: string }
const chapters = bhagavatamDataRaw as Chapter[]
const chaptersByKey = new Map(chapters.map((chapter) => [`${chapter.canto}_${chapter.chapter}`, chapter]))

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== "object" || !Array.isArray((body as { ids?: unknown }).ids)) {
      return NextResponse.json({ error: "Bookmark IDs are required." }, { status: 400 })
    }

    const ids = (body as { ids: unknown[] }).ids
    if (ids.length > 500 || ids.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "Bookmark IDs are invalid." }, { status: 400 })
    }

    const items = ids.flatMap((id) => {
      const match = /^story_(\d+)_(\d+)$/.exec(id as string)
      if (!match) return []
      const canto = Number(match[1])
      const chapter = Number(match[2])
      const metadata = chaptersByKey.get(`${canto}_${chapter}`)
      return metadata ? [{ id, canto, chapter, title: metadata.title }] : []
    })

    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ error: "A JSON request body is required." }, { status: 400 })
  }
}

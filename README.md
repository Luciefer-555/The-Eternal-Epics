# Śrīmad Bhāgavatam — The Living Chronicle (Dark Edition)

A production-ready, dark-themed website for exploring the sacred Śrīmad Bhāgavatam with AI-powered voice narration and divine wisdom chat.

## Features

- **Dark Theme**: Pure black (#000000) background with gold (#d4af37) accents
- **Voice Narration**: Hume AI integration with three voice presets (Serene Monk, Bhakti Narrator, Epic Storyteller)
- **Sage Chat**: AI-powered Q&A with support for multiple LLM providers
- **Search**: Full-text search across verses and chapters
- **Bookmarks**: Save favorite stories locally in browser
- **Responsive Design**: Optimized for all screen sizes
- **Animations**: Smooth Framer Motion transitions and interactions

## Pages & Routes

- `/` - Home with hero and daily verse
- `/cantos` - Grid of 12 Cantos
- `/canto/[canto]` - Chapters for specific Canto
- `/story/[canto]/[chapter]` - Full story with verses
- `/gallery` - Pinterest-style image gallery
- `/ask` - Ask the Sage chat interface
- `/search` - Search verses and chapters
- `/bookmarks` - View saved stories

## API Routes

- `POST /api/narrate` - Generate audio narration via Hume AI
- `POST /api/sage` - Get responses from the Sage LLM

## Environment Variables

### Required: Hume AI Voice Narration
\`\`\`env
HUME_API_KEY=your_hume_api_key
HUME_VOICE_DEFAULT=serene_monk
\`\`\`

### Required: Sage AI LLM Provider
Choose one of the following configurations:

#### Option 1: OpenRouter (Recommended)
\`\`\`env
SAGE_PROVIDER=openrouter
SAGE_API_KEY=your_openrouter_api_key
SAGE_API_URL=https://openrouter.ai/api/v1
\`\`\`

#### Option 2: Ollama (Local)
\`\`\`env
SAGE_PROVIDER=ollama
SAGE_API_URL=http://localhost:11434
\`\`\`

#### Option 3: Replicate
\`\`\`env
SAGE_PROVIDER=replicate
SAGE_API_KEY=your_replicate_api_key
\`\`\`

#### Option 4: Custom Local Endpoint
\`\`\`env
SAGE_PROVIDER=local
SAGE_API_URL=http://localhost:8000
\`\`\`

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables in `.env.local`:
   \`\`\`bash
   HUME_API_KEY=xxx
   SAGE_PROVIDER=openrouter
   SAGE_API_KEY=xxx
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Data Structure

The app expects JSON data at `/data/srimad_bhagavatam.json` with the following structure:

\`\`\`json
{
  "cantos": [
    {
      "canto": 1,
      "title": "Creation and Cosmology",
      "description": "...",
      "chapters": [
        {
          "chapter": 1,
          "title": "Questions by the Sages",
          "verses": [
            { "verse": 1, "text": "...", "sanskrit": "..." }
          ]
        }
      ]
    }
  ]
}
\`\`\`

## Dependencies

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion
- **AI**: Hume AI (Voice), OpenRouter/Ollama (LLM)
- **Storage**: localStorage (bookmarks)

## Deployment

Deploy to Vercel with:
\`\`\`bash
vercel deploy
\`\`\`

Ensure all environment variables are set in Vercel project settings.

## Design System

- **Colors**: Pure black (#000000), light text (#f5f5f5), gold (#d4af37)
- **Fonts**: Zen Antique (headings/titles), Helvetica/Coolvetica (body text)
- **Animations**: Framer Motion with subtle easing
- **Accessibility**: High contrast ratios, keyboard navigation, screen reader support

## Notes

- Bookmarks are stored in browser localStorage
- Search is client-side (can be replaced with server-side for larger datasets)
- Audio narration quality depends on Hume API credits
- LLM responses are uncached (add caching layer as needed)

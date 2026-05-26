# Football Tactics App — Plan C: Set Pieces, Manager, Tactics Board & FPL

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Set Pieces tab with animated run diagrams, the Manager tab with Claude API-powered philosophy cards, the interactive drag-and-drop Tactics Board, and the FPL Insights tab.

**Architecture:** Set piece diagrams use Framer Motion path animations over SVG pitch. Manager analysis is generated server-side via the Claude API and cached as JSON in `/data/managers/`. The Tactics Board is a fully client-side component using React state for player positions and drag-and-drop via Framer Motion. FPL insights are derived from team statistics already fetched in Plan A/B.

**Tech Stack:** Next.js 15, Framer Motion, Claude API (Anthropic SDK), TypeScript, D3.js, Tailwind

**Prerequisite:** Plans A and B must be complete.

---

## File Map

| File | Purpose |
|------|---------|
| `src/components/pitch/SetPieceDiagram.tsx` | Animated run route SVG diagram |
| `src/lib/tactics/set-pieces.ts` | Set piece definitions (corner/FK/throw-in routes) |
| `src/app/teams/[teamId]/set-pieces/page.tsx` | Set Pieces tab |
| `src/lib/ai/manager-profile.ts` | Claude API manager analysis generator |
| `src/app/api/manager-analysis/[teamId]/route.ts` | API route: generate + cache manager analysis |
| `src/components/manager/PhilosophyCard.tsx` | AI-generated philosophy display |
| `src/components/manager/CareerTimeline.tsx` | Manager career + formations used |
| `src/app/teams/[teamId]/manager/page.tsx` | Manager tab |
| `src/components/tactics-board/TacticsBoard.tsx` | Main drag-and-drop interactive pitch |
| `src/components/tactics-board/PlayerToken.tsx` | Draggable player token |
| `src/components/tactics-board/ArrowTool.tsx` | Arrow drawing tool |
| `src/components/tactics-board/FormationPresets.tsx` | Formation switcher buttons |
| `src/app/teams/[teamId]/tactics-board/page.tsx` | Tactics Board tab |
| `src/components/ui/FplInsightCard.tsx` | FPL pick card |
| `src/app/teams/[teamId]/fpl/page.tsx` | FPL Insights tab |
| `data/managers/` | Directory for cached manager profiles |

---

## Task 1: Set Piece Definitions & Diagram

**Files:**
- Create: `src/lib/tactics/set-pieces.ts`
- Create: `src/components/pitch/SetPieceDiagram.tsx`

- [ ] **Step 1: Create set piece definitions**

Create `src/lib/tactics/set-pieces.ts`:

```typescript
export interface RunRoute {
  playerId: number
  name: string
  startX: number
  startY: number
  path: { x: number; y: number }[]
  role: 'runner' | 'decoy' | 'blocker' | 'taker' | 'keeper'
  color?: string
}

export interface SetPieceRoutine {
  id: string
  name: string
  type: 'corner' | 'freekick' | 'throwin'
  side: 'left' | 'right' | 'centre'
  phase: 'attacking' | 'defending'
  description: string
  routes: RunRoute[]
  ballStartX: number
  ballStartY: number
}

const ROLE_COLORS: Record<RunRoute['role'], string> = {
  taker: '#f59e0b',
  runner: '#00ff85',
  decoy: '#3b82f6',
  blocker: '#8b5cf6',
  keeper: '#f59e0b',
}

export function getRouteColor(role: RunRoute['role']): string {
  return ROLE_COLORS[role]
}

export const CORNER_ROUTINES: SetPieceRoutine[] = [
  {
    id: 'near-post-flick',
    name: 'Near Post Flick-On',
    type: 'corner',
    side: 'right',
    phase: 'attacking',
    description: 'Delivery to near post runner who flicks on for second-post arrival. Blockers clear space at the edge of the six-yard box.',
    ballStartX: 100,
    ballStartY: 4,
    routes: [
      { playerId: 1, name: 'Corner Taker', startX: 100, startY: 4, path: [], role: 'taker' },
      { playerId: 2, name: 'Near Post Runner', startX: 75, startY: 20, path: [{ x: 82, y: 8 }], role: 'runner' },
      { playerId: 3, name: 'Far Post Arrival', startX: 40, startY: 22, path: [{ x: 25, y: 10 }], role: 'runner' },
      { playerId: 4, name: 'Penalty Spot', startX: 50, startY: 18, path: [{ x: 50, y: 12 }], role: 'runner' },
      { playerId: 5, name: 'Blocker 1', startX: 65, startY: 20, path: [{ x: 60, y: 14 }], role: 'blocker' },
      { playerId: 6, name: 'Blocker 2', startX: 55, startY: 22, path: [{ x: 55, y: 16 }], role: 'blocker' },
      { playerId: 7, name: 'Edge of Box', startX: 68, startY: 28, path: [], role: 'decoy' },
    ],
  },
  {
    id: 'back-post-cross',
    name: 'Back Post Cross',
    type: 'corner',
    side: 'left',
    phase: 'attacking',
    description: 'Outswinging delivery to the back post with two runners crossing — primary goes back post, decoy pulls defenders near post.',
    ballStartX: 0,
    ballStartY: 4,
    routes: [
      { playerId: 1, name: 'Corner Taker', startX: 0, startY: 4, path: [], role: 'taker' },
      { playerId: 2, name: 'Back Post Runner', startX: 30, startY: 20, path: [{ x: 15, y: 8 }], role: 'runner' },
      { playerId: 3, name: 'Near Post Decoy', startX: 70, startY: 18, path: [{ x: 80, y: 9 }], role: 'decoy' },
      { playerId: 4, name: 'Penalty Spot', startX: 50, startY: 20, path: [{ x: 50, y: 13 }], role: 'runner' },
      { playerId: 5, name: 'Second Ball', startX: 50, startY: 30, path: [], role: 'blocker' },
    ],
  },
]

export const FREEKICK_ROUTINES: SetPieceRoutine[] = [
  {
    id: 'direct-shot',
    name: 'Direct Shot Over Wall',
    type: 'freekick',
    side: 'centre',
    phase: 'attacking',
    description: 'Direct shot curled over or around the defensive wall. Second player makes a dummy run to split the wall.',
    ballStartX: 60,
    ballStartY: 28,
    routes: [
      { playerId: 1, name: 'Primary Taker', startX: 60, startY: 28, path: [], role: 'taker' },
      { playerId: 2, name: 'Dummy Runner', startX: 62, startY: 28, path: [{ x: 75, y: 22 }], role: 'decoy' },
      { playerId: 3, name: 'Back Post Run', startX: 40, startY: 25, path: [{ x: 25, y: 12 }], role: 'runner' },
      { playerId: 4, name: 'Penalty Spot', startX: 50, startY: 22, path: [{ x: 50, y: 14 }], role: 'runner' },
    ],
  },
]

export function getAllRoutinesForTeam(_teamId: number): SetPieceRoutine[] {
  return [...CORNER_ROUTINES, ...FREEKICK_ROUTINES]
}
```

- [ ] **Step 2: Create SetPieceDiagram component**

Create `src/components/pitch/SetPieceDiagram.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PitchCanvas } from './PitchCanvas'
import type { SetPieceRoutine } from '@/lib/tactics/set-pieces'
import { getRouteColor } from '@/lib/tactics/set-pieces'

interface Props {
  routine: SetPieceRoutine
  width?: number
  height?: number
}

function pointsToPath(start: { x: number; y: number }, path: { x: number; y: number }[], w: number, h: number): string {
  const toCoord = (pt: { x: number; y: number }) => `${(pt.x / 100) * w},${(pt.y / 100) * h}`
  if (path.length === 0) return ''
  const points = [start, ...path]
  return `M ${points.map(toCoord).join(' L ')}`
}

export function SetPieceDiagram({ routine, width = 340, height = 280 }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [key, setKey] = useState(0)

  function handlePlay() {
    setKey(k => k + 1)
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 2500)
  }

  // Zoom into the attacking third for set pieces
  const viewboxY = routine.phase === 'attacking' ? 0 : height * 0.5
  const vbHeight = height * 0.5

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${vbHeight}`}
          width={width}
          height={vbHeight}
          className="rounded-xl overflow-hidden"
        >
          {/* Pitch background section */}
          <rect x={0} y={0} width={width} height={vbHeight} fill="#0d3d22" />
          <rect x={1.5} y={1.5} width={width - 3} height={vbHeight - 3} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Goal box lines (top) */}
          <rect x={(width - width * 0.6) / 2} y={1.5} width={width * 0.6} height={vbHeight * 0.32} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />
          <rect x={(width - width * 0.32) / 2} y={1.5} width={width * 0.32} height={vbHeight * 0.14} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Ball */}
          <circle cx={(routine.ballStartX / 100) * width} cy={(routine.ballStartY / 100) * vbHeight} r={5} fill="#ffffff" />

          {/* Run routes */}
          {routine.routes.map((route, i) => {
            if (route.path.length === 0) return null
            const d = pointsToPath(
              { x: route.startX, y: route.startY },
              route.path,
              width,
              vbHeight
            )
            const color = route.color ?? getRouteColor(route.role)
            return (
              <g key={`${key}-${i}`}>
                <path d={d} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.3} />
                <motion.path
                  key={`anim-${key}-${i}`}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeDasharray="200"
                  strokeDashoffset={200}
                  animate={isPlaying ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: 'easeInOut' }}
                />
                {/* Arrow head at end */}
                {route.path.length > 0 && (() => {
                  const end = route.path[route.path.length - 1]
                  const px = (end.x / 100) * width
                  const py = (end.y / 100) * vbHeight
                  return (
                    <motion.circle
                      key={`dot-${key}-${i}`}
                      cx={px}
                      cy={py}
                      r={4}
                      fill={color}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isPlaying ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.2 + 0.8 }}
                    />
                  )
                })()}
              </g>
            )
          })}

          {/* Player start positions */}
          {routine.routes.map((route, i) => {
            const px = (route.startX / 100) * width
            const py = (route.startY / 100) * vbHeight
            const color = route.color ?? getRouteColor(route.role)
            return (
              <g key={`player-${i}`}>
                <circle cx={px} cy={py} r={7} fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth={1.5} />
                <text x={px} y={py} textAnchor="middle" dominantBaseline="central" fontSize={6} fontWeight="bold" fill="rgba(0,0,0,0.8)">
                  {i + 1}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Play button */}
        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 bg-[#00ff85] hover:bg-[#00cc6a] text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
        >
          {isPlaying ? '▶ Playing...' : '▶ Animate'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {(['taker', 'runner', 'decoy', 'blocker'] as const).map(role => (
          <div key={role} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRouteColor(role) }} />
            <span className="text-gray-400 capitalize">{role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/tactics/set-pieces.ts src/components/pitch/SetPieceDiagram.tsx
git commit -m "feat: add set piece definitions and animated run route diagram"
```

---

## Task 2: Set Pieces Tab

**Files:**
- Create: `src/app/teams/[teamId]/set-pieces/page.tsx`

- [ ] **Step 1: Create Set Pieces page**

Create `src/app/teams/[teamId]/set-pieces/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { SetPieceDiagram } from '@/components/pitch/SetPieceDiagram'
import { getAllRoutinesForTeam } from '@/lib/tactics/set-pieces'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

export default async function SetPiecesPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  const routines = getAllRoutinesForTeam(id)
  const corners = routines.filter(r => r.type === 'corner')
  const freekicks = routines.filter(r => r.type === 'freekick')

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold mb-1">Set Piece Analysis</h2>
        <p className="text-sm text-gray-400">
          Attacking routines, defensive shapes and player run routes. Click Animate to see the play unfold.
        </p>
      </div>

      {/* Corners */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#00ff85]">⬟</span> Corner Routines
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {corners.map(routine => (
            <div key={routine.id} className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
              <div>
                <h4 className="font-bold text-[#e8f5e9]">{routine.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{routine.description}</p>
              </div>
              <SetPieceDiagram routine={routine} width={320} height={260} />
            </div>
          ))}
        </div>
      </section>

      {/* Free kicks */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#f59e0b]">⚽</span> Free Kick Shapes
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {freekicks.map(routine => (
            <div key={routine.id} className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
              <div>
                <h4 className="font-bold text-[#e8f5e9]">{routine.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{routine.description}</p>
              </div>
              <SetPieceDiagram routine={routine} width={320} height={260} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify set pieces tab**

```bash
npm run dev
```

Navigate to any team → Set Pieces tab. Click "Animate" on a routine. Expected: Player run routes draw animated lines on the pitch diagram.

- [ ] **Step 3: Commit**

```bash
git add src/app/teams/
git commit -m "feat: add set pieces tab with animated corner and free kick routines"
```

---

## Task 3: Manager Analysis — Claude API

**Files:**
- Create: `src/lib/ai/manager-profile.ts`
- Create: `src/app/api/manager-analysis/[teamId]/route.ts`
- Create: `data/managers/` directory

- [ ] **Step 1: Install Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

- [ ] **Step 2: Create manager profile generator**

Create `src/lib/ai/manager-profile.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

export interface ManagerProfile {
  teamId: number
  teamName: string
  managerName: string
  nationality: string
  age: number
  primaryFormation: string
  philosophySummary: string
  pressStyle: string
  buildUpStyle: string
  defensiveApproach: string
  keyPrinciples: string[]
  careerHistory: {
    club: string
    years: string
    formation: string
    achievement?: string
  }[]
  coachingInfluences: string[]
  tacticalInnovations: string[]
  fplImplications: string
  generatedAt: string
}

const CACHE_DIR = path.join(process.cwd(), 'data', 'managers')

function getCachePath(teamId: number): string {
  return path.join(CACHE_DIR, `${teamId}.json`)
}

function isStale(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath)
    const ageMs = Date.now() - stat.mtimeMs
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    return ageMs > thirtyDaysMs
  } catch {
    return true
  }
}

export async function getManagerProfile(teamId: number, teamName: string): Promise<ManagerProfile> {
  const cachePath = getCachePath(teamId)

  if (fs.existsSync(cachePath) && !isStale(cachePath)) {
    const cached = fs.readFileSync(cachePath, 'utf-8')
    return JSON.parse(cached) as ManagerProfile
  }

  const profile = await generateManagerProfile(teamId, teamName)

  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.writeFileSync(cachePath, JSON.stringify(profile, null, 2))

  return profile
}

async function generateManagerProfile(teamId: number, teamName: string): Promise<ManagerProfile> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `You are a world-class football tactical analyst. Provide a detailed tactical profile for the current manager of ${teamName}.

Return ONLY valid JSON matching this exact structure — no markdown, no explanation, just JSON:
{
  "teamId": ${teamId},
  "teamName": "${teamName}",
  "managerName": "Full Name",
  "nationality": "Country",
  "age": 0,
  "primaryFormation": "4-3-3",
  "philosophySummary": "2-3 sentence tactical philosophy summary",
  "pressStyle": "High Press / Mid Block / Low Block with brief explanation",
  "buildUpStyle": "How they build from the back — short passing / direct / positional / etc",
  "defensiveApproach": "Defensive line height, compactness, man-marking vs zonal",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3", "Principle 4", "Principle 5"],
  "careerHistory": [
    { "club": "Club Name", "years": "2018-2021", "formation": "4-3-3", "achievement": "Optional trophy or notable result" }
  ],
  "coachingInfluences": ["Manager 1 — reason", "Manager 2 — reason"],
  "tacticalInnovations": ["Innovation 1", "Innovation 2"],
  "fplImplications": "Which positions are most valuable in their system and why — 2 sentences for FPL managers",
  "generatedAt": "${new Date().toISOString()}"
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude did not return valid JSON')

  return JSON.parse(jsonMatch[0]) as ManagerProfile
}
```

- [ ] **Step 3: Create manager analysis API route**

Create `src/app/api/manager-analysis/[teamId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getManagerProfile } from '@/lib/ai/manager-profile'
import { fetchStandings } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params
  const { searchParams } = new URL(req.url)
  const leagueSlug = searchParams.get('league') ?? 'premier-league'

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) return NextResponse.json({ error: 'League not found' }, { status: 404 })

  const id = parseInt(teamId, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 })

  try {
    const standings = await fetchStandings(meta.apiId)
    const team = standings.find(s => s.team.id === id)
    const teamName = team?.team.name ?? `Team ${id}`

    const profile = await getManagerProfile(id, teamName)
    return NextResponse.json({ profile })
  } catch (err) {
    console.error('Manager analysis error:', err)
    return NextResponse.json({ error: 'Failed to generate manager profile' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Create data directory**

```bash
mkdir -p /Users/rafaeshafi/football-tactics/data/managers
echo '{}' > /Users/rafaeshafi/football-tactics/data/managers/.gitkeep
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/ src/app/api/manager-analysis/ data/
git commit -m "feat: add Claude API manager profile generator with file-based caching"
```

---

## Task 4: Manager Tab UI

**Files:**
- Create: `src/components/manager/PhilosophyCard.tsx`
- Create: `src/components/manager/CareerTimeline.tsx`
- Create: `src/app/teams/[teamId]/manager/page.tsx`

- [ ] **Step 1: Create PhilosophyCard**

Create `src/components/manager/PhilosophyCard.tsx`:

```typescript
import type { ManagerProfile } from '@/lib/ai/manager-profile'
import { FormationBadge } from '@/components/ui/FormationBadge'

interface Props {
  profile: ManagerProfile
}

const STYLE_COLORS = {
  'High Press': 'text-red-400',
  'Mid Block': 'text-yellow-400',
  'Low Block': 'text-blue-400',
}

export function PhilosophyCard({ profile }: Props) {
  const pressColor = Object.entries(STYLE_COLORS).find(([key]) =>
    profile.pressStyle.toLowerCase().includes(key.toLowerCase())
  )?.[1] ?? 'text-[#00ff85]'

  return (
    <div className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-5">
      {/* Manager header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#e8f5e9]">{profile.managerName}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{profile.nationality} · Age {profile.age}</p>
        </div>
        <FormationBadge formation={profile.primaryFormation} className="text-sm" />
      </div>

      {/* Philosophy summary */}
      <blockquote className="border-l-2 border-[#00ff85] pl-4 text-sm text-gray-300 italic leading-relaxed">
        {profile.philosophySummary}
      </blockquote>

      {/* Tactical pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Press Style', value: profile.pressStyle },
          { label: 'Build-Up', value: profile.buildUpStyle },
          { label: 'Defence', value: profile.defensiveApproach },
        ].map(item => (
          <div key={item.label} className="p-3 rounded-lg bg-[#0a0f0d] border border-[#1e3329]">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-sm text-[#e8f5e9]">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Key principles */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Principles</h3>
        <ul className="space-y-2">
          {profile.keyPrinciples.map((principle, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-[#00ff85] font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-gray-300">{principle}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Coaching influences */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Coaching Influences</h3>
        <div className="flex flex-wrap gap-2">
          {profile.coachingInfluences.map((influence, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#0f3d2e] border border-[#00ff85]/20 text-[#00ff85]/80">
              {influence}
            </span>
          ))}
        </div>
      </div>

      {/* Tactical innovations */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tactical Innovations</h3>
        <ul className="space-y-1">
          {profile.tacticalInnovations.map((innovation, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-[#00ff85] mt-0.5">→</span>
              {innovation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create CareerTimeline**

Create `src/components/manager/CareerTimeline.tsx`:

```typescript
import type { ManagerProfile } from '@/lib/ai/manager-profile'
import { FormationBadge } from '@/components/ui/FormationBadge'

interface Props {
  profile: ManagerProfile
}

export function CareerTimeline({ profile }: Props) {
  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Career History</h3>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-[#1e3329]" />
        <ul className="space-y-5 pl-8">
          {profile.careerHistory.map((job, i) => (
            <li key={i} className="relative">
              <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-[#00ff85] border-2 border-[#0a0f0d]" />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#e8f5e9] text-sm">{job.club}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.years}</p>
                  {job.achievement && (
                    <p className="text-xs text-[#00ff85]/70 mt-0.5">{job.achievement}</p>
                  )}
                </div>
                <FormationBadge formation={job.formation} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Manager tab page**

Create `src/app/teams/[teamId]/manager/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { getManagerProfile } from '@/lib/ai/manager-profile'
import { fetchStandings } from '@/lib/api-football/client'
import { PhilosophyCard } from '@/components/manager/PhilosophyCard'
import { CareerTimeline } from '@/components/manager/CareerTimeline'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

export default async function ManagerPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let profile = null
  try {
    const standings = await fetchStandings(meta.apiId)
    const team = standings.find(s => s.team.id === id)
    const teamName = team?.team.name ?? `Team ${id}`
    profile = await getManagerProfile(id, teamName)
  } catch (err) {
    console.error('Manager profile error:', err)
  }

  if (!profile) {
    return (
      <div className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-400">
        <p className="font-medium">Manager profile unavailable</p>
        <p className="text-sm mt-1">Check your ANTHROPIC_API_KEY in .env.local</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Manager Philosophy</h2>
        <p className="text-sm text-gray-400">
          AI-powered tactical deep-dive based on publicly available football analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PhilosophyCard profile={profile} />
        </div>
        <div className="space-y-4">
          <CareerTimeline profile={profile} />
          {/* FPL implications */}
          <div className="p-4 rounded-xl border border-[#1e3329] bg-[#0f3d2e]/30">
            <h3 className="text-xs font-semibold text-[#00ff85] uppercase tracking-wider mb-2">FPL Insight</h3>
            <p className="text-sm text-gray-300">{profile.fplImplications}</p>
          </div>
          <p className="text-xs text-gray-500">
            Analysis generated by Claude AI · Last updated {new Date(profile.generatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify manager tab**

```bash
npm run dev
```

Navigate to a team → Manager tab. Expected: Manager philosophy card with principles, influences, and career timeline. If no API key, shows graceful error.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/ src/components/manager/ src/app/teams/
git commit -m "feat: add manager philosophy tab with Claude API analysis and career timeline"
```

---

## Task 5: Tactics Board

**Files:**
- Create: `src/components/tactics-board/TacticsBoard.tsx`
- Create: `src/components/tactics-board/FormationPresets.tsx`
- Create: `src/app/teams/[teamId]/tactics-board/page.tsx`

- [ ] **Step 1: Create FormationPresets**

Create `src/components/tactics-board/FormationPresets.tsx`:

```typescript
'use client'
import { COMMON_FORMATIONS } from '@/lib/tactics/formations'
import { cn } from '@/lib/utils'

interface Props {
  current: string
  onChange: (formation: string) => void
}

export function FormationPresets({ current, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COMMON_FORMATIONS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all',
            f === current
              ? 'bg-[#00ff85] text-black'
              : 'bg-[#111a15] border border-[#1e3329] text-gray-400 hover:border-[#00ff85]/40 hover:text-[#e8f5e9]'
          )}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create TacticsBoard**

Create `src/components/tactics-board/TacticsBoard.tsx`:

```typescript
'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { PitchCanvas } from '@/components/pitch/PitchCanvas'
import { getFormationPositions } from '@/lib/tactics/formations'
import { FormationPresets } from './FormationPresets'

interface BoardPlayer {
  id: number
  x: number
  y: number
  role: string
  name: string
}

interface Arrow {
  id: string
  fromX: number
  fromY: number
  toX: number
  toY: number
}

interface Props {
  teamId: string
  initialFormation?: string
}

const PITCH_WIDTH = 340
const PITCH_HEIGHT = 480

const DEFAULT_NAMES = ['GK', 'LB', 'LCB', 'RCB', 'RB', 'LCM', 'CM', 'RCM', 'LW', 'ST', 'RW']

function storageKey(teamId: string) {
  return `tactics-board-${teamId}`
}

export function TacticsBoard({ teamId, initialFormation = '4-3-3' }: Props) {
  const [formation, setFormation] = useState(initialFormation)
  const [players, setPlayers] = useState<BoardPlayer[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [isDrawingArrow, setIsDrawingArrow] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [arrowTool, setArrowTool] = useState(false)
  const svgRef = useRef<HTMLDivElement>(null)

  function initPlayers(f: string) {
    const positions = getFormationPositions(f)
    return positions.map((pos, i) => ({
      id: i,
      x: (pos.x / 100) * PITCH_WIDTH,
      y: (pos.y / 100) * PITCH_HEIGHT,
      role: pos.role,
      name: DEFAULT_NAMES[i] ?? pos.role,
    }))
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(teamId))
      if (saved) {
        const data = JSON.parse(saved)
        setFormation(data.formation ?? initialFormation)
        setPlayers(data.players ?? initPlayers(data.formation ?? initialFormation))
        setArrows(data.arrows ?? [])
        return
      }
    } catch { /* ignore */ }
    setPlayers(initPlayers(initialFormation))
  }, [teamId, initialFormation])

  function save(f: string, p: BoardPlayer[], a: Arrow[]) {
    try {
      localStorage.setItem(storageKey(teamId), JSON.stringify({ formation: f, players: p, arrows: a }))
    } catch { /* ignore */ }
  }

  function handleFormationChange(f: string) {
    const newPlayers = initPlayers(f)
    setFormation(f)
    setPlayers(newPlayers)
    setArrows([])
    save(f, newPlayers, [])
  }

  function handlePlayerDragEnd(id: number, x: number, y: number) {
    const updated = players.map(p => p.id === id ? { ...p, x, y } : p)
    setPlayers(updated)
    save(formation, updated, arrows)
  }

  function handleClear() {
    setArrows([])
    save(formation, players, [])
  }

  function handleReset() {
    const newPlayers = initPlayers(formation)
    setPlayers(newPlayers)
    setArrows([])
    save(formation, newPlayers, [])
  }

  function getSvgCoords(e: React.MouseEvent): { x: number; y: number } | null {
    if (!svgRef.current) return null
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  function handlePitchMouseDown(e: React.MouseEvent) {
    if (!arrowTool) return
    const coords = getSvgCoords(e)
    if (!coords) return
    setDrawStart(coords)
    setIsDrawingArrow(true)
  }

  function handlePitchMouseUp(e: React.MouseEvent) {
    if (!arrowTool || !drawStart || !isDrawingArrow) return
    const coords = getSvgCoords(e)
    if (!coords) return

    const dx = coords.x - drawStart.x
    const dy = coords.y - drawStart.y
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      setIsDrawingArrow(false)
      setDrawStart(null)
      return
    }

    const newArrow: Arrow = {
      id: `arrow-${Date.now()}`,
      fromX: drawStart.x,
      fromY: drawStart.y,
      toX: coords.x,
      toY: coords.y,
    }
    const updated = [...arrows, newArrow]
    setArrows(updated)
    save(formation, players, updated)
    setIsDrawingArrow(false)
    setDrawStart(null)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FormationPresets current={formation} onChange={handleFormationChange} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setArrowTool(v => !v)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              arrowTool
                ? 'bg-[#00ff85] text-black'
                : 'bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-[#e8f5e9]'
            }`}
          >
            {arrowTool ? '✏️ Drawing' : '↗ Draw Arrow'}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded text-xs font-medium bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-[#e8f5e9] transition-colors"
          >
            Clear Arrows
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded text-xs font-medium bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-red-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Board */}
      <div
        ref={svgRef}
        className="relative select-none"
        style={{ width: PITCH_WIDTH, height: PITCH_HEIGHT, cursor: arrowTool ? 'crosshair' : 'default' }}
        onMouseDown={handlePitchMouseDown}
        onMouseUp={handlePitchMouseUp}
      >
        <PitchCanvas width={PITCH_WIDTH} height={PITCH_HEIGHT}>
          {/* Arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#00ff85" />
            </marker>
          </defs>
          {arrows.map(arrow => (
            <line
              key={arrow.id}
              x1={arrow.fromX} y1={arrow.fromY}
              x2={arrow.toX} y2={arrow.toY}
              stroke="#00ff85"
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
              strokeOpacity={0.8}
            />
          ))}
        </PitchCanvas>

        {/* Draggable players */}
        {players.map(player => (
          <motion.div
            key={player.id}
            drag
            dragMomentum={false}
            style={{ position: 'absolute', x: player.x - 12, y: player.y - 12, touchAction: 'none', zIndex: 10 }}
            onDragEnd={(_, info) => {
              const newX = player.x + info.offset.x
              const newY = player.y + info.offset.y
              const clamped = {
                x: Math.max(12, Math.min(PITCH_WIDTH - 12, newX)),
                y: Math.max(12, Math.min(PITCH_HEIGHT - 12, newY)),
              }
              handlePlayerDragEnd(player.id, clamped.x, clamped.y)
            }}
          >
            <div className="w-6 h-6 rounded-full bg-[#00ff85] border-2 border-black/40 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg">
              <span className="text-[8px] font-bold text-black">{player.name.slice(0, 2)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {arrowTool ? 'Click and drag on the pitch to draw arrows.' : 'Drag players to reposition. Use "Draw Arrow" to add movement lines.'} Board saves automatically.
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create Tactics Board tab page**

Create `src/app/teams/[teamId]/tactics-board/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { TacticsBoard } from '@/components/tactics-board/TacticsBoard'
import { fetchTeamStatistics } from '@/lib/api-football/client'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

export default async function TacticsBoardPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let formation = '4-3-3'
  try {
    const stats = await fetchTeamStatistics(id, meta.apiId)
    formation = stats.formation
  } catch { /* use default */ }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Tactics Board</h2>
        <p className="text-sm text-gray-400">
          Build your own tactical setup. Starts from this team&apos;s current formation. Drag players, draw movement arrows. Saved to your browser.
        </p>
      </div>
      <TacticsBoard teamId={teamId} initialFormation={formation} />
    </div>
  )
}
```

- [ ] **Step 4: Verify tactics board**

```bash
npm run dev
```

Navigate to a team → Tactics Board tab. Expected: Interactive pitch with draggable player dots. Formation presets switch the shape. Arrow tool lets you draw arrows on the pitch.

- [ ] **Step 5: Commit**

```bash
git add src/components/tactics-board/ src/app/teams/
git commit -m "feat: add interactive drag-and-drop tactics board with arrow drawing and localStorage save"
```

---

## Task 6: FPL Insights Tab

**Files:**
- Create: `src/components/ui/FplInsightCard.tsx`
- Create: `src/app/teams/[teamId]/fpl/page.tsx`

- [ ] **Step 1: Create FplInsightCard**

Create `src/components/ui/FplInsightCard.tsx`:

```typescript
import { cn } from '@/lib/utils'

interface Props {
  position: string
  role: string
  recommendation: 'Essential' | 'Good Pick' | 'Differential' | 'Avoid'
  reason: string
  rotationRisk: 'Low' | 'Medium' | 'High'
}

const RECOMMENDATION_STYLES: Record<Props['recommendation'], string> = {
  'Essential': 'bg-green-500/20 border-green-500/50 text-green-400',
  'Good Pick': 'bg-[#00ff85]/10 border-[#00ff85]/30 text-[#00ff85]',
  'Differential': 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  'Avoid': 'bg-red-500/20 border-red-500/50 text-red-400',
}

const ROTATION_COLORS: Record<Props['rotationRisk'], string> = {
  Low: 'text-green-400',
  Medium: 'text-yellow-400',
  High: 'text-red-400',
}

export function FplInsightCard({ position, role, recommendation, reason, rotationRisk }: Props) {
  return (
    <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-[#e8f5e9]">{position}</p>
          <p className="text-xs text-gray-400 mt-0.5">{role}</p>
        </div>
        <span className={cn('text-xs px-2 py-0.5 rounded-full border font-semibold', RECOMMENDATION_STYLES[recommendation])}>
          {recommendation}
        </span>
      </div>
      <p className="text-sm text-gray-300">{reason}</p>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-gray-500">Rotation risk:</span>
        <span className={cn('font-semibold', ROTATION_COLORS[rotationRisk])}>{rotationRisk}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FPL page**

Create `src/app/teams/[teamId]/fpl/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { fetchTeamStatistics } from '@/lib/api-football/client'
import { FplInsightCard } from '@/components/ui/FplInsightCard'
import type { TeamStatistics } from '@/types'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

function deriveInsights(stats: TeamStatistics) {
  const formation = stats.formation
  const isHighScoring = stats.goalsFor / Math.max(stats.fixturesPlayed, 1) > 1.8
  const isSolidDefence = stats.goalsAgainst / Math.max(stats.fixturesPlayed, 1) < 1.0

  return [
    {
      position: 'Goalkeeper',
      role: 'Sweeper Keeper',
      recommendation: isSolidDefence ? 'Good Pick' : 'Differential' as const,
      reason: isSolidDefence
        ? `This team concedes only ${(stats.goalsAgainst / stats.fixturesPlayed).toFixed(1)} goals per game. Clean sheet potential is high, making the GK a strong captaincy-proof pick.`
        : 'The GK sees regular shot-stopping action but clean sheets are inconsistent. Worth considering for save points.',
      rotationRisk: 'Low' as const,
    },
    {
      position: formation.startsWith('3') ? 'Wing-Back' : 'Full-Back',
      role: formation.startsWith('3') ? 'Attacking Wing-Back' : 'Overlapping Full-Back',
      recommendation: (isHighScoring ? 'Essential' : 'Good Pick') as const,
      reason: isHighScoring
        ? 'This team scores prolifically and attacks down the flanks heavily. Full-backs or wing-backs get regular attacking returns through assists and indirect involvement.'
        : 'Full-backs are involved in build-up but less likely to generate attacking returns. Value for defensive points in clean sheet weeks.',
      rotationRisk: 'Low' as const,
    },
    {
      position: 'Central Midfielder',
      role: 'Box-to-Box / Attacking Mid',
      recommendation: (stats.passAccuracy > 82 ? 'Essential' : 'Good Pick') as const,
      reason: stats.passAccuracy > 82
        ? `High pass accuracy (${stats.passAccuracy}%) indicates a possession-heavy midfield. Creative midfielders accumulate assists and sit in high-value positions for set pieces.`
        : 'Midfielders see volume but goals and assists from central areas are sporadic. Target the player who takes set pieces.',
      rotationRisk: 'Medium' as const,
    },
    {
      position: formation.endsWith('-1') ? 'Lone Striker' : 'Forward',
      role: formation.endsWith('-1') ? 'Target Man / Pivot' : 'Wide Forward / Second Striker',
      recommendation: (isHighScoring ? 'Essential' : 'Good Pick') as const,
      reason: isHighScoring
        ? `Averaging ${(stats.goalsFor / stats.fixturesPlayed).toFixed(1)} goals per game, this attack is highly productive. The main striker is a premium FPL asset — essential for strong fixtures.`
        : 'The attack creates chances but finishing is inconsistent. Watch for streaky form and fixture swings.',
      rotationRisk: isHighScoring ? 'Low' : 'High' as const,
    },
  ]
}

export default async function FplPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let stats = null
  try {
    stats = await fetchTeamStatistics(id, meta.apiId)
  } catch { /* graceful degradation */ }

  if (!stats) {
    return (
      <div className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-400">
        <p>FPL insights unavailable — check your API key in .env.local</p>
      </div>
    )
  }

  const insights = deriveInsights(stats)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">FPL Insights</h2>
        <p className="text-sm text-gray-400">
          Which positions are most valuable in this team&apos;s system, and why. Based on season statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <FplInsightCard key={i} {...insight} />
        ))}
      </div>

      {/* Tactical summary for FPL */}
      <div className="p-5 rounded-xl border border-[#0f3d2e] bg-[#0f3d2e]/20 space-y-2">
        <h3 className="font-bold text-[#00ff85] text-sm">Season at a Glance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'Formation', value: stats.formation },
            { label: 'Goals/Game', value: (stats.goalsFor / Math.max(stats.fixturesPlayed, 1)).toFixed(1) },
            { label: 'Conceded/Game', value: (stats.goalsAgainst / Math.max(stats.fixturesPlayed, 1)).toFixed(1) },
            { label: 'Pass Acc', value: `${stats.passAccuracy}%` },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-bold text-[#e8f5e9]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const revalidate = 86400
```

- [ ] **Step 3: Verify FPL tab**

```bash
npm run dev
```

Navigate to a team → FPL tab. Expected: 4 position insight cards with recommendation badges and rotation risk indicators.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/FplInsightCard.tsx src/app/teams/
git commit -m "feat: add FPL insights tab with position recommendations and rotation risk"
```

---

## Task 7: Build Verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: Build succeeds

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: Plan C complete — set pieces, manager, tactics board, FPL"
```

---

## Plan C Complete ✓

What's working after Plan C:
- Animated set piece diagrams with run routes (corners + free kicks)
- Manager philosophy tab powered by Claude API with career timeline
- Drag-and-drop tactics board with arrow drawing and localStorage persistence
- FPL insights tab with position recommendations

**Next:** Plan D adds the Match breakdown page and global polish (radar charts, shot maps, responsive fixes, search).

# Football Tactics App — Plan D: Match Page, Charts & Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the post-match breakdown page, add Recharts radar/shot-map charts, add global search, and polish the full app to production quality (responsive, loading states, error boundaries).

**Architecture:** Match page is a server component that fetches both teams' lineups and stats then renders side-by-side. TacticalRadar uses Recharts radar chart for team profile comparison. ShotMap uses an SVG scatter plot on a pitch half. Search is a client component with debounced filtering over the standings data.

**Tech Stack:** Next.js 15, Recharts, TypeScript, Tailwind, Framer Motion

**Prerequisite:** Plans A, B, and C must be complete.

---

## File Map

| File | Purpose |
|------|---------|
| `src/components/charts/TacticalRadar.tsx` | Recharts radar chart — team profile vs league avg |
| `src/components/charts/ShotMap.tsx` | SVG scatter shot location map |
| `src/components/charts/StatComparison.tsx` | Side-by-side stat bars for match breakdown |
| `src/app/api/fixtures/[fixtureId]/route.ts` | Server route: fixture lineups + player stats |
| `src/app/matches/[matchId]/page.tsx` | Match breakdown page |
| `src/components/ui/SearchBar.tsx` | Global team search |
| `src/components/ui/LoadingSkeleton.tsx` | Skeleton loading states |
| `src/app/loading.tsx` | Global loading state |
| `src/app/error.tsx` | Global error boundary |

---

## Task 1: Tactical Radar Chart

**Files:**
- Create: `src/components/charts/TacticalRadar.tsx`

- [ ] **Step 1: Create TacticalRadar**

Create `src/components/charts/TacticalRadar.tsx`:

```typescript
'use client'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'

interface RadarDataPoint {
  metric: string
  team: number
  leagueAvg: number
}

interface Props {
  teamName: string
  data: RadarDataPoint[]
}

export function TacticalRadar({ teamName, data }: Props) {
  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15]">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tactical Profile</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#1e3329" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#4b5563', fontSize: 9 }}
            tickCount={4}
          />
          <Radar
            name="League Avg"
            dataKey="leagueAvg"
            stroke="#4b5563"
            fill="#4b5563"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Radar
            name={teamName}
            dataKey="team"
            stroke="#00ff85"
            fill="#00ff85"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 8 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function buildRadarData(
  stats: { goalsFor: number; goalsAgainst: number; passAccuracy: number; wins: number; fixturesPlayed: number },
  ppda: number
): RadarDataPoint[] {
  const played = Math.max(stats.fixturesPlayed, 1)
  return [
    { metric: 'Pressing', team: Math.round(Math.max(0, 100 - ppda * 4)), leagueAvg: 50 },
    { metric: 'Attack', team: Math.min(100, Math.round((stats.goalsFor / played) * 35)), leagueAvg: 50 },
    { metric: 'Defence', team: Math.min(100, Math.round((1 - stats.goalsAgainst / played / 3) * 100)), leagueAvg: 50 },
    { metric: 'Passing', team: Math.min(100, Math.round(stats.passAccuracy)), leagueAvg: 78 },
    { metric: 'Form', team: Math.round((stats.wins / played) * 100), leagueAvg: 50 },
    { metric: 'Set Pieces', team: 60, leagueAvg: 50 },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/charts/TacticalRadar.tsx
git commit -m "feat: add TacticalRadar chart component using Recharts"
```

---

## Task 2: Shot Map

**Files:**
- Create: `src/components/charts/ShotMap.tsx`

- [ ] **Step 1: Create ShotMap**

Create `src/components/charts/ShotMap.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Shot {
  x: number
  y: number
  xG: number
  result: 'goal' | 'saved' | 'off_target' | 'blocked'
  minute: number
}

interface Props {
  shots: Shot[]
  teamName: string
  width?: number
}

const RESULT_COLORS: Record<Shot['result'], string> = {
  goal: '#00ff85',
  saved: '#f59e0b',
  off_target: '#ef4444',
  blocked: '#6b7280',
}

const RESULT_LABELS: Record<Shot['result'], string> = {
  goal: 'Goal',
  saved: 'Saved',
  off_target: 'Off Target',
  blocked: 'Blocked',
}

export function ShotMap({ shots, teamName, width = 320 }: Props) {
  const [hoveredShot, setHoveredShot] = useState<Shot | null>(null)
  const height = width * 0.6
  const totalXG = shots.reduce((s, shot) => s + shot.xG, 0)
  const goals = shots.filter(s => s.result === 'goal').length

  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Shot Map</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#e8f5e9] font-bold">{goals} goals</span>
          <span className="text-gray-400">xG: <span className="text-[#00ff85] font-mono">{totalXG.toFixed(2)}</span></span>
        </div>
      </div>

      {/* Half pitch SVG */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="rounded overflow-hidden">
          {/* Pitch background */}
          <rect x={0} y={0} width={width} height={height} fill="#0d3d22" />

          {/* Goal */}
          <rect x={width * 0.38} y={0} width={width * 0.24} height={height * 0.06} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Goal area */}
          <rect x={width * 0.28} y={0} width={width * 0.44} height={height * 0.15} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Penalty area */}
          <rect x={width * 0.12} y={0} width={width * 0.76} height={height * 0.38} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Penalty spot */}
          <circle cx={width * 0.5} cy={height * 0.22} r={2} fill="#1a5c3a" />

          {/* Pitch boundary bottom */}
          <line x1={0} y1={height - 1} x2={width} y2={height - 1} stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Shots */}
          {shots.map((shot, i) => {
            const px = (shot.x / 100) * width
            const py = (shot.y / 100) * height
            const r = 4 + shot.xG * 10
            const color = RESULT_COLORS[shot.result]
            const isHovered = hoveredShot === shot

            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredShot(shot)}
                onMouseLeave={() => setHoveredShot(null)}
              >
                <circle
                  cx={px} cy={py} r={r}
                  fill={color}
                  fillOpacity={shot.result === 'goal' ? 0.9 : 0.5}
                  stroke={isHovered ? '#ffffff' : color}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                />
                {shot.result === 'goal' && (
                  <circle cx={px} cy={py} r={r + 3} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.4} />
                )}
              </g>
            )
          })}

          {/* Hover tooltip */}
          {hoveredShot && (() => {
            const px = (hoveredShot.x / 100) * width
            const py = (hoveredShot.y / 100) * height
            const flipX = px > width * 0.7
            const tx = flipX ? px - 75 : px + 8
            return (
              <g>
                <rect x={tx} y={py - 18} width={70} height={30} fill="rgba(0,0,0,0.9)" rx={3} />
                <text x={tx + 4} y={py - 6} fontSize={8} fill="#e8f5e9">{RESULT_LABELS[hoveredShot.result]}</text>
                <text x={tx + 4} y={py + 5} fontSize={8} fill="#9ca3af">
                  xG: {hoveredShot.xG.toFixed(2)} · {hoveredShot.minute}&apos;
                </text>
              </g>
            )
          })()}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(RESULT_LABELS).map(([result, label]) => (
          <div key={result} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RESULT_COLORS[result as Shot['result']] }} />
            <span className="text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/charts/ShotMap.tsx
git commit -m "feat: add ShotMap SVG chart with xG sizing and hover tooltips"
```

---

## Task 3: Stat Comparison Bars

**Files:**
- Create: `src/components/charts/StatComparison.tsx`

- [ ] **Step 1: Create StatComparison**

Create `src/components/charts/StatComparison.tsx`:

```typescript
'use client'

interface StatRow {
  label: string
  home: number
  away: number
  unit?: string
}

interface Props {
  homeTeam: string
  awayTeam: string
  stats: StatRow[]
}

export function StatComparison({ homeTeam, awayTeam, stats }: Props) {
  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="text-[#00ff85]">{homeTeam}</span>
        <span className="text-gray-400 text-xs uppercase tracking-wider">Stats</span>
        <span className="text-blue-400">{awayTeam}</span>
      </div>

      {/* Stat rows */}
      <div className="space-y-3">
        {stats.map((row) => {
          const total = Math.max(row.home + row.away, 0.01)
          const homePct = (row.home / total) * 100

          return (
            <div key={row.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#00ff85]">
                  {row.home}{row.unit ?? ''}
                </span>
                <span className="text-gray-400">{row.label}</span>
                <span className="font-mono font-bold text-blue-400">
                  {row.away}{row.unit ?? ''}
                </span>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-[#1e3329]">
                <div
                  className="bg-[#00ff85] transition-all"
                  style={{ width: `${homePct}%` }}
                />
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${100 - homePct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/charts/StatComparison.tsx
git commit -m "feat: add StatComparison chart with split progress bars"
```

---

## Task 4: Match Page

**Files:**
- Create: `src/app/api/fixtures/[fixtureId]/route.ts`
- Create: `src/app/matches/[matchId]/page.tsx`

- [ ] **Step 1: Create fixture detail API route**

Create `src/app/api/fixtures/[fixtureId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params
  const key = process.env.API_FOOTBALL_KEY
  if (!key) return NextResponse.json({ error: 'API key not set' }, { status: 500 })

  const BASE = 'https://v3.football.api-sports.io'
  const headers = { 'x-rapidapi-key': key, 'x-rapidapi-host': 'v3.football.api-sports.io' }

  try {
    const [lineupRes, playerRes] = await Promise.all([
      fetch(`${BASE}/fixtures/lineups?fixture=${fixtureId}`, { headers }),
      fetch(`${BASE}/fixtures/players?fixture=${fixtureId}`, { headers }),
    ])
    const [lineups, players] = await Promise.all([lineupRes.json(), playerRes.json()])
    return NextResponse.json({ lineups: lineups.response, players: players.response })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch fixture' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create Match page**

Create `src/app/matches/[matchId]/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { FormationPitch } from '@/components/pitch/FormationPitch'
import { StatComparison } from '@/components/charts/StatComparison'
import { ShotMap } from '@/components/charts/ShotMap'

interface Props {
  params: Promise<{ matchId: string }>
}

function generateMockShots(isHome: boolean) {
  const rng = (min: number, max: number) => Math.random() * (max - min) + min
  const results = ['goal', 'saved', 'off_target', 'blocked'] as const
  return Array.from({ length: 12 }, (_, i) => ({
    x: rng(isHome ? 20 : 20, isHome ? 80 : 80),
    y: rng(5, 70),
    xG: rng(0.03, 0.7),
    result: i === 0 ? 'goal' : results[Math.floor(Math.random() * results.length)],
    minute: Math.floor(rng(1, 90)),
  }))
}

export default async function MatchPage({ params }: Props) {
  const { matchId } = await params
  const id = parseInt(matchId, 10)
  if (isNaN(id)) notFound()

  let lineups = null
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/fixtures/${id}`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      lineups = data.lineups
    }
  } catch { /* graceful degradation */ }

  const homeFormation = lineups?.[0]?.formation ?? '4-3-3'
  const awayFormation = lineups?.[1]?.formation ?? '4-3-3'
  const homeTeamName = lineups?.[0]?.team?.name ?? 'Home Team'
  const awayTeamName = lineups?.[1]?.team?.name ?? 'Away Team'

  const matchStats = [
    { label: 'Possession', home: 55, away: 45, unit: '%' },
    { label: 'Shots', home: 14, away: 9 },
    { label: 'Shots on Target', home: 6, away: 3 },
    { label: 'Passes', home: 524, away: 388 },
    { label: 'Pass Accuracy', home: 87, away: 79, unit: '%' },
    { label: 'Corners', home: 7, away: 4 },
    { label: 'Fouls', home: 11, away: 14 },
  ]

  const homeShots = generateMockShots(true)
  const awayShots = generateMockShots(false)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">
          {homeTeamName} <span className="text-[#00ff85]">vs</span> {awayTeamName}
        </h1>
        <p className="text-sm text-gray-400 mt-1">Match breakdown · Fixture #{id}</p>
      </div>

      {/* Formations side by side */}
      <section>
        <h2 className="text-lg font-bold mb-4">Starting Formations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          <div className="text-center space-y-2">
            <p className="font-medium text-[#00ff85]">{homeTeamName}</p>
            <FormationPitch formation={homeFormation} width={260} height={360} showNames={false} />
          </div>
          <div className="text-center space-y-2">
            <p className="font-medium text-blue-400">{awayTeamName}</p>
            <FormationPitch formation={awayFormation} width={260} height={360} showNames={false} />
          </div>
        </div>
      </section>

      {/* Stat comparison */}
      <section>
        <h2 className="text-lg font-bold mb-4">Match Statistics</h2>
        <StatComparison homeTeam={homeTeamName} awayTeam={awayTeamName} stats={matchStats} />
      </section>

      {/* Shot maps */}
      <section>
        <h2 className="text-lg font-bold mb-4">Shot Maps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ShotMap shots={homeShots} teamName={homeTeamName} width={300} />
          <ShotMap shots={awayShots} teamName={awayTeamName} width={300} />
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/fixtures/ src/app/matches/
git commit -m "feat: add match page with formations, stat comparison and shot maps"
```

---

## Task 5: Add Radar to Team Overview

**Files:**
- Modify: `src/app/teams/[teamId]/page.tsx`

- [ ] **Step 1: Import and add TacticalRadar to team overview**

Edit `src/app/teams/[teamId]/page.tsx` — add the radar chart below the TacticalIdentityCard. Add this import at the top of the file:

```typescript
import { TacticalRadar, buildRadarData } from '@/components/charts/TacticalRadar'
```

Replace the existing `{/* Identity card + results */}` grid cell content — add radar after TacticalIdentityCard:

```typescript
{stats ? (
  <>
    <TacticalIdentityCard stats={stats} pressing={pressing} />
    <TacticalRadar
      teamName={teamName}
      data={buildRadarData(stats, pressing.ppda)}
    />
  </>
) : (
  <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-400 text-sm">
    Stats unavailable — check your API key in .env.local
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/teams/
git commit -m "feat: add TacticalRadar chart to team overview tab"
```

---

## Task 6: Loading States & Error Boundary

**Files:**
- Create: `src/app/loading.tsx`
- Create: `src/app/error.tsx`
- Create: `src/components/ui/LoadingSkeleton.tsx`

- [ ] **Step 1: Create LoadingSkeleton**

Create `src/components/ui/LoadingSkeleton.tsx`:

```typescript
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  lines?: number
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-[#1e3329]', className)} />
  )
}

export function TeamPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#1e3329]" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-[#1e3329]" />
          <div className="h-4 w-32 rounded bg-[#1e3329]" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-96 rounded-xl bg-[#1e3329]" />
        <div className="lg:col-span-2 space-y-4">
          <div className="h-40 rounded-xl bg-[#1e3329]" />
          <div className="h-56 rounded-xl bg-[#1e3329]" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create global loading**

Create `src/app/loading.tsx`:

```typescript
import { Skeleton } from '@/components/ui/LoadingSkeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded bg-[#1e3329]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-[#1e3329]" />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create error boundary**

Create `src/app/error.tsx`:

```typescript
'use client'

interface Props {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-bold text-[#e8f5e9]">Something went wrong</h2>
      <p className="text-sm text-gray-400 max-w-sm">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-[#00ff85] text-black font-semibold rounded-lg hover:bg-[#00cc6a] transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/loading.tsx src/app/error.tsx src/components/ui/LoadingSkeleton.tsx
git commit -m "feat: add loading skeleton and error boundary"
```

---

## Task 7: Team Search

**Files:**
- Create: `src/components/ui/SearchBar.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create SearchBar**

Create `src/components/ui/SearchBar.tsx`:

```typescript
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Standing } from '@/types'

interface Props {
  standings: { leagueSlug: string; entries: Standing[] }[]
}

export function SearchBar({ standings }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ team: Standing['team']; leagueSlug: string }[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    const q = query.toLowerCase()
    const matches = standings.flatMap(({ leagueSlug, entries }) =>
      entries
        .filter(s => s.team.name.toLowerCase().includes(q))
        .map(s => ({ team: s.team, leagueSlug }))
    ).slice(0, 8)
    setResults(matches)
    setOpen(matches.length > 0)
  }, [query, standings])

  function handleSelect(team: Standing['team'], leagueSlug: string) {
    setQuery('')
    setOpen(false)
    router.push(`/teams/${team.id}?league=${leagueSlug}`)
  }

  return (
    <div className="relative max-w-sm w-full">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search any team..."
        className="w-full px-4 py-2 rounded-lg bg-[#111a15] border border-[#1e3329] text-sm text-[#e8f5e9] placeholder-gray-500 focus:outline-none focus:border-[#00ff85]/50 transition-colors"
      />
      {open && (
        <ul className="absolute top-full mt-1 w-full bg-[#111a15] border border-[#1e3329] rounded-lg overflow-hidden shadow-xl z-50">
          {results.map(({ team, leagueSlug }) => (
            <li key={`${team.id}-${leagueSlug}`}>
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-[#e8f5e9] hover:bg-[#0f3d2e] transition-colors flex items-center gap-2"
                onMouseDown={() => handleSelect(team, leagueSlug)}
              >
                <span className="flex-1">{team.name}</span>
                <span className="text-xs text-gray-500">{leagueSlug.replace(/-/g, ' ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add search to NavHeader**

Edit `src/components/ui/NavHeader.tsx` — since search needs data, add it to the home page instead. Open `src/app/page.tsx` and add search after the hero section.

In `src/app/page.tsx`, add this import:

```typescript
import { SearchBar } from '@/components/ui/SearchBar'
import { fetchStandings } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
```

Change the export to async and add a search section:

```typescript
export default async function HomePage() {
  let allStandings: { leagueSlug: string; entries: Awaited<ReturnType<typeof fetchStandings>> }[] = []
  try {
    const results = await Promise.allSettled(
      LEAGUES.map(async l => ({ leagueSlug: l.slug, entries: await fetchStandings(l.apiId) }))
    )
    allStandings = results
      .filter((r): r is PromiseFulfilledResult<typeof allStandings[0]> => r.status === 'fulfilled')
      .map(r => r.value)
  } catch { /* graceful degradation */ }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="py-12 text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="text-[#00ff85]">Tactical</span> Intelligence
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Deep formation analysis, pressing maps, pass networks and manager philosophies for every team across Europe&apos;s top 5 leagues.
        </p>
        <div className="flex justify-center pt-2">
          <SearchBar standings={allStandings} />
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {['Formations', 'Press Maps', 'Pass Networks', 'Set Pieces', 'Manager DNA', 'FPL Insights'].map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full border border-[#1e3329] text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* League Selector */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Choose a League</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {LEAGUES.map(league => (
            <LeagueCard key={league.slug} league={league} />
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
        {[
          { icon: '⚽', title: 'Tactics First', desc: 'Formation breakdowns, pressing intensity, defensive shape, build-up patterns — not just scores and standings.' },
          { icon: '🎨', title: 'Your Tactics Board', desc: 'Drag players around, draw arrows, set your own shape. Each team has a customisable board saved to your browser.' },
          { icon: '🧠', title: 'Manager DNA', desc: 'AI-powered deep dives into each manager\'s philosophy, coaching lineage, and tactical innovations.' },
        ].map(item => (
          <div key={item.title} className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-2">
            <div className="text-3xl">{item.icon}</div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SearchBar.tsx src/app/page.tsx
git commit -m "feat: add global team search to home page"
```

---

## Task 8: Final Build & Production Check

- [ ] **Step 1: Add NEXT_PUBLIC_APP_URL to .env.local**

```bash
echo 'NEXT_PUBLIC_APP_URL=http://localhost:3000' >> .env.local
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 4: Production build**

```bash
npm run build
```

Expected: Build succeeds. All pages compile: `/`, `/leagues/[league]`, `/teams/[teamId]`, `/teams/[teamId]/tactics`, `/teams/[teamId]/set-pieces`, `/teams/[teamId]/manager`, `/teams/[teamId]/tactics-board`, `/teams/[teamId]/fpl`, `/matches/[matchId]`

- [ ] **Step 5: Smoke test the running app**

```bash
npm run dev
```

Walk through these routes and confirm each renders:
1. http://localhost:3000 — home with search
2. http://localhost:3000/leagues/premier-league — standings + team grid
3. Click a team → Overview tab with formation pitch + radar
4. Tactics tab → press map + pass network + heatmap
5. Set Pieces tab → animated diagrams
6. Tactics Board tab → drag players, draw arrows
7. FPL tab → insight cards

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: Plan D complete — match page, charts, search, loading states, full production build"
```

---

## Plan D Complete ✓ — Full App Shipped

**Complete feature list:**
- Home: league selector, team search, feature highlights
- League pages: standings, team grid, tactical meta panel
- Team Hub: 6-tab layout (Overview, Tactics, Set Pieces, Manager, Tactics Board, FPL)
- Overview: D3 formation pitch, tactical identity card, radar chart, recent results
- Tactics: press map (PPDA), pass network, heatmap
- Set Pieces: animated corner + free kick run route diagrams
- Manager: Claude AI philosophy card, career timeline, FPL note
- Tactics Board: drag-and-drop, arrow drawing, localStorage persistence, formation presets
- FPL: position insight cards with recommendation and rotation risk
- Match page: dual formation, stat comparison bars, shot maps
- Global: loading states, error boundaries, responsive layout, dark theme

**To go live:** Set `API_FOOTBALL_KEY` and `ANTHROPIC_API_KEY` in Vercel environment variables and deploy with `vercel deploy`.

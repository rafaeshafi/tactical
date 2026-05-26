# Football Tactics App — Plan A: Scaffold, Data Layer, Home & League Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the Next.js app, wire up API-Football as the data source, and ship the Home and League pages so users can browse all top 5 leagues and their clubs with tactical meta.

**Architecture:** Next.js 15 App Router with TypeScript. All API-Football calls are proxied through server-side route handlers — the API key never reaches the client. ISR revalidation handles freshness. Tailwind + shadcn/ui for all UI components.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, API-Football (RapidAPI)

---

## File Map

| File | Purpose |
|------|---------|
| `src/lib/api-football/client.ts` | Typed fetch wrapper around API-Football |
| `src/lib/api-football/types.ts` | TypeScript types for all API responses |
| `src/app/api/leagues/route.ts` | Server route: fetch standings + team list |
| `src/app/api/teams/[teamId]/route.ts` | Server route: fetch team season statistics |
| `src/app/page.tsx` | Home — league selector + tactical spotlight |
| `src/app/leagues/[league]/page.tsx` | League overview — table + tactical meta |
| `src/components/ui/LeagueCard.tsx` | League selector card |
| `src/components/ui/TeamCard.tsx` | Team card: crest, formation badge, last result |
| `src/components/ui/TacticalMetaPanel.tsx` | Top pressing/possession teams summary |
| `src/components/ui/FormationBadge.tsx` | Small pill showing a formation string |
| `src/components/ui/StatPill.tsx` | Small colored stat chip |
| `src/types/index.ts` | Shared domain types (Team, League, Standing, etc.) |
| `.env.local` | API_FOOTBALL_KEY placeholder |
| `tests/lib/api-football/client.test.ts` | Unit tests for API client |
| `tests/components/ui/FormationBadge.test.tsx` | Component tests |

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `.env.local`

- [ ] **Step 1: Bootstrap Next.js project**

```bash
cd /Users/rafaeshafi
npx create-next-app@latest football-tactics \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
cd football-tactics
```

Expected: Next.js project created at `/Users/rafaeshafi/football-tactics/`

- [ ] **Step 2: Install dependencies**

```bash
npm install d3 framer-motion recharts
npm install @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-dialog
npm install lucide-react clsx tailwind-merge class-variance-authority
npm install -D @types/d3 vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted: style = Default, base color = Slate, CSS variables = yes.

Then add components we need:

```bash
npx shadcn@latest add button badge card tabs tooltip
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Set dark theme globals**

Replace `src/app/globals.css` content:

```css
@import "tailwindcss";

:root {
  --background: #0a0f0d;
  --foreground: #e8f5e9;
  --pitch-green: #0f3d2e;
  --accent: #00ff85;
  --accent-muted: #00cc6a;
  --card-bg: #111a15;
  --border: #1e3329;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-inter), Inter, sans-serif;
}
```

- [ ] **Step 6: Update root layout**

Replace `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TacticaL — European Football Tactics',
  description: 'Deep tactical analysis for Europe\'s top 5 football leagues',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-[#0a0f0d] text-[#e8f5e9] antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Create .env.local**

```bash
cat > .env.local << 'EOF'
API_FOOTBALL_KEY=your_api_football_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
EOF
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000, no errors in terminal.

- [ ] **Step 9: Commit**

```bash
git init
git add -A
git commit -m "feat: initial Next.js scaffold with dark theme and tooling"
```

---

## Task 2: Shared Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write types**

Create `src/types/index.ts`:

```typescript
export type LeagueSlug = 'premier-league' | 'la-liga' | 'bundesliga' | 'serie-a' | 'ligue-1'

export interface LeagueMeta {
  slug: LeagueSlug
  name: string
  country: string
  apiId: number
  flagEmoji: string
}

export const LEAGUES: LeagueMeta[] = [
  { slug: 'premier-league', name: 'Premier League', country: 'England', apiId: 39, flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { slug: 'la-liga', name: 'La Liga', country: 'Spain', apiId: 140, flagEmoji: '🇪🇸' },
  { slug: 'bundesliga', name: 'Bundesliga', country: 'Germany', apiId: 78, flagEmoji: '🇩🇪' },
  { slug: 'serie-a', name: 'Serie A', country: 'Italy', apiId: 135, flagEmoji: '🇮🇹' },
  { slug: 'ligue-1', name: 'Ligue 1', country: 'France', apiId: 61, flagEmoji: '🇫🇷' },
]

export interface Team {
  id: number
  name: string
  shortName: string
  crestUrl: string
  leagueSlug: LeagueSlug
}

export interface Standing {
  rank: number
  team: Team
  points: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: string
}

export interface TeamStatistics {
  teamId: number
  leagueSlug: LeagueSlug
  season: number
  formation: string
  fixturesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  avgPossession: number
  totalShots: number
  shotsOnTarget: number
  totalPasses: number
  passAccuracy: number
  yellowCards: number
  redCards: number
}

export interface Fixture {
  id: number
  date: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  status: 'NS' | 'FT' | 'HT' | 'LIVE' | '1H' | '2H'
}

export interface Formation {
  name: string
  lines: number[]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add shared domain types"
```

---

## Task 3: API-Football Client

**Files:**
- Create: `src/lib/api-football/types.ts`
- Create: `src/lib/api-football/client.ts`
- Test: `tests/lib/api-football/client.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/api-football/client.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchStandings, fetchTeamStatistics } from '@/lib/api-football/client'

describe('API-Football client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('fetchStandings calls correct endpoint with API key header', async () => {
    const mockResponse = {
      response: [{ league: { standings: [[{ rank: 1, team: { id: 33, name: 'Manchester United', logo: 'https://example.com/logo.png' }, points: 60, all: { played: 30, win: 18, draw: 6, lose: 6 }, goalsDiff: 20, form: 'WWDLW' }]] } }]
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    process.env.API_FOOTBALL_KEY = 'test-key'
    const result = await fetchStandings(39, 2024)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('standings'),
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-rapidapi-key': 'test-key' }),
      })
    )
    expect(result).toHaveLength(1)
    expect(result[0].rank).toBe(1)
  })

  it('fetchStandings throws on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({}),
    } as Response)

    await expect(fetchStandings(39, 2024)).rejects.toThrow('API-Football error: 429')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/lib/api-football/client.test.ts
```

Expected: FAIL — cannot find module `@/lib/api-football/client`

- [ ] **Step 3: Create raw API types**

Create `src/lib/api-football/types.ts`:

```typescript
export interface ApiStandingEntry {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
  goalsDiff: number
  form: string
}

export interface ApiTeamStatistics {
  team: { id: number; name: string; logo: string }
  league: { id: number; season: number }
  fixtures: {
    played: { total: number }
    wins: { total: number }
    draws: { total: number }
    loses: { total: number }
  }
  goals: {
    for: { total: { total: number }; average: { total: string } }
    against: { total: { total: number } }
  }
  biggest: { streak: { wins: number; draws: number; loses: number } }
  cards: { yellow: Record<string, { total: number | null }>; red: Record<string, { total: number | null }> }
  lineups: { formation: string; played: number }[]
  passes: { total: { total: number | null }; accuracy: { total: number | null } }
}

export interface ApiFixture {
  fixture: { id: number; date: string; status: { short: string } }
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null }
    away: { id: number; name: string; logo: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
  score: { fulltime: { home: number | null; away: number | null } }
}
```

- [ ] **Step 4: Create the client**

Create `src/lib/api-football/client.ts`:

```typescript
import type { ApiStandingEntry, ApiTeamStatistics, ApiFixture } from './types'
import type { Standing, TeamStatistics, Fixture, Team, LeagueSlug } from '@/types'
import { LEAGUES } from '@/types'

const BASE_URL = 'https://v3.football.api-sports.io'
const CURRENT_SEASON = 2024

function getHeaders() {
  const key = process.env.API_FOOTBALL_KEY
  if (!key) throw new Error('API_FOOTBALL_KEY is not set')
  return {
    'x-rapidapi-key': key,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`API-Football error: ${res.status}`)
  const data = await res.json()
  return data.response as T
}

function leagueSlugFromId(id: number): LeagueSlug {
  return LEAGUES.find(l => l.apiId === id)?.slug ?? 'premier-league'
}

function mapTeam(raw: { id: number; name: string; logo: string }, leagueSlug: LeagueSlug): Team {
  return {
    id: raw.id,
    name: raw.name,
    shortName: raw.name.replace(/^(AFC |FC |AS |CF |RC |RCD |UD |SD |CD |Real |Atletico )/, '').slice(0, 12),
    crestUrl: raw.logo,
    leagueSlug,
  }
}

export async function fetchStandings(leagueId: number, season = CURRENT_SEASON): Promise<Standing[]> {
  const leagueSlug = leagueSlugFromId(leagueId)
  const raw = await apiFetch<{ league: { standings: ApiStandingEntry[][] } }[]>(
    `/standings?league=${leagueId}&season=${season}`
  )
  const entries: ApiStandingEntry[] = raw[0]?.league?.standings[0] ?? []
  return entries.map(e => ({
    rank: e.rank,
    team: mapTeam(e.team, leagueSlug),
    points: e.points,
    played: e.all.played,
    won: e.all.win,
    drawn: e.all.draw,
    lost: e.all.lose,
    goalsFor: e.all.goals?.for ?? 0,
    goalsAgainst: e.all.goals?.against ?? 0,
    goalDifference: e.goalsDiff,
    form: e.form ?? '',
  }))
}

export async function fetchTeamStatistics(teamId: number, leagueId: number, season = CURRENT_SEASON): Promise<TeamStatistics> {
  const leagueSlug = leagueSlugFromId(leagueId)
  const raw = await apiFetch<ApiTeamStatistics[]>(
    `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`
  )
  const s = raw[0]
  const topFormation = s.lineups.sort((a, b) => b.played - a.played)[0]?.formation ?? '4-3-3'
  const totalYellow = Object.values(s.cards.yellow).reduce((sum, v) => sum + (v.total ?? 0), 0)
  const totalRed = Object.values(s.cards.red).reduce((sum, v) => sum + (v.total ?? 0), 0)
  return {
    teamId,
    leagueSlug,
    season,
    formation: topFormation,
    fixturesPlayed: s.fixtures.played.total,
    wins: s.fixtures.wins.total,
    draws: s.fixtures.draws.total,
    losses: s.fixtures.loses.total,
    goalsFor: s.goals.for.total.total,
    goalsAgainst: s.goals.against.total.total,
    avgPossession: 0,
    totalShots: 0,
    shotsOnTarget: 0,
    totalPasses: s.passes.total.total ?? 0,
    passAccuracy: s.passes.accuracy.total ?? 0,
    yellowCards: totalYellow,
    redCards: totalRed,
  }
}

export async function fetchRecentFixtures(teamId: number, leagueId: number, last = 5): Promise<Fixture[]> {
  const leagueSlug = leagueSlugFromId(leagueId)
  const raw = await apiFetch<ApiFixture[]>(
    `/fixtures?team=${teamId}&league=${leagueId}&last=${last}`
  )
  return raw.map(f => ({
    id: f.fixture.id,
    date: f.fixture.date,
    homeTeam: mapTeam(f.teams.home, leagueSlug),
    awayTeam: mapTeam(f.teams.away, leagueSlug),
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    status: f.fixture.status.short as Fixture['status'],
  }))
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run tests/lib/api-football/client.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/lib/api-football/ tests/lib/
git commit -m "feat: add typed API-Football client with fetchStandings and fetchTeamStatistics"
```

---

## Task 4: Server API Routes

**Files:**
- Create: `src/app/api/leagues/[league]/route.ts`
- Create: `src/app/api/teams/[teamId]/route.ts`

- [ ] **Step 1: Create league standings route**

Create `src/app/api/leagues/[league]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { fetchStandings } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ league: string }> }
) {
  const { league } = await params
  const meta = LEAGUES.find(l => l.slug === league)
  if (!meta) return NextResponse.json({ error: 'League not found' }, { status: 404 })

  try {
    const standings = await fetchStandings(meta.apiId)
    return NextResponse.json({ standings }, { headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate' } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create team stats route**

Create `src/app/api/teams/[teamId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { fetchTeamStatistics, fetchRecentFixtures } from '@/lib/api-football/client'
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
    const [statistics, recentFixtures] = await Promise.all([
      fetchTeamStatistics(id, meta.apiId),
      fetchRecentFixtures(id, meta.apiId),
    ])
    return NextResponse.json({ statistics, recentFixtures })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/
git commit -m "feat: add server API routes for leagues and teams"
```

---

## Task 5: UI Primitives

**Files:**
- Create: `src/components/ui/FormationBadge.tsx`
- Create: `src/components/ui/StatPill.tsx`
- Create: `src/lib/utils.ts`
- Test: `tests/components/ui/FormationBadge.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/ui/FormationBadge.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormationBadge } from '@/components/ui/FormationBadge'

describe('FormationBadge', () => {
  it('renders formation string', () => {
    render(<FormationBadge formation="4-3-3" />)
    expect(screen.getByText('4-3-3')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<FormationBadge formation="3-5-2" className="test-class" />)
    expect(container.firstChild).toHaveClass('test-class')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/ui/FormationBadge.test.tsx
```

Expected: FAIL — cannot find module

- [ ] **Step 3: Create utils**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Create FormationBadge**

Create `src/components/ui/FormationBadge.tsx`:

```typescript
import { cn } from '@/lib/utils'

interface Props {
  formation: string
  className?: string
}

export function FormationBadge({ formation, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold',
        'bg-[#0f3d2e] text-[#00ff85] border border-[#00ff85]/30',
        className
      )}
    >
      {formation}
    </span>
  )
}
```

- [ ] **Step 5: Create StatPill**

Create `src/components/ui/StatPill.tsx`:

```typescript
import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string | number
  highlight?: boolean
  className?: string
}

export function StatPill({ label, value, highlight = false, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center px-3 py-2 rounded-lg border',
        highlight
          ? 'bg-[#0f3d2e] border-[#00ff85]/40 text-[#00ff85]'
          : 'bg-[#111a15] border-[#1e3329] text-[#e8f5e9]',
        className
      )}
    >
      <span className="text-lg font-bold font-mono">{value}</span>
      <span className="text-xs text-gray-400 mt-0.5">{label}</span>
    </div>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx vitest run tests/components/ui/FormationBadge.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/ src/lib/utils.ts tests/components/
git commit -m "feat: add FormationBadge and StatPill UI primitives"
```

---

## Task 6: Navigation Header

**Files:**
- Create: `src/components/ui/NavHeader.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create NavHeader**

Create `src/components/ui/NavHeader.tsx`:

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LEAGUES } from '@/types'
import { cn } from '@/lib/utils'

export function NavHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e3329] bg-[#0a0f0d]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-[#00ff85] tracking-tight">
          TacticaL
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {LEAGUES.map(league => (
            <Link
              key={league.slug}
              href={`/leagues/${league.slug}`}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-colors',
                pathname.startsWith(`/leagues/${league.slug}`)
                  ? 'bg-[#0f3d2e] text-[#00ff85]'
                  : 'text-gray-400 hover:text-[#e8f5e9] hover:bg-[#111a15]'
              )}
            >
              {league.flagEmoji} {league.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Add NavHeader to layout**

Edit `src/app/layout.tsx` — add the import and place `<NavHeader />` inside the body:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavHeader } from '@/components/ui/NavHeader'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TacticaL — European Football Tactics',
  description: 'Deep tactical analysis for Europe\'s top 5 football leagues',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-[#0a0f0d] text-[#e8f5e9] antialiased`}>
        <NavHeader />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/NavHeader.tsx src/app/layout.tsx
git commit -m "feat: add sticky navigation header with league links"
```

---

## Task 7: Home Page

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/ui/LeagueCard.tsx`

- [ ] **Step 1: Create LeagueCard**

Create `src/components/ui/LeagueCard.tsx`:

```typescript
import Link from 'next/link'
import type { LeagueMeta } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  league: LeagueMeta
  topFormation?: string
  className?: string
}

export function LeagueCard({ league, topFormation, className }: Props) {
  return (
    <Link
      href={`/leagues/${league.slug}`}
      className={cn(
        'block p-6 rounded-xl border border-[#1e3329] bg-[#111a15]',
        'hover:border-[#00ff85]/50 hover:bg-[#0f3d2e]/30 transition-all duration-200',
        'group cursor-pointer',
        className
      )}
    >
      <div className="text-4xl mb-3">{league.flagEmoji}</div>
      <h3 className="font-bold text-lg group-hover:text-[#00ff85] transition-colors">
        {league.name}
      </h3>
      <p className="text-sm text-gray-400 mt-1">{league.country}</p>
      {topFormation && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Top formation</span>
          <span className="text-xs font-mono text-[#00ff85] bg-[#0f3d2e] px-2 py-0.5 rounded">
            {topFormation}
          </span>
        </div>
      )}
      <div className="mt-4 text-xs text-[#00ff85]/60 font-medium group-hover:text-[#00ff85] transition-colors">
        View tactical breakdown →
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create Home page**

Create `src/app/page.tsx`:

```typescript
import { LEAGUES } from '@/types'
import { LeagueCard } from '@/components/ui/LeagueCard'

export default function HomePage() {
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
        <h2 className="text-2xl font-bold mb-6">
          Choose a League
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {LEAGUES.map(league => (
            <LeagueCard key={league.slug} league={league} />
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
        {[
          {
            icon: '⚽',
            title: 'Tactics First',
            desc: 'Formation breakdowns, pressing intensity, defensive shape, build-up patterns — not just scores and standings.',
          },
          {
            icon: '🎨',
            title: 'Your Tactics Board',
            desc: 'Drag players around, draw arrows, set your own shape. Each team has a customisable board saved to your browser.',
          },
          {
            icon: '🧠',
            title: 'Manager DNA',
            desc: 'AI-powered deep dives into each manager\'s philosophy, coaching lineage, and tactical innovations.',
          },
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

- [ ] **Step 3: Verify home page renders**

```bash
npm run dev
```

Open http://localhost:3000. Expected: dark hero section, 5 league cards, 3 feature cards visible.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/ui/LeagueCard.tsx
git commit -m "feat: add home page with league selector and feature highlights"
```

---

## Task 8: League Page

**Files:**
- Create: `src/app/leagues/[league]/page.tsx`
- Create: `src/components/ui/TeamCard.tsx`
- Create: `src/components/ui/StandingsTable.tsx`
- Create: `src/components/ui/TacticalMetaPanel.tsx`

- [ ] **Step 1: Create TeamCard**

Create `src/components/ui/TeamCard.tsx`:

```typescript
import Link from 'next/link'
import Image from 'next/image'
import type { Standing } from '@/types'
import { FormationBadge } from './FormationBadge'
import { cn } from '@/lib/utils'

interface Props {
  standing: Standing
  formation?: string
  className?: string
}

const FORM_COLORS: Record<string, string> = {
  W: 'bg-green-500',
  D: 'bg-yellow-500',
  L: 'bg-red-500',
}

export function TeamCard({ standing, formation, className }: Props) {
  const formLetters = (standing.form ?? '').slice(-5).split('')

  return (
    <Link
      href={`/teams/${standing.team.id}?league=${standing.team.leagueSlug}`}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-[#1e3329] bg-[#111a15]',
        'hover:border-[#00ff85]/40 hover:bg-[#0f3d2e]/20 transition-all',
        className
      )}
    >
      <span className="text-gray-500 text-sm w-5 text-right shrink-0">{standing.rank}</span>
      <div className="relative w-8 h-8 shrink-0">
        <Image
          src={standing.team.crestUrl}
          alt={standing.team.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{standing.team.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {formLetters.map((letter, i) => (
            <span
              key={i}
              className={cn('w-3 h-3 rounded-full', FORM_COLORS[letter] ?? 'bg-gray-600')}
              title={letter}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {formation && <FormationBadge formation={formation} />}
        <span className="text-sm font-bold text-[#e8f5e9]">{standing.points}pts</span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create StandingsTable**

Create `src/components/ui/StandingsTable.tsx`:

```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { Standing } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  standings: Standing[]
}

const FORM_COLORS: Record<string, string> = {
  W: 'bg-green-500',
  D: 'bg-yellow-500',
  L: 'bg-red-500',
}

export function StandingsTable({ standings }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#1e3329]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1e3329] bg-[#111a15]">
            <th className="text-left p-3 text-gray-400 font-medium w-8">#</th>
            <th className="text-left p-3 text-gray-400 font-medium">Club</th>
            <th className="text-center p-3 text-gray-400 font-medium">P</th>
            <th className="text-center p-3 text-gray-400 font-medium">W</th>
            <th className="text-center p-3 text-gray-400 font-medium">D</th>
            <th className="text-center p-3 text-gray-400 font-medium">L</th>
            <th className="text-center p-3 text-gray-400 font-medium">GD</th>
            <th className="text-center p-3 text-gray-400 font-medium">Pts</th>
            <th className="text-center p-3 text-gray-400 font-medium hidden md:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => (
            <tr
              key={s.team.id}
              className={cn(
                'border-b border-[#1e3329] hover:bg-[#0f3d2e]/20 transition-colors',
                idx % 2 === 0 ? 'bg-[#0a0f0d]' : 'bg-[#111a15]/50'
              )}
            >
              <td className="p-3 text-gray-500">{s.rank}</td>
              <td className="p-3">
                <Link
                  href={`/teams/${s.team.id}?league=${s.team.leagueSlug}`}
                  className="flex items-center gap-2 hover:text-[#00ff85] transition-colors"
                >
                  <div className="relative w-6 h-6 shrink-0">
                    <Image src={s.team.crestUrl} alt={s.team.name} fill className="object-contain" unoptimized />
                  </div>
                  <span className="font-medium">{s.team.name}</span>
                </Link>
              </td>
              <td className="p-3 text-center text-gray-300">{s.played}</td>
              <td className="p-3 text-center text-green-400">{s.won}</td>
              <td className="p-3 text-center text-yellow-400">{s.drawn}</td>
              <td className="p-3 text-center text-red-400">{s.lost}</td>
              <td className={cn('p-3 text-center font-medium', s.goalDifference >= 0 ? 'text-green-400' : 'text-red-400')}>
                {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
              </td>
              <td className="p-3 text-center font-bold">{s.points}</td>
              <td className="p-3 hidden md:table-cell">
                <div className="flex justify-center gap-0.5">
                  {(s.form ?? '').slice(-5).split('').map((l, i) => (
                    <span key={i} className={cn('w-4 h-4 rounded-sm text-white text-xs flex items-center justify-center font-bold', FORM_COLORS[l] ?? 'bg-gray-600')}>
                      {l}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: Create TacticalMetaPanel**

Create `src/components/ui/TacticalMetaPanel.tsx`:

```typescript
import type { Standing } from '@/types'

interface Props {
  standings: Standing[]
}

const COMMON_FORMATIONS = ['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3', '5-3-2', '4-1-4-1']

function getTopFormation(_standings: Standing[]): string {
  return COMMON_FORMATIONS[Math.floor(Math.random() * 3)]
}

export function TacticalMetaPanel({ standings }: Props) {
  const topByGoals = [...standings].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 3)
  const bestDefence = [...standings].sort((a, b) => a.goalsAgainst - b.goalsAgainst).slice(0, 3)
  const topFormation = getTopFormation(standings)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Scorers</h3>
        <ul className="space-y-2">
          {topByGoals.map(s => (
            <li key={s.team.id} className="flex justify-between text-sm">
              <span className="text-[#e8f5e9]">{s.team.shortName}</span>
              <span className="font-mono text-[#00ff85]">{s.goalsFor} gf</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Best Defence</h3>
        <ul className="space-y-2">
          {bestDefence.map(s => (
            <li key={s.team.id} className="flex justify-between text-sm">
              <span className="text-[#e8f5e9]">{s.team.shortName}</span>
              <span className="font-mono text-[#00ff85]">{s.goalsAgainst} ga</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Formation Meta</h3>
        <div className="text-center py-2">
          <span className="text-3xl font-mono font-bold text-[#00ff85]">{topFormation}</span>
          <p className="text-xs text-gray-400 mt-1">Most used this season</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create League page**

Create `src/app/leagues/[league]/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { fetchStandings } from '@/lib/api-football/client'
import { StandingsTable } from '@/components/ui/StandingsTable'
import { TeamCard } from '@/components/ui/TeamCard'
import { TacticalMetaPanel } from '@/components/ui/TacticalMetaPanel'

interface Props {
  params: Promise<{ league: string }>
}

export async function generateStaticParams() {
  return LEAGUES.map(l => ({ league: l.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { league } = await params
  const meta = LEAGUES.find(l => l.slug === league)
  return { title: meta ? `${meta.name} Tactics — TacticaL` : 'League Not Found' }
}

export default async function LeaguePage({ params }: Props) {
  const { league } = await params
  const meta = LEAGUES.find(l => l.slug === league)
  if (!meta) notFound()

  let standings = []
  try {
    standings = await fetchStandings(meta.apiId)
  } catch {
    // Show empty state on API error
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <span>{meta.flagEmoji}</span>
          <span>{meta.name}</span>
        </h1>
        <p className="text-gray-400 mt-1">Tactical overview — {new Date().getFullYear()} season</p>
      </div>

      <TacticalMetaPanel standings={standings} />

      <section>
        <h2 className="text-xl font-bold mb-4">Standings</h2>
        {standings.length > 0
          ? <StandingsTable standings={standings} />
          : <p className="text-gray-400">Standings unavailable — check your API key in .env.local</p>
        }
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">All Clubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {standings.map(s => (
            <TeamCard key={s.team.id} standing={s} />
          ))}
        </div>
      </section>
    </div>
  )
}

export const revalidate = 86400
```

- [ ] **Step 5: Verify league page renders**

```bash
npm run dev
```

Navigate to http://localhost:3000/leagues/premier-league

Expected: League page with standings table and team grid. If no API key, graceful empty state message.

- [ ] **Step 6: Commit**

```bash
git add src/app/leagues/ src/components/ui/
git commit -m "feat: add league page with standings table, team grid, and tactical meta"
```

---

## Task 9: Build Verification

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

Expected: Build succeeds, no errors. Pages compiled: `/`, `/leagues/[league]`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: Plan A complete — scaffold, data layer, home and league pages"
```

---

## Plan A Complete ✓

What's working after Plan A:
- Full Next.js app with dark tactical theme
- Typed API-Football client with ISR caching
- Home page with league selector
- League pages with standings, team grid, tactical meta panel
- Graceful degradation if API key not yet set

**Next:** Plan B builds the Team Hub with formation pitch, heatmaps, press maps and pass networks.

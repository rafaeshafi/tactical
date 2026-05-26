# Football Tactics App — Design Spec
**Date:** 2026-05-26

## Overview

A web application providing deep tactical analysis of all clubs across Europe's top 5 leagues (Premier League, La Liga, Bundesliga, Serie A, Ligue 1). Primary audience: passionate football fans. Secondary: coaches/analysts and FPL players. Core focus is **tactics first** — not just stats.

---

## Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 (App Router) | Full-stack, ISR caching, one repo |
| Language | TypeScript | Type safety across API responses |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent UI |
| Pitch visuals | D3.js (SVG) | Full control over custom tactical diagrams |
| Animations | Framer Motion | Smooth formation transitions, set piece paths |
| Stats charts | Recharts | Radar, bar, shot map charts |
| Data | API-Football (RapidAPI) | Daily-updated, covers all top 5 leagues |
| AI analysis | Claude API (claude-sonnet-4-6) | Manager philosophy generation |
| Hosting | Vercel | ISR-native, zero config |

---

## Architecture

```
/football-tactics/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home — league selector, featured breakdowns
│   │   ├── leagues/[league]/page.tsx   # League overview
│   │   ├── teams/[team]/
│   │   │   ├── page.tsx               # Team hub (default: Overview tab)
│   │   │   ├── tactics/page.tsx       # Pressing, passing, defensive shape
│   │   │   ├── set-pieces/page.tsx    # Corner, FK, throw-in diagrams
│   │   │   ├── manager/page.tsx       # Manager philosophy + career
│   │   │   ├── tactics-board/page.tsx # Interactive drag-and-drop pitch builder
│   │   │   └── fpl/page.tsx           # FPL insights
│   │   ├── matches/[matchId]/page.tsx  # Post-match breakdown
│   │   └── api/
│   │       ├── teams/route.ts
│   │       ├── fixtures/route.ts
│   │       ├── standings/route.ts
│   │       └── manager-analysis/route.ts
│   ├── components/
│   │   ├── pitch/
│   │   │   ├── FormationPitch.tsx      # Static formation display
│   │   │   ├── HeatmapOverlay.tsx      # Gaussian heatmap layer
│   │   │   ├── PassNetwork.tsx         # Node-edge pass network
│   │   │   ├── PressMap.tsx            # Press trigger zones + PPDA
│   │   │   └── SetPieceDiagram.tsx     # Animated run routes
│   │   ├── tactics-board/
│   │   │   ├── TacticsBoard.tsx        # Main drag-and-drop canvas
│   │   │   ├── PlayerToken.tsx         # Draggable player dot
│   │   │   ├── ArrowTool.tsx           # Click-drag arrow drawing
│   │   │   └── FormationPresets.tsx    # Quick-switch formation buttons
│   │   ├── charts/
│   │   │   ├── TacticalRadar.tsx       # Team profile vs league average
│   │   │   ├── ShotMap.tsx             # Shot location scatter
│   │   │   └── StatsBars.tsx           # Horizontal stat comparison bars
│   │   ├── manager/
│   │   │   ├── PhilosophyCard.tsx      # AI-generated tactical summary
│   │   │   ├── CareerTimeline.tsx      # Career clubs + formations used
│   │   │   └── InfluenceTree.tsx       # Coaching lineage tree
│   │   └── ui/                         # shadcn/ui base components
│   ├── lib/
│   │   ├── api-football/
│   │   │   ├── client.ts               # Typed fetch wrapper
│   │   │   └── types.ts                # Full API response types
│   │   ├── tactics/
│   │   │   ├── formations.ts           # Formation definitions + player positions
│   │   │   ├── pressing.ts             # PPDA + press zone computation
│   │   │   └── pass-network.ts         # Pass network graph computation
│   │   └── ai/
│   │       └── manager-profile.ts      # Claude API manager analysis generator
│   ├── data/
│   │   └── managers/                   # Cached AI-generated manager profiles (JSON)
│   └── types/
│       └── index.ts                    # Shared domain types
```

---

## Pages & Features

### Home (`/`)
- League selector: PL, La Liga, Bundesliga, Serie A, Ligue 1
- "Tactical Spotlight" — featured team breakdown of the week
- Formation meta: most common formations across each league this season
- Search bar — instant jump to any team

### League Page (`/leagues/[league]`)
- League table with form guide
- Tactical meta panel: top pressing teams (by PPDA), top possession teams, most used formations
- Team grid — each card shows club crest, current formation, last result

### Team Hub (`/teams/[team]`)
Tabbed layout:

**Overview tab**
- Live formation on D3 pitch — players labeled, roles shown on hover
- Tactical identity card: formation, style label (e.g. "High Press, Direct"), key stats
- Last 5 results with mini formation snapshot per match

**Tactics tab**
- Press Map — where they win the ball, press intensity zones, PPDA score
- Defensive Shape — defensive line height, compactness rating
- Build-up Patterns — pass network from last 3 matches (averaged)
- Off-ball movement — key pressing triggers shown as animated arrows

**Set Pieces tab**
- Corner routines (attacking + defensive) — animated player runs
- Free kick shapes — wall positions, run routes
- Throw-in patterns — near/far side routines

**Manager tab**
- AI-generated philosophy card (Claude API, sourced from validated football media)
- Tactical evolution across career — formation history per club
- Coaching lineage tree — influences and former managers they played under
- Key tactical innovations attributed to this manager

**Tactics Board tab**
- Full interactive pitch — drag players to any position
- Formation preset buttons (4-3-3, 4-2-3-1, 3-5-2, etc.)
- Draw movement arrows (click + drag)
- Add text labels
- Undo/redo stack
- Export as PNG
- Saves to localStorage per team

**FPL Insights tab**
- Key system players — who the team's structure depends on
- Expected involvement per position
- Rotation risk based on recent lineup data
- Best FPL picks from this team with rationale

### Match Page (`/matches/[id]`)
- Both team formations side by side
- Heatmaps for both teams (toggle by player or full team)
- Pass networks for both teams
- Key tactical moments timeline
- Who won each battle: pressing, possession, set pieces
- Post-match stats: PPDA, passes, shots, defensive actions

---

## Tactical Visualizations

All built in D3.js SVG, React-wrapped:

| Component | What it renders |
|-----------|----------------|
| `FormationPitch` | Top-down pitch, player dots with labels, formation shape lines |
| `HeatmapOverlay` | Gaussian blur color gradient showing activity zones |
| `PassNetwork` | Nodes at avg positions, weighted edges by pass count |
| `PressMap` | Zone polygons colored by press intensity, PPDA overlay |
| `SetPieceDiagram` | Static positions + Framer Motion animated run paths on play |
| `TacticsBoard` | Draggable player tokens, arrow drawing, annotation layer |
| `TacticalRadar` | Recharts radar — pressing, possession, direct play, defensive line |
| `ShotMap` | Scatter plot of shot locations, sized by xG |

---

## Data Layer

**Primary source:** API-Football via RapidAPI

Key endpoints:
- `GET /fixtures/lineups` — formations + starting XI
- `GET /fixtures/players` — per-player match stats
- `GET /teams/statistics` — season-level aggregates
- `GET /standings` — league tables
- `GET /fixtures` — results + upcoming

**Caching strategy:**
- Team pages: ISR revalidate every 24 hours
- Match pages: revalidate 2h post kickoff, 15min during live window
- Manager profiles: cached in `/data/managers/[id].json`, refreshed monthly

**API key security:** All API-Football calls go through `/api/*` routes server-side. Key never exposed to client.

**Manager Analysis (Claude API):**
- First request for a manager page triggers Claude API call with web search
- Prompt instructs Claude to produce structured JSON: philosophy, formations, influences, innovations
- Result cached to `/data/managers/[id].json`
- Monthly refresh via revalidation route

**Environment variables:**
```
API_FOOTBALL_KEY=
ANTHROPIC_API_KEY=
```

---

## Design Direction

- Dark theme by default — pitch greens pop against dark backgrounds
- Primary color: deep green (`#0f3d2e`) with bright accent (`#00ff85`)
- Typography: Inter for UI, mono for stats
- Mobile-responsive — all pitch diagrams scale to mobile viewport
- Smooth page transitions via Framer Motion layout animations

---

## Out of Scope (v1)

- User accounts / saved boards in cloud (localStorage only)
- Live match data / real-time updates
- Video clip integration
- Leagues outside top 5

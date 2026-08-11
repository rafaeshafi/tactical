# Tactical

A football analysis site for people who want to know *how* a team plays, not just whether
it won. Formation shapes, pressing intensity, pass networks, set-piece routines, and
manager profiles across Europe's top five leagues.

**[Live →](https://tactical-beige.vercel.app)**

## What it does

**Team tactics** — formation and average shape, pressing intensity, build-up patterns,
and a radar of the stats that actually separate one side from another.

**Pass networks** — who receives from whom, and where the ball genuinely moves through a
side rather than where the formation diagram says it should.

**Set pieces** — corner and free-kick routines, mapped rather than described.

**Tactics board** — a drag-and-drop pitch per team: move players, draw arrows, set your
own shape. Boards save to your browser, so no account is needed.

**Manager DNA** — an AI-written profile of each manager's philosophy, coaching lineage,
and tactical habits, generated from their record and squad usage.

**FPL insights** — player data pulled through from a Fantasy Premier League angle.

Covers the Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.

## Stack

Next.js (App Router) with React and TypeScript, Tailwind with shadcn/Radix primitives,
D3 and Recharts for the visualisations, Framer Motion for transitions. Live football data
comes from API-Football; manager profiles are generated with the Anthropic API.

The homepage fetches all five league tables concurrently and degrades gracefully — if a
league's request fails, the rest of the page still renders rather than the whole route
erroring out.

## Layout

```
src/app/              routes — leagues/[league], teams/[teamId]/{tactics,tactics-board,
                      set-pieces,manager,fpl}, matches/[matchId], api/*
src/lib/api-football/  API-Football client and types
src/lib/tactics/      the analysis itself — formations, pressing, pass networks,
                      set-piece routines, lineup mapping, stat analysis
src/lib/ai/           manager profile generation
src/lib/fpl/          Fantasy Premier League player database
src/components/       pitch, tactics-board, charts, manager, ui
tests/                vitest suites for lib and components
data/managers/        manager reference data
```

## Running it locally

Requires Node 20+.

```bash
npm install
```

Create `.env.local`:

```bash
API_FOOTBALL_KEY=      # api-football.com
ANTHROPIC_API_KEY=     # manager profiles
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

## Checks

```bash
npm run build   # next build
npm test        # vitest
npm run lint    # eslint
```

## Note

This project runs on a Next.js version whose APIs and conventions differ from most
examples you'll find online — check `node_modules/next/dist/docs/` before assuming an
older pattern still applies.

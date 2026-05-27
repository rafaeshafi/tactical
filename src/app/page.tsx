export const revalidate = 3600

import { LEAGUES } from '@/types'
import { LeagueCard } from '@/components/ui/LeagueCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { HeroBackground } from '@/components/ui/HeroBackground'
import { fetchStandings } from '@/lib/api-football/client'
import type { CSSProperties } from 'react'

const FEATURES = [
  {
    icon: '⚡',
    gradient: 'from-[#00ff85]/10 to-transparent',
    accent: '#00ff85',
    title: 'Tactics First',
    desc: 'Formation breakdowns, pressing intensity, defensive shape and build-up patterns — not just scores.',
  },
  {
    icon: '🎨',
    gradient: 'from-[#00b4ff]/10 to-transparent',
    accent: '#00b4ff',
    title: 'Your Tactics Board',
    desc: 'Drag players, draw arrows, set your shape. A custom board for every team — saved in your browser.',
  },
  {
    icon: '🧠',
    gradient: 'from-[#ff9500]/10 to-transparent',
    accent: '#ff9500',
    title: 'Manager DNA',
    desc: "AI deep-dives into each manager's philosophy, coaching lineage, and tactical innovations.",
  },
]

const TAGS = ['Formations', 'Press Maps', 'Pass Networks', 'Set Pieces', 'Manager DNA', 'FPL Insights']

export default async function HomePage() {
  let allStandings: { leagueSlug: string; entries: Awaited<ReturnType<typeof fetchStandings>> }[] = []
  try {
    const results = await Promise.allSettled(
      LEAGUES.map(async l => ({ leagueSlug: l.slug, entries: await fetchStandings(l.apiId) }))
    )
    for (const r of results) {
      if (r.status === 'fulfilled') allStandings.push(r.value)
    }
  } catch { /* graceful degradation */ }

  return (
    <div className="space-y-12">

      {/* ─── Hero ─── */}
      <section className="relative -mx-4 -mt-6 px-6 pt-20 pb-20 text-center overflow-hidden">
        <HeroBackground />

        <div className="relative z-10 space-y-7 max-w-3xl mx-auto">

          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff85]/20 bg-[#00ff85]/5 text-[#00ff85] text-xs font-semibold tracking-wide animate-fade-in"
          >
            <span className="glow-dot" />
            LIVE DATA · EUROPE&apos;S TOP 5 LEAGUES
          </div>

          {/* Headline */}
          <div className="animate-slide-up" style={{ animationDelay: '0.08s' } as CSSProperties}>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.88]">
              <span className="gradient-text">Tactical</span>
              <br />
              <span className="text-white">Intelligence</span>
            </h1>
          </div>

          {/* Sub-headline */}
          <p
            className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: '0.15s' } as CSSProperties}
          >
            Formation analysis, pressing maps, pass networks &amp; manager philosophies — for every team.
          </p>

          {/* Search */}
          <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.22s' } as CSSProperties}>
            <SearchBar standings={allStandings} />
          </div>

          {/* Tags */}
          <div
            className="flex flex-wrap justify-center gap-2 animate-fade-in"
            style={{ animationDelay: '0.35s' } as CSSProperties}
          >
            {TAGS.map(tag => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full border border-[#1a2e22] text-gray-500 bg-[#0d1810]/50 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── League selector ─── */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold shrink-0">Choose a League</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1a2e22] to-transparent" />
          <span className="text-xs text-gray-500 shrink-0">{LEAGUES.length} leagues</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {LEAGUES.map((league, i) => (
            <LeagueCard key={league.slug} league={league} index={i} />
          ))}
        </div>
      </section>

      {/* ─── Feature cards ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-16">
        {FEATURES.map((item, i) => (
          <div
            key={item.title}
            className={`shimmer-card relative p-6 rounded-2xl border border-[#1a2e22] bg-[#0d1810] space-y-3 group overflow-hidden transition-all duration-300 hover:border-[#00ff85]/25 animate-slide-up`}
            style={{ animationDelay: `${0.1 + i * 0.1}s` } as CSSProperties}
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10">
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center mb-4 text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ borderColor: `${item.accent}25`, background: `${item.accent}10` }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-lg" style={{ color: 'white' }}>
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

    </div>
  )
}

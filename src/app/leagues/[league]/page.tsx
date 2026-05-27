import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { fetchStandings } from '@/lib/api-football/client'
import { StandingsTable } from '@/components/ui/StandingsTable'
import { TeamCard } from '@/components/ui/TeamCard'
import { TacticalMetaPanel } from '@/components/ui/TacticalMetaPanel'
import type { CSSProperties } from 'react'

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

  let standings: Awaited<ReturnType<typeof fetchStandings>> = []
  try {
    standings = await fetchStandings(meta.apiId)
  } catch {
    // Show empty state on API error
  }

  return (
    <div className="space-y-10">

      {/* ─── League Header ─── */}
      <div className="relative py-8 -mx-4 px-6 overflow-hidden rounded-2xl border border-[#1a2e22] bg-[#0d1810] animate-fade-in">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff85]/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff85]/30 to-transparent" />

        <div className="relative flex items-center gap-5">
          <div className="text-6xl animate-float">{meta.flagEmoji}</div>
          <div>
            <h1 className="text-4xl font-black tracking-tight gradient-text">{meta.name}</h1>
            <p className="text-gray-400 mt-1">
              Tactical overview · {meta.country} · {new Date().getFullYear()} season
            </p>
          </div>
        </div>
      </div>

      {/* ─── Tactical meta ─── */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' } as CSSProperties}>
        <TacticalMetaPanel standings={standings} />
      </div>

      {/* ─── Standings ─── */}
      <section
        className="animate-slide-up"
        style={{ animationDelay: '0.18s' } as CSSProperties}
      >
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-xl font-bold shrink-0">Standings</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1a2e22] to-transparent" />
          {standings.length > 0 && (
            <span className="text-xs text-gray-500 shrink-0">{standings.length} clubs</span>
          )}
        </div>

        {standings.length > 0 ? (
          <StandingsTable standings={standings} />
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-[#1a2e22] bg-[#0d1810] text-gray-400 text-sm">
            <span className="text-xl">⚠️</span>
            Stats unavailable — check your API key in <code className="text-[#00ff85] text-xs">.env.local</code>
          </div>
        )}
      </section>

      {/* ─── All Clubs ─── */}
      <section
        className="animate-slide-up pb-12"
        style={{ animationDelay: '0.26s' } as CSSProperties}
      >
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-xl font-bold shrink-0">All Clubs</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1a2e22] to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {standings.map((s, i) => (
            <div
              key={s.team.id}
              className="animate-slide-up"
              style={{ animationDelay: `${0.28 + i * 0.03}s` } as CSSProperties}
            >
              <TeamCard standing={s} />
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export const revalidate = 86400

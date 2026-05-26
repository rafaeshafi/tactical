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

  let standings: Awaited<ReturnType<typeof fetchStandings>> = []
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

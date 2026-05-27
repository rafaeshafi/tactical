import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { getFplPlayersForTeam } from '@/lib/fpl/playerDatabase'
import { FplSeasonView } from './FplSeasonView'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

export default async function FplPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  const players = getFplPlayersForTeam(id)

  if (players.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-1">FPL Player Guide</h2>
          <p className="text-sm text-gray-400">
            Detailed FPL data for this team is coming soon. Check back next season.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-500 text-sm">
          No player-level FPL data available for this team yet.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-1">FPL Player Guide</h2>
        <p className="text-sm text-gray-400">
          Named player analysis with 3 seasons of stats. 2025/26 outlook and confirmed departure tracking.
        </p>
      </div>

      <FplSeasonView players={players} />
    </div>
  )
}

export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import type { Player } from '@/types'
import { TacticsBoard } from '@/components/tactics-board/TacticsBoard'
import { fetchTeamStatistics, fetchSquad, fetchRecentFixtures, fetchFixtureLineup } from '@/lib/api-football/client'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

function apiPosToPlayerPosition(pos: string): Player['position'] {
  if (pos === 'G') return 'Goalkeeper'
  if (pos === 'D') return 'Defender'
  if (pos === 'M') return 'Midfielder'
  return 'Attacker'
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

  // Try to get real starting XI from most recent completed fixture
  let squad: Player[] = []
  try {
    const fixtures = await fetchRecentFixtures(id, meta.apiId)
    const recentFt = fixtures.find(f => f.status === 'FT')
    if (recentFt) {
      const lineup = await fetchFixtureLineup(recentFt.id, id)
      if (lineup && lineup.startXI.length > 0) {
        // Use formation from the actual lineup
        formation = lineup.formation
        // Convert startXI to Player[] for TacticsBoard
        squad = lineup.startXI.map(p => ({
          id: p.id,
          name: p.name,
          surname: p.surname,
          number: p.number,
          position: apiPosToPlayerPosition(p.pos),
          photo: p.photo,
        }))
      }
    }
  } catch { /* fall through to squad fetch */ }

  // Fall back to squad fetch if lineup not available
  if (squad.length === 0) {
    try {
      squad = await fetchSquad(id)
    } catch { /* board still works without squad */ }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Tactics Board</h2>
        <p className="text-sm text-gray-400">
          Drag players around the pitch to build your setup. Draw arrows to show movement patterns. Saved to your browser automatically.
        </p>
      </div>
      <TacticsBoard teamId={teamId} initialFormation={formation} squad={squad} />
    </div>
  )
}

export const dynamic = 'force-dynamic'

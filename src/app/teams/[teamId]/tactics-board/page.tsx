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

  // Always fetch the full registered squad for the bench
  let fullSquad: Player[] = []
  try {
    fullSquad = await fetchSquad(id)
  } catch { /* board works without squad */ }

  // Also fetch starting XI from most recent fixture to order the pitch correctly
  let startingIds = new Set<number>()
  let lineupPlayers: Player[] = []

  try {
    const fixtures = await fetchRecentFixtures(id, meta.apiId)
    const recentFt = fixtures.find(f => f.status === 'FT')
    if (recentFt) {
      const lineup = await fetchFixtureLineup(recentFt.id, id)
      if (lineup && lineup.startXI.length > 0) {
        formation = lineup.formation

        // Convert starters and subs from lineup to Player[]
        const allLineupPlayers = [
          ...lineup.startXI.map(p => ({
            id: p.id,
            name: p.name,
            surname: p.surname,
            number: p.number,
            position: apiPosToPlayerPosition(p.pos),
            photo: p.photo,
          })),
          ...lineup.substitutes.map(p => ({
            id: p.id,
            name: p.name,
            surname: p.surname,
            number: p.number,
            position: apiPosToPlayerPosition(p.pos),
            photo: p.photo,
          })),
        ]

        lineupPlayers = allLineupPlayers
        startingIds = new Set(lineup.startXI.map(p => p.id))
      }
    }
  } catch { /* fall through */ }

  let squad: Player[]
  if (lineupPlayers.length > 0) {
    // Starters first (for correct pitch slot mapping), then:
    //  - subs from the lineup
    //  - anyone in the registered squad not already covered
    const lineupIds = new Set(lineupPlayers.map(p => p.id))
    const starters  = lineupPlayers.filter(p => startingIds.has(p.id))
    const subs      = lineupPlayers.filter(p => !startingIds.has(p.id))
    const extra     = fullSquad.filter(p => !lineupIds.has(p.id))
    squad = [...starters, ...subs, ...extra]
  } else {
    // No lineup — use full squad; the board will distribute by position
    squad = fullSquad
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Tactics Board</h2>
        <p className="text-sm text-gray-400">
          Drag players to reshape the formation. Sub players on from the bench. Add future signings in the Custom tab.
        </p>
      </div>
      <TacticsBoard teamId={teamId} initialFormation={formation} squad={squad} />
    </div>
  )
}

export const dynamic = 'force-dynamic'

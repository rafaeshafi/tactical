import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { TacticsBoard } from '@/components/tactics-board/TacticsBoard'
import { fetchTeamStatistics, fetchSquad } from '@/lib/api-football/client'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
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

  let squad: Awaited<ReturnType<typeof fetchSquad>> = []
  try {
    squad = await fetchSquad(id)
  } catch { /* board still works without squad */ }

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

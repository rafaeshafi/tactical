import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { TacticsBoard } from '@/components/tactics-board/TacticsBoard'
import { fetchTeamStatistics } from '@/lib/api-football/client'

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Tactics Board</h2>
        <p className="text-sm text-gray-400">
          Build your own tactical setup. Starts from this team&apos;s current formation. Drag players, draw movement arrows. Saved to your browser.
        </p>
      </div>
      <TacticsBoard teamId={teamId} initialFormation={formation} />
    </div>
  )
}

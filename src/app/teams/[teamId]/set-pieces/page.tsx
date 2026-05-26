import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { SetPieceDiagram } from '@/components/pitch/SetPieceDiagram'
import { getAllRoutinesForTeam } from '@/lib/tactics/set-pieces'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

export default async function SetPiecesPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  const routines = getAllRoutinesForTeam(id)
  const corners = routines.filter(r => r.type === 'corner')
  const freekicks = routines.filter(r => r.type === 'freekick')

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold mb-1">Set Piece Analysis</h2>
        <p className="text-sm text-gray-400">
          Attacking routines, defensive shapes and player run routes. Click Animate to see the play unfold.
        </p>
      </div>

      {/* Corners */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#00ff85]">⬟</span> Corner Routines
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {corners.map(routine => (
            <div key={routine.id} className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
              <div>
                <h4 className="font-bold text-[#e8f5e9]">{routine.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{routine.description}</p>
              </div>
              <SetPieceDiagram routine={routine} width={320} height={260} />
            </div>
          ))}
        </div>
      </section>

      {/* Free kicks */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#f59e0b]">⚽</span> Free Kick Shapes
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {freekicks.map(routine => (
            <div key={routine.id} className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
              <div>
                <h4 className="font-bold text-[#e8f5e9]">{routine.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{routine.description}</p>
              </div>
              <SetPieceDiagram routine={routine} width={320} height={260} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

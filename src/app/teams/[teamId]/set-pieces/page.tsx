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

  // Most dangerous route = routine with most runner roles
  const mostDangerous = routines.reduce<{ name: string; runners: number } | null>((best, r) => {
    const runners = r.routes.filter(ro => ro.role === 'runner').length
    if (!best || runners > best.runners) return { name: r.name, runners }
    return best
  }, null)

  return (
    <div className="space-y-10 max-w-3xl">

      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold mb-1">Set Piece Analysis</h2>
        <p className="text-sm text-gray-400">
          Attacking routines, defensive shapes and player run routes. Click Animate to see the play unfold.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#1e3329] bg-[#111a15] p-4 text-center">
          <div className="text-2xl font-bold text-[#00ff85]">{corners.length}</div>
          <div className="text-xs text-gray-400 mt-1">Corner Routines</div>
        </div>
        <div className="rounded-xl border border-[#1e3329] bg-[#111a15] p-4 text-center">
          <div className="text-2xl font-bold text-[#f59e0b]">{freekicks.length}</div>
          <div className="text-xs text-gray-400 mt-1">Free Kick Shapes</div>
        </div>
        <div className="rounded-xl border border-[#1e3329] bg-[#111a15] p-4 text-center">
          <div className="text-sm font-bold text-white leading-tight line-clamp-2">
            {mostDangerous?.name ?? '—'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Most Dangerous
            {mostDangerous ? ` (${mostDangerous.runners} runners)` : ''}
          </div>
        </div>
      </div>

      {/* Corners */}
      <section>
        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <span className="text-[#00ff85]">⬟</span> Corner Routines
        </h3>
        <div className="flex flex-col gap-8">
          {corners.map(routine => {
            const runners = routine.routes.filter(r => r.role === 'runner').length
            const keyTactic = runners > 2
              ? `${runners} simultaneous runs to overload the penalty area`
              : routine.routes.some(r => r.role === 'blocker')
              ? 'Blocking runners create space at the near post'
              : 'Near–far delivery combination to beat the first defender'
            return (
              <div
                key={routine.id}
                className="rounded-xl border border-[#1e3329] bg-[#111a15] overflow-hidden"
              >
                <div className="p-5 space-y-2 border-b border-[#1e3329]">
                  <h4 className="font-bold text-[#e8f5e9] text-base">{routine.name}</h4>
                  <p className="text-xs text-gray-400">{routine.description}</p>
                  <div className="flex items-start gap-2 pt-1">
                    <span className="text-[#00ff85] text-xs font-semibold shrink-0">Key Tactic</span>
                    <span className="text-xs text-gray-300">{keyTactic}</span>
                  </div>
                </div>
                <div className="p-5">
                  <SetPieceDiagram routine={routine} width={480} height={340} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Free kicks */}
      <section>
        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <span className="text-[#f59e0b]">⚽</span> Free Kick Shapes
        </h3>
        <div className="flex flex-col gap-8">
          {freekicks.map(routine => {
            const runners = routine.routes.filter(r => r.role === 'runner').length
            const keyTactic = routine.routes.some(r => r.role === 'decoy')
              ? 'Decoy movement forces the wall to shift, opening shooting lane'
              : runners > 1
              ? `${runners} late runners target the rebound zone`
              : 'Direct delivery testing the goalkeeper\'s reach'
            return (
              <div
                key={routine.id}
                className="rounded-xl border border-[#1e3329] bg-[#111a15] overflow-hidden"
              >
                <div className="p-5 space-y-2 border-b border-[#1e3329]">
                  <h4 className="font-bold text-[#e8f5e9] text-base">{routine.name}</h4>
                  <p className="text-xs text-gray-400">{routine.description}</p>
                  <div className="flex items-start gap-2 pt-1">
                    <span className="text-[#f59e0b] text-xs font-semibold shrink-0">Key Tactic</span>
                    <span className="text-xs text-gray-300">{keyTactic}</span>
                  </div>
                </div>
                <div className="p-5">
                  <SetPieceDiagram routine={routine} width={480} height={340} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}

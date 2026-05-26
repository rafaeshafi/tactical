import type { Fixture } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  fixtures: Fixture[]
  teamId: number
}

function getResult(fixture: Fixture, teamId: number): 'W' | 'D' | 'L' | null {
  if (fixture.homeScore === null || fixture.awayScore === null) return null
  const isHome = fixture.homeTeam.id === teamId
  const scored = isHome ? fixture.homeScore : fixture.awayScore
  const conceded = isHome ? fixture.awayScore : fixture.homeScore
  if (scored > conceded) return 'W'
  if (scored === conceded) return 'D'
  return 'L'
}

const RESULT_STYLES = {
  W: 'bg-green-500/20 border-green-500/50 text-green-400',
  D: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  L: 'bg-red-500/20 border-red-500/50 text-red-400',
}

export function RecentResultStrip({ fixtures, teamId }: Props) {
  const recent = fixtures.filter(f => f.status === 'FT').slice(0, 5)

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last 5 Results</h3>
      <div className="space-y-1.5">
        {recent.map(fixture => {
          const result = getResult(fixture, teamId)
          const isHome = fixture.homeTeam.id === teamId
          const opponent = isHome ? fixture.awayTeam : fixture.homeTeam
          const scored = isHome ? fixture.homeScore : fixture.awayScore
          const conceded = isHome ? fixture.awayScore : fixture.homeScore

          return (
            <div
              key={fixture.id}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg border',
                result ? RESULT_STYLES[result] : 'border-[#1e3329] text-gray-400'
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn('w-5 h-5 rounded flex items-center justify-center text-xs font-bold', result ? RESULT_STYLES[result] : '')}>
                  {result ?? '?'}
                </span>
                <span className="text-xs text-[#e8f5e9]">{isHome ? 'vs' : '@'} {opponent.shortName}</span>
              </div>
              <span className="font-mono text-sm font-bold">
                {scored} – {conceded}
              </span>
            </div>
          )
        })}
        {recent.length === 0 && (
          <p className="text-xs text-gray-500">No recent results available</p>
        )}
      </div>
    </div>
  )
}

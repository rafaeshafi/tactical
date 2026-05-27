import Image from 'next/image'
import type { Fixture } from '@/types'
import { getGameTags } from '@/lib/tactics/statAnalysis'

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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}

const RESULT_BG: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-[#00ff85]/10 border-[#00ff85]/20',
  D: 'bg-yellow-500/10 border-yellow-500/20',
  L: 'bg-red-500/10 border-red-500/20',
}

const RESULT_BADGE: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-[#00ff85]/20 text-[#00ff85] border-[#00ff85]/30',
  D: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  L: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const RESULT_SCORE: Record<'W' | 'D' | 'L', string> = {
  W: 'text-[#00ff85]',
  D: 'text-yellow-400',
  L: 'text-red-400',
}

export function RecentResultStrip({ fixtures, teamId }: Props) {
  const recent = fixtures.filter(f => f.status === 'FT').slice(0, 5)

  if (recent.length === 0) {
    return (
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Last 5 Results</p>
        <p className="text-xs text-gray-600">No recent results available</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Last 5 Results</p>
      <div className="space-y-2">
        {recent.map(fixture => {
          const result = getResult(fixture, teamId)
          const isHome = fixture.homeTeam.id === teamId
          const opponent = isHome ? fixture.awayTeam : fixture.homeTeam
          const teamScore = isHome ? fixture.homeScore : fixture.awayScore
          const oppScore = isHome ? fixture.awayScore : fixture.homeScore
          const tags = getGameTags(teamScore, oppScore, isHome, result)
          const dateStr = formatDate(fixture.date)

          return (
            <div
              key={fixture.id}
              className={`relative rounded-xl border px-4 py-3 transition-all ${result ? RESULT_BG[result] : 'border-[#1e3329] bg-[#0d1810]'}`}
            >
              <div className="flex items-center gap-3">

                {/* Result badge */}
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black shrink-0 ${result ? RESULT_BADGE[result] : 'border-[#1e3329] text-gray-500'}`}>
                  {result ?? '?'}
                </div>

                {/* Opponent crest */}
                {opponent.crestUrl ? (
                  <div className="relative w-7 h-7 shrink-0">
                    <Image
                      src={opponent.crestUrl}
                      alt={opponent.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#1a2e22] shrink-0" />
                )}

                {/* Opponent name + home/away */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-[#e8f5e9] truncate">
                      {isHome ? 'vs' : '@'} {opponent.name}
                    </span>
                    <span className="text-[10px] text-gray-600 shrink-0">{isHome ? 'H' : 'A'}</span>
                  </div>
                  {/* Tags row */}
                  {tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {tags.map(tag => (
                        <span
                          key={tag.label}
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Score + date */}
                <div className="shrink-0 text-right">
                  <p className={`text-xl font-black tabular-nums leading-none ${result ? RESULT_SCORE[result] : 'text-gray-400'}`}>
                    {teamScore ?? '?'}<span className="text-gray-600 mx-0.5">–</span>{oppScore ?? '?'}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{dateStr}</p>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

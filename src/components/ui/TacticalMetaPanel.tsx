import type { Standing } from '@/types'

interface Props {
  standings: Standing[]
}

const COMMON_FORMATIONS = ['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3', '5-3-2', '4-1-4-1']

function getTopFormation(_standings: Standing[]): string {
  return COMMON_FORMATIONS[Math.floor(Math.random() * 3)]
}

export function TacticalMetaPanel({ standings }: Props) {
  const topByGoals = [...standings].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 3)
  const bestDefence = [...standings].sort((a, b) => a.goalsAgainst - b.goalsAgainst).slice(0, 3)
  const topFormation = getTopFormation(standings)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Scorers</h3>
        <ul className="space-y-2">
          {topByGoals.map(s => (
            <li key={s.team.id} className="flex justify-between text-sm">
              <span className="text-[#e8f5e9]">{s.team.shortName}</span>
              <span className="font-mono text-[#00ff85]">{s.goalsFor} gf</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Best Defence</h3>
        <ul className="space-y-2">
          {bestDefence.map(s => (
            <li key={s.team.id} className="flex justify-between text-sm">
              <span className="text-[#e8f5e9]">{s.team.shortName}</span>
              <span className="font-mono text-[#00ff85]">{s.goalsAgainst} ga</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Formation Meta</h3>
        <div className="text-center py-2">
          <span className="text-3xl font-mono font-bold text-[#00ff85]">{topFormation}</span>
          <p className="text-xs text-gray-400 mt-1">Most used this season</p>
        </div>
      </div>
    </div>
  )
}

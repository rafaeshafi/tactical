import { FormationBadge } from './FormationBadge'
import { StatPill } from './StatPill'
import type { TeamStatistics } from '@/types'
import type { PressingData } from '@/lib/tactics/pressing'

interface Props {
  stats: TeamStatistics
  pressing: PressingData
}

function getStyleLabel(pressing: PressingData, stats: TeamStatistics): string {
  const parts: string[] = []
  parts.push(pressing.pressStyle)
  if (stats.passAccuracy > 85) parts.push('Possession')
  else if (stats.passAccuracy < 75) parts.push('Direct')
  return parts.join(' · ')
}

export function TacticalIdentityCard({ stats, pressing }: Props) {
  const styleLabel = getStyleLabel(pressing, stats)

  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FormationBadge formation={stats.formation} className="text-sm px-3 py-1" />
            <span className="text-xs text-gray-400">{styleLabel}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Season 2024/25</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#00ff85]">{stats.wins}W</p>
          <p className="text-xs text-gray-400">{stats.draws}D {stats.losses}L</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatPill label="PPDA" value={pressing.ppda} highlight />
        <StatPill label="Pass Acc" value={`${stats.passAccuracy}%`} />
        <StatPill label="Goals F" value={stats.goalsFor} />
        <StatPill label="Goals A" value={stats.goalsAgainst} />
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-[#1e3329]">
        <div
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: pressing.pressStyle === 'High Press' ? 'rgba(239,68,68,0.15)' :
              pressing.pressStyle === 'Mid Block' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
            color: pressing.pressStyle === 'High Press' ? '#ef4444' :
              pressing.pressStyle === 'Mid Block' ? '#f59e0b' : '#3b82f6',
          }}
        >
          {pressing.recoveryZone} recovery
        </div>
      </div>
    </div>
  )
}

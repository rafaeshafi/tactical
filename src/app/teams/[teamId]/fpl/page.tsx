import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { getFplPlayersForTeam } from '@/lib/fpl/playerDatabase'
import type { FplPlayer, FplSeasonRecord } from '@/lib/fpl/playerDatabase'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

// ── Styling maps ───────────────────────────────────────────────────────────
const REC_STYLES: Record<FplPlayer['recommendation'], string> = {
  Essential:    'bg-green-500/20 border-green-500/60 text-green-400',
  'Good Pick':  'bg-[#00ff85]/10 border-[#00ff85]/40 text-[#00ff85]',
  Differential: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  Avoid:        'bg-red-500/20 border-red-500/50 text-red-400',
}

const REC_HEADER_STYLES: Record<FplPlayer['recommendation'], string> = {
  Essential:    'border-green-500/40 text-green-400',
  'Good Pick':  'border-[#00ff85]/30 text-[#00ff85]',
  Differential: 'border-blue-500/40 text-blue-400',
  Avoid:        'border-red-500/40 text-red-400',
}

const ROT_COLORS: Record<FplPlayer['rotationRisk'], string> = {
  Low:    'text-green-400',
  Medium: 'text-yellow-400',
  High:   'text-red-400',
}

const POS_COLORS: Record<FplPlayer['position'], string> = {
  GK:  'bg-amber-500/20 text-amber-400 border-amber-500/40',
  DEF: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  MID: 'bg-green-500/20 text-green-400 border-green-500/40',
  FWD: 'bg-[#00ff85]/10 text-[#00ff85] border-[#00ff85]/30',
}

const REC_ORDER: FplPlayer['recommendation'][] = ['Essential', 'Good Pick', 'Differential', 'Avoid']
const REC_ICONS: Record<FplPlayer['recommendation'], string> = {
  Essential: '⚡',
  'Good Pick': '✅',
  Differential: '🎯',
  Avoid: '❌',
}

// ── History row ────────────────────────────────────────────────────────────
function HistoryRow({ row }: { row: FplSeasonRecord }) {
  const hasData = row.points !== null

  return (
    <tr className="border-t border-[#1e3329]/60">
      <td className="py-1.5 px-2 text-xs text-gray-400 font-mono">{row.season}</td>
      <td className="py-1.5 px-2 text-xs text-center">
        {hasData
          ? <span className="font-bold text-[#e8f5e9]">{row.points}</span>
          : <span className="text-gray-600">—</span>}
      </td>
      <td className="py-1.5 px-2 text-xs text-center">
        {hasData
          ? <span className="text-[#e8f5e9]">{row.goals}</span>
          : <span className="text-gray-600">—</span>}
      </td>
      <td className="py-1.5 px-2 text-xs text-center">
        {hasData
          ? <span className="text-[#e8f5e9]">{row.assists}</span>
          : <span className="text-gray-600">—</span>}
      </td>
      {row.cleanSheets !== undefined && (
        <td className="py-1.5 px-2 text-xs text-center">
          {row.cleanSheets !== null
            ? <span className="text-blue-300">{row.cleanSheets}</span>
            : <span className="text-gray-600">—</span>}
        </td>
      )}
      <td className="py-1.5 px-2 text-xs text-center text-gray-400">
        {row.cost ? `£${row.cost}m` : '—'}
      </td>
    </tr>
  )
}

// ── Player card ────────────────────────────────────────────────────────────
function PlayerCard({ player }: { player: FplPlayer }) {
  const showCS = player.history.some(h => h.cleanSheets !== undefined)
  const latest = player.history[0]

  return (
    <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[10px] px-2 py-0.5 rounded border font-bold tracking-wide', POS_COLORS[player.position])}>
            {player.position}
          </span>
          <h3 className="font-bold text-[#e8f5e9] text-base">{player.fullName}</h3>
        </div>
        <span className={cn('shrink-0 text-xs px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap', REC_STYLES[player.recommendation])}>
          {REC_ICONS[player.recommendation]} {player.recommendation}
        </span>
      </div>

      {/* Latest season quick stats */}
      {latest && latest.points !== null && (
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500">Points</p>
            <p className="font-bold text-[#00ff85]">{latest.points}</p>
          </div>
          {latest.goals !== null && (
            <div>
              <p className="text-xs text-gray-500">Goals</p>
              <p className="font-bold text-[#e8f5e9]">{latest.goals}</p>
            </div>
          )}
          {latest.assists !== null && (
            <div>
              <p className="text-xs text-gray-500">Assists</p>
              <p className="font-bold text-[#e8f5e9]">{latest.assists}</p>
            </div>
          )}
          {latest.cleanSheets !== undefined && latest.cleanSheets !== null && (
            <div>
              <p className="text-xs text-gray-500">CS</p>
              <p className="font-bold text-blue-300">{latest.cleanSheets}</p>
            </div>
          )}
          {latest.cost !== null && (
            <div>
              <p className="text-xs text-gray-500">Cost</p>
              <p className="font-bold text-gray-300">£{latest.cost}m</p>
            </div>
          )}
        </div>
      )}

      {/* Reason */}
      <p className="text-sm text-gray-300 leading-relaxed">{player.reason}</p>

      {/* History table */}
      <div className="rounded-lg overflow-hidden border border-[#1e3329]/60">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0d1710]">
              <th className="py-1.5 px-2 text-[10px] text-gray-500 text-left font-medium">Season</th>
              <th className="py-1.5 px-2 text-[10px] text-gray-500 text-center font-medium">Pts</th>
              <th className="py-1.5 px-2 text-[10px] text-gray-500 text-center font-medium">G</th>
              <th className="py-1.5 px-2 text-[10px] text-gray-500 text-center font-medium">A</th>
              {showCS && <th className="py-1.5 px-2 text-[10px] text-gray-500 text-center font-medium">CS</th>}
              <th className="py-1.5 px-2 text-[10px] text-gray-500 text-center font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {player.history.map((row, i) => (
              <HistoryRow key={i} row={row} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Rotation risk */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-gray-500">Rotation risk:</span>
        <span className={cn('font-semibold', ROT_COLORS[player.rotationRisk])}>{player.rotationRisk}</span>
        {player.rotationRisk === 'High' && (
          <span className="text-gray-500">— start only in good fixtures</span>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
export default async function FplPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  const players = getFplPlayersForTeam(id)

  if (players.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-1">FPL Player Guide</h2>
          <p className="text-sm text-gray-400">
            Detailed FPL data for this team is coming soon. Check back next season.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-500 text-sm">
          No player-level FPL data available for this team yet.
        </div>
      </div>
    )
  }

  // Group by recommendation
  const grouped = REC_ORDER.reduce<Record<FplPlayer['recommendation'], FplPlayer[]>>(
    (acc, rec) => {
      acc[rec] = players.filter(p => p.recommendation === rec)
      return acc
    },
    { Essential: [], 'Good Pick': [], Differential: [], Avoid: [] }
  )

  const totalPts24_25 = players
    .map(p => p.history[0]?.points ?? 0)
    .reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-1">FPL Player Guide</h2>
        <p className="text-sm text-gray-400">
          Named player analysis with 3 seasons of stats. Who to buy, who to avoid, and why.
        </p>
      </div>

      {/* Quick summary bar */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(grouped) as FplPlayer['recommendation'][]).map(rec => {
          const count = grouped[rec].length
          if (count === 0) return null
          return (
            <div
              key={rec}
              className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm', REC_HEADER_STYLES[rec])}
            >
              <span>{REC_ICONS[rec]}</span>
              <span className="font-semibold">{count}×</span>
              <span className="text-gray-400">{rec}</span>
            </div>
          )
        })}
        {totalPts24_25 > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e3329] bg-[#111a15] text-sm">
            <span className="text-gray-400">Combined 24/25</span>
            <span className="font-bold text-[#00ff85]">{totalPts24_25} pts</span>
          </div>
        )}
      </div>

      {/* Sections */}
      {REC_ORDER.map(rec => {
        const group = grouped[rec]
        if (group.length === 0) return null

        return (
          <section key={rec} className="space-y-3">
            <div className={cn('flex items-center gap-2 pb-2 border-b', REC_HEADER_STYLES[rec])}>
              <span className="text-xl">{REC_ICONS[rec]}</span>
              <h3 className="text-lg font-bold">{rec}</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {group.map(player => (
                <PlayerCard key={player.surname} player={player} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 border-t border-[#1e3329] pt-4">
        Stats based on 2022/23–2024/25 FPL seasons. 2025/26 cost estimates at season start. New signings show Null for PL history.
      </p>
    </div>
  )
}

export const dynamic = 'force-dynamic'

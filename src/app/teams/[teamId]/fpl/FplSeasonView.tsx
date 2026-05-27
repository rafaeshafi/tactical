'use client'

import { useState } from 'react'
import type { FplPlayer, FplSeasonRecord } from '@/lib/fpl/playerDatabase'
import { cn } from '@/lib/utils'

// ── Styling maps ───────────────────────────────────────────────────────────
type Rec = 'Essential' | 'Good Pick' | 'Differential' | 'Avoid'
type Rec2526 = Rec | 'Departing'

const REC_STYLES: Record<Rec, string> = {
  Essential:    'bg-green-500/20 border-green-500/60 text-green-400',
  'Good Pick':  'bg-[#00ff85]/10 border-[#00ff85]/40 text-[#00ff85]',
  Differential: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  Avoid:        'bg-red-500/20 border-red-500/50 text-red-400',
}

const REC_HEADER_STYLES: Record<Rec, string> = {
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

const REC_ORDER: Rec[] = ['Essential', 'Good Pick', 'Differential', 'Avoid']
const REC_ICONS: Record<Rec, string> = {
  Essential:    '⚡',
  'Good Pick':  '✅',
  Differential: '🎯',
  Avoid:        '❌',
}

// ── History row ────────────────────────────────────────────────────────────
function HistoryRow({ row }: { row: FplSeasonRecord }) {
  const hasData = row.points !== null
  const hasGoals = row.goals !== null

  return (
    <tr className="border-t border-[#1e3329]/60">
      <td className="py-1.5 px-2 text-xs text-gray-400 font-mono">{row.season}</td>
      <td className="py-1.5 px-2 text-xs text-center">
        {hasData
          ? <span className="font-bold text-[#e8f5e9]">{row.points}</span>
          : <span className="text-gray-600">—</span>}
      </td>
      <td className="py-1.5 px-2 text-xs text-center">
        {hasGoals
          ? <span className="text-[#e8f5e9]">{row.goals}</span>
          : <span className="text-gray-600">—</span>}
      </td>
      <td className="py-1.5 px-2 text-xs text-center">
        {row.assists !== null
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

// ── Historical player card ─────────────────────────────────────────────────
function PlayerCard({ player }: { player: FplPlayer }) {
  const showCS = player.history.some(h => h.cleanSheets !== undefined)
  const latest = player.history[0]

  return (
    <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-3">
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

      <p className="text-sm text-gray-300 leading-relaxed">{player.reason}</p>

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

// ── Outlook card (2025/26) ─────────────────────────────────────────────────
function OutlookCard({ player }: { player: FplPlayer }) {
  const rec = (player.recommendation2526 ?? player.recommendation) as Rec
  const recStyle = REC_STYLES[rec] ?? REC_STYLES.Avoid
  const recIcon = REC_ICONS[rec] ?? '❌'
  const latest = player.history[0]

  return (
    <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[10px] px-2 py-0.5 rounded border font-bold tracking-wide', POS_COLORS[player.position])}>
            {player.position}
          </span>
          <h3 className="font-bold text-[#e8f5e9] text-base">{player.fullName}</h3>
          {player.isNewSigning && (
            <span className="text-[10px] px-2 py-0.5 rounded border font-bold tracking-wide bg-purple-500/20 border-purple-500/50 text-purple-300">
              NEW SIGNING
            </span>
          )}
        </div>
        <span className={cn('shrink-0 text-xs px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap', recStyle)}>
          {recIcon} {rec}
        </span>
      </div>

      {latest?.cost !== null && (
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500">Est. Cost 25/26</p>
            <p className="font-bold text-gray-300">£{latest.cost}m</p>
          </div>
        </div>
      )}

      {player.outlook2526 && (
        <p className="text-sm text-[#e8f5e9] leading-relaxed font-medium">{player.outlook2526}</p>
      )}

      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-gray-500">Rotation risk:</span>
        <span className={cn('font-semibold', ROT_COLORS[player.rotationRisk])}>{player.rotationRisk}</span>
      </div>
    </div>
  )
}

// ── Departure card ─────────────────────────────────────────────────────────
function DepartureCard({ player }: { player: FplPlayer }) {
  const latest = player.history[0]

  return (
    <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-2">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[10px] px-2 py-0.5 rounded border font-bold tracking-wide', POS_COLORS[player.position])}>
            {player.position}
          </span>
          <h3 className="font-bold text-gray-400 text-base line-through decoration-red-500/60">{player.fullName}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded border font-bold tracking-wide bg-red-500/20 border-red-500/50 text-red-400">
            DEPARTED
          </span>
        </div>
        {latest?.points !== null && latest?.points && (
          <span className="text-xs text-gray-500 font-mono">{latest.points} pts 24/25</span>
        )}
      </div>
      {player.departureNote && (
        <p className="text-sm text-red-300/80 leading-relaxed">{player.departureNote}</p>
      )}
    </div>
  )
}

// ── Historical tab ─────────────────────────────────────────────────────────
function HistoricalView({ players }: { players: FplPlayer[] }) {
  const grouped = REC_ORDER.reduce<Record<Rec, FplPlayer[]>>(
    (acc, rec) => {
      acc[rec] = players.filter(p => p.recommendation === rec)
      return acc
    },
    { Essential: [], 'Good Pick': [], Differential: [], Avoid: [] },
  )

  const totalPts = players
    .map(p => p.history[0]?.points ?? 0)
    .reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      <div className="flex flex-wrap gap-3">
        {REC_ORDER.map(rec => {
          const count = grouped[rec].length
          if (count === 0) return null
          return (
            <div key={rec} className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm', REC_HEADER_STYLES[rec])}>
              <span>{REC_ICONS[rec]}</span>
              <span className="font-semibold">{count}×</span>
              <span className="text-gray-400">{rec}</span>
            </div>
          )
        })}
        {totalPts > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e3329] bg-[#111a15] text-sm">
            <span className="text-gray-400">Combined 24/25</span>
            <span className="font-bold text-[#00ff85]">{totalPts} pts</span>
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

      <p className="text-xs text-gray-600 border-t border-[#1e3329] pt-4">
        Stats based on 2022/23–2024/25 FPL seasons. New signings show Null for PL history.
      </p>
    </div>
  )
}

// ── Outlook tab (2025/26) ──────────────────────────────────────────────────
function OutlookView({ players }: { players: FplPlayer[] }) {
  const active = players.filter(p => !p.departureConfirmed)
  const departing = players.filter(p => p.departureConfirmed)

  const grouped = REC_ORDER.reduce<Record<Rec, FplPlayer[]>>(
    (acc, rec) => {
      acc[rec] = active.filter(p => (p.recommendation2526 ?? p.recommendation) === rec)
      return acc
    },
    { Essential: [], 'Good Pick': [], Differential: [], Avoid: [] },
  )

  const sectionLabels: Record<Rec, string> = {
    Essential:    'MUST BUY',
    'Good Pick':  'SOLID PICKS',
    Differential: 'DIFFERENTIALS',
    Avoid:        'PLAYERS TO AVOID',
  }

  return (
    <div className="space-y-8">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-xl border border-[#00ff85]/20 bg-[#00ff85]/5 text-sm text-[#00ff85]/80">
        <span className="text-base">📅</span>
        <span>Planning guide for the <strong className="text-[#00ff85]">2025/26 FPL season</strong>. Departing players are excluded from recommendations.</span>
      </div>

      {/* Sections */}
      {REC_ORDER.map(rec => {
        const group = grouped[rec]
        if (group.length === 0) return null
        return (
          <section key={rec} className="space-y-3">
            <div className={cn('flex items-center gap-2 pb-2 border-b', REC_HEADER_STYLES[rec])}>
              <span className="text-xl">{REC_ICONS[rec]}</span>
              <h3 className="text-lg font-bold">{sectionLabels[rec]}</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {group.map(player => (
                <OutlookCard key={player.surname} player={player} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Confirmed departures */}
      {departing.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-red-500/40 text-red-400">
            <span className="text-xl">⬅️</span>
            <h3 className="text-lg font-bold">CONFIRMED DEPARTURES</h3>
          </div>
          <p className="text-xs text-red-400/60">These players will NOT be available in 2025/26 FPL.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {departing.map(player => (
              <DepartureCard key={player.surname} player={player} />
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-gray-600 border-t border-[#1e3329] pt-4">
        2025/26 season outlook. Costs are estimated pre-season values. New signings show no PL history.
      </p>
    </div>
  )
}

// ── Main season view (with tabs) ───────────────────────────────────────────
export function FplSeasonView({ players }: { players: FplPlayer[] }) {
  const [tab, setTab] = useState<'2526' | '2425'>('2526')

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#0d1710] border border-[#1e3329] w-fit">
        <button
          onClick={() => setTab('2526')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
            tab === '2526'
              ? 'bg-[#1a2e1f] text-[#00ff85] shadow-sm border border-[#00ff85]/20'
              : 'text-gray-500 hover:text-gray-300',
          )}
        >
          2025/26 Outlook
        </button>
        <button
          onClick={() => setTab('2425')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
            tab === '2425'
              ? 'bg-[#1a2e1f] text-[#e8f5e9] shadow-sm border border-[#1e3329]'
              : 'text-gray-500 hover:text-gray-300',
          )}
        >
          2024/25 Season
        </button>
      </div>

      {tab === '2526'
        ? <OutlookView players={players} />
        : <HistoricalView players={players} />}
    </div>
  )
}

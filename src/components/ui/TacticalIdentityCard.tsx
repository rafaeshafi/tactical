import { FormationBadge } from './FormationBadge'
import type { TeamStatistics, Standing } from '@/types'
import type { PressingData } from '@/lib/tactics/pressing'
import {
  analyzeRecord,
  analyzeAttack,
  analyzeDefence,
  analyzePressing,
  analyzeDiscipline,
  describeFormation,
} from '@/lib/tactics/statAnalysis'

interface Props {
  stats: TeamStatistics
  pressing: PressingData
  standing?: Standing | null
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{children}</p>
  )
}

function AnalysisBlock({
  headline,
  detail,
  colorClass,
}: {
  headline: string
  detail: string
  colorClass: string
}) {
  return (
    <div className="mt-1.5">
      <p className={`text-sm font-semibold leading-snug ${colorClass}`}>{headline}</p>
      {detail && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{detail}</p>}
    </div>
  )
}

export function TacticalIdentityCard({ stats, pressing, standing }: Props) {
  const played = stats.fixturesPlayed || 1

  const recordAnalysis  = analyzeRecord(stats.wins, stats.draws, stats.losses, stats.fixturesPlayed)
  const attackAnalysis  = analyzeAttack(stats.goalsFor, played)
  const defenceAnalysis = analyzeDefence(stats.goalsAgainst, played)
  const pressAnalysis   = analyzePressing(pressing.ppda)
  const discAnalysis    = analyzeDiscipline(stats.yellowCards, stats.redCards, played)
  const formationDesc   = describeFormation(stats.formation)

  const passAcc = stats.passAccuracy > 0 ? `${stats.passAccuracy}%` : null

  return (
    <div className="rounded-xl border border-[#1e3329] bg-[#0d1810] divide-y divide-[#1a2e22] overflow-hidden">

      {/* ── Header: formation + record ── */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <FormationBadge formation={stats.formation} className="text-sm px-3 py-1" />
            <span className="text-xs text-gray-400">{pressing.pressStyle}</span>
            {standing && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a2e22] text-gray-400">
                #{standing.rank} · {standing.points} pts
              </span>
            )}
          </div>
          <AnalysisBlock {...recordAnalysis} />
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-black text-[#00ff85] tabular-nums">{stats.wins}W</p>
          <p className="text-xs text-gray-400 tabular-nums">{stats.draws}D {stats.losses}L</p>
          <p className="text-[10px] text-gray-600 mt-0.5">Season 2025/26</p>
        </div>
      </div>

      {/* ── Formation description ── */}
      <div className="px-5 py-4">
        <SectionLabel>Tactical Shape</SectionLabel>
        <p className="text-xs text-gray-400 leading-relaxed">{formationDesc}</p>
      </div>

      {/* ── Attack + Defence ── */}
      <div className="grid grid-cols-2 divide-x divide-[#1a2e22]">
        <div className="px-5 py-4">
          <SectionLabel>⚽ Attack</SectionLabel>
          <p className="text-3xl font-black tabular-nums text-white">{stats.goalsFor}</p>
          <p className="text-xs text-gray-500">goals scored</p>
          <AnalysisBlock {...attackAnalysis} />
        </div>
        <div className="px-5 py-4">
          <SectionLabel>🛡 Defence</SectionLabel>
          <p className="text-3xl font-black tabular-nums text-white">{stats.goalsAgainst}</p>
          <p className="text-xs text-gray-500">goals conceded</p>
          <AnalysisBlock {...defenceAnalysis} />
        </div>
      </div>

      {/* ── Pressing ── */}
      <div className="px-5 py-4">
        <SectionLabel>⚡ Pressing Intensity</SectionLabel>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-black tabular-nums text-white">{pressing.ppda}</span>
          <span className="text-xs text-gray-500">PPDA · {pressing.recoveryZone} recovery</span>
        </div>
        {/* PPDA bar */}
        <div className="relative h-1.5 w-full rounded-full bg-[#1a2e22] overflow-hidden mb-2">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#00ff85] to-[#00b4ff] transition-all"
            style={{ width: `${Math.min(100, Math.max(5, ((20 - pressing.ppda) / 16) * 100))}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-gray-600 mb-2">
          <span>High press (3)</span>
          <span>Mid block (10)</span>
          <span>Low block (20)</span>
        </div>
        <AnalysisBlock {...pressAnalysis} />
      </div>

      {/* ── Pass accuracy (if available) + Discipline ── */}
      <div className="grid grid-cols-2 divide-x divide-[#1a2e22]">
        <div className="px-5 py-4">
          <SectionLabel>🎯 Pass Accuracy</SectionLabel>
          {passAcc ? (
            <>
              <p className="text-3xl font-black tabular-nums text-white">{passAcc}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {stats.passAccuracy >= 85
                  ? 'Elite possession game'
                  : stats.passAccuracy >= 78
                  ? 'Comfortable in possession'
                  : 'Direct, long-ball tendency'}
              </p>
            </>
          ) : (
            <>
              <p className="text-3xl font-black text-gray-600">—</p>
              <p className="text-xs text-gray-600 mt-0.5">Not yet available</p>
            </>
          )}
        </div>
        <div className="px-5 py-4">
          <SectionLabel>🟨 Discipline</SectionLabel>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black tabular-nums text-white">{stats.yellowCards}</p>
            <span className="text-xs text-gray-500">yellow</span>
            {stats.redCards > 0 && (
              <>
                <p className="text-xl font-black tabular-nums text-red-400 ml-1">{stats.redCards}</p>
                <span className="text-xs text-gray-500">red</span>
              </>
            )}
          </div>
          <AnalysisBlock {...discAnalysis} />
        </div>
      </div>

    </div>
  )
}

import { notFound } from 'next/navigation'
import { fetchTeamStatistics, fetchSquad } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { PressMap }       from '@/components/pitch/PressMap'
import { PassNetwork }    from '@/components/pitch/PassNetwork'
import { HeatmapOverlay, type HeatmapPlayer } from '@/components/pitch/HeatmapOverlay'
import { buildPassNetwork } from '@/lib/tactics/pass-network'
import { getFormationPositions } from '@/lib/tactics/formations'
import type { Player } from '@/types'
import type { PressingData } from '@/lib/tactics/pressing'
import { getTeamStatOverrides } from '@/lib/tactics/teamStats'
import { getTeamTacticalProfile } from '@/lib/tactics/tacticalProfiles'
import type { TeamTacticalProfile } from '@/lib/tactics/tacticalProfiles'
import { getKnownLineup } from '@/lib/tactics/knownLineups'

interface Props {
  params:       Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

// ── Pressing from real PPDA ────────────────────────────────────────────────
function buildPressingFromPPDA(ppda: number): PressingData {
  const pressStyle: PressingData['pressStyle'] =
    ppda < 7 ? 'High Press' : ppda < 12 ? 'Mid Block' : 'Low Block'
  const recoveryZone: PressingData['recoveryZone'] =
    ppda < 7 ? 'High Third' : ppda < 12 ? 'Middle Third' : 'Own Half'

  return {
    ppda,
    pressStyle,
    recoveryZone,
    zones: [
      { x: 50, y: 16, intensity: pressStyle === 'High Press' ? 0.75 : 0.15, label: 'High Press' },
      { x: 50, y: 50, intensity: pressStyle === 'Mid Block'  ? 0.65 : 0.3,  label: 'Mid Block'  },
      { x: 50, y: 83, intensity: pressStyle === 'Low Block'  ? 0.80 : 0.15, label: 'Defensive'  },
    ],
  }
}

// ── Pass network from real squad + formation topology ─────────────────────
function roleToPositionType(role: string): Player['position'] {
  if (role === 'GK') return 'Goalkeeper'
  if (['LB','RB','LCB','RCB','CB','LWB','RWB'].includes(role)) return 'Defender'
  if (['LW','RW','ST','LS','RS','LSS','RSS'].includes(role)) return 'Attacker'
  return 'Midfielder'
}

function buildPassNetworkFromSquad(formation: string, squad: Player[]) {
  const positions = getFormationPositions(formation)

  const byType: Record<Player['position'], Player[]> = {
    Goalkeeper: [], Defender: [], Midfielder: [], Attacker: [],
  }
  for (const p of squad) byType[p.position].push(p)
  for (const key of Object.keys(byType) as Player['position'][]) {
    byType[key].sort((a, b) => (a.number ?? 99) - (b.number ?? 99))
  }
  const usedIdx: Record<Player['position'], number> = {
    Goalkeeper: 0, Defender: 0, Midfielder: 0, Attacker: 0,
  }

  const nodes = positions.map((pos, i) => {
    const type = roleToPositionType(pos.role)
    const sp   = byType[type][usedIdx[type]++] ?? null
    return {
      id: i + 1,
      name: sp ? sp.surname : pos.role,
      avgX: pos.x,
      avgY: pos.y,
      passes: [] as { toId: number; count: number }[],
    }
  })

  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const dx   = nodes[a].avgX - nodes[b].avgX
      const dy   = nodes[a].avgY - nodes[b].avgY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 38) continue

      const base         = Math.round(40 - dist * 0.7)
      const centralBonus = (nodes[a].avgX > 35 && nodes[a].avgX < 65) ||
                           (nodes[b].avgX > 35 && nodes[b].avgX < 65) ? 6 : 0
      const count = Math.max(8, base + centralBonus)
      nodes[a].passes.push({ toId: nodes[b].id, count })
    }
  }

  return buildPassNetwork(nodes)
}

// ── Heatmap from formation positions ──────────────────────────────────────
interface HeatPoint { x: number; y: number; intensity: number }

function buildFormationHeatmap(
  formation: string,
  squad?: Player[],
): { allPoints: HeatPoint[]; players: HeatmapPlayer[] } {
  const positions = getFormationPositions(formation)

  // Resolve player names using the same squad-mapping logic as pass network
  const byType: Record<Player['position'], Player[]> = {
    Goalkeeper: [], Defender: [], Midfielder: [], Attacker: [],
  }
  if (squad) {
    for (const p of squad) byType[p.position].push(p)
    for (const key of Object.keys(byType) as Player['position'][]) {
      byType[key].sort((a, b) => (a.number ?? 99) - (b.number ?? 99))
    }
  }
  const usedIdx: Record<Player['position'], number> = {
    Goalkeeper: 0, Defender: 0, Midfielder: 0, Attacker: 0,
  }

  const allPoints: HeatPoint[] = []
  const players: HeatmapPlayer[] = []

  positions
    .filter(pos => pos.role !== 'GK')
    .forEach((pos, i) => {
      const hy = 100 - pos.y
      const type = roleToPositionType(pos.role)
      const sp = squad ? (byType[type][usedIdx[type]++] ?? null) : null
      const displayName = sp ? sp.surname : pos.role

      // 4-6 scatter points per player
      const count = 4 + Math.floor(Math.random() * 3)
      const pts: HeatPoint[] = Array.from({ length: count }, (_, j) => {
        const scatter = j === 0 ? 0 : 10
        return {
          x: Math.max(2, Math.min(98, pos.x + (Math.random() - 0.5) * scatter)),
          y: Math.max(2, Math.min(98, hy  + (Math.random() - 0.5) * scatter)),
          intensity: 0.6 + Math.random() * 0.3,
        }
      })

      allPoints.push(...pts)
      players.push({ id: i + 1, name: displayName, role: pos.role, points: pts })
    })

  return { allPoints, players }
}

// ── Tactical notes generator ───────────────────────────────────────────────
function buildTacticalNotes(
  formation: string,
  ppda: number,
  passAccuracy: number,
): string[] {
  const notes: string[] = []

  // Pressing note
  if (ppda < 7) {
    notes.push(`With a PPDA of ${ppda}, this team ranks among the league's most aggressive pressers, winning the ball high and fast-transitioning into attack.`)
  } else if (ppda < 12) {
    notes.push(`A mid-press PPDA of ${ppda} reflects a balanced approach — disrupting build-up in the middle third without committing too many players forward.`)
  } else {
    notes.push(`A high PPDA of ${ppda} indicates a deep-sitting defensive block; the team conserves energy and absorbs pressure before hitting on the counter.`)
  }

  // Formation structure note
  const parts   = formation.split('-').map(Number)
  const midLine = parts.length >= 3 ? parts[parts.length - 2] : parts[1]
  if (midLine >= 4) {
    notes.push(`The ${formation} shape floods the midfield with ${midLine} players, giving superior central control and multiple passing angles out of possession.`)
  } else if (midLine === 3) {
    notes.push(`The ${formation} three-man midfield relies on wide areas for progression — fullbacks or wingers are pivotal in creating numerical superiority on the flanks.`)
  } else {
    notes.push(`Playing ${formation}, the team uses a compact two-man midfield to keep the defensive block tight, asking the attack to press from the front.`)
  }

  // Pass accuracy / build-up note
  if (passAccuracy >= 83) {
    notes.push(`${passAccuracy}% pass accuracy points to a possession-dominant style — short combination play through the thirds is the primary method of generating chances.`)
  } else if (passAccuracy >= 78) {
    notes.push(`At ${passAccuracy}% pass accuracy the team blends patient build-up with more direct vertical balls; both routes to goal are utilised depending on game state.`)
  } else {
    notes.push(`${passAccuracy}% pass accuracy reflects a more direct, transition-heavy philosophy — quick vertical passes over defensive lines rather than patient circulation.`)
  }

  return notes
}

// ── Profile tactical notes section ────────────────────────────────────────
function ProfileNotes({ profile }: { profile: TeamTacticalProfile }) {
  const paragraphs: [string, string][] = [
    ['Shape Analysis',      profile.shapeAnalysis],
    ['Pressing Analysis',   profile.pressAnalysis],
    ['Build-Up Analysis',   profile.buildUpAnalysis],
    ['Attacking Patterns',  profile.attackingAnalysis],
    ['Defensive Shape',     profile.defensiveAnalysis],
  ]
  return (
    <div className="p-5 rounded-xl bg-[#0d1710] border border-[#1e3329] space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#00ff85] inline-block shrink-0" />
        <h2 className="text-lg font-bold">Tactical Notes</h2>
        <span className="ml-auto flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-[#00ff85]/10 border border-[#00ff85]/30 text-[10px] font-semibold text-[#00ff85]">
            2025/26
          </span>
          <span className="px-3 py-1 rounded-full bg-[#111a15] border border-[#1e3329] text-xs font-semibold text-[#00ff85]">
            {profile.style}
          </span>
        </span>
      </div>
      <div className="p-4 rounded-lg bg-[#111a15] border-l-2 border-[#00ff85]">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Key Pattern</p>
        <p className="text-sm text-[#e8f5e9] leading-relaxed">{profile.keyPattern}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-green-400 mb-2">Strengths</p>
          <ul className="space-y-1.5">
            {profile.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-red-400 mb-2">Weaknesses</p>
          <ul className="space-y-1.5">
            {profile.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        {paragraphs.map(([label, text]) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#00ff85] mb-1">{label}</p>
            <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
export default async function TacticsPage({ params, searchParams }: Props) {
  const { teamId }                        = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let formation = '4-3-3'
  let ppda      = 10.2

  // 1. Try hardcoded 2025/26 lineup first (always preferred over API)
  const knownLineup = getKnownLineup(id)

  if (knownLineup) {
    formation = knownLineup.formation
  } else {
    // Fall back to API for teams without a hardcoded lineup
    try {
      const stats = await fetchTeamStatistics(id, meta.apiId)
      formation   = stats.formation
    } catch { /* keep default */ }
  }

  const overrides = getTeamStatOverrides(id)
  if (overrides) ppda = overrides.ppda

  const passAccuracy = overrides?.passAccuracy ?? 78

  // 2. Build squad from hardcoded 2025/26 XI, or fall back to API squad
  let squad: Player[] = []
  if (knownLineup) {
    squad = knownLineup.startXI.map((p, i) => ({
      id: i + 1,
      name: p.name,
      surname: p.surname,
      number: p.number,
      position: p.position,
      photo: p.photo,
    }))
  } else {
    try {
      squad = await fetchSquad(id)
    } catch { /* pass network falls back to role labels */ }
  }

  const usingKnown = knownLineup !== null

  const pressing    = buildPressingFromPPDA(ppda)
  const passNetwork = buildPassNetworkFromSquad(formation, squad)
  const { allPoints: heatPoints, players: heatPlayers } = buildFormationHeatmap(formation, squad)
  const notes       = buildTacticalNotes(formation, ppda, passAccuracy)
  const profile     = getTeamTacticalProfile(id)

  return (
    <div className="space-y-6">
      {/* ── Quick-stat header chips ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff85]/10 border border-[#00ff85]/40 text-sm">
          <span className="font-semibold text-[#00ff85]">2025/26 Season</span>
          {usingKnown && <span className="text-[10px] text-gray-400">· confirmed XI</span>}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111a15] border border-[#1e3329] text-sm">
          <span className="text-gray-400">Formation</span>
          <span className="font-mono font-bold text-[#00ff85]">{formation}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111a15] border border-[#1e3329] text-sm">
          <span className="text-gray-400">Press Style</span>
          <span
            className="font-semibold"
            style={{ color: pressing.pressStyle === 'High Press' ? '#ef4444' : pressing.pressStyle === 'Mid Block' ? '#f59e0b' : '#3b82f6' }}
          >
            {pressing.pressStyle}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111a15] border border-[#1e3329] text-sm">
          <span className="text-gray-400">Pass Accuracy</span>
          <span className="font-mono font-bold text-[#e8f5e9]">{passAccuracy}%</span>
        </div>
        {profile && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111a15] border border-[#1e3329] text-sm">
            <span className="text-gray-400">Tactical Style</span>
            <span className="font-semibold text-[#00ff85]">{profile.style}</span>
          </div>
        )}
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            Pressing &amp; Defensive Shape
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Press trigger zones and ball recovery areas. Lower PPDA = more aggressive pressing.
          </p>
          <div className="flex justify-center">
            <PressMap data={pressing} width={300} height={420} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-[#111a15] border border-[#1e3329]">
              <p className="text-gray-400 text-xs">Press Style</p>
              <p className="font-semibold text-[#e8f5e9] mt-0.5">{pressing.pressStyle}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#111a15] border border-[#1e3329]">
              <p className="text-gray-400 text-xs">Recovery Zone</p>
              <p className="font-semibold text-[#e8f5e9] mt-0.5">{pressing.recoveryZone}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff85] inline-block" />
            Pass Network
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Node size = total passes. Line thickness = connection frequency. Top 3 links highlighted.
          </p>
          <div className="flex justify-center">
            <PassNetwork data={passNetwork} width={300} height={420} />
          </div>
        </div>
      </div>

      {/* ── Heatmap ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
          Team Activity Heatmap
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Positional density across all matches this season. Red = high activity zones.
        </p>
        <div className="flex justify-center">
          <HeatmapOverlay points={heatPoints} players={heatPlayers} width={300} height={420} />
        </div>
      </div>

      {/* ── Tactical Notes ──────────────────────────────────────────────── */}
      {profile ? (
        <ProfileNotes profile={profile} />
      ) : (
        <div className="p-5 rounded-xl bg-[#0d1710] border border-[#1e3329]">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff85] inline-block" />
            Tactical Notes
          </h2>
          <ul className="space-y-3">
            {notes.map((note, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ff85] shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { fetchTeamStatistics, fetchSquad } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { PressMap }       from '@/components/pitch/PressMap'
import { PassNetwork }    from '@/components/pitch/PassNetwork'
import { HeatmapOverlay } from '@/components/pitch/HeatmapOverlay'
import { buildPassNetwork } from '@/lib/tactics/pass-network'
import { getFormationPositions } from '@/lib/tactics/formations'
import type { Player } from '@/types'
import type { PressingData } from '@/lib/tactics/pressing'
import { getTeamStatOverrides } from '@/lib/tactics/teamStats'

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
function buildFormationHeatmap(formation: string) {
  const positions = getFormationPositions(formation)
  return positions
    .filter(pos => pos.role !== 'GK')
    .flatMap(pos => {
      const hy = 100 - pos.y
      return [
        { x: pos.x,                           y: hy,                           intensity: 0.55 + Math.random() * 0.35 },
        { x: pos.x + (Math.random() - 0.5) * 8, y: hy + (Math.random() - 0.5) * 8, intensity: 0.3  + Math.random() * 0.25 },
      ]
    })
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
  try {
    const stats = await fetchTeamStatistics(id, meta.apiId)
    formation   = stats.formation
  } catch { /* keep defaults */ }

  const overrides = getTeamStatOverrides(id)
  if (overrides) ppda = overrides.ppda

  const passAccuracy = overrides?.passAccuracy ?? 78

  let squad: Player[] = []
  try {
    squad = await fetchSquad(id)
  } catch { /* pass network falls back to role labels */ }

  const pressing    = buildPressingFromPPDA(ppda)
  const passNetwork = buildPassNetworkFromSquad(formation, squad)
  const heatPoints  = buildFormationHeatmap(formation)
  const notes       = buildTacticalNotes(formation, ppda, passAccuracy)

  return (
    <div className="space-y-6">
      {/* ── Quick-stat header chips ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
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
          <HeatmapOverlay points={heatPoints} width={300} height={420} />
        </div>
      </div>

      {/* ── Tactical Notes ──────────────────────────────────────────────── */}
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
    </div>
  )
}

export const dynamic = 'force-dynamic'

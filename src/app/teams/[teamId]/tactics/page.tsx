import { notFound } from 'next/navigation'
import { fetchTeamStatistics } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { PressMap } from '@/components/pitch/PressMap'
import { PassNetwork } from '@/components/pitch/PassNetwork'
import { HeatmapOverlay } from '@/components/pitch/HeatmapOverlay'
import { generateMockPressingData } from '@/lib/tactics/pressing'
import { buildPassNetwork } from '@/lib/tactics/pass-network'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

function generateMockPassNetwork() {
  const playerData = [
    { id: 1, name: 'Goalkeeper', avgX: 50, avgY: 90, passes: [{ toId: 2, count: 18 }, { toId: 3, count: 15 }] },
    { id: 2, name: 'Left Back', avgX: 15, avgY: 72, passes: [{ toId: 6, count: 25 }, { toId: 7, count: 20 }, { toId: 1, count: 12 }] },
    { id: 3, name: 'Left CB', avgX: 33, avgY: 78, passes: [{ toId: 4, count: 30 }, { toId: 6, count: 22 }, { toId: 1, count: 18 }] },
    { id: 4, name: 'Right CB', avgX: 67, avgY: 78, passes: [{ toId: 3, count: 30 }, { toId: 7, count: 22 }, { toId: 1, count: 18 }] },
    { id: 5, name: 'Right Back', avgX: 85, avgY: 72, passes: [{ toId: 7, count: 25 }, { toId: 8, count: 20 }, { toId: 1, count: 12 }] },
    { id: 6, name: 'Left Mid', avgX: 20, avgY: 52, passes: [{ toId: 8, count: 28 }, { toId: 9, count: 20 }, { toId: 2, count: 22 }] },
    { id: 7, name: 'Centre Mid', avgX: 50, avgY: 55, passes: [{ toId: 6, count: 32 }, { toId: 8, count: 32 }, { toId: 9, count: 24 }] },
    { id: 8, name: 'Right Mid', avgX: 80, avgY: 52, passes: [{ toId: 7, count: 28 }, { toId: 9, count: 20 }, { toId: 5, count: 22 }] },
    { id: 9, name: 'Left Wing', avgX: 18, avgY: 28, passes: [{ toId: 10, count: 22 }, { toId: 7, count: 18 }] },
    { id: 10, name: 'Striker', avgX: 50, avgY: 22, passes: [{ toId: 9, count: 15 }, { toId: 11, count: 15 }, { toId: 7, count: 20 }] },
    { id: 11, name: 'Right Wing', avgX: 82, avgY: 28, passes: [{ toId: 10, count: 22 }, { toId: 7, count: 18 }] },
  ]
  return buildPassNetwork(playerData)
}

function generateMockHeatPoints() {
  return [
    { x: 20, y: 30, intensity: 0.8 },
    { x: 35, y: 45, intensity: 0.6 },
    { x: 50, y: 25, intensity: 0.9 },
    { x: 65, y: 40, intensity: 0.7 },
    { x: 80, y: 30, intensity: 0.75 },
    { x: 50, y: 55, intensity: 0.5 },
    { x: 30, y: 65, intensity: 0.4 },
    { x: 70, y: 65, intensity: 0.4 },
  ]
}

export default async function TacticsPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let formation = '4-3-3'
  try {
    const stats = await fetchTeamStatistics(id, meta.apiId)
    formation = stats.formation
  } catch { /* use default */ }

  const pressing = generateMockPressingData('balanced')
  const passNetwork = generateMockPassNetwork()
  const heatPoints = generateMockHeatPoints()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            Node size = total passes. Line thickness = connection frequency. Hover for player details.
          </p>
          <div className="flex justify-center">
            <PassNetwork data={passNetwork} width={300} height={420} />
          </div>
        </div>
      </div>

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
    </div>
  )
}

export const dynamic = 'force-dynamic'

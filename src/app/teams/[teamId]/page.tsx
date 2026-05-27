import Image from 'next/image'
import { notFound } from 'next/navigation'
import { fetchTeamStatistics, fetchRecentFixtures, fetchStandings, fetchSquad, fetchFixtureLineup } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { FormationPitch } from '@/components/pitch/FormationPitch'
import { TacticalIdentityCard } from '@/components/ui/TacticalIdentityCard'
import { RecentResultStrip } from '@/components/ui/RecentResultStrip'
import { SquadList } from '@/components/ui/SquadList'
import { generateMockPressingData } from '@/lib/tactics/pressing'
import { TacticalRadar } from '@/components/charts/TacticalRadar'
import { buildRadarData } from '@/lib/tactics/radarData'
import { mapPlayersToFormation } from '@/lib/tactics/playerMapping'
import { mapLineupToFormation } from '@/lib/tactics/lineupMapping'
import { getTeamStatOverrides } from '@/lib/tactics/teamStats'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

export default async function TeamOverviewPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let stats = null
  let fixtures: Awaited<ReturnType<typeof fetchRecentFixtures>> = []
  let teamName = 'Team'
  let crestUrl = ''
  let standing: Awaited<ReturnType<typeof fetchStandings>>[number] | null = null

  // Standings (team name + league position)
  try {
    const standings = await fetchStandings(meta.apiId)
    standing = standings.find(st => st.team.id === id) ?? null
    teamName = standing?.team.name ?? 'Team'
    crestUrl = standing?.team.crestUrl ?? ''
  } catch (e) {
    console.error('[TeamPage] standings error:', e)
  }

  // Stats + fixtures
  try {
    const [s, f] = await Promise.all([
      fetchTeamStatistics(id, meta.apiId),
      fetchRecentFixtures(id, meta.apiId),
    ])
    stats = s
    fixtures = f
  } catch (e) {
    console.error('[TeamPage] stats/fixtures error:', e)
  }

  // Squad — independent, fails gracefully
  let squad: Awaited<ReturnType<typeof fetchSquad>> = []
  try {
    squad = await fetchSquad(id)
  } catch (e) {
    console.error('[TeamPage] squad error:', e)
  }

  // Apply real 2025/26 stat overrides (pass accuracy + PPDA) when available
  const overrides = getTeamStatOverrides(id)
  if (stats && overrides) {
    stats = { ...stats, passAccuracy: overrides.passAccuracy }
  }
  const ppda = overrides?.ppda ?? 10.2
  const pressStyle = ppda < 7 ? 'aggressive' : ppda < 12 ? 'balanced' : 'defensive'
  const pressing = generateMockPressingData(pressStyle)
  // Override the ppda with the real value (generateMockPressingData uses fixed buckets)
  const pressingWithRealPPDA = { ...pressing, ppda }

  const formation = stats?.formation ?? '4-3-3'

  // Attempt to fetch the real starting XI from the most recent completed fixture
  let mappedPlayers: { id: number; name: string; number: number; position: string }[] = []
  const recentFt = fixtures.find(f => f.status === 'FT')
  if (recentFt) {
    try {
      const lineup = await fetchFixtureLineup(recentFt.id, id)
      if (lineup && lineup.startXI.length > 0) {
        mappedPlayers = mapLineupToFormation(lineup.startXI)
      }
    } catch (e) {
      console.error('[TeamPage] lineup error:', e)
    }
  }

  // Fall back to squad-based mapping if no lineup was available
  if (mappedPlayers.length === 0 && squad.length > 0) {
    mappedPlayers = mapPlayersToFormation(formation, squad)
      .map((p, i) =>
        p ? { id: p.id, name: p.name, number: p.number ?? i, position: p.position } : null
      )
      .filter(Boolean) as { id: number; name: string; number: number; position: string }[]
  }

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        {crestUrl && (
          <div className="relative w-16 h-16 shrink-0">
            <Image src={crestUrl} alt={teamName} fill className="object-contain" unoptimized />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-extrabold">{teamName}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{meta.name} · 2025/26 Season</p>
        </div>
      </div>

      {/* ── Formation + Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center gap-4">
          <FormationPitch
            formation={formation}
            players={mappedPlayers}
            width={280}
            height={380}
            showNames={mappedPlayers.length > 0}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {stats ? (
            <>
              <TacticalIdentityCard stats={stats} pressing={pressingWithRealPPDA} standing={standing} />
              <TacticalRadar
                teamName={teamName}
                data={buildRadarData(stats, pressingWithRealPPDA.ppda)}
              />
            </>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-[#1a2e22] bg-[#0d1810] text-gray-400 text-sm">
              <span className="text-xl">⚠️</span>
              <span>Stats unavailable — API plan upgrade required for 2025/26 data</span>
            </div>
          )}
          <RecentResultStrip fixtures={fixtures} teamId={id} />
        </div>
      </div>

      {/* ── Squad ── */}
      {squad.length > 0 && (
        <div className="border-t border-[#1a2e22] pt-8">
          <SquadList players={squad} />
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'

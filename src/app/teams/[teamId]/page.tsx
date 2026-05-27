import Image from 'next/image'
import { notFound } from 'next/navigation'
import { fetchTeamStatistics, fetchRecentFixtures, fetchStandings } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { FormationPitch } from '@/components/pitch/FormationPitch'
import { TacticalIdentityCard } from '@/components/ui/TacticalIdentityCard'
import { RecentResultStrip } from '@/components/ui/RecentResultStrip'
import { generateMockPressingData } from '@/lib/tactics/pressing'
import { TacticalRadar } from '@/components/charts/TacticalRadar'
import { buildRadarData } from '@/lib/tactics/radarData'

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

  // Fetch standings first so team name always shows even if stats fail
  try {
    const standings = await fetchStandings(meta.apiId)
    standing = standings.find(st => st.team.id === id) ?? null
    teamName = standing?.team.name ?? 'Team'
    crestUrl = standing?.team.crestUrl ?? ''
  } catch (e) {
    console.error('[TeamPage] standings error:', e)
  }

  // Fetch stats + fixtures independently
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

  const pressing = generateMockPressingData('balanced')
  const formation = stats?.formation ?? '4-3-3'

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center gap-4">
          <FormationPitch formation={formation} width={280} height={380} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {stats ? (
            <>
              <TacticalIdentityCard stats={stats} pressing={pressing} standing={standing} />
              <TacticalRadar
                teamName={teamName}
                data={buildRadarData(stats, pressing.ppda)}
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
    </div>
  )
}

export const dynamic = 'force-dynamic'

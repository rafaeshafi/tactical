import Image from 'next/image'
import { notFound } from 'next/navigation'
import { fetchTeamStatistics, fetchRecentFixtures, fetchStandings } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { FormationPitch } from '@/components/pitch/FormationPitch'
import { TacticalIdentityCard } from '@/components/ui/TacticalIdentityCard'
import { RecentResultStrip } from '@/components/ui/RecentResultStrip'
import { generateMockPressingData } from '@/lib/tactics/pressing'
import { TacticalRadar, buildRadarData } from '@/components/charts/TacticalRadar'

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

  try {
    const [s, f, standings] = await Promise.all([
      fetchTeamStatistics(id, meta.apiId),
      fetchRecentFixtures(id, meta.apiId),
      fetchStandings(meta.apiId),
    ])
    stats = s
    fixtures = f
    const standing = standings.find(st => st.team.id === id)
    teamName = standing?.team.name ?? 'Team'
    crestUrl = standing?.team.crestUrl ?? ''
  } catch {
    // graceful degradation
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
          <p className="text-gray-400 text-sm mt-0.5">{meta.name} · 2024/25 Season</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center gap-4">
          <FormationPitch formation={formation} width={280} height={380} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {stats ? (
            <>
              <TacticalIdentityCard stats={stats} pressing={pressing} />
              <TacticalRadar
                teamName={teamName}
                data={buildRadarData(stats, pressing.ppda)}
              />
            </>
          ) : (
            <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-400 text-sm">
              Stats unavailable — check your API key in .env.local
            </div>
          )}
          <RecentResultStrip fixtures={fixtures} teamId={id} />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 86400

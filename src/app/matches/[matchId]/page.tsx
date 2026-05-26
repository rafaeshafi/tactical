import { notFound } from 'next/navigation'
import { FormationPitch } from '@/components/pitch/FormationPitch'
import { StatComparison } from '@/components/charts/StatComparison'
import { ShotMap } from '@/components/charts/ShotMap'

interface Props {
  params: Promise<{ matchId: string }>
}

function generateMockShots(isHome: boolean) {
  const rng = (min: number, max: number) => Math.random() * (max - min) + min
  const results = ['goal', 'saved', 'off_target', 'blocked'] as const
  return Array.from({ length: 12 }, (_, i) => ({
    x: rng(isHome ? 20 : 20, isHome ? 80 : 80),
    y: rng(5, 70),
    xG: rng(0.03, 0.7),
    result: i === 0 ? 'goal' : results[Math.floor(Math.random() * results.length)],
    minute: Math.floor(rng(1, 90)),
  }))
}

export default async function MatchPage({ params }: Props) {
  const { matchId } = await params
  const id = parseInt(matchId, 10)
  if (isNaN(id)) notFound()

  let lineups = null
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/fixtures/${id}`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      lineups = data.lineups
    }
  } catch { /* graceful degradation */ }

  const homeFormation = lineups?.[0]?.formation ?? '4-3-3'
  const awayFormation = lineups?.[1]?.formation ?? '4-3-3'
  const homeTeamName = lineups?.[0]?.team?.name ?? 'Home Team'
  const awayTeamName = lineups?.[1]?.team?.name ?? 'Away Team'

  const matchStats = [
    { label: 'Possession', home: 55, away: 45, unit: '%' },
    { label: 'Shots', home: 14, away: 9 },
    { label: 'Shots on Target', home: 6, away: 3 },
    { label: 'Passes', home: 524, away: 388 },
    { label: 'Pass Accuracy', home: 87, away: 79, unit: '%' },
    { label: 'Corners', home: 7, away: 4 },
    { label: 'Fouls', home: 11, away: 14 },
  ]

  const homeShots = generateMockShots(true)
  const awayShots = generateMockShots(false)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">
          {homeTeamName} <span className="text-[#00ff85]">vs</span> {awayTeamName}
        </h1>
        <p className="text-sm text-gray-400 mt-1">Match breakdown · Fixture #{id}</p>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-4">Starting Formations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          <div className="text-center space-y-2">
            <p className="font-medium text-[#00ff85]">{homeTeamName}</p>
            <FormationPitch formation={homeFormation} width={260} height={360} showNames={false} />
          </div>
          <div className="text-center space-y-2">
            <p className="font-medium text-blue-400">{awayTeamName}</p>
            <FormationPitch formation={awayFormation} width={260} height={360} showNames={false} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">Match Statistics</h2>
        <StatComparison homeTeam={homeTeamName} awayTeam={awayTeamName} stats={matchStats} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">Shot Maps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ShotMap shots={homeShots} teamName={homeTeamName} width={300} />
          <ShotMap shots={awayShots} teamName={awayTeamName} width={300} />
        </div>
      </section>
    </div>
  )
}

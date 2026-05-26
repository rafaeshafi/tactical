import { notFound } from 'next/navigation'
import { LEAGUES } from '@/types'
import { fetchTeamStatistics } from '@/lib/api-football/client'
import { FplInsightCard } from '@/components/ui/FplInsightCard'
import type { TeamStatistics } from '@/types'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

interface Insight {
  position: string
  role: string
  recommendation: 'Essential' | 'Good Pick' | 'Differential' | 'Avoid'
  reason: string
  rotationRisk: 'Low' | 'Medium' | 'High'
}

function deriveInsights(stats: TeamStatistics): Insight[] {
  const formation = stats.formation
  const isHighScoring = stats.goalsFor / Math.max(stats.fixturesPlayed, 1) > 1.8
  const isSolidDefence = stats.goalsAgainst / Math.max(stats.fixturesPlayed, 1) < 1.0

  const insights: Insight[] = [
    {
      position: 'Goalkeeper',
      role: 'Sweeper Keeper',
      recommendation: isSolidDefence ? 'Good Pick' : 'Differential',
      reason: isSolidDefence
        ? `This team concedes only ${(stats.goalsAgainst / stats.fixturesPlayed).toFixed(1)} goals per game. Clean sheet potential is high, making the GK a strong captaincy-proof pick.`
        : 'The GK sees regular shot-stopping action but clean sheets are inconsistent. Worth considering for save points.',
      rotationRisk: 'Low',
    },
    {
      position: formation.startsWith('3') ? 'Wing-Back' : 'Full-Back',
      role: formation.startsWith('3') ? 'Attacking Wing-Back' : 'Overlapping Full-Back',
      recommendation: isHighScoring ? 'Essential' : 'Good Pick',
      reason: isHighScoring
        ? 'This team scores prolifically and attacks down the flanks heavily. Full-backs or wing-backs get regular attacking returns through assists and indirect involvement.'
        : 'Full-backs are involved in build-up but less likely to generate attacking returns. Value for defensive points in clean sheet weeks.',
      rotationRisk: 'Low',
    },
    {
      position: 'Central Midfielder',
      role: 'Box-to-Box / Attacking Mid',
      recommendation: stats.passAccuracy > 82 ? 'Essential' : 'Good Pick',
      reason: stats.passAccuracy > 82
        ? `High pass accuracy (${stats.passAccuracy}%) indicates a possession-heavy midfield. Creative midfielders accumulate assists and sit in high-value positions for set pieces.`
        : 'Midfielders see volume but goals and assists from central areas are sporadic. Target the player who takes set pieces.',
      rotationRisk: 'Medium',
    },
    {
      position: formation.endsWith('-1') ? 'Lone Striker' : 'Forward',
      role: formation.endsWith('-1') ? 'Target Man / Pivot' : 'Wide Forward / Second Striker',
      recommendation: isHighScoring ? 'Essential' : 'Good Pick',
      reason: isHighScoring
        ? `Averaging ${(stats.goalsFor / stats.fixturesPlayed).toFixed(1)} goals per game, this attack is highly productive. The main striker is a premium FPL asset — essential for strong fixtures.`
        : 'The attack creates chances but finishing is inconsistent. Watch for streaky form and fixture swings.',
      rotationRisk: isHighScoring ? 'Low' : 'High',
    },
  ]

  return insights
}

export default async function FplPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let stats = null
  try {
    stats = await fetchTeamStatistics(id, meta.apiId)
  } catch { /* graceful degradation */ }

  if (!stats) {
    return (
      <div className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-400">
        <p>FPL insights unavailable — check your API key in .env.local</p>
      </div>
    )
  }

  const insights = deriveInsights(stats)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">FPL Insights</h2>
        <p className="text-sm text-gray-400">
          Which positions are most valuable in this team&apos;s system, and why. Based on season statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <FplInsightCard key={i} {...insight} />
        ))}
      </div>

      {/* Tactical summary for FPL */}
      <div className="p-5 rounded-xl border border-[#0f3d2e] bg-[#0f3d2e]/20 space-y-2">
        <h3 className="font-bold text-[#00ff85] text-sm">Season at a Glance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'Formation', value: stats.formation },
            { label: 'Goals/Game', value: (stats.goalsFor / Math.max(stats.fixturesPlayed, 1)).toFixed(1) },
            { label: 'Conceded/Game', value: (stats.goalsAgainst / Math.max(stats.fixturesPlayed, 1)).toFixed(1) },
            { label: 'Pass Acc', value: `${stats.passAccuracy}%` },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-bold text-[#e8f5e9]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const revalidate = 86400

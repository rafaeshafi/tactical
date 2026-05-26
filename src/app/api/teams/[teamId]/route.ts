import { NextRequest, NextResponse } from 'next/server'
import { fetchTeamStatistics, fetchRecentFixtures } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params
  const { searchParams } = new URL(req.url)
  const leagueSlug = searchParams.get('league') ?? 'premier-league'

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) return NextResponse.json({ error: 'League not found' }, { status: 404 })

  const id = parseInt(teamId, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 })

  try {
    const [statistics, recentFixtures] = await Promise.all([
      fetchTeamStatistics(id, meta.apiId),
      fetchRecentFixtures(id, meta.apiId),
    ])
    return NextResponse.json({ statistics, recentFixtures })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 })
  }
}

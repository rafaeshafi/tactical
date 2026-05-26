import { NextRequest, NextResponse } from 'next/server'
import { getManagerProfile } from '@/lib/ai/manager-profile'
import { fetchStandings } from '@/lib/api-football/client'
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
    const standings = await fetchStandings(meta.apiId)
    const team = standings.find(s => s.team.id === id)
    const teamName = team?.team.name ?? `Team ${id}`

    const profile = await getManagerProfile(id, teamName)
    return NextResponse.json({ profile })
  } catch (err) {
    console.error('Manager analysis error:', err)
    return NextResponse.json({ error: 'Failed to generate manager profile' }, { status: 500 })
  }
}

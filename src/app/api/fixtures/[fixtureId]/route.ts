import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params
  const key = process.env.API_FOOTBALL_KEY
  if (!key) return NextResponse.json({ error: 'API key not set' }, { status: 500 })

  const BASE = 'https://v3.football.api-sports.io'
  const headers = { 'x-rapidapi-key': key, 'x-rapidapi-host': 'v3.football.api-sports.io' }

  try {
    const [lineupRes, playerRes] = await Promise.all([
      fetch(`${BASE}/fixtures/lineups?fixture=${fixtureId}`, { headers }),
      fetch(`${BASE}/fixtures/players?fixture=${fixtureId}`, { headers }),
    ])
    const [lineups, players] = await Promise.all([lineupRes.json(), playerRes.json()])
    return NextResponse.json({ lineups: lineups.response, players: players.response })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch fixture' }, { status: 500 })
  }
}

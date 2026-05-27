import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const key = process.env.API_FOOTBALL_KEY

  if (!key) {
    return NextResponse.json({ error: 'API_FOOTBALL_KEY env var is missing on this server' }, { status: 500 })
  }

  // Show partial key so we can confirm it's correct without exposing it fully
  const maskedKey = key.slice(0, 6) + '…' + key.slice(-4)

  const headers = {
    'x-apisports-key': key,
    'x-rapidapi-key': key,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  }

  async function testEndpoint(url: string) {
    try {
      const res = await fetch(url, { headers, cache: 'no-store' })
      const body = await res.json() as { errors?: unknown; results?: number; response?: unknown[] }
      return {
        httpStatus: res.status,
        apiErrors: body.errors,
        resultCount: body.results,
        responseLength: Array.isArray(body.response) ? body.response.length : 'not an array',
      }
    } catch (err) {
      return { fetchError: String(err) }
    }
  }

  const [standings, teamStats, fixtures] = await Promise.all([
    testEndpoint('https://v3.football.api-sports.io/standings?league=39&season=2025'),
    testEndpoint('https://v3.football.api-sports.io/teams/statistics?team=40&league=39&season=2025'),
    testEndpoint('https://v3.football.api-sports.io/fixtures?team=40&league=39&last=5'),
  ])

  return NextResponse.json({ keyPresent: true, maskedKey, standings, teamStats, fixtures })
}

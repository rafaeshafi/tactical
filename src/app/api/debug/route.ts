import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const key = process.env.API_FOOTBALL_KEY

  if (!key) {
    return NextResponse.json({ error: 'API_FOOTBALL_KEY env var is missing on this server' }, { status: 500 })
  }

  // Show partial key so we can confirm it's correct without exposing it fully
  const maskedKey = key.slice(0, 6) + '…' + key.slice(-4)

  // Raw fetch to API-Sports for PL standings (season 2025)
  let rawStatus: number | null = null
  let rawBody: unknown = null

  try {
    const res = await fetch(
      'https://v3.football.api-sports.io/standings?league=39&season=2025',
      {
        headers: {
          'x-apisports-key': key,
          'x-rapidapi-key': key,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
        cache: 'no-store',
      }
    )
    rawStatus = res.status
    rawBody = await res.json()
  } catch (err) {
    return NextResponse.json({
      keyPresent: true,
      maskedKey,
      fetchError: String(err),
    })
  }

  const body = rawBody as { errors?: unknown; results?: number; response?: unknown[] }

  return NextResponse.json({
    keyPresent: true,
    maskedKey,
    httpStatus: rawStatus,
    apiErrors: body.errors,
    resultCount: body.results,
    responseLength: Array.isArray(body.response) ? body.response.length : 'not an array',
  })
}

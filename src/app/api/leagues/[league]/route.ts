import { NextRequest, NextResponse } from 'next/server'
import { fetchStandings } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ league: string }> }
) {
  const { league } = await params
  const meta = LEAGUES.find(l => l.slug === league)
  if (!meta) return NextResponse.json({ error: 'League not found' }, { status: 404 })

  try {
    const standings = await fetchStandings(meta.apiId)
    return NextResponse.json({ standings }, { headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate' } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 })
  }
}

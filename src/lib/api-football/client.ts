import type { ApiStandingEntry, ApiTeamStatistics, ApiFixture, ApiSquadPlayer, ApiLineupEntry } from './types'
import type { Standing, TeamStatistics, Fixture, Team, LeagueSlug, Player } from '@/types'
import { LEAGUES } from '@/types'

const BASE_URL = 'https://v3.football.api-sports.io'

/** Season 2025 = the 2025/26 campaign. Requires a paid API-Sports plan. */
const CURRENT_SEASON = 2025

function getHeaders() {
  const key = process.env.API_FOOTBALL_KEY
  if (!key) throw new Error('API_FOOTBALL_KEY is not set')
  // api-sports.io direct keys → x-apisports-key
  // RapidAPI keys            → x-rapidapi-key  (kept for compatibility)
  return {
    'x-apisports-key': key,
    'x-rapidapi-key': key,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  }
}

async function apiFetch<T>(path: string, fetchOptions?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, { headers: getHeaders(), cache: 'no-store', ...fetchOptions } as RequestInit)
  if (!res.ok) throw new Error(`API-Football HTTP error: ${res.status}`)
  const data = await res.json()
  // API-Sports returns errors inside the body even on 200 OK
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API-Football response error: ${JSON.stringify(data.errors)}`)
  }
  return data.response as T
}

function leagueSlugFromId(id: number): LeagueSlug {
  const league = LEAGUES.find(l => l.apiId === id)
  if (!league) throw new Error(`Unknown league API ID: ${id}`)
  return league.slug
}

function mapTeam(raw: { id: number; name: string; logo: string }, leagueSlug: LeagueSlug): Team {
  return {
    id: raw.id,
    name: raw.name,
    shortName: raw.name.replace(/^(AFC |FC |AS |CF |RC |RCD |UD |SD |CD |Real |Atletico )/, '').slice(0, 12),
    crestUrl: raw.logo,
    leagueSlug,
  }
}

export async function fetchStandings(leagueId: number, season = CURRENT_SEASON): Promise<Standing[]> {
  const leagueSlug = leagueSlugFromId(leagueId)
  const raw = await apiFetch<{ league: { standings: ApiStandingEntry[][] } }[]>(
    `/standings?league=${leagueId}&season=${season}`
  )
  const entries: ApiStandingEntry[] = raw[0]?.league?.standings[0] ?? []
  return entries.map(e => ({
    rank: e.rank,
    team: mapTeam(e.team, leagueSlug),
    points: e.points,
    played: e.all.played,
    won: e.all.win,
    drawn: e.all.draw,
    lost: e.all.lose,
    goalsFor: e.all.goals?.for ?? 0,
    goalsAgainst: e.all.goals?.against ?? 0,
    goalDifference: e.goalsDiff,
    form: e.form ?? '',
  }))
}

export async function fetchTeamStatistics(teamId: number, leagueId: number, season = CURRENT_SEASON): Promise<TeamStatistics> {
  const leagueSlug = leagueSlugFromId(leagueId)
  const s = await apiFetch<ApiTeamStatistics>(
    `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`
  )
  if (!s || typeof s !== 'object') throw new Error('Empty team statistics response')

  const topFormation = (s.lineups ?? []).sort((a, b) => b.played - a.played)[0]?.formation ?? '4-3-3'
  const totalYellow = Object.values(s.cards?.yellow ?? {}).reduce((sum, v) => sum + ((v as {total?:number}).total ?? 0), 0)
  const totalRed    = Object.values(s.cards?.red   ?? {}).reduce((sum, v) => sum + ((v as {total?:number}).total ?? 0), 0)
  return {
    teamId,
    leagueSlug,
    season,
    formation:     topFormation,
    fixturesPlayed: s.fixtures?.played?.total   ?? 0,
    wins:           s.fixtures?.wins?.total     ?? 0,
    draws:          s.fixtures?.draws?.total    ?? 0,
    losses:         s.fixtures?.loses?.total    ?? 0,
    goalsFor:       s.goals?.for?.total?.total  ?? 0,
    goalsAgainst:   s.goals?.against?.total?.total ?? 0,
    avgPossession:  0,
    totalShots:     0,
    shotsOnTarget:  0,
    totalPasses:    s.passes?.total?.total      ?? 0,
    passAccuracy:   s.passes?.accuracy?.total   ?? 0,
    yellowCards:    totalYellow,
    redCards:       totalRed,
  }
}

export async function fetchSquad(teamId: number): Promise<Player[]> {
  const raw = await apiFetch<{ team: { id: number }; players: ApiSquadPlayer[] }[]>(
    `/players/squads?team=${teamId}`,
    // Squad changes rarely — cache for 1 hour
    { next: { revalidate: 3600 }, cache: undefined } as RequestInit
  )
  const players: ApiSquadPlayer[] = raw[0]?.players ?? []
  return players.map(p => ({
    id: p.id,
    name: p.name,
    surname: p.name.split(' ').pop() ?? p.name,
    number: p.number ?? null,
    position: normalisePosition(p.position),
    photo: p.photo ?? '',
  }))
}

function normalisePosition(raw: string): Player['position'] {
  const s = raw.toLowerCase()
  if (s.includes('goal')) return 'Goalkeeper'
  if (s.includes('defend')) return 'Defender'
  if (s.includes('mid')) return 'Midfielder'
  return 'Attacker'
}

export async function fetchFixtureLineup(
  fixtureId: number,
  teamId: number
): Promise<{
  formation: string
  startXI: { id: number; name: string; surname: string; number: number; pos: string; grid: string; photo: string }[]
  substitutes: { id: number; name: string; surname: string; number: number; pos: string; photo: string }[]
} | null> {
  try {
    const raw = await apiFetch<ApiLineupEntry[]>(
      `/fixtures/lineups?fixture=${fixtureId}`,
      { next: { revalidate: 3600 }, cache: undefined } as RequestInit
    )
    const entry = raw.find(e => e.team.id === teamId)
    if (!entry) return null
    return {
      formation: entry.formation,
      startXI: entry.startXI.map(({ player: p }) => ({
        id: p.id,
        name: p.name,
        surname: p.name.split(' ').pop() ?? p.name,
        number: p.number,
        pos: p.pos,
        grid: p.grid ?? '',
        photo: `https://media.api-sports.io/football/players/${p.id}.png`,
      })),
      substitutes: entry.substitutes.map(({ player: p }) => ({
        id: p.id,
        name: p.name,
        surname: p.name.split(' ').pop() ?? p.name,
        number: p.number,
        pos: p.pos,
        photo: `https://media.api-sports.io/football/players/${p.id}.png`,
      })),
    }
  } catch {
    return null
  }
}

export async function fetchRecentFixtures(teamId: number, leagueId: number, last = 5): Promise<Fixture[]> {
  const leagueSlug = leagueSlugFromId(leagueId)
  const raw = await apiFetch<ApiFixture[]>(
    `/fixtures?team=${teamId}&league=${leagueId}&last=${last}`
  )
  return raw.map(f => ({
    id: f.fixture.id,
    date: f.fixture.date,
    homeTeam: mapTeam(f.teams.home, leagueSlug),
    awayTeam: mapTeam(f.teams.away, leagueSlug),
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    status: f.fixture.status.short as Fixture['status'],
  }))
}

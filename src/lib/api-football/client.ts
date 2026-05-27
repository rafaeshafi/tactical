import type { ApiStandingEntry, ApiTeamStatistics, ApiFixture } from './types'
import type { Standing, TeamStatistics, Fixture, Team, LeagueSlug } from '@/types'
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

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } } as RequestInit)
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
  const topFormation = s.lineups.sort((a, b) => b.played - a.played)[0]?.formation ?? '4-3-3'
  const totalYellow = Object.values(s.cards.yellow).reduce((sum, v) => sum + (v.total ?? 0), 0)
  const totalRed = Object.values(s.cards.red).reduce((sum, v) => sum + (v.total ?? 0), 0)
  return {
    teamId,
    leagueSlug,
    season,
    formation: topFormation,
    fixturesPlayed: s.fixtures.played.total,
    wins: s.fixtures.wins.total,
    draws: s.fixtures.draws.total,
    losses: s.fixtures.loses.total,
    goalsFor: s.goals.for.total.total,
    goalsAgainst: s.goals.against.total.total,
    avgPossession: 0,
    totalShots: 0,
    shotsOnTarget: 0,
    totalPasses: s.passes.total.total ?? 0,
    passAccuracy: s.passes.accuracy.total ?? 0,
    yellowCards: totalYellow,
    redCards: totalRed,
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

export type LeagueSlug = 'premier-league' | 'la-liga' | 'bundesliga' | 'serie-a' | 'ligue-1'

export interface LeagueMeta {
  slug: LeagueSlug
  name: string
  country: string
  apiId: number
  flagEmoji: string
}

export const LEAGUES: LeagueMeta[] = [
  { slug: 'premier-league', name: 'Premier League', country: 'England', apiId: 39, flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { slug: 'la-liga', name: 'La Liga', country: 'Spain', apiId: 140, flagEmoji: '🇪🇸' },
  { slug: 'bundesliga', name: 'Bundesliga', country: 'Germany', apiId: 78, flagEmoji: '🇩🇪' },
  { slug: 'serie-a', name: 'Serie A', country: 'Italy', apiId: 135, flagEmoji: '🇮🇹' },
  { slug: 'ligue-1', name: 'Ligue 1', country: 'France', apiId: 61, flagEmoji: '🇫🇷' },
]

export interface Team {
  id: number
  name: string
  shortName: string
  crestUrl: string
  leagueSlug: LeagueSlug
}

export interface Standing {
  rank: number
  team: Team
  points: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: string
}

export interface TeamStatistics {
  teamId: number
  leagueSlug: LeagueSlug
  season: number
  formation: string
  fixturesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  avgPossession: number
  totalShots: number
  shotsOnTarget: number
  totalPasses: number
  passAccuracy: number
  yellowCards: number
  redCards: number
}

export interface Fixture {
  id: number
  date: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  status: 'NS' | 'FT' | 'HT' | 'LIVE' | '1H' | '2H'
}

export interface Formation {
  name: string
  lines: number[]
}

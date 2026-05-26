export interface ApiStandingEntry {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  all: { played: number; win: number; draw: number; lose: number; goals?: { for: number; against: number } }
  goalsDiff: number
  form: string
}

export interface ApiTeamStatistics {
  team: { id: number; name: string; logo: string }
  league: { id: number; season: number }
  fixtures: {
    played: { total: number }
    wins: { total: number }
    draws: { total: number }
    loses: { total: number }
  }
  goals: {
    for: { total: { total: number }; average: { total: string } }
    against: { total: { total: number } }
  }
  biggest: { streak: { wins: number; draws: number; loses: number } }
  cards: { yellow: Record<string, { total: number | null }>; red: Record<string, { total: number | null }> }
  lineups: { formation: string; played: number }[]
  passes: { total: { total: number | null }; accuracy: { total: number | null } }
}

export interface ApiFixture {
  fixture: { id: number; date: string; status: { short: string } }
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null }
    away: { id: number; name: string; logo: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
  score: { fulltime: { home: number | null; away: number | null } }
}

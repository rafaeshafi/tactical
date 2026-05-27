interface RadarDataPoint {
  metric: string
  team: number
  leagueAvg: number
}

export function buildRadarData(
  stats: { goalsFor: number; goalsAgainst: number; passAccuracy: number; wins: number; fixturesPlayed: number },
  ppda: number
): RadarDataPoint[] {
  const played = Math.max(stats.fixturesPlayed, 1)
  return [
    { metric: 'Pressing', team: Math.round(Math.max(0, 100 - ppda * 4)), leagueAvg: 50 },
    { metric: 'Attack', team: Math.min(100, Math.round((stats.goalsFor / played) * 35)), leagueAvg: 50 },
    { metric: 'Defence', team: Math.min(100, Math.round((1 - stats.goalsAgainst / played / 3) * 100)), leagueAvg: 50 },
    { metric: 'Passing', team: Math.min(100, Math.round(Number(stats.passAccuracy))), leagueAvg: 78 },
    { metric: 'Form', team: Math.round((stats.wins / played) * 100), leagueAvg: 50 },
    { metric: 'Set Pieces', team: 60, leagueAvg: 50 },
  ]
}

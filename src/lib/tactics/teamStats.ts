// Real 2025/26 Premier League stats keyed by API-Sports team ID
export interface TeamStatOverrides {
  passAccuracy: number   // 0-100
  ppda: number           // typical range 8-16
}

const TEAM_STATS: Record<number, TeamStatOverrides> = {
  40:  { passAccuracy: 82, ppda: 9.89  }, // Liverpool
  42:  { passAccuracy: 81, ppda: 10.05 }, // Arsenal
  50:  { passAccuracy: 85, ppda: 12.3  }, // Man City
  33:  { passAccuracy: 79, ppda: 10.8  }, // Man United
  49:  { passAccuracy: 84, ppda: 11.0  }, // Chelsea
  47:  { passAccuracy: 77, ppda: 10.0  }, // Tottenham
  34:  { passAccuracy: 79, ppda: 11.4  }, // Newcastle
  66:  { passAccuracy: 81, ppda: 11.2  }, // Aston Villa
  51:  { passAccuracy: 79, ppda: 9.7   }, // Brighton
  48:  { passAccuracy: 74, ppda: 12.8  }, // West Ham
  39:  { passAccuracy: 75, ppda: 13.2  }, // Wolves
  55:  { passAccuracy: 74, ppda: 11.6  }, // Brentford
  36:  { passAccuracy: 80, ppda: 11.8  }, // Fulham
  52:  { passAccuracy: 74, ppda: 12.1  }, // Crystal Palace
  45:  { passAccuracy: 75, ppda: 13.5  }, // Everton
  65:  { passAccuracy: 77, ppda: 11.5  }, // Forest
  35:  { passAccuracy: 75, ppda: 9.9   }, // Bournemouth
  63:  { passAccuracy: 75, ppda: 12.0  }, // Leeds
  44:  { passAccuracy: 74, ppda: 13.8  }, // Burnley
  387: { passAccuracy: 74, ppda: 12.5  }, // Sunderland
}

export function getTeamStatOverrides(teamId: number): TeamStatOverrides | null {
  return TEAM_STATS[teamId] ?? null
}

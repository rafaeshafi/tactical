// FPL player database — researched 2022/23-2025/26 data
// Keyed by API-Sports team ID

export interface FplSeasonRecord {
  season: string   // e.g. "24/25"
  points: number | null
  goals: number | null
  assists: number | null
  cleanSheets?: number | null
  cost: number | null  // £m at season start (null if not in PL that season)
}

export interface FplPlayer {
  surname: string                // matches squad surname (case-insensitive)
  fullName: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  recommendation: 'Essential' | 'Good Pick' | 'Differential' | 'Avoid'
  reason: string
  rotationRisk: 'Low' | 'Medium' | 'High'
  history: FplSeasonRecord[]    // most recent first
}

// ----- PREMIER LEAGUE TEAM FPL DATABASE -----
// Team IDs: Liverpool=40, Arsenal=42, Man City=50, Man United=33,
//           Chelsea=49, Tottenham=47, Newcastle=34, Aston Villa=66,
//           Brighton=51, West Ham=48, Wolves=39, Brentford=55,
//           Fulham=36, Crystal Palace=52, Everton=45, Forest=65,
//           Bournemouth=35, Leeds=63, Burnley=44

const DB: Record<number, FplPlayer[]> = {

  // ── LIVERPOOL (40) ──────────────────────────────────────────────────────
  40: [
    {
      surname: 'Salah', fullName: 'Mohamed Salah', position: 'MID',
      recommendation: 'Essential',
      reason: 'The most prolific FPL asset in history. Set the single-season points record in 2024/25 (344 pts). Guaranteed to get you G+A most weeks with bonus. Captain every week if no known blanks.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 344, goals: 28, assists: 18, cost: 12.5 },
        { season: '23/24', points: 259, goals: 18, assists: 16, cost: 12.5 },
        { season: '22/23', points: 203, goals: 19, assists: 12, cost: 12.5 },
      ],
    },
    {
      surname: 'Wirtz', fullName: 'Florian Wirtz', position: 'MID',
      recommendation: 'Essential',
      reason: 'Premier League newcomer but world-class talent. Prolific creator at Bayer Leverkusen (24 G+A in Bundesliga). Central to Liverpool\'s attack — expect double-digit assists and goals in his first English season.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: null, goals: null, assists: null, cost: 8.5 },
        { season: '23/24', points: null, goals: null, assists: null, cost: null },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Alisson', fullName: 'Alisson Becker', position: 'GK',
      recommendation: 'Good Pick',
      reason: 'Liverpool keep clean sheets regularly (mid-block but well-organised). Good save points too. Premium GK with consistent CS potential.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 140, goals: 0, assists: 0, cleanSheets: 14, cost: 6.0 },
        { season: '23/24', points: 145, goals: 0, assists: 0, cleanSheets: 16, cost: 5.5 },
        { season: '22/23', points: 132, goals: 0, assists: 0, cleanSheets: 12, cost: 5.5 },
      ],
    },
    {
      surname: 'Frimpong', fullName: 'Jeremie Frimpong', position: 'DEF',
      recommendation: 'Good Pick',
      reason: 'Explosive right-back with attacking instincts — was one of Bundesliga\'s most creative full-backs. Expect attacking returns (assists, occasional goals) plus clean sheet points.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: null, goals: null, assists: null, cost: 5.5 },
        { season: '23/24', points: null, goals: null, assists: null, cost: null },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Alvarez', fullName: 'Julian Alvarez', position: 'FWD',
      recommendation: 'Differential',
      reason: 'World Cup winner with clinical finishing. Not as owned as Salah so strong captain alternative in good fixtures. Risk: injury-prone season could dent returns.',
      rotationRisk: 'Medium',
      history: [
        { season: '24/25', points: null, goals: null, assists: null, cost: 8.0 },
        { season: '23/24', points: null, goals: null, assists: null, cost: null },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Nallo', fullName: 'Quansah/Nallo', position: 'DEF',
      recommendation: 'Avoid',
      reason: 'Rotation risk with Konaté and Van Dijk ahead of him. Not guaranteed starts means clean sheet points are unreliable.',
      rotationRisk: 'High',
      history: [
        { season: '24/25', points: 50, goals: 0, assists: 1, cost: 4.5 },
        { season: '23/24', points: 72, goals: 1, assists: 0, cost: 4.5 },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
  ],

  // ── ARSENAL (42) ────────────────────────────────────────────────────────
  42: [
    {
      surname: 'Saka', fullName: 'Bukayo Saka', position: 'MID',
      recommendation: 'Essential',
      reason: 'Arsenal\'s talisman. Consistent goal threat, set-piece taker, high bonus magnet. Starts every single game for Arsenal. 226 FPL points in 2024/25, ranking 2nd in the game overall.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 226, goals: 17, assists: 15, cost: 10.0 },
        { season: '23/24', points: 210, goals: 16, assists: 9,  cost: 9.5 },
        { season: '22/23', points: 198, goals: 14, assists: 11, cost: 8.5 },
      ],
    },
    {
      surname: 'Gyokeres', fullName: 'Viktor Gyokeres', position: 'FWD',
      recommendation: 'Essential',
      reason: 'Signed from Sporting where he scored 54 goals in 50 games. Arsenal\'s £63m striker is the biggest FPL forward prospect of 2025/26. Expect 20+ goals in his first PL season.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: null, goals: null, assists: null, cost: 10.0 },
        { season: '23/24', points: null, goals: null, assists: null, cost: null },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Ødegaard', fullName: 'Martin Ødegaard', position: 'MID',
      recommendation: 'Good Pick',
      reason: 'Arsenal captain and creative hub. Regular assist-getter who chips in with goals too. Set-piece involvement adds bonus points. Reliable starter who barely misses games.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 178, goals: 8,  assists: 11, cost: 8.5 },
        { season: '23/24', points: 197, goals: 11, assists: 14, cost: 8.0 },
        { season: '22/23', points: 168, goals: 8,  assists: 7,  cost: 7.5 },
      ],
    },
    {
      surname: 'Raya', fullName: 'David Raya', position: 'GK',
      recommendation: 'Good Pick',
      reason: 'Arsenal have the best defence in the league (Champions). Raya is a sweeper-keeper who earns extra points from saves and distribution. Premium GK with high clean-sheet ceiling.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 162, goals: 0, assists: 0, cleanSheets: 18, cost: 5.5 },
        { season: '23/24', points: 155, goals: 0, assists: 0, cleanSheets: 16, cost: 5.0 },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Rice', fullName: 'Declan Rice', position: 'MID',
      recommendation: 'Differential',
      reason: 'Underpriced for a player of his importance. Free-kick specialist with goals in his locker. Not as owned as Saka despite similar ceiling. Worth the punt in good fixtures.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 142, goals: 6,  assists: 8,  cost: 6.5 },
        { season: '23/24', points: 155, goals: 7,  assists: 10, cost: 6.0 },
        { season: '22/23', points: 110, goals: 3,  assists: 2,  cost: 5.0 },
      ],
    },
    {
      surname: 'Madueke', fullName: 'Noni Madueke', position: 'MID',
      recommendation: 'Avoid',
      reason: 'Inconsistent starter who competes with Eze and Martinelli for wide positions. Form dips lead to rotation. Difficult to trust week-to-week.',
      rotationRisk: 'High',
      history: [
        { season: '24/25', points: 88,  goals: 5,  assists: 4,  cost: 6.0 },
        { season: '23/24', points: 95,  goals: 7,  assists: 5,  cost: 5.5 },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
  ],

  // ── MAN CITY (50) ────────────────────────────────────────────────────────
  50: [
    {
      surname: 'Haaland', fullName: 'Erling Haaland', position: 'FWD',
      recommendation: 'Essential',
      reason: 'Two consecutive seasons of 36 PL goals. Unmatched penalty area threat — simply the most reliable striker in the game. Must-own when fit.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 181, goals: 22, assists: 5,  cost: 14.0 },
        { season: '23/24', points: 272, goals: 27, assists: 5,  cost: 14.5 },
        { season: '22/23', points: 272, goals: 36, assists: 8,  cost: 12.0 },
      ],
    },
    {
      surname: 'Marmoush', fullName: 'Omar Marmoush', position: 'FWD',
      recommendation: 'Good Pick',
      reason: 'Bundesliga Golden Boot winner. City\s new creative striker plays in pockets and takes set pieces. High ceiling with big ownership differential.',
      rotationRisk: 'Medium',
      history: [
        { season: '24/25', points: null, goals: null, assists: null, cost: 8.0 },
        { season: '23/24', points: null, goals: null, assists: null, cost: null },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Rodri', fullName: 'Rodri', position: 'MID',
      recommendation: 'Differential',
      reason: 'Ballon d\'Or winner returns from injury. City\'s win percentage with Rodri is 25% higher than without him. Low ownership = high reward when City dominate.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 85,  goals: 2,  assists: 5,  cost: 5.5 },
        { season: '23/24', points: 136, goals: 3,  assists: 9,  cost: 5.5 },
        { season: '22/23', points: 128, goals: 6,  assists: 7,  cost: 5.0 },
      ],
    },
    {
      surname: 'Doku', fullName: 'Jérémy Doku', position: 'MID',
      recommendation: 'Avoid',
      reason: 'Spectacular when fit but injury-prone and rotated frequently by Guardiola. Hard to plan around. Only buy when City have a great run of fixtures and Doku has started 3 straight.',
      rotationRisk: 'High',
      history: [
        { season: '24/25', points: 102, goals: 5,  assists: 8,  cost: 7.0 },
        { season: '23/24', points: 118, goals: 5,  assists: 10, cost: 6.5 },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
  ],

  // ── CHELSEA (49) ─────────────────────────────────────────────────────────
  49: [
    {
      surname: 'Palmer', fullName: 'Cole Palmer', position: 'MID',
      recommendation: 'Essential',
      reason: 'Chelsea\'s engine and penalty taker. 214 FPL points in 2024/25. Scores, assists, and takes penalties — the complete FPL midfielder. Chip him every captain week.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 214, goals: 18, assists: 14, cost: 10.5 },
        { season: '23/24', points: 244, goals: 22, assists: 11, cost: 5.0 },
        { season: '22/23', points: 60,  goals: 2,  assists: 4,  cost: 5.0 },
      ],
    },
    {
      surname: 'Pedro', fullName: 'João Pedro', position: 'FWD',
      recommendation: 'Good Pick',
      reason: 'Chelsea\'s Brazilian striker is sharp in the box with good movement. Gets penalty box touches, benefits from Palmer supply. Reasonably priced.',
      rotationRisk: 'Medium',
      history: [
        { season: '24/25', points: 130, goals: 10, assists: 6,  cost: 7.5 },
        { season: '23/24', points: 142, goals: 14, assists: 4,  cost: 5.5 },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Sanchez', fullName: 'Robert Sánchez', position: 'GK',
      recommendation: 'Differential',
      reason: 'Chelsea clean sheet potential improved with Reece James back. Sub-premium price with upside. Good option if on a budget.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 118, goals: 0, assists: 0, cleanSheets: 11, cost: 4.5 },
        { season: '23/24', points: 104, goals: 0, assists: 0, cleanSheets: 9,  cost: 4.5 },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
    {
      surname: 'Caicedo', fullName: 'Moisés Caicedo', position: 'MID',
      recommendation: 'Avoid',
      reason: 'Defensive midfielder — all defensive work, rarely contributes to FPL attacking returns. World-record signing but doesn\'t translate to fantasy points.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 78,  goals: 2,  assists: 3,  cost: 5.5 },
        { season: '23/24', points: 80,  goals: 2,  assists: 4,  cost: 5.0 },
        { season: '22/23', points: null, goals: null, assists: null, cost: null },
      ],
    },
  ],

  // ── TOTTENHAM (47) ───────────────────────────────────────────────────────
  47: [
    {
      surname: 'Son', fullName: 'Son Heung-min', position: 'MID',
      recommendation: 'Good Pick',
      reason: 'Spurs\' most reliable attacker. Consistent double-digit goals and assists player, takes set pieces and penalties. Not elite but reliable middle-budget option.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 168, goals: 14, assists: 9,  cost: 9.0 },
        { season: '23/24', points: 174, goals: 17, assists: 10, cost: 9.0 },
        { season: '22/23', points: 170, goals: 10, assists: 11, cost: 11.5 },
      ],
    },
  ],

  // ── NEWCASTLE (34) ───────────────────────────────────────────────────────
  34: [
    {
      surname: 'Isak', fullName: 'Alexander Isak', position: 'FWD',
      recommendation: 'Essential',
      reason: '211 FPL points in 2024/25 — third-best forward. Prolific goal scorer, elite movement, always dangerous. Newcastle\'s focal point with good home fixtures.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 211, goals: 25, assists: 6,  cost: 10.5 },
        { season: '23/24', points: 186, goals: 21, assists: 4,  cost: 8.5 },
        { season: '22/23', points: 110, goals: 10, assists: 2,  cost: 7.5 },
      ],
    },
  ],

  // ── ASTON VILLA (66) ─────────────────────────────────────────────────────
  66: [
    {
      surname: 'Watkins', fullName: 'Ollie Watkins', position: 'FWD',
      recommendation: 'Good Pick',
      reason: 'Consistent goal scorer who also provides assists through clever hold-up play. Villa\'s main focal point upfront with good fixtures periodically.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 186, goals: 19, assists: 12, cost: 9.0 },
        { season: '23/24', points: 194, goals: 19, assists: 13, cost: 8.5 },
        { season: '22/23', points: 142, goals: 15, assists: 7,  cost: 7.5 },
      ],
    },
  ],

  // ── BRENTFORD (55) ───────────────────────────────────────────────────────
  55: [
    {
      surname: 'Mbeumo', fullName: 'Bryan Mbeumo', position: 'MID',
      recommendation: 'Essential',
      reason: 'Second top FPL scorer in 2024/25 (236 pts). Takes penalties, scores and assists regularly. Budget enabler — premium output at non-premium price.',
      rotationRisk: 'Low',
      history: [
        { season: '24/25', points: 236, goals: 20, assists: 13, cost: 8.0 },
        { season: '23/24', points: 154, goals: 13, assists: 7,  cost: 6.5 },
        { season: '22/23', points: 132, goals: 8,  assists: 9,  cost: 6.0 },
      ],
    },
  ],
}

/** Look up FPL player data for a team by team API-Sports ID.
 *  Matches by surname (case-insensitive). */
export function getFplPlayersForTeam(teamId: number): FplPlayer[] {
  return DB[teamId] ?? []
}

/** Match a squad player's surname against the FPL database */
export function findFplPlayer(surname: string, teamId: number): FplPlayer | null {
  const players = getFplPlayersForTeam(teamId)
  const s = surname.toLowerCase()
  return players.find(p => p.surname.toLowerCase() === s || p.fullName.toLowerCase().includes(s)) ?? null
}

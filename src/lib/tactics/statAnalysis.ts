/**
 * Football stat analysis helpers.
 * All functions are pure and can run on the server.
 */

export interface StatAnalysis {
  grade: 'elite' | 'strong' | 'average' | 'weak' | 'poor'
  headline: string
  detail: string
  /** Tailwind text colour class */
  colorClass: string
}

// ─── League benchmarks (2024/25 top-5 combined) ──────────────────────────────
const AVG = {
  goalsPerGame: 1.35,
  concededPerGame: 1.35,
  winRate: 0.34,
  ppda: 10.2,
  yellowsPerGame: 1.8,
}

// ─── Record ───────────────────────────────────────────────────────────────────
export function analyzeRecord(
  wins: number,
  draws: number,
  losses: number,
  played: number
): StatAnalysis {
  if (played === 0) return { grade: 'average', headline: 'No data yet', detail: '', colorClass: 'text-gray-400' }
  const rate = wins / played
  const ppg = ((wins * 3 + draws) / played).toFixed(2)

  if (rate >= 0.60) return {
    grade: 'elite',
    headline: `${Math.round(rate * 100)}% win rate — title contender`,
    detail: `${ppg} points per game puts this side among the best in the division.`,
    colorClass: 'text-[#00ff85]',
  }
  if (rate >= 0.50) return {
    grade: 'strong',
    headline: `${Math.round(rate * 100)}% win rate — top-4 quality`,
    detail: `${ppg} PPG reflects consistent winning. European football is a realistic target.`,
    colorClass: 'text-green-400',
  }
  if (rate >= 0.40) return {
    grade: 'average',
    headline: `${Math.round(rate * 100)}% win rate — solid top-half side`,
    detail: `${ppg} PPG is respectable but inconsistency is costing crucial ground on the leaders.`,
    colorClass: 'text-yellow-400',
  }
  if (rate >= 0.28) return {
    grade: 'weak',
    headline: `${Math.round(rate * 100)}% win rate — treading water`,
    detail: `${ppg} PPG. Draws are masking a deeper issue — hard wins are hard to come by.`,
    colorClass: 'text-orange-400',
  }
  return {
    grade: 'poor',
    headline: `${Math.round(rate * 100)}% win rate — relegation form`,
    detail: `${ppg} PPG is insufficient to survive. Urgent improvement needed.`,
    colorClass: 'text-red-400',
  }
}

// ─── Attack ───────────────────────────────────────────────────────────────────
export function analyzeAttack(goalsFor: number, played: number): StatAnalysis {
  if (played === 0) return { grade: 'average', headline: 'No data', detail: '', colorClass: 'text-gray-400' }
  const gpg = goalsFor / played
  const diff = ((gpg / AVG.goalsPerGame - 1) * 100).toFixed(0)
  const gpgStr = gpg.toFixed(2)

  if (gpg >= 2.2) return {
    grade: 'elite',
    headline: `${gpgStr} goals/game — elite attack`,
    detail: `${Math.abs(Number(diff))}% above the league average. One of the most feared offences in the division.`,
    colorClass: 'text-[#00ff85]',
  }
  if (gpg >= 1.7) return {
    grade: 'strong',
    headline: `${gpgStr} goals/game — clinical finishing`,
    detail: `${Math.abs(Number(diff))}% above average. High-scoring affairs are the norm for this team.`,
    colorClass: 'text-green-400',
  }
  if (gpg >= 1.2) return {
    grade: 'average',
    headline: `${gpgStr} goals/game — around the average`,
    detail: `Scoring at roughly the expected rate for this level. A clinical striker could transform output.`,
    colorClass: 'text-yellow-400',
  }
  if (gpg >= 0.8) return {
    grade: 'weak',
    headline: `${gpgStr} goals/game — goal-shy`,
    detail: `${Math.abs(Number(diff))}% below the league average. Creating and converting chances is a clear concern.`,
    colorClass: 'text-orange-400',
  }
  return {
    grade: 'poor',
    headline: `${gpgStr} goals/game — attacking crisis`,
    detail: `Among the worst in the division for scoring. Tactical and personnel changes are urgently needed.`,
    colorClass: 'text-red-400',
  }
}

// ─── Defence ─────────────────────────────────────────────────────────────────
export function analyzeDefence(goalsAgainst: number, played: number): StatAnalysis {
  if (played === 0) return { grade: 'average', headline: 'No data', detail: '', colorClass: 'text-gray-400' }
  const cpg = goalsAgainst / played
  const cpgStr = cpg.toFixed(2)

  if (cpg <= 0.8) return {
    grade: 'elite',
    headline: `${cpgStr} conceded/game — fortress defence`,
    detail: `Conceding less than a goal a game is exceptional. The backline is one of the best in the league.`,
    colorClass: 'text-[#00ff85]',
  }
  if (cpg <= 1.1) return {
    grade: 'strong',
    headline: `${cpgStr} conceded/game — solid at the back`,
    detail: `Well below the league average. Organised, compact, and hard to break down.`,
    colorClass: 'text-green-400',
  }
  if (cpg <= 1.4) return {
    grade: 'average',
    headline: `${cpgStr} conceded/game — leaks the occasional goal`,
    detail: `Around the league average. Concentration lapses allow teams back into games.`,
    colorClass: 'text-yellow-400',
  }
  if (cpg <= 1.8) return {
    grade: 'weak',
    headline: `${cpgStr} conceded/game — defensively vulnerable`,
    detail: `Above the league average. Set-pieces and transitions are areas opponents exploit.`,
    colorClass: 'text-orange-400',
  }
  return {
    grade: 'poor',
    headline: `${cpgStr} conceded/game — defensive crisis`,
    detail: `Among the worst in the division. Structural issues at the back are costing points every week.`,
    colorClass: 'text-red-400',
  }
}

// ─── Pressing (PPDA) ─────────────────────────────────────────────────────────
export function analyzePressing(ppda: number): StatAnalysis {
  if (ppda <= 6.0) return {
    grade: 'elite',
    headline: `PPDA ${ppda} — relentless high press`,
    detail: `In the mould of Klopp's Liverpool or Guardiola's City. Winning the ball back high, creating chances from turnovers.`,
    colorClass: 'text-[#00ff85]',
  }
  if (ppda <= 8.0) return {
    grade: 'strong',
    headline: `PPDA ${ppda} — intense pressing system`,
    detail: `Above-average press intensity. The team hunts in packs in the opponent's half, winning second balls consistently.`,
    colorClass: 'text-green-400',
  }
  if (ppda <= 11.0) return {
    grade: 'average',
    headline: `PPDA ${ppda} — selective mid-block press`,
    detail: `Mid-block approach — sits compact and presses selectively rather than in waves. Effective but not suffocating.`,
    colorClass: 'text-yellow-400',
  }
  if (ppda <= 14.0) return {
    grade: 'weak',
    headline: `PPDA ${ppda} — low-block, absorb and counter`,
    detail: `Deep defensive block. Allows opponents to build up, looking to exploit space on the break.`,
    colorClass: 'text-orange-400',
  }
  return {
    grade: 'poor',
    headline: `PPDA ${ppda} — park the bus`,
    detail: `Extremely passive out of possession. Heavy reliance on set-pieces and individual quality to win games.`,
    colorClass: 'text-red-400',
  }
}

// ─── Formation description ────────────────────────────────────────────────────
export function describeFormation(formation: string): string {
  const descriptions: Record<string, string> = {
    '4-3-3':   'An attacking 4-3-3 — wide forwards hug the touchline, stretching the defensive line and creating 1v1s.',
    '4-2-3-1': 'A balanced 4-2-3-1 — double pivot shields the defence; the AMF is the creative fulcrum behind the striker.',
    '4-4-2':   'A traditional 4-4-2 — two disciplined banks of four, compact and hard to break down in transition.',
    '4-1-4-1': 'An organised 4-1-4-1 — the single pivot anchors midfield, with two wide mids supporting both phases.',
    '3-5-2':   'A dynamic 3-5-2 — wing-backs provide width and attacking threat, freeing the front two to combine.',
    '3-4-3':   'An adventurous 3-4-3 — three attackers press the last line, creating a high-risk, high-reward system.',
    '5-4-1':   'A defensive 5-4-1 — five-man backline absorbs pressure, hitting on the counter through a lone striker.',
    '5-3-2':   'A solid 5-3-2 — three central midfielders offer defensive cover while wing-backs push forward.',
    '4-5-1':   'A cautious 4-5-1 — five midfielders clog the central spaces, with a hard-working lone striker.',
    '4-3-2-1': 'A narrow "Christmas tree" 4-3-2-1 — congested central midfield, built on quick vertical transitions.',
    '4-2-2-2': 'A compact 4-2-2-2 — double pivot with two number 10s feeding a strike partnership.',
  }
  return descriptions[formation] ?? `A ${formation} system — positioning provides cover across the pitch in both phases.`
}

// ─── Discipline ───────────────────────────────────────────────────────────────
export function analyzeDiscipline(yellows: number, reds: number, played: number): StatAnalysis {
  if (played === 0) return { grade: 'average', headline: 'No data', detail: '', colorClass: 'text-gray-400' }
  const ypg = yellows / played

  if (ypg <= 1.2 && reds === 0) return {
    grade: 'elite',
    headline: `${yellows} yellows, ${reds} reds — exceptionally disciplined`,
    detail: `Never in the referee's book. No suspensions disrupting squad selection — a huge competitive advantage.`,
    colorClass: 'text-[#00ff85]',
  }
  if (ypg <= 1.6) return {
    grade: 'strong',
    headline: `${yellows} yellows, ${reds} reds — disciplined side`,
    detail: `Below the league average for bookings. Key players stay on the pitch, giving the manager reliable selection.`,
    colorClass: 'text-green-400',
  }
  if (ypg <= 2.2) return {
    grade: 'average',
    headline: `${yellows} yellows, ${reds} reds — average discipline`,
    detail: `Around the league norm. A few suspension risks across the squad but nothing alarming yet.`,
    colorClass: 'text-yellow-400',
  }
  if (ypg <= 2.8) return {
    grade: 'weak',
    headline: `${yellows} yellows, ${reds} reds — erratic discipline`,
    detail: `Above average for bookings. Suspension absences have likely disrupted the team's rhythm at key moments.`,
    colorClass: 'text-orange-400',
  }
  return {
    grade: 'poor',
    headline: `${yellows} yellows, ${reds} reds — serial offenders`,
    detail: `One of the most ill-disciplined sides in the division. Frequent suspensions are weakening squad depth.`,
    colorClass: 'text-red-400',
  }
}

// ─── Per-game context tag ─────────────────────────────────────────────────────
export interface GameTag {
  label: string
  color: string
}

export function getGameTags(
  goalsFor: number | null,
  goalsAgainst: number | null,
  isHome: boolean,
  result: 'W' | 'D' | 'L' | null
): GameTag[] {
  if (goalsFor === null || goalsAgainst === null || result === null) return []
  const tags: GameTag[] = []
  const margin = Math.abs(goalsFor - goalsAgainst)
  const total = goalsFor + goalsAgainst

  if (goalsAgainst === 0 && result === 'W') tags.push({ label: 'Clean sheet', color: 'text-[#00ff85] bg-[#00ff85]/10 border-[#00ff85]/20' })
  if (goalsFor === 0 && result === 'L') tags.push({ label: 'Blank', color: 'text-red-400 bg-red-500/10 border-red-500/20' })
  if (margin >= 3 && result === 'W') tags.push({ label: 'Dominant win', color: 'text-[#00ff85] bg-[#00ff85]/10 border-[#00ff85]/20' })
  if (margin >= 3 && result === 'L') tags.push({ label: 'Heavy defeat', color: 'text-red-400 bg-red-500/10 border-red-500/20' })
  if (total >= 5) tags.push({ label: 'Goal fest', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' })
  if (!isHome && result === 'W') tags.push({ label: 'Away win', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' })
  if (isHome && result === 'L') tags.push({ label: 'Home defeat', color: 'text-red-400 bg-red-500/10 border-red-500/20' })
  if (goalsFor >= 4) tags.push({ label: `${goalsFor} goals scored`, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' })

  return tags.slice(0, 2) // max 2 tags per game
}

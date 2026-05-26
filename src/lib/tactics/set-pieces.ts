export interface RunRoute {
  playerId: number
  name: string
  startX: number
  startY: number
  path: { x: number; y: number }[]
  role: 'runner' | 'decoy' | 'blocker' | 'taker' | 'keeper'
  color?: string
}

export interface SetPieceRoutine {
  id: string
  name: string
  type: 'corner' | 'freekick' | 'throwin'
  side: 'left' | 'right' | 'centre'
  phase: 'attacking' | 'defending'
  description: string
  routes: RunRoute[]
  ballStartX: number
  ballStartY: number
}

const ROLE_COLORS: Record<RunRoute['role'], string> = {
  taker: '#f59e0b',
  runner: '#00ff85',
  decoy: '#3b82f6',
  blocker: '#8b5cf6',
  keeper: '#f59e0b',
}

export function getRouteColor(role: RunRoute['role']): string {
  return ROLE_COLORS[role]
}

export const CORNER_ROUTINES: SetPieceRoutine[] = [
  {
    id: 'near-post-flick',
    name: 'Near Post Flick-On',
    type: 'corner',
    side: 'right',
    phase: 'attacking',
    description: 'Delivery to near post runner who flicks on for second-post arrival. Blockers clear space at the edge of the six-yard box.',
    ballStartX: 100,
    ballStartY: 4,
    routes: [
      { playerId: 1, name: 'Corner Taker', startX: 100, startY: 4, path: [], role: 'taker' },
      { playerId: 2, name: 'Near Post Runner', startX: 75, startY: 20, path: [{ x: 82, y: 8 }], role: 'runner' },
      { playerId: 3, name: 'Far Post Arrival', startX: 40, startY: 22, path: [{ x: 25, y: 10 }], role: 'runner' },
      { playerId: 4, name: 'Penalty Spot', startX: 50, startY: 18, path: [{ x: 50, y: 12 }], role: 'runner' },
      { playerId: 5, name: 'Blocker 1', startX: 65, startY: 20, path: [{ x: 60, y: 14 }], role: 'blocker' },
      { playerId: 6, name: 'Blocker 2', startX: 55, startY: 22, path: [{ x: 55, y: 16 }], role: 'blocker' },
      { playerId: 7, name: 'Edge of Box', startX: 68, startY: 28, path: [], role: 'decoy' },
    ],
  },
  {
    id: 'back-post-cross',
    name: 'Back Post Cross',
    type: 'corner',
    side: 'left',
    phase: 'attacking',
    description: 'Outswinging delivery to the back post with two runners crossing — primary goes back post, decoy pulls defenders near post.',
    ballStartX: 0,
    ballStartY: 4,
    routes: [
      { playerId: 1, name: 'Corner Taker', startX: 0, startY: 4, path: [], role: 'taker' },
      { playerId: 2, name: 'Back Post Runner', startX: 30, startY: 20, path: [{ x: 15, y: 8 }], role: 'runner' },
      { playerId: 3, name: 'Near Post Decoy', startX: 70, startY: 18, path: [{ x: 80, y: 9 }], role: 'decoy' },
      { playerId: 4, name: 'Penalty Spot', startX: 50, startY: 20, path: [{ x: 50, y: 13 }], role: 'runner' },
      { playerId: 5, name: 'Second Ball', startX: 50, startY: 30, path: [], role: 'blocker' },
    ],
  },
]

export const FREEKICK_ROUTINES: SetPieceRoutine[] = [
  {
    id: 'direct-shot',
    name: 'Direct Shot Over Wall',
    type: 'freekick',
    side: 'centre',
    phase: 'attacking',
    description: 'Direct shot curled over or around the defensive wall. Second player makes a dummy run to split the wall.',
    ballStartX: 60,
    ballStartY: 28,
    routes: [
      { playerId: 1, name: 'Primary Taker', startX: 60, startY: 28, path: [], role: 'taker' },
      { playerId: 2, name: 'Dummy Runner', startX: 62, startY: 28, path: [{ x: 75, y: 22 }], role: 'decoy' },
      { playerId: 3, name: 'Back Post Run', startX: 40, startY: 25, path: [{ x: 25, y: 12 }], role: 'runner' },
      { playerId: 4, name: 'Penalty Spot', startX: 50, startY: 22, path: [{ x: 50, y: 14 }], role: 'runner' },
    ],
  },
]

export function getAllRoutinesForTeam(_teamId: number): SetPieceRoutine[] {
  return [...CORNER_ROUTINES, ...FREEKICK_ROUTINES]
}

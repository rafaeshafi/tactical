import type { Player } from '@/types'
import { getFormationPositions } from './formations'

/** Map a formation role string to one of the four broad API position types */
function roleToPositionType(role: string): Player['position'] {
  if (role === 'GK') return 'Goalkeeper'
  const defRoles = ['LB', 'RB', 'LCB', 'RCB', 'CB', 'LWB', 'RWB']
  if (defRoles.includes(role)) return 'Defender'
  const attRoles = ['LW', 'RW', 'ST', 'LS', 'RS', 'LSS', 'RSS']
  if (attRoles.includes(role)) return 'Attacker'
  return 'Midfielder'
}

/**
 * Assign squad players to formation slots.
 * Returns one Player | null per formation slot, in the same order as
 * getFormationPositions() returns positions.
 */
export function mapPlayersToFormation(
  formation: string,
  squad: Player[]
): (Player | null)[] {
  const positions = getFormationPositions(formation)

  // Group and sort by jersey number (nulls last)
  const byType: Record<Player['position'], Player[]> = {
    Goalkeeper: [],
    Defender:   [],
    Midfielder: [],
    Attacker:   [],
  }

  for (const p of squad) {
    byType[p.position].push(p)
  }

  // Sort each group: numbered players first (ascending), then unnumbered
  for (const key of Object.keys(byType) as Player['position'][]) {
    byType[key].sort((a, b) => {
      if (a.number !== null && b.number !== null) return a.number - b.number
      if (a.number !== null) return -1
      if (b.number !== null) return 1
      return a.name.localeCompare(b.name)
    })
  }

  const usedIdx: Record<Player['position'], number> = {
    Goalkeeper: 0, Defender: 0, Midfielder: 0, Attacker: 0,
  }

  return positions.map(pos => {
    const type = roleToPositionType(pos.role)
    const pool = byType[type]
    const idx = usedIdx[type]
    if (idx >= pool.length) return null
    usedIdx[type]++
    return pool[idx]
  })
}

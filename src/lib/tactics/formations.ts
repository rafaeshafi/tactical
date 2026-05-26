export interface PlayerPosition {
  x: number
  y: number
  role: string
  index: number
}

export function parseFormation(formation: string): number[] {
  return formation.split('-').map(Number)
}

function getLineRoles(count: number, lineIndex: number, totalLines: number): string[] {
  const isForwardLine = lineIndex === totalLines - 1
  const isMidLine = lineIndex > 0 && !isForwardLine

  if (count === 1) return ['CAM']
  if (count === 2) return isForwardLine ? ['LS', 'RS'] : ['DCM', 'DCM']
  if (count === 3) {
    if (isForwardLine) return ['LW', 'ST', 'RW']
    if (isMidLine) return ['LCM', 'CM', 'RCM']
    return ['LCB', 'CB', 'RCB']
  }
  if (count === 4) {
    if (isForwardLine) return ['LW', 'LSS', 'RSS', 'RW']
    if (isMidLine) return ['LCM', 'LCM', 'RCM', 'RCM']
    return ['LB', 'LCB', 'RCB', 'RB']
  }
  if (count === 5) {
    if (isMidLine) return ['LWB', 'LCM', 'CM', 'RCM', 'RWB']
    return ['LB', 'LCB', 'CB', 'RCB', 'RB']
  }
  return Array(count).fill('MF')
}

export function getFormationPositions(formation: string): PlayerPosition[] {
  const lines = parseFormation(formation)
  const positions: PlayerPosition[] = []
  let index = 0

  // Goalkeeper at y=92, x=50
  positions.push({ x: 50, y: 92, role: 'GK', index: index++ })

  const totalLines = lines.length

  lines.forEach((count, lineIdx) => {
    const roles = getLineRoles(count, lineIdx, totalLines)
    // Y position: distribute lines from y=75 (defense) to y=20 (attack)
    const yBase = 75 - (lineIdx / (totalLines - 1 || 1)) * 55
    const y = Math.round(yBase)

    for (let i = 0; i < count; i++) {
      const x = count === 1 ? 50 : Math.round(10 + (i / (count - 1)) * 80)
      positions.push({ x, y, role: roles[i] ?? 'MF', index: index++ })
    }
  })

  return positions
}

export const COMMON_FORMATIONS = [
  '4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3',
  '5-3-2', '4-1-4-1', '4-5-1', '3-4-2-1', '4-3-2-1',
]

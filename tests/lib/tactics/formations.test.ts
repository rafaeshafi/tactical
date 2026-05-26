import { describe, it, expect } from 'vitest'
import { getFormationPositions, parseFormation } from '@/lib/tactics/formations'

describe('formations', () => {
  it('parseFormation splits formation string into line counts', () => {
    expect(parseFormation('4-3-3')).toEqual([4, 3, 3])
    expect(parseFormation('3-5-2')).toEqual([3, 5, 2])
    expect(parseFormation('4-2-3-1')).toEqual([4, 2, 3, 1])
  })

  it('getFormationPositions returns 11 positions for 4-3-3', () => {
    const positions = getFormationPositions('4-3-3')
    expect(positions).toHaveLength(11)
    positions.forEach(p => {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(100)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(100)
    })
  })

  it('getFormationPositions goalkeeper is always at bottom', () => {
    const positions = getFormationPositions('4-3-3')
    expect(positions[0].y).toBeGreaterThan(85)
    expect(positions[0].role).toBe('GK')
  })

  it('getFormationPositions returns 11 positions for 3-5-2', () => {
    expect(getFormationPositions('3-5-2')).toHaveLength(11)
  })
})

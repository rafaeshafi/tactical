import type { LineupPlayer } from '@/types'

/**
 * Map fixture lineup startXI to the slot-ordered array expected by FormationPitch.
 *
 * FormationPitch renders players[i] at positions[i] — the slot order from
 * getFormationPositions(). We therefore sort startXI by grid (row asc, col asc)
 * so index 0 = GK, index 1..n = defensive row left-to-right, etc.
 *
 * The returned `name` field is the surname (FormationPitch does .split(' ').pop()
 * but since we pre-compute surname we pass it directly so it displays correctly
 * even for single-name players).
 */
export function mapLineupToFormation(
  startXI: LineupPlayer[],
): { id: number; name: string; number: number; position: string }[] {
  // Players without a grid (shouldn't happen in startXI but guard defensively)
  const withGrid = startXI.filter(p => p.grid && p.grid.includes(':'))

  // Sort: row asc, col asc — this matches formation slot order (GK first, then
  // defensive line left→right, then mid lines, then attackers)
  const sorted = [...withGrid].sort((a, b) => {
    const [ar, ac] = a.grid.split(':').map(Number)
    const [br, bc] = b.grid.split(':').map(Number)
    if (ar !== br) return ar - br
    return ac - bc
  })

  return sorted.map(p => ({
    id: p.id,
    // Pass the full name — FormationPitch does name.split(' ').pop() for the label,
    // so a full name works correctly (e.g. "David Raya" → "Raya")
    name: p.name,
    number: p.number,
    position: p.pos,
  }))
}

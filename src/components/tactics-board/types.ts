export interface BoardPlayer {
  id: number
  x: number
  y: number
  role: string
  name: string
  surname: string
  number: number | null
  photo: string
  /** true when this player was added by the user as a custom/hypothetical signing */
  isCustom?: boolean
}

export interface Arrow {
  id: string
  fromX: number
  fromY: number
  toX: number
  toY: number
}

export type PositionType = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Attacker'

export const POSITION_BADGE: Record<PositionType, string> = {
  Goalkeeper: 'GK',
  Defender:   'DEF',
  Midfielder: 'MID',
  Attacker:   'ATT',
}

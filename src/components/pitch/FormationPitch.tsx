'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PitchCanvas } from './PitchCanvas'
import { getFormationPositions } from '@/lib/tactics/formations'

interface Player {
  id: number
  name: string
  number: number
  position: string
}

interface Props {
  formation: string
  players?: Player[]
  width?: number
  height?: number
  showNames?: boolean
  highlightPlayerId?: number
  onPlayerClick?: (player: Player) => void
}

const POSITION_COLORS: Record<string, string> = {
  GK: '#f59e0b',
  LB: '#3b82f6', RB: '#3b82f6', LCB: '#3b82f6', RCB: '#3b82f6', CB: '#3b82f6',
  LWB: '#6366f1', RWB: '#6366f1',
  DCM: '#22c55e', CM: '#22c55e', LCM: '#22c55e', RCM: '#22c55e', CAM: '#22c55e',
  LW: '#00ff85', RW: '#00ff85', ST: '#00ff85', LS: '#00ff85', RS: '#00ff85',
  LSS: '#00ff85', RSS: '#00ff85',
}

export function FormationPitch({ formation, players = [], width = 320, height = 440, showNames = true, highlightPlayerId, onPlayerClick }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const positions = getFormationPositions(formation)

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height}>
        <g opacity={0.3}>
          {positions.slice(1).map((pos, i) => {
            const next = positions[i + 2]
            if (!next) return null
            const sameY = Math.abs(pos.y - next.y) < 5
            if (!sameY) return null
            return (
              <line
                key={i}
                x1={(pos.x / 100) * width}
                y1={(pos.y / 100) * height}
                x2={(next.x / 100) * width}
                y2={(next.y / 100) * height}
                stroke="#00ff85"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            )
          })}
        </g>
        {positions.map((pos, i) => {
          const player = players[i]
          const px = (pos.x / 100) * width
          const py = (pos.y / 100) * height
          const color = POSITION_COLORS[pos.role] ?? '#00ff85'
          const isHighlighted = !!(player && highlightPlayerId === player.id)
          const isHovered = hoveredIndex === i

          return (
            <g
              key={i}
              transform={`translate(${px},${py})`}
              style={{ cursor: onPlayerClick ? 'pointer' : 'default' }}
              onClick={() => player && onPlayerClick?.(player)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.circle
                r={isHighlighted || isHovered ? 14 : 12}
                fill={color}
                stroke={isHighlighted ? '#ffffff' : 'rgba(0,0,0,0.4)'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={player ? 9 : 7}
                fontWeight="bold"
                fill="rgba(0,0,0,0.8)"
                style={{ pointerEvents: 'none' }}
              >
                {player ? player.number : pos.role.slice(0, 2)}
              </text>
              {showNames && player && (
                <text
                  y={17}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#e8f5e9"
                  fontWeight="500"
                  style={{ pointerEvents: 'none' }}
                >
                  {player.name.split(' ').pop()?.slice(0, 8)}
                </text>
              )}
              {(isHovered || isHighlighted) && player && (
                <g transform="translate(14, -20)">
                  <rect x={0} y={-10} width={Math.max(player.name.length * 5, 50)} height={14} fill="rgba(0,0,0,0.85)" rx={2} />
                  <text x={4} y={0} fontSize={8} fill="#e8f5e9">
                    {player.name}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </PitchCanvas>
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-mono text-[#00ff85] font-bold">
        {formation}
      </div>
    </div>
  )
}

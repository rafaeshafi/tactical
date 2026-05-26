'use client'
import { useState } from 'react'
import { PitchCanvas } from './PitchCanvas'
import type { PassNetworkData } from '@/lib/tactics/pass-network'

interface Props {
  data: PassNetworkData
  width?: number
  height?: number
}

export function PassNetwork({ data, width = 320, height = 440 }: Props) {
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null)
  const nodeMap = new Map(data.nodes.map(n => [n.playerId, n]))
  const minR = 8
  const maxR = 20
  const maxPasses = Math.max(...data.nodes.map(n => n.totalPasses), 1)

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height}>
        {data.edges.map((edge, i) => {
          const from = nodeMap.get(edge.from)
          const to = nodeMap.get(edge.to)
          if (!from || !to) return null
          const isHighlighted = hoveredNodeId === edge.from || hoveredNodeId === edge.to
          const opacity = hoveredNodeId ? (isHighlighted ? 0.9 : 0.1) : 0.4 + edge.weight * 0.5
          return (
            <line
              key={i}
              x1={(from.x / 100) * width}
              y1={(from.y / 100) * height}
              x2={(to.x / 100) * width}
              y2={(to.y / 100) * height}
              stroke={isHighlighted ? '#00ff85' : '#ffffff'}
              strokeWidth={1 + edge.weight * 5}
              strokeOpacity={opacity}
            />
          )
        })}
        {data.nodes.map(node => {
          const px = (node.x / 100) * width
          const py = (node.y / 100) * height
          const r = minR + ((node.totalPasses / maxPasses) * (maxR - minR))
          const isHovered = hoveredNodeId === node.playerId
          return (
            <g
              key={node.playerId}
              transform={`translate(${px},${py})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNodeId(node.playerId)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <circle r={r} fill="#00ff85" fillOpacity={0.85} stroke="#fff" strokeWidth={isHovered ? 2 : 1} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={7}
                fontWeight="bold"
                fill="rgba(0,0,0,0.8)"
                style={{ pointerEvents: 'none' }}
              >
                {node.name.split(' ').pop()?.slice(0, 4)}
              </text>
              {isHovered && (
                <g transform="translate(12, -18)">
                  <rect x={0} y={-10} width={node.name.length * 5 + 8} height={14} fill="rgba(0,0,0,0.9)" rx={2} />
                  <text x={4} y={0} fontSize={8} fill="#e8f5e9" style={{ pointerEvents: 'none' }}>
                    {node.name} — {node.totalPasses}p
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </PitchCanvas>
    </div>
  )
}

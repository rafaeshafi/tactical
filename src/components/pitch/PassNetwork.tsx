'use client'
import { useState } from 'react'
import { PitchCanvas } from './PitchCanvas'
import type { PassNetworkData } from '@/lib/tactics/pass-network'

interface Props {
  data: PassNetworkData
  width?: number
  height?: number
}

function getNodeRole(y: number): 'GK' | 'DEF' | 'MID' | 'FWD' {
  if (y > 70) return 'GK'
  if (y > 55) return 'DEF'
  if (y > 35) return 'MID'
  return 'FWD'
}

function getNodeColor(y: number): string {
  const role = getNodeRole(y)
  if (role === 'GK')  return '#f59e0b'
  if (role === 'DEF') return '#3b82f6'
  if (role === 'MID') return '#22c55e'
  return '#00ff85'
}

function getRoleLabel(y: number): string {
  const role = getNodeRole(y)
  if (role === 'GK')  return 'Goalkeeper'
  if (role === 'DEF') return 'Defender'
  if (role === 'MID') return 'Midfielder'
  return 'Forward'
}

export function PassNetwork({ data, width = 320, height = 440 }: Props) {
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null)
  const nodeMap = new Map(data.nodes.map(n => [n.playerId, n]))
  const minR = 8
  const maxR = 20
  const maxPasses = Math.max(...data.nodes.map(n => n.totalPasses), 1)

  // Identify top 3 edges by weight
  const sortedEdgeWeights = [...data.edges]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(e => `${e.from}-${e.to}`)
  const topEdgeSet = new Set(sortedEdgeWeights)

  const flowAnimId = (i: number) => `flow-${i}`
  const pulseAnimId = (id: number) => `pulse-${id}`

  return (
    <div className="relative select-none">
      <style>{`
        @keyframes flowDash {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes nodeBreath {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.15); }
        }
      `}</style>
      <PitchCanvas width={width} height={height}>
        {/* Edges — flowing "marching ants" */}
        {data.edges.map((edge, i) => {
          const from = nodeMap.get(edge.from)
          const to   = nodeMap.get(edge.to)
          if (!from || !to) return null

          const edgeKey  = `${edge.from}-${edge.to}`
          const isTop    = topEdgeSet.has(edgeKey)
          const isHighlighted = hoveredNodeId === edge.from || hoveredNodeId === edge.to
          const opacity  = hoveredNodeId ? (isHighlighted ? 0.9 : 0.1) : 0.4 + edge.weight * 0.5
          const duration = 1.5 + i * 0.15

          return (
            <line
              key={i}
              id={flowAnimId(i)}
              x1={(from.x / 100) * width}
              y1={(from.y / 100) * height}
              x2={(to.x / 100) * width}
              y2={(to.y / 100) * height}
              stroke={isTop || isHighlighted ? '#00ff85' : '#ffffff'}
              strokeWidth={isTop ? 3 : 1.5}
              strokeOpacity={opacity}
              strokeDasharray="8 4"
              style={{
                animation: `flowDash ${duration}s linear infinite`,
              }}
            />
          )
        })}

        {/* Nodes — pulsing with stagger */}
        {data.nodes.map((node, idx) => {
          const px = (node.x / 100) * width
          const py = (node.y / 100) * height
          const r  = minR + ((node.totalPasses / maxPasses) * (maxR - minR))
          const isHovered = hoveredNodeId === node.playerId
          const color  = getNodeColor(node.y)
          const role   = getRoleLabel(node.y)
          const delay  = idx * 0.18

          // Tooltip positioning — keep it inside SVG bounds
          const tipWidth  = Math.max(node.name.length * 5.5 + 8, 80)
          const tipX = px + r + 4 + tipWidth > width ? -(r + 4 + tipWidth) : r + 4
          const tipY = py - 20 < 0 ? 0 : -20

          return (
            <g
              key={node.playerId}
              id={pulseAnimId(node.playerId)}
              transform={`translate(${px},${py})`}
              style={{
                cursor: 'pointer',
                transformOrigin: `${px}px ${py}px`,
                animation: `nodeBreath ${2 + delay * 0.3}s ease-in-out ${delay}s infinite`,
              }}
              onMouseEnter={() => setHoveredNodeId(node.playerId)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <circle
                r={r}
                fill={color}
                fillOpacity={0.88}
                stroke="#fff"
                strokeWidth={isHovered ? 2.5 : 1}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={7}
                fontWeight="bold"
                fill="rgba(0,0,0,0.85)"
                style={{ pointerEvents: 'none' }}
              >
                {node.name.split(' ').pop()?.slice(0, 4)}
              </text>

              {/* Hover tooltip */}
              {isHovered && (
                <g transform={`translate(${tipX},${tipY})`}>
                  <rect
                    x={0} y={-12}
                    width={tipWidth} height={36}
                    fill="rgba(0,0,0,0.92)"
                    stroke={color}
                    strokeWidth={0.8}
                    rx={3}
                  />
                  <text x={5} y={0} fontSize={8} fontWeight="bold" fill={color} style={{ pointerEvents: 'none' }}>
                    {node.name}
                  </text>
                  <text x={5} y={11} fontSize={7} fill="#e8f5e9" style={{ pointerEvents: 'none' }}>
                    {role} · {node.totalPasses} passes
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </PitchCanvas>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3 justify-center text-xs text-gray-400">
        {[['#f59e0b','GK'],['#3b82f6','DEF'],['#22c55e','MID'],['#00ff85','FWD']] .map(([c, label]) => (
          <span key={label} className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: c }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

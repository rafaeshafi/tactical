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
  if (y > 75) return 'GK'
  if (y > 55) return 'DEF'
  if (y > 35) return 'MID'
  return 'FWD'
}

function getNodeColor(y: number): string {
  switch (getNodeRole(y)) {
    case 'GK':  return '#f59e0b'
    case 'DEF': return '#60a5fa'
    case 'MID': return '#4ade80'
    default:    return '#00ff85'
  }
}

function getRoleLabel(y: number): string {
  switch (getNodeRole(y)) {
    case 'GK':  return 'Goalkeeper'
    case 'DEF': return 'Defender'
    case 'MID': return 'Midfielder'
    default:    return 'Forward'
  }
}

export function PassNetwork({ data, width = 320, height = 440 }: Props) {
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null)
  const nodeMap  = new Map(data.nodes.map(n => [n.playerId, n]))
  const minR     = 10
  const maxR     = 22
  const maxPass  = Math.max(...data.nodes.map(n => n.totalPasses), 1)

  // Pre-sort edges by weight to draw weak ones first (behind strong)
  const sortedEdges = [...data.edges].sort((a, b) => a.weight - b.weight)
  const topEdgeKeys = new Set(
    [...data.edges].sort((a, b) => b.weight - a.weight).slice(0, 3)
      .map(e => `${e.from}-${e.to}`)
  )

  return (
    <div className="relative select-none">
      <style>{`
        @keyframes nodePulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.8; transform: scale(1.12); }
        }
        .node-inner { transform-origin: 0px 0px; transform-box: fill-box; }
      `}</style>

      <PitchCanvas width={width} height={height}>
        <defs>
          {/* Glow filter for top connections */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Edges ─────────────────────────────────────────────────────────── */}
        {sortedEdges.map((edge, i) => {
          const from = nodeMap.get(edge.from)
          const to   = nodeMap.get(edge.to)
          if (!from || !to) return null

          const key        = `${edge.from}-${edge.to}`
          const isTop      = topEdgeKeys.has(key)
          const isActive   = hoveredNodeId === edge.from || hoveredNodeId === edge.to
          const dimmed     = hoveredNodeId !== null && !isActive

          // Solid line — width and opacity driven by connection weight
          const strokeW    = isTop ? 4 : 1 + edge.weight * 2.5
          const opacity    = dimmed ? 0.05 : isTop ? 0.85 : 0.25 + edge.weight * 0.55
          const color      = isTop || isActive ? '#00ff85' : '#94a3b8'

          return (
            <line
              key={i}
              x1={(from.x / 100) * width}  y1={(from.y / 100) * height}
              x2={(to.x / 100) * width}    y2={(to.y / 100) * height}
              stroke={color}
              strokeWidth={strokeW}
              strokeOpacity={opacity}
              strokeLinecap="round"
              filter={isTop ? 'url(#glow)' : undefined}
            />
          )
        })}

        {/* ── Nodes ─────────────────────────────────────────────────────────── */}
        {data.nodes.map((node, idx) => {
          const px    = (node.x / 100) * width
          const py    = (node.y / 100) * height
          const r     = minR + (node.totalPasses / maxPass) * (maxR - minR)
          const color = getNodeColor(node.y)
          const role  = getRoleLabel(node.y)
          const delay = (idx * 0.2).toFixed(2)
          const dur   = (2.4 + idx * 0.08).toFixed(2)
          const isHov = hoveredNodeId === node.playerId

          // Keep tooltip inside SVG
          const tipW  = Math.max(node.name.length * 5.8 + 14, 88)
          const tipX  = px + r + 8 + tipW > width  ? -(r + 8 + tipW) : r + 8
          const tipY  = py - 20 < 0 ? -(py) + 4 : -20

          return (
            <g key={node.playerId} transform={`translate(${px},${py})`}>
              {/* Outer ring — always visible, no animation */}
              <circle
                r={r + 3}
                fill="none"
                stroke={color}
                strokeWidth={isHov ? 2 : 1}
                strokeOpacity={isHov ? 0.7 : 0.25}
              />

              {/* Inner node with pulse animation on nested element */}
              <g
                className="node-inner"
                style={{
                  animation: `nodePulse ${dur}s ease-in-out ${delay}s infinite`,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredNodeId(node.playerId)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Drop shadow */}
                <circle r={r} fill="rgba(0,0,0,0.35)" transform="translate(1,2)" />
                {/* Main circle */}
                <circle
                  r={r}
                  fill={color}
                  fillOpacity={0.92}
                  stroke="#000"
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                />
                {/* Name label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={r > 14 ? 8 : 7}
                  fontWeight="700"
                  fill="rgba(0,0,0,0.9)"
                  letterSpacing="-0.3"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.name.split(' ').pop()?.slice(0, 6)}
                </text>
              </g>

              {/* Tooltip — outside animation group so it doesn't scale */}
              {isHov && (
                <g transform={`translate(${tipX},${tipY})`}>
                  <rect
                    x={0} y={0} width={tipW} height={36}
                    fill="rgba(10,20,15,0.96)"
                    stroke={color} strokeWidth={1}
                    rx={5}
                  />
                  <text x={8} y={14} fontSize={9} fontWeight="bold" fill={color}
                    style={{ pointerEvents: 'none' }}>
                    {node.name}
                  </text>
                  <text x={8} y={27} fontSize={7.5} fill="#9ca3af"
                    style={{ pointerEvents: 'none' }}>
                    {role} · {node.totalPasses} passes
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </PitchCanvas>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-4 justify-center text-xs text-gray-400">
        {([['#f59e0b','GK'],['#60a5fa','DEF'],['#4ade80','MID'],['#00ff85','FWD']] as const).map(([c, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c }} />
            {label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded inline-block bg-[#00ff85]" />
          Top 3 links
        </span>
      </div>
    </div>
  )
}

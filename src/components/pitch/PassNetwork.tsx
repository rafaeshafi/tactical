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

  // Top 3 edges by weight
  const topEdgeKeys = new Set(
    [...data.edges]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(e => `${e.from}-${e.to}`)
  )

  return (
    <div className="relative select-none">
      {/* Animation keyframes — defined here, NOT on the SVG element that also has a transform */}
      <style>{`
        @keyframes passFlow {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes nodePulse {
          0%, 100% { transform: scale(1);    opacity: 1;   }
          50%       { transform: scale(1.18); opacity: 0.72; }
        }
        .pass-edge {
          stroke-dasharray: 8 4;
        }
        /* Inner animation group — origin is already at circle centre because outer g translated there */
        .node-anim-group {
          transform-origin: 0px 0px;
          transform-box: fill-box;
        }
      `}</style>
      <PitchCanvas width={width} height={height}>
        {/* ── Edges ─────────────────────────────────────────────────────────── */}
        {data.edges.map((edge, i) => {
          const from = nodeMap.get(edge.from)
          const to   = nodeMap.get(edge.to)
          if (!from || !to) return null

          const isTop = topEdgeKeys.has(`${edge.from}-${edge.to}`)
          const isHighlighted = hoveredNodeId === edge.from || hoveredNodeId === edge.to
          const opacity = hoveredNodeId
            ? (isHighlighted ? 0.9 : 0.08)
            : 0.35 + edge.weight * 0.55
          const duration = (1.5 + i * 0.13).toFixed(2)

          return (
            <line
              key={i}
              className="pass-edge"
              x1={(from.x / 100) * width}
              y1={(from.y / 100) * height}
              x2={(to.x / 100) * width}
              y2={(to.y / 100) * height}
              stroke={isTop || isHighlighted ? '#00ff85' : '#ffffff'}
              strokeWidth={isTop ? 3 : 1.5}
              strokeOpacity={opacity}
              style={{ animation: `passFlow ${duration}s linear infinite` }}
            />
          )
        })}

        {/* ── Nodes ─────────────────────────────────────────────────────────── */}
        {data.nodes.map((node, idx) => {
          const px     = (node.x / 100) * width
          const py     = (node.y / 100) * height
          const r      = minR + ((node.totalPasses / maxPasses) * (maxR - minR))
          const color  = getNodeColor(node.y)
          const role   = getRoleLabel(node.y)
          const delay  = (idx * 0.18).toFixed(2)
          const dur    = (2 + idx * 0.09).toFixed(2)
          const isHov  = hoveredNodeId === node.playerId

          // Keep tooltip inside SVG
          const tipW   = Math.max(node.name.length * 5.5 + 12, 80)
          const tipX   = px + r + 6 + tipW > width  ? -(r + 6 + tipW) : r + 6
          const tipY   = py - 24 < 0 ? 0 : -24

          return (
            /*
             * KEY FIX: positioning and animation are on SEPARATE nested elements.
             * The outer <g> carries the SVG translate — no CSS on this element.
             * The inner <g class="node-anim-group"> carries the CSS animation — no SVG transform.
             * This prevents the CSS animation from overriding/resetting the SVG translate.
             */
            <g
              key={node.playerId}
              transform={`translate(${px},${py})`}
            >
              {/* Inner animated group — scale from circle centre (0,0) */}
              <g
                className="node-anim-group"
                style={{
                  animation: `nodePulse ${dur}s ease-in-out ${delay}s infinite`,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredNodeId(node.playerId)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <circle
                  r={r}
                  fill={color}
                  fillOpacity={0.88}
                  stroke={isHov ? '#fff' : `${color}88`}
                  strokeWidth={isHov ? 2.5 : 1.5}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={r > 12 ? 7.5 : 6.5}
                  fontWeight="bold"
                  fill="rgba(0,0,0,0.85)"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.name.split(' ').pop()?.slice(0, 5)}
                </text>
              </g>

              {/* Tooltip — outside animation group so it doesn't scale */}
              {isHov && (
                <g transform={`translate(${tipX},${tipY})`}>
                  <rect
                    x={0} y={0}
                    width={tipW} height={34}
                    fill="rgba(0,0,0,0.93)"
                    stroke={color}
                    strokeWidth={1}
                    rx={4}
                  />
                  <text x={6} y={13} fontSize={8.5} fontWeight="bold" fill={color}
                    style={{ pointerEvents: 'none' }}>
                    {node.name}
                  </text>
                  <text x={6} y={26} fontSize={7.5} fill="#d1d5db"
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
      <div className="mt-2 flex flex-wrap gap-3 justify-center text-xs text-gray-400">
        {([['#f59e0b','GK'],['#3b82f6','DEF'],['#22c55e','MID'],['#00ff85','FWD']] as const).map(([c, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

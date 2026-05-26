'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Shot {
  x: number
  y: number
  xG: number
  result: 'goal' | 'saved' | 'off_target' | 'blocked'
  minute: number
}

interface Props {
  shots: Shot[]
  teamName: string
  width?: number
}

const RESULT_COLORS: Record<Shot['result'], string> = {
  goal: '#00ff85',
  saved: '#f59e0b',
  off_target: '#ef4444',
  blocked: '#6b7280',
}

const RESULT_LABELS: Record<Shot['result'], string> = {
  goal: 'Goal',
  saved: 'Saved',
  off_target: 'Off Target',
  blocked: 'Blocked',
}

export function ShotMap({ shots, teamName: _teamName, width = 320 }: Props) {
  const [hoveredShot, setHoveredShot] = useState<Shot | null>(null)
  const height = width * 0.6
  const totalXG = shots.reduce((s, shot) => s + shot.xG, 0)
  const goals = shots.filter(s => s.result === 'goal').length

  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Shot Map</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#e8f5e9] font-bold">{goals} goals</span>
          <span className="text-gray-400">xG: <span className="text-[#00ff85] font-mono">{totalXG.toFixed(2)}</span></span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="rounded overflow-hidden">
          <rect x={0} y={0} width={width} height={height} fill="#0d3d22" />
          <rect x={width * 0.38} y={0} width={width * 0.24} height={height * 0.06} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />
          <rect x={width * 0.28} y={0} width={width * 0.44} height={height * 0.15} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />
          <rect x={width * 0.12} y={0} width={width * 0.76} height={height * 0.38} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />
          <circle cx={width * 0.5} cy={height * 0.22} r={2} fill="#1a5c3a" />
          <line x1={0} y1={height - 1} x2={width} y2={height - 1} stroke="#1a5c3a" strokeWidth={1.5} />

          {shots.map((shot, i) => {
            const px = (shot.x / 100) * width
            const py = (shot.y / 100) * height
            const r = 4 + shot.xG * 10
            const color = RESULT_COLORS[shot.result]
            const isHovered = hoveredShot === shot

            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredShot(shot)}
                onMouseLeave={() => setHoveredShot(null)}
              >
                <circle
                  cx={px} cy={py} r={r}
                  fill={color}
                  fillOpacity={shot.result === 'goal' ? 0.9 : 0.5}
                  stroke={isHovered ? '#ffffff' : color}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                />
                {shot.result === 'goal' && (
                  <circle cx={px} cy={py} r={r + 3} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.4} />
                )}
              </g>
            )
          })}

          {hoveredShot && (() => {
            const px = (hoveredShot.x / 100) * width
            const py = (hoveredShot.y / 100) * height
            const flipX = px > width * 0.7
            const tx = flipX ? px - 75 : px + 8
            return (
              <g>
                <rect x={tx} y={py - 18} width={70} height={30} fill="rgba(0,0,0,0.9)" rx={3} />
                <text x={tx + 4} y={py - 6} fontSize={8} fill="#e8f5e9">{RESULT_LABELS[hoveredShot.result]}</text>
                <text x={tx + 4} y={py + 5} fontSize={8} fill="#9ca3af">
                  xG: {hoveredShot.xG.toFixed(2)} · {hoveredShot.minute}&apos;
                </text>
              </g>
            )
          })()}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(RESULT_LABELS).map(([result, label]) => (
          <div key={result} className={cn('flex items-center gap-1.5 text-xs')}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RESULT_COLORS[result as Shot['result']] }} />
            <span className="text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

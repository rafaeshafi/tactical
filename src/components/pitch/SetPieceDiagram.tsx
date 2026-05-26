'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { SetPieceRoutine } from '@/lib/tactics/set-pieces'
import { getRouteColor } from '@/lib/tactics/set-pieces'

interface Props {
  routine: SetPieceRoutine
  width?: number
  height?: number
}

function pointsToPath(start: { x: number; y: number }, path: { x: number; y: number }[], w: number, h: number): string {
  const toCoord = (pt: { x: number; y: number }) => `${(pt.x / 100) * w},${(pt.y / 100) * h}`
  if (path.length === 0) return ''
  const points = [start, ...path]
  return `M ${points.map(toCoord).join(' L ')}`
}

export function SetPieceDiagram({ routine, width = 340, height = 280 }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [key, setKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function handlePlay() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setKey(k => k + 1)
    setIsPlaying(true)
    timerRef.current = setTimeout(() => setIsPlaying(false), 2500)
  }

  const vbHeight = height * 0.5

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${vbHeight}`}
          width={width}
          height={vbHeight}
          className="rounded-xl overflow-hidden"
        >
          {/* Pitch background section */}
          <rect x={0} y={0} width={width} height={vbHeight} fill="#0d3d22" />
          <rect x={1.5} y={1.5} width={width - 3} height={vbHeight - 3} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Goal box lines (top) */}
          <rect x={(width - width * 0.6) / 2} y={1.5} width={width * 0.6} height={vbHeight * 0.32} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />
          <rect x={(width - width * 0.32) / 2} y={1.5} width={width * 0.32} height={vbHeight * 0.14} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Ball */}
          <circle cx={(routine.ballStartX / 100) * width} cy={(routine.ballStartY / 100) * vbHeight} r={5} fill="#ffffff" />

          {/* Run routes */}
          {routine.routes.map((route, i) => {
            if (route.path.length === 0) return null
            const d = pointsToPath(
              { x: route.startX, y: route.startY },
              route.path,
              width,
              vbHeight
            )
            const color = route.color ?? getRouteColor(route.role)
            return (
              <g key={`${key}-${i}`}>
                <path d={d} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.3} />
                <motion.path
                  key={`anim-${key}-${i}`}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeDasharray="1000"
                  strokeDashoffset={1000}
                  animate={isPlaying ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: 'easeInOut' }}
                />
                {route.path.length > 0 && (() => {
                  const end = route.path[route.path.length - 1]
                  const px = (end.x / 100) * width
                  const py = (end.y / 100) * vbHeight
                  return (
                    <motion.circle
                      key={`dot-${key}-${i}`}
                      cx={px}
                      cy={py}
                      r={4}
                      fill={color}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isPlaying ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.2 + 0.8 }}
                    />
                  )
                })()}
              </g>
            )
          })}

          {/* Player start positions */}
          {routine.routes.map((route, i) => {
            const px = (route.startX / 100) * width
            const py = (route.startY / 100) * vbHeight
            const color = route.color ?? getRouteColor(route.role)
            return (
              <g key={`player-${i}`}>
                <circle cx={px} cy={py} r={7} fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth={1.5} />
                <text x={px} y={py} textAnchor="middle" dominantBaseline="central" fontSize={6} fontWeight="bold" fill="rgba(0,0,0,0.8)">
                  {i + 1}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Play button */}
        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 bg-[#00ff85] hover:bg-[#00cc6a] text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
        >
          {isPlaying ? '▶ Playing...' : '▶ Animate'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {(['taker', 'runner', 'decoy', 'blocker'] as const).map(role => (
          <div key={role} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRouteColor(role) }} />
            <span className="text-gray-400 capitalize">{role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

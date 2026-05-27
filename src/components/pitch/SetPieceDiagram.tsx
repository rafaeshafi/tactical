'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { SetPieceRoutine, RunRoute } from '@/lib/tactics/set-pieces'
import { getRouteColor } from '@/lib/tactics/set-pieces'

interface Props {
  routine: SetPieceRoutine
  width?: number
  height?: number
}

function pointsToPath(
  start: { x: number; y: number },
  path: { x: number; y: number }[],
  w: number,
  h: number
): string {
  const toCoord = (pt: { x: number; y: number }) =>
    `${(pt.x / 100) * w},${(pt.y / 100) * h}`
  if (path.length === 0) return ''
  const points = [start, ...path]
  return `M ${points.map(toCoord).join(' L ')}`
}

// Interpolate along a path for ball animation keyframes
function pathKeyframes(
  start: { x: number; y: number },
  path: { x: number; y: number }[],
  w: number,
  h: number,
  steps = 20
): { x: number[]; y: number[] } {
  const pts = [start, ...path]
  if (pts.length < 2) return { x: [pts[0].x / 100 * w], y: [pts[0].y / 100 * h] }

  const xs: number[] = []
  const ys: number[] = []
  const segments = pts.length - 1

  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    const segF = t * segments
    const segIdx = Math.min(Math.floor(segF), segments - 1)
    const segT = segF - segIdx
    const a = pts[segIdx]
    const b = pts[segIdx + 1]
    xs.push(((a.x + (b.x - a.x) * segT) / 100) * w)
    ys.push(((a.y + (b.y - a.y) * segT) / 100) * h)
  }
  return { x: xs, y: ys }
}

function getTokenColor(role: RunRoute['role']): string {
  if (role === 'blocker') return '#3b4a6b'
  return getRouteColor(role)
}

const ROLE_LABELS: Record<RunRoute['role'], string> = {
  taker: 'Taker',
  runner: 'Runner',
  decoy: 'Decoy',
  blocker: 'Blocker',
  keeper: 'Keeper',
}

export function SetPieceDiagram({ routine, width = 480, height = 340 }: Props) {
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
    timerRef.current = setTimeout(() => setIsPlaying(false), 3500)
  }

  // Half-pitch: viewBox height = half of logical height
  const vbH = height * 0.5

  // Pitch geometry constants (all in px within viewBox)
  const penaltyW = width * 0.6
  const penaltyH = vbH * 0.38
  const penaltyX = (width - penaltyW) / 2
  const sixYardW = width * 0.3
  const sixYardH = vbH * 0.17
  const sixYardX = (width - sixYardW) / 2
  const goalW = width * 0.14
  const goalH = vbH * 0.045
  const goalX = (width - goalW) / 2

  // Ball start position
  const ballStartPx = (routine.ballStartX / 100) * width
  const ballStartPy = (routine.ballStartY / 100) * vbH

  // Defensive wall for free kicks (4 players in front of ball)
  const wallPlayers = routine.type === 'freekick' ? [0, 1, 2, 3] : []
  const wallBaseX = ballStartPx
  const wallBaseY = Math.max(ballStartPy - vbH * 0.12, 6)
  const wallSpacing = 11

  // Find the primary taker route for ball animation
  const takerRoute = routine.routes.find(r => r.role === 'taker' && r.path.length > 0)
    ?? routine.routes.find(r => r.path.length > 0)
  const ballKeyframes = takerRoute
    ? pathKeyframes(
        { x: takerRoute.startX, y: takerRoute.startY },
        takerRoute.path,
        width,
        vbH
      )
    : { x: [ballStartPx], y: [ballStartPy] }

  // Stagger per route (taker faster, runners staggered)
  function routeDuration(role: RunRoute['role']) {
    return role === 'taker' ? 0.6 : 0.85
  }
  function routeDelay(i: number, role: RunRoute['role']) {
    if (role === 'taker') return 0
    return 0.1 + i * 0.15
  }

  // Unique roles for legend
  const presentRoles = Array.from(new Set(routine.routes.map(r => r.role)))

  // Stripe pattern id unique per routine to avoid SVG id clashes
  const stripeId = `stripe-${routine.id}`
  const shadowId = `shadow-${routine.id}`

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${vbH}`}
          width={width}
          height={vbH}
          className="rounded-xl overflow-hidden w-full"
          style={{ maxWidth: width }}
        >
          <defs>
            {/* Subtle pitch stripes */}
            <pattern id={stripeId} x="0" y="0" width="40" height={vbH} patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height={vbH} fill="#0d3d22" />
              <rect x="20" y="0" width="20" height={vbH} fill="#0f4426" />
            </pattern>
            <filter id={shadowId}>
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Pitch background with stripes */}
          <rect x={0} y={0} width={width} height={vbH} fill={`url(#${stripeId})`} />

          {/* Outer border */}
          <rect x={1.5} y={1.5} width={width - 3} height={vbH - 3} fill="none" stroke="#1a5c3a" strokeWidth={1.5} />

          {/* Penalty box */}
          <rect x={penaltyX} y={1.5} width={penaltyW} height={penaltyH}
            fill="none" stroke="#1e6b42" strokeWidth={1.5} />

          {/* 6-yard box */}
          <rect x={sixYardX} y={1.5} width={sixYardW} height={sixYardH}
            fill="none" stroke="#1e6b42" strokeWidth={1.2} />

          {/* Goal */}
          <rect x={goalX} y={0} width={goalW} height={goalH + 1.5}
            fill="#0a2e18" stroke="#2e8b57" strokeWidth={1.5} />

          {/* Goal line highlight */}
          <line x1={goalX} y1={1.5} x2={goalX + goalW} y2={1.5} stroke="#2e8b57" strokeWidth={2} />

          {/* Corner arc (right side example, adjust for left) */}
          {routine.type === 'corner' && routine.side === 'right' && (
            <path
              d={`M ${width - 1.5} 0 A ${vbH * 0.18} ${vbH * 0.18} 0 0 0 ${width - vbH * 0.18} 1.5`}
              fill="none" stroke="#1e6b42" strokeWidth={1.2}
            />
          )}
          {routine.type === 'corner' && routine.side === 'left' && (
            <path
              d={`M 1.5 0 A ${vbH * 0.18} ${vbH * 0.18} 0 0 1 ${vbH * 0.18} 1.5`}
              fill="none" stroke="#1e6b42" strokeWidth={1.2}
            />
          )}

          {/* Penalty spot */}
          <circle cx={width / 2} cy={penaltyH * 0.72} r={2} fill="#1e6b42" />

          {/* Routine name label */}
          <text
            x={8} y={16}
            fontSize={9} fontWeight="bold"
            fill="rgba(255,255,255,0.55)"
            fontFamily="sans-serif"
          >
            {routine.name}
          </text>

          {/* Defensive wall (free kicks only) */}
          {wallPlayers.map(wi => (
            <g key={`wall-${wi}`}>
              <circle
                cx={wallBaseX + (wi - 1.5) * wallSpacing}
                cy={wallBaseY}
                r={8}
                fill="#4b5563"
                stroke="#374151"
                strokeWidth={1.5}
                filter={`url(#${shadowId})`}
              />
              <text
                x={wallBaseX + (wi - 1.5) * wallSpacing}
                y={wallBaseY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={6}
                fontWeight="bold"
                fill="rgba(255,255,255,0.7)"
                fontFamily="sans-serif"
              >
                D
              </text>
            </g>
          ))}

          {/* Run routes */}
          {routine.routes.map((route, i) => {
            if (route.path.length === 0) return null
            const d = pointsToPath(
              { x: route.startX, y: route.startY },
              route.path,
              width,
              vbH
            )
            const color = route.color ?? getRouteColor(route.role)
            const dur = routeDuration(route.role)
            const del = routeDelay(i, route.role)

            return (
              <g key={`route-${key}-${i}`}>
                {/* Ghost path */}
                <path d={d} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.2} />
                {/* Animated path */}
                <motion.path
                  key={`anim-${key}-${i}`}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={route.role === 'taker' ? 3 : 2.5}
                  strokeDasharray="1000"
                  strokeDashoffset={1000}
                  animate={isPlaying ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: dur, delay: del, ease: 'easeInOut' }}
                  strokeLinecap="round"
                />
                {/* Destination marker — pulsing after route completes */}
                {(() => {
                  const end = route.path[route.path.length - 1]
                  const px = (end.x / 100) * width
                  const py = (end.y / 100) * vbH
                  return (
                    <motion.circle
                      key={`dest-${key}-${i}`}
                      cx={px}
                      cy={py}
                      r={5}
                      fill={color}
                      fillOpacity={0.8}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isPlaying
                        ? { scale: [0, 1.4, 1, 1.4, 1], opacity: [0, 1, 0.8, 1, 0.8] }
                        : { scale: 0, opacity: 0 }}
                      transition={{ delay: del + dur, duration: 0.8, times: [0, 0.2, 0.5, 0.75, 1] }}
                    />
                  )
                })()}
              </g>
            )
          })}

          {/* Player tokens — numbered circles */}
          {routine.routes.map((route, i) => {
            const px = (route.startX / 100) * width
            const py = (route.startY / 100) * vbH
            const color = route.color ?? getTokenColor(route.role)
            const isAttacking = route.role === 'taker' || route.role === 'runner' || route.role === 'decoy'
            const r = isAttacking ? 11 : 10

            return (
              <g key={`player-${i}`} filter={`url(#${shadowId})`}>
                <circle
                  cx={px}
                  cy={py}
                  r={r}
                  fill={color}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth={1.5}
                />
                <text
                  x={px}
                  y={py}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={7}
                  fontWeight="bold"
                  fill="white"
                  fontFamily="sans-serif"
                >
                  {i + 1}
                </text>
              </g>
            )
          })}

          {/* Animated ball */}
          <motion.circle
            key={`ball-${key}`}
            cx={ballStartPx}
            cy={ballStartPy}
            r={6}
            fill="white"
            stroke="#cccccc"
            strokeWidth={1}
            animate={isPlaying && ballKeyframes.x.length > 1
              ? { cx: ballKeyframes.x, cy: ballKeyframes.y }
              : { cx: ballStartPx, cy: ballStartPy }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            filter={`url(#${shadowId})`}
          />
        </svg>

        {/* Play button */}
        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 bg-[#00ff85] hover:bg-[#00cc6a] text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-lg"
        >
          {isPlaying ? '▶ Playing…' : '▶ Animate'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs px-1">
        {presentRoles.map(role => (
          <div key={role} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full border border-black/20"
              style={{ backgroundColor: getTokenColor(role) }}
            />
            <span className="text-gray-400">{ROLE_LABELS[role]}</span>
          </div>
        ))}
        {routine.type === 'freekick' && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-black/20 bg-[#4b5563]" />
            <span className="text-gray-400">Wall</span>
          </div>
        )}
      </div>
    </div>
  )
}

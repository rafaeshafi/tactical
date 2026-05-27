'use client'
import { useEffect, useRef } from 'react'
import { PitchCanvas } from './PitchCanvas'
import type { PressingData } from '@/lib/tactics/pressing'

interface Props {
  data: PressingData
  width?: number
  height?: number
}

const STYLE_COLORS: Record<string, string> = {
  'High Press': '#ef4444',
  'Mid Block':  '#f59e0b',
  'Low Block':  '#3b82f6',
}

// Pressing arrows point upward from the mid-block zone (y ≈ 50% of height)
// Each arrow is defined as { x %, offsetY from centre % }
const PRESS_ARROWS = [
  { x: 30, baseY: 58, length: 14 },
  { x: 45, baseY: 60, length: 16 },
  { x: 55, baseY: 60, length: 16 },
  { x: 70, baseY: 58, length: 14 },
]

// PPDA range: 4 (max press) → 18 (no press)
const PPDA_MIN = 4
const PPDA_MAX = 18

function ppdaToPercent(ppda: number): number {
  return Math.min(1, Math.max(0, (ppda - PPDA_MIN) / (PPDA_MAX - PPDA_MIN)))
}

export function PressMap({ data, width = 320, height = 440 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    data.zones.forEach(zone => {
      if (zone.intensity < 0.05) return
      const px = (zone.x / 100) * width
      const py = (zone.y / 100) * height
      const r  = 60 * zone.intensity + 20

      const color = data.pressStyle === 'High Press' ? '239, 68, 68'
        : data.pressStyle === 'Mid Block'             ? '245, 158, 11'
        : '59, 130, 246'

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
      grad.addColorStop(0,   `rgba(${color}, ${0.5 * zone.intensity})`)
      grad.addColorStop(0.6, `rgba(${color}, ${0.2 * zone.intensity})`)
      grad.addColorStop(1,   `rgba(${color}, 0)`)

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [data, width, height])

  const styleColor  = STYLE_COLORS[data.pressStyle] ?? '#ffffff'
  const ppdaPct     = ppdaToPercent(data.ppda)
  const barWidth    = 120
  const markerX     = Math.round(ppdaPct * barWidth)

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height}>
        {/* Directional press arrows */}
        <defs>
          <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={styleColor} fillOpacity={0.85} />
          </marker>
        </defs>
        {PRESS_ARROWS.map((a, i) => {
          const x1 = (a.x / 100) * width
          const y1 = (a.baseY / 100) * height
          const y2 = ((a.baseY - a.length) / 100) * height
          return (
            <line
              key={i}
              x1={x1} y1={y1}
              x2={x1} y2={y2}
              stroke={styleColor}
              strokeOpacity={0.8}
              strokeWidth={2}
              markerEnd="url(#arrowHead)"
            />
          )
        })}
      </PitchCanvas>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 rounded"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* PPDA badge */}
      <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 text-center">
        <div className="text-xs text-gray-400">PPDA</div>
        <div className="text-lg font-mono font-bold" style={{ color: styleColor }}>{data.ppda}</div>
      </div>

      {/* Press style badge */}
      <div
        className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold"
        style={{
          backgroundColor: `${styleColor}30`,
          color: styleColor,
          border: `1px solid ${styleColor}50`,
        }}
      >
        {data.pressStyle}
      </div>

      {/* Recovery zone */}
      <div className="absolute bottom-14 left-2 bg-black/70 rounded px-2 py-0.5 text-xs text-gray-300">
        Recovers in <span className="font-semibold text-[#e8f5e9]">{data.recoveryZone}</span>
      </div>

      {/* Press intensity bar */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded px-2 py-1.5">
        <div className="text-xs text-gray-400 mb-1">Press Intensity</div>
        <div className="relative" style={{ width: barWidth, height: 8 }}>
          <div
            className="absolute inset-0 rounded"
            style={{ background: 'linear-gradient(to right, #ef4444, #f59e0b, #22c55e)' }}
          />
          {/* Marker at current PPDA position (left = high press, right = low press) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-3 rounded-sm bg-white border border-black/50"
            style={{ left: markerX - 4 }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 mt-0.5" style={{ width: barWidth }}>
          <span>High</span>
          <span>Low</span>
        </div>
      </div>
    </div>
  )
}

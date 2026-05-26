'use client'
import { useEffect, useRef } from 'react'
import { PitchCanvas } from './PitchCanvas'
import type { PressingData } from '@/lib/tactics/pressing'

interface Props {
  data: PressingData
  width?: number
  height?: number
}

const STYLE_COLORS = {
  'High Press': '#ef4444',
  'Mid Block': '#f59e0b',
  'Low Block': '#3b82f6',
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
      const r = 60 * zone.intensity + 20

      const color = data.pressStyle === 'High Press' ? '239, 68, 68'
        : data.pressStyle === 'Mid Block' ? '245, 158, 11'
        : '59, 130, 246'

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
      grad.addColorStop(0, `rgba(${color}, ${0.5 * zone.intensity})`)
      grad.addColorStop(0.6, `rgba(${color}, ${0.2 * zone.intensity})`)
      grad.addColorStop(1, `rgba(${color}, 0)`)

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [data, width, height])

  const styleColor = STYLE_COLORS[data.pressStyle]

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 rounded"
        style={{ mixBlendMode: 'screen' }}
      />
      <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 text-center">
        <div className="text-xs text-gray-400">PPDA</div>
        <div className="text-lg font-mono font-bold" style={{ color: styleColor }}>{data.ppda}</div>
      </div>
      <div
        className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold"
        style={{ backgroundColor: `${styleColor}30`, color: styleColor, border: `1px solid ${styleColor}50` }}
      >
        {data.pressStyle}
      </div>
      <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-0.5 text-xs text-gray-300">
        Recovers in <span className="font-semibold text-[#e8f5e9]">{data.recoveryZone}</span>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useRef, useState } from 'react'
import { PitchCanvas } from './PitchCanvas'

interface HeatPoint {
  x: number
  y: number
  intensity: number
}

interface Props {
  points: HeatPoint[]
  width?: number
  height?: number
  playerName?: string
}

export function HeatmapOverlay({ points, width = 320, height = 440, playerName }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [breathe, setBreathe] = useState(false)

  // Toggle breathe state every 2 s to drive the CSS transition
  useEffect(() => {
    const id = setInterval(() => setBreathe(b => !b), 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    points.forEach(pt => {
      const px = (pt.x / 100) * width
      const py = (pt.y / 100) * height
      const r  = 40 * pt.intensity

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
      grad.addColorStop(0,   `rgba(255,  50,   0, ${0.6 * pt.intensity})`)
      grad.addColorStop(0.5, `rgba(255, 200,   0, ${0.3 * pt.intensity})`)
      grad.addColorStop(1,   'rgba(0, 100, 255, 0)')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [points, width, height])

  // Breathing: alternate blur + rotation smoothly via CSS transition
  const blurRadius = breathe ? 12 : 8
  const rotation   = breathe ? 0.1 : -0.1

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 rounded"
        style={{
          mixBlendMode: 'screen',
          filter: `blur(${blurRadius}px)`,
          transform: `rotate(${rotation}deg)`,
          transition: 'filter 2s ease-in-out, transform 2s ease-in-out',
        }}
      />
      {playerName && (
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-[#00ff85] font-medium">
          {playerName}
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
        <div className="flex items-center gap-1 text-xs text-gray-300">
          <div
            className="w-12 h-2 rounded"
            style={{ background: 'linear-gradient(to right, rgba(0,100,255,0.5), rgba(255,200,0,0.7), rgba(255,50,0,0.9))' }}
          />
          <span>activity</span>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useRef, useState } from 'react'
import { PitchCanvas } from './PitchCanvas'

interface HeatPoint {
  x: number
  y: number
  intensity: number
}

export interface HeatmapPlayer {
  id: number
  name: string
  role: string
  points: HeatPoint[]
}

interface Props {
  points: HeatPoint[]
  players?: HeatmapPlayer[]
  width?: number
  height?: number
  playerName?: string
}

export function HeatmapOverlay({ points, players, width = 320, height = 440, playerName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [breathe, setBreathe] = useState(false)
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  // Toggle breathe state every 2 s to drive the CSS transition
  useEffect(() => {
    const id = setInterval(() => setBreathe(b => !b), 2000)
    return () => clearInterval(id)
  }, [])

  const activePoints: HeatPoint[] =
    selectedPlayerId !== null && players
      ? (players.find(p => p.id === selectedPlayerId)?.points ?? points)
      : points

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    activePoints.forEach(pt => {
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
  }, [activePoints, width, height])

  // Breathing: alternate blur + rotation smoothly via CSS transition
  const blurRadius = breathe ? 12 : 8
  const rotation   = breathe ? 0.1 : -0.1

  const selectedPlayer = selectedPlayerId !== null && players
    ? players.find(p => p.id === selectedPlayerId) ?? null
    : null

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Player selector */}
      {players && players.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 max-w-full px-1">
          <button
            onClick={() => setSelectedPlayerId(null)}
            className={[
              'px-2.5 py-1 rounded text-xs font-medium transition-colors',
              selectedPlayerId === null
                ? 'bg-[#00ff85] text-black'
                : 'bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-gray-200',
            ].join(' ')}
          >
            All Players
          </button>
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlayerId(p.id)}
              className={[
                'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                selectedPlayerId === p.id
                  ? 'bg-[#00ff85] text-black'
                  : 'bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-gray-200',
              ].join(' ')}
            >
              {p.name}
              <span className="ml-1 opacity-60 text-[10px]">{p.role}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
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
        {(playerName ?? selectedPlayer?.name) && (
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-[#00ff85] font-medium">
            {selectedPlayer ? `${selectedPlayer.name} · ${selectedPlayer.role}` : playerName}
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
    </div>
  )
}

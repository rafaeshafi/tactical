'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PitchCanvas } from '@/components/pitch/PitchCanvas'
import { getFormationPositions } from '@/lib/tactics/formations'
import { FormationPresets } from './FormationPresets'

interface BoardPlayer {
  id: number
  x: number
  y: number
  role: string
  name: string
}

interface Arrow {
  id: string
  fromX: number
  fromY: number
  toX: number
  toY: number
}

interface Props {
  teamId: string
  initialFormation?: string
}

const PITCH_WIDTH = 340
const PITCH_HEIGHT = 480

const DEFAULT_NAMES = ['GK', 'LB', 'LCB', 'RCB', 'RB', 'LCM', 'CM', 'RCM', 'LW', 'ST', 'RW']

function storageKey(teamId: string) {
  return `tactics-board-${teamId}`
}

export function TacticsBoard({ teamId, initialFormation = '4-3-3' }: Props) {
  const [formation, setFormation] = useState(initialFormation)
  const [players, setPlayers] = useState<BoardPlayer[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [isDrawingArrow, setIsDrawingArrow] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [arrowTool, setArrowTool] = useState(false)
  const svgRef = useRef<HTMLDivElement>(null)

  function initPlayers(f: string) {
    const positions = getFormationPositions(f)
    return positions.map((pos, i) => ({
      id: i,
      x: (pos.x / 100) * PITCH_WIDTH,
      y: (pos.y / 100) * PITCH_HEIGHT,
      role: pos.role,
      name: DEFAULT_NAMES[i] ?? pos.role,
    }))
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(teamId))
      if (saved) {
        const data = JSON.parse(saved)
        setFormation(data.formation ?? initialFormation)
        setPlayers(data.players ?? initPlayers(data.formation ?? initialFormation))
        setArrows(data.arrows ?? [])
        return
      }
    } catch { /* ignore */ }
    setPlayers(initPlayers(initialFormation))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, initialFormation])

  function save(f: string, p: BoardPlayer[], a: Arrow[]) {
    try {
      localStorage.setItem(storageKey(teamId), JSON.stringify({ formation: f, players: p, arrows: a }))
    } catch { /* ignore */ }
  }

  function handleFormationChange(f: string) {
    const newPlayers = initPlayers(f)
    setFormation(f)
    setPlayers(newPlayers)
    setArrows([])
    save(f, newPlayers, [])
  }

  function handlePlayerDragEnd(id: number, x: number, y: number) {
    const updated = players.map(p => p.id === id ? { ...p, x, y } : p)
    setPlayers(updated)
    save(formation, updated, arrows)
  }

  function handleClear() {
    setArrows([])
    save(formation, players, [])
  }

  function handleReset() {
    const newPlayers = initPlayers(formation)
    setPlayers(newPlayers)
    setArrows([])
    save(formation, newPlayers, [])
  }

  function getSvgCoords(e: React.MouseEvent): { x: number; y: number } | null {
    if (!svgRef.current) return null
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  function handlePitchMouseDown(e: React.MouseEvent) {
    if (!arrowTool) return
    const coords = getSvgCoords(e)
    if (!coords) return
    setDrawStart(coords)
    setIsDrawingArrow(true)
  }

  function handlePitchMouseUp(e: React.MouseEvent) {
    if (!arrowTool || !drawStart || !isDrawingArrow) return
    const coords = getSvgCoords(e)
    if (!coords) return

    const dx = coords.x - drawStart.x
    const dy = coords.y - drawStart.y
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      setIsDrawingArrow(false)
      setDrawStart(null)
      return
    }

    const newArrow: Arrow = {
      id: `arrow-${Date.now()}`,
      fromX: drawStart.x,
      fromY: drawStart.y,
      toX: coords.x,
      toY: coords.y,
    }
    const updated = [...arrows, newArrow]
    setArrows(updated)
    save(formation, players, updated)
    setIsDrawingArrow(false)
    setDrawStart(null)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FormationPresets current={formation} onChange={handleFormationChange} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setArrowTool(v => !v)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              arrowTool
                ? 'bg-[#00ff85] text-black'
                : 'bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-[#e8f5e9]'
            }`}
          >
            {arrowTool ? '✏️ Drawing' : '↗ Draw Arrow'}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded text-xs font-medium bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-[#e8f5e9] transition-colors"
          >
            Clear Arrows
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded text-xs font-medium bg-[#111a15] border border-[#1e3329] text-gray-400 hover:text-red-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Board */}
      <div
        ref={svgRef}
        className="relative select-none"
        style={{ width: PITCH_WIDTH, height: PITCH_HEIGHT, cursor: arrowTool ? 'crosshair' : 'default' }}
        onMouseDown={handlePitchMouseDown}
        onMouseUp={handlePitchMouseUp}
      >
        <PitchCanvas width={PITCH_WIDTH} height={PITCH_HEIGHT}>
          {/* Arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#00ff85" />
            </marker>
          </defs>
          {arrows.map(arrow => (
            <line
              key={arrow.id}
              x1={arrow.fromX} y1={arrow.fromY}
              x2={arrow.toX} y2={arrow.toY}
              stroke="#00ff85"
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
              strokeOpacity={0.8}
            />
          ))}
        </PitchCanvas>

        {/* Draggable players */}
        {players.map(player => (
          <motion.div
            key={player.id}
            drag
            dragMomentum={false}
            style={{ position: 'absolute', x: player.x - 12, y: player.y - 12, touchAction: 'none', zIndex: 10 }}
            onDragEnd={(_, info) => {
              const newX = player.x + info.offset.x
              const newY = player.y + info.offset.y
              const clamped = {
                x: Math.max(12, Math.min(PITCH_WIDTH - 12, newX)),
                y: Math.max(12, Math.min(PITCH_HEIGHT - 12, newY)),
              }
              handlePlayerDragEnd(player.id, clamped.x, clamped.y)
            }}
          >
            <div className="w-6 h-6 rounded-full bg-[#00ff85] border-2 border-black/40 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg">
              <span className="text-[8px] font-bold text-black">{player.name.slice(0, 2)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {arrowTool ? 'Click and drag on the pitch to draw arrows.' : 'Drag players to reposition. Use "Draw Arrow" to add movement lines.'} Board saves automatically.
      </p>
    </div>
  )
}

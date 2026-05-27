'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PitchCanvas } from '@/components/pitch/PitchCanvas'
import { getFormationPositions } from '@/lib/tactics/formations'
import { FormationPresets } from './FormationPresets'
import { BenchPanel } from './BenchPanel'
import type { BoardPlayer, Arrow, PositionType } from './types'
import type { Player } from '@/types'

interface Props {
  teamId: string
  initialFormation?: string
  squad?: Player[]
}

const PITCH_W = 360
const PITCH_H = 500

const ROLE_COLORS: Record<string, string> = {
  GK:  '#f59e0b',
  LB:  '#3b82f6', RB: '#3b82f6', LCB: '#3b82f6', RCB: '#3b82f6', CB: '#3b82f6',
  LWB: '#6366f1', RWB: '#6366f1',
  DCM: '#22c55e', CM: '#22c55e', LCM: '#22c55e', RCM: '#22c55e', CAM: '#10b981',
  LW:  '#00ff85', RW: '#00ff85', ST: '#00ff85', LS: '#00ff85', RS: '#00ff85',
  LSS: '#00ff85', RSS: '#00ff85',
}

function storageKey(teamId: string) { return `tactics-board-v2-${teamId}` }
function benchKey(teamId: string)   { return `tactics-board-bench-v1-${teamId}` }

function roleToPositionType(role: string): Player['position'] {
  if (role === 'GK') return 'Goalkeeper'
  if (['LB','RB','LCB','RCB','CB','LWB','RWB'].includes(role)) return 'Defender'
  if (['LW','RW','ST','LS','RS','LSS','RSS'].includes(role)) return 'Attacker'
  return 'Midfielder'
}

// Map PositionType → a default role string for custom players on the pitch
const POSITION_DEFAULT_ROLE: Record<PositionType, string> = {
  Goalkeeper: 'GK', Defender: 'CB', Midfielder: 'CM', Attacker: 'ST',
}

let _customIdCounter = 9000

export function TacticsBoard({ teamId, initialFormation = '4-3-3', squad = [] }: Props) {
  const [formation, setFormation] = useState(initialFormation)
  const [players, setPlayers] = useState<BoardPlayer[]>([])
  const [benchPlayers, setBenchPlayers] = useState<BoardPlayer[]>([])
  const [customPlayers, setCustomPlayers] = useState<BoardPlayer[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [arrowTool, setArrowTool] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [showNames, setShowNames] = useState(true)
  const boardRef = useRef<HTMLDivElement>(null)

  const squadByType = useCallback((type: Player['position']): Player[] => {
    return squad.filter(p => p.position === type).sort((a, b) => (a.number ?? 99) - (b.number ?? 99))
  }, [squad])

  function buildPlayers(f: string): { pitch: BoardPlayer[]; bench: BoardPlayer[] } {
    const positions = getFormationPositions(f)
    const usedIdx: Record<Player['position'], number> = { Goalkeeper:0, Defender:0, Midfielder:0, Attacker:0 }
    const usedSquadIds = new Set<number>()

    const pitch: BoardPlayer[] = positions.map((pos, i) => {
      const px = (pos.x / 100) * PITCH_W
      const py = (pos.y / 100) * PITCH_H
      const type = roleToPositionType(pos.role)
      const pool = squadByType(type)
      const sp = pool[usedIdx[type]++] ?? null
      if (sp) usedSquadIds.add(sp.id)
      return {
        id: i,
        x: px, y: py,
        role: pos.role,
        name:    sp?.name    ?? pos.role,
        surname: sp?.surname ?? pos.role,
        number:  sp?.number  ?? null,
        photo:   sp?.photo   ?? '',
      }
    })

    const bench: BoardPlayer[] = squad
      .filter(sp => !usedSquadIds.has(sp.id))
      .map(sp => ({
        id:      sp.id + 1000, // offset to avoid collision with pitch ids (0-10)
        x: 0, y: 0,
        role:    POSITION_DEFAULT_ROLE[sp.position],
        name:    sp.name,
        surname: sp.surname,
        number:  sp.number,
        photo:   sp.photo,
      }))

    return { pitch, bench }
  }

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(teamId))
      if (saved) {
        const data = JSON.parse(saved)
        if (data.formation === initialFormation && Array.isArray(data.players)) {
          setFormation(data.formation)
          setPlayers(data.players)
          setArrows(data.arrows ?? [])
          const { bench } = buildPlayers(data.formation)
          setBenchPlayers(bench)
        } else {
          const { pitch, bench } = buildPlayers(initialFormation)
          setPlayers(pitch)
          setBenchPlayers(bench)
        }
      } else {
        const { pitch, bench } = buildPlayers(initialFormation)
        setPlayers(pitch)
        setBenchPlayers(bench)
      }
    } catch {
      const { pitch, bench } = buildPlayers(initialFormation)
      setPlayers(pitch)
      setBenchPlayers(bench)
    }

    try {
      const savedBench = localStorage.getItem(benchKey(teamId))
      if (savedBench) {
        const data = JSON.parse(savedBench)
        if (Array.isArray(data.customPlayers)) setCustomPlayers(data.customPlayers)
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, initialFormation])

  // Re-assign names when squad loads after first render
  useEffect(() => {
    if (squad.length === 0) return
    setPlayers(prev => {
      if (prev.length === 0) return buildPlayers(formation).pitch
      const positions = getFormationPositions(formation)
      const usedIdx: Record<Player['position'], number> = { Goalkeeper:0, Defender:0, Midfielder:0, Attacker:0 }
      return prev.map((bp, i) => {
        const type = roleToPositionType(positions[i]?.role ?? 'MF')
        const pool = squadByType(type)
        const sp = pool[usedIdx[type]++] ?? null
        return sp ? { ...bp, name: sp.name, surname: sp.surname, number: sp.number, photo: sp.photo } : bp
      })
    })
    const { bench } = buildPlayers(formation)
    setBenchPlayers(bench)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squad])

  function persistPitch(f: string, p: BoardPlayer[], a: Arrow[]) {
    try { localStorage.setItem(storageKey(teamId), JSON.stringify({ formation: f, players: p, arrows: a })) }
    catch { /* ignore */ }
  }

  function persistBench(custom: BoardPlayer[]) {
    try { localStorage.setItem(benchKey(teamId), JSON.stringify({ customPlayers: custom })) }
    catch { /* ignore */ }
  }

  function handleFormationChange(f: string) {
    const { pitch, bench } = buildPlayers(f)
    setFormation(f)
    setPlayers(pitch)
    setBenchPlayers(bench)
    setArrows([])
    persistPitch(f, pitch, [])
  }

  function handleDragEnd(id: number, offsetX: number, offsetY: number) {
    setPlayers(prev => {
      const updated = prev.map(p => {
        if (p.id !== id) return p
        return {
          ...p,
          x: Math.max(20, Math.min(PITCH_W - 20, p.x + offsetX)),
          y: Math.max(20, Math.min(PITCH_H - 20, p.y + offsetY)),
        }
      })
      persistPitch(formation, updated, arrows)
      return updated
    })
  }

  // Bench → Pitch swap
  function handleSubOn(benchPlayer: BoardPlayer, pitchPlayer: BoardPlayer) {
    setPlayers(prev => {
      const updated = prev.map(pp => {
        if (pp.id !== pitchPlayer.id) return pp
        return {
          ...pp,
          name:    benchPlayer.name,
          surname: benchPlayer.surname,
          number:  benchPlayer.number,
          photo:   benchPlayer.photo,
          role:    benchPlayer.isCustom ? POSITION_DEFAULT_ROLE[benchPlayer.role as PositionType] : pp.role,
        }
      })
      persistPitch(formation, updated, arrows)
      return updated
    })

    // Move pitch player to bench, remove bench player from bench
    const benchVersion: BoardPlayer = {
      ...pitchPlayer,
      id: pitchPlayer.id + 2000,
      x: 0, y: 0,
    }
    setBenchPlayers(prev => {
      const filtered = prev.filter(bp => bp.id !== benchPlayer.id)
      return [...filtered, benchVersion]
    })
    // If custom, remove from customPlayers
    if (benchPlayer.isCustom) {
      setCustomPlayers(prev => {
        const updated = prev.filter(cp => cp.id !== benchPlayer.id)
        persistBench(updated)
        return updated
      })
    }
  }

  // Custom player management
  function handleAddCustom(name: string, surname: string, position: PositionType) {
    const newPlayer: BoardPlayer = {
      id: _customIdCounter++,
      x: 0, y: 0,
      role: position,
      name, surname,
      number: null,
      photo: '',
      isCustom: true,
    }
    setCustomPlayers(prev => {
      const updated = [...prev, newPlayer]
      persistBench(updated)
      return updated
    })
  }

  function handleRemoveCustom(id: number) {
    setCustomPlayers(prev => {
      const updated = prev.filter(cp => cp.id !== id)
      persistBench(updated)
      return updated
    })
  }

  function getBoardCoords(e: React.MouseEvent): { x: number; y: number } | null {
    if (!boardRef.current) return null
    const rect = boardRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!arrowTool) return
    const c = getBoardCoords(e)
    if (c) setDrawStart(c)
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!arrowTool || !drawStart) return
    const c = getBoardCoords(e)
    if (!c) return
    const dx = c.x - drawStart.x, dy = c.y - drawStart.y
    if (Math.sqrt(dx * dx + dy * dy) < 15) { setDrawStart(null); return }
    const newArrow: Arrow = { id: `a-${Date.now()}`, fromX: drawStart.x, fromY: drawStart.y, toX: c.x, toY: c.y }
    const updated = [...arrows, newArrow]
    setArrows(updated)
    persistPitch(formation, players, updated)
    setDrawStart(null)
  }

  const TOKEN = 36

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FormationPresets current={formation} onChange={handleFormationChange} />
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowNames(v => !v)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#1e3329] bg-[#0d1810] text-gray-400 hover:text-[#e8f5e9] transition-colors"
          >
            {showNames ? '🏷 Names: On' : '🏷 Names: Off'}
          </button>
          <button
            onClick={() => setArrowTool(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              arrowTool
                ? 'bg-[#00ff85] text-black'
                : 'border border-[#1e3329] bg-[#0d1810] text-gray-400 hover:text-[#e8f5e9]'
            }`}
          >
            {arrowTool ? '✏️ Drawing arrows' : '↗ Draw Arrow'}
          </button>
          <button
            onClick={() => { setArrows([]); persistPitch(formation, players, []) }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#1e3329] bg-[#0d1810] text-gray-400 hover:text-[#e8f5e9] transition-colors"
          >
            Clear Arrows
          </button>
          <button
            onClick={() => {
              const { pitch, bench } = buildPlayers(formation)
              setPlayers(pitch)
              setBenchPlayers(bench)
              setArrows([])
              persistPitch(formation, pitch, [])
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-900/40 bg-red-900/10 text-red-400 hover:text-red-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Pitch Board */}
      <div
        ref={boardRef}
        className="relative select-none rounded-xl overflow-hidden"
        style={{ width: PITCH_W, height: PITCH_H, cursor: arrowTool ? 'crosshair' : 'default', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <PitchCanvas width={PITCH_W} height={PITCH_H}>
          <defs>
            <marker id="tb-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#00ff85" />
            </marker>
          </defs>
          {arrows.map(a => (
            <line key={a.id} x1={a.fromX} y1={a.fromY} x2={a.toX} y2={a.toY}
              stroke="#00ff85" strokeWidth={2.5} strokeOpacity={0.85}
              markerEnd="url(#tb-arrow)" strokeLinecap="round"
            />
          ))}
        </PitchCanvas>

        {players.map(player => {
          const color = ROLE_COLORS[player.role] ?? '#00ff85'
          return (
            <motion.div
              key={player.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              style={{ position: 'absolute', left: 0, top: 0, x: player.x - TOKEN / 2, y: player.y - TOKEN / 2, touchAction: 'none', zIndex: 20 }}
              whileDrag={{ scale: 1.15, zIndex: 30 }}
              onDragEnd={(_, info) => handleDragEnd(player.id, info.offset.x, info.offset.y)}
            >
              <div className="flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing">
                <div
                  className="relative rounded-full overflow-hidden shadow-lg border-2"
                  style={{ width: TOKEN, height: TOKEN, borderColor: color, background: `${color}22` }}
                >
                  {player.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={player.photo}
                      alt={player.surname}
                      className="w-full h-full object-cover object-top"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : null}
                  <div
                    className="absolute bottom-0 inset-x-0 text-center text-[9px] font-black leading-tight"
                    style={{ background: `${color}cc`, color: '#000' }}
                  >
                    {player.number ?? player.role.slice(0, 2)}
                  </div>
                </div>
                {showNames && (
                  <div
                    className="px-1 rounded text-[8px] font-bold text-center whitespace-nowrap max-w-[60px] truncate"
                    style={{ background: 'rgba(0,0,0,0.75)', color }}
                  >
                    {player.surname.slice(0, 9)}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="text-xs text-gray-500">
        {arrowTool
          ? 'Click and drag on the pitch to draw movement arrows.'
          : 'Drag players anywhere on the pitch. Use "Draw Arrow" to add movement lines.'}
        {' '}Board saves automatically to your browser.
      </p>

      {/* Bench Panel */}
      <BenchPanel
        benchPlayers={benchPlayers}
        customPlayers={customPlayers}
        pitchPlayers={players}
        onSubOn={handleSubOn}
        onAddCustom={handleAddCustom}
        onRemoveCustom={handleRemoveCustom}
      />
    </div>
  )
}

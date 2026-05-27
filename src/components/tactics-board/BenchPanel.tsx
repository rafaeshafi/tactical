'use client'
import { useState } from 'react'
import type { BoardPlayer, PositionType } from './types'
import { POSITION_BADGE } from './types'

const ROLE_COLORS: Record<string, string> = {
  GK:  '#f59e0b',
  LB:  '#3b82f6', RB: '#3b82f6', LCB: '#3b82f6', RCB: '#3b82f6', CB: '#3b82f6',
  LWB: '#6366f1', RWB: '#6366f1',
  DCM: '#22c55e', CM: '#22c55e', LCM: '#22c55e', RCM: '#22c55e', CAM: '#10b981',
  LW:  '#00ff85', RW: '#00ff85', ST: '#00ff85', LS: '#00ff85', RS: '#00ff85',
  LSS: '#00ff85', RSS: '#00ff85',
}

function positionColor(pos: PositionType): string {
  const map: Record<PositionType, string> = {
    Goalkeeper: '#f59e0b',
    Defender:   '#3b82f6',
    Midfielder: '#22c55e',
    Attacker:   '#00ff85',
  }
  return map[pos]
}

function roleToPositionType(role: string): PositionType {
  if (role === 'GK') return 'Goalkeeper'
  if (['LB','RB','LCB','RCB','CB','LWB','RWB'].includes(role)) return 'Defender'
  if (['LW','RW','ST','LS','RS','LSS','RSS'].includes(role)) return 'Attacker'
  return 'Midfielder'
}

// ── BenchCard ────────────────────────────────────────────────────────────────

interface BenchCardProps {
  player: BoardPlayer
  pitchPlayers: BoardPlayer[]
  onSubOn: (bench: BoardPlayer, pitch: BoardPlayer) => void
}

function BenchCard({ player, pitchPlayers, onSubOn }: BenchCardProps) {
  const [picking, setPicking] = useState(false)
  const TOKEN = 36
  const posType = player.isCustom
    ? (player.role as PositionType)
    : roleToPositionType(player.role)
  const color = player.isCustom ? positionColor(posType) : (ROLE_COLORS[player.role] ?? '#00ff85')
  const badge = POSITION_BADGE[posType] ?? player.role.slice(0, 3)

  return (
    <div className="flex flex-col items-center gap-1 min-w-[80px]">
      {/* Token */}
      <div
        className="relative rounded-full overflow-hidden shadow-md border-2"
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

      {/* Name + badge */}
      <div className="text-center space-y-0.5">
        <div className="text-[10px] font-bold text-[#e8f5e9] max-w-[72px] truncate">
          {player.surname.slice(0, 10)}
        </div>
        <span
          className="inline-block px-1 rounded text-[8px] font-bold"
          style={{ background: `${color}33`, color }}
        >
          {badge}
        </span>
      </div>

      {/* Sub On button / picker */}
      {!picking ? (
        <button
          onClick={() => setPicking(true)}
          className="px-2 py-0.5 rounded text-[9px] font-semibold border border-[#1e3329] bg-[#0d1810] text-[#00ff85] hover:bg-[#00ff85]/20 transition-colors"
        >
          Sub On →
        </button>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="text-[8px] text-gray-400">Replace:</div>
          <div className="flex flex-wrap gap-1 max-w-[200px] justify-center">
            {pitchPlayers.map(pp => {
              const ppColor = ROLE_COLORS[pp.role] ?? '#00ff85'
              return (
                <button
                  key={pp.id}
                  title={`${pp.surname} (${pp.role})`}
                  onClick={() => { onSubOn(player, pp); setPicking(false) }}
                  className="rounded-full border-2 overflow-hidden transition-transform hover:scale-110"
                  style={{ width: 22, height: 22, borderColor: ppColor, background: `${ppColor}22` }}
                >
                  {pp.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pp.photo}
                      alt={pp.surname}
                      className="w-full h-full object-cover object-top"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <span className="text-[7px] font-bold text-gray-300 flex items-center justify-center h-full">
                      {pp.role.slice(0, 2)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setPicking(false)}
            className="text-[8px] text-gray-500 hover:text-gray-300"
          >
            cancel
          </button>
        </div>
      )}
    </div>
  )
}

// ── CustomPlayerForm ─────────────────────────────────────────────────────────

interface CustomPlayerFormProps {
  onAdd: (name: string, surname: string, position: PositionType) => void
}

function CustomPlayerForm({ onAdd }: CustomPlayerFormProps) {
  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState<PositionType>('Attacker')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed) return
    const parts = trimmed.split(' ')
    const surname = parts[parts.length - 1]
    const name = parts.slice(0, -1).join(' ') || surname
    onAdd(name, surname, position)
    setFullName('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 mt-3">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Player Name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="e.g. Kylian Mbappé"
          className="px-2 py-1.5 rounded text-xs bg-[#0d1810] border border-[#1e3329] text-[#e8f5e9] placeholder-gray-600 focus:outline-none focus:border-[#00ff85]/40 w-44"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Position</label>
        <select
          value={position}
          onChange={e => setPosition(e.target.value as PositionType)}
          className="px-2 py-1.5 rounded text-xs bg-[#0d1810] border border-[#1e3329] text-[#e8f5e9] focus:outline-none focus:border-[#00ff85]/40"
        >
          <option value="Goalkeeper">Goalkeeper</option>
          <option value="Defender">Defender</option>
          <option value="Midfielder">Midfielder</option>
          <option value="Attacker">Attacker</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-3 py-1.5 rounded text-xs font-semibold bg-[#1e3329] text-[#00ff85] border border-[#00ff85]/30 hover:bg-[#00ff85]/20 transition-colors"
      >
        + Add Player
      </button>
    </form>
  )
}

// ── BenchPanel ────────────────────────────────────────────────────────────────

interface BenchPanelProps {
  benchPlayers: BoardPlayer[]
  customPlayers: BoardPlayer[]
  pitchPlayers: BoardPlayer[]
  onSubOn: (bench: BoardPlayer, pitch: BoardPlayer) => void
  onAddCustom: (name: string, surname: string, position: PositionType) => void
  onRemoveCustom: (id: number) => void
}

export function BenchPanel({
  benchPlayers,
  customPlayers,
  pitchPlayers,
  onSubOn,
  onAddCustom,
  onRemoveCustom,
}: BenchPanelProps) {
  const [activeTab, setActiveTab] = useState<'bench' | 'custom'>('bench')

  const allBench = [...benchPlayers, ...customPlayers]

  return (
    <div className="border-t border-[#1e3329] mt-4 pt-4 space-y-3">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        {(['bench', 'custom'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#00ff85] text-black'
                : 'bg-[#111a15] border border-[#1e3329] text-gray-400 hover:border-[#00ff85]/40 hover:text-[#e8f5e9]'
            }`}
          >
            {tab === 'bench' ? `Bench (${allBench.length})` : 'Custom Players / Future Transfers'}
          </button>
        ))}
      </div>

      {/* Bench tab */}
      {activeTab === 'bench' && (
        <div className="overflow-x-auto">
          {allBench.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No bench players. Use a formation with a full squad or add custom players.</p>
          ) : (
            <div className="flex gap-4 pb-2 min-w-max">
              {allBench.map(bp => (
                <BenchCard
                  key={bp.id}
                  player={bp}
                  pitchPlayers={pitchPlayers}
                  onSubOn={onSubOn}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom tab */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            Add hypothetical signings or future transfers. They appear in the Bench panel and can be subbed onto the pitch.
          </p>
          <CustomPlayerForm onAdd={onAddCustom} />
          {customPlayers.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {customPlayers.map(cp => {
                const posType = cp.role as PositionType
                const color = positionColor(posType)
                return (
                  <div
                    key={cp.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-[#1e3329] bg-[#0d1810]"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="text-xs font-semibold text-[#e8f5e9]">{cp.name !== cp.surname ? `${cp.name} ` : ''}{cp.surname}</span>
                    <span className="text-[9px] font-bold px-1 rounded" style={{ background: `${color}33`, color }}>
                      {POSITION_BADGE[posType] ?? posType.slice(0, 3)}
                    </span>
                    <button
                      onClick={() => onRemoveCustom(cp.id)}
                      className="text-gray-600 hover:text-red-400 text-xs ml-1 transition-colors"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
          {customPlayers.length === 0 && (
            <p className="text-xs text-gray-600 italic">No custom players added yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

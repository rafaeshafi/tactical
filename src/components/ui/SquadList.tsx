import Image from 'next/image'
import type { Player } from '@/types'

interface Props {
  players: Player[]
}

const POSITION_ORDER: Player['position'][] = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker']

const POSITION_LABEL: Record<Player['position'], string> = {
  Goalkeeper: '🧤 Goalkeepers',
  Defender:   '🛡 Defenders',
  Midfielder: '⚙️ Midfielders',
  Attacker:   '⚽ Attackers',
}

const POSITION_DOT: Record<Player['position'], string> = {
  Goalkeeper: 'bg-amber-500',
  Defender:   'bg-blue-500',
  Midfielder: 'bg-green-500',
  Attacker:   'bg-[#00ff85]',
}

export function SquadList({ players }: Props) {
  if (players.length === 0) return null

  const grouped = POSITION_ORDER.reduce<Record<Player['position'], Player[]>>(
    (acc, pos) => {
      acc[pos] = players.filter(p => p.position === pos)
        .sort((a, b) => (a.number ?? 99) - (b.number ?? 99))
      return acc
    },
    { Goalkeeper: [], Defender: [], Midfielder: [], Attacker: [] }
  )

  return (
    <div className="space-y-6">
      <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Squad</h2>
      {POSITION_ORDER.map(pos => {
        const group = grouped[pos]
        if (group.length === 0) return null
        return (
          <div key={pos}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${POSITION_DOT[pos]}`} />
              <span className="text-xs font-bold text-gray-300">{POSITION_LABEL[pos]}</span>
              <span className="text-[10px] text-gray-600">({group.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {group.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#1e3329] bg-[#0d1810] hover:border-[#00ff85]/30 hover:bg-[#0d1810] transition-all group">
      {/* Photo */}
      <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden bg-[#1a2e22] border border-[#1e3329]">
        {player.photo ? (
          <Image
            src={player.photo}
            alt={player.name}
            fill
            className="object-cover object-top"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
            {player.surname.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      {/* Number + Name */}
      <div className="min-w-0">
        {player.number !== null && (
          <span className="text-[10px] font-bold text-gray-500 block">#{player.number}</span>
        )}
        <span className="text-xs font-semibold text-[#e8f5e9] truncate block group-hover:text-white transition-colors">
          {player.surname}
        </span>
      </div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import type { Standing } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  standings: Standing[]
}

const FORM_COLORS: Record<string, string> = {
  W: 'bg-green-500',
  D: 'bg-yellow-500',
  L: 'bg-red-500',
}

export function StandingsTable({ standings }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#1e3329]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1e3329] bg-[#111a15]">
            <th className="text-left p-3 text-gray-400 font-medium w-8">#</th>
            <th className="text-left p-3 text-gray-400 font-medium">Club</th>
            <th className="text-center p-3 text-gray-400 font-medium">P</th>
            <th className="text-center p-3 text-gray-400 font-medium">W</th>
            <th className="text-center p-3 text-gray-400 font-medium">D</th>
            <th className="text-center p-3 text-gray-400 font-medium">L</th>
            <th className="text-center p-3 text-gray-400 font-medium">GD</th>
            <th className="text-center p-3 text-gray-400 font-medium">Pts</th>
            <th className="text-center p-3 text-gray-400 font-medium hidden md:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => (
            <tr
              key={s.team.id}
              className={cn(
                'border-b border-[#1e3329] hover:bg-[#0f3d2e]/20 transition-colors',
                idx % 2 === 0 ? 'bg-[#0a0f0d]' : 'bg-[#111a15]/50'
              )}
            >
              <td className="p-3 text-gray-500">{s.rank}</td>
              <td className="p-3">
                <Link
                  href={`/teams/${s.team.id}?league=${s.team.leagueSlug}`}
                  className="flex items-center gap-2 hover:text-[#00ff85] transition-colors"
                >
                  <div className="relative w-6 h-6 shrink-0">
                    <Image src={s.team.crestUrl} alt={s.team.name} fill className="object-contain" unoptimized />
                  </div>
                  <span className="font-medium">{s.team.name}</span>
                </Link>
              </td>
              <td className="p-3 text-center text-gray-300">{s.played}</td>
              <td className="p-3 text-center text-green-400">{s.won}</td>
              <td className="p-3 text-center text-yellow-400">{s.drawn}</td>
              <td className="p-3 text-center text-red-400">{s.lost}</td>
              <td className={cn('p-3 text-center font-medium', s.goalDifference >= 0 ? 'text-green-400' : 'text-red-400')}>
                {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
              </td>
              <td className="p-3 text-center font-bold">{s.points}</td>
              <td className="p-3 hidden md:table-cell">
                <div className="flex justify-center gap-0.5">
                  {(s.form ?? '').slice(-5).split('').map((l, i) => (
                    <span key={i} className={cn('w-4 h-4 rounded-sm text-white text-xs flex items-center justify-center font-bold', FORM_COLORS[l] ?? 'bg-gray-600')}>
                      {l}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

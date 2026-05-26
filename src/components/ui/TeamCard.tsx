import Link from 'next/link'
import Image from 'next/image'
import type { Standing } from '@/types'
import { FormationBadge } from './FormationBadge'
import { cn } from '@/lib/utils'

interface Props {
  standing: Standing
  formation?: string
  className?: string
}

const FORM_COLORS: Record<string, string> = {
  W: 'bg-green-500',
  D: 'bg-yellow-500',
  L: 'bg-red-500',
}

export function TeamCard({ standing, formation, className }: Props) {
  const formLetters = (standing.form ?? '').slice(-5).split('')

  return (
    <Link
      href={`/teams/${standing.team.id}?league=${standing.team.leagueSlug}`}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-[#1e3329] bg-[#111a15]',
        'hover:border-[#00ff85]/40 hover:bg-[#0f3d2e]/20 transition-all',
        className
      )}
    >
      <span className="text-gray-500 text-sm w-5 text-right shrink-0">{standing.rank}</span>
      <div className="relative w-8 h-8 shrink-0">
        <Image
          src={standing.team.crestUrl}
          alt={standing.team.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{standing.team.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {formLetters.map((letter, i) => (
            <span
              key={i}
              className={cn('w-3 h-3 rounded-full', FORM_COLORS[letter] ?? 'bg-gray-600')}
              title={letter}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {formation && <FormationBadge formation={formation} />}
        <span className="text-sm font-bold text-[#e8f5e9]">{standing.points}pts</span>
      </div>
    </Link>
  )
}

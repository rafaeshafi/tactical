import Link from 'next/link'
import type { LeagueMeta } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  league: LeagueMeta
  topFormation?: string
  className?: string
}

export function LeagueCard({ league, topFormation, className }: Props) {
  return (
    <Link
      href={`/leagues/${league.slug}`}
      className={cn(
        'block p-6 rounded-xl border border-[#1e3329] bg-[#111a15]',
        'hover:border-[#00ff85]/50 hover:bg-[#0f3d2e]/30 transition-all duration-200',
        'group cursor-pointer',
        className
      )}
    >
      <div className="text-4xl mb-3">{league.flagEmoji}</div>
      <h3 className="font-bold text-lg group-hover:text-[#00ff85] transition-colors">
        {league.name}
      </h3>
      <p className="text-sm text-gray-400 mt-1">{league.country}</p>
      {topFormation && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Top formation</span>
          <span className="text-xs font-mono text-[#00ff85] bg-[#0f3d2e] px-2 py-0.5 rounded">
            {topFormation}
          </span>
        </div>
      )}
      <div className="mt-4 text-xs text-[#00ff85]/60 font-medium group-hover:text-[#00ff85] transition-colors">
        View tactical breakdown →
      </div>
    </Link>
  )
}

import Link from 'next/link'
import type { LeagueMeta } from '@/types'
import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'

interface Props {
  league: LeagueMeta
  topFormation?: string
  className?: string
  index?: number
}

/** Per-league hover accent colour */
const LEAGUE_ACCENT: Record<string, { glow: string; line: string }> = {
  'premier-league': { glow: 'rgba(108,38,188,0.22)', line: 'rgba(108,38,188,0.55)' },
  'la-liga':        { glow: 'rgba(200,16,46,0.18)',  line: 'rgba(200,16,46,0.50)'  },
  'bundesliga':     { glow: 'rgba(210,5,21,0.18)',   line: 'rgba(210,5,21,0.50)'   },
  'serie-a':        { glow: 'rgba(2,68,148,0.18)',   line: 'rgba(2,68,148,0.50)'   },
  'ligue-1':        { glow: 'rgba(0,50,210,0.18)',   line: 'rgba(0,50,210,0.50)'   },
}

export function LeagueCard({ league, topFormation, className, index = 0 }: Props) {
  const accent = LEAGUE_ACCENT[league.slug] ?? { glow: 'rgba(0,255,133,0.15)', line: 'rgba(0,255,133,0.5)' }

  return (
    <Link
      href={`/leagues/${league.slug}`}
      className={cn(
        'shimmer-card relative block p-6 rounded-2xl border border-[#1a2e22] bg-[#0d1810]',
        'hover:border-[#00ff85]/35 transition-all duration-300 overflow-hidden',
        'group cursor-pointer animate-slide-up',
        className
      )}
      style={{ animationDelay: `${index * 0.07}s` } as CSSProperties}
    >
      {/* League-tinted radial glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 110%, ${accent.glow}, transparent 65%)` }}
      />

      {/* Coloured top-edge accent line on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accent.line}, transparent)` }}
      />

      <div className="relative z-10">
        {/* Flag */}
        <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
          {league.flagEmoji}
        </div>

        <h3 className="font-bold text-lg leading-tight group-hover:text-[#00ff85] transition-colors duration-200">
          {league.name}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{league.country}</p>

        {topFormation && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0f3d2e]/60 border border-[#00ff85]/15">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Formation</span>
            <span className="text-xs font-mono font-bold text-[#00ff85]">{topFormation}</span>
          </div>
        )}

        <div className="mt-5 flex items-center gap-1.5 text-xs text-[#00ff85]/40 font-medium group-hover:text-[#00ff85] transition-all duration-200">
          <span>Tactical breakdown</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
        </div>
      </div>
    </Link>
  )
}

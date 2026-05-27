'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LEAGUES } from '@/types'
import { cn } from '@/lib/utils'

export function NavHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[#1a2e22]/60 bg-[#060d09]/90 backdrop-blur-xl">
      {/* Thin gradient accent line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff85]/35 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#00ff85]/8 border border-[#00ff85]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#00ff85]/16 group-hover:border-[#00ff85]/45 group-hover:shadow-[0_0_18px_rgba(0,255,133,0.25)]">
            {/* Simple football icon */}
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="#00ff85" strokeWidth="1.2" opacity="0.5" />
              <circle cx="10" cy="10" r="3" fill="#00ff85" opacity="0.9" />
              <line x1="10" y1="1.5" x2="10" y2="18.5" stroke="#00ff85" strokeWidth="0.8" opacity="0.35" />
              <line x1="1.5" y1="10" x2="18.5" y2="10" stroke="#00ff85" strokeWidth="0.8" opacity="0.35" />
            </svg>
          </div>
          <span className="font-black text-xl tracking-tighter gradient-text">
            Tactica<span className="text-[#e8f5e9]">L</span>
          </span>
        </Link>

        {/* League navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0">
          {LEAGUES.map(league => {
            const isActive = pathname.startsWith(`/leagues/${league.slug}`)
            return (
              <Link
                key={league.slug}
                href={`/leagues/${league.slug}`}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 border',
                  isActive
                    ? 'bg-[#00ff85]/10 text-[#00ff85] border-[#00ff85]/20 shadow-[0_0_10px_rgba(0,255,133,0.1)]'
                    : 'text-gray-400 border-transparent hover:text-[#e8f5e9] hover:bg-[#0d1810] hover:border-[#1a2e22]'
                )}
              >
                <span className="text-base leading-none">{league.flagEmoji}</span>
                <span className="hidden md:inline">{league.name}</span>
                <span className="inline md:hidden text-xs">{league.country.slice(0, 3)}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

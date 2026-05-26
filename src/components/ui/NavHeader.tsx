'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LEAGUES } from '@/types'
import { cn } from '@/lib/utils'

export function NavHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e3329] bg-[#0a0f0d]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-[#00ff85] tracking-tight">
          TacticaL
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {LEAGUES.map(league => (
            <Link
              key={league.slug}
              href={`/leagues/${league.slug}`}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-colors',
                pathname.startsWith(`/leagues/${league.slug}`)
                  ? 'bg-[#0f3d2e] text-[#00ff85]'
                  : 'text-gray-400 hover:text-[#e8f5e9] hover:bg-[#111a15]'
              )}
            >
              {league.flagEmoji} {league.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Overview',       href: '',               icon: '⊞' },
  { label: 'Tactics',        href: '/tactics',        icon: '⚡' },
  { label: 'Set Pieces',     href: '/set-pieces',     icon: '🎯' },
  { label: 'Manager',        href: '/manager',        icon: '🧠' },
  { label: 'Tactics Board',  href: '/tactics-board',  icon: '✏' },
  { label: 'FPL',            href: '/fpl',            icon: '💎' },
]

interface Props { teamId: string }

export function TeamHubNav({ teamId }: Props) {
  const pathname   = usePathname()
  const searchParams = useSearchParams()
  const league     = searchParams.get('league') ?? ''
  const leagueParam = league ? `?league=${league}` : ''
  const base       = `/teams/${teamId}`

  return (
    <nav className="flex gap-0.5 overflow-x-auto scrollbar-hide -mb-px border-b border-[#1a2e22]">
      {TABS.map(tab => {
        const href     = `${base}${tab.href}${leagueParam}`
        const isActive = tab.href === ''
          ? pathname === base
          : pathname.startsWith(`${base}${tab.href}`)

        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap',
              'border-b-2 transition-all duration-200',
              isActive
                ? 'border-[#00ff85] text-[#00ff85] bg-[#00ff85]/5'
                : 'border-transparent text-gray-400 hover:text-[#e8f5e9] hover:bg-[#0d1810] hover:border-[#1a2e22]'
            )}
          >
            <span className="text-base leading-none" aria-hidden>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

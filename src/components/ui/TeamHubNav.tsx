'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Overview', href: '' },
  { label: 'Tactics', href: '/tactics' },
  { label: 'Set Pieces', href: '/set-pieces' },
  { label: 'Manager', href: '/manager' },
  { label: 'Tactics Board', href: '/tactics-board' },
  { label: 'FPL', href: '/fpl' },
]

interface Props {
  teamId: string
}

export function TeamHubNav({ teamId }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const league = searchParams.get('league') ?? ''
  const leagueParam = league ? `?league=${league}` : ''
  const base = `/teams/${teamId}`

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-[#1e3329] pb-0 -mb-px">
      {TABS.map(tab => {
        const href = `${base}${tab.href}${leagueParam}`
        const isActive = tab.href === ''
          ? pathname === base
          : pathname.startsWith(`${base}${tab.href}`)

        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              isActive
                ? 'border-[#00ff85] text-[#00ff85]'
                : 'border-transparent text-gray-400 hover:text-[#e8f5e9] hover:border-[#1e3329]'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

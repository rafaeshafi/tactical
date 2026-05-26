'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Standing } from '@/types'

interface Props {
  standings: { leagueSlug: string; entries: Standing[] }[]
}

export function SearchBar({ standings }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ team: Standing['team']; leagueSlug: string }[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    const q = query.toLowerCase()
    const matches = standings.flatMap(({ leagueSlug, entries }) =>
      entries
        .filter(s => s.team.name.toLowerCase().includes(q))
        .map(s => ({ team: s.team, leagueSlug }))
    ).slice(0, 8)
    setResults(matches)
    setOpen(matches.length > 0)
  }, [query, standings])

  function handleSelect(team: Standing['team'], leagueSlug: string) {
    setQuery('')
    setOpen(false)
    router.push(`/teams/${team.id}?league=${leagueSlug}`)
  }

  return (
    <div className="relative max-w-sm w-full">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search any team..."
        className="w-full px-4 py-2 rounded-lg bg-[#111a15] border border-[#1e3329] text-sm text-[#e8f5e9] placeholder-gray-500 focus:outline-none focus:border-[#00ff85]/50 transition-colors"
      />
      {open && (
        <ul className="absolute top-full mt-1 w-full bg-[#111a15] border border-[#1e3329] rounded-lg overflow-hidden shadow-xl z-50">
          {results.map(({ team, leagueSlug }) => (
            <li key={`${team.id}-${leagueSlug}`}>
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-[#e8f5e9] hover:bg-[#0f3d2e] transition-colors flex items-center gap-2"
                onMouseDown={() => handleSelect(team, leagueSlug)}
              >
                <span className="flex-1">{team.name}</span>
                <span className="text-xs text-gray-500">{leagueSlug.replace(/-/g, ' ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

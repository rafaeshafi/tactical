'use client'

interface StatRow {
  label: string
  home: number
  away: number
  unit?: string
}

interface Props {
  homeTeam: string
  awayTeam: string
  stats: StatRow[]
}

export function StatComparison({ homeTeam, awayTeam, stats }: Props) {
  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="text-[#00ff85]">{homeTeam}</span>
        <span className="text-gray-400 text-xs uppercase tracking-wider">Stats</span>
        <span className="text-blue-400">{awayTeam}</span>
      </div>

      <div className="space-y-3">
        {stats.map((row) => {
          const total = Math.max(row.home + row.away, 0.01)
          const homePct = (row.home / total) * 100

          return (
            <div key={row.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#00ff85]">
                  {row.home}{row.unit ?? ''}
                </span>
                <span className="text-gray-400">{row.label}</span>
                <span className="font-mono font-bold text-blue-400">
                  {row.away}{row.unit ?? ''}
                </span>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-[#1e3329]">
                <div
                  className="bg-[#00ff85] transition-all"
                  style={{ width: `${homePct}%` }}
                />
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${100 - homePct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

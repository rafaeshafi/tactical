'use client'
import { COMMON_FORMATIONS } from '@/lib/tactics/formations'
import { cn } from '@/lib/utils'

interface Props {
  current: string
  onChange: (formation: string) => void
}

export function FormationPresets({ current, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COMMON_FORMATIONS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all',
            f === current
              ? 'bg-[#00ff85] text-black'
              : 'bg-[#111a15] border border-[#1e3329] text-gray-400 hover:border-[#00ff85]/40 hover:text-[#e8f5e9]'
          )}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

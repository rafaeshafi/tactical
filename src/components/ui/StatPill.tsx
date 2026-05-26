import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string | number
  highlight?: boolean
  className?: string
}

export function StatPill({ label, value, highlight = false, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center px-3 py-2 rounded-lg border',
        highlight
          ? 'bg-[#0f3d2e] border-[#00ff85]/40 text-[#00ff85]'
          : 'bg-[#111a15] border-[#1e3329] text-[#e8f5e9]',
        className
      )}
    >
      <span className="text-lg font-bold font-mono">{value}</span>
      <span className="text-xs text-gray-400 mt-0.5">{label}</span>
    </div>
  )
}

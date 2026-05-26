import { cn } from '@/lib/utils'

interface Props {
  formation: string
  className?: string
}

export function FormationBadge({ formation, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold',
        'bg-[#0f3d2e] text-[#00ff85] border border-[#00ff85]/30',
        className
      )}
    >
      {formation}
    </span>
  )
}

import { cn } from '@/lib/utils'

interface Props {
  position: string
  role: string
  recommendation: 'Essential' | 'Good Pick' | 'Differential' | 'Avoid'
  reason: string
  rotationRisk: 'Low' | 'Medium' | 'High'
}

const RECOMMENDATION_STYLES: Record<Props['recommendation'], string> = {
  'Essential': 'bg-green-500/20 border-green-500/50 text-green-400',
  'Good Pick': 'bg-[#00ff85]/10 border-[#00ff85]/30 text-[#00ff85]',
  'Differential': 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  'Avoid': 'bg-red-500/20 border-red-500/50 text-red-400',
}

const ROTATION_COLORS: Record<Props['rotationRisk'], string> = {
  Low: 'text-green-400',
  Medium: 'text-yellow-400',
  High: 'text-red-400',
}

export function FplInsightCard({ position, role, recommendation, reason, rotationRisk }: Props) {
  return (
    <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-[#e8f5e9]">{position}</p>
          <p className="text-xs text-gray-400 mt-0.5">{role}</p>
        </div>
        <span className={cn('text-xs px-2 py-0.5 rounded-full border font-semibold', RECOMMENDATION_STYLES[recommendation])}>
          {recommendation}
        </span>
      </div>
      <p className="text-sm text-gray-300">{reason}</p>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-gray-500">Rotation risk:</span>
        <span className={cn('font-semibold', ROTATION_COLORS[rotationRisk])}>{rotationRisk}</span>
      </div>
    </div>
  )
}

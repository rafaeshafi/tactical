import type { ManagerProfile } from '@/lib/ai/manager-profile'
import { FormationBadge } from '@/components/ui/FormationBadge'

interface Props {
  profile: ManagerProfile
}

export function CareerTimeline({ profile }: Props) {
  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Career History</h3>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-[#1e3329]" />
        <ul className="space-y-5 pl-8">
          {profile.careerHistory.map((job, i) => (
            <li key={i} className="relative">
              <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-[#00ff85] border-2 border-[#0a0f0d]" />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#e8f5e9] text-sm">{job.club}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.years}</p>
                  {job.achievement && (
                    <p className="text-xs text-[#00ff85]/70 mt-0.5">{job.achievement}</p>
                  )}
                </div>
                <FormationBadge formation={job.formation} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

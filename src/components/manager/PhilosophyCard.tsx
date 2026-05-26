import type { ManagerProfile } from '@/lib/ai/manager-profile'
import { FormationBadge } from '@/components/ui/FormationBadge'

interface Props {
  profile: ManagerProfile
}

export function PhilosophyCard({ profile }: Props) {
  return (
    <div className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-5">
      {/* Manager header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#e8f5e9]">{profile.managerName}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{profile.nationality} · Age {profile.age}</p>
        </div>
        <FormationBadge formation={profile.primaryFormation} className="text-sm" />
      </div>

      {/* Philosophy summary */}
      <blockquote className="border-l-2 border-[#00ff85] pl-4 text-sm text-gray-300 italic leading-relaxed">
        {profile.philosophySummary}
      </blockquote>

      {/* Tactical pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Press Style', value: profile.pressStyle },
          { label: 'Build-Up', value: profile.buildUpStyle },
          { label: 'Defence', value: profile.defensiveApproach },
        ].map(item => (
          <div key={item.label} className="p-3 rounded-lg bg-[#0a0f0d] border border-[#1e3329]">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-sm text-[#e8f5e9]">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Key principles */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Principles</h3>
        <ul className="space-y-2">
          {profile.keyPrinciples.map((principle, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-[#00ff85] font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-gray-300">{principle}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Coaching influences */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Coaching Influences</h3>
        <div className="flex flex-wrap gap-2">
          {profile.coachingInfluences.map((influence, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#0f3d2e] border border-[#00ff85]/20 text-[#00ff85]/80">
              {influence}
            </span>
          ))}
        </div>
      </div>

      {/* Tactical innovations */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tactical Innovations</h3>
        <ul className="space-y-1">
          {profile.tacticalInnovations.map((innovation, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-[#00ff85] mt-0.5">→</span>
              {innovation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

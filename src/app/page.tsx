import { LEAGUES } from '@/types'
import { LeagueCard } from '@/components/ui/LeagueCard'

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="py-12 text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="text-[#00ff85]">Tactical</span> Intelligence
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Deep formation analysis, pressing maps, pass networks and manager philosophies for every team across Europe&apos;s top 5 leagues.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {['Formations', 'Press Maps', 'Pass Networks', 'Set Pieces', 'Manager DNA', 'FPL Insights'].map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full border border-[#1e3329] text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* League Selector */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Choose a League
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {LEAGUES.map(league => (
            <LeagueCard key={league.slug} league={league} />
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
        {[
          {
            icon: '⚽',
            title: 'Tactics First',
            desc: 'Formation breakdowns, pressing intensity, defensive shape, build-up patterns — not just scores and standings.',
          },
          {
            icon: '🎨',
            title: 'Your Tactics Board',
            desc: 'Drag players around, draw arrows, set your own shape. Each team has a customisable board saved to your browser.',
          },
          {
            icon: '🧠',
            title: 'Manager DNA',
            desc: 'AI-powered deep dives into each manager\'s philosophy, coaching lineage, and tactical innovations.',
          },
        ].map(item => (
          <div key={item.title} className="p-6 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-2">
            <div className="text-3xl">{item.icon}</div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

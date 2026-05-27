'use client'
import { useState, useEffect } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'

interface RadarDataPoint {
  metric: string
  team: number
  leagueAvg: number
}

interface Props {
  teamName: string
  data: RadarDataPoint[]
}

export function TacticalRadar({ teamName, data }: Props) {
  // Recharts calls ResizeObserver during render — skip SSR entirely
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] h-[300px] animate-pulse" />
    )
  }

  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15]">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tactical Profile</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#1e3329" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#4b5563', fontSize: 9 }}
            tickCount={4}
          />
          <Radar
            name="League Avg"
            dataKey="leagueAvg"
            stroke="#4b5563"
            fill="#4b5563"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Radar
            name={teamName}
            dataKey="team"
            stroke="#00ff85"
            fill="#00ff85"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 8 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function buildRadarData(
  stats: { goalsFor: number; goalsAgainst: number; passAccuracy: number; wins: number; fixturesPlayed: number },
  ppda: number
): RadarDataPoint[] {
  const played = Math.max(stats.fixturesPlayed, 1)
  return [
    { metric: 'Pressing', team: Math.round(Math.max(0, 100 - ppda * 4)), leagueAvg: 50 },
    { metric: 'Attack', team: Math.min(100, Math.round((stats.goalsFor / played) * 35)), leagueAvg: 50 },
    { metric: 'Defence', team: Math.min(100, Math.round((1 - stats.goalsAgainst / played / 3) * 100)), leagueAvg: 50 },
    { metric: 'Passing', team: Math.min(100, Math.round(stats.passAccuracy)), leagueAvg: 78 },
    { metric: 'Form', team: Math.round((stats.wins / played) * 100), leagueAvg: 50 },
    { metric: 'Set Pieces', team: 60, leagueAvg: 50 },
  ]
}

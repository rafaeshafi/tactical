import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

export interface ManagerProfile {
  teamId: number
  teamName: string
  managerName: string
  nationality: string
  age: number
  primaryFormation: string
  philosophySummary: string
  pressStyle: string
  buildUpStyle: string
  defensiveApproach: string
  keyPrinciples: string[]
  careerHistory: {
    club: string
    years: string
    formation: string
    achievement?: string
  }[]
  coachingInfluences: string[]
  tacticalInnovations: string[]
  fplImplications: string
  generatedAt: string
}

const CACHE_DIR = path.join(process.cwd(), 'data', 'managers')

function getCachePath(teamId: number): string {
  return path.join(CACHE_DIR, `${teamId}.json`)
}

function isStale(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath)
    const ageMs = Date.now() - stat.mtimeMs
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    return ageMs > thirtyDaysMs
  } catch {
    return true
  }
}

export async function getManagerProfile(teamId: number, teamName: string): Promise<ManagerProfile> {
  const cachePath = getCachePath(teamId)

  if (fs.existsSync(cachePath) && !isStale(cachePath)) {
    const cached = fs.readFileSync(cachePath, 'utf-8')
    return JSON.parse(cached) as ManagerProfile
  }

  const profile = await generateManagerProfile(teamId, teamName)

  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.writeFileSync(cachePath, JSON.stringify(profile, null, 2))

  return profile
}

async function generateManagerProfile(teamId: number, teamName: string): Promise<ManagerProfile> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `You are a world-class football tactical analyst. Provide a detailed tactical profile for the current manager of ${teamName}.

Return ONLY valid JSON matching this exact structure — no markdown, no explanation, just JSON:
{
  "teamId": ${teamId},
  "teamName": "${teamName}",
  "managerName": "Full Name",
  "nationality": "Country",
  "age": 0,
  "primaryFormation": "4-3-3",
  "philosophySummary": "2-3 sentence tactical philosophy summary",
  "pressStyle": "High Press / Mid Block / Low Block with brief explanation",
  "buildUpStyle": "How they build from the back — short passing / direct / positional / etc",
  "defensiveApproach": "Defensive line height, compactness, man-marking vs zonal",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3", "Principle 4", "Principle 5"],
  "careerHistory": [
    { "club": "Club Name", "years": "2018-2021", "formation": "4-3-3", "achievement": "Optional trophy or notable result" }
  ],
  "coachingInfluences": ["Manager 1 — reason", "Manager 2 — reason"],
  "tacticalInnovations": ["Innovation 1", "Innovation 2"],
  "fplImplications": "Which positions are most valuable in their system and why — 2 sentences for FPL managers",
  "generatedAt": "${new Date().toISOString()}"
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude did not return valid JSON')

  return JSON.parse(jsonMatch[0]) as ManagerProfile
}

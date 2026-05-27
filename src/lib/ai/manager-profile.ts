import Anthropic from '@anthropic-ai/sdk'

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

// In-process cache (survives within a single serverless invocation warm pool)
const memCache = new Map<number, { profile: ManagerProfile; ts: number }>()
const TTL_MS = 60 * 60 * 1000 // 1 hour

export async function getManagerProfile(teamId: number, teamName: string): Promise<ManagerProfile> {
  const hit = memCache.get(teamId)
  if (hit && Date.now() - hit.ts < TTL_MS) return hit.profile

  const profile = await generateManagerProfile(teamId, teamName)
  memCache.set(teamId, { profile, ts: Date.now() })
  return profile
}

async function generateManagerProfile(teamId: number, teamName: string): Promise<ManagerProfile> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const client = new Anthropic({ apiKey })

  const prompt = `You are a world-class football tactical analyst. Provide a detailed tactical profile for the current manager of ${teamName} in the 2025/26 season.

Return ONLY valid JSON matching this exact structure — no markdown, no code fences, no explanation, just raw JSON:
{
  "teamId": ${teamId},
  "teamName": "${teamName}",
  "managerName": "Full Name",
  "nationality": "Country",
  "age": 0,
  "primaryFormation": "4-3-3",
  "philosophySummary": "2-3 sentence tactical philosophy summary",
  "pressStyle": "Brief description of pressing approach",
  "buildUpStyle": "How they build from the back",
  "defensiveApproach": "Defensive shape, line height, marking system",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3", "Principle 4", "Principle 5"],
  "careerHistory": [
    { "club": "Club Name", "years": "2018-2021", "formation": "4-3-3", "achievement": "Trophy or notable result" }
  ],
  "coachingInfluences": ["Manager 1 — reason", "Manager 2 — reason"],
  "tacticalInnovations": ["Innovation 1", "Innovation 2"],
  "fplImplications": "2 sentences for FPL managers on which positions are most valuable in their system",
  "generatedAt": "${new Date().toISOString()}"
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI did not return valid JSON')

  return JSON.parse(jsonMatch[0]) as ManagerProfile
}

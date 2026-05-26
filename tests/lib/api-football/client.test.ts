// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchStandings, fetchTeamStatistics } from '@/lib/api-football/client'

describe('API-Football client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    process.env.API_FOOTBALL_KEY = 'test-key'
  })

  afterEach(() => {
    delete process.env.API_FOOTBALL_KEY
  })

  it('fetchStandings calls correct endpoint with API key header', async () => {
    const mockResponse = {
      response: [{ league: { standings: [[{ rank: 1, team: { id: 33, name: 'Manchester United', logo: 'https://example.com/logo.png' }, points: 60, all: { played: 30, win: 18, draw: 6, lose: 6, goals: { for: 50, against: 30 } }, goalsDiff: 20, form: 'WWDLW' }]] } }]
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await fetchStandings(39, 2024)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('standings'),
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-rapidapi-key': 'test-key' }),
      })
    )
    expect(result).toHaveLength(1)
    expect(result[0].rank).toBe(1)
  })

  it('fetchStandings throws on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({}),
    } as Response)

    await expect(fetchStandings(39, 2024)).rejects.toThrow('API-Football error: 429')
  })

  it('throws when API_FOOTBALL_KEY is not set', async () => {
    delete process.env.API_FOOTBALL_KEY
    await expect(fetchStandings(39, 2024)).rejects.toThrow('API_FOOTBALL_KEY is not set')
  })
})

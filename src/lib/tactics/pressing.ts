export interface PressZone {
  x: number
  y: number
  intensity: number
  label: string
}

export interface PressingData {
  zones: PressZone[]
  ppda: number
  pressStyle: 'High Press' | 'Mid Block' | 'Low Block'
  recoveryZone: 'High Third' | 'Middle Third' | 'Own Half'
}

export function computePressingProfile(
  defensiveActions: { x: number; y: number }[],
  passesAllowed: number,
  defensiveActionsCount: number
): PressingData {
  const ppda = passesAllowed / Math.max(defensiveActionsCount, 1)
  const pressStyle: PressingData['pressStyle'] =
    ppda < 7 ? 'High Press' : ppda < 12 ? 'Mid Block' : 'Low Block'

  const highThirdActions = defensiveActions.filter(a => a.y < 33).length
  const midThirdActions = defensiveActions.filter(a => a.y >= 33 && a.y < 66).length
  const lowThirdActions = defensiveActions.filter(a => a.y >= 66).length
  const total = defensiveActions.length || 1

  const zones: PressZone[] = [
    { x: 50, y: 16, intensity: highThirdActions / total, label: 'High Press Zone' },
    { x: 50, y: 50, intensity: midThirdActions / total, label: 'Mid Press Zone' },
    { x: 50, y: 83, intensity: lowThirdActions / total, label: 'Defensive Zone' },
  ]

  const dominantIdx = [highThirdActions, midThirdActions, lowThirdActions].indexOf(
    Math.max(highThirdActions, midThirdActions, lowThirdActions)
  )
  const recoveryZone: PressingData['recoveryZone'] =
    dominantIdx === 0 ? 'High Third' : dominantIdx === 1 ? 'Middle Third' : 'Own Half'

  return { zones, ppda: Math.round(ppda * 10) / 10, pressStyle, recoveryZone }
}

export function generateMockPressingData(teamStyle: 'aggressive' | 'balanced' | 'defensive'): PressingData {
  const configs = {
    aggressive: { ppda: 5.2, style: 'High Press' as const, recovery: 'High Third' as const },
    balanced: { ppda: 9.8, style: 'Mid Block' as const, recovery: 'Middle Third' as const },
    defensive: { ppda: 15.1, style: 'Low Block' as const, recovery: 'Own Half' as const },
  }
  const cfg = configs[teamStyle]
  return {
    ppda: cfg.ppda,
    pressStyle: cfg.style,
    recoveryZone: cfg.recovery,
    zones: [
      { x: 50, y: 16, intensity: teamStyle === 'aggressive' ? 0.7 : 0.2, label: 'High Press' },
      { x: 50, y: 50, intensity: teamStyle === 'balanced' ? 0.65 : 0.3, label: 'Mid Block' },
      { x: 50, y: 83, intensity: teamStyle === 'defensive' ? 0.8 : 0.2, label: 'Defensive' },
    ],
  }
}

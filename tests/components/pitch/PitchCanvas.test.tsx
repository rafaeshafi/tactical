import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PitchCanvas } from '@/components/pitch/PitchCanvas'

describe('PitchCanvas', () => {
  it('renders an SVG element', () => {
    const { container } = render(<PitchCanvas width={400} height={560} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('applies correct viewBox', () => {
    const { container } = render(<PitchCanvas width={400} height={560} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 400 560')
  })

  it('renders pitch outline rect', () => {
    const { container } = render(<PitchCanvas width={400} height={560} />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBeGreaterThan(0)
  })
})

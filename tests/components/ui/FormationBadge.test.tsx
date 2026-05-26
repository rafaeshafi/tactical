import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormationBadge } from '@/components/ui/FormationBadge'

describe('FormationBadge', () => {
  it('renders formation string', () => {
    render(<FormationBadge formation="4-3-3" />)
    expect(screen.getByText('4-3-3')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<FormationBadge formation="3-5-2" className="test-class" />)
    expect(container.firstChild).toHaveClass('test-class')
  })
})

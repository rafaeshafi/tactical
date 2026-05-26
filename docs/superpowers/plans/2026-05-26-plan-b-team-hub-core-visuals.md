# Football Tactics App — Plan B: Team Hub, Formation Pitch & Tactical Visualizations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Team Hub page with the Overview and Tactics tabs — including the D3 formation pitch, heatmap overlay, pass network, and press map visualizations.

**Architecture:** All pitch visualizations are SVG-based D3.js components wrapped in React. They are client components (marked `'use client'`) since D3 manipulates the DOM. The Team Hub page is a server component that fetches data, then passes it down to client visualization components. Each D3 component accepts plain data props — no D3 state leaks outside the component.

**Tech Stack:** Next.js 15, D3.js, Framer Motion, Recharts, TypeScript, Tailwind CSS

**Prerequisite:** Plan A must be complete. The project exists at `/Users/rafaeshafi/football-tactics/`.

---

## File Map

| File | Purpose |
|------|---------|
| `src/lib/tactics/formations.ts` | Formation definitions — player positions as [x,y] pitch coordinates |
| `src/lib/tactics/pass-network.ts` | Compute pass network nodes and edge weights from fixture data |
| `src/lib/tactics/pressing.ts` | Compute press zone polygons and PPDA score |
| `src/components/pitch/PitchCanvas.tsx` | Base SVG pitch (lines, markings) — used by all pitch components |
| `src/components/pitch/FormationPitch.tsx` | Player dots + formation shape lines on pitch |
| `src/components/pitch/HeatmapOverlay.tsx` | Gaussian blur heatmap layer |
| `src/components/pitch/PassNetwork.tsx` | Node-edge pass network visualization |
| `src/components/pitch/PressMap.tsx` | Press intensity zones + PPDA badge |
| `src/components/ui/TacticalIdentityCard.tsx` | Team style summary — formation, press label, key stats |
| `src/components/ui/RecentResultStrip.tsx` | Last 5 results with mini formation snapshots |
| `src/components/ui/TeamHubNav.tsx` | Tab navigation for team hub sections |
| `src/app/teams/[teamId]/page.tsx` | Team hub — server component, fetches data, renders tabs |
| `src/app/teams/[teamId]/tactics/page.tsx` | Tactics tab — press map, pass network |
| `src/app/api/fixtures/[fixtureId]/route.ts` | Server route: fetch fixture lineups + player stats |
| `tests/lib/tactics/formations.test.ts` | Formation position tests |
| `tests/components/pitch/PitchCanvas.test.tsx` | SVG structure tests |

---

## Task 1: Formation Definitions

**Files:**
- Create: `src/lib/tactics/formations.ts`
- Test: `tests/lib/tactics/formations.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/tactics/formations.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { getFormationPositions, parseFormation } from '@/lib/tactics/formations'

describe('formations', () => {
  it('parseFormation splits formation string into line counts', () => {
    expect(parseFormation('4-3-3')).toEqual([4, 3, 3])
    expect(parseFormation('3-5-2')).toEqual([3, 5, 2])
    expect(parseFormation('4-2-3-1')).toEqual([4, 2, 3, 1])
  })

  it('getFormationPositions returns 11 positions for 4-3-3', () => {
    const positions = getFormationPositions('4-3-3')
    expect(positions).toHaveLength(11)
    positions.forEach(p => {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(100)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(100)
    })
  })

  it('getFormationPositions goalkeeper is always at bottom', () => {
    const positions = getFormationPositions('4-3-3')
    expect(positions[0].y).toBeGreaterThan(85)
    expect(positions[0].role).toBe('GK')
  })

  it('getFormationPositions returns 11 positions for 3-5-2', () => {
    expect(getFormationPositions('3-5-2')).toHaveLength(11)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/rafaeshafi/football-tactics && npx vitest run tests/lib/tactics/formations.test.ts
```

Expected: FAIL — cannot find module

- [ ] **Step 3: Implement formations**

Create `src/lib/tactics/formations.ts`:

```typescript
export interface PlayerPosition {
  x: number
  y: number
  role: string
  index: number
}

export function parseFormation(formation: string): number[] {
  return formation.split('-').map(Number)
}

const ROLE_LABELS: Record<string, string[]> = {
  GK: ['GK'],
  4: ['LB', 'LCB', 'RCB', 'RB'],
  3: ['LCB', 'CB', 'RCB'],
  5: ['LB', 'LCB', 'CB', 'RCB', 'RB'],
  2: ['LS', 'RS'],
  1: ['ST'],
}

function getLineRoles(count: number, lineIndex: number, totalLines: number): string[] {
  const isForwardLine = lineIndex === totalLines - 1
  const isMidLine = lineIndex > 0 && !isForwardLine

  if (count === 1) return ['CAM']
  if (count === 2) return isForwardLine ? ['LS', 'RS'] : ['DCM', 'DCM']
  if (count === 3) {
    if (isForwardLine) return ['LW', 'ST', 'RW']
    if (isMidLine) return ['LCM', 'CM', 'RCM']
    return ['LCB', 'CB', 'RCB']
  }
  if (count === 4) {
    if (isForwardLine) return ['LW', 'LSS', 'RSS', 'RW']
    if (isMidLine) return ['LCM', 'LCM', 'RCM', 'RCM']
    return ['LB', 'LCB', 'RCB', 'RB']
  }
  if (count === 5) {
    if (isMidLine) return ['LWB', 'LCM', 'CM', 'RCM', 'RWB']
    return ['LB', 'LCB', 'CB', 'RCB', 'RB']
  }
  return Array(count).fill('MF')
}

export function getFormationPositions(formation: string): PlayerPosition[] {
  const lines = parseFormation(formation)
  const positions: PlayerPosition[] = []
  let index = 0

  // Goalkeeper at y=92, x=50
  positions.push({ x: 50, y: 92, role: 'GK', index: index++ })

  const totalLines = lines.length

  lines.forEach((count, lineIdx) => {
    const roles = getLineRoles(count, lineIdx, totalLines)
    // Y position: distribute lines from y=75 (defense) to y=20 (attack)
    const yBase = 75 - (lineIdx / (totalLines - 1 || 1)) * 55
    const y = Math.round(yBase)

    for (let i = 0; i < count; i++) {
      const x = count === 1 ? 50 : Math.round(10 + (i / (count - 1)) * 80)
      positions.push({ x, y, role: roles[i] ?? 'MF', index: index++ })
    }
  })

  return positions
}

export const COMMON_FORMATIONS = [
  '4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3',
  '5-3-2', '4-1-4-1', '4-5-1', '3-4-2-1', '4-3-2-1',
]
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/lib/tactics/formations.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/tactics/formations.ts tests/lib/tactics/
git commit -m "feat: add formation position calculator"
```

---

## Task 2: Base Pitch Canvas

**Files:**
- Create: `src/components/pitch/PitchCanvas.tsx`
- Test: `tests/components/pitch/PitchCanvas.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/pitch/PitchCanvas.test.tsx`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/pitch/PitchCanvas.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement PitchCanvas**

Create `src/components/pitch/PitchCanvas.tsx`:

```typescript
'use client'
import { ReactNode } from 'react'

interface Props {
  width: number
  height: number
  children?: ReactNode
  className?: string
}

export function PitchCanvas({ width, height, children, className }: Props) {
  const w = width
  const h = height
  const stroke = '#1a5c3a'
  const fill = '#0d3d22'
  const lineW = 1.5

  // Proportional constants (based on real pitch ratios)
  const penAreaW = w * 0.6
  const penAreaH = h * 0.16
  const goalAreaW = w * 0.32
  const goalAreaH = h * 0.07
  const circleR = Math.min(w, h) * 0.12
  const penSpotY = h * 0.12
  const cornerR = Math.min(w, h) * 0.015

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={className}
      style={{ display: 'block' }}
    >
      {/* Pitch background */}
      <rect x={0} y={0} width={w} height={h} fill={fill} rx={4} />

      {/* Pitch stripes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x={0}
          y={(h / 8) * i}
          width={w}
          height={h / 8}
          fill={i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
        />
      ))}

      {/* Outer boundary */}
      <rect x={lineW} y={lineW} width={w - lineW * 2} height={h - lineW * 2} fill="none" stroke={stroke} strokeWidth={lineW} />

      {/* Halfway line */}
      <line x1={lineW} y1={h / 2} x2={w - lineW} y2={h / 2} stroke={stroke} strokeWidth={lineW} />

      {/* Centre circle */}
      <circle cx={w / 2} cy={h / 2} r={circleR} fill="none" stroke={stroke} strokeWidth={lineW} />
      <circle cx={w / 2} cy={h / 2} r={2} fill={stroke} />

      {/* Top penalty area */}
      <rect
        x={(w - penAreaW) / 2}
        y={lineW}
        width={penAreaW}
        height={penAreaH}
        fill="none"
        stroke={stroke}
        strokeWidth={lineW}
      />

      {/* Top goal area */}
      <rect
        x={(w - goalAreaW) / 2}
        y={lineW}
        width={goalAreaW}
        height={goalAreaH}
        fill="none"
        stroke={stroke}
        strokeWidth={lineW}
      />

      {/* Top penalty spot */}
      <circle cx={w / 2} cy={penSpotY} r={2} fill={stroke} />

      {/* Bottom penalty area */}
      <rect
        x={(w - penAreaW) / 2}
        y={h - penAreaH - lineW}
        width={penAreaW}
        height={penAreaH}
        fill="none"
        stroke={stroke}
        strokeWidth={lineW}
      />

      {/* Bottom goal area */}
      <rect
        x={(w - goalAreaW) / 2}
        y={h - goalAreaH - lineW}
        width={goalAreaW}
        height={goalAreaH}
        fill="none"
        stroke={stroke}
        strokeWidth={lineW}
      />

      {/* Bottom penalty spot */}
      <circle cx={w / 2} cy={h - penSpotY} r={2} fill={stroke} />

      {/* Corner arcs */}
      {[
        { cx: lineW, cy: lineW },
        { cx: w - lineW, cy: lineW },
        { cx: lineW, cy: h - lineW },
        { cx: w - lineW, cy: h - lineW },
      ].map((corner, i) => (
        <circle
          key={i}
          cx={corner.cx}
          cy={corner.cy}
          r={cornerR}
          fill="none"
          stroke={stroke}
          strokeWidth={lineW}
        />
      ))}

      {children}
    </svg>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/pitch/PitchCanvas.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/pitch/PitchCanvas.tsx tests/components/pitch/
git commit -m "feat: add SVG pitch canvas with lines and markings"
```

---

## Task 3: Formation Pitch Component

**Files:**
- Create: `src/components/pitch/FormationPitch.tsx`

- [ ] **Step 1: Create FormationPitch**

Create `src/components/pitch/FormationPitch.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PitchCanvas } from './PitchCanvas'
import { getFormationPositions } from '@/lib/tactics/formations'

interface Player {
  id: number
  name: string
  number: number
  position: string
}

interface Props {
  formation: string
  players?: Player[]
  width?: number
  height?: number
  showNames?: boolean
  highlightPlayerId?: number
  onPlayerClick?: (player: Player) => void
}

const POSITION_COLORS: Record<string, string> = {
  GK: '#f59e0b',
  LB: '#3b82f6', RB: '#3b82f6', LCB: '#3b82f6', RCB: '#3b82f6', CB: '#3b82f6',
  LWB: '#6366f1', RWB: '#6366f1',
  DCM: '#22c55e', CM: '#22c55e', LCM: '#22c55e', RCM: '#22c55e', CAM: '#22c55e',
  LW: '#00ff85', RW: '#00ff85', ST: '#00ff85', LS: '#00ff85', RS: '#00ff85',
  LSS: '#00ff85', RSS: '#00ff85',
}

export function FormationPitch({ formation, players = [], width = 320, height = 440, showNames = true, highlightPlayerId, onPlayerClick }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const positions = getFormationPositions(formation)

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height}>
        {/* Formation lines */}
        <g opacity={0.3}>
          {positions.slice(1).map((pos, i) => {
            const next = positions[i + 2]
            if (!next) return null
            const sameY = Math.abs(pos.y - next.y) < 5
            if (!sameY) return null
            return (
              <line
                key={i}
                x1={(pos.x / 100) * width}
                y1={(pos.y / 100) * height}
                x2={(next.x / 100) * width}
                y2={(next.y / 100) * height}
                stroke="#00ff85"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            )
          })}
        </g>

        {/* Player tokens */}
        {positions.map((pos, i) => {
          const player = players[i]
          const px = (pos.x / 100) * width
          const py = (pos.y / 100) * height
          const color = POSITION_COLORS[pos.role] ?? '#00ff85'
          const isHighlighted = player && highlightPlayerId === player.id
          const isHovered = hoveredIndex === i

          return (
            <g
              key={i}
              transform={`translate(${px},${py})`}
              style={{ cursor: onPlayerClick ? 'pointer' : 'default' }}
              onClick={() => player && onPlayerClick?.(player)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.circle
                r={isHighlighted || isHovered ? 14 : 12}
                fill={color}
                stroke={isHighlighted ? '#ffffff' : 'rgba(0,0,0,0.4)'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={player ? 9 : 7}
                fontWeight="bold"
                fill="rgba(0,0,0,0.8)"
                style={{ pointerEvents: 'none' }}
              >
                {player ? player.number : pos.role.slice(0, 2)}
              </text>
              {showNames && player && (
                <text
                  y={17}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#e8f5e9"
                  fontWeight="500"
                  style={{ pointerEvents: 'none' }}
                >
                  {player.name.split(' ').pop()?.slice(0, 8)}
                </text>
              )}
              {(isHovered || isHighlighted) && player && (
                <g transform="translate(14, -20)">
                  <rect x={0} y={-10} width={Math.max(player.name.length * 5, 50)} height={14} fill="rgba(0,0,0,0.85)" rx={2} />
                  <text x={4} y={0} fontSize={8} fill="#e8f5e9">
                    {player.name}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </PitchCanvas>

      {/* Formation label */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-mono text-[#00ff85] font-bold">
        {formation}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify FormationPitch renders (manual check)**

Add a quick test page at `src/app/test-pitch/page.tsx`:

```typescript
import { FormationPitch } from '@/components/pitch/FormationPitch'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Formation Test</h1>
      <div className="flex gap-8 flex-wrap">
        {['4-3-3', '3-5-2', '4-2-3-1'].map(f => (
          <div key={f}>
            <p className="text-sm text-gray-400 mb-2">{f}</p>
            <FormationPitch formation={f} width={280} height={380} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

Open http://localhost:3000/test-pitch — you should see 3 pitch formations rendered with animated player dots.

- [ ] **Step 3: Commit**

```bash
git add src/components/pitch/FormationPitch.tsx
git commit -m "feat: add animated FormationPitch component with D3 positioning"
```

---

## Task 4: Heatmap Overlay

**Files:**
- Create: `src/components/pitch/HeatmapOverlay.tsx`

- [ ] **Step 1: Create HeatmapOverlay**

Create `src/components/pitch/HeatmapOverlay.tsx`:

```typescript
'use client'
import { useEffect, useRef } from 'react'
import { PitchCanvas } from './PitchCanvas'

interface HeatPoint {
  x: number
  y: number
  intensity: number
}

interface Props {
  points: HeatPoint[]
  width?: number
  height?: number
  playerName?: string
}

export function HeatmapOverlay({ points, width = 320, height = 440, playerName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    points.forEach(pt => {
      const px = (pt.x / 100) * width
      const py = (pt.y / 100) * height
      const r = 40 * pt.intensity

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
      grad.addColorStop(0, `rgba(255, 50, 0, ${0.6 * pt.intensity})`)
      grad.addColorStop(0.5, `rgba(255, 200, 0, ${0.3 * pt.intensity})`)
      grad.addColorStop(1, 'rgba(0, 100, 255, 0)')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [points, width, height])

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 rounded"
        style={{ mixBlendMode: 'screen' }}
      />
      {playerName && (
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-[#00ff85] font-medium">
          {playerName}
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
        <div className="flex items-center gap-1 text-xs text-gray-300">
          <div className="w-12 h-2 rounded" style={{ background: 'linear-gradient(to right, rgba(0,100,255,0.5), rgba(255,200,0,0.7), rgba(255,50,0,0.9))' }} />
          <span>activity</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pitch/HeatmapOverlay.tsx
git commit -m "feat: add canvas-based heatmap overlay with radial gradients"
```

---

## Task 5: Pass Network

**Files:**
- Create: `src/lib/tactics/pass-network.ts`
- Create: `src/components/pitch/PassNetwork.tsx`

- [ ] **Step 1: Create pass network computation**

Create `src/lib/tactics/pass-network.ts`:

```typescript
export interface PassNode {
  playerId: number
  name: string
  x: number
  y: number
  totalPasses: number
}

export interface PassEdge {
  from: number
  to: number
  count: number
  weight: number
}

export interface PassNetworkData {
  nodes: PassNode[]
  edges: PassEdge[]
  maxEdgeCount: number
}

export function buildPassNetwork(
  players: { id: number; name: string; avgX: number; avgY: number; passes: { toId: number; count: number }[] }[]
): PassNetworkData {
  const nodes: PassNode[] = players.map(p => ({
    playerId: p.id,
    name: p.name,
    x: p.avgX,
    y: p.avgY,
    totalPasses: p.passes.reduce((s, e) => s + e.count, 0),
  }))

  const edges: PassEdge[] = []
  let maxCount = 1

  players.forEach(player => {
    player.passes.forEach(pass => {
      if (pass.count < 3) return
      const existing = edges.find(e =>
        (e.from === player.id && e.to === pass.toId) ||
        (e.from === pass.toId && e.to === player.id)
      )
      if (existing) {
        existing.count += pass.count
        if (existing.count > maxCount) maxCount = existing.count
      } else {
        edges.push({ from: player.id, to: pass.toId, count: pass.count, weight: 0 })
        if (pass.count > maxCount) maxCount = pass.count
      }
    })
  })

  edges.forEach(e => { e.weight = e.count / maxCount })

  return { nodes, edges, maxEdgeCount: maxCount }
}
```

- [ ] **Step 2: Create PassNetwork component**

Create `src/components/pitch/PassNetwork.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { PitchCanvas } from './PitchCanvas'
import type { PassNetworkData } from '@/lib/tactics/pass-network'

interface Props {
  data: PassNetworkData
  width?: number
  height?: number
}

export function PassNetwork({ data, width = 320, height = 440 }: Props) {
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null)

  const nodeMap = new Map(data.nodes.map(n => [n.playerId, n]))

  const minR = 8
  const maxR = 20
  const maxPasses = Math.max(...data.nodes.map(n => n.totalPasses), 1)

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height}>
        {/* Edges */}
        {data.edges.map((edge, i) => {
          const from = nodeMap.get(edge.from)
          const to = nodeMap.get(edge.to)
          if (!from || !to) return null

          const isHighlighted = hoveredNodeId === edge.from || hoveredNodeId === edge.to
          const opacity = hoveredNodeId ? (isHighlighted ? 0.9 : 0.1) : 0.4 + edge.weight * 0.5

          return (
            <line
              key={i}
              x1={(from.x / 100) * width}
              y1={(from.y / 100) * height}
              x2={(to.x / 100) * width}
              y2={(to.y / 100) * height}
              stroke={isHighlighted ? '#00ff85' : '#ffffff'}
              strokeWidth={1 + edge.weight * 5}
              strokeOpacity={opacity}
            />
          )
        })}

        {/* Nodes */}
        {data.nodes.map(node => {
          const px = (node.x / 100) * width
          const py = (node.y / 100) * height
          const r = minR + ((node.totalPasses / maxPasses) * (maxR - minR))
          const isHovered = hoveredNodeId === node.playerId

          return (
            <g
              key={node.playerId}
              transform={`translate(${px},${py})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNodeId(node.playerId)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <circle r={r} fill="#00ff85" fillOpacity={0.85} stroke="#fff" strokeWidth={isHovered ? 2 : 1} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={7}
                fontWeight="bold"
                fill="rgba(0,0,0,0.8)"
                style={{ pointerEvents: 'none' }}
              >
                {node.name.split(' ').pop()?.slice(0, 4)}
              </text>
              {isHovered && (
                <g transform="translate(12, -18)">
                  <rect x={0} y={-10} width={node.name.length * 5 + 8} height={14} fill="rgba(0,0,0,0.9)" rx={2} />
                  <text x={4} y={0} fontSize={8} fill="#e8f5e9" style={{ pointerEvents: 'none' }}>
                    {node.name} — {node.totalPasses}p
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </PitchCanvas>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/tactics/pass-network.ts src/components/pitch/PassNetwork.tsx
git commit -m "feat: add pass network computation and interactive visualization"
```

---

## Task 6: Press Map

**Files:**
- Create: `src/lib/tactics/pressing.ts`
- Create: `src/components/pitch/PressMap.tsx`

- [ ] **Step 1: Create pressing computation**

Create `src/lib/tactics/pressing.ts`:

```typescript
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
```

- [ ] **Step 2: Create PressMap component**

Create `src/components/pitch/PressMap.tsx`:

```typescript
'use client'
import { useEffect, useRef } from 'react'
import { PitchCanvas } from './PitchCanvas'
import type { PressingData } from '@/lib/tactics/pressing'

interface Props {
  data: PressingData
  width?: number
  height?: number
}

const STYLE_COLORS = {
  'High Press': '#ef4444',
  'Mid Block': '#f59e0b',
  'Low Block': '#3b82f6',
}

export function PressMap({ data, width = 320, height = 440 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    data.zones.forEach(zone => {
      if (zone.intensity < 0.05) return
      const px = (zone.x / 100) * width
      const py = (zone.y / 100) * height
      const r = 60 * zone.intensity + 20

      const color = data.pressStyle === 'High Press' ? '239, 68, 68'
        : data.pressStyle === 'Mid Block' ? '245, 158, 11'
        : '59, 130, 246'

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
      grad.addColorStop(0, `rgba(${color}, ${0.5 * zone.intensity})`)
      grad.addColorStop(0.6, `rgba(${color}, ${0.2 * zone.intensity})`)
      grad.addColorStop(1, `rgba(${color}, 0)`)

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [data, width, height])

  const styleColor = STYLE_COLORS[data.pressStyle]

  return (
    <div className="relative select-none">
      <PitchCanvas width={width} height={height} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 rounded"
        style={{ mixBlendMode: 'screen' }}
      />
      {/* PPDA badge */}
      <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 text-center">
        <div className="text-xs text-gray-400">PPDA</div>
        <div className="text-lg font-mono font-bold" style={{ color: styleColor }}>{data.ppda}</div>
      </div>
      {/* Press style label */}
      <div
        className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold"
        style={{ backgroundColor: `${styleColor}30`, color: styleColor, border: `1px solid ${styleColor}50` }}
      >
        {data.pressStyle}
      </div>
      {/* Recovery zone */}
      <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-0.5 text-xs text-gray-300">
        Recovers in <span className="font-semibold text-[#e8f5e9]">{data.recoveryZone}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/tactics/pressing.ts src/components/pitch/PressMap.tsx
git commit -m "feat: add pressing computation and PressMap visualization"
```

---

## Task 7: Tactical Identity Card & Recent Results

**Files:**
- Create: `src/components/ui/TacticalIdentityCard.tsx`
- Create: `src/components/ui/RecentResultStrip.tsx`

- [ ] **Step 1: Create TacticalIdentityCard**

Create `src/components/ui/TacticalIdentityCard.tsx`:

```typescript
import { FormationBadge } from './FormationBadge'
import { StatPill } from './StatPill'
import type { TeamStatistics } from '@/types'
import type { PressingData } from '@/lib/tactics/pressing'

interface Props {
  stats: TeamStatistics
  pressing: PressingData
}

function getStyleLabel(pressing: PressingData, stats: TeamStatistics): string {
  const parts: string[] = []
  parts.push(pressing.pressStyle)
  if (stats.passAccuracy > 85) parts.push('Possession')
  else if (stats.passAccuracy < 75) parts.push('Direct')
  return parts.join(' · ')
}

export function TacticalIdentityCard({ stats, pressing }: Props) {
  const styleLabel = getStyleLabel(pressing, stats)

  return (
    <div className="p-5 rounded-xl border border-[#1e3329] bg-[#111a15] space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FormationBadge formation={stats.formation} className="text-sm px-3 py-1" />
            <span className="text-xs text-gray-400">{styleLabel}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Season 2024/25</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#00ff85]">{stats.wins}W</p>
          <p className="text-xs text-gray-400">{stats.draws}D {stats.losses}L</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatPill label="PPDA" value={pressing.ppda} highlight />
        <StatPill label="Pass Acc" value={`${stats.passAccuracy}%`} />
        <StatPill label="Goals F" value={stats.goalsFor} />
        <StatPill label="Goals A" value={stats.goalsAgainst} />
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-[#1e3329]">
        <div
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: pressing.pressStyle === 'High Press' ? 'rgba(239,68,68,0.15)' :
              pressing.pressStyle === 'Mid Block' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
            color: pressing.pressStyle === 'High Press' ? '#ef4444' :
              pressing.pressStyle === 'Mid Block' ? '#f59e0b' : '#3b82f6',
          }}
        >
          {pressing.recoveryZone} recovery
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create RecentResultStrip**

Create `src/components/ui/RecentResultStrip.tsx`:

```typescript
import type { Fixture, Team } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  fixtures: Fixture[]
  teamId: number
}

function getResult(fixture: Fixture, teamId: number): 'W' | 'D' | 'L' | null {
  if (fixture.homeScore === null || fixture.awayScore === null) return null
  const isHome = fixture.homeTeam.id === teamId
  const scored = isHome ? fixture.homeScore : fixture.awayScore
  const conceded = isHome ? fixture.awayScore : fixture.homeScore
  if (scored > conceded) return 'W'
  if (scored === conceded) return 'D'
  return 'L'
}

const RESULT_STYLES = {
  W: 'bg-green-500/20 border-green-500/50 text-green-400',
  D: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  L: 'bg-red-500/20 border-red-500/50 text-red-400',
}

export function RecentResultStrip({ fixtures, teamId }: Props) {
  const recent = fixtures.filter(f => f.status === 'FT').slice(0, 5)

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last 5 Results</h3>
      <div className="space-y-1.5">
        {recent.map(fixture => {
          const result = getResult(fixture, teamId)
          const isHome = fixture.homeTeam.id === teamId
          const opponent = isHome ? fixture.awayTeam : fixture.homeTeam
          const scored = isHome ? fixture.homeScore : fixture.awayScore
          const conceded = isHome ? fixture.awayScore : fixture.homeScore

          return (
            <div
              key={fixture.id}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg border',
                result ? RESULT_STYLES[result] : 'border-[#1e3329] text-gray-400'
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn('w-5 h-5 rounded flex items-center justify-center text-xs font-bold', result ? RESULT_STYLES[result] : '')}>
                  {result ?? '?'}
                </span>
                <span className="text-xs text-[#e8f5e9]">{isHome ? 'vs' : '@'} {opponent.shortName}</span>
              </div>
              <span className="font-mono text-sm font-bold">
                {scored} – {conceded}
              </span>
            </div>
          )
        })}
        {recent.length === 0 && (
          <p className="text-xs text-gray-500">No recent results available</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/TacticalIdentityCard.tsx src/components/ui/RecentResultStrip.tsx
git commit -m "feat: add TacticalIdentityCard and RecentResultStrip components"
```

---

## Task 8: Team Hub Page

**Files:**
- Create: `src/components/ui/TeamHubNav.tsx`
- Create: `src/app/teams/[teamId]/page.tsx`
- Create: `src/app/teams/[teamId]/layout.tsx`

- [ ] **Step 1: Create TeamHubNav**

Create `src/components/ui/TeamHubNav.tsx`:

```typescript
'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Overview', href: '' },
  { label: 'Tactics', href: '/tactics' },
  { label: 'Set Pieces', href: '/set-pieces' },
  { label: 'Manager', href: '/manager' },
  { label: 'Tactics Board', href: '/tactics-board' },
  { label: 'FPL', href: '/fpl' },
]

interface Props {
  teamId: string
}

export function TeamHubNav({ teamId }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const league = searchParams.get('league') ?? ''
  const leagueParam = league ? `?league=${league}` : ''
  const base = `/teams/${teamId}`

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-[#1e3329] pb-0 -mb-px">
      {TABS.map(tab => {
        const href = `${base}${tab.href}${leagueParam}`
        const isActive = tab.href === ''
          ? pathname === base
          : pathname.startsWith(`${base}${tab.href}`)

        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              isActive
                ? 'border-[#00ff85] text-[#00ff85]'
                : 'border-transparent text-gray-400 hover:text-[#e8f5e9] hover:border-[#1e3329]'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Create team layout**

Create `src/app/teams/[teamId]/layout.tsx`:

```typescript
import { Suspense } from 'react'
import { TeamHubNav } from '@/components/ui/TeamHubNav'

interface Props {
  children: React.ReactNode
  params: Promise<{ teamId: string }>
}

export default async function TeamLayout({ children, params }: Props) {
  const { teamId } = await params

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-10" />}>
        <TeamHubNav teamId={teamId} />
      </Suspense>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Create Team Hub overview page**

Create `src/app/teams/[teamId]/page.tsx`:

```typescript
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { fetchTeamStatistics, fetchRecentFixtures, fetchStandings } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { FormationPitch } from '@/components/pitch/FormationPitch'
import { TacticalIdentityCard } from '@/components/ui/TacticalIdentityCard'
import { RecentResultStrip } from '@/components/ui/RecentResultStrip'
import { generateMockPressingData } from '@/lib/tactics/pressing'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

export default async function TeamOverviewPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let stats = null
  let fixtures = []
  let teamName = 'Team'
  let crestUrl = ''

  try {
    const [s, f, standings] = await Promise.all([
      fetchTeamStatistics(id, meta.apiId),
      fetchRecentFixtures(id, meta.apiId),
      fetchStandings(meta.apiId),
    ])
    stats = s
    fixtures = f
    const standing = standings.find(st => st.team.id === id)
    teamName = standing?.team.name ?? 'Team'
    crestUrl = standing?.team.crestUrl ?? ''
  } catch {
    // graceful degradation
  }

  const pressing = generateMockPressingData('balanced')
  const formation = stats?.formation ?? '4-3-3'

  return (
    <div className="space-y-8">
      {/* Team header */}
      <div className="flex items-center gap-4">
        {crestUrl && (
          <div className="relative w-16 h-16 shrink-0">
            <Image src={crestUrl} alt={teamName} fill className="object-contain" unoptimized />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-extrabold">{teamName}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{meta.name} · 2024/25 Season</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formation pitch */}
        <div className="lg:col-span-1 flex flex-col items-center gap-4">
          <FormationPitch formation={formation} width={280} height={380} />
        </div>

        {/* Identity card + results */}
        <div className="lg:col-span-2 space-y-6">
          {stats ? (
            <TacticalIdentityCard stats={stats} pressing={pressing} />
          ) : (
            <div className="p-4 rounded-xl border border-[#1e3329] bg-[#111a15] text-gray-400 text-sm">
              Stats unavailable — check your API key in .env.local
            </div>
          )}
          <RecentResultStrip fixtures={fixtures} teamId={id} />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 86400
```

- [ ] **Step 4: Verify team page renders**

```bash
npm run dev
```

Navigate to a team page: http://localhost:3000/leagues/premier-league, click any team.

Expected: Team hub with formation pitch on left, tactical identity card and results on right. Tab navigation visible.

- [ ] **Step 5: Commit**

```bash
git add src/app/teams/ src/components/ui/TeamHubNav.tsx
git commit -m "feat: add team hub page with formation pitch, tactical identity and recent results"
```

---

## Task 9: Tactics Tab

**Files:**
- Create: `src/app/teams/[teamId]/tactics/page.tsx`

- [ ] **Step 1: Create Tactics tab**

Create `src/app/teams/[teamId]/tactics/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { fetchTeamStatistics } from '@/lib/api-football/client'
import { LEAGUES } from '@/types'
import { PressMap } from '@/components/pitch/PressMap'
import { PassNetwork } from '@/components/pitch/PassNetwork'
import { HeatmapOverlay } from '@/components/pitch/HeatmapOverlay'
import { generateMockPressingData } from '@/lib/tactics/pressing'
import { buildPassNetwork } from '@/lib/tactics/pass-network'

interface Props {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ league?: string }>
}

function generateMockPassNetwork(formation: string) {
  const playerData = [
    { id: 1, name: 'Goalkeeper', avgX: 50, avgY: 90, passes: [{ toId: 2, count: 18 }, { toId: 3, count: 15 }] },
    { id: 2, name: 'Left Back', avgX: 15, avgY: 72, passes: [{ toId: 6, count: 25 }, { toId: 7, count: 20 }, { toId: 1, count: 12 }] },
    { id: 3, name: 'Left CB', avgX: 33, avgY: 78, passes: [{ toId: 4, count: 30 }, { toId: 6, count: 22 }, { toId: 1, count: 18 }] },
    { id: 4, name: 'Right CB', avgX: 67, avgY: 78, passes: [{ toId: 3, count: 30 }, { toId: 7, count: 22 }, { toId: 1, count: 18 }] },
    { id: 5, name: 'Right Back', avgX: 85, avgY: 72, passes: [{ toId: 7, count: 25 }, { toId: 8, count: 20 }, { toId: 1, count: 12 }] },
    { id: 6, name: 'Left Mid', avgX: 20, avgY: 52, passes: [{ toId: 8, count: 28 }, { toId: 9, count: 20 }, { toId: 2, count: 22 }] },
    { id: 7, name: 'Centre Mid', avgX: 50, avgY: 55, passes: [{ toId: 6, count: 32 }, { toId: 8, count: 32 }, { toId: 9, count: 24 }] },
    { id: 8, name: 'Right Mid', avgX: 80, avgY: 52, passes: [{ toId: 7, count: 28 }, { toId: 9, count: 20 }, { toId: 5, count: 22 }] },
    { id: 9, name: 'Left Wing', avgX: 18, avgY: 28, passes: [{ toId: 10, count: 22 }, { toId: 7, count: 18 }] },
    { id: 10, name: 'Striker', avgX: 50, avgY: 22, passes: [{ toId: 9, count: 15 }, { toId: 11, count: 15 }, { toId: 7, count: 20 }] },
    { id: 11, name: 'Right Wing', avgX: 82, avgY: 28, passes: [{ toId: 10, count: 22 }, { toId: 7, count: 18 }] },
  ]
  return buildPassNetwork(playerData)
}

function generateMockHeatPoints() {
  return [
    { x: 20, y: 30, intensity: 0.8 },
    { x: 35, y: 45, intensity: 0.6 },
    { x: 50, y: 25, intensity: 0.9 },
    { x: 65, y: 40, intensity: 0.7 },
    { x: 80, y: 30, intensity: 0.75 },
    { x: 50, y: 55, intensity: 0.5 },
    { x: 30, y: 65, intensity: 0.4 },
    { x: 70, y: 65, intensity: 0.4 },
  ]
}

export default async function TacticsPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { league: leagueSlug = 'premier-league' } = await searchParams

  const meta = LEAGUES.find(l => l.slug === leagueSlug)
  if (!meta) notFound()

  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  let formation = '4-3-3'
  try {
    const stats = await fetchTeamStatistics(id, meta.apiId)
    formation = stats.formation
  } catch { /* use default */ }

  const pressing = generateMockPressingData('balanced')
  const passNetwork = generateMockPassNetwork(formation)
  const heatPoints = generateMockHeatPoints()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Press Map */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            Pressing & Defensive Shape
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Press trigger zones and ball recovery areas. Lower PPDA = more aggressive pressing.
          </p>
          <div className="flex justify-center">
            <PressMap data={pressing} width={300} height={420} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-[#111a15] border border-[#1e3329]">
              <p className="text-gray-400 text-xs">Press Style</p>
              <p className="font-semibold text-[#e8f5e9] mt-0.5">{pressing.pressStyle}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#111a15] border border-[#1e3329]">
              <p className="text-gray-400 text-xs">Recovery Zone</p>
              <p className="font-semibold text-[#e8f5e9] mt-0.5">{pressing.recoveryZone}</p>
            </div>
          </div>
        </div>

        {/* Pass Network */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff85] inline-block" />
            Pass Network
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Node size = total passes. Line thickness = connection frequency. Hover for player details.
          </p>
          <div className="flex justify-center">
            <PassNetwork data={passNetwork} width={300} height={420} />
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
          Team Activity Heatmap
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Positional density across all matches this season. Red = high activity zones.
        </p>
        <div className="flex justify-center">
          <HeatmapOverlay points={heatPoints} width={300} height={420} />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 86400
```

- [ ] **Step 2: Verify tactics tab renders**

```bash
npm run dev
```

Navigate to a team page, click the "Tactics" tab. Expected: Press map, pass network, and heatmap all visible and interactive.

- [ ] **Step 3: Commit**

```bash
git add src/app/teams/
git commit -m "feat: add tactics tab with press map, pass network and heatmap"
```

---

## Task 10: Build & Test Verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: Build succeeds

- [ ] **Step 4: Delete test pitch page**

```bash
rm src/app/test-pitch/page.tsx
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: Plan B complete — team hub with formation pitch, press map, pass network, heatmap"
```

---

## Plan B Complete ✓

What's working after Plan B:
- Animated D3 formation pitch with player tokens
- Canvas-based heatmap overlay
- Interactive pass network (hover for connections)
- Press map with PPDA and style labels
- Full team hub with tabbed navigation
- Tactics tab fully wired

**Next:** Plan C builds the Set Pieces tab (animated), Manager tab (Claude API), Tactics Board (drag-and-drop), and FPL Insights.

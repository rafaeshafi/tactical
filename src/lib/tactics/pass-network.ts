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

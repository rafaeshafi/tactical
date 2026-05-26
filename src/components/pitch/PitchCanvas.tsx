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
      <rect x={0} y={0} width={w} height={h} fill={fill} rx={4} />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={0} y={(h / 8) * i} width={w} height={h / 8} fill={i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'} />
      ))}
      <rect x={lineW} y={lineW} width={w - lineW * 2} height={h - lineW * 2} fill="none" stroke={stroke} strokeWidth={lineW} />
      <line x1={lineW} y1={h / 2} x2={w - lineW} y2={h / 2} stroke={stroke} strokeWidth={lineW} />
      <circle cx={w / 2} cy={h / 2} r={circleR} fill="none" stroke={stroke} strokeWidth={lineW} />
      <circle cx={w / 2} cy={h / 2} r={2} fill={stroke} />
      <rect x={(w - penAreaW) / 2} y={lineW} width={penAreaW} height={penAreaH} fill="none" stroke={stroke} strokeWidth={lineW} />
      <rect x={(w - goalAreaW) / 2} y={lineW} width={goalAreaW} height={goalAreaH} fill="none" stroke={stroke} strokeWidth={lineW} />
      <circle cx={w / 2} cy={penSpotY} r={2} fill={stroke} />
      <rect x={(w - penAreaW) / 2} y={h - penAreaH - lineW} width={penAreaW} height={penAreaH} fill="none" stroke={stroke} strokeWidth={lineW} />
      <rect x={(w - goalAreaW) / 2} y={h - goalAreaH - lineW} width={goalAreaW} height={goalAreaH} fill="none" stroke={stroke} strokeWidth={lineW} />
      <circle cx={w / 2} cy={h - penSpotY} r={2} fill={stroke} />
      {[
        { cx: lineW, cy: lineW },
        { cx: w - lineW, cy: lineW },
        { cx: lineW, cy: h - lineW },
        { cx: w - lineW, cy: h - lineW },
      ].map((corner, i) => (
        <circle key={i} cx={corner.cx} cy={corner.cy} r={cornerR} fill="none" stroke={stroke} strokeWidth={lineW} />
      ))}
      {children}
    </svg>
  )
}

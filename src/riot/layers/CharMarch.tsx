// 字符游行：把 textChunks 拆成字符，在屏幕横向滚动
import { useMemo } from 'react'
import { mulberry32, hashStr } from '../utils/rng'

interface CharMarchProps {
  chunks: string[]
  intensity: number
  paused: boolean
}

const FONTS = [
  'font-stencil',
  'font-marker',
  'font-typewriter',
  'font-mono',
  'font-display',
  'font-han',
  'font-zhi',
]

const COLORS = ['text-paper', 'text-riot', 'text-flare', 'text-paper/70', 'text-riot/80']

interface MarchRow {
  text: string
  top: number
  size: number
  font: string
  color: string
  duration: number
  direction: 1 | -1
  delay: number
  rotate: number
  opacity: number
}

export function CharMarch({ chunks, intensity, paused }: CharMarchProps) {
  const rows = useMemo<MarchRow[]>(() => {
    if (chunks.length === 0) return []
    const rng = mulberry32(hashStr(chunks.join('|') + '|march'))
    const rowCount = 6 + intensity * 2
    const rows: MarchRow[] = []
    for (let i = 0; i < rowCount; i++) {
      const base = chunks[Math.floor(rng() * chunks.length)] ?? ''
      const text = base
        .split('')
        .filter((c) => c.trim().length > 0)
        .join(' ')
        .toUpperCase()
        .slice(0, 120)
      if (!text) continue
      rows.push({
        text,
        top: 5 + (i / rowCount) * 92 + (rng() - 0.5) * 4,
        size: 1.2 + rng() * (intensity * 0.8),
        font: FONTS[Math.floor(rng() * FONTS.length)],
        color: COLORS[Math.floor(rng() * COLORS.length)],
        duration: 18 / (0.5 + intensity * 0.4) + rng() * 8,
        direction: rng() > 0.5 ? 1 : -1,
        delay: -rng() * 10,
        rotate: (rng() - 0.5) * 8,
        opacity: 0.55 + rng() * 0.4,
      })
    }
    return rows
  }, [chunks, intensity])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {rows.map((r, i) => (
        <div
          key={i}
          className={`absolute left-0 right-0 whitespace-nowrap will-change-transform ${r.font} ${r.color}`}
          style={{
            top: `${r.top}%`,
            transform: `rotate(${r.rotate}deg)`,
            fontSize: `${r.size}rem`,
            opacity: r.opacity,
            textShadow: r.color.includes('riot')
              ? '2px 2px 0 #0a0a0a, -1px 0 0 #f4f1de'
              : '1px 1px 0 #d72638',
            animation: `marquee-row ${r.duration}s linear infinite`,
            animationDirection: r.direction > 0 ? 'normal' : 'reverse',
            animationDelay: `${r.delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
            letterSpacing: '0.05em',
            mixBlendMode: r.color.includes('riot') ? 'screen' : 'difference',
          }}
        >
          <span className="inline-block pr-12">{r.text}</span>
          <span className="inline-block pr-12">{r.text}</span>
          <span className="inline-block pr-12">{r.text}</span>
        </div>
      ))}
      <style>{`
        @keyframes marquee-row {
          from { transform: translateX(0) rotate(var(--rot, 0deg)); }
          to { transform: translateX(-50%) rotate(var(--rot, 0deg)); }
        }
      `}</style>
    </div>
  )
}

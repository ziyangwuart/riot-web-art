// BlackVoid：Mark Napier 原版标志性的黑色"虚空"块 — 随机大小/位置/层级
import { useMemo } from 'react'
import { mulberry32, hashStr } from '../utils/rng'

interface BlackVoidProps {
  intensity: number
  paused: boolean
  url: string
}

export function BlackVoid({ intensity, paused, url }: BlackVoidProps) {
  const rects = useMemo(() => {
    const rng = mulberry32(hashStr(url || 'void') + 1337)
    const count = 8 + intensity * 4
    const out: { w: number; h: number; left: number; top: number; dur: number; delay: number; flash: boolean }[] = []
    for (let i = 0; i < count; i++) {
      out.push({
        w: 40 + rng() * 220,
        h: 24 + rng() * 110,
        left: rng() * 95,
        top: rng() * 95,
        dur: 6 + rng() * 8,
        delay: -rng() * 10,
        flash: rng() > 0.85,
      })
    }
    return out
  }, [url, intensity])

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {rects.map((r, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: `${r.w}px`,
            height: `${r.h}px`,
            background: 'var(--void)',
            animation: `void-pulse ${r.dur}s steps(1) infinite`,
            animationDelay: `${r.delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
            boxShadow: r.flash ? '0 0 0 1px var(--accent)' : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes void-pulse {
          0%, 88% { opacity: 1; }
          90% { opacity: 0.3; }
          92% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

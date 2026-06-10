// Hearts：90s guestbook 风格的紫色爱心飘动
import { useMemo } from 'react'
import { mulberry32, hashStr } from '../utils/rng'

interface HeartsProps {
  intensity: number
  paused: boolean
  url: string
}

export function Hearts({ intensity, paused, url }: HeartsProps) {
  const hearts = useMemo(() => {
    const rng = mulberry32(hashStr(url || 'hearts') + 444)
    const count = 8 + intensity * 3
    const out: { left: number; size: number; dur: number; delay: number; color: string; opacity: number }[] = []
    const colors = ['#cc33cc', '#ff66cc', '#ff99cc', '#990099', '#ff3399']
    for (let i = 0; i < count; i++) {
      out.push({
        left: rng() * 95,
        size: 14 + rng() * 22,
        dur: 8 + rng() * 6,
        delay: -rng() * 12,
        color: colors[Math.floor(rng() * colors.length)],
        opacity: 0.7 + rng() * 0.25,
      })
    }
    return out
  }, [url, intensity])

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {hearts.map((h, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-40px',
            fontSize: `${h.size}px`,
            color: h.color,
            opacity: h.opacity,
            animation: `heart-rise ${h.dur}s linear infinite`,
            animationDelay: `${h.delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
            textShadow: '1px 1px 0 #ffffff',
          }}
        >
          ♥
        </div>
      ))}
      <style>{`
        @keyframes heart-rise {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          50% { transform: translateY(-50vh) rotate(8deg); }
          90% { opacity: 0.9; }
          100% { transform: translateY(-110vh) rotate(-8deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

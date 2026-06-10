// 抗议纸牌：单词级元素，模拟被高举的标语牌（位置固定、角度持续抖动）
// legacyLink=true 时使用 90s 经典蓝链下划线样式
import { useMemo } from 'react'
import { mulberry32, hashStr } from '../utils/rng'

interface PicketSignProps {
  words: string[]
  intensity: number
  paused: boolean
  legacyLink?: boolean
}

const BG = [
  'bg-paper text-ink',
  'bg-riot text-paper',
  'bg-ink text-paper border border-paper',
  'bg-ink text-riot border border-riot',
  'bg-flare text-ink',
  'bg-smoke text-paper',
]
const FONTS = ['font-stencil', 'font-marker', 'font-typewriter', 'font-zhi', 'font-han', 'font-display']

export function PicketSign({ words, intensity, paused, legacyLink = false }: PicketSignProps) {
  const signs = useMemo(() => {
    if (words.length === 0) return []
    const rng = mulberry32(hashStr(words.join('|') + '|picket'))
    const count = 14 + intensity * 6
    const arr: { text: string; left: number; top: number; rotate: number; bg: string; font: string; size: number; delay: number }[] = []
    for (let i = 0; i < count; i++) {
      const w = words[Math.floor(rng() * words.length)]
      if (!w) continue
      arr.push({
        text: w.toUpperCase().slice(0, 12),
        left: 2 + rng() * 94,
        top: 4 + rng() * 92,
        rotate: (rng() - 0.5) * 30,
        bg: legacyLink ? '' : BG[Math.floor(rng() * BG.length)],
        font: legacyLink ? 'font-marker' : FONTS[Math.floor(rng() * FONTS.length)],
        size: legacyLink ? 0.9 + rng() * 0.6 : 0.7 + rng() * 1.4,
        delay: rng() * 0.6,
      })
    }
    return arr
  }, [words, intensity, legacyLink])

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {signs.map((s, i) => (
        <div
          key={i}
          className={`absolute ${s.bg} ${s.font} px-1.5 py-0.5 whitespace-nowrap will-change-transform`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}rem`,
            transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
            boxShadow: legacyLink ? 'none' : `${2 + (i % 3)}px ${2 + (i % 2)}px 0 rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.2)`,
            animation: `picket-shake ${0.25 + (i % 4) * 0.1}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
            letterSpacing: '0em',
            opacity: 0.95,
            color: legacyLink ? 'var(--primary)' : undefined,
            textDecoration: legacyLink ? 'underline' : 'none',
            textUnderlineOffset: '2px',
          }}
        >
          {s.text}
        </div>
      ))}
      <style>{`
        @keyframes picket-shake {
          0%, 100% { margin-left: 0; margin-top: 0; }
          25% { margin-left: -2px; margin-top: 1px; }
          50% { margin-left: 2px; margin-top: -1px; }
          75% { margin-left: -1px; margin-top: 2px; }
        }
      `}</style>
    </div>
  )
}

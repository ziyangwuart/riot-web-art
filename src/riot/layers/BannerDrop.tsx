// 横幅坠落：长句切片从屏幕顶端往下落
import { useMemo } from 'react'
import { mulberry32, hashStr } from '../utils/rng'
import { chunksToShort } from '../utils/text'

interface BannerDropProps {
  chunks: string[]
  intensity: number
  paused: boolean
}

const SHAPES = [
  'bg-paper text-ink',
  'bg-riot text-paper',
  'bg-ink text-paper border-2 border-paper',
  'bg-flare text-ink',
  'bg-paper text-ink',
  'bg-ink text-riot border-2 border-riot',
]

export function BannerDrop({ chunks, intensity, paused }: BannerDropProps) {
  const banners = useMemo(() => {
    const rng = mulberry32(hashStr(chunks.join('|') + '|banner'))
    const count = 5 + intensity * 3
    const all: { text: string; left: number; rotate: number; duration: number; delay: number; shape: string; font: string }[] = []
    for (let i = 0; i < count; i++) {
      const src = chunks[Math.floor(rng() * chunks.length)] ?? ''
      if (!src) continue
      const pieces = chunksToShort(src, 14 + Math.floor(rng() * 18))
      const pick = pieces[Math.floor(rng() * pieces.length)] ?? src.slice(0, 18)
      all.push({
        text: pick.toUpperCase(),
        left: rng() * 92,
        rotate: (rng() - 0.5) * 40,
        duration: 6 + rng() * (10 - intensity * 0.8),
        delay: -rng() * 12,
        shape: SHAPES[Math.floor(rng() * SHAPES.length)],
        font: rng() > 0.5 ? 'font-stencil' : 'font-marker',
      })
    }
    return all
  }, [chunks, intensity])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {banners.map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.shape} ${b.font} px-3 py-1.5 whitespace-nowrap will-change-transform`}
          style={{
            left: `${b.left}%`,
            fontSize: `${0.9 + (i % 3) * 0.2}rem`,
            transform: `rotate(${b.rotate}deg)`,
            boxShadow: '3px 4px 0 rgba(0,0,0,0.5)',
            animation: `banner-drop-${i % 4} ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
            letterSpacing: '0.05em',
          }}
        >
          {b.text}
        </div>
      ))}
      <style>{`
        @keyframes banner-drop-0 { from { transform: translateY(-30vh) rotate(-12deg); } to { transform: translateY(110vh) rotate(8deg); } }
        @keyframes banner-drop-1 { from { transform: translateY(-30vh) rotate(20deg); } to { transform: translateY(110vh) rotate(-12deg); } }
        @keyframes banner-drop-2 { from { transform: translateY(-30vh) rotate(-25deg); } to { transform: translateY(110vh) rotate(28deg); } }
        @keyframes banner-drop-3 { from { transform: translateY(-30vh) rotate(8deg); } to { transform: translateY(110vh) rotate(-18deg); } }
      `}</style>
    </div>
  )
}

// 涂鸦图像层：图片被红 X 涂鸦、随机旋转、灰度扭曲
import { useMemo } from 'react'
import { mulberry32 } from '../utils/rng'

interface GraffitiImageProps {
  images: string[]
  intensity: number
  paused: boolean
}

const STAMPS = ['NOISE', 'BURN', 'LIES', '✦', '404', 'RIOT', '⛔', 'RIOT!', '✕', 'WRONG', 'LIAR', 'FAKE', 'STOP']

export function GraffitiImage({ images, intensity, paused }: GraffitiImageProps) {
  const tiles = useMemo(() => {
    const rng = mulberry32(images.join('|').length * 7 + intensity)
    const count = Math.min(images.length, 5 + intensity * 2)
    return images.slice(0, count).map((src, i) => ({
      src,
      left: 5 + rng() * 85,
      top: 5 + rng() * 85,
      rotate: (rng() - 0.5) * 24,
      w: 100 + rng() * 200,
      stamp: STAMPS[Math.floor(rng() * STAMPS.length)],
      stampRotate: (rng() - 0.5) * 30,
      invert: rng() > 0.6,
      filter: rng() > 0.5 ? 1.4 : 0.6,
      delay: rng() * 0.4,
      duration: 0.4 + rng() * 0.3,
    }))
  }, [images, intensity])

  if (tiles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {tiles.map((t, i) => (
        <div
          key={i}
          className="absolute will-change-transform"
          style={{
            left: `${t.left}%`,
            top: `${t.top}%`,
            transform: `translate(-50%, -50%) rotate(${t.rotate}deg)`,
            width: `${t.w}px`,
            animation: `picket-shake ${t.duration}s ease-in-out infinite`,
            animationDelay: `${t.delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
            mixBlendMode: t.invert ? 'difference' : 'normal',
          }}
        >
          <div className="relative" style={{ filter: `grayscale(${t.filter}) contrast(1.4) brightness(0.95)` }}>
            <img
              src={t.src}
              alt=""
              className="block w-full h-auto border-2 border-paper"
              style={{ boxShadow: '4px 4px 0 #d72638' }}
              draggable={false}
            />
            {/* 红色 X */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ mixBlendMode: 'multiply' }}
            >
              <line x1="0" y1="0" x2="100" y2="100" stroke="var(--primary)" strokeWidth="2.5" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="var(--primary)" strokeWidth="2.5" />
            </svg>
            {/* 印章 */}
            <div
              className="absolute font-stencil text-riot border-2 border-riot bg-ink/70 px-1.5 py-0.5 text-[10px] tracking-widest uppercase"
              style={{
                top: '8%',
                right: '-12px',
                transform: `rotate(${t.stampRotate}deg)`,
                boxShadow: '1px 1px 0 #0a0a0a',
                opacity: 0.95,
              }}
            >
              {t.stamp}
            </div>
            {/* 涂鸦笔触 */}
            <div
              className="absolute -bottom-3 left-0 right-0 h-2 bg-riot"
              style={{ transform: 'skewY(-1.5deg)', opacity: 0.7 }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes picket-shake {
          0%, 100% { margin-left: 0; margin-top: 0; }
          25% { margin-left: -3px; margin-top: 2px; }
          50% { margin-left: 3px; margin-top: -2px; }
          75% { margin-left: -2px; margin-top: 3px; }
        }
      `}</style>
    </div>
  )
}

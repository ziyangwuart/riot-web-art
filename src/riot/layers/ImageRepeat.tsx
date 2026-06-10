// ImageRepeat：同一图像在屏幕多处叠印 — 90s 拼贴 / Mark Napier 风格
import { useMemo } from 'react'
import { mulberry32, hashStr } from '../utils/rng'

interface ImageRepeatProps {
  images: string[]
  intensity: number
  paused: boolean
  url: string
}

export function ImageRepeat({ images, intensity, paused, url }: ImageRepeatProps) {
  const repeats = useMemo(() => {
    if (images.length === 0) return []
    const rng = mulberry32(hashStr(url || 'rep') + 999)
    const count = 6 + intensity * 3
    const out: { src: string; left: number; top: number; w: number; rotate: number; opacity: number; z: number; invert: boolean }[] = []
    for (let i = 0; i < count; i++) {
      const src = images[Math.floor(rng() * images.length)]
      if (!src) continue
      out.push({
        src,
        left: rng() * 92,
        top: rng() * 92,
        w: 80 + rng() * 180,
        rotate: (rng() - 0.5) * 16,
        opacity: 0.65 + rng() * 0.3,
        z: Math.floor(rng() * 20) - 10,
        invert: rng() > 0.7,
      })
    }
    return out
  }, [images, intensity, url])

  if (repeats.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {repeats.map((r, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: `${r.w}px`,
            transform: `translate(-50%, -50%) rotate(${r.rotate}deg)`,
            zIndex: r.z,
            opacity: r.opacity,
            mixBlendMode: r.invert ? 'difference' : 'normal',
            filter: r.invert ? 'invert(1) contrast(1.2)' : 'contrast(1.1) brightness(0.95)',
          }}
        >
          <img
            src={r.src}
            alt=""
            draggable={false}
            className="block w-full h-auto"
            style={{ border: '1px solid var(--ink-shadow)' }}
          />
        </div>
      ))}
    </div>
  )
}

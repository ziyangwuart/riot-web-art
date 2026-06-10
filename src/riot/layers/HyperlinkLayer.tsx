// 浮动的可点击超链接：抓取到的链接变成可点击元素
// legacyLink=true 时使用 90s 浏览器经典蓝链下划线样式
import { useMemo, useState } from 'react'
import { mulberry32, hashStr } from '../utils/rng'
import type { RippedLink } from '../../types'

interface HyperlinkLayerProps {
  links: RippedLink[]
  intensity: number
  paused: boolean
  onNavigate: (href: string) => void
  legacyLink?: boolean
}

const SHAPES = [
  { bg: 'bg-paper text-ink', stamp: 'border-riot text-riot', stampText: 'FOLLOW' },
  { bg: 'bg-riot text-paper', stamp: 'border-paper text-paper', stampText: 'RIOT HERE' },
  { bg: 'bg-ink text-paper', stamp: 'border-paper text-paper', stampText: 'NEXT' },
  { bg: 'bg-flare text-ink', stamp: 'border-ink text-ink', stampText: 'BURN' },
  { bg: 'bg-smoke text-paper', stamp: 'border-riot text-riot', stampText: 'OCCUPY' },
]

const FONTS = ['font-stencil', 'font-marker', 'font-typewriter', 'font-zhi', 'font-han', 'font-display']

export function HyperlinkLayer({ links, intensity, paused, onNavigate, legacyLink = false }: HyperlinkLayerProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const tiles = useMemo(() => {
    if (links.length === 0) return []
    const rng = mulberry32(hashStr(links.map((l) => l.href).join('|') + '|hyper'))
    const count = Math.min(links.length, 5 + intensity * 2)
    return links.slice(0, count).map((l, i) => {
      const shape = SHAPES[Math.floor(rng() * SHAPES.length)]
      const font = FONTS[Math.floor(rng() * FONTS.length)]
      const w = legacyLink ? 120 + rng() * 180 : 150 + rng() * 140
      const h = legacyLink ? 24 + rng() * 18 : 60 + rng() * 40
      return {
        link: l,
        shape,
        font: legacyLink ? 'font-marker' : font,
        w,
        h,
        left: 2 + rng() * 94,
        top: 4 + rng() * 92,
        rotate: legacyLink ? (rng() - 0.5) * 6 : (rng() - 0.5) * 18,
        stampRotate: (rng() - 0.5) * 30,
        animDelay: rng() * 0.5,
        animDuration: legacyLink ? 0.6 + rng() * 0.3 : 0.3 + rng() * 0.25,
        i,
      }
    })
  }, [links, intensity, legacyLink])

  if (tiles.length === 0) return null

  // 90s 经典蓝链样式：透明背景、蓝色下划线、轻晃动
  if (legacyLink) {
    return (
      <div className="absolute inset-0 pointer-events-none" aria-label="clickable links captured from page">
        {tiles.map((t) => (
          <button
            key={`${t.link.href}-${t.i}`}
            type="button"
            onClick={() => onNavigate(t.link.href)}
            className={`absolute pointer-events-auto group select-none ${t.font}`}
            style={{
              left: `${t.left}%`,
              top: `${t.top}%`,
              maxWidth: `${t.w}px`,
              transform: `translate(-50%, -50%) rotate(${t.rotate}deg)`,
              animation: `picket-shake ${t.animDuration}s ease-in-out infinite`,
              animationDelay: `${t.animDelay}s`,
              animationPlayState: paused ? 'paused' : 'running',
              cursor: 'pointer',
              zIndex: 30,
              background: 'transparent',
              color: 'var(--primary)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '2px 4px',
            }}
            title={`→ ${t.link.href}`}
          >
            {t.link.text}
            <span
              className="block font-mono text-[9px] mt-0.5"
              style={{
                color: 'var(--secondary)',
                textDecoration: 'none',
                opacity: 0.6,
              }}
            >
              ({t.link.host})
            </span>
          </button>
        ))}
        <style>{`
          @keyframes picket-shake {
            0%, 100% { margin-left: 0; margin-top: 0; }
            50% { margin-left: 1px; margin-top: -1px; }
          }
        `}</style>
      </div>
    )
  }

  // 默认抗议海报样式
  return (
    <div className="absolute inset-0 pointer-events-none" aria-label="clickable links captured from page">
      {tiles.map((t) => {
        const isHover = hoverIdx === t.i
        return (
          <button
            key={`${t.link.href}-${t.i}`}
            type="button"
            onClick={() => onNavigate(t.link.href)}
            onMouseEnter={() => setHoverIdx(t.i)}
            onMouseLeave={() => setHoverIdx(null)}
            className={`absolute ${t.shape.bg} ${t.font} pointer-events-auto group select-none text-left`}
            style={{
              left: `${t.left}%`,
              top: `${t.top}%`,
              width: `${t.w}px`,
              minHeight: `${t.h}px`,
              transform: `translate(-50%, -50%) rotate(${t.rotate}deg) scale(${isHover ? 1.12 : 1})`,
              animation: `picket-shake ${t.animDuration}s ease-in-out infinite`,
              animationDelay: `${t.animDelay}s`,
              animationPlayState: paused ? 'paused' : 'running',
              boxShadow: `${isHover ? 8 : 4}px ${isHover ? 8 : 4}px 0 rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)`,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              zIndex: isHover ? 40 : 25,
              cursor: 'pointer',
              opacity: 0.97,
            }}
            title={`→ ${t.link.href}`}
          >
            <div
              className="absolute -top-3 -left-2 font-mono text-[9px] tracking-widest uppercase bg-ink text-riot border border-riot px-1.5 py-0.5"
              style={{ transform: `rotate(${-t.rotate}deg)` }}
            >
              → link
            </div>

            <div className="px-3 py-2">
              <div className="text-[11px] md:text-sm leading-tight font-bold break-words uppercase tracking-wide">
                {t.link.text}
              </div>
              <div className="mt-1 font-mono text-[9px] opacity-70 truncate lowercase">
                {t.link.host}
              </div>
            </div>

            <div
              className={`absolute -bottom-2 -right-2 border-2 ${t.shape.stamp} bg-ink px-1.5 py-0.5 font-stencil text-[9px] tracking-widest uppercase`}
              style={{
                transform: `rotate(${t.stampRotate}deg)`,
                boxShadow: '1px 1px 0 rgba(0,0,0,0.6)',
              }}
            >
              {t.shape.stampText}
            </div>

            <div
              className="absolute inset-0 pointer-events-none border-2 border-riot opacity-0 group-hover:opacity-100"
              style={{ mixBlendMode: 'multiply' }}
            />
          </button>
        )
      })}

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

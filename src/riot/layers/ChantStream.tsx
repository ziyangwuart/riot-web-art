// 弹幕口号流：右侧贴边自下而上滚动
import { useMemo } from 'react'
import { mulberry32, hashStr } from '../utils/rng'

interface ChantStreamProps {
  words: string[]
  intensity: number
  paused: boolean
}

const SLOGANS = [
  '不要温和地走进那个良夜',
  'READ BETWEEN THE PIXELS',
  'WHO WATCHES THE WATCHERS?',
  'BURN THE ALGORITHM',
  '新闻已死，尸臭千年',
  'THEY READ YOU, YOU READ THEM',
  'OCCUPY THE FRONT PAGE',
  'NO BANNERS BUT YOURS',
  'MUTINY NOW',
  '噪音也是一种真相',
  'PRINT IS DEAD, LONG LIVE PRINT',
  'CUT THE FEED',
  'BREAK THE GLASS',
  'KILL THE SCROLL',
  'PROTEST AS PROTOCOL',
  '404: CONSENSUS NOT FOUND',
  'RIOT IS A LANGUAGE',
  'SIGN THE SCREEN',
  '关掉推送，加入游行',
  'THE STREET IS THE NEW FRONT PAGE',
]

export function ChantStream({ words, intensity, paused }: ChantStreamProps) {
  const items = useMemo(() => {
    const pool = [...words, ...SLOGANS]
    if (pool.length === 0) return []
    const rng = mulberry32(hashStr(pool.join('|') + '|chant'))
    const count = 14 + intensity * 4
    const arr: { text: string; left: number; duration: number; delay: number; size: number; color: string; rotate: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        text: pool[Math.floor(rng() * pool.length)].toUpperCase(),
        left: i % 3 === 0 ? 0 : i % 3 === 1 ? 33 : 66,
        duration: 12 + rng() * 10 - intensity * 0.8,
        delay: -rng() * 20,
        size: 10 + rng() * 8,
        color: rng() > 0.4 ? '#d72638' : rng() > 0.5 ? '#f4f1de' : '#ffd23f',
        rotate: (rng() - 0.5) * 4,
      })
    }
    return arr
  }, [words, intensity])

  return (
    <div className="absolute inset-y-0 right-0 w-[36vw] md:w-[26vw] pointer-events-none overflow-hidden" aria-hidden>
      {items.map((it, i) => (
        <div
          key={i}
          className="absolute right-1 md:right-2 font-mono uppercase whitespace-nowrap will-change-transform"
          style={{
            left: `${it.left}%`,
            fontSize: `${it.size}px`,
            color: it.color,
            textShadow: '1px 1px 0 #0a0a0a, -1px 0 0 #0a0a0a',
            transform: `rotate(${it.rotate}deg)`,
            animation: `chant-rise ${it.duration}s linear infinite`,
            animationDelay: `${it.delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
            letterSpacing: '0.1em',
            opacity: 0.85,
            fontWeight: 700,
          }}
        >
          ▶ {it.text}
        </div>
      ))}
      <style>{`
        @keyframes chant-rise {
          0% { transform: translateY(100vh) rotate(var(--rot, 0deg)); opacity: 0; }
          8% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-30vh) rotate(var(--rot, 0deg)); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

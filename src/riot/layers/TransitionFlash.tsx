// 起义转场：每次 ignite 触发新的 transitionKey 时，屏幕先黑后闪白 + 红色印章
import { useEffect, useState } from 'react'

interface TransitionFlashProps {
  trigger: number
  onDone?: () => void
}

export function TransitionFlash({ trigger, onDone }: TransitionFlashProps) {
  const [phase, setPhase] = useState<'idle' | 'black' | 'stamp' | 'white' | 'done'>('idle')
  const [token, setToken] = useState(0)

  useEffect(() => {
    if (trigger === 0) return
    setToken((t) => t + 1)
    setPhase('black')
    const t1 = setTimeout(() => setPhase('stamp'), 180)
    const t2 = setTimeout(() => setPhase('white'), 360)
    const t3 = setTimeout(() => {
      setPhase('done')
      onDone?.()
    }, 560)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [trigger, onDone])

  if (phase === 'idle' || phase === 'done') return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* 黑屏 */}
      {phase === 'black' && (
        <div
          key={`black-${token}`}
          className="absolute inset-0 bg-ink"
          style={{ animation: 'flash-black 0.36s ease-out forwards' }}
        />
      )}

      {/* 红章 + 起义字样 */}
      {phase === 'stamp' && (
        <>
          <div
            key={`stamp-${token}`}
            className="absolute inset-0 bg-ink"
            style={{ animation: 'flash-fade 0.4s ease-out forwards' }}
          />
          <div
            key={`stamptext-${token}`}
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'stamp-zoom 0.4s ease-out forwards' }}
          >
            <div className="border-[6px] border-riot text-riot font-stencil text-6xl md:text-8xl tracking-widest px-8 py-4 rotate-[-8deg] bg-ink/60">
              RIOT ON
            </div>
          </div>
          <div
            key={`stamptile-${token}`}
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(215,38,56,0.18) 0 2px, transparent 2px 8px)',
              mixBlendMode: 'screen',
              animation: 'scan-wipe 0.4s linear forwards',
            }}
          />
        </>
      )}

      {/* 白闪 */}
      {phase === 'white' && (
        <div
          key={`white-${token}`}
          className="absolute inset-0 bg-paper"
          style={{ animation: 'flash-white 0.2s ease-out forwards' }}
        />
      )}

      <style>{`
        @keyframes flash-black {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0.9; }
        }
        @keyframes flash-white {
          0% { opacity: 0; }
          30% { opacity: 0.85; }
          100% { opacity: 0; }
        }
        @keyframes flash-fade {
          0% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @keyframes stamp-zoom {
          0% { transform: scale(3) rotate(-20deg); opacity: 0; filter: blur(8px); }
          40% { transform: scale(1) rotate(-8deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(-8deg); opacity: 0; filter: blur(0); }
        }
        @keyframes scan-wipe {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

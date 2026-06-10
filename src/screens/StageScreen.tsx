import { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { useStageStyle } from '../hooks/useStageStyle'
import { CharMarch } from '../riot/layers/CharMarch'
import { BannerDrop } from '../riot/layers/BannerDrop'
import { PicketSign } from '../riot/layers/PicketSign'
import { GraffitiImage } from '../riot/layers/GraffitiImage'
import { ChantStream } from '../riot/layers/ChantStream'
import { SmokeCanvas } from '../riot/layers/SmokeCanvas'
import { HyperlinkLayer } from '../riot/layers/HyperlinkLayer'
import { LinkRail } from '../riot/layers/LinkRail'
import { TransitionFlash } from '../riot/layers/TransitionFlash'
import { BlackVoid } from '../riot/layers/BlackVoid'
import { ImageRepeat } from '../riot/layers/ImageRepeat'
import { Hearts } from '../riot/layers/Hearts'
import { Stamp } from '../ui/Stamp'
import { CommandBar } from '../ui/CommandBar'
import { Colophon } from '../ui/Colophon'
import type { StylePreset } from '../riot/styles'

export function StageScreen() {
  const status = useStore((s) => s.status)
  const content = useStore((s) => s.content)
  const intensity = useStore((s) => s.intensity)
  const paused = useStore((s) => s.paused)
  const errorMessage = useStore((s) => s.errorMessage)
  const reset = useStore((s) => s.reset)
  const ignite = useStore((s) => s.ignite)
  const history = useStore((s) => s.history)
  const transitionKey = useStore((s) => s.transitionKey)
  const progress = useStore((s) => s.progress)
  const style = useStageStyle()

  const [hint, setHint] = useState('')
  useEffect(() => {
    if (status !== 'revolting') return
    setHint(`◆ STAGE LIVE · 风格 :: ${style.nameEn} (${style.name})`)
    const t = setTimeout(() => setHint(''), 4500)
    return () => clearTimeout(t)
  }, [transitionKey, status, style.id])

  if (status === 'fetching' || status === 'parsing') {
    return (
      <>
        <LoadingScreen status={status} style={style} />
        <TransitionFlash trigger={transitionKey} />
      </>
    )
  }
  if (status === 'error') {
    return (
      <>
        <ErrorScreen message={errorMessage} onBack={reset} style={style} />
        <TransitionFlash trigger={transitionKey} />
      </>
    )
  }

  if (!content) return <LoadingScreen status="fetching" style={style} />

  return (
    <div className="relative w-full h-full bg-ink">
      <div
        data-riot-stage
        data-style={style.id}
        className="relative w-full h-full overflow-hidden"
        style={{ background: style.palette.ink, filter: style.filter }}
      >
        <BackgroundLayer style={style} />

        <SmokeCanvas intensity={intensity} paused={paused} tint={style.palette.primary} />
        <CharMarch chunks={content.textChunks} intensity={intensity} paused={paused} />
        <ImageRepeat images={content.images} intensity={intensity} paused={paused} url={content.source} />
        <GraffitiImage images={content.images} intensity={intensity} paused={paused} />
        <PicketSign
          words={content.words}
          intensity={intensity}
          paused={paused}
          legacyLink={style.addons.underlinedLinks}
        />
        <ChantStream words={content.words} intensity={intensity} paused={paused} />
        <BannerDrop chunks={content.textChunks} intensity={intensity} paused={paused} />

        <HyperlinkLayer
          links={content.links}
          intensity={intensity}
          paused={paused}
          onNavigate={ignite}
          legacyLink={style.addons.underlinedLinks}
        />

        {style.addons.blackVoids && (
          <BlackVoid intensity={intensity} paused={paused} url={content.source} />
        )}
        {style.addons.hearts && (
          <Hearts intensity={intensity} paused={paused} url={content.source} />
        )}

        <CenterBanner title={content.title} source={content.source} style={style} />

        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30">
          <Stamp
            text={`captured: ${safeHost(content.source)}`}
            rotate={-3}
            size={0.7}
            color="paper"
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/80 animate-flicker" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/40" />
        <div className="absolute inset-0 pointer-events-none riot-scanlines opacity-60" />
        <div className="absolute inset-0 pointer-events-none riot-noise" />
      </div>

      <TransitionFlash trigger={transitionKey} />

      {progress.phase === 'images' && progress.total > 0 && (
        <div className="fixed bottom-28 right-3 z-50 pointer-events-none">
          <div className="bg-ink/90 border border-primary/60 backdrop-blur-sm px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-primary">RIPPING IMAGES</span>
              <span className="text-secondary/70">
                {progress.done}/{progress.total}
              </span>
            </div>
            <div className="mt-1 w-32 h-0.5 bg-secondary/20 overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        </div>
      )}

      <LinkRail links={content.links} history={history} onNavigate={ignite} />

      {hint && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-ink/90 border border-primary/60 text-secondary font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 animate-flickerOn">
            {hint}
          </div>
        </div>
      )}

      <CommandBar />
      <Colophon />
    </div>
  )
}

function BackgroundLayer({ style }: { style: StylePreset }) {
  const { palette, bgPattern } = style
  const primaryA = hexWithAlpha(palette.primary, 0.35)
  const primaryB = hexWithAlpha(palette.primary, 0.18)
  const accentA = hexWithAlpha(palette.accent, 0.18)

  if (bgPattern === 'plain') {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${palette.glow} 0%, transparent 60%), ${palette.ink}`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 35% at 50% 0%, ${palette.glow} 0%, transparent 70%)`,
          }}
        />
      </>
    )
  }

  if (bgPattern === 'stripes') {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${palette.glow} 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, ${accentA} 0%, transparent 60%), ${palette.ink}`,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${primaryA} 0 2px, transparent 2px 18px), repeating-linear-gradient(-45deg, ${primaryA} 0 1px, transparent 1px 24px)`,
          }}
        />
      </>
    )
  }

  if (bgPattern === 'scan') {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${palette.glow} 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, ${accentA} 0%, transparent 60%), ${palette.ink}`,
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${primaryA} 0 1px, transparent 1px 4px)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${primaryA} 0 1px, transparent 1px 8px)`,
          }}
        />
      </>
    )
  }

  if (bgPattern === 'radial') {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${palette.glow} 0%, ${palette.ink} 60%), ${palette.ink}`,
          }}
        />
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${primaryB} 1px, transparent 1.5px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </>
    )
  }

  // grid (default)
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${palette.glow} 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, ${accentA} 0%, transparent 60%), ${palette.ink}`,
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(${palette.grid} 1px, transparent 1px), linear-gradient(90deg, ${palette.grid} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: 'perspective(800px) rotateX(50deg) translateY(40%) scale(1.4)',
          transformOrigin: 'center bottom',
          maskImage: 'linear-gradient(to top, black 0%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 35% at 50% 0%, ${palette.glow} 0%, transparent 70%)`,
        }}
      />
    </>
  )
}

function hexWithAlpha(hex: string, alpha: number): string {
  const c = hex.replace('#', '')
  const n = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function LoadingScreen({ status, style }: { status: 'fetching' | 'parsing'; style: StylePreset }) {
  const target = useStore((s) => s.target)
  const dots = useDots()
  const history = useStore((s) => s.history)
  const goBack = useStore((s) => s.goBack)

  return (
    <div
      data-style={style.id}
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: style.palette.ink, color: style.palette.secondary, filter: style.filter }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(45deg, transparent 0px, transparent 12px, ${hexWithAlpha(
            style.palette.primary,
            0.05,
          )} 12px, ${hexWithAlpha(style.palette.primary, 0.05)} 24px)`,
        }}
      />
      <div
        className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase border px-2 py-1"
        style={{ borderColor: style.palette.primary, color: style.palette.primary }}
      >
        ◆ 风格 :: {style.nameEn}
      </div>
      <div className="relative z-10 text-center max-w-2xl px-6 w-full">
        <div
          className="font-mono text-[10px] tracking-[0.4em] mb-4 animate-blink"
          style={{ color: style.palette.primary }}
        >
          {status === 'fetching' ? '◆ OCCUPYING ◆' : '◆ RIPPING ◆'}
        </div>
        <h1
          className="glitch font-stencil text-6xl md:text-8xl mb-8"
          data-text="RIOT"
          style={{ color: style.palette.secondary }}
        >
          RIOT
        </h1>
        <div className="font-mono text-xs md:text-sm break-all" style={{ color: style.palette.secondary }}>
          {status === 'fetching' ? '占领中' : '拆解中'}
          <span style={{ color: style.palette.primary }}>{dots}</span>
        </div>
        <div
          className="mt-2 font-mono text-[10px] tracking-widest break-all"
          style={{ color: style.palette.secondary, opacity: 0.5 }}
        >
          {target}
        </div>
        <div
          className="mt-8 w-64 h-1 mx-auto overflow-hidden"
          style={{ background: style.palette.shadow }}
        >
          <div
            className="h-full"
            style={{
              background: style.palette.primary,
              animation: `progress ${status === 'fetching' ? '2.4s' : '1.2s'} ease-in-out infinite`,
            }}
          />
        </div>

        {history.length > 1 && (
          <div className="mt-10">
            <div
              className="font-mono text-[9px] tracking-widest uppercase mb-2"
              style={{ color: style.palette.secondary, opacity: 0.4 }}
            >
              navigation chain
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1 mb-3 max-w-2xl mx-auto">
              {history.slice(-5).map((h, i, arr) => (
                <div key={`${h.url}-${i}`} className="flex items-center gap-1 font-mono text-[10px]">
                  <span
                    className="truncate max-w-[140px]"
                    title={h.url}
                    style={{ color: style.palette.secondary, opacity: 0.6 }}
                  >
                    {stripScheme(h.url)}
                  </span>
                  {i < arr.length - 1 && <span style={{ color: style.palette.primary }}>›</span>}
                </div>
              ))}
            </div>
            <button
              onClick={goBack}
              className="font-mono text-[10px] px-3 py-1 tracking-widest uppercase"
              style={{
                color: style.palette.primary,
                border: `1px solid ${style.palette.primary}`,
              }}
            >
              ◀ 中断 & 返回上一级
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes progress { 0% { width: 0%; transform: translateX(0); } 50% { width: 80%; transform: translateX(20%); } 100% { width: 0%; transform: translateX(0); } }`}</style>
    </div>
  )
}

function ErrorScreen({ message, onBack, style }: { message: string; onBack: () => void; style: StylePreset }) {
  return (
    <div
      data-style={style.id}
      className="relative w-full h-full overflow-hidden flex items-center justify-center px-6"
      style={{ background: style.palette.ink, color: style.palette.secondary, filter: style.filter }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${style.palette.glow} 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10 max-w-xl w-full text-center">
        <div
          className="font-mono text-[10px] tracking-[0.4em] mb-4"
          style={{ color: style.palette.primary }}
        >
          ◆ FAILURE :: {style.nameEn}
        </div>
        <h1
          className="glitch font-stencil text-5xl md:text-7xl mb-6"
          data-text="404"
          style={{ color: style.palette.secondary }}
        >
          404
        </h1>
        <div
          className="font-han mb-8 px-4 py-3 border whitespace-pre-line"
          style={{
            color: style.palette.secondary,
            borderColor: hexWithAlpha(style.palette.primary, 0.4),
            background: hexWithAlpha(style.palette.ink, 0.6),
          }}
        >
          {message}
        </div>
        <button
          onClick={onBack}
          className="font-stencil uppercase tracking-widest text-sm px-6 py-3 transition-colors"
          style={{
            background: style.palette.primary,
            color: style.palette.ink,
            boxShadow: `4px 4px 0 ${style.palette.secondary}, 8px 8px 0 ${style.palette.primary}`,
          }}
        >
          ← 撤离 ESC
        </button>
        <div
          className="mt-8 font-mono text-[10px] tracking-widest uppercase"
          style={{ color: style.palette.secondary, opacity: 0.4 }}
        >
          提示：某些网站会拒绝公共代理请求；可尝试 example.com / bbc.com / theguardian.com
        </div>
      </div>
    </div>
  )
}

function CenterBanner({
  title,
  source,
  style,
}: {
  title: string
  source: string
  style: StylePreset
}) {
  return (
    <div className="absolute inset-x-0 top-1/3 z-20 pointer-events-none flex flex-col items-center">
      <div
        className="font-stencil uppercase tracking-widest text-xs md:text-sm px-3 py-1 mb-2 animate-burn"
        style={{ background: style.palette.secondary, color: style.palette.ink }}
      >
        ◆ RIOT IN PROGRESS ◆
      </div>
      <div
        className="font-stencil text-[clamp(1.5rem,4vw,3rem)] text-center max-w-[80vw] leading-tight animate-flickerOn"
        style={{
          color: style.palette.secondary,
          textShadow: `3px 3px 0 ${style.palette.inkShadow}`,
        }}
      >
        {title}
      </div>
      <div
        className="mt-2 font-mono text-[10px] tracking-widest uppercase"
        style={{ color: style.palette.secondary, opacity: 0.5 }}
      >
        {safeHost(source)}
      </div>
    </div>
  )
}

function useDots() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v + 1) % 4), 320)
    return () => clearInterval(t)
  }, [])
  return ['.', '..', '...', '....'][n]
}

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, '').slice(0, 32)
}

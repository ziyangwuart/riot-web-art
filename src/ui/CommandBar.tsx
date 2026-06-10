import { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { useStageStyle } from '../hooks/useStageStyle'
import { IntensitySlider } from './IntensitySlider'

export function CommandBar() {
  const intensity = useStore((s) => s.intensity)
  const setIntensity = useStore((s) => s.setIntensity)
  const paused = useStore((s) => s.paused)
  const togglePause = useStore((s) => s.togglePause)
  const reset = useStore((s) => s.reset)
  const goBack = useStore((s) => s.goBack)
  const cycleStyle = useStore((s) => s.cycleStyle)
  const target = useStore((s) => s.target)
  const history = useStore((s) => s.history)
  const style = useStageStyle()
  const [snapHint, setSnapHint] = useState(false)
  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 9000)
    return () => clearTimeout(t)
  }, [])

  const exportPng = () => {
    const node = document.querySelector('[data-riot-stage]') as HTMLElement | null
    if (!node) return
    setSnapHint(true)
    setTimeout(() => setSnapHint(false), 1200)

    const rect = node.getBoundingClientRect()
    const w = Math.min(rect.width, 1600)
    const h = Math.min(rect.height, 1200)
    const clone = node.cloneNode(true) as HTMLElement
    clone.style.width = `${w}px`
    clone.style.height = `${h}px`
    clone.style.position = 'absolute'
    clone.style.left = '-99999px'
    clone.style.top = '0'
    document.body.appendChild(clone)

    const html = new XMLSerializer().serializeToString(clone)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <foreignObject width="100%" height="100%">${html.replace(/<script/g, '<x-script')}</foreignObject>
    </svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = style.palette.ink
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
      c.toBlob((b) => {
        if (!b) return
        const a = document.createElement('a')
        a.href = URL.createObjectURL(b)
        const host = (() => {
          try {
            return new URL(target).hostname.replace(/[^a-z0-9.-]/gi, '_')
          } catch {
            return 'stage'
          }
        })()
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
        a.download = `riot-${host}-${style.id}-${ts}.png`
        a.click()
        URL.revokeObjectURL(a.href)
      }, 'image/png')
      URL.revokeObjectURL(url)
      document.body.removeChild(clone)
    }
    img.onerror = () => {
      document.body.removeChild(clone)
    }
    img.src = url
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        reset()
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePause()
      } else if (e.key === 's' || e.key === 'S') {
        exportPng()
      } else if (e.key === 'b' || e.key === 'B') {
        goBack()
      } else if (e.key === 'r' || e.key === 'R') {
        cycleStyle()
      } else if (e.key === '?') {
        setShowTip((s) => !s)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, style.id])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-start justify-between p-3 gap-3">
        <div className="pointer-events-auto bg-ink/80 border border-primary/40 backdrop-blur-sm p-2 flex flex-col gap-1.5 max-w-[280px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary animate-flicker" />
            <span className="font-stencil text-secondary text-xs tracking-[0.2em]">RIOT.OPS</span>
            <span className="font-mono text-[9px] text-secondary/40 ml-1">
              {history.length > 0 ? `step ${history.length}` : ''}
            </span>
          </div>
          <div className="font-mono text-[9px] text-secondary/60 truncate" title={target}>
            TARGET :: {target.replace(/^https?:\/\//, '')}
          </div>
          {history.length > 1 && (
            <button
              onClick={goBack}
              className="font-mono text-[9px] text-primary hover:text-secondary border border-primary/40 hover:bg-primary px-1.5 py-0.5 self-start"
            >
              ◀ 返回上一级 (B)
            </button>
          )}
        </div>

        {/* 中央：风格名 + 强度 */}
        <div className="pointer-events-auto bg-ink/80 border border-secondary/20 backdrop-blur-sm p-2 w-[300px] flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className="w-2 h-2 shrink-0"
                style={{ background: style.palette.primary }}
              />
              <span
                className="font-stencil text-[10px] tracking-widest uppercase truncate"
                style={{ color: style.palette.primary }}
              >
                STYLE :: {style.nameEn}
              </span>
              <span className="font-mono text-[9px] text-secondary/40 truncate">/ {style.name}</span>
            </div>
            <button
              onClick={cycleStyle}
              className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border hover:bg-primary hover:text-secondary"
              style={{ borderColor: style.palette.primary, color: style.palette.primary }}
              title="换一个风格 (R)"
            >
              ↻ 换皮 R
            </button>
          </div>
          <IntensitySlider value={intensity} onChange={setIntensity} />
        </div>

        <div className="pointer-events-auto flex flex-col gap-1.5 items-end">
          <div className="flex gap-1.5">
            <button
              onClick={togglePause}
              className="bg-ink/80 border border-secondary/30 hover:border-secondary hover:bg-secondary hover:text-ink text-secondary font-mono text-[10px] uppercase tracking-widest px-2 py-1 transition-colors"
            >
              {paused ? '▶ Resume' : '❚❚ Pause'}
            </button>
            <button
              onClick={exportPng}
              className="bg-ink/80 border border-primary/60 hover:bg-primary hover:text-secondary text-primary font-mono text-[10px] uppercase tracking-widest px-2 py-1 transition-colors"
            >
              ◉ Snap
            </button>
          </div>
          <button
            onClick={reset}
            className="bg-ink/80 border border-secondary/30 hover:bg-secondary hover:text-ink text-secondary font-mono text-[10px] uppercase tracking-widest px-2 py-1 transition-colors w-full"
          >
            ✕ 撤离 / ESC
          </button>
        </div>
      </div>

      {showTip && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-ink/90 border border-primary/60 text-secondary font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 animate-flickerOn">
            ◆ 点击 LINK 海报起义 · R 换风格 · S 截图 · B 返回 · 空格暂停
          </div>
        </div>
      )}

      {snapHint && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-none">
          <div
            className="font-stencil px-3 py-1 text-xs tracking-widest animate-flickerOn"
            style={{ background: style.palette.primary, color: style.palette.secondary }}
          >
            ◆ FRAME CAPTURED · {style.nameEn}
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
    </div>
  )
}

// 烟雾层：Canvas 2D 噪声粒子，鼠标移动产生扰动
import { useEffect, useRef } from 'react'
import type { Intensity } from '../../types'

interface SmokeCanvasProps {
  intensity: Intensity
  paused: boolean
  tint?: string
}

export function SmokeCanvas({ intensity, paused, tint = '#d72638' }: SmokeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const baseCount = 80
    const intensityMul = intensity
    const count = Math.floor(baseCount * (0.5 + intensityMul * 0.4))

    interface P {
      x: number
      y: number
      vx: number
      vy: number
      r: number
      life: number
      max: number
      hue: number
    }
    const parts: P[] = []
    // 把传入的 tint 转成 hsl，供颗粒调色用
    function hexToHsl(hex: string): number {
      const c = hex.replace('#', '')
      const n = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16)
      const r = ((n >> 16) & 255) / 255
      const g = ((n >> 8) & 255) / 255
      const b = (n & 255) / 255
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      const d = max - min
      if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6
        else if (max === g) h = (b - r) / d + 2
        else h = (r - g) / d + 4
        h = Math.round(h * 60)
        if (h < 0) h += 360
      }
      return h
    }
    const baseHue = hexToHsl(tint)
    for (let i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.1,
        r: 30 + Math.random() * 80,
        life: 0,
        max: 200 + Math.random() * 300,
        hue: baseHue + (Math.random() - 0.5) * 30,
      })
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }
    const onLeave = () => {
      mouseRef.current.active = false
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    let last = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(50, t - last)
      last = t

      ctx.fillStyle = 'rgba(10, 10, 10, 0.18)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      if (paused) {
        raf = requestAnimationFrame(loop)
        return
      }

      for (const p of parts) {
        p.life += dt
        p.x += p.vx * dt * 0.1
        p.y += p.vy * dt * 0.1

        // 鼠标斥力
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const d = Math.hypot(dx, dy)
          if (d < 200 && d > 1) {
            const f = (1 - d / 200) * 0.5
            p.x += (dx / d) * f * 4
            p.y += (dy / d) * f * 4
          }
        }

        // 重生
        if (p.life > p.max || p.y < -p.r) {
          p.x = Math.random() * window.innerWidth
          p.y = window.innerHeight + p.r
          p.r = 30 + Math.random() * 80
          p.life = 0
          p.vx = (Math.random() - 0.5) * 0.4
          p.vy = -Math.random() * 0.6 - 0.1
          p.hue = Math.random() > 0.7 ? 18 : Math.random() > 0.5 ? 35 : 200
        }

        const a = 0.04 * (1 - p.life / p.max)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        grad.addColorStop(0, `hsla(${p.hue}, 30%, 30%, ${a * 1.5})`)
        grad.addColorStop(0.5, `hsla(${p.hue}, 20%, 20%, ${a * 0.7})`)
        grad.addColorStop(1, 'hsla(0,0%,0%,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [intensity, paused])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity: 0.7 }}
      aria-hidden
    />
  )
}

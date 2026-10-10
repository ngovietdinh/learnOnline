import { useEffect, useRef } from 'react'
import { attachFxCanvas, fx, resize } from '../core/fx'

/** Lớp hiệu ứng phủ trên cùng + hạt lấp lánh mỗi khi chạm vào nút. */
export function FxLayer() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    attachFxCanvas(ref.current)
    const onResize = () => resize()
    const onDown = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.('button, .choice, a')
      if (!btn || (btn as HTMLButtonElement).disabled) return
      const stage = document.documentElement.dataset.stage
      fx.sparkle(e.clientX, e.clientY, stage === 'mam' || stage === 'choi' ? 12 : 7)
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('pointerdown', onDown)
      attachFxCanvas(null)
    }
  }, [])
  return <canvas ref={ref} className="fx-layer" aria-hidden />
}

type Kind = 'bubbles' | 'stars' | 'clouds' | 'shapes' | 'space' | 'bokeh'

const KIND: Record<string, Kind> = { mam: 'bubbles', choi: 'stars', tieuhoc: 'clouds', thcs: 'shapes', thpt: 'space', neutral: 'bokeh' }

interface Mote {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  rot: number
  vr: number
  hue: number
  phase: number
  sides: number
}

/** Nền chuyển động nhẹ nhàng, khác nhau theo lứa tuổi: bong bóng, sao, mây, hình học, vũ trụ. */
export function AmbientBackground({ stage }: { stage: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const kind = KIND[stage] ?? 'bokeh'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const css = getComputedStyle(document.documentElement)
    const colors = ['--blob1', '--blob2', '--blob3', '--accent', '--accent-2'].map((v) => css.getPropertyValue(v).trim() || '#a5b4fc')
    let w = 0
    let h = 0
    const fit = () => {
      const dpr = Math.min(2, devicePixelRatio || 1)
      w = innerWidth
      h = innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()
    const count = { bubbles: 22, stars: 34, clouds: 9, shapes: 18, space: 120, bokeh: 16 }[kind]
    const motes: Mote[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: kind === 'space' ? Math.random() * 1.6 + 0.3 : kind === 'clouds' ? 40 + Math.random() * 50 : kind === 'stars' ? 3 + Math.random() * 6 : 10 + Math.random() * 34,
      vx: kind === 'clouds' ? 0.15 + Math.random() * 0.25 : (Math.random() - 0.5) * 0.3,
      vy: kind === 'bubbles' ? -(0.25 + Math.random() * 0.6) : kind === 'space' ? 0.05 : (Math.random() - 0.5) * 0.3,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.01,
      hue: i % colors.length,
      phase: Math.random() * Math.PI * 2,
      sides: 3 + (i % 3),
    }))
    let shooting: { x: number; y: number; t: number } | null = null
    let raf = 0
    let t = 0

    const draw = () => {
      t++
      ctx.clearRect(0, 0, w, h)
      for (const m of motes) {
        m.x += m.vx
        m.y += m.vy
        m.rot += m.vr
        if (m.y < -80) m.y = h + 60
        if (m.y > h + 80) m.y = -60
        if (m.x < -120) m.x = w + 100
        if (m.x > w + 120) m.x = -100
        const tw = 0.5 + 0.5 * Math.sin(t * 0.03 + m.phase)
        ctx.save()
        ctx.translate(m.x + (kind === 'bubbles' ? Math.sin(t * 0.02 + m.phase) * 12 : 0), m.y)
        ctx.rotate(m.rot)
        const c = colors[m.hue]
        switch (kind) {
          case 'bubbles': {
            ctx.globalAlpha = 0.45
            const g = ctx.createRadialGradient(-m.r * 0.35, -m.r * 0.35, m.r * 0.1, 0, 0, m.r)
            g.addColorStop(0, 'rgba(255,255,255,.9)')
            g.addColorStop(0.35, c)
            g.addColorStop(1, 'rgba(255,255,255,.15)')
            ctx.fillStyle = g
            ctx.beginPath()
            ctx.arc(0, 0, m.r, 0, Math.PI * 2)
            ctx.fill()
            break
          }
          case 'stars':
            ctx.globalAlpha = 0.35 + tw * 0.55
            ctx.fillStyle = c
            ctx.beginPath()
            for (let i = 0; i < 10; i++) {
              const a = (i * Math.PI) / 5
              const rr = i % 2 ? m.r * 0.45 : m.r * (0.8 + tw * 0.4)
              ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
            }
            ctx.fill()
            break
          case 'clouds':
            ctx.rotate(-m.rot)
            ctx.globalAlpha = 0.55
            ctx.fillStyle = '#ffffff'
            for (const [dx, dy, rr] of [[0, 0, 1], [m.r * 0.7, 6, 0.75], [-m.r * 0.7, 8, 0.7], [m.r * 0.25, -m.r * 0.35, 0.7]])
              (ctx.beginPath(), ctx.arc(dx, dy, m.r * 0.55 * rr, 0, Math.PI * 2), ctx.fill())
            break
          case 'shapes':
            ctx.globalAlpha = 0.35
            ctx.strokeStyle = c
            ctx.lineWidth = 2.5
            ctx.beginPath()
            if (m.sides === 5) ctx.arc(0, 0, m.r * 0.6, 0, Math.PI * 2)
            else for (let i = 0; i <= m.sides; i++) ctx.lineTo(Math.cos((i / m.sides) * Math.PI * 2) * m.r * 0.7, Math.sin((i / m.sides) * Math.PI * 2) * m.r * 0.7)
            ctx.stroke()
            break
          case 'space':
            ctx.globalAlpha = 0.25 + tw * 0.75
            ctx.fillStyle = m.hue % 3 ? '#e0e7ff' : c
            ctx.beginPath()
            ctx.arc(0, 0, m.r, 0, Math.PI * 2)
            ctx.fill()
            break
          default:
            ctx.globalAlpha = 0.18 + tw * 0.12
            ctx.fillStyle = c
            ctx.beginPath()
            ctx.arc(0, 0, m.r, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.restore()
      }
      if (kind === 'space') {
        if (!shooting && Math.random() < 0.004) shooting = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.4, t: 0 }
        if (shooting) {
          shooting.t++
          const sx = shooting.x + shooting.t * 9
          const sy = shooting.y + shooting.t * 4
          const g = ctx.createLinearGradient(sx - 90, sy - 40, sx, sy)
          g.addColorStop(0, 'rgba(255,255,255,0)')
          g.addColorStop(1, 'rgba(255,255,255,.9)')
          ctx.strokeStyle = g
          ctx.lineWidth = 2
          ctx.globalAlpha = 1 - shooting.t / 40
          ctx.beginPath()
          ctx.moveTo(sx - 90, sy - 40)
          ctx.lineTo(sx, sy)
          ctx.stroke()
          ctx.globalAlpha = 1
          if (shooting.t > 40) shooting = null
        }
      }
      if (!reduced && !document.hidden) raf = requestAnimationFrame(draw)
    }
    draw()
    const onVis = () => {
      if (!document.hidden && !reduced) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(draw)
      }
    }
    window.addEventListener('resize', fit)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', fit)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [stage])
  return <canvas ref={ref} className="ambient" aria-hidden />
}

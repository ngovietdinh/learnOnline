// Hiệu ứng hạt trên một lớp canvas phủ toàn màn hình: tia sao, pháo giấy, pháo hoa, chữ bay.
// Gọi được từ bất cứ đâu: fx.burst(x, y), fx.fireworks(), fx.floatText(x, y, '+10 ⭐').

type Shape = 'star' | 'circle' | 'confetti' | 'heart' | 'text' | 'rocket' | 'ring'

interface P {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
  shape: Shape
  rot: number
  vr: number
  g: number
  drag: number
  text?: string
  /** Pháo hoa: nổ khi hết đà bay lên. */
  explode?: string[]
}

const PALETTE = ['#ff5d8f', '#ffd23f', '#3bceac', '#4f8cff', '#a855f7', '#fb923c', '#22d3ee', '#f43f5e']

let canvas: HTMLCanvasElement | null = null
let c2d: CanvasRenderingContext2D | null = null
let parts: P[] = []
let raf = 0
let reduced = false

export function attachFxCanvas(el: HTMLCanvasElement | null) {
  canvas = el
  c2d = el?.getContext('2d') ?? null
  reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
}

export function resize() {
  if (!canvas) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  c2d?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const pickColor = (cs?: string[]) => (cs ?? PALETTE)[Math.floor(Math.random() * (cs ?? PALETTE).length)]

function add(p: Partial<P> & Pick<P, 'x' | 'y'>) {
  if (reduced || !c2d) return
  parts.push({
    vx: 0, vy: 0, life: 0, max: 60, size: 8, color: pickColor(), shape: 'circle',
    rot: Math.random() * Math.PI, vr: rnd(-0.2, 0.2), g: 0.15, drag: 0.98, ...p,
  })
  if (!raf) raf = requestAnimationFrame(loop)
}

function star(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2
    const rr = i % 2 ? r * 0.45 : r
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
  }
  ctx.closePath()
  ctx.fill()
}

function heart(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath()
  ctx.moveTo(0, r * 0.35)
  ctx.bezierCurveTo(-r, -r * 0.4, -r * 0.4, -r, 0, -r * 0.35)
  ctx.bezierCurveTo(r * 0.4, -r, r, -r * 0.4, 0, r * 0.35)
  ctx.fill()
}

function loop() {
  raf = 0
  if (!c2d || !canvas) return
  const ctx = c2d
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  const born: P[] = []
  parts = parts.filter((p) => {
    p.life++
    p.vx *= p.drag
    p.vy = p.vy * p.drag + p.g
    p.x += p.vx
    p.y += p.vy
    p.rot += p.vr
    if (p.shape === 'rocket' && (p.vy >= -0.5 || p.life > p.max)) {
      const colors = p.explode ?? PALETTE
      for (let i = 0; i < 70; i++) {
        const a = (i / 70) * Math.PI * 2
        const sp = rnd(2, 6.5)
        born.push({
          x: p.x, y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rnd(50, 80),
          size: rnd(2, 3.5), color: pickColor(colors), shape: i % 5 ? 'circle' : 'star', rot: 0, vr: 0.1, g: 0.06, drag: 0.965,
        })
      }
      born.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0, max: 30, size: 10, color: colors[0], shape: 'ring', rot: 0, vr: 0, g: 0, drag: 1 })
      return false
    }
    const t = p.life / p.max
    if (t >= 1) return false
    ctx.save()
    ctx.globalAlpha = p.shape === 'text' ? Math.min(1, (1 - t) * 2) : 1 - t * t
    ctx.translate(p.x, p.y)
    ctx.rotate(p.shape === 'text' ? 0 : p.rot)
    ctx.fillStyle = p.color
    switch (p.shape) {
      case 'star':
        star(ctx, p.size)
        break
      case 'heart':
        heart(ctx, p.size)
        break
      case 'confetti':
        ctx.scale(1, Math.cos(p.rot * 2))
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        break
      case 'ring':
        ctx.strokeStyle = p.color
        ctx.lineWidth = 3 * (1 - t)
        ctx.beginPath()
        ctx.arc(0, 0, p.size + t * 90, 0, Math.PI * 2)
        ctx.stroke()
        break
      case 'rocket':
        ctx.shadowColor = p.color
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(0, 0, 3, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'text': {
        const s = 1 + Math.sin(Math.min(1, t * 4) * Math.PI) * 0.25
        ctx.scale(s, s)
        ctx.font = `800 ${p.size}px "Baloo 2", system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.lineWidth = 5
        ctx.strokeStyle = 'rgba(255,255,255,.95)'
        ctx.strokeText(p.text ?? '', 0, 0)
        ctx.fillText(p.text ?? '', 0, 0)
        break
      }
      default:
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
    }
    ctx.restore()
    // vệt sáng của pháo hoa đang bay
    if (p.shape === 'rocket' && p.life % 2 === 0)
      born.push({ x: p.x, y: p.y, vx: rnd(-0.3, 0.3), vy: rnd(0, 0.5), life: 0, max: 20, size: 1.6, color: '#ffe8a3', shape: 'circle', rot: 0, vr: 0, g: 0.02, drag: 0.95 })
    return true
  })
  parts.push(...born)
  if (parts.length) raf = requestAnimationFrame(loop)
  else ctx.clearRect(0, 0, innerWidth, innerHeight)
}

export const fx = {
  /** Tia sao bung ra từ một điểm — khi trả lời đúng. */
  burst(x: number, y: number, o: { count?: number; colors?: string[]; shapes?: Shape[]; power?: number } = {}) {
    const n = o.count ?? 26
    const shapes = o.shapes ?? ['star', 'circle', 'confetti']
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2)
      const sp = rnd(2, 7) * (o.power ?? 1)
      add({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, max: rnd(40, 70), size: rnd(4, 9),
        color: pickColor(o.colors), shape: shapes[i % shapes.length], g: 0.18, drag: 0.95,
      })
    }
  },
  /** Hạt nhỏ khi chạm vào nút. */
  sparkle(x: number, y: number, n = 8) {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2)
      add({ x, y, vx: Math.cos(a) * rnd(1, 3.5), vy: Math.sin(a) * rnd(1, 3.5), max: rnd(18, 30), size: rnd(2, 4.5), shape: i % 2 ? 'star' : 'circle', g: 0.05, drag: 0.92 })
    }
  },
  /** Bụi nhỏ khi trả lời sai — nhẹ nhàng, không gây buồn. */
  puff(x: number, y: number) {
    for (let i = 0; i < 10; i++) {
      const a = rnd(0, Math.PI * 2)
      add({ x, y, vx: Math.cos(a) * rnd(0.5, 2), vy: Math.sin(a) * rnd(0.5, 2) - 0.5, max: 35, size: rnd(4, 8), color: 'rgba(148,163,184,.6)', shape: 'circle', g: -0.02, drag: 0.94 })
    }
  },
  floatText(x: number, y: number, text: string, color = '#f59e0b', size = 30) {
    add({ x, y, vy: -1.6, g: 0.012, drag: 0.99, max: 75, size, color, shape: 'text', text, vr: 0 })
  },
  hearts(x: number, y: number, n = 8) {
    for (let i = 0; i < n; i++) add({ x: x + rnd(-30, 30), y, vx: rnd(-1, 1), vy: rnd(-3.5, -1.5), max: rnd(60, 90), size: rnd(8, 14), color: pickColor(['#ff5d8f', '#f43f5e', '#fb7185']), shape: 'heart', g: -0.01, drag: 0.99, vr: rnd(-0.03, 0.03) })
  },
  /** Mưa pháo giấy từ trên xuống. */
  confettiRain(n = 140) {
    for (let i = 0; i < n; i++)
      add({ x: rnd(0, innerWidth), y: rnd(-innerHeight * 0.6, -10), vx: rnd(-1.5, 1.5), vy: rnd(1, 4), max: rnd(140, 220), size: rnd(8, 14), shape: i % 4 ? 'confetti' : 'star', g: 0.04, drag: 0.995, vr: rnd(-0.25, 0.25) })
  },
  /** Bắn pháo hoa — khi hoàn thành bài. */
  fireworks(shots = 6, onShot?: () => void) {
    if (reduced) return
    for (let i = 0; i < shots; i++) {
      setTimeout(() => {
        onShot?.()
        const colors = [pickColor(), pickColor(), '#ffffff']
        add({ x: rnd(innerWidth * 0.15, innerWidth * 0.85), y: innerHeight + 10, vx: rnd(-1.2, 1.2), vy: -rnd(11, 15), max: 90, shape: 'rocket', color: colors[0], g: 0.17, drag: 0.995, explode: colors })
      }, i * 420)
    }
  },
}

/** Toạ độ tâm của một phần tử trên màn hình. */
export function centerOf(el: Element | null): [number, number] {
  if (!el) return [innerWidth / 2, innerHeight / 2]
  const r = el.getBoundingClientRect()
  return [r.left + r.width / 2, r.top + r.height / 2]
}

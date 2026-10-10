// Âm thanh vui nhộn tổng hợp bằng WebAudio — không cần tệp âm thanh, chạy cả khi ngoại tuyến.
// Gồm hiệu ứng (chạm, đúng, sai, lên cấp, chiến thắng…) và nhạc nền hộp nhạc tự sáng tác.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = true

export function setSoundEnabled(on: boolean) {
  enabled = on
  if (!on) stopMusic()
}

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = 0.9
      master.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

interface ToneOpts {
  type?: OscillatorType
  gain?: number
  /** Trượt cao độ tới tần số này (Hz) — tạo tiếng "vút", "boing". */
  slideTo?: number
  attack?: number
  dest?: AudioNode
}

function tone(freq: number, start: number, dur: number, o: ToneOpts = {}) {
  const a = ac()
  if (!a || !master) return
  const t0 = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = o.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, t0)
  if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur)
  const peak = o.gain ?? 0.18
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + (o.attack ?? 0.015))
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(o.dest ?? master)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

/** Tiếng ồn trắng lọc dải — dùng cho "vút", "lấp lánh", tiếng trống. */
function noise(start: number, dur: number, freq: number, q = 1, gain = 0.12, sweepTo?: number) {
  const a = ac()
  if (!a || !master) return
  const t0 = a.currentTime + start
  const len = Math.ceil(a.sampleRate * dur)
  const buf = a.createBuffer(1, len, a.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = a.createBufferSource()
  src.buffer = buf
  const f = a.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(freq, t0)
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur)
  f.Q.value = q
  const g = a.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + dur * 0.25)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f).connect(g).connect(master)
  src.start(t0)
  src.stop(t0 + dur + 0.05)
}

const N = (semi: number) => 523.25 * 2 ** (semi / 12) // tính từ Đô (C5)

const CORRECT_JINGLES: (() => void)[] = [
  // Đô – Mi – Sol – Đô cao
  () => [0, 4, 7, 12].forEach((s, i) => tone(N(s), i * 0.07, 0.22, { type: 'triangle', gain: 0.16 })),
  // Ting–ting lấp lánh
  () => {
    tone(N(12), 0, 0.18, { type: 'sine', gain: 0.2 })
    tone(N(16), 0.09, 0.35, { type: 'sine', gain: 0.18 })
    noise(0.05, 0.3, 7000, 2, 0.05)
  },
  // Hợp âm vui
  () => {
    ;[0, 4, 7].forEach((s) => tone(N(s + 5), 0, 0.12, { type: 'square', gain: 0.05 }))
    ;[0, 4, 7, 12].forEach((s) => tone(N(s + 7), 0.12, 0.3, { type: 'triangle', gain: 0.07 }))
  },
]

export const sfx = {
  tap: () => tone(880, 0, 0.07, { type: 'triangle', gain: 0.1, slideTo: 1200 }),
  pop: () => {
    tone(400, 0, 0.09, { type: 'sine', gain: 0.22, slideTo: 900 })
    tone(1200, 0.04, 0.06, { type: 'sine', gain: 0.08 })
  },
  /** Tiếng lò xo — bé chạm vào thẻ. */
  boing: () => {
    tone(180, 0, 0.35, { type: 'sine', gain: 0.22, slideTo: 620 })
    tone(260, 0.02, 0.3, { type: 'triangle', gain: 0.06, slideTo: 900 })
  },
  whoosh: () => noise(0, 0.35, 400, 0.8, 0.09, 3000),
  sparkle: () => {
    ;[24, 28, 31, 36].forEach((s, i) => tone(N(s), i * 0.045, 0.15, { type: 'sine', gain: 0.06 }))
    noise(0, 0.25, 8000, 3, 0.03)
  },
  correct: () => CORRECT_JINGLES[Math.floor(Math.random() * CORRECT_JINGLES.length)](),
  /** Sai: tiếng "oạp oạp" hoạt hình nhẹ nhàng, không gây sợ. */
  wrong: () => {
    tone(330, 0, 0.18, { type: 'triangle', gain: 0.14, slideTo: 260 })
    tone(260, 0.18, 0.28, { type: 'triangle', gain: 0.12, slideTo: 196 })
  },
  levelUp: () => {
    ;[0, 4, 7, 12, 16, 19, 24].forEach((s, i) => tone(N(s), i * 0.06, 0.25, { type: 'triangle', gain: 0.12 }))
    noise(0.3, 0.5, 6000, 2, 0.05)
  },
  /** Kèn chiến thắng + trống. */
  celebrate: () => {
    const notes: [number, number, number][] = [
      [0, 0, 0.12],
      [4, 0.12, 0.12],
      [7, 0.24, 0.12],
      [12, 0.36, 0.3],
      [7, 0.66, 0.12],
      [12, 0.78, 0.6],
    ]
    notes.forEach(([s, t, d]) => {
      tone(N(s), t, d + 0.1, { type: 'sawtooth', gain: 0.05 })
      tone(N(s), t, d + 0.1, { type: 'triangle', gain: 0.1 })
    })
    ;[0, 0.36, 0.78].forEach((t) => {
      tone(110, t, 0.25, { type: 'sine', gain: 0.25, slideTo: 50 })
      noise(t, 0.12, 2500, 0.7, 0.06)
    })
    noise(0.8, 0.9, 7000, 2, 0.05)
  },
  firework: () => {
    tone(300, 0, 0.5, { type: 'sine', gain: 0.05, slideTo: 1400 })
    noise(0.5, 0.6, 1800, 0.5, 0.12)
  },
}

// ───────────────────────── Nhạc nền hộp nhạc ─────────────────────────

let musicTimer: ReturnType<typeof setInterval> | null = null
let musicGain: GainNode | null = null
let step = 0

// Ngũ cung (thang âm vui, không bao giờ "phô") và vòng hợp âm I – V – vi – IV.
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16]
const CHORDS = [0, 7, 9, 5]

export function startMusic() {
  const a = ac()
  if (!a || !master || musicTimer || !enabled) return
  musicGain = a.createGain()
  musicGain.gain.value = 0.35
  musicGain.connect(master)
  const beat = 0.28
  let last = 4
  musicTimer = setInterval(() => {
    if (!musicGain) return
    const bar = Math.floor(step / 8) % CHORDS.length
    const root = CHORDS[bar]
    if (step % 8 === 0) {
      tone(N(root - 24), 0, beat * 7, { type: 'sine', gain: 0.1, dest: musicGain, attack: 0.05 })
      tone(N(root - 12 + 4), 0, beat * 7, { type: 'sine', gain: 0.04, dest: musicGain, attack: 0.1 })
    }
    // Giai điệu bước nhỏ, thỉnh thoảng nghỉ — nghe như hộp nhạc.
    if (Math.random() > 0.22) {
      const move = [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]
      last = Math.max(0, Math.min(PENTA.length - 1, last + move))
      tone(N(PENTA[last] + root), 0, beat * 1.6, { type: 'sine', gain: 0.09, dest: musicGain })
      tone(N(PENTA[last] + root + 12), 0, beat * 0.6, { type: 'sine', gain: 0.02, dest: musicGain })
    }
    step++
  }, beat * 1000)
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer)
  musicTimer = null
  if (musicGain && ctx) {
    musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.2)
    const g = musicGain
    setTimeout(() => g.disconnect(), 800)
  }
  musicGain = null
}

/** Hạ nhỏ nhạc nền khi đang đọc lời, để nghe rõ tiếng Việt. */
export function duckMusic(on: boolean) {
  if (musicGain && ctx) musicGain.gain.setTargetAtTime(on ? 0.12 : 0.35, ctx.currentTime, 0.15)
}

export function isMusicPlaying() {
  return musicTimer !== null
}

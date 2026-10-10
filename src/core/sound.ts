// Âm thanh tổng hợp bằng WebAudio — không cần tệp âm thanh, chạy cả khi ngoại tuyến.

let ctx: AudioContext | null = null
let enabled = true

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function ac(): AudioContext | null {
  if (!enabled || typeof window === 'undefined') return null
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.18) {
  const a = ac()
  if (!a) return
  const t0 = a.currentTime + start
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(a.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

export const sfx = {
  tap: () => tone(660, 0, 0.09, 'triangle', 0.12),
  pop: () => {
    tone(520, 0, 0.07, 'sine', 0.15)
    tone(880, 0.05, 0.08, 'sine', 0.12)
  },
  correct: () => {
    tone(784, 0, 0.14, 'triangle')
    tone(1047, 0.1, 0.22, 'triangle')
  },
  wrong: () => {
    tone(330, 0, 0.16, 'sine', 0.14)
    tone(262, 0.12, 0.22, 'sine', 0.12)
  },
  levelUp: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.2, 'triangle', 0.15)),
  celebrate: () =>
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle', 0.14)),
}

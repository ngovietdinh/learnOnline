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

// ───────────────────────── Nhạc nền thiếu nhi ─────────────────────────
// Ba bản nhạc tự soạn (không vướng bản quyền), phát bằng bộ lập lịch chính xác của WebAudio:
//  • nha  — trang chính: vui tươi, nhún nhảy
//  • hoc  — lúc học: nhẹ nhàng như hộp nhạc, không làm xao nhãng
//  • choi — lúc chơi: nhanh, rộn ràng, có tiếng vỗ tay

export type Track = 'nha' | 'hoc' | 'choi'

interface Song {
  bpm: number
  /** Hợp âm mỗi ô nhịp (bán cung so với Đô). */
  chords: number[][]
  /** Giai điệu: mỗi ô nhịp 8 nốt móc đơn; null = nghỉ. */
  melody: (number | null)[][]
  drums: boolean
  lead: 'marimba' | 'musicbox' | 'pluck'
}

const C = [0, 4, 7]
const G = [7, 11, 14]
const Am = [9, 12, 16]
const F = [5, 9, 12]
const Dm = [2, 5, 9]
const Em = [4, 7, 11]

const SONGS: Record<Track, Song> = {
  nha: {
    bpm: 108,
    chords: [C, G, Am, F, C, F, G, C],
    melody: [
      [12, null, 16, 19, 16, null, 12, null],
      [14, null, 11, 14, 19, null, null, null],
      [16, null, 12, 16, 21, 19, 16, null],
      [17, null, 16, 14, 12, null, null, null],
      [12, 14, 16, null, 19, null, 16, null],
      [17, null, 21, null, 19, 17, 16, null],
      [14, null, 19, null, 17, 16, 14, null],
      [12, null, null, null, 7, null, 12, null],
    ],
    drums: true,
    lead: 'pluck',
  },
  hoc: {
    bpm: 84,
    chords: [C, Am, F, G, C, Em, F, G],
    melody: [
      [24, null, 19, null, 16, null, 19, null],
      [21, null, null, 19, 16, null, null, null],
      [17, null, 21, null, 24, null, 21, null],
      [19, null, null, null, 14, null, null, null],
      [16, null, 19, null, 24, null, 23, null],
      [19, null, null, 16, 19, null, null, null],
      [21, null, 24, null, 21, null, 17, null],
      [19, null, null, null, null, null, null, null],
    ],
    drums: false,
    lead: 'musicbox',
  },
  choi: {
    bpm: 132,
    chords: [C, F, G, C, Am, Dm, G, C],
    melody: [
      [12, 12, 16, 19, 24, 19, 16, 19],
      [17, 21, 24, 21, 17, null, 21, null],
      [19, 23, 26, 23, 19, 17, 16, 14],
      [12, 16, 19, 16, 12, null, null, null],
      [21, 19, 16, 21, 24, 21, 19, 16],
      [17, 14, 17, 21, 26, 24, 21, 17],
      [19, 19, 23, 26, 23, 19, 17, 14],
      [24, null, 19, null, 12, null, null, null],
    ],
    drums: true,
    lead: 'marimba',
  },
}

let musicGain: GainNode | null = null
let track: Track = 'nha'
let schedTimer: ReturnType<typeof setInterval> | null = null
let nextTime = 0
let stepIdx = 0
const BASE_VOL = 0.32

function inst(kind: Song['lead'], freq: number, t: number, dur: number, dest: AudioNode, vol: number) {
  const a = ctx!
  const g = a.createGain()
  g.connect(dest)
  const o = a.createOscillator()
  const decay = kind === 'musicbox' ? dur * 2.2 : kind === 'marimba' ? 0.35 : 0.45
  o.type = kind === 'pluck' ? 'triangle' : 'sine'
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
  o.connect(g)
  o.start(t)
  o.stop(t + decay + 0.05)
  // Bồi âm: mộc cầm có bồi âm x4, hộp nhạc có tiếng "ting" x3
  const over = kind === 'marimba' ? 4 : kind === 'musicbox' ? 3 : 2
  const o2 = a.createOscillator()
  const g2 = a.createGain()
  o2.type = 'sine'
  o2.frequency.setValueAtTime(freq * over, t)
  g2.gain.setValueAtTime(vol * 0.25, t)
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  o2.connect(g2).connect(dest)
  o2.start(t)
  o2.stop(t + 0.15)
}

function drum(kind: 'kick' | 'shaker' | 'clap', t: number, dest: AudioNode) {
  const a = ctx!
  if (kind === 'kick') {
    const o = a.createOscillator()
    const g = a.createGain()
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(45, t + 0.15)
    g.gain.setValueAtTime(0.5, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
    o.connect(g).connect(dest)
    o.start(t)
    o.stop(t + 0.22)
    return
  }
  const dur = kind === 'shaker' ? 0.05 : 0.12
  const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = a.createBufferSource()
  src.buffer = buf
  const f = a.createBiquadFilter()
  f.type = kind === 'shaker' ? 'highpass' : 'bandpass'
  f.frequency.value = kind === 'shaker' ? 7000 : 1500
  const g = a.createGain()
  g.gain.value = kind === 'shaker' ? 0.12 : 0.35
  src.connect(f).connect(g).connect(dest)
  src.start(t)
}

function scheduleStep(song: Song, t: number) {
  if (!musicGain) return
  const bar = Math.floor(stepIdx / 8) % song.chords.length
  const pos = stepIdx % 8
  const eighth = 60 / song.bpm / 2
  const chord = song.chords[bar]
  // Bass: nốt gốc ở phách 1 và 3
  if (pos === 0 || pos === 4) inst('pluck', N(chord[0] - 24), t, eighth * 3, musicGain, 0.22)
  // Đệm hợp âm rải nhẹ
  if (pos % 2 === 1) inst(song.lead === 'musicbox' ? 'musicbox' : 'pluck', N(chord[(pos >> 1) % 3] - 12), t, eighth, musicGain, 0.05)
  const note = song.melody[bar % song.melody.length][pos]
  if (note !== null) inst(song.lead, N(note - 12), t, eighth * 1.5, musicGain, song.lead === 'musicbox' ? 0.11 : 0.13)
  if (song.drums) {
    if (pos === 0 || pos === 4) drum('kick', t, musicGain)
    if (pos === 2 || pos === 6) drum(track === 'choi' ? 'clap' : 'shaker', t, musicGain)
    drum('shaker', t + eighth / 2, musicGain)
  }
  stepIdx++
}

export function startMusic() {
  const a = ac()
  if (!a || !master || schedTimer || !enabled) return
  musicGain = a.createGain()
  musicGain.gain.setValueAtTime(0.0001, a.currentTime)
  musicGain.gain.exponentialRampToValueAtTime(BASE_VOL, a.currentTime + 1.5)
  musicGain.connect(master)
  nextTime = a.currentTime + 0.1
  stepIdx = 0
  schedTimer = setInterval(() => {
    const song = SONGS[track]
    const eighth = 60 / song.bpm / 2
    while (nextTime < a.currentTime + 0.15) {
      scheduleStep(song, nextTime)
      nextTime += eighth
    }
  }, 30)
}

export function stopMusic() {
  if (schedTimer) clearInterval(schedTimer)
  schedTimer = null
  if (musicGain && ctx) {
    musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
    const g = musicGain
    setTimeout(() => g.disconnect(), 1200)
  }
  musicGain = null
}

/** Đổi bản nhạc (trang chính / học / chơi), chuyển mượt. */
export function setMusicTrack(t: Track) {
  if (t === track) return
  track = t
  stepIdx = 0
  if (schedTimer && ctx && musicGain) {
    musicGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08)
    musicGain.gain.setTargetAtTime(BASE_VOL, ctx.currentTime + 0.35, 0.3)
  }
}

/** Hạ nhỏ nhạc nền khi cô đang nói, để nghe rõ lời. */
export function duckMusic(on: boolean) {
  if (musicGain && ctx) musicGain.gain.setTargetAtTime(on ? 0.08 : BASE_VOL, ctx.currentTime, 0.15)
}

export function isMusicPlaying() {
  return schedTimer !== null
}

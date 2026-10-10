// Đọc to bằng giọng tiếng Việt của máy (Web Speech API).
// • Tự chọn giọng Việt tốt nhất (giọng "Natural/Online" của Microsoft, giọng Google…).
// • Đọc đúng ký hiệu toán: x² → "x bình phương", 3/8 → "3 phần 8", − → "trừ"…
// • Chia câu để không bị cắt giữa chừng (lỗi của Chrome với câu dài).

import { duckMusic } from './sound'
import { voiceKey, type VoiceLang, type VoiceStyle } from './voiceKey'
export type { VoiceStyle } from './voiceKey'

let narrateOn = true
let rate = 0.95
let pitch = 1.1
let chosen: SpeechSynthesisVoice | null = null
const listeners = new Set<() => void>()

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function setNarrate(on: boolean) {
  narrateOn = on
  if (!on) stopSpeaking()
}

/** Bé nhỏ: đọc chậm, giọng cao, ấm; lớn hơn: tốc độ tự nhiên. */
export function setVoiceProfile(r: number, p: number) {
  rate = r
  pitch = p
}

function score(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase()
  let s = 0
  if (v.lang.toLowerCase().replace('_', '-') === 'vi-vn') s += 5
  if (/natural|online|neural|premium|enhanced/.test(n)) s += 10
  if (/hoaimy|hoài my|namminh|nam minh|linh|an\b/.test(n)) s += 3
  if (/google/.test(n)) s += 6
  if (v.localService) s += 1
  return s
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!canSpeak()) return null
  const vi = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('vi'))
  chosen = vi.sort((a, b) => score(b) - score(a))[0] ?? null
  return chosen
}

if (canSpeak()) {
  pickVoice()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    pickVoice()
    listeners.forEach((f) => f())
  })
}

export function hasVietnameseVoice(): boolean {
  return !!(chosen ?? pickVoice())
}

export function onVoicesChanged(f: () => void) {
  listeners.add(f)
  return () => {
    listeners.delete(f)
  }
}

const SUP: Record<string, string> = { '²': ' bình phương', '³': ' lập phương' }

/** Chuyển văn bản hiển thị thành văn bản đọc tự nhiên bằng tiếng Việt. */
export function toSpeech(text: string): string {
  return (
    text
      // bỏ biểu tượng cảm xúc và ký hiệu trang trí
      .replace(/\p{Extended_Pictographic}|️|‍|[➜→⬆⬇➡↩✔✕★•·]/gu, (m) => (m === '→' || m === '➜' ? ', ' : ' '))
      .replace(/[*_#`"“”]/g, '')
      .replace(/√\(?([^)\s]+)\)?/g, 'căn bậc hai của $1')
      .replace(/([a-zA-Z0-9)])([²³])/g, (_, a, s) => a + SUP[s])
      .replace(/(\d+)\s*\/\s*(\d+)/g, '$1 phần $2')
      .replace(/(\d),(\d)/g, '$1 phẩy $2')
      .replace(/(\d+)\s*°/g, '$1 độ')
      .replace(/(\d+)\s*m\/s²/g, '$1 mét trên giây bình phương')
      .replace(/(\d+)\s*m\/s/g, '$1 mét trên giây')
      .replace(/(\d+)\s*cm(?![\p{L}\d])/gu, '$1 xăng-ti-mét')
      .replace(/(\d+)\s*m²/g, '$1 mét vuông')
      .replace(/(\d+)\s*m(?![\p{L}\d²/])/gu, '$1 mét')
      .replace(/(\d+)\s*s(?![\p{L}\d])/gu, '$1 giây')
      .replace(/(\d)\s*–\s*(\d)/g, '$1 đến $2')
      .replace(/\s[−-]\s|(?<=\d)\s*[−]\s*(?=\d)/g, ' trừ ')
      .replace(/[−]/g, ' âm ')
      .replace(/\s*\+\s*/g, ' cộng ')
      .replace(/\s*×\s*/g, ' nhân ')
      .replace(/\s*÷\s*/g, ' chia ')
      .replace(/(?<=\d)\s+:\s+(?=\d)/g, ' chia ')
      .replace(/\s*≠\s*/g, ' khác ')
      .replace(/\s*≈\s*/g, ' xấp xỉ ')
      .replace(/\s*>\s*/g, ' lớn hơn ')
      .replace(/\s*<\s*/g, ' nhỏ hơn ')
      .replace(/\s*=\s*/g, ' bằng ')
      .replace(/Δ/g, 'đen-ta')
      .replace(/α/g, 'an-pha')
      .replace(/v₀/g, 'v không')
      .replace(/vₓ/g, 'v x')
      .replace(/([.!?…])\s*[.;:]+/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )
}

/** Chia thành các câu ngắn để đọc liền mạch, không bị trình duyệt cắt. */
function chunks(text: string): string[] {
  const parts = text.split(/(?<=[.!?…])\s+/)
  const out: string[] = []
  for (const p of parts) {
    if (p.length <= 180) {
      if (p.trim()) out.push(p)
      continue
    }
    let rest = p
    while (rest.length > 180) {
      const cut = rest.lastIndexOf(',', 180) > 60 ? rest.lastIndexOf(',', 180) + 1 : 180
      out.push(rest.slice(0, cut))
      rest = rest.slice(cut)
    }
    if (rest.trim()) out.push(rest)
  }
  return out
}

// ───────────────────────── Phát lời: tệp thu sẵn → giọng của máy ─────────────────────────

export type Seg = string | { text: string; lang: VoiceLang }

let style: VoiceStyle = 'hs'
let clipBase = 'voice/'
let manifest: Set<string> = new Set()
let generation = 0
let current: HTMLAudioElement | null = null
const speakingListeners = new Set<(on: boolean) => void>()

export function setVoiceStyle(s: VoiceStyle) {
  style = s
}
export function getVoiceStyle(): VoiceStyle {
  return style
}

/** Nạp danh sách tệp giọng thu sẵn (tạo bởi scripts/tao-giong-doc). Không có cũng không sao. */
export async function loadVoiceManifest(base = 'voice/') {
  clipBase = base
  try {
    const r = await fetch(`${base}manifest.json`, { cache: 'no-cache' })
    if (!r.ok) return
    const keys = (await r.json()) as string[]
    manifest = new Set(keys)
  } catch {
    /* chưa có giọng thu sẵn — dùng giọng của máy */
  }
}

export function hasRecordedVoice(): boolean {
  return manifest.size > 0
}

/** Theo dõi lúc đang nói — để nhân vật cô giáo mấp máy môi. */
export function onSpeaking(f: (on: boolean) => void) {
  speakingListeners.add(f)
  return () => {
    speakingListeners.delete(f)
  }
}
function setSpeaking(on: boolean) {
  duckMusic(on)
  speakingListeners.forEach((f) => f(on))
}

/** Văn bản thật sự được đọc của một đoạn — dùng cho cả tạo khoá lẫn tạo giọng. */
export function spokenText(seg: Seg): { text: string; lang: VoiceLang } {
  if (typeof seg !== 'string') return { text: seg.lang === 'vi' ? toSpeech(seg.text) : seg.text.trim(), lang: seg.lang }
  return { text: toSpeech(seg), lang: 'vi' }
}

function playClip(url: string, gen: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (gen !== generation) return resolve(true)
    const a = new Audio(url)
    current = a
    a.onended = () => resolve(true)
    a.onerror = () => resolve(false)
    a.play().catch(() => resolve(false))
  })
}

function ttsSay(text: string, lang: VoiceLang, gen: number): Promise<void> {
  return new Promise((resolve) => {
    if (!canSpeak() || gen !== generation) return resolve()
    const synth = window.speechSynthesis
    const parts = lang === 'vi' ? chunks(text) : [text]
    let left = parts.length
    if (!left) return resolve()
    const voice = lang === 'vi' ? chosen ?? pickVoice() : englishVoice()
    for (const c of parts) {
      const u = new SpeechSynthesisUtterance(c)
      u.lang = lang === 'vi' ? 'vi-VN' : 'en-US'
      if (voice) u.voice = voice
      u.rate = lang === 'en' ? 0.85 : rate
      u.pitch = pitch
      const end = () => {
        if (--left <= 0) resolve()
      }
      u.onend = end
      u.onerror = end
      synth.speak(u)
    }
    // Phòng khi trình duyệt không báo kết thúc.
    setTimeout(resolve, 400 + text.length * 120)
  })
}

function englishVoice(): SpeechSynthesisVoice | null {
  if (!canSpeak()) return null
  const en = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'))
  return en.sort((a, b) => Number(/natural|online|google/i.test(b.name)) - Number(/natural|online|google/i.test(a.name)))[0] ?? null
}

/**
 * Đọc to. Truyền một câu hoặc một dãy đoạn — mỗi đoạn được tìm tệp giọng thu sẵn riêng,
 * nên hãy chia lời thành các đoạn cố định (VD: [lời khen, lời giải]).
 */
export function speak(input: Seg | Seg[], opts: { force?: boolean; queue?: boolean } = {}) {
  if ((!narrateOn && !opts.force) || typeof window === 'undefined') return
  const segs = (Array.isArray(input) ? input : [input]).filter((s) => (typeof s === 'string' ? s.trim() : s.text.trim()))
  if (!segs.length) return
  if (!opts.queue) stopSpeaking()
  const gen = generation
  const run = async () => {
    setSpeaking(true)
    for (const seg of segs) {
      if (gen !== generation) return
      const { text, lang } = spokenText(seg)
      if (!text) continue
      const key = voiceKey(text, style, lang)
      let ok = false
      if (manifest.has(key)) ok = await playClip(`${clipBase}${key}.mp3`, gen)
      if (!ok && gen === generation) await ttsSay(text, lang, gen)
    }
    if (gen === generation) setSpeaking(false)
  }
  queueTail = opts.queue ? queueTail.then(run) : run()
}
let queueTail: Promise<void> = Promise.resolve()

export function stopSpeaking() {
  generation++
  if (current) {
    current.pause()
    current = null
  }
  if (canSpeak()) window.speechSynthesis.cancel()
  queueTail = Promise.resolve()
  setSpeaking(false)
}

// Lời khen / động viên theo giọng cô: mầm non xưng "cô – con", tiểu học "cô – em".
export const PRAISE: Record<VoiceStyle, string[]> = {
  be: ['Con giỏi quá!', 'Đúng rồi, con ơi!', 'Hoan hô con!', 'Cô khen con nè!', 'Tuyệt vời quá!', 'Con thông minh quá!', 'Giỏi lắm, cô thưởng con một ngôi sao nhé!'],
  hs: ['Em giỏi lắm!', 'Chính xác!', 'Tuyệt vời!', 'Xuất sắc!', 'Đúng rồi, em làm tốt lắm!', 'Cô khen em!', 'Quá đỉnh luôn!'],
}
export const CHEER: Record<VoiceStyle, string[]> = {
  be: ['Ồ, chưa đúng rồi. Con thử lại nhé!', 'Không sao đâu con, mình thử lần nữa nào!', 'Con nhìn kỹ lại xem nào!'],
  hs: ['Chưa đúng rồi, mình cùng xem lại nhé!', 'Gần đúng rồi đó em!', 'Không sao, sai là để học mà!', 'Em xem chỗ dễ nhầm này nhé!'],
}
const pickOne = (a: string[]) => a[Math.floor(Math.random() * a.length)]
export const praise = () => pickOne(PRAISE[style])
export const cheer = () => pickOne(CHEER[style])

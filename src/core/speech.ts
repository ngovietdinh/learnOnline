// Đọc to bằng giọng tiếng Việt của máy (Web Speech API).
// • Tự chọn giọng Việt tốt nhất (giọng "Natural/Online" của Microsoft, giọng Google…).
// • Đọc đúng ký hiệu toán: x² → "x bình phương", 3/8 → "3 phần 8", − → "trừ"…
// • Chia câu để không bị cắt giữa chừng (lỗi của Chrome với câu dài).

import { duckMusic } from './sound'

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
  return () => listeners.delete(f)
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

let speakingCount = 0

export function speak(text: string, opts: { force?: boolean; queue?: boolean; lang?: string } = {}) {
  if (!canSpeak() || (!narrateOn && !opts.force) || !text) return
  try {
    const synth = window.speechSynthesis
    if (!opts.queue) synth.cancel()
    const isVi = (opts.lang ?? 'vi-VN').startsWith('vi')
    const voice = isVi ? chosen ?? pickVoice() : null
    for (const c of chunks(isVi ? toSpeech(text) : text)) {
      const u = new SpeechSynthesisUtterance(c)
      u.lang = opts.lang ?? 'vi-VN'
      if (voice) u.voice = voice
      u.rate = rate
      u.pitch = pitch
      u.onstart = () => {
        speakingCount++
        duckMusic(true)
      }
      const end = () => {
        speakingCount = Math.max(0, speakingCount - 1)
        if (!speakingCount) duckMusic(false)
      }
      u.onend = end
      u.onerror = end
      synth.speak(u)
    }
  } catch {
    /* thiết bị không hỗ trợ — bỏ qua */
  }
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
  speakingCount = 0
  duckMusic(false)
}

const PRAISE = ['Giỏi quá!', 'Tuyệt vời!', 'Chính xác!', 'Xuất sắc!', 'Đúng rồi, hay lắm!', 'Quá đỉnh!', 'Em làm tốt lắm!']
const CHEER = ['Không sao, mình xem lại nhé!', 'Gần đúng rồi đó!', 'Sai một chút thôi, cố lên!', 'Mình cùng tìm chỗ nhầm nhé!']
const pickOne = (a: string[]) => a[Math.floor(Math.random() * a.length)]
export const praise = () => pickOne(PRAISE)
export const cheer = () => pickOne(CHEER)

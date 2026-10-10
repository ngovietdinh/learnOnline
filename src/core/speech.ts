// Đọc to bằng giọng tiếng Việt của máy (Web Speech API). Trẻ chưa biết đọc vẫn học được.

let narrateOn = true
let viVoice: SpeechSynthesisVoice | null | undefined

export function setNarrate(on: boolean) {
  narrateOn = on
  if (!on) stopSpeaking()
}

function voice(): SpeechSynthesisVoice | null {
  if (viVoice !== undefined && viVoice !== null) return viVoice
  const voices = window.speechSynthesis.getVoices()
  viVoice = voices.find((v) => v.lang.toLowerCase().startsWith('vi')) ?? null
  return viVoice
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, opts: { force?: boolean; lang?: string; rate?: number } = {}) {
  if (!canSpeak() || (!narrateOn && !opts.force) || !text) return
  try {
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ''))
    u.lang = opts.lang ?? 'vi-VN'
    if (u.lang.startsWith('vi')) {
      const v = voice()
      if (v) u.voice = v
    }
    u.rate = opts.rate ?? 0.95
    u.pitch = 1.1
    synth.speak(u)
  } catch {
    /* thiết bị không hỗ trợ — bỏ qua */
  }
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}

// Khoá nhận diện một câu đọc — dùng chung giữa ứng dụng (tìm tệp giọng thu sẵn)
// và kịch bản tạo giọng (scripts/), để hai bên luôn khớp nhau.

/** be = giọng cô giáo mầm non (chậm, ấm, cao); hs = giọng cô giáo tiểu học. */
export type VoiceStyle = 'be' | 'hs'
export type VoiceLang = 'vi' | 'en'

export function voiceKey(spoken: string, style: VoiceStyle, lang: VoiceLang = 'vi'): string {
  const s = `${lang === 'en' ? 'en' : style}|${spoken.replace(/\s+/g, ' ').trim()}`
  // FNV-1a 32 bit, hai lượt với hạt khác nhau → 64 bit, gần như không trùng.
  let h1 = 0x811c9dc5
  let h2 = 0x01000193 ^ 0x5bd1e995
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 0x01000193)
    h2 = Math.imul(h2 ^ c, 0x01000193) ^ (h2 >>> 13)
  }
  return (h1 >>> 0).toString(36) + (h2 >>> 0).toString(36)
}

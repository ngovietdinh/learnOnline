// Kịch bản lời cô: mọi câu cô giáo nói đều được ghép từ các đoạn CỐ ĐỊNH ở đây.
// Ứng dụng dùng các hàm này để nói; công cụ tạo giọng (scripts/thu-giong.ts) dùng đúng các hàm
// này để liệt kê và thu sẵn từng đoạn → câu nào cô nói cũng có giọng thật.

import type { Lesson, Question, Choice, TeachBack } from '../lessons/types'
import { mulberry32 } from './rng'
import type { Level } from './stages'
import type { Seg } from './speech'

/** Mỗi mức độ có sẵn một "kho" câu hỏi cố định — đủ đa dạng, và câu nào cũng có giọng thu sẵn. */
export const POOL = 12

function hashId(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619)
  return (h >>> 0) % 100000
}

export function poolQuestion(lesson: Lesson, level: Level, k: number): Question {
  return lesson.practice(level, mulberry32(hashId(lesson.id) * 1000 + level * 100 + k))
}

export function randomPoolQuestion(lesson: Lesson, level: Level, avoid?: string): Question {
  for (let i = 0; i < 6; i++) {
    const q = poolQuestion(lesson, level, 1 + Math.floor(Math.random() * POOL))
    if (q.prompt !== avoid) return q
  }
  return poolQuestion(lesson, level, 1 + Math.floor(Math.random() * POOL))
}

/** Câu cô đọc khi đưa câu hỏi: câu hỏi + các lựa chọn (nếu là chữ). */
export function questionSegs(q: Question): Seg[] {
  if (q.speakSegs) return q.speakSegs
  const ask = q.speak ?? q.prompt
  // đáp án đều là hình: chỉ đọc câu hỏi; còn đáp án chữ thì đọc cả các lựa chọn cho bé nghe
  if (q.choices.every((c) => c.visual) || q.layout === 'big') return [ask]
  return [`${ask} Chọn một: ${q.choices.map((c) => c.label).join(', hoặc ')}.`]
}

export function correctSegs(q: Question, praiseLine: string): Seg[] {
  return [praiseLine, q.explain]
}

export function wrongSegs(q: Question, c: Choice, cheerLine: string, gentle: boolean): Seg[] {
  if (gentle) return [c.why ?? 'Thử lại nhé!']
  return [cheerLine, ...(c.why ? [c.why] : []), q.explain]
}

export function essenceSegs(l: Lesson): Seg[] {
  if (!l.essence) return []
  return [l.essence.bigIdea, ...l.essence.points, ...(l.essence.analogy ? [`Hình dung nhé: ${l.essence.analogy}`] : [])]
}

export function teachSegs(tb: TeachBack): Seg[] {
  return [tb.prompt, ...tb.options.map((o, i) => `Bạn thứ ${i + 1} nói: ${o.text}`)]
}

export function rememberSegs(l: Lesson, mastered: boolean): Seg[] {
  return [mastered ? `Em đã vững bài ${l.title}.` : 'Em đã tiến bộ rồi! Mai mình luyện thêm nhé.', 'Ghi nhớ nhé:', ...l.remember]
}

export const LEVEL_UP_LINES = ['Lên mức Thông hiểu rồi!', 'Lên mức Vận dụng rồi!', 'Lên mức Vận dụng cao rồi!']
export const levelUpLine = (lv: Level) => LEVEL_UP_LINES[lv - 2] ?? ''

/** Lời cố định dùng ở các màn hình chung. */
export const UI_LINES = [
  'Chào con! Hôm nay mình cùng học và chơi nhé!',
  'Chào em! Sẵn sàng khám phá điều mới chưa nào?',
  'Ai đang học hôm nay nhỉ?',
  'Màn chơi thưởng! Con hãy chạm thật nhanh vào đáp án đúng nhé!',
  'Trò chơi bóng bay! Chạm vào quả bóng có đáp án đúng nào!',
  'Trò chơi câu cá! Chạm vào chú cá mang đáp án đúng nhé!',
  'Trò chơi đập chuột chũi! Chạm vào chú chuột có đáp án đúng!',
  'Trò chơi lật thẻ! Tìm hai thẻ giống nhau nhé!',
  'Hết giờ rồi! Con chơi giỏi lắm!',
  'Hoan hô! Con đã thắng màn chơi!',
  'Hôm nay có bài cần ôn đó. Ôn một chút thôi là nhớ lâu lắm!',
  'Thử lại nhé!',
  'Chưa sao! Mình học kỹ bài này từ đầu để hiểu tận gốc nhé.',
]

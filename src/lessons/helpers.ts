import type { Choice } from './types'
import { shuffle, type Rng } from '../core/rng'

export interface Wrong {
  value: number | string
  misconception?: string
  why?: string
}

/**
 * Tạo các lựa chọn: một đáp án đúng + các đáp án sai CÓ CHỦ ĐÍCH (mỗi cái là một ngộ nhận thường gặp),
 * bổ sung số lân cận nếu thiếu, loại trùng, rồi xáo trộn.
 */
export function choicesFrom(
  rng: Rng,
  answer: number | string,
  wrongs: Wrong[],
  opts: { count?: number; fill?: (i: number) => number | string; format?: (v: number | string) => string } = {},
): Choice[] {
  const count = opts.count ?? 4
  const fmt = opts.format ?? ((v) => String(v))
  const seen = new Set([fmt(answer)])
  const out: Choice[] = [{ label: fmt(answer), correct: true }]
  for (const w of wrongs) {
    if (out.length >= count) break
    const label = fmt(w.value)
    if (seen.has(label)) continue
    seen.add(label)
    out.push({ label, misconception: w.misconception, why: w.why })
  }
  for (let i = 1; out.length < count && opts.fill && i < 60; i++) {
    const label = fmt(opts.fill(i))
    if (seen.has(label)) continue
    seen.add(label)
    out.push({ label })
  }
  return shuffle(rng, out)
}

/** Số lân cận ±1, ±2, … — dùng để bù lựa chọn số. */
export const near = (answer: number, min = 0) => (i: number) => {
  const d = Math.ceil(i / 2) * (i % 2 ? 1 : -1)
  const v = answer + d
  return v < min ? answer + Math.ceil(i / 2) + 2 : v
}

/** Định dạng số kiểu Việt Nam: dấu phẩy thập phân. */
export function vn(n: number, digits = 2): string {
  const r = Math.round(n * 10 ** digits) / 10 ** digits
  return String(r).replace('.', ',')
}

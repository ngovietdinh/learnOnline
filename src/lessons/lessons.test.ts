import { describe, expect, it } from 'vitest'
import { LESSONS } from './registry'
import { mulberry32 } from '../core/rng'
import { MISCONCEPTIONS } from '../core/misconceptions'
import type { Level } from '../core/stages'

describe.each(LESSONS.map((l) => [l.id, l] as const))('bài %s', (_id, lesson) => {
  it('có đủ các bước của vòng "Hiểu bản chất"', () => {
    expect(lesson.hook.text.length).toBeGreaterThan(10)
    expect(lesson.explore.intro.length).toBeGreaterThan(10)
    expect(lesson.remember.length).toBeGreaterThan(0)
    if (lesson.teachBack) {
      expect(lesson.teachBack.options.filter((o) => o.correct)).toHaveLength(1)
    }
  })

  for (const level of [1, 2, 3, 4] as Level[]) {
    it(`mức ${level}: mỗi câu sinh ra có đúng một đáp án, lựa chọn không trùng, đáp án sai gắn ngộ nhận hợp lệ`, () => {
      for (let seed = 1; seed <= 150; seed++) {
        const q = lesson.practice(level, mulberry32(seed * 7919 + level))
        const labels = q.choices.map((c) => c.label)
        expect(q.choices.length, q.prompt).toBeGreaterThanOrEqual(2)
        expect(new Set(labels).size, `${q.prompt} → ${labels.join(' | ')}`).toBe(labels.length)
        expect(q.choices.filter((c) => c.correct), q.prompt).toHaveLength(1)
        expect(q.explain.length).toBeGreaterThan(5)
        for (const c of q.choices) {
          expect(c.label, q.prompt).not.toMatch(/NaN|undefined|Infinity/)
          if (c.misconception && !c.misconception.startsWith('ng:')) expect(MISCONCEPTIONS[c.misconception], c.misconception).toBeDefined()
        }
        expect(q.prompt).not.toMatch(/NaN|undefined/)
      }
    })
  }
})

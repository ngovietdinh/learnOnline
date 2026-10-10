import { describe, expect, it } from 'vitest'
import { SKILLS, SKILL_BY_ID, ancestors } from './curriculum'
import { STAGE_ORDER } from './stages'
import { LESSONS, LESSON_BY_ID } from '../lessons/registry'

describe('đồ thị tri thức', () => {
  it('mã kỹ năng không trùng', () => {
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length)
  })

  it('mọi kỹ năng nền đều tồn tại và không đứng ở cấp cao hơn kỹ năng dựa vào nó', () => {
    for (const s of SKILLS) {
      for (const p of s.prereqs) {
        const pre = SKILL_BY_ID[p]
        expect(pre, `${s.id} → ${p}`).toBeDefined()
        expect(STAGE_ORDER.indexOf(pre.stage), `${p} phải học trước ${s.id}`).toBeLessThanOrEqual(STAGE_ORDER.indexOf(s.stage))
      }
    }
  })

  it('không có vòng lặp tiền đề', () => {
    for (const s of SKILLS) expect(ancestors(s.id)).not.toContain(s.id)
  })

  it('mỗi kỹ năng có bản chất và ít nhất một chuẩn tham chiếu', () => {
    for (const s of SKILLS) {
      expect(s.essence.length, s.id).toBeGreaterThan(10)
      expect(s.standards.length, s.id).toBeGreaterThan(0)
    }
  })

  it('bài học và kỹ năng trỏ đúng vào nhau', () => {
    for (const l of LESSONS) expect(SKILL_BY_ID[l.skillId]?.lessonId, l.id).toBe(l.id)
    for (const s of SKILLS.filter((x) => x.lessonId)) expect(LESSON_BY_ID[s.lessonId!]?.skillId, s.id).toBe(s.id)
  })

  it('đủ 5 giai đoạn, mỗi giai đoạn có bài tương tác', () => {
    for (const st of STAGE_ORDER) expect(SKILLS.some((s) => s.stage === st && s.lessonId), st).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import { answerPractice, bktUpdate, practiceRules, scheduleAfterReview, startPractice, addDays, BKT } from './mastery'

const run = (answers: boolean[], rules = practiceRules(4, false)) => answers.reduce((s, a) => answerPractice(s, a, rules), startPractice(rules))

describe('luyện tập leo thang', () => {
  it('đúng liên tiếp 2 câu mỗi mức thì leo đủ 4 mức và đạt "vững"', () => {
    const s = run(Array(8).fill(true))
    expect(s.mastered).toBe(true)
    expect(s.done).toBe(true)
    expect(s.answered).toBe(8)
  })

  it('chưa đủ chuỗi đúng thì chưa được lên mức', () => {
    const s = run([true, false, true])
    expect(s.level).toBe(1)
    expect(s.streak).toBe(1)
  })

  it('sai hai lần liên tiếp thì lùi một mức để củng cố', () => {
    const s = run([true, true, false, false])
    expect(s.level).toBe(1)
  })

  it('trẻ nhỏ: câu sai không xoá chuỗi đúng', () => {
    const rules = practiceRules(1, true)
    const s = run([true, false, true], rules)
    expect(s.mastered).toBe(true)
  })

  it('giới hạn số câu để tránh mệt — chưa vững vẫn kết thúc', () => {
    const rules = practiceRules(2, false)
    const s = run(Array(rules.maxQuestions).fill(false), rules)
    expect(s.done).toBe(true)
    expect(s.mastered).toBe(false)
  })
})

describe('Bayesian Knowledge Tracing', () => {
  it('trả lời đúng làm tăng, sai làm giảm mức hiểu ước tính', () => {
    const p = 0.5
    expect(bktUpdate(p, true)).toBeGreaterThan(p)
    expect(bktUpdate(p, false)).toBeLessThan(p)
  })
  it('chuỗi đúng hội tụ về gần 1', () => {
    let p = BKT.pInit
    for (let i = 0; i < 8; i++) p = bktUpdate(p, true)
    expect(p).toBeGreaterThan(0.95)
  })
})

describe('ôn tập giãn cách', () => {
  const now = new Date('2026-01-10T09:00:00').getTime()
  it('nhớ đúng thì khoảng cách giãn ra', () => {
    expect(scheduleAfterReview(1, true, now)).toEqual({ box: 2, due: addDays(now, 3) })
    expect(scheduleAfterReview(2, true, now)).toEqual({ box: 3, due: addDays(now, 7) })
  })
  it('quên thì quay về ôn ngày mai', () => {
    expect(scheduleAfterReview(4, false, now)).toEqual({ box: 1, due: addDays(now, 1) })
  })
  it('không vượt quá hộp cuối', () => {
    expect(scheduleAfterReview(6, true, now).box).toBe(6)
  })
})

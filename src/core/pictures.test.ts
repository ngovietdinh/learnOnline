import { describe, expect, it } from 'vitest'
import { LESSONS } from '../lessons/registry'
import { poolQuestion } from './script'
import { pictureize } from './pictures'

describe('bé mầm non chọn đáp án bằng hình, không cần biết chữ', () => {
  it('hầu hết câu hỏi mầm non đều đổi được hết đáp án thành hình', () => {
    let total = 0
    const textLeft: string[] = []
    for (const l of LESSONS.filter((x) => x.grade === 0))
      for (const lv of [1, 2] as const)
        for (let k = 1; k <= 12; k++) {
          const q = pictureize(poolQuestion(l, lv, k))
          total++
          if (!q.choices.every((c) => c.visual)) textLeft.push(`${l.id}: ${q.choices.map((c) => c.label).join(' | ')}`)
        }
    // chỉ còn vài câu hỏi "vì sao" cho bé lớn (cô đọc to các lựa chọn)
    expect(textLeft.length / total).toBeLessThan(0.03)
  })
})

import { describe, expect, it } from 'vitest'
import { applyTone, spell } from './vietKit'

describe('đặt dấu thanh đúng chính tả', () => {
  it.each([
    ['a', 'huyền', 'à'],
    ['an', 'sắc', 'án'],
    ['oa', 'huyền', 'oà'],
    ['oe', 'hỏi', 'oẻ'],
    ['uy', 'sắc', 'uý'],
    ['ai', 'huyền', 'ài'],
    ['ia', 'huyền', 'ìa'],
    ['ua', 'sắc', 'úa'],
    ['ưa', 'sắc', 'ứa'],
    ['ươn', 'huyền', 'ườn'],
    ['uôi', 'sắc', 'uối'],
    ['iêu', 'nặng', 'iệu'],
    ['ach', 'sắc', 'ách'],
    ['ong', 'ngã', 'õng'],
  ] as const)('%s + %s → %s', (r, t, out) => expect(applyTone(r, t)).toBe(out))
  it('đánh vần như cô dạy', () => {
    expect(spell('b', 'a', 'huyền')).toBe('bờ, a, ba, huyền, bà.')
    expect(spell('k', 'e', 'hỏi')).toBe('ca, e, ke, hỏi, kẻ.')
  })
})

import { describe, expect, it } from 'vitest'
import { fmt, readNumber } from './vnNumber'

describe('đọc số tiếng Việt', () => {
  it.each([
    [0, 'không'],
    [5, 'năm'],
    [10, 'mười'],
    [15, 'mười lăm'],
    [21, 'hai mươi mốt'],
    [24, 'hai mươi tư'],
    [25, 'hai mươi lăm'],
    [70, 'bảy mươi'],
    [100, 'một trăm'],
    [105, 'một trăm linh năm'],
    [110, 'một trăm mười'],
    [999, 'chín trăm chín mươi chín'],
    [1005, 'một nghìn không trăm linh năm'],
    [20350, 'hai mươi nghìn ba trăm năm mươi'],
    [1000000, 'một triệu'],
    [2.5, 'hai phẩy năm'],
    [3.07, 'ba phẩy không bảy'],
  ])('%s', (n, s) => expect(readNumber(n)).toBe(s))
  it('viết số có dấu chấm hàng nghìn', () => {
    expect(fmt(12345)).toBe('12.345')
    expect(fmt(2.5)).toBe('2,5')
  })
})

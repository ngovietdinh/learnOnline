import { describe, expect, it } from 'vitest'
import { toSpeech } from './speech'

describe('đọc ký hiệu toán bằng tiếng Việt', () => {
  it.each([
    ['a² + b² = c²', 'a bình phương cộng b bình phương bằng c bình phương'],
    ['3/8 thanh', '3 phần 8 thanh'],
    ['x = 2,5', 'x bằng 2 phẩy 5'],
    ['Góc 45°', 'Góc 45 độ'],
    ['v₀ = 20 m/s', 'v không bằng 20 mét trên giây'],
    ['dài 5 cm', 'dài 5 xăng-ti-mét'],
    ['3 món quà, 2 sao', '3 món quà, 2 sao'],
    ['T = 2 s', 'T bằng 2 giây'],
    ['Lớp 1–5', 'Lớp 1 đến 5'],
    ['🎉 Giỏi quá!', 'Giỏi quá!'],
    ['8 + 5 = 13', '8 cộng 5 bằng 13'],
    ['3x − 4 = 11', '3x trừ 4 bằng 11'],
    ['x = −3', 'x bằng âm 3'],
    ['1/2 > 1/3', '1 phần 2 lớn hơn 1 phần 3'],
  ])('%s', (input, out) => {
    expect(toSpeech(input)).toBe(out)
  })
})

describe('dấu câu khi ghép lời đọc', () => {
  it('không đọc lặp dấu chấm', () => {
    expect(toSpeech('Có mấy quả táo?. 3')).toBe('Có mấy quả táo? 3')
    expect(toSpeech('Hết bài.. Giỏi lắm')).toBe('Hết bài. Giỏi lắm')
  })
})

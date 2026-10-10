// Bộ sinh câu hỏi Toán tiểu học chuyên biệt — mỗi đáp án sai là một lỗi thật học sinh hay mắc.
import { int, pick, shuffle } from '../core/rng'
import { choicesFrom, near } from '../lessons/helpers'
import { fmt, readNumber } from '../core/vnNumber'
import { Clock, Note, timeWords } from './mathKit'
import type { Gen } from './questions'

const rev = (n: number) => Number(String(n).split('').reverse().join(''))

/** So sánh hai số: >, <, = */
export function compareGen(ranges: Record<1 | 2 | 3, [number, number]>): Gen {
  return (level, rng) => {
    const r = ranges[Math.min(3, level) as 1 | 2 | 3]
    let a = int(rng, r[0], r[1])
    let b = rng() < 0.15 ? a : int(rng, r[0], r[1])
    // Bẫy: hai số có chữ số hàng đơn vị "lừa mắt" (VD 39 và 41).
    if (level >= 2 && a > 20 && rng() < 0.5) b = a + (rng() < 0.5 ? 2 : -2)
    if (b < 0) b = a + 2
    if (rng() < 0.3 && a > 9 && rev(a) > 9) b = rev(a)
    const sign = a > b ? '>' : a < b ? '<' : '='
    return {
      level,
      prompt: `So sánh: ${fmt(a)} ? ${fmt(b)}`,
      speak: `So sánh ${readNumber(a)} và ${readNumber(b)}.`,
      choices: shuffle(rng, ['>', '<', '='].map((s) => ({
        label: s,
        correct: s === sign,
        why: s === sign ? undefined : sign === '=' ? 'Hai số giống hệt nhau thì bằng nhau.' : 'So sánh từ hàng cao nhất (bên trái) trước: hàng chục lớn hơn thì số lớn hơn, không xét hàng đơn vị.',
        misconception: s === sign ? undefined : 'nham-gia-tri-vi-tri',
      }))),
      explain: sign === '=' ? `${fmt(a)} = ${fmt(b)}.` : `So sánh từ hàng cao nhất: ${fmt(Math.max(a, b))} lớn hơn ${fmt(Math.min(a, b))}, nên ${fmt(a)} ${sign} ${fmt(b)}. Miệng dấu luôn mở về số lớn hơn.`,
    }
  }
}

/** Cấu tạo số theo hàng + đọc số. */
export function placeGen(max: 99 | 999 | 99999 | 999999999): Gen {
  return (level, rng) => {
    if (max === 99) {
      const t = int(rng, 1, 9)
      const u = int(rng, 1, 9)
      const n = t * 10 + u
      if (level === 1)
        return {
          level,
          prompt: `Số gồm ${t} chục và ${u} đơn vị là số nào?`,
          choices: choicesFrom(rng, n, [
            { value: u * 10 + t, misconception: 'nham-gia-tri-vi-tri', why: `Chục viết bên trái, đơn vị viết bên phải: ${t} chục ${u} đơn vị là ${n}.` },
            { value: t + u, misconception: 'nham-gia-tri-vi-tri', why: `${t} chục là ${t * 10}, không phải ${t}. ${t * 10} + ${u} = ${n}.` },
          ].filter((w) => w.value !== n), { fill: near(n, 10) }),
          explain: `${t} chục là ${t * 10}, thêm ${u} đơn vị là ${n}.`,
        }
      return {
        level,
        prompt: `Số ${n} đọc là gì?`,
        choices: shuffle(rng, [
          { label: readNumber(n), correct: true },
          { label: readNumber(u * 10 + t), why: 'Đó là số có các chữ số đảo ngược.', misconception: 'nham-gia-tri-vi-tri' },
          { label: `${readNumber(t)} ${readNumber(u)}`, why: 'Không đọc rời từng chữ số. Đọc theo hàng: … mươi …', misconception: 'nham-gia-tri-vi-tri' },
        ].filter((c, i, a) => a.findIndex((x) => x.label === c.label) === i)),
        layout: 'list',
        explain: `${n} đọc là ${readNumber(n)}.`,
      }
    }
    const big = max > 999
    const n = big ? int(rng, 1001, max === 99999 ? 99999 : 9999999) : int(rng, 101, 999)
    const s = String(n)
    if (level === 1) {
      const variant = s.replace(/0/g, '') === s ? n : n
      const misread = readNumber(Number(s.replace(/0+/g, '')))
      return {
        level,
        prompt: `Số ${fmt(n)} đọc là gì?`,
        layout: 'list',
        choices: shuffle(rng, [
          { label: readNumber(variant), correct: true },
          ...(misread !== readNumber(n) ? [{ label: misread, why: 'Đừng bỏ qua chữ số 0 — đọc "không trăm", "linh" khi gặp số 0.', misconception: 'nham-gia-tri-vi-tri' }] : []),
          { label: readNumber(n + (big ? 1000 : 100)), why: 'Đọc lại chữ số hàng cao nhất.', misconception: 'nham-gia-tri-vi-tri' },
        ]),
        explain: `${fmt(n)} đọc là ${readNumber(n)}.`,
      }
    }
    // Giá trị của một chữ số theo vị trí
    const idx = int(rng, 0, s.length - 2)
    const d = Number(s[idx])
    if (d === 0) return placeGen(max)(level, rng)
    const place = 10 ** (s.length - 1 - idx)
    const val = d * place
    return {
      level,
      prompt: `Trong số ${fmt(n)}, chữ số ${d} (thứ ${idx + 1} từ trái sang) có giá trị là bao nhiêu?`,
      choices: choicesFrom(rng, fmt(val), [
        { value: String(d), misconception: 'nham-gia-tri-vi-tri', why: `Chữ số ${d} đứng ở hàng ${place === 10 ? 'chục' : place === 100 ? 'trăm' : place === 1000 ? 'nghìn' : 'cao hơn'} nên có giá trị ${fmt(val)}, không chỉ là ${d}.` },
        { value: fmt(d * place * 10), misconception: 'nham-gia-tri-vi-tri', why: 'Đếm lại hàng: đơn vị, chục, trăm, nghìn… tính từ phải sang.' },
        { value: fmt(Math.max(1, d * place / 10)), misconception: 'nham-gia-tri-vi-tri', why: 'Đếm lại hàng từ phải sang trái nhé.' },
      ]),
      explain: `Chữ số ${d} ở hàng có giá trị ${fmt(place)}, nên giá trị là ${d} × ${fmt(place)} = ${fmt(val)}.`,
    }
  }
}

/** Xem đồng hồ. */
export function clockGen(step: 5 | 15 | 30 | 60): Gen {
  return (level, rng) => {
    const h = int(rng, 1, 12)
    const m = step === 60 ? 0 : int(rng, 0, 60 / step - 1) * step
    const right = m === 0 ? `${h} giờ` : `${h} giờ ${m} phút`
    const swapH = m === 0 ? 12 : m / 5
    const swapM = h === 12 ? 0 : h * 5
    const wrong = [
      { value: swapM === 0 ? `${swapH} giờ` : `${swapH} giờ ${swapM} phút`, misconception: 'nham-gio', why: 'Kim NGẮN chỉ giờ, kim DÀI chỉ phút. Em đã đọc ngược hai kim.' },
      { value: m === 0 ? `${(h % 12) + 1} giờ` : `${(h % 12) + 1} giờ ${m} phút`, misconception: 'nham-gio', why: 'Kim giờ chưa tới số tiếp theo thì vẫn là giờ trước đó.' },
      { value: m === 0 ? `${h} giờ 30 phút` : `${h} giờ ${m === 30 ? 0 : 30} phút`.replace(' 0 phút', ''), misconception: 'nham-gio', why: 'Nhìn kim dài: chỉ số 12 là đúng giờ, chỉ số 6 là 30 phút.' },
    ].filter((w) => w.value !== right)
    return {
      level,
      prompt: 'Đồng hồ chỉ mấy giờ?',
      visual: <Clock h={h} m={m} size={180} />,
      choices: choicesFrom(rng, right, wrong),
      explain: `Kim ngắn chỉ ${h}, kim dài chỉ ${m === 0 ? 'số 12' : `số ${m / 5}`}: ${timeWords(h, m)}.`,
    }
  }
}

/** Tiền Việt Nam: cộng tiền, trả lại tiền thừa. */
export const moneyGen: Gen = (level, rng) => {
  const items = [
    { n: 'cái bút chì', p: [2000, 3000, 4000] },
    { n: 'quyển vở', p: [5000, 6000, 7000, 8000] },
    { n: 'hộp sữa', p: [6000, 8000, 9000] },
    { n: 'cái bánh mì', p: [10000, 12000, 15000] },
  ]
  const it = pick(rng, items)
  const price = pick(rng, it.p)
  if (level === 1) {
    const a = pick(rng, [1000, 2000, 5000])
    const b = pick(rng, [1000, 2000, 5000, 10000])
    return {
      level,
      prompt: `Có một tờ ${fmt(a)} đồng và một tờ ${fmt(b)} đồng. Có tất cả bao nhiêu tiền?`,
      visual: (
        <div className="note-row">
          <Note v={a} />
          <Note v={b} />
        </div>
      ),
      choices: choicesFrom(rng, `${fmt(a + b)} đồng`, [
        { value: `${fmt(Math.max(a, b))} đồng`, misconception: 'nham-phep-tinh', why: 'Phải cộng giá trị cả hai tờ tiền.' },
        { value: `${fmt(a + b + 1000)} đồng`, misconception: 'dem-lech' },
      ]),
      explain: `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)} đồng.`,
    }
  }
  const pay = price <= 10000 ? 10000 : 20000
  return {
    level,
    prompt: `Mua ${it.n} giá ${fmt(price)} đồng, đưa người bán tờ ${fmt(pay)} đồng. Được trả lại bao nhiêu tiền?`,
    choices: choicesFrom(rng, `${fmt(pay - price)} đồng`, [
      { value: `${fmt(pay + price)} đồng`, misconception: 'nham-phep-tinh', why: 'Tiền trả lại = tiền đưa − giá tiền, không phải cộng.' },
      { value: `${fmt(price)} đồng`, misconception: 'nham-phep-tinh', why: 'Đó là giá món hàng. Tiền thừa là phần tiền đưa nhiều hơn giá.' },
      { value: `${fmt(pay - price + 1000)} đồng`, misconception: 'dem-lech' },
    ]),
    explain: `Tiền trả lại: ${fmt(pay)} − ${fmt(price)} = ${fmt(pay - price)} đồng.`,
  }
}

/** Đổi đơn vị đo. */
export function unitGen(kind: 'length' | 'mass' | 'volume' | 'all'): Gen {
  const T = {
    length: [
      ['m', 'cm', 100],
      ['dm', 'cm', 10],
      ['m', 'dm', 10],
      ['km', 'm', 1000],
      ['cm', 'mm', 10],
    ],
    mass: [
      ['kg', 'g', 1000],
      ['tấn', 'kg', 1000],
      ['tạ', 'kg', 100],
      ['yến', 'kg', 10],
    ],
    volume: [['l', 'ml', 1000]],
  } as Record<string, [string, string, number][]>
  const all = kind === 'all' ? [...T.length, ...T.mass, ...T.volume] : T[kind]
  return (level, rng) => {
    const [big, small, f] = pick(rng, all)
    const k = level === 1 ? 1 : int(rng, 2, 9)
    const ans = k * f
    return {
      level,
      prompt: `${k} ${big} = ? ${small}`,
      speak: `${k} ${big} bằng bao nhiêu ${small}?`,
      choices: choicesFrom(rng, fmt(ans), [
        { value: fmt(f === 10 ? k * 100 : k * 10), misconception: 'nham-don-vi', why: `1 ${big} = ${fmt(f)} ${small}. Nhớ bảng đơn vị: mỗi đơn vị liền kề gấp 10 lần.` },
        { value: fmt(k), misconception: 'nham-don-vi', why: 'Đổi sang đơn vị nhỏ hơn thì số phải lớn hơn.' },
        { value: fmt(f === 1000 ? k * 100 : k * 1000), misconception: 'nham-don-vi', why: `1 ${big} = ${fmt(f)} ${small}.` },
      ].filter((w) => w.value !== fmt(ans))),
      explain: `1 ${big} = ${fmt(f)} ${small}, nên ${k} ${big} = ${k} × ${fmt(f)} = ${fmt(ans)} ${small}.`,
    }
  }
}

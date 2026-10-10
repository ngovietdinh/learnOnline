// Phương trình bậc nhất một ẩn (Toán 8). Bản chất: phương trình là chiếc cân thăng bằng.
import { useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { int, pick, shuffle, type Rng } from '../core/rng'
import { sfx } from '../core/sound'
import { choicesFrom, near } from './helpers'

interface Side {
  x: number
  k: number
}

const fmtSide = (s: Side) => {
  const parts: string[] = []
  if (s.x) parts.push(s.x === 1 ? 'x' : `${s.x}x`)
  if (s.k || !parts.length) parts.push(String(s.k))
  return parts.join(' + ')
}

function Pan({ side, label }: { side: Side; label: string }) {
  return (
    <div className="pan" aria-label={label}>
      <div className="pan-items">
        {Array.from({ length: side.x }, (_, i) => (
          <span key={`x${i}`} className="weight-x">x</span>
        ))}
        {Array.from({ length: side.k }, (_, i) => (
          <span key={`k${i}`} className="weight-1">1</span>
        ))}
      </div>
      <div className="pan-plate" />
    </div>
  )
}

export function Scale({ left, right, x }: { left: Side; right: Side; x: number }) {
  const diff = left.x * x + left.k - (right.x * x + right.k)
  const tilt = Math.max(-14, Math.min(14, diff * 3))
  return (
    <div className={`scale ${diff === 0 ? 'balanced' : 'tilted'}`}>
      <div className="beam" style={{ transform: `rotate(${tilt}deg)` }}>
        <Pan side={left} label="Đĩa trái" />
        <Pan side={right} label="Đĩa phải" />
      </div>
      <div className="fulcrum" />
      <div className="scale-status">{diff === 0 ? '⚖️ Thăng bằng' : '⚠️ Mất thăng bằng!'}</div>
    </div>
  )
}

const PUZZLES = [
  { a: 2, b: 3, x: 4 },
  { a: 3, b: 2, x: 3 },
]

function BalanceExplore({ onDiscover, say }: ExploreProps) {
  const [p, setP] = useState(0)
  const puzzle = PUZZLES[p % PUZZLES.length]
  const start = { left: { x: puzzle.a, k: puzzle.b }, right: { x: 0, k: puzzle.a * puzzle.x + puzzle.b } }
  const [left, setLeft] = useState<Side>(start.left)
  const [right, setRight] = useState<Side>(start.right)
  const [log, setLog] = useState<string[]>([`${fmtSide(start.left)} = ${fmtSide(start.right)}`])
  const [warn, setWarn] = useState<string | null>(null)
  const solved = left.x === 1 && left.k === 0 && right.x === 0

  const apply = (l: Side, r: Side, step: string) => {
    setLeft(l)
    setRight(r)
    setLog((g) => [...g, `${fmtSide(l)} = ${fmtSide(r)}   (${step})`])
    setWarn(null)
    sfx.pop()
    if (l.x === 1 && l.k === 0 && r.x === 0) {
      sfx.correct()
      say(`Tìm được x bằng ${r.k}. Mỗi bước ta làm giống nhau ở cả hai bên nên cân luôn thăng bằng.`)
    }
  }

  const oneSide = () => {
    if (left.k === 0) return
    const l = { ...left, k: left.k - 1 }
    setLeft(l)
    setWarn('Chỉ bớt ở bên trái → cân lệch! Đẳng thức không còn đúng nữa.')
    sfx.wrong()
    say('Ối! Bớt một bên thì cân bị lệch. Phải làm giống nhau ở cả hai bên.')
    setTimeout(() => {
      setLeft(left)
      setWarn((w) => (w ? 'Cân đã được đặt lại. Hãy làm giống nhau ở CẢ HAI bên.' : w))
    }, 1800)
  }

  const canDivide = left.k === 0 && left.x > 1 && right.x === 0 && right.k % left.x === 0

  return (
    <div className="bal-explore">
      <Scale left={left} right={right} x={puzzle.x} />
      <div className="eq big">
        {fmtSide(left)} = {fmtSide(right)}
      </div>
      <div className="btn-row wrap">
        <button className="btn" disabled={left.k === 0 || solved} onClick={() => apply({ ...left, k: left.k - 1 }, { ...right, k: right.k - 1 }, 'bớt 1 ở cả hai bên')}>
          − 1 ở cả hai bên
        </button>
        {left.k > 1 && (
          <button className="btn" onClick={() => apply({ ...left, k: 0 }, { ...right, k: right.k - left.k }, `bớt ${left.k} ở cả hai bên`)}>
            − {left.k} ở cả hai bên
          </button>
        )}
        <button className="btn btn-warn" disabled={left.k === 0 || solved} onClick={oneSide}>
          − 1 chỉ bên trái
        </button>
        <button
          className="btn"
          disabled={!canDivide || solved}
          onClick={() => apply({ x: 1, k: 0 }, { x: 0, k: right.k / left.x }, `chia cả hai bên cho ${left.x}`)}
        >
          ÷ {left.x > 1 ? left.x : 'a'} ở cả hai bên
        </button>
      </div>
      {warn && <p className="note warn">{warn}</p>}
      <ol className="eq-log">
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ol>
      {solved && (
        <div className="row-center">
          <p className="note good">
            x = {right.k}. Thử lại: {puzzle.a}·{right.k} + {puzzle.b} = {puzzle.a * right.k + puzzle.b} ✔
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (p >= 1) return onDiscover()
              const np = PUZZLES[(p + 1) % PUZZLES.length]
              setP(p + 1)
              const l = { x: np.a, k: np.b }
              const r = { x: 0, k: np.a * np.x + np.b }
              setLeft(l)
              setRight(r)
              setLog([`${fmtSide(l)} = ${fmtSide(r)}`])
            }}
          >
            {p >= 1 ? 'Mình hiểu bản chất rồi ➜' : 'Giải phương trình khác ➜'}
          </button>
        </div>
      )}
    </div>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  if (level === 1) {
    const x = int(rng, 2, 12)
    const b = int(rng, 2, 15)
    return {
      level,
      prompt: `Số nào là nghiệm của phương trình x + ${b} = ${x + b}?`,
      choices: choicesFrom(
        rng,
        x,
        [
          { value: x + 2 * b, misconception: 'chuyen-ve-khong-doi-dau', why: `Chuyển ${b} sang vế phải phải ĐỔI DẤU: x = ${x + b} − ${b}.` },
          { value: x + b, misconception: 'nham-ve', why: 'Đó là vế phải. Nghiệm là giá trị của x làm hai vế bằng nhau.' },
        ],
        { fill: near(x, 0) },
      ),
      explain: `Thay x = ${x}: ${x} + ${b} = ${x + b} ✔. Hai đĩa cân bằng nhau.`,
    }
  }
  if (level === 2) {
    const a = int(rng, 2, 6)
    const b = int(rng, 1, 9)
    const c = a * int(rng, 2, 9) + b
    return {
      level,
      prompt: `Cho ${a}x + ${b} = ${c}. Bước biến đổi nào giữ cho "cân" thăng bằng?`,
      layout: 'list',
      choices: shuffle(rng, [
        { label: `${a}x = ${c} − ${b}`, correct: true },
        { label: `${a}x = ${c} + ${b}`, misconception: 'chuyen-ve-khong-doi-dau', why: `Bớt ${b} ở vế trái thì cũng phải BỚT ${b} ở vế phải, không phải cộng.` },
        { label: `x + ${b} = ${c} : ${a}`, misconception: 'chia-mot-phan', why: `Chia cho ${a} phải chia CẢ vế trái (cả ${a}x lẫn ${b}), không chỉ một phần.` },
        { label: `${a}x = ${c}`, misconception: 'bo-so-hang', why: `Bỏ ${b} ở một bên mà không làm gì bên kia → cân lệch.` },
      ]),
      explain: `Bớt ${b} ở CẢ HAI vế: ${a}x + ${b} − ${b} = ${c} − ${b}. "Chuyển vế đổi dấu" chính là bớt cùng một lượng ở hai bên.`,
    }
  }
  if (level === 3) {
    const a = int(rng, 2, 7)
    const x = int(rng, -5, 9)
    const b = int(rng, 1, 12)
    const minus = rng() < 0.5
    const c = minus ? a * x - b : a * x + b
    return {
      level,
      prompt: `Giải phương trình ${a}x ${minus ? '−' : '+'} ${b} = ${c}`,
      choices: choicesFrom(
        rng,
        x,
        [
          {
            value: minus ? (c - b) / a : (c + b) / a,
            misconception: 'chuyen-ve-khong-doi-dau',
            why: `Chuyển ${minus ? '−' : '+'}${b} sang vế phải phải đổi dấu thành ${minus ? '+' : '−'}${b}.`,
          },
          { value: minus ? c + b - a : c - b - a, misconception: 'tru-thay-chia', why: `${a}x nghĩa là ${a} nhân x → phải CHIA cho ${a}, không phải trừ.` },
          { value: minus ? a * (c + b) : a * (c - b), misconception: 'nhan-thay-chia', why: `Muốn tìm x từ ${a}x thì chia cho ${a}.` },
        ].filter((w) => Number.isInteger(w.value)),
        { fill: near(x, -20) },
      ),
      explain: `${a}x = ${c} ${minus ? '+' : '−'} ${b} = ${a * x} → x = ${a * x} : ${a} = ${x}.`,
    }
  }
  // Mức 4: ẩn ở cả hai vế, bài toán thực tế.
  const kind = pick(rng, ['two-sides', 'word'] as const)
  if (kind === 'two-sides') {
    const x = int(rng, 1, 9)
    const a = int(rng, 4, 8)
    const c = int(rng, 1, a - 1)
    const b = int(rng, 1, 10)
    const d = (a - c) * x + b
    return {
      level,
      prompt: `Giải phương trình ${a}x + ${b} = ${c}x + ${d}`,
      choices: choicesFrom(
        rng,
        x,
        [
          { value: (d - b) / (a + c), misconception: 'chuyen-ve-khong-doi-dau', why: `Bớt ${c}x ở cả hai vế: ${a}x − ${c}x, không phải ${a}x + ${c}x.` },
          { value: (d + b) / (a - c), misconception: 'chuyen-ve-khong-doi-dau', why: `Bớt ${b} ở cả hai vế: ${d} − ${b}.` },
          { value: (d - b) / a, misconception: 'bo-an-ve-phai', why: `Không thể bỏ ${c}x ở vế phải — phải bớt ${c}x ở CẢ HAI vế.` },
        ].filter((w) => Number.isInteger(w.value)),
        { fill: near(x, -20) },
      ),
      explain: `Bớt ${c}x ở hai vế: ${a - c}x + ${b} = ${d}. Bớt ${b}: ${a - c}x = ${d - b}. Chia ${a - c}: x = ${x}.`,
    }
  }
  const price = pick(rng, [5, 6, 8, 10, 12])
  const n = int(rng, 3, 9)
  const ship = pick(rng, [15, 20, 25, 30])
  const total = price * n + ship
  return {
    level,
    prompt: `Mua một số quyển vở giá ${price} nghìn đồng/quyển, cộng phí giao hàng ${ship} nghìn đồng, tổng cộng ${total} nghìn đồng. Đã mua bao nhiêu quyển?`,
    choices: choicesFrom(
      rng,
      n,
      [
        { value: (total + ship) / price, misconception: 'chuyen-ve-khong-doi-dau', why: 'Phí giao hàng phải được TRỪ khỏi tổng.' },
        { value: Math.round(total / price), misconception: 'bo-hang-so', why: 'Tổng tiền có cả phí giao hàng — phải bớt phí trước khi chia.' },
      ].filter((w) => Number.isInteger(w.value)),
      { fill: near(n, 1) },
    ),
    explain: `Gọi x là số quyển: ${price}x + ${ship} = ${total} → ${price}x = ${total - ship} → x = ${n}.`,
  }
}

export const ptBacNhat: Lesson = {
  id: 'pt-bac-nhat',
  skillId: 'thcs.pt-bac-nhat',
  title: 'Phương trình bậc nhất một ẩn',
  emoji: '⚖️',
  hook: {
    text: '"Chuyển vế đổi dấu" — câu thần chú ai cũng thuộc. Nhưng VÌ SAO chuyển vế lại phải đổi dấu? Nếu hiểu điều này, em sẽ không bao giờ nhầm dấu nữa.',
    visual: <span className="hook-emoji">⚖️❓</span>,
  },
  explore: {
    intro: 'Mỗi hộp x nặng như nhau (chưa biết). Mỗi quả cân 1 nặng 1 đơn vị. Hãy làm cho đĩa trái chỉ còn MỘT hộp x mà cân vẫn thăng bằng.',
    Component: BalanceExplore,
  },
  essence: {
    bigIdea: 'Phương trình là chiếc cân thăng bằng: làm gì với vế này thì phải làm y hệt với vế kia.',
    points: [
      '⚖️ Dấu "=" nghĩa là hai vế nặng bằng nhau — cân thăng bằng.',
      '➖ "Chuyển vế đổi dấu" thực chất là BỚT (hoặc thêm) cùng một lượng ở cả hai vế.',
      '➗ Nhân/chia cả hai vế với cùng một số khác 0 — cân vẫn thăng bằng.',
      '🎯 Mục tiêu: cô lập x — một hộp x ở một bên, các quả cân ở bên kia.',
    ],
    analogy: 'Hai bạn có số tiền bằng nhau, mỗi bạn tiêu 10 nghìn — họ vẫn có số tiền bằng nhau.',
  },
  practice,
  teachBack: {
    prompt: 'Giải thích vì sao từ 3x + 5 = 20 ta được 3x = 20 − 5?',
    options: [
      { who: '🐺 Sói', text: 'Vì quy tắc là chuyển vế thì đổi dấu, cứ thế áp dụng.', correct: false, feedback: 'Đó là quy tắc, chưa phải lý do. Gặp bài lạ sẽ dễ nhầm.' },
      { who: '🦉 Cú', text: 'Vì ta bớt 5 ở cả hai vế: vế trái 3x + 5 − 5 = 3x, vế phải 20 − 5. Hai vế vẫn bằng nhau.', correct: true, feedback: 'Chính xác! "Đổi dấu" chỉ là kết quả của việc bớt cùng một lượng ở hai bên.' },
      { who: '🐧 Cánh cụt', text: 'Vì số 5 không thích ở cùng chỗ với x.', correct: false, feedback: 'Vui đấy, nhưng không phải lý do toán học!' },
    ],
    ownWordsHint: 'Ví dụ: Dấu bằng giống như…, nên khi…',
  },
  remember: ['Dấu = là cân thăng bằng', 'Làm gì một vế thì làm y hệt vế kia', 'Chuyển vế đổi dấu = bớt cùng một lượng ở hai vế', 'Luôn thử lại nghiệm'],
}

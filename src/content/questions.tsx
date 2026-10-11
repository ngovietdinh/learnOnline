// Bộ sinh câu hỏi dùng chung cho nội dung mầm non – tiểu học.
import type { ReactNode } from 'react'
import type { Choice, Question } from '../lessons/types'
import type { Level } from '../core/stages'
import { int, pick, shuffle, type Rng } from '../core/rng'
import type { Seg } from '../core/speech'
import type { Card } from './kit'
import { choicesFrom, near } from '../lessons/helpers'
import { Emo, EmoText } from '../components/Critter'

export type Gen = (level: Level, rng: Rng) => Question

// ───────────────────────── Kho câu hỏi soạn tay ─────────────────────────

export interface BankItem {
  lv: Level
  q: string
  a: string
  /** Đáp án sai: chỉ chữ, hoặc [chữ, vì sao sai]. */
  wrong: (string | [string, string])[]
  ex: string
  visual?: ReactNode
  layout?: Question['layout']
  speak?: Seg[]
}

/** Mã ngộ nhận "ng:" mang theo chính lời giải thích — báo cáo phụ huynh đọc được ngay. */
export const misFromWhy = (why: string) => `ng:${why.slice(0, 90)}`

export function bank(items: BankItem[]): Gen {
  return (level, rng) => {
    let pool = items.filter((it) => it.lv === level)
    if (!pool.length) {
      const lower = items.filter((it) => it.lv <= level)
      const top = Math.max(...lower.map((it) => it.lv), 1)
      pool = lower.filter((it) => it.lv === top)
    }
    if (!pool.length) pool = items
    const it = pick(rng, pool)
    const choices: Choice[] = [
      { label: it.a, correct: true },
      ...it.wrong.map((w) => (typeof w === 'string' ? { label: w } : { label: w[0], why: w[1], misconception: misFromWhy(w[1]) })),
    ]
    return {
      level: it.lv,
      prompt: it.q,
      visual: it.visual,
      layout: it.layout ?? (choices.some((c) => c.label.length > 22) ? 'list' : undefined),
      choices: shuffle(rng, choices),
      explain: it.ex,
      speakSegs: it.speak,
    }
  }
}

// ───────────────────────── Từ vựng có hình ─────────────────────────

export interface VocabOpts {
  /** Câu hỏi mức 1–2: "Đâu là …?" */
  ask?: (c: Card) => string
  /** Câu hỏi mức 3: nhìn hình chọn tên (cho bé biết đọc). */
  name?: boolean
  explain?: (c: Card) => string
  /** Tiếng Anh: đọc từ bằng giọng tiếng Anh. */
  en?: (c: Card) => string
}

export function vocab(cards: Card[], o: VocabOpts = {}): Gen {
  const ask = o.ask ?? ((c: Card) => `Đâu là ${c.name}?`)
  const explain = o.explain ?? ((c: Card) => `Đúng rồi! Đây là ${c.name}.`)
  return (level, rng) => {
    const target = pick(rng, cards)
    const n = level === 1 ? 2 : level === 2 ? 3 : 4
    const others = shuffle(rng, cards.filter((c) => c.key !== target.key)).slice(0, n - 1)
    const set = shuffle(rng, [target, ...others])
    if (level >= 3 && o.name) {
      return {
        level,
        prompt: o.en ? 'Hình này tiếng Anh là gì?' : 'Đây là gì?',
        visual: <span className="hook-emoji"><EmoText text={target.emoji} /></span>,
        choices: set.map((c) => ({
          label: o.en ? o.en(c) : c.name,
          correct: c.key === target.key,
          why: c.key === target.key ? undefined : o.en ? `${o.en(c)} là ${c.name}.` : `Đó là ${c.name}.`,
          misconception: c.key === target.key ? undefined : 'nham-doi-tuong',
        })),
        explain: o.en ? `${o.en(target)} nghĩa là ${target.name}.` : explain(target),
      }
    }
    return {
      level,
      prompt: o.en ? `Nghe cô đọc rồi chọn hình đúng: ${o.en(target)}` : ask(target),
      speakSegs: o.en ? ['Nghe cô đọc rồi chọn hình đúng:', { text: o.en(target), lang: 'en' }] : undefined,
      layout: 'big',
      choices: set.map((c) => ({
        label: c.name,
        visual: (
          <span className="big-visual" style={{ ['--c' as string]: c.color ?? '#ffd6e7' }}>
            <Emo e={c.emoji} />
          </span>
        ),
        correct: c.key === target.key,
        misconception: c.key === target.key ? undefined : 'nham-doi-tuong',
        why: c.key === target.key ? undefined : o.en ? `Đây là ${c.name}. Mình tìm ${target.name} nhé!` : `Đây là ${c.name}. Mình tìm ${target.name} nhé!`,
      })),
      explain: o.en ? `${o.en(target)} nghĩa là ${target.name}.` : explain(target),
    }
  }
}

// ───────────────────────── Phép tính ─────────────────────────

export type Op = '+' | '-' | '×' | ':'
export interface ArithLevel {
  op: Op | Op[]
  a: [number, number]
  b: [number, number]
  /** bare: a + b = ?   missing: a + ? = c   word: bài toán có lời   cmp: so sánh với một số */
  form?: ('bare' | 'missing' | 'word')[]
  /** Bắt buộc có nhớ / có mượn (cộng trừ) — để luyện đúng trọng tâm. */
  carry?: boolean
  noCarry?: boolean
}

const OP_WORD: Record<Op, string> = { '+': 'cộng', '-': 'trừ', '×': 'nhân', ':': 'chia' }
const NAMES = ['Lan', 'Minh', 'An', 'Hà', 'Bình', 'Mai', 'Nam', 'Hoa']
const ITEMS = ['quả cam', 'quyển vở', 'viên bi', 'bông hoa', 'cái kẹo', 'con tem', 'quả bóng', 'chiếc bút']

function digitsSumNoCarry(a: number, b: number): number {
  // Cộng từng hàng nhưng QUÊN nhớ — lỗi kinh điển.
  let r = 0
  let m = 1
  while (a > 0 || b > 0) {
    r += ((a % 10) + (b % 10)) % 10 * m
    a = Math.floor(a / 10)
    b = Math.floor(b / 10)
    m *= 10
  }
  return r
}
function digitsSubSwap(a: number, b: number): number {
  // Trừ từng hàng bằng cách lấy số lớn trừ số bé — lỗi "trừ ngược".
  let r = 0
  let m = 1
  while (a > 0 || b > 0) {
    r += Math.abs((a % 10) - (b % 10)) * m
    a = Math.floor(a / 10)
    b = Math.floor(b / 10)
    m *= 10
  }
  return r
}
const hasCarry = (a: number, b: number) => digitsSumNoCarry(a, b) !== a + b
const hasBorrow = (a: number, b: number) => digitsSubSwap(a, b) !== a - b

function makePair(rng: Rng, L: ArithLevel, op: Op): [number, number] {
  for (let t = 0; t < 200; t++) {
    let a = int(rng, L.a[0], L.a[1])
    let b = int(rng, L.b[0], L.b[1])
    if (op === '-' && b > a) [a, b] = [b, a]
    if (op === ':') {
      // a : b chia hết — sinh từ thương
      if (b === 0) continue
      a = a * b
    }
    if (op === '+' && L.carry && !hasCarry(a, b)) continue
    if (op === '+' && L.noCarry && hasCarry(a, b)) continue
    if (op === '-' && L.carry && !hasBorrow(a, b)) continue
    if (op === '-' && L.noCarry && hasBorrow(a, b)) continue
    return [a, b]
  }
  return [L.a[1], L.b[0] || 1]
}

const calc = (a: number, b: number, op: Op) => (op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : a / b)

function explainOp(a: number, b: number, op: Op, r: number): string {
  if (op === '+') {
    if (a < 10 && b < 10 && r > 10) return `${a} cộng ${b}: lấy ${10 - a} từ ${b} cho đủ 10, còn ${b - (10 - a)}; 10 cộng ${b - (10 - a)} bằng ${r}.`
    if (hasCarry(a, b)) return `Đặt tính thẳng hàng, cộng từ hàng đơn vị: đủ 10 thì đổi thành 1 chục — "viết số đơn vị, nhớ 1" sang hàng chục. ${a} + ${b} = ${r}.`
    return `Cộng đơn vị với đơn vị, chục với chục: ${a} + ${b} = ${r}.`
  }
  if (op === '-') {
    if (hasBorrow(a, b)) return `Hàng đơn vị không đủ để trừ thì đổi 1 chục thành 10 đơn vị ("mượn 1"), rồi trừ hàng chục thêm 1. ${a} − ${b} = ${r}. Thử lại: ${r} + ${b} = ${a}.`
    return `${a} − ${b} = ${r}. Thử lại bằng phép cộng: ${r} + ${b} = ${a}.`
  }
  if (op === '×') return `${a} × ${b} là ${b} nhóm, mỗi nhóm ${a} (hay ${a} nhóm ${b}) = ${r}.`
  return `${a} : ${b} = ${r} vì ${r} × ${b} = ${a}. Chia là tìm xem mỗi phần được bao nhiêu khi chia đều.`
}

function wordProblem(rng: Rng, a: number, b: number, op: Op): string {
  const who = pick(rng, NAMES)
  const who2 = pick(rng, NAMES.filter((n) => n !== who))
  const it = pick(rng, ITEMS)
  switch (op) {
    case '+':
      return `${who} có ${a} ${it}, ${who2} cho thêm ${b} ${it}. Hỏi ${who} có tất cả bao nhiêu ${it}?`
    case '-':
      return `${who} có ${a} ${it}, ${who} cho ${who2} ${b} ${it}. Hỏi ${who} còn lại bao nhiêu ${it}?`
    case '×':
      return `Có ${b} hộp, mỗi hộp có ${a} ${it}. Hỏi có tất cả bao nhiêu ${it}?`
    case ':':
      return `Có ${a} ${it} chia đều cho ${b} bạn. Hỏi mỗi bạn được mấy ${it}?`
  }
}

export function arith(levels: Partial<Record<Level, ArithLevel>>): Gen {
  return (level, rng) => {
    const L = levels[level] ?? levels[3] ?? levels[2] ?? levels[1]!
    const op = Array.isArray(L.op) ? pick(rng, L.op) : L.op
    const [a, b] = makePair(rng, L, op)
    const r = calc(a, b, op)
    const form = pick(rng, L.form ?? ['bare'])
    const wrongs: { value: number; misconception?: string; why?: string }[] = []
    if (op === '+') {
      if (hasCarry(a, b)) wrongs.push({ value: digitsSumNoCarry(a, b), misconception: 'quen-nho', why: 'Quên nhớ 1 sang hàng chục rồi! Đủ 10 đơn vị phải đổi thành 1 chục.' })
      wrongs.push({ value: r + 1, misconception: 'dem-lech', why: 'Lệch 1 — có thể em đếm cả số bắt đầu. Hãy tách để tròn chục rồi cộng.' })
      wrongs.push({ value: Math.abs(a - b), misconception: 'nham-phep-tinh', why: '"Thêm", "tất cả" là phép CỘNG, không phải trừ.' })
    } else if (op === '-') {
      if (hasBorrow(a, b)) wrongs.push({ value: digitsSubSwap(a, b), misconception: 'tru-nguoc', why: 'Em đã lấy số bé trừ số lớn ở hàng đơn vị. Không đủ trừ thì phải mượn 1 chục.' })
      wrongs.push({ value: r + 1, misconception: 'dem-lech', why: 'Lệch 1 rồi. Thử lại bằng phép cộng để kiểm tra nhé.' })
      wrongs.push({ value: a + b, misconception: 'nham-phep-tinh', why: '"Cho đi", "còn lại" là phép TRỪ, không phải cộng.' })
    } else if (op === '×') {
      wrongs.push({ value: a + b, misconception: 'cong-thay-nhan', why: 'Nhân là cộng nhiều lần cùng một số, không phải cộng hai số với nhau.' })
      wrongs.push({ value: a * (b + 1), misconception: 'nham-bang-nhan', why: `Nhầm sang ${a} × ${b + 1} rồi. Đọc lại bảng nhân ${a} nhé.` })
      wrongs.push({ value: a * Math.max(1, b - 1), misconception: 'nham-bang-nhan', why: `Nhầm sang ${a} × ${b - 1} rồi. Đọc lại bảng nhân ${a} nhé.` })
    } else {
      wrongs.push({ value: a - b, misconception: 'tru-thay-chia', why: 'Chia đều là tìm mỗi phần bao nhiêu — không phải trừ.' })
      wrongs.push({ value: r + 1, misconception: 'nham-bang-chia', why: `Thử lại: ${r + 1} × ${b} = ${(r + 1) * b}, không bằng ${a}.` })
      wrongs.push({ value: Math.max(1, r - 1), misconception: 'nham-bang-chia', why: `Thử lại: ${Math.max(1, r - 1)} × ${b} = ${Math.max(1, r - 1) * b}, không bằng ${a}.` })
    }
    if (form === 'missing') {
      const ans = b
      return {
        level,
        prompt: `${a} ${op === '-' ? '−' : op} ? = ${r}`,
        speak: `${a} ${OP_WORD[op]} mấy bằng ${r}?`,
        choices: choicesFrom(
          rng,
          ans,
          [
            { value: op === '+' || op === '-' ? r + a : r * a, misconception: 'nham-phep-tinh', why: op === '+' ? `Tìm số hạng chưa biết: lấy tổng trừ số hạng đã biết: ${r} − ${a}.` : op === '-' ? `Tìm số trừ: lấy số bị trừ trừ hiệu: ${a} − ${r}.` : op === '×' ? `Tìm thừa số: lấy tích chia thừa số kia: ${r} : ${a}.` : `Tìm số chia: lấy số bị chia chia thương: ${a} : ${r}.` },
            { value: ans + 1, misconception: 'dem-lech' },
          ].filter((w) => w.value !== ans && w.value >= 0),
          { fill: near(ans, 0) },
        ),
        explain: `${a} ${op === '-' ? '−' : op} ${ans} = ${r}. ${op === '+' ? `Muốn tìm số hạng chưa biết, lấy tổng trừ số hạng kia: ${r} − ${a} = ${ans}.` : op === '-' ? `Muốn tìm số trừ, lấy số bị trừ trừ hiệu: ${a} − ${r} = ${ans}.` : op === '×' ? `Muốn tìm thừa số, lấy tích chia thừa số kia: ${r} : ${a} = ${ans}.` : `Muốn tìm số chia, lấy số bị chia chia thương: ${a} : ${r} = ${ans}.`}`,
      }
    }
    const prompt = form === 'word' ? wordProblem(rng, a, b, op) : `${a} ${op === '-' ? '−' : op} ${b} = ?`
    return {
      level,
      prompt,
      speak: form === 'word' ? undefined : `${a} ${OP_WORD[op]} ${b} bằng mấy?`,
      choices: choicesFrom(rng, r, wrongs.filter((w) => w.value !== r && w.value >= 0), { fill: near(r, 0) }),
      explain: explainOp(a, b, op, r),
    }
  }
}

/** Ghép nhiều bộ sinh: mỗi mức chọn ngẫu nhiên một bộ. */
export function mix(...gens: Gen[]): Gen {
  return (level, rng) => pick(rng, gens)(level, rng)
}

/** Dùng bộ sinh khác nhau theo mức. */
export function byLevel(m: Partial<Record<Level, Gen>>): Gen {
  return (level, rng) => (m[level] ?? m[3] ?? m[2] ?? m[1]!)(level, rng)
}

/** Đếm hình: "Có mấy …?" */
export function countGen(things: { emoji: string; name: string }[], max = 10): Gen {
  return (level, rng) => {
    const t = pick(rng, things)
    const n = int(rng, level === 1 ? 1 : 3, level === 1 ? 5 : max)
    return {
      level,
      prompt: `Có mấy ${t.name}?`,
      layout: 'grid',
      visual: (
        <div className="q-scatter">
          {Array.from({ length: n }, (_, i) => (
            <span key={i}>{t.emoji}</span>
          ))}
        </div>
      ),
      choices: choicesFrom(
        rng,
        n,
        [
          { value: n + 1, misconception: 'dem-lap', why: 'Có bạn bị đếm hai lần rồi. Chạm từng bạn một, mỗi bạn một lần nhé.' },
          { value: n - 1, misconception: 'bo-sot', why: 'Còn sót một bạn chưa đếm. Đếm lần lượt từ trái sang phải nhé.' },
        ].filter((w) => w.value > 0),
        { count: 3, fill: near(n, 1) },
      ),
      explain: `Đếm từng ${t.name} một lần: số cuối cùng là ${n}, vậy có ${n} ${t.name}.`,
    }
  }
}

export function numberWord(n: number): string {
  const W = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười']
  return W[n] ?? String(n)
}

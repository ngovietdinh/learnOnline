// TOÁN LỚP 4 – LỚP 5 (Chương trình GDPT 2018).
import { useState } from 'react'
import type { ExploreProps } from '../lessons/types'
import { cc, g } from '../core/standards'
import { int, pick, shuffle } from '../core/rng'
import { choicesFrom, near, vn } from '../lessons/helpers'
import { fmt } from '../core/vnNumber'
import { sfx } from '../core/sound'
import { centerOf, fx } from '../core/fx'
import { defineLesson, tb, type Defined } from './define'
import { cardsExplore, type Explore } from './kit'
import { columnExplore, hundredGridExplore, speedExplore } from './mathKit'
import { compareGen, placeGen } from './mathGens'
import { arith, bank, byLevel, mix, type Gen } from './questions'
import { FractionBar } from '../lessons/fractions'

const L4 = { stage: 'tieuhoc' as const, grade: 4, gradeLabel: 'Lớp 4', subject: 'toan' as const }
const L5 = { stage: 'tieuhoc' as const, grade: 5, gradeLabel: 'Lớp 5', subject: 'toan' as const }

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)
const frac = (n: number, d: number) => {
  const k = gcd(Math.abs(n), Math.abs(d))
  return `${n / k}/${d / k}`
}
const d2 = (x: number) => vn(Math.round(x * 100) / 100, 2)

// ───────────────────────── LỚP 4 ─────────────────────────

const roundGen: Gen = (level, rng) => {
  if (level === 1) return placeGen(999999999)(level, rng)
  const n = int(rng, 10000, 999999)
  const to = pick(rng, [1000, 10000, 100000].filter((t) => t < n))
  const r = Math.round(n / to) * to
  const down = Math.floor(n / to) * to
  const up = Math.ceil(n / to) * to
  const tn = to === 1000 ? 'nghìn' : to === 10000 ? 'chục nghìn' : 'trăm nghìn'
  return {
    level,
    prompt: `Làm tròn số ${fmt(n)} đến hàng ${tn}.`,
    choices: choicesFrom(rng, fmt(r), [
      { value: fmt(r === down ? up : down), misconception: 'ng:Làm tròn sai chiều', why: `Nhìn chữ số ngay sau hàng ${tn}: bé hơn 5 thì làm tròn xuống, từ 5 trở lên thì làm tròn lên.` },
      { value: fmt(Math.floor(n / (to / 10)) * (to / 10)), misconception: 'ng:Làm tròn nhầm hàng', why: `Làm tròn đến hàng ${tn}: các chữ số sau hàng đó đều thành 0.` },
    ].filter((w) => w.value !== fmt(r))),
    explain: `Chữ số ngay sau hàng ${tn} quyết định: ${fmt(n)} gần ${fmt(r)} hơn.`,
  }
}
const t4SoTrieu = defineLesson({
  ...L4,
  id: 't4-so-trieu',
  title: 'Số có nhiều chữ số — lớp triệu, làm tròn số',
  emoji: '🌏',
  essenceLine: 'Mỗi lớp gồm 3 hàng (đơn vị – chục – trăm); đọc theo từng lớp: triệu, nghìn, đơn vị.',
  standards: [g('Toán 4 · Số có nhiều chữ số; lớp triệu; làm tròn số'), cc('4.NBT.A.2'), cc('4.NBT.A.3')],
  prereqs: ['t3-so-100000'],
  hook: 'Dân số Việt Nam khoảng 100 000 000 người. Số này đọc là gì? Có mấy chữ số 0?',
  hookVisual: '🇻🇳👨‍👩‍👧‍👦',
  explore: cardsExplore(
    'Em chạm vào từng lớp để nghe cô giải thích nhé!',
    [
      { key: 'dv', name: 'lớp đơn vị', emoji: '1 · 10 · 100', say: 'Lớp đơn vị gồm ba hàng: đơn vị, chục, trăm.' },
      { key: 'ng', name: 'lớp nghìn', emoji: '1 000 → 100 000', say: 'Lớp nghìn gồm ba hàng: nghìn, chục nghìn, trăm nghìn.' },
      { key: 'tr', name: 'lớp triệu', emoji: '1 000 000 →', say: 'Lớp triệu gồm ba hàng: triệu, chục triệu, trăm triệu.' },
      { key: 'doc', name: 'cách đọc', emoji: '12 345 678', say: 'Đọc theo từng lớp từ trái sang: mười hai triệu ba trăm bốn mươi lăm nghìn sáu trăm bảy mươi tám.' },
    ],
    'Em giỏi lắm! Cứ ba chữ số là một lớp, tách ra đọc là dễ!',
    { big: false },
  ),
  essence: { bigIdea: 'Tách ba chữ số một lớp, đọc từng lớp.', points: ['12 345 678: 12 triệu · 345 nghìn · 678.', 'Làm tròn: xem chữ số ngay sau hàng cần làm tròn.', 'Từ 5 trở lên làm tròn lên, dưới 5 làm tròn xuống.'] },
  practice: byLevel({ 1: placeGen(999999999), 2: roundGen, 3: mix(roundGen, compareGen({ 1: [100000, 999999], 2: [100000, 999999], 3: [1000000, 99999999] })) }),
  teachBack: tb('Làm tròn 47 600 đến hàng nghìn được bao nhiêu? Vì sao?', ['🦉 Cú', '48 000, vì chữ số hàng trăm là 6 (từ 5 trở lên) nên làm tròn lên.', 'Chuẩn!'], [['🐻 Gấu', '47 000, vì bỏ phần sau đi.', 'Phải xem chữ số hàng trăm để quyết định lên hay xuống.'], ['🐸 Ếch', '50 000.', 'Đó là làm tròn đến hàng chục nghìn.']]),
  remember: ['3 chữ số một lớp', 'Đọc từng lớp từ trái', '≥ 5 lên, < 5 xuống'],
  games: ['bongbay'],
})

const t4NhanChiaLon = defineLesson({
  ...L4,
  id: 't4-nhan-chia-lon',
  title: 'Nhân với số có hai chữ số, chia cho số có hai chữ số',
  emoji: '🧮',
  essenceLine: '36 × 24 = 36 × 20 + 36 × 4: tách số rồi cộng các tích riêng.',
  standards: [g('Toán 4 · Nhân với số có hai chữ số; chia cho số có hai chữ số'), cc('4.NBT.B.5'), cc('5.NBT.B.6')],
  prereqs: ['t3-nhan-chia-lon'],
  hook: '36 × 24 có vẻ khó. Nhưng nếu tách 24 = 20 + 4 thì chỉ còn hai phép nhân dễ!',
  hookVisual: '✂️🧮',
  explore: columnExplore('Tích riêng thứ nhất 36 × 4 = 144, tích riêng thứ hai 36 × 20 = 720. Em xem cô cộng hai tích riêng nhé!', [{ a: 720, b: 144, op: '+' }]),
  essence: {
    bigIdea: 'Tách thừa số thành chục và đơn vị rồi cộng các tích.',
    points: ['36 × 24 = 36 × 4 + 36 × 20 = 144 + 720 = 864.', 'Tích riêng thứ hai viết lùi sang trái một cột (vì là chục).', 'Chia: ước lượng thương bằng cách làm tròn số chia.'],
  },
  practice: byLevel({
    1: arith({ 1: { op: '×', a: [12, 40], b: [11, 19] } }),
    2: mix(arith({ 2: { op: '×', a: [21, 99], b: [12, 35] } }), arith({ 2: { op: ':', a: [11, 40], b: [12, 25] } })),
    3: mix(arith({ 3: { op: '×', a: [25, 120], b: [12, 30], form: ['word'] } }), arith({ 3: { op: ':', a: [12, 50], b: [12, 36], form: ['word'] } })),
  }),
  teachBack: tb('Vì sao tích riêng thứ hai phải viết lùi sang trái một cột?', ['🐬 Cá heo', 'Vì đó là nhân với số chục: 36 × 2 chục = 72 chục = 720, nên chữ số 2 phải nằm ở hàng chục.', 'Hiểu đúng bản chất!'], [['🐻 Gấu', 'Vì quy định như vậy.', 'Có lý do: đó là các chục.'], ['🐸 Ếch', 'Để trông đẹp hơn.', 'Viết sai cột thì kết quả sai.']]),
  remember: ['Tách thừa số theo hàng', 'Tích riêng thứ hai lùi 1 cột', 'Ước lượng để kiểm tra'],
  games: ['bongbay'],
})

function LevelOut({ onDiscover, say }: ExploreProps) {
  const sets = [
    [3, 7, 5],
    [8, 2, 6, 4],
  ]
  const [k, setK] = useState(0)
  const [cols, setCols] = useState(sets[0])
  const [done, setDone] = useState(false)
  const avg = sets[k].reduce((a, b) => a + b, 0) / sets[k].length
  return (
    <div className="levelout">
      <div className="lo-cols">
        {cols.map((h, i) => (
          <div key={i} className="lo-col">
            <div className="lo-stack" style={{ height: `${h * 22}px` }}>
              {Array.from({ length: h }, (_, j) => (
                <span key={j} />
              ))}
            </div>
            <b>{h}</b>
          </div>
        ))}
        {done && <div className="lo-line" style={{ bottom: `${avg * 22 + 26}px` }} />}
      </div>
      <div className="eq big">
        ({sets[k].join(' + ')}) : {sets[k].length} = {done ? <b>{avg}</b> : '?'}
      </div>
      <div className="btn-row center">
        {!done ? (
          <button
            className="btn btn-primary btn-big"
            onClick={(e) => {
              setCols(sets[k].map(() => avg))
              setDone(true)
              sfx.levelUp()
              fx.burst(...centerOf(e.currentTarget), { count: 30 })
              say(`San đều các cột: mỗi cột có ${avg}. Trung bình cộng là ${avg}.`)
            }}
          >
            🌊 San đều các cột
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              if (k + 1 >= sets.length) onDiscover()
              else {
                setK(k + 1)
                setCols(sets[k + 1])
                setDone(false)
              }
            }}
          >
            {k + 1 >= sets.length ? 'Mình hiểu rồi ➜' : 'Bộ số khác ➜'}
          </button>
        )}
      </div>
    </div>
  )
}
const levelOutExplore: Explore = {
  intro: 'Em bấm "San đều" để chuyển khối từ cột cao sang cột thấp nhé!',
  Component: LevelOut,
  lines: ['Em bấm "San đều" để chuyển khối từ cột cao sang cột thấp nhé!', 'San đều các cột: mỗi cột có 5. Trung bình cộng là 5.'],
}
const tbcGen: Gen = (level, rng) => {
  const n = level === 1 ? 2 : level === 2 ? 3 : 4
  const avg = int(rng, 4, 30)
  const xs = Array.from({ length: n }, () => 0)
  let rest = avg * n
  for (let i = 0; i < n - 1; i++) {
    xs[i] = int(rng, Math.max(1, avg - 6), avg + 6)
    rest -= xs[i]
  }
  xs[n - 1] = rest
  if (rest <= 0) return tbcGen(level, rng)
  const sum = avg * n
  return {
    level,
    prompt: level >= 3 ? `Bốn bạn cân nặng ${xs.join(' kg, ')} kg. Trung bình mỗi bạn nặng bao nhiêu ki-lô-gam?` : `Tìm trung bình cộng của ${xs.join(', ')}.`,
    choices: choicesFrom(rng, avg, [
      { value: sum, misconception: 'ng:Chỉ cộng mà quên chia cho số các số hạng', why: `Tổng là ${sum}; còn phải chia cho ${n}.` },
      { value: Math.round(sum / (n + 1)), misconception: 'ng:Chia sai số các số hạng', why: `Có ${n} số nên chia cho ${n}.` },
    ], { fill: near(avg, 1) }),
    explain: `Tổng = ${xs.join(' + ')} = ${sum}; chia cho ${n}: ${sum} : ${n} = ${avg}.`,
  }
}
const t4TrungBinh = defineLesson({
  ...L4,
  id: 't4-trung-binh-cong',
  title: 'Trung bình cộng',
  emoji: '⚖️',
  essenceLine: 'Trung bình cộng là "san đều": tổng chia cho số các số hạng.',
  standards: [g('Toán 4 · Số trung bình cộng'), cc('6.SP.B.5')],
  prereqs: ['t3-bang-chia'],
  hook: 'Ba bạn có 3, 7 và 5 viên bi. Nếu chia lại cho đều thì mỗi bạn có mấy viên?',
  hookVisual: '🔵🔵🔵',
  explore: levelOutExplore,
  essence: { bigIdea: 'Trung bình = san cho đều.', points: ['Cộng tất cả lại (tổng).', 'Chia tổng cho số các số hạng.', 'Trung bình luôn nằm giữa số nhỏ nhất và số lớn nhất.'], analogy: 'Như rót nước từ cốc đầy sang cốc vơi cho bằng nhau.' },
  practice: tbcGen,
  teachBack: tb('Vì sao trung bình cộng của 3, 7, 5 là 5?', ['🐼 Gấu trúc', 'Vì tổng 15 chia đều cho 3 bạn thì mỗi bạn 5 — giống như san cho bằng nhau.', 'Tuyệt vời!'], [['🐻 Gấu', 'Vì 5 là số ở giữa.', 'Trùng hợp thôi; phải tính tổng chia số hạng.'], ['🐸 Ếch', 'Vì 3 + 7 + 5 = 15.', 'Còn phải chia cho 3.']]),
  remember: ['Tổng : số các số hạng', 'Nằm giữa nhỏ nhất và lớn nhất', 'San cho đều'],
  games: ['bongbay'],
})

const fracAddGen: Gen = (level, rng) => {
  if (level === 1) {
    const d = pick(rng, [3, 4, 5, 6, 7, 8, 9])
    const a = int(rng, 1, d - 2)
    const b = int(rng, 1, d - a - 1)
    const sub = rng() < 0.4
    const [x, y] = sub ? [a + b, b] : [a, b]
    const r = sub ? x - y : x + y
    return {
      level,
      prompt: `${x}/${d} ${sub ? '−' : '+'} ${y}/${d} = ?`,
      visual: <FractionBar n={d} shaded={sub ? x : r} />,
      choices: choicesFrom(rng, `${r}/${d}`, [
        { value: `${r}/${d * (sub ? 1 : 2)}`, misconception: 'ng:Cộng cả mẫu số', why: 'Cùng mẫu số thì giữ nguyên mẫu (kích thước mỗi phần), chỉ cộng/trừ tử số.' },
        { value: `${sub ? x + y : Math.abs(x - y)}/${d}`, misconception: 'nham-phep-tinh', why: 'Xem lại dấu của phép tính.' },
      ].filter((w) => w.value !== `${r}/${d}`), { fill: (i) => `${near(r, 0)(i)}/${d}` }),
      explain: `Cùng mẫu số ${d}: giữ mẫu, ${sub ? 'trừ' : 'cộng'} tử: ${x} ${sub ? '−' : '+'} ${y} = ${r} → ${r}/${d}.`,
    }
  }
  const pairs: [number, number][] = [[2, 4], [3, 6], [2, 3], [4, 8], [3, 4], [2, 5]]
  const [d1, d2_] = pick(rng, pairs)
  const a = int(rng, 1, d1 - 1)
  const b = int(rng, 1, d2_ - 1)
  const L = (d1 * d2_) / gcd(d1, d2_)
  const num = a * (L / d1) + b * (L / d2_)
  return {
    level,
    prompt: `${a}/${d1} + ${b}/${d2_} = ?`,
    choices: choicesFrom(rng, frac(num, L), [
      { value: `${a + b}/${d1 + d2_}`, misconception: 'cong-tu-mau', why: 'Không cộng mẫu với mẫu! Phải quy đồng để các phần có cùng kích thước rồi mới cộng tử.' },
      { value: frac(a + b, L), misconception: 'ng:Quy đồng mẫu nhưng quên nhân tử số', why: `Quy đồng: nhân cả tử và mẫu cùng một số: ${a}/${d1} = ${a * (L / d1)}/${L}.` },
    ].filter((w) => w.value !== frac(num, L))),
    explain: `Quy đồng mẫu ${L}: ${a}/${d1} = ${a * (L / d1)}/${L}, ${b}/${d2_} = ${b * (L / d2_)}/${L}. Cộng tử: ${num}/${L}${frac(num, L) !== `${num}/${L}` ? ` = ${frac(num, L)}` : ''}.`,
  }
}
const t4PhanSoCongTru = defineLesson({
  ...L4,
  id: 't4-phan-so-cong-tru',
  title: 'Cộng, trừ phân số',
  emoji: '🍕',
  essenceLine: 'Chỉ cộng được các phần cùng kích thước: cùng mẫu thì cộng tử; khác mẫu thì quy đồng trước.',
  standards: [g('Toán 4 · Phép cộng, phép trừ phân số'), cc('4.NF.B.3'), cc('5.NF.A.1')],
  prereqs: ['th.phan-so'],
  hook: 'Ăn 1/4 cái bánh rồi ăn thêm 1/4 nữa. Đã ăn 2/8 cái bánh hay 2/4 cái bánh?',
  hookVisual: '🍕',
  explore: cardsExplore(
    'Em chạm vào từng thẻ để nghe cô giải thích nhé!',
    [
      { key: 'cung', name: '1/4 + 1/4', emoji: '¼ + ¼', say: 'Một phần tư cộng một phần tư bằng hai phần tư. Mỗi phần vẫn to bằng một phần tư, chỉ có số phần tăng lên.' },
      { key: 'sai', name: 'Không phải 2/8!', emoji: '❌ 2/8', say: 'Nếu cộng cả mẫu thành hai phần tám, mỗi phần lại nhỏ đi, ăn thêm mà bánh lại ít đi. Vô lý!' },
      { key: 'khac', name: '1/2 + 1/4', emoji: '½ + ¼', say: 'Khác mẫu: cắt một phần hai thành hai phần tư. Hai phần tư cộng một phần tư bằng ba phần tư.' },
    ],
    'Em hiểu rồi! Mẫu số là kích thước mỗi phần, chỉ cộng tử số khi các phần cùng kích thước.',
    { big: false },
  ),
  essence: { bigIdea: 'Mẫu số là "đơn vị đo" — chỉ cộng tử khi cùng mẫu.', points: ['Cùng mẫu: giữ mẫu, cộng (trừ) tử.', 'Khác mẫu: quy đồng để cùng kích thước phần.', 'Không bao giờ cộng mẫu với mẫu.'], analogy: '3 quả cam + 2 quả cam = 5 quả cam; "phần tư" cũng là một đơn vị như "quả".' },
  practice: fracAddGen,
  teachBack: tb('Vì sao 1/4 + 1/4 không bằng 2/8?', ['🦉 Cú', 'Vì 2/8 bằng 1/4 — ăn thêm mà lại bằng lúc đầu là vô lý. Cùng mẫu thì giữ mẫu, cộng tử: 2/4.', 'Lập luận tuyệt vời!'], [['🐻 Gấu', 'Vì 2/8 nhiều hơn.', '2/8 = 1/4, không nhiều hơn.'], ['🐸 Ếch', '2/8 cũng đúng.', 'Thử với bánh thật: hai miếng 1/4 là nửa cái bánh = 2/4.']]),
  remember: ['Cùng mẫu: cộng tử', 'Khác mẫu: quy đồng', 'Không cộng mẫu'],
  games: ['bongbay', 'latthe'],
  pairs: [['1/4 + 1/4', '2/4'], ['1/2 + 1/4', '3/4'], ['2/3 − 1/3', '1/3'], ['3/5 + 1/5', '4/5'], ['1/3 + 1/6', '1/2']],
})

const fracMulGen: Gen = (level, rng) => {
  if (level === 1) {
    const d = pick(rng, [2, 3, 4, 5])
    const n = d * int(rng, 2, 6)
    return {
      level,
      prompt: `1/${d} của ${n} quả cam là bao nhiêu quả?`,
      choices: choicesFrom(rng, n / d, [
        { value: n * d, misconception: 'ng:Nhân với mẫu số thay vì chia', why: `Lấy 1/${d} là chia thành ${d} phần bằng nhau rồi lấy 1 phần: ${n} : ${d}.` },
        { value: n - d, misconception: 'tru-thay-chia', why: 'Không phải trừ đi mẫu số.' },
      ], { fill: near(n / d, 1) }),
      explain: `1/${d} của ${n} = ${n} : ${d} = ${n / d}.`,
    }
  }
  const [a, b, c, d] = [int(rng, 1, 4), int(rng, 2, 6), int(rng, 1, 4), int(rng, 2, 6)]
  const div = level >= 3 && rng() < 0.5
  const num = div ? a * d : a * c
  const den = div ? b * c : b * d
  return {
    level,
    prompt: `${a}/${b} ${div ? ':' : '×'} ${c}/${d} = ?`,
    choices: choicesFrom(rng, frac(num, den), [
      div
        ? { value: frac(a * c, b * d), misconception: 'ng:Chia phân số nhưng không đảo ngược phân số thứ hai', why: 'Chia cho một phân số là nhân với phân số đảo ngược.' }
        : { value: frac(a * d + c * b, b * d), misconception: 'ng:Quy đồng rồi cộng thay vì nhân', why: 'Nhân phân số: tử nhân tử, mẫu nhân mẫu, không cần quy đồng.' },
      { value: `${a * c}/${b + d}`, misconception: 'ng:Cộng mẫu số khi nhân', why: 'Mẫu cũng phải nhân với mẫu.' },
    ].filter((w) => w.value !== frac(num, den))),
    explain: div ? `${a}/${b} : ${c}/${d} = ${a}/${b} × ${d}/${c} = ${num}/${den}${frac(num, den) !== `${num}/${den}` ? ` = ${frac(num, den)}` : ''}.` : `Tử nhân tử, mẫu nhân mẫu: ${a} × ${c} = ${num}, ${b} × ${d} = ${den} → ${frac(num, den)}.`,
  }
}
const t4PhanSoNhanChia = defineLesson({
  ...L4,
  id: 't4-phan-so-nhan-chia',
  title: 'Nhân, chia phân số; tìm phân số của một số',
  emoji: '✖️',
  essenceLine: '"1/3 của" nghĩa là chia 3 lấy 1 phần; nhân phân số: tử × tử, mẫu × mẫu; chia là nhân với số đảo ngược.',
  standards: [g('Toán 4 · Phép nhân, phép chia phân số; tìm phân số của một số'), cc('4.NF.B.4'), cc('5.NF.B.4')],
  prereqs: ['t4-phan-so-cong-tru'],
  hook: 'Nửa của nửa cái bánh là bao nhiêu? Câu trả lời chính là 1/2 × 1/2!',
  hookVisual: '🍰',
  explore: cardsExplore(
    'Em chạm vào từng thẻ nhé!',
    [
      { key: 'cua', name: '1/3 của 12', emoji: '12 : 3', say: 'Một phần ba của mười hai: chia mười hai thành ba phần bằng nhau, lấy một phần, được bốn.' },
      { key: 'nhan', name: '1/2 × 1/2', emoji: '¼', say: 'Nửa của nửa cái bánh là một phần tư. Một phần hai nhân một phần hai bằng một phần tư: tử nhân tử, mẫu nhân mẫu.' },
      { key: 'chia', name: '2 : 1/4', emoji: '8', say: 'Hai cái bánh, mỗi miếng một phần tư, được tám miếng. Chia cho một phần tư là nhân với bốn.' },
    ],
    'Em giỏi lắm! Nhân phân số là lấy "một phần của một phần".',
    { big: false },
  ),
  essence: { bigIdea: 'Nhân phân số = lấy một phần của một phần.', points: ['Tìm a/b của n: n : b × a.', 'a/b × c/d = (a × c)/(b × d).', 'Chia cho c/d là nhân với d/c.'] },
  practice: fracMulGen,
  teachBack: tb('Vì sao 2 : 1/4 = 8, lớn hơn 2?', ['🐬 Cá heo', 'Vì hỏi 2 cái bánh có bao nhiêu miếng 1/4: mỗi cái có 4 miếng, nên 2 cái có 8 miếng.', 'Hiểu thật sâu!'], [['🐻 Gấu', 'Phép chia luôn làm số nhỏ đi nên sai.', 'Chia cho số bé hơn 1 thì kết quả lớn hơn.'], ['🐸 Ếch', 'Vì 2 × 1/4 = 8.', '2 × 1/4 = 1/2. Chia mới bằng 8.']]),
  remember: ['a/b của n = n : b × a', 'Tử × tử, mẫu × mẫu', 'Chia = nhân với số đảo ngược'],
  games: ['bongbay', 'latthe'],
  pairs: [['1/3 của 12', '4'], ['1/2 × 1/2', '1/4'], ['2 : 1/4', '8'], ['2/3 × 3/4', '1/2'], ['1/4 của 20', '5']],
})

const ANG: { name: string; deg: number; say: string }[] = [
  { name: 'góc nhọn', deg: 50, say: 'Góc nhọn bé hơn góc vuông, như mũi kéo khép lại.' },
  { name: 'góc vuông', deg: 90, say: 'Góc vuông như góc quyển sách, bằng chín mươi độ.' },
  { name: 'góc tù', deg: 130, say: 'Góc tù lớn hơn góc vuông nhưng bé hơn góc bẹt.' },
  { name: 'góc bẹt', deg: 180, say: 'Góc bẹt có hai cạnh thẳng hàng, bằng hai góc vuông, một trăm tám mươi độ.' },
]
const AngleSvg = ({ deg }: { deg: number }) => {
  const r = (deg * Math.PI) / 180
  return (
    <svg viewBox="-70 -70 140 80" width="160" className="angle-svg">
      <line x1="0" y1="0" x2="60" y2="0" />
      <line x1="0" y1="0" x2={60 * Math.cos(r)} y2={-60 * Math.sin(r)} />
      <path d={`M 18 0 A 18 18 0 0 0 ${18 * Math.cos(r)} ${-18 * Math.sin(r)}`} className="arc" />
    </svg>
  )
}
const t4Goc = defineLesson({
  ...L4,
  id: 't4-goc-duong-thang',
  title: 'Góc nhọn, vuông, tù, bẹt; đường thẳng song song, vuông góc',
  emoji: '📐',
  essenceLine: 'So mọi góc với góc vuông: bé hơn là nhọn, lớn hơn là tù, hai cạnh thẳng hàng là bẹt.',
  standards: [g('Toán 4 · Góc nhọn, góc tù, góc bẹt; hai đường thẳng vuông góc, song song'), cc('4.G.A.1'), cc('4.MD.C.5')],
  prereqs: ['t3-goc-tron'],
  hook: 'Mở quyển sách từ từ: góc giữa hai trang lúc đầu nhọn, rồi vuông, rồi tù, rồi phẳng. Đó là 4 loại góc!',
  hookVisual: '📖📐',
  explore: cardsExplore('Em chạm vào từng góc nhé!', ANG.map((a) => ({ key: a.name, name: a.name, emoji: `${a.deg}°`, say: a.say })), 'Em giỏi lắm! Luôn so sánh với góc vuông nhé.', { big: false }),
  essence: { bigIdea: 'Góc vuông là chuẩn để so sánh.', points: ['Nhọn < vuông (90°) < tù < bẹt (180°).', 'Hai đường thẳng vuông góc tạo 4 góc vuông.', 'Hai đường thẳng song song không bao giờ cắt nhau.'] },
  practice: (level, rng) => {
    if (level <= 2) {
      const a = pick(rng, ANG)
      return {
        level,
        prompt: 'Đây là góc gì?',
        visual: <AngleSvg deg={a.deg + (a.deg === 90 || a.deg === 180 ? 0 : int(rng, -15, 15))} />,
        choices: shuffle(rng, ANG).map((x) => ({ label: x.name, correct: x.name === a.name, why: x.name === a.name ? undefined : 'So với góc vuông: bé hơn là nhọn, lớn hơn là tù.', misconception: x.name === a.name ? undefined : 'ng:Nhầm loại góc khi so với góc vuông' })),
        explain: `Đây là ${a.name}. ${a.say}`,
      }
    }
    return bank([
      { lv: 3, q: 'Hai đường ray tàu hỏa là hai đường thẳng thế nào?', a: 'song song', wrong: [['vuông góc', 'Vuông góc thì phải cắt nhau thành góc vuông.'], ['cắt nhau', 'Đường ray không bao giờ gặp nhau.']], ex: 'Đường ray song song, không bao giờ cắt nhau.' },
      { lv: 3, q: 'Hình chữ nhật có mấy cặp cạnh song song?', a: '2 cặp', wrong: [['1 cặp', 'Cả hai cặp cạnh đối diện đều song song.'], ['4 cặp', 'Chỉ có 4 cạnh, tạo 2 cặp đối diện.']], ex: 'Hai cặp cạnh đối diện song song.' },
      { lv: 3, q: 'Góc bẹt bằng mấy góc vuông?', a: '2', wrong: [['1', 'Một góc vuông chỉ bằng nửa góc bẹt.'], ['4', '4 góc vuông là một vòng tròn.']], ex: 'Góc bẹt = 2 góc vuông = 180°.' },
    ])(level, rng)
  },
  teachBack: tb('Làm sao biết một góc là nhọn hay tù?', ['🦊 Cáo', 'Đặt ê-ke so với góc vuông: nhỏ hơn góc vuông là nhọn, lớn hơn là tù.', 'Chính xác!'], [['🐻 Gấu', 'Góc nào cạnh dài là góc tù.', 'Độ dài cạnh không quyết định độ lớn góc.'], ['🐸 Ếch', 'Nhìn màu sắc.', 'Phải so với góc vuông.']]),
  remember: ['Nhọn < 90° < tù < 180° bẹt', 'Vuông góc: 4 góc vuông', 'Song song: không cắt nhau'],
  games: ['bongbay'],
})

const t4HinhBinhHanh = defineLesson({
  ...L4,
  id: 't4-hinh-binh-hanh',
  title: 'Hình bình hành, hình thoi',
  emoji: '▱',
  essenceLine: 'Hình bình hành có hai cặp cạnh đối song song và bằng nhau; hình thoi thêm bốn cạnh bằng nhau.',
  standards: [g('Toán 4 · Hình bình hành, hình thoi')],
  prereqs: ['t4-goc-duong-thang'],
  hook: 'Đẩy nghiêng một hình chữ nhật làm bằng que tính, nó biến thành hình gì nhỉ?',
  hookVisual: '▭➡️▱',
  explore: cardsExplore(
    'Em chạm vào từng hình nhé!',
    [
      { key: 'bh', name: 'hình bình hành', emoji: '▱', say: 'Hình bình hành: hai cặp cạnh đối diện song song và bằng nhau.' },
      { key: 'thoi', name: 'hình thoi', emoji: '◇', say: 'Hình thoi: là hình bình hành có bốn cạnh bằng nhau.' },
      { key: 'cn', name: 'hình chữ nhật', emoji: '▭', say: 'Hình chữ nhật cũng là hình bình hành, thêm bốn góc vuông.' },
      { key: 'vuong', name: 'hình vuông', emoji: '◻️', say: 'Hình vuông vừa là hình chữ nhật, vừa là hình thoi!' },
    ],
    'Em giỏi lắm! Các hình là "họ hàng" của nhau.',
    { big: false },
  ),
  essence: { bigIdea: 'Hình bình hành là "họ" lớn; chữ nhật, thoi, vuông là trường hợp đặc biệt.', points: ['Bình hành: 2 cặp cạnh đối song song, bằng nhau.', 'Thoi: bình hành có 4 cạnh bằng nhau.', 'Vuông: vừa là chữ nhật, vừa là thoi.'] },
  practice: bank([
    { lv: 1, q: 'Hình nào có bốn cạnh bằng nhau nhưng không có góc vuông?', a: 'hình thoi', wrong: [['hình chữ nhật', 'Chữ nhật có 4 góc vuông, cạnh không bằng nhau hết.'], ['hình bình hành thường', 'Bình hành thường có cạnh kề không bằng nhau.']], ex: 'Hình thoi có 4 cạnh bằng nhau.' },
    { lv: 1, q: 'Hình bình hành có mấy cặp cạnh song song?', a: '2', wrong: [['1', 'Cả hai cặp cạnh đối đều song song.'], ['4', 'Có 4 cạnh tạo 2 cặp.']], ex: '2 cặp cạnh đối song song.' },
    { lv: 2, q: 'Hình vuông có phải là hình thoi không?', a: 'có', wrong: [['không', 'Hình vuông có 4 cạnh bằng nhau nên cũng là hình thoi.']], ex: 'Hình vuông là hình thoi đặc biệt có 4 góc vuông.' },
    { lv: 2, q: 'Hình chữ nhật có phải là hình bình hành không?', a: 'có', wrong: [['không', 'Chữ nhật có 2 cặp cạnh đối song song, bằng nhau.']], ex: 'Chữ nhật là hình bình hành có góc vuông.' },
    { lv: 3, q: 'Hình thoi có chu vi 20 cm. Mỗi cạnh dài bao nhiêu?', a: '5 cm', wrong: [['10 cm', 'Hình thoi có 4 cạnh bằng nhau: 20 : 4.'], ['20 cm', 'Đó là chu vi.']], ex: '20 : 4 = 5 cm.' },
  ]),
  teachBack: tb('Vì sao hình vuông vừa là hình chữ nhật vừa là hình thoi?', ['🦉 Cú', 'Vì nó có 4 góc vuông như hình chữ nhật và 4 cạnh bằng nhau như hình thoi.', 'Chuẩn!'], [['🐻 Gấu', 'Vì nó nhỏ hơn.', 'Kích thước không liên quan.'], ['🐸 Ếch', 'Không thể vừa là cả hai.', 'Một hình có thể thỏa mãn nhiều định nghĩa.']]),
  remember: ['Bình hành: 2 cặp cạnh song song', 'Thoi: 4 cạnh bằng nhau', 'Vuông = chữ nhật + thoi'],
  games: ['bongbay'],
})

// ───────────────────────── LỚP 5 ─────────────────────────

const decGen: Gen = (level, rng) => {
  if (level === 1) {
    const n = int(rng, 1, 99)
    const v = n / 100
    return {
      level,
      prompt: `${n}/100 viết dưới dạng số thập phân là?`,
      choices: choicesFrom(rng, d2(v), [
        { value: vn(n / 10, 1), misconception: 'ng:Đặt sai vị trí dấu phẩy', why: 'Phần trăm: hai chữ số sau dấu phẩy.' },
        { value: String(n), misconception: 'ng:Quên chia cho mẫu số 100', why: `${n}/100 là ${n} phần trăm, bé hơn 1 — phải chia cho 100.` },
        { value: d2(v * 10), misconception: 'ng:Đặt sai vị trí dấu phẩy', why: 'Đếm lại: mẫu 100 có hai chữ số 0.' },
      ].filter((w) => w.value !== d2(v))),
      explain: `${n}/100 = ${d2(v)} (hai chữ số sau dấu phẩy vì mẫu là 100).`,
    }
  }
  if (level === 2) {
    const a = int(rng, 1, 9) + int(rng, 1, 9) / 10
    const b = int(rng, 1, 9) / 10 + int(rng, 1, 9) / 100
    return {
      level,
      prompt: `Số nào lớn hơn: ${vn(a, 1)} hay ${vn(b, 2)}?`,
      choices: shuffle(rng, [
        { label: vn(a, 1), correct: a > b, why: a > b ? undefined : 'So phần nguyên trước.', misconception: a > b ? undefined : 'ng:So sánh số thập phân theo số chữ số' },
        { label: vn(b, 2), correct: b > a, why: b > a ? undefined : `Nhiều chữ số hơn không có nghĩa là lớn hơn! So phần nguyên trước: ${Math.floor(a)} > ${Math.floor(b)}.`, misconception: b > a ? undefined : 'ng:So sánh số thập phân theo số chữ số' },
      ]),
      explain: `So phần nguyên trước, rồi đến hàng phần mười, phần trăm. ${vn(Math.max(a, b), 2)} lớn hơn.`,
    }
  }
  const x = int(rng, 10, 99) / 10
  const y = int(rng, 10, 99) / 10
  const op = pick(rng, ['+', '-', '×'] as const)
  const [p, q] = op === '-' && y > x ? [y, x] : [x, y]
  const r = op === '+' ? p + q : op === '-' ? p - q : p * q
  return {
    level,
    prompt: `${vn(p, 1)} ${op === '-' ? '−' : op} ${vn(q, 1)} = ?`,
    choices: choicesFrom(rng, d2(r), [
      op === '×'
        ? { value: d2(r * 10), misconception: 'ng:Đặt sai dấu phẩy khi nhân số thập phân', why: 'Nhân như số tự nhiên, rồi đếm tổng số chữ số phần thập phân của hai thừa số (1 + 1 = 2) để đặt dấu phẩy.' }
        : { value: d2(op === '+' ? p + q + 1 : p - q - 1), misconception: 'quen-nho', why: 'Đặt dấu phẩy thẳng hàng rồi cộng/trừ như số tự nhiên, nhớ "nhớ".' },
      { value: d2(r / 10), misconception: 'ng:Đặt sai dấu phẩy', why: 'Đếm lại số chữ số sau dấu phẩy.' },
    ].filter((w) => w.value !== d2(r))),
    explain: op === '×' ? `${vn(p, 1)} × ${vn(q, 1)}: nhân ${p * 10} × ${q * 10} = ${Math.round(p * q * 100)}, hai chữ số thập phân → ${d2(r)}.` : `Đặt dấu phẩy thẳng hàng: ${vn(p, 1)} ${op === '+' ? '+' : '−'} ${vn(q, 1)} = ${d2(r)}.`,
  }
}
const t5ThapPhan = defineLesson({
  ...L5,
  id: 't5-so-thap-phan',
  title: 'Số thập phân',
  emoji: '🔢',
  essenceLine: 'Số thập phân là phân số có mẫu 10, 100, 1000… viết theo hàng; so sánh từ phần nguyên.',
  standards: [g('Toán 5 · Số thập phân; so sánh số thập phân'), cc('4.NF.C.6'), cc('5.NBT.A.3')],
  prereqs: ['t4-phan-so-cong-tru'],
  hook: '0,5 và 0,45: số nào lớn hơn? Nhiều bạn chọn 0,45 vì "45 lớn hơn 5". Có đúng không?',
  hookVisual: '0,5 ❓ 0,45',
  explore: hundredGridExplore('Em kéo thanh trượt để tô các ô trong bảng 100 ô nhé!', 'decimal'),
  essence: { bigIdea: '0,37 = 37/100: 3 phần mười và 7 phần trăm.', points: ['Hàng phần mười: một cột; phần trăm: một ô.', '0,5 = 0,50 > 0,45 — so từng hàng từ trái.', 'Viết thêm số 0 ở cuối phần thập phân không đổi giá trị.'] },
  practice: decGen,
  teachBack: tb('Vì sao 0,5 lớn hơn 0,45?', ['🐬 Cá heo', 'Vì 0,5 = 0,50 = 50 ô trong bảng 100 ô, còn 0,45 chỉ có 45 ô.', 'Rất hay!'], [['🐻 Gấu', 'Vì số 5 lớn hơn số 4.', 'Lý do đúng nhưng nên giải thích bằng hàng phần mười.'], ['🐸 Ếch', '0,45 lớn hơn vì có nhiều chữ số hơn.', 'Nhiều chữ số không có nghĩa là lớn hơn.']]),
  remember: ['0,37 = 37/100', 'So phần nguyên rồi từng hàng', 'Thêm 0 ở cuối không đổi giá trị'],
  games: ['bongbay', 'latthe'],
  pairs: [['0,5', '1/2'], ['0,25', '1/4'], ['0,1', '1/10'], ['0,75', '3/4'], ['0,2', '1/5']],
})

const percGen: Gen = (level, rng) => {
  const p = pick(rng, [10, 20, 25, 50, 75])
  const n = pick(rng, [20, 40, 60, 80, 100, 200, 400])
  if (level === 1)
    return {
      level,
      prompt: `${p}% viết dưới dạng phân số là?`,
      choices: choicesFrom(rng, frac(p, 100), [
        { value: `${p}/10`, misconception: 'ng:Hiểu phần trăm là phần mười', why: 'Phần trăm nghĩa là trên 100.' },
        { value: `1/${p}`, misconception: 'ng:Đảo phần trăm thành mẫu số', why: `${p}% = ${p}/100.` },
      ].filter((w) => w.value !== frac(p, 100))),
      explain: `${p}% = ${p}/100 = ${frac(p, 100)}.`,
    }
  if (level === 2)
    return {
      level,
      prompt: `${p}% của ${n} là bao nhiêu?`,
      choices: choicesFrom(rng, (n * p) / 100, [
        { value: n + p, misconception: 'ng:Cộng phần trăm vào số', why: `${p}% của ${n} = ${n} × ${p} : 100.` },
        { value: (n * p) / 10, misconception: 'ng:Chia cho 10 thay vì 100', why: 'Phần trăm là chia cho 100.' },
      ], { fill: near((n * p) / 100, 1) }),
      explain: `${p}% của ${n} = ${n} × ${p} : 100 = ${(n * p) / 100}.`,
    }
  const total = pick(rng, [20, 25, 40, 50])
  const k = int(rng, 1, total - 1)
  const pct = (k / total) * 100
  return {
    level,
    prompt: `Lớp có ${total} bạn, ${k} bạn đạt điểm giỏi. Số bạn giỏi chiếm bao nhiêu phần trăm?`,
    choices: choicesFrom(rng, `${vn(pct, 1)}%`, [
      { value: `${k}%`, misconception: 'ng:Lấy số lượng làm phần trăm', why: `Phải tính tỉ số: ${k} : ${total} × 100.` },
      { value: `${vn((total / k) * 100, 1)}%`, misconception: 'ng:Chia ngược tỉ số phần trăm', why: 'Lấy phần chia cho toàn bộ, không phải ngược lại.' },
    ].filter((w) => w.value !== `${vn(pct, 1)}%`)),
    explain: `${k} : ${total} = ${vn(k / total, 3)} = ${vn(pct, 1)}%.`,
  }
}
const t5PhanTram = defineLesson({
  ...L5,
  id: 't5-phan-tram',
  title: 'Tỉ số phần trăm',
  emoji: '💯',
  essenceLine: 'Phần trăm nghĩa là "trên một trăm": 25% là 25 phần trong 100 phần bằng nhau.',
  standards: [g('Toán 5 · Tỉ số phần trăm'), cc('6.RP.A.3c')],
  prereqs: ['t5-so-thap-phan'],
  hook: 'Cửa hàng giảm giá 50%. Áo giá 200 000 đồng còn bao nhiêu? Phần trăm có ở khắp nơi!',
  hookVisual: '🏷️%',
  explore: hundredGridExplore('Em kéo thanh trượt và xem số ô tô màu bằng bao nhiêu phần trăm nhé!', 'percent'),
  essence: { bigIdea: 'Phần trăm = số phần trên 100.', points: ['25% = 25/100 = 1/4.', 'Tìm p% của n: n × p : 100.', 'Tỉ số phần trăm của a và b: a : b × 100.'] },
  practice: percGen,
  teachBack: tb('Giảm giá 50% nghĩa là gì?', ['🦉 Cú', 'Giá giảm đi một nửa, vì 50% = 50/100 = 1/2.', 'Chính xác!'], [['🐻 Gấu', 'Giảm 50 đồng.', '50% không phải 50 đồng — phụ thuộc giá gốc.'], ['🐸 Ếch', 'Còn 50 đồng.', 'Phần trăm luôn so với giá gốc.']]),
  remember: ['% = trên 100', 'p% của n = n × p : 100', '50% = một nửa'],
  games: ['bongbay', 'latthe'],
  pairs: [['50%', '1/2'], ['25%', '1/4'], ['10%', '1/10'], ['75%', '3/4'], ['20%', '1/5']],
})

const areaGen: Gen = (level, rng) => {
  const a = int(rng, 4, 20)
  const h = int(rng, 2, 12)
  if (level === 1 || (level === 2 && rng() < 0.5))
    return {
      level,
      prompt: `Hình tam giác có đáy ${a} cm, chiều cao ${h} cm. Diện tích là bao nhiêu?`,
      choices: choicesFrom(rng, `${vn((a * h) / 2, 1)} cm²`, [
        { value: `${a * h} cm²`, misconception: 'ng:Quên chia đôi khi tính diện tích tam giác', why: 'Tam giác là một nửa hình chữ nhật có cùng đáy và chiều cao, nên phải chia 2.' },
        { value: `${a + h} cm²`, misconception: 'ng:Cộng đáy và chiều cao', why: 'Diện tích là nhân, không cộng.' },
      ]),
      explain: `S = đáy × chiều cao : 2 = ${a} × ${h} : 2 = ${vn((a * h) / 2, 1)} cm².`,
    }
  const b = int(rng, 2, a - 1)
  return {
    level,
    prompt: `Hình thang có hai đáy ${a} cm và ${b} cm, chiều cao ${h} cm. Diện tích là bao nhiêu?`,
    choices: choicesFrom(rng, `${vn(((a + b) * h) / 2, 1)} cm²`, [
      { value: `${(a + b) * h} cm²`, misconception: 'ng:Quên chia đôi khi tính diện tích hình thang', why: 'Ghép hai hình thang thành hình bình hành, nên diện tích một hình thang phải chia 2.' },
      { value: `${a * b * h} cm²`, misconception: 'ng:Nhân cả hai đáy', why: 'Lấy TỔNG hai đáy nhân chiều cao rồi chia 2.' },
    ]),
    explain: `S = (đáy lớn + đáy bé) × chiều cao : 2 = (${a} + ${b}) × ${h} : 2 = ${vn(((a + b) * h) / 2, 1)} cm².`,
  }
}
const t5DienTich = defineLesson({
  ...L5,
  id: 't5-dien-tich',
  title: 'Diện tích hình tam giác, hình thang',
  emoji: '🔺',
  essenceLine: 'Tam giác là nửa hình chữ nhật; hình thang ghép đôi thành hình bình hành — vì thế đều "chia 2".',
  standards: [g('Toán 5 · Diện tích hình tam giác, hình thang'), cc('6.G.A.1')],
  prereqs: ['t3-chu-vi-dien-tich', 't4-hinh-binh-hanh'],
  hook: 'Vì sao công thức diện tích tam giác lại có "chia 2"? Cắt ghép một chút là thấy ngay!',
  hookVisual: '✂️🔺',
  explore: cardsExplore(
    'Em chạm vào từng thẻ để xem cô cắt ghép nhé!',
    [
      { key: 'tg', name: 'tam giác', emoji: '◺', say: 'Cắt hình chữ nhật theo đường chéo, được hai tam giác bằng nhau. Mỗi tam giác bằng một nửa: đáy nhân chiều cao chia hai.' },
      { key: 'ht', name: 'hình thang', emoji: '⏢', say: 'Ghép hai hình thang giống nhau, lật ngược một cái, được hình bình hành có đáy bằng tổng hai đáy. Chia đôi ra là một hình thang.' },
    ],
    'Em giỏi lắm! "Chia 2" là vì mình chỉ lấy một nửa.',
    { big: false },
  ),
  essence: { bigIdea: 'Công thức đến từ cắt – ghép hình.', points: ['Tam giác: S = a × h : 2.', 'Hình thang: S = (a + b) × h : 2.', 'Chiều cao luôn vuông góc với đáy.'] },
  practice: areaGen,
  teachBack: tb('Vì sao diện tích tam giác phải chia 2?', ['🐬 Cá heo', 'Vì hai tam giác bằng nhau ghép lại thành hình chữ nhật (hay bình hành) có cùng đáy, cùng chiều cao.', 'Hiểu từ gốc!'], [['🐻 Gấu', 'Vì tam giác có 3 cạnh.', 'Không liên quan số cạnh.'], ['🐸 Ếch', 'Để kết quả nhỏ hơn.', 'Có lý do hình học rõ ràng.']]),
  remember: ['Tam giác: a × h : 2', 'Thang: (a + b) × h : 2', 'h vuông góc đáy'],
  games: ['bongbay'],
})

const circleGen: Gen = (level, rng) => {
  const r = int(rng, 1, 10)
  const C = 2 * r * 3.14
  const S = r * r * 3.14
  if (level <= 2)
    return {
      level,
      prompt: `Hình tròn bán kính ${r} cm. Chu vi là bao nhiêu? (π ≈ 3,14)`,
      choices: choicesFrom(rng, `${d2(C)} cm`, [
        { value: `${d2(r * 3.14)} cm`, misconception: 'ng:Dùng bán kính thay cho đường kính khi tính chu vi', why: 'Chu vi = đường kính × 3,14 = r × 2 × 3,14.' },
        { value: `${d2(S)} cm`, misconception: 'ng:Nhầm chu vi với diện tích hình tròn', why: 'Đó là diện tích (r × r × 3,14).' },
      ].filter((w) => w.value !== `${d2(C)} cm`)),
      explain: `C = r × 2 × 3,14 = ${r} × 2 × 3,14 = ${d2(C)} cm.`,
    }
  return {
    level,
    prompt: `Hình tròn bán kính ${r} cm. Diện tích là bao nhiêu? (π ≈ 3,14)`,
    choices: choicesFrom(rng, `${d2(S)} cm²`, [
      { value: `${d2(r * 2 * 3.14)} cm²`, misconception: 'ng:Nhầm diện tích với chu vi hình tròn', why: 'Đó là chu vi. Diện tích = r × r × 3,14.' },
      { value: `${d2(r * 2 * r * 2 * 3.14)} cm²`, misconception: 'ng:Dùng đường kính thay bán kính khi tính diện tích', why: 'Dùng bán kính: r × r × 3,14.' },
    ].filter((w) => w.value !== `${d2(S)} cm²`)),
    explain: `S = r × r × 3,14 = ${r} × ${r} × 3,14 = ${d2(S)} cm².`,
  }
}
const t5HinhTron = defineLesson({
  ...L5,
  id: 't5-hinh-tron',
  title: 'Chu vi và diện tích hình tròn',
  emoji: '⭕',
  essenceLine: 'Chu vi luôn gấp khoảng 3,14 lần đường kính (số π) với mọi hình tròn.',
  standards: [g('Toán 5 · Chu vi, diện tích hình tròn'), cc('7.G.B.4')],
  prereqs: ['t3-goc-tron', 't5-so-thap-phan'],
  hook: 'Lấy sợi dây quấn quanh cái cốc rồi so với đường kính: luôn dài hơn khoảng 3 lần! Cốc to hay nhỏ cũng thế. Thật kỳ lạ!',
  hookVisual: '🥤🧵',
  explore: cardsExplore(
    'Em chạm vào từng thẻ nhé!',
    [
      { key: 'pi', name: 'số pi', emoji: 'π ≈ 3,14', say: 'Với mọi hình tròn, chu vi chia đường kính luôn được khoảng ba phẩy mười bốn. Số đó gọi là pi.' },
      { key: 'cv', name: 'chu vi', emoji: 'C = d × 3,14', say: 'Chu vi bằng đường kính nhân ba phẩy mười bốn.' },
      { key: 'dt', name: 'diện tích', emoji: 'S = r × r × 3,14', say: 'Diện tích bằng bán kính nhân bán kính nhân ba phẩy mười bốn.' },
    ],
    'Em giỏi lắm! Số pi xuất hiện ở mọi hình tròn.',
    { big: false },
  ),
  essence: { bigIdea: 'π ≈ 3,14 là tỉ số chu vi : đường kính của MỌI hình tròn.', points: ['C = d × 3,14 = r × 2 × 3,14.', 'S = r × r × 3,14.', 'Chu vi đo bằng cm, diện tích bằng cm².'] },
  practice: circleGen,
  teachBack: tb('Số 3,14 trong công thức hình tròn ở đâu ra?', ['🦉 Cú', 'Đo bất kỳ hình tròn nào, chu vi chia đường kính đều được khoảng 3,14 — đó là số π.', 'Tuyệt vời!'], [['🐻 Gấu', 'Do người ta tự chọn.', 'Không phải tự chọn — đo được trong tự nhiên.'], ['🐸 Ếch', 'Là bán kính nhân 3.', 'π là tỉ số cố định.']]),
  remember: ['π ≈ 3,14', 'C = d × 3,14', 'S = r × r × 3,14'],
  games: ['bongbay'],
})

const volGen: Gen = (level, rng) => {
  const a = int(rng, 2, 9)
  const b = int(rng, 2, 9)
  const c = int(rng, 2, 9)
  if (level === 1)
    return {
      level,
      prompt: `Hình lập phương cạnh ${a} cm. Thể tích là bao nhiêu?`,
      choices: choicesFrom(rng, `${a * a * a} cm³`, [
        { value: `${a * a} cm³`, misconception: 'ng:Tính diện tích một mặt thay vì thể tích', why: 'Đó là diện tích một mặt. Thể tích = cạnh × cạnh × cạnh.' },
        { value: `${a * 3} cm³`, misconception: 'ng:Nhân cạnh với 3 thay vì lập phương', why: 'Nhân cạnh với chính nó ba lần, không phải nhân với 3.' },
      ].filter((w) => w.value !== `${a * a * a} cm³`)),
      explain: `V = ${a} × ${a} × ${a} = ${a * a * a} cm³.`,
    }
  return {
    level,
    prompt: `Bể nước hình hộp chữ nhật dài ${a} dm, rộng ${b} dm, cao ${c} dm. Bể chứa được bao nhiêu lít nước? (1 dm³ = 1 lít)`,
    choices: choicesFrom(rng, `${a * b * c} lít`, [
      { value: `${(a + b) * 2 * c} lít`, misconception: 'ng:Nhầm thể tích với diện tích xung quanh', why: 'Đó là diện tích xung quanh. Thể tích = dài × rộng × cao.' },
      { value: `${a * b} lít`, misconception: 'ng:Quên nhân chiều cao', why: 'Phải nhân thêm chiều cao: bao nhiêu lớp hình lập phương.' },
    ].filter((w) => w.value !== `${a * b * c} lít`)),
    explain: `V = ${a} × ${b} × ${c} = ${a * b * c} dm³ = ${a * b * c} lít.`,
  }
}
const t5TheTich = defineLesson({
  ...L5,
  id: 't5-the-tich',
  title: 'Thể tích hình hộp chữ nhật, hình lập phương',
  emoji: '🧊',
  essenceLine: 'Thể tích là số hình lập phương đơn vị xếp đầy: một lớp có dài × rộng khối, có "cao" lớp.',
  standards: [g('Toán 5 · Thể tích; xăng-ti-mét khối, đề-xi-mét khối'), cc('5.MD.C.5')],
  prereqs: ['t3-chu-vi-dien-tich'],
  hook: 'Một hộp quà xếp được bao nhiêu viên đường hình lập phương? Đếm từng viên thì lâu lắm…',
  hookVisual: '🎁🧊',
  explore: cardsExplore(
    'Em chạm vào từng thẻ nhé!',
    [
      { key: 'lop', name: 'một lớp', emoji: '🟦🟦🟦', say: 'Một lớp đáy có dài nhân rộng hình lập phương.' },
      { key: 'chong', name: 'xếp chồng', emoji: '🧊🧊🧊', say: 'Xếp chồng bao nhiêu lớp thì nhân với chiều cao bấy nhiêu.' },
      { key: 'lit', name: '1 dm³ = 1 lít', emoji: '🥛', say: 'Một đề-xi-mét khối đúng bằng một lít nước.' },
    ],
    'Em giỏi lắm! Thể tích bằng dài nhân rộng nhân cao.',
    { big: false },
  ),
  essence: { bigIdea: 'V = số khối một lớp × số lớp.', points: ['Hộp chữ nhật: V = dài × rộng × cao.', 'Lập phương: V = cạnh × cạnh × cạnh.', '1 dm³ = 1 lít; 1 cm³ = 1 ml.'] },
  practice: volGen,
  teachBack: tb('Vì sao thể tích bằng dài × rộng × cao?', ['🐼 Gấu trúc', 'Vì mỗi lớp đáy có dài × rộng khối lập phương, và có "cao" lớp xếp chồng lên.', 'Rất đúng!'], [['🐻 Gấu', 'Vì cộng 3 cạnh lại.', 'Cộng chỉ cho tổng độ dài.'], ['🐸 Ếch', 'Vì là công thức.', 'Công thức có lý do: đếm khối theo lớp.']]),
  remember: ['V = d × r × c', 'Lập phương: a × a × a', '1 dm³ = 1 lít'],
  games: ['bongbay'],
})

const speedGen: Gen = (level, rng) => {
  const v = pick(rng, [5, 10, 12, 15, 30, 40, 45, 50, 60])
  const t = int(rng, 2, 5)
  const s = v * t
  const ask = level === 1 ? 's' : pick(rng, ['v', 't'] as const)
  if (ask === 's')
    return {
      level,
      prompt: `Ô tô đi với vận tốc ${v} km/giờ trong ${t} giờ. Quãng đường đi được là bao nhiêu?`,
      choices: choicesFrom(rng, `${s} km`, [{ value: `${v + t} km`, misconception: 'ng:Cộng vận tốc với thời gian', why: 'Quãng đường = vận tốc × thời gian.' }, { value: `${v} km`, misconception: 'ng:Chỉ tính quãng đường một giờ', why: `${v} km chỉ là quãng đường trong 1 giờ.` }]),
      explain: `s = v × t = ${v} × ${t} = ${s} km.`,
    }
  if (ask === 'v')
    return {
      level,
      prompt: `Một người đi ${s} km hết ${t} giờ. Vận tốc là bao nhiêu?`,
      choices: choicesFrom(rng, `${v} km/giờ`, [{ value: `${s * t} km/giờ`, misconception: 'ng:Nhân thay vì chia khi tìm vận tốc', why: 'Vận tốc = quãng đường : thời gian.' }, { value: `${s - t} km/giờ`, misconception: 'ng:Trừ thay vì chia', why: 'Vận tốc là quãng đường đi được trong MỖI giờ: chia đều.' }]),
      explain: `v = s : t = ${s} : ${t} = ${v} km/giờ.`,
    }
  return {
    level,
    prompt: `Đi ${s} km với vận tốc ${v} km/giờ thì hết bao lâu?`,
    choices: choicesFrom(rng, `${t} giờ`, [{ value: `${s * v} giờ`, misconception: 'ng:Nhân thay vì chia khi tìm thời gian', why: 'Thời gian = quãng đường : vận tốc.' }, { value: `${v} giờ`, misconception: 'ng:Nhầm vận tốc với thời gian', why: 'Đó là vận tốc.' }]),
    explain: `t = s : v = ${s} : ${v} = ${t} giờ.`,
  }
}
const t5VanToc = defineLesson({
  ...L5,
  id: 't5-van-toc',
  title: 'Vận tốc, quãng đường, thời gian',
  emoji: '🚗',
  essenceLine: 'Vận tốc là quãng đường đi được trong một đơn vị thời gian: s = v × t.',
  standards: [g('Toán 5 · Vận tốc, quãng đường, thời gian'), cc('6.RP.A.3b')],
  prereqs: ['t4-nhan-chia-lon'],
  hook: 'Xe máy đi 40 km mỗi giờ. Đi 3 giờ thì được bao xa? Còn đi 100 km thì mất bao lâu?',
  hookVisual: '🏍️💨',
  explore: speedExplore('Em đổi vận tốc, thời gian rồi cho xe chạy nhé!'),
  essence: { bigIdea: 'Vận tốc = quãng đường trong mỗi giờ.', points: ['s = v × t', 'v = s : t', 't = s : v'], analogy: 'Như mỗi giờ bỏ vào túi v ki-lô-mét: t giờ có v × t ki-lô-mét.' },
  practice: speedGen,
  teachBack: tb('Vì sao muốn tìm thời gian lại lấy quãng đường chia vận tốc?', ['🦉 Cú', 'Vì mỗi giờ đi được v km, nên cần xem quãng đường có bao nhiêu lần v km.', 'Hiểu bản chất!'], [['🐻 Gấu', 'Vì nhân sẽ ra số quá lớn.', 'Không phải lý do.'], ['🐸 Ếch', 'Vì lấy vận tốc chia quãng đường.', 'Ngược rồi: s : v.']]),
  remember: ['s = v × t', 'v = s : t', 't = s : v'],
  games: ['bongbay', 'latthe'],
  pairs: [['40 km/giờ × 3 giờ', '120 km'], ['100 km : 50 km/giờ', '2 giờ'], ['90 km : 3 giờ', '30 km/giờ'], ['60 × 2', '120 km']],
})

const t5Tinh = defineLesson({
  ...L5,
  id: 't5-tinh-thap-phan',
  title: 'Cộng, trừ, nhân số thập phân',
  emoji: '🧮',
  essenceLine: 'Cộng trừ: dấu phẩy thẳng hàng; nhân: nhân như số tự nhiên rồi đếm chữ số thập phân.',
  standards: [g('Toán 5 · Các phép tính với số thập phân'), cc('5.NBT.B.7')],
  prereqs: ['t5-so-thap-phan'],
  hook: '1,5 + 2,35 có bằng 2,50 không? Bí quyết nằm ở dấu phẩy!',
  hookVisual: '🔢,',
  explore: columnExplore('Đặt dấu phẩy thẳng hàng rồi tính như số tự nhiên: 1,50 + 2,35 giống 150 + 235.', [{ a: 150, b: 235, op: '+' }]),
  essence: { bigIdea: 'Dấu phẩy thẳng hàng — cùng hàng cộng với nhau.', points: ['1,5 = 1,50: thêm 0 để đủ hàng.', 'Nhân: 1,2 × 0,3 → 12 × 3 = 36 → hai chữ số thập phân → 0,36.', 'Ước lượng để kiểm tra kết quả.'] },
  practice: (level, rng) => decGen(Math.max(3, level) as 3, rng),
  teachBack: tb('Vì sao 1,2 × 0,3 = 0,36 mà không phải 3,6?', ['🐬 Cá heo', 'Vì 1,2 × 0,3 nhỏ hơn 1,2 (nhân với số bé hơn 1), và tổng có 2 chữ số thập phân.', 'Rất chắc chắn!'], [['🐻 Gấu', 'Vì 12 × 3 = 36 rồi đặt phẩy tùy ý.', 'Phải đếm chữ số thập phân.'], ['🐸 Ếch', '3,6 mới đúng.', 'Ước lượng: 1 × 0,3 khoảng 0,3, không thể là 3,6.']]),
  remember: ['Phẩy thẳng hàng', 'Nhân: đếm chữ số thập phân', 'Ước lượng kiểm tra'],
  games: ['bongbay'],
})

const t4BieuDo = defineLesson({
  ...L4,
  id: 't4-bieu-do',
  title: 'Biểu đồ cột và dãy số liệu',
  emoji: '📊',
  essenceLine: 'Biểu đồ biến số liệu thành hình: so sánh bằng mắt, tính bằng số.',
  standards: [g('Toán 4 · Biểu đồ cột; dãy số liệu thống kê'), cc('3.MD.B.3')],
  prereqs: ['t3-thong-ke', 't4-trung-binh-cong'],
  hook: 'Lượng mưa các tháng trong năm thay đổi thế nào? Một biểu đồ nói thay cả trăm con số!',
  hookVisual: '🌧️📊',
  explore: cardsExplore(
    'Em chạm vào từng thẻ nhé!',
    [
      { key: 'truc', name: 'trục số liệu', emoji: '📏', say: 'Trục đứng ghi số liệu, chia đều các mốc.' },
      { key: 'cot', name: 'các cột', emoji: '📊', say: 'Mỗi cột là một đối tượng; cột cao hơn là số lớn hơn.' },
      { key: 'tb', name: 'trung bình', emoji: '➗', say: 'Muốn biết trung bình, cộng các cột rồi chia cho số cột.' },
    ],
    'Em giỏi lắm! Đọc biểu đồ: nhìn để so sánh, tính để chính xác.',
    { big: false },
  ),
  essence: { bigIdea: 'Đọc đúng trục, so sánh cột, tính toán.', points: ['Đọc trục đứng trước khi đọc cột.', 'Cao nhất, thấp nhất, hơn kém, tổng, trung bình.'] },
  practice: mix(tbcGen, (level, rng) => {
    const months = ['T1', 'T2', 'T3', 'T4']
    const data = shuffle(rng, [2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).map((x) => x * 10)
    const i = int(rng, 0, 3)
    return {
      level,
      prompt: `Biểu đồ lượng mưa (mm). Tháng ${months[i].slice(1)} có lượng mưa bao nhiêu?`,
      visual: (
        <div className="mini-bars">
          {data.map((v, k) => (
            <div key={k}>
              <span style={{ height: `${v * 1.2}px` }}>{v}</span>
              <small>{months[k]}</small>
            </div>
          ))}
        </div>
      ),
      choices: choicesFrom(rng, `${data[i]} mm`, data.filter((_, k) => k !== i).map((v) => ({ value: `${v} mm`, misconception: 'ng:Đọc nhầm cột trên biểu đồ', why: 'Tìm đúng cột của tháng rồi đọc số.' }))),
      explain: `Cột ${months[i]} cao ${data[i]} mm.`,
    }
  }),
  teachBack: tb('Vì sao phải đọc trục đứng trước?', ['🦊 Cáo', 'Vì mỗi vạch có thể là 1, 10 hay 100 đơn vị; không đọc trục sẽ hiểu sai cột.', 'Chính xác!'], [['🐻 Gấu', 'Không cần, nhìn cột là đủ.', 'Nhìn cột chỉ biết cao thấp, không biết số.'], ['🐸 Ếch', 'Để biết màu cột.', 'Màu không quan trọng bằng thang số.']]),
  remember: ['Đọc trục trước', 'Cao = lớn', 'Tổng, hơn kém, trung bình'],
  games: ['bongbay'],
})

export const TOAN_45: Defined[] = [t4SoTrieu, t4NhanChiaLon, t4TrungBinh, t4PhanSoCongTru, t4PhanSoNhanChia, t4Goc, t4HinhBinhHanh, t4BieuDo, t5ThapPhan, t5Tinh, t5PhanTram, t5DienTich, t5HinhTron, t5TheTich, t5VanToc]

// Hàm số bậc hai (Toán 10). Bản chất: mọi parabol y = ax² + bx + c là parabol y = ax² được tịnh tiến đến đỉnh.
import { useId, useMemo, useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { int, pick, shuffle, type Rng } from '../core/rng'
import { sfx } from '../core/sound'
import { choicesFrom, vn } from './helpers'

const W = 12 // x ∈ [-6, 6]
const H = 12 // y ∈ [-6, 6]

function Plot({ a, b, c, ghost = false, small = false }: { a: number; b: number; c: number; ghost?: boolean; small?: boolean }) {
  const f = (x: number) => a * x * x + b * x + c
  const uid = useId().replace(/:/g, '')
  const path = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i <= 240; i++) {
      const x = -6 + (i / 240) * W
      const y = f(x)
      if (Math.abs(y) > 40) continue
      pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(3)},${(-y).toFixed(3)}`)
    }
    return pts.join(' ')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c])
  const ghostPath = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i <= 120; i++) {
      const x = -6 + (i / 120) * W
      const y = a * x * x
      if (Math.abs(y) > 40) continue
      pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(3)},${(-y).toFixed(3)}`)
    }
    return pts.join(' ')
  }, [a])
  const h = -b / (2 * a)
  const k = f(h)
  const D = b * b - 4 * a * c
  const roots = D > 1e-9 ? [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)] : Math.abs(D) <= 1e-9 ? [h] : []
  return (
    <svg viewBox={`-6.3 -6.3 ${W + 0.6} ${H + 0.6}`} className={`plot ${small ? 'small' : ''}`} role="img" aria-label="Đồ thị parabol">
      <defs>
        <clipPath id={`clip${uid}`}>
          <rect x={-6} y={-6} width={W} height={H} />
        </clipPath>
      </defs>
      {Array.from({ length: 13 }, (_, i) => i - 6).map((v) => (
        <g key={v}>
          <line x1={v} y1={-6} x2={v} y2={6} className="grid" />
          <line x1={-6} y1={v} x2={6} y2={v} className="grid" />
        </g>
      ))}
      <line x1={-6} y1={0} x2={6} y2={0} className="axis" />
      <line x1={0} y1={-6} x2={0} y2={6} className="axis" />
      <g clipPath={`url(#clip${uid})`}>
        {ghost && <path d={ghostPath} className="ghost-curve" />}
        {ghost && Math.abs(h) < 6 && <line x1={h} y1={-6} x2={h} y2={6} className="sym-axis" />}
        {ghost && (h !== 0 || k !== 0) && <line x1={0} y1={0} x2={h} y2={-k} className="shift-arrow" markerEnd={`url(#arrow${uid})`} />}
        <path d={path} className="curve" />
        {!small && roots.map((r, i) => <circle key={i} cx={r} cy={0} r={0.18} className="root-dot" />)}
        {!small && <circle cx={h} cy={-k} r={0.22} className="vertex-dot" />}
      </g>
      <defs>
        <marker id={`arrow${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" className="arrow-head" />
        </marker>
      </defs>
    </svg>
  )
}

const sgn = (v: number) => (v < 0 ? '−' : '+')
const term = (v: number, s: string, first = false) => {
  if (v === 0) return ''
  const abs = Math.abs(v)
  const coef = abs === 1 && s ? '' : vn(abs)
  return `${first ? (v < 0 ? '−' : '') : ` ${sgn(v)} `}${coef}${s}`
}
export const poly = (a: number, b: number, c: number) => `y = ${term(a, 'x²', true)}${term(b, 'x')}${term(c, '') || (a === 0 && b === 0 ? '0' : '')}`

function QuadraticExplore({ onDiscover, say }: ExploreProps) {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-2)
  const [c, setC] = useState(-3)
  const [moved, setMoved] = useState(new Set<string>())
  const touch = (k: string) => {
    if (!moved.has(k)) setMoved(new Set(moved).add(k))
  }
  const h = -b / (2 * a)
  const D = b * b - 4 * a * c
  const k = -D / (4 * a)
  const nRoots = D > 1e-9 ? 2 : Math.abs(D) <= 1e-9 ? 1 : 0

  return (
    <div className="quad-explore">
      <div className="two-col">
        <div className="panel">
          <Plot a={a} b={b} c={c} ghost />
          <p className="legend">
            <span className="lg curve" /> {poly(a, b, c)} &nbsp; <span className="lg ghost" /> y = {vn(a)}x² &nbsp; <span className="lg arrow" /> phép dời
          </p>
        </div>
        <div className="panel">
          {(
            [
              ['a', a, setA, -3, 3, 0.25],
              ['b', b, setB, -6, 6, 0.5],
              ['c', c, setC, -6, 6, 0.5],
            ] as const
          ).map(([name, val, set, min, max, step]) => (
            <div className="slider-row" key={name}>
              <label htmlFor={`q${name}`}>{name}</label>
              <input
                id={`q${name}`}
                type="range"
                min={min}
                max={max}
                step={step}
                value={val}
                onChange={(e) => {
                  let v = Number(e.target.value)
                  if (name === 'a' && v === 0) v = val > 0 ? -0.25 : 0.25
                  set(v)
                  touch(name)
                  sfx.tap()
                }}
              />
              <b>{vn(val)}</b>
            </div>
          ))}
          <div className="facts">
            <div>
              <span>Hướng bề lõm</span>
              <b>{a > 0 ? '⌣ lên trên (a > 0)' : '⌢ xuống dưới (a < 0)'}</b>
            </div>
            <div>
              <span>Độ "hẹp"</span>
              <b>|a| = {vn(Math.abs(a))} {Math.abs(a) > 1 ? '→ hẹp hơn' : Math.abs(a) < 1 ? '→ rộng hơn' : ''}</b>
            </div>
            <div>
              <span>Đỉnh (−b/2a ; −Δ/4a)</span>
              <b>
                ({vn(h)} ; {vn(k)})
              </b>
            </div>
            <div>
              <span>Dạng đỉnh</span>
              <b>
                y = {vn(a)}(x {sgn(-h)} {vn(Math.abs(h))})² {sgn(k)} {vn(Math.abs(k))}
              </b>
            </div>
            <div>
              <span>Δ = b² − 4ac</span>
              <b>
                {vn(D)} → {nRoots} giao điểm với Ox
              </b>
            </div>
          </div>
          <p className="note">
            Đổi <b>b</b> hay <b>c</b> không làm parabol méo đi — chỉ <b>dời</b> nó. Chỉ có <b>a</b> quyết định hình dạng.
          </p>
        </div>
      </div>
      {moved.size >= 3 ? (
        <div className="row-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              say('Mọi parabol đều là y bằng a x bình phương, dời đỉnh đi nơi khác.')
              onDiscover()
            }}
          >
            Mình thấy bản chất rồi ➜
          </button>
        </div>
      ) : (
        <p className="muted center">Hãy kéo cả ba thanh a, b, c và quan sát đường nét đứt y = ax².</p>
      )}
    </div>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  if (level === 1) {
    // Đặt bẫy: đỉnh nằm dưới trục hoành nhưng bề lõm hướng lên (và ngược lại).
    const up = rng() < 0.5
    const a = up ? pick(rng, [0.5, 1, 2]) : pick(rng, [-0.5, -1, -2])
    const h = int(rng, -3, 3)
    const k = up ? int(rng, -4, -1) : int(rng, 1, 4)
    return {
      level,
      prompt: 'Nhìn đồ thị y = ax² + bx + c. Hệ số a mang dấu gì?',
      visual: <Plot a={a} b={-2 * a * h} c={a * h * h + k} small />,
      choices: shuffle(rng, [
        { label: 'a > 0', correct: up, misconception: up ? undefined : 'dau-a-theo-vi-tri', why: up ? undefined : 'Bề lõm hướng xuống (hình ⌢) thì a < 0, bất kể đỉnh ở đâu.' },
        { label: 'a < 0', correct: !up, misconception: up ? 'dau-a-theo-vi-tri' : undefined, why: up ? 'Đỉnh nằm dưới Ox không có nghĩa a < 0 — hãy nhìn HƯỚNG bề lõm.' : undefined },
        { label: 'Không xác định được', misconception: 'khong-biet-doc-do-thi', why: 'Hướng bề lõm cho biết ngay dấu của a.' },
      ]),
      explain: up ? 'Bề lõm hướng lên (⌣) ⇔ a > 0. Vị trí đỉnh do b, c quyết định.' : 'Bề lõm hướng xuống (⌢) ⇔ a < 0. Vị trí đỉnh do b, c quyết định.',
    }
  }
  if (level === 2) {
    const a = pick(rng, [1, 2, -1, -2, 3])
    const h = int(rng, -4, 4) || 2
    const b = -2 * a * h
    const c = int(rng, -5, 5)
    return {
      level,
      prompt: `Trục đối xứng của parabol ${poly(a, b, c)} là đường thẳng nào?`,
      choices: choicesFrom(
        rng,
        `x = ${h}`,
        [
          { value: `x = ${-h}`, misconception: 'quen-dau-tru', why: `Công thức là x = −b/(2a): −(${b})/(2·${a}) = ${h}. Đừng quên dấu trừ.` },
          { value: `x = ${vn(-b / a)}`, misconception: 'quen-chia-2', why: 'Thiếu số 2 ở mẫu: x = −b/(2a).' },
          { value: `x = ${c}`, misconception: 'nham-c', why: 'c là tung độ giao điểm với Oy, không phải trục đối xứng.' },
        ],
        { format: (v) => String(v) },
      ),
      explain: `x = −b/(2a) = ${-b}/${2 * a} = ${h}. Vì sao? Hai nghiệm (nếu có) đối xứng qua trung điểm của chúng: (x₁ + x₂)/2 = −b/(2a).`,
    }
  }
  if (level === 3) {
    const a = pick(rng, [1, 2, -1, -2])
    const h = int(rng, -3, 3)
    const k = int(rng, -6, 6) || 3
    const b = -2 * a * h
    const c = a * h * h + k
    const minmax = a > 0 ? 'nhỏ nhất' : 'lớn nhất'
    return {
      level,
      prompt: `Hàm số ${poly(a, b, c)} có giá trị ${minmax} bằng bao nhiêu?`,
      choices: choicesFrom(
        rng,
        k,
        [
          { value: c, misconception: 'nham-c', why: `${c} là giá trị tại x = 0, không phải tại đỉnh.` },
          { value: h, misconception: 'nham-hoanh-do', why: `${h} là HOÀNH độ đỉnh (x), còn giá trị ${minmax} là TUNG độ (y).` },
          { value: -k, misconception: 'sai-dau', why: 'Tính lại y tại đỉnh: thay x = −b/(2a) vào hàm số.' },
        ],
        { fill: (i) => k + (i % 2 ? i : -i) },
      ),
      explain: `Đỉnh tại x = −b/(2a) = ${h}, y = ${k}. Vì a ${a > 0 ? '> 0 parabol hướng lên nên đỉnh là điểm thấp nhất' : '< 0 parabol hướng xuống nên đỉnh là điểm cao nhất'}.`,
    }
  }
  const L = pick(rng, [20, 40, 60, 80])
  return {
    level,
    prompt: `Rào một mảnh vườn hình chữ nhật dựa vào bức tường (tường làm một cạnh, không cần rào). Có ${L} m lưới cho 3 cạnh còn lại. Diện tích lớn nhất có thể là bao nhiêu?`,
    visual: <span className="hook-emoji">🧱🌱📏</span>,
    choices: choicesFrom(
      rng,
      (L * L) / 8,
      [
        { value: (L * L) / 16, misconception: 'hinh-vuong-la-max', why: 'Hình vuông chỉ tối ưu khi rào cả 4 cạnh. Ở đây tường đã thay một cạnh.' },
        { value: Math.round((L / 3) ** 2), misconception: 'ba-canh-bang-nhau', why: 'Chia đều 3 cạnh chưa chắc tối ưu — hãy lập hàm S(x) và tìm đỉnh.' },
        { value: (L * L) / 4, misconception: 'sai-dinh', why: 'Kiểm tra lại: S(x) = x(L − 2x), đỉnh tại x = L/4.' },
      ],
      { format: (v) => `${v} m²` },
    ),
    explain: `Gọi x là cạnh vuông góc với tường: S = x(${L} − 2x) = −2x² + ${L}x. Đỉnh: x = ${L}/4 = ${L / 4} → S = ${L / 4}·${L / 2} = ${(L * L) / 8} m².`,
  }
}

export const hamBacHai: Lesson = {
  id: 'ham-bac-hai',
  skillId: 'thpt.ham-bac-hai',
  title: 'Hàm số bậc hai và đồ thị',
  emoji: '📈',
  hook: {
    text: 'Đường bay của quả bóng, vòi phun nước, cáp treo cầu, ăng-ten chảo… đều là parabol. Nhưng có vô số parabol khác nhau — hay thật ra chỉ có MỘT dạng parabol duy nhất?',
    visual: <span className="hook-emoji">⛲🏀📡</span>,
  },
  explore: { intro: 'Kéo a, b, c. Quan sát đường nét đứt y = ax² và mũi tên nối gốc toạ độ tới đỉnh.', Component: QuadraticExplore },
  essence: {
    bigIdea: 'y = ax² + bx + c = a(x − h)² + k: chỉ là parabol y = ax² dời đỉnh từ gốc O đến I(h; k).',
    points: [
      '🔺 a quyết định HÌNH DẠNG: dấu của a → hướng bề lõm; |a| lớn → parabol hẹp.',
      '➡️ b và c chỉ quyết định VỊ TRÍ đỉnh: h = −b/(2a), k = −Δ/(4a).',
      '🪞 Trục đối xứng x = h vì (x − h)² nhận cùng giá trị tại h ± t.',
      '🎯 Δ cho biết đỉnh nằm phía nào của Ox so với bề lõm → số giao điểm với Ox (0, 1 hoặc 2).',
    ],
    analogy: 'Như con dấu: a là hình khắc trên con dấu, b và c chỉ chọn chỗ đóng lên giấy.',
  },
  practice,
  teachBack: {
    prompt: 'Vì sao đồ thị y = 2x² − 8x + 5 có trục đối xứng x = 2?',
    options: [
      { who: '🦊 Cáo', text: 'Vì công thức x = −b/2a, thay số là ra.', correct: false, feedback: 'Đúng công thức nhưng chưa giải thích được VÌ SAO có đối xứng.' },
      { who: '🐬 Cá heo', text: 'Vì viết lại được y = 2(x − 2)² − 3; (x − 2)² bằng nhau tại x = 2 + t và x = 2 − t nên đồ thị đối xứng qua x = 2.', correct: true, feedback: 'Đúng bản chất! Dạng đỉnh làm lộ ra sự đối xứng.' },
      { who: '🐝 Ong', text: 'Vì c = 5 và 5 − 3 = 2.', correct: false, feedback: 'Ghép số ngẫu nhiên — c không liên quan đến trục đối xứng.' },
    ],
    ownWordsHint: 'Ví dụ: Hệ số a quyết định…, còn b và c…',
  },
  remember: ['a: hình dạng (hướng, độ hẹp)', 'b, c: vị trí — đỉnh I(−b/2a; −Δ/4a)', 'Dạng đỉnh y = a(x − h)² + k lộ rõ đối xứng', 'Δ → số giao điểm với Ox'],
}

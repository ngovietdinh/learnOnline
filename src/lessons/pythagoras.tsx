// Định lí Pythagore (Toán 8). Bản chất: là định lí về DIỆN TÍCH — và chứng minh được bằng cách xếp hình.
import { useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { pick, shuffle, type Rng } from '../core/rng'
import { sfx } from '../core/sound'
import { choicesFrom, vn } from './helpers'

type P = { x: number; y: number }
const sub = (p: P, q: P): P => ({ x: p.x - q.x, y: p.y - q.y })
const add = (p: P, q: P): P => ({ x: p.x + q.x, y: p.y + q.y })

/** Hình vuông dựng ra phía ngoài trên đoạn PQ (R là đỉnh còn lại của tam giác). */
function outerSquare(p: P, q: P, r: P): P[] {
  const d = sub(q, p)
  let n = { x: -d.y, y: d.x }
  const toR = sub(r, p)
  if (n.x * toR.x + n.y * toR.y > 0) n = { x: d.y, y: -d.x }
  return [p, q, add(q, n), add(p, n)]
}

const pts = (ps: P[]) => ps.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

function SquaresOnSides({ a, b, angle }: { a: number; b: number; angle: number }) {
  const g = (angle * Math.PI) / 180
  // Toạ độ SVG (y hướng xuống): C ở gốc, CB nằm ngang.
  const C = { x: 0, y: 0 }
  const B = { x: a, y: 0 }
  const A = { x: b * Math.cos(g), y: -b * Math.sin(g) }
  const sa = outerSquare(C, B, A)
  const sb = outerSquare(A, C, B)
  const sc = outerSquare(B, A, C)
  const all = [...sa, ...sb, ...sc]
  const minX = Math.min(...all.map((p) => p.x)) - 0.6
  const minY = Math.min(...all.map((p) => p.y)) - 0.6
  const w = Math.max(...all.map((p) => p.x)) - minX + 0.6
  const h = Math.max(...all.map((p) => p.y)) - minY + 0.6
  const c2 = a * a + b * b - 2 * a * b * Math.cos(g)
  const center = (ps: P[]) => ({ x: ps.reduce((s, p) => s + p.x, 0) / 4, y: ps.reduce((s, p) => s + p.y, 0) / 4 })
  const ca = center(sa)
  const cb = center(sb)
  const cc = center(sc)
  const fs = Math.max(w, h) / 22
  return (
    <svg viewBox={`${minX} ${minY} ${w} ${h}`} className="pyth-svg" role="img" aria-label="Ba hình vuông dựng trên ba cạnh tam giác">
      <polygon points={pts(sa)} className="sq sq-a" />
      <polygon points={pts(sb)} className="sq sq-b" />
      <polygon points={pts(sc)} className="sq sq-c" />
      <polygon points={pts([A, B, C])} className="tri" />
      {Math.abs(angle - 90) < 0.5 && (
        <polyline
          points={pts([
            { x: 0.5, y: 0 },
            { x: 0.5, y: -0.5 },
            { x: 0, y: -0.5 },
          ])}
          className="right-mark"
        />
      )}
      <text x={ca.x} y={ca.y} fontSize={fs} className="sq-label" textAnchor="middle" dominantBaseline="middle">
        a² = {vn(a * a, 1)}
      </text>
      <text x={cb.x} y={cb.y} fontSize={fs} className="sq-label" textAnchor="middle" dominantBaseline="middle">
        b² = {vn(b * b, 1)}
      </text>
      <text x={cc.x} y={cc.y} fontSize={fs} className="sq-label" textAnchor="middle" dominantBaseline="middle">
        c² = {vn(c2, 1)}
      </text>
    </svg>
  )
}

/** Chứng minh bằng cách xếp lại 4 tam giác trong hình vuông cạnh a + b. */
function RearrangeProof({ a, b, split }: { a: number; b: number; split: boolean }) {
  const S = a + b
  const base = pts([
    { x: 0, y: 0 },
    { x: a, y: 0 },
    { x: 0, y: b },
  ])
  const place1 = [
    [0, 0, 0],
    [S, 0, 90],
    [S, S, 180],
    [0, S, 270],
  ]
  const place2 = [
    [0, a, 0],
    [S, 0, 90],
    [a, S, 180],
    [a, a, 270],
  ]
  const place = split ? place2 : place1
  const colors = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24']
  return (
    <svg viewBox={`-0.4 -0.4 ${S + 0.8} ${S + 0.8}`} className="proof-svg" role="img" aria-label="Chứng minh định lí Pythagore bằng xếp hình">
      <rect x={0} y={0} width={S} height={S} className="proof-frame" />
      <polygon
        points={pts([
          { x: a, y: 0 },
          { x: S, y: a },
          { x: S - a, y: S },
          { x: 0, y: S - a },
        ])}
        className={`hole hole-c ${split ? 'gone' : ''}`}
      />
      <rect x={0} y={0} width={a} height={a} className={`hole hole-a ${split ? '' : 'gone'}`} />
      <rect x={a} y={a} width={b} height={b} className={`hole hole-b ${split ? '' : 'gone'}`} />
      {!split && (
        <text x={S / 2} y={S / 2} className="hole-label" fontSize={S / 9} textAnchor="middle" dominantBaseline="middle">
          c²
        </text>
      )}
      {split && (
        <>
          <text x={a / 2} y={a / 2} className="hole-label" fontSize={S / 10} textAnchor="middle" dominantBaseline="middle">a²</text>
          <text x={a + b / 2} y={a + b / 2} className="hole-label" fontSize={S / 10} textAnchor="middle" dominantBaseline="middle">b²</text>
        </>
      )}
      {place.map(([x, y, r], i) => (
        <g key={i} className="proof-tri" style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}>
          <polygon points={base} fill={colors[i]} />
        </g>
      ))}
    </svg>
  )
}

function PythagorasExplore({ onDiscover, say }: ExploreProps) {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [angle, setAngle] = useState(90)
  const [split, setSplit] = useState(false)
  const [tried, setTried] = useState({ sides: false, angle: false, proof: false })
  const g = (angle * Math.PI) / 180
  const c2 = a * a + b * b - 2 * a * b * Math.cos(g)
  const right = Math.abs(angle - 90) < 0.5
  const ready = tried.sides && tried.angle && tried.proof

  return (
    <div className="pyth-explore">
      <div className="two-col">
        <div className="panel">
          <h4>① Đo diện tích các hình vuông</h4>
          <SquaresOnSides a={a} b={b} angle={angle} />
          <div className="slider-row">
            <label htmlFor="pa">Cạnh a</label>
            <input id="pa" type="range" min={1} max={8} step={0.5} value={a} onChange={(e) => { setA(+e.target.value); setTried((t) => ({ ...t, sides: true })) }} />
            <b>{vn(a)}</b>
          </div>
          <div className="slider-row">
            <label htmlFor="pb">Cạnh b</label>
            <input id="pb" type="range" min={1} max={8} step={0.5} value={b} onChange={(e) => { setB(+e.target.value); setTried((t) => ({ ...t, sides: true })) }} />
            <b>{vn(b)}</b>
          </div>
          <div className="slider-row">
            <label htmlFor="pg">Góc giữa a và b</label>
            <input id="pg" type="range" min={50} max={130} step={5} value={angle} onChange={(e) => { setAngle(+e.target.value); setTried((t) => ({ ...t, angle: true })) }} />
            <b>{angle}°</b>
          </div>
          <div className={`compare ${right ? 'eq-ok' : 'eq-bad'}`}>
            a² + b² = <b>{vn(a * a + b * b, 1)}</b> {right ? '=' : '≠'} c² = <b>{vn(c2, 1)}</b>
          </div>
          <p className="muted">
            {right
              ? 'Góc vuông: tổng hai hình vuông nhỏ luôn đúng bằng hình vuông lớn — dù a, b là bao nhiêu!'
              : angle > 90
                ? 'Góc tù: c² LỚN hơn a² + b². Định lí chỉ đúng với góc vuông.'
                : 'Góc nhọn: c² NHỎ hơn a² + b². Định lí chỉ đúng với góc vuông.'}
          </p>
        </div>
        <div className="panel">
          <h4>② Vì sao lại đúng? Xếp lại 4 tam giác</h4>
          <RearrangeProof a={a} b={b} split={split} />
          <button
            className="btn btn-primary"
            onClick={() => {
              setSplit(!split)
              setTried((t) => ({ ...t, proof: true }))
              sfx.pop()
              say(
                split
                  ? 'Phần trống là một hình vuông cạnh c.'
                  : 'Cùng hình vuông lớn, cùng bốn tam giác. Phần trống bây giờ là hai hình vuông a bình phương và b bình phương. Vậy chúng bằng c bình phương!',
              )
            }}
          >
            🔀 {split ? 'Xếp lại như cũ' : 'Xếp lại 4 tam giác'}
          </button>
          <p className="muted">
            Hình vuông lớn cạnh (a + b) không đổi, 4 tam giác không đổi → <b>phần trống cũng không đổi</b>: c² = a² + b².
          </p>
        </div>
      </div>
      {ready ? (
        <div className="row-center">
          <button className="btn btn-primary" onClick={onDiscover}>
            Mình đã thấy vì sao ➜
          </button>
        </div>
      ) : (
        <p className="muted center">Hãy thử đổi cạnh, đổi góc, và xếp lại 4 tam giác.</p>
      )}
    </div>
  )
}

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [20, 21, 29],
]

function TriangleFig({ labels }: { labels: [string, string, string] }) {
  // Góc vuông tại đỉnh labels[0].
  return (
    <svg viewBox="-20 -20 240 170" className="tri-fig">
      <polygon points="20,130 20,10 200,130" className="tri" />
      <polyline points="20,115 35,115 35,130" className="right-mark" />
      <text x={6} y={146}>{labels[0]}</text>
      <text x={6} y={8}>{labels[1]}</text>
      <text x={204} y={146}>{labels[2]}</text>
    </svg>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  if (level === 1) {
    const names = shuffle(rng, ['A', 'B', 'C', 'D', 'E', 'M', 'N', 'P'])
    const [R, U, V] = names
    return {
      level,
      prompt: `Tam giác ${R}${U}${V} vuông tại ${R}. Cạnh huyền là cạnh nào?`,
      visual: <TriangleFig labels={[R, U, V]} />,
      choices: shuffle(rng, [
        { label: `${U}${V}`, correct: true },
        { label: `${R}${U}`, misconception: 'huyen-ke-goc-vuong', why: `${R}${U} kề với góc vuông — là cạnh góc vuông.` },
        { label: `${R}${V}`, misconception: 'huyen-ke-goc-vuong', why: `${R}${V} kề với góc vuông — là cạnh góc vuông.` },
      ]),
      explain: `Cạnh huyền là cạnh ĐỐI DIỆN góc vuông (không chạm vào đỉnh ${R}) — và luôn dài nhất.`,
    }
  }
  if (level === 2) {
    const isRight = rng() < 0.5
    let [x, y, z] = pick(rng, TRIPLES)
    if (!isRight) z = z + pick(rng, [-1, 1])
    const lhs = x * x + y * y
    const rhs = z * z
    return {
      level,
      prompt: `Tam giác có ba cạnh ${x}, ${y}, ${z} có phải là tam giác vuông không?`,
      layout: 'list',
      choices: shuffle(rng, [
        { label: `Có, vì ${x}² + ${y}² = ${z}²`, correct: isRight, misconception: isRight ? undefined : 'khong-tinh', why: isRight ? undefined : `${x}² + ${y}² = ${lhs}, còn ${z}² = ${rhs}.` },
        { label: `Không, vì ${x}² + ${y}² ≠ ${z}²`, correct: !isRight, misconception: isRight ? 'khong-tinh' : undefined, why: isRight ? `Tính lại: ${x}² + ${y}² = ${lhs} = ${z}².` : undefined },
        { label: `Có, vì ${x} + ${y} > ${z}`, misconception: 'nham-bat-dang-thuc', why: 'Đó chỉ là điều kiện để 3 đoạn tạo thành tam giác, chưa nói gì về góc vuông.' },
      ]),
      explain: `${x}² + ${y}² = ${lhs}, ${z}² = ${rhs}. ${isRight ? 'Bằng nhau → tam giác vuông (định lí đảo).' : 'Khác nhau → không vuông.'}`,
    }
  }
  if (level === 3) {
    const [x, y, z] = pick(rng, TRIPLES)
    return {
      level,
      prompt: `Tam giác vuông có hai cạnh góc vuông dài ${x} cm và ${y} cm. Cạnh huyền dài bao nhiêu?`,
      choices: choicesFrom(
        rng,
        z,
        [
          { value: x + y, misconception: 'cong-canh', why: 'Định lí nói về DIỆN TÍCH hình vuông (bình phương), không cộng độ dài.' },
          { value: x * x + y * y, misconception: 'quen-can', why: `${x * x + y * y} là c². Cần lấy căn bậc hai để ra c.` },
          { value: Math.abs(y - x), misconception: 'tru-canh', why: 'Cạnh huyền là cạnh dài nhất, không thể ngắn hơn cạnh góc vuông.' },
        ],
        { format: (v) => `${v} cm` },
      ),
      explain: `c² = ${x}² + ${y}² = ${x * x} + ${y * y} = ${z * z} → c = √${z * z} = ${z} cm.`,
    }
  }
  const [x, y, z] = pick(rng, TRIPLES)
  const k = pick(rng, [1, 1, 2])
  const [L, B, H] = [z * k, x * k, y * k]
  return {
    level,
    prompt: `Một chiếc thang dài ${L / 2} m dựa vào tường thẳng đứng. Chân thang cách chân tường ${B / 2} m. Đầu thang chạm tường ở độ cao bao nhiêu?`,
    visual: <span className="hook-emoji">🪜🧱</span>,
    choices: choicesFrom(
      rng,
      vn(H / 2),
      [
        { value: vn(Math.sqrt(L * L + B * B) / 2), misconception: 'cong-thay-tru', why: 'Thang là cạnh HUYỀN (dài nhất), nên phải lấy thang² − chân² chứ không cộng.' },
        { value: vn((L - B) / 2), misconception: 'tru-canh', why: 'Không trừ độ dài — trừ diện tích hình vuông (bình phương).' },
        { value: vn((L * L - B * B) / 4), misconception: 'quen-can', why: 'Đây mới là h². Lấy căn bậc hai để ra h.' },
      ],
      { format: (v) => `${v} m` },
    ),
    explain: `Thang là cạnh huyền: h² = ${vn(L / 2)}² − ${vn(B / 2)}² = ${vn((L * L - B * B) / 4)} → h = ${vn(H / 2)} m.`,
  }
}

export const pythagore: Lesson = {
  id: 'pythagore',
  skillId: 'thcs.pythagore',
  title: 'Định lí Pythagore',
  emoji: '📐',
  hook: {
    text: 'Thợ xây Ai Cập cổ đại chỉ dùng một sợi dây thắt 12 nút cách đều để tạo góc vuông hoàn hảo cho kim tự tháp. Bí mật nằm ở 3 – 4 – 5. Vì sao?',
    visual: <span className="hook-emoji">🔺🪢📏</span>,
  },
  explore: {
    intro: 'Dựng hình vuông trên mỗi cạnh của tam giác. Đổi độ dài, đổi góc và quan sát diện tích. Rồi xem phép xếp hình kỳ diệu.',
    Component: PythagorasExplore,
  },
  essence: {
    bigIdea: 'Tam giác vuông: diện tích hình vuông trên cạnh huyền = tổng diện tích hai hình vuông trên hai cạnh góc vuông.',
    points: [
      '🟦 a² không chỉ là "a nhân a" — đó là DIỆN TÍCH hình vuông cạnh a.',
      '🧩 Vì sao đúng: cùng hình vuông lớn cạnh (a + b), bớt cùng 4 tam giác → phần còn lại bằng nhau: c² = a² + b².',
      '📐 Chỉ đúng với góc vuông: góc nhọn thì c² < a² + b², góc tù thì c² > a² + b².',
      '↩️ Đảo lại: nếu a² + b² = c² thì tam giác vuông — bí mật sợi dây 3 – 4 – 5.',
    ],
    analogy: 'Đổ cát: lượng cát lấp đầy hình vuông a và hình vuông b vừa đúng lấp đầy hình vuông c.',
  },
  practice,
  teachBack: {
    prompt: 'Bạn hỏi: "Sao không phải a + b = c cho đơn giản?" Ai giải thích đúng?',
    options: [
      { who: '🐙 Bạch tuộc', text: 'Vì đường đi thẳng (cạnh huyền) luôn ngắn hơn đi vòng qua hai cạnh, nên c < a + b. Định lí so sánh DIỆN TÍCH các hình vuông, nên phải bình phương.', correct: true, feedback: 'Xuất sắc — vừa đúng bản chất (diện tích), vừa dùng một kiểm tra hợp lý.' },
      { who: '🐢 Rùa', text: 'Vì sách giáo khoa viết thế.', correct: false, feedback: 'Sách viết đúng, nhưng em cần biết VÌ SAO — hãy nhớ phép xếp 4 tam giác.' },
      { who: '🦩 Hồng hạc', text: 'Thật ra a + b = c cũng đúng, chỉ là cách viết khác.', correct: false, feedback: 'Thử với 3, 4: 3 + 4 = 7 nhưng cạnh huyền là 5.' },
    ],
    ownWordsHint: 'Ví dụ: Nếu xếp 4 tam giác vuông trong hình vuông cạnh a + b thì…',
  },
  remember: ['c là cạnh đối diện góc vuông, dài nhất', 'a² + b² = c² là phát biểu về diện tích', 'Chỉ đúng với tam giác vuông', 'Đảo lại: a² + b² = c² ⇒ vuông'],
}

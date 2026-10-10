// Khuôn khám phá môn Toán tiểu học — mô hình trực quan để "thấy" bản chất trước khi tính.
import { useEffect, useState } from 'react'
import type { ExploreProps } from '../lessons/types'
import type { Seg } from '../core/speech'
import { sfx } from '../core/sound'
import { centerOf, fx } from '../core/fx'
import { fmt, readNumber } from '../core/vnNumber'
import type { Explore } from './kit'

const W = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười']
const celebrate = (el?: Element | null) => {
  const [x, y] = centerOf(el ?? null)
  fx.burst(x, y, { count: 34 })
  sfx.correct()
}

// ───────────────────────── Tia số: ếch nhảy ─────────────────────────

export function numberLineExplore(intro: string, puzzles: [number, number, '+' | '-'][], max = 20): Explore {
  const result = ([a, b, op]: [number, number, '+' | '-']) => (op === '+' ? a + b : a - b)
  const finalLine = (p: [number, number, '+' | '-']) =>
    `${p[0]} ${p[2] === '+' ? 'cộng' : 'trừ'} ${p[1]} bằng ${result(p)}. Cộng là nhảy về bên phải, trừ là nhảy về bên trái.`
  function NumberLine({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const p = puzzles[k % puzzles.length]
    const [hops, setHops] = useState(0)
    const pos = p[2] === '+' ? p[0] + hops : p[0] - hops
    const done = hops === p[1]
    const hop = (el: Element) => {
      if (done) return
      const n = hops + 1
      setHops(n)
      sfx.boing()
      const [x, y] = centerOf(el)
      fx.sparkle(x, y - 30, 8)
      if (n === p[1]) {
        setTimeout(() => celebrate(el), 300)
        say(finalLine(p))
      } else say(W[n] ?? String(n))
    }
    return (
      <div className="nl-explore">
        <div className="eq big">
          {p[0]} {p[2] === '+' ? '+' : '−'} {p[1]} = {done ? <b className="pop-in">{result(p)}</b> : '?'}
        </div>
        <div className="numberline" style={{ ['--max' as string]: max }}>
          {Array.from({ length: max + 1 }, (_, i) => (
            <div key={i} className={`nl-tick ${i === p[0] ? 'start' : ''} ${i === pos ? 'here' : ''}`}>
              <span>{i}</span>
            </div>
          ))}
          <div className="frog" style={{ left: `${((pos + 0.5) / (max + 1)) * 100}%` }} key={pos}>
            🐸
          </div>
        </div>
        <div className="row-center">
          {!done ? (
            <button className="btn btn-primary btn-big" onClick={(e) => hop(e.currentTarget)}>
              {p[2] === '+' ? '➡️ Nhảy sang phải' : '⬅️ Nhảy sang trái'} ({hops}/{p[1]})
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                if (k + 1 >= puzzles.length) onDiscover()
                else {
                  setK(k + 1)
                  setHops(0)
                }
              }}
            >
              {k + 1 >= puzzles.length ? 'Mình hiểu rồi ➜' : 'Phép tính khác ➜'}
            </button>
          )}
        </div>
      </div>
    )
  }
  return { intro, Component: NumberLine, lines: [intro, ...W.slice(1), ...puzzles.map(finalLine)] }
}

// ───────────────────────── Hàng trăm – chục – đơn vị ─────────────────────────

export function placeValueExplore(intro: string, max: 99 | 999, target: number): Explore {
  const B10 = 'Đủ mười đơn vị rồi! Mình bó lại thành một chục.'
  const B100 = 'Đủ mười chục rồi! Mình gộp lại thành một trăm.'
  const doneLine = `Đúng rồi! Số ${readNumber(target)}. Mỗi chữ số có giá trị theo vị trí của nó.`
  function PlaceValue({ onDiscover, say }: ExploreProps) {
    const [u, setU] = useState(0)
    const [t, setT] = useState(0)
    const [h, setH] = useState(0)
    const [bundled, setBundled] = useState(false)
    const n = h * 100 + t * 10 + u
    const add = (kind: 'u' | 't' | 'h', el: Element) => {
      sfx.pop()
      const [x, y] = centerOf(el)
      fx.sparkle(x, y, 6)
      let nu = u
      let nt = t
      let nh = h
      if (kind === 'u') nu++
      if (kind === 't') nt++
      if (kind === 'h') nh++
      if (nu === 10) {
        nu = 0
        nt++
        setBundled(true)
        sfx.levelUp()
        say(B10)
      }
      if (nt === 10 && max === 999) {
        nt = 0
        nh++
        setBundled(true)
        sfx.levelUp()
        say(B100)
      } else if (nt === 10) nt = 9
      if (nh * 100 + nt * 10 + nu > max) return
      setU(nu)
      setT(nt)
      setH(nh)
      if (nh * 100 + nt * 10 + nu === target) {
        celebrate(el)
        say(doneLine)
      }
    }
    const reached = n === target
    return (
      <div className="pv-explore">
        <p className="lead">
          Hãy tạo số <b className="eq-inline">{fmt(target)}</b> bằng các khối. Thử bấm "+1 đơn vị" mười lần để xem điều kỳ diệu!
        </p>
        <div className="pv-board">
          {max === 999 && (
            <div className="pv-col">
              <h5>Trăm</h5>
              <div className="pv-stack">
                {Array.from({ length: h }, (_, i) => (
                  <span key={i} className="flat pop-in" />
                ))}
              </div>
              <b>{h}</b>
            </div>
          )}
          <div className="pv-col">
            <h5>Chục</h5>
            <div className="pv-stack">
              {Array.from({ length: t }, (_, i) => (
                <span key={i} className="rod pop-in" />
              ))}
            </div>
            <b>{t}</b>
          </div>
          <div className="pv-col">
            <h5>Đơn vị</h5>
            <div className="pv-stack">
              {Array.from({ length: u }, (_, i) => (
                <span key={i} className="cube pop-in" />
              ))}
            </div>
            <b>{u}</b>
          </div>
        </div>
        <div className="eq big">
          {fmt(n)} <small className="muted">— {readNumber(n)}</small>
        </div>
        <div className="btn-row center wrap">
          {max === 999 && (
            <button className="btn" onClick={(e) => add('h', e.currentTarget)}>
              +1 trăm 🟧
            </button>
          )}
          <button className="btn" onClick={(e) => add('t', e.currentTarget)}>
            +1 chục 🟦
          </button>
          <button className="btn" onClick={(e) => add('u', e.currentTarget)}>
            +1 đơn vị 🟨
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setU(0)
              setT(0)
              setH(0)
            }}
          >
            Làm lại
          </button>
        </div>
        {reached && bundled && (
          <div className="row-center">
            <button className="btn btn-primary" onClick={onDiscover}>
              Mình hiểu rồi ➜
            </button>
          </div>
        )}
        {reached && !bundled && <p className="muted center">Giờ thử bấm "+1 đơn vị" liên tục xem chuyện gì xảy ra khi đủ 10!</p>}
      </div>
    )
  }
  return { intro, Component: PlaceValue, lines: [intro, B10, B100, doneLine] }
}

// ───────────────────────── Phép nhân: mảng chấm ─────────────────────────

export function arrayExplore(intro: string, maxN = 10): Explore {
  const line = (r: number, c: number) => `${r} nhóm, mỗi nhóm ${c}. ${c} nhân ${r} bằng ${r * c}.`
  const FLIP = 'Xoay mảng lại: số chấm không đổi! Đổi chỗ các thừa số thì tích không đổi.'
  function ArrayExplore({ onDiscover, say }: ExploreProps) {
    const [r, setR] = useState(3)
    const [c, setC] = useState(4)
    const [flipped, setFlipped] = useState(false)
    const [moved, setMoved] = useState(0)
    const R = flipped ? c : r
    const Cc = flipped ? r : c
    return (
      <div className="arr-explore">
        <div className="dot-array" style={{ gridTemplateColumns: `repeat(${Cc}, 1fr)` }}>
          {Array.from({ length: R * Cc }, (_, i) => (
            <span key={i} className="adot" style={{ ['--row' as string]: Math.floor(i / Cc) }} />
          ))}
        </div>
        <div className="eq big">
          {Array.from({ length: R }, () => Cc).join(' + ')} = {Cc} × {R} = <b>{R * Cc}</b>
        </div>
        <div className="slider-row">
          <label htmlFor="ar">Số nhóm (hàng)</label>
          <input id="ar" type="range" min={1} max={maxN} value={r} onChange={(e) => (setR(+e.target.value), setMoved(moved + 1), sfx.tap())} />
          <b>{r}</b>
        </div>
        <div className="slider-row">
          <label htmlFor="ac">Mỗi nhóm có</label>
          <input id="ac" type="range" min={1} max={maxN} value={c} onChange={(e) => (setC(+e.target.value), setMoved(moved + 1), sfx.tap())} />
          <b>{c}</b>
        </div>
        <div className="btn-row center">
          <button className="btn" onClick={() => say(line(R, Cc))}>
            🔊 Đọc phép nhân
          </button>
          <button
            className="btn"
            onClick={() => {
              setFlipped(!flipped)
              sfx.whoosh()
              say(FLIP)
            }}
          >
            🔄 Xoay mảng
          </button>
        </div>
        {moved >= 2 && flipped && (
          <div className="row-center">
            <button className="btn btn-primary" onClick={onDiscover}>
              Mình hiểu rồi ➜
            </button>
          </div>
        )}
      </div>
    )
  }
  const lines: Seg[] = [intro, FLIP]
  for (let r = 1; r <= maxN; r++) for (let c = 1; c <= maxN; c++) lines.push(line(r, c))
  return { intro, Component: ArrayExplore, lines }
}

// ───────────────────────── Phép chia: chia kẹo ─────────────────────────

export function shareExplore(intro: string, puzzles: [number, number][]): Explore {
  const endLine = ([n, k]: [number, number]) => {
    const q = Math.floor(n / k)
    const r = n % k
    return r
      ? `${n} cái kẹo chia đều cho ${k} bạn: mỗi bạn ${q} cái, còn dư ${r} cái. ${n} chia ${k} bằng ${q}, dư ${r}.`
      : `${n} cái kẹo chia đều cho ${k} bạn: mỗi bạn ${q} cái. ${n} chia ${k} bằng ${q}.`
  }
  function Share({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const [n, friends] = puzzles[k]
    const [rounds, setRounds] = useState(0)
    const q = Math.floor(n / friends)
    const left = n - rounds * friends
    const done = rounds === q
    return (
      <div className="share-explore">
        <div className="eq big">
          {n} : {friends} = {done ? <b className="pop-in">{q}</b> : '?'}
          {done && n % friends ? <span> (dư {n % friends})</span> : null}
        </div>
        <div className="candy-pile">
          {Array.from({ length: left }, (_, i) => (
            <span key={i}>🍬</span>
          ))}
        </div>
        <div className="plates">
          {Array.from({ length: friends }, (_, i) => (
            <div key={i} className="plate">
              <span className="kid">{['🧒', '👧', '👦', '🧑', '👶', '🐻'][i % 6]}</span>
              <div>
                {Array.from({ length: rounds }, (_, j) => (
                  <span key={j} className="pop-in">
                    🍬
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="row-center">
          {!done ? (
            <button
              className="btn btn-primary btn-big"
              onClick={(e) => {
                const nr = rounds + 1
                setRounds(nr)
                sfx.pop()
                fx.sparkle(...centerOf(e.currentTarget), 10)
                if (nr === q) {
                  celebrate(e.currentTarget)
                  say(endLine([n, friends]))
                }
              }}
            >
              🤲 Chia mỗi bạn 1 cái
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                if (k + 1 >= puzzles.length) onDiscover()
                else {
                  setK(k + 1)
                  setRounds(0)
                }
              }}
            >
              {k + 1 >= puzzles.length ? 'Mình hiểu rồi ➜' : 'Chia lần khác ➜'}
            </button>
          )}
        </div>
      </div>
    )
  }
  return { intro, Component: Share, lines: [intro, ...puzzles.map(endLine)] }
}

// ───────────────────────── Đồng hồ ─────────────────────────

export const timeWords = (h: number, m: number) => (m === 0 ? `${h} giờ` : m === 30 ? `${h} giờ 30 phút, hay ${h} giờ rưỡi` : `${h} giờ ${m} phút`)

export function Clock({ h, m, size = 220 }: { h: number; m: number; size?: number }) {
  const ha = ((h % 12) + m / 60) * 30
  const ma = m * 6
  return (
    <svg viewBox="-110 -110 220 220" width={size} height={size} className="clock" role="img" aria-label={timeWords(h, m)}>
      <circle r="104" className="clock-face" />
      {Array.from({ length: 60 }, (_, i) => (
        <line key={i} x1="0" y1={i % 5 ? -94 : -88} x2="0" y2="-100" transform={`rotate(${i * 6})`} className={i % 5 ? 'tick-m' : 'tick-h'} />
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i + 1) * 30 * Math.PI) / 180
        return (
          <text key={i} x={Math.sin(a) * 74} y={-Math.cos(a) * 74 + 7} textAnchor="middle" className="clock-num">
            {i + 1}
          </text>
        )
      })}
      <line x1="0" y1="10" x2="0" y2="-50" transform={`rotate(${ha})`} className="hand-h" />
      <line x1="0" y1="14" x2="0" y2="-82" transform={`rotate(${ma})`} className="hand-m" />
      <circle r="6" className="clock-pin" />
    </svg>
  )
}

export function clockExplore(intro: string, step: 5 | 15 | 30 | 60 = 5): Explore {
  const DONE = 'Kim ngắn chỉ giờ, kim dài chỉ phút. Kim dài đi hết một vòng là một giờ, sáu mươi phút.'
  function ClockExplore({ onDiscover, say }: ExploreProps) {
    const [h, setH] = useState(7)
    const [m, setM] = useState(0)
    const [presses, setPresses] = useState(0)
    const bump = (dm: number) => {
      let nm = m + dm
      let nh = h
      while (nm >= 60) {
        nm -= 60
        nh = (nh % 12) + 1
      }
      setM(nm)
      setH(nh)
      setPresses(presses + 1)
      sfx.tap()
      say(timeWords(nh, nm))
    }
    return (
      <div className="clock-explore">
        <Clock h={h} m={m} />
        <div className="eq big">
          {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')} — {timeWords(h, m)}
        </div>
        <div className="btn-row center wrap">
          <button className="btn" onClick={() => bump(60)}>
            +1 giờ
          </button>
          <button className="btn" onClick={() => bump(step)}>
            +{step} phút
          </button>
        </div>
        {presses >= 4 && (
          <div className="row-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                say(DONE)
                onDiscover()
              }}
            >
              Mình hiểu rồi ➜
            </button>
          </div>
        )}
      </div>
    )
  }
  const lines: Seg[] = [intro, DONE]
  for (let hh = 1; hh <= 12; hh++) for (let mm = 0; mm < 60; mm += step) lines.push(timeWords(hh, mm))
  return { intro, Component: ClockExplore, lines }
}

// ───────────────────────── Tiền Việt Nam ─────────────────────────

export const NOTES = [
  { v: 1000, color: '#c7b39b' },
  { v: 2000, color: '#a3c4bc' },
  { v: 5000, color: '#8fb3e0' },
  { v: 10000, color: '#e6b85c' },
  { v: 20000, color: '#6fa8dc' },
  { v: 50000, color: '#e58fb0' },
  { v: 100000, color: '#7fc47f' },
]

export function Note({ v, small }: { v: number; small?: boolean }) {
  const c = NOTES.find((n) => n.v === v)?.color ?? '#ccc'
  return (
    <span className={`banknote ${small ? 'small' : ''}`} style={{ ['--c' as string]: c }}>
      <b>{fmt(v)}</b>
      <i>đồng</i>
    </span>
  )
}

export function moneyExplore(intro: string, items: { name: string; emoji: string; price: number }[], notes = [1000, 2000, 5000, 10000]): Explore {
  const ok = (it: { name: string; price: number }) => `Vừa đủ ${readNumber(it.price)} đồng để mua ${it.name}!`
  const over = 'Ồ, đưa nhiều hơn giá rồi. Người bán sẽ trả lại tiền thừa. Con bấm Làm lại để đưa vừa đủ nhé.'
  function Money({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const it = items[k]
    const [paid, setPaid] = useState<number[]>([])
    const total = paid.reduce((s, v) => s + v, 0)
    const enough = total === it.price
    return (
      <div className="money-explore">
        <div className="shop-item">
          <span className="hook-emoji">{it.emoji}</span>
          <div>
            <b>{it.name}</b>
            <div className="price-tag">{fmt(it.price)} đồng</div>
          </div>
        </div>
        <div className="tray">
          {paid.map((v, i) => (
            <span key={i} className="pop-in">
              <Note v={v} small />
            </span>
          ))}
          <div className="tray-total">
            Đã đưa: <b>{fmt(total)} đồng</b>
          </div>
        </div>
        <div className="note-row">
          {notes.map((v) => (
            <button
              key={v}
              className="note-btn"
              disabled={enough}
              onClick={(e) => {
                const nt = total + v
                setPaid([...paid, v])
                sfx.pop()
                if (nt === it.price) {
                  celebrate(e.currentTarget)
                  say(ok(it))
                } else if (nt > it.price) {
                  sfx.wrong()
                  say(over)
                }
              }}
            >
              <Note v={v} />
            </button>
          ))}
        </div>
        <div className="btn-row center">
          <button className="btn btn-ghost" onClick={() => setPaid([])}>
            Làm lại
          </button>
          {enough && (
            <button
              className="btn btn-primary"
              onClick={() => {
                if (k + 1 >= items.length) onDiscover()
                else {
                  setK(k + 1)
                  setPaid([])
                }
              }}
            >
              {k + 1 >= items.length ? 'Mình hiểu rồi ➜' : 'Mua món khác ➜'}
            </button>
          )}
        </div>
      </div>
    )
  }
  return { intro, Component: Money, lines: [intro, over, ...items.map(ok)] }
}

// ───────────────────────── Thước đo ─────────────────────────

export function rulerExplore(intro: string, lengths: number[]): Explore {
  const right = (n: number) => `Đặt một đầu ở vạch 0, đầu kia chỉ vạch ${n}. Vậy dài ${n} xăng-ti-mét.`
  const wrong = (n: number) => `Ơ kìa! Đặt ở vạch 1 thì đầu kia chỉ ${n + 1}, nhưng bút chỉ dài ${n} xăng-ti-mét thôi. Phải đặt ở vạch 0!`
  function Ruler({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const n = lengths[k]
    const [start, setStart] = useState<0 | 1 | null>(null)
    const [tried, setTried] = useState<Set<number>>(new Set())
    const unit = 100 / 16
    return (
      <div className="ruler-explore">
        <div className="ruler-area">
          {start !== null && (
            <div className="pencil" style={{ left: `${(start + 0.5) * unit}%`, width: `${n * unit}%` }}>
              ✏️
            </div>
          )}
          <div className="ruler">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={i} className="cm" style={{ left: `${(i + 0.5) * unit}%` }}>
                <i />
                {i}
              </span>
            ))}
          </div>
        </div>
        <div className="btn-row center wrap">
          <button
            className="btn"
            onClick={() => {
              setStart(0)
              setTried(new Set(tried).add(0))
              sfx.correct()
              say(right(n))
            }}
          >
            Đặt đầu bút ở vạch 0
          </button>
          <button
            className="btn btn-warn"
            onClick={() => {
              setStart(1)
              setTried(new Set(tried).add(1))
              sfx.wrong()
              say(wrong(n))
            }}
          >
            Đặt đầu bút ở vạch 1
          </button>
        </div>
        {tried.size === 2 && (
          <div className="row-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (k + 1 >= lengths.length) onDiscover()
                else {
                  setK(k + 1)
                  setStart(null)
                  setTried(new Set())
                }
              }}
            >
              {k + 1 >= lengths.length ? 'Mình hiểu rồi ➜' : 'Đo bút khác ➜'}
            </button>
          </div>
        )}
      </div>
    )
  }
  return { intro, Component: Ruler, lines: [intro, ...lengths.flatMap((n) => [right(n), wrong(n)])] }
}

// ───────────────────────── So sánh: cá sấu há miệng ─────────────────────────

export function compareExplore(intro: string, pairs: [number, number][]): Explore {
  const line = ([a, b]: [number, number]) =>
    a === b ? `${a} bằng ${b}. Cá sấu không biết ăn bên nào!` : `${Math.max(a, b)} lớn hơn ${Math.min(a, b)}. Cá sấu tham ăn luôn há miệng về phía số lớn hơn!`
  function Compare({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const [a, b] = pairs[k]
    const [answer, setAnswer] = useState<string | null>(null)
    const sign = a > b ? '>' : a < b ? '<' : '='
    return (
      <div className="cmp-explore">
        <div className="cmp-row">
          <span className="cmp-num">{fmt(a)}</span>
          <span className={`croc ${answer ? `show s-${sign === '>' ? 'gt' : sign === '<' ? 'lt' : 'eq'}` : ''}`}>{answer ? sign : '?'}</span>
          <span className="cmp-num">{fmt(b)}</span>
        </div>
        {!answer ? (
          <div className="btn-row center">
            {['>', '=', '<'].map((s) => (
              <button
                key={s}
                className="choice"
                onClick={(e) => {
                  if (s === sign) {
                    setAnswer(s)
                    celebrate(e.currentTarget)
                    say(line([a, b]))
                  } else {
                    sfx.wrong()
                    fx.puff(...centerOf(e.currentTarget))
                  }
                }}
              >
                <span className="choice-label" style={{ fontSize: '2rem' }}>
                  {s}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="row-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (k + 1 >= pairs.length) onDiscover()
                else {
                  setK(k + 1)
                  setAnswer(null)
                }
              }}
            >
              {k + 1 >= pairs.length ? 'Mình hiểu rồi ➜' : 'Cặp số khác ➜'}
            </button>
          </div>
        )}
      </div>
    )
  }
  return { intro, Component: Compare, lines: [intro, ...pairs.map(line)] }
}

// ───────────────────────── Chu vi – diện tích ─────────────────────────

export function areaExplore(intro: string): Explore {
  const line = (w: number, h: number) =>
    `Chu vi là đường bao quanh: ${w} cộng ${h} rồi nhân 2, bằng ${(w + h) * 2} xăng-ti-mét. Diện tích là số ô vuông phủ kín: ${w} nhân ${h} bằng ${w * h} xăng-ti-mét vuông.`
  function Area({ onDiscover, say }: ExploreProps) {
    const [w, setW] = useState(5)
    const [h, setH] = useState(3)
    const [mode, setMode] = useState<'cv' | 'dt' | null>(null)
    const [count, setCount] = useState(0)
    const [tries, setTries] = useState(0)
    useEffect(() => {
      if (mode !== 'dt') return
      setCount(0)
      const t = setInterval(() => setCount((c) => (c >= w * h ? c : c + 1)), Math.max(40, 900 / (w * h)))
      return () => clearInterval(t)
    }, [mode, w, h])
    return (
      <div className="area-explore">
        <div className={`area-grid mode-${mode}`} style={{ gridTemplateColumns: `repeat(${w}, 1fr)`, aspectRatio: `${w} / ${h}` }}>
          {Array.from({ length: w * h }, (_, i) => (
            <span key={i} className={mode === 'dt' && i < count ? 'filled' : ''}>
              {mode === 'dt' && i < count ? i + 1 : ''}
            </span>
          ))}
        </div>
        <div className="slider-row">
          <label htmlFor="aw">Chiều dài</label>
          <input id="aw" type="range" min={1} max={9} value={w} onChange={(e) => (setW(+e.target.value), setTries(tries + 1))} />
          <b>{w} cm</b>
        </div>
        <div className="slider-row">
          <label htmlFor="ah">Chiều rộng</label>
          <input id="ah" type="range" min={1} max={6} value={h} onChange={(e) => (setH(+e.target.value), setTries(tries + 1))} />
          <b>{h} cm</b>
        </div>
        <div className="btn-row center">
          <button className={`btn ${mode === 'cv' ? 'btn-primary' : ''}`} onClick={() => (setMode('cv'), sfx.whoosh(), say(line(w, h)))}>
            🐜 Chu vi = {(w + h) * 2} cm
          </button>
          <button className={`btn ${mode === 'dt' ? 'btn-primary' : ''}`} onClick={() => (setMode('dt'), sfx.sparkle(), say(line(w, h)))}>
            🟩 Diện tích = {w * h} cm²
          </button>
        </div>
        {tries >= 2 && mode && (
          <div className="row-center">
            <button className="btn btn-primary" onClick={onDiscover}>
              Mình hiểu rồi ➜
            </button>
          </div>
        )}
      </div>
    )
  }
  const lines: Seg[] = [intro]
  for (let w = 1; w <= 9; w++) for (let h = 1; h <= 6; h++) lines.push(line(w, h))
  return { intro, Component: Area, lines }
}

// ───────────────────────── Số thập phân & phần trăm: lưới 100 ô ─────────────────────────

export function hundredGridExplore(intro: string, mode: 'decimal' | 'percent'): Explore {
  const DONE =
    mode === 'decimal'
      ? 'Một phần mười là một cột, một phần trăm là một ô. Không phẩy ba bảy nghĩa là ba mươi bảy phần một trăm.'
      : 'Phần trăm nghĩa là trên một trăm. Ba mươi bảy phần trăm là ba mươi bảy ô trong một trăm ô.'
  function Grid({ onDiscover, say }: ExploreProps) {
    const [n, setN] = useState(37)
    const [moves, setMoves] = useState(0)
    return (
      <div className="grid100-explore">
        <div className="grid100">
          {Array.from({ length: 100 }, (_, i) => {
            const col = i % 10
            const row = Math.floor(i / 10)
            const idx = col * 10 + row
            return <span key={i} className={idx < n ? 'on' : ''} />
          })}
        </div>
        <div className="eq big">
          {n}/100 = {(n / 100).toFixed(2).replace('.', ',')} = {n}%
        </div>
        <div className="slider-row">
          <label htmlFor="g100">Số ô tô màu</label>
          <input id="g100" type="range" min={0} max={100} value={n} onChange={(e) => (setN(+e.target.value), setMoves(moves + 1))} />
          <b>{n}</b>
        </div>
        {moves >= 3 && (
          <div className="row-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                say(DONE)
                onDiscover()
              }}
            >
              Mình hiểu rồi ➜
            </button>
          </div>
        )}
      </div>
    )
  }
  return { intro, Component: Grid, lines: [intro, DONE] }
}

// ───────────────────────── Vận tốc: ô tô chạy ─────────────────────────

export function speedExplore(intro: string): Explore {
  const line = (v: number, t: number) => `Mỗi giờ đi ${v} ki-lô-mét, đi ${t} giờ thì được ${v} nhân ${t} bằng ${v * t} ki-lô-mét.`
  function Speed({ onDiscover, say }: ExploreProps) {
    const [v, setV] = useState(40)
    const [t, setT] = useState(2)
    const [run, setRun] = useState(0)
    const [runs, setRuns] = useState(0)
    const maxS = 60 * 5
    return (
      <div className="speed-explore">
        <div className="road">
          <div className="car" style={{ left: `${(run ? (v * t) / maxS : 0) * 92}%`, transitionDuration: `${t * 0.8}s` }}>
            🚗
          </div>
          {Array.from({ length: t }, (_, i) => (
            <span key={i} className="hour-mark" style={{ left: `${((v * (i + 1)) / maxS) * 92}%`, opacity: run ? 1 : 0, transitionDelay: `${(i + 1) * 0.8}s` }}>
              giờ {i + 1}
            </span>
          ))}
        </div>
        <div className="eq big">
          s = v × t = {v} × {t} = <b>{v * t} km</b>
        </div>
        <div className="slider-row">
          <label htmlFor="sv">Vận tốc v</label>
          <input id="sv" type="range" min={10} max={60} step={10} value={v} onChange={(e) => (setV(+e.target.value), setRun(0))} />
          <b>{v} km/giờ</b>
        </div>
        <div className="slider-row">
          <label htmlFor="st">Thời gian t</label>
          <input id="st" type="range" min={1} max={5} value={t} onChange={(e) => (setT(+e.target.value), setRun(0))} />
          <b>{t} giờ</b>
        </div>
        <div className="btn-row center">
          <button
            className="btn btn-primary"
            onClick={() => {
              setRun(0)
              setTimeout(() => setRun(1), 30)
              setRuns(runs + 1)
              sfx.whoosh()
              say(line(v, t))
            }}
          >
            🏁 Cho xe chạy
          </button>
          {runs >= 2 && (
            <button className="btn" onClick={onDiscover}>
              Mình hiểu rồi ➜
            </button>
          )}
        </div>
      </div>
    )
  }
  const lines: Seg[] = [intro]
  for (let v = 10; v <= 60; v += 10) for (let t = 1; t <= 5; t++) lines.push(line(v, t))
  return { intro, Component: Speed, lines }
}

// ───────────────────────── Đặt tính rồi tính (cộng/trừ có nhớ) ─────────────────────────

const HANG = ['đơn vị', 'chục', 'trăm', 'nghìn']

interface ColStep {
  col: number
  digit: number
  carryOut: number
  say: string
}

export function columnSteps(a: number, b: number, op: '+' | '-'): ColStep[] {
  const da = String(a).split('').reverse().map(Number)
  const db = String(b).split('').reverse().map(Number)
  const n = Math.max(da.length, db.length)
  const out: ColStep[] = []
  let carry = 0
  for (let i = 0; i < n; i++) {
    const x = da[i] ?? 0
    const y = db[i] ?? 0
    if (op === '+') {
      const s = x + y + carry
      const say =
        `Hàng ${HANG[i]}: ${x} cộng ${y} bằng ${x + y}` +
        (carry ? `, thêm 1 đã nhớ là ${s}` : '') +
        (s >= 10 ? `. Viết ${s % 10}, nhớ 1.` : `. Viết ${s}.`)
      out.push({ col: i, digit: s % 10, carryOut: s >= 10 ? 1 : 0, say })
      carry = s >= 10 ? 1 : 0
    } else {
      let top = x - carry
      const borrowNote = carry ? `${x} bớt 1 đã mượn còn ${top}. ` : ''
      let say = `Hàng ${HANG[i]}: ${borrowNote}`
      let next = 0
      if (top < y) {
        say += `${top} không trừ được ${y}, mượn 1 ${HANG[i + 1] ?? 'hàng trên'} thành ${top + 10}. `
        top += 10
        next = 1
      }
      say += `${top} trừ ${y} bằng ${top - y}. Viết ${top - y}.`
      out.push({ col: i, digit: top - y, carryOut: next, say })
      carry = next
    }
  }
  if (op === '+' && carry) out.push({ col: n, digit: 1, carryOut: 0, say: `Hạ 1 đã nhớ xuống hàng ${HANG[n]}. Viết 1.` })
  return out
}

export function columnExplore(intro: string, problems: { a: number; b: number; op: '+' | '-' }[]): Explore {
  const finalLine = (p: { a: number; b: number; op: '+' | '-' }) => `Vậy ${p.a} ${p.op === '+' ? 'cộng' : 'trừ'} ${p.b} bằng ${p.op === '+' ? p.a + p.b : p.a - p.b}.`
  function Column({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const p = problems[k]
    const steps = columnSteps(p.a, p.b, p.op)
    const [i, setI] = useState(0)
    const width = Math.max(String(p.a).length, String(p.b).length) + 1
    const digits = (n: number) => String(n).padStart(width, ' ').split('')
    const done = i >= steps.length
    const resultDigits = Array.from({ length: width }, (_, c) => {
      const col = width - 1 - c
      const st = steps.find((s) => s.col === col)
      return st && steps.indexOf(st) < i ? String(st.digit) : ''
    })
    const marks = Array.from({ length: width }, (_, c) => {
      const col = width - 1 - c
      const prev = steps.find((s) => s.col === col - 1)
      return prev && steps.indexOf(prev) < i && prev.carryOut ? (p.op === '+' ? '+1' : '−1') : ''
    })
    const activeCol = done ? -1 : width - 1 - steps[i].col
    return (
      <div className="col-explore">
        <div className="col-grid" style={{ gridTemplateColumns: `2em repeat(${width}, 1.4em)` }}>
          <span />
          {marks.map((m, c) => (
            <span key={`m${c}`} className="col-carry">
              {m}
            </span>
          ))}
          <span />
          {digits(p.a).map((d, c) => (
            <span key={`a${c}`} className={c === activeCol ? 'active' : ''}>
              {d.trim()}
            </span>
          ))}
          <span className="col-op">{p.op === '+' ? '+' : '−'}</span>
          {digits(p.b).map((d, c) => (
            <span key={`b${c}`} className={c === activeCol ? 'active' : ''}>
              {d.trim()}
            </span>
          ))}
          <span className="col-line" style={{ gridColumn: `1 / span ${width + 1}` }} />
          <span />
          {resultDigits.map((d, c) => (
            <span key={`r${c}`} className={`col-res ${d ? 'pop-in' : ''}`}>
              {d}
            </span>
          ))}
        </div>
        {i > 0 && <p className="note">{steps[i - 1].say}</p>}
        <div className="row-center">
          {!done ? (
            <button
              className="btn btn-primary btn-big"
              onClick={(e) => {
                sfx.pop()
                fx.sparkle(...centerOf(e.currentTarget), 10)
                say(steps[i].say)
                setI(i + 1)
                if (i + 1 === steps.length) setTimeout(() => celebrate(e.currentTarget), 400)
              }}
            >
              {i === 0 ? '▶️ Tính từ hàng đơn vị' : 'Hàng tiếp theo ➜'}
            </button>
          ) : (
            <>
              <p className="note good">{finalLine(p)}</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (k + 1 >= problems.length) onDiscover()
                  else {
                    setK(k + 1)
                    setI(0)
                  }
                }}
              >
                {k + 1 >= problems.length ? 'Mình hiểu rồi ➜' : 'Phép tính khác ➜'}
              </button>
            </>
          )}
        </div>
      </div>
    )
  }
  return { intro, Component: Column, lines: [intro, ...problems.flatMap((p) => [...columnSteps(p.a, p.b, p.op).map((s) => s.say), finalLine(p)])] }
}

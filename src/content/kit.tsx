// Khuôn khám phá dùng chung — mỗi bài chỉ cần khai báo dữ liệu.
import { useMemo, useState, type ComponentType } from 'react'
import type { ExploreProps } from '../lessons/types'
import type { Seg } from '../core/speech'
import { sfx } from '../core/sound'
import { centerOf, fx } from '../core/fx'
import { EmoText } from '../components/Critter'

export interface Card {
  key: string
  name: string
  emoji: string
  color?: string
  /** Cô nói gì khi chạm vào thẻ. */
  say: Seg | Seg[]
  /** Chữ phụ dưới tên (VD nghĩa tiếng Việt của từ tiếng Anh). */
  sub?: string
}

export interface Explore {
  intro: string
  Component: ComponentType<ExploreProps>
  lines: Seg[]
}

const segList = (s: Seg | Seg[]) => (Array.isArray(s) ? s : [s])
const PASTEL = ['#ff8fb8', '#ffc145', '#5ad1a4', '#6aa8ff', '#b58cff', '#ff9f5a', '#4fd1e0', '#f472b6']

/** Thẻ chạm – nghe: chạm từng thẻ để nghe cô giới thiệu. Xong hết thì sang bước sau. */
export function cardsExplore(intro: string, cards: Card[], done: string, opts: { big?: boolean } = {}): Explore {
  function CardsExplore({ onDiscover, say }: ExploreProps) {
    const [seen, setSeen] = useState<Set<string>>(new Set())
    const [bouncing, setBouncing] = useState<string | null>(null)
    return (
      <div className={`tap-grid ${opts.big === false ? 'small' : ''}`}>
        {cards.map((c, i) => (
          <button
            key={c.key}
            className={`tap-card ${seen.has(c.key) ? 'seen' : ''} ${bouncing === c.key ? 'bounce' : ''}`}
            style={{ ['--c' as string]: c.color ?? PASTEL[i % PASTEL.length], ['--i' as string]: i }}
            aria-label={c.name}
            onClick={(e) => {
              sfx.boing()
              const [x, y] = centerOf(e.currentTarget)
              fx.burst(x, y, { count: 22, colors: [c.color ?? PASTEL[i % PASTEL.length], '#ffffff', '#ffd23f'], shapes: ['star', 'circle', 'heart'] })
              say(c.say)
              setBouncing(c.key)
              setTimeout(() => setBouncing(null), 600)
              const next = new Set(seen).add(c.key)
              setSeen(next)
              if (next.size === cards.length && seen.size < cards.length) {
                setTimeout(() => {
                  sfx.celebrate()
                  fx.confettiRain(80)
                  say(done)
                  setTimeout(onDiscover, 2200)
                }, 1600)
              }
            }}
          >
            <span className="tap-emoji"><EmoText text={c.emoji} /></span>
            <span className="tap-name">{c.name}</span>
            {c.sub && <span className="tap-sub">{c.sub}</span>}
          </button>
        ))}
      </div>
    )
  }
  return { intro, Component: CardsExplore, lines: [intro, done, ...cards.flatMap((c) => segList(c.say))] }
}

export interface SortItem {
  emoji: string
  name: string
  bin: number
  /** Cô giải thích khi xếp đúng. */
  why: string
}

/** Phân loại: chạm một vật rồi chạm vào giỏ đúng. Dạy tiêu chí phân loại (sống dưới nước / trên cạn…). */
export function sortExplore(intro: string, bins: { name: string; emoji: string }[], items: SortItem[], done: string): Explore {
  function SortExplore({ onDiscover, say }: ExploreProps) {
    const [placed, setPlaced] = useState<Record<string, number>>({})
    const [pick, setPick] = useState<string | null>(null)
    const left = items.filter((it) => placed[it.name] === undefined)
    const drop = (b: number, el: Element) => {
      const it = items.find((x) => x.name === pick)
      if (!it) {
        say('Con chọn một bạn trước rồi đặt vào giỏ nhé!')
        return
      }
      const [x, y] = centerOf(el)
      if (it.bin === b) {
        sfx.correct()
        fx.burst(x, y, { count: 20 })
        say(it.why)
        const next = { ...placed, [it.name]: b }
        setPlaced(next)
        setPick(null)
        if (Object.keys(next).length === items.length)
          setTimeout(() => {
            sfx.celebrate()
            fx.confettiRain(80)
            say(done)
            setTimeout(onDiscover, 2400)
          }, 1500)
      } else {
        sfx.wrong()
        fx.puff(x, y)
        say(`Chưa đúng rồi. ${it.name} không thuộc giỏ ${bins[b].name}. Con thử giỏ kia nhé!`)
      }
    }
    return (
      <div className="sort-explore">
        <div className="sort-pool">
          {left.map((it) => (
            <button
              key={it.name}
              className={`sort-item ${pick === it.name ? 'picked' : ''}`}
              onClick={() => {
                sfx.pop()
                setPick(it.name)
                say(it.name)
              }}
            >
              <span><EmoText text={it.emoji} /></span>
              <small>{it.name}</small>
            </button>
          ))}
          {!left.length && <p className="note good">Xếp xong rồi! 🎉</p>}
        </div>
        <div className="sort-bins">
          {bins.map((b, i) => (
            <button key={b.name} className={`sort-bin ${pick ? 'ready' : ''}`} onClick={(e) => drop(i, e.currentTarget)}>
              <span className="bin-head">
                <EmoText text={b.emoji} /> {b.name}
              </span>
              <span className="bin-items">
                {items
                  .filter((it) => placed[it.name] === i)
                  .map((it) => (
                    <span key={it.name} className="pop-in">
                      {it.emoji}
                    </span>
                  ))}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }
  return {
    intro,
    Component: SortExplore,
    lines: [
      intro,
      done,
      'Con chọn một bạn trước rồi đặt vào giỏ nhé!',
      ...items.flatMap((it) => [it.name, it.why, ...bins.map((b) => `Chưa đúng rồi. ${it.name} không thuộc giỏ ${b.name}. Con thử giỏ kia nhé!`)]),
    ],
  }
}

export interface Step {
  emoji: string
  title: string
  say: string
}

/** Chuỗi các bước có hoạt hình: vòng đời, vòng tuần hoàn nước, quá trình… Chạm để sang bước tiếp. */
export function stepsExplore(intro: string, steps: Step[], done: string, opts: { cycle?: boolean } = {}): Explore {
  function StepsExplore({ onDiscover, say }: ExploreProps) {
    const [i, setI] = useState(-1)
    const n = steps.length
    const go = () => {
      const ni = i + 1
      if (ni >= n) {
        sfx.celebrate()
        fx.confettiRain(70)
        say(done)
        setTimeout(onDiscover, 2200)
        return
      }
      sfx.whoosh()
      setI(ni)
      say(steps[ni].say)
    }
    return (
      <div className="steps-explore">
        <div className={`steps-ring ${opts.cycle ? 'cycle' : 'line'}`} style={{ ['--n' as string]: n }}>
          {steps.map((s, k) => (
            <div key={k} className={`step-node ${k <= i ? 'on' : ''} ${k === i ? 'now' : ''}`} style={{ ['--k' as string]: k }}>
              <span className="sn-emoji"><EmoText text={s.emoji} /></span>
              <small>{s.title}</small>
            </div>
          ))}
          {opts.cycle && <div className="cycle-arrow" aria-hidden>🔄</div>}
        </div>
        {i >= 0 && (
          <p className="step-say note" key={i}>
            <b>{steps[i].title}:</b> {steps[i].say}
          </p>
        )}
        <div className="row-center">
          <button className="btn btn-primary btn-big" onClick={go}>
            {i < 0 ? '▶️ Bắt đầu' : i + 1 < n ? 'Tiếp theo ➜' : 'Mình hiểu rồi! ✔'}
          </button>
        </div>
      </div>
    )
  }
  return { intro, Component: StepsExplore, lines: [intro, done, ...steps.map((s) => s.say)] }
}

/** Ghép câu: xếp các thẻ từ theo đúng thứ tự (Ai – làm gì / Ai – là gì / Ai – thế nào). */
export function wordOrderExplore(intro: string, sentences: { words: string[]; say: string }[], done: string): Explore {
  function WordOrder({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const s = sentences[k]
    const shuffled = useMemo(() => [...s.words].map((w, i) => ({ w, i })).sort((a, b) => ((a.i * 7 + 3) % 5) - ((b.i * 7 + 3) % 5)), [s])
    const [built, setBuilt] = useState<number[]>([])
    const complete = built.length === s.words.length
    const tap = (i: number, el: Element) => {
      if (built.includes(i) || complete) return
      const expect = built.length
      if (s.words[i] === s.words[expect]) {
        sfx.pop()
        const nb = [...built, i]
        setBuilt(nb)
        if (nb.length === s.words.length) {
          const [x, y] = centerOf(el)
          fx.burst(x, y, { count: 30 })
          sfx.correct()
          say(s.say)
        }
      } else {
        sfx.wrong()
        say('Chưa đúng thứ tự. Câu nói về ai, rồi người đó làm gì, là gì, hay thế nào?')
      }
    }
    return (
      <div className="word-order">
        <div className="sentence-slots">
          {s.words.map((_, i) => (
            <span key={i} className={`slot ${built[i] !== undefined ? 'filled' : ''}`}>
              {built[i] !== undefined ? s.words[built[i]] : '…'}
            </span>
          ))}
        </div>
        <div className="word-tiles">
          {shuffled.map(({ w, i }) => (
            <button key={i} className={`word-tile ${built.includes(i) ? 'used' : ''}`} onClick={(e) => tap(i, e.currentTarget)}>
              {w}
            </button>
          ))}
        </div>
        {complete && (
          <div className="row-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (k + 1 >= sentences.length) {
                  say(done)
                  onDiscover()
                } else {
                  setK(k + 1)
                  setBuilt([])
                }
              }}
            >
              {k + 1 >= sentences.length ? 'Mình hiểu rồi ➜' : 'Câu tiếp theo ➜'}
            </button>
          </div>
        )}
      </div>
    )
  }
  return {
    intro,
    Component: WordOrder,
    lines: [intro, done, 'Chưa đúng thứ tự. Câu nói về ai, rồi người đó làm gì, là gì, hay thế nào?', ...sentences.map((s) => s.say)],
  }
}

/** Quy luật: một dãy lặp lại — bé chọn hình tiếp theo. */
export function patternExplore(intro: string, patterns: { unit: string[]; say: string }[], done: string): Explore {
  function PatternExplore({ onDiscover, say }: ExploreProps) {
    const [k, setK] = useState(0)
    const [filled, setFilled] = useState(0)
    const p = patterns[k]
    const shown = 2 * p.unit.length
    const target = 2 * p.unit.length
    const seq = Array.from({ length: shown + filled }, (_, i) => p.unit[i % p.unit.length])
    const options = [...new Set(p.unit)]
    const needed = p.unit[(shown + filled) % p.unit.length]
    return (
      <div className="pattern-explore">
        <div className="pattern-row">
          {seq.map((e, i) => (
            <span key={i} className={`pat ${i >= shown ? 'new pop-in' : ''}`}>
              {e}
            </span>
          ))}
          {filled < target && <span className="pat q">?</span>}
        </div>
        {filled < target ? (
          <div className="pattern-options">
            {options.map((o) => (
              <button
                key={o}
                className="choice"
                onClick={(e) => {
                  const [x, y] = centerOf(e.currentTarget)
                  if (o === needed) {
                    sfx.pop()
                    fx.sparkle(x, y, 12)
                    const nf = filled + 1
                    setFilled(nf)
                    if (nf === target) {
                      sfx.correct()
                      say(p.say)
                    }
                  } else {
                    sfx.wrong()
                    fx.puff(x, y)
                    say('Chưa đúng. Con nhìn xem nhóm nào cứ lặp đi lặp lại nhé!')
                  }
                }}
              >
                <span className="choice-visual">{o}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="row-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (k + 1 >= patterns.length) {
                  say(done)
                  onDiscover()
                } else {
                  setK(k + 1)
                  setFilled(0)
                }
              }}
            >
              {k + 1 >= patterns.length ? 'Mình hiểu rồi ➜' : 'Dãy khác ➜'}
            </button>
          </div>
        )}
      </div>
    )
  }
  return { intro, Component: PatternExplore, lines: [intro, done, 'Chưa đúng. Con nhìn xem nhóm nào cứ lặp đi lặp lại nhé!', ...patterns.map((p) => p.say)] }
}

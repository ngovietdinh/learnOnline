// Đếm và số lượng đến 10 (3–6 tuổi).
// Bản chất cần hiểu: (1) mỗi vật đếm đúng MỘT lần, (2) số cuối cùng = số lượng cả nhóm,
// (3) xếp lại thế nào thì số lượng cũng không đổi (bảo toàn số lượng).
import { useMemo, useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { int, pick, shuffle, type Rng } from '../core/rng'
import { sfx } from '../core/sound'
import { choicesFrom, near } from './helpers'

const NUM_WORDS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười']
const THINGS = [
  { emoji: '🍎', name: 'quả táo' },
  { emoji: '🐟', name: 'con cá' },
  { emoji: '⭐', name: 'ngôi sao' },
  { emoji: '🎈', name: 'quả bóng bay' },
  { emoji: '🐞', name: 'con bọ rùa' },
  { emoji: '🌸', name: 'bông hoa' },
]

function scatter(n: number, seed: number) {
  // Vị trí rải rác nhưng không chồng lên nhau (lưới 4×3 xáo trộn).
  const cells = Array.from({ length: 12 }, (_, i) => i)
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const picked = cells.sort(() => rnd() - 0.5).slice(0, n)
  return picked.map((c) => ({ x: (c % 4) * 25 + 6 + rnd() * 8, y: Math.floor(c / 4) * 33 + 6 + rnd() * 10 }))
}

function CountingExplore({ onDiscover, say }: ExploreProps) {
  const [round, setRound] = useState(0)
  const n = [5, 7, 4][round % 3]
  const thing = THINGS[round % THINGS.length]
  const [order, setOrder] = useState<number[]>([])
  const [shuffled, setShuffled] = useState(false)
  const [seed, setSeed] = useState(7)
  const pos = useMemo(() => scatter(n, seed + round * 13), [n, seed, round])
  const complete = order.length === n

  const tap = (i: number) => {
    if (order.includes(i)) {
      sfx.wrong()
      say('Bạn này đếm rồi! Mỗi bạn chỉ đếm một lần thôi.')
      return
    }
    const next = [...order, i]
    setOrder(next)
    sfx.pop()
    if (next.length === n) {
      setTimeout(() => {
        sfx.correct()
        say(`${NUM_WORDS[n]}! Số cuối cùng mình đếm là ${NUM_WORDS[n]}, vậy có tất cả ${NUM_WORDS[n]} ${thing.name}.`)
      }, 300)
    } else say(NUM_WORDS[next.length])
  }

  return (
    <div className="count-explore">
      <div className="count-field" aria-label="Khu vực đếm">
        {pos.map((p, i) => {
          const k = order.indexOf(i)
          return (
            <button
              key={i}
              className={`count-item ${k >= 0 ? 'counted' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, transition: 'left .7s, top .7s' }}
              onClick={() => tap(i)}
              aria-label={k >= 0 ? `đã đếm ${k + 1}` : thing.name}
            >
              <span>{thing.emoji}</span>
              {k >= 0 && <b className="count-badge">{k + 1}</b>}
            </button>
          )
        })}
      </div>
      <div className="count-bar">
        <div className="count-number" aria-live="polite">
          {order.length}
        </div>
        {complete && (
          <div className="count-actions">
            <p className="note good">
              Có tất cả <b>{n}</b> {thing.name}!
            </p>
            {!shuffled ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSeed((s) => s + 101)
                  setShuffled(true)
                  sfx.tap()
                  say(`Mình xáo lại rồi. Bé đoán xem bây giờ có mấy ${thing.name}?`)
                  setTimeout(() => say(`Vẫn là ${NUM_WORDS[n]}! Xếp kiểu gì thì số lượng cũng không đổi.`), 2600)
                }}
              >
                🔀 Xáo trộn thử xem!
              </button>
            ) : (
              <>
                <p className="note">Xáo lại rồi — vẫn là <b>{n}</b>! Xếp kiểu gì số lượng cũng không đổi.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (round >= 1) onDiscover()
                    setRound((r) => r + 1)
                    setOrder([])
                    setShuffled(false)
                  }}
                >
                  {round >= 1 ? 'Mình hiểu rồi! ➜' : 'Đếm nhóm khác ➜'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ n, emoji, spread }: { n: number; emoji: string; spread: boolean }) {
  return (
    <div className="q-row" style={{ gap: spread ? '1.6em' : '0.1em' }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i}>{emoji}</span>
      ))}
    </div>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  const t = pick(rng, THINGS)
  if (level === 1) {
    const n = int(rng, 2, 10)
    return {
      level: 1,
      prompt: `Có mấy ${t.name}?`,
      layout: 'grid',
      visual: <div className="q-scatter">{shuffle(rng, Array.from({ length: n }, (_, i) => i)).map((i) => <span key={i}>{t.emoji}</span>)}</div>,
      choices: choicesFrom(
        rng,
        n,
        [
          { value: n + 1, misconception: 'dem-lap', why: 'Có bạn bị đếm hai lần rồi. Chạm từng bạn một, mỗi bạn một lần nhé.' },
          { value: n - 1, misconception: 'bo-sot', why: 'Còn sót một bạn chưa đếm. Đếm lần lượt từ trái sang phải nhé.' },
        ],
        { count: 3, fill: near(n, 1) },
      ),
      explain: `Đếm từng ${t.name} một lần: số cuối cùng là ${n}, vậy có ${n} ${t.name}.`,
    }
  }
  // Mức 2: bảo toàn số lượng — hàng dài hơn KHÔNG có nghĩa là nhiều hơn.
  const kind = pick(rng, ['equal', 'more'] as const)
  const a = int(rng, 4, 7)
  const b = kind === 'equal' ? a : a + int(rng, 1, 2)
  // Đặt hàng ÍT hơn (hoặc bằng) ở dạng giãn rộng để thử thách cảm giác "dài = nhiều".
  return {
    level: 2,
    prompt: 'Hàng nào có nhiều hơn?',
    layout: 'list',
    visual: (
      <div className="q-rows">
        <div className="q-row-label">Hàng trên</div>
        <Row n={a} emoji="🔵" spread />
        <div className="q-row-label">Hàng dưới</div>
        <Row n={b} emoji="🔴" spread={false} />
      </div>
    ),
    choices: shuffle(rng, [
      {
        label: 'Hàng trên',
        correct: false,
        misconception: 'dai-la-nhieu',
        why: 'Hàng trên dài hơn vì các bạn đứng xa nhau thôi! Hãy đếm từng hàng.',
      },
      {
        label: 'Hàng dưới',
        correct: kind === 'more',
        misconception: kind === 'more' ? undefined : 'doan-theo-mat',
        why: kind === 'more' ? undefined : `Đếm thử: hàng dưới có ${b}, hàng trên có ${a}.`,
      },
      {
        label: 'Bằng nhau',
        correct: kind === 'equal',
        misconception: kind === 'equal' ? undefined : 'doan-theo-mat',
        why: kind === 'equal' ? undefined : `Đếm thử: hàng trên ${a}, hàng dưới ${b} — không bằng nhau.`,
      },
    ]),
    explain:
      kind === 'equal'
        ? `Cả hai hàng đều có ${a}. Đứng xa hay gần thì số lượng cũng không đổi!`
        : `Hàng dưới có ${b}, hàng trên chỉ có ${a}. Hàng dài hơn chưa chắc nhiều hơn — phải đếm!`,
  }
}

export const dem10: Lesson = {
  id: 'dem-10',
  skillId: 'choi.dem-10',
  title: 'Đếm và số lượng đến 10',
  emoji: '🔢',
  hook: {
    text: 'Bạn Cáo nói hàng kẹo dài hơn thì nhiều kẹo hơn. Có đúng không nhỉ? Mình cùng đếm để biết nhé!',
    visual: <span className="hook-emoji">🦊🍬</span>,
  },
  explore: {
    intro: 'Chạm vào từng bạn để đếm. Mỗi bạn chỉ chạm một lần thôi!',
    Component: CountingExplore,
  },
  essence: {
    bigIdea: 'Số cuối cùng ta đếm cho biết có tất cả bao nhiêu.',
    points: [
      '👆 Mỗi vật chỉ đếm một lần — không bỏ sót, không đếm lặp.',
      '🔟 Số cuối cùng mình nói ra là số lượng của cả nhóm.',
      '🔀 Xếp xa, xếp gần, xáo trộn — số lượng vẫn không đổi.',
    ],
    analogy: 'Giống như điểm danh lớp học: gọi mỗi bạn một lần, số cuối cùng là số bạn có mặt.',
  },
  practice,
  remember: ['Chạm từng cái, đếm một lần', 'Số cuối = có tất cả bao nhiêu', 'Xếp lại không làm đổi số lượng'],
}

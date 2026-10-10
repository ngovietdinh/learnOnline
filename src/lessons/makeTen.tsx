// Cộng qua 10 (Toán 2). Bản chất: lấp đầy 10 trước, rồi cộng phần còn lại.
import { useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { int, pick, type Rng } from '../core/rng'
import { sfx } from '../core/sound'
import { choicesFrom, near } from './helpers'

const PAIRS: [number, number][] = [
  [8, 5],
  [9, 4],
  [7, 6],
  [8, 7],
  [9, 6],
]

function TenFrame({ red, blue }: { red: number; blue: number }) {
  return (
    <div className="ten-frame">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="tf-cell">
          {i < red ? <span className="dot red" /> : i < red + blue ? <span className="dot blue pop-in" /> : null}
        </div>
      ))}
    </div>
  )
}

function MakeTenExplore({ onDiscover, say }: ExploreProps) {
  const [k, setK] = useState(0)
  const [a, b] = PAIRS[k % PAIRS.length]
  const [moved, setMoved] = useState(0)
  const need = 10 - a
  const full = moved === need
  const rest = b - moved

  const move = () => {
    if (full) {
      sfx.wrong()
      say('Khung đã đủ 10 rồi! Phần còn lại để ở khung dưới.')
      return
    }
    sfx.pop()
    const m = moved + 1
    setMoved(m)
    if (m === need) {
      sfx.correct()
      say(`Đủ 10 rồi! ${a} cộng ${need} bằng 10. Còn lại ${b - need}. 10 cộng ${b - need} bằng ${a + b}.`)
    }
  }

  return (
    <div className="mt-explore">
      <p className="lead">
        Tính <b className="eq-inline">{a} + {b}</b>. Chạm vào chấm <span className="dot blue inline" /> ở khung dưới để chuyển lên lấp đầy khung trên.
      </p>
      <div className="mt-frames">
        <div>
          <div className="frame-label">Khung trên: {a + moved}</div>
          <TenFrame red={a} blue={moved} />
        </div>
        <div>
          <div className="frame-label">Khung dưới: {rest}</div>
          <div className="ten-frame">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="tf-cell">
                {i < rest && (
                  <button className="dot blue tappable" aria-label="chuyển chấm xanh lên" onClick={move} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="eq big">
        {a} + {b}
        {moved > 0 && (
          <>
            {' '}= {a} + <span className="hl">{moved}</span> + {b - moved}
          </>
        )}
        {full && (
          <>
            {' '}= <span className="hl">10</span> + {rest} = <b>{a + b}</b>
          </>
        )}
      </div>
      {full && (
        <div className="row-center">
          <p className="note good">
            Tách {b} thành <b>{need}</b> và <b>{rest}</b>: {need} để lấp đầy 10, {rest} cộng tiếp. Không cần đếm từng cái!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (k >= 1) onDiscover()
              setK(k + 1)
              setMoved(0)
            }}
          >
            {k >= 1 ? 'Mình hiểu quy luật rồi ➜' : 'Thử phép tính khác ➜'}
          </button>
        </div>
      )}
    </div>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  const a = int(rng, 6, 9)
  const b = int(rng, 11 - a, 9)
  const need = 10 - a
  const rest = b - need
  const sum = a + b
  if (level === 1) {
    return {
      level,
      prompt: `${a} cần thêm mấy để được 10?`,
      visual: <TenFrame red={a} blue={0} />,
      choices: choicesFrom(
        rng,
        need,
        [
          { value: a, misconception: 'nham-so', why: `Đó là số chấm đang có. Đếm số ô còn trống nhé.` },
          { value: need + 1, misconception: 'dem-lech', why: 'Đếm lại số ô trống trong khung 10.' },
        ],
        { fill: near(need, 1) },
      ),
      explain: `${a} + ${need} = 10. Khung 10 còn ${need} ô trống.`,
    }
  }
  if (level === 2) {
    return {
      level,
      prompt: `${a} + ${b} = 10 + ?`,
      visual: <div className="eq">{a} + {b} = {a} + {need} + <b>?</b></div>,
      choices: choicesFrom(
        rng,
        rest,
        [
          { value: b, misconception: 'khong-tach', why: `Đã lấy ${need} từ ${b} để lấp đầy 10, nên chỉ còn lại ${b} − ${need}.` },
          { value: need, misconception: 'nham-phan-tach', why: `${need} là phần dùng để lấp đầy 10. Phần còn lại mới là đáp án.` },
          { value: rest + 1, misconception: 'dem-lech' },
        ],
        { fill: near(rest, 1) },
      ),
      explain: `Tách ${b} = ${need} + ${rest}. ${a} + ${need} = 10, nên ${a} + ${b} = 10 + ${rest}.`,
    }
  }
  const who = pick(rng, ['Lan', 'Minh', 'An', 'Hà'])
  const item = pick(rng, ['viên bi', 'cái kẹo', 'quyển truyện', 'bông hoa'])
  return {
    level,
    prompt:
      level === 3
        ? `${who} có ${a} ${item}, được cho thêm ${b} ${item}. ${who} có tất cả bao nhiêu ${item}?`
        : `Tính nhanh: ${a} + ${b} + ${10 - b}`,
    choices:
      level === 3
        ? choicesFrom(
            rng,
            sum,
            [
              { value: sum - 10, misconception: 'quen-nho', why: `Quên mất chục vừa lấp đầy! ${a} + ${b} = 10 + ${rest}.` },
              { value: sum + 1, misconception: 'dem-lech', why: 'Lệch một — hãy tách để lấp đầy 10 thay vì đếm thêm.' },
              { value: sum - 1, misconception: 'dem-lech', why: 'Lệch một — hãy tách để lấp đầy 10 thay vì đếm thêm.' },
            ],
            { fill: near(sum, 1) },
          )
        : choicesFrom(
            rng,
            a + 10,
            [
              { value: a + b + 10 - b + 1, misconception: 'dem-lech' },
              { value: sum, misconception: 'bo-so-hang', why: 'Đừng quên số hạng cuối!' },
            ],
            { fill: near(a + 10, 1) },
          ),
    explain:
      level === 3
        ? `${a} + ${b} = ${a} + ${need} + ${rest} = 10 + ${rest} = ${sum}.`
        : `Ghép ${b} + ${10 - b} = 10 trước, rồi ${a} + 10 = ${a + 10}. Tìm cách tạo số 10 là tính nhanh!`,
  }
}

export const congQua10: Lesson = {
  id: 'cong-qua-10',
  skillId: 'th.cong-qua-10',
  title: 'Cộng qua 10',
  emoji: '🔟',
  hook: {
    text: 'Bạn Cáo tính 8 + 5 bằng cách đếm ngón tay: 9, 10, 11, 12, 13… lâu quá! Có cách nào tính trong nháy mắt không?',
    visual: <span className="hook-emoji">🦊🖐️🤔</span>,
  },
  explore: { intro: 'Hãy chuyển chấm xanh lên khung trên cho đến khi khung đủ 10.', Component: MakeTenExplore },
  essence: {
    bigIdea: 'Lấp đầy 10 trước, rồi cộng phần còn lại.',
    points: [
      '🔟 Số 10 là "bến đỗ" dễ nhất: 10 + 3 thì ai cũng biết ngay là 13.',
      '✂️ Tách số hạng thứ hai thành hai phần: một phần vừa đủ lấp đầy 10, phần kia còn lại.',
      '🧠 Vì sao đúng? Ta chỉ dời chấm từ khung này sang khung kia — tổng số chấm không đổi.',
    ],
    analogy: 'Giống xếp trứng vào khay 10 ô: lấp đầy một khay rồi đếm số trứng còn lẻ.',
  },
  practice,
  teachBack: {
    prompt: 'Ba bạn giải thích cách tính 9 + 4. Bạn nào hiểu đúng bản chất?',
    options: [
      {
        who: '🐰 Thỏ',
        text: 'Mình lấy 1 từ số 4 cho 9 thành 10, còn lại 3, nên 9 + 4 = 10 + 3 = 13.',
        correct: true,
        feedback: 'Chính xác! Tách 4 = 1 + 3 để lấp đầy 10 rồi cộng phần còn lại.',
      },
      {
        who: '🐻 Gấu',
        text: 'Mình thuộc lòng 9 + 4 = 13 nên không cần biết vì sao.',
        correct: false,
        feedback: 'Thuộc lòng thì nhanh, nhưng gặp số lạ sẽ bí. Hiểu cách lấp đầy 10 thì tính được mọi phép!',
      },
      {
        who: '🐸 Ếch',
        text: 'Mình lấy 9 + 4 = 10 + 4 = 14 vì 9 gần bằng 10.',
        correct: false,
        feedback: 'Ếch đã lấy 1 để biến 9 thành 10 nhưng quên bớt 1 ở số 4. Tổng phải giữ nguyên!',
      },
    ],
    ownWordsHint: 'Ví dụ: Để tính 7 + 5, mình…',
  },
  remember: ['Lấp đầy 10 trước', 'Tách số thứ hai: phần lấp 10 + phần còn lại', 'Dời chấm không làm đổi tổng'],
}

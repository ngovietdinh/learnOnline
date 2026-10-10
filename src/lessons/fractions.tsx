// Phân số (Toán 3–4). Bản chất: chia thành các phần BẰNG NHAU; mẫu số cho biết mỗi phần to hay nhỏ.
import { useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { int, pick, shuffle, type Rng } from '../core/rng'
import { sfx } from '../core/sound'
import { choicesFrom } from './helpers'

export function FractionBar({
  n,
  shaded,
  onToggle,
  color = 'var(--accent)',
  widths,
}: {
  n: number
  shaded: Set<number> | number
  onToggle?: (i: number) => void
  color?: string
  /** Tỉ lệ độ rộng từng phần — dùng để vẽ phần KHÔNG bằng nhau. */
  widths?: number[]
}) {
  const isOn = (i: number) => (typeof shaded === 'number' ? i < shaded : shaded.has(i))
  return (
    <div className="frac-bar" role="group" aria-label={`Thanh chia ${n} phần`}>
      {Array.from({ length: n }, (_, i) => (
        <button
          key={i}
          className={`frac-part ${isOn(i) ? 'on' : ''}`}
          style={{ flex: widths ? widths[i] : 1, ['--c' as string]: color }}
          onClick={onToggle ? () => onToggle(i) : undefined}
          tabIndex={onToggle ? 0 : -1}
          aria-label={`phần ${i + 1}${isOn(i) ? ', đã tô' : ''}`}
        />
      ))}
    </div>
  )
}

function Frac({ a, b, big }: { a: number | string; b: number | string; big?: boolean }) {
  return (
    <span className={`frac ${big ? 'big' : ''}`}>
      <span>{a}</span>
      <span>{b}</span>
    </span>
  )
}

function FractionExplore({ onDiscover, say }: ExploreProps) {
  const [n, setN] = useState(4)
  const [shaded, setShaded] = useState<Set<number>>(new Set([0]))
  const [denoms, setDenoms] = useState<Set<number>>(new Set([4]))
  const [wall, setWall] = useState(false)
  const a = shaded.size

  const ready = denoms.size >= 3 && wall

  return (
    <div className="frac-explore">
      <div className="panel">
        <div className="slider-row">
          <label htmlFor="n">Chia thành</label>
          <input
            id="n"
            type="range"
            min={2}
            max={12}
            value={n}
            onChange={(e) => {
              const v = Number(e.target.value)
              setN(v)
              setShaded(new Set([...shaded].filter((i) => i < v)))
              setDenoms(new Set(denoms).add(v))
              sfx.tap()
            }}
          />
          <b>{n} phần bằng nhau</b>
        </div>
        <FractionBar
          n={n}
          shaded={shaded}
          onToggle={(i) => {
            const s = new Set(shaded)
            if (s.has(i)) s.delete(i)
            else s.add(i)
            setShaded(s)
            sfx.pop()
          }}
        />
        <div className="frac-readout">
          <Frac a={a} b={n} big />
          <div>
            <div>
              <b>Tử số {a}</b>: số phần đã lấy (tô màu)
            </div>
            <div>
              <b>Mẫu số {n}</b>: chia thành {n} phần bằng nhau
            </div>
            <div className="muted">Mỗi phần to bằng {n === 1 ? 'cả thanh' : `1/${n} thanh`}</div>
          </div>
        </div>
      </div>

      <div className="panel">
        {!wall ? (
          <button
            className="btn"
            onClick={() => {
              setWall(true)
              say('Nhìn xem: chia càng nhiều phần thì mỗi phần càng nhỏ.')
            }}
          >
            🧱 Xem bức tường phân số
          </button>
        ) : (
          <div className="frac-wall">
            {[1, 2, 3, 4, 5, 6, 8].map((d) => (
              <div key={d} className="wall-row">
                <span className="wall-label">
                  <Frac a={1} b={d} />
                </span>
                <FractionBar n={d} shaded={1} color={`hsl(${d * 40} 85% 60%)`} />
              </div>
            ))}
            <p className="note">
              <b>1/2 &gt; 1/3 &gt; 1/4 …</b> Chia cho càng nhiều người, mỗi người được càng ít!
            </p>
          </div>
        )}
      </div>
      {ready ? (
        <div className="row-center">
          <button className="btn btn-primary" onClick={onDiscover}>
            Mình đã thấy quy luật ➜
          </button>
        </div>
      ) : (
        <p className="muted center">Thử kéo thanh trượt ít nhất 2 lần và xem bức tường phân số nhé.</p>
      )}
    </div>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  const fmt = (v: number | string) => String(v)
  if (level === 1) {
    const n = int(rng, 3, 8)
    const a = int(rng, 1, n - 1)
    return {
      level,
      prompt: 'Phần tô màu là phân số nào?',
      visual: <FractionBar n={n} shaded={a} />,
      choices: choicesFrom(
        rng,
        `${a}/${n}`,
        [
          { value: `${a}/${n - a}`, misconception: 'to-tren-khong-to', why: `Mẫu số là TỔNG số phần (${n}), không phải số phần không tô.` },
          { value: `${n - a}/${n}`, misconception: 'nham-phan-khong-to', why: `Đó là phần KHÔNG tô. Tử số là số phần được tô.` },
          { value: `${n}/${a}`, misconception: 'dao-tu-mau', why: 'Tử số (trên) là số phần lấy, mẫu số (dưới) là số phần chia.' },
        ],
        { format: fmt },
      ),
      explain: `Thanh chia ${n} phần bằng nhau (mẫu số ${n}), tô ${a} phần (tử số ${a}) → ${a}/${n}.`,
    }
  }
  if (level === 2) {
    if (rng() < 0.5) {
      const [p, q] = shuffle(rng, [2, 3, 4, 5, 6, 8]).slice(0, 2)
      const big = Math.min(p, q)
      return {
        level,
        prompt: `Phân số nào lớn hơn: 1/${p} hay 1/${q}?`,
        visual: (
          <div className="q-rows">
            <FractionBar n={p} shaded={1} />
            <FractionBar n={q} shaded={1} />
          </div>
        ),
        choices: shuffle(rng, [
          { label: `1/${big}`, correct: true },
          {
            label: `1/${Math.max(p, q)}`,
            misconception: 'mau-lon-thi-lon',
            why: `${Math.max(p, q)} lớn hơn ${big}, nhưng chia thành NHIỀU phần hơn thì mỗi phần NHỎ hơn.`,
          },
          { label: 'Bằng nhau', misconception: 'cung-tu-la-bang', why: 'Cùng tử số 1 nhưng kích thước mỗi phần khác nhau.' },
        ]),
        explain: `Cùng là 1 phần, nhưng chia ${big} phần thì mỗi phần to hơn chia ${Math.max(p, q)} phần. Vậy 1/${big} lớn hơn.`,
      }
    }
    const widths = shuffle(rng, [1, 2, 3])
    return {
      level,
      prompt: 'Thanh được chia 3 phần, tô 1 phần. Phần tô màu có phải là 1/3 thanh không?',
      visual: <FractionBar n={3} shaded={1} widths={widths} />,
      choices: shuffle(rng, [
        { label: 'Không, vì 3 phần không bằng nhau', correct: true },
        {
          label: 'Có, vì chia 3 phần và tô 1 phần',
          misconception: 'bo-qua-bang-nhau',
          why: 'Phân số chỉ đúng khi các phần BẰNG NHAU. Ở đây các phần to nhỏ khác nhau.',
        },
      ]),
      explain: 'Phân số đòi hỏi các phần bằng nhau. Chia không đều thì không gọi là "một phần ba".',
    }
  }
  if (level === 3) {
    if (rng() < 0.5) {
      const n = pick(rng, [6, 8, 10, 12])
      const eat = int(rng, 1, n - 1)
      const who = pick(rng, ['An', 'Bình', 'Chi', 'Dũng'])
      return {
        level,
        prompt: `Chiếc bánh được cắt thành ${n} miếng bằng nhau. ${who} ăn ${eat} miếng. Phần bánh còn lại là bao nhiêu?`,
        choices: choicesFrom(
          rng,
          `${n - eat}/${n}`,
          [
            { value: `${eat}/${n}`, misconception: 'nham-phan-khong-to', why: 'Đó là phần đã ăn, câu hỏi hỏi phần còn lại.' },
            { value: `${n - eat}/${eat}`, misconception: 'to-tren-khong-to', why: `Mẫu số vẫn là ${n} — cả chiếc bánh có ${n} miếng.` },
            { value: `${n}/${n - eat}`, misconception: 'dao-tu-mau' },
          ],
          { format: fmt },
        ),
        explain: `Còn ${n} − ${eat} = ${n - eat} miếng trong tổng ${n} miếng → ${n - eat}/${n}.`,
      }
    }
    const d = pick(rng, [2, 3, 4])
    const a = int(rng, 1, d - 1)
    const k = pick(rng, [2, 3])
    return {
      level,
      prompt: `${a}/${d} bằng phân số nào?`,
      visual: (
        <div className="q-rows">
          <FractionBar n={d} shaded={a} />
          <FractionBar n={d * k} shaded={a * k} />
        </div>
      ),
      choices: choicesFrom(
        rng,
        `${a * k}/${d * k}`,
        [
          { value: `${a + k}/${d + k}`, misconception: 'cong-tu-mau', why: 'Cộng thêm cùng một số vào tử và mẫu làm thay đổi giá trị. Phải NHÂN cùng một số.' },
          { value: `${a * k}/${d}`, misconception: 'nhan-mot-ve', why: 'Chỉ nhân tử số thì phần lấy to ra gấp nhiều lần. Phải nhân cả tử và mẫu.' },
          { value: `${a}/${d * k}`, misconception: 'nhan-mot-ve', why: 'Chỉ nhân mẫu số thì mỗi phần nhỏ đi mà số phần lấy không tăng.' },
        ],
        { format: fmt },
      ),
      explain: `Cắt mỗi phần thành ${k} phần nhỏ: số phần tăng ${k} lần, số phần lấy cũng tăng ${k} lần, lượng tô màu giữ nguyên.`,
    }
  }
  // Mức 4: so sánh hai phân số khác tử, khác mẫu bằng lập luận "phần còn thiếu".
  const n = int(rng, 4, 9)
  const m = n + int(rng, 1, 3)
  return {
    level,
    prompt: `Không quy đồng, so sánh ${n - 1}/${n} và ${m - 1}/${m}.`,
    choices: shuffle(rng, [
      { label: `${m - 1}/${m} lớn hơn`, correct: true },
      { label: `${n - 1}/${n} lớn hơn`, misconception: 'mau-nho-thi-lon', why: 'Hãy xem phần còn thiếu để đủ 1 cái bánh.' },
      { label: 'Bằng nhau', misconception: 'cung-thieu-mot', why: `Cùng thiếu 1 phần, nhưng 1/${n} và 1/${m} to nhỏ khác nhau.` },
    ]),
    explain: `Mỗi phân số thiếu đúng một phần để thành 1: thiếu 1/${n} và thiếu 1/${m}. Vì 1/${m} < 1/${n}, nên ${m - 1}/${m} gần 1 hơn → lớn hơn.`,
  }
}

export const phanSo: Lesson = {
  id: 'phan-so',
  skillId: 'th.phan-so',
  title: 'Phân số',
  emoji: '🍕',
  hook: {
    text: 'Chia 1 chiếc pizza: cho 3 bạn hay cho 8 bạn thì mỗi bạn được nhiều hơn? Thế mà nhiều người nghĩ 1/8 lớn hơn 1/3 vì 8 > 3!',
    visual: <span className="hook-emoji">🍕🤔</span>,
  },
  explore: { intro: 'Kéo thanh trượt để chia thanh thành nhiều phần bằng nhau, chạm vào từng phần để tô màu.', Component: FractionExplore },
  essence: {
    bigIdea: 'a/b nghĩa là: chia thành b phần BẰNG NHAU, lấy a phần.',
    points: [
      '⚖️ Các phần phải bằng nhau — không đều thì không phải phân số.',
      '⬇️ Mẫu số cho biết KÍCH THƯỚC mỗi phần: mẫu càng lớn, mỗi phần càng nhỏ.',
      '⬆️ Tử số cho biết SỐ phần được lấy.',
      '✂️ Cắt mỗi phần nhỏ đi k lần (nhân cả tử và mẫu với k) thì lượng không đổi → phân số bằng nhau.',
    ],
    analogy: 'Mẫu số là "cái thước" — tử số là "đếm được bao nhiêu lần cái thước ấy".',
  },
  practice,
  teachBack: {
    prompt: 'Vì sao 1/3 lớn hơn 1/5? Ai giải thích đúng?',
    options: [
      { who: '🐼 Gấu trúc', text: 'Vì 3 nhỏ hơn 5, số nhỏ hơn thì phân số lớn hơn.', correct: false, feedback: 'Đúng kết quả nhưng sai lý do: 2/3 và 4/5 thì sao? Lý do thật là kích thước mỗi phần.' },
      { who: '🦁 Sư tử', text: 'Chia một cái thành 3 phần bằng nhau thì mỗi phần to hơn chia thành 5 phần, mà ta cùng lấy 1 phần.', correct: true, feedback: 'Chuẩn bản chất! Mẫu số quyết định kích thước mỗi phần.' },
      { who: '🐵 Khỉ', text: 'Vì 1/3 = 0,3 còn 1/5 = 0,5.', correct: false, feedback: '1/5 = 0,2 chứ không phải 0,5. Đừng ghép số một cách máy móc!' },
    ],
    ownWordsHint: 'Ví dụ: Mẫu số cho biết…',
  },
  remember: ['Các phần phải bằng nhau', 'Mẫu số = chia mấy phần (kích thước mỗi phần)', 'Tử số = lấy mấy phần', 'Nhân cả tử và mẫu cùng số → giá trị không đổi'],
}

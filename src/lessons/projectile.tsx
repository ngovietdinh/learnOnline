// Chuyển động ném (Vật lí 10). Bản chất: tách thành hai chuyển động độc lập — ngang đều, đứng biến đổi đều.
import { useEffect, useRef, useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { pick, shuffle, type Rng } from '../core/rng'
import { sfx } from '../core/sound'
import { choicesFrom, vn } from './helpers'

const G = 10
const XMAX = 95
const YMAX = 50

interface Shot {
  v: number
  deg: number
}

const flight = ({ v, deg }: Shot) => {
  const r = (deg * Math.PI) / 180
  const vx = v * Math.cos(r)
  const vy = v * Math.sin(r)
  const T = (2 * vy) / G
  return { vx, vy, T, H: (vy * vy) / (2 * G), L: vx * T }
}

function useClock(running: boolean, until: number, speed: number, onEnd: () => void) {
  const [t, setT] = useState(0)
  const endRef = useRef(onEnd)
  endRef.current = onEnd
  useEffect(() => {
    if (!running) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const tt = Math.min(until, ((now - t0) / 1000) * speed)
      setT(tt)
      if (tt >= until) endRef.current()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, until, speed])
  return [t, setT] as const
}

const toSvg = (x: number, y: number) => ({ x, y: YMAX - y })

function trajPath(s: Shot, upTo?: number) {
  const { vx, vy, T } = flight(s)
  const end = upTo ?? T
  const pts: string[] = []
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * end
    const p = toSvg(vx * t, vy * t - (G * t * t) / 2)
    pts.push(`${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
  }
  return pts.join(' ')
}

function ObliqueLab({ onShot }: { onShot: (s: Shot) => void }) {
  const [v, setV] = useState(22)
  const [deg, setDeg] = useState(45)
  const [shot, setShot] = useState<Shot | null>(null)
  const [history, setHistory] = useState<Shot[]>([])
  const [running, setRunning] = useState(false)
  const f = shot ? flight(shot) : null
  const [t, setT] = useClock(running, f?.T ?? 0, 1.6, () => {
    setRunning(false)
    sfx.pop()
    if (shot) {
      setHistory((h) => [...h.slice(-3), shot])
      onShot(shot)
    }
  })

  const launch = () => {
    const s = { v, deg }
    setShot(s)
    setT(0)
    setRunning(true)
    sfx.tap()
  }

  const pos = shot && f ? { x: f.vx * t, y: f.vy * t - (G * t * t) / 2 } : null
  const vyNow = f ? f.vy - G * t : 0
  const marks = f ? Array.from({ length: Math.floor(t / 0.5) + 1 }, (_, i) => i * 0.5) : []
  const preview = flight({ v, deg })

  return (
    <div className="panel">
      <svg viewBox={`-4 -2 ${XMAX + 6} ${YMAX + 8}`} className="proj-svg" role="img" aria-label="Mô phỏng ném xiên">
        <rect x={-4} y={YMAX} width={XMAX + 6} height={8} className="ground" />
        {Array.from({ length: 10 }, (_, i) => (
          <text key={i} x={i * 10} y={YMAX + 4} className="tick-label" textAnchor="middle">
            {i * 10}
          </text>
        ))}
        {history.map((h, i) => (
          <g key={i} opacity={0.25 + i * 0.12}>
            <path d={trajPath(h)} className="old-traj" />
            <text x={flight(h).L} y={YMAX - 1} className="tick-label" textAnchor="middle">
              {h.deg}°
            </text>
          </g>
        ))}
        {shot && <path d={trajPath(shot, t)} className="traj" />}
        {f &&
          marks.map((m) => {
            const p = toSvg(f.vx * m, f.vy * m - (G * m * m) / 2)
            return (
              <g key={m}>
                <circle cx={p.x} cy={p.y} r={0.6} className="time-dot" />
                <line x1={p.x} y1={p.y} x2={p.x} y2={YMAX} className="drop-line" />
                <circle cx={p.x} cy={YMAX} r={0.55} className="shadow-x" />
                <circle cx={-2} cy={p.y} r={0.55} className="shadow-y" />
              </g>
            )
          })}
        {pos && f && (
          <g>
            {(() => {
              const p = toSvg(pos.x, pos.y)
              const k = 0.5
              return (
                <>
                  <line x1={p.x} y1={p.y} x2={p.x + f.vx * k} y2={p.y} className="vec vx" />
                  <line x1={p.x} y1={p.y} x2={p.x} y2={p.y - vyNow * k} className="vec vy" />
                  <circle cx={p.x} cy={p.y} r={1.3} className="ball" />
                </>
              )
            })()}
          </g>
        )}
      </svg>
      <div className="slider-row">
        <label htmlFor="pv">Vận tốc v₀</label>
        <input id="pv" type="range" min={8} max={30} value={v} onChange={(e) => setV(+e.target.value)} disabled={running} />
        <b>{v} m/s</b>
      </div>
      <div className="slider-row">
        <label htmlFor="pd">Góc ném α</label>
        <input id="pd" type="range" min={10} max={80} step={5} value={deg} onChange={(e) => setDeg(+e.target.value)} disabled={running} />
        <b>{deg}°</b>
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={launch} disabled={running}>
          🚀 Ném!
        </button>
      </div>
      <div className="facts small">
        <div>
          <span>
            <i className="lg vx" /> vₓ = v₀cosα
          </span>
          <b>{vn(preview.vx, 1)} m/s — không đổi</b>
        </div>
        <div>
          <span>
            <i className="lg vy" /> v<sub>y</sub> = v₀sinα − gt
          </span>
          <b>{f ? `${vn(vyNow, 1)} m/s lúc t = ${vn(t, 1)} s` : `${vn(preview.vy, 1)} m/s lúc ném`}</b>
        </div>
        <div>
          <span>Thời gian bay T = 2v₀sinα/g</span>
          <b>{vn(preview.T, 2)} s</b>
        </div>
        <div>
          <span>Tầm xa L = v₀²sin2α/g</span>
          <b>{vn(preview.L, 1)} m</b>
        </div>
      </div>
      <p className="muted">
        Các chấm cách nhau 0,5 s. Bóng trên mặt đất <i className="lg shx" /> cách đều nhau (chuyển động đều); bóng trên trục đứng <i className="lg shy" /> chậm dần khi lên, nhanh dần khi xuống.
      </p>
    </div>
  )
}

function DropLab({ onDone }: { onDone: () => void }) {
  const h = 45
  const T = Math.sqrt((2 * h) / G)
  const [v, setV] = useState(10)
  const [running, setRunning] = useState(false)
  const [t, setT] = useClock(running, T, 1.2, () => {
    setRunning(false)
    sfx.correct()
    onDone()
  })
  const y = h - (G * t * t) / 2
  const a = toSvg(4, y)
  const b = toSvg(4 + v * t, y)
  return (
    <div className="panel">
      <svg viewBox={`-4 -2 ${XMAX + 6} ${YMAX + 8}`} className="proj-svg" role="img" aria-label="Thả rơi và ném ngang cùng lúc">
        <rect x={-4} y={YMAX} width={XMAX + 6} height={8} className="ground" />
        <rect x={0} y={YMAX - h} width={4} height={h} className="tower" />
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="same-height" />
        <circle cx={a.x} cy={a.y} r={1.3} className="ball drop" />
        <circle cx={b.x} cy={b.y} r={1.3} className="ball" />
        <text x={b.x + 2} y={b.y - 2} className="tick-label">
          t = {vn(t, 2)} s
        </text>
      </svg>
      <div className="slider-row">
        <label htmlFor="dv">Ném ngang v₀</label>
        <input id="dv" type="range" min={0} max={30} value={v} onChange={(e) => setV(+e.target.value)} disabled={running} />
        <b>{v} m/s</b>
      </div>
      <div className="btn-row">
        <button
          className="btn btn-primary"
          disabled={running}
          onClick={() => {
            setT(0)
            setRunning(true)
            sfx.tap()
          }}
        >
          ▶️ Thả 🔴 và ném 🟣 cùng lúc
        </button>
      </div>
      <p className="note">
        Hai viên luôn ở <b>cùng độ cao</b> và chạm đất cùng lúc sau t = √(2h/g) = {vn(T, 0)} s — dù ném nhanh hay chậm. Chuyển động ngang không ảnh hưởng chuyển động rơi!
      </p>
    </div>
  )
}

function ProjectileExplore({ onDiscover, say }: ExploreProps) {
  const [tab, setTab] = useState<'xien' | 'ngang'>('xien')
  const [angles, setAngles] = useState(new Set<number>())
  const [dropDone, setDropDone] = useState(false)
  const ready = angles.size >= 2 && dropDone
  return (
    <div className="proj-explore">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'xien'} className={tab === 'xien' ? 'on' : ''} onClick={() => setTab('xien')}>
          ① Ném xiên
        </button>
        <button role="tab" aria-selected={tab === 'ngang'} className={tab === 'ngang' ? 'on' : ''} onClick={() => setTab('ngang')}>
          ② Ném ngang vs rơi tự do
        </button>
      </div>
      {tab === 'xien' ? (
        <ObliqueLab
          onShot={(s) => {
            const next = new Set(angles).add(s.deg)
            setAngles(next)
            if (next.size === 2) say('Thử thêm góc 30 độ và 60 độ với cùng vận tốc — xem tầm xa thế nào!')
          }}
        />
      ) : (
        <DropLab
          onDone={() => {
            setDropDone(true)
            say('Cùng chạm đất! Chuyển động ngang và chuyển động rơi độc lập với nhau.')
          }}
        />
      )}
      {ready ? (
        <div className="row-center">
          <button className="btn btn-primary" onClick={onDiscover}>
            Mình thấy bản chất rồi ➜
          </button>
        </div>
      ) : (
        <p className="muted center">
          Ném ít nhất 2 góc khác nhau ở ① {angles.size >= 2 ? '✔' : ''} và chạy thí nghiệm ② {dropDone ? '✔' : ''}.
        </p>
      )}
    </div>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  if (level === 1) {
    return {
      level,
      prompt: 'Một quả bóng được ném xiên lên (bỏ qua sức cản không khí). Tại điểm cao nhất, vận tốc của bóng như thế nào?',
      layout: 'list',
      choices: shuffle(rng, [
        { label: 'Chỉ còn thành phần nằm ngang, khác 0', correct: true },
        { label: 'Bằng 0', misconception: 'dinh-v-bang-0', why: 'Chỉ thành phần THẲNG ĐỨNG bằng 0. Thành phần ngang vẫn giữ nguyên v₀cosα — bóng vẫn bay tới trước!' },
        { label: 'Chỉ còn thành phần thẳng đứng', misconception: 'nham-thanh-phan', why: 'Ngược lại: ở đỉnh, vận tốc đứng bằng 0, chỉ còn vận tốc ngang.' },
        { label: 'Lớn nhất', misconception: 'dinh-v-max', why: 'Ở đỉnh tốc độ là NHỎ nhất (chỉ còn vₓ), vì vy = 0.' },
      ]),
      explain: 'Theo phương ngang không có lực → vₓ = v₀cosα không đổi. Ở đỉnh vy = 0, nên v = vₓ ≠ 0.',
    }
  }
  if (level === 2) {
    if (rng() < 0.5) {
      return {
        level,
        prompt: 'Ném cùng vận tốc ban đầu, bỏ qua sức cản. Ném với góc 30° và 60° thì tầm xa thế nào?',
        layout: 'list',
        choices: shuffle(rng, [
          { label: 'Bằng nhau', correct: true },
          { label: 'Góc 60° xa hơn', misconception: 'goc-lon-xa-hon', why: '60° bay cao và lâu hơn nhưng vận tốc ngang nhỏ hơn — hai hiệu ứng bù trừ đúng bằng nhau.' },
          { label: 'Góc 30° xa hơn', misconception: 'goc-nho-xa-hon', why: '30° có vₓ lớn hơn nhưng bay ngắn thời gian hơn — bù trừ đúng bằng nhau.' },
        ]),
        explain: 'L = v₀²·sin2α/g; sin60° = sin120° nên α và 90° − α cho cùng tầm xa.',
      }
    }
    return {
      level,
      prompt: 'Cùng vận tốc ban đầu, bỏ qua sức cản, góc ném nào cho tầm xa lớn nhất?',
      choices: shuffle(rng, [
        { label: '45°', correct: true },
        { label: '60°', misconception: 'goc-lon-xa-hon', why: 'Cao hơn thì lâu hơn, nhưng vận tốc ngang giảm mạnh.' },
        { label: '30°', misconception: 'goc-nho-xa-hon', why: 'Nhanh theo phương ngang nhưng rơi xuống quá sớm.' },
        { label: '90°', misconception: 'cang-cao-cang-xa', why: 'Ném thẳng đứng thì vₓ = 0 — rơi lại ngay chỗ cũ!' },
      ]),
      explain: 'L = v₀²·sin2α/g lớn nhất khi sin2α = 1 ⇔ α = 45°: cân bằng giữa "bay lâu" và "đi nhanh theo phương ngang".',
    }
  }
  if (level === 3) {
    const v = pick(rng, [10, 20, 30])
    if (rng() < 0.5) {
      const T = v / G // α = 30°: T = 2v·0,5/g
      return {
        level,
        prompt: `Ném xiên một vật với v₀ = ${v} m/s, góc α = 30°, g = 10 m/s². Thời gian bay là bao nhiêu?`,
        choices: choicesFrom(
          rng,
          T,
          [
            { value: T / 2, misconception: 'chi-tinh-luot-len', why: 'Đó là thời gian bay LÊN tới đỉnh. Thời gian bay gồm cả lượt lên và lượt xuống.' },
            { value: (2 * v) / G, misconception: 'quen-sin', why: 'Chỉ thành phần thẳng đứng v₀sinα quyết định thời gian bay.' },
            { value: vnNum((2 * v * Math.cos(Math.PI / 6)) / G), misconception: 'nham-cos', why: 'Thời gian bay do chuyển động THẲNG ĐỨNG quyết định → dùng sinα.' },
          ],
          { format: (x) => `${vn(Number(x))} s` },
        ),
        explain: `vy0 = v₀sin30° = ${v / 2} m/s. Lên tới đỉnh mất ${v / 2}/10 = ${vn(T / 2)} s, xuống mất bằng chừng ấy → T = ${vn(T)} s.`,
      }
    }
    const L = (v * v) / G
    return {
      level,
      prompt: `Ném xiên với v₀ = ${v} m/s, α = 45°, g = 10 m/s². Tầm xa là bao nhiêu?`,
      choices: choicesFrom(
        rng,
        L,
        [
          { value: L / 2, misconception: 'nham-cong-thuc', why: 'L = v₀²sin2α/g; sin90° = 1, không phải 1/2.' },
          { value: 2 * L, misconception: 'nham-cong-thuc', why: 'Kiểm tra lại: L = vₓ·T = (v₀cosα)(2v₀sinα/g).' },
          { value: v / G, misconception: 'quen-binh-phuong', why: 'Đơn vị sai: (m/s)/(m/s²) = s, không phải mét.' },
        ],
        { format: (x) => `${vn(Number(x))} m` },
      ),
      explain: `L = vₓ·T = v₀cos45° · 2v₀sin45°/g = v₀²/g = ${v * v}/10 = ${L} m.`,
    }
  }
  const h = pick(rng, [5, 20, 45, 80])
  const v = pick(rng, [5, 10, 15, 20])
  const t = Math.sqrt((2 * h) / G)
  return {
    level,
    prompt: `Từ độ cao ${h} m, ném ngang một hòn đá với v₀ = ${v} m/s (g = 10 m/s², bỏ qua sức cản). Sau bao lâu hòn đá chạm đất?`,
    choices: choicesFrom(
      rng,
      t,
      [
        { value: vnNum(h / v), misconception: 'v-ngang-anh-huong-roi', why: 'Vận tốc ngang KHÔNG ảnh hưởng thời gian rơi. Chỉ độ cao và g quyết định.' },
        { value: vnNum(t + v / G), misconception: 'v-ngang-anh-huong-roi', why: 'Ném nhanh hơn không làm rơi lâu hơn — hai chuyển động độc lập.' },
        { value: vnNum((2 * h) / G), misconception: 'quen-can', why: 'h = gt²/2 → t = √(2h/g). Đừng quên lấy căn.' },
      ],
      { format: (x) => `${vn(Number(x))} s`, fill: (i) => t + (i % 2 ? 1 : -0.5) * Math.ceil(i / 2) },
    ),
    explain: `Theo phương đứng, hòn đá rơi y hệt khi thả rơi tự do: h = gt²/2 → t = √(2·${h}/10) = ${vn(t)} s. Không phụ thuộc v₀ = ${v} m/s. Tầm xa: L = v₀t = ${vn(v * t)} m.`,
  }
}

function vnNum(x: number) {
  return Math.round(x * 100) / 100
}

export const nemXien: Lesson = {
  id: 'nem-xien',
  skillId: 'thpt.nem-xien',
  title: 'Chuyển động ném',
  emoji: '🏀',
  hook: {
    text: 'Bắn một viên đạn nằm ngang và thả rơi một viên đạn khác cùng lúc, cùng độ cao. Viên nào chạm đất trước? Đa số người lớn trả lời sai!',
    visual: <span className="hook-emoji">🔫💨 vs ✋⬇️</span>,
  },
  explore: { intro: 'Ném bóng với các góc khác nhau và quan sát bóng của nó trên hai trục. Rồi làm thí nghiệm ném ngang vs rơi tự do.', Component: ProjectileExplore },
  essence: {
    bigIdea: 'Ném = hai chuyển động độc lập chạy cùng một đồng hồ: ngang thẳng đều, đứng như ném lên thẳng đứng.',
    points: [
      '➡️ Phương ngang: không có lực → vₓ = v₀cosα không đổi → x = vₓt (các chấm cách đều).',
      '⬆️ Phương đứng: chỉ có trọng lực → vy = v₀sinα − gt, y = v₀sinα·t − gt²/2.',
      '⏱️ Thời gian bay do phương ĐỨNG quyết định; tầm xa = vₓ × thời gian bay.',
      '🪂 Ném ngang và thả rơi từ cùng độ cao chạm đất cùng lúc.',
      '📈 Khử t giữa x và y → quỹ đạo là một parabol (gắn với bài hàm bậc hai).',
    ],
    analogy: 'Như hai diễn viên trên hai sân khấu (ngang & đứng) diễn theo cùng một nhịp đồng hồ, không ai can thiệp vào ai.',
  },
  practice,
  teachBack: {
    prompt: 'Vì sao viên đạn bắn ngang và viên đạn thả rơi (cùng độ cao, cùng lúc) chạm đất cùng lúc?',
    options: [
      { who: '🐘 Voi', text: 'Vì viên đạn bắn ngang bay nhanh nên được không khí đỡ, rơi chậm lại bằng viên kia.', correct: false, feedback: 'Ta đã bỏ qua sức cản. Lý do thật là hai chuyển động độc lập.' },
      { who: '🐆 Báo', text: 'Theo phương đứng, cả hai đều bắt đầu với vy = 0 và chỉ chịu trọng lực như nhau, nên rơi y hệt nhau. Vận tốc ngang không ảnh hưởng phương đứng.', correct: true, feedback: 'Hoàn hảo: tách phương và nhận ra hai viên có chuyển động đứng giống hệt nhau.' },
      { who: '🦜 Vẹt', text: 'Vì vật nặng như nhau thì rơi như nhau.', correct: false, feedback: 'Khối lượng không phải điểm mấu chốt ở đây — vận tốc ngang mới là thứ cần giải thích.' },
    ],
    ownWordsHint: 'Ví dụ: Ta tách chuyển động thành…',
  },
  remember: ['Tách 2 phương độc lập, chung thời gian t', 'Ngang: vₓ không đổi', 'Đứng: như ném lên, a = −g', 'Thời gian bay do phương đứng quyết định', 'α và 90° − α: cùng tầm xa; 45° xa nhất'],
}

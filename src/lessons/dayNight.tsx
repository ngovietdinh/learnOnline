// Vì sao có ngày và đêm (TN&XH 3). Bản chất: Trái Đất tự quay; nửa hướng về Mặt Trời là ngày.
import { useEffect, useId, useRef, useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { int, pick, shuffle, type Rng } from '../core/rng'
import { sfx } from '../core/sound'

const CX = 330
const CY = 150
const R = 92

/** Giờ địa phương (0–24) → góc trên hình (Mặt Trời ở bên trái, Trái Đất quay ngược chiều kim đồng hồ). */
function pos(hour: number, r = R) {
  const b = ((hour / 24) * 360 * Math.PI) / 180
  return { x: CX + r * Math.cos(b), y: CY - r * Math.sin(b) }
}

export function partOfDay(hour: number): { name: string; icon: string; day: boolean } {
  const h = ((hour % 24) + 24) % 24
  if (h >= 5 && h < 7) return { name: 'Bình minh', icon: '🌅', day: true }
  if (h >= 7 && h < 17) return { name: 'Ban ngày', icon: '☀️', day: true }
  if (h >= 17 && h < 19) return { name: 'Hoàng hôn', icon: '🌇', day: true }
  return { name: 'Ban đêm', icon: '🌙', day: false }
}

export function Earth({ hour, markers = true, small }: { hour: number; markers?: boolean; small?: boolean }) {
  const vn = pos(hour, R + 2)
  const us = pos(hour + 12, R + 2)
  const rot = -(hour / 24) * 360
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 460 300" className={`earth-svg ${small ? 'small' : ''}`} role="img" aria-label="Mặt Trời chiếu sáng Trái Đất">
      <defs>
        <radialGradient id={`sun${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7c2" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>
        <radialGradient id={`sea${uid}`} cx="35%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <clipPath id={`earthClip${uid}`}>
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>
      {/* Tia sáng song song từ Mặt Trời */}
      {[-70, -35, 0, 35, 70].map((dy) => (
        <line key={dy} x1={100} y1={CY + dy} x2={CX - 40} y2={CY + dy} className="ray" />
      ))}
      <circle cx={50} cy={CY} r={62} className="sun-halo" />
      <circle cx={50} cy={CY} r={48} fill={`url(#sun${uid})`} />
      <g clipPath={`url(#earthClip${uid})`}>
        <circle cx={CX} cy={CY} r={R} fill={`url(#sea${uid})`} />
        <g transform={`rotate(${rot} ${CX} ${CY})`}>
          <path d={`M${CX - 20},${CY - 85} q30,10 25,40 q-20,20 5,40 q15,25 -10,45 q-30,-5 -35,-40 q-5,-40 15,-85z`} fill="#22c55e" />
          <path d={`M${CX + 40},${CY - 30} q35,0 40,30 q-10,35 -40,30 q-15,-30 0,-60z`} fill="#16a34a" />
          <path d={`M${CX - 75},${CY + 20} q20,-15 35,5 q0,25 -25,25 q-15,-10 -10,-30z`} fill="#4ade80" />
        </g>
        {/* Nửa không được chiếu sáng (bên phải) */}
        <rect x={CX} y={CY - R} width={R} height={R * 2} fill="#020617" opacity={0.62} />
        <rect x={CX - 6} y={CY - R} width={12} height={R * 2} fill="#020617" opacity={0.25} />
      </g>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#93c5fd" strokeWidth={2} />
      {markers && (
        <>
          <text x={vn.x} y={vn.y} className="marker" textAnchor="middle" dominantBaseline="middle">🏠</text>
          {!small && (
            <text x={us.x} y={us.y} className="marker small" textAnchor="middle" dominantBaseline="middle">🗽</text>
          )}
        </>
      )}
      {!small && (
        <>
          <text x={CX - R + 10} y={CY + R + 26} className="svg-label">Ngày</text>
          <text x={CX + R - 40} y={CY + R + 26} className="svg-label">Đêm</text>
        </>
      )}
    </svg>
  )
}

function Sky({ hour }: { hour: number }) {
  const p = partOfDay(hour)
  return (
    <div className={`sky ${p.day ? 'day' : 'night'} ${p.name === 'Bình minh' || p.name === 'Hoàng hôn' ? 'dusk' : ''}`}>
      <span className="sky-icon">{p.icon}</span>
      <span className="sky-text">
        Ở nhà em 🏠: <b>{p.name}</b> · {String(Math.floor(hour) % 24).padStart(2, '0')}:00
      </span>
    </div>
  )
}

function DayNightExplore({ onDiscover, say }: ExploreProps) {
  const [hour, setHour] = useState(8)
  const [playing, setPlaying] = useState(false)
  const [stopped, setStopped] = useState(false)
  const travelled = useRef(0)
  const [done, setDone] = useState(false)
  const doneRef = useRef(false)
  const last = useRef(partOfDay(8).day)

  const advance = (dh: number) => {
    travelled.current += Math.abs(dh)
    setHour((h) => {
      const nh = (h + dh + 24) % 24
      const d = partOfDay(nh).day
      if (d !== last.current) {
        last.current = d
        sfx.tap()
      }
      return nh
    })
    if (!doneRef.current && travelled.current >= 24) {
      doneRef.current = true
      setDone(true)
      say('Trái Đất quay đủ một vòng là một ngày đêm, khoảng 24 giờ!')
    }
  }

  useEffect(() => {
    if (!playing || stopped) return
    const t = setInterval(() => advance(0.25), 60)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stopped])

  return (
    <div className="dn-explore">
      <Sky hour={hour} />
      <Earth hour={hour} />
      <div className="panel">
        <div className="slider-row">
          <label htmlFor="h">Quay Trái Đất</label>
          <input
            id="h"
            type="range"
            min={0}
            max={23.75}
            step={0.25}
            value={hour}
            disabled={stopped}
            onChange={(e) => advance(Number(e.target.value) - hour)}
          />
          <b>{String(Math.floor(hour) % 24).padStart(2, '0')}:00</b>
        </div>
        <div className="btn-row">
          <button className="btn" onClick={() => setPlaying(!playing)} disabled={stopped}>
            {playing ? '⏸ Dừng xem' : '▶️ Cho Trái Đất quay'}
          </button>
          <button
            className={`btn ${stopped ? 'btn-warn' : ''}`}
            onClick={() => {
              setStopped(!stopped)
              if (!stopped) say('Nếu Trái Đất ngừng quay, nhà em sẽ mãi mãi là ban ngày, còn bên kia mãi là ban đêm!')
            }}
          >
            {stopped ? '🔄 Cho quay lại' : '🛑 Nếu Trái Đất ngừng quay?'}
          </button>
        </div>
        {stopped && (
          <p className="note warn">
            Trái Đất ngừng quay → nơi em ở lúc nào cũng là <b>{partOfDay(hour).name.toLowerCase()}</b>. Không còn ngày đêm luân phiên! Vậy ngày và đêm có
            là do Trái Đất <b>tự quay</b>.
          </p>
        )}
        <p className="muted">
          🗽 là nước Mỹ — nằm gần phía bên kia Trái Đất. Lúc này nhà em là {partOfDay(hour).name.toLowerCase()}, còn ở đó là{' '}
          {partOfDay(hour + 12).name.toLowerCase()}.
        </p>
      </div>
      {done && (
        <div className="row-center">
          <button className="btn btn-primary" onClick={onDiscover}>
            Mình hiểu vì sao rồi ➜
          </button>
        </div>
      )}
    </div>
  )
}

function practice(level: 1 | 2 | 3 | 4, rng: Rng): Question {
  if (level === 1) {
    const day = rng() < 0.5
    const hour = day ? int(rng, 9, 15) : pick(rng, [21, 22, 23, 0, 1, 2, 3])
    return {
      level,
      prompt: 'Ngôi nhà 🏠 đang ở phía nào? Lúc đó là ban ngày hay ban đêm?',
      visual: <Earth hour={hour} small />,
      choices: shuffle(rng, [
        { label: '☀️ Ban ngày', correct: day, misconception: day ? undefined : 'khong-nhin-phia', why: day ? undefined : 'Ngôi nhà ở nửa tối — quay lưng lại Mặt Trời.' },
        { label: '🌙 Ban đêm', correct: !day, misconception: day ? 'khong-nhin-phia' : undefined, why: day ? 'Ngôi nhà ở nửa sáng — đang hướng về Mặt Trời.' : undefined },
      ]),
      explain: day ? 'Ngôi nhà ở nửa được Mặt Trời chiếu sáng → ban ngày.' : 'Ngôi nhà ở nửa khuất ánh sáng → ban đêm.',
    }
  }
  if (level === 2) {
    return {
      level,
      prompt: 'Vì sao có ngày và đêm?',
      choices: shuffle(rng, [
        { label: 'Vì Trái Đất tự quay quanh mình nó', correct: true },
        { label: 'Vì Mặt Trời đi vòng quanh Trái Đất mỗi ngày', misconception: 'dia-tam', why: 'Ta THẤY Mặt Trời như đang di chuyển, nhưng thật ra chính Trái Đất đang quay — như ngồi trên xe thấy cây cối chạy lùi.' },
        { label: 'Vì Trái Đất quay quanh Mặt Trời', misconception: 'nham-cong-chuyen', why: 'Trái Đất quay quanh Mặt Trời mất 1 NĂM (tạo ra các mùa), không phải 1 ngày.' },
        { label: 'Vì buổi tối Mặt Trời tắt đi', misconception: 'mat-troi-tat', why: 'Mặt Trời luôn sáng! Lúc mình là đêm thì phía bên kia Trái Đất đang là ngày.' },
      ]),
      explain: 'Mặt Trời chỉ chiếu sáng được một nửa Trái Đất. Trái Đất tự quay nên mỗi nơi lần lượt đi vào nửa sáng (ngày) rồi nửa tối (đêm).',
    }
  }
  if (rng() < 0.5) {
    return {
      level,
      prompt: 'Ở Việt Nam đang là buổi trưa. Ở nơi nằm phía đối diện trên Trái Đất (gần nước Mỹ) đang là lúc nào?',
      visual: <Earth hour={12} />,
      choices: shuffle(rng, [
        { label: 'Ban đêm', correct: true },
        { label: 'Cũng là buổi trưa', misconception: 'ca-the-gioi-cung-gio', why: 'Mặt Trời chỉ chiếu được một nửa Trái Đất cùng lúc, không phải cả quả cầu.' },
        { label: 'Không có thời gian nào cả', misconception: 'khong-hieu', why: 'Mọi nơi trên Trái Đất đều đang ở nửa sáng hoặc nửa tối.' },
      ]),
      explain: 'Phía đối diện đang ở nửa khuất ánh sáng → ban đêm. Lúc nào cũng có một nửa Trái Đất là ngày, một nửa là đêm.',
    }
  }
  return {
    level,
    prompt: 'Trái Đất tự quay hết một vòng mất khoảng bao lâu?',
    choices: shuffle(rng, [
      { label: 'Khoảng 24 giờ (một ngày đêm)', correct: true },
      { label: 'Khoảng 12 giờ', misconception: 'chi-ban-ngay', why: '12 giờ chỉ là khoảng nửa vòng — ngày HOẶC đêm. Một vòng gồm cả ngày lẫn đêm.' },
      { label: 'Khoảng 1 năm', misconception: 'nham-cong-chuyen', why: '1 năm là thời gian Trái Đất đi hết một vòng QUANH Mặt Trời.' },
      { label: 'Khoảng 1 tháng', misconception: 'nham-mat-trang', why: 'Khoảng 1 tháng là chu kỳ của Mặt Trăng.' },
    ]),
    explain: 'Mỗi vòng tự quay = một ngày đêm ≈ 24 giờ. Vì thế một ngày có 24 giờ!',
  }
}

export const ngayDem: Lesson = {
  id: 'ngay-dem',
  skillId: 'th.ngay-dem',
  title: 'Vì sao có ngày và đêm?',
  emoji: '🌗',
  hook: {
    text: 'Mỗi sáng Mặt Trời "mọc" ở phía đông, chiều "lặn" ở phía tây. Có phải Mặt Trời đang chạy vòng quanh chúng ta không?',
    visual: <span className="hook-emoji">🌅➡️🌇</span>,
  },
  explore: { intro: 'Kéo thanh trượt để quay Trái Đất. Theo dõi ngôi nhà 🏠 đi qua nửa sáng và nửa tối.', Component: DayNightExplore },
  essence: {
    bigIdea: 'Trái Đất tự quay. Nửa hướng về Mặt Trời là ngày, nửa kia là đêm.',
    points: [
      '🌍 Trái Đất hình cầu nên Mặt Trời chỉ chiếu sáng được MỘT NỬA cùng lúc.',
      '🔄 Trái Đất tự quay quanh mình nó, mỗi vòng khoảng 24 giờ → mỗi nơi lần lượt có ngày rồi đêm.',
      '👀 Ta thấy Mặt Trời "mọc – lặn" vì chính ta đang quay cùng Trái Đất.',
    ],
    analogy: 'Ngồi trên đu quay, em thấy cây cối quay quanh em — nhưng thật ra là em đang quay.',
  },
  practice,
  teachBack: {
    prompt: 'Em gái hỏi: "Tối rồi, Mặt Trời đi ngủ hả anh/chị?" Câu trả lời nào giải thích đúng nhất?',
    options: [
      { who: '🐯 Hổ', text: 'Đúng rồi, tối Mặt Trời tắt, sáng mai bật lại.', correct: false, feedback: 'Mặt Trời không bao giờ tắt — nó đang chiếu sáng nửa bên kia Trái Đất.' },
      { who: '🐨 Koala', text: 'Mặt Trời vẫn sáng, nhưng Trái Đất quay nên chỗ mình đã quay sang nửa không có ánh sáng.', correct: true, feedback: 'Tuyệt vời — đúng bản chất: chỗ mình quay khỏi phía Mặt Trời.' },
      { who: '🦒 Hươu', text: 'Mặt Trời chạy ra sau núi để nghỉ.', correct: false, feedback: 'Đó chỉ là cảm giác khi nhìn. Mặt Trời gần như đứng yên, Trái Đất mới là thứ quay.' },
    ],
    ownWordsHint: 'Ví dụ: Ngày và đêm xảy ra vì…',
  },
  remember: ['Mặt Trời chỉ chiếu sáng một nửa Trái Đất', 'Trái Đất tự quay ~24 giờ một vòng', 'Ta quay cùng Trái Đất nên thấy Mặt Trời mọc – lặn'],
}

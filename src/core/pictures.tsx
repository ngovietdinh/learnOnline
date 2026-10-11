// Bé mầm non chưa biết chữ: mọi đáp án bằng chữ được đổi thành HÌNH (thú bông cùng một phong cách),
// con số thành số to kèm chấm tròn để bé đếm; cô vẫn đọc to. Bé chọn bằng mắt và tai, không cần đọc.
import type { ReactNode } from 'react'
import type { Choice, Question } from '../lessons/types'

/** Từ/cụm từ → hình. Thêm từ mới ở đây; hình lấy từ phông thú bông (scripts/may-thu-bong). */
const WORD_PIC: Record<string, string> = {
  // phương tiện
  'tàu hỏa': '🚂', 'máy bay': '✈️', 'ô tô': '🚗', 'xe cứu hỏa': '🚒', 'xe đạp': '🚲', 'con thuyền': '⛵',
  // vị trí
  'ở trên': '⬆️', 'ở dưới': '⬇️', 'bên trái': '⬅️', 'bên phải': '➡️', 'hàng trên': '⬆️', 'hàng dưới': '⬇️', 'bằng nhau': '🟰',
  // buổi trong ngày
  'buổi sáng': '🌅', 'buổi trưa': '☀️', 'buổi chiều': '🌇', 'buổi tối': '🌙',
  // nơi sống, con vật
  'trên cạn': '🌳', 'dưới nước': '🌊', 'con chó': '🐶', 'con gà': '🐔', 'con thỏ': '🐰', 'con cá vàng': '🐠', 'con tôm': '🦐', 'con cua biển': '🦀',
  // cảm xúc, hành động
  vui: '😊', buồn: '😢', 'sợ hãi': '😨', 'ném đồ chơi': '👊', 'đánh bạn': '👊', 'hít thật sâu, đếm đến năm': '😌',
  // an toàn
  'không được': '❌', được: '✅', 'gấu bông': '🧸', 'con dao': '🔪', 'bật lửa': '🔥', 'bỏ vào miệng': '👄', 'cất vào túi': '🎒',
  'đưa cho bố mẹ': '👨‍👩‍👧', 'đi cùng người lớn': '👨‍👩‍👧', 'đi một mình': '🧒',
  // quần áo, thời tiết
  mũ: '👒', 'ô che mưa': '☂️', 'áo mưa': '🧥', 'áo ấm': '🧣', 'áo mỏng': '👕', 'áo cộc tay': '👕', 'áo tắm': '🩱',
}

const SHAPE: Record<string, ReactNode> = {
  'hình tròn': <circle cx="50" cy="50" r="38" />,
  'hình vuông': <rect x="14" y="14" width="72" height="72" rx="8" />,
  'hình tam giác': <path d="M50 10 90 86H10Z" strokeLinejoin="round" />,
  'hình chữ nhật': <rect x="6" y="26" width="88" height="50" rx="8" />,
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

function pic(label: string): ReactNode | null {
  const k = norm(label)
  if (SHAPE[k])
    return (
      <span className="pic pic-shape" aria-hidden>
        <svg viewBox="0 0 100 100">{SHAPE[k]}</svg>
      </span>
    )
  if (WORD_PIC[k])
    return (
      <span className="pic" aria-hidden>
        {WORD_PIC[k]}
      </span>
    )
  if (/^\d{1,2}$/.test(k)) {
    const n = Number(k)
    return (
      <span className="pic pic-num" aria-hidden>
        <b>{n}</b>
        {n > 0 && n <= 10 && (
          <i>
            {Array.from({ length: n }, (_, j) => (
              <u key={j} />
            ))}
          </i>
        )}
      </span>
    )
  }
  return null
}

/** Đổi đáp án chữ thành hình (khi có thể). Đổi được hết thì câu hỏi chuyển sang bố cục hình to. */
export function pictureize(q: Question): Question {
  if (q.choices.every((c) => c.visual)) return q
  const choices: Choice[] = q.choices.map((c) => (c.visual ? c : { ...c, visual: pic(c.label) ?? undefined }))
  const all = choices.every((c) => c.visual)
  return { ...q, choices, layout: all ? 'big' : q.layout }
}

/** Mọi đáp án đều là hình (sau khi đổi) — dùng để chọn câu hỏi cho trò chơi của bé. */
export const allPictures = (q: Question) => pictureize(q).choices.every((c) => c.visual)

let pictureMode = false
/** Bật cho bé mầm non (đặt theo giai đoạn tuổi của người học). */
export function setPictureMode(on: boolean) {
  pictureMode = on
}
export const isPictureMode = () => pictureMode
/** Câu hỏi đưa cho bé: bé mầm non thì đổi chữ thành hình. */
export const forChild = (q: Question): Question => (pictureMode ? pictureize(q) : q)

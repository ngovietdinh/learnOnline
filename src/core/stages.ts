// Năm giai đoạn phát triển. Mỗi giai đoạn có quy tắc UI/UX riêng — giao diện "lớn lên" cùng người học.

export type StageId = 'mam' | 'choi' | 'tieuhoc' | 'thcs' | 'thpt'

export interface Stage {
  id: StageId
  name: string
  ages: [number, number]
  grades: string
  mascot: string
  tagline: string
  /** Người học tự đọc được chưa — nếu chưa, mọi chỉ dẫn đều được đọc thành tiếng. */
  readsAlone: boolean
  /** Đọc to lời dẫn mặc định (mọi lứa tuổi đều bật — phụ huynh có thể tắt). */
  narrate: boolean
  /** Nhạc nền hộp nhạc mặc định. */
  music: boolean
  /** Tốc độ và cao độ giọng đọc. */
  voice: { rate: number; pitch: number }
  /** Cấp độ câu hỏi cao nhất trong luyện tập (1 = Nhận biết … 4 = Vận dụng cao). */
  maxLevel: 1 | 2 | 3 | 4
  /** Có bước "Giải thích lại" (tự giảng lại bằng lời) không. */
  teachBack: boolean
  /** Thời lượng một phiên học khuyến nghị (phút) — theo sức tập trung của lứa tuổi. */
  sessionMinutes: number
  /** Kích thước vùng chạm tối thiểu (px). */
  touchTarget: number
  /** Trả lời sai có bị tính không — trẻ nhỏ không bao giờ "thua". */
  gentleErrors: boolean
}

export const STAGES: Stage[] = [
  {
    id: 'mam',
    music: true,
    voice: { rate: 0.85, pitch: 1.25 },
    name: 'Mầm',
    ages: [1, 3],
    grades: 'Nhà trẻ',
    mascot: '🐣',
    tagline: 'Chạm, nghe, nhìn — thế giới đầu tiên',
    readsAlone: false,
    narrate: true,
    maxLevel: 1,
    teachBack: false,
    sessionMinutes: 5,
    touchTarget: 120,
    gentleErrors: true,
  },
  {
    id: 'choi',
    music: true,
    voice: { rate: 0.9, pitch: 1.2 },
    name: 'Chồi',
    ages: [3, 6],
    grades: 'Mẫu giáo',
    mascot: '🐥',
    tagline: 'Chơi mà học, đếm mà hiểu',
    readsAlone: false,
    narrate: true,
    maxLevel: 2,
    teachBack: false,
    sessionMinutes: 10,
    touchTarget: 88,
    gentleErrors: true,
  },
  {
    id: 'tieuhoc',
    music: true,
    voice: { rate: 0.95, pitch: 1.1 },
    name: 'Tiểu học',
    ages: [6, 11],
    grades: 'Lớp 1–5',
    mascot: '🦊',
    tagline: 'Khám phá vì sao mọi thứ như vậy',
    readsAlone: true,
    narrate: true,
    maxLevel: 3,
    teachBack: true,
    sessionMinutes: 20,
    touchTarget: 56,
    gentleErrors: false,
  },
  {
    id: 'thcs',
    music: false,
    voice: { rate: 1, pitch: 1 },
    name: 'THCS',
    ages: [11, 15],
    grades: 'Lớp 6–9',
    mascot: '🦉',
    tagline: 'Từ hiện tượng đến quy luật',
    readsAlone: true,
    narrate: true,
    maxLevel: 4,
    teachBack: true,
    sessionMinutes: 30,
    touchTarget: 44,
    gentleErrors: false,
  },
  {
    id: 'thpt',
    music: false,
    voice: { rate: 1.05, pitch: 1 },
    name: 'THPT',
    ages: [15, 18],
    grades: 'Lớp 10–12',
    mascot: '🚀',
    tagline: 'Mô hình hóa thế giới bằng tư duy',
    readsAlone: true,
    narrate: true,
    maxLevel: 4,
    teachBack: true,
    sessionMinutes: 40,
    touchTarget: 44,
    gentleErrors: false,
  },
]

export const STAGE_BY_ID: Record<StageId, Stage> = Object.fromEntries(
  STAGES.map((s) => [s.id, s]),
) as Record<StageId, Stage>

export function stageForAge(age: number): Stage {
  if (age < 3) return STAGE_BY_ID.mam
  if (age < 6) return STAGE_BY_ID.choi
  if (age < 11) return STAGE_BY_ID.tieuhoc
  if (age < 15) return STAGE_BY_ID.thcs
  return STAGE_BY_ID.thpt
}

export const STAGE_ORDER: StageId[] = STAGES.map((s) => s.id)

/** Phiên bản này tập trung vào mầm non và tiểu học (1–11 tuổi). */
export const FOCUS_STAGES: StageId[] = ['mam', 'choi', 'tieuhoc']
export const MAX_AGE = 11

/** Lớp gợi ý theo tuổi: 6 tuổi vào lớp 1. */
export const gradeForAge = (age: number) => Math.min(5, Math.max(1, age - 5))

/** Bốn mức độ nhận thức — khớp ma trận đề kiểm tra của Bộ GD&ĐT (tiểu học 3 mức theo TT 27/2020;
 *  THCS–THPT 4 mức) và thang Bloom. */
export const LEVELS = [
  { level: 1, name: 'Nhận biết', bloom: 'Nhớ', hint: 'Nhận ra, gọi tên' },
  { level: 2, name: 'Thông hiểu', bloom: 'Hiểu', hint: 'Giải thích được vì sao' },
  { level: 3, name: 'Vận dụng', bloom: 'Áp dụng', hint: 'Dùng vào tình huống quen thuộc' },
  { level: 4, name: 'Vận dụng cao', bloom: 'Phân tích – Sáng tạo', hint: 'Giải quyết tình huống mới' },
] as const

export type Level = 1 | 2 | 3 | 4

import type { ComponentType, ReactNode } from 'react'
import type { Level } from '../core/stages'
import type { Rng } from '../core/rng'

// Mọi bài học đều theo cùng một vòng "Hiểu bản chất" 6 bước:
//   1. Tò mò     — một câu hỏi/hiện tượng khiến người học muốn biết.
//   2. Khám phá  — tự tay thao tác mô hình (cụ thể → hình ảnh), tự phát hiện quy luật.
//   3. Bản chất  — gọi tên quy luật vừa thấy: CÁI GỐC và VÌ SAO (trừu tượng).
//   4. Luyện tập — leo 4 mức độ; mỗi lựa chọn sai gắn với một ngộ nhận và lời giải thích riêng.
//   5. Giảng lại — chọn lời giải thích đúng và tự nói lại bằng lời của mình (hiệu ứng Feynman).
//   6. Ghi nhớ   — thẻ tóm tắt + hẹn lịch ôn giãn cách.

export interface Choice {
  label: string
  /** Hình/biểu tượng lớn cho trẻ chưa biết đọc. */
  visual?: ReactNode
  correct?: boolean
  /** Mã ngộ nhận (để thống kê) — chỉ cho lựa chọn sai. */
  misconception?: string
  /** Vì sao lựa chọn này sai — chỉ thẳng vào ngộ nhận. */
  why?: string
}

export interface Question {
  level: Level
  prompt: string
  /** Câu đọc to (mặc định là prompt). */
  speak?: string
  visual?: ReactNode
  choices: Choice[]
  /** Lời giải ngắn nhấn vào bản chất, hiện sau khi trả lời. */
  explain: string
  /** big = các ô lớn bằng hình (trẻ nhỏ). */
  layout?: 'big' | 'grid' | 'list'
}

export interface ExploreProps {
  /** Gọi khi người học đã tự khám phá đủ để rút ra quy luật. */
  onDiscover: () => void
  say: (text: string) => void
}

export interface TeachBack {
  prompt: string
  options: { who: string; text: string; correct: boolean; feedback: string }[]
  /** Gợi ý cho ô tự giải thích. */
  ownWordsHint: string
}

export interface Lesson {
  id: string
  skillId: string
  title: string
  emoji: string
  hook: { text: string; visual?: ReactNode }
  explore: { intro: string; Component: ComponentType<ExploreProps> }
  /** Trẻ 1–3 tuổi bỏ qua bước trừu tượng. */
  essence?: {
    bigIdea: string
    points: string[]
    analogy?: string
    Visual?: ComponentType
  }
  practice: (level: Level, rng: Rng) => Question
  teachBack?: TeachBack
  remember: string[]
}

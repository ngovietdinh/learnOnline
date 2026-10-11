import type { ReactNode } from 'react'
import type { GameKind, Lesson, TeachBack } from '../lessons/types'
import type { Skill, StandardRef, SubjectId } from '../core/curriculum'
import type { StageId } from '../core/stages'
import type { Explore } from './kit'
import type { Gen } from './questions'
import { EmoText } from '../components/Critter'

export interface LessonDef {
  id: string
  title: string
  emoji: string
  subject: SubjectId
  stage: StageId
  /** 0 = mầm non, 1–5 = lớp. */
  grade: number
  gradeLabel: string
  /** Câu bản chất — hiện ở bản đồ chương trình. */
  essenceLine: string
  standards: StandardRef[]
  prereqs?: string[]
  hook: string
  hookVisual?: string
  explore: Explore
  essence?: { bigIdea: string; points: string[]; analogy?: string }
  practice: Gen
  teachBack?: TeachBack
  remember: string[]
  games?: GameKind[]
  pairs?: [string, string][]
}

export interface Defined {
  lesson: Lesson
  skill: Skill
}

const hookNode = (v?: string): ReactNode => (v ? <span className="hook-emoji"><EmoText text={v} /></span> : undefined)

export function defineLesson(d: LessonDef): Defined {
  const skillId = `${d.stage}.${d.id}`
  return {
    lesson: {
      id: d.id,
      skillId,
      title: d.title,
      emoji: d.emoji,
      grade: d.grade,
      hook: { text: d.hook, visual: hookNode(d.hookVisual ?? d.emoji) },
      explore: d.explore,
      essence: d.essence,
      practice: d.practice,
      teachBack: d.teachBack,
      remember: d.remember,
      games: d.games,
      pairs: d.pairs,
    },
    skill: {
      id: skillId,
      subject: d.subject,
      stage: d.stage,
      grade: d.gradeLabel,
      gradeNum: d.grade,
      title: d.title,
      essence: d.essenceLine,
      standards: d.standards,
      prereqs: (d.prereqs ?? []).map((p) => (p.includes('.') ? p : `${d.stage}.${p}`)),
      lessonId: d.id,
    },
  }
}

/** Câu "giảng lại" ba bạn — bạn đúng luôn ở vị trí ngẫu nhiên theo thứ tự khai báo. */
export function tb(prompt: string, right: [string, string, string], wrong: [string, string, string][], hint = 'Ví dụ: Mình hiểu là…'): TeachBack {
  const opts = [{ who: right[0], text: right[1], correct: true, feedback: right[2] }, ...wrong.map(([who, text, feedback]) => ({ who, text, correct: false, feedback }))]
  // Xoay vòng vị trí đáp án đúng theo độ dài câu hỏi — không cố định ở đầu.
  const k = prompt.length % opts.length
  return { prompt, options: [...opts.slice(k), ...opts.slice(0, k)], ownWordsHint: hint }
}

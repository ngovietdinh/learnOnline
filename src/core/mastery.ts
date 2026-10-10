// Mô hình "học đến khi vững":
//  • Luyện tập leo thang theo 4 mức độ — chỉ lên mức khi đúng liên tiếp, sai thì củng cố lại.
//  • Ước lượng mức hiểu bằng Bayesian Knowledge Tracing (BKT) rút gọn.
//  • Ôn tập giãn cách (hộp Leitner) để kiến thức đã hiểu không bị quên.

import type { Level } from './stages'

// ───────────────────────── Luyện tập leo thang ─────────────────────────

export interface PracticeState {
  level: Level
  /** Số câu đúng liên tiếp ở mức hiện tại. */
  streak: number
  /** Số câu sai liên tiếp. */
  misses: number
  answered: number
  correct: number
  pKnow: number
  done: boolean
  mastered: boolean
}

export interface PracticeRules {
  maxLevel: Level
  /** Đúng liên tiếp bao nhiêu câu thì lên mức. */
  toLevelUp: number
  /** Trẻ nhỏ: câu sai không xoá chuỗi đúng. */
  gentle: boolean
  /** Giới hạn số câu một lượt, tránh mệt mỏi — chưa vững thì hẹn ôn sớm. */
  maxQuestions: number
  startLevel?: Level
}

export function practiceRules(maxLevel: Level, gentle: boolean): PracticeRules {
  return { maxLevel, toLevelUp: 2, gentle, maxQuestions: maxLevel * 4 + 4 }
}

export function startPractice(rules: PracticeRules, pKnow = BKT.pInit): PracticeState {
  return {
    level: rules.startLevel ?? 1,
    streak: 0,
    misses: 0,
    answered: 0,
    correct: 0,
    pKnow,
    done: false,
    mastered: false,
  }
}

export function answerPractice(s: PracticeState, isCorrect: boolean, rules: PracticeRules): PracticeState {
  const n: PracticeState = {
    ...s,
    answered: s.answered + 1,
    correct: s.correct + (isCorrect ? 1 : 0),
    pKnow: bktUpdate(s.pKnow, isCorrect),
  }
  if (isCorrect) {
    n.streak = s.streak + 1
    n.misses = 0
    if (n.streak >= rules.toLevelUp) {
      if (s.level >= rules.maxLevel) {
        n.done = true
        n.mastered = true
        return n
      }
      n.level = (s.level + 1) as Level
      n.streak = 0
    }
  } else {
    n.misses = s.misses + 1
    if (!rules.gentle) n.streak = 0
    // Sai hai lần liên tiếp: lùi một mức để củng cố nền, rồi leo lại.
    if (!rules.gentle && n.misses >= 2 && s.level > 1) {
      n.level = (s.level - 1) as Level
      n.misses = 0
    }
  }
  if (n.answered >= rules.maxQuestions) n.done = true
  return n
}

// ───────────────────────── Bayesian Knowledge Tracing ─────────────────────────

export const BKT = { pInit: 0.2, pLearn: 0.2, pGuess: 0.2, pSlip: 0.1 }

export function bktUpdate(p: number, isCorrect: boolean): number {
  const { pLearn, pGuess, pSlip } = BKT
  const posterior = isCorrect
    ? (p * (1 - pSlip)) / (p * (1 - pSlip) + (1 - p) * pGuess)
    : (p * pSlip) / (p * pSlip + (1 - p) * (1 - pGuess))
  return posterior + (1 - posterior) * pLearn
}

// ───────────────────────── Ôn tập giãn cách (Leitner) ─────────────────────────

/** Khoảng cách ôn (ngày) theo hộp — mỗi lần nhớ đúng, khoảng cách giãn ra. */
export const REVIEW_INTERVALS = [0, 1, 3, 7, 16, 35, 90]
export const MAX_BOX = REVIEW_INTERVALS.length - 1

const DAY = 86_400_000

export function addDays(fromMs: number, days: number): number {
  const d = new Date(fromMs)
  d.setHours(0, 0, 0, 0)
  return d.getTime() + days * DAY
}

export function scheduleAfterReview(box: number, allCorrect: boolean, nowMs: number): { box: number; due: number } {
  const next = allCorrect ? Math.min(MAX_BOX, box + 1) : 1
  return { box: next, due: addDays(nowMs, REVIEW_INTERVALS[next]) }
}

export function isDue(due: number | undefined, nowMs: number): boolean {
  return due !== undefined && due <= nowMs
}

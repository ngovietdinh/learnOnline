import { useMemo, useRef, useState } from 'react'
import { useMyProgress, useStore } from '../core/store'
import { dueReviews } from '../core/progress'
import { LESSON_BY_ID } from '../lessons/registry'
import { randomRng } from '../core/rng'
import type { Level } from '../core/stages'
import type { Question } from '../lessons/types'
import { QuestionView } from '../components/QuestionView'
import { Confetti, Mascot, useSay, useStage } from '../components/ui'
import { go } from '../core/router'
import { REVIEW_INTERVALS } from '../core/mastery'

interface Item {
  skillId: string
  title: string
  q: Question
}

/** Ôn tập xen kẽ: trộn câu hỏi của nhiều bài, mỗi bài 3 câu ở các mức khác nhau. */
export function ReviewScreen() {
  const progress = useMyProgress()
  const stage = useStage()
  const say = useSay()
  const recordReview = useStore((s) => s.recordReview)
  const addXp = useStore((s) => s.addXp)
  const [items] = useState<Item[]>(() => {
    const due = dueReviews(progress).slice(0, 5)
    const out: Item[] = []
    for (const sk of due) {
      const lesson = LESSON_BY_ID[sk.lessonId!]
      const max = stage.maxLevel
      const levels: Level[] = [Math.max(1, max - 2) as Level, Math.max(1, max - 1) as Level, max]
      for (const l of levels) out.push({ skillId: sk.id, title: sk.title, q: lesson.practice(l, randomRng) })
    }
    // Xen kẽ các bài (interleaving) — buộc não phân biệt "bài này dùng cách nào".
    return out.map((it, i) => ({ it, k: (i % 3) * 100 + i })).sort((a, b) => a.k - b.k).map((x) => x.it)
  })
  const [i, setI] = useState(0)
  const results = useRef<Record<string, { ok: boolean; mis: string[] }>>({})
  const [finished, setFinished] = useState(false)
  const summary = useMemo(() => (finished ? Object.entries(results.current) : []), [finished])

  if (!items.length)
    return (
      <div className="review">
        <Mascot emoji={stage.mascot} mood="happy">
          Hôm nay chưa có bài nào cần ôn. Kiến thức của em vẫn đang "tươi" lắm! 🌿
        </Mascot>
        <button className="btn btn-primary" onClick={() => go({ name: 'home' })}>
          🏠 Về trang chính
        </button>
      </div>
    )

  if (finished)
    return (
      <div className="review">
        <Confetti count={50} />
        <Mascot emoji={stage.mascot} mood="happy">
          Xong buổi ôn! Mỗi lần nhớ lại đúng, khoảng cách đến lần ôn sau sẽ dài ra.
        </Mascot>
        <ul className="review-summary">
          {summary.map(([id, r]) => {
            const box = progress[id]?.box ?? 1
            return (
              <li key={id} className={r.ok ? 'ok' : 'redo'}>
                <b>{items.find((x) => x.skillId === id)?.title}</b>
                <span>{r.ok ? `✅ Nhớ tốt — ôn lại sau ${REVIEW_INTERVALS[box]} ngày` : '🔁 Hơi quên — ôn lại vào ngày mai'}</span>
              </li>
            )
          })}
        </ul>
        <button className="btn btn-primary" onClick={() => go({ name: 'home' })}>
          🏠 Về trang chính
        </button>
      </div>
    )

  const it = items[i]
  return (
    <div className="review">
      <div className="review-head">
        <h2>🔁 Ôn tập giãn cách</h2>
        <span>
          Câu {i + 1}/{items.length} · <i>{it.title}</i>
        </span>
      </div>
      <div className="mastery-bar">
        <div className="mastery-fill" style={{ width: `${(i / items.length) * 100}%` }} />
      </div>
      <QuestionView
        key={i}
        q={it.q}
        gentle={stage.gentleErrors}
        showLevel={stage.maxLevel > 1}
        say={say}
        reward={5}
        onResult={(ok, mis) => {
          const r = (results.current[it.skillId] ??= { ok: true, mis: [] })
          if (!ok) {
            r.ok = false
            if (mis) r.mis.push(mis)
          } else addXp(5)
        }}
        onNext={() => {
          if (i + 1 < items.length) setI(i + 1)
          else {
            for (const [id, r] of Object.entries(results.current)) recordReview(id, r.ok, r.mis)
            setFinished(true)
          }
        }}
      />
    </div>
  )
}

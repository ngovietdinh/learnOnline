import { useEffect, useState } from 'react'
import type { Question } from '../lessons/types'
import { LEVELS } from '../core/stages'
import { sfx } from '../core/sound'
import { cheer, praise, type Seg } from '../core/speech'
import { correctSegs, questionSegs, wrongSegs } from '../core/script'
import { centerOf, fx } from '../core/fx'
import { SpeakButton } from './ui'

interface Props {
  q: Question
  /** Trẻ nhỏ: chọn sai được thử lại, không bị "thua". */
  gentle: boolean
  showLevel: boolean
  say: (t: Seg | Seg[]) => void
  /** Gọi đúng một lần với kết quả của lần chọn đầu tiên. */
  onResult: (correct: boolean, misconception?: string) => void
  onNext: () => void
  /** Điểm sao được cộng khi trả lời đúng (hiện chữ bay). */
  reward?: number
}

export function QuestionView({ q, gentle, showLevel, say, onResult, onNext, reward = 10 }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [wrongTries, setWrongTries] = useState<number[]>([])
  const [reported, setReported] = useState(false)
  const done = picked !== null && (q.choices[picked].correct || !gentle)

  // Đọc câu hỏi; với câu có chữ (không phải hình), đọc luôn các lựa chọn.
  const readAloud = questionSegs(q)
  useEffect(() => {
    say(readAloud)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  useEffect(() => {
    if (!done) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, onNext])

  const choose = (i: number, el: Element) => {
    if (done) return
    const c = q.choices[i]
    const firstTry = !reported
    if (firstTry) {
      onResult(!!c.correct, c.misconception)
      setReported(true)
    }
    setPicked(i)
    const [x, y] = centerOf(el)
    if (c.correct) {
      sfx.correct()
      setTimeout(sfx.sparkle, 180)
      fx.burst(x, y, { count: gentle ? 40 : 28, power: gentle ? 1.3 : 1 })
      if (gentle) fx.hearts(x, y - 20)
      if (firstTry && reward) fx.floatText(x, y - 30, `+${reward} ⭐`)
      say(correctSegs(q, praise()))
      if (gentle) setTimeout(onNext, 2600)
    } else {
      sfx.wrong()
      fx.puff(x, y)
      if (gentle) setWrongTries((w) => [...w, i])
      say(wrongSegs(q, c, cheer(), gentle))
    }
  }

  const status = (i: number) => {
    const c = q.choices[i]
    if (gentle) {
      if (wrongTries.includes(i)) return 'wrong soft'
      if (picked === i && c.correct) return 'right'
      return ''
    }
    if (picked === null) return ''
    if (c.correct) return 'right'
    if (picked === i) return 'wrong'
    return 'dim'
  }

  const pickedChoice = picked !== null ? q.choices[picked] : null
  const lv = LEVELS[q.level - 1]

  return (
    <div className="question">
      <div className="q-head">
        {showLevel && (
          <span className={`level-chip l${q.level}`} title={lv.hint}>
            Mức {q.level} · {lv.name}
          </span>
        )}
        <h3 className="q-prompt">
          {q.prompt} <SpeakButton text={readAloud} />
        </h3>
      </div>
      {q.visual && <div className="q-visual">{q.visual}</div>}
      <div className={`choices layout-${q.layout ?? (q.choices.some((c) => c.visual) ? 'big' : 'grid')}`}>
        {q.choices.map((c, i) => (
          <button key={`${c.label}-${i}`} className={`choice ${status(i)}`} onClick={(e) => choose(i, e.currentTarget)} disabled={done && picked !== i && !c.correct && !gentle}>
            {c.visual && <span className="choice-visual">{c.visual}</span>}
            <span className={`choice-label ${c.visual && (q.layout ?? 'big') === 'big' ? 'sr-only' : ''}`}>{c.label}</span>
          </button>
        ))}
      </div>
      {gentle && pickedChoice && !pickedChoice.correct && <p className="feedback soft">🤗 {pickedChoice.why ?? 'Thử lại nhé!'}</p>}
      {done && !gentle && pickedChoice && (
        <div className={`feedback ${pickedChoice.correct ? 'good' : 'bad'}`} role="status">
          {pickedChoice.correct ? (
            <p className="fb-title">🎉 Chính xác! Giỏi lắm!</p>
          ) : (
            <>
              <p className="fb-title">💡 Chưa đúng — và đây là chỗ dễ nhầm:</p>
              <p className="fb-why">{pickedChoice.why ?? `Thử thay "${pickedChoice.label}" vào đề bài để tự kiểm tra — em sẽ thấy chỗ chưa khớp.`}</p>
            </>
          )}
          <p className="fb-explain">
            <b>Bản chất:</b> {q.explain}
          </p>
          <button className="btn btn-primary" onClick={onNext} autoFocus>
            Tiếp tục ➜
          </button>
        </div>
      )}
      {gentle && done && <p className="feedback good">🎉 {q.explain}</p>}
    </div>
  )
}

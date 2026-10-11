import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Lesson, Question } from '../lessons/types'
import type { Skill } from '../core/curriculum'
import { LEVELS, type Level } from '../core/stages'
import { answerPractice, practiceRules, startPractice, type PracticeRules, type PracticeState } from '../core/mastery'
import { sfx } from '../core/sound'
import { stopSpeaking } from '../core/speech'
import { useMyProgress, useStore } from '../core/store'
import { recommend } from '../core/progress'
import { go } from '../core/router'
import { QuestionView } from '../components/QuestionView'
import { Confetti, SpeakButton, Toast, useSay, useStage } from '../components/ui'
import { Teacher } from '../components/Teacher'
import { canPlay, GameRound, GAME_META } from '../games/Games'
import { essenceSegs, randomPoolQuestion, rememberSegs, teachSegs } from '../core/script'
import { recommendIn, defaultView } from '../core/views'
import { useActiveProfile } from '../core/store'
import type { GameKind } from '../lessons/types'
import type { Seg } from '../core/speech'
import { centerOf, fx } from '../core/fx'
import { praise } from '../core/speech'
import { Critter, EmoText } from '../components/Critter'

type Step = 'hook' | 'explore' | 'essence' | 'game' | 'practice' | 'teach' | 'remember'

const STEP_META: Record<Step, { icon: string; name: string }> = {
  hook: { icon: '❓', name: 'Tò mò' },
  explore: { icon: '🔍', name: 'Khám phá' },
  essence: { icon: '💎', name: 'Bản chất' },
  game: { icon: '🎮', name: 'Trò chơi' },
  practice: { icon: '🎯', name: 'Luyện tập' },
  teach: { icon: '🗣️', name: 'Giảng lại' },
  remember: { icon: '🧠', name: 'Ghi nhớ' },
}

/** Câu hỏi lấy từ "kho" cố định của bài (mỗi câu đều có giọng cô thu sẵn), tránh lặp câu vừa hỏi. */
function nextQuestion(lesson: Lesson, level: Level, prev?: Question): Question {
  return randomPoolQuestion(lesson, level, prev?.prompt)
}

export function LessonPlayer({ lesson, skill, mode }: { lesson: Lesson; skill: Skill; mode: 'learn' | 'test' }) {
  const stage = useStage()
  const say = useSay()
  const recordLesson = useStore((s) => s.recordLesson)
  const addXp = useStore((s) => s.addXp)
  const progress = useMyProgress()

  const me = useActiveProfile()
  const gameKind = useMemo<GameKind | null>(() => {
    if (mode === 'test') return null
    const kinds = (lesson.games ?? ['bongbay', 'cauca', 'chuotchui']).filter((k) => canPlay(lesson, k))
    return kinds.length ? kinds[Math.floor(Math.random() * kinds.length)] : null
  }, [lesson, mode])
  const steps = useMemo<Step[]>(() => {
    if (mode === 'test') return ['practice', 'remember']
    const s: Step[] = ['hook', 'explore']
    if (lesson.essence) s.push('essence')
    // Bé mầm non: chơi trước rồi luyện; tiểu học: luyện xong được chơi thưởng.
    const young = stage.id === 'mam' || stage.id === 'choi'
    if (young && gameKind) s.push('game')
    s.push('practice')
    if (!young && gameKind) s.push('game')
    if (lesson.teachBack && stage.teachBack) s.push('teach')
    s.push('remember')
    return s
  }, [lesson, stage, mode, gameKind])

  const [stepIdx, setStepIdx] = useState(0)
  const step = steps[stepIdx]
  const startedAt = useRef(Date.now())
  const misconceptions = useRef<string[]>([])
  const [explanation, setExplanation] = useState('')

  const rules: PracticeRules = useMemo(() => {
    const base = practiceRules(stage.maxLevel, stage.gentleErrors)
    if (mode === 'test') return { ...base, startLevel: stage.maxLevel, toLevelUp: 3, maxQuestions: 4 }
    return base
  }, [stage, mode])

  const [ps, setPsState] = useState<PracticeState>(() => startPractice(rules))
  // Bản sao đồng bộ: onNext có thể được gọi từ hẹn giờ trước khi React kịp vẽ lại.
  const psRef = useRef(ps)
  const setPs = (n: PracticeState) => {
    psRef.current = n
    setPsState(n)
  }
  const [q, setQ] = useState<Question>(() => nextQuestion(lesson, rules.startLevel ?? 1))
  const [qKey, setQKey] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const [mood, setMood] = useState<'idle' | 'happy' | 'oops'>('idle')
  const [saved, setSaved] = useState(false)

  useEffect(() => () => stopSpeaking(), [])

  const goStep = (i: number) => {
    stopSpeaking()
    setStepIdx(i)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const next = () => goStep(Math.min(stepIdx + 1, steps.length - 1))

  useEffect(() => {
    if (step !== 'practice') sfx.whoosh()
    if (step === 'hook') say(lesson.hook.text)
    if (step === 'explore') say(lesson.explore.intro)
    if (step === 'essence' && lesson.essence) {
      // Đọc trọn phần bản chất: ý chính, các lý do, hình dung.
      say(essenceSegs(lesson))
      sfx.sparkle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const finish = useCallback(
    (final: PracticeState) => {
      if (saved) return
      setSaved(true)
      recordLesson(skill.id, {
        mastered: final.mastered,
        pKnow: final.pKnow,
        seconds: Math.round((Date.now() - startedAt.current) / 1000),
        misconceptions: misconceptions.current,
        explanation,
      })
      if (final.mastered) addXp(50)
    },
    [saved, recordLesson, skill.id, explanation, addXp],
  )

  const onResult = (correct: boolean, mis?: string) => {
    const ps = psRef.current
    if (ps.done) return
    if (!correct && mis) misconceptions.current.push(mis)
    if (correct) addXp(10)
    const n = answerPractice(ps, correct, rules)
    setMood(correct ? 'happy' : 'oops')
    if (n.level > ps.level) {
      // Chờ tiếng "đúng rồi" xong mới bung băng rôn lên mức.
      setTimeout(() => {
        sfx.levelUp()
        fx.confettiRain(70)
        setLevelUp(n.level)
        setTimeout(() => setLevelUp(null), 2600)
      }, 700)
    } else if (n.level < ps.level) {
      setToast(`↩️ Củng cố lại mức ${n.level} một chút nhé`)
      setTimeout(() => setToast(null), 2200)
    }
    setPs(n)
  }

  const onNextQuestion = () => {
    const ps = psRef.current
    if (ps.done) {
      // Bài có bước giảng lại: lưu kết quả ở bước cuối để kèm lời tự giải thích.
      if (!steps.includes('teach')) finish(ps)
      next()
      return
    }
    setQ(nextQuestion(lesson, ps.level, q))
    setQKey((k) => k + 1)
  }

  useEffect(() => {
    if (step === 'remember') {
      finish(ps)
      const congrats = ps.mastered ? [praise(), ...rememberSegs(lesson, true)] : rememberSegs(lesson, false)
      if (ps.mastered) {
        sfx.celebrate()
        setTimeout(() => fx.fireworks(7, sfx.firework), 600)
        setTimeout(() => fx.confettiRain(160), 300)
      }
      setTimeout(() => say(congrats), ps.mastered ? 1600 : 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const perLevel = rules.toLevelUp
  const masteryProgress = ps.mastered
    ? 1
    : ((ps.level - (rules.startLevel ?? 1)) * perLevel + ps.streak) / ((rules.maxLevel - (rules.startLevel ?? 1) + 1) * perLevel)

  const Explore = lesson.explore.Component
  // Ở bước cuối, kết quả đã được lưu nên gợi ý dựa trên tiến độ mới nhất.
  const recommendNext = step === 'remember' ? (me ? recommendIn(defaultView(me), progress) : undefined) ?? recommend(stage.id, progress) : undefined

  return (
    <div className="player">
      <header className="player-head">
        <button className="btn btn-ghost" onClick={() => go({ name: 'home' })} aria-label="Thoát bài học">
          ✕
        </button>
        <div className="player-title">
          <span className="player-emoji"><EmoText text={lesson.emoji} /></span>
          <div>
            <h2>{lesson.title}</h2>
            <small>
              {skill.grade} · {mode === 'test' ? 'Kiểm tra nhanh — đã biết thì bỏ qua' : 'Học hiểu bản chất'}
            </small>
          </div>
        </div>
      </header>
      <ol className="stepper" aria-label="Các bước bài học">
        {steps.map((s, i) => (
          <li key={s} className={i === stepIdx ? 'now' : i < stepIdx ? 'past' : ''}>
            <span className="step-icon">{STEP_META[s].icon}</span>
            <span className="step-name">{STEP_META[s].name}</span>
          </li>
        ))}
      </ol>

      <main className="stage-card" key={step}>
        {step === 'hook' && (
          <section className="step-hook">
            <div className="hook-visual">{lesson.hook.visual}</div>
            <div className="teacher-say">
              <Teacher size={stage.readsAlone ? 120 : 150} mood="think" />
              <div className="bubble">
                {lesson.hook.text} <SpeakButton text={lesson.hook.text} />
              </div>
            </div>
            <button className="btn btn-primary btn-big" onClick={next}>
              {stage.readsAlone ? 'Cùng tìm hiểu nào ➜' : '▶️ Chơi nào!'}
            </button>
          </section>
        )}

        {step === 'explore' && (
          <section className="step-explore">
            <p className="step-intro">
              {lesson.explore.intro} <SpeakButton text={lesson.explore.intro} />
            </p>
            <Explore onDiscover={next} say={say} />
          </section>
        )}

        {step === 'essence' && lesson.essence && (
          <section className="step-essence">
            <div className="big-idea">
              <span className="gem">💎</span>
              <p>{lesson.essence.bigIdea}</p>
              <SpeakButton text={lesson.essence.bigIdea} />
            </div>
            <ul className="why-list">
              {lesson.essence.points.map((p, i) => (
                <li key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                  {p}
                </li>
              ))}
            </ul>
            {lesson.essence.analogy && (
              <p className="analogy">
                <b>🪄 Hình dung:</b> {lesson.essence.analogy}
              </p>
            )}
            <button className="btn btn-primary btn-big" onClick={next}>
              Luyện tập để chắc chắn ➜
            </button>
          </section>
        )}

        {step === 'practice' && (
          <section className="step-practice">
            <div className="practice-top">
              <span className={`mini-mascot react-${mood}`} key={`${qKey}-${mood}`} aria-hidden>
                <Teacher size={64} mood={mood === 'happy' ? 'happy' : mood === 'oops' ? 'oops' : 'idle'} />
              </span>
              <div className="mastery-bar" aria-label="Tiến độ đến khi vững">
              <div className="mastery-fill" style={{ width: `${Math.round(masteryProgress * 100)}%` }} />
              <span>
                {ps.done ? (ps.mastered ? 'Đã vững! 🏆' : 'Hẹn ôn lại nhé') : `Tiến tới "vững": ${Math.round(masteryProgress * 100)}%`}
              </span>
              </div>
            </div>
            {stage.maxLevel > 1 && (
              <div className="level-track">
                {LEVELS.slice(rules.startLevel ? rules.startLevel - 1 : 0, rules.maxLevel).map((l) => (
                  <span key={l.level} className={`lt ${ps.level === l.level ? 'now' : ps.level > l.level || ps.mastered ? 'past' : ''}`}>
                    {l.name}
                  </span>
                ))}
              </div>
            )}
            <QuestionView
              key={qKey}
              q={q}
              gentle={stage.gentleErrors}
              showLevel={stage.maxLevel > 1}
              say={say}
              onResult={onResult}
              onNext={onNextQuestion}
            />
            {ps.done && !ps.mastered && mode === 'test' && (
              <p className="note">Chưa sao! Mình học kỹ bài này từ đầu để hiểu tận gốc nhé.</p>
            )}
          </section>
        )}

        {step === 'game' && gameKind && (
          <section className="step-game">
            <GameRound
              lesson={lesson}
              kind={gameKind}
              level={(Math.max(1, Math.min(ps.level, stage.maxLevel)) as Level)}
              rounds={stage.id === 'mam' ? 4 : 5}
              onDone={(stars) => {
                addXp(stars * 5)
                next()
              }}
            />
            <div className="row-center">
              <button className="btn btn-ghost" onClick={next}>
                Bỏ qua trò {GAME_META[gameKind].name} ➜
              </button>
            </div>
          </section>
        )}

        {step === 'teach' && lesson.teachBack && (
          <TeachBackStep
            tb={lesson.teachBack}
            say={say}
            onMistake={() => misconceptions.current.push('giang-lai-chua-dung')}
            explanation={explanation}
            setExplanation={setExplanation}
            onDone={next}
          />
        )}

        {step === 'remember' && (
          <section className="step-remember">
            {ps.mastered && <Confetti />}
            {ps.mastered && (
              <div className="trophy" aria-hidden>
                <span className="trophy-rays" />
                <span className="trophy-cup">🏆</span>
                <span className="trophy-stars">
                  <i>⭐</i>
                  <i>⭐</i>
                  <i>⭐</i>
                </span>
              </div>
            )}
            <div className="teacher-say">
              <Teacher size={110} mood={ps.mastered ? 'cheer' : 'idle'} />
              <div className="bubble">
                {ps.mastered
                  ? mode === 'test'
                    ? 'Em đã biết vững bài này rồi! Mình sẽ hẹn ôn lại để nhớ thật lâu.'
                    : 'Tuyệt vời! Em đã hiểu và vững bài này. Hẹn em ôn lại vào ngày mai để nhớ lâu nhé!'
                  : 'Em đã tiến bộ rồi! Ngày mai mình luyện thêm một chút để thật vững nhé.'}
              </div>
              {ps.mastered && <Critter kind="hongvui" size={130} className="cheer-buddy hop" />}
            </div>
            <div className="memory-cards">
              {lesson.remember.map((r, i) => (
                <div key={i} className="memory-card" style={{ animationDelay: `${i * 0.12}s` }}>
                  {r}
                </div>
              ))}
            </div>
            <div className="result-row">
              <div>
                <b>{ps.correct}</b>/{ps.answered} câu đúng
              </div>
              <div>
                Mức hiểu ước tính <b>{Math.round(ps.pKnow * 100)}%</b>
              </div>
              <div>
                Ôn lại: <b>ngày mai</b> → 3 ngày → 1 tuần → …
              </div>
            </div>
            <div className="btn-row center">
              {mode === 'test' && !ps.mastered && (
                <button className="btn btn-primary" onClick={() => go({ name: 'lesson', id: lesson.id, mode: 'learn' })}>
                  📘 Học bài này từ đầu
                </button>
              )}
              {recommendNext && recommendNext.id !== skill.id && recommendNext.lessonId && (
                <button className="btn btn-primary" onClick={() => go({ name: 'lesson', id: recommendNext.lessonId!, mode: 'learn' })}>
                  Bài tiếp: {recommendNext.title} ➜
                </button>
              )}
              <button className="btn" onClick={() => go({ name: 'home' })}>
                🏠 Về trang chính
              </button>
            </div>
          </section>
        )}
      </main>
      {toast && <Toast>{toast}</Toast>}
      {levelUp && (
        <div className="levelup" role="status">
          <div className="levelup-rays" />
          <div className="levelup-card">
            <small>Lên mức</small>
            <b>{levelUp}</b>
            <span>{LEVELS[levelUp - 1].name}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function TeachBackStep({
  tb,
  say,
  onMistake,
  explanation,
  setExplanation,
  onDone,
}: {
  tb: NonNullable<Lesson['teachBack']>
  say: (t: Seg | Seg[]) => void
  onMistake: () => void
  explanation: string
  setExplanation: (s: string) => void
  onDone: () => void
}) {
  const [picked, setPicked] = useState<number[]>([])
  const solved = picked.some((i) => tb.options[i].correct)
  useEffect(() => say(teachSegs(tb)), [say, tb])
  return (
    <section className="step-teach">
      <h3>
        {tb.prompt} <SpeakButton text={tb.prompt} />
      </h3>
      <div className="teach-options">
        {tb.options.map((o, i) => {
          const was = picked.includes(i)
          return (
            <button
              key={i}
              className={`teach-option ${was ? (o.correct ? 'right' : 'wrong') : ''}`}
              disabled={solved && !was}
              onClick={(e) => {
                if (was || solved) return
                setPicked([...picked, i])
                const [x, y] = centerOf(e.currentTarget)
                if (o.correct) {
                  sfx.correct()
                  fx.burst(x, y, { count: 36 })
                } else {
                  fx.puff(x, y)
                  sfx.wrong()
                  onMistake()
                }
                say(o.feedback)
              }}
            >
              <span className="who"><EmoText text={o.who} /></span>
              <span className="says">“{o.text}”</span>
              {was && <span className="teach-fb">{o.feedback}</span>}
            </button>
          )
        })}
      </div>
      {solved && (
        <div className="own-words">
          <label htmlFor="own">
            ✍️ Giờ em thử giải thích lại <b>bằng lời của mình</b> (như đang giảng cho một bạn nhỏ hơn):
          </label>
          <textarea id="own" rows={3} placeholder={tb.ownWordsHint} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          <small className="muted">Tự giảng lại là cách nhớ lâu nhất. Bố mẹ/thầy cô sẽ xem được lời giải thích này.</small>
          <button className="btn btn-primary btn-big" onClick={onDone}>
            {explanation.trim() ? 'Hoàn thành ➜' : 'Bỏ qua và hoàn thành ➜'}
          </button>
        </div>
      )}
    </section>
  )
}

import { useEffect, useState } from 'react'
import { SUBJECTS, type Skill, type SubjectId } from '../core/curriculum'
import { useActiveProfile, useMyProgress, useStore, type SkillProgress } from '../core/store'
import { dueReviews, skillState, type SkillState } from '../core/progress'
import { defaultView, recommendIn, viewProgress, viewSkills, VIEWS, type ViewId } from '../core/views'
import { go } from '../core/router'
import { LESSON_BY_ID } from '../lessons/registry'
import { ProgressRing, useSay, useStage } from '../components/ui'
import { Teacher } from '../components/Teacher'
import { GAME_META } from '../games/Games'
import type { GameKind } from '../lessons/types'
import { sfx } from '../core/sound'
import { EmoText } from '../components/Critter'
import { Critter, buddyOf } from '../components/Critter'

const STATE_BADGE: Record<SkillState, string> = {
  mastered: '🏆 Đã vững',
  learning: '⏳ Đang học',
  available: '✨ Sẵn sàng',
  locked: '🔒 Cần nền',
  planned: '🛠️ Đang soạn',
}

export function SkillNode({ skill, progress, big, index = 0 }: { skill: Skill; progress: Record<string, SkillProgress>; big?: boolean; index?: number }) {
  const state = skillState(skill, progress)
  const lesson = skill.lessonId ? LESSON_BY_ID[skill.lessonId] : undefined
  const p = progress[skill.id]
  const subj = SUBJECTS[skill.subject]
  return (
    <button
      className={`skill-node st-${state} ${big ? 'big' : ''}`}
      style={{ ['--subj' as string]: subj.color, ['--i' as string]: index }}
      onClick={() => {
        sfx.tap()
        // Bé nhỏ: chạm là vào học luôn.
        if (big && lesson && state !== 'locked') go({ name: 'lesson', id: lesson.id, mode: 'learn' })
        else go({ name: 'skill', id: skill.id })
      }}
    >
      <span className="node-icon"><EmoText text={lesson?.emoji ?? subj.icon} still /></span>
      <span className="node-text">
        <b>{skill.title}</b>
        <small>
          {subj.name} · {skill.grade}
        </small>
      </span>
      <span className="node-badge">{STATE_BADGE[state]}</span>
      {p && (
        <span className="node-ring">
          <ProgressRing value={p.pKnow} size={38} />
        </span>
      )}
    </button>
  )
}

const VIEW_KEY = 'hoc-ban-chat:view'

export function HomeScreen() {
  const me = useActiveProfile()
  const stage = useStage()
  const progress = useMyProgress()
  const stats = useStore((s) => (s.activeId ? s.stats[s.activeId] : undefined))
  const [view, setViewState] = useState<ViewId>(() => {
    try {
      const v = sessionStorage.getItem(VIEW_KEY) as ViewId | null
      if (v && VIEWS.some((x) => x.id === v)) return v
    } catch {
      /* bỏ qua */
    }
    return me ? defaultView(me) : 'lop1'
  })
  const setView = (v: ViewId) => {
    setViewState(v)
    sfx.whoosh()
    try {
      sessionStorage.setItem(VIEW_KEY, v)
    } catch {
      /* bỏ qua */
    }
  }
  const due = dueReviews(progress)
  const home = me ? defaultView(me) : view
  const next = recommendIn(view, progress) ?? recommendIn(home, progress)
  const nextLesson = next?.lessonId ? LESSON_BY_ID[next.lessonId] : undefined
  const young = stage.id === 'mam' || stage.id === 'choi'
  const say = useSay()

  useEffect(() => {
    if (!me) return
    const t = setTimeout(() => {
      const segs = [young ? 'Chào con! Hôm nay mình cùng học và chơi nhé!' : 'Chào em! Sẵn sàng khám phá điều mới chưa nào?']
      if (next) segs.push(`Bài tiếp theo: ${next.title}.`)
      if (due.length) segs.push('Hôm nay có bài cần ôn đó. Ôn một chút thôi là nhớ lâu lắm!')
      say(segs)
    }, 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!me) return null
  const skills = viewSkills(view)
  const tiles = young && (view === 'mam' || view === 'choi')
  const bySubject = (Object.keys(SUBJECTS) as SubjectId[])
    .map((id) => ({ id, list: skills.filter((s) => s.subject === id) }))
    .filter((g) => g.list.length)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-teacher">
          <Teacher size={young ? 130 : 110} mood="happy" />
          <div className="bubble">
            {young ? `Chào ${me.name}! Hôm nay mình cùng học và chơi nhé!` : `Chào ${me.name}! Sẵn sàng khám phá điều mới chưa nào?`}
            {stats && stats.streakDays > 1 && <div className="muted">🔥 {stats.streakDays} ngày liên tiếp — giỏi lắm!</div>}
          </div>
          <Critter kind={buddyOf(me.avatar)} size={young ? 140 : 118} className="hero-buddy" />
        </div>
        {next && nextLesson && (
          <button
            className="next-card"
            onClick={() => {
              sfx.pop()
              go({ name: 'lesson', id: nextLesson.id, mode: 'learn' })
            }}
          >
            <span className="next-emoji"><EmoText text={nextLesson.emoji} /></span>
            <span className="next-text">
              <small>{progress[next.id] ? 'Học tiếp' : young ? 'Bài tiếp theo của con' : 'Bài tiếp theo dành cho em'}</small>
              <b>{next.title}</b>
              <i>{next.essence}</i>
            </span>
            <span className="next-go">{young ? '▶️' : 'Bắt đầu ➜'}</span>
          </button>
        )}
        {due.length > 0 && (
          <button className="review-card" onClick={() => go({ name: 'review' })}>
            <span>🔁</span>
            <span>
              <b>Ôn tập hôm nay: {due.length} bài</b>
              <small>Vài phút ôn đúng lúc giúp nhớ lâu gấp nhiều lần</small>
            </span>
            <span className="next-go">Ôn ngay ➜</span>
          </button>
        )}
      </section>

      <section className="playground">
        <h3 className="subject-title" style={{ ['--subj' as string]: '#ff5d8f' }}>
          <span>🎪</span> Sân chơi
        </h3>
        <div className="play-grid">
          {(Object.keys(GAME_META) as GameKind[]).map((k, i) => (
            <button key={k} className={`play-card pk-${k}`} style={{ ['--i' as string]: i }} onClick={() => go({ name: 'play', kind: k, view })}>
              <span className="play-emoji"><EmoText text={GAME_META[k].emoji} /></span>
              <b>{GAME_META[k].name}</b>
            </button>
          ))}
        </div>
      </section>

      <nav className="stage-tabs" aria-label="Chọn lớp">
        {VIEWS.map((v) => {
          const sum = viewProgress(v.id, progress)
          return (
            <button key={v.id} className={`stage-tab v-${v.id} ${view === v.id ? 'on' : ''}`} onClick={() => setView(v.id)}>
              <span><EmoText text={v.icon} still /></span>
              <b>{v.name}</b>
              <small>
                {sum.mastered}/{sum.total} vững
              </small>
            </button>
          )
        })}
      </nav>
      {view !== home && (
        <p className="note">
          Em đang xem <b>{VIEWS.find((v) => v.id === view)!.name}</b>. Ôn lại nền móng hay thử sức trước đều được — hệ thống sẽ nhắc nếu thiếu kiến thức nền.
        </p>
      )}

      {bySubject.map((g) => (
        <section key={g.id} className="subject-block">
          <h3 className="subject-title" style={{ ['--subj' as string]: SUBJECTS[g.id].color }}>
            <span>{SUBJECTS[g.id].icon}</span> {SUBJECTS[g.id].name} <small className="muted">· {g.list.length} bài</small>
          </h3>
          <div className={`skill-list ${tiles ? 'tiles' : 'grid'}`}>
            {g.list.map((s, idx) => (
              <SkillNode key={s.id} skill={s} progress={progress} big={tiles} index={idx} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

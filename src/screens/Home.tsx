import { useState } from 'react'
import { SKILLS, SUBJECTS, type Skill, type SubjectId } from '../core/curriculum'
import { STAGES, type StageId } from '../core/stages'
import { useActiveProfile, useMyProgress, useStore, type SkillProgress } from '../core/store'
import { dueReviews, recommend, skillState, stageSummary, type SkillState } from '../core/progress'
import { go } from '../core/router'
import { LESSON_BY_ID } from '../lessons/registry'
import { Mascot, ProgressRing, useStage } from '../components/ui'
import { sfx } from '../core/sound'

const STATE_BADGE: Record<SkillState, string> = {
  mastered: '🏆 Đã vững',
  learning: '⏳ Đang học',
  available: '✨ Sẵn sàng',
  locked: '🔒 Cần nền',
  planned: '🛠️ Đang soạn',
}

export function SkillNode({ skill, progress, big }: { skill: Skill; progress: Record<string, SkillProgress>; big?: boolean }) {
  const state = skillState(skill, progress)
  const lesson = skill.lessonId ? LESSON_BY_ID[skill.lessonId] : undefined
  const p = progress[skill.id]
  const subj = SUBJECTS[skill.subject]
  return (
    <button
      className={`skill-node st-${state} ${big ? 'big' : ''}`}
      style={{ ['--subj' as string]: subj.color }}
      onClick={() => {
        sfx.tap()
        // Bé nhỏ: chạm là vào học luôn.
        if (big && lesson && state !== 'locked') go({ name: 'lesson', id: lesson.id, mode: 'learn' })
        else go({ name: 'skill', id: skill.id })
      }}
    >
      <span className="node-icon">{lesson?.emoji ?? subj.icon}</span>
      <span className="node-text">
        <b>{skill.title}</b>
        <small>
          {subj.name} · {skill.grade}
        </small>
      </span>
      <span className="node-badge">{STATE_BADGE[state]}</span>
      {p && <span className="node-ring"><ProgressRing value={p.pKnow} size={38} /></span>}
    </button>
  )
}

export function HomeScreen() {
  const me = useActiveProfile()
  const stage = useStage()
  const progress = useMyProgress()
  const stats = useStore((s) => (s.activeId ? s.stats[s.activeId] : undefined))
  const [view, setView] = useState<StageId>(stage.id)
  const due = dueReviews(progress)
  const next = recommend(stage.id, progress)
  const nextLesson = next?.lessonId ? LESSON_BY_ID[next.lessonId] : undefined
  const young = stage.id === 'mam' || stage.id === 'choi'

  if (!me) return null
  const skills = SKILLS.filter((s) => s.stage === view)
  // Bé nhỏ chỉ thấy những bài chơi được ngay — không có gì "đang soạn" gây rối.
  const tiles = young && view === stage.id
  const bySubject = (Object.keys(SUBJECTS) as SubjectId[])
    .map((id) => ({ id, list: skills.filter((s) => s.subject === id && (!tiles || s.lessonId)) }))
    .filter((g) => g.list.length)

  const greet = young ? `Chào ${me.name}! Mình cùng chơi nhé!` : `Chào ${me.name}! Sẵn sàng hiểu thêm một điều mới chưa?`

  return (
    <div className="home">
      <section className="hero">
        <Mascot emoji={stage.mascot} mood="happy">
          {greet}
          {stats && stats.streakDays > 1 && <div className="muted">🔥 {stats.streakDays} ngày liên tiếp — giỏi lắm!</div>}
        </Mascot>
        {next && nextLesson && (
          <button
            className="next-card"
            onClick={() => {
              sfx.pop()
              go({ name: 'lesson', id: nextLesson.id, mode: 'learn' })
            }}
          >
            <span className="next-emoji">{nextLesson.emoji}</span>
            <span className="next-text">
              <small>{progress[next.id] ? 'Học tiếp' : 'Bài tiếp theo dành cho em'}</small>
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

      <nav className="stage-tabs" aria-label="Các cấp độ">
        {STAGES.map((s) => {
          const sum = stageSummary(s.id, progress)
          return (
            <button key={s.id} className={`stage-tab s-${s.id} ${view === s.id ? 'on' : ''}`} onClick={() => setView(s.id)}>
              <span>{s.mascot}</span>
              <b>{s.name}</b>
              <small>
                {sum.mastered}/{sum.playable} vững
              </small>
            </button>
          )
        })}
      </nav>
      {view !== stage.id && (
        <p className="note">
          Em đang xem cấp độ <b>{STAGES.find((s) => s.id === view)!.name}</b>. Ôn lại nền móng hoặc thử sức trước đều được — hệ thống sẽ nhắc nếu thiếu kiến thức nền.
        </p>
      )}

      {bySubject.map((g) => (
        <section key={g.id} className="subject-block">
          <h3 className="subject-title" style={{ ['--subj' as string]: SUBJECTS[g.id].color }}>
            <span>{SUBJECTS[g.id].icon}</span> {SUBJECTS[g.id].name}
          </h3>
          <div className={`skill-list ${tiles ? 'tiles' : view === 'tieuhoc' ? 'path' : 'grid'}`}>
            {g.list.map((s) => (
              <SkillNode key={s.id} skill={s} progress={progress} big={tiles} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

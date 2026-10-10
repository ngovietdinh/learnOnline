import { FRAMEWORKS, SKILLS, SKILL_BY_ID, SUBJECTS } from '../core/curriculum'
import { STAGE_BY_ID } from '../core/stages'
import { useMyProgress } from '../core/store'
import { missingPrereqs, skillState } from '../core/progress'
import { go } from '../core/router'
import { LESSON_BY_ID } from '../lessons/registry'
import { ProgressRing, useStage } from '../components/ui'

export function SkillDetail({ id }: { id: string }) {
  const skill = SKILL_BY_ID[id]
  const progress = useMyProgress()
  const stage = useStage()
  if (!skill) return <p className="note">Không tìm thấy kỹ năng này.</p>
  const state = skillState(skill, progress)
  const lesson = skill.lessonId ? LESSON_BY_ID[skill.lessonId] : undefined
  const missing = missingPrereqs(skill, progress)
  const unlocks = SKILLS.filter((s) => s.prereqs.includes(skill.id))
  const p = progress[skill.id]
  const subj = SUBJECTS[skill.subject]

  return (
    <div className="skill-detail">
      <button className="btn btn-ghost" onClick={() => history.back()}>
        ← Quay lại
      </button>
      <header className="sd-head" style={{ ['--subj' as string]: subj.color }}>
        <span className="sd-icon">{lesson?.emoji ?? subj.icon}</span>
        <div>
          <small>
            {subj.name} · {STAGE_BY_ID[skill.stage].name} · {skill.grade}
          </small>
          <h2>{skill.title}</h2>
        </div>
        {p && <ProgressRing value={p.pKnow} size={64} />}
      </header>

      <div className="big-idea compact">
        <span className="gem">💎</span>
        <p>{skill.essence}</p>
      </div>

      {missing.length > 0 && (
        <div className="note warn">
          <b>Nền móng cần có trước:</b> học các bài này trước thì bài này sẽ "vỡ" ngay trong một lần:
          <div className="chip-row">
            {missing.map((m) => (
              <button key={m.id} className="chip" onClick={() => go({ name: 'skill', id: m.id })}>
                🔒 {m.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="btn-row">
        {lesson ? (
          <>
            <button className="btn btn-primary btn-big" onClick={() => go({ name: 'lesson', id: lesson.id, mode: 'learn' })}>
              {state === 'mastered' ? '🔁 Học lại' : state === 'locked' ? 'Vẫn học bài này' : '📘 Học bài này'}
            </button>
            {!stage.gentleErrors && state !== 'mastered' && (
              <button className="btn" onClick={() => go({ name: 'lesson', id: lesson.id, mode: 'test' })}>
                ⚡ Em đã biết — kiểm tra nhanh
              </button>
            )}
          </>
        ) : (
          <p className="note">🛠️ Bài tương tác cho kỹ năng này đang được soạn theo cùng khung 6 bước. Khung chuẩn và bản chất đã có sẵn bên dưới.</p>
        )}
      </div>

      <section className="panel">
        <h4>📋 Bám sát chuẩn</h4>
        <ul className="std-list">
          {skill.standards.map((s, i) => (
            <li key={i}>
              <span className={`fw fw-${s.framework}`}>{s.framework}</span> {s.code}
              <small className="muted"> — {FRAMEWORKS[s.framework]}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h4>🧩 Vị trí trong bản đồ tri thức</h4>
        <div className="graph-row">
          <div>
            <small className="muted">Dựa trên</small>
            {skill.prereqs.length ? (
              skill.prereqs.map((pid) => {
                const ps = SKILL_BY_ID[pid]
                return (
                  <button key={pid} className={`chip st-${skillState(ps, progress)}`} onClick={() => go({ name: 'skill', id: pid })}>
                    {ps.title}
                  </button>
                )
              })
            ) : (
              <span className="chip ghost">Nền tảng đầu tiên</span>
            )}
          </div>
          <span className="graph-arrow">➜</span>
          <div>
            <span className="chip now">{skill.title}</span>
          </div>
          <span className="graph-arrow">➜</span>
          <div>
            <small className="muted">Mở đường cho</small>
            {unlocks.length ? (
              unlocks.map((u) => (
                <button key={u.id} className={`chip st-${skillState(u, progress)}`} onClick={() => go({ name: 'skill', id: u.id })}>
                  {u.title}
                </button>
              ))
            ) : (
              <span className="chip ghost">Đích đến của nhánh này</span>
            )}
          </div>
        </div>
      </section>

      {p && (
        <section className="panel">
          <h4>📈 Tiến độ của em</h4>
          <p>
            Đã học {p.attempts} lần · {Math.round(p.seconds / 60)} phút ·{' '}
            {p.status === 'mastered' ? `Ôn tiếp vào ${new Date(p.due ?? Date.now()).toLocaleDateString('vi-VN')}` : 'Chưa vững — luyện thêm nhé'}
          </p>
          {p.explanation && (
            <blockquote className="own-quote">
              “{p.explanation}” <small>— lời giải thích của em</small>
            </blockquote>
          )}
        </section>
      )}
    </div>
  )
}

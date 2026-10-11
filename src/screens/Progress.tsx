import { SKILL_BY_ID, SUBJECTS, type SubjectId } from '../core/curriculum'
import { useActiveProfile, useMyProgress, useStore } from '../core/store'
import { dueReviews } from '../core/progress'
import { defaultView, viewSkills, VIEWS } from '../core/views'
import { go } from '../core/router'
import { PageIntro, ProgressBar, StatCard, toneOf, plushOfSkill } from '../components/Cards'
import { Critter } from '../components/Critter'
import { Icon } from '../components/Icon'

/** Tiến bộ của bé: số liệu nhanh, mức hiểu theo môn, các bài đã học gần đây. */
export function ProgressScreen() {
  const me = useActiveProfile()
  const progress = useMyProgress()
  const stats = useStore((s) => (s.activeId ? s.stats[s.activeId] : undefined))
  if (!me) return null
  const studied = Object.entries(progress)
    .map(([id, p]) => ({ skill: SKILL_BY_ID[id], p }))
    .filter((x) => x.skill)
    .sort((a, b) => b.p.lastStudied - a.p.lastStudied)
  const minutes = Math.round(studied.reduce((s, x) => s + x.p.seconds, 0) / 60)
  const mastered = studied.filter((x) => x.p.status === 'mastered').length
  const view = defaultView(me)
  const subjects = (Object.keys(SUBJECTS) as SubjectId[])
    .map((id) => {
      const list = viewSkills(view).filter((s) => s.subject === id)
      const know = list.reduce((s, k) => s + (progress[k.id]?.pKnow ?? 0), 0)
      return { id, total: list.length, value: list.length ? know / list.length : 0, done: list.filter((k) => progress[k.id]?.status === 'mastered').length }
    })
    .filter((x) => x.total)
  const due = dueReviews(progress)
  return (
    <div className="progress-page">
      <PageIntro title="Tiến bộ tuần này" sub={`Một góc nhìn ngắn gọn để cả nhà cùng khích lệ ${me.name}.`} plush="meo" />
      <div className="stats-grid">
        <StatCard label="Thời gian học" value={`${minutes} phút`} plush="koala" tone="blue" index={0} />
        <StatCard label="Bài đã vững" value={`${mastered} bài`} plush="sutu" tone="sun" index={1} />
        <StatCard label="Ngôi sao" value={`+${stats?.xp ?? 0}`} plush="khi" tone="coral" index={2} />
        <StatCard label="Chuỗi ngày học" value={`${stats?.streakDays ?? 0} ngày`} plush="soc" tone="mint" index={3} />
      </div>

      <section className="progress-panel enter">
        <div className="panel-head">
          <h2>Mức hiểu theo môn · {VIEWS.find((v) => v.id === view)?.name}</h2>
          <Critter kind="gaumeo" crop size={76} className="progress-friend" />
        </div>
        <div className="skill-list">
          {subjects.map((s) => (
            <div key={s.id} className="skill-row">
              <strong>{SUBJECTS[s.id].name.replace(' – Ngữ văn', '')}</strong>
              <ProgressBar value={s.value} tone={toneOf(s.id)} label={SUBJECTS[s.id].name} />
              <small>
                {s.done}/{s.total} vững
              </small>
            </div>
          ))}
        </div>
      </section>

      <div className="section-head">
        <div>
          <h2>Bài đã học</h2>
          <p>{studied.length ? `${studied.length} bài · ${due.length ? `${due.length} bài đến hạn ôn` : 'chưa có bài cần ôn'}` : 'Chưa học bài nào — bắt đầu ngay thôi!'}</p>
        </div>
        <button className="text-btn" onClick={() => go({ name: 'parent' })}>
          Báo cáo cho phụ huynh <Icon name="next" size={16} />
        </button>
      </div>
      <div className="studied-list">
        {studied.slice(0, 12).map(({ skill, p }, i) => (
          <button key={skill.id} className="studied enter" style={{ ['--i' as string]: i }} onClick={() => go({ name: 'skill', id: skill.id })}>
            <Critter kind={plushOfSkill(skill)} crop size={54} />
            <span className="studied-text">
              <b>{skill.title}</b>
              <small>
                {SUBJECTS[skill.subject].name.replace(' – Ngữ văn', '')} · {skill.grade} · {p.status === 'mastered' ? 'Đã vững' : 'Đang học'}
              </small>
            </span>
            <span className="studied-bar">
              <ProgressBar value={p.pKnow} tone={toneOf(skill.subject)} label="Mức hiểu" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

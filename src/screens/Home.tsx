import { useEffect } from 'react'
import { SUBJECTS, type Skill } from '../core/curriculum'
import { useActiveProfile, useMyProgress, useStore, type SkillProgress } from '../core/store'
import { dueReviews, skillState } from '../core/progress'
import { defaultView, recommendIn, viewProgress, viewSkills, VIEWS, type ViewId } from '../core/views'
import { go } from '../core/router'
import { LESSON_BY_ID } from '../lessons/registry'
import { useSay, useStage } from '../components/ui'
import { Teacher } from '../components/Teacher'
import { GAME_META, GAME_PLUSH } from '../games/Games'
import type { GameKind } from '../lessons/types'
import { sfx } from '../core/sound'
import { Critter, avatarKind } from '../components/Critter'
import { Icon } from '../components/Icon'
import { LessonCard, QuickCard, TONES } from '../components/Cards'

const GAME_SUB: Record<GameKind, string> = {
  bongbay: 'Chạm quả bóng có đáp án đúng',
  cauca: 'Câu bạn nhỏ mang đáp án đúng',
  chuotchui: 'Nhanh tay chạm bạn hamster',
  latthe: 'Lật tìm hai thẻ giống nhau',
}

/** Ba bài nên học tiếp: đang học dở trước, rồi bài mới đã đủ nền, rồi bài đã vững để ôn. */
function nextUp(view: ViewId, progress: Record<string, SkillProgress>): Skill[] {
  const list = viewSkills(view)
  const rank = (s: Skill) => ({ learning: 0, available: 1, mastered: 2, locked: 3, planned: 4 })[skillState(s, progress)]
  return [...list].sort((a, b) => rank(a) - rank(b)).slice(0, 3)
}

function greeting() {
  const h = new Date().getHours()
  return h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
}

export function HomeScreen() {
  const me = useActiveProfile()
  const stage = useStage()
  const progress = useMyProgress()
  const stats = useStore((s) => (s.activeId ? s.stats[s.activeId] : undefined))
  const view: ViewId = me ? defaultView(me) : 'lop1'
  const due = dueReviews(progress)
  const next = recommendIn(view, progress)
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
  const vp = viewProgress(view, progress)
  const viewName = VIEWS.find((v) => v.id === view)?.name ?? ''
  const cards = nextUp(view, progress)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Icon name="sparkle" size={15} /> {viewName} · {vp.mastered}/{vp.total} bài đã vững
          </span>
          <h1>
            {greeting()},
            <br />
            {me.name}!
          </h1>
          <p>
            {next
              ? `Hôm nay mình cùng cô Thỏ khám phá “${next.title}” nhé. Học xong còn có trò chơi vui đang chờ!`
              : 'Con đã học hết các bài của lớp này rồi — giỏi quá! Mình ôn lại hoặc thử lớp tiếp theo nhé.'}
          </p>
          <div className="hero-actions">
            {nextLesson && (
              <button
                className="primary-btn"
                onClick={() => {
                  sfx.pop()
                  go({ name: 'lesson', id: nextLesson.id, mode: 'learn' })
                }}
              >
                Bắt đầu học <Icon name="next" size={18} />
              </button>
            )}
            {due.length > 0 ? (
              <button className="secondary-btn" onClick={() => go({ name: 'review' })}>
                <Icon name="review" size={18} /> Ôn {due.length} bài
              </button>
            ) : (
              <button className="secondary-btn" onClick={() => go({ name: 'courses' })}>
                <Icon name="book" size={18} /> Kho bài học
              </button>
            )}
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <span className="hero-ring" />
          <Teacher size={young ? 230 : 210} mood="happy" className="hero-teacher" />
          <Critter kind={avatarKind(me.avatar)} size={young ? 150 : 136} className="hero-buddy" />
        </div>
      </section>

      <div className="quick-grid">
        <QuickCard title="Chuỗi học tập" sub={`${stats?.streakDays ?? 0} ngày liên tiếp`} plush="soc" tone="sun" index={0} />
        <QuickCard title="Ngôi sao" sub={`${stats?.xp ?? 0} sao đã nhận`} plush="gautruc" tone="blue" index={1} onClick={() => go({ name: 'progress' })} />
        <QuickCard
          title={due.length ? 'Cần ôn hôm nay' : 'Ôn tập'}
          sub={due.length ? `${due.length} bài — vài phút thôi` : 'Kiến thức vẫn tươi lắm!'}
          plush="canhcut"
          tone="coral"
          index={2}
          onClick={() => go({ name: 'review' })}
        />
      </div>

      <div className="section-head">
        <div>
          <h2>Học tiếp nào</h2>
          <p>Ba hành trình đang chờ {young ? 'con' : 'em'} khám phá.</p>
        </div>
        <button className="text-btn" onClick={() => go({ name: 'courses', view })}>
          Xem tất cả <Icon name="next" size={16} />
        </button>
      </div>
      <div className="course-grid">
        {cards.map((s, i) => (
          <LessonCard key={s.id} skill={s} progress={progress} index={i} />
        ))}
      </div>

      <div className="section-head">
        <div>
          <h2>Sân chơi</h2>
          <p>Chơi mà học — câu hỏi lấy từ chính các bài {young ? 'con' : 'em'} đã học.</p>
        </div>
      </div>
      <div className="game-grid">
        {(Object.keys(GAME_META) as GameKind[]).map((k, i) => (
          <button key={k} className={`game-card tone-${TONES[(i + 2) % TONES.length]} enter`} style={{ ['--i' as string]: i }} onClick={() => go({ name: 'play', kind: k, view })}>
            <span className="game-pic">
              <Critter kind={GAME_PLUSH[k]} size={118} still className="game-plush" />
            </span>
            <span className="game-text">
              <b>{GAME_META[k].name}</b>
              <small>{GAME_SUB[k]}</small>
            </span>
            <span className="round-play" aria-hidden>
              <Icon name="play" size={16} />
            </span>
          </button>
        ))}
      </div>

      <div className="section-head">
        <div>
          <h2>Các lớp học</h2>
          <p>Từ nhà trẻ đến lớp 5 — học vượt hay ôn lại nền móng đều được.</p>
        </div>
      </div>
      <div className="grade-grid">
        {VIEWS.map((v, i) => {
          const sum = viewProgress(v.id, progress)
          const subjects = new Set(viewSkills(v.id).map((s) => s.subject))
          return (
            <button key={v.id} className={`grade-card ${v.id === view ? 'mine' : ''} enter`} style={{ ['--i' as string]: i }} onClick={() => go({ name: 'courses', view: v.id })}>
              <b>{v.name}</b>
              <small>
                {v.sub} · {sum.total} bài
              </small>
              <span className="grade-subjects">{[...subjects].map((s) => SUBJECTS[s].name.replace(' – Ngữ văn', '')).join(' · ')}</span>
              <span className="grade-bar">
                <i style={{ width: `${sum.total ? (sum.mastered / sum.total) * 100 : 0}%` }} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

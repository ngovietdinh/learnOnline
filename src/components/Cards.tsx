// Các khối giao diện dùng chung: tiêu đề trang, thẻ bài học, thẻ danh mục, thẻ số liệu, thanh tiến độ.
import type { CSSProperties, ReactNode } from 'react'
import { SUBJECTS, type Skill } from '../core/curriculum'
import type { SkillProgress } from '../core/store'
import { skillState, type SkillState } from '../core/progress'
import { LESSON_BY_ID } from '../lessons/registry'
import { go } from '../core/router'
import { sfx } from '../core/sound'
import { Critter, plushFor, type CritterKind } from './Critter'
import { Icon } from './Icon'

export type Tone = 'sun' | 'blue' | 'coral' | 'teal' | 'lilac' | 'mint'
export const TONES: Tone[] = ['sun', 'blue', 'coral', 'mint', 'lilac', 'teal']

export const STATE_LABEL: Record<SkillState, string> = {
  mastered: 'Đã vững',
  learning: 'Đang học',
  available: 'Sẵn sàng',
  locked: 'Cần học nền',
  planned: 'Đang soạn',
}

const SUBJECT_TONE: Record<string, Tone> = { toan: 'blue', ngonngu: 'sun', khoahoc: 'mint', tienganh: 'lilac', nhanthuc: 'coral' }
export const toneOf = (subject: string): Tone => SUBJECT_TONE[subject] ?? 'teal'

const stagger = (i: number) => ({ ['--i' as string]: i }) as CSSProperties

export function PageIntro({ title, sub, plush, children }: { title: ReactNode; sub?: ReactNode; plush?: CritterKind; children?: ReactNode }) {
  return (
    <header className="page-intro">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
        {children}
      </div>
      {plush && <Critter kind={plush} crop size={112} className="intro-plush" />}
    </header>
  )
}

export function ProgressBar({ value, tone = 'teal', label }: { value: number; tone?: Tone; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div className="progress-row">
      <div className={`progress-track t-${tone}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="progress-fill" style={{ ['--w' as string]: `${pct}%` }} />
      </div>
      <span>{pct}%</span>
    </div>
  )
}

function openSkill(skill: Skill, state: SkillState) {
  sfx.tap()
  const lesson = skill.lessonId ? LESSON_BY_ID[skill.lessonId] : undefined
  if (lesson && state !== 'locked') go({ name: 'lesson', id: lesson.id, mode: 'learn' })
  else go({ name: 'skill', id: skill.id })
}

export function plushOfSkill(skill: Skill): CritterKind {
  const lesson = skill.lessonId ? LESSON_BY_ID[skill.lessonId] : undefined
  return plushFor(lesson?.emoji, skill.subject, skill.id)
}

/** Thẻ "Học tiếp nào": ảnh bạn thú lớn ở đầu thẻ, tiến độ và nút tiếp tục. */
export function LessonCard({ skill, progress, index = 0 }: { skill: Skill; progress: Record<string, SkillProgress>; index?: number }) {
  const state = skillState(skill, progress)
  const p = progress[skill.id]
  const subj = SUBJECTS[skill.subject]
  const tone = TONES[index % 3]
  return (
    <article className={`course-card tone-${tone} enter`} style={stagger(index)}>
      <button className="course-visual" onClick={() => openSkill(skill, state)} aria-label={`Mở bài ${skill.title}`}>
        <Critter kind={plushOfSkill(skill)} size={190} still className="course-plush" />
      </button>
      <div className="course-body">
        <div className="course-meta">
          <span className="tag">{subj.name.replace(' – Ngữ văn', '')}</span>
          <span className={`state st-${state}`}>
            {state === 'mastered' ? <Icon name="trophy" size={14} /> : <Icon name="star" size={14} fill="currentColor" />} {STATE_LABEL[state]}
          </span>
        </div>
        <h3>{skill.title}</h3>
        <p>{skill.essence}</p>
        <ProgressBar value={p?.pKnow ?? 0} label="Mức hiểu" />
      </div>
      <button className="course-action" onClick={() => openSkill(skill, state)}>
        {p ? 'Tiếp tục bài học' : state === 'locked' ? 'Xem bài nền cần học' : 'Bắt đầu bài học'} <Icon name="next" size={18} />
      </button>
    </article>
  )
}

/** Thẻ danh mục: ảnh tròn bạn thú, tên bài, thông tin ngắn, nút phát tròn. */
export function CatalogCard({ skill, progress, index = 0 }: { skill: Skill; progress: Record<string, SkillProgress>; index?: number }) {
  const state = skillState(skill, progress)
  const p = progress[skill.id]
  const subj = SUBJECTS[skill.subject]
  const tone = toneOf(skill.subject)
  return (
    <article className={`catalog-card tone-${tone} st-${state} enter`} style={stagger(index)}>
      <button className="catalog-main" onClick={() => openSkill(skill, state)}>
        <span className="catalog-pic">
          <Critter kind={plushOfSkill(skill)} size={120} still className="catalog-plush" />
        </span>
        <span className="catalog-text">
          <h3>{skill.title}</h3>
          <p>
            {subj.name.replace(' – Ngữ văn', '')} · {skill.grade}
          </p>
          <span className={`state st-${state}`}>
            {state === 'mastered' && <Icon name="trophy" size={13} />}
            {state === 'locked' && <Icon name="lock" size={13} />} {STATE_LABEL[state]}
            {p && state !== 'mastered' ? ` · ${Math.round(p.pKnow * 100)}%` : ''}
          </span>
        </span>
      </button>
      <button className="round-play" onClick={() => openSkill(skill, state)} aria-label={`Học bài ${skill.title}`}>
        <Icon name={state === 'locked' ? 'lock' : state === 'mastered' ? 'review' : 'play'} size={18} />
      </button>
    </article>
  )
}

export function StatCard({ label, value, plush, tone = 'teal', index = 0 }: { label: string; value: ReactNode; plush: CritterKind; tone?: Tone; index?: number }) {
  return (
    <div className={`stat tone-${tone} enter`} style={stagger(index)}>
      <span>{label}</span>
      <strong>{value}</strong>
      <Critter kind={plush} crop size={104} className="stat-plush" />
    </div>
  )
}

export function QuickCard({ title, sub, plush, tone, index = 0, onClick }: { title: string; sub: ReactNode; plush: CritterKind; tone: Tone; index?: number; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`quick-card tone-${tone} enter ${onClick ? 'is-btn' : ''}`} style={stagger(index)} onClick={onClick}>
      <Critter kind={plush} crop size={52} className="quick-icon" />
      <span>
        <strong>{title}</strong>
        <span>{sub}</span>
      </span>
      {onClick && <Icon name="next" size={18} className="ico quick-go" />}
    </Tag>
  )
}

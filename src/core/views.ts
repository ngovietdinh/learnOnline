// Cách chia trang chính: Nhà trẻ · Mẫu giáo · Lớp 1 … Lớp 5.
import { SKILLS, type Skill } from './curriculum'
import { gradeForAge, stageForAge } from './stages'
import type { Profile, SkillProgress } from './store'
import { skillState } from './progress'

export type ViewId = 'mam' | 'choi' | 'lop1' | 'lop2' | 'lop3' | 'lop4' | 'lop5'

export const VIEWS: { id: ViewId; name: string; icon: string; sub: string }[] = [
  { id: 'mam', name: 'Nhà trẻ', icon: '🐣', sub: '1–3 tuổi' },
  { id: 'choi', name: 'Mẫu giáo', icon: '🐥', sub: '3–6 tuổi' },
  { id: 'lop1', name: 'Lớp 1', icon: '1️⃣', sub: '6 tuổi' },
  { id: 'lop2', name: 'Lớp 2', icon: '2️⃣', sub: '7 tuổi' },
  { id: 'lop3', name: 'Lớp 3', icon: '3️⃣', sub: '8 tuổi' },
  { id: 'lop4', name: 'Lớp 4', icon: '4️⃣', sub: '9 tuổi' },
  { id: 'lop5', name: 'Lớp 5', icon: '5️⃣', sub: '10 tuổi' },
]

export function viewSkills(v: ViewId): Skill[] {
  if (v === 'mam' || v === 'choi') return SKILLS.filter((s) => s.stage === v && s.lessonId)
  const n = Number(v.slice(3))
  return SKILLS.filter((s) => s.stage === 'tieuhoc' && s.gradeNum === n && s.lessonId)
}

export function defaultView(p: Profile): ViewId {
  const st = stageForAge(p.age)
  if (st.id === 'mam' || st.id === 'choi') return st.id
  return `lop${p.grade ?? gradeForAge(p.age)}` as ViewId
}

/** Bài nên học tiếp trong một lớp: đang học dở trước, rồi bài mới đã đủ nền. */
export function recommendIn(v: ViewId, progress: Record<string, SkillProgress>): Skill | undefined {
  const list = viewSkills(v)
  return list.find((s) => skillState(s, progress) === 'learning') ?? list.find((s) => skillState(s, progress) === 'available')
}

export function viewProgress(v: ViewId, progress: Record<string, SkillProgress>) {
  const list = viewSkills(v)
  return { total: list.length, mastered: list.filter((s) => progress[s.id]?.status === 'mastered').length }
}

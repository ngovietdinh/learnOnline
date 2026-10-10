import { SKILLS, SKILL_BY_ID, type Skill } from './curriculum'
import { isDue } from './mastery'
import { STAGE_ORDER, type StageId } from './stages'
import type { SkillProgress } from './store'

export type SkillState = 'mastered' | 'learning' | 'available' | 'locked' | 'planned'

/** Kỹ năng nền chưa có bài trong ứng dụng thì coi như học ở trường — không chặn. */
export function missingPrereqs(skill: Skill, progress: Record<string, SkillProgress>): Skill[] {
  return skill.prereqs
    .map((id) => SKILL_BY_ID[id])
    .filter((p) => p && p.lessonId && progress[p.id]?.status !== 'mastered')
}

export function skillState(skill: Skill, progress: Record<string, SkillProgress>): SkillState {
  if (!skill.lessonId) return 'planned'
  const p = progress[skill.id]
  if (p?.status === 'mastered') return 'mastered'
  if (missingPrereqs(skill, progress).length) return 'locked'
  return p ? 'learning' : 'available'
}

export function dueReviews(progress: Record<string, SkillProgress>, now = Date.now()): Skill[] {
  return SKILLS.filter((s) => {
    const p = progress[s.id]
    return s.lessonId && p?.status === 'mastered' && isDue(p.due, now)
  }).sort((a, b) => (progress[a.id].due ?? 0) - (progress[b.id].due ?? 0))
}

/** Bài nên học tiếp: ưu tiên bài đang dở, rồi bài mới đã đủ nền — trong giai đoạn của mình trước. */
export function recommend(stage: StageId, progress: Record<string, SkillProgress>): Skill | undefined {
  const order = [stage, ...STAGE_ORDER.filter((s) => s !== stage)]
  for (const want of ['learning', 'available'] as SkillState[]) {
    for (const st of order) {
      const hit = SKILLS.find((s) => s.stage === st && skillState(s, progress) === want)
      if (hit) return hit
    }
  }
  return undefined
}

export function stageSummary(stage: StageId, progress: Record<string, SkillProgress>) {
  const list = SKILLS.filter((s) => s.stage === stage)
  const playable = list.filter((s) => s.lessonId)
  return {
    total: list.length,
    playable: playable.length,
    mastered: playable.filter((s) => progress[s.id]?.status === 'mastered').length,
  }
}

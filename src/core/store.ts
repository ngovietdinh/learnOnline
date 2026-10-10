import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { addDays, REVIEW_INTERVALS, scheduleAfterReview } from './mastery'

// localStorage có thể bị chặn (chế độ ẩn danh, iframe) — khi đó vẫn chạy, chỉ không lưu.
const memory = new Map<string, string>()
const safeStorage = {
  getItem: (k: string) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return memory.get(k) ?? null
    }
  },
  setItem: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v)
    } catch {
      memory.set(k, v)
    }
  },
  removeItem: (k: string) => {
    try {
      localStorage.removeItem(k)
    } catch {
      memory.delete(k)
    }
  },
}

export interface Profile {
  id: string
  name: string
  age: number
  avatar: string
  createdAt: number
}

export interface SkillProgress {
  status: 'learning' | 'mastered'
  pKnow: number
  /** Hộp Leitner (1..6) — chỉ có khi đã vững. */
  box: number
  due?: number
  attempts: number
  lastStudied: number
  seconds: number
  /** Ngộ nhận đã gặp → số lần, để phụ huynh/giáo viên thấy chỗ cần giúp. */
  misconceptions: Record<string, number>
  /** Lời tự giải thích của học sinh ở bước "Giảng lại". */
  explanation?: string
}

export interface Settings {
  sound: boolean
  /** null = theo mặc định của lứa tuổi. */
  narrate: boolean | null
  /** null = theo mặc định của lứa tuổi. */
  music?: boolean | null
}

export interface LearnerStats {
  xp: number
  streakDays: number
  lastActiveDay?: string
  badges: string[]
}

interface State {
  profiles: Profile[]
  activeId: string | null
  progress: Record<string, Record<string, SkillProgress>>
  stats: Record<string, LearnerStats>
  settings: Settings

  addProfile: (p: Omit<Profile, 'id' | 'createdAt'>) => string
  updateProfile: (id: string, patch: Partial<Omit<Profile, 'id'>>) => void
  removeProfile: (id: string) => void
  setActive: (id: string | null) => void
  setSettings: (patch: Partial<Settings>) => void

  recordLesson: (skillId: string, r: LessonResult) => void
  recordReview: (skillId: string, allCorrect: boolean, misconceptions: string[]) => void
  addXp: (amount: number) => void
}

export interface LessonResult {
  mastered: boolean
  pKnow: number
  seconds: number
  misconceptions: string[]
  explanation?: string
}

const today = () => new Date().toISOString().slice(0, 10)

function bumpStreak(s: LearnerStats): LearnerStats {
  const t = today()
  if (s.lastActiveDay === t) return s
  const y = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  return { ...s, lastActiveDay: t, streakDays: s.lastActiveDay === y ? s.streakDays + 1 : 1 }
}

const emptyStats = (): LearnerStats => ({ xp: 0, streakDays: 0, badges: [] })

function countMisconceptions(prev: Record<string, number>, list: string[]): Record<string, number> {
  const out = { ...prev }
  for (const m of list) out[m] = (out[m] ?? 0) + 1
  return out
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeId: null,
      progress: {},
      stats: {},
      settings: { sound: true, narrate: null, music: null },

      addProfile: (p) => {
        const id = Math.random().toString(36).slice(2, 10)
        set((s) => ({
          profiles: [...s.profiles, { ...p, id, createdAt: Date.now() }],
          progress: { ...s.progress, [id]: {} },
          stats: { ...s.stats, [id]: emptyStats() },
          activeId: id,
        }))
        return id
      },
      updateProfile: (id, patch) =>
        set((s) => ({ profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removeProfile: (id) =>
        set((s) => {
          const progress = { ...s.progress }
          const stats = { ...s.stats }
          delete progress[id]
          delete stats[id]
          return {
            profiles: s.profiles.filter((p) => p.id !== id),
            progress,
            stats,
            activeId: s.activeId === id ? null : s.activeId,
          }
        }),
      setActive: (id) => set({ activeId: id }),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      recordLesson: (skillId, r) => {
        const pid = get().activeId
        if (!pid) return
        const now = Date.now()
        set((s) => {
          const mine = s.progress[pid] ?? {}
          const prev = mine[skillId]
          const wasMastered = prev?.status === 'mastered'
          const mastered = r.mastered || wasMastered
          const next: SkillProgress = {
            status: mastered ? 'mastered' : 'learning',
            pKnow: Math.max(r.pKnow, prev?.pKnow ?? 0),
            box: mastered ? Math.max(prev?.box ?? 0, 1) : 0,
            // Vừa vững: hẹn ôn sau 1 ngày. Chưa vững: hẹn học lại ngay hôm sau.
            due: addDays(now, REVIEW_INTERVALS[1]),
            attempts: (prev?.attempts ?? 0) + 1,
            lastStudied: now,
            seconds: (prev?.seconds ?? 0) + r.seconds,
            misconceptions: countMisconceptions(prev?.misconceptions ?? {}, r.misconceptions),
            explanation: r.explanation?.trim() ? r.explanation.trim() : prev?.explanation,
          }
          if (wasMastered && prev) {
            next.box = prev.box
            next.due = prev.due
          }
          const st = bumpStreak(s.stats[pid] ?? emptyStats())
          const badges = new Set(st.badges)
          if (r.mastered) badges.add(`vung:${skillId}`)
          return {
            progress: { ...s.progress, [pid]: { ...mine, [skillId]: next } },
            stats: { ...s.stats, [pid]: { ...st, badges: [...badges] } },
          }
        })
      },

      recordReview: (skillId, allCorrect, misconceptions) => {
        const pid = get().activeId
        if (!pid) return
        set((s) => {
          const mine = s.progress[pid] ?? {}
          const prev = mine[skillId]
          if (!prev) return s
          const { box, due } = scheduleAfterReview(prev.box, allCorrect, Date.now())
          return {
            progress: {
              ...s.progress,
              [pid]: {
                ...mine,
                [skillId]: {
                  ...prev,
                  box,
                  due,
                  lastStudied: Date.now(),
                  misconceptions: countMisconceptions(prev.misconceptions, misconceptions),
                },
              },
            },
            stats: { ...s.stats, [pid]: bumpStreak(s.stats[pid] ?? emptyStats()) },
          }
        })
      },

      addXp: (amount) => {
        const pid = get().activeId
        if (!pid) return
        set((s) => {
          const st = s.stats[pid] ?? emptyStats()
          return { stats: { ...s.stats, [pid]: { ...st, xp: st.xp + amount } } }
        })
      },
    }),
    {
      name: 'hoc-ban-chat',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)

export function useActiveProfile(): Profile | undefined {
  return useStore((s) => s.profiles.find((p) => p.id === s.activeId))
}

export function useMyProgress(): Record<string, SkillProgress> {
  return useStore((s) => (s.activeId ? s.progress[s.activeId] : undefined) ?? EMPTY)
}

const EMPTY: Record<string, SkillProgress> = {}

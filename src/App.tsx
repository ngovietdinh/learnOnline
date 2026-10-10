import { useEffect } from 'react'
import { useRoute, go } from './core/router'
import { useActiveProfile, useMyProgress, useStore } from './core/store'
import { stageForAge } from './core/stages'
import { setSoundEnabled } from './core/sound'
import { setNarrate } from './core/speech'
import { dueReviews } from './core/progress'
import { SKILL_BY_ID } from './core/curriculum'
import { LESSON_BY_ID } from './lessons/registry'
import { ProfilesScreen } from './screens/Profiles'
import { HomeScreen } from './screens/Home'
import { LessonPlayer } from './screens/LessonPlayer'
import { ReviewScreen } from './screens/Review'
import { CurriculumMap } from './screens/CurriculumMap'
import { SkillDetail } from './screens/SkillDetail'
import { ParentScreen } from './screens/Parent'

export default function App() {
  const route = useRoute()
  const me = useActiveProfile()
  const settings = useStore((s) => s.settings)
  const stage = stageForAge(me?.age ?? 8)

  useEffect(() => setSoundEnabled(settings.sound), [settings.sound])
  useEffect(() => setNarrate(settings.narrate ?? stage.narrate), [settings.narrate, stage.narrate])

  // Giao diện "lớn lên" cùng người học: mỗi giai đoạn một chủ đề màu, cỡ chữ, vùng chạm.
  useEffect(() => {
    document.documentElement.dataset.stage = route.name === 'profiles' || route.name === 'parent' || !me ? 'neutral' : stage.id
    document.documentElement.style.setProperty('--touch', `${stage.touchTarget}px`)
  }, [stage, me, route.name])

  const needsLearner = route.name !== 'profiles' && route.name !== 'parent' && route.name !== 'map'
  useEffect(() => {
    if (needsLearner && !me) go({ name: 'profiles' })
  }, [needsLearner, me])

  let screen
  switch (route.name) {
    case 'profiles':
      screen = <ProfilesScreen />
      break
    case 'home':
      screen = me ? <HomeScreen /> : null
      break
    case 'lesson': {
      const lesson = LESSON_BY_ID[route.id]
      const skill = lesson && SKILL_BY_ID[lesson.skillId]
      screen = me && lesson && skill ? <LessonPlayer key={`${route.id}-${route.mode}`} lesson={lesson} skill={skill} mode={route.mode} /> : <NotFound />
      break
    }
    case 'review':
      screen = me ? <ReviewScreen /> : null
      break
    case 'map':
      screen = <CurriculumMap />
      break
    case 'skill':
      screen = <SkillDetail id={route.id} />
      break
    case 'parent':
      screen = <ParentScreen />
      break
  }

  const immersive = route.name === 'lesson'
  return (
    <div className="app">
      <div className="bg-blobs" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      {!immersive && route.name !== 'profiles' && <TopBar />}
      <div className={`page ${immersive ? 'immersive' : ''}`}>{screen}</div>
    </div>
  )
}

function TopBar() {
  const me = useActiveProfile()
  const stats = useStore((s) => (s.activeId ? s.stats[s.activeId] : undefined))
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const progress = useMyProgress()
  const due = dueReviews(progress).length
  const stage = stageForAge(me?.age ?? 8)
  const narrating = settings.narrate ?? stage.narrate
  return (
    <header className="topbar">
      <button className="tb-brand" onClick={() => go({ name: me ? 'home' : 'profiles' })}>
        🌱 <span>Học Bản Chất</span>
      </button>
      <nav className="tb-nav">
        {me && (
          <button onClick={() => go({ name: 'home' })} title="Trang chính">
            🏠<span>Học</span>
          </button>
        )}
        {me && (
          <button onClick={() => go({ name: 'review' })} title="Ôn tập">
            🔁<span>Ôn tập</span>
            {due > 0 && <em className="badge">{due}</em>}
          </button>
        )}
        <button onClick={() => go({ name: 'map' })} title="Chương trình">
          🗺️<span>Chương trình</span>
        </button>
      </nav>
      <div className="tb-right">
        {me && stats && (
          <span className="tb-stats" title="Chuỗi ngày học · điểm kinh nghiệm">
            🔥{stats.streakDays} ⭐{stats.xp}
          </span>
        )}
        <button className="icon-btn" onClick={() => setSettings({ narrate: !narrating })} title={narrating ? 'Tắt đọc to' : 'Bật đọc to'}>
          {narrating ? '🗣️' : '🤐'}
        </button>
        <button className="icon-btn" onClick={() => setSettings({ sound: !settings.sound })} title={settings.sound ? 'Tắt âm thanh' : 'Bật âm thanh'}>
          {settings.sound ? '🔊' : '🔇'}
        </button>
        {me && (
          <button className="tb-avatar" onClick={() => go({ name: 'profiles' })} title="Đổi người học">
            <span>{me.avatar}</span>
            <b>{me.name}</b>
          </button>
        )}
      </div>
    </header>
  )
}

function NotFound() {
  return (
    <div className="panel center">
      <p>Không tìm thấy bài học này.</p>
      <button className="btn btn-primary" onClick={() => go({ name: 'home' })}>
        🏠 Về trang chính
      </button>
    </div>
  )
}

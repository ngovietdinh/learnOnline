import { useEffect, useState } from 'react'
import { useRoute, go } from './core/router'
import { useActiveProfile, useMyProgress, useStore } from './core/store'
import { stageForAge } from './core/stages'
import { setSoundEnabled, startMusic, stopMusic, sfx } from './core/sound'
import { canSpeak, hasVietnameseVoice, onVoicesChanged, setNarrate, setVoiceProfile } from './core/speech'
import { AmbientBackground, FxLayer } from './components/Effects'
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
  useEffect(() => setVoiceProfile(stage.voice.rate, stage.voice.pitch), [stage])

  // Nhạc nền: trình duyệt chỉ cho phát sau lần chạm đầu tiên.
  const musicOn = settings.sound && (settings.music ?? stage.music) && !!me
  useEffect(() => {
    if (!musicOn) {
      stopMusic()
      return
    }
    const go = () => startMusic()
    go()
    document.addEventListener('pointerdown', go, { once: true })
    return () => document.removeEventListener('pointerdown', go)
  }, [musicOn])

  // Giao diện "lớn lên" cùng người học: mỗi giai đoạn một chủ đề màu, cỡ chữ, vùng chạm.
  // Đặt ngay khi vẽ (không chờ effect) để nền chuyển động đọc đúng màu của giai đoạn.
  const theme = route.name === 'profiles' || route.name === 'parent' || !me ? 'neutral' : stage.id
  document.documentElement.dataset.stage = theme
  document.documentElement.style.setProperty('--touch', `${stage.touchTarget}px`)

  // Mỗi lần chuyển màn hình: tiếng "vút" nhẹ.
  useEffect(() => {
    sfx.whoosh()
  }, [route.name])

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
      <AmbientBackground stage={theme} />
      {!immersive && route.name !== 'profiles' && <TopBar />}
      <VoiceNotice />
      <div className={`page ${immersive ? 'immersive' : ''}`} key={route.name === 'lesson' ? 'lesson' : route.name}>
        {screen}
      </div>
      <FxLayer />
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
  const music = settings.music ?? stage.music
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
          <span className="tb-stats" title="Chuỗi ngày học · điểm sao">
            <span className="flame">🔥</span>
            {stats.streakDays} <span className="star-spin">⭐</span>
            <CountUp value={stats.xp} />
          </span>
        )}
        <button className="icon-btn" onClick={() => setSettings({ narrate: !narrating })} title={narrating ? 'Tắt đọc to' : 'Bật đọc to'}>
          {narrating ? '🗣️' : '🤐'}
        </button>
        <button className={`icon-btn ${music && settings.sound ? 'on' : ''}`} onClick={() => setSettings({ music: !music })} title={music ? 'Tắt nhạc nền' : 'Bật nhạc nền'} aria-label={music ? 'Tắt nhạc nền' : 'Bật nhạc nền'}>
          {music && settings.sound ? '🎵' : '🎶'}
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

/** Số đếm tăng dần — điểm sao "chạy" lên khi được cộng. */
function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(value)
  useEffect(() => {
    if (shown === value) return
    const step = Math.max(1, Math.ceil(Math.abs(value - shown) / 12))
    const t = setTimeout(() => setShown((s) => (s < value ? Math.min(value, s + step) : Math.max(value, s - step))), 30)
    return () => clearTimeout(t)
  }, [shown, value])
  return <b className={shown !== value ? 'counting' : ''}>{shown}</b>
}

/** Nhắc cài giọng đọc tiếng Việt nếu máy chưa có. */
function VoiceNotice() {
  const [missing, setMissing] = useState(false)
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem('an-nhac-giong') === '1'
    } catch {
      return false
    }
  })
  useEffect(() => {
    if (!canSpeak()) return
    // Danh sách giọng nạp chậm trên một số trình duyệt — chờ một chút rồi mới kết luận.
    const t = setTimeout(() => setMissing(!hasVietnameseVoice()), 2500)
    const off = onVoicesChanged(() => setMissing(!hasVietnameseVoice()))
    return () => {
      clearTimeout(t)
      off()
    }
  }, [])
  if (!missing || hidden) return null
  return (
    <div className="voice-notice" role="status">
      <span>🗣️</span>
      <details>
        <summary>
          Máy này chưa có <b>giọng đọc tiếng Việt</b> — bấm để xem cách bật
        </summary>
        <ul>
          <li>
            <b>Android:</b> cài "Dịch vụ chuyển văn bản thành giọng nói của Google", chọn ngôn ngữ Tiếng Việt.
          </li>
          <li>
            <b>Windows:</b> Cài đặt › Thời gian và ngôn ngữ › Giọng nói › Thêm giọng › Tiếng Việt.
          </li>
          <li>
            <b>iPhone, iPad, Mac:</b> Cài đặt › Trợ năng › Nội dung được đọc › Giọng nói › Tiếng Việt.
          </li>
          <li>Dùng Chrome hoặc Edge để có giọng đọc tự nhiên nhất.</li>
        </ul>
      </details>
      <button
        className="btn btn-ghost"
        onClick={() => {
          setHidden(true)
          try {
            localStorage.setItem('an-nhac-giong', '1')
          } catch {
            /* bỏ qua */
          }
        }}
      >
        Đã hiểu
      </button>
    </div>
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

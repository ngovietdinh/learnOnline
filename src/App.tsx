import { useEffect, useState } from 'react'
import { useRoute, go } from './core/router'
import { useActiveProfile, useMyProgress, useStore } from './core/store'
import { gradeForAge, stageForAge } from './core/stages'
import { setMusicTrack, setSoundEnabled, startMusic, stopMusic, sfx } from './core/sound'
import { canSpeak, hasRecordedVoice, hasVietnameseVoice, loadVoiceManifest, onVoicesChanged, setNarrate, setVoiceProfile, setVoiceStyle } from './core/speech'
import { FxLayer } from './components/Effects'
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
import { PlayScreen } from './screens/Play'
import type { GameKind } from './lessons/types'
import { Critter, avatarKind } from './components/Critter'
import { Icon, type IconName } from './components/Icon'
import { CoursesScreen } from './screens/Courses'
import { ProgressScreen } from './screens/Progress'

export default function App() {
  const route = useRoute()
  const me = useActiveProfile()
  const settings = useStore((s) => s.settings)
  const stage = stageForAge(me?.age ?? 8)

  useEffect(() => setSoundEnabled(settings.sound), [settings.sound])
  useEffect(() => setNarrate(settings.narrate ?? stage.narrate), [settings.narrate, stage.narrate])
  useEffect(() => {
    setVoiceProfile(stage.voice.rate, stage.voice.pitch)
    setVoiceStyle(stage.id === 'mam' || stage.id === 'choi' ? 'be' : 'hs')
  }, [stage])
  useEffect(() => {
    void loadVoiceManifest()
  }, [])

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
  const theme = !me ? 'neutral' : stage.id
  document.documentElement.dataset.stage = theme
  document.documentElement.style.setProperty('--touch', `${stage.touchTarget}px`)

  // Mỗi lần chuyển màn hình: tiếng "vút" nhẹ và đổi bản nhạc nền cho hợp.
  useEffect(() => {
    sfx.whoosh()
    setMusicTrack(route.name === 'lesson' || route.name === 'review' ? 'hoc' : route.name === 'play' ? 'choi' : 'nha')
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
    case 'play':
      screen = me ? <PlayScreen kind={route.kind as GameKind} view={route.view} /> : null
      break
    case 'courses':
      screen = me ? <CoursesScreen view={route.view} /> : null
      break
    case 'progress':
      screen = me ? <ProgressScreen /> : null
      break
  }

  const immersive = route.name === 'lesson' || route.name === 'play'
  const shell = !immersive && route.name !== 'profiles' && !!me
  return (
    <div className={`app ${shell ? 'with-shell' : ''} ${immersive ? 'is-immersive' : ''}`}>
      {shell && <Sidebar route={route.name} />}
      <main className="main">
        {shell && <TopBar />}
        <VoiceNotice />
        <div className={`page ${immersive ? 'immersive' : ''}`}>
          <div className="view-anim" key={route.name === 'lesson' ? `lesson-${route.id}` : route.name}>
            {screen}
          </div>
        </div>
      </main>
      {shell && <BottomNav route={route.name} />}
      <FxLayer />
    </div>
  )
}

type NavKey = 'home' | 'courses' | 'play' | 'review' | 'progress'
const NAV: { key: NavKey; label: string; icon: IconName; to: () => void }[] = [
  { key: 'home', label: 'Trang chủ', icon: 'home', to: () => go({ name: 'home' }) },
  { key: 'courses', label: 'Bài học', icon: 'book', to: () => go({ name: 'courses' }) },
  { key: 'play', label: 'Trò chơi', icon: 'game', to: () => go({ name: 'play', kind: 'bongbay' }) },
  { key: 'review', label: 'Ôn tập', icon: 'review', to: () => go({ name: 'review' }) },
  { key: 'progress', label: 'Tiến bộ', icon: 'chart', to: () => go({ name: 'progress' }) },
]
const activeNav = (r: string): NavKey | null =>
  r === 'home' ? 'home' : r === 'courses' || r === 'skill' || r === 'map' ? 'courses' : r === 'review' ? 'review' : r === 'progress' || r === 'parent' ? 'progress' : null

function NavButtons({ route, due }: { route: string; due: number }) {
  const on = activeNav(route)
  return (
    <>
      {NAV.map((n) => (
        <button
          key={n.key}
          className={`nav-btn ${on === n.key ? 'active' : ''}`}
          aria-current={on === n.key ? 'page' : undefined}
          onClick={() => {
            sfx.tap()
            n.to()
          }}
        >
          <Icon name={n.icon} />
          <span>{n.label}</span>
          {n.key === 'review' && due > 0 && <em className="nav-badge">{due}</em>}
        </button>
      ))}
    </>
  )
}

function Sidebar({ route }: { route: string }) {
  const me = useActiveProfile()
  const progress = useMyProgress()
  const due = dueReviews(progress).length
  return (
    <aside className="sidebar" aria-label="Điều hướng chính">
      <button className="side-brand" onClick={() => go({ name: 'home' })} aria-label="Về trang chủ">
        <Critter kind={avatarKind(me?.avatar)} crop size={52} />
        <b>Học Bản Chất</b>
      </button>
      <nav className="nav-list">
        <NavButtons route={route} due={due} />
      </nav>
      <div className="parent-card">
        <Critter kind="nhim" crop size={64} />
        <strong>Góc phụ huynh</strong>
        <p>Xem thời gian học, kỹ năng nổi bật và chỗ bé hay nhầm.</p>
        <button onClick={() => go({ name: 'parent' })}>Xem báo cáo</button>
        <button className="link" onClick={() => go({ name: 'map' })}>
          Chương trình học
        </button>
      </div>
    </aside>
  )
}

function BottomNav({ route }: { route: string }) {
  const progress = useMyProgress()
  const due = dueReviews(progress).length
  return (
    <nav className="bottom-nav" aria-label="Điều hướng">
      <NavButtons route={route} due={due} />
    </nav>
  )
}

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

function TopBar() {
  const me = useActiveProfile()
  const stats = useStore((s) => (s.activeId ? s.stats[s.activeId] : undefined))
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const stage = stageForAge(me?.age ?? 8)
  const narrating = settings.narrate ?? stage.narrate
  const music = (settings.music ?? stage.music) && settings.sound
  const now = new Date()
  const grade = stage.id === 'tieuhoc' ? `Học sinh lớp ${me?.grade ?? gradeForAge(me?.age ?? 7)}` : stage.id === 'mam' ? 'Bé nhà trẻ' : 'Bé mẫu giáo'
  return (
    <header className="topbar">
      <div className="tb-date">
        {WEEKDAYS[now.getDay()]}, {now.getDate()} tháng {now.getMonth() + 1} · <span>Một ngày thật vui để học</span>
      </div>
      <div className="tb-right">
        {stats && (
          <div className="tb-pills" title="Chuỗi ngày học · điểm sao">
            <span className="pill pill-flame">
              <Icon name="flame" size={17} /> {stats.streakDays}
            </span>
            <span className="pill pill-star">
              <Icon name="star" size={17} fill="currentColor" /> <CountUp value={stats.xp} />
            </span>
          </div>
        )}
        <div className="tb-tools">
          <button className={`tool ${narrating ? 'on' : ''}`} onClick={() => setSettings({ narrate: !narrating })} aria-label={narrating ? 'Tắt cô đọc to' : 'Bật cô đọc to'} title={narrating ? 'Tắt cô đọc to' : 'Bật cô đọc to'}>
            <Icon name={narrating ? 'voice' : 'voiceOff'} size={19} />
          </button>
          <button className={`tool ${music ? 'on' : ''}`} onClick={() => setSettings({ music: !(settings.music ?? stage.music) })} aria-label={music ? 'Tắt nhạc nền' : 'Bật nhạc nền'} title={music ? 'Tắt nhạc nền' : 'Bật nhạc nền'}>
            <Icon name={music ? 'music' : 'musicOff'} size={19} />
          </button>
          <button className={`tool ${settings.sound ? 'on' : ''}`} onClick={() => setSettings({ sound: !settings.sound })} aria-label={settings.sound ? 'Tắt âm thanh' : 'Bật âm thanh'} title={settings.sound ? 'Tắt âm thanh' : 'Bật âm thanh'}>
            <Icon name={settings.sound ? 'sound' : 'mute'} size={19} />
          </button>
        </div>
        {me && (
          <button className="profile" onClick={() => go({ name: 'profiles' })} title="Đổi người học">
            <span className="profile-copy">
              <strong>{me.name}</strong>
              <span>{grade}</span>
            </span>
            <Critter kind={avatarKind(me.avatar)} crop size={46} />
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
    const t = setTimeout(() => setMissing(!hasVietnameseVoice() && !hasRecordedVoice()), 2500)
    const off = onVoicesChanged(() => setMissing(!hasVietnameseVoice() && !hasRecordedVoice()))
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
        Về trang chủ
      </button>
    </div>
  )
}

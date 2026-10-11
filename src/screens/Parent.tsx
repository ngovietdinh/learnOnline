import { useState } from 'react'
import { SKILLS, SKILL_BY_ID } from '../core/curriculum'
import { FOCUS_STAGES, gradeForAge, stageForAge } from '../core/stages'
import { useStore, type Profile, type SkillProgress } from '../core/store'
import { dueReviews, recommend } from '../core/progress'
import { misconceptionLabel } from '../core/misconceptions'
import { go } from '../core/router'
import { ProgressRing } from '../components/ui'
import { Critter, avatarKind } from '../components/Critter'
import { Icon } from '../components/Icon'
import { PageIntro } from '../components/Cards'

const EMPTY: Record<string, SkillProgress> = {}

/** Cổng phụ huynh: một phép nhân mà trẻ nhỏ chưa làm được — tránh bé vô tình vào cài đặt. */
function ParentGate({ onPass }: { onPass: () => void }) {
  const [[a, b]] = useState(() => [6 + Math.floor(Math.random() * 4), 6 + Math.floor(Math.random() * 4)])
  const [v, setV] = useState('')
  const [err, setErr] = useState(false)
  return (
    <form
      className="panel gate"
      onSubmit={(e) => {
        e.preventDefault()
        if (Number(v) === a * b) onPass()
        else setErr(true)
      }}
    >
      <Critter kind="nhim" crop size={96} />
      <h2>Dành cho phụ huynh & giáo viên</h2>
      <label>
        Để tiếp tục, hãy tính: <b>{a} × {b} = ?</b>
        <input inputMode="numeric" value={v} onChange={(e) => setV(e.target.value)} autoFocus />
      </label>
      {err && <p className="note warn">Chưa đúng, thử lại nhé.</p>}
      <div className="btn-row">
        <button className="primary-btn">Vào <Icon name="next" size={18} /></button>
        <button type="button" className="btn btn-ghost" onClick={() => history.back()}>
          Quay lại
        </button>
      </div>
    </form>
  )
}

export function ParentScreen() {
  const [ok, setOk] = useState(false)
  const profiles = useStore((s) => s.profiles)
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  if (!ok) return <ParentGate onPass={() => setOk(true)} />
  return (
    <div className="parent">
      <PageIntro title="Báo cáo học tập" sub="Mức hiểu từng bài, lịch ôn và chỗ bé hay nhầm — để cả nhà cùng khích lệ." plush="nhim">
        <button className="text-btn" onClick={() => go({ name: 'profiles' })}>
          <Icon name="back" size={18} /> Chọn người học
        </button>
      </PageIntro>
      {!profiles.length && <p className="note">Chưa có hồ sơ nào.</p>}
      {profiles.map((p) => (
        <LearnerReport key={p.id} profile={p} />
      ))}
      <section className="panel">
        <h3><Icon name="settings" size={20} /> Cài đặt chung</h3>
        <label className="toggle">
          <input type="checkbox" checked={settings.sound} onChange={(e) => setSettings({ sound: e.target.checked })} /> Âm thanh hiệu ứng
        </label>
        <label className="toggle">
          Đọc to lời dẫn:
          <select
            value={settings.narrate === null ? 'auto' : settings.narrate ? 'on' : 'off'}
            onChange={(e) => setSettings({ narrate: e.target.value === 'auto' ? null : e.target.value === 'on' })}
          >
            <option value="auto">Tự động theo tuổi</option>
            <option value="on">Luôn bật</option>
            <option value="off">Luôn tắt</option>
          </select>
        </label>
        <label className="toggle">
          Nhạc nền vui nhộn:
          <select
            value={settings.music == null ? 'auto' : settings.music ? 'on' : 'off'}
            onChange={(e) => setSettings({ music: e.target.value === 'auto' ? null : e.target.value === 'on' })}
          >
            <option value="auto">Tự động theo tuổi (bật cho bé đến hết tiểu học)</option>
            <option value="on">Luôn bật</option>
            <option value="off">Luôn tắt</option>
          </select>
        </label>
        <p className="muted">
          Dữ liệu học tập chỉ lưu trên thiết bị này (localStorage), không gửi đi đâu. Khuyến nghị thời lượng: 1–3 tuổi ≤ 5 phút/lần và luôn có người lớn
          ngồi cùng; 3–6 tuổi ≤ 10 phút; tiểu học ≤ 20 phút; THCS–THPT 30–40 phút rồi nghỉ.
        </p>
      </section>
    </div>
  )
}

function LearnerReport({ profile }: { profile: Profile }) {
  const progress = useStore((s) => s.progress[profile.id]) ?? EMPTY
  const stats = useStore((s) => s.stats[profile.id])
  const updateProfile = useStore((s) => s.updateProfile)
  const removeProfile = useStore((s) => s.removeProfile)
  const stage = stageForAge(profile.age)
  const studied = Object.entries(progress)
    .map(([id, p]) => ({ skill: SKILL_BY_ID[id], p }))
    .filter((x) => x.skill)
  const mastered = studied.filter((x) => x.p.status === 'mastered').length
  const minutes = Math.round(studied.reduce((s, x) => s + x.p.seconds, 0) / 60)
  const mis: Record<string, number> = {}
  for (const x of studied) for (const [k, n] of Object.entries(x.p.misconceptions)) mis[k] = (mis[k] ?? 0) + n
  const topMis = Object.entries(mis)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const due = dueReviews(progress)
  const next = recommend(stage.id, progress)
  const avg = studied.length ? studied.reduce((s, x) => s + x.p.pKnow, 0) / studied.length : 0

  return (
    <section className="panel report">
      <header className="report-head">
        <Critter kind={avatarKind(profile.avatar)} crop size={64} />
        <div>
          <h3>{profile.name}</h3>
          <small>
            {profile.age} tuổi · {stage.id === 'tieuhoc' ? `Lớp ${profile.grade ?? gradeForAge(profile.age)}` : `${stage.name} (${stage.grades})`}
          </small>
        </div>
        <label className="age-edit">
          Tuổi
          <input type="number" min={1} max={11} value={profile.age} onChange={(e) => updateProfile(profile.id, { age: Math.max(1, Math.min(11, +e.target.value || 1)) })} />
        </label>
      </header>
      <div className="kpis">
        <div>
          <ProgressRing value={avg} size={58} />
          <small>Mức hiểu TB</small>
        </div>
        <div>
          <b>
            {mastered}/{SKILLS.filter((s) => s.lessonId && FOCUS_STAGES.includes(s.stage)).length}
          </b>
          <small>Bài đã vững</small>
        </div>
        <div>
          <b>{minutes}</b>
          <small>Phút học</small>
        </div>
        <div>
          <b>{stats?.streakDays ?? 0}</b>
          <small>Ngày liên tiếp</small>
        </div>
        <div>
          <b>{stats?.xp ?? 0}</b>
          <small>Điểm sao</small>
        </div>
      </div>

      {studied.length > 0 ? (
        <div className="matrix-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Kỹ năng</th>
                <th>Trạng thái</th>
                <th>Mức hiểu</th>
                <th>Ôn tiếp</th>
                <th>Lời tự giải thích</th>
              </tr>
            </thead>
            <tbody>
              {studied.map(({ skill, p }) => (
                <tr key={skill.id}>
                  <td>
                    {skill.title}
                    <small className="muted"> · {skill.grade}</small>
                  </td>
                  <td>
                    <span className={`state st-${p.status}`}>{p.status === 'mastered' ? 'Đã vững' : 'Đang học'}</span>
                  </td>
                  <td>{Math.round(p.pKnow * 100)}%</td>
                  <td>{p.due ? new Date(p.due).toLocaleDateString('vi-VN') : '—'}</td>
                  <td className="quote-cell">{p.explanation ? `“${p.explanation}”` : <span className="muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">Chưa học bài nào.</p>
      )}

      <div className="two-col">
        <div>
          <h4><Icon name="target" size={18} /> Con hay nhầm ở đâu</h4>
          {topMis.length ? (
            <ul className="mis-list">
              {topMis.map(([k, n]) => (
                <li key={k}>
                  {misconceptionLabel(k)} <b>×{n}</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Chưa ghi nhận ngộ nhận nào.</p>
          )}
        </div>
        <div>
          <h4><Icon name="bulb" size={18} /> Gợi ý cho người lớn</h4>
          <ul className="tips">
            {due.length > 0 && <li>Có {due.length} bài đến hạn ôn — chỉ mất vài phút, nên làm hôm nay.</li>}
            {next && <li>Bài nên học tiếp: <b>{next.title}</b> — {next.essence}</li>}
            {topMis[0] && <li>Hỏi con: “Vì sao lại như vậy?” xoay quanh: “{misconceptionLabel(topMis[0][0])}”.</li>}
            {stage.id === 'mam' && <li>Bé 1–3 tuổi: ngồi cùng bé, gọi tên màu/con vật ngoài đời thực sau mỗi buổi.</li>}
            <li>Khen nỗ lực và cách nghĩ (“con giải thích hay quá”), không chỉ khen điểm số.</li>
          </ul>
        </div>
      </div>
      <div className="btn-row">
        <button
          className="btn btn-ghost danger"
          onClick={() => {
            if (confirm(`Xoá hồ sơ ${profile.name} và toàn bộ tiến độ?`)) removeProfile(profile.id)
          }}
        >
          Xoá hồ sơ
        </button>
      </div>
    </section>
  )
}

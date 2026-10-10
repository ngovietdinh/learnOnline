import { useState } from 'react'
import { useStore } from '../core/store'
import { STAGES, stageForAge } from '../core/stages'
import { go } from '../core/router'
import { sfx } from '../core/sound'

const AVATARS = ['🐼', '🦊', '🐯', '🐨', '🐸', '🦄', '🐙', '🦁', '🐰', '🐧', '🐳', '🦉']

export function ProfilesScreen() {
  const profiles = useStore((s) => s.profiles)
  const setActive = useStore((s) => s.setActive)
  const [creating, setCreating] = useState(profiles.length === 0)

  return (
    <div className="profiles-screen">
      <div className="brand">
        <span className="brand-logo">🌱</span>
        <h1>Học Bản Chất</h1>
        <p>Học một lần — hiểu tận gốc. Cho bé từ 1 đến 18 tuổi.</p>
      </div>
      {!creating ? (
        <>
          <h2 className="center">Ai đang học hôm nay?</h2>
          <div className="profile-grid">
            {profiles.map((p) => {
              const st = stageForAge(p.age)
              return (
                <button
                  key={p.id}
                  className="profile-card"
                  onClick={() => {
                    sfx.pop()
                    setActive(p.id)
                    go({ name: 'home' })
                  }}
                >
                  <span className="profile-avatar">{p.avatar}</span>
                  <b>{p.name}</b>
                  <small>
                    {p.age} tuổi · {st.name}
                  </small>
                </button>
              )
            })}
            <button className="profile-card add" onClick={() => setCreating(true)}>
              <span className="profile-avatar">＋</span>
              <b>Thêm người học</b>
            </button>
          </div>
          <div className="center">
            <button className="btn btn-ghost" onClick={() => go({ name: 'parent' })}>
              👪 Góc phụ huynh & giáo viên
            </button>
          </div>
        </>
      ) : (
        <CreateProfile onDone={() => setCreating(false)} canCancel={profiles.length > 0} />
      )}
      <StagesStrip />
    </div>
  )
}

function CreateProfile({ onDone, canCancel }: { onDone: () => void; canCancel: boolean }) {
  const addProfile = useStore((s) => s.addProfile)
  const [name, setName] = useState('')
  const [age, setAge] = useState(7)
  const [avatar, setAvatar] = useState(AVATARS[1])
  const st = stageForAge(age)
  return (
    <form
      className="create-profile panel"
      onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim()) return
        addProfile({ name: name.trim(), age, avatar })
        sfx.celebrate()
        onDone()
        go({ name: 'home' })
      }}
    >
      <h2>Tạo hồ sơ người học</h2>
      <label>
        Tên gọi
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Bông" maxLength={20} autoFocus />
      </label>
      <label>
        Tuổi: <b>{age}</b>
        <input type="range" min={1} max={18} value={age} onChange={(e) => setAge(+e.target.value)} />
      </label>
      <div className={`stage-preview s-${st.id}`}>
        <span>{st.mascot}</span>
        <div>
          <b>
            Giai đoạn {st.name} ({st.grades})
          </b>
          <small>{st.tagline}</small>
          <small>
            Giao diện {st.readsAlone ? 'chữ rõ ràng' : 'hình to, đọc to mọi lời dẫn'} · phiên học ~{st.sessionMinutes} phút ·{' '}
            {st.gentleErrors ? 'không có "sai", chỉ có "thử lại"' : `luyện tập ${st.maxLevel} mức độ`}
          </small>
        </div>
      </div>
      <div className="avatar-pick" role="radiogroup" aria-label="Chọn hình đại diện">
        {AVATARS.map((a) => (
          <button type="button" key={a} role="radio" aria-checked={a === avatar} className={a === avatar ? 'on' : ''} onClick={() => setAvatar(a)}>
            {a}
          </button>
        ))}
      </div>
      <div className="btn-row">
        <button type="submit" className="btn btn-primary btn-big" disabled={!name.trim()}>
          Bắt đầu học 🚀
        </button>
        {canCancel && (
          <button type="button" className="btn btn-ghost" onClick={onDone}>
            Huỷ
          </button>
        )}
      </div>
    </form>
  )
}

function StagesStrip() {
  return (
    <div className="stages-strip">
      {STAGES.map((s) => (
        <div key={s.id} className={`stage-pill s-${s.id}`}>
          <span>{s.mascot}</span>
          <b>{s.name}</b>
          <small>
            {s.ages[0]}–{s.ages[1]} tuổi
          </small>
        </div>
      ))}
    </div>
  )
}

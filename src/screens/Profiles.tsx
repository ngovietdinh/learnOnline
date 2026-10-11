import { useState } from 'react'
import { useStore } from '../core/store'
import { FOCUS_STAGES, gradeForAge, MAX_AGE, STAGES, stageForAge } from '../core/stages'
import { go } from '../core/router'
import { sfx } from '../core/sound'
import { Critter, avatarKind } from '../components/Critter'
import { Teacher } from '../components/Teacher'
import { Icon } from '../components/Icon'

const AVATARS = ['hong', 'bacha', 'may', 'kem', 'tho', 'meo', 'cho', 'gau', 'gautruc', 'cao', 'ech', 'vit', 'canhcut', 'voi', 'sutu', 'ho', 'khi', 'koala', 'heo', 'bo', 'cuu', 'hamster', 'cu', 'gacon', 'bachtuoc', 'cavoi', 'nai', 'gaumeo', 'nhim', 'rua', 'haicau', 'doi', 'soc', 'huou']

export function ProfilesScreen() {
  const profiles = useStore((s) => s.profiles)
  const setActive = useStore((s) => s.setActive)
  const [creating, setCreating] = useState(profiles.length === 0)

  return (
    <div className="welcome">
      <section className="welcome-hero enter">
        <div>
          <span className="eyebrow">
            <Icon name="sparkle" size={15} /> Mầm non & tiểu học · 1–11 tuổi
          </span>
          <h1>Học Bản Chất</h1>
          <p>Học mà chơi, chơi mà học — hiểu tận gốc. Cô Thỏ và các bạn thú bông đồng hành cùng bé qua 125 bài học, trò chơi và giọng cô đọc.</p>
        </div>
        <div className="welcome-cast" aria-hidden>
          <Critter kind="kem" size={150} />
          <Teacher size={200} mood="happy" />
          <Critter kind="hongvui" size={150} />
        </div>
      </section>

      {!creating ? (
        <>
          <div className="section-head">
            <div>
              <h2>Ai đang học hôm nay?</h2>
              <p>Chạm vào bạn của mình để bắt đầu.</p>
            </div>
            <button className="text-btn" onClick={() => go({ name: 'parent' })}>
              <Icon name="users" size={18} /> Góc phụ huynh
            </button>
          </div>
          <div className="who-grid">
            {profiles.map((p, i) => {
              const st = stageForAge(p.age)
              return (
                <button
                  key={p.id}
                  className="who-card enter"
                  style={{ ['--i' as string]: i }}
                  onClick={() => {
                    sfx.pop()
                    setActive(p.id)
                    go({ name: 'home' })
                  }}
                >
                  <Critter kind={avatarKind(p.avatar)} crop size={110} />
                  <b>{p.name}</b>
                  <small>
                    {p.age} tuổi · {st.id === 'tieuhoc' ? `Lớp ${p.grade ?? gradeForAge(p.age)}` : st.name}
                  </small>
                </button>
              )
            })}
            <button className="who-card add enter" style={{ ['--i' as string]: profiles.length }} onClick={() => setCreating(true)}>
              <span className="add-circle">
                <Icon name="plus" size={34} />
              </span>
              <b>Thêm bé</b>
              <small>Tạo hồ sơ mới</small>
            </button>
          </div>
        </>
      ) : (
        <CreateProfile onDone={() => setCreating(false)} canCancel={profiles.length > 0} />
      )}
      <div className="welcome-foot">
        {STAGES.filter((s) => FOCUS_STAGES.includes(s.id)).map((s) => (
          <span key={s.id} className="tag">
            {s.name} · {s.ages[0]}–{s.ages[1]} tuổi
          </span>
        ))}
      </div>
    </div>
  )
}

function CreateProfile({ onDone, canCancel }: { onDone: () => void; canCancel: boolean }) {
  const addProfile = useStore((s) => s.addProfile)
  const [name, setName] = useState('')
  const [age, setAge] = useState(7)
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [grade, setGrade] = useState<number | null>(null)
  const st = stageForAge(age)
  const g = grade ?? gradeForAge(age)
  return (
    <form
      className="create-card enter"
      onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim()) return
        addProfile({ name: name.trim(), age, avatar, grade: st.id === 'tieuhoc' ? g : undefined })
        sfx.celebrate()
        onDone()
        go({ name: 'home' })
      }}
    >
      <h2>Tạo hồ sơ cho bé</h2>
      <label className="field">
        Tên gọi của bé
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Bông" maxLength={20} autoFocus />
      </label>
      <label className="field">
        <span>
          Tuổi: <span className="age-big">{age}</span>
        </span>
        <input type="range" min={1} max={MAX_AGE} value={age} onChange={(e) => (setAge(+e.target.value), setGrade(null))} />
      </label>
      {st.id === 'tieuhoc' && (
        <div className="grade-pick" role="radiogroup" aria-label="Chọn lớp">
          <b>Bé đang học:</b>
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} role="radio" aria-checked={n === g} className={`filter ${n === g ? 'active' : ''}`} onClick={() => setGrade(n)}>
              Lớp {n}
            </button>
          ))}
        </div>
      )}
      <div className="stage-note">
        <Teacher size={64} mood="happy" />
        <div>
          <b>
            Giai đoạn {st.name} ({st.grades})
          </b>
          <small>{st.tagline}</small>
          <small>
            {st.readsAlone ? 'Chữ rõ ràng' : 'Hình to, cô đọc to mọi lời dẫn'} · phiên học ~{st.sessionMinutes} phút ·{' '}
            {st.gentleErrors ? 'không có "sai", chỉ có "thử lại"' : `luyện tập ${st.maxLevel} mức độ`}
          </small>
        </div>
      </div>
      <div className="field">
        Chọn bạn đồng hành
        <div className="avatar-grid" role="radiogroup" aria-label="Chọn bạn đồng hành">
          {AVATARS.map((a) => (
            <button type="button" key={a} role="radio" aria-checked={a === avatar} className={`avatar-opt ${a === avatar ? 'on' : ''}`} onClick={() => (sfx.pop(), setAvatar(a))}>
              <Critter kind={avatarKind(a)} crop size={76} />
            </button>
          ))}
        </div>
      </div>
      <div className="btn-row">
        <button type="submit" className="primary-btn btn-big" disabled={!name.trim()}>
          Bắt đầu học <Icon name="next" size={18} />
        </button>
        {canCancel && (
          <button type="button" className="secondary-btn" onClick={onDone}>
            Huỷ
          </button>
        )}
      </div>
    </form>
  )
}

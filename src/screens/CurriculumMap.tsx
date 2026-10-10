import { useState } from 'react'
import { FRAMEWORKS, FRAMEWORK_SHORT, SKILLS, SUBJECTS, type Framework, type SubjectId } from '../core/curriculum'
import { LEVELS, STAGES } from '../core/stages'
import { useMyProgress } from '../core/store'
import { skillState } from '../core/progress'
import { go } from '../core/router'

const LOOP = [
  { icon: '❓', name: 'Tò mò', text: 'Một câu hỏi/hiện tượng làm em muốn biết — não sẵn sàng tiếp nhận.' },
  { icon: '🔍', name: 'Khám phá', text: 'Tự tay thao tác mô hình (cụ thể → hình ảnh) và tự thấy quy luật.' },
  { icon: '💎', name: 'Bản chất', text: 'Gọi tên quy luật: cái gốc là gì, VÌ SAO đúng, hình dung thế nào.' },
  { icon: '🎯', name: 'Luyện tập', text: 'Leo từ Nhận biết đến Vận dụng cao; mỗi lựa chọn sai chỉ đúng ngộ nhận.' },
  { icon: '🗣️', name: 'Giảng lại', text: 'Chọn lời giải thích đúng và tự nói lại bằng lời của mình.' },
  { icon: '🧠', name: 'Ghi nhớ', text: 'Thẻ tóm tắt + lịch ôn giãn cách 1–3–7–16–35–90 ngày.' },
]

export function CurriculumMap() {
  const progress = useMyProgress()
  const [subject, setSubject] = useState<SubjectId | 'all'>('all')
  const subjects = Object.keys(SUBJECTS) as SubjectId[]
  const shown = subject === 'all' ? subjects : [subject]
  const playable = SKILLS.filter((s) => s.lessonId).length

  return (
    <div className="map-screen">
      <h2>🗺️ Chương trình học 1–18 tuổi</h2>
      <p className="muted">
        {SKILLS.length} kỹ năng cốt lõi nối thành một đồ thị tri thức liên tục từ nhà trẻ đến lớp 12 · {playable} bài tương tác đầy đủ · bám{' '}
        {Object.keys(FRAMEWORKS).length} bộ chuẩn.
      </p>

      <section className="loop">
        <h3>Vòng "Hiểu bản chất" — mọi bài học đều theo 6 bước</h3>
        <ol className="loop-steps">
          {LOOP.map((l) => (
            <li key={l.name}>
              <span>{l.icon}</span>
              <b>{l.name}</b>
              <small>{l.text}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="levels-legend">
        <h3>4 mức độ trong mỗi kỹ năng</h3>
        <div className="chip-row">
          {LEVELS.map((l) => (
            <span key={l.level} className={`level-chip l${l.level}`}>
              Mức {l.level} · {l.name} <small>({l.hint})</small>
            </span>
          ))}
        </div>
        <p className="muted">
          Bé 1–3 tuổi dừng ở mức 1, 3–6 tuổi mức 2, tiểu học mức 3, THCS – THPT đủ 4 mức. Chỉ lên mức khi đúng liên tiếp; sai hai lần thì lùi lại củng cố.
        </p>
      </section>

      <div className="chip-row">
        <button className={`chip ${subject === 'all' ? 'now' : ''}`} onClick={() => setSubject('all')}>
          Tất cả môn
        </button>
        {subjects.map((s) => (
          <button key={s} className={`chip ${subject === s ? 'now' : ''}`} onClick={() => setSubject(s)}>
            {SUBJECTS[s].icon} {SUBJECTS[s].name}
          </button>
        ))}
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th>Môn \ Cấp</th>
              {STAGES.map((st) => (
                <th key={st.id} className={`s-${st.id}`}>
                  {st.mascot} {st.name}
                  <small>
                    {st.ages[0]}–{st.ages[1]} tuổi · {st.grades}
                  </small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((subj) => (
              <tr key={subj}>
                <th>
                  {SUBJECTS[subj].icon} {SUBJECTS[subj].name}
                </th>
                {STAGES.map((st) => (
                  <td key={st.id}>
                    {SKILLS.filter((s) => s.subject === subj && s.stage === st.id).map((s) => (
                      <button key={s.id} className={`chip st-${skillState(s, progress)}`} onClick={() => go({ name: 'skill', id: s.id })} title={s.essence}>
                        {s.lessonId ? '▶ ' : ''}
                        {s.title}
                        <small>{s.standards.map((x) => x.code).filter((c) => !c.includes('·')).join(', ')}</small>
                      </button>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="panel">
        <h3>📋 Bộ chuẩn tham chiếu</h3>
        <ul className="std-list">
          {(Object.keys(FRAMEWORKS) as Framework[]).map((f) => (
            <li key={f}>
              <span className={`fw fw-${f}`}>{FRAMEWORK_SHORT[f]}</span> {FRAMEWORKS[f]}
            </li>
          ))}
        </ul>
        <p className="muted">▶ = có bài tương tác đầy đủ. Các kỹ năng khác đã có khung chuẩn, bản chất và vị trí trong đồ thị — bài học đang được soạn theo cùng khuôn mẫu.</p>
      </section>
    </div>
  )
}

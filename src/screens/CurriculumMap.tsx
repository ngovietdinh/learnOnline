import { useState } from 'react'
import { FRAMEWORKS, FRAMEWORK_SHORT, SUBJECTS, type Framework, type SubjectId } from '../core/curriculum'
import { LEVELS } from '../core/stages'
import { viewSkills, VIEWS } from '../core/views'
import { useMyProgress } from '../core/store'
import { skillState } from '../core/progress'
import { go } from '../core/router'
import { Icon, type IconName } from '../components/Icon'
import { PageIntro } from '../components/Cards'

const LOOP: { icon: IconName; name: string; text: string }[] = [
  { icon: 'question', name: 'Tò mò', text: 'Một câu hỏi/hiện tượng làm em muốn biết — não sẵn sàng tiếp nhận.' },
  { icon: 'search', name: 'Khám phá', text: 'Tự tay thao tác mô hình (cụ thể → hình ảnh) và tự thấy quy luật.' },
  { icon: 'gem', name: 'Bản chất', text: 'Gọi tên quy luật: cái gốc là gì, VÌ SAO đúng, hình dung thế nào.' },
  { icon: 'target', name: 'Luyện tập', text: 'Leo từ Nhận biết đến Vận dụng cao; mỗi lựa chọn sai chỉ đúng ngộ nhận.' },
  { icon: 'speech', name: 'Giảng lại', text: 'Chọn lời giải thích đúng và tự nói lại bằng lời của mình.' },
  { icon: 'brain', name: 'Ghi nhớ', text: 'Thẻ tóm tắt + lịch ôn giãn cách 1–3–7–16–35–90 ngày.' },
]

export function CurriculumMap() {
  const progress = useMyProgress()
  const [subject, setSubject] = useState<SubjectId | 'all'>('all')
  const subjects = Object.keys(SUBJECTS) as SubjectId[]
  const shown = subject === 'all' ? subjects : [subject]
  const playable = VIEWS.reduce((n, v) => n + viewSkills(v.id).length, 0)

  return (
    <div className="map-screen">
      <PageIntro
        title="Chương trình học"
        sub={`${playable} bài học tương tác từ nhà trẻ đến lớp 5, nối thành một đồ thị tri thức liên tục · bám ${Object.keys(FRAMEWORKS).length} bộ chuẩn · mỗi bài có trò chơi và giọng cô đọc.`}
        plush="cu"
      />

      <section className="loop">
        <h3>Vòng "Hiểu bản chất" — mọi bài học đều theo 6 bước</h3>
        <ol className="loop-steps">
          {LOOP.map((l) => (
            <li key={l.name}>
              <span className="loop-ico">
                <Icon name={l.icon} size={22} />
              </span>
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
          Bé 1–3 tuổi dừng ở mức 1, 3–6 tuổi mức 2, tiểu học 3 mức (như Thông tư 27/2020). Chỉ lên mức khi đúng liên tiếp; sai hai lần thì lùi lại củng cố.
        </p>
      </section>

      <div className="chip-row">
        <button className={`chip ${subject === 'all' ? 'now' : ''}`} onClick={() => setSubject('all')}>
          Tất cả môn
        </button>
        {subjects.map((s) => (
          <button key={s} className={`chip ${subject === s ? 'now' : ''}`} onClick={() => setSubject(s)}>
            {SUBJECTS[s].name}
          </button>
        ))}
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th>Môn \ Lớp</th>
              {VIEWS.map((v) => (
                <th key={v.id} className={`v-${v.id}`}>
                  {v.name}
                  <small>{v.sub}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((subj) => (
              <tr key={subj}>
                <th>
                  {SUBJECTS[subj].name}
                </th>
                {VIEWS.map((v) => (
                  <td key={v.id}>
                    {viewSkills(v.id)
                      .filter((s) => s.subject === subj)
                      .map((s) => (
                        <button key={s.id} className={`chip st-${skillState(s, progress)}`} onClick={() => go({ name: 'skill', id: s.id })} title={s.essence}>
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
        <h3>Bộ chuẩn tham chiếu</h3>
        <ul className="std-list">
          {(Object.keys(FRAMEWORKS) as Framework[]).map((f) => (
            <li key={f}>
              <span className={`fw fw-${f}`}>{FRAMEWORK_SHORT[f]}</span> {FRAMEWORKS[f]}
            </li>
          ))}
        </ul>
        <p className="muted">Chạm vào một bài để xem bản chất, chuẩn tham chiếu và bài nền cần học trước.</p>
      </section>
    </div>
  )
}

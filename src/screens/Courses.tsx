import { useState } from 'react'
import { SUBJECTS, type SubjectId } from '../core/curriculum'
import { useActiveProfile, useMyProgress } from '../core/store'
import { defaultView, viewProgress, viewSkills, VIEWS, type ViewId } from '../core/views'
import { go } from '../core/router'
import { sfx } from '../core/sound'
import { CatalogCard, PageIntro } from '../components/Cards'

/** Kho bài học: chọn lớp, lọc theo môn, mỗi bài một thẻ có bạn thú và nút học. */
export function CoursesScreen({ view: initial }: { view?: string }) {
  const me = useActiveProfile()
  const progress = useMyProgress()
  const view = (VIEWS.some((v) => v.id === initial) ? initial : me ? defaultView(me) : 'lop1') as ViewId
  const [subject, setSubject] = useState<SubjectId | 'all'>('all')
  const skills = viewSkills(view)
  const subjects = (Object.keys(SUBJECTS) as SubjectId[]).filter((s) => skills.some((k) => k.subject === s))
  const shown = subject === 'all' || !subjects.includes(subject) ? skills : skills.filter((s) => s.subject === subject)
  const sum = viewProgress(view, progress)
  return (
    <div className="courses">
      <PageIntro title="Kho bài học" sub={`Chọn một chủ đề bé yêu thích và bắt đầu khám phá · ${sum.mastered}/${sum.total} bài đã vững.`} plush="cho" />
      <div className="seg" role="tablist" aria-label="Chọn lớp">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={v.id === view}
            className={`seg-btn ${v.id === view ? 'active' : ''}`}
            onClick={() => {
              sfx.tap()
              setSubject('all')
              go({ name: 'courses', view: v.id })
            }}
          >
            {v.name}
          </button>
        ))}
      </div>
      <div className="filter-row" aria-label="Lọc theo môn">
        <button className={`filter ${subject === 'all' ? 'active' : ''}`} onClick={() => setSubject('all')}>
          Tất cả <small>{skills.length}</small>
        </button>
        {subjects.map((s) => (
          <button key={s} className={`filter ${subject === s ? 'active' : ''}`} onClick={() => (sfx.tap(), setSubject(s))}>
            {SUBJECTS[s].name.replace(' – Ngữ văn', '')} <small>{skills.filter((k) => k.subject === s).length}</small>
          </button>
        ))}
      </div>
      <div className="catalog-grid" key={`${view}-${subject}`}>
        {shown.map((s, i) => (
          <CatalogCard key={s.id} skill={s} progress={progress} index={Math.min(i, 12)} />
        ))}
      </div>
    </div>
  )
}

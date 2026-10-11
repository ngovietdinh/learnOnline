import { useMemo, useState } from 'react'
import { useMyProgress, useStore } from '../core/store'
import { viewSkills, VIEWS, type ViewId } from '../core/views'
import { LESSON_BY_ID } from '../lessons/registry'
import { canPlay, GameRound, GAME_META, GAME_PLUSH } from '../games/Games'
import type { GameKind, Lesson } from '../lessons/types'
import { go } from '../core/router'
import { useStage } from '../components/ui'
import { Teacher } from '../components/Teacher'
import type { Level } from '../core/stages'
import { EmoText } from '../components/Critter'
import { Icon } from '../components/Icon'
import { Critter } from '../components/Critter'

/** Sân chơi: chơi bằng câu hỏi của các bài trong lớp đang xem — ưu tiên bài em đã học. */
export function PlayScreen({ kind, view }: { kind: GameKind; view?: string }) {
  const progress = useMyProgress()
  const stage = useStage()
  const addXp = useStore((s) => s.addXp)
  const v = (VIEWS.some((x) => x.id === view) ? view : 'choi') as ViewId
  const lessons = useMemo(() => {
    const all = viewSkills(v)
      .map((s) => LESSON_BY_ID[s.lessonId!])
      .filter((l): l is Lesson => !!l && canPlay(l, kind))
    const learned = all.filter((l) => progress[l.skillId])
    return learned.length >= 2 ? learned : all
  }, [v, kind, progress])
  const [round, setRound] = useState(0)
  const [total, setTotal] = useState(0)
  const lesson = lessons.length ? lessons[(round * 7 + 3) % lessons.length] : undefined
  const level: Level = (Math.min(stage.maxLevel, (progress[lesson?.skillId ?? '']?.status === 'mastered' ? 2 : 1)) as Level)

  return (
    <div className="play-screen">
      <header className="player-head">
        <button className="icon-close" onClick={() => go({ name: 'home' })} aria-label="Về trang chủ">
          <Icon name="close" size={20} />
        </button>
        <div className="player-title">
          <Critter kind={GAME_PLUSH[kind]} crop size={54} />
          <div>
            <h2>{GAME_META[kind].name}</h2>
            <small>
              {VIEWS.find((x) => x.id === v)?.name} · {lesson ? `Chủ đề: ${lesson.title}` : 'Chưa có bài phù hợp'} · ⭐ {total}
            </small>
          </div>
        </div>
      </header>
      <div className="game-kinds">
        {(Object.keys(GAME_META) as GameKind[]).map((k) => (
          <button key={k} className={`chip ${k === kind ? 'now' : ''}`} onClick={() => go({ name: 'play', kind: k, view: v })}>
            <EmoText text={GAME_META[k].emoji} size="1.2em" still /> {GAME_META[k].name}
          </button>
        ))}
      </div>
      {lesson ? (
        <div className="stage-card" key={`${lesson.id}-${round}-${kind}`}>
          <GameRound
            lesson={lesson}
            kind={kind}
            level={level}
            rounds={6}
            onDone={(s) => {
              addXp(s * 5)
              setTotal(total + s)
              setRound(round + 1)
            }}
          />
        </div>
      ) : (
        <div className="stage-card center">
          <Teacher size={120} mood="think" />
          <p>Trò này cần các bài có thẻ ghép đôi. Con thử trò Bóng bay hoặc chọn lớp khác nhé!</p>
        </div>
      )}
    </div>
  )
}

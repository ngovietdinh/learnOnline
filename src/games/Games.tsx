// Trò chơi xen lẫn bài học: câu hỏi lấy từ chính bài đang học → vừa chơi vừa ôn.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { GameKind, Lesson, Question } from '../lessons/types'
import type { Level } from '../core/stages'
import { sfx, setMusicTrack } from '../core/sound'
import { centerOf, fx } from '../core/fx'
import { praise, speak } from '../core/speech'
import { questionSegs, randomPoolQuestion } from '../core/script'
import { shuffle } from '../core/rng'
import { Critter, EmoText } from '../components/Critter'

export const GAME_META: Record<GameKind, { name: string; emoji: string; intro: string }> = {
  bongbay: { name: 'Bóng bay', emoji: '🎈', intro: 'Trò chơi bóng bay! Chạm vào quả bóng có đáp án đúng nào!' },
  cauca: { name: 'Câu cá', emoji: '🎣', intro: 'Trò chơi câu cá! Chạm vào chú cá mang đáp án đúng nhé!' },
  chuotchui: { name: 'Đập chuột chũi', emoji: '🐹', intro: 'Trò chơi đập chuột chũi! Chạm vào chú chuột có đáp án đúng!' },
  latthe: { name: 'Lật thẻ', emoji: '🃏', intro: 'Trò chơi lật thẻ! Tìm hai thẻ giống nhau nhé!' },
}

/** Sắc màu tươi cho bóng bay, cá: đỏ, xanh dương, vàng, xanh lá, tím, cam. */
const BRIGHT = [352, 205, 45, 140, 275, 22]
/** Các bạn dưới nước cho trò câu cá. */
const SEA = ['ca', 'cavoi', 'caheo', 'bachtuoc'] as const

/** Câu hỏi hợp để chơi: lựa chọn ngắn (hoặc là hình). */
function playable(q: Question) {
  return q.choices.length >= 2 && q.choices.every((c) => c.visual || (c.label.length > 0 && c.label.length <= 16))
}

export function gameQuestion(lesson: Lesson, level: Level, avoid?: string): Question | null {
  for (let i = 0; i < 12; i++) {
    const q = randomPoolQuestion(lesson, level, avoid)
    if (playable(q)) return q
  }
  return null
}

export function canPlay(lesson: Lesson, kind: GameKind, level: Level = 1): boolean {
  if (kind === 'latthe') return (lesson.pairs?.length ?? 0) >= 3
  return gameQuestion(lesson, level) !== null
}

export function GameRound({
  lesson,
  kind,
  level,
  rounds = 5,
  onDone,
}: {
  lesson: Lesson
  kind: GameKind
  level: Level
  rounds?: number
  onDone: (stars: number) => void
}) {
  useEffect(() => {
    setMusicTrack('choi')
    speak(GAME_META[kind].intro)
    return () => setMusicTrack('hoc')
  }, [kind])
  if (kind === 'latthe') return <Memory pairs={lesson.pairs ?? []} onDone={onDone} />
  return <TargetGame lesson={lesson} kind={kind} level={level} rounds={rounds} onDone={onDone} />
}

function Finish({ stars, of, onDone }: { stars: number; of: number; onDone: () => void }) {
  useEffect(() => {
    sfx.celebrate()
    fx.confettiRain(120)
    setTimeout(() => fx.fireworks(4, sfx.firework), 400)
    speak('Hoan hô! Con đã thắng màn chơi!')
  }, [])
  const n = Math.max(1, Math.round((stars / of) * 3))
  return (
    <div className="game-finish">
      <div className="trophy">
        <span className="trophy-rays" />
        <span className="trophy-cup">🏆</span>
      </div>
      <div className="big-stars">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < n ? 'on' : ''} style={{ animationDelay: `${0.4 + i * 0.25}s` }}>
            ⭐
          </span>
        ))}
      </div>
      <button className="btn btn-primary btn-big" onClick={onDone}>
        Tiếp tục ➜
      </button>
    </div>
  )
}

function TargetGame({ lesson, kind, level, rounds, onDone }: { lesson: Lesson; kind: Exclude<GameKind, 'latthe'>; level: Level; rounds: number; onDone: (s: number) => void }) {
  const [round, setRound] = useState(0)
  const [stars, setStars] = useState(0)
  const [q, setQ] = useState<Question | null>(() => gameQuestion(lesson, level))
  const [gone, setGone] = useState<number[]>([])
  const [missed, setMissed] = useState(false)
  const [hit, setHit] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  // Vị trí ngẫu nhiên cho từng mục tiêu, đổi mỗi câu.
  const layout = useMemo(() => shuffle(Math.random, [0, 1, 2, 3, 4, 5]), [q])

  useEffect(() => {
    if (q) speak(questionSegs(q), { queue: true })
  }, [q])

  if (finished) return <Finish stars={stars} of={rounds} onDone={() => onDone(stars)} />
  if (!q) return null

  const tap = (i: number, el: Element) => {
    if (hit !== null || gone.includes(i)) return
    const c = q.choices[i]
    const [x, y] = centerOf(el)
    if (c.correct) {
      setHit(i)
      sfx.pop()
      setTimeout(sfx.correct, 120)
      fx.burst(x, y, { count: 40, power: 1.3 })
      fx.floatText(x, y - 30, missed ? '👍' : '+1 ⭐')
      if (!missed) setStars((s) => s + 1)
      speak(praise())
      setTimeout(() => {
        if (round + 1 >= rounds) setFinished(true)
        else {
          setRound(round + 1)
          setQ(gameQuestion(lesson, level, q.prompt))
          setGone([])
          setMissed(false)
          setHit(null)
        }
      }, 1300)
    } else {
      sfx.wrong()
      fx.puff(x, y)
      setGone([...gone, i])
      setMissed(true)
      speak('Thử lại nhé!')
    }
  }

  return (
    <div className={`game game-${kind}`}>
      <div className="game-head">
        <span className="game-badge">
          <EmoText text={GAME_META[kind].emoji} size="1.2em" still /> {GAME_META[kind].name}
        </span>
        <div className="game-progress">
          {Array.from({ length: rounds }, (_, i) => (
            <i key={i} className={i < round ? 'done' : i === round ? 'now' : ''} />
          ))}
        </div>
        <span className="game-stars">⭐ {stars}</span>
      </div>
      <div className="game-prompt" key={q.prompt}>
        {q.prompt}
        {q.visual && <div className="game-visual">{q.visual}</div>}
      </div>
      <div className="game-field">
        {kind === 'chuotchui' && <div className="mole-holes">{[0, 1, 2, 3, 4, 5].map((h) => <span key={h} className="hole" style={{ ['--h' as string]: h }} />)}</div>}
        {q.choices.map((c, i) => (
          <button
            key={`${q.prompt}-${i}`}
            className={`target t-${kind} ${gone.includes(i) ? 'gone' : ''} ${hit === i ? 'hit' : ''}`}
            style={{ ['--slot' as string]: layout[i], ['--col' as string]: layout[i] % 3, ['--row' as string]: Math.floor(layout[i] / 3), ['--d' as string]: `${(i * 0.7 + layout[i] * 0.3).toFixed(2)}s`, ['--hue' as string]: BRIGHT[layout[i] % BRIGHT.length] }}
            onClick={(e) => tap(i, e.currentTarget)}
            aria-label={c.label || 'lựa chọn'}
          >
            {kind === 'bongbay' ? <span className="t-body balloon" aria-hidden /> : <span className="t-body"><Critter kind={kind === 'cauca' ? SEA[layout[i] % SEA.length] : 'hamster'} size="1.3em" /></span>}
            <span className="t-label">{c.visual ?? c.label}</span>
            {kind === 'bongbay' && <span className="t-string" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function Memory({ pairs, onDone }: { pairs: [string, string][]; onDone: (s: number) => void }) {
  const deck = useMemo(() => {
    const chosen = shuffle(Math.random, pairs).slice(0, 6)
    return shuffle(
      Math.random,
      chosen.flatMap(([a, b], i) => [
        { id: `${i}a`, pair: i, face: a },
        { id: `${i}b`, pair: i, face: b },
      ]),
    )
  }, [pairs])
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [moves, setMoves] = useState(0)
  const lock = useRef(false)
  const total = deck.length / 2
  if (matched.size === total) {
    const s = moves <= total + 2 ? 3 : moves <= total * 2 ? 2 : 1
    return <Finish stars={s} of={3} onDone={() => onDone(s)} />
  }
  return (
    <div className="game game-latthe">
      <div className="game-head">
        <span className="game-badge">🃏 Lật thẻ</span>
        <span className="game-stars">
          Cặp: {matched.size}/{total} · Lượt: {moves}
        </span>
      </div>
      <div className="memory-grid">
        {deck.map((c, i) => {
          const up = open.includes(i) || matched.has(c.pair)
          return (
            <button
              key={c.id}
              className={`mem-card ${up ? 'up' : ''} ${matched.has(c.pair) ? 'matched' : ''}`}
              onClick={(e) => {
                if (lock.current || up) return
                sfx.tap()
                const no = [...open, i]
                setOpen(no)
                if (no.length === 2) {
                  setMoves(moves + 1)
                  lock.current = true
                  const [a, b] = no
                  if (deck[a].pair === deck[b].pair) {
                    setTimeout(() => {
                      sfx.correct()
                      fx.burst(...centerOf(e.currentTarget), { count: 24 })
                      setMatched(new Set(matched).add(deck[a].pair))
                      setOpen([])
                      lock.current = false
                    }, 350)
                  } else {
                    setTimeout(() => {
                      sfx.wrong()
                      setOpen([])
                      lock.current = false
                    }, 900)
                  }
                }
              }}
            >
              <span className="mem-inner">
                <span className="mem-back">❓</span>
                <span className="mem-front"><EmoText text={c.face} /></span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

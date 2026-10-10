// Bài cho bé 1–3 tuổi: chạm – nghe – nhìn. Không có chữ bắt buộc, không có "thua".
import { useState } from 'react'
import type { ExploreProps, Lesson, Question } from './types'
import { pick, shuffle } from '../core/rng'
import { sfx } from '../core/sound'
import { centerOf, fx } from '../core/fx'

interface TapItem {
  key: string
  name: string
  emoji: string
  color: string
  say: string
}

function makeTapExplore(items: TapItem[], done: string) {
  return function TapExplore({ onDiscover, say }: ExploreProps) {
    const [seen, setSeen] = useState<Set<string>>(new Set())
    const [bouncing, setBouncing] = useState<string | null>(null)
    return (
      <div className="tap-grid">
        {items.map((it) => (
          <button
            key={it.key}
            className={`tap-card ${seen.has(it.key) ? 'seen' : ''} ${bouncing === it.key ? 'bounce' : ''}`}
            style={{ ['--c' as string]: it.color }}
            aria-label={it.name}
            onClick={(e) => {
              sfx.boing()
              const [x, y] = centerOf(e.currentTarget)
              fx.burst(x, y, { count: 24, colors: [it.color, '#ffffff', '#ffd23f'], shapes: ['star', 'circle', 'heart'] })
              say(it.say)
              setBouncing(it.key)
              setTimeout(() => setBouncing(null), 600)
              const next = new Set(seen).add(it.key)
              setSeen(next)
              if (next.size === items.length && seen.size < items.length) {
                setTimeout(() => {
                  sfx.celebrate()
                  fx.confettiRain(90)
                  say(done)
                  onDiscover()
                }, 1400)
              }
            }}
          >
            <span className="tap-emoji">{it.emoji}</span>
            <span className="tap-name">{it.name}</span>
          </button>
        ))}
      </div>
    )
  }
}

function findQuestion(items: TapItem[], ask: (t: TapItem) => string, explain: (t: TapItem) => string) {
  return (_level: 1 | 2 | 3 | 4, rng: () => number): Question => {
    const target = pick(rng, items)
    const others = shuffle(rng, items.filter((i) => i.key !== target.key)).slice(0, 1)
    return {
      level: 1,
      prompt: ask(target),
      layout: 'big',
      choices: shuffle(rng, [target, ...others]).map((it) => ({
        label: it.name,
        visual: (
          <span className="big-visual" style={{ ['--c' as string]: it.color }}>
            {it.emoji}
          </span>
        ),
        correct: it.key === target.key,
        misconception: it.key === target.key ? undefined : 'nham-doi-tuong',
        why: it.key === target.key ? undefined : `Đây là ${it.name}. Mình tìm ${target.name} nhé!`,
      })),
      explain: explain(target),
    }
  }
}

const COLORS: TapItem[] = [
  { key: 'do', name: 'màu đỏ', emoji: '🍎', color: '#ef4444', say: 'Màu đỏ! Quả táo màu đỏ.' },
  { key: 'vang', name: 'màu vàng', emoji: '🍌', color: '#facc15', say: 'Màu vàng! Quả chuối màu vàng.' },
  { key: 'xanhla', name: 'màu xanh lá', emoji: '🐸', color: '#22c55e', say: 'Màu xanh lá! Chú ếch màu xanh lá.' },
  { key: 'xanhduong', name: 'màu xanh dương', emoji: '🐳', color: '#3b82f6', say: 'Màu xanh dương! Cá voi màu xanh dương.' },
]

export const mauSac: Lesson = {
  id: 'mau-sac',
  skillId: 'mam.mau-sac',
  title: 'Màu sắc quanh em',
  emoji: '🎨',
  hook: { text: 'Bé ơi, cầu vồng có bao nhiêu là màu! Mình cùng chơi với màu nhé?', visual: <span className="hook-emoji">🌈</span> },
  explore: {
    intro: 'Bé chạm vào từng bạn để nghe tên màu nhé!',
    Component: makeTapExplore(COLORS, 'Giỏi quá! Bé đã gặp đủ các màu rồi!'),
  },
  practice: findQuestion(
    COLORS,
    (t) => `Đâu là ${t.name}?`,
    (t) => `Đúng rồi! Đây là ${t.name}.`,
  ),
  remember: ['🍎 đỏ', '🍌 vàng', '🐸 xanh lá', '🐳 xanh dương'],
}

const ANIMALS: TapItem[] = [
  { key: 'meo', name: 'con mèo', emoji: '🐱', color: '#fb923c', say: 'Con mèo kêu: meo meo!' },
  { key: 'cho', name: 'con chó', emoji: '🐶', color: '#a16207', say: 'Con chó kêu: gâu gâu!' },
  { key: 'vit', name: 'con vịt', emoji: '🦆', color: '#facc15', say: 'Con vịt kêu: cạp cạp!' },
  { key: 'ga', name: 'gà trống', emoji: '🐓', color: '#ef4444', say: 'Gà trống gáy: ò ó o!' },
  { key: 'bo', name: 'con bò', emoji: '🐮', color: '#a3a3a3', say: 'Con bò kêu: ụm bò!' },
]

const SOUND: Record<string, string> = { meo: 'meo meo', cho: 'gâu gâu', vit: 'cạp cạp', ga: 'ò ó o', bo: 'ụm bò' }

export const conVat: Lesson = {
  id: 'con-vat',
  skillId: 'mam.con-vat',
  title: 'Con vật và tiếng kêu',
  emoji: '🐾',
  hook: { text: 'Ai đang kêu thế nhỉ? Mình cùng đến thăm trang trại nhé!', visual: <span className="hook-emoji">🏡</span> },
  explore: {
    intro: 'Bé chạm vào từng con vật để nghe tiếng kêu nhé!',
    Component: makeTapExplore(ANIMALS, 'Bé giỏi quá! Bé đã nghe hết các bạn rồi!'),
  },
  practice: findQuestion(
    ANIMALS,
    (t) => `Con nào kêu ${SOUND[t.key]}?`,
    (t) => `Đúng rồi! ${t.name[0].toUpperCase() + t.name.slice(1)} kêu ${SOUND[t.key]}.`,
  ),
  remember: ['🐱 meo meo', '🐶 gâu gâu', '🦆 cạp cạp', '🐓 ò ó o', '🐮 ụm bò'],
}

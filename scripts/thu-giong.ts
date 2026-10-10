// Liệt kê MỌI câu cô giáo có thể nói → scripts/out/loi-co.json (để tạo giọng thật bằng tao-giong.py).
// Chạy: npx vite-node scripts/thu-giong.ts
// Ứng dụng tra tệp giọng theo khoá voiceKey(văn bản đọc, kiểu giọng, ngôn ngữ) — đúng như ở đây.

import { mkdirSync, writeFileSync } from 'node:fs'
import { LESSONS } from '../src/lessons/registry'
import { GAME_META } from '../src/games/Games'
import { CHEER, PRAISE, spokenText, type Seg } from '../src/core/speech'
import { voiceKey, type VoiceStyle } from '../src/core/voiceKey'
import {
  correctSegs,
  essenceSegs,
  LEVEL_UP_LINES,
  POOL,
  poolQuestion,
  questionSegs,
  rememberSegs,
  teachSegs,
  UI_LINES,
  wrongSegs,
} from '../src/core/script'
import type { Level } from '../src/core/stages'

type Line = { key: string; text: string; lang: 'vi' | 'en'; style: VoiceStyle }
const lines = new Map<string, Line>()

function add(segs: Seg | Seg[], style: VoiceStyle) {
  for (const s of Array.isArray(segs) ? segs : [segs]) {
    const { text, lang } = spokenText(s)
    if (!text) continue
    const key = voiceKey(text, style, lang)
    if (!lines.has(key)) lines.set(key, { key, text, lang, style })
  }
}

/** Kiểu giọng của bài: mầm non → giọng "bé"; lớp 1 dùng cả hai (bé 5 tuổi cũng học); lớp 2+ → học sinh. */
function stylesFor(grade: number): VoiceStyle[] {
  return grade === 0 ? ['be'] : grade === 1 ? ['be', 'hs'] : ['hs']
}
const MAX_LEVEL: Record<VoiceStyle, Level> = { be: 2, hs: 3 }

for (const style of ['be', 'hs'] as VoiceStyle[]) {
  add(PRAISE[style], style)
  add(CHEER[style], style)
  add(UI_LINES, style)
  add(LEVEL_UP_LINES, style)
  add(Object.values(GAME_META).map((g) => g.intro), style)
}

for (const l of LESSONS) {
  if (l.grade === undefined) continue
  for (const style of stylesFor(l.grade)) {
    add([l.hook.text, l.explore.intro, ...(l.explore.lines ?? [])], style)
    add(essenceSegs(l), style)
    if (l.teachBack) {
      add(teachSegs(l.teachBack), style)
      add(l.teachBack.options.map((o) => o.feedback), style)
    }
    add(rememberSegs(l, true), style)
    add(rememberSegs(l, false), style)
    add(`Bài tiếp theo: ${l.title}.`, style)
    for (let lv = 1 as Level; lv <= MAX_LEVEL[style]; lv++) {
      for (let k = 1; k <= POOL; k++) {
        const q = poolQuestion(l, lv, k)
        add(questionSegs(q), style)
        add(correctSegs(q, ''), style)
        for (const c of q.choices) add(wrongSegs(q, c, '', style === 'be'), style)
      }
    }
  }
}

const all = [...lines.values()]
mkdirSync('scripts/out', { recursive: true })
writeFileSync('scripts/out/loi-co.json', JSON.stringify(all))
const chars = all.reduce((n, x) => n + x.text.length, 0)
console.log(`${all.length} câu (${chars} ký tự): be=${all.filter((x) => x.style === 'be').length}, hs=${all.filter((x) => x.style === 'hs').length}, en=${all.filter((x) => x.lang === 'en').length}`)

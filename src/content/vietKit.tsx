// Tiếng Việt lớp 1: ghép âm đầu + vần + dấu thanh thành tiếng, đánh vần như cô dạy trên lớp.
import { useState } from 'react'
import type { ExploreProps } from '../lessons/types'
import type { Seg } from '../core/speech'
import { sfx } from '../core/sound'
import { centerOf, fx } from '../core/fx'
import type { Explore } from './kit'

export const TONES = ['ngang', 'huyền', 'sắc', 'hỏi', 'ngã', 'nặng'] as const
export type Tone = (typeof TONES)[number]
export const TONE_MARK: Record<Tone, string> = { ngang: '', huyền: '`', sắc: '´', hỏi: '?', ngã: '~', nặng: '.' }

const TABLE: Record<string, string[]> = {
  a: ['a', 'à', 'á', 'ả', 'ã', 'ạ'],
  ă: ['ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ'],
  â: ['â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ'],
  e: ['e', 'è', 'é', 'ẻ', 'ẽ', 'ẹ'],
  ê: ['ê', 'ề', 'ế', 'ể', 'ễ', 'ệ'],
  i: ['i', 'ì', 'í', 'ỉ', 'ĩ', 'ị'],
  o: ['o', 'ò', 'ó', 'ỏ', 'õ', 'ọ'],
  ô: ['ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ'],
  ơ: ['ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ'],
  u: ['u', 'ù', 'ú', 'ủ', 'ũ', 'ụ'],
  ư: ['ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự'],
  y: ['y', 'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ'],
}
const VOWELS = new Set(Object.keys(TABLE))
const HAT = new Set(['ă', 'â', 'ê', 'ô', 'ơ', 'ư'])

/** Đặt dấu thanh vào vần theo quy tắc chính tả hiện hành (SGK 2018: hoà, khoẻ, thuỷ). */
export function applyTone(rime: string, tone: Tone): string {
  const t = TONES.indexOf(tone)
  if (t === 0) return rime
  const chars = [...rime]
  const vIdx = chars.map((c, i) => (VOWELS.has(c) ? i : -1)).filter((i) => i >= 0)
  if (!vIdx.length) return rime
  let pos: number
  const hats = vIdx.filter((i) => HAT.has(chars[i]))
  const endsWithConsonant = !VOWELS.has(chars[chars.length - 1])
  if (hats.length) pos = hats[hats.length - 1]
  else if (endsWithConsonant) pos = vIdx[vIdx.length - 1]
  else if (vIdx.length === 1) pos = vIdx[0]
  else {
    const last2 = chars.slice(vIdx[vIdx.length - 2], vIdx[vIdx.length - 1] + 1).join('')
    pos = ['oa', 'oe', 'uy'].includes(last2) ? vIdx[vIdx.length - 1] : vIdx[vIdx.length - 2]
  }
  chars[pos] = TABLE[chars[pos]][t]
  return chars.join('')
}

/** Tên âm khi đánh vần: b → "bờ", k → "ca", gh → "gờ kép"… */
export const ONSET_NAME: Record<string, string> = {
  b: 'bờ', c: 'cờ', d: 'dờ', đ: 'đờ', g: 'gờ', gh: 'gờ kép', h: 'hờ', k: 'ca', l: 'lờ', m: 'mờ', n: 'nờ', p: 'pờ', r: 'rờ', s: 'sờ', t: 'tờ', v: 'vờ', x: 'xờ',
  ch: 'chờ', nh: 'nhờ', ng: 'ngờ', ngh: 'ngờ kép', ph: 'phờ', th: 'thờ', tr: 'trờ', kh: 'khờ', gi: 'giờ', qu: 'quờ',
}

export function spell(onset: string, rime: string, tone: Tone): string {
  const base = onset + rime
  const word = onset + applyTone(rime, tone)
  const name = ONSET_NAME[onset] ?? onset
  return tone === 'ngang' ? `${name}, ${rime}, ${base}.` : `${name}, ${rime}, ${base}, ${tone}, ${word}.`
}

export function syllableExplore(intro: string, onsets: string[], rimes: string[], tones: Tone[], examples: Record<string, string> = {}): Explore {
  const DONE = 'Tiếng gồm âm đầu, vần và thanh. Thay một phần là được tiếng mới!'
  function Syllable({ onDiscover, say }: ExploreProps) {
    const [o, setO] = useState(onsets[0])
    const [r, setR] = useState(rimes[0])
    const [t, setT] = useState<Tone>(tones[0])
    const [made, setMade] = useState<Set<string>>(new Set())
    const word = o + applyTone(r, t)
    const build = (el: Element) => {
      sfx.sparkle()
      fx.burst(...centerOf(el), { count: 24 })
      say(spell(o, r, t))
      setMade(new Set(made).add(word))
    }
    return (
      <div className="syl-explore">
        <div className="syl-word" key={word}>
          <span className="syl-onset">{o}</span>
          <span className="syl-rime">{applyTone(r, t)}</span>
        </div>
        {examples[word] && <div className="syl-example pop-in">{examples[word]}</div>}
        <div className="syl-picker">
          <div>
            <h5>Âm đầu</h5>
            {onsets.map((x) => (
              <button key={x} className={`chip ${x === o ? 'now' : ''}`} onClick={() => (setO(x), sfx.tap())}>
                {x}
              </button>
            ))}
          </div>
          <div>
            <h5>Vần</h5>
            {rimes.map((x) => (
              <button key={x} className={`chip ${x === r ? 'now' : ''}`} onClick={() => (setR(x), sfx.tap())}>
                {x}
              </button>
            ))}
          </div>
          <div>
            <h5>Thanh</h5>
            {tones.map((x) => (
              <button key={x} className={`chip ${x === t ? 'now' : ''}`} onClick={() => (setT(x), sfx.tap())}>
                {x} {TONE_MARK[x] && <b>{TONE_MARK[x]}</b>}
              </button>
            ))}
          </div>
        </div>
        <div className="btn-row center">
          <button className="btn btn-primary btn-big" onClick={(e) => build(e.currentTarget)}>
            🔊 Ghép và đánh vần
          </button>
          {made.size >= 3 && (
            <button
              className="btn"
              onClick={() => {
                say(DONE)
                onDiscover()
              }}
            >
              Mình hiểu rồi ➜
            </button>
          )}
        </div>
        {made.size > 0 && <p className="muted center">Em đã ghép: {[...made].join(', ')}</p>}
      </div>
    )
  }
  const lines: Seg[] = [intro, DONE]
  for (const o of onsets) for (const r of rimes) for (const t of tones) lines.push(spell(o, r, t))
  return { intro, Component: Syllable, lines }
}

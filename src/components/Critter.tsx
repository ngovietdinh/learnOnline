// Bộ thú bông 3D: mỗi bạn được nặn và phủ lông nhung trong "xưởng" scripts/thu-bong (three.js),
// chụp sẵn thành ảnh public/thu-bong/<loài>.webp (mắt mở) và <loài>-nham.webp (mắt nhắm).
// Ở đây chỉ cần xếp hai ảnh chồng lên nhau: thở nhẹ, thỉnh thoảng chớp mắt, nhún khi chạm.
import { Fragment } from 'react'

export const ALL_CRITTERS = [
  'gau', 'meo', 'cho', 'tho', 'gautruc', 'koala', 'ho', 'sutu', 'cao', 'heo', 'bo', 'de', 'cuu', 'chuot', 'hamster', 'khi',
  'ngua', 'kylan', 'voi', 'ga', 'gacon', 'vit', 'chim', 'vet', 'cu', 'canhcut', 'ech', 'ca', 'cavoi', 'caheo', 'bachtuoc',
  // hai bạn đồng hành: Bông Xù (lông dài) và Thạch (trong veo)
  'xu', 'thach',
  // các bạn đồng hành lông ngắn mặt kem (bộ thiết kế riêng): Hồng, Bạc Hà, Mây, Kem; Hồng giơ tay mừng
  'hong', 'bacha', 'may', 'kem', 'hongvui',
  // thêm từ bộ thiết kế con vật: nai, gấu mèo, nhím, rùa, hải cẩu, dơi, sóc, hươu cao cổ
  'nai', 'gaumeo', 'nhim', 'rua', 'haicau', 'doi', 'soc', 'huou',
] as const
export type CritterKind = (typeof ALL_CRITTERS)[number]

/** Các bạn đồng hành bé có thể chọn; bạn được chọn sẽ chào bé ở trang chính. */
export const BUDDIES = ['hong', 'bacha', 'may', 'kem'] as const
/** Bạn thú dùng làm ảnh đại diện (ảnh đại diện cũ là biểu tượng con vật cũng đổi được). */
export const avatarKind = (avatar?: string): CritterKind => (avatar && critterFor(avatar)) || 'hong'
export const buddyOf = (avatar?: string): CritterKind => ((BUDDIES as readonly string[]).includes(avatar ?? '') ? (avatar as CritterKind) : 'hong')

/** Biểu tượng cảm xúc → bạn thú bông tương ứng. */
export const CRITTER_BY_EMOJI: Record<string, CritterKind> = {
  '🐱': 'meo', '🐈': 'meo', '🐶': 'cho', '🐕': 'cho', '🐩': 'cho', '🐰': 'tho', '🐇': 'tho', '🐻': 'gau', '🐼': 'gautruc', '🐨': 'koala',
  '🐯': 'ho', '🐅': 'ho', '🦁': 'sutu', '🦊': 'cao', '🐷': 'heo', '🐖': 'heo', '🐮': 'bo', '🐄': 'bo', '🐭': 'chuot', '🐁': 'chuot',
  '🐹': 'hamster', '🐵': 'khi', '🐒': 'khi', '🐑': 'cuu', '🐐': 'de', '🐴': 'ngua', '🐎': 'ngua', '🦄': 'kylan', '🐘': 'voi',
  '🐔': 'gacon', '🐓': 'gacon', '🐤': 'gacon', '🐥': 'gacon', '🐣': 'gacon', '🦆': 'vit', '🐦': 'chim', '🦜': 'vet', '🦉': 'cu',
  '🐧': 'canhcut', '🐸': 'ech', '🐟': 'ca', '🐠': 'ca', '🐳': 'cavoi', '🐋': 'cavoi', '🐬': 'caheo', '🐙': 'bachtuoc',
  '🦌': 'nai', '🦝': 'gaumeo', '🦔': 'nhim', '🐢': 'rua', '🦭': 'haicau', '🦇': 'doi', '🐿': 'soc', '🦒': 'huou',
}

const KIND_SET = new Set<string>(ALL_CRITTERS)
/** Biểu tượng con vật, hoặc tên bạn thú (VD "xu", "thach" — dùng làm ảnh đại diện). */
export const critterFor = (emoji: string): CritterKind | undefined => {
  const e = emoji.replace(/\uFE0F/g, '').trim()
  return CRITTER_BY_EMOJI[e] ?? (KIND_SET.has(e) ? (e as CritterKind) : undefined)
}

/** Bản đóng gói một tệp có thể nhúng sẵn ảnh (window.__THU_BONG); bình thường lấy từ thư mục thu-bong/. */
function src(kind: CritterKind, closed: boolean) {
  const name = `${kind}${closed ? '-nham' : ''}`
  const inline = (globalThis as { __THU_BONG?: Record<string, string> }).__THU_BONG
  return inline?.[name] ?? `thu-bong/${name}.webp`
}

/** Bạn thú đại diện cho mỗi môn — chọn theo bài để các thẻ không trùng nhau. */
const SUBJECT_PLUSH: Record<string, CritterKind[]> = {
  toan: ['gau', 'voi', 'sutu', 'koala', 'hamster', 'nhim', 'gautruc'],
  ngonngu: ['huou', 'soc', 'cuu', 'gaumeo', 'meo', 'cho'],
  khoahoc: ['ech', 'rua', 'nai', 'haicau', 'vit', 'cavoi'],
  tienganh: ['cu', 'canhcut', 'doi', 'bachtuoc', 'khi'],
  nhanthuc: ['cao', 'heo', 'bo', 'gacon', 'ho', 'tho'],
}
/** Bạn thú cho một bài: con vật trong biểu tượng bài nếu có, không thì bạn thú của môn. */
export function plushFor(emoji: string | undefined, subject: string, seed = ''): CritterKind {
  const own = emoji ? critterFor(emoji) : undefined
  if (own && !['ca', 'caheo', 'chim', 'vet', 'ngua', 'kylan', 'de', 'chuot', 'ga', 'xu', 'thach'].includes(own)) return own
  const pool = SUBJECT_PLUSH[subject] ?? SUBJECT_PLUSH.nhanthuc
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return pool[h % pool.length]
}

export type Mood = 'idle' | 'happy' | 'sad'

/**
 * Một bạn thú bông. `size`: số (px) hoặc chuỗi CSS (VD "1.5em" để đứng trong dòng chữ).
 * `still`: đứng yên (dùng khi có rất nhiều bạn cùng lúc). `mood="happy"`: nhắm mắt cười.
 */
export function Critter({
  kind,
  size = 96,
  mood = 'idle',
  still = false,
  crop = false,
  label,
  className = '',
}: {
  kind: CritterKind
  size?: number | string
  mood?: Mood
  still?: boolean
  /** Khung tròn chỉ thấy phần đầu — như ảnh đại diện. */
  crop?: boolean
  label?: string
  className?: string
}) {
  const s = typeof size === 'number' ? `${size}px` : size
  const delay = ((kind.length * 7 + kind.charCodeAt(0)) % 9) * 0.41
  return (
    <span
      className={`critter c-${kind} mood-${mood} ${still ? 'still' : ''} ${crop ? 'crop' : ''} ${className}`}
      style={{ width: s, height: s, ['--cd' as string]: `${delay.toFixed(2)}s` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <img className="c-open" src={src(kind, false)} alt="" draggable={false} decoding="async" />
      {!still && <img className="c-closed" src={src(kind, true)} alt="" draggable={false} decoding="async" />}
    </span>
  )
}

/** Hiện biểu tượng: nếu là con vật thì thay bằng bạn thú bông, còn lại giữ nguyên biểu tượng. */
export function Emo({ e, size = '1.9em', mood, still }: { e: string; size?: number | string; mood?: Mood; still?: boolean }) {
  const k = critterFor(e)
  return k ? <Critter kind={k} size={size} mood={mood} still={still} className="inline" /> : <>{e}</>
}

type Seg = { segment: (t: string) => Iterable<{ segment: string }> }
const SegCtor = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: 'grapheme' }) => Seg }).Segmenter
const seg = SegCtor ? new SegCtor('vi', { granularity: 'grapheme' }) : null

/** Chuỗi có lẫn biểu tượng (VD "🐱🐶", "🦉 Cú"): thay từng con vật bằng thú bông. */
export function EmoText({ text, size = '1.9em', still }: { text: string; size?: number | string; still?: boolean }) {
  const whole = critterFor(text)
  if (whole) return <Critter kind={whole} size={size} still={still} className="inline" />
  const parts = seg ? Array.from(seg.segment(text), (x) => x.segment) : Array.from(text)
  if (!parts.some((p) => critterFor(p))) return <>{text}</>
  return (
    <>
      {parts.map((p, i) => {
        const k = critterFor(p)
        return k ? <Critter key={i} kind={k} size={size} still={still} className="inline" /> : <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}

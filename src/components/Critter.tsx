// Bộ thú bông: các bạn thú tròn mềm như gấu bông — lông mịn, mắt to long lanh, má hồng, đường may.
// Vẽ hoàn toàn bằng SVG (không cần ảnh): biết thở, chớp mắt, vẫy tai, ngoe nguẩy đuôi, nhún khi chạm.
import { Fragment, useId, type ReactNode } from 'react'

export type CritterKind =
  | 'meo' | 'cho' | 'tho' | 'gau' | 'gautruc' | 'koala' | 'ho' | 'sutu' | 'cao' | 'heo' | 'bo' | 'chuot' | 'hamster'
  | 'khi' | 'cuu' | 'de' | 'chim' | 'vet' | 'ngua' | 'kylan' | 'voi' | 'ga' | 'gacon' | 'vit' | 'cu' | 'canhcut' | 'ech' | 'ca' | 'cavoi' | 'caheo' | 'bachtuoc'

type Ear = 'tron' | 'meo' | 'cao' | 'tho' | 'cup' | 'heo' | 'bo' | 'cuu' | 'voi' | 'ngua' | 'khi' | 'chuot' | 'none'
type Nose = 'tamgiac' | 'to' | 'heo' | 'bo' | 'nho' | 'none'

interface Mammal {
  type: 'thu'
  c: [light: string, base: string, dark: string]
  belly: string
  inner: string
  ear: Ear
  nose: Nose
  muzzle?: string
  tail?: 'tron' | 'dai' | 'cao' | 'xoan' | 'bom' | 'none'
  extra?: 'vang' | 'soc' | 'mat' | 'dom' | 'bom' | 'sung' | 'vi' | 'mat-khi' | 'sung-bo' | 'mong'
}
interface Bird {
  type: 'chim'
  c: [string, string, string]
  belly: string
  beak: 'nhon' | 'det'
  extra?: 'mao' | 'toc' | 'cu' | 'canhcut'
}
type Spec = Mammal | Bird | { type: 'ech' | 'ca' | 'cavoi' | 'caheo' | 'bachtuoc'; c: [string, string, string]; belly: string }

const SPEC: Record<CritterKind, Spec> = {
  meo: { type: 'thu', c: ['#ffd9a8', '#ffb35c', '#e98a2e'], belly: '#fff3e2', inner: '#ffb3c1', ear: 'meo', nose: 'tamgiac', tail: 'dai', extra: 'soc' },
  cho: { type: 'thu', c: ['#f5e1c8', '#dcb98f', '#b8916a'], belly: '#fff8ee', inner: '#a8805c', ear: 'cup', nose: 'to', muzzle: '#fff8ee', tail: 'tron' },
  tho: { type: 'thu', c: ['#ffffff', '#f4eefc', '#d9cdeb'], belly: '#ffffff', inner: '#ffb7cf', ear: 'tho', nose: 'nho', tail: 'bom' },
  gau: { type: 'thu', c: ['#d9a77a', '#b07a4f', '#8a5a35'], belly: '#f3d6b5', inner: '#f3d6b5', ear: 'tron', nose: 'to', muzzle: '#f3d6b5', tail: 'none' },
  gautruc: { type: 'thu', c: ['#ffffff', '#f6f6f6', '#dcdcdc'], belly: '#ffffff', inner: '#3a3a44', ear: 'tron', nose: 'to', muzzle: '#ffffff', tail: 'none', extra: 'mat' },
  koala: { type: 'thu', c: ['#d4dbe4', '#aeb8c6', '#8693a5'], belly: '#eef1f5', inner: '#f2f4f8', ear: 'chuot', nose: 'to', tail: 'none' },
  ho: { type: 'thu', c: ['#ffc77d', '#ff9f3d', '#e07a1c'], belly: '#fff6e8', inner: '#fff1dc', ear: 'tron', nose: 'tamgiac', muzzle: '#fff6e8', tail: 'dai', extra: 'soc' },
  sutu: { type: 'thu', c: ['#ffe2a1', '#ffc65c', '#e6a23a'], belly: '#fff4d9', inner: '#ffe2a1', ear: 'tron', nose: 'tamgiac', muzzle: '#fff4d9', tail: 'dai', extra: 'vang' },
  cao: { type: 'thu', c: ['#ffb27a', '#ff8a3d', '#e2661c'], belly: '#ffffff', inner: '#ffffff', ear: 'cao', nose: 'tamgiac', muzzle: '#ffffff', tail: 'cao' },
  heo: { type: 'thu', c: ['#ffd6e2', '#ffb3c9', '#f28fae'], belly: '#ffe8ef', inner: '#f28fae', ear: 'heo', nose: 'heo', tail: 'xoan' },
  bo: { type: 'thu', c: ['#ffffff', '#f7f3f0', '#ddd3cc'], belly: '#ffffff', inner: '#ffc2cf', ear: 'bo', nose: 'bo', tail: 'dai', extra: 'sung-bo' },
  chuot: { type: 'thu', c: ['#e5e3ef', '#c8c4d9', '#a29db9'], belly: '#f6f5fb', inner: '#ffc0d3', ear: 'chuot', nose: 'nho', tail: 'xoan' },
  hamster: { type: 'thu', c: ['#ffe0b8', '#ffc98a', '#eaa55d'], belly: '#fff8ee', inner: '#ffc0c8', ear: 'tron', nose: 'nho', muzzle: '#fff8ee', tail: 'none' },
  khi: { type: 'thu', c: ['#c99a74', '#a8744c', '#7f5233'], belly: '#f7dcc0', inner: '#f7dcc0', ear: 'khi', nose: 'none', tail: 'xoan', extra: 'mat-khi' },
  cuu: { type: 'thu', c: ['#ffffff', '#fbf8f2', '#e2dccf'], belly: '#fff', inner: '#ffd2c2', ear: 'cuu', nose: 'nho', tail: 'bom', extra: 'bom' },
  de: { type: 'thu', c: ['#f6ead8', '#e0c7a2', '#bc9e76'], belly: '#fdf6ec', inner: '#ffd2c2', ear: 'bo', nose: 'bo', tail: 'bom', extra: 'sung-bo' },
  ngua: { type: 'thu', c: ['#d6a27a', '#b9805a', '#93603d'], belly: '#f0d2b8', inner: '#f0d2b8', ear: 'ngua', nose: 'bo', tail: 'dai', extra: 'mong' },
  kylan: { type: 'thu', c: ['#ffffff', '#fbf4ff', '#e3d3f2'], belly: '#ffffff', inner: '#ffc6e3', ear: 'ngua', nose: 'nho', tail: 'dai', extra: 'sung' },
  voi: { type: 'thu', c: ['#c9d3e6', '#a9b6d1', '#8594b5'], belly: '#e2e8f3', inner: '#ffc6d6', ear: 'voi', nose: 'none', tail: 'none', extra: 'vi' },
  ga: { type: 'chim', c: ['#ffffff', '#fbf7f2', '#e5dccf'], belly: '#ffffff', beak: 'nhon', extra: 'mao' },
  gacon: { type: 'chim', c: ['#fff3a3', '#ffe14d', '#f5c400'], belly: '#fff8c9', beak: 'nhon', extra: 'toc' },
  vit: { type: 'chim', c: ['#fff6b5', '#ffe766', '#f2c92e'], belly: '#fffbe0', beak: 'det', extra: 'toc' },
  cu: { type: 'chim', c: ['#c9a27e', '#a47a55', '#7c5636'], belly: '#f3dfc6', beak: 'nhon', extra: 'cu' },
  chim: { type: 'chim', c: ['#a8dcff', '#6cbcf7', '#3f95d9'], belly: '#eaf6ff', beak: 'nhon', extra: 'toc' },
  vet: { type: 'chim', c: ['#b9f08c', '#6fd64a', '#3faa2a'], belly: '#fff3a8', beak: 'nhon', extra: 'toc' },
  canhcut: { type: 'chim', c: ['#5c6680', '#3c4560', '#262d42'], belly: '#ffffff', beak: 'nhon', extra: 'canhcut' },
  ech: { type: 'ech', c: ['#b6f08a', '#7fd65a', '#4fae35'], belly: '#eaffd2' },
  ca: { type: 'ca', c: ['#ffcf7a', '#ff9f3d', '#f27522'], belly: '#fff2d6' },
  cavoi: { type: 'cavoi', c: ['#9fd6ff', '#5fb4f5', '#3a8fd6'], belly: '#e5f5ff' },
  caheo: { type: 'caheo', c: ['#c7dcf5', '#93b6e3', '#6a8fc4'], belly: '#eef5ff' },
  bachtuoc: { type: 'bachtuoc', c: ['#ffc2e6', '#ff8fcf', '#e566ad'], belly: '#ffe3f3' },
}

/** Biểu tượng cảm xúc → bạn thú bông tương ứng. */
export const CRITTER_BY_EMOJI: Record<string, CritterKind> = {
  '🐱': 'meo', '🐈': 'meo', '🐶': 'cho', '🐕': 'cho', '🐩': 'cho', '🐰': 'tho', '🐇': 'tho', '🐻': 'gau', '🐼': 'gautruc', '🐨': 'koala',
  '🐯': 'ho', '🐅': 'ho', '🦁': 'sutu', '🦊': 'cao', '🐷': 'heo', '🐖': 'heo', '🐮': 'bo', '🐄': 'bo', '🐭': 'chuot', '🐁': 'chuot',
  '🐹': 'hamster', '🐵': 'khi', '🐒': 'khi', '🐑': 'cuu', '🐐': 'de', '🐦': 'chim', '🦜': 'vet', '🐴': 'ngua', '🐎': 'ngua', '🦄': 'kylan', '🐘': 'voi',
  '🐔': 'ga', '🐓': 'ga', '🐤': 'gacon', '🐥': 'gacon', '🐣': 'gacon', '🦆': 'vit', '🦉': 'cu', '🐧': 'canhcut', '🐸': 'ech',
  '🐟': 'ca', '🐠': 'ca', '🐳': 'cavoi', '🐋': 'cavoi', '🐬': 'caheo', '🐙': 'bachtuoc',
}

export const critterFor = (emoji: string): CritterKind | undefined => CRITTER_BY_EMOJI[emoji.replace(/️/g, '').trim()]

// ───────────────────────── Các bộ phận dùng chung ─────────────────────────

function Eyes({ y = 96, gap = 25, mood, r = 1 }: { y?: number; gap?: number; mood: Mood; r?: number }) {
  if (mood === 'happy')
    return (
      <g className="c-eyes" fill="none" stroke="#2b1d33" strokeWidth={5} strokeLinecap="round">
        <path d={`M${100 - gap - 9} ${y + 3} Q${100 - gap} ${y - 9} ${100 - gap + 9} ${y + 3}`} />
        <path d={`M${100 + gap - 9} ${y + 3} Q${100 + gap} ${y - 9} ${100 + gap + 9} ${y + 3}`} />
      </g>
    )
  return (
    <g className="c-eyes">
      {[-1, 1].map((s) => {
        const x = 100 + s * gap
        return (
          <g key={s}>
            <ellipse cx={x} cy={y} rx={10.5 * r} ry={12.5 * r} fill="#2b1d33" />
            <ellipse cx={x} cy={y + 4 * r} rx={7 * r} ry={6 * r} fill="#5a3f6e" opacity={0.75} />
            <circle cx={x + 3.6 * r} cy={y - 4.6 * r} r={4.3 * r} fill="#fff" />
            <circle cx={x - 3.8 * r} cy={y + 4.8 * r} r={1.9 * r} fill="#fff" opacity={0.9} />
            {mood === 'sad' && <path d={`M${x - 12} ${y - 17 - s * 3} L${x + 10} ${y - 17 + s * 3}`} stroke="#2b1d33" strokeWidth={3.5} strokeLinecap="round" />}
          </g>
        )
      })}
    </g>
  )
}

function Cheeks({ y = 114, gap = 40, color = '#ff8fab' }: { y?: number; gap?: number; color?: string }) {
  return (
    <g className="c-cheeks" opacity={0.55}>
      <ellipse cx={100 - gap} cy={y} rx={11} ry={7} fill={color} />
      <ellipse cx={100 + gap} cy={y} rx={11} ry={7} fill={color} />
    </g>
  )
}

function Mouth({ y = 116, mood, w = 7 }: { y?: number; mood: Mood; w?: number }) {
  if (mood === 'happy') return <path d={`M${100 - w - 3} ${y - 2} Q100 ${y + 14} ${100 + w + 3} ${y - 2} Z`} fill="#c23a5c" stroke="#2b1d33" strokeWidth={2.5} strokeLinejoin="round" />
  if (mood === 'sad') return <path d={`M${100 - w} ${y + 5} Q100 ${y - 3} ${100 + w} ${y + 5}`} fill="none" stroke="#2b1d33" strokeWidth={3} strokeLinecap="round" />
  return <path d={`M${100 - w} ${y} Q${100 - w / 2} ${y + 6} 100 ${y} Q${100 + w / 2} ${y + 6} ${100 + w} ${y}`} fill="none" stroke="#2b1d33" strokeWidth={2.8} strokeLinecap="round" />
}

/** Đường may chỉ nổi — nét đặc trưng của thú bông. */
const stitch = { fill: 'none', stroke: 'rgb(90 60 60 / 0.28)', strokeWidth: 1.6, strokeDasharray: '4 3.5', strokeLinecap: 'round' as const }

function Shadow() {
  return <ellipse cx={100} cy={191} rx={54} ry={7} fill="rgb(40 20 60 / 0.16)" />
}

// ───────────────────────── Thú bốn chân (dáng ngồi, đầu to) ─────────────────────────

function MammalArt({ s, u, mood }: { s: Mammal; u: (k: string) => string; mood: Mood }) {
  const [light, , dark] = s.c
  const fur = `url(#${u('fur')})`
  const ears = (() => {
    switch (s.ear) {
      case 'tron':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <circle cx={100 + k * 50} cy={44} r={23} fill={s.extra === 'mat' ? '#3a3a44' : fur} />
            <circle cx={100 + k * 50} cy={46} r={12} fill={s.inner} />
          </g>
        ))
      case 'chuot':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <circle cx={100 + k * 54} cy={48} r={32} fill={fur} />
            <circle cx={100 + k * 54} cy={50} r={20} fill={s.inner} />
          </g>
        ))
      case 'meo':
      case 'cao': {
        const tall = s.ear === 'cao' ? 16 : 0
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <path d={`M${100 + k * 62} ${62} Q${100 + k * 64} ${14 - tall} ${100 + k * 40} ${24 - tall / 2} Q${100 + k * 24} ${34} ${100 + k * 18} ${46} Z`} fill={fur} />
            <path d={`M${100 + k * 54} ${54} Q${100 + k * 56} ${28 - tall} ${100 + k * 40} ${34 - tall / 2} Q${100 + k * 30} ${40} ${100 + k * 28} ${48} Z`} fill={s.ear === 'cao' ? '#3a2a2a' : s.inner} opacity={s.ear === 'cao' ? 0.85 : 1} />
          </g>
        ))
      }
      case 'tho':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <ellipse cx={100 + k * 26} cy={22} rx={15} ry={40} fill={fur} transform={`rotate(${k * 12} ${100 + k * 26} 50)`} />
            <ellipse cx={100 + k * 26} cy={24} rx={8} ry={30} fill={s.inner} transform={`rotate(${k * 12} ${100 + k * 26} 50)`} />
          </g>
        ))
      case 'heo':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <path d={`M${100 + k * 58} ${56} Q${100 + k * 66} ${22} ${100 + k * 36} ${30} Q${100 + k * 30} ${44} ${100 + k * 34} ${52} Z`} fill={fur} />
            <path d={`M${100 + k * 52} ${50} Q${100 + k * 56} ${32} ${100 + k * 40} ${36} Z`} fill={s.inner} />
          </g>
        ))
      case 'ngua':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <path d={`M${100 + k * 46} ${50} Q${100 + k * 50} ${10} ${100 + k * 30} ${26} Q${100 + k * 24} ${38} ${100 + k * 26} ${44} Z`} fill={fur} />
            <path d={`M${100 + k * 42} ${46} Q${100 + k * 44} ${22} ${100 + k * 32} ${32} Z`} fill={s.inner} />
          </g>
        ))
      case 'bo':
      case 'cuu':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <ellipse cx={100 + k * 66} cy={72} rx={22} ry={11} fill={s.ear === 'cuu' ? '#f3ddd0' : fur} transform={`rotate(${k * 18} ${100 + k * 66} 72)`} />
            <ellipse cx={100 + k * 68} cy={73} rx={13} ry={5.5} fill={s.inner} transform={`rotate(${k * 18} ${100 + k * 68} 73)`} />
          </g>
        ))
      case 'voi':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <ellipse cx={100 + k * 62} cy={86} rx={38} ry={44} fill={fur} />
            <ellipse cx={100 + k * 66} cy={88} rx={24} ry={30} fill={s.inner} opacity={0.8} />
          </g>
        ))
      case 'khi':
        return [-1, 1].map((k) => (
          <g key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'}>
            <circle cx={100 + k * 64} cy={88} r={19} fill={fur} />
            <circle cx={100 + k * 64} cy={88} r={11} fill={s.inner} />
          </g>
        ))
      default:
        return null
    }
  })()
  const floppy =
    s.ear === 'cup'
      ? [-1, 1].map((k) => (
          <ellipse key={k} className={k < 0 ? 'c-ear-l' : 'c-ear-r'} cx={100 + k * 58} cy={82} rx={17} ry={34} fill={s.inner} transform={`rotate(${k * -14} ${100 + k * 58} 54)`} />
        ))
      : null
  const tail = (() => {
    switch (s.tail) {
      case 'tron':
        return <ellipse cx={152} cy={168} rx={12} ry={18} fill={fur} transform="rotate(35 152 168)" />
      case 'bom':
        return <circle cx={150} cy={172} r={13} fill={light} />
      case 'dai':
        return <path d="M146 176 Q186 176 178 136 Q174 120 186 112" fill="none" stroke={s.c[1]} strokeWidth={13} strokeLinecap="round" />
      case 'cao':
        return (
          <g>
            <path d="M142 176 Q196 186 190 130 Q170 140 150 160 Z" fill={fur} />
            <path d="M190 130 Q186 150 172 156 Q180 136 190 130 Z" fill="#fff" />
          </g>
        )
      case 'xoan':
        return <path d="M146 178 Q170 182 172 166 Q174 152 162 154 Q154 158 162 164" fill="none" stroke={s.c[2]} strokeWidth={5} strokeLinecap="round" />
      default:
        return null
    }
  })()

  return (
    <>
      <g className="c-tail">{tail}</g>
      {s.extra === 'vang' && (
        <g className="c-mane">
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2
            return <circle key={i} cx={100 + Math.cos(a) * 62} cy={88 + Math.sin(a) * 56} r={22} fill={i % 2 ? '#e0892c' : '#f0a23d'} />
          })}
        </g>
      )}
      {s.extra === 'mong' && <path d="M84 30 Q130 20 150 70 Q158 100 146 120 Q140 80 120 56 Z" fill="#7a4a2c" />}
      {s.ear !== 'cup' && s.ear !== 'voi' && s.ear !== 'khi' && s.ear !== 'bo' && s.ear !== 'cuu' && <g className="c-ears" filter={`url(#${u('plush')})`}>{ears}</g>}
      <g filter={`url(#${u('plush')})`}>
        {/* thân */}
        <ellipse cx={100} cy={152} rx={50} ry={40} fill={fur} />
        <ellipse cx={100} cy={158} rx={30} ry={27} fill={s.belly} />
        {/* chân */}
        <ellipse cx={74} cy={184} rx={17} ry={10} fill={s.extra === 'mat' ? '#3a3a44' : light} />
        <ellipse cx={126} cy={184} rx={17} ry={10} fill={s.extra === 'mat' ? '#3a3a44' : light} />
        {/* tay */}
        <ellipse className="c-arm-l" cx={56} cy={146} rx={12} ry={19} fill={s.extra === 'mat' ? '#3a3a44' : fur} transform="rotate(24 56 146)" />
        <ellipse className="c-arm-r" cx={144} cy={146} rx={12} ry={19} fill={s.extra === 'mat' ? '#3a3a44' : fur} transform="rotate(-24 144 146)" />
        {(s.ear === 'voi' || s.ear === 'khi' || s.ear === 'bo' || s.ear === 'cuu') && <g className="c-ears">{ears}</g>}
        {s.extra === 'bom' && (
          <g>
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2
              return <circle key={i} cx={100 + Math.cos(a) * 58} cy={88 + Math.sin(a) * 50} r={18} fill={light} />
            })}
          </g>
        )}
        {/* đầu */}
        <ellipse cx={100} cy={90} rx={64} ry={56} fill={fur} />
        {s.extra === 'bom' && <ellipse cx={100} cy={98} rx={44} ry={38} fill="#f3ddd0" />}
        {s.extra === 'mat-khi' && <path d="M100 66 C 60 46 36 90 58 116 C 70 134 130 134 142 116 C 164 90 140 46 100 66 Z" fill={s.belly} />}
        {s.muzzle && <ellipse cx={100} cy={113} rx={26} ry={17} fill={s.muzzle} />}
        {s.nose === 'heo' && <ellipse cx={100} cy={112} rx={19} ry={13} fill={dark} opacity={0.75} />}
        {s.nose === 'bo' && <ellipse cx={100} cy={116} rx={30} ry={18} fill={s.extra === 'mong' ? '#e9c2a4' : '#ffc2cf'} />}
        {floppy}
      </g>
      {/* hoa văn */}
      {s.extra === 'soc' && (
        <g fill={dark} opacity={0.55}>
          <path d="M100 36 Q96 46 100 54 Q104 46 100 36 Z" />
          <path d="M86 38 Q84 46 88 52 Q90 44 86 38 Z" />
          <path d="M114 38 Q116 46 112 52 Q110 44 114 38 Z" />
          <path d="M37 86 Q48 88 52 94 Q44 96 37 86 Z" />
          <path d="M163 86 Q152 88 148 94 Q156 96 163 86 Z" />
        </g>
      )}
      {s.extra === 'dom' && <ellipse cx={128} cy={70} rx={16} ry={11} fill="#3d3434" opacity={0.85} />}
      {s.extra === 'sung-bo' && (
        <g>
          <ellipse cx={128} cy={64} rx={15} ry={11} fill="#3d3434" opacity={0.8} />
          <ellipse cx={72} cy={158} rx={10} ry={7} fill="#3d3434" opacity={0.6} />
          {[-1, 1].map((k) => (
            <path key={k} d={`M${100 + k * 34} 42 Q${100 + k * 46} 18 ${100 + k * 40} 12 Q${100 + k * 34} 26 ${100 + k * 26} 40 Z`} fill="#f4e3b5" stroke="#d9c38d" strokeWidth={1.5} />
          ))}
        </g>
      )}
      {s.extra === 'sung' && (
        <g>
          <path d="M92 40 L100 2 L108 40 Z" fill="#ffd56b" stroke="#f0b93a" strokeWidth={1.5} strokeLinejoin="round" />
          <path d="M94 30 L106 26 M96 20 L105 17" stroke="#f0b93a" strokeWidth={1.6} />
          <path d="M70 34 Q100 18 132 36 Q118 30 100 34 Q86 30 70 34 Z" fill="#c4a8ff" />
          <path d="M132 36 Q150 52 152 82 Q140 60 126 50 Z" fill="#ffb3dd" />
        </g>
      )}
      {s.extra === 'mat' && (
        <g fill="#3a3a44">
          <ellipse cx={74} cy={98} rx={16} ry={20} transform="rotate(-25 74 98)" />
          <ellipse cx={126} cy={98} rx={16} ry={20} transform="rotate(25 126 98)" />
        </g>
      )}
      <ellipse cx={100} cy={158} rx={30} ry={27} {...stitch} />
      {/* sáng bóng mềm */}
      <ellipse cx={76} cy={62} rx={28} ry={16} fill="#fff" opacity={0.28} transform="rotate(-20 76 62)" />
      <Eyes mood={mood} y={s.extra === 'mat' ? 98 : 94} />
      <Cheeks y={s.muzzle ? 116 : 112} gap={s.extra === 'mat' ? 44 : 40} />
      {s.nose === 'tamgiac' && <path d="M93 105 Q100 101 107 105 Q102 112 100 112 Q98 112 93 105 Z" fill="#5a3340" />}
      {s.nose === 'to' && <ellipse cx={100} cy={106} rx={9} ry={6.5} fill="#3a2830" />}
      {s.nose === 'nho' && <path d="M95 106 Q100 103 105 106 Q100 111 95 106 Z" fill="#ff8fb0" />}
      {s.nose === 'heo' && (
        <g fill="#b85c7a">
          <ellipse cx={93} cy={112} rx={3.5} ry={5} />
          <ellipse cx={107} cy={112} rx={3.5} ry={5} />
        </g>
      )}
      {s.nose === 'bo' && (
        <g fill="#c56f84">
          <ellipse cx={88} cy={114} rx={4} ry={5.5} />
          <ellipse cx={112} cy={114} rx={4} ry={5.5} />
        </g>
      )}
      {s.extra === 'vi' && <><g filter={`url(#${u('plush')})`}><path d="M100 102 Q97 128 102 142 Q108 156 122 150" fill="none" stroke={s.c[2]} strokeWidth={19} strokeLinecap="round" /><path d="M100 102 Q97 128 102 142 Q108 156 122 150" fill="none" stroke={s.c[1]} strokeWidth={15} strokeLinecap="round" /></g><path d="M97 116 h7 M98 126 h7 M100 136 h7" stroke={s.c[2]} strokeWidth={1.8} strokeLinecap="round" opacity={0.6} /><path d="M86 140 Q92 146 96 140" fill="none" stroke="#2b1d33" strokeWidth={2.6} strokeLinecap="round" /></>}
      {s.nose === 'heo' || s.nose === 'bo' ? <Mouth y={128} mood={mood} /> : s.extra === 'vi' ? null : <Mouth y={s.nose === 'to' ? 116 : 115} mood={mood} />}
    </>
  )
}

// ───────────────────────── Chim (thân tròn như quả bóng) ─────────────────────────

function BirdArt({ s, u, mood }: { s: Bird; u: (k: string) => string; mood: Mood }) {
  const fur = `url(#${u('fur')})`
  const penguin = s.extra === 'canhcut'
  const owl = s.extra === 'cu'
  return (
    <>
      {s.extra === 'toc' && <path className="c-ear-l" d="M98 54 Q86 30 100 24 Q98 38 112 30 Q106 44 104 54 Z" fill={s.c[2]} />}
      {owl && (
        <g className="c-ears" fill={s.c[2]}>
          <path className="c-ear-l" d="M50 72 Q40 40 46 28 Q64 44 84 52 Z" />
          <path className="c-ear-r" d="M150 72 Q160 40 154 28 Q136 44 116 52 Z" />
        </g>
      )}
      <g filter={`url(#${u('plush')})`}>
        <ellipse cx={100} cy={118} rx={70} ry={70} fill={fur} />
        <ellipse cx={100} cy={142} rx={penguin ? 50 : 44} ry={penguin ? 46 : 38} fill={s.belly} />
        {penguin && <path d="M48 96 Q100 60 152 96 Q150 130 100 128 Q50 130 48 96 Z" fill="#ffffff" />}
        <ellipse className="c-arm-l" cx={34} cy={128} rx={14} ry={28} fill={s.c[2]} transform="rotate(20 34 128)" />
        <ellipse className="c-arm-r" cx={166} cy={128} rx={14} ry={28} fill={s.c[2]} transform="rotate(-20 166 128)" />
      </g>
      {owl && (
        <g>
          <circle cx={74} cy={98} r={24} fill="#fbecd6" />
          <circle cx={126} cy={98} r={24} fill="#fbecd6" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${82 + i * 12} ${148 + (i % 2) * 6} q6 6 12 0`} fill="none" stroke={s.c[2]} strokeWidth={2.5} strokeLinecap="round" />
          ))}
        </g>
      )}
      {s.extra === 'mao' && (
        <g fill="#ff4d5e">
          <circle cx={88} cy={44} r={11} />
          <circle cx={102} cy={38} r={13} />
          <circle cx={116} cy={44} r={11} />
          <ellipse cx={100} cy={130} rx={7} ry={10} />
        </g>
      )}
      <ellipse cx={100} cy={142} rx={penguin ? 50 : 44} ry={penguin ? 46 : 38} {...stitch} />
      <ellipse cx={74} cy={74} rx={26} ry={14} fill="#fff" opacity={0.3} transform="rotate(-25 74 74)" />
      <Eyes mood={mood} y={98} gap={owl ? 26 : 26} r={owl ? 1.15 : 1} />
      <Cheeks y={118} gap={44} />
      {s.beak === 'nhon' ? (
        <path d="M90 110 Q100 104 110 110 L100 126 Z" fill="#ffa62b" stroke="#e8850f" strokeWidth={1.5} strokeLinejoin="round" />
      ) : (
        <g>
          <ellipse cx={100} cy={118} rx={20} ry={9} fill="#ff9f2e" />
          <path d="M84 118 Q100 124 116 118" fill="none" stroke="#e07a0f" strokeWidth={2} />
        </g>
      )}
      <g fill="#ffa62b">
        <ellipse cx={80} cy={188} rx={14} ry={6} />
        <ellipse cx={120} cy={188} rx={14} ry={6} />
      </g>
    </>
  )
}

// ───────────────────────── Ếch, cá, cá voi, cá heo, bạch tuộc ─────────────────────────

function OtherArt({ kind, s, u, mood }: { kind: string; s: Spec; u: (k: string) => string; mood: Mood }) {
  const fur = `url(#${u('fur')})`
  if (kind === 'ech')
    return (
      <>
        <g filter={`url(#${u('plush')})`}>
          <ellipse cx={100} cy={150} rx={56} ry={40} fill={fur} />
          <ellipse cx={100} cy={158} rx={34} ry={27} fill={s.belly} />
          <ellipse cx={100} cy={104} rx={72} ry={48} fill={fur} />
          <circle className="c-ear-l" cx={66} cy={64} r={26} fill={fur} />
          <circle className="c-ear-r" cx={134} cy={64} r={26} fill={fur} />
          <ellipse cx={66} cy={186} rx={22} ry={9} fill={s.c[0]} />
          <ellipse cx={134} cy={186} rx={22} ry={9} fill={s.c[0]} />
        </g>
        <circle cx={66} cy={64} r={17} fill="#fff" />
        <circle cx={134} cy={64} r={17} fill="#fff" />
        <g transform="translate(0 -30)">
          <Eyes mood={mood} y={96} gap={34} r={0.9} />
        </g>
        <Cheeks y={114} gap={50} />
        <ellipse cx={100} cy={158} rx={34} ry={27} {...stitch} />
        <ellipse cx={70} cy={84} rx={22} ry={10} fill="#fff" opacity={0.28} />
        <path d={mood === 'sad' ? 'M76 122 Q100 110 124 122' : 'M70 112 Q100 134 130 112'} fill="none" stroke="#2b5a1f" strokeWidth={4} strokeLinecap="round" />
      </>
    )
  if (kind === 'bachtuoc')
    return (
      <>
        <g filter={`url(#${u('plush')})`}>
          {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k, i) => {
            const x = 100 + k * 20
            const d = i % 2 ? 1 : -1
            return <path key={i} className="c-arm-l" d={`M${x} 130 Q${x + d * 4} 160 ${x - d * 6} 176 Q${x - d * 8} 188 ${x + d * 4} 186`} fill="none" stroke={s.c[i % 2 ? 1 : 2]} strokeWidth={17} strokeLinecap="round" />
          })}
          <ellipse cx={100} cy={100} rx={66} ry={62} fill={fur} />
        </g>
        <ellipse cx={74} cy={66} rx={24} ry={13} fill="#fff" opacity={0.3} transform="rotate(-25 74 66)" />
        <Eyes mood={mood} y={104} />
        <Cheeks y={122} gap={42} />
        <Mouth y={124} mood={mood} />
      </>
    )
  // cá, cá voi, cá heo: thân nằm ngang
  const whale = kind === 'cavoi'
  const dolphin = kind === 'caheo'
  return (
    <>
      <g className="c-tail">
        <path d={whale ? 'M30 120 Q4 92 6 78 Q22 92 38 104 Q34 82 46 70 Q50 96 48 124 Z' : 'M44 116 Q12 84 10 80 Q16 112 12 150 Q28 132 44 124 Z'} fill={s.c[2]} />
      </g>
      <g filter={`url(#${u('plush')})`}>
        {dolphin && <path d="M100 64 Q112 30 128 34 Q118 50 122 68 Z" fill={s.c[2]} />}
        {!whale && !dolphin && <path d="M84 70 Q104 36 130 56 Q116 62 112 76 Z" fill={s.c[2]} />}
        <ellipse className="c-arm-l" cx={96} cy={164} rx={18} ry={10} fill={s.c[2]} transform="rotate(25 96 164)" />
        <ellipse cx={108} cy={118} rx={whale ? 80 : 70} ry={whale ? 62 : 54} fill={fur} />
        <ellipse cx={116} cy={144} rx={whale ? 58 : 46} ry={26} fill={s.belly} />
        {dolphin && <ellipse cx={176} cy={128} rx={18} ry={11} fill={s.c[1]} />}
      </g>
      {kind === 'ca' && (
        <g fill="none" stroke="#fff" strokeWidth={7} opacity={0.75} strokeLinecap="round">
          <path d="M64 88 Q58 118 66 150" />
          <path d="M84 72 Q76 118 86 164" />
        </g>
      )}
      {whale && (
        <g className="c-spout" fill="#9fd6ff" opacity={0.85}>
          <circle cx={112} cy={40} r={7} />
          <circle cx={100} cy={30} r={6} />
          <circle cx={124} cy={30} r={6} />
          <path d="M112 56 L112 44" stroke="#9fd6ff" strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
      <ellipse cx={92} cy={80} rx={28} ry={14} fill="#fff" opacity={0.3} transform="rotate(-18 92 80)" />
      <g transform="translate(26 6)">
        <Eyes mood={mood} y={104} gap={22} r={0.95} />
        <Cheeks y={122} gap={36} />
        <Mouth y={dolphin ? 124 : 128} mood={mood} />
      </g>
    </>
  )
}

export type Mood = 'idle' | 'happy' | 'sad'

/**
 * Một bạn thú bông. `size` nhận số (px) hoặc chuỗi CSS (VD "1.3em" để đứng trong dòng chữ).
 * `still`: không chuyển động (dùng khi có rất nhiều bạn cùng lúc).
 */
export function Critter({
  kind,
  size = 96,
  mood = 'idle',
  still = false,
  label,
  className = '',
}: {
  kind: CritterKind
  size?: number | string
  mood?: Mood
  still?: boolean
  label?: string
  className?: string
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const u = (k: string) => `${k}-${id}`
  const s = SPEC[kind]
  const [light, base, dark] = s.c
  const delay = (id.charCodeAt(id.length - 1) % 7) * 0.37
  let art: ReactNode
  if (s.type === 'thu') art = <MammalArt s={s} u={u} mood={mood} />
  else if (s.type === 'chim') art = <BirdArt s={s} u={u} mood={mood} />
  else art = <OtherArt kind={s.type} s={s} u={u} mood={mood} />
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`critter c-${kind} ${still ? 'still' : ''} ${className}`}
      style={{ ['--cd' as string]: `${delay.toFixed(2)}s` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={u('fur')} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        {/* lông mịn: viền hơi xù + lấm tấm sợi lông */}
        <filter id={u('plush')} x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves={1} seed={9} result="n2" />
          <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.22  0 0 0 -0.8 0.36" result="speck" />
          <feComposite in="speck" in2="d" operator="in" result="tex" />
          <feMerge>
            <feMergeNode in="d" />
            <feMergeNode in="tex" />
          </feMerge>
        </filter>
      </defs>
      <Shadow />
      <g className="c-body">{art}</g>
    </svg>
  )
}

/** Hiện biểu tượng: nếu là con vật thì thay bằng bạn thú bông, còn lại giữ nguyên biểu tượng. */
export function Emo({ e, size = '1.35em', mood, still }: { e: string; size?: number | string; mood?: Mood; still?: boolean }) {
  const k = critterFor(e)
  return k ? <Critter kind={k} size={size} mood={mood} still={still} className="inline" /> : <>{e}</>
}

type Seg = { segment: (t: string) => Iterable<{ segment: string }> }
const SegCtor = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: 'grapheme' }) => Seg }).Segmenter
const seg = SegCtor ? new SegCtor('vi', { granularity: 'grapheme' }) : null

/** Chuỗi có lẫn biểu tượng (VD "🐱🐶", "🦉 Cú"): thay từng con vật bằng thú bông. */
export function EmoText({ text, size = '1.35em', still }: { text: string; size?: number | string; still?: boolean }) {
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

export const ALL_CRITTERS = Object.keys(SPEC) as CritterKind[]

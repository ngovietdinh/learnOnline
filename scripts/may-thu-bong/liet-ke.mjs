// Liệt kê mọi emoji dùng trong ứng dụng → scripts/out/hinh.json để "may" thành thú bông và đóng phông.
// Chạy: node scripts/may-thu-bong/liet-ke.mjs
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const files = walk('src').filter((f) => /\.(tsx?|css)$/.test(f) && !f.includes('.test.'))
const seg = new Intl.Segmenter('vi', { granularity: 'grapheme' })
const found = new Map()
for (const f of files) for (const { segment: s } of seg.segment(readFileSync(f, 'utf8'))) if (/\p{Extended_Pictographic}/u.test(s)) found.set(s.replace(/️/g, ''), (found.get(s) ?? 0) + 1)

const key = (e) => [...e].map((c) => c.codePointAt(0).toString(16)).join('-')
const T = 'public/thu-bong/'
// Con vật → bạn thú trong bộ thiết kế; người → gia đình thú bông mặt kem.
const OWN = {
  '🐱': 'meo', '🐈': 'meo', '🐶': 'cho', '🐕': 'cho', '🐰': 'tho', '🐇': 'tho', '🐻': 'gau', '🐼': 'gautruc', '🐨': 'koala', '🐯': 'ho', '🐅': 'ho',
  '🦁': 'sutu', '🦊': 'cao', '🐷': 'heo', '🐖': 'heo', '🐮': 'bo', '🐄': 'bo', '🐹': 'hamster', '🐵': 'khi', '🐒': 'khi', '🐑': 'cuu', '🐘': 'voi',
  '🐤': 'gacon', '🐥': 'gacon', '🐣': 'gacon', '🐔': 'gacon', '🐓': 'gacon', '🦆': 'vit', '🦉': 'cu', '🐧': 'canhcut', '🐸': 'ech', '🐳': 'cavoi',
  '🐋': 'cavoi', '🐙': 'bachtuoc', '🦌': 'nai', '🦝': 'gaumeo', '🦔': 'nhim', '🐢': 'rua', '🦭': 'haicau', '🦇': 'doi', '🐿': 'soc', '🦒': 'huou',
  '👩': 'nguoi-me', '👨': 'nguoi-bo', '👴': 'nguoi-ong', '👵': 'nguoi-ba', '👧': 'nguoi-chi', '👦': 'nguoi-anh', '🧒': 'nguoi-tre', '👶': 'nguoi-embe',
  '🧑': 'nguoi-nguoi', '🧍': 'nguoi-tre', '🙋': 'hongvui', '🙌': 'hongvui', '👋': 'hong', '👩‍🏫': 'cotho', '👥': 'nguoi-gia-dinh',
  '👨‍👩‍👧': 'nguoi-gia-dinh', '👨‍👩‍👧‍👦': 'nguoi-gia-dinh', '🧸': 'gau',
}
// Rau quả, đồ ăn, cây cối, thời tiết: thêm mặt hạt cườm, má hồng như các bạn thú.
const FACE = new Set([...'🍎🍌🍊🍓🍇🍉🍋🍍🥑🥕🥦🌶🍅🥔🌽🍚🍞🥚🥛🍰🧁🍭🍬🍕🍔🍗🥗🍲🍳🥩🫘🫚🧃🥤🍽🌳🌱🌸🌻🌿🍃🌵🌾🪷🌷🍄☀🌞🌙🌕🌗🌑☁🌧🌦🌤⭐🌈💧🧊🔥⚡🌍🌏🏠🏡🏫🎈⚽🏀🏐⚾📦🎁🪑🛏🚗🚕🚌🚲🚂🚒✈⛵🚀📚📖📒📕✏🖍🖊🧮🎒🍽🥄'.replace(/️/g, '')].filter((c) => c.trim()))
const items = []
for (const [e] of found) {
  if (/^[0-9#*]/.test(e)) continue // chữ số có phím (4️⃣) để nguyên, tránh đổi chữ số thường
  const own = OWN[e]
  items.push(own ? { e, key: key(e), src: T + own + '.webp' } : { e, key: key(e), face: FACE.has(e) })
}
for (const [e, own] of Object.entries(OWN)) if (!found.has(e)) items.push({ e, key: key(e), src: T + own + '.webp' })
mkdirSync('scripts/out', { recursive: true })
writeFileSync('scripts/out/hinh.json', JSON.stringify(items, null, 0))
console.log(items.length, 'hình ·', items.filter((x) => x.src).length, 'dùng thú/người có sẵn ·', items.filter((x) => x.face).length, 'có mặt')

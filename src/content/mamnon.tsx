// MẦM NON — Nhà trẻ (1–3 tuổi) và Mẫu giáo (3–6 tuổi).
// Lời cô theo đúng giọng cô giáo mầm non: xưng "cô", gọi bé là "con", câu ngắn, ấm áp.
// Bám Chương trình Giáo dục mầm non (5 lĩnh vực: thể chất, nhận thức, ngôn ngữ, tình cảm – xã hội, thẩm mỹ).

import { useState } from 'react'
import type { ExploreProps } from '../lessons/types'
import { ce, cc, mn } from '../core/standards'
import { int, pick, shuffle } from '../core/rng'
import { sfx } from '../core/sound'
import { centerOf, fx } from '../core/fx'
import { choicesFrom, near } from '../lessons/helpers'
import { defineLesson, type Defined } from './define'
import { cardsExplore, patternExplore, sortExplore, stepsExplore, type Card } from './kit'
import { bank, byLevel, countGen, numberWord, vocab, type Gen } from './questions'

const NT = { stage: 'mam' as const, grade: 0 }
const MG = { stage: 'choi' as const, grade: 0 }

// ───────────────────────── NHÀ TRẺ 1–3 TUỔI ─────────────────────────

const COLORS: Card[] = [
  { key: 'do', name: 'màu đỏ', emoji: '🍎', color: '#ef4444', say: 'Màu đỏ! Quả táo màu đỏ. Con nói theo cô nào: màu đỏ!' },
  { key: 'vang', name: 'màu vàng', emoji: '🍌', color: '#facc15', say: 'Màu vàng! Quả chuối chín màu vàng. Màu vàng!' },
  { key: 'xanhla', name: 'màu xanh lá', emoji: '🐸', color: '#22c55e', say: 'Màu xanh lá! Chú ếch màu xanh lá cây. Màu xanh lá!' },
  { key: 'xanhduong', name: 'màu xanh dương', emoji: '🐳', color: '#3b82f6', say: 'Màu xanh dương! Bạn cá voi màu xanh như nước biển.' },
  { key: 'cam', name: 'màu cam', emoji: '🥕', color: '#fb923c', say: 'Màu cam! Củ cà rốt màu cam. Màu cam!' },
  { key: 'tim', name: 'màu tím', emoji: '🍇', color: '#a855f7', say: 'Màu tím! Chùm nho màu tím. Màu tím!' },
]

const mauSac = defineLesson({
  ...NT,
  id: 'mau-sac',
  title: 'Màu sắc quanh em',
  emoji: '🎨',
  subject: 'nhanthuc',
  gradeLabel: '24–36 tháng',
  essenceLine: 'Mỗi vật có một màu; cùng màu thì giống nhau dù là vật khác nhau.',
  standards: [mn('Phát triển nhận thức · Nhận biết màu đỏ, vàng, xanh')],
  hook: 'Con ơi, cầu vồng có bao nhiêu là màu đẹp! Mình cùng chơi với màu nhé!',
  hookVisual: '🌈',
  explore: cardsExplore('Con chạm vào từng bạn để nghe cô nói tên màu nhé!', COLORS, 'Giỏi quá! Con đã gặp đủ các màu rồi! Mình cùng chơi trò chơi nào!'),
  practice: vocab(COLORS, { ask: (c) => `Đâu là ${c.name} hả con?`, explain: (c) => `Đúng rồi! Đây là ${c.name}.` }),
  remember: ['🍎 đỏ', '🍌 vàng', '🐸 xanh lá', '🐳 xanh dương', '🥕 cam', '🍇 tím'],
  games: ['bongbay', 'chuotchui'],
})

const ANIMALS: Card[] = [
  { key: 'meo', name: 'con mèo', emoji: '🐱', color: '#fb923c', say: 'Con mèo kêu: meo meo! Mèo thích bắt chuột.' },
  { key: 'cho', name: 'con chó', emoji: '🐶', color: '#d4a373', say: 'Con chó kêu: gâu gâu! Chó trông nhà cho mình đấy.' },
  { key: 'vit', name: 'con vịt', emoji: '🦆', color: '#facc15', say: 'Con vịt kêu: cạp cạp! Vịt bơi dưới ao.' },
  { key: 'ga', name: 'gà trống', emoji: '🐓', color: '#ef4444', say: 'Gà trống gáy: ò ó o! Gà trống gọi mọi người dậy.' },
  { key: 'bo', name: 'con bò', emoji: '🐮', color: '#a3a3a3', say: 'Con bò kêu: ụm bò! Bò cho mình sữa.' },
  { key: 'de', name: 'con dê', emoji: '🐐', color: '#e9c46a', say: 'Con dê kêu: be be! Dê thích ăn cỏ.' },
]
const SOUND: Record<string, string> = { meo: 'meo meo', cho: 'gâu gâu', vit: 'cạp cạp', ga: 'ò ó o', bo: 'ụm bò', de: 'be be' }

const conVat = defineLesson({
  ...NT,
  id: 'con-vat',
  title: 'Con vật và tiếng kêu',
  emoji: '🐾',
  subject: 'nhanthuc',
  gradeLabel: '18–36 tháng',
  essenceLine: 'Mỗi con vật có hình dáng và tiếng kêu riêng.',
  standards: [mn('Phát triển nhận thức · Con vật quen thuộc'), mn('Phát triển ngôn ngữ · Nghe – bắt chước âm thanh')],
  hook: 'Ai đang kêu thế nhỉ? Cô cháu mình cùng đến thăm trang trại nhé!',
  hookVisual: '🏡',
  explore: cardsExplore('Con chạm vào từng con vật để nghe tiếng kêu nhé!', ANIMALS, 'Con giỏi quá! Con đã nghe hết các bạn rồi!'),
  practice: vocab(ANIMALS, { ask: (c) => `Con nào kêu ${SOUND[c.key]}?`, explain: (c) => `Đúng rồi! ${c.name[0].toUpperCase() + c.name.slice(1)} kêu ${SOUND[c.key]}.` }),
  remember: ['🐱 meo meo', '🐶 gâu gâu', '🦆 cạp cạp', '🐓 ò ó o', '🐮 ụm bò', '🐐 be be'],
  games: ['bongbay', 'cauca'],
  pairs: ANIMALS.map((a) => [a.emoji, SOUND[a.key]]),
})

const SHAPES0: Card[] = [
  { key: 'tron', name: 'hình tròn', emoji: '🟠', color: '#fb923c', say: 'Hình tròn! Tròn xoe như quả bóng, lăn được lông lốc.' },
  { key: 'vuong', name: 'hình vuông', emoji: '🟦', color: '#3b82f6', say: 'Hình vuông! Có bốn cạnh bằng nhau, như cái bánh chưng.' },
  { key: 'tamgiac', name: 'hình tam giác', emoji: '🔺', color: '#ef4444', say: 'Hình tam giác! Có ba cạnh, như cái nón lá của bà.' },
]
const hinhDang = defineLesson({
  ...NT,
  id: 'hinh-dang',
  title: 'Tròn, vuông, tam giác',
  emoji: '🔷',
  subject: 'nhanthuc',
  gradeLabel: '24–36 tháng',
  essenceLine: 'Hình được nhận ra nhờ đường viền: tròn thì lăn được, có góc thì không lăn.',
  standards: [mn('Phát triển nhận thức · Nhận biết hình tròn, hình vuông, hình tam giác')],
  prereqs: ['mau-sac'],
  hook: 'Quả bóng lăn lông lốc, còn cái hộp thì không lăn. Vì sao nhỉ? Mình cùng xem các hình nhé!',
  hookVisual: '⚽📦',
  explore: cardsExplore('Con chạm vào từng hình để nghe cô kể nhé!', SHAPES0, 'Con biết ba hình rồi: tròn, vuông, tam giác!'),
  practice: vocab(SHAPES0, { ask: (c) => `Đâu là ${c.name}?` }),
  remember: ['🟠 tròn: lăn được', '🟦 vuông: 4 cạnh bằng nhau', '🔺 tam giác: 3 cạnh'],
  games: ['bongbay', 'chuotchui'],
})

const BIGSMALL = [
  { emoji: '🐘', name: 'con voi' },
  { emoji: '⚽', name: 'quả bóng' },
  { emoji: '🍎', name: 'quả táo' },
  { emoji: '🐻', name: 'bạn gấu' },
  { emoji: '🚗', name: 'chiếc ô tô' },
]
const toNhoGen: Gen = (level, rng) => {
  const t = pick(rng, BIGSMALL)
  const askBig = rng() < 0.5
  const choices = shuffle(rng, [
    { label: 'to', visual: <span style={{ fontSize: '4.4rem' }}>{t.emoji}</span>, correct: askBig },
    { label: 'nhỏ', visual: <span style={{ fontSize: '1.9rem' }}>{t.emoji}</span>, correct: !askBig },
  ]).map((c) => ({ ...c, misconception: c.correct ? undefined : 'nham-doi-tuong', why: c.correct ? undefined : askBig ? 'Bạn này nhỏ xíu. Con tìm bạn to hơn nhé!' : 'Bạn này to quá. Con tìm bạn nhỏ hơn nhé!' }))
  return {
    level,
    prompt: askBig ? `Đâu là ${t.name} to?` : `Đâu là ${t.name} nhỏ?`,
    layout: 'big',
    choices,
    explain: askBig ? `Đúng rồi! Đây là ${t.name} to.` : `Đúng rồi! Đây là ${t.name} nhỏ.`,
  }
}
const toNho = defineLesson({
  ...NT,
  id: 'to-nho',
  title: 'To và nhỏ',
  emoji: '🐘',
  subject: 'nhanthuc',
  gradeLabel: '24–36 tháng',
  essenceLine: 'So sánh hai vật để biết vật nào to, vật nào nhỏ.',
  standards: [mn('Phát triển nhận thức · So sánh kích thước to – nhỏ')],
  hook: 'Bạn voi thì to ơi là to, bạn chuột thì nhỏ xíu. Con có muốn chơi trò to – nhỏ không?',
  hookVisual: '🐘🐭',
  explore: cardsExplore(
    'Con chạm vào từng bạn để nghe cô nói nhé!',
    [
      { key: 'voi', name: 'voi to', emoji: '🐘', color: '#94a3b8', say: 'Con voi to ơi là to! Con dang tay thật rộng nào: to!' },
      { key: 'chuot', name: 'chuột nhỏ', emoji: '🐭', color: '#cbd5e1', say: 'Con chuột nhỏ xíu! Con chụm tay lại nào: nhỏ!' },
      { key: 'bongto', name: 'bóng to', emoji: '🏐', color: '#60a5fa', say: 'Quả bóng to để đá!' },
      { key: 'bongnho', name: 'bóng nhỏ', emoji: '⚾', color: '#fde68a', say: 'Quả bóng nhỏ cầm vừa tay!' },
    ],
    'Con giỏi lắm! Giờ mình tìm bạn to, bạn nhỏ nhé!',
  ),
  practice: toNhoGen,
  remember: ['🐘 to', '🐭 nhỏ', 'Đặt cạnh nhau để so sánh'],
  games: ['bongbay'],
})

const motNhieuGen: Gen = (level, rng) => {
  const t = pick(rng, [
    { e: '🍎', n: 'quả táo' },
    { e: '⭐', n: 'ngôi sao' },
    { e: '🐟', n: 'con cá' },
    { e: '🌸', n: 'bông hoa' },
  ])
  const many = int(rng, 4, 7)
  const askOne = rng() < 0.5
  return {
    level,
    prompt: askOne ? `Đâu là một ${t.n}?` : `Đâu là nhiều ${t.n}?`,
    layout: 'big',
    choices: shuffle(rng, [
      { label: 'một', visual: <span>{t.e}</span>, correct: askOne, why: askOne ? undefined : 'Đây chỉ có một thôi con ạ!', misconception: askOne ? undefined : 'nham-doi-tuong' },
      {
        label: 'nhiều',
        visual: <span style={{ fontSize: '1.6rem', display: 'inline-block', maxWidth: '6em' }}>{t.e.repeat(many)}</span>,
        correct: !askOne,
        why: askOne ? 'Đây có nhiều lắm. Con tìm chỉ có một thôi nhé!' : undefined,
        misconception: askOne ? 'nham-doi-tuong' : undefined,
      },
    ]),
    explain: askOne ? `Đúng rồi, chỉ có một ${t.n}.` : `Đúng rồi, có nhiều ${t.n}.`,
  }
}
const motNhieu = defineLesson({
  ...NT,
  id: 'mot-nhieu',
  title: 'Một và nhiều',
  emoji: '☝️',
  subject: 'nhanthuc',
  gradeLabel: '24–36 tháng',
  essenceLine: 'Nhóm có thể có một vật hoặc nhiều vật — mầm của khái niệm số.',
  standards: [mn('Phát triển nhận thức · Nhận biết một và nhiều')],
  hook: 'Mẹ cho con một cái kẹo, bà cho con nhiều cái kẹo. Bên nào nhiều hơn nhỉ?',
  hookVisual: '🍬',
  explore: cardsExplore(
    'Con chạm vào từng ô để nghe cô nói nhé!',
    [
      { key: 'mot-tao', name: 'một quả táo', emoji: '🍎', color: '#fecaca', say: 'Một quả táo! Chỉ có một thôi.' },
      { key: 'nhieu-tao', name: 'nhiều quả táo', emoji: '🍎🍎🍎', color: '#fca5a5', say: 'Nhiều quả táo! Có nhiều lắm!' },
      { key: 'mot-ca', name: 'một con cá', emoji: '🐟', color: '#bfdbfe', say: 'Một con cá đang bơi.' },
      { key: 'nhieu-ca', name: 'nhiều con cá', emoji: '🐟🐟🐟', color: '#93c5fd', say: 'Nhiều con cá bơi cùng nhau!' },
    ],
    'Giỏi quá! Con biết một và nhiều rồi!',
  ),
  practice: motNhieuGen,
  remember: ['☝️ một', '🖐️ nhiều'],
  games: ['bongbay'],
})

const BODY: Card[] = [
  { key: 'mat', name: 'đôi mắt', emoji: '👀', color: '#93c5fd', say: 'Đôi mắt để nhìn. Con chớp chớp mắt nào!' },
  { key: 'tai', name: 'đôi tai', emoji: '👂', color: '#fcd34d', say: 'Đôi tai để nghe. Con nghe cô hát nhé!' },
  { key: 'mui', name: 'cái mũi', emoji: '👃', color: '#fda4af', say: 'Cái mũi để ngửi. Hít hà, thơm quá!' },
  { key: 'mieng', name: 'cái miệng', emoji: '👄', color: '#f87171', say: 'Cái miệng để ăn và để nói. Con cười thật tươi nào!' },
  { key: 'tay', name: 'đôi tay', emoji: '👐', color: '#86efac', say: 'Đôi tay để cầm, để vỗ. Con vỗ tay nào!' },
  { key: 'chan', name: 'đôi chân', emoji: '🦶', color: '#c4b5fd', say: 'Đôi chân để đi, để chạy. Con dậm chân nào!' },
]
const USE: Record<string, string> = { mat: 'nhìn', tai: 'nghe', mui: 'ngửi', mieng: 'ăn và nói', tay: 'cầm đồ chơi', chan: 'đi và chạy' }
const coThe = defineLesson({
  ...NT,
  id: 'co-the',
  title: 'Cơ thể của bé',
  emoji: '🧒',
  subject: 'nhanthuc',
  gradeLabel: '18–36 tháng',
  essenceLine: 'Mỗi bộ phận cơ thể có một việc riêng giúp bé nhìn, nghe, ngửi, ăn, cầm, đi.',
  standards: [mn('Phát triển nhận thức · Tên và tác dụng các bộ phận cơ thể')],
  hook: 'Con có biết cái gì giúp con nhìn thấy mẹ, nghe thấy tiếng cô hát không?',
  hookVisual: '🧒',
  explore: cardsExplore('Con chạm vào từng bộ phận để nghe cô nói nhé!', BODY, 'Con giỏi quá! Cơ thể mình thật tuyệt vời!'),
  practice: byLevel({
    1: vocab(BODY, { ask: (c) => `Đâu là ${c.name}?` }),
    2: vocab(BODY, { ask: (c) => `Con dùng gì để ${USE[c.key]}?`, explain: (c) => `Đúng rồi! Mình dùng ${c.name} để ${USE[c.key]}.` }),
  }),
  remember: ['👀 nhìn', '👂 nghe', '👃 ngửi', '👄 ăn, nói', '👐 cầm', '🦶 đi'],
  games: ['bongbay', 'chuotchui'],
  pairs: BODY.map((b) => [b.emoji, USE[b.key]]),
})

const FRUITS: Card[] = [
  { key: 'tao', name: 'quả táo', emoji: '🍎', say: 'Quả táo đỏ, giòn giòn, ngọt ngọt.' },
  { key: 'chuoi', name: 'quả chuối', emoji: '🍌', say: 'Quả chuối vàng, bóc vỏ ăn thơm lắm.' },
  { key: 'cam', name: 'quả cam', emoji: '🍊', say: 'Quả cam nhiều nước, có nhiều vi-ta-min.' },
  { key: 'dua-hau', name: 'quả dưa hấu', emoji: '🍉', say: 'Dưa hấu vỏ xanh, ruột đỏ, mát lạnh.' },
  { key: 'ca-rot', name: 'củ cà rốt', emoji: '🥕', say: 'Củ cà rốt màu cam, bạn thỏ rất thích.' },
  { key: 'sup-lo', name: 'súp lơ xanh', emoji: '🥦', say: 'Súp lơ xanh như cây nhỏ, ăn giúp bé khỏe.' },
]
const quaRau = defineLesson({
  ...NT,
  id: 'qua-rau',
  title: 'Rau quả bé yêu',
  emoji: '🍉',
  subject: 'nhanthuc',
  gradeLabel: '24–36 tháng',
  essenceLine: 'Rau quả có nhiều màu, nhiều vị; ăn rau quả giúp bé khỏe.',
  standards: [mn('Phát triển nhận thức · Một số loại quả, rau quen thuộc'), mn('Phát triển thể chất · Dinh dưỡng và sức khỏe')],
  hook: 'Cô có một giỏ rau quả rất ngon. Con đoán xem trong giỏ có gì nào?',
  hookVisual: '🧺',
  explore: cardsExplore('Con chạm vào từng loại rau quả nhé!', FRUITS, 'Ăn nhiều rau quả, con sẽ khỏe mạnh!'),
  practice: vocab(FRUITS, { ask: (c) => `Đâu là ${c.name}?` }),
  remember: FRUITS.map((f) => `${f.emoji} ${f.name}`),
  games: ['cauca', 'bongbay'],
})

const VEHICLES: Card[] = [
  { key: 'oto', name: 'ô tô', emoji: '🚗', say: 'Ô tô chạy trên đường: bim bim!' },
  { key: 'tau', name: 'tàu hỏa', emoji: '🚂', say: 'Tàu hỏa chạy trên đường ray: xình xịch, xình xịch!' },
  { key: 'maybay', name: 'máy bay', emoji: '✈️', say: 'Máy bay bay trên bầu trời: ù ù!' },
  { key: 'thuyen', name: 'con thuyền', emoji: '⛵', say: 'Con thuyền đi trên mặt nước, rập rình.' },
  { key: 'xedap', name: 'xe đạp', emoji: '🚲', say: 'Xe đạp: kính coong, kính coong!' },
  { key: 'cuuhoa', name: 'xe cứu hỏa', emoji: '🚒', say: 'Xe cứu hỏa đi dập lửa: tò te tí te!' },
]
const xeCo = defineLesson({
  ...NT,
  id: 'xe-co',
  title: 'Xe cộ bé biết',
  emoji: '🚗',
  subject: 'nhanthuc',
  gradeLabel: '24–36 tháng',
  essenceLine: 'Xe chạy trên đường, tàu thuyền đi dưới nước, máy bay bay trên trời.',
  standards: [mn('Phát triển nhận thức · Phương tiện giao thông quen thuộc')],
  hook: 'Bim bim! Xình xịch! Ù ù! Tiếng gì vậy nhỉ? Mình cùng xem nhé!',
  hookVisual: '🚦',
  explore: cardsExplore('Con chạm vào từng chiếc xe để nghe tiếng kêu nhé!', VEHICLES, 'Con giỏi lắm! Con biết nhiều loại xe rồi!'),
  practice: byLevel({
    1: vocab(VEHICLES, { ask: (c) => `Đâu là ${c.name}?` }),
    2: bank([
      { lv: 2, q: 'Cái gì bay trên bầu trời?', a: 'máy bay', wrong: [['ô tô', 'Ô tô chạy trên đường cơ.'], ['con thuyền', 'Thuyền đi dưới nước cơ.']], ex: 'Máy bay bay trên bầu trời.' },
      { lv: 2, q: 'Cái gì đi dưới nước?', a: 'con thuyền', wrong: [['tàu hỏa', 'Tàu hỏa chạy trên đường ray.'], ['máy bay', 'Máy bay bay trên trời.']], ex: 'Con thuyền đi trên mặt nước.' },
      { lv: 2, q: 'Xe nào đi dập lửa?', a: 'xe cứu hỏa', wrong: [['xe đạp', 'Xe đạp để đạp đi chơi.'], ['ô tô', 'Ô tô chở người.']], ex: 'Xe cứu hỏa màu đỏ đi dập lửa.' },
      { lv: 2, q: 'Cái gì chạy trên đường ray?', a: 'tàu hỏa', wrong: [['ô tô', 'Ô tô chạy trên đường nhựa.'], ['máy bay', 'Máy bay bay trên trời.']], ex: 'Tàu hỏa chạy trên đường ray: xình xịch.' },
    ]),
  }),
  remember: ['🚗 trên đường', '⛵ dưới nước', '✈️ trên trời'],
  games: ['bongbay', 'cauca'],
})

const FAMILY: Card[] = [
  { key: 'ong', name: 'ông', emoji: '👴', say: 'Ông của con, ông hay kể chuyện cổ tích.' },
  { key: 'ba', name: 'bà', emoji: '👵', say: 'Bà của con, bà hay ru con ngủ.' },
  { key: 'bo', name: 'bố', emoji: '👨', say: 'Bố của con, bố bế con thật cao.' },
  { key: 'me', name: 'mẹ', emoji: '👩', say: 'Mẹ của con, mẹ yêu con nhất.' },
  { key: 'anh', name: 'anh chị', emoji: '🧒', say: 'Anh chị chơi cùng con.' },
  { key: 'em', name: 'em bé', emoji: '👶', say: 'Em bé nhỏ xíu, con thương em nhé.' },
]
const giaDinh = defineLesson({
  ...NT,
  id: 'gia-dinh',
  title: 'Gia đình bé yêu',
  emoji: '🏠',
  subject: 'nhanthuc',
  gradeLabel: '24–36 tháng',
  essenceLine: 'Gia đình là những người thân yêu sống cùng và chăm sóc bé.',
  standards: [mn('Phát triển tình cảm – xã hội · Gia đình của bé')],
  hook: 'Trong nhà con có những ai nhỉ? Mình cùng gặp gia đình bạn nhỏ nhé!',
  hookVisual: '🏠❤️',
  explore: cardsExplore('Con chạm vào từng người thân nhé!', FAMILY, 'Cả nhà ai cũng yêu thương con!'),
  practice: vocab(FAMILY, { ask: (c) => `Đâu là ${c.name}?` }),
  remember: ['👴 ông · 👵 bà', '👨 bố · 👩 mẹ', '🧒 anh chị · 👶 em bé'],
  games: ['bongbay'],
})

// ───────────────────────── MẪU GIÁO 3–6 TUỔI ─────────────────────────

const NUMS: Card[] = Array.from({ length: 10 }, (_, i) => ({
  key: `s${i + 1}`,
  name: `số ${i + 1}`,
  emoji: String(i + 1),
  color: ['#ff8fb8', '#ffc145', '#5ad1a4', '#6aa8ff', '#b58cff', '#ff9f5a', '#4fd1e0', '#f472b6', '#84cc16', '#f59e0b'][i],
  say: `Số ${numberWord(i + 1)}. Có ${numberWord(i + 1)} ngôi sao.`,
  sub: '⭐'.repeat(i + 1),
}))
const numeralGen: Gen = (level, rng) => {
  const n = int(rng, 1, level === 1 ? 5 : 10)
  if (level === 1 || rng() < 0.5) {
    const set = shuffle(rng, [n, ...shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== n)).slice(0, 2)])
    return {
      level,
      prompt: `Có mấy ngôi sao? Con chọn số đúng nhé!`,
      visual: <div className="q-scatter">{Array.from({ length: n }, (_, i) => <span key={i}>⭐</span>)}</div>,
      choices: set.map((x) => ({ label: String(x), correct: x === n, why: x === n ? undefined : x > n ? 'Con đếm lại nhé, mỗi ngôi sao đếm một lần thôi.' : 'Còn sót ngôi sao chưa đếm. Đếm lần lượt nhé.', misconception: x === n ? undefined : x > n ? 'dem-lap' : 'bo-sot' })),
      explain: `Có ${n} ngôi sao. Số ${n}.`,
    }
  }
  const t = pick(rng, ['🍓', '🐞', '🎈', '🐠'])
  const opts = shuffle(rng, [n, n === 10 ? 9 : n + 1, n === 1 ? 2 : n - 1].filter((x, i, a) => a.indexOf(x) === i))
  return {
    level,
    prompt: `Đâu là nhóm có ${n}?`,
    layout: 'big',
    choices: opts.map((x) => ({ label: String(x), visual: <span style={{ fontSize: '1.5rem', display: 'inline-block', maxWidth: '5.5em', lineHeight: 1.2 }}>{t.repeat(x)}</span>, correct: x === n, why: x === n ? undefined : `Nhóm này có ${x}. Con đếm lại nhé.`, misconception: x === n ? undefined : 'dem-lech' })),
    explain: `Đúng rồi, nhóm này có ${n}.`,
  }
}
const so110 = defineLesson({
  ...MG,
  id: 'so-1-10',
  title: 'Nhận biết số 1 đến 10',
  emoji: '🔟',
  subject: 'toan',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Mỗi chữ số là "tên viết" của một số lượng: số 3 chỉ nhóm có ba.',
  standards: [mn('Phát triển nhận thức · Nhận biết chữ số, số lượng trong phạm vi 10'), cc('K.CC.A.3')],
  prereqs: ['choi.dem-10'],
  hook: 'Con đếm được rồi! Giờ mình học cách viết số nhé. Số nào giống cái móc câu nhỉ?',
  hookVisual: '🔢',
  explore: cardsExplore('Con chạm vào từng số để nghe cô đọc nhé!', NUMS, 'Con giỏi quá! Con biết các số từ một đến mười rồi!', { big: false }),
  essence: {
    bigIdea: 'Chữ số là cách viết số lượng.',
    points: ['Số 1: có một. Số 2: có hai…', 'Đếm xong, số cuối cùng chính là số mình viết ra.', 'Số 10 viết bằng hai chữ số: 1 và 0.'],
    analogy: 'Chữ số giống như cái tên: bạn tên Lan, nhóm có ba thì tên là số 3.',
  },
  practice: numeralGen,
  remember: ['Đếm rồi viết số', 'Số cuối cùng đếm được = số lượng', '10 = 1 và 0'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [1, 2, 3, 4, 5, 6].map((n) => [String(n), '⭐'.repeat(n)]),
})

function PairExplore({ onDiscover, say }: ExploreProps) {
  const rounds = [
    { a: 4, b: 3, ae: '🥛', be: '🥄', an: 'cái cốc', bn: 'cái thìa' },
    { a: 3, b: 5, ae: '🐰', be: '🥕', an: 'bạn thỏ', bn: 'củ cà rốt' },
    { a: 4, b: 4, ae: '👧', be: '🎈', an: 'bạn nhỏ', bn: 'quả bóng' },
  ]
  const [k, setK] = useState(0)
  const r = rounds[k]
  const [paired, setPaired] = useState(0)
  const min = Math.min(r.a, r.b)
  const done = paired === min
  const result = r.a === r.b ? `Ghép đủ hết! ${r.an} và ${r.bn} bằng nhau.` : r.a > r.b ? `Còn thừa ${r.an}. Vậy ${r.an} nhiều hơn, ${r.bn} ít hơn.` : `Còn thừa ${r.bn}. Vậy ${r.bn} nhiều hơn, ${r.an} ít hơn.`
  return (
    <div className="pair-explore">
      <div className="pair-row">
        {Array.from({ length: r.a }, (_, i) => (
          <span key={i} className={i < paired ? 'paired' : i >= min && done ? 'extra' : ''}>
            {r.ae}
          </span>
        ))}
      </div>
      <div className="pair-links">
        {Array.from({ length: Math.max(r.a, r.b) }, (_, i) => (
          <i key={i} className={i < paired ? 'on' : ''} />
        ))}
      </div>
      <div className="pair-row">
        {Array.from({ length: r.b }, (_, i) => (
          <span key={i} className={i < paired ? 'paired' : i >= min && done ? 'extra' : ''}>
            {r.be}
          </span>
        ))}
      </div>
      {done && <p className="note good">{result}</p>}
      <div className="row-center">
        {!done ? (
          <button
            className="btn btn-primary btn-big"
            onClick={(e) => {
              const n = paired + 1
              setPaired(n)
              sfx.pop()
              fx.sparkle(...centerOf(e.currentTarget), 10)
              if (n === min) {
                sfx.correct()
                say(result)
              }
            }}
          >
            🔗 Ghép một đôi
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              if (k + 1 >= rounds.length) onDiscover()
              else {
                setK(k + 1)
                setPaired(0)
              }
            }}
          >
            {k + 1 >= rounds.length ? 'Con hiểu rồi ➜' : 'Ghép nhóm khác ➜'}
          </button>
        )}
      </div>
    </div>
  )
}
const PAIR_LINES = [
  'Còn thừa cái cốc. Vậy cái cốc nhiều hơn, cái thìa ít hơn.',
  'Còn thừa củ cà rốt. Vậy củ cà rốt nhiều hơn, bạn thỏ ít hơn.',
  'Ghép đủ hết! bạn nhỏ và quả bóng bằng nhau.',
]
const compareGroupsGen: Gen = (level, rng) => {
  const [e1, e2] = shuffle(rng, ['🔵', '🔴', '🟡', '🟢'])
  const a = int(rng, 3, 7)
  const kind = pick(rng, level === 1 ? (['more', 'less'] as const) : (['more', 'less', 'equal'] as const))
  const b = kind === 'equal' ? a : kind === 'more' ? a - int(rng, 1, 2) : a + int(rng, 1, 2)
  const ask = kind === 'less' ? 'Hàng nào ít hơn?' : 'Hàng nào nhiều hơn?'
  const correct = kind === 'equal' ? 'Bằng nhau' : 'Hàng trên'
  return {
    level,
    prompt: ask,
    layout: 'list',
    visual: (
      <div className="q-rows">
        <div className="q-row-label">Hàng trên</div>
        <div className="q-row" style={{ gap: '0.15em' }}>
          {e1.repeat(a)}
        </div>
        <div className="q-row-label">Hàng dưới</div>
        <div className="q-row" style={{ gap: '1.2em' }}>
          {[...Array(Math.max(0, b))].map((_, i) => (
            <span key={i}>{e2}</span>
          ))}
        </div>
      </div>
    ),
    choices: shuffle(rng, [
      { label: 'Hàng trên', correct: correct === 'Hàng trên', why: 'Con ghép từng đôi một xem hàng nào còn thừa nhé.', misconception: correct === 'Hàng trên' ? undefined : 'doan-theo-mat' },
      { label: 'Hàng dưới', correct: false, why: 'Hàng dưới trông dài vì các bạn đứng xa nhau thôi. Con đếm lại nhé.', misconception: 'dai-la-nhieu' },
      ...(level >= 2 ? [{ label: 'Bằng nhau', correct: correct === 'Bằng nhau', why: correct === 'Bằng nhau' ? undefined : 'Ghép đôi thì vẫn còn thừa, nên không bằng nhau.', misconception: correct === 'Bằng nhau' ? undefined : 'doan-theo-mat' }] : []),
    ]),
    explain: kind === 'equal' ? `Mỗi hàng có ${a}. Bằng nhau!` : kind === 'more' ? `Hàng trên có ${a}, hàng dưới có ${b}. Hàng trên nhiều hơn.` : `Hàng trên có ${a}, hàng dưới có ${b}. Hàng trên ít hơn.`,
  }
}
const soSanh = defineLesson({
  ...MG,
  id: 'so-sanh',
  title: 'Nhiều hơn – ít hơn – bằng nhau',
  emoji: '⚖️',
  subject: 'toan',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Ghép đôi từng cái một: nhóm nào còn thừa là nhóm nhiều hơn.',
  standards: [mn('Phát triển nhận thức · So sánh số lượng hai nhóm'), cc('K.CC.C.6')],
  prereqs: ['choi.dem-10'],
  hook: 'Có mấy bạn thỏ và mấy củ cà rốt? Bạn thỏ nào cũng có cà rốt không nhỉ?',
  hookVisual: '🐰🥕',
  explore: { intro: 'Con bấm Ghép một đôi để nối từng cặp nhé!', Component: PairExplore, lines: ['Con bấm Ghép một đôi để nối từng cặp nhé!', ...PAIR_LINES] },
  essence: {
    bigIdea: 'Ghép đôi từng cái một — nhóm còn thừa là nhóm nhiều hơn.',
    points: ['Còn thừa: nhiều hơn.', 'Bị thiếu: ít hơn.', 'Vừa đủ: bằng nhau.', 'Hàng dài hơn chưa chắc nhiều hơn — phải ghép hoặc đếm!'],
    analogy: 'Như phát mỗi bạn một cái bánh: thiếu bánh là bánh ít hơn bạn.',
  },
  practice: compareGroupsGen,
  remember: ['Ghép từng đôi', 'Thừa → nhiều hơn', 'Thiếu → ít hơn', 'Vừa đủ → bằng nhau'],
  games: ['bongbay'],
})

function SplitExplore({ onDiscover, say }: ExploreProps) {
  const totals = [5, 6, 7]
  const [k, setK] = useState(0)
  const n = totals[k]
  const [left, setLeft] = useState(n)
  const [found, setFound] = useState<Set<number>>(new Set())
  const right = n - left
  const record = (l: number) => {
    const nf = new Set(found).add(l)
    setFound(nf)
    say(`${numberWord(n)} gồm ${numberWord(l)} và ${numberWord(n - l)}.`)
  }
  return (
    <div className="split-explore">
      <div className="eq big">
        {n} gồm {left} và {right}
      </div>
      <div className="plates two">
        <button className="plate" onClick={() => left > 0 && (setLeft(left - 1), sfx.pop(), record(left - 1))}>
          <div>{'🍬'.repeat(left)}</div>
          <small>Đĩa trái: {left}</small>
        </button>
        <button className="plate" onClick={() => right > 0 && (setLeft(left + 1), sfx.pop(), record(left + 1))}>
          <div>{'🍬'.repeat(right)}</div>
          <small>Đĩa phải: {right}</small>
        </button>
      </div>
      <p className="muted center">Chạm vào đĩa để chuyển một cái kẹo sang đĩa kia.</p>
      {found.size >= 3 && (
        <div className="row-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (k + 1 >= totals.length) {
                say('Dù chia thế nào, gộp hai đĩa lại vẫn đủ số kẹo ban đầu!')
                onDiscover()
              } else {
                setK(k + 1)
                setLeft(totals[k + 1])
                setFound(new Set())
              }
            }}
          >
            {k + 1 >= totals.length ? 'Con hiểu rồi ➜' : 'Số khác ➜'}
          </button>
        </div>
      )}
    </div>
  )
}
const splitLines: string[] = ['Dù chia thế nào, gộp hai đĩa lại vẫn đủ số kẹo ban đầu!']
for (const n of [5, 6, 7]) for (let l = 0; l <= n; l++) splitLines.push(`${numberWord(n)} gồm ${numberWord(l)} và ${numberWord(n - l)}.`)
const tachGopGen: Gen = (level, rng) => {
  const n = int(rng, 3, level === 1 ? 6 : 10)
  const a = int(rng, 1, n - 1)
  if (level === 1 || rng() < 0.5) {
    return {
      level,
      prompt: `${n} gồm ${a} và mấy?`,
      visual: (
        <div className="q-rows">
          <div className="q-row">{'🍬'.repeat(a) + ' | ' + '❔'.repeat(n - a)}</div>
        </div>
      ),
      choices: choicesFrom(rng, n - a, [{ value: n, misconception: 'nham-so', why: `${n} là cả nhóm. Mình tìm phần còn lại thôi.` }, { value: n - a + 1, misconception: 'dem-lech' }], { count: 3, fill: near(n - a, 0) }),
      explain: `${n} gồm ${a} và ${n - a}. Gộp ${a} với ${n - a} lại được ${n}.`,
    }
  }
  const b = n - a
  return {
    level,
    prompt: `Gộp ${a} cái kẹo với ${b} cái kẹo được mấy cái?`,
    visual: <div className="q-row">{'🍬'.repeat(a) + ' + ' + '🍭'.repeat(b)}</div>,
    choices: choicesFrom(rng, n, [{ value: n + 1, misconception: 'dem-lap' }, { value: n - 1, misconception: 'bo-sot' }], { count: 3, fill: near(n, 1) }),
    explain: `Gộp ${a} và ${b} được ${n}.`,
  }
}
const tachGop = defineLesson({
  ...MG,
  id: 'tach-gop',
  title: 'Tách – gộp trong phạm vi 10',
  emoji: '🍬',
  subject: 'toan',
  gradeLabel: '5–6 tuổi',
  essenceLine: 'Một số có thể tách thành hai phần, gộp hai phần lại được số ban đầu.',
  standards: [mn('Phát triển nhận thức · Tách, gộp nhóm đối tượng trong phạm vi 10'), cc('K.OA.A.3')],
  prereqs: ['so-1-10'],
  hook: 'Cô có 5 cái kẹo, muốn chia cho hai bạn. Có bao nhiêu cách chia nhỉ?',
  hookVisual: '🍬🍬',
  explore: { intro: 'Con chạm vào đĩa để chuyển kẹo qua lại nhé!', Component: SplitExplore, lines: ['Con chạm vào đĩa để chuyển kẹo qua lại nhé!', ...splitLines] },
  essence: {
    bigIdea: 'Tách ra rồi gộp lại, vẫn đủ như ban đầu.',
    points: ['5 gồm 1 và 4, 2 và 3…', 'Gộp hai phần lại được cả nhóm.', 'Biết phần này thì tìm được phần kia.'],
    analogy: 'Như bẻ đôi cái bánh: hai miếng ghép lại vẫn là cả cái bánh.',
  },
  practice: tachGopGen,
  remember: ['Tách: một nhóm thành hai phần', 'Gộp: hai phần thành một nhóm', 'Gộp lại luôn đủ như cũ'],
  games: ['bongbay', 'chuotchui'],
})

const SHAPES: Card[] = [
  { key: 'tron', name: 'hình tròn', emoji: '⚪', color: '#fb7185', say: 'Hình tròn không có góc nào, nên lăn được.' },
  { key: 'vuong', name: 'hình vuông', emoji: '🟦', color: '#60a5fa', say: 'Hình vuông có bốn cạnh dài bằng nhau và bốn góc.' },
  { key: 'tamgiac', name: 'hình tam giác', emoji: '🔺', color: '#f87171', say: 'Hình tam giác có ba cạnh và ba góc.' },
  { key: 'chunhat', name: 'hình chữ nhật', emoji: '▬', color: '#34d399', say: 'Hình chữ nhật có bốn cạnh: hai cạnh dài, hai cạnh ngắn.' },
]
const hinhHoc = defineLesson({
  ...MG,
  id: 'hinh-hoc',
  title: 'Bốn hình cơ bản',
  emoji: '🔺',
  subject: 'toan',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Phân biệt hình nhờ số cạnh, số góc: tròn không góc, tam giác 3, vuông và chữ nhật 4.',
  standards: [mn('Phát triển nhận thức · Nhận biết, gọi tên các hình: tròn, vuông, tam giác, chữ nhật'), cc('K.G.B.4')],
  prereqs: ['mam.hinh-dang'],
  hook: 'Bánh chưng hình gì? Cái đồng hồ hình gì? Mình cùng đếm cạnh và góc nhé!',
  hookVisual: '🔺🟦⚪',
  explore: cardsExplore('Con chạm vào từng hình nhé!', SHAPES, 'Con biết đếm cạnh và góc rồi đấy!'),
  essence: {
    bigIdea: 'Đếm cạnh, đếm góc để biết tên hình.',
    points: ['Hình tròn: không có góc, lăn được.', 'Tam giác: 3 cạnh, 3 góc.', 'Hình vuông: 4 cạnh bằng nhau.', 'Chữ nhật: 4 cạnh, 2 dài 2 ngắn.'],
  },
  practice: byLevel({
    1: vocab(SHAPES, { ask: (c) => `Đâu là ${c.name}?` }),
    2: bank([
      { lv: 2, q: 'Hình nào có 3 cạnh?', a: 'hình tam giác', wrong: [['hình vuông', 'Hình vuông có 4 cạnh.'], ['hình tròn', 'Hình tròn không có cạnh thẳng.']], ex: 'Tam giác có 3 cạnh, 3 góc.' },
      { lv: 2, q: 'Hình nào lăn được?', a: 'hình tròn', wrong: [['hình vuông', 'Hình vuông có góc nên không lăn.'], ['hình tam giác', 'Tam giác có góc nên không lăn.']], ex: 'Hình tròn không có góc nên lăn được.' },
      { lv: 2, q: 'Hình nào có 4 cạnh bằng nhau?', a: 'hình vuông', wrong: [['hình chữ nhật', 'Chữ nhật có 2 cạnh dài, 2 cạnh ngắn.'], ['hình tam giác', 'Tam giác chỉ có 3 cạnh.']], ex: 'Hình vuông có 4 cạnh dài bằng nhau.' },
      { lv: 2, q: 'Bánh chưng có hình gì?', a: 'hình vuông', wrong: [['hình tròn', 'Bánh giầy mới hình tròn.'], ['hình tam giác', 'Bánh chưng có 4 cạnh bằng nhau.']], ex: 'Bánh chưng hình vuông, bánh giầy hình tròn.' },
    ]),
  }),
  remember: ['⚪ 0 góc', '🔺 3 cạnh', '🟦 4 cạnh bằng nhau', '▬ 2 dài 2 ngắn'],
  games: ['bongbay', 'chuotchui'],
})

const patternGen: Gen = (level, rng) => {
  const sets = [['🍎', '🍌'], ['🔴', '🔵'], ['⭐', '🌙'], ['🐶', '🐱'], ['🟥', '🟨', '🟦'], ['🍓', '🍓', '🍋']]
  const unit = level === 1 ? pick(rng, sets.slice(0, 4)) : pick(rng, sets)
  const len = unit.length * 2 + int(rng, 0, unit.length - 1)
  const seq = Array.from({ length: len }, (_, i) => unit[i % unit.length])
  const ans = unit[len % unit.length]
  const opts = [...new Set(unit)]
  return {
    level,
    prompt: 'Tiếp theo là hình gì?',
    layout: 'big',
    visual: <div className="pattern-row">{seq.map((e, i) => <span key={i} className="pat">{e}</span>)}<span className="pat q">?</span></div>,
    choices: shuffle(rng, opts).map((o) => ({ label: o, visual: <span>{o}</span>, correct: o === ans, why: o === ans ? undefined : 'Con nhìn xem nhóm nào cứ lặp đi lặp lại nhé!', misconception: o === ans ? undefined : 'nham-quy-luat' })),
    explain: 'Dãy lặp lại theo một nhóm. Tìm nhóm lặp là đoán được hình tiếp theo!',
  }
}
const quyLuat = defineLesson({
  ...MG,
  id: 'quy-luat',
  title: 'Sắp xếp theo quy luật',
  emoji: '🧩',
  subject: 'toan',
  gradeLabel: '5–6 tuổi',
  essenceLine: 'Quy luật là một nhóm lặp đi lặp lại — tìm ra nhóm lặp là đoán được tiếp theo.',
  standards: [mn('Phát triển nhận thức · Sắp xếp theo quy tắc')],
  prereqs: ['mam.mau-sac'],
  hook: 'Đỏ, xanh, đỏ, xanh… tiếp theo là màu gì nhỉ? Con đoán được không?',
  hookVisual: '🔴🔵🔴❓',
  explore: patternExplore(
    'Con chọn hình tiếp theo để hoàn thành dãy nhé!',
    [
      { unit: ['🍎', '🍌'], say: 'Táo, chuối, táo, chuối. Cứ lặp lại mãi!' },
      { unit: ['🔴', '🔴', '🔵'], say: 'Đỏ, đỏ, xanh. Nhóm ba hình lặp lại!' },
    ],
    'Con giỏi quá! Tìm nhóm lặp là đoán được ngay!',
  ),
  essence: { bigIdea: 'Tìm nhóm lặp lại.', points: ['Nhìn từ đầu dãy, tìm phần lặp lại.', 'Đọc to: táo, chuối, táo, chuối…', 'Nhóm lặp tiếp theo bắt đầu từ đầu.'] },
  practice: patternGen,
  remember: ['Tìm nhóm lặp', 'Đọc to dãy hình', 'Nhóm lặp quay lại từ đầu'],
  games: ['bongbay'],
})

const POS = [
  { k: 'tren', name: 'ở trên', place: { gridRow: 1, gridColumn: 2 } },
  { k: 'duoi', name: 'ở dưới', place: { gridRow: 3, gridColumn: 2 } },
  { k: 'trai', name: 'bên trái', place: { gridRow: 2, gridColumn: 1 } },
  { k: 'phai', name: 'bên phải', place: { gridRow: 2, gridColumn: 3 } },
]
const viTriGen: Gen = (level, rng) => {
  const p = pick(rng, level === 1 ? POS.slice(0, 2) : POS)
  const thing = pick(rng, [
    { e: '🐱', n: 'Con mèo' },
    { e: '⚽', n: 'Quả bóng' },
    { e: '🐦', n: 'Chú chim' },
  ])
  const opts = level === 1 ? POS.slice(0, 2) : POS
  return {
    level,
    prompt: `${thing.n} ở đâu so với cái hộp?`,
    visual: (
      <div className="pos-grid">
        <span style={{ gridRow: 2, gridColumn: 2 }}>📦</span>
        <span style={p.place}>{thing.e}</span>
      </div>
    ),
    choices: shuffle(rng, opts).map((o) => ({ label: o.name, correct: o.k === p.k, why: o.k === p.k ? undefined : `Con nhìn kỹ nhé: ${thing.n.toLowerCase()} đang ${p.name} cái hộp.`, misconception: o.k === p.k ? undefined : o.k === 'trai' || o.k === 'phai' ? 'nham-trai-phai' : 'nham-vi-tri' })),
    explain: `${thing.n} ${p.name} cái hộp.`,
  }
}
const viTri = defineLesson({
  ...MG,
  id: 'vi-tri',
  title: 'Trên – dưới – trái – phải',
  emoji: '📦',
  subject: 'toan',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Vị trí luôn so với một vật mốc: con mèo ở trên cái hộp.',
  standards: [mn('Phát triển nhận thức · Xác định vị trí của đồ vật so với bản thân và vật khác')],
  hook: 'Bạn mèo trốn ở đâu rồi? Trên hộp, dưới hộp hay bên cạnh hộp?',
  hookVisual: '🐱📦',
  explore: cardsExplore(
    'Con chạm vào từng ô để nghe cô nói nhé!',
    [
      { key: 'tren', name: 'ở trên', emoji: '⬆️', say: 'Ở trên: cao hơn cái hộp. Con giơ tay lên trên nào!' },
      { key: 'duoi', name: 'ở dưới', emoji: '⬇️', say: 'Ở dưới: thấp hơn cái hộp. Con chỉ xuống dưới nào!' },
      { key: 'trai', name: 'bên trái', emoji: '⬅️', say: 'Bên trái: phía tay trái của con. Con giơ tay trái nào!' },
      { key: 'phai', name: 'bên phải', emoji: '➡️', say: 'Bên phải: phía tay phải, tay con cầm thìa ăn cơm.' },
    ],
    'Con giỏi lắm! Giờ mình tìm bạn mèo nhé!',
  ),
  essence: { bigIdea: 'Vị trí luôn nói so với một vật mốc.', points: ['Trên – dưới: cao hơn hay thấp hơn.', 'Trái – phải: theo tay trái, tay phải của con.', 'Tay phải là tay con cầm thìa.'] },
  practice: viTriGen,
  remember: ['⬆️ trên', '⬇️ dưới', '⬅️ trái', '➡️ phải'],
  games: ['bongbay'],
})

const buoiNgay = defineLesson({
  ...MG,
  id: 'buoi-ngay',
  title: 'Sáng – trưa – chiều – tối',
  emoji: '🌤️',
  subject: 'nhanthuc',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Một ngày có sáng, trưa, chiều, tối; mỗi buổi bé làm những việc khác nhau.',
  standards: [mn('Phát triển nhận thức · Nhận biết các buổi trong ngày')],
  hook: 'Ông Mặt Trời thức dậy, đi lên cao, rồi đi ngủ. Một ngày của bé có những buổi nào nhỉ?',
  hookVisual: '🌅',
  explore: stepsExplore(
    'Con bấm Bắt đầu để xem một ngày của bé nhé!',
    [
      { emoji: '🌅', title: 'Buổi sáng', say: 'Buổi sáng: ông Mặt Trời mọc. Bé thức dậy, đánh răng, ăn sáng rồi đi học.' },
      { emoji: '☀️', title: 'Buổi trưa', say: 'Buổi trưa: trời nắng nhất. Bé ăn trưa rồi ngủ trưa.' },
      { emoji: '🌇', title: 'Buổi chiều', say: 'Buổi chiều: Mặt Trời xuống thấp. Bố mẹ đón bé về nhà.' },
      { emoji: '🌙', title: 'Buổi tối', say: 'Buổi tối: trời tối, có trăng sao. Cả nhà ăn cơm, bé đi ngủ.' },
    ],
    'Con giỏi quá! Sáng, trưa, chiều, tối, rồi lại sáng!',
    { cycle: true },
  ),
  essence: { bigIdea: 'Một ngày có bốn buổi, lặp lại mỗi ngày.', points: ['Sáng: thức dậy, đi học.', 'Trưa: ăn trưa, ngủ trưa.', 'Chiều: về nhà.', 'Tối: ăn cơm, đi ngủ.'] },
  practice: bank([
    { lv: 1, q: 'Buổi nào bé đi ngủ đêm?', a: 'buổi tối', wrong: [['buổi sáng', 'Buổi sáng bé thức dậy cơ.'], ['buổi trưa', 'Buổi trưa bé ngủ trưa một chút thôi.']], ex: 'Buổi tối trời tối, bé đi ngủ.' },
    { lv: 1, q: 'Buổi nào ông Mặt Trời mọc?', a: 'buổi sáng', wrong: [['buổi tối', 'Buổi tối có trăng sao.'], ['buổi chiều', 'Buổi chiều Mặt Trời xuống thấp.']], ex: 'Buổi sáng Mặt Trời mọc.' },
    { lv: 2, q: 'Bé ăn trưa vào buổi nào?', a: 'buổi trưa', wrong: [['buổi sáng', 'Buổi sáng bé ăn sáng.'], ['buổi tối', 'Buổi tối bé ăn cơm tối.']], ex: 'Bé ăn trưa vào buổi trưa.' },
    { lv: 2, q: 'Sau buổi chiều là buổi nào?', a: 'buổi tối', wrong: [['buổi sáng', 'Sáng là sau buổi tối cơ.'], ['buổi trưa', 'Trưa là trước buổi chiều.']], ex: 'Sáng, trưa, chiều, rồi đến tối.' },
  ]),
  remember: ['🌅 sáng', '☀️ trưa', '🌇 chiều', '🌙 tối'],
  games: ['bongbay', 'cauca'],
})

const phanLoai = defineLesson({
  ...MG,
  id: 'phan-loai',
  title: 'Con vật sống ở đâu?',
  emoji: '🐠',
  subject: 'nhanthuc',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Con vật sống dưới nước có vây để bơi; sống trên cạn có chân để đi.',
  standards: [mn('Phát triển nhận thức · Đặc điểm, nơi sống của con vật'), mn('Phân loại đối tượng theo dấu hiệu')],
  prereqs: ['mam.con-vat'],
  hook: 'Bạn cá có sống trên cây được không? Bạn mèo có bơi dưới biển không? Mình cùng xếp nhà cho các bạn nhé!',
  hookVisual: '🌊🌳',
  explore: sortExplore(
    'Con chạm vào một bạn, rồi chạm vào nhà của bạn ấy nhé!',
    [
      { name: 'Dưới nước', emoji: '🌊' },
      { name: 'Trên cạn', emoji: '🌳' },
    ],
    [
      { emoji: '🐟', name: 'con cá', bin: 0, why: 'Đúng rồi! Cá có vây để bơi, sống dưới nước.' },
      { emoji: '🐙', name: 'bạch tuộc', bin: 0, why: 'Đúng rồi! Bạch tuộc sống dưới biển.' },
      { emoji: '🐬', name: 'cá heo', bin: 0, why: 'Đúng rồi! Cá heo bơi giỏi dưới biển.' },
      { emoji: '🐱', name: 'con mèo', bin: 1, why: 'Đúng rồi! Mèo có chân để đi, sống trên cạn.' },
      { emoji: '🐘', name: 'con voi', bin: 1, why: 'Đúng rồi! Voi sống trên cạn, trong rừng.' },
      { emoji: '🐔', name: 'con gà', bin: 1, why: 'Đúng rồi! Gà sống trên cạn, trong vườn.' },
    ],
    'Con xếp đúng hết rồi! Dưới nước thì có vây, trên cạn thì có chân.',
  ),
  essence: { bigIdea: 'Mỗi con vật hợp với nơi sống của mình.', points: ['Dưới nước: có vây, có đuôi để bơi.', 'Trên cạn: có chân để đi, để chạy.'] },
  practice: bank([
    { lv: 1, q: 'Con cá sống ở đâu?', a: 'dưới nước', wrong: [['trên cạn', 'Cá không thở được trên cạn đâu con.']], ex: 'Cá sống dưới nước.' },
    { lv: 1, q: 'Con mèo sống ở đâu?', a: 'trên cạn', wrong: [['dưới nước', 'Mèo sợ nước lắm!']], ex: 'Mèo sống trên cạn, trong nhà.' },
    { lv: 2, q: 'Con nào sống dưới nước?', a: 'con tôm', wrong: [['con gà', 'Gà sống trên cạn.'], ['con chó', 'Chó sống trên cạn.']], ex: 'Tôm sống dưới nước.' },
    { lv: 2, q: 'Con nào sống trên cạn?', a: 'con thỏ', wrong: [['con cua biển', 'Cua biển sống dưới nước.'], ['con cá vàng', 'Cá vàng sống trong bể nước.']], ex: 'Thỏ sống trên cạn.' },
    { lv: 2, q: 'Vì sao cá bơi được?', a: 'vì cá có vây', wrong: [['vì cá có chân', 'Cá không có chân đâu con.'], ['vì cá có cánh', 'Chim mới có cánh.']], ex: 'Cá có vây và đuôi để bơi.' },
  ]),
  remember: ['🌊 dưới nước: có vây', '🌳 trên cạn: có chân'],
  games: ['cauca', 'bongbay'],
})

const EMOTIONS: Card[] = [
  { key: 'vui', name: 'vui', emoji: '😄', say: 'Vui! Khi được mẹ ôm, con thấy vui. Con cười thật tươi nào!' },
  { key: 'buon', name: 'buồn', emoji: '😢', say: 'Buồn. Khi bị hỏng đồ chơi, con thấy buồn. Mình có thể nói với mẹ.' },
  { key: 'gian', name: 'tức giận', emoji: '😠', say: 'Tức giận. Khi tức giận, con hít thật sâu và đếm đến năm nhé.' },
  { key: 'so', name: 'sợ hãi', emoji: '😨', say: 'Sợ hãi. Khi sợ, con chạy đến với bố mẹ hoặc cô giáo.' },
  { key: 'ngac', name: 'ngạc nhiên', emoji: '😲', say: 'Ngạc nhiên! Ôi, một món quà bất ngờ!' },
]
const camXuc = defineLesson({
  ...MG,
  id: 'cam-xuc',
  title: 'Cảm xúc của bé',
  emoji: '😊',
  subject: 'nhanthuc',
  gradeLabel: '3–6 tuổi',
  essenceLine: 'Ai cũng có lúc vui, buồn, giận, sợ; gọi tên cảm xúc giúp mình bình tĩnh hơn.',
  standards: [mn('Phát triển tình cảm – xã hội · Nhận biết và thể hiện cảm xúc')],
  hook: 'Bạn nhỏ này đang cười hay đang khóc? Mình đoán cảm xúc của các bạn nhé!',
  hookVisual: '😄😢',
  explore: cardsExplore('Con chạm vào từng khuôn mặt nhé!', EMOTIONS, 'Con giỏi lắm! Nói ra cảm xúc giúp con thấy dễ chịu hơn.'),
  essence: { bigIdea: 'Gọi tên cảm xúc — rồi nói với người lớn.', points: ['Vui, buồn, giận, sợ đều bình thường.', 'Khi giận: hít thật sâu, đếm đến năm.', 'Khi sợ hay buồn: tìm bố mẹ, cô giáo.'] },
  practice: byLevel({
    1: vocab(EMOTIONS, { ask: (c) => `Bạn nào đang ${c.name}?` }),
    2: bank([
      { lv: 2, q: 'Được tặng quà sinh nhật, bạn thấy thế nào?', a: 'vui', wrong: [['buồn', 'Được quà thì vui chứ con!'], ['sợ hãi', 'Không có gì đáng sợ cả.']], ex: 'Được quà, bạn thấy vui.' },
      { lv: 2, q: 'Bạn làm vỡ đồ chơi yêu thích, bạn thấy thế nào?', a: 'buồn', wrong: [['vui', 'Đồ chơi vỡ thì buồn lắm.']], ex: 'Đồ chơi vỡ, bạn buồn. Mình nói với bố mẹ nhé.' },
      { lv: 2, q: 'Khi tức giận, con nên làm gì?', a: 'hít thật sâu, đếm đến năm', wrong: [['ném đồ chơi', 'Ném đồ có thể làm đau bạn và hỏng đồ.'], ['đánh bạn', 'Đánh bạn làm bạn đau.']], ex: 'Hít sâu và đếm giúp con bình tĩnh lại.' },
    ]),
  }),
  remember: ['😄 vui', '😢 buồn', '😠 giận: hít sâu, đếm 5', '😨 sợ: tìm người lớn'],
  games: ['bongbay'],
})

const anToan = defineLesson({
  ...MG,
  id: 'an-toan',
  title: 'Bé an toàn',
  emoji: '⚠️',
  subject: 'nhanthuc',
  gradeLabel: '3–6 tuổi',
  essenceLine: 'Đồ vật nguy hiểm có thể làm bé đau: điện, lửa, dao, thuốc, nước sâu — bé tránh xa và gọi người lớn.',
  standards: [mn('Phát triển thể chất · Nhận biết và tránh nơi nguy hiểm')],
  hook: 'Có những đồ vật trông rất vui nhưng lại nguy hiểm đấy. Con có biết là đồ gì không?',
  hookVisual: '🧯',
  explore: sortExplore(
    'Con xếp đồ vật vào giỏ An toàn hoặc giỏ Nguy hiểm nhé!',
    [
      { name: 'An toàn', emoji: '✅' },
      { name: 'Nguy hiểm', emoji: '⛔' },
    ],
    [
      { emoji: '🧸', name: 'gấu bông', bin: 0, why: 'Đúng rồi! Gấu bông mềm mại, an toàn.' },
      { emoji: '📚', name: 'quyển sách', bin: 0, why: 'Đúng rồi! Đọc sách thật vui và an toàn.' },
      { emoji: '🖍️', name: 'bút sáp màu', bin: 0, why: 'Đúng rồi! Bút sáp để vẽ, nhớ không cho vào miệng nhé.' },
      { emoji: '🔌', name: 'ổ điện', bin: 1, why: 'Đúng rồi! Ổ điện rất nguy hiểm, không bao giờ chạm vào.' },
      { emoji: '🔪', name: 'con dao', bin: 1, why: 'Đúng rồi! Dao sắc có thể làm đứt tay.' },
      { emoji: '🔥', name: 'bếp lửa', bin: 1, why: 'Đúng rồi! Lửa nóng có thể làm bỏng.' },
      { emoji: '💊', name: 'viên thuốc', bin: 1, why: 'Đúng rồi! Chỉ uống thuốc khi bố mẹ đưa cho.' },
    ],
    'Con giỏi quá! Thấy đồ nguy hiểm, con tránh xa và gọi người lớn nhé!',
  ),
  essence: { bigIdea: 'Thấy nguy hiểm: tránh xa và gọi người lớn.', points: ['Không chạm vào ổ điện.', 'Không nghịch dao, kéo nhọn, lửa.', 'Không tự uống thuốc.', 'Không ra ao hồ một mình.'] },
  practice: bank([
    { lv: 1, q: 'Con có được chạm vào ổ điện không?', a: 'không được', wrong: [['được', 'Ổ điện có thể làm con bị giật, rất nguy hiểm!']], ex: 'Không bao giờ chạm vào ổ điện.' },
    { lv: 1, q: 'Đồ chơi nào an toàn?', a: 'gấu bông', wrong: [['con dao', 'Dao sắc làm đứt tay.'], ['bật lửa', 'Lửa làm bỏng.']], ex: 'Gấu bông an toàn.' },
    { lv: 2, q: 'Thấy viên thuốc rơi trên sàn, con làm gì?', a: 'đưa cho bố mẹ', wrong: [['bỏ vào miệng', 'Thuốc không phải kẹo! Có thể làm con ốm nặng.'], ['cất vào túi', 'Con đưa cho người lớn nhé.']], ex: 'Đưa cho bố mẹ, không tự uống.' },
    { lv: 2, q: 'Con muốn ra bờ ao chơi, con cần làm gì?', a: 'đi cùng người lớn', wrong: [['đi một mình', 'Ao hồ sâu rất nguy hiểm khi đi một mình.']], ex: 'Luôn đi cùng người lớn khi gần nước.' },
  ]),
  remember: ['🔌 không chạm', '🔪🔥 tránh xa', '💊 không tự uống', '🌊 đi cùng người lớn'],
  games: ['bongbay'],
})

const WEATHER: Card[] = [
  { key: 'nang', name: 'trời nắng', emoji: '☀️', say: 'Trời nắng: con đội mũ, mặc áo mỏng nhé.' },
  { key: 'mua', name: 'trời mưa', emoji: '🌧️', say: 'Trời mưa: con mặc áo mưa, đi ủng.' },
  { key: 'gio', name: 'trời có gió', emoji: '🌬️', say: 'Trời có gió: lá cây đung đưa, thả diều thật vui.' },
  { key: 'lanh', name: 'trời lạnh', emoji: '🥶', say: 'Trời lạnh: con mặc áo ấm, quàng khăn.' },
  { key: 'cauvong', name: 'cầu vồng', emoji: '🌈', say: 'Mưa tạnh, nắng lên, có cầu vồng bảy sắc!' },
]
const thoiTiet = defineLesson({
  ...MG,
  id: 'thoi-tiet',
  title: 'Thời tiết quanh bé',
  emoji: '🌦️',
  subject: 'nhanthuc',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Thời tiết thay đổi — bé mặc quần áo phù hợp để giữ sức khỏe.',
  standards: [mn('Phát triển nhận thức · Một số hiện tượng thời tiết'), mn('Phát triển thể chất · Mặc trang phục phù hợp thời tiết')],
  hook: 'Hôm nay trời nắng hay mưa? Con mặc gì đi học nhỉ?',
  hookVisual: '🌦️',
  explore: cardsExplore('Con chạm vào từng kiểu thời tiết nhé!', WEATHER, 'Con giỏi lắm! Nhìn trời để chọn quần áo nhé!'),
  practice: byLevel({
    1: vocab(WEATHER, { ask: (c) => `Đâu là ${c.name}?` }),
    2: bank([
      { lv: 2, q: 'Trời mưa, con mặc gì?', a: 'áo mưa', wrong: [['áo tắm', 'Áo tắm để đi bơi.'], ['áo mỏng', 'Mưa sẽ ướt hết.']], ex: 'Trời mưa mặc áo mưa.' },
      { lv: 2, q: 'Trời lạnh, con mặc gì?', a: 'áo ấm', wrong: [['áo cộc tay', 'Áo cộc tay để trời nóng.']], ex: 'Trời lạnh mặc áo ấm, quàng khăn.' },
      { lv: 2, q: 'Trời nắng, con đội gì?', a: 'mũ', wrong: [['ô che mưa', 'Ô dùng khi mưa, nhưng mũ tiện hơn khi nắng.']], ex: 'Trời nắng đội mũ để không bị say nắng.' },
    ]),
  }),
  remember: ['☀️ đội mũ', '🌧️ áo mưa', '🥶 áo ấm'],
  games: ['bongbay', 'cauca'],
})

// ───────────────────────── Làm quen chữ cái (5–6 tuổi) ─────────────────────────

interface LetterInfo {
  l: string
  call: string
  hint: string
  word: string
  emoji: string
}
const LETTERS: [string, LetterInfo[]][] = [
  ['o-o-o', [
    { l: 'o', call: 'o', hint: 'tròn như quả trứng gà', word: 'con ong', emoji: '🐝' },
    { l: 'ô', call: 'ô', hint: 'chữ o đội mũ', word: 'cái ô', emoji: '☂️' },
    { l: 'ơ', call: 'ơ', hint: 'chữ o có râu', word: 'quả ớt', emoji: '🌶️' },
  ]],
  ['a-a-a', [
    { l: 'a', call: 'a', hint: 'một nét cong tròn và một nét thẳng', word: 'con gà', emoji: '🐔' },
    { l: 'ă', call: 'á', hint: 'chữ a đội mũ ngược như cái bát', word: 'con tằm', emoji: '🐛' },
    { l: 'â', call: 'ớ', hint: 'chữ a đội mũ nhọn', word: 'cái cân', emoji: '⚖️' },
  ]],
  ['e-e', [
    { l: 'e', call: 'e', hint: 'nét ngang và nét cong hở', word: 'xe', emoji: '🚗' },
    { l: 'ê', call: 'ê', hint: 'chữ e đội mũ', word: 'con dế', emoji: '🦗' },
  ]],
  ['u-u', [
    { l: 'u', call: 'u', hint: 'như cái móc treo', word: 'cái tủ', emoji: '🗄️' },
    { l: 'ư', call: 'ư', hint: 'chữ u có râu', word: 'con sư tử', emoji: '🦁' },
  ]],
  ['i-t-c', [
    { l: 'i', call: 'i', hint: 'một nét thẳng và một dấu chấm', word: 'con chim', emoji: '🐦' },
    { l: 't', call: 'tờ', hint: 'nét thẳng có nét ngang', word: 'quả táo', emoji: '🍎' },
    { l: 'c', call: 'cờ', hint: 'nét cong hở phải', word: 'con cá', emoji: '🐟' },
  ]],
  ['b-d-d', [
    { l: 'b', call: 'bờ', hint: 'nét thẳng dài và nét cong bên phải', word: 'quả bóng', emoji: '⚽' },
    { l: 'd', call: 'dờ', hint: 'nét cong bên trái và nét thẳng dài', word: 'quả dứa', emoji: '🍍' },
    { l: 'đ', call: 'đờ', hint: 'chữ d có thêm nét ngang', word: 'đèn ông sao', emoji: '🏮' },
  ]],
  ['l-m-n', [
    { l: 'l', call: 'lờ', hint: 'một nét thẳng dài', word: 'chiếc lá', emoji: '🍃' },
    { l: 'm', call: 'mờ', hint: 'có ba chân', word: 'con mèo', emoji: '🐱' },
    { l: 'n', call: 'nờ', hint: 'có hai chân', word: 'cái nồi', emoji: '🍲' },
  ]],
  ['h-k', [
    { l: 'h', call: 'hờ', hint: 'nét thẳng dài và nét móc', word: 'bông hoa', emoji: '🌸' },
    { l: 'k', call: 'ca', hint: 'nét thẳng và hai nét xiên', word: 'cái kéo', emoji: '✂️' },
  ]],
  ['p-q', [
    { l: 'p', call: 'pờ', hint: 'nét cong bên phải và nét thẳng xuống dưới', word: 'đèn pin', emoji: '🔦' },
    { l: 'q', call: 'quy', hint: 'nét cong bên trái và nét thẳng xuống dưới', word: 'quả bóng bay', emoji: '🎈' },
  ]],
  ['g-y', [
    { l: 'g', call: 'gờ', hint: 'nét cong và nét móc dưới', word: 'con gà', emoji: '🐓' },
    { l: 'y', call: 'i dài', hint: 'có đuôi dài xuống dưới', word: 'y tá', emoji: '👩‍⚕️' },
  ]],
  ['s-x', [
    { l: 's', call: 'sờ', hint: 'uốn cong như con rắn', word: 'ngôi sao', emoji: '⭐' },
    { l: 'x', call: 'xờ', hint: 'hai nét xiên chéo nhau', word: 'xe đạp', emoji: '🚲' },
  ]],
  ['v-r', [
    { l: 'v', call: 'vờ', hint: 'hai nét xiên chụm dưới', word: 'con voi', emoji: '🐘' },
    { l: 'r', call: 'rờ', hint: 'nét thẳng và nét móc nhỏ', word: 'con rùa', emoji: '🐢' },
  ]],
]

function letterLesson(id: string, group: LetterInfo[], idx: number, prev?: string): Defined {
  const names = group.map((x) => x.l).join(', ')
  const cards: Card[] = group.map((x, i) => ({
    key: x.l,
    name: `chữ ${x.l}`,
    emoji: x.l,
    color: ['#ff8fb8', '#6aa8ff', '#5ad1a4'][i % 3],
    say: `Đây là chữ ${x.call}. Chữ ${x.call} ${x.hint}. Có trong từ: ${x.word}.`,
    sub: `${x.emoji} ${x.word}`,
  }))
  const gen: Gen = (level, rng) => {
    const t = pick(rng, group)
    const pool = shuffle(rng, LETTERS.flatMap(([, g]) => g).filter((x) => x.l !== t.l))
    const others = level === 1 ? group.filter((x) => x.l !== t.l).slice(0, 2) : pool.slice(0, 2)
    const opts = shuffle(rng, [t, ...(others.length ? others : pool.slice(0, 2))])
    if (level === 1)
      return {
        level,
        prompt: `Đâu là chữ ${t.call}?`,
        layout: 'big',
        choices: opts.map((o) => ({ label: o.l, visual: <span className="letter-visual">{o.l}</span>, correct: o.l === t.l, why: o.l === t.l ? undefined : `Đây là chữ ${o.call}. Chữ ${t.call} ${t.hint} cơ.`, misconception: o.l === t.l ? undefined : 'nham-chu-cai' })),
        explain: `Đúng rồi! Đây là chữ ${t.call}.`,
      }
    return {
      level,
      prompt: `Từ "${t.word}" có chữ nào?`,
      visual: <span className="hook-emoji">{t.emoji}</span>,
      layout: 'big',
      choices: opts.map((o) => ({ label: o.l, visual: <span className="letter-visual">{o.l}</span>, correct: o.l === t.l, why: o.l === t.l ? undefined : `Chữ ${o.call} không có trong từ ${t.word}.`, misconception: o.l === t.l ? undefined : 'nham-chu-cai' })),
      explain: `${t.word}: có chữ ${t.call}.`,
    }
  }
  return defineLesson({
    ...MG,
    id: `chu-${id}`,
    title: `Chữ cái ${names}`,
    emoji: group[0].l.toUpperCase(),
    subject: 'ngonngu',
    gradeLabel: '5–6 tuổi',
    essenceLine: `Nhận biết và phát âm chữ ${names}; tìm chữ trong từ quen thuộc.`,
    standards: [mn('Phát triển ngôn ngữ · Làm quen với chữ viết: nhận dạng 29 chữ cái')],
    prereqs: prev ? [prev] : [],
    hook: `Hôm nay cô giới thiệu với con ${group.length} bạn chữ cái mới: ${group.map((x) => x.call).join(', ')}. Mình cùng làm quen nhé!`,
    hookVisual: group.map((x) => x.l).join(' '),
    explore: cardsExplore('Con chạm vào từng chữ để nghe cô đọc nhé!', cards, `Con giỏi quá! Con đã biết chữ ${group.map((x) => x.call).join(', ')}.`, { big: false }),
    essence: { bigIdea: `Chữ ${names}: nhìn hình, nghe âm, tìm trong từ.`, points: group.map((x) => `Chữ ${x.call}: ${x.hint} — ${x.word}.`) },
    practice: gen,
    remember: group.map((x) => `${x.l} — ${x.emoji} ${x.word}`),
    games: ['bongbay', 'chuotchui', 'latthe'],
    pairs: group.map((x) => [x.l, x.emoji] as [string, string]).concat(idx > 0 ? LETTERS[idx - 1][1].map((x) => [x.l, x.emoji] as [string, string]) : []),
  })
}
const letterLessons: Defined[] = LETTERS.map(([id, group], i) => letterLesson(id, group, i, i > 0 ? `chu-${LETTERS[i - 1][0]}` : undefined))

// ───────────────────────── Tiếng Anh mầm non ─────────────────────────

const EN_COLORS: (Card & { en: string })[] = [
  { key: 'red', en: 'red', name: 'màu đỏ', emoji: '🍎', color: '#ef4444', say: [{ text: 'Red', lang: 'en' }, 'Red là màu đỏ.'], sub: 'red' },
  { key: 'yellow', en: 'yellow', name: 'màu vàng', emoji: '🍌', color: '#facc15', say: [{ text: 'Yellow', lang: 'en' }, 'Yellow là màu vàng.'], sub: 'yellow' },
  { key: 'blue', en: 'blue', name: 'màu xanh dương', emoji: '🐳', color: '#3b82f6', say: [{ text: 'Blue', lang: 'en' }, 'Blue là màu xanh dương.'], sub: 'blue' },
  { key: 'green', en: 'green', name: 'màu xanh lá', emoji: '🐸', color: '#22c55e', say: [{ text: 'Green', lang: 'en' }, 'Green là màu xanh lá.'], sub: 'green' },
]
const enMauSac = defineLesson({
  ...MG,
  id: 'en-mau',
  title: 'Màu sắc bằng tiếng Anh',
  emoji: '🎨',
  subject: 'tienganh',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Nghe trước, nói theo: red, yellow, blue, green.',
  standards: [ce('Tiền A1 · Nghe và nhận biết từ quen thuộc')],
  prereqs: ['mam.mau-sac'],
  hook: 'Màu đỏ tiếng Anh gọi là gì nhỉ? Mình cùng nghe nhé!',
  hookVisual: '🇬🇧🎨',
  explore: cardsExplore('Con chạm vào từng màu và nói theo nhé!', EN_COLORS, 'Con giỏi quá! Red, yellow, blue, green!'),
  practice: vocab(EN_COLORS, { en: (c) => (c as (typeof EN_COLORS)[number]).en, name: true }),
  remember: ['🍎 red', '🍌 yellow', '🐳 blue', '🐸 green'],
  games: ['bongbay', 'latthe'],
  pairs: EN_COLORS.map((c) => [c.emoji, c.en]),
})

const EN_ANIMALS: (Card & { en: string })[] = [
  { key: 'cat', en: 'cat', name: 'con mèo', emoji: '🐱', say: [{ text: 'Cat', lang: 'en' }, 'Cat là con mèo.'], sub: 'cat' },
  { key: 'dog', en: 'dog', name: 'con chó', emoji: '🐶', say: [{ text: 'Dog', lang: 'en' }, 'Dog là con chó.'], sub: 'dog' },
  { key: 'fish', en: 'fish', name: 'con cá', emoji: '🐟', say: [{ text: 'Fish', lang: 'en' }, 'Fish là con cá.'], sub: 'fish' },
  { key: 'bird', en: 'bird', name: 'con chim', emoji: '🐦', say: [{ text: 'Bird', lang: 'en' }, 'Bird là con chim.'], sub: 'bird' },
  { key: 'duck', en: 'duck', name: 'con vịt', emoji: '🦆', say: [{ text: 'Duck', lang: 'en' }, 'Duck là con vịt.'], sub: 'duck' },
]
const enConVat = defineLesson({
  ...MG,
  id: 'en-con-vat',
  title: 'Con vật bằng tiếng Anh',
  emoji: '🐶',
  subject: 'tienganh',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'Nghe và gọi tên con vật bằng tiếng Anh: cat, dog, fish, bird, duck.',
  standards: [ce('Tiền A1 · Nghe và nhận biết từ quen thuộc')],
  prereqs: ['mam.con-vat'],
  hook: 'Con mèo tiếng Anh gọi là gì? Mình cùng nghe nhé!',
  hookVisual: '🇬🇧🐱',
  explore: cardsExplore('Con chạm vào từng con vật và nói theo nhé!', EN_ANIMALS, 'Cat, dog, fish, bird, duck! Con giỏi quá!'),
  practice: vocab(EN_ANIMALS, { en: (c) => (c as (typeof EN_ANIMALS)[number]).en, name: true }),
  remember: EN_ANIMALS.map((a) => `${a.emoji} ${a.en}`),
  games: ['bongbay', 'latthe'],
  pairs: EN_ANIMALS.map((a) => [a.emoji, a.en]),
})

const enSo = defineLesson({
  ...MG,
  id: 'en-so',
  title: 'Đếm 1–5 bằng tiếng Anh',
  emoji: '🖐️',
  subject: 'tienganh',
  gradeLabel: '4–6 tuổi',
  essenceLine: 'One, two, three, four, five — đếm ngón tay bằng tiếng Anh.',
  standards: [ce('Tiền A1 · Số đếm 1–5')],
  prereqs: ['choi.dem-10'],
  hook: 'Con giơ năm ngón tay lên nào! Mình đếm bằng tiếng Anh nhé!',
  hookVisual: '🖐️',
  explore: cardsExplore(
    'Con chạm vào từng số và đếm theo cô nhé!',
    ['one', 'two', 'three', 'four', 'five'].map((w, i) => ({ key: w, name: `số ${i + 1}`, emoji: String(i + 1), say: [{ text: w, lang: 'en' as const }, `${w} là số ${numberWord(i + 1)}.`], sub: w })),
    'One, two, three, four, five! Giỏi quá!',
    { big: false },
  ),
  practice: (level, rng) => {
    const words = ['one', 'two', 'three', 'four', 'five']
    const n = int(rng, 1, 5)
    const opts = shuffle(rng, [n, ...shuffle(rng, [1, 2, 3, 4, 5].filter((x) => x !== n)).slice(0, level === 1 ? 1 : 2)])
    return {
      level,
      prompt: `Nghe cô đọc rồi chọn số đúng: ${words[n - 1]}`,
      speakSegs: ['Nghe cô đọc rồi chọn số đúng:', { text: words[n - 1], lang: 'en' }],
      layout: 'big',
      choices: opts.map((x) => ({ label: String(x), visual: <span className="letter-visual">{x}</span>, correct: x === n, why: x === n ? undefined : `${words[x - 1]} là số ${x}.`, misconception: x === n ? undefined : 'nham-doi-tuong' })),
      explain: `${words[n - 1]} là số ${n}.`,
    }
  },
  remember: ['1 one', '2 two', '3 three', '4 four', '5 five'],
  games: ['bongbay', 'latthe'],
  pairs: ['one', 'two', 'three', 'four', 'five'].map((w, i) => [String(i + 1), w]),
})

// Đếm 1–10 (bài cũ) vẫn ở lessons/counting.tsx; bổ sung bài đếm theo nhóm đồ vật cho bé 3–4 tuổi.
const dem5 = defineLesson({
  ...MG,
  id: 'dem-5',
  title: 'Đếm đến 5',
  emoji: '🖐️',
  subject: 'toan',
  gradeLabel: '3–4 tuổi',
  essenceLine: 'Chạm từng vật và đếm một lần; số cuối cùng là số lượng.',
  standards: [mn('Phát triển nhận thức · Đếm trên đối tượng trong phạm vi 5'), cc('K.CC.B.4')],
  prereqs: ['mam.mot-nhieu'],
  hook: 'Con có mấy ngón tay trên một bàn tay? Mình cùng đếm nhé!',
  hookVisual: '🖐️',
  explore: cardsExplore(
    'Con chạm từng số và đếm theo cô nhé!',
    [1, 2, 3, 4, 5].map((n) => ({ key: `d${n}`, name: numberWord(n), emoji: '🍓'.repeat(n), say: `${numberWord(n)}! Có ${numberWord(n)} quả dâu.`, sub: String(n) })),
    'Một, hai, ba, bốn, năm! Con đếm giỏi quá!',
    { big: false },
  ),
  practice: countGen([{ emoji: '🍓', name: 'quả dâu' }, { emoji: '🐥', name: 'chú gà con' }, { emoji: '🎈', name: 'quả bóng bay' }, { emoji: '🐞', name: 'con bọ rùa' }], 5),
  remember: ['Chạm từng cái', 'Đếm một lần', 'Số cuối = có tất cả'],
  games: ['bongbay', 'cauca'],
})

export const MAM_NON: Defined[] = [
  mauSac, conVat, hinhDang, toNho, motNhieu, coThe, quaRau, xeCo, giaDinh,
  dem5, so110, soSanh, tachGop, hinhHoc, quyLuat, viTri, buoiNgay, phanLoai, camXuc, anToan, thoiTiet,
  ...letterLessons, enMauSac, enConVat, enSo,
]


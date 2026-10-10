// TIẾNG ANH TIỂU HỌC (Chương trình GDPT 2018, lớp 3–5; tham chiếu Cambridge Starters / CEFR Tiền A1–A1).
// Từ tiếng Anh do giọng tiếng Anh đọc, lời giảng của cô bằng tiếng Việt.
import { ce, g } from '../core/standards'
import { pick, shuffle } from '../core/rng'
import { defineLesson, tb, type Defined } from './define'
import { cardsExplore, type Card } from './kit'
import { bank, byLevel, vocab, type Gen } from './questions'

const E = (grade: number) => ({ stage: 'tieuhoc' as const, grade, gradeLabel: `Lớp ${grade}`, subject: 'tienganh' as const })

type W = [en: string, vi: string, emoji: string]
const words = (list: W[]): (Card & { en: string })[] =>
  list.map(([en, vi, emoji]) => ({ key: en, en, name: vi, emoji, sub: en, say: [{ text: en, lang: 'en' as const }, `${en} nghĩa là ${vi}.`] }))

function vocabLesson(o: {
  id: string
  grade: number
  title: string
  emoji: string
  essence: string
  hook: string
  list: W[]
  prereqs?: string[]
  extra?: Gen
  remember?: string[]
}): Defined {
  const cards = words(o.list)
  const v = vocab(cards, { en: (c) => (c as (typeof cards)[number]).en, name: true })
  return defineLesson({
    ...E(o.grade),
    id: o.id,
    title: o.title,
    emoji: o.emoji,
    essenceLine: o.essence,
    standards: [g(`Tiếng Anh ${o.grade} · Từ vựng theo chủ đề`), ce('Tiền A1 – A1')],
    prereqs: o.prereqs,
    hook: o.hook,
    hookVisual: o.list.slice(0, 3).map((x) => x[2]).join(''),
    explore: cardsExplore('Em chạm vào từng thẻ, nghe và nói theo nhé!', cards, 'Em giỏi lắm! Nghe nhiều lần, nói to theo là nhớ ngay.', { big: false }),
    essence: { bigIdea: 'Nghe – nhìn hình – nói theo: học từ gắn với hình ảnh.', points: ['Nghe từ nhiều lần trước khi viết.', 'Gắn từ với hình ảnh, không dịch từng chữ.', 'Đặt từ vào câu ngắn để nhớ lâu.'] },
    practice: o.extra ? byLevel({ 1: v, 2: v, 3: o.extra }) : v,
    remember: o.remember ?? o.list.map(([en, vi, e]) => `${e} ${en} — ${vi}`),
    games: ['bongbay', 'latthe', 'cauca'],
    pairs: o.list.slice(0, 6).map(([en, , e]) => [e, en]),
  })
}

const sentence = (items: { q: string; a: string; wrong: [string, string][]; ex: string; say?: string }[]): Gen =>
  bank(items.map((it) => ({ lv: 3 as const, q: it.q, a: it.a, wrong: it.wrong, ex: it.ex, layout: 'list' as const, speak: it.say ? [it.q.split(':')[0] + ':', { text: it.say, lang: 'en' as const }] : undefined })))

const enChaoHoi = defineLesson({
  ...E(3),
  id: 'en-chao-hoi',
  title: 'Chào hỏi và giới thiệu',
  emoji: '👋',
  essenceLine: 'Hello / Hi để chào; What\'s your name? — My name is…; How are you? — I\'m fine, thank you.',
  standards: [g('Tiếng Anh 3 · Unit: Hello'), ce('Tiền A1 · Chào hỏi, giới thiệu bản thân')],
  prereqs: ['choi.en-mau'],
  hook: 'Gặp một bạn nước ngoài, em sẽ chào và hỏi tên bạn ấy thế nào?',
  hookVisual: '👋🌍',
  explore: cardsExplore(
    'Em chạm từng câu, nghe và nói theo nhé!',
    [
      { key: 'hello', name: 'Xin chào', emoji: '👋', sub: 'Hello!', say: [{ text: 'Hello!', lang: 'en' }, 'Hello nghĩa là xin chào.'] },
      { key: 'name', name: 'Bạn tên là gì?', emoji: '❓', sub: "What's your name?", say: [{ text: "What's your name?", lang: 'en' }, 'Câu này hỏi: bạn tên là gì?'] },
      { key: 'my', name: 'Tên mình là…', emoji: '🙋', sub: 'My name is Lan.', say: [{ text: 'My name is Lan.', lang: 'en' }, 'Trả lời: tên mình là Lan.'] },
      { key: 'how', name: 'Bạn khỏe không?', emoji: '😊', sub: 'How are you?', say: [{ text: 'How are you?', lang: 'en' }, 'Câu này hỏi: bạn có khỏe không?'] },
      { key: 'fine', name: 'Mình khỏe, cảm ơn', emoji: '👍', sub: "I'm fine, thank you.", say: [{ text: "I'm fine, thank you.", lang: 'en' }, 'Trả lời: mình khỏe, cảm ơn bạn.'] },
      { key: 'bye', name: 'Tạm biệt', emoji: '🖐️', sub: 'Goodbye!', say: [{ text: 'Goodbye!', lang: 'en' }, 'Goodbye nghĩa là tạm biệt.'] },
    ],
    'Em giỏi lắm! Hello, how are you? I\'m fine, thank you!',
    { big: false },
  ),
  essence: { bigIdea: 'Mỗi câu hỏi có một cách trả lời đi kèm.', points: ["What's your name? → My name is …", 'How are you? → I\'m fine, thank you.', 'Hello khi gặp, Goodbye khi chia tay.'] },
  practice: bank([
    { lv: 1, q: 'Khi gặp bạn, em nói gì?', a: 'Hello!', wrong: [['Goodbye!', 'Goodbye dùng khi chia tay.'], ['Thank you!', 'Thank you là cảm ơn.']], ex: 'Hello! — Xin chào!' },
    { lv: 1, q: '"Goodbye" nghĩa là gì?', a: 'tạm biệt', wrong: [['xin chào', 'Xin chào là Hello.'], ['cảm ơn', 'Cảm ơn là Thank you.']], ex: 'Goodbye — tạm biệt.' },
    { lv: 2, q: 'Câu trả lời đúng cho "What\'s your name?" là?', a: 'My name is Nam.', wrong: [["I'm fine, thank you.", 'Câu này trả lời cho How are you?'], ['Goodbye.', 'Đó là lời tạm biệt.']], ex: "What's your name? → My name is …" },
    { lv: 2, q: 'Câu trả lời đúng cho "How are you?" là?', a: "I'm fine, thank you.", wrong: [['My name is Mai.', 'Câu này trả lời cho câu hỏi tên.'], ['Hello.', 'Đó là lời chào.']], ex: "How are you? → I'm fine, thank you." },
  ]),
  teachBack: tb('Bạn hỏi "How are you?", vì sao không trả lời "My name is Lan"?', ['🐰 Thỏ', 'Vì "How are you?" hỏi bạn có khỏe không, phải trả lời "I\'m fine, thank you."', 'Đúng!'], [['🐻 Gấu', 'Vì "My name is" dài quá.', 'Lý do là câu hỏi khác nhau.'], ['🐸 Ếch', 'Trả lời câu nào cũng được.', 'Mỗi câu hỏi có câu trả lời riêng.']]),
  remember: ['Hello / Goodbye', "What's your name? → My name is…", "How are you? → I'm fine, thank you."],
  games: ['bongbay', 'latthe'],
  pairs: [['👋', 'Hello'], ['🖐️', 'Goodbye'], ['🙏', 'Thank you'], ['😊', 'fine']],
})

const NUM: W[] = [
  ['one', 'một', '1️⃣'],
  ['two', 'hai', '2️⃣'],
  ['three', 'ba', '3️⃣'],
  ['four', 'bốn', '4️⃣'],
  ['five', 'năm', '5️⃣'],
  ['six', 'sáu', '6️⃣'],
  ['seven', 'bảy', '7️⃣'],
  ['eight', 'tám', '8️⃣'],
  ['nine', 'chín', '9️⃣'],
  ['ten', 'mười', '🔟'],
]
const enSoDem = vocabLesson({
  id: 'en-so-dem',
  grade: 3,
  title: 'Số đếm 1–10 và "How many?"',
  emoji: '🔢',
  essence: 'One to ten; hỏi số lượng: How many …? — There are …',
  hook: 'How many fingers? Em đếm ngón tay bằng tiếng Anh nhé!',
  list: NUM,
  prereqs: ['choi.en-so'],
  extra: sentence([
    { q: 'Câu hỏi số lượng bắt đầu bằng?', a: 'How many', wrong: [['What color', 'What color hỏi màu sắc.'], ['How are', 'How are you hỏi sức khỏe.']], ex: 'How many …? — Bao nhiêu …?' },
    { q: 'Ba cộng bốn bằng mấy (bằng tiếng Anh)?', a: 'seven', wrong: [['six', 'six là 6.'], ['eight', 'eight là 8.']], ex: 'three + four = seven.' },
  ]),
})

const enGiaDinh = vocabLesson({
  id: 'en-gia-dinh',
  grade: 3,
  title: 'Gia đình (Family)',
  emoji: '👨‍👩‍👧',
  essence: 'father, mother, brother, sister, grandfather, grandmother — This is my …',
  hook: 'Em giới thiệu bố mẹ mình bằng tiếng Anh thế nào? This is my …',
  list: [
    ['father', 'bố', '👨'],
    ['mother', 'mẹ', '👩'],
    ['brother', 'anh/em trai', '👦'],
    ['sister', 'chị/em gái', '👧'],
    ['grandfather', 'ông', '👴'],
    ['grandmother', 'bà', '👵'],
  ],
  extra: sentence([
    { q: 'Giới thiệu mẹ, em nói: …', a: 'This is my mother.', wrong: [['This is my father.', 'father là bố.'], ['This is my sister.', 'sister là chị/em gái.']], ex: 'This is my mother. — Đây là mẹ tôi.' },
    { q: '"grandmother" là ai?', a: 'bà', wrong: [['ông', 'Ông là grandfather.'], ['mẹ', 'Mẹ là mother.']], ex: 'grandmother — bà.' },
  ]),
})

const enDoDung = vocabLesson({
  id: 'en-do-dung',
  grade: 3,
  title: 'Đồ dùng học tập (School things)',
  emoji: '✏️',
  essence: 'pen, pencil, book, ruler, eraser, school bag — It\'s a …',
  hook: 'Trong cặp sách của em có gì? Gọi tên bằng tiếng Anh nhé!',
  list: [
    ['pen', 'bút mực', '🖊️'],
    ['pencil', 'bút chì', '✏️'],
    ['book', 'quyển sách', '📕'],
    ['ruler', 'thước kẻ', '📏'],
    ['eraser', 'cục tẩy', '🧽'],
    ['school bag', 'cặp sách', '🎒'],
  ],
  extra: sentence([
    { q: 'Hỏi "Đây là cái gì?" em nói: …', a: "What's this?", wrong: [['How are you?', 'Đó là hỏi sức khỏe.'], ['How many?', 'Đó là hỏi số lượng.']], ex: "What's this? — It's a pencil." },
    { q: 'Câu đúng là: …', a: "It's a ruler.", wrong: [["It's ruler.", 'Thiếu "a" trước danh từ số ít.'], ["It a ruler.", 'Thiếu "is".']], ex: "It's a ruler. — Đó là cái thước." },
  ]),
})

const enConVat = vocabLesson({
  id: 'en-con-vat-th',
  grade: 3,
  title: 'Con vật (Animals)',
  emoji: '🐘',
  essence: 'elephant, tiger, monkey, rabbit, bird, fish — I like …',
  hook: 'Ở sở thú có những con gì? Em gọi tên bằng tiếng Anh nhé!',
  list: [
    ['elephant', 'con voi', '🐘'],
    ['tiger', 'con hổ', '🐯'],
    ['monkey', 'con khỉ', '🐒'],
    ['rabbit', 'con thỏ', '🐰'],
    ['bird', 'con chim', '🐦'],
    ['fish', 'con cá', '🐟'],
  ],
  prereqs: ['choi.en-con-vat'],
  extra: sentence([
    { q: 'Câu "Tôi thích khỉ" là: …', a: 'I like monkeys.', wrong: [['I like monkey is.', 'Không cần "is".'], ['Like I monkeys.', 'Sai trật tự: I + like + …']], ex: 'I like monkeys. — Tôi thích khỉ.' },
    { q: '"tiger" là con gì?', a: 'con hổ', wrong: [['con voi', 'Voi là elephant.'], ['con khỉ', 'Khỉ là monkey.']], ex: 'tiger — con hổ.' },
  ]),
})

const enDoAn = vocabLesson({
  id: 'en-do-an',
  grade: 4,
  title: 'Đồ ăn, đồ uống (Food and drinks)',
  emoji: '🍔',
  essence: 'rice, bread, milk, water, apple, chicken — I\'d like … / Do you like …?',
  hook: 'Đi ăn ở nhà hàng nước ngoài, em gọi món thế nào?',
  list: [
    ['rice', 'cơm', '🍚'],
    ['bread', 'bánh mì', '🍞'],
    ['milk', 'sữa', '🥛'],
    ['water', 'nước', '💧'],
    ['apple', 'quả táo', '🍎'],
    ['chicken', 'thịt gà', '🍗'],
  ],
  prereqs: ['en-con-vat-th'],
  extra: sentence([
    { q: 'Gọi một cốc sữa, em nói: …', a: "I'd like some milk, please.", wrong: [["I'd like some milks, please.", '"milk" không đếm được, không thêm s.'], ['Milk I like.', 'Sai trật tự câu.']], ex: "I'd like some milk, please." },
    { q: 'Hỏi "Bạn có thích gà không?" là: …', a: 'Do you like chicken?', wrong: [['You like chicken do?', 'Câu hỏi bắt đầu bằng Do.'], ['Like you chicken?', 'Thiếu Do và sai trật tự.']], ex: 'Do you like chicken? — Yes, I do. / No, I don\'t.' },
  ]),
})

const enCoThe = vocabLesson({
  id: 'en-co-the',
  grade: 4,
  title: 'Cơ thể (Body)',
  emoji: '🧍',
  essence: 'head, eyes, ears, nose, mouth, hands — Touch your …',
  hook: 'Trò chơi "Touch your nose!" — chạm vào mũi nào! Em đã sẵn sàng chưa?',
  list: [
    ['head', 'cái đầu', '🙂'],
    ['eyes', 'đôi mắt', '👀'],
    ['ears', 'đôi tai', '👂'],
    ['nose', 'cái mũi', '👃'],
    ['mouth', 'cái miệng', '👄'],
    ['hands', 'đôi bàn tay', '👐'],
  ],
  extra: sentence([
    { q: '"Touch your nose" nghĩa là gì?', a: 'Chạm vào mũi của em', wrong: [['Nhìn vào mắt', 'eyes mới là mắt.'], ['Vỗ tay', 'Vỗ tay là clap your hands.']], ex: 'Touch your nose — chạm vào mũi.' },
    { q: 'Mắt (hai mắt) tiếng Anh là?', a: 'eyes', wrong: [['eye', 'eye là một con mắt; hai mắt thêm s.'], ['ears', 'ears là tai.']], ex: 'eyes — đôi mắt.' },
  ]),
})

const enThoiTiet = vocabLesson({
  id: 'en-thoi-tiet',
  grade: 4,
  title: 'Thời tiết (Weather)',
  emoji: '🌦️',
  essence: 'sunny, rainy, cloudy, windy, hot, cold — What\'s the weather like? It\'s …',
  hook: 'Hôm nay trời thế nào? Em nói bằng tiếng Anh được không?',
  list: [
    ['sunny', 'trời nắng', '☀️'],
    ['rainy', 'trời mưa', '🌧️'],
    ['cloudy', 'nhiều mây', '☁️'],
    ['windy', 'nhiều gió', '🌬️'],
    ['hot', 'nóng', '🥵'],
    ['cold', 'lạnh', '🥶'],
  ],
  extra: sentence([
    { q: 'Hỏi thời tiết, em nói: …', a: "What's the weather like?", wrong: [["What's your name?", 'Đó là hỏi tên.'], ['How many?', 'Đó là hỏi số lượng.']], ex: "What's the weather like? — It's sunny." },
    { q: 'Trời đang mưa: …', a: "It's rainy.", wrong: [["It's sunny.", 'sunny là nắng.'], ["It's rain.", 'Tính từ là rainy.']], ex: "It's rainy. — Trời mưa." },
  ]),
})

const presentGen: Gen = (level, rng) => {
  const subj = pick(rng, [
    ['I', false],
    ['You', false],
    ['We', false],
    ['They', false],
    ['He', true],
    ['She', true],
    ['My mother', true],
    ['Nam', true],
  ] as [string, boolean][])
  const verb = pick(rng, [
    ['play', 'plays', 'chơi'],
    ['read', 'reads', 'đọc'],
    ['go', 'goes', 'đi'],
    ['watch', 'watches', 'xem'],
    ['like', 'likes', 'thích'],
  ])
  const [, third] = subj
  const right = third ? verb[1] : verb[0]
  const wrongV = third ? verb[0] : verb[1]
  if (level === 1)
    return {
      level,
      prompt: `Chọn từ đúng: "${subj[0]} ___ football every day."`.replace('football', verb[0] === 'read' ? 'books' : verb[0] === 'watch' ? 'TV' : verb[0] === 'go' ? 'to school' : verb[0] === 'like' ? 'cats' : 'football'),
      choices: shuffle(rng, [
        { label: right, correct: true },
        { label: wrongV, why: third ? `Chủ ngữ ${subj[0]} là ngôi thứ ba số ít nên động từ thêm s/es.` : `Chủ ngữ ${subj[0]} không phải ngôi thứ ba số ít nên động từ giữ nguyên.`, misconception: 'ng:Chia sai động từ thì hiện tại đơn' },
      ]),
      explain: third ? `${subj[0]} (ngôi thứ ba số ít) → ${right}.` : `${subj[0]} → ${right} (giữ nguyên).`,
    }
  return bank([
    { lv: 2, q: 'Thì hiện tại đơn dùng để nói về điều gì?', a: 'thói quen và sự thật luôn đúng', wrong: [['việc đang xảy ra ngay lúc nói', 'Đó là thì hiện tại tiếp diễn.'], ['việc đã xảy ra hôm qua', 'Đó là thì quá khứ.']], ex: 'Hiện tại đơn: thói quen (every day) và sự thật (The sun rises in the east).' },
    { lv: 2, q: 'Câu nào đúng?', a: 'She goes to school by bike.', wrong: [['She go to school by bike.', 'She → goes (thêm es).'], ['She gos to school by bike.', 'go → goes (thêm es vì tận cùng là o).']], ex: 'She goes to school by bike.' },
    { lv: 3, q: 'Câu phủ định đúng là?', a: "He doesn't like milk.", wrong: [["He don't like milk.", 'He dùng doesn\'t.'], ["He doesn't likes milk.", 'Sau doesn\'t, động từ giữ nguyên.']], ex: "He doesn't like milk." },
    { lv: 3, q: 'Câu nào nói một sự thật luôn đúng?', a: 'The sun rises in the east.', wrong: [['I am reading a book now.', 'Đó là việc đang xảy ra (hiện tại tiếp diễn).'], ['I played football yesterday.', 'Đó là quá khứ.']], ex: 'Mặt Trời mọc ở phía Đông — sự thật luôn đúng.' },
  ])(level, rng)
}
const enHienTaiDon = defineLesson({
  ...E(5),
  id: 'en-hien-tai-don',
  title: 'Thì hiện tại đơn (Present simple)',
  emoji: '🔁',
  essenceLine: 'Hiện tại đơn nói về thói quen và sự thật luôn đúng; he/she/it thì động từ thêm s/es.',
  standards: [g('Tiếng Anh 5 · Ngữ pháp · Thì hiện tại đơn'), ce('A1')],
  prereqs: ['en-con-vat-th'],
  hook: '"I play football" nhưng "He plays football" — chữ s ở đâu ra vậy?',
  hookVisual: '⚽🔁',
  explore: cardsExplore(
    'Em chạm từng câu, nghe và để ý động từ nhé!',
    [
      { key: 'i', name: 'I play football.', emoji: '🙋', sub: 'Tôi chơi bóng đá.', say: [{ text: 'I play football every day.', lang: 'en' }, 'Với I, động từ giữ nguyên: play.'] },
      { key: 'he', name: 'He plays football.', emoji: '👦', sub: 'Anh ấy chơi bóng đá.', say: [{ text: 'He plays football every day.', lang: 'en' }, 'Với he, she, it: thêm s vào động từ: plays.'] },
      { key: 'she', name: 'She goes to school.', emoji: '👧', sub: 'Cô ấy đi học.', say: [{ text: 'She goes to school.', lang: 'en' }, 'Động từ tận cùng bằng o, s, ch, sh, x thì thêm es: goes, watches.'] },
      { key: 'sun', name: 'The sun rises in the east.', emoji: '🌅', sub: 'Mặt Trời mọc ở phía Đông.', say: [{ text: 'The sun rises in the east.', lang: 'en' }, 'Hiện tại đơn còn dùng cho sự thật luôn đúng.'] },
    ],
    'Em giỏi lắm! He, she, it thì thêm s hoặc es.',
    { big: false },
  ),
  essence: { bigIdea: 'Thói quen, sự thật → hiện tại đơn; he/she/it → V-s/es.', points: ['I/You/We/They + V: I play.', 'He/She/It + V-s/es: She plays, he goes.', 'Phủ định: don\'t / doesn\'t + V nguyên mẫu.'] },
  practice: presentGen,
  teachBack: tb('Vì sao nói "She plays" mà không nói "She play"?', ['🦉 Cú', 'Vì chủ ngữ là ngôi thứ ba số ít (she), ở thì hiện tại đơn động từ phải thêm s.', 'Chính xác!'], [['🐻 Gấu', 'Vì "plays" nghe hay hơn.', 'Đó là quy tắc ngữ pháp.'], ['🐸 Ếch', 'Cả hai đều đúng.', 'Chỉ "She plays" là đúng.']]),
  remember: ['Thói quen, sự thật', 'He/She/It + s/es', "don't / doesn't + V"],
  games: ['bongbay'],
})

const enNgheNghiep = vocabLesson({
  id: 'en-nghe-nghiep',
  grade: 5,
  title: 'Nghề nghiệp (Jobs)',
  emoji: '👩‍⚕️',
  essence: 'teacher, doctor, nurse, farmer, driver, cook — What does he do? — He is a …',
  hook: 'Bố mẹ em làm nghề gì? Nói bằng tiếng Anh thế nào nhỉ?',
  prereqs: ['en-gia-dinh'],
  list: [
    ['teacher', 'giáo viên', '👩‍🏫'],
    ['doctor', 'bác sĩ', '👨‍⚕️'],
    ['farmer', 'nông dân', '👩‍🌾'],
    ['driver', 'tài xế', '🚕'],
    ['cook', 'đầu bếp', '👨‍🍳'],
    ['police officer', 'cảnh sát', '👮'],
  ],
  extra: sentence([
    { q: 'Hỏi nghề của bố bạn, em nói: …', a: 'What does your father do?', wrong: [['How old is your father?', 'Câu này hỏi tuổi.'], ['Where is your father?', 'Câu này hỏi ở đâu.']], ex: 'What does your father do? — Bố bạn làm nghề gì?' },
    { q: 'Mẹ em là bác sĩ. Em nói: …', a: 'She is a doctor.', wrong: [['She is a farmer.', 'farmer là nông dân.'], ['He is a doctor.', 'Mẹ là she, không phải he.']], ex: 'She is a doctor. — Mẹ là bác sĩ.' },
  ]),
})

const enHoatDong = vocabLesson({
  id: 'en-hoat-dong',
  grade: 5,
  title: 'Hoạt động hằng ngày (Daily activities)',
  emoji: '⏰',
  essence: 'get up, brush my teeth, have breakfast, go to school, do homework, go to bed — I … at 6 o\'clock.',
  hook: 'Một ngày của em bắt đầu thế nào? Kể bằng tiếng Anh nhé!',
  prereqs: ['en-hien-tai-don'],
  list: [
    ['get up', 'thức dậy', '⏰'],
    ['brush my teeth', 'đánh răng', '🪥'],
    ['have breakfast', 'ăn sáng', '🍳'],
    ['go to school', 'đi học', '🏫'],
    ['do homework', 'làm bài tập', '📝'],
    ['go to bed', 'đi ngủ', '🛏️'],
  ],
  extra: sentence([
    { q: 'Hỏi bạn thức dậy lúc mấy giờ, em nói: …', a: 'What time do you get up?', wrong: [['What do you do?', 'Câu này hỏi nghề nghiệp.'], ['Where do you live?', 'Câu này hỏi nơi ở.']], ex: 'What time do you get up? — Bạn thức dậy lúc mấy giờ?' },
    { q: 'Câu nào đúng?', a: 'He goes to bed at nine o\'clock.', wrong: [['He go to bed at nine o\'clock.', 'He → goes.'], ['He going to bed at nine o\'clock.', 'Thiếu động từ chia đúng.']], ex: 'He goes to bed at nine o\'clock.' },
  ]),
})

const enDiaDiem = vocabLesson({
  id: 'en-dia-diem',
  grade: 5,
  title: 'Nơi chốn trong thành phố (Places)',
  emoji: '🏙️',
  essence: 'school, hospital, park, supermarket, library, zoo — Where is the …? — It\'s next to …',
  hook: 'Đi chơi ở thành phố, muốn hỏi đường tới công viên, em nói thế nào?',
  prereqs: ['en-chao-hoi'],
  list: [
    ['hospital', 'bệnh viện', '🏥'],
    ['park', 'công viên', '🏞️'],
    ['supermarket', 'siêu thị', '🛒'],
    ['library', 'thư viện', '📚'],
    ['zoo', 'vườn thú', '🦓'],
    ['post office', 'bưu điện', '🏤'],
  ],
  extra: sentence([
    { q: 'Hỏi đường đến thư viện, em nói: …', a: 'Where is the library?', wrong: [['What is the library?', 'What hỏi cái gì, không hỏi vị trí.'], ['Who is the library?', 'Who hỏi người.']], ex: 'Where is the library? — Thư viện ở đâu?' },
    { q: 'Muốn mua đồ ăn, em đi đến: …', a: 'supermarket', wrong: [['hospital', 'Bệnh viện là nơi khám bệnh.'], ['library', 'Thư viện là nơi đọc sách.']], ex: 'Đi siêu thị — go to the supermarket.' },
  ]),
})

export const TIENG_ANH: Defined[] = [enChaoHoi, enSoDem, enGiaDinh, enDoDung, enConVat, enDoAn, enCoThe, enThoiTiet, enHienTaiDon, enNgheNghiep, enHoatDong, enDiaDiem]

// TIẾNG VIỆT LỚP 1 – LỚP 5 (Chương trình GDPT 2018).
import { cc, g } from '../core/standards'
import { pick, shuffle } from '../core/rng'
import { defineLesson, tb, type Defined } from './define'
import { cardsExplore, sortExplore, wordOrderExplore } from './kit'
import { applyTone, spell, syllableExplore, TONES, type Tone } from './vietKit'
import { bank, type BankItem, type Gen } from './questions'

const V = (grade: number) => ({ stage: 'tieuhoc' as const, grade, gradeLabel: `Lớp ${grade}`, subject: 'ngonngu' as const })

// ───────────────────────── LỚP 1 ─────────────────────────

const toneGen: Gen = (level, rng) => {
  const bases = [
    ['m', 'a'],
    ['b', 'a'],
    ['c', 'o'],
    ['l', 'e'],
    ['h', 'o'],
  ]
  const [o, r] = pick(rng, bases)
  const t = pick(rng, TONES.slice(level === 1 ? 0 : 1) as unknown as Tone[])
  const word = o + applyTone(r, t)
  if (level === 1) {
    const others = shuffle(rng, (TONES as unknown as Tone[]).filter((x) => x !== t)).slice(0, 2)
    return {
      level,
      prompt: `Cô đọc: "${word}". Tiếng này mang thanh gì?`,
      choices: shuffle(rng, [t, ...others]).map((x) => ({ label: `thanh ${x}`, correct: x === t, why: x === t ? undefined : `"${o + applyTone(r, x)}" mới là thanh ${x}.`, misconception: x === t ? undefined : 'ng:Nhầm thanh điệu' })),
      explain: `"${word}" mang thanh ${t}.`,
    }
  }
  const opts = shuffle(rng, [t, ...shuffle(rng, (TONES as unknown as Tone[]).filter((x) => x !== t && x !== 'ngang')).slice(0, 2)])
  return {
    level,
    prompt: `Thêm thanh ${t} vào tiếng "${o + r}" được tiếng nào?`,
    choices: opts.map((x) => ({ label: o + applyTone(r, x), correct: x === t, why: x === t ? undefined : `Đó là thanh ${x}.`, misconception: x === t ? undefined : 'ng:Nhầm dấu thanh' })),
    explain: `${spell(o, r, t)}`,
  }
}
const tv1Thanh = defineLesson({
  ...V(1),
  id: 'tv1-thanh',
  title: 'Sáu thanh điệu',
  emoji: '🎵',
  essenceLine: 'Cùng âm đầu và vần, đổi thanh là đổi nghĩa: ma, mà, má, mả, mã, mạ.',
  standards: [g('Tiếng Việt 1 · Đọc · Thanh điệu và dấu thanh')],
  prereqs: ['choi.chu-v-r'],
  hook: '"Ma", "mà", "má", "mả", "mã", "mạ" — chỉ khác một dấu nhỏ mà nghĩa khác hẳn nhau! Em có tin không?',
  hookVisual: 'ma mà má',
  explore: syllableExplore('Em chọn thanh rồi bấm Ghép và đánh vần để nghe cô đọc nhé!', ['m', 'b'], ['a'], ['ngang', 'huyền', 'sắc', 'hỏi', 'ngã', 'nặng'], { má: '👩 má', mạ: '🌱 mạ', bà: '👵 bà', bá: '', mã: '🐎 ngựa (mã)' }),
  essence: {
    bigIdea: 'Tiếng Việt có 6 thanh; đổi thanh là đổi nghĩa.',
    points: ['Thanh ngang: không dấu (ma).', 'Huyền ` (mà), sắc ´ (má), hỏi ? (mả), ngã ~ (mã), nặng . (mạ).', 'Dấu thanh đặt trên hoặc dưới âm chính của vần.'],
  },
  practice: toneGen,
  teachBack: tb('Vì sao không được quên dấu thanh khi viết?', ['🐰 Thỏ', 'Vì đổi thanh là đổi nghĩa: "má" là mẹ, "ma" lại là con ma!', 'Đúng rồi!'], [['🐻 Gấu', 'Vì dấu thanh trang trí cho đẹp.', 'Dấu thanh mang nghĩa, không chỉ để trang trí.'], ['🐸 Ếch', 'Quên dấu cũng không sao.', 'Quên dấu thì người đọc hiểu sai.']]),
  remember: ['6 thanh: ngang, huyền, sắc, hỏi, ngã, nặng', 'Đổi thanh → đổi nghĩa'],
  games: ['bongbay', 'chuotchui'],
})

const tv1GhepAm = defineLesson({
  ...V(1),
  id: 'tv1-ghep-am',
  title: 'Ghép âm thành tiếng',
  emoji: '🧩',
  essenceLine: 'Tiếng = âm đầu + vần + thanh; đánh vần được là đọc được.',
  standards: [g('Tiếng Việt 1 · Đọc · Âm, vần, tiếng')],
  prereqs: ['tv1-thanh'],
  hook: 'Cô có "bờ" và "a". Ghép lại được tiếng gì nhỉ? Thêm dấu huyền nữa thì sao?',
  hookVisual: 'b + a = ba',
  explore: syllableExplore('Em chọn âm đầu, vần và thanh rồi bấm Ghép và đánh vần nhé!', ['b', 'c', 'm', 'l', 'h', 'n'], ['a', 'o', 'ô', 'e', 'ê', 'i'], ['ngang', 'huyền', 'sắc', 'nặng'], { bà: '👵 bà', bé: '👶 bé', cá: '🐟 cá', cò: '🦢 cò', mẹ: '👩 mẹ', lá: '🍃 lá', hoa: '🌸', mè: '🌾 mè', cô: '👩‍🏫 cô', bò: '🐄 bò', hổ: '🐯' }),
  essence: { bigIdea: 'Âm đầu + vần + thanh = tiếng.', points: ['Đánh vần: bờ – a – ba – huyền – bà.', 'Âm "c" đứng trước a, o, ô, ơ, u, ư; âm "k" đứng trước e, ê, i.', 'Thay một phần là ra tiếng mới.'] },
  practice: bank([
    { lv: 1, q: 'Bờ – a – ba – huyền – … ?', a: 'bà', wrong: [['bá', 'Đó là thanh sắc.'], ['bạ', 'Đó là thanh nặng.']], ex: 'Bờ – a – ba – huyền – bà.' },
    { lv: 1, q: 'Cờ – a – ca – sắc – … ?', a: 'cá', wrong: [['cà', 'Đó là thanh huyền.'], ['cả', 'Đó là thanh hỏi.']], ex: 'Cờ – a – ca – sắc – cá.' },
    { lv: 1, q: 'Mờ – e – me – nặng – … ?', a: 'mẹ', wrong: [['mé', 'Đó là thanh sắc.'], ['mè', 'Đó là thanh huyền.']], ex: 'Mờ – e – me – nặng – mẹ.' },
    { lv: 2, q: 'Tiếng "lá" có âm đầu là gì?', a: 'l', wrong: [['a', 'a là vần.'], ['á', 'á là vần có dấu sắc.']], ex: 'lá = l + a + sắc.' },
    { lv: 2, q: 'Tiếng "cò" có vần là gì?', a: 'o', wrong: [['c', 'c là âm đầu.'], ['cò', 'Đó là cả tiếng.']], ex: 'cò = c + o + huyền.' },
    { lv: 2, q: 'Tiếng "bé" mang thanh gì?', a: 'thanh sắc', wrong: [['thanh huyền', 'Dấu huyền là bè.'], ['thanh nặng', 'Dấu nặng là bẹ.']], ex: 'bé có dấu sắc.' },
    { lv: 3, q: 'Đổi âm đầu của "cá" thành "l" được tiếng gì?', a: 'lá', wrong: [['cả', 'Âm đầu vẫn là c.'], ['là', 'Thanh phải giữ là sắc.']], ex: 'l + a + sắc = lá.' },
    { lv: 3, q: 'Tiếng nào có vần "ê"?', a: 'bế', wrong: [['bé', 'bé có vần e.'], ['bố', 'bố có vần ô.']], ex: 'bế = b + ê + sắc.' },
  ]),
  teachBack: tb('Em đánh vần tiếng "hổ" thế nào?', ['🐯 Hổ', 'Hờ – ô – hô – hỏi – hổ.', 'Chuẩn rồi!'], [['🐻 Gấu', 'Hờ – o – ho – hổ.', 'Vần là ô (có mũ), không phải o.'], ['🐸 Ếch', 'Hổ – hờ – ô.', 'Đánh vần theo thứ tự: âm đầu, vần, rồi thanh.']]),
  remember: ['Tiếng = âm đầu + vần + thanh', 'Đánh vần theo thứ tự', 'Thay một phần → tiếng mới'],
  games: ['bongbay', 'latthe'],
  pairs: [['🐟', 'cá'], ['🍃', 'lá'], ['👵', 'bà'], ['👩', 'mẹ'], ['🐄', 'bò'], ['🐯', 'hổ']],
})

const tv1Van = defineLesson({
  ...V(1),
  id: 'tv1-van',
  title: 'Vần có âm cuối: an, ang, anh, ong, inh, ach…',
  emoji: '🔤',
  essenceLine: 'Vần gồm âm chính và có thể có âm cuối; âm cuối làm tiếng đổi hẳn.',
  standards: [g('Tiếng Việt 1 · Đọc · Vần có âm cuối')],
  prereqs: ['tv1-ghep-am'],
  hook: '"Ban", "bang", "banh" — chỉ khác âm cuối mà thành ba tiếng khác nhau!',
  hookVisual: 'an · ang · anh',
  explore: syllableExplore('Em ghép âm đầu với các vần có âm cuối nhé!', ['b', 'c', 't', 'x', 'nh'], ['an', 'ang', 'anh', 'ong', 'inh', 'ach'], ['ngang', 'huyền', 'sắc'], { bàn: '🪑 bàn', cành: '🌿 cành', tranh: '🖼️', xanh: '💚', bánh: '🍰 bánh', cong: '〰️', bóng: '⚽ bóng', sách: '📖' }),
  essence: { bigIdea: 'Âm cuối n, ng, nh, ch… tạo thành vần mới.', points: ['an – ang – anh: n, ng, nh là ba âm cuối khác nhau.', 'Đọc kỹ âm cuối để không nhầm: bàn ≠ bàng.', 'Dấu thanh đặt trên âm chính (a, o, i…).'] },
  practice: bank([
    { lv: 1, q: 'Tiếng "bàn" có vần gì?', a: 'an', wrong: [['ang', 'bàng mới có vần ang.'], ['anh', 'bành mới có vần anh.']], ex: 'bàn = b + an + huyền.' },
    { lv: 1, q: 'Tiếng nào có vần "ong"?', a: 'bóng', wrong: [['bánh', 'bánh có vần anh.'], ['bàn', 'bàn có vần an.']], ex: 'bóng = b + ong + sắc.' },
    { lv: 2, q: 'Chọn tiếng đúng: quả … (bóng / bón)', a: 'bóng', wrong: [['bón', '"bón" là bón phân, không phải quả bóng.']], ex: 'Quả bóng: vần ong.' },
    { lv: 2, q: 'Chọn tiếng đúng: màu … lá (xanh / xan)', a: 'xanh', wrong: [['xan', 'Không có tiếng "xan" với nghĩa màu sắc.']], ex: 'Màu xanh: vần anh.' },
    { lv: 3, q: 'Tiếng nào có âm cuối "ch"?', a: 'sách', wrong: [['sáng', 'sáng có âm cuối ng.'], ['sán', 'sán có âm cuối n.']], ex: 'sách = s + ach + sắc.' },
  ]),
  teachBack: tb('Vì sao "bàn" và "bàng" khác nhau?', ['🦉 Cú', 'Vì âm cuối khác nhau: bàn có âm cuối n, bàng có âm cuối ng, nên là hai vần khác nhau.', 'Chính xác!'], [['🐻 Gấu', 'Vì khác dấu thanh.', 'Cả hai đều thanh huyền.'], ['🐸 Ếch', 'Hai tiếng giống nhau.', 'Nghe kỹ âm cuối nhé.']]),
  remember: ['Vần = âm chính (+ âm cuối)', 'n · ng · nh khác nhau', 'Dấu thanh trên âm chính'],
  games: ['bongbay', 'latthe'],
  pairs: [['🪑', 'bàn'], ['🍰', 'bánh'], ['⚽', 'bóng'], ['📖', 'sách'], ['💚', 'xanh'], ['🌿', 'cành']],
})

const tv1ChinhTa = defineLesson({
  ...V(1),
  id: 'tv1-chinh-ta',
  title: 'Chính tả: c/k, g/gh, ng/ngh',
  emoji: '✍️',
  essenceLine: 'Trước e, ê, i viết k, gh, ngh; trước các âm còn lại viết c, g, ng.',
  standards: [g('Tiếng Việt 1 · Viết · Quy tắc chính tả c/k, g/gh, ng/ngh')],
  prereqs: ['tv1-ghep-am'],
  hook: 'Cùng âm "cờ" mà lúc viết c, lúc viết k. Có bí quyết nào để nhớ không?',
  hookVisual: 'c ↔ k',
  explore: sortExplore(
    'Em xếp mỗi tiếng vào giỏ đúng nhé: âm đứng sau là e, ê, i hay âm khác?',
    [
      { name: 'k / gh / ngh (trước e, ê, i)', emoji: '🅺' },
      { name: 'c / g / ng (trước âm khác)', emoji: '🅲' },
    ],
    [
      { emoji: '✂️', name: 'cái kéo', bin: 0, why: 'Đúng! "kéo": sau k là e, nên viết k.' },
      { emoji: '🪑', name: 'cái ghế', bin: 0, why: 'Đúng! "ghế": sau gh là ê, nên viết gh.' },
      { emoji: '🤔', name: 'suy nghĩ', bin: 0, why: 'Đúng! "nghĩ": sau ngh là i, nên viết ngh.' },
      { emoji: '🐟', name: 'con cá', bin: 1, why: 'Đúng! "cá": sau c là a, nên viết c.' },
      { emoji: '🐔', name: 'con gà', bin: 1, why: 'Đúng! "gà": sau g là a, nên viết g.' },
      { emoji: '🐴', name: 'con ngựa', bin: 1, why: 'Đúng! "ngựa": sau ng là ư, nên viết ng.' },
    ],
    'Em giỏi lắm! Nhớ câu thần chú: e, ê, i thì dùng k, gh, ngh.',
  ),
  essence: { bigIdea: 'e, ê, i → k, gh, ngh.', points: ['k đứng trước e, ê, i: kẻ, kế, kí.', 'gh đứng trước e, ê, i: ghế, ghi.', 'ngh đứng trước e, ê, i: nghe, nghỉ.', 'Các âm còn lại: c, g, ng.'] },
  practice: bank([
    { lv: 1, q: 'Điền c hay k: …á vàng', a: 'cá', wrong: [['ká', 'Trước a viết c.']], ex: 'Trước a dùng c: cá.' },
    { lv: 1, q: 'Điền c hay k: thước …ẻ', a: 'kẻ', wrong: [['cẻ', 'Trước e viết k.']], ex: 'Trước e dùng k: kẻ.' },
    { lv: 2, q: 'Điền g hay gh: …ế gỗ', a: 'ghế', wrong: [['gế', 'Trước ê viết gh.']], ex: 'Trước ê dùng gh: ghế.' },
    { lv: 2, q: 'Điền g hay gh: …à trống', a: 'gà', wrong: [['ghà', 'Trước a viết g.']], ex: 'Trước a dùng g: gà.' },
    { lv: 2, q: 'Điền ng hay ngh: …e nhạc', a: 'nghe', wrong: [['nge', 'Trước e viết ngh.']], ex: 'Trước e dùng ngh: nghe.' },
    { lv: 3, q: 'Từ nào viết đúng chính tả?', a: 'nghỉ ngơi', wrong: [['ngỉ ngơi', 'Trước i phải viết ngh: nghỉ.'], ['nghỉ nghơi', 'Trước ơ viết ng: ngơi.']], ex: 'nghỉ (ngh + i), ngơi (ng + ơ).' },
    { lv: 3, q: 'Từ nào viết đúng chính tả?', a: 'con kiến', wrong: [['con ciến', 'Trước i viết k.'], ['kon kiến', 'Trước o viết c: con.']], ex: 'con (c + o), kiến (k + i).' },
  ]),
  teachBack: tb('Vì sao "ghế" viết gh mà "gà" viết g?', ['🐼 Gấu trúc', 'Vì sau âm đầu, "ghế" có ê nên dùng gh; "gà" có a nên dùng g.', 'Đúng quy tắc!'], [['🐻 Gấu', 'Vì ghế to hơn gà.', 'Không liên quan kích thước.'], ['🐸 Ếch', 'Viết gì cũng được.', 'Có quy tắc chính tả rõ ràng.']]),
  remember: ['e, ê, i → k, gh, ngh', 'Còn lại → c, g, ng'],
  games: ['bongbay', 'chuotchui'],
})

// ───────────────────────── LỚP 2 – 3 ─────────────────────────

const tv2TuLoai = defineLesson({
  ...V(2),
  id: 'tv2-tu-loai',
  title: 'Từ chỉ sự vật, hoạt động, đặc điểm',
  emoji: '🏷️',
  essenceLine: 'Sự vật trả lời "cái gì, con gì, ai"; hoạt động trả lời "làm gì"; đặc điểm trả lời "thế nào".',
  standards: [g('Tiếng Việt 2 · Luyện từ và câu · Từ chỉ sự vật, hoạt động, đặc điểm')],
  prereqs: ['tv1-van'],
  hook: '"Con mèo trắng chạy nhanh." Từ nào chỉ con vật, từ nào chỉ việc làm, từ nào chỉ màu sắc?',
  hookVisual: '🐈💨',
  explore: sortExplore(
    'Em xếp mỗi từ vào giỏ đúng nhé!',
    [
      { name: 'Sự vật', emoji: '📦' },
      { name: 'Hoạt động', emoji: '🏃' },
      { name: 'Đặc điểm', emoji: '🎨' },
    ],
    [
      { emoji: '🐈', name: 'con mèo', bin: 0, why: 'Đúng! "con mèo" trả lời câu hỏi con gì — từ chỉ sự vật.' },
      { emoji: '📚', name: 'quyển sách', bin: 0, why: 'Đúng! "quyển sách" là sự vật.' },
      { emoji: '🏃', name: 'chạy', bin: 1, why: 'Đúng! "chạy" trả lời câu hỏi làm gì — từ chỉ hoạt động.' },
      { emoji: '✍️', name: 'viết', bin: 1, why: 'Đúng! "viết" là hoạt động.' },
      { emoji: '🤍', name: 'trắng', bin: 2, why: 'Đúng! "trắng" trả lời câu hỏi thế nào — từ chỉ đặc điểm.' },
      { emoji: '⚡', name: 'nhanh', bin: 2, why: 'Đúng! "nhanh" là đặc điểm.' },
    ],
    'Em giỏi lắm! Hỏi "cái gì – làm gì – thế nào" là phân loại được ngay.',
  ),
  essence: { bigIdea: 'Đặt câu hỏi để phân loại từ.', points: ['Sự vật: ai? cái gì? con gì?', 'Hoạt động: làm gì?', 'Đặc điểm: thế nào? (màu, hình dáng, tính nết…)'] },
  practice: bank([
    { lv: 1, q: 'Từ nào chỉ sự vật?', a: 'cái bàn', wrong: [['nhảy', 'Nhảy là hoạt động.'], ['cao', 'Cao là đặc điểm.']], ex: '"cái bàn" trả lời cái gì.' },
    { lv: 1, q: 'Từ nào chỉ hoạt động?', a: 'đọc', wrong: [['bông hoa', 'Bông hoa là sự vật.'], ['đỏ', 'Đỏ là đặc điểm.']], ex: '"đọc" trả lời làm gì.' },
    { lv: 1, q: 'Từ nào chỉ đặc điểm?', a: 'thơm', wrong: [['ăn', 'Ăn là hoạt động.'], ['quả cam', 'Quả cam là sự vật.']], ex: '"thơm" trả lời thế nào.' },
    { lv: 2, q: 'Trong câu "Chú chim hót líu lo", từ chỉ hoạt động là?', a: 'hót', wrong: [['chú chim', 'Đó là sự vật.'], ['líu lo', 'Líu lo tả âm thanh (đặc điểm).']], ex: 'Chim làm gì? — hót.' },
    { lv: 2, q: 'Trong câu "Bầu trời xanh ngắt", từ chỉ đặc điểm là?', a: 'xanh ngắt', wrong: [['bầu trời', 'Đó là sự vật.']], ex: 'Bầu trời thế nào? — xanh ngắt.' },
    { lv: 3, q: 'Nhóm nào toàn từ chỉ hoạt động?', a: 'chạy, nhảy, hát', wrong: [['chạy, cao, hát', '"cao" là đặc điểm.'], ['bàn, nhảy, múa', '"bàn" là sự vật.']], ex: 'chạy, nhảy, hát đều trả lời "làm gì".' },
  ]),
  teachBack: tb('Làm sao biết "nhanh" là từ chỉ đặc điểm?', ['🦊 Cáo', 'Vì "nhanh" trả lời câu hỏi "thế nào": chạy thế nào? — nhanh.', 'Đúng rồi!'], [['🐻 Gấu', 'Vì "nhanh" là việc làm.', '"Nhanh" không phải việc làm; "chạy" mới là việc làm.'], ['🐸 Ếch', 'Vì "nhanh" là đồ vật.', 'Không phải đồ vật.']]),
  remember: ['Sự vật: ai, cái gì, con gì', 'Hoạt động: làm gì', 'Đặc điểm: thế nào'],
  games: ['bongbay', 'chuotchui'],
})

const tv2Cau = defineLesson({
  ...V(2),
  id: 'tv2-cau',
  title: 'Câu giới thiệu, câu nêu hoạt động, câu nêu đặc điểm',
  emoji: '💬',
  essenceLine: 'Câu thường có hai phần: Ai (cái gì) — là gì / làm gì / thế nào.',
  standards: [g('Tiếng Việt 2–3 · Luyện từ và câu · Câu giới thiệu, câu nêu hoạt động, câu nêu đặc điểm')],
  prereqs: ['tv2-tu-loai'],
  hook: 'Câu "Lan là học sinh lớp 2" và câu "Lan đang đọc sách" khác nhau ở chỗ nào?',
  hookVisual: '👧📖',
  explore: wordOrderExplore(
    'Em chạm các thẻ theo đúng thứ tự để tạo thành câu nhé!',
    [
      { words: ['Bố em', 'là', 'bác sĩ.'], say: 'Bố em là bác sĩ. Đây là câu giới thiệu: Ai là gì?' },
      { words: ['Mẹ em', 'đang nấu', 'cơm.'], say: 'Mẹ em đang nấu cơm. Đây là câu nêu hoạt động: Ai làm gì?' },
      { words: ['Bông hoa', 'rất', 'thơm.'], say: 'Bông hoa rất thơm. Đây là câu nêu đặc điểm: Cái gì thế nào?' },
    ],
    'Em giỏi lắm! Câu có hai phần: Ai — là gì, làm gì, hay thế nào.',
  ),
  essence: { bigIdea: 'Ai — là gì? / làm gì? / thế nào?', points: ['Câu giới thiệu: Ai là gì? (Bố em là bác sĩ.)', 'Câu nêu hoạt động: Ai làm gì? (Mẹ nấu cơm.)', 'Câu nêu đặc điểm: Ai/cái gì thế nào? (Hoa rất thơm.)'] },
  practice: bank([
    { lv: 1, q: '"Em là học sinh lớp Hai." là kiểu câu gì?', a: 'câu giới thiệu', wrong: [['câu nêu hoạt động', 'Không có việc làm nào.'], ['câu nêu đặc điểm', 'Không tả tính chất.']], ex: 'Ai là gì? → câu giới thiệu.' },
    { lv: 1, q: '"Chú mèo đang bắt chuột." là kiểu câu gì?', a: 'câu nêu hoạt động', wrong: [['câu giới thiệu', 'Không có "là gì".'], ['câu nêu đặc điểm', '"bắt chuột" là việc làm.']], ex: 'Ai làm gì? → câu nêu hoạt động.' },
    { lv: 2, q: '"Dòng sông quê em rất hiền hòa." là kiểu câu gì?', a: 'câu nêu đặc điểm', wrong: [['câu nêu hoạt động', '"hiền hòa" là đặc điểm.'], ['câu giới thiệu', 'Không có "là gì".']], ex: 'Cái gì thế nào? → câu nêu đặc điểm.' },
    { lv: 2, q: 'Trong câu "Bạn Nam đá bóng", bộ phận trả lời câu hỏi "làm gì?" là?', a: 'đá bóng', wrong: [['Bạn Nam', 'Đó là bộ phận trả lời "Ai?".']], ex: 'Bạn Nam làm gì? — đá bóng.' },
    { lv: 3, q: 'Câu nào là câu nêu đặc điểm?', a: 'Mái tóc của bà bạc trắng.', wrong: [['Bà em đang kể chuyện.', 'Đó là câu nêu hoạt động.'], ['Bà em là giáo viên về hưu.', 'Đó là câu giới thiệu.']], ex: 'Mái tóc thế nào? — bạc trắng.' },
  ]),
  teachBack: tb('Làm sao biết câu "Hoa rất thơm" là câu nêu đặc điểm?', ['🦉 Cú', 'Vì phần sau trả lời câu hỏi "thế nào?": hoa thế nào? — rất thơm.', 'Chuẩn!'], [['🐻 Gấu', 'Vì có từ "hoa".', 'Phải xem phần sau trả lời câu hỏi gì.'], ['🐸 Ếch', 'Vì câu ngắn.', 'Độ dài không quyết định kiểu câu.']]),
  remember: ['Ai là gì? → giới thiệu', 'Ai làm gì? → hoạt động', 'Ai thế nào? → đặc điểm'],
  games: ['bongbay'],
})

const tv2DauCau = defineLesson({
  ...V(2),
  id: 'tv2-dau-cau',
  title: 'Dấu chấm, dấu phẩy, dấu chấm hỏi, dấu chấm than',
  emoji: '❓',
  essenceLine: 'Dấu câu cho biết câu kể, câu hỏi hay câu cảm; dấu phẩy ngăn các từ cùng loại.',
  standards: [g('Tiếng Việt 2–3 · Luyện từ và câu · Dấu câu')],
  prereqs: ['tv2-cau'],
  hook: '"Em đi học" và "Em đi học?" và "Em đi học!" — chỉ khác dấu cuối câu mà nghĩa khác nhau!',
  hookVisual: '. ? !',
  explore: { intro: '', Component: () => null, lines: [] },
  essence: { bigIdea: 'Dấu câu là "giọng điệu" của chữ viết.', points: ['Dấu chấm (.): kết thúc câu kể.', 'Dấu chấm hỏi (?): câu hỏi.', 'Dấu chấm than (!): câu cảm, câu khiến.', 'Dấu phẩy (,): ngăn các từ cùng loại: cam, quýt, bưởi.'] },
  practice: bank([
    { lv: 1, q: 'Câu "Bạn tên là gì…" cần dấu gì ở cuối?', a: '?', wrong: [['.', 'Đây là câu hỏi.'], ['!', 'Không phải câu cảm.']], ex: 'Câu hỏi dùng dấu chấm hỏi.' },
    { lv: 1, q: 'Câu "Hôm nay trời nắng…" cần dấu gì ở cuối?', a: '.', wrong: [['?', 'Không hỏi gì cả.'], ['!', 'Chỉ là kể lại.']], ex: 'Câu kể dùng dấu chấm.' },
    { lv: 2, q: 'Câu "Ôi, bông hoa đẹp quá…" cần dấu gì?', a: '!', wrong: [['.', 'Câu thể hiện cảm xúc mạnh.'], ['?', 'Không phải câu hỏi.']], ex: 'Câu cảm dùng dấu chấm than.' },
    { lv: 2, q: 'Câu nào dùng dấu phẩy đúng?', a: 'Vườn nhà em có cam, quýt, bưởi.', wrong: [['Vườn, nhà em có cam quýt bưởi.', 'Dấu phẩy ngăn các loại quả, không đặt sau "Vườn".'], ['Vườn nhà em, có cam quýt, bưởi.', 'Phải ngăn đều giữa cam, quýt, bưởi.']], ex: 'Dấu phẩy ngăn các từ cùng loại.' },
  ]),
  teachBack: tb('Vì sao câu "Mấy giờ rồi" phải dùng dấu chấm hỏi?', ['🐼 Gấu trúc', 'Vì đó là câu hỏi, người nói muốn biết thông tin.', 'Đúng!'], [['🐻 Gấu', 'Vì câu ngắn.', 'Độ ngắn không liên quan.'], ['🐸 Ếch', 'Dùng dấu chấm cũng được.', 'Dấu chấm khiến người đọc không biết đó là câu hỏi.']]),
  remember: ['. kể', '? hỏi', '! cảm, khiến', ', ngăn các từ cùng loại'],
  games: ['bongbay', 'chuotchui'],
})
// Dấu câu: phần khám phá dùng thẻ chạm để nghe cô đọc với giọng điệu khác nhau.
tv2DauCau.lesson.explore = cardsExplore(
  'Em chạm vào từng câu để nghe cô đọc với giọng khác nhau nhé!',
  [
    { key: 'cham', name: 'Em đi học.', emoji: '.', say: 'Em đi học. — Giọng kể bình thường, hạ giọng ở cuối.' },
    { key: 'hoi', name: 'Em đi học?', emoji: '?', say: 'Em đi học? — Giọng hỏi, lên giọng ở cuối.' },
    { key: 'than', name: 'Em đi học!', emoji: '!', say: 'Em đi học! — Giọng vui mừng, nhấn mạnh.' },
    { key: 'phay', name: 'cam, quýt, bưởi', emoji: ',', say: 'Cam, quýt, bưởi. — Dấu phẩy là chỗ ngắt hơi ngắn giữa các từ.' },
  ],
  'Em giỏi lắm! Dấu câu giúp người đọc đọc đúng giọng.',
  { big: false },
)

const tv3SoSanh = defineLesson({
  ...V(3),
  id: 'tv3-so-sanh',
  title: 'Biện pháp so sánh',
  emoji: '🌙',
  essenceLine: 'So sánh đặt hai sự vật có nét giống nhau cạnh nhau để câu văn sinh động: "Trăng tròn như quả bóng".',
  standards: [g('Tiếng Việt 3 · Luyện từ và câu · Biện pháp so sánh')],
  prereqs: ['tv2-cau'],
  hook: '"Trăng tròn như quả bóng." Câu này hay hơn "Trăng tròn" ở chỗ nào?',
  hookVisual: '🌕⚽',
  explore: cardsExplore(
    'Em chạm từng câu để nghe cô chỉ ra hai sự vật được so sánh nhé!',
    [
      { key: '1', name: 'Trăng tròn như quả bóng', emoji: '🌕', say: 'Trăng tròn như quả bóng. Trăng được so sánh với quả bóng, vì cùng tròn. Từ so sánh là "như".' },
      { key: '2', name: 'Mắt bé sáng như sao', emoji: '✨', say: 'Mắt bé sáng như sao. Đôi mắt so sánh với ngôi sao, vì cùng sáng lấp lánh.' },
      { key: '3', name: 'Tóc bà trắng như cước', emoji: '👵', say: 'Tóc bà trắng như cước. Tóc so sánh với sợi cước trắng.' },
    ],
    'Em giỏi lắm! So sánh làm câu văn đẹp và dễ hình dung.',
    { big: false },
  ),
  essence: { bigIdea: 'Sự vật A + từ so sánh + sự vật B (có nét giống nhau).', points: ['Từ so sánh: như, là, tựa, giống như, như là…', 'Hai sự vật phải có điểm giống nhau.', 'So sánh giúp người đọc hình dung rõ.'] },
  practice: bank([
    { lv: 1, q: 'Trong câu "Mặt trời như quả cầu lửa", sự vật nào được so sánh với mặt trời?', a: 'quả cầu lửa', wrong: [['như', '"như" là từ so sánh.'], ['mặt trời', 'Đó là sự vật được đem ra so sánh.']], ex: 'Mặt trời được so sánh với quả cầu lửa.' },
    { lv: 1, q: 'Từ so sánh trong câu "Cánh diều như con chim" là?', a: 'như', wrong: [['cánh diều', 'Đó là sự vật.'], ['con chim', 'Đó là sự vật.']], ex: 'Từ so sánh là "như".' },
    { lv: 2, q: 'Câu nào có sử dụng so sánh?', a: 'Lá cờ đỏ như lửa.', wrong: [['Lá cờ màu đỏ.', 'Chỉ tả màu, không so sánh với sự vật khác.'], ['Lá cờ bay trên cột.', 'Không có so sánh.']], ex: '"đỏ như lửa" là so sánh.' },
    { lv: 3, q: 'Chọn từ hợp nhất: "Hạt sương long lanh như …"', a: 'những viên ngọc', wrong: [['cái bàn', 'Cái bàn không long lanh.'], ['đám mây đen', 'Mây đen không long lanh.']], ex: 'Hạt sương và viên ngọc đều long lanh.' },
  ]),
  teachBack: tb('Vì sao "Mắt bé sáng như sao" là câu so sánh hay?', ['🦉 Cú', 'Vì đôi mắt và ngôi sao có nét giống nhau là sáng lấp lánh, giúp người đọc hình dung rõ.', 'Rất hay!'], [['🐻 Gấu', 'Vì có chữ "sao".', 'Phải có hai sự vật giống nhau và từ so sánh.'], ['🐸 Ếch', 'Vì mắt bé ở trên trời.', 'Chỉ là so sánh, không phải thật.']]),
  remember: ['A như B', 'Phải có nét giống nhau', 'Giúp câu văn sinh động'],
  games: ['bongbay'],
})

const tv3NhanHoa = defineLesson({
  ...V(3),
  id: 'tv3-nhan-hoa',
  title: 'Biện pháp nhân hoá',
  emoji: '🌞',
  essenceLine: 'Nhân hoá gọi, tả sự vật bằng từ dùng cho người, làm sự vật trở nên gần gũi như con người.',
  standards: [g('Tiếng Việt 3 · Luyện từ và câu · Biện pháp nhân hoá')],
  prereqs: ['tv3-so-sanh'],
  hook: '"Ông mặt trời thức dậy." Mặt trời đâu có ngủ dậy như người nhỉ? Đó là phép nhân hoá!',
  hookVisual: '🌞😴',
  explore: cardsExplore(
    'Em chạm từng câu để nghe cô chỉ ra từ nhân hoá nhé!',
    [
      { key: '1', name: 'Ông mặt trời thức dậy', emoji: '🌞', say: 'Ông mặt trời thức dậy. Gọi mặt trời là "ông" và tả "thức dậy" như người.' },
      { key: '2', name: 'Chị gió hát ru', emoji: '🌬️', say: 'Chị gió hát ru. Gió được gọi là "chị" và biết "hát ru" như người.' },
      { key: '3', name: 'Cây bàng vẫy tay chào', emoji: '🌳', say: 'Cây bàng vẫy tay chào. Cành cây được tả như bàn tay người đang vẫy.' },
    ],
    'Em giỏi lắm! Nhân hoá làm cây cối, đồ vật biết nói, biết cười như người.',
    { big: false },
  ),
  essence: { bigIdea: 'Dùng từ của người cho vật.', points: ['Gọi vật bằng từ gọi người: ông, bà, chị, anh…', 'Tả vật bằng từ tả hoạt động, tính nết người: cười, hát, buồn…', 'Nói với vật như nói với người.'] },
  practice: bank([
    { lv: 1, q: 'Câu nào có nhân hoá?', a: 'Chú gà trống gọi mọi người dậy.', wrong: [['Con gà trống có mào đỏ.', 'Chỉ tả đặc điểm, không nhân hoá.'], ['Gà trống đứng trên rơm.', 'Không có từ của người.']], ex: '"Chú" và "gọi mọi người dậy" là từ dùng cho người.' },
    { lv: 2, q: 'Trong câu "Bác chổi tre chăm chỉ quét sân", từ ngữ nào là nhân hoá?', a: 'bác, chăm chỉ', wrong: [['chổi tre, sân', 'Đó là tên sự vật.'], ['quét', '"quét" là việc chổi vẫn làm.']], ex: 'Gọi chổi là "bác", tả "chăm chỉ" như người.' },
    { lv: 3, q: 'Nhân hoá có tác dụng gì?', a: 'làm sự vật gần gũi, sinh động như con người', wrong: [['làm câu văn dài hơn', 'Không phải mục đích.'], ['để so sánh hai sự vật', 'Đó là phép so sánh.']], ex: 'Nhân hoá làm sự vật sống động, gần gũi.' },
  ]),
  teachBack: tb('Phép nhân hoá khác phép so sánh thế nào?', ['🐬 Cá heo', 'So sánh đặt hai sự vật cạnh nhau bằng từ "như"; nhân hoá dùng từ của người để gọi, tả sự vật.', 'Xuất sắc!'], [['🐻 Gấu', 'Hai phép giống nhau.', 'Khác nhau: một phép có từ so sánh, một phép dùng từ của người.'], ['🐸 Ếch', 'Nhân hoá phải có chữ "như".', '"như" là dấu hiệu của so sánh.']]),
  remember: ['Gọi vật như người', 'Tả vật bằng từ tả người', 'Vật trở nên gần gũi'],
  games: ['bongbay'],
})

// ───────────────────────── LỚP 4 – 5 ─────────────────────────

const tv4TuLoai = defineLesson({
  ...V(4),
  id: 'tv4-tu-loai',
  title: 'Danh từ, động từ, tính từ',
  emoji: '🏷️',
  essenceLine: 'Danh từ gọi tên sự vật; động từ chỉ hoạt động, trạng thái; tính từ chỉ đặc điểm, tính chất.',
  standards: [g('Tiếng Việt 4 · Luyện từ và câu · Danh từ, động từ, tính từ')],
  prereqs: ['tv2-tu-loai'],
  hook: 'Lên lớp 4, "từ chỉ sự vật" có tên mới là danh từ. Còn hoạt động, đặc điểm thì sao?',
  hookVisual: '📚🏃🎨',
  explore: sortExplore(
    'Em xếp mỗi từ vào đúng loại nhé!',
    [
      { name: 'Danh từ', emoji: '📦' },
      { name: 'Động từ', emoji: '🏃' },
      { name: 'Tính từ', emoji: '🎨' },
    ],
    [
      { emoji: '🏫', name: 'trường học', bin: 0, why: 'Đúng! "trường học" là danh từ chỉ sự vật.' },
      { emoji: '🌧️', name: 'cơn mưa', bin: 0, why: 'Đúng! "cơn mưa" là danh từ chỉ hiện tượng.' },
      { emoji: '🏊', name: 'bơi', bin: 1, why: 'Đúng! "bơi" là động từ chỉ hoạt động.' },
      { emoji: '😴', name: 'ngủ', bin: 1, why: 'Đúng! "ngủ" là động từ chỉ trạng thái.' },
      { emoji: '😊', name: 'hiền lành', bin: 2, why: 'Đúng! "hiền lành" là tính từ chỉ tính nết.' },
      { emoji: '📏', name: 'cao lớn', bin: 2, why: 'Đúng! "cao lớn" là tính từ chỉ đặc điểm.' },
    ],
    'Em giỏi lắm! Danh từ, động từ, tính từ là ba loại từ quan trọng nhất.',
  ),
  essence: { bigIdea: 'Danh – động – tính: tên, việc, đặc điểm.', points: ['Danh từ: người, vật, hiện tượng, khái niệm (bàn, mưa, tình bạn).', 'Động từ: hoạt động, trạng thái (chạy, ngủ) — kiểm tra bằng "đang/đã".', 'Tính từ: đặc điểm, tính chất — kiểm tra bằng "rất".'] },
  practice: bank([
    { lv: 1, q: 'Từ nào là danh từ?', a: 'tình bạn', wrong: [['chơi', 'Chơi là động từ.'], ['thân thiết', 'Thân thiết là tính từ.']], ex: '"tình bạn" là danh từ chỉ khái niệm.' },
    { lv: 1, q: 'Từ nào là động từ?', a: 'suy nghĩ', wrong: [['chín chắn', 'Chín chắn là tính từ.'], ['bài toán', 'Bài toán là danh từ.']], ex: 'Có thể nói "đang suy nghĩ" → động từ.' },
    { lv: 2, q: 'Từ nào là tính từ?', a: 'chăm chỉ', wrong: [['học bài', 'Học bài là động từ + danh từ.'], ['quyển vở', 'Quyển vở là danh từ.']], ex: 'Có thể nói "rất chăm chỉ" → tính từ.' },
    { lv: 2, q: 'Trong câu "Đàn cò trắng bay lả bay la", tính từ là?', a: 'trắng', wrong: [['đàn cò', 'Đó là danh từ.'], ['bay', 'Đó là động từ.']], ex: '"trắng" chỉ màu sắc → tính từ.' },
    { lv: 3, q: 'Mẹo nào giúp nhận ra tính từ?', a: 'thêm được "rất" vào trước từ', wrong: [['thêm được "cái" vào trước từ', 'Đó thường là mẹo nhận ra danh từ.'], ['từ có hai tiếng', 'Số tiếng không quyết định loại từ.']], ex: 'Rất đẹp, rất cao, rất hiền → tính từ.' },
  ]),
  teachBack: tb('Làm sao biết "chạy" là động từ?', ['🦊 Cáo', 'Vì có thể nói "đang chạy", "đã chạy" — nó chỉ hoạt động.', 'Đúng mẹo!'], [['🐻 Gấu', 'Vì "chạy" có chữ "y".', 'Chữ cái không quyết định từ loại.'], ['🐸 Ếch', 'Vì nói được "rất chạy".', '"Rất chạy" không tự nhiên — đó là mẹo cho tính từ.']]),
  remember: ['Danh từ: tên gọi', 'Động từ: đang/đã + từ', 'Tính từ: rất + từ'],
  games: ['bongbay', 'chuotchui'],
})

const tv4CVN = defineLesson({
  ...V(4),
  id: 'tv4-chu-vi-ngu',
  title: 'Chủ ngữ và vị ngữ',
  emoji: '🧱',
  essenceLine: 'Chủ ngữ nêu sự vật được nói đến (ai, cái gì); vị ngữ nói về chủ ngữ (làm gì, thế nào, là gì).',
  standards: [g('Tiếng Việt 4 · Luyện từ và câu · Chủ ngữ, vị ngữ')],
  prereqs: ['tv2-cau', 'tv4-tu-loai'],
  hook: 'Câu nào cũng có hai "trụ cột". Thiếu một trụ là câu sụp đổ. Đó là trụ gì?',
  hookVisual: '🏛️',
  explore: wordOrderExplore(
    'Em xếp chủ ngữ trước, vị ngữ sau để thành câu nhé!',
    [
      { words: ['Những bông hoa sen', 'nở rộ trên mặt hồ.'], say: 'Chủ ngữ: những bông hoa sen. Vị ngữ: nở rộ trên mặt hồ.' },
      { words: ['Cô giáo em', 'rất dịu dàng.'], say: 'Chủ ngữ: cô giáo em. Vị ngữ: rất dịu dàng.' },
    ],
    'Em giỏi lắm! Chủ ngữ là ai, cái gì; vị ngữ là làm gì, thế nào.',
  ),
  essence: { bigIdea: 'Câu = Chủ ngữ + Vị ngữ.', points: ['Chủ ngữ trả lời: Ai? Cái gì? Con gì?', 'Vị ngữ trả lời: Làm gì? Thế nào? Là gì?', 'Thiếu một trong hai là câu chưa trọn ý.'] },
  practice: bank([
    { lv: 1, q: 'Chủ ngữ của câu "Chú mèo mướp nằm sưởi nắng" là?', a: 'Chú mèo mướp', wrong: [['nằm sưởi nắng', 'Đó là vị ngữ.'], ['sưởi nắng', 'Đó là một phần vị ngữ.']], ex: 'Con gì nằm sưởi nắng? — Chú mèo mướp.' },
    { lv: 2, q: 'Vị ngữ của câu "Bầu trời mùa thu trong xanh" là?', a: 'trong xanh', wrong: [['Bầu trời', 'Đó là một phần chủ ngữ.'], ['mùa thu', 'Thuộc chủ ngữ "Bầu trời mùa thu".']], ex: 'Bầu trời mùa thu thế nào? — trong xanh.' },
    { lv: 2, q: 'Câu nào thiếu vị ngữ?', a: 'Những chú chim sẻ trên cành cây.', wrong: [['Chim sẻ hót líu lo.', 'Câu đủ: chim sẻ (CN) – hót líu lo (VN).'], ['Cành cây rung rinh.', 'Câu đủ chủ ngữ và vị ngữ.']], ex: 'Chưa nói chim sẻ làm gì / thế nào.' },
    { lv: 3, q: 'Câu nào thiếu chủ ngữ?', a: 'Đang chạy nhảy tung tăng ngoài sân.', wrong: [['Các bạn đang chơi ngoài sân.', 'Câu đủ chủ ngữ và vị ngữ.']], ex: 'Không biết AI đang chạy nhảy.' },
  ]),
  teachBack: tb('Làm sao tìm chủ ngữ của câu?', ['🦉 Cú', 'Đặt câu hỏi Ai? Cái gì? Con gì? trước phần vị ngữ; câu trả lời là chủ ngữ.', 'Đúng phương pháp!'], [['🐻 Gấu', 'Chủ ngữ luôn là từ đầu tiên.', 'Chủ ngữ có thể gồm nhiều từ.'], ['🐸 Ếch', 'Chủ ngữ là từ dài nhất.', 'Độ dài không quyết định.']]),
  remember: ['CN: Ai/Cái gì/Con gì', 'VN: làm gì/thế nào/là gì', 'Câu cần đủ CN và VN'],
  games: ['bongbay'],
})

const SYN: [string, string][] = [
  ['to lớn', 'khổng lồ'],
  ['chăm chỉ', 'siêng năng'],
  ['vui vẻ', 'phấn khởi'],
  ['xinh đẹp', 'xinh xắn'],
  ['nhanh', 'mau'],
]
const ANT: [string, string][] = [
  ['cao', 'thấp'],
  ['nóng', 'lạnh'],
  ['chăm chỉ', 'lười biếng'],
  ['vui', 'buồn'],
  ['nhanh', 'chậm'],
  ['to', 'nhỏ'],
]
const synAntGen: Gen = (level, rng) => {
  const ant = level >= 2 && rng() < 0.6
  const pool = ant ? ANT : SYN
  const [a, b] = pick(rng, pool)
  const others = shuffle(rng, (ant ? SYN : ANT).map((p) => p[1]).filter((x) => x !== b && x !== a)).slice(0, 2)
  return {
    level,
    prompt: ant ? `Từ trái nghĩa với "${a}" là?` : `Từ đồng nghĩa với "${a}" là?`,
    choices: shuffle(rng, [
      { label: b, correct: true },
      ...others.map((o) => ({ label: o, why: ant ? `"${o}" không có nghĩa ngược với "${a}".` : `"${o}" không cùng nghĩa với "${a}".`, misconception: ant ? 'ng:Nhầm từ đồng nghĩa với trái nghĩa' : 'ng:Chọn từ không cùng nghĩa' })),
    ]),
    explain: ant ? `"${a}" và "${b}" có nghĩa trái ngược nhau.` : `"${a}" và "${b}" có nghĩa giống nhau (gần giống nhau).`,
  }
}
const tv5DongTrai = defineLesson({
  ...V(5),
  id: 'tv5-dong-trai-nghia',
  title: 'Từ đồng nghĩa, từ trái nghĩa',
  emoji: '↔️',
  essenceLine: 'Đồng nghĩa: nghĩa giống nhau; trái nghĩa: nghĩa ngược nhau — dùng để nói đa dạng và làm nổi bật ý.',
  standards: [g('Tiếng Việt 5 · Luyện từ và câu · Từ đồng nghĩa, từ trái nghĩa')],
  prereqs: ['tv4-tu-loai'],
  hook: '"Chăm chỉ" và "siêng năng" là anh em ruột, còn "chăm chỉ" và "lười biếng" là hai đối thủ. Vì sao vậy?',
  hookVisual: '🤝 ⚔️',
  explore: cardsExplore(
    'Em chạm từng cặp từ để nghe cô giải thích nhé!',
    [
      { key: 'd1', name: 'chăm chỉ – siêng năng', emoji: '🤝', say: 'Chăm chỉ và siêng năng là từ đồng nghĩa: nghĩa giống nhau.' },
      { key: 'd2', name: 'to lớn – khổng lồ', emoji: '🤝', say: 'To lớn và khổng lồ đồng nghĩa, nhưng khổng lồ còn to hơn nữa.' },
      { key: 't1', name: 'cao – thấp', emoji: '⚔️', say: 'Cao và thấp là từ trái nghĩa: nghĩa ngược nhau.' },
      { key: 't2', name: 'đêm – ngày', emoji: '⚔️', say: 'Ngày và đêm trái nghĩa. Câu "Lá lành đùm lá rách" dùng lành và rách trái nghĩa để làm nổi bật ý.' },
    ],
    'Em giỏi lắm! Đồng nghĩa giúp nói đa dạng, trái nghĩa giúp làm nổi bật.',
    { big: false },
  ),
  essence: { bigIdea: 'Đồng nghĩa: giống; trái nghĩa: ngược.', points: ['Đồng nghĩa giúp tránh lặp từ.', 'Đồng nghĩa không hoàn toàn: chọn từ hợp sắc thái (khổng lồ mạnh hơn to lớn).', 'Trái nghĩa làm nổi bật sự tương phản: "Lá lành đùm lá rách".'] },
  practice: synAntGen,
  teachBack: tb('Vì sao "to lớn" và "khổng lồ" không luôn thay được cho nhau?', ['🐬 Cá heo', 'Vì chúng đồng nghĩa không hoàn toàn: "khổng lồ" diễn tả mức độ to hơn hẳn.', 'Tinh tế!'], [['🐻 Gấu', 'Vì chúng trái nghĩa.', 'Hai từ đồng nghĩa.'], ['🐸 Ếch', 'Thay lúc nào cũng được.', 'Phải hợp sắc thái câu văn.']]),
  remember: ['Đồng nghĩa: giống nghĩa', 'Trái nghĩa: ngược nghĩa', 'Chọn từ đúng sắc thái'],
  games: ['bongbay', 'latthe'],
  pairs: [...SYN.slice(0, 3), ...ANT.slice(0, 3)],
})

const PASSAGES: BankItem[] = [
  {
    lv: 1,
    q: 'Đọc đoạn văn: "Mùa xuân đến, cây cối đâm chồi nảy lộc. Chim chóc hót vang. Những bông hoa đua nhau khoe sắc." — Đoạn văn tả gì?',
    a: 'cảnh mùa xuân',
    wrong: [['một chú chim', 'Chim chỉ là một chi tiết.'], ['một bông hoa', 'Hoa chỉ là một chi tiết.']],
    ex: 'Mọi câu đều nói về cảnh vật khi mùa xuân đến.',
  },
  {
    lv: 2,
    q: 'Đọc: "Bà em đã già nhưng rất khỏe. Sáng nào bà cũng dậy sớm tập thể dục. Bà còn chăm sóc vườn rau xanh tốt." — Ý chính là gì?',
    a: 'Bà em già nhưng khỏe và chăm chỉ',
    wrong: [['Vườn rau nhà em xanh tốt', 'Chỉ là một chi tiết minh họa.'], ['Bà em dậy sớm', 'Chỉ là một chi tiết.']],
    ex: 'Câu mở đầu nêu ý chính, các câu sau minh họa.',
  },
  {
    lv: 2,
    q: 'Đọc: "Con đường làng em uốn quanh cánh đồng. Hai bên đường, hàng tre xanh rì rào. Buổi chiều, đàn trâu thong thả về làng." — Câu nào nêu ý chính?',
    a: 'Con đường làng em uốn quanh cánh đồng.',
    wrong: [['Buổi chiều, đàn trâu thong thả về làng.', 'Đây là chi tiết bổ sung.'], ['Hai bên đường, hàng tre xanh rì rào.', 'Đây là chi tiết tả cảnh hai bên.']],
    ex: 'Câu đầu nêu đối tượng chính: con đường làng.',
  },
  {
    lv: 3,
    q: 'Đọc: "Thỏ chế giễu Rùa chậm chạp. Hai bên thi chạy. Thỏ ngủ quên giữa đường, còn Rùa kiên trì bò về đích trước." — Câu chuyện khuyên em điều gì?',
    a: 'Kiên trì sẽ thành công, đừng chủ quan',
    wrong: [['Chạy nhanh là quan trọng nhất', 'Thỏ chạy nhanh nhưng vẫn thua.'], ['Nên ngủ nhiều', 'Ngủ quên làm Thỏ thua cuộc.']],
    ex: 'Rùa thắng nhờ kiên trì; Thỏ thua vì chủ quan.',
  },
  {
    lv: 3,
    q: 'Muốn tìm ý chính của một đoạn văn, em nên làm gì?',
    a: 'Tìm điều mà mọi câu trong đoạn cùng nói về',
    wrong: [['Chọn câu dài nhất', 'Câu dài chưa chắc là ý chính.'], ['Chọn câu cuối cùng', 'Ý chính có thể ở đầu, giữa hoặc cuối.']],
    ex: 'Ý chính là điều các câu khác cùng hướng tới.',
  },
]
const tvDocHieu = defineLesson({
  ...V(3),
  id: 'tv-doc-hieu',
  title: 'Đọc hiểu: tìm ý chính, bài học',
  emoji: '📖',
  essenceLine: 'Ý chính là điều mà mọi câu trong đoạn cùng nói về; bài học là điều câu chuyện muốn khuyên.',
  standards: [g('Tiếng Việt 3–5 · Đọc hiểu văn bản'), cc('RI.3.2'), cc('RL.3.2')],
  prereqs: ['tv2-cau'],
  hook: 'Đọc xong một đoạn văn, làm sao nói lại thật ngắn gọn nó nói về điều gì?',
  hookVisual: '📖🔍',
  explore: cardsExplore(
    'Em chạm vào từng bước đọc hiểu nhé!',
    [
      { key: '1', name: 'Đọc kỹ', emoji: '👀', say: 'Bước một: đọc kỹ cả đoạn, đọc chậm những chỗ khó.' },
      { key: '2', name: 'Hỏi "nói về ai, cái gì?"', emoji: '❓', say: 'Bước hai: tự hỏi đoạn văn nói về ai, về cái gì.' },
      { key: '3', name: 'Tìm điểm chung', emoji: '🧲', say: 'Bước ba: tìm điều mà mọi câu cùng nói đến. Đó là ý chính.' },
      { key: '4', name: 'Nói lại một câu', emoji: '🗣️', say: 'Bước bốn: nói lại ý chính bằng một câu ngắn của em.' },
    ],
    'Em giỏi lắm! Ý chính là điều mọi câu cùng hướng tới.',
    { big: false },
  ),
  essence: { bigIdea: 'Ý chính = điểm chung của mọi câu.', points: ['Chi tiết minh họa cho ý chính.', 'Ý chính thường ở câu đầu hoặc câu cuối, nhưng không phải luôn luôn.', 'Bài học: điều nhân vật làm đúng hay sai, và kết quả.'] },
  practice: bank(PASSAGES),
  teachBack: tb('Ý chính và chi tiết khác nhau thế nào?', ['🦉 Cú', 'Ý chính là điều cả đoạn nói về; chi tiết là các ý nhỏ để làm rõ ý chính.', 'Chính xác!'], [['🐻 Gấu', 'Ý chính là câu dài nhất.', 'Độ dài không quyết định.'], ['🐸 Ếch', 'Chi tiết quan trọng hơn ý chính.', 'Chi tiết phục vụ ý chính.']]),
  remember: ['Ý chính: điểm chung', 'Chi tiết: làm rõ ý chính', 'Nói lại bằng một câu'],
  games: ['bongbay'],
})

const tv4TrangNgu = defineLesson({
  ...V(4),
  id: 'tv4-trang-ngu',
  title: 'Trạng ngữ: khi nào, ở đâu, vì sao, để làm gì',
  emoji: '⏰',
  essenceLine: 'Trạng ngữ là phần thêm vào câu để nói rõ thời gian, nơi chốn, nguyên nhân, mục đích của sự việc.',
  standards: [g('Tiếng Việt 4 · Luyện từ và câu · Trạng ngữ')],
  prereqs: ['tv4-chu-vi-ngu'],
  hook: '"Em đọc sách." và "Tối qua, ở thư viện, em đọc sách." — câu sau cho ta biết thêm những gì?',
  hookVisual: '⏰📍',
  explore: cardsExplore(
    'Em chạm từng thẻ để nghe trạng ngữ trả lời câu hỏi gì nhé!',
    [
      { key: 'tg', name: 'Sáng sớm, …', emoji: '⏰', say: 'Sáng sớm, đàn chim hót vang. Sáng sớm là trạng ngữ chỉ thời gian, trả lời câu hỏi: khi nào?' },
      { key: 'nc', name: 'Trên cành cây, …', emoji: '📍', say: 'Trên cành cây, chú sóc đang ăn hạt dẻ. Trên cành cây là trạng ngữ chỉ nơi chốn, trả lời: ở đâu?' },
      { key: 'ng', name: 'Vì trời mưa, …', emoji: '🌧️', say: 'Vì trời mưa, buổi cắm trại bị hoãn. Vì trời mưa là trạng ngữ chỉ nguyên nhân, trả lời: vì sao?' },
      { key: 'md', name: 'Để học giỏi, …', emoji: '🎯', say: 'Để học giỏi, em chăm chỉ ôn bài. Để học giỏi là trạng ngữ chỉ mục đích, trả lời: để làm gì?' },
    ],
    'Em giỏi lắm! Trạng ngữ thường đứng đầu câu và ngăn cách bằng dấu phẩy.',
    { big: false },
  ),
  essence: {
    bigIdea: 'Trạng ngữ + dấu phẩy + chủ ngữ + vị ngữ.',
    points: ['Thời gian: khi nào? (Sáng nay, Mùa hè…)', 'Nơi chốn: ở đâu? (Trong vườn, Ở trường…)', 'Nguyên nhân: vì sao? (Vì…, Nhờ…, Tại…)', 'Mục đích: để làm gì? (Để…, Nhằm…)'],
    analogy: 'Chủ ngữ và vị ngữ là ngôi nhà, còn trạng ngữ là tấm biển chỉ đường cho biết ngôi nhà ở đâu, xây khi nào.',
  },
  practice: bank([
    { lv: 1, q: 'Trạng ngữ trong câu "Sáng nay, lớp em đi tham quan" là?', a: 'Sáng nay', wrong: [['lớp em', 'Đó là chủ ngữ.'], ['đi tham quan', 'Đó là vị ngữ.']], ex: '"Sáng nay" cho biết khi nào → trạng ngữ chỉ thời gian.' },
    { lv: 1, q: 'Trạng ngữ "Ngoài sân" chỉ điều gì?', a: 'nơi chốn', wrong: [['thời gian', 'Thời gian trả lời: khi nào?'], ['mục đích', 'Mục đích trả lời: để làm gì?']], ex: '"Ngoài sân" trả lời câu hỏi ở đâu → nơi chốn.' },
    { lv: 2, q: 'Câu "Nhờ chăm chỉ, Lan đã tiến bộ" có trạng ngữ chỉ gì?', a: 'nguyên nhân', wrong: [['mục đích', '"Nhờ chăm chỉ" nói lí do, không phải mục đích.'], ['nơi chốn', 'Không chỉ địa điểm.']], ex: 'Vì sao Lan tiến bộ? — Nhờ chăm chỉ → nguyên nhân.' },
    { lv: 2, q: 'Chọn trạng ngữ chỉ mục đích:', a: 'Để có sức khỏe tốt', wrong: [['Vào mùa đông', 'Đó là thời gian.'], ['Vì trời lạnh', 'Đó là nguyên nhân.']], ex: '"Để…" trả lời: để làm gì? → mục đích.' },
    { lv: 3, q: 'Câu nào dùng dấu phẩy đúng sau trạng ngữ?', a: 'Trên bầu trời, những cánh diều bay lượn.', wrong: [['Trên bầu trời những cánh diều, bay lượn.', 'Dấu phẩy phải đặt ngay sau trạng ngữ.'], ['Trên, bầu trời những cánh diều bay lượn.', 'Dấu phẩy chen vào giữa trạng ngữ.']], ex: 'Trạng ngữ đứng đầu câu → dấu phẩy ngay sau trạng ngữ.' },
    { lv: 3, q: 'Thêm trạng ngữ chỉ thời gian cho câu "…, cây đào trước ngõ nở hoa":', a: 'Mỗi độ xuân về', wrong: [['Vì được chăm bón', 'Đó là nguyên nhân.'], ['Để đón Tết', 'Đó là mục đích.']], ex: '"Mỗi độ xuân về" trả lời: khi nào?' },
  ]),
  teachBack: tb('Làm sao biết một trạng ngữ chỉ gì?', ['🦉 Cú', 'Đặt câu hỏi: khi nào, ở đâu, vì sao, để làm gì — trạng ngữ trả lời câu hỏi nào thì chỉ điều đó.', 'Đúng phương pháp!'], [['🐻 Gấu', 'Trạng ngữ nào cũng chỉ thời gian.', 'Còn nơi chốn, nguyên nhân, mục đích nữa.'], ['🐸 Ếch', 'Trạng ngữ là chủ ngữ của câu.', 'Trạng ngữ là phần thêm, không phải chủ ngữ.']]),
  remember: ['Khi nào? Ở đâu? Vì sao? Để làm gì?', 'Thường đứng đầu câu', 'Dấu phẩy ngay sau trạng ngữ'],
  games: ['bongbay', 'chuotchui'],
})

const tv5DaiTu = defineLesson({
  ...V(5),
  id: 'tv5-dai-tu',
  title: 'Đại từ: dùng để thay thế, tránh lặp từ',
  emoji: '🔄',
  essenceLine: 'Đại từ dùng để xưng hô hoặc thay thế cho danh từ, động từ, tính từ — giúp câu văn không bị lặp.',
  standards: [g('Tiếng Việt 5 · Luyện từ và câu · Đại từ')],
  prereqs: ['tv4-tu-loai'],
  hook: '"Mèo con rất xinh. Mèo con có bộ lông trắng. Mèo con thích bắt chuột." — Nghe có bị lặp không? Sửa thế nào?',
  hookVisual: '🐱🔄',
  explore: cardsExplore(
    'Em chạm từng thẻ để nghe đại từ làm gì nhé!',
    [
      { key: 'xh', name: 'tôi, tớ, mình, chúng ta', emoji: '🙋', say: 'Tôi, tớ, mình, chúng ta là đại từ xưng hô: dùng để tự xưng khi nói chuyện.' },
      { key: 'nb', name: 'bạn, cậu, nó, họ', emoji: '👥', say: 'Bạn, cậu, nó, họ là đại từ chỉ người nghe hoặc người được nói tới.' },
      { key: 'tt', name: 'Mèo con … Nó …', emoji: '🐱', say: 'Mèo con rất xinh. Nó có bộ lông trắng. Chữ nó thay cho mèo con, câu văn không bị lặp.' },
      { key: 'vay', name: 'vậy, thế', emoji: '🪞', say: 'Lan học giỏi, em cũng vậy. Chữ vậy thay cho cả cụm học giỏi.' },
    ],
    'Em giỏi lắm! Đại từ giúp câu văn gọn mà vẫn rõ.',
    { big: false },
  ),
  essence: {
    bigIdea: 'Đại từ = từ "đóng thế" cho từ khác.',
    points: ['Đại từ xưng hô: tôi, tớ, chúng tôi, bạn, nó, họ…', 'Đại từ thay thế: vậy, thế, đó, này…', 'Dùng đại từ khi người đọc đã biết nó thay cho ai, cái gì.'],
    analogy: 'Như diễn viên đóng thế: xuất hiện thay người chính để bộ phim liền mạch.',
  },
  practice: bank([
    { lv: 1, q: 'Từ nào là đại từ xưng hô?', a: 'chúng tôi', wrong: [['học sinh', 'Đó là danh từ.'], ['vui vẻ', 'Đó là tính từ.']], ex: '"chúng tôi" dùng để tự xưng → đại từ.' },
    { lv: 1, q: 'Trong câu "Con mèo nhà em rất lười, nó chỉ thích ngủ", từ "nó" thay cho?', a: 'con mèo', wrong: [['nhà em', '"nó" không thay cho ngôi nhà.'], ['ngủ', '"ngủ" là động từ.']], ex: '"nó" thay cho "con mèo" để tránh lặp.' },
    { lv: 2, q: '"Hoa thích vẽ, em cũng thế." Từ "thế" thay cho?', a: 'thích vẽ', wrong: [['Hoa', '"thế" không thay cho người.'], ['em', '"em" là đại từ xưng hô.']], ex: '"thế" thay cho cụm "thích vẽ".' },
    { lv: 2, q: 'Câu nào dùng đại từ để tránh lặp từ?', a: 'Bố em là bác sĩ. Bố rất yêu nghề, ông chăm sóc bệnh nhân tận tình.', wrong: [['Bố em là bác sĩ. Bố em yêu nghề. Bố em chăm sóc bệnh nhân.', 'Lặp "Bố em" ba lần.'], ['Bác sĩ chăm sóc bệnh nhân.', 'Không có đại từ thay thế.']], ex: '"ông" thay cho "bố" → câu văn không lặp.' },
    { lv: 3, q: 'Khi viết thư cho bạn thân, em nên xưng hô thế nào?', a: 'tớ – cậu', wrong: [['tao – mày', 'Thiếu lịch sự.'], ['tôi – ngài', 'Quá trang trọng với bạn thân.']], ex: 'Chọn đại từ xưng hô hợp với quan hệ: bạn thân → tớ – cậu, mình – bạn.' },
  ]),
  teachBack: tb('Vì sao nên dùng đại từ "nó" thay vì lặp lại "con mèo" nhiều lần?', ['🐬 Cá heo', 'Vì đại từ thay cho danh từ đã nhắc, giúp câu văn gọn, không lặp mà người đọc vẫn hiểu.', 'Rất đúng!'], [['🐻 Gấu', 'Vì "nó" là từ đẹp hơn.', 'Không phải vì đẹp, mà để tránh lặp.'], ['🐸 Ếch', 'Vì chưa nhắc đến con mèo bao giờ.', 'Phải nhắc trước thì người đọc mới biết "nó" là ai.']]),
  remember: ['Đại từ thay cho từ khác', 'Xưng hô: tôi, bạn, nó, họ', 'Thay thế: vậy, thế'],
  games: ['bongbay'],
})

const tv5KetTu = defineLesson({
  ...V(5),
  id: 'tv5-ket-tu',
  title: 'Kết từ và câu ghép',
  emoji: '🔗',
  essenceLine: 'Kết từ (và, nhưng, vì… nên, nếu… thì) nối các từ, các vế câu và cho biết quan hệ giữa chúng.',
  standards: [g('Tiếng Việt 5 · Luyện từ và câu · Kết từ, câu ghép')],
  prereqs: ['tv4-chu-vi-ngu'],
  hook: '"Trời mưa. Em mang áo mưa." Thêm hai chữ "vì… nên" vào, câu sẽ nói thêm được điều gì?',
  hookVisual: '🔗🌧️',
  explore: cardsExplore(
    'Em chạm từng kết từ để nghe nó nối hai ý thế nào nhé!',
    [
      { key: 'va', name: 'và', emoji: '➕', say: 'Và: nối hai ý cùng loại. Em học bài và làm bài tập.' },
      { key: 'nhung', name: 'nhưng', emoji: '↔️', say: 'Nhưng: nối hai ý trái ngược. Nhà bạn ấy xa nhưng bạn ấy không bao giờ đi học muộn.' },
      { key: 'vinen', name: 'vì … nên …', emoji: '➡️', say: 'Vì, nên: nguyên nhân dẫn đến kết quả. Vì trời mưa nên đường trơn.' },
      { key: 'neuthi', name: 'nếu … thì …', emoji: '🤔', say: 'Nếu, thì: điều kiện và kết quả. Nếu em chăm chỉ thì em sẽ tiến bộ.' },
    ],
    'Em giỏi lắm! Mỗi kết từ cho biết một quan hệ khác nhau.',
    { big: false },
  ),
  essence: {
    bigIdea: 'Kết từ là sợi dây nối ý — chọn dây nào là chọn quan hệ nào.',
    points: ['Câu ghép có từ hai cụm chủ ngữ – vị ngữ trở lên.', 'và / rồi: bổ sung, nối tiếp.', 'nhưng / mà: tương phản.', 'vì… nên…: nguyên nhân – kết quả; nếu… thì…: điều kiện – kết quả.'],
  },
  practice: bank([
    { lv: 1, q: 'Điền kết từ: "Em thích vẽ … em gái em thích hát."', a: 'còn', wrong: [['vì', '"vì" chỉ nguyên nhân.'], ['nếu', '"nếu" chỉ điều kiện.']], ex: 'Hai ý so sánh với nhau → dùng "còn".' },
    { lv: 1, q: 'Điền kết từ: "Bạn Nam nhỏ người … rất khỏe."', a: 'nhưng', wrong: [['và', 'Hai ý trái ngược nhau, "và" không thể hiện được.'], ['nên', '"nhỏ người" không phải lí do để "rất khỏe".']], ex: 'Nhỏ người mà khỏe → tương phản → "nhưng".' },
    { lv: 2, q: '"Vì trời nắng gắt nên cây héo." Vế nào chỉ nguyên nhân?', a: 'trời nắng gắt', wrong: [['cây héo', 'Đó là kết quả.'], ['cả hai vế', 'Một vế là nguyên nhân, một vế là kết quả.']], ex: 'Sau "vì" là nguyên nhân, sau "nên" là kết quả.' },
    { lv: 2, q: 'Cặp kết từ nào chỉ điều kiện – kết quả?', a: 'nếu … thì …', wrong: [['vì … nên …', 'Đó là nguyên nhân – kết quả.'], ['tuy … nhưng …', 'Đó là tương phản.']], ex: 'Nếu (điều kiện) … thì (kết quả).' },
    { lv: 3, q: 'Câu nào là câu ghép?', a: 'Mặt trời lên, sương tan dần.', wrong: [['Mặt trời lên cao.', 'Chỉ có một cụm chủ ngữ – vị ngữ.'], ['Những giọt sương long lanh.', 'Chỉ có một cụm chủ ngữ – vị ngữ.']], ex: 'Hai cụm: Mặt trời / lên; sương / tan dần → câu ghép.' },
    { lv: 3, q: 'Câu nào dùng kết từ SAI?', a: 'Vì em ốm nên em vẫn đi học.', wrong: [['Tuy em ốm nhưng em vẫn đi học.', 'Câu này đúng: tương phản.'], ['Vì em ốm nên em nghỉ học.', 'Câu này đúng: nguyên nhân – kết quả.']], ex: 'Ốm mà vẫn đi học là tương phản → phải dùng "tuy… nhưng…".' },
  ]),
  teachBack: tb('Vì sao câu "Vì em ốm nên em vẫn đi học" nghe không đúng?', ['🦉 Cú', 'Vì "vì… nên…" chỉ nguyên nhân – kết quả, nhưng ốm không dẫn đến đi học; hai ý trái ngược nên phải dùng "tuy… nhưng…".', 'Tinh tế!'], [['🐻 Gấu', 'Vì câu quá dài.', 'Độ dài không phải lí do.'], ['🐸 Ếch', 'Câu đó đúng mà.', 'Kết từ không khớp với quan hệ giữa hai ý.']]),
  remember: ['và: bổ sung', 'nhưng: trái ngược', 'vì… nên…: nguyên nhân – kết quả', 'nếu… thì…: điều kiện – kết quả'],
  games: ['bongbay', 'cauca'],
})

const tv5NhieuNghia = defineLesson({
  ...V(5),
  id: 'tv5-tu-nhieu-nghia',
  title: 'Từ nhiều nghĩa',
  emoji: '🌳',
  essenceLine: 'Từ nhiều nghĩa có một nghĩa gốc và các nghĩa chuyển; các nghĩa luôn có điểm liên quan với nhau.',
  standards: [g('Tiếng Việt 5 · Luyện từ và câu · Từ nhiều nghĩa')],
  prereqs: ['tv5-dong-trai-nghia'],
  hook: 'Chân em, chân bàn, chân núi — vì sao cái bàn và quả núi cũng có "chân"?',
  hookVisual: '🦶🪑⛰️',
  explore: cardsExplore(
    'Em chạm từng thẻ để nghe nghĩa gốc và nghĩa chuyển nhé!',
    [
      { key: 'goc', name: 'chân người', emoji: '🦶', say: 'Chân người là nghĩa gốc: bộ phận dưới cùng của cơ thể, dùng để đứng và đi.' },
      { key: 'ban', name: 'chân bàn', emoji: '🪑', say: 'Chân bàn là nghĩa chuyển: bộ phận dưới cùng, đỡ cái bàn đứng vững. Giống chân người ở chỗ ở dưới cùng và để đỡ.' },
      { key: 'nui', name: 'chân núi', emoji: '⛰️', say: 'Chân núi là nghĩa chuyển: phần dưới cùng của quả núi.' },
      { key: 'mat', name: 'mắt – mắt na', emoji: '👁️', say: 'Mắt người dùng để nhìn là nghĩa gốc. Mắt quả na là nghĩa chuyển, vì trông tròn như con mắt.' },
    ],
    'Em giỏi lắm! Nghĩa chuyển luôn liên quan đến nghĩa gốc.',
    { big: false },
  ),
  essence: {
    bigIdea: 'Một từ – nghĩa gốc – nhiều nghĩa chuyển có liên quan.',
    points: ['Nghĩa gốc: nghĩa đầu tiên, thường chỉ bộ phận cơ thể, sự vật cụ thể.', 'Nghĩa chuyển: hình thành từ nghĩa gốc nhờ điểm giống (vị trí, hình dáng, chức năng).', 'Khác với từ đồng âm: đồng âm thì các nghĩa không liên quan (đường ăn – đường đi).'],
    analogy: 'Như cái cây: nghĩa gốc là thân cây, các nghĩa chuyển là cành mọc ra từ thân.',
  },
  practice: bank([
    { lv: 1, q: 'Từ "chân" nào mang nghĩa gốc?', a: 'Bé bị đau chân.', wrong: [['Chân bàn bị gãy.', 'Đó là nghĩa chuyển.'], ['Nhà em ở chân đồi.', 'Đó là nghĩa chuyển.']], ex: 'Chân của người là nghĩa gốc.' },
    { lv: 1, q: '"Mũi thuyền" dùng từ "mũi" theo nghĩa nào?', a: 'nghĩa chuyển', wrong: [['nghĩa gốc', 'Nghĩa gốc của mũi là bộ phận trên mặt người.']], ex: 'Mũi thuyền là phần nhọn ở phía trước, giống vị trí cái mũi.' },
    { lv: 2, q: 'Vì sao gọi là "lưỡi dao"?', a: 'Vì nó mỏng, dẹt như cái lưỡi', wrong: [['Vì con dao biết nói', 'Dao không biết nói.'], ['Vì hai từ không liên quan', 'Nghĩa chuyển luôn liên quan đến nghĩa gốc.']], ex: 'Nghĩa chuyển dựa trên điểm giống về hình dáng.' },
    { lv: 2, q: 'Câu nào dùng "ăn" theo nghĩa chuyển?', a: 'Tàu ăn hàng ở cảng.', wrong: [['Em ăn cơm.', 'Đó là nghĩa gốc.'], ['Bé ăn bánh.', 'Đó là nghĩa gốc.']], ex: '"Tàu ăn hàng" nghĩa là nhận hàng lên tàu → nghĩa chuyển.' },
    { lv: 3, q: 'Cặp nào là từ nhiều nghĩa (không phải từ đồng âm)?', a: 'đầu người – đầu sông', wrong: [['đường ăn – đường đi', 'Hai nghĩa không liên quan → đồng âm.'], ['con bò – bò ra', 'Hai nghĩa không liên quan → đồng âm.']], ex: 'Đầu sông là phần đầu tiên của dòng sông, liên quan đến nghĩa gốc "đầu".' },
  ]),
  teachBack: tb('Từ nhiều nghĩa khác từ đồng âm ở điểm nào?', ['🦊 Cáo', 'Các nghĩa của từ nhiều nghĩa liên quan với nhau; còn từ đồng âm chỉ giống âm, nghĩa không liên quan.', 'Chính xác!'], [['🐻 Gấu', 'Không khác gì cả.', 'Có khác: các nghĩa có liên quan hay không.'], ['🐸 Ếch', 'Từ đồng âm có nhiều nghĩa hơn.', 'Điểm khác là mối liên quan giữa các nghĩa.']]),
  remember: ['Nghĩa gốc → nghĩa chuyển', 'Các nghĩa có liên quan', 'Khác từ đồng âm'],
  games: ['bongbay'],
})

export const TIENG_VIET: Defined[] = [tv1Thanh, tv1GhepAm, tv1Van, tv1ChinhTa, tv2TuLoai, tv2Cau, tv2DauCau, tv3SoSanh, tv3NhanHoa, tvDocHieu, tv4TuLoai, tv4CVN, tv4TrangNgu, tv5DongTrai, tv5DaiTu, tv5KetTu, tv5NhieuNghia]

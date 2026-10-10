// TOÁN LỚP 1 – LỚP 2 (Chương trình GDPT 2018). Lời cô xưng "cô – em".
import { cc, g } from '../core/standards'
import { int } from '../core/rng'
import { choicesFrom, near } from '../lessons/helpers'
import { defineLesson, tb, type Defined } from './define'
import { cardsExplore, sortExplore, type Card } from './kit'
import { arrayExplore, clockExplore, columnExplore, compareExplore, moneyExplore, numberLineExplore, placeValueExplore, rulerExplore, shareExplore } from './mathKit'
import { clockGen, compareGen, moneyGen, placeGen } from './mathGens'
import { arith, bank, byLevel, countGen, mix } from './questions'

const L1 = { stage: 'tieuhoc' as const, grade: 1, gradeLabel: 'Lớp 1', subject: 'toan' as const }
const L2 = { stage: 'tieuhoc' as const, grade: 2, gradeLabel: 'Lớp 2', subject: 'toan' as const }

// ───────────────────────── LỚP 1 ─────────────────────────

const t1So10 = defineLesson({
  ...L1,
  id: 't1-so-10',
  title: 'Các số từ 0 đến 10',
  emoji: '🔟',
  essenceLine: 'Mỗi số chỉ một số lượng; số 0 nghĩa là không có gì.',
  standards: [g('Toán 1 · Số và phép tính · Các số từ 0 đến 10'), cc('K.CC.A.3')],
  prereqs: ['choi.so-1-10'],
  hook: 'Trong rổ không còn quả cam nào. Vậy có bao nhiêu quả cam? Có số nào để viết "không có gì" không nhỉ?',
  hookVisual: '🧺0️⃣',
  explore: cardsExplore(
    'Em chạm vào từng số để nghe cô đọc nhé!',
    Array.from({ length: 11 }, (_, i) => ({
      key: `n${i}`,
      name: `số ${i}`,
      emoji: String(i),
      sub: i === 0 ? '∅ không có gì' : '🍊'.repeat(i),
      say: i === 0 ? 'Số không: không có quả cam nào cả.' : `Số ${i}: có ${i} quả cam.`,
    })) as Card[],
    'Em giỏi lắm! Số không nghĩa là không có gì.',
    { big: false },
  ),
  essence: {
    bigIdea: 'Mỗi số chỉ một số lượng. Số 0 là "không có gì".',
    points: ['Đếm thêm 1 thì được số liền sau.', 'Bớt đi 1 thì được số liền trước.', 'Số 10 viết bằng hai chữ số: 1 và 0.'],
    analogy: 'Số giống bậc cầu thang: mỗi bậc cao hơn một.',
  },
  practice: byLevel({
    1: countGen([{ emoji: '🍊', name: 'quả cam' }, { emoji: '🐠', name: 'con cá' }, { emoji: '⭐', name: 'ngôi sao' }], 10),
    2: bank([
      { lv: 2, q: 'Số liền sau của 7 là số nào?', a: '8', wrong: [['6', 'Đó là số liền TRƯỚC của 7.'], ['9', 'Liền sau là thêm 1 thôi.']], ex: '7 thêm 1 là 8.' },
      { lv: 2, q: 'Số liền trước của 5 là số nào?', a: '4', wrong: [['6', 'Đó là số liền SAU của 5.'], ['3', 'Liền trước là bớt 1 thôi.']], ex: '5 bớt 1 là 4.' },
      { lv: 2, q: 'Rổ không còn quả nào. Viết số nào?', a: '0', wrong: [['1', 'Còn một quả thì mới viết 1.'], ['10', '10 là mười quả.']], ex: 'Không có gì thì viết số 0.' },
      { lv: 2, q: 'Số nào lớn nhất?', a: '10', wrong: [['9', '10 lớn hơn 9.'], ['1', '1 là số bé.']], ex: 'Trong các số từ 0 đến 10, số 10 lớn nhất.' },
      { lv: 3, q: 'Số nào ở giữa 6 và 8?', a: '7', wrong: [['5', '5 đứng trước 6.'], ['9', '9 đứng sau 8.']], ex: '6, 7, 8 — số 7 ở giữa.' },
      { lv: 3, q: 'Có 3 bạn nam và 2 bạn nữ. Có mấy bạn tất cả?', a: '5', wrong: [['1', 'Câu hỏi là có tất cả, phải gộp lại.'], ['6', 'Đếm lại nhé.']], ex: '3 và 2 gộp lại là 5.' },
    ]),
  }),
  teachBack: tb('Vì sao cần có số 0?', ['🐰 Thỏ', 'Vì khi không có gì thì vẫn cần một số để viết, đó là số 0.', 'Đúng rồi! Số 0 chỉ "không có gì".'], [['🐻 Gấu', 'Vì số 0 là số đẹp nhất.', 'Số nào cũng đẹp! Số 0 có ý nghĩa là không có gì.'], ['🐸 Ếch', 'Vì số 0 bằng số 1.', '0 và 1 khác nhau: 1 là có một cái.']]),
  remember: ['0 = không có gì', 'Liền sau = thêm 1', 'Liền trước = bớt 1'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [0, 1, 2, 3, 4, 5].map((n) => [String(n), n ? '🍊'.repeat(n) : '∅']),
})

const t1SoSanh = defineLesson({
  ...L1,
  id: 't1-so-sanh-10',
  title: 'So sánh số: lớn hơn, bé hơn, bằng',
  emoji: '🐊',
  essenceLine: 'Số nào nhiều hơn thì lớn hơn; dấu > < luôn há miệng về số lớn hơn.',
  standards: [g('Toán 1 · So sánh các số trong phạm vi 10'), cc('K.CC.C.7')],
  prereqs: ['t1-so-10'],
  hook: 'Bạn cá sấu tham ăn luôn há miệng về phía có nhiều thức ăn hơn. Dấu lớn hơn, bé hơn chính là cái miệng cá sấu đấy!',
  hookVisual: '🐊',
  explore: compareExplore('Em chọn dấu đúng cho cá sấu nhé!', [
    [7, 4],
    [3, 8],
    [5, 5],
  ]),
  essence: {
    bigIdea: 'Miệng dấu luôn mở về phía số lớn hơn.',
    points: ['7 > 4: đọc là bảy lớn hơn bốn.', '3 < 8: đọc là ba bé hơn tám.', '5 = 5: hai số bằng nhau.'],
    analogy: 'Cá sấu tham ăn há miệng về phía nhiều thức ăn.',
  },
  practice: compareGen({ 1: [0, 10], 2: [0, 10], 3: [0, 10] }),
  teachBack: tb('Vì sao viết 3 < 8 mà không viết 3 > 8?', ['🦊 Cáo', 'Vì 8 lớn hơn 3, miệng dấu phải mở về phía số 8.', 'Chính xác!'], [['🐼 Gấu trúc', 'Vì dấu < đẹp hơn.', 'Hai dấu khác nhau về ý nghĩa, không phải đẹp hay xấu.'], ['🐷 Heo', 'Vì số 3 đứng trước.', 'Số đứng trước không quyết định — phải xem số nào lớn hơn.']]),
  remember: ['> lớn hơn', '< bé hơn', '= bằng', 'Miệng mở về số lớn'],
  games: ['bongbay', 'chuotchui'],
})

const t1Cong10 = defineLesson({
  ...L1,
  id: 't1-cong-10',
  title: 'Phép cộng trong phạm vi 10',
  emoji: '➕',
  essenceLine: 'Cộng là gộp lại / thêm vào; trên tia số là nhảy về bên phải.',
  standards: [g('Toán 1 · Phép cộng trong phạm vi 10'), cc('K.OA.A.2')],
  prereqs: ['t1-so-10', 'choi.tach-gop'],
  hook: 'Ếch con đứng ở số 3, nhảy thêm 2 bước. Ếch đến số mấy?',
  hookVisual: '🐸➕',
  explore: numberLineExplore('Em bấm cho ếch nhảy từng bước nhé!', [
    [3, 2, '+'],
    [5, 4, '+'],
    [6, 3, '+'],
  ], 10),
  essence: {
    bigIdea: 'Cộng là thêm vào: đếm tiếp từ số lớn hơn.',
    points: ['3 + 2: bắt đầu ở 3, đếm thêm 2 bước: 4, 5.', 'Đổi chỗ hai số, kết quả không đổi: 3 + 2 = 2 + 3.', 'Cộng với 0 thì số đó giữ nguyên.'],
    analogy: 'Như có 3 viên bi, bạn cho thêm 2 viên.',
  },
  practice: arith({
    1: { op: '+', a: [0, 5], b: [0, 5], form: ['bare'] },
    2: { op: '+', a: [1, 9], b: [1, 9], form: ['bare', 'missing'], noCarry: false },
    3: { op: '+', a: [1, 6], b: [1, 4], form: ['word'] },
  }),
  teachBack: tb('Tính 2 + 6 nhanh thế nào?', ['🐰 Thỏ', 'Mình bắt đầu từ số lớn là 6 rồi đếm thêm 2: bảy, tám. Vậy bằng 8.', 'Thông minh! Đếm tiếp từ số lớn hơn sẽ nhanh hơn.'], [['🐻 Gấu', 'Mình đếm từ 1 đến 2 rồi đếm từ 1 đến 6.', 'Làm vậy lâu và dễ nhầm.'], ['🐸 Ếch', 'Mình lấy 6 trừ 2.', 'Thêm vào thì phải cộng, không trừ.']]),
  remember: ['Cộng = thêm vào', 'Đếm tiếp từ số lớn', 'a + b = b + a', 'a + 0 = a'],
  games: ['bongbay', 'cauca', 'chuotchui', 'latthe'],
  pairs: [['2 + 3', '5'], ['4 + 4', '8'], ['6 + 1', '7'], ['3 + 6', '9'], ['5 + 5', '10'], ['1 + 3', '4']],
})

const t1Tru10 = defineLesson({
  ...L1,
  id: 't1-tru-10',
  title: 'Phép trừ trong phạm vi 10',
  emoji: '➖',
  essenceLine: 'Trừ là bớt đi; trên tia số là nhảy về bên trái. Trừ ngược lại với cộng.',
  standards: [g('Toán 1 · Phép trừ trong phạm vi 10'), cc('K.OA.A.2')],
  prereqs: ['t1-cong-10'],
  hook: 'Có 7 con chim đậu trên cành, 3 con bay đi. Còn lại mấy con?',
  hookVisual: '🐦🐦🐦',
  explore: numberLineExplore('Em bấm cho ếch nhảy lùi từng bước nhé!', [
    [7, 3, '-'],
    [9, 4, '-'],
    [6, 6, '-'],
  ], 10),
  essence: {
    bigIdea: 'Trừ là bớt đi — nhảy lùi trên tia số.',
    points: ['7 − 3: từ 7 lùi 3 bước: 6, 5, 4.', 'Kiểm tra bằng phép cộng: 4 + 3 = 7.', 'Số nào trừ đi chính nó cũng bằng 0.'],
    analogy: 'Có 7 cái kẹo, ăn mất 3 cái, còn 4 cái.',
  },
  practice: arith({
    1: { op: '-', a: [2, 6], b: [0, 5], form: ['bare'] },
    2: { op: '-', a: [3, 10], b: [1, 9], form: ['bare', 'missing'] },
    3: { op: '-', a: [5, 10], b: [1, 5], form: ['word'] },
  }),
  teachBack: tb('Làm sao biết 9 − 4 = 5 là đúng?', ['🦉 Cú', 'Lấy kết quả cộng lại số trừ: 5 + 4 = 9, đúng bằng số ban đầu.', 'Tuyệt vời! Trừ và cộng là hai phép ngược nhau.'], [['🐻 Gấu', 'Vì cô nói thế.', 'Em tự kiểm tra được bằng phép cộng đấy!'], ['🐧 Cánh cụt', 'Lấy 9 cộng 4 bằng 13.', 'Phải cộng kết quả với số trừ cơ.']]),
  remember: ['Trừ = bớt đi', 'Nhảy lùi trên tia số', 'Thử lại bằng phép cộng', 'a − a = 0'],
  games: ['bongbay', 'cauca', 'chuotchui', 'latthe'],
  pairs: [['7 − 3', '4'], ['9 − 4', '5'], ['10 − 2', '8'], ['6 − 6', '0'], ['8 − 5', '3'], ['5 − 4', '1']],
})

const t1So100 = defineLesson({
  ...L1,
  id: 't1-so-100',
  title: 'Các số đến 100: chục và đơn vị',
  emoji: '💯',
  essenceLine: 'Mười đơn vị gộp thành một chục; vị trí của chữ số cho biết giá trị của nó.',
  standards: [g('Toán 1 · Các số đến 100'), cc('1.NBT.B.2')],
  prereqs: ['t1-so-10'],
  hook: 'Số 47 và số 74 có cùng hai chữ số 4 và 7. Sao lại khác nhau xa thế nhỉ?',
  hookVisual: '4️⃣7️⃣ vs 7️⃣4️⃣',
  explore: placeValueExplore('Em dùng que tính để tạo số nhé: bó một chục, que lẻ là đơn vị.', 99, 47),
  essence: {
    bigIdea: '10 đơn vị = 1 chục. Chữ số bên trái chỉ số chục.',
    points: ['47 = 4 chục và 7 đơn vị = 40 + 7.', '74 = 7 chục và 4 đơn vị — khác hẳn 47!', 'Đọc theo hàng: bốn mươi bảy, bảy mươi tư.'],
    analogy: 'Như bó đũa: 10 chiếc bó thành một bó, đếm bó cho nhanh.',
  },
  practice: mix(placeGen(99), compareGen({ 1: [10, 99], 2: [10, 99], 3: [10, 99] })),
  teachBack: tb('Vì sao 47 khác 74?', ['🐬 Cá heo', 'Vì trong 47, số 4 ở hàng chục nghĩa là 40; còn trong 74, số 7 ở hàng chục là 70.', 'Chính xác! Vị trí quyết định giá trị.'], [['🐻 Gấu', 'Vì 47 viết nghiêng hơn.', 'Không liên quan cách viết.'], ['🐸 Ếch', 'Hai số đó bằng nhau vì có cùng chữ số.', 'Cùng chữ số nhưng khác vị trí thì khác giá trị.']]),
  remember: ['10 đơn vị = 1 chục', 'Trái: chục · Phải: đơn vị', '47 = 40 + 7'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['4 chục 7 đơn vị', '47'], ['7 chục 4 đơn vị', '74'], ['5 chục', '50'], ['9 chục 9 đơn vị', '99'], ['1 chục 2 đơn vị', '12']],
})

const t1CongTru100 = defineLesson({
  ...L1,
  id: 't1-cong-tru-100',
  title: 'Cộng, trừ (không nhớ) trong phạm vi 100',
  emoji: '🧮',
  essenceLine: 'Đặt tính thẳng hàng: đơn vị với đơn vị, chục với chục.',
  standards: [g('Toán 1 · Phép cộng, phép trừ (không nhớ) trong phạm vi 100'), cc('1.NBT.C.4')],
  prereqs: ['t1-so-100', 't1-cong-10', 't1-tru-10'],
  hook: '32 + 25 có làm nhanh được không? Chỉ cần nhớ một quy tắc: cùng hàng thì thẳng cột!',
  hookVisual: '📏',
  explore: columnExplore('Em bấm để cô tính từng hàng nhé!', [
    { a: 32, b: 25, op: '+' },
    { a: 68, b: 43, op: '-' },
  ]),
  essence: {
    bigIdea: 'Cộng, trừ từng hàng: đơn vị với đơn vị, chục với chục.',
    points: ['Viết các chữ số cùng hàng thẳng cột.', 'Tính từ phải sang trái: hàng đơn vị trước.', '32 + 25: 2 + 5 = 7, 3 + 2 = 5 → 57.'],
    analogy: 'Như xếp que tính: que lẻ đếm với que lẻ, bó đếm với bó.',
  },
  practice: arith({
    1: { op: ['+', '-'], a: [10, 50], b: [1, 9], noCarry: true },
    2: { op: ['+', '-'], a: [20, 99], b: [10, 40], noCarry: true, form: ['bare', 'missing'] },
    3: { op: ['+', '-'], a: [20, 69], b: [10, 30], noCarry: true, form: ['word'] },
  }),
  teachBack: tb('Bạn tính 34 + 5 = 84. Sai ở đâu?', ['🦉 Cú', 'Bạn ấy cộng 5 vào hàng chục. Số 5 là 5 đơn vị nên phải cộng với 4 đơn vị: 34 + 5 = 39.', 'Chuẩn! Phải thẳng hàng đơn vị.'], [['🐻 Gấu', 'Bạn ấy đúng rồi.', 'Thử lại: 84 − 5 = 79, không phải 34.'], ['🐰 Thỏ', 'Bạn ấy quên nhớ.', 'Phép này không cần nhớ. Lỗi là đặt sai hàng.']]),
  remember: ['Thẳng hàng', 'Tính từ hàng đơn vị', 'Chục với chục, đơn vị với đơn vị'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['32 + 25', '57'], ['68 − 43', '25'], ['40 + 30', '70'], ['99 − 9', '90'], ['21 + 14', '35']],
})

const SHAPES1: Card[] = [
  { key: 'vuong', name: 'hình vuông', emoji: '🟥', say: 'Hình vuông: bốn cạnh bằng nhau, bốn góc vuông.' },
  { key: 'chunhat', name: 'hình chữ nhật', emoji: '▭', say: 'Hình chữ nhật: hai cạnh dài bằng nhau, hai cạnh ngắn bằng nhau, bốn góc vuông.' },
  { key: 'tamgiac', name: 'hình tam giác', emoji: '🔺', say: 'Hình tam giác: ba cạnh, ba góc.' },
  { key: 'tron', name: 'hình tròn', emoji: '⚪', say: 'Hình tròn: không có cạnh thẳng, không có góc.' },
  { key: 'lapphuong', name: 'khối lập phương', emoji: '🧊', say: 'Khối lập phương: như con xúc xắc, sáu mặt đều là hình vuông.' },
  { key: 'hop', name: 'khối hộp chữ nhật', emoji: '📦', say: 'Khối hộp chữ nhật: như cái hộp sữa, các mặt là hình chữ nhật.' },
]
const t1Hinh = defineLesson({
  ...L1,
  id: 't1-hinh',
  title: 'Hình phẳng và khối',
  emoji: '🧊',
  essenceLine: 'Hình phẳng nằm trên mặt giấy; khối có độ dày, cầm được trong tay.',
  standards: [g('Toán 1 · Hình học · Hình vuông, tròn, tam giác, chữ nhật; khối lập phương, khối hộp chữ nhật'), cc('K.G.A.3')],
  prereqs: ['choi.hinh-hoc'],
  hook: 'Con xúc xắc là hình vuông hay khối lập phương? Hai thứ này khác nhau ở chỗ nào?',
  hookVisual: '🎲',
  explore: cardsExplore('Em chạm vào từng hình, từng khối nhé!', SHAPES1, 'Em giỏi lắm! Hình phẳng nằm trên giấy, khối thì cầm được!', { big: false }),
  essence: {
    bigIdea: 'Phẳng hay khối: có độ dày hay không.',
    points: ['Hình vuông, tròn, tam giác, chữ nhật: phẳng như tờ giấy.', 'Khối lập phương: 6 mặt vuông, như xúc xắc.', 'Khối hộp chữ nhật: như hộp sữa, hộp bánh.'],
  },
  practice: byLevel({
    1: bank(SHAPES1.slice(0, 4).map((s) => ({ lv: 1 as const, q: `Đâu là ${s.name}?`, a: s.emoji, wrong: SHAPES1.slice(0, 4).filter((x) => x.key !== s.key).slice(0, 2).map((x) => [x.emoji, `Đó là ${x.name}.`] as [string, string]), ex: `${s.emoji} là ${s.name}.` }))),
    2: bank([
      { lv: 2, q: 'Con xúc xắc có dạng gì?', a: 'khối lập phương', wrong: [['hình vuông', 'Mỗi MẶT là hình vuông, cả con xúc xắc là khối lập phương.'], ['hình tròn', 'Xúc xắc có góc nhọn.']], ex: 'Xúc xắc là khối lập phương.' },
      { lv: 2, q: 'Hộp sữa có dạng gì?', a: 'khối hộp chữ nhật', wrong: [['hình chữ nhật', 'Mặt hộp là hình chữ nhật; cả hộp là khối.'], ['khối lập phương', 'Các mặt hộp sữa không đều là hình vuông.']], ex: 'Hộp sữa là khối hộp chữ nhật.' },
      { lv: 2, q: 'Hình nào có 3 góc?', a: 'hình tam giác', wrong: [['hình vuông', 'Hình vuông có 4 góc.'], ['hình tròn', 'Hình tròn không có góc.']], ex: 'Tam giác có 3 cạnh, 3 góc.' },
      { lv: 3, q: 'Khối lập phương có mấy mặt?', a: '6', wrong: [['4', 'Đếm cả mặt trên và mặt đáy nhé.'], ['8', '8 là số đỉnh.']], ex: 'Khối lập phương có 6 mặt.' },
    ]),
  }),
  teachBack: tb('Hình vuông khác khối lập phương thế nào?', ['🐼 Gấu trúc', 'Hình vuông phẳng trên giấy; khối lập phương có độ dày, có 6 mặt đều là hình vuông.', 'Rất đúng!'], [['🐸 Ếch', 'Hai cái là một.', 'Một cái phẳng, một cái là khối.'], ['🐯 Hổ', 'Khối lập phương có 4 mặt.', 'Đếm lại: 6 mặt.']]),
  remember: ['🟥 vuông · ▭ chữ nhật · 🔺 tam giác · ⚪ tròn', '🧊 lập phương: 6 mặt vuông', '📦 hộp chữ nhật'],
  games: ['bongbay', 'latthe'],
  pairs: SHAPES1.map((s) => [s.emoji, s.name]),
})

const t1DoDai = defineLesson({
  ...L1,
  id: 't1-do-dai',
  title: 'Đo độ dài: xăng-ti-mét',
  emoji: '📏',
  essenceLine: 'Đo là đếm xem có bao nhiêu đơn vị đo; phải đặt vật thẳng từ vạch 0.',
  standards: [g('Toán 1 · Đo lường · Đơn vị đo độ dài xăng-ti-mét'), cc('1.MD.A.2')],
  prereqs: ['t1-so-10'],
  hook: 'Bạn Nam đo cây bút được 8 cm, bạn Lan đo cùng cây bút được 9 cm. Ai đo sai nhỉ?',
  hookVisual: '✏️📏',
  explore: rulerExplore('Em thử đặt bút ở vạch 0 và vạch 1 xem khác nhau thế nào nhé!', [7, 5]),
  essence: {
    bigIdea: 'Luôn đặt một đầu vật ở vạch 0.',
    points: ['Đặt thước thẳng, sát cạnh vật.', 'Một đầu vật trùng vạch 0.', 'Đầu kia chỉ vạch nào thì vật dài bấy nhiêu xăng-ti-mét.'],
  },
  practice: bank([
    { lv: 1, q: 'Đầu bút ở vạch 0, đầu kia ở vạch 6. Bút dài bao nhiêu?', a: '6 cm', wrong: [['7 cm', 'Không đếm thêm vạch 0.'], ['5 cm', 'Đầu kia ở vạch 6 thì dài 6 cm.']], ex: 'Đặt từ vạch 0 đến vạch 6: dài 6 cm.' },
    { lv: 2, q: 'Đặt bút từ vạch 1 đến vạch 9. Bút dài bao nhiêu?', a: '8 cm', wrong: [['9 cm', 'Bắt đầu từ vạch 1, phải lấy 9 − 1.'], ['10 cm', 'Lấy 9 − 1 = 8.']], ex: 'Từ vạch 1 đến vạch 9: 9 − 1 = 8 cm.' },
    { lv: 2, q: 'Cái gì dài khoảng 15 cm?', a: 'cây bút chì', wrong: [['cái bàn học', 'Bàn học dài cả mét cơ.'], ['hạt gạo', 'Hạt gạo chỉ dài vài mi-li-mét.']], ex: 'Bút chì dài khoảng 15 cm.' },
    { lv: 3, q: 'Đoạn thẳng dài 5 cm và 3 cm. Nối lại dài bao nhiêu?', a: '8 cm', wrong: [['2 cm', 'Nối lại thì cộng, không trừ.'], ['53 cm', 'Phải cộng hai số đo: 5 + 3.']], ex: '5 cm + 3 cm = 8 cm.' },
  ]),
  teachBack: tb('Vì sao phải đặt đầu vật ở vạch 0?', ['🦊 Cáo', 'Vì vạch 0 là chỗ bắt đầu đếm. Đặt ở vạch 1 thì số đọc được sẽ thừa ra 1.', 'Đúng rồi!'], [['🐻 Gấu', 'Vì vạch 0 ở đầu thước cho đẹp.', 'Không phải vì đẹp — vì đó là điểm bắt đầu đo.'], ['🐷 Heo', 'Đặt ở đâu cũng được.', 'Đặt sai chỗ thì kết quả sai.']]),
  remember: ['Bắt đầu ở vạch 0', 'Thước thẳng, sát vật', 'Đọc vạch ở đầu kia'],
  games: ['bongbay'],
})

const t1XemGio = defineLesson({
  ...L1,
  id: 't1-xem-gio',
  title: 'Xem giờ đúng và các ngày trong tuần',
  emoji: '🕗',
  essenceLine: 'Kim ngắn chỉ giờ, kim dài chỉ số 12 là giờ đúng; một tuần có 7 ngày.',
  standards: [g('Toán 1 · Đo lường · Xem giờ đúng; các ngày trong tuần'), cc('1.MD.B.3')],
  prereqs: ['t1-so-10'],
  hook: 'Đồng hồ có hai kim, một kim ngắn, một kim dài. Kim nào cho biết giờ nhỉ?',
  hookVisual: '⏰',
  explore: clockExplore('Em bấm "+1 giờ" và nghe cô đọc giờ nhé!', 60),
  essence: {
    bigIdea: 'Kim ngắn chỉ giờ. Kim dài chỉ số 12 là đúng giờ.',
    points: ['7 giờ: kim ngắn chỉ số 7, kim dài chỉ số 12.', 'Một ngày kim ngắn đi hai vòng.', 'Một tuần: thứ Hai, Ba, Tư, Năm, Sáu, Bảy, Chủ nhật — 7 ngày.'],
  },
  practice: byLevel({
    1: clockGen(60),
    2: bank([
      { lv: 2, q: 'Hôm nay thứ Hai, ngày mai là thứ mấy?', a: 'thứ Ba', wrong: [['Chủ nhật', 'Chủ nhật là hôm qua.'], ['thứ Tư', 'Thứ Tư là ngày kia.']], ex: 'Sau thứ Hai là thứ Ba.' },
      { lv: 2, q: 'Một tuần có mấy ngày?', a: '7 ngày', wrong: [['5 ngày', '5 ngày là số ngày đi học thôi.'], ['10 ngày', 'Một tuần có 7 ngày.']], ex: 'Một tuần có 7 ngày.' },
      { lv: 2, q: 'Sau thứ Bảy là ngày nào?', a: 'Chủ nhật', wrong: [['thứ Tám', 'Không có thứ Tám, sau thứ Bảy là Chủ nhật.'], ['thứ Hai', 'Thứ Hai là sau Chủ nhật.']], ex: 'Thứ Bảy rồi đến Chủ nhật.' },
    ]),
    3: clockGen(60),
  }),
  teachBack: tb('Kim dài chỉ số 12, kim ngắn chỉ số 8. Mấy giờ?', ['🐰 Thỏ', '8 giờ, vì kim ngắn chỉ giờ là số 8, kim dài chỉ 12 là đúng giờ.', 'Chuẩn!'], [['🐻 Gấu', '12 giờ, vì kim dài chỉ 12.', 'Kim dài chỉ phút; kim ngắn mới chỉ giờ.'], ['🐸 Ếch', '8 giờ 12 phút.', 'Kim dài chỉ số 12 nghĩa là 0 phút — đúng giờ.']]),
  remember: ['Kim ngắn = giờ', 'Kim dài ở 12 = đúng giờ', 'Tuần có 7 ngày'],
  games: ['bongbay', 'chuotchui'],
})

// ───────────────────────── LỚP 2 ─────────────────────────

const t2CongCoNho = defineLesson({
  ...L2,
  id: 't2-cong-co-nho',
  title: 'Phép cộng có nhớ trong phạm vi 100',
  emoji: '➕',
  essenceLine: 'Hàng đơn vị đủ 10 thì đổi thành 1 chục, "nhớ 1" sang hàng chục.',
  standards: [g('Toán 2 · Phép cộng có nhớ trong phạm vi 100'), cc('2.NBT.B.5')],
  prereqs: ['th.cong-qua-10', 't1-cong-tru-100'],
  hook: '38 + 25: hàng đơn vị 8 + 5 = 13. Viết 13 vào đâu bây giờ? Bí mật nằm ở chữ "nhớ"!',
  hookVisual: '🧠➕',
  explore: columnExplore('Em bấm để cô tính từng hàng, để ý chữ "nhớ 1" nhé!', [
    { a: 38, b: 25, op: '+' },
    { a: 47, b: 36, op: '+' },
  ]),
  essence: {
    bigIdea: '"Nhớ 1" là mang 1 chục sang hàng chục.',
    points: ['8 + 5 = 13 đơn vị = 1 chục và 3 đơn vị.', 'Viết 3 ở hàng đơn vị, mang 1 chục sang hàng chục.', 'Hàng chục: 3 + 2 + 1 (nhớ) = 6 → kết quả 63.'],
    analogy: 'Đủ 10 que lẻ thì bó lại thành 1 bó, đặt sang chỗ các bó.',
  },
  practice: arith({
    1: { op: '+', a: [15, 59], b: [5, 9], carry: true },
    2: { op: '+', a: [15, 69], b: [12, 29], carry: true, form: ['bare', 'missing'] },
    3: { op: '+', a: [18, 59], b: [13, 39], carry: true, form: ['word'] },
  }),
  teachBack: tb('Bạn tính 38 + 25 = 53. Sai ở đâu?', ['🦉 Cú', 'Bạn quên nhớ 1. 8 + 5 = 13, viết 3 nhớ 1; hàng chục 3 + 2 + 1 = 6. Đúng là 63.', 'Chính xác!'], [['🐻 Gấu', 'Bạn đúng rồi.', 'Thử lại: 53 − 25 = 28, không phải 38.'], ['🐰 Thỏ', 'Phải viết cả 13 ở hàng đơn vị.', 'Mỗi hàng chỉ viết một chữ số, chục phải mang sang.']]),
  remember: ['Đủ 10 → nhớ 1', 'Viết đơn vị, mang chục sang', 'Hàng chục cộng thêm 1 nhớ'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['38 + 25', '63'], ['47 + 36', '83'], ['29 + 9', '38'], ['56 + 28', '84'], ['15 + 15', '30']],
})

const t2TruCoNho = defineLesson({
  ...L2,
  id: 't2-tru-co-nho',
  title: 'Phép trừ có nhớ trong phạm vi 100',
  emoji: '➖',
  essenceLine: 'Hàng đơn vị không đủ trừ thì đổi 1 chục thành 10 đơn vị ("mượn 1").',
  standards: [g('Toán 2 · Phép trừ có nhớ trong phạm vi 100'), cc('2.NBT.B.5')],
  prereqs: ['t2-cong-co-nho'],
  hook: '52 − 27: 2 trừ 7 không được! Có phải lấy 7 trừ 2 không? Cẩn thận, đây là bẫy!',
  hookVisual: '🤔➖',
  explore: columnExplore('Em bấm để xem cô "mượn 1 chục" thế nào nhé!', [
    { a: 52, b: 27, op: '-' },
    { a: 70, b: 34, op: '-' },
  ]),
  essence: {
    bigIdea: 'Không đủ trừ thì đổi 1 chục lấy 10 đơn vị.',
    points: ['52 − 27: 2 không trừ được 7 → mượn 1 chục: 12 − 7 = 5.', 'Hàng chục đã cho mượn 1 nên còn 4: 4 − 2 = 2 → 25.', 'Không được lấy 7 − 2 (trừ ngược)!'],
    analogy: 'Hết tiền lẻ thì đổi một tờ mười nghìn lấy mười tờ một nghìn.',
  },
  practice: arith({
    1: { op: '-', a: [21, 60], b: [3, 9], carry: true },
    2: { op: '-', a: [31, 90], b: [12, 29], carry: true, form: ['bare', 'missing'] },
    3: { op: '-', a: [40, 90], b: [15, 38], carry: true, form: ['word'] },
  }),
  teachBack: tb('Bạn tính 52 − 27 = 35. Bạn đã nhầm gì?', ['🐬 Cá heo', 'Bạn lấy 7 − 2 = 5 ở hàng đơn vị là sai. Phải mượn 1 chục: 12 − 7 = 5, hàng chục còn 4 − 2 = 2. Đúng là 25.', 'Xuất sắc!'], [['🐻 Gấu', 'Bạn chỉ sai ở hàng chục.', 'Lỗi bắt đầu ở hàng đơn vị: trừ ngược.'], ['🐸 Ếch', 'Phép này không trừ được.', 'Trừ được, chỉ cần mượn 1 chục.']]),
  remember: ['Không đủ trừ → mượn 1 chục', 'Hàng chục bớt 1', 'Không trừ ngược!', 'Thử lại bằng phép cộng'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['52 − 27', '25'], ['70 − 34', '36'], ['41 − 6', '35'], ['90 − 45', '45'], ['63 − 18', '45']],
})

const t2Nhan = defineLesson({
  ...L2,
  id: 't2-nhan',
  title: 'Phép nhân — bảng nhân 2, 5',
  emoji: '✖️',
  essenceLine: 'Nhân là cộng nhiều lần cùng một số: 5 × 3 = 5 + 5 + 5.',
  standards: [g('Toán 2 · Phép nhân; bảng nhân 2, bảng nhân 5'), cc('3.OA.A.1')],
  prereqs: ['t2-cong-co-nho'],
  hook: 'Mỗi bạn có 2 bàn tay. 5 bạn có bao nhiêu bàn tay? Cộng 2 năm lần thì lâu quá — có cách nhanh hơn không?',
  hookVisual: '🙌🙌🙌🙌🙌',
  explore: arrayExplore('Em kéo thanh trượt để tạo các nhóm chấm, rồi xoay mảng xem sao nhé!', 10),
  essence: {
    bigIdea: 'Nhân = cộng nhiều lần cùng một số.',
    points: ['2 × 5 = 2 + 2 + 2 + 2 + 2 = 10.', 'Xoay mảng: 2 × 5 = 5 × 2.', 'Bảng nhân 5: kết quả luôn tận cùng là 0 hoặc 5.'],
    analogy: 'Như đếm đôi đũa: đếm 2, 4, 6, 8… thay vì đếm từng chiếc.',
  },
  practice: mix(arith({ 1: { op: '×', a: [2, 2], b: [1, 10] }, 2: { op: '×', a: [2, 2], b: [1, 10], form: ['bare', 'missing'] }, 3: { op: '×', a: [2, 2], b: [2, 10], form: ['word'] } }), arith({ 1: { op: '×', a: [5, 5], b: [1, 10] }, 2: { op: '×', a: [5, 5], b: [1, 10], form: ['bare', 'missing'] }, 3: { op: '×', a: [5, 5], b: [2, 10], form: ['word'] } })),
  teachBack: tb('Vì sao 5 × 3 = 15?', ['🦊 Cáo', 'Vì 5 × 3 là 3 nhóm, mỗi nhóm 5: 5 + 5 + 5 = 15.', 'Đúng bản chất!'], [['🐻 Gấu', 'Vì 5 + 3 = 8 rồi cộng thêm 7.', 'Nhân không phải cộng hai số với nhau.'], ['🐷 Heo', 'Vì học thuộc bảng nhân.', 'Học thuộc tốt, nhưng cần hiểu: nhân là cộng lặp lại.']]),
  remember: ['Nhân = cộng lặp lại', 'a × b = b × a', 'Bảng 5: tận cùng 0 hoặc 5'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['2 × 3', '6'], ['5 × 4', '20'], ['2 × 7', '14'], ['5 × 9', '45'], ['2 × 10', '20'], ['5 × 6', '30']],
})

const t2Chia = defineLesson({
  ...L2,
  id: 't2-chia',
  title: 'Phép chia — bảng chia 2, 5',
  emoji: '➗',
  essenceLine: 'Chia là chia đều thành các phần bằng nhau; chia ngược lại với nhân.',
  standards: [g('Toán 2 · Phép chia; bảng chia 2, bảng chia 5'), cc('3.OA.A.2')],
  prereqs: ['t2-nhan'],
  hook: 'Có 10 cái kẹo chia đều cho 2 bạn. Làm sao chia cho công bằng?',
  hookVisual: '🍬➗',
  explore: shareExplore('Em bấm "Chia mỗi bạn 1 cái" cho đến khi hết kẹo nhé!', [
    [10, 2],
    [15, 5],
  ]),
  essence: {
    bigIdea: 'Chia đều: mỗi phần bằng nhau.',
    points: ['10 : 2 = 5 vì 5 × 2 = 10.', 'Muốn tìm kết quả phép chia, nhớ lại bảng nhân.', 'Chia cho 1 thì số đó giữ nguyên.'],
    analogy: 'Như chia bài: mỗi người một lá, lần lượt đến khi hết.',
  },
  practice: mix(arith({ 1: { op: ':', a: [1, 10], b: [2, 2] }, 2: { op: ':', a: [1, 10], b: [2, 2], form: ['bare', 'missing'] }, 3: { op: ':', a: [2, 10], b: [2, 2], form: ['word'] } }), arith({ 1: { op: ':', a: [1, 10], b: [5, 5] }, 2: { op: ':', a: [1, 10], b: [5, 5], form: ['bare', 'missing'] }, 3: { op: ':', a: [2, 10], b: [5, 5], form: ['word'] } })),
  teachBack: tb('Làm sao biết 20 : 5 = 4?', ['🐼 Gấu trúc', 'Vì 4 × 5 = 20. Chia là ngược lại của nhân.', 'Tuyệt!'], [['🐸 Ếch', 'Vì 20 − 5 = 15.', 'Đó là phép trừ, không phải chia.'], ['🐻 Gấu', 'Vì 5 − 1 = 4.', 'Không có lý do nào như vậy cả.']]),
  remember: ['Chia đều', 'Chia ngược với nhân', '10 : 2 = 5 vì 5 × 2 = 10'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['10 : 2', '5'], ['20 : 5', '4'], ['14 : 2', '7'], ['45 : 5', '9'], ['8 : 2', '4'], ['30 : 5', '6']],
})

const t2So1000 = defineLesson({
  ...L2,
  id: 't2-so-1000',
  title: 'Các số đến 1000',
  emoji: '🔢',
  essenceLine: '10 chục = 1 trăm; mỗi chữ số có giá trị theo hàng trăm, chục, đơn vị.',
  standards: [g('Toán 2 · Các số trong phạm vi 1000'), cc('2.NBT.A.1')],
  prereqs: ['t1-so-100'],
  hook: 'Một trăm là bao nhiêu chục nhỉ? Mình cùng xếp khối để tìm ra nhé!',
  hookVisual: '🟧🟦🟨',
  explore: placeValueExplore('Em tạo số bằng khối trăm, que chục và khối lẻ nhé!', 999, 235),
  essence: {
    bigIdea: '10 đơn vị = 1 chục; 10 chục = 1 trăm.',
    points: ['235 = 2 trăm + 3 chục + 5 đơn vị = 200 + 30 + 5.', 'Số 0 giữ chỗ: 205 khác 25.', 'Đọc 205: hai trăm linh năm.'],
  },
  practice: mix(placeGen(999), compareGen({ 1: [100, 999], 2: [100, 999], 3: [100, 999] })),
  teachBack: tb('Vì sao 205 phải có số 0 ở giữa?', ['🐬 Cá heo', 'Số 0 giữ chỗ hàng chục. Bỏ 0 đi thì 2 sẽ thành 2 chục, số chỉ còn 25.', 'Chính xác!'], [['🐻 Gấu', 'Số 0 để cho đẹp.', 'Số 0 có nhiệm vụ giữ chỗ.'], ['🐰 Thỏ', '205 và 25 bằng nhau.', '205 là hai trăm, còn 25 chưa tới ba mươi.']]),
  remember: ['10 chục = 1 trăm', '235 = 200 + 30 + 5', 'Số 0 giữ chỗ'],
  games: ['bongbay', 'latthe'],
  pairs: [['2 trăm 3 chục 5', '235'], ['1 trăm', '10 chục'], ['3 trăm 0 chục 7', '307'], ['9 trăm', '900'], ['4 trăm 5 chục', '450']],
})

const t2KgLit = defineLesson({
  ...L2,
  id: 't2-kg-lit',
  title: 'Ki-lô-gam và lít',
  emoji: '⚖️',
  essenceLine: 'Ki-lô-gam đo độ nặng, lít đo lượng chất lỏng; to hơn chưa chắc nặng hơn.',
  standards: [g('Toán 2 · Đo lường · Ki-lô-gam, lít')],
  prereqs: ['t1-do-dai'],
  hook: 'Túi bông to hay quả tạ nhỏ, cái nào nặng hơn? Trông thì to, nhưng chưa chắc đã nặng!',
  hookVisual: '🎈🏋️',
  explore: sortExplore(
    'Em xếp mỗi thứ vào cách đo đúng: đo bằng ki-lô-gam hay bằng lít nhé!',
    [
      { name: 'Ki-lô-gam (độ nặng)', emoji: '⚖️' },
      { name: 'Lít (chất lỏng)', emoji: '🥛' },
    ],
    [
      { emoji: '🍚', name: 'bao gạo', bin: 0, why: 'Đúng rồi! Gạo cân bằng ki-lô-gam.' },
      { emoji: '🍉', name: 'quả dưa hấu', bin: 0, why: 'Đúng rồi! Dưa hấu cân bằng ki-lô-gam.' },
      { emoji: '🐟', name: 'con cá', bin: 0, why: 'Đúng rồi! Mua cá thì cân ki-lô-gam.' },
      { emoji: '🥛', name: 'sữa', bin: 1, why: 'Đúng rồi! Sữa là chất lỏng, đo bằng lít.' },
      { emoji: '⛽', name: 'xăng', bin: 1, why: 'Đúng rồi! Xăng đo bằng lít.' },
      { emoji: '💧', name: 'nước', bin: 1, why: 'Đúng rồi! Nước đo bằng lít.' },
    ],
    'Em giỏi lắm! Cân thì dùng ki-lô-gam, rót chất lỏng thì dùng lít.',
  ),
  essence: {
    bigIdea: 'Đo đúng thứ, dùng đúng đơn vị.',
    points: ['Ki-lô-gam (kg) đo độ nặng: dùng cân.', 'Lít (l) đo chất lỏng: dùng ca, chai.', 'Vật to chưa chắc nặng: bông to mà nhẹ.'],
  },
  practice: bank([
    { lv: 1, q: 'Bao gạo được đo bằng đơn vị nào?', a: 'ki-lô-gam', wrong: [['lít', 'Lít dùng cho chất lỏng.'], ['xăng-ti-mét', 'Xăng-ti-mét đo độ dài.']], ex: 'Gạo cân bằng ki-lô-gam.' },
    { lv: 1, q: 'Chai nước mắm được đo bằng đơn vị nào?', a: 'lít', wrong: [['ki-lô-gam', 'Nước mắm là chất lỏng, đo bằng lít.'], ['mét', 'Mét đo độ dài.']], ex: 'Chất lỏng đo bằng lít.' },
    { lv: 2, q: 'Túi đường 2 kg và túi muối 1 kg. Cả hai nặng bao nhiêu?', a: '3 kg', wrong: [['1 kg', 'Hai túi phải cộng lại.'], ['21 kg', 'Cộng 2 + 1, không ghép chữ số.']], ex: '2 kg + 1 kg = 3 kg.' },
    { lv: 2, q: 'Can có 10 lít nước, rót ra 4 lít. Còn lại bao nhiêu?', a: '6 lít', wrong: [['14 lít', 'Rót ra là bớt đi, phải trừ.'], ['4 lít', '4 lít là phần đã rót.']], ex: '10 l − 4 l = 6 l.' },
    { lv: 3, q: 'Túi bông rất to và quả tạ nhỏ. Cái nào chắc chắn nặng hơn?', a: 'phải cân mới biết', wrong: [['túi bông vì to hơn', 'To hơn chưa chắc nặng hơn — bông rất nhẹ.'], ['bằng nhau', 'Không thể đoán bằng mắt.']], ex: 'Độ nặng phải đo bằng cân, không đoán theo kích thước.' },
  ]),
  teachBack: tb('Vì sao không đo sữa bằng ki-lô-gam ở cửa hàng?', ['🐼 Gấu trúc', 'Vì sữa là chất lỏng, rót vào chai đo bằng lít tiện và chính xác hơn.', 'Đúng rồi!'], [['🐻 Gấu', 'Vì sữa không có độ nặng.', 'Sữa vẫn có độ nặng, nhưng thường đo bằng lít.'], ['🐸 Ếch', 'Vì lít to hơn ki-lô-gam.', 'Hai đơn vị đo hai thứ khác nhau, không so to nhỏ.']]),
  remember: ['kg: độ nặng', 'l: chất lỏng', 'To chưa chắc nặng'],
  games: ['bongbay'],
})

const t2GioPhut = defineLesson({
  ...L2,
  id: 't2-gio-phut',
  title: 'Xem giờ: giờ và phút',
  emoji: '🕒',
  essenceLine: 'Kim dài đi một vòng là 60 phút = 1 giờ; mỗi số trên đồng hồ cách nhau 5 phút.',
  standards: [g('Toán 2 · Đo lường · Giờ, phút; xem đồng hồ'), cc('2.MD.C.7')],
  prereqs: ['t1-xem-gio', 't2-nhan'],
  hook: 'Kim dài chỉ số 3 là mấy phút? Là 3 phút hay 15 phút? Cùng khám phá bí mật nhé!',
  hookVisual: '🕒',
  explore: clockExplore('Em bấm "+15 phút" và quan sát kim dài nhé!', 15),
  essence: {
    bigIdea: 'Kim dài: mỗi số là 5 phút.',
    points: ['Kim dài chỉ số 3: 3 × 5 = 15 phút.', 'Chỉ số 6: 30 phút, còn gọi là rưỡi.', 'Kim dài đi hết một vòng: 60 phút = 1 giờ.'],
    analogy: 'Mỗi số trên mặt đồng hồ là một "trạm" 5 phút.',
  },
  practice: clockGen(15),
  teachBack: tb('Kim dài chỉ số 6, kim ngắn ở giữa số 8 và 9. Mấy giờ?', ['🦉 Cú', '8 giờ 30 phút, vì kim dài chỉ số 6 là 30 phút, kim ngắn chưa tới 9 nên vẫn là 8 giờ.', 'Hoàn hảo!'], [['🐻 Gấu', '9 giờ 6 phút.', 'Kim dài chỉ số 6 nghĩa là 30 phút; kim ngắn chưa đến 9.'], ['🐰 Thỏ', '6 giờ 8 phút.', 'Em đã đọc ngược hai kim.']]),
  remember: ['Mỗi số = 5 phút', '60 phút = 1 giờ', '30 phút = rưỡi'],
  games: ['bongbay', 'chuotchui'],
})

const t2Tien = defineLesson({
  ...L2,
  id: 't2-tien',
  title: 'Tiền Việt Nam',
  emoji: '💵',
  essenceLine: 'Mỗi tờ tiền có mệnh giá; cộng mệnh giá để trả, lấy tiền đưa trừ giá để tính tiền thừa.',
  standards: [g('Toán 2 · Đo lường · Tiền Việt Nam')],
  prereqs: ['t2-cong-co-nho'],
  hook: 'Em muốn mua quyển vở giá 8 000 đồng. Em có tờ 5 000, tờ 2 000 và tờ 1 000. Trả thế nào cho vừa đủ?',
  hookVisual: '💵📒',
  explore: moneyExplore('Em chạm vào tờ tiền để trả vừa đủ giá nhé!', [
    { name: 'cái bút chì', emoji: '✏️', price: 3000 },
    { name: 'quyển vở', emoji: '📒', price: 8000 },
    { name: 'hộp sữa', emoji: '🧃', price: 12000 },
  ], [1000, 2000, 5000, 10000]),
  essence: {
    bigIdea: 'Cộng mệnh giá để trả; trừ để tính tiền thừa.',
    points: ['5 000 + 2 000 + 1 000 = 8 000 đồng.', 'Đưa 10 000 mua đồ 8 000: được trả lại 2 000.', 'Nhiều tờ chưa chắc nhiều tiền — xem mệnh giá!'],
  },
  practice: moneyGen,
  teachBack: tb('Đưa tờ 10 000 đồng mua bút 7 000 đồng, được trả lại bao nhiêu? Vì sao?', ['🐬 Cá heo', '3 000 đồng, vì tiền đưa nhiều hơn giá 3 000: 10 000 − 7 000 = 3 000.', 'Chính xác!'], [['🐻 Gấu', '17 000 đồng, vì cộng lại.', 'Tiền thừa phải trừ, không cộng.'], ['🐷 Heo', '7 000 đồng.', 'Đó là giá cái bút.']]),
  remember: ['Cộng mệnh giá để trả', 'Tiền thừa = tiền đưa − giá', 'Xem mệnh giá, không đếm số tờ'],
  games: ['bongbay', 'chuotchui'],
})

const t2Hinh = defineLesson({
  ...L2,
  id: 't2-hinh',
  title: 'Đường thẳng, đường gấp khúc, hình tứ giác',
  emoji: '📐',
  essenceLine: 'Độ dài đường gấp khúc bằng tổng các đoạn; tứ giác có 4 cạnh, 4 đỉnh.',
  standards: [g('Toán 2 · Hình học · Đoạn thẳng, đường gấp khúc, hình tứ giác')],
  prereqs: ['t1-hinh', 't1-do-dai'],
  hook: 'Kiến đi từ A đến D theo đường gấp khúc qua B, C. Kiến đi bao xa?',
  hookVisual: '🐜〰️',
  explore: cardsExplore(
    'Em chạm để nghe cô giới thiệu từng loại đường và hình nhé!',
    [
      { key: 'thang', name: 'đường thẳng', emoji: '➖', say: 'Đường thẳng kéo dài mãi về hai phía, không cong, không gãy.' },
      { key: 'doan', name: 'đoạn thẳng', emoji: '📏', say: 'Đoạn thẳng có hai đầu mút, đo được độ dài.' },
      { key: 'gapkhuc', name: 'đường gấp khúc', emoji: '〰️', say: 'Đường gấp khúc gồm nhiều đoạn thẳng nối tiếp nhau. Độ dài bằng tổng các đoạn.' },
      { key: 'tugiac', name: 'hình tứ giác', emoji: '◇', say: 'Hình tứ giác có bốn cạnh và bốn đỉnh. Hình vuông, hình chữ nhật cũng là tứ giác.' },
    ],
    'Em giỏi lắm! Độ dài đường gấp khúc bằng tổng các đoạn thẳng.',
    { big: false },
  ),
  essence: { bigIdea: 'Đường gấp khúc: cộng độ dài các đoạn.', points: ['Đoạn thẳng có hai đầu mút.', 'Đường gấp khúc ABCD dài = AB + BC + CD.', 'Tứ giác: 4 cạnh, 4 đỉnh.'] },
  practice: (level, rng) => {
    if (level === 1)
      return bank([
        { lv: 1, q: 'Hình tứ giác có mấy cạnh?', a: '4', wrong: [['3', '3 cạnh là tam giác.'], ['5', 'Tứ là bốn.']], ex: 'Tứ giác có 4 cạnh.' },
        { lv: 1, q: 'Đoạn thẳng có mấy đầu mút?', a: '2', wrong: [['1', 'Đoạn thẳng có hai đầu.'], ['0', 'Đường thẳng mới không có đầu mút.']], ex: 'Đoạn thẳng có 2 đầu mút.' },
      ])(level, rng)
    const n = level === 2 ? 3 : 4
    const parts = Array.from({ length: n }, () => int(rng, 2, 9))
    const sum = parts.reduce((a, b) => a + b, 0)
    return {
      level,
      prompt: `Đường gấp khúc gồm ${n} đoạn dài ${parts.join(' cm, ')} cm. Độ dài đường gấp khúc là bao nhiêu?`,
      choices: choicesFrom(rng, `${sum} cm`, [
        { value: `${Math.max(...parts)} cm`, misconception: 'ng:Chỉ lấy đoạn dài nhất', why: 'Phải cộng tất cả các đoạn, không chỉ đoạn dài nhất.' },
        { value: `${parts[0] + parts[parts.length - 1]} cm`, misconception: 'ng:Chỉ cộng đoạn đầu và đoạn cuối', why: 'Đừng bỏ sót các đoạn ở giữa.' },
        { value: `${sum + 1} cm`, misconception: 'dem-lech' },
      ], { fill: (i) => `${near(sum, 1)(i)} cm` }),
      explain: `Độ dài = ${parts.join(' + ')} = ${sum} cm.`,
    }
  },
  teachBack: tb('Muốn tính độ dài đường gấp khúc em làm gì?', ['🦊 Cáo', 'Em cộng độ dài tất cả các đoạn thẳng của nó.', 'Đúng!'], [['🐻 Gấu', 'Em đo từ điểm đầu đến điểm cuối bằng một đường thẳng.', 'Đó là khoảng cách thẳng, ngắn hơn đường gấp khúc.'], ['🐸 Ếch', 'Em lấy đoạn dài nhất.', 'Phải cộng tất cả các đoạn.']]),
  remember: ['Đoạn thẳng: 2 đầu mút', 'Gấp khúc: cộng các đoạn', 'Tứ giác: 4 cạnh, 4 đỉnh'],
  games: ['bongbay'],
})

export const TOAN_12: Defined[] = [t1So10, t1SoSanh, t1Cong10, t1Tru10, t1So100, t1CongTru100, t1Hinh, t1DoDai, t1XemGio, t2CongCoNho, t2TruCoNho, t2Nhan, t2Chia, t2So1000, t2KgLit, t2GioPhut, t2Tien, t2Hinh]


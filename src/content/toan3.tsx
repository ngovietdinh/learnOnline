// TOÁN LỚP 3 (Chương trình GDPT 2018).
import { cc, g } from '../core/standards'
import { int, pick } from '../core/rng'
import { choicesFrom, near } from '../lessons/helpers'
import { defineLesson, tb, type Defined } from './define'
import { cardsExplore } from './kit'
import { areaExplore, arrayExplore, columnExplore, shareExplore } from './mathKit'
import { compareGen, placeGen } from './mathGens'
import { arith, bank, byLevel, mix, type Gen } from './questions'

const L3 = { stage: 'tieuhoc' as const, grade: 3, gradeLabel: 'Lớp 3', subject: 'toan' as const }

const t3BangNhan = defineLesson({
  ...L3,
  id: 't3-bang-nhan',
  title: 'Bảng nhân 3, 4, 6, 7, 8, 9',
  emoji: '✖️',
  essenceLine: 'Bảng nhân sau dựa trên bảng trước: 7 × 6 = 7 × 5 + 7.',
  standards: [g('Toán 3 · Bảng nhân 3, 4, 6, 7, 8, 9'), cc('3.OA.C.7')],
  prereqs: ['t2-nhan'],
  hook: 'Quên 7 × 6 bằng mấy? Đừng lo! Nếu nhớ 7 × 5 = 35 thì chỉ cần cộng thêm 7 nữa thôi.',
  hookVisual: '🧠✖️',
  explore: arrayExplore('Em tạo mảng chấm, thêm một hàng để thấy bảng nhân "lớn lên" nhé!', 10),
  essence: {
    bigIdea: 'Mỗi lần thêm một nhóm thì cộng thêm một lần số đó.',
    points: ['7 × 6 = 7 × 5 + 7 = 35 + 7 = 42.', 'Đổi chỗ: 6 × 7 = 7 × 6 — chỉ cần nhớ nửa bảng.', 'Bảng 9: 9 × n = 10 × n − n (9 × 7 = 70 − 7 = 63).'],
    analogy: 'Như leo cầu thang: biết bậc thứ 5 thì bước thêm một bậc là tới bậc 6.',
  },
  practice: arith({
    1: { op: '×', a: [3, 4], b: [1, 10] },
    2: { op: '×', a: [6, 9], b: [2, 10], form: ['bare', 'missing'] },
    3: { op: '×', a: [3, 9], b: [3, 9], form: ['word'] },
  }),
  teachBack: tb('Quên 8 × 7, em tìm lại thế nào?', ['🦉 Cú', 'Em nhớ 8 × 5 = 40, cộng thêm 2 lần 8 là 16, được 56.', 'Rất thông minh!'], [['🐻 Gấu', 'Em lấy 8 + 7 = 15.', 'Nhân không phải cộng hai số.'], ['🐸 Ếch', 'Em đoán đại một số gần 50.', 'Có cách chắc chắn: dựa vào phép nhân đã biết.']]),
  remember: ['Thêm 1 nhóm = cộng thêm số đó', 'a × b = b × a', '9 × n = 10 × n − n'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['7 × 6', '42'], ['8 × 7', '56'], ['9 × 6', '54'], ['6 × 8', '48'], ['4 × 9', '36'], ['3 × 7', '21']],
})

const t3BangChia = defineLesson({
  ...L3,
  id: 't3-bang-chia',
  title: 'Bảng chia 3, 4, 6, 7, 8, 9',
  emoji: '➗',
  essenceLine: 'Chia là phép ngược của nhân: 42 : 6 = 7 vì 7 × 6 = 42.',
  standards: [g('Toán 3 · Bảng chia 3, 4, 6, 7, 8, 9'), cc('3.OA.C.7')],
  prereqs: ['t3-bang-nhan', 't2-chia'],
  hook: 'Có 24 cái bánh xếp đều vào 4 hộp. Mỗi hộp mấy cái? Bảng nhân sẽ giúp em!',
  hookVisual: '🧁📦',
  explore: shareExplore('Em bấm chia đều kẹo cho các bạn nhé!', [
    [24, 4],
    [42, 6],
  ]),
  essence: {
    bigIdea: 'Muốn chia, nghĩ đến phép nhân ngược lại.',
    points: ['42 : 6 = ? → nghĩ: 6 nhân mấy bằng 42? → 7.', 'Chia cho 1 thì giữ nguyên; 0 chia cho số nào cũng bằng 0.', 'Không có phép chia cho 0.'],
  },
  practice: arith({
    1: { op: ':', a: [1, 10], b: [3, 4] },
    2: { op: ':', a: [2, 10], b: [6, 9], form: ['bare', 'missing'] },
    3: { op: ':', a: [2, 9], b: [3, 9], form: ['word'] },
  }),
  teachBack: tb('Vì sao 56 : 8 = 7?', ['🐬 Cá heo', 'Vì 7 × 8 = 56, mà chia là ngược của nhân.', 'Chính xác!'], [['🐻 Gấu', 'Vì 56 − 8 = 48.', 'Đó là trừ.'], ['🐰 Thỏ', 'Vì 5 + 6 = 11 trừ 4.', 'Không có quy luật đó.']]),
  remember: ['Chia ngược với nhân', 'a : 1 = a', 'Không chia cho 0'],
  games: ['bongbay', 'chuotchui', 'latthe'],
  pairs: [['42 : 6', '7'], ['56 : 8', '7'], ['27 : 3', '9'], ['36 : 4', '9'], ['63 : 9', '7'], ['48 : 8', '6']],
})

const t3NhanChiaLon = defineLesson({
  ...L3,
  id: 't3-nhan-chia-lon',
  title: 'Nhân, chia số có nhiều chữ số với số có một chữ số',
  emoji: '🧮',
  essenceLine: 'Nhân từng hàng từ phải sang trái, có nhớ; chia lần lượt từ hàng cao nhất.',
  standards: [g('Toán 3 · Nhân, chia số có nhiều chữ số với (cho) số có một chữ số'), cc('4.NBT.B.5'), cc('4.NBT.B.6')],
  prereqs: ['t3-bang-nhan', 't3-bang-chia', 't2-cong-co-nho'],
  hook: '124 × 3 nghe có vẻ khó. Nhưng thật ra là 100 × 3, 20 × 3 và 4 × 3 rồi cộng lại!',
  hookVisual: '🧮',
  explore: columnExplore('Phép nhân cũng là cộng lặp lại. Em xem cô tính 124 + 124 + 124 theo từng hàng nhé!', [
    { a: 248, b: 124, op: '+' },
  ]),
  essence: {
    bigIdea: 'Tách số theo hàng rồi nhân từng hàng.',
    points: ['124 × 3 = 100 × 3 + 20 × 3 + 4 × 3 = 300 + 60 + 12 = 372.', 'Đặt tính: nhân từ hàng đơn vị, có nhớ thì cộng vào hàng sau.', 'Chia: lấy từng hàng từ trái sang, chia, nhân, trừ, hạ.'],
  },
  practice: byLevel({
    1: arith({ 1: { op: '×', a: [11, 40], b: [2, 3] } }),
    2: mix(arith({ 2: { op: '×', a: [101, 320], b: [2, 4], form: ['bare'] } }), arith({ 2: { op: ':', a: [11, 99], b: [2, 4] } })),
    3: mix(arith({ 3: { op: '×', a: [105, 240], b: [3, 4], form: ['word'] } }), arith({ 3: { op: ':', a: [12, 99], b: [3, 6], form: ['word'] } })),
  }),
  teachBack: tb('Bạn tính 24 × 3 = 612. Sai ở đâu?', ['🦉 Cú', '4 × 3 = 12 phải viết 2 nhớ 1, rồi 2 × 3 = 6 thêm 1 là 7. Kết quả đúng là 72.', 'Xuất sắc!'], [['🐻 Gấu', 'Bạn đúng rồi.', 'Ước lượng: 24 × 3 chỉ khoảng 70, không thể là 612.'], ['🐸 Ếch', 'Phải lấy 24 + 3.', 'Nhân không phải cộng.']]),
  remember: ['Tách theo hàng rồi nhân', 'Có nhớ cộng vào hàng sau', 'Ước lượng để kiểm tra'],
  games: ['bongbay', 'chuotchui'],
})

const chiaDuGen: Gen = (level, rng) => {
  const b = int(rng, level === 1 ? 2 : 3, level === 1 ? 5 : 9)
  const q = int(rng, 2, 9)
  const r = int(rng, 1, b - 1)
  const a = b * q + r
  if (level >= 3)
    return {
      level,
      prompt: `Có ${a} học sinh, mỗi xe chở được ${b} bạn. Cần ít nhất bao nhiêu xe?`,
      choices: choicesFrom(rng, q + 1, [
        { value: q, misconception: 'ng:Bỏ quên số dư khi tính số xe', why: `Còn dư ${r} bạn chưa có xe, phải thêm 1 xe nữa.` },
        { value: r, misconception: 'ng:Nhầm số dư với kết quả', why: 'Đó là số bạn còn dư.' },
      ], { fill: near(q + 1, 1) }),
      explain: `${a} : ${b} = ${q} dư ${r}. ${q} xe chở được ${q * b} bạn, còn ${r} bạn cần thêm 1 xe: ${q + 1} xe.`,
    }
  return {
    level,
    prompt: `${a} : ${b} = ? (dư bao nhiêu?)`,
    speak: `${a} chia ${b} bằng mấy, dư mấy?`,
    choices: choicesFrom(rng, `${q} dư ${r}`, [
      { value: `${q + 1} dư ${r}`, misconception: 'nham-bang-chia', why: `${q + 1} × ${b} = ${(q + 1) * b}, lớn hơn ${a} rồi.` },
      { value: `${q - 1} dư ${r + b}`, misconception: 'ng:Số dư lớn hơn hoặc bằng số chia', why: `Số dư phải bé hơn số chia ${b}. Dư ${r + b} thì còn chia tiếp được.` },
      { value: `${q} dư ${b - r}`, misconception: 'ng:Tính sai số dư', why: `Thử lại: ${q} × ${b} + ${r} = ${a}.` },
    ].filter((w) => !w.value.startsWith('0 ') && w.value !== `${q} dư ${r}`)),
    explain: `${a} : ${b} = ${q} dư ${r}, vì ${q} × ${b} = ${q * b}, ${a} − ${q * b} = ${r}. Số dư ${r} bé hơn số chia ${b}.`,
  }
}
const t3ChiaDu = defineLesson({
  ...L3,
  id: 't3-chia-du',
  title: 'Phép chia có dư',
  emoji: '🍬',
  essenceLine: 'Chia không hết thì còn dư; số dư luôn bé hơn số chia.',
  standards: [g('Toán 3 · Phép chia hết, phép chia có dư'), cc('4.NBT.B.6')],
  prereqs: ['t3-bang-chia'],
  hook: '14 cái kẹo chia đều cho 4 bạn. Mỗi bạn 3 cái thì còn thừa mấy cái? Có chia tiếp được không?',
  hookVisual: '🍬❓',
  explore: shareExplore('Em chia đều kẹo, để ý xem cuối cùng còn thừa mấy cái nhé!', [
    [14, 4],
    [17, 5],
  ]),
  essence: {
    bigIdea: 'Số dư luôn bé hơn số chia.',
    points: ['14 : 4 = 3 dư 2 vì 3 × 4 + 2 = 14.', 'Nếu dư bằng hoặc lớn hơn số chia thì còn chia tiếp được.', 'Bài toán thực tế: còn dư có thể cần thêm 1 (xe, hộp…).'],
  },
  practice: chiaDuGen,
  teachBack: tb('Vì sao 17 : 5 không thể là 2 dư 7?', ['🐬 Cá heo', 'Vì dư 7 lớn hơn số chia 5, vẫn chia thêm cho mỗi bạn 1 cái được. Đúng là 3 dư 2.', 'Chuẩn!'], [['🐻 Gấu', 'Vì 7 là số lẻ.', 'Không liên quan chẵn lẻ.'], ['🐰 Thỏ', '2 dư 7 cũng đúng.', 'Số dư phải bé hơn số chia.']]),
  remember: ['Số dư < số chia', 'Thử lại: thương × chia + dư', 'Thực tế: dư thì thêm 1'],
  games: ['bongbay'],
})

const t3So100000 = defineLesson({
  ...L3,
  id: 't3-so-100000',
  title: 'Các số đến 100 000',
  emoji: '🔢',
  essenceLine: 'Cứ 10 đơn vị của hàng này gộp thành 1 đơn vị của hàng liền trên; đọc theo từng lớp.',
  standards: [g('Toán 3 · Các số trong phạm vi 10 000 và 100 000')],
  prereqs: ['t2-so-1000'],
  hook: 'Sân vận động có 40 500 chỗ ngồi. Số này đọc thế nào? Chữ số 4 có giá trị bao nhiêu?',
  hookVisual: '🏟️',
  explore: cardsExplore(
    'Em chạm vào từng hàng để nghe cô nói nhé!',
    [
      { key: 'dv', name: 'hàng đơn vị', emoji: '1', say: 'Hàng đơn vị: từ 1 đến 9.' },
      { key: 'ch', name: 'hàng chục', emoji: '10', say: 'Mười đơn vị là một chục.' },
      { key: 'tr', name: 'hàng trăm', emoji: '100', say: 'Mười chục là một trăm.' },
      { key: 'ng', name: 'hàng nghìn', emoji: '1 000', say: 'Mười trăm là một nghìn.' },
      { key: 'cn', name: 'hàng chục nghìn', emoji: '10 000', say: 'Mười nghìn là một chục nghìn.' },
      { key: 'tn', name: 'một trăm nghìn', emoji: '100 000', say: 'Mười chục nghìn là một trăm nghìn.' },
    ],
    'Em giỏi lắm! Cứ mười đơn vị hàng dưới gộp thành một đơn vị hàng trên.',
  ),
  essence: {
    bigIdea: 'Mỗi hàng gấp 10 lần hàng liền sau.',
    points: ['40 500 = 4 chục nghìn + 5 trăm.', 'Đọc: bốn mươi nghìn năm trăm.', 'So sánh: số nào nhiều chữ số hơn thì lớn hơn; bằng nhau thì so từ hàng cao nhất.'],
  },
  practice: mix(placeGen(99999), compareGen({ 1: [1000, 9999], 2: [10000, 99999], 3: [10000, 99999] })),
  teachBack: tb('Vì sao 9 999 < 10 000 dù 9 999 có nhiều chữ số 9?', ['🦉 Cú', 'Vì 9 999 chỉ có 4 chữ số, còn 10 000 có 5 chữ số; số nhiều chữ số hơn thì lớn hơn.', 'Đúng!'], [['🐻 Gấu', 'Vì 9 bé hơn 1.', 'Ngược lại, 9 lớn hơn 1; phải xem số chữ số.'], ['🐷 Heo', 'Hai số bằng nhau.', '10 000 = 9 999 + 1.']]),
  remember: ['10 đơn vị hàng dưới = 1 hàng trên', 'Nhiều chữ số hơn thì lớn hơn', 'So từ hàng cao nhất'],
  games: ['bongbay', 'chuotchui'],
})

const cvdtGen: Gen = (level, rng) => {
  const w = int(rng, 3, 12)
  const h = int(rng, 2, w - 1)
  const square = level >= 2 && rng() < 0.3
  const a = square ? h : w
  if (level === 1 || rng() < 0.5)
    return {
      level,
      prompt: square ? `Hình vuông cạnh ${a} cm. Chu vi là bao nhiêu?` : `Hình chữ nhật dài ${w} cm, rộng ${h} cm. Chu vi là bao nhiêu?`,
      choices: choicesFrom(rng, `${square ? a * 4 : (w + h) * 2} cm`, [
        { value: `${square ? a * a : w * h} cm`, misconception: 'ng:Nhầm chu vi với diện tích', why: 'Đó là diện tích. Chu vi là độ dài đường bao quanh hình.' },
        { value: `${square ? a * 2 : w + h} cm`, misconception: 'ng:Chỉ cộng chiều dài và chiều rộng một lần', why: 'Hình có 4 cạnh: phải nhân 2 (hoặc nhân 4 với hình vuông).' },
      ], { fill: (i) => `${near(square ? a * 4 : (w + h) * 2, 1)(i)} cm` }),
      explain: square ? `Chu vi hình vuông = cạnh × 4 = ${a} × 4 = ${a * 4} cm.` : `Chu vi = (dài + rộng) × 2 = (${w} + ${h}) × 2 = ${(w + h) * 2} cm.`,
    }
  return {
    level,
    prompt: square ? `Hình vuông cạnh ${a} cm. Diện tích là bao nhiêu?` : `Hình chữ nhật dài ${w} cm, rộng ${h} cm. Diện tích là bao nhiêu?`,
    choices: choicesFrom(rng, `${square ? a * a : w * h} cm²`, [
      { value: `${square ? a * 4 : (w + h) * 2} cm²`, misconception: 'ng:Nhầm diện tích với chu vi', why: 'Đó là chu vi. Diện tích là số ô vuông 1 cm² phủ kín hình.' },
      { value: `${square ? a * 2 : w + h} cm²`, misconception: 'ng:Cộng thay vì nhân khi tính diện tích', why: 'Diện tích = dài × rộng (đếm theo hàng), không cộng.' },
    ], { fill: (i) => `${near(square ? a * a : w * h, 1)(i)} cm²` }),
    explain: square ? `Diện tích hình vuông = cạnh × cạnh = ${a} × ${a} = ${a * a} cm².` : `Diện tích = dài × rộng = ${w} × ${h} = ${w * h} cm². Có ${h} hàng, mỗi hàng ${w} ô.`,
  }
}
const t3ChuViDienTich = defineLesson({
  ...L3,
  id: 't3-chu-vi-dien-tich',
  title: 'Chu vi và diện tích hình chữ nhật, hình vuông',
  emoji: '🟩',
  essenceLine: 'Chu vi là đường bao quanh (cộng các cạnh); diện tích là số ô vuông phủ kín (dài × rộng).',
  standards: [g('Toán 3 · Chu vi, diện tích hình chữ nhật, hình vuông'), cc('3.MD.C.7'), cc('3.MD.D.8')],
  prereqs: ['t3-bang-nhan', 't2-hinh'],
  hook: 'Muốn rào quanh vườn thì cần tính gì? Muốn lát gạch kín sân thì cần tính gì? Hai việc khác nhau đấy!',
  hookVisual: '🐜🟩',
  explore: areaExplore('Em đổi chiều dài, chiều rộng rồi bấm Chu vi và Diện tích để so sánh nhé!'),
  essence: {
    bigIdea: 'Chu vi: đi vòng quanh. Diện tích: phủ kín bên trong.',
    points: ['Chu vi HCN = (dài + rộng) × 2; hình vuông = cạnh × 4.', 'Diện tích HCN = dài × rộng; hình vuông = cạnh × cạnh.', 'Chu vi đo bằng cm, diện tích đo bằng cm².'],
    analogy: 'Chu vi là sợi dây rào, diện tích là số viên gạch lát.',
  },
  practice: cvdtGen,
  teachBack: tb('Vì sao diện tích hình chữ nhật lại là dài × rộng?', ['🐬 Cá heo', 'Vì phủ hình bằng ô vuông 1 cm²: có "rộng" hàng, mỗi hàng "dài" ô, đếm theo hàng chính là phép nhân.', 'Đúng bản chất!'], [['🐻 Gấu', 'Vì công thức như vậy.', 'Công thức có lý do: đếm ô theo hàng.'], ['🐸 Ếch', 'Vì cộng dài với rộng.', 'Cộng chỉ là nửa chu vi.']]),
  remember: ['Chu vi = đường bao (cm)', 'Diện tích = ô phủ kín (cm²)', 'HCN: (d + r) × 2 và d × r'],
  games: ['bongbay', 'chuotchui'],
})

const t3GocTron = defineLesson({
  ...L3,
  id: 't3-goc-tron',
  title: 'Góc vuông; tâm, bán kính, đường kính hình tròn',
  emoji: '⭕',
  essenceLine: 'Mọi điểm trên đường tròn cách tâm bằng nhau (bán kính); đường kính gấp đôi bán kính.',
  standards: [g('Toán 3 · Hình học · Góc vuông, góc không vuông; hình tròn: tâm, bán kính, đường kính')],
  prereqs: ['t2-hinh'],
  hook: 'Vì sao bánh xe phải tròn? Thử tưởng tượng bánh xe hình vuông xem đi có êm không!',
  hookVisual: '🚲⭕',
  explore: cardsExplore(
    'Em chạm vào từng phần để nghe cô giải thích nhé!',
    [
      { key: 'tam', name: 'tâm', emoji: '•', say: 'Tâm là điểm chính giữa hình tròn.' },
      { key: 'bk', name: 'bán kính', emoji: '↗', say: 'Bán kính nối tâm với một điểm trên đường tròn. Mọi bán kính đều dài bằng nhau.' },
      { key: 'dk', name: 'đường kính', emoji: '↔', say: 'Đường kính đi qua tâm, nối hai điểm trên đường tròn. Đường kính dài gấp đôi bán kính.' },
      { key: 'gv', name: 'góc vuông', emoji: '∟', say: 'Góc vuông như góc quyển vở. Dùng ê-ke để kiểm tra góc vuông.' },
    ],
    'Em giỏi lắm! Mọi điểm trên đường tròn đều cách tâm như nhau, nên bánh xe lăn êm!',
    { big: false },
  ),
  essence: { bigIdea: 'Đường tròn: mọi điểm cách tâm bằng bán kính.', points: ['Đường kính = 2 × bán kính.', 'Vì cách tâm đều nhau nên bánh xe lăn êm.', 'Góc vuông: kiểm tra bằng ê-ke.'] },
  practice: (level, rng) => {
    if (level === 1)
      return bank([
        { lv: 1, q: 'Điểm chính giữa hình tròn gọi là gì?', a: 'tâm', wrong: [['bán kính', 'Bán kính là đoạn thẳng.'], ['đường kính', 'Đường kính là đoạn thẳng qua tâm.']], ex: 'Điểm chính giữa là tâm.' },
        { lv: 1, q: 'Dụng cụ nào dùng để kiểm tra góc vuông?', a: 'ê-ke', wrong: [['com-pa', 'Com-pa dùng để vẽ hình tròn.'], ['thước dây', 'Thước dây đo độ dài.']], ex: 'Ê-ke dùng kiểm tra góc vuông.' },
      ])(level, rng)
    const r = int(rng, 2, 15)
    const askD = rng() < 0.5
    return {
      level,
      prompt: askD ? `Hình tròn có bán kính ${r} cm. Đường kính dài bao nhiêu?` : `Hình tròn có đường kính ${r * 2} cm. Bán kính dài bao nhiêu?`,
      choices: choicesFrom(rng, askD ? `${r * 2} cm` : `${r} cm`, [
        { value: askD ? `${r} cm` : `${r * 2} cm`, misconception: 'ng:Nhầm bán kính với đường kính', why: 'Đường kính dài gấp đôi bán kính.' },
        { value: askD ? `${r + 2} cm` : `${r * 4} cm`, misconception: 'ng:Tính sai quan hệ bán kính – đường kính', why: 'Đường kính = 2 × bán kính.' },
      ]),
      explain: askD ? `Đường kính = 2 × ${r} = ${r * 2} cm.` : `Bán kính = ${r * 2} : 2 = ${r} cm.`,
    }
  },
  teachBack: tb('Vì sao bánh xe làm hình tròn?', ['🦉 Cú', 'Vì mọi điểm trên vành bánh đều cách tâm bằng nhau, nên trục xe luôn ở cùng độ cao khi lăn, xe đi êm.', 'Hiểu rất sâu!'], [['🐻 Gấu', 'Vì hình tròn đẹp.', 'Lý do là cách tâm đều nhau.'], ['🐸 Ếch', 'Vì hình tròn có 4 góc.', 'Hình tròn không có góc.']]),
  remember: ['Tâm ở giữa', 'Bán kính bằng nhau', 'Đường kính = 2 × bán kính', 'Ê-ke kiểm tra góc vuông'],
  games: ['bongbay'],
})

const BAR = ({ data }: { data: [string, number][] }) => (
  <div className="mini-bars">
    {data.map(([k, v]) => (
      <div key={k}>
        <span style={{ height: `${v * 12}px` }}>{v}</span>
        <small>{k}</small>
      </div>
    ))}
  </div>
)
const thongKeGen: Gen = (level, rng) => {
  const fruits = ['Cam', 'Táo', 'Chuối', 'Xoài']
  const data: [string, number][] = fruits.map((f) => [f, int(rng, 2, 8)])
  // Bảo đảm chỉ có một cột cao nhất.
  const mi = data.reduce((best, d, i) => (d[1] > data[best][1] ? i : best), 0)
  data[mi] = [data[mi][0], Math.max(...data.map((d) => d[1])) + 1]
  const max = data[mi]
  const kind = level === 1 ? 'max' : pick(rng, ['sum', 'diff'] as const)
  if (kind === 'max')
    return {
      level,
      prompt: 'Biểu đồ: số bạn thích mỗi loại quả. Quả nào được nhiều bạn thích nhất?',
      visual: <BAR data={data} />,
      choices: data.map(([k, v]) => ({ label: k, correct: k === max[0], why: k === max[0] ? undefined : `Cột ${k} chỉ có ${v} bạn. Tìm cột cao nhất nhé.`, misconception: k === max[0] ? undefined : 'ng:Đọc nhầm cột trên biểu đồ' })),
      explain: `Cột ${max[0]} cao nhất với ${max[1]} bạn.`,
    }
  if (data[0][1] === data[1][1]) data[1] = [data[1][0], data[1][1] + 1]
  const [a, b] = [data[0], data[1]]
  if (kind === 'sum') {
    const s = data.reduce((x, d) => x + d[1], 0)
    return {
      level,
      prompt: 'Biểu đồ: số bạn thích mỗi loại quả. Có tất cả bao nhiêu bạn?',
      visual: <BAR data={data} />,
      choices: choicesFrom(rng, s, [{ value: max[1], misconception: 'ng:Chỉ đọc một cột thay vì cộng tất cả', why: 'Phải cộng tất cả các cột.' }], { fill: near(s, 1) }),
      explain: `${data.map((d) => d[1]).join(' + ')} = ${s} bạn.`,
    }
  }
  const d = Math.abs(a[1] - b[1])
  return {
    level,
    prompt: `Số bạn thích ${a[0]} nhiều hơn hay ít hơn ${b[0]} bao nhiêu bạn?`,
    visual: <BAR data={data} />,
    choices: choicesFrom(rng, `${a[1] > b[1] ? 'nhiều hơn' : 'ít hơn'} ${d} bạn`, [
      { value: `${a[1] > b[1] ? 'ít hơn' : 'nhiều hơn'} ${d} bạn`, misconception: 'ng:Đọc nhầm cột cao thấp', why: `Cột ${a[0]} có ${a[1]}, cột ${b[0]} có ${b[1]}.` },
      { value: `${a[1] > b[1] ? 'nhiều hơn' : 'ít hơn'} ${a[1] + b[1]} bạn`, misconception: 'nham-phep-tinh', why: 'Hơn kém nhau bao nhiêu thì phải trừ.' },
    ]),
    explain: `${a[0]}: ${a[1]} bạn, ${b[0]}: ${b[1]} bạn. Chênh lệch ${d} bạn.`,
  }
}
const t3ThongKe = defineLesson({
  ...L3,
  id: 't3-thong-ke',
  title: 'Thu thập, phân loại và đọc biểu đồ',
  emoji: '📊',
  essenceLine: 'Biểu đồ cột cho thấy ngay nhiều – ít: cột càng cao, số càng lớn.',
  standards: [g('Toán 3 · Thống kê và xác suất · Thu thập, phân loại, kiểm đếm số liệu; bảng số liệu'), cc('3.MD.B.3')],
  prereqs: ['t2-cong-co-nho'],
  hook: 'Cả lớp thích loại quả nào nhất? Hỏi từng bạn rồi ghi lại thật nhanh bằng cách nào nhỉ?',
  hookVisual: '📊🍊',
  explore: cardsExplore(
    'Em chạm vào từng bước làm thống kê nhé!',
    [
      { key: 'hoi', name: 'Thu thập', emoji: '🙋', say: 'Bước một: hỏi từng bạn và ghi lại.' },
      { key: 'dem', name: 'Kiểm đếm', emoji: '✏️', say: 'Bước hai: kiểm đếm bằng các vạch, cứ năm vạch thành một bó.' },
      { key: 'bang', name: 'Lập bảng', emoji: '📋', say: 'Bước ba: ghi số lượng vào bảng.' },
      { key: 'bieudo', name: 'Biểu đồ cột', emoji: '📊', say: 'Bước bốn: vẽ biểu đồ cột. Cột càng cao, số càng lớn.' },
    ],
    'Em giỏi lắm! Biểu đồ giúp mình nhìn là thấy ngay nhiều hay ít.',
    { big: false },
  ),
  essence: { bigIdea: 'Thu thập → kiểm đếm → bảng → biểu đồ.', points: ['Cột cao nhất: nhiều nhất.', 'Muốn biết tổng: cộng tất cả các cột.', 'Muốn so sánh: lấy hai cột trừ nhau.'] },
  practice: thongKeGen,
  teachBack: tb('Muốn biết hơn kém nhau bao nhiêu từ biểu đồ, em làm gì?', ['🐼 Gấu trúc', 'Em đọc số ở hai cột rồi lấy số lớn trừ số bé.', 'Đúng!'], [['🐻 Gấu', 'Em cộng hai cột lại.', 'Cộng là tính tổng, không phải hơn kém.'], ['🐸 Ếch', 'Em đo chiều cao bằng thước.', 'Đọc số trên cột là được.']]),
  remember: ['Cột cao = nhiều', 'Tổng: cộng các cột', 'Hơn kém: trừ'],
  games: ['bongbay'],
})

export const TOAN_3: Defined[] = [t3BangNhan, t3BangChia, t3NhanChiaLon, t3ChiaDu, t3So100000, t3ChuViDienTich, t3GocTron, t3ThongKe]

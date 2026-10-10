// TỰ NHIÊN VÀ XÃ HỘI (lớp 1–3) và KHOA HỌC (lớp 4–5) — Chương trình GDPT 2018.
import { g, ng } from '../core/standards'
import { defineLesson, tb, type Defined } from './define'
import { cardsExplore, sortExplore, stepsExplore, type Card } from './kit'
import { bank, byLevel, vocab } from './questions'

const K = (grade: number, gradeLabel?: string) => ({ stage: 'tieuhoc' as const, grade, gradeLabel: gradeLabel ?? `Lớp ${grade}`, subject: 'khoahoc' as const })

const SENSES: Card[] = [
  { key: 'mat', name: 'thị giác (mắt)', emoji: '👀', say: 'Mắt giúp em nhìn thấy màu sắc, hình dạng.' },
  { key: 'tai', name: 'thính giác (tai)', emoji: '👂', say: 'Tai giúp em nghe âm thanh.' },
  { key: 'mui', name: 'khứu giác (mũi)', emoji: '👃', say: 'Mũi giúp em ngửi mùi thơm, mùi hôi.' },
  { key: 'luoi', name: 'vị giác (lưỡi)', emoji: '👅', say: 'Lưỡi giúp em nếm vị ngọt, mặn, chua, đắng.' },
  { key: 'da', name: 'xúc giác (da)', emoji: '✋', say: 'Da giúp em cảm nhận nóng, lạnh, trơn, ráp.' },
]
const xhGiacQuan = defineLesson({
  ...K(1),
  id: 'xh1-giac-quan',
  title: 'Các giác quan và cách bảo vệ',
  emoji: '👀',
  essenceLine: 'Năm giác quan giúp ta nhận biết thế giới; mỗi giác quan cần được bảo vệ.',
  standards: [g('Tự nhiên và Xã hội 1 · Con người và sức khoẻ · Các giác quan')],
  prereqs: ['mam.co-the'],
  hook: 'Nhắm mắt lại, làm sao em biết mẹ đang nấu món gì? Và làm sao biết cốc nước nóng hay lạnh?',
  hookVisual: '🙈👃✋',
  explore: cardsExplore('Em chạm vào từng giác quan nhé!', SENSES, 'Em giỏi lắm! Năm giác quan cùng giúp em khám phá thế giới.'),
  essence: { bigIdea: 'Năm giác quan: nhìn, nghe, ngửi, nếm, sờ.', points: ['Đọc sách đủ ánh sáng, không nhìn gần màn hình.', 'Không nghe nhạc quá to, không ngoáy tai bằng vật nhọn.', 'Không ăn đồ quá nóng; rửa tay, giữ da sạch.'] },
  practice: byLevel({
    1: vocab(SENSES, { ask: (c) => `Bộ phận nào ứng với ${c.name.split(' (')[0]}?` }),
    2: bank([
      { lv: 2, q: 'Em biết quả chanh chua là nhờ giác quan nào?', a: 'vị giác', wrong: [['thính giác', 'Tai để nghe, không nếm được.'], ['thị giác', 'Mắt chỉ thấy màu, không biết vị.']], ex: 'Lưỡi (vị giác) nếm được vị chua.' },
      { lv: 2, q: 'Việc nào giúp bảo vệ mắt?', a: 'đọc sách ở nơi đủ ánh sáng', wrong: [['xem điện thoại thật gần', 'Nhìn gần lâu làm mắt mỏi, dễ cận thị.'], ['dụi mắt bằng tay bẩn', 'Tay bẩn làm mắt bị đau, nhiễm trùng.']], ex: 'Đủ ánh sáng, giữ khoảng cách giúp mắt khỏe.' },
      { lv: 3, q: 'Vì sao bị cảm cúm, ăn thấy nhạt miệng?', a: 'vì mũi bị nghẹt nên ngửi kém, vị giác cũng kém đi', wrong: [['vì thức ăn hết vị', 'Thức ăn vẫn vậy, chỉ là mũi bị nghẹt.'], ['vì tai bị đau', 'Tai không liên quan đến vị.']], ex: 'Khứu giác và vị giác phối hợp với nhau.' },
    ]),
  }),
  teachBack: tb('Vì sao không nên nghe nhạc quá to bằng tai nghe?', ['🐰 Thỏ', 'Vì âm thanh quá to làm hại tai, lâu dần có thể nghe kém.', 'Đúng!'], [['🐻 Gấu', 'Vì làm hỏng tai nghe.', 'Quan trọng nhất là bảo vệ tai của em.'], ['🐸 Ếch', 'Nghe to cho rõ thì tốt.', 'Quá to sẽ hại thính giác.']]),
  remember: ['👀 nhìn · 👂 nghe · 👃 ngửi · 👅 nếm · ✋ sờ', 'Bảo vệ từng giác quan'],
  games: ['bongbay', 'latthe'],
  pairs: SENSES.map((s) => [s.emoji, s.name.split(' (')[0]]),
})

const xhCay = defineLesson({
  ...K(1),
  id: 'xh1-cay',
  title: 'Các bộ phận của cây',
  emoji: '🌳',
  essenceLine: 'Rễ hút nước, thân dẫn nước, lá làm thức ăn, hoa tạo quả, quả chứa hạt.',
  standards: [g('Tự nhiên và Xã hội 1 · Thực vật và động vật · Các bộ phận của cây')],
  hook: 'Cây không có miệng, vậy cây "uống nước" bằng cách nào nhỉ?',
  hookVisual: '🌱💧',
  explore: stepsExplore(
    'Em bấm để đi từ rễ lên ngọn cây nhé!',
    [
      { emoji: '🫚', title: 'Rễ', say: 'Rễ cắm sâu xuống đất, hút nước và chất khoáng, giữ cho cây đứng vững.' },
      { emoji: '🪵', title: 'Thân', say: 'Thân dẫn nước từ rễ lên lá và nâng đỡ cành lá.' },
      { emoji: '🍃', title: 'Lá', say: 'Lá xanh hứng ánh nắng để làm thức ăn cho cây.' },
      { emoji: '🌸', title: 'Hoa', say: 'Hoa nở để tạo thành quả.' },
      { emoji: '🍎', title: 'Quả và hạt', say: 'Quả chứa hạt. Hạt gieo xuống đất sẽ mọc thành cây mới.' },
    ],
    'Em giỏi lắm! Mỗi bộ phận làm một việc để cây sống và lớn lên.',
  ),
  essence: { bigIdea: 'Mỗi bộ phận một nhiệm vụ.', points: ['Rễ: hút nước, giữ cây.', 'Thân: dẫn nước, nâng đỡ.', 'Lá: làm thức ăn nhờ ánh sáng.', 'Hoa → quả → hạt → cây mới.'] },
  practice: bank([
    { lv: 1, q: 'Bộ phận nào hút nước cho cây?', a: 'rễ', wrong: [['lá', 'Lá làm thức ăn.'], ['hoa', 'Hoa tạo quả.']], ex: 'Rễ hút nước và chất khoáng.' },
    { lv: 1, q: 'Bộ phận nào làm thức ăn cho cây?', a: 'lá', wrong: [['rễ', 'Rễ hút nước.'], ['thân', 'Thân dẫn nước.']], ex: 'Lá xanh hứng ánh sáng làm thức ăn.' },
    { lv: 2, q: 'Hạt gieo xuống đất sẽ thành gì?', a: 'cây mới', wrong: [['hoa', 'Hạt nảy mầm thành cây con.'], ['lá', 'Hạt mọc thành cả cây.']], ex: 'Hạt → cây con → cây trưởng thành.' },
    { lv: 3, q: 'Vì sao cây bị nhổ rễ thì héo?', a: 'vì không còn rễ hút nước', wrong: [['vì lá rụng', 'Lá héo là do thiếu nước.'], ['vì cây buồn', 'Cây héo vì thiếu nước.']], ex: 'Mất rễ, cây không hút được nước nên héo.' },
  ]),
  teachBack: tb('Cây "uống nước" bằng cách nào?', ['🦉 Cú', 'Rễ hút nước từ đất, rồi thân dẫn nước lên lá.', 'Chính xác!'], [['🐻 Gấu', 'Cây uống nước bằng lá.', 'Lá chủ yếu làm thức ăn; rễ mới hút nước.'], ['🐸 Ếch', 'Cây không cần nước.', 'Cây rất cần nước.']]),
  remember: ['Rễ hút', 'Thân dẫn', 'Lá làm thức ăn', 'Hoa → quả → hạt'],
  games: ['bongbay', 'latthe'],
  pairs: [['🫚', 'rễ'], ['🪵', 'thân'], ['🍃', 'lá'], ['🌸', 'hoa'], ['🍎', 'quả']],
})

const xhGiaDinh = defineLesson({
  ...K(1),
  id: 'xh1-gia-dinh-truong',
  title: 'Gia đình và trường học',
  emoji: '🏫',
  essenceLine: 'Ở nhà và ở trường, mỗi người có việc của mình; em biết yêu thương, giúp đỡ và giữ an toàn.',
  standards: [g('Tự nhiên và Xã hội 1 · Gia đình; Trường học')],
  hook: 'Ở nhà em làm được việc gì giúp bố mẹ? Ở trường em cần nhớ điều gì?',
  hookVisual: '🏠🏫',
  explore: sortExplore(
    'Em xếp mỗi việc tốt vào nơi em thường làm nhé!',
    [
      { name: 'Ở nhà', emoji: '🏠' },
      { name: 'Ở trường', emoji: '🏫' },
    ],
    [
      { emoji: '🧹', name: 'quét nhà', bin: 0, why: 'Đúng! Quét nhà giúp bố mẹ.' },
      { emoji: '🍽️', name: 'dọn bát đũa', bin: 0, why: 'Đúng! Dọn bát đũa sau bữa ăn.' },
      { emoji: '🙋', name: 'giơ tay phát biểu', bin: 1, why: 'Đúng! Giơ tay xin phát biểu trong lớp.' },
      { emoji: '🗑️', name: 'bỏ rác vào thùng ở sân trường', bin: 1, why: 'Đúng! Giữ sân trường sạch đẹp.' },
    ],
    'Em giỏi lắm! Ở đâu em cũng là bạn nhỏ ngoan.',
  ),
  essence: { bigIdea: 'Yêu thương và có trách nhiệm.', points: ['Ở nhà: phụ giúp việc vừa sức.', 'Ở trường: lễ phép, giữ gìn đồ dùng chung.', 'An toàn: không leo trèo, không chơi gần ổ điện.'] },
  practice: bank([
    { lv: 1, q: 'Việc nào em có thể làm giúp mẹ?', a: 'gấp quần áo', wrong: [['nấu ăn bằng bếp ga một mình', 'Việc này nguy hiểm, cần người lớn.']], ex: 'Gấp quần áo là việc vừa sức em.' },
    { lv: 1, q: 'Gặp thầy cô ở trường, em làm gì?', a: 'chào hỏi lễ phép', wrong: [['làm ngơ', 'Em nên chào thầy cô.'], ['chạy đi chỗ khác', 'Em nên chào thầy cô.']], ex: 'Chào hỏi lễ phép.' },
    { lv: 2, q: 'Giờ ra chơi, trò nào an toàn?', a: 'nhảy dây', wrong: [['trèo cây cao', 'Có thể bị ngã.'], ['đuổi nhau trên cầu thang', 'Dễ trượt ngã.']], ex: 'Chọn trò chơi an toàn.' },
  ]),
  teachBack: tb('Vì sao em nên phụ giúp việc nhà?', ['🐼 Gấu trúc', 'Vì mỗi người trong nhà đều có trách nhiệm, giúp bố mẹ đỡ vất vả và em học được nhiều việc.', 'Rất ngoan!'], [['🐻 Gấu', 'Để được thưởng tiền.', 'Giúp đỡ vì yêu thương và trách nhiệm.'], ['🐸 Ếch', 'Việc nhà là của người lớn.', 'Em cũng làm được việc vừa sức.']]),
  remember: ['Phụ giúp việc vừa sức', 'Lễ phép ở trường', 'Chơi an toàn'],
  games: ['bongbay'],
})

const xhGiaoThong = defineLesson({
  ...K(2),
  id: 'xh2-giao-thong',
  title: 'An toàn giao thông',
  emoji: '🚦',
  essenceLine: 'Đèn đỏ dừng, đèn vàng chậm lại, đèn xanh được đi; đi bộ trên vỉa hè, qua đường ở vạch kẻ.',
  standards: [g('Tự nhiên và Xã hội 2 · Cộng đồng địa phương · An toàn khi đi trên các phương tiện giao thông')],
  hook: 'Đèn giao thông có ba màu. Màu nào nghĩa là "Dừng lại ngay"?',
  hookVisual: '🚦',
  explore: cardsExplore(
    'Em chạm vào từng màu đèn và biển báo nhé!',
    [
      { key: 'do', name: 'đèn đỏ', emoji: '🔴', color: '#ef4444', say: 'Đèn đỏ: tất cả phải dừng lại.' },
      { key: 'vang', name: 'đèn vàng', emoji: '🟡', color: '#facc15', say: 'Đèn vàng: đi chậm lại, chuẩn bị dừng.' },
      { key: 'xanh', name: 'đèn xanh', emoji: '🟢', color: '#22c55e', say: 'Đèn xanh: được phép đi, nhưng vẫn quan sát.' },
      { key: 'vach', name: 'vạch kẻ đường', emoji: '🚸', color: '#94a3b8', say: 'Qua đường ở vạch kẻ dành cho người đi bộ, nắm tay người lớn.' },
      { key: 'mu', name: 'mũ bảo hiểm', emoji: '⛑️', color: '#60a5fa', say: 'Ngồi xe máy phải đội mũ bảo hiểm và cài quai.' },
    ],
    'Em giỏi lắm! Nhớ: đỏ dừng, vàng chậm, xanh đi.',
  ),
  essence: { bigIdea: 'Đỏ dừng – vàng chậm – xanh đi.', points: ['Đi bộ trên vỉa hè, sát lề bên phải.', 'Qua đường ở vạch kẻ, nhìn trái – phải – trái.', 'Ngồi xe máy đội mũ bảo hiểm, cài quai.'] },
  practice: bank([
    { lv: 1, q: 'Đèn đỏ bật, em phải làm gì?', a: 'dừng lại', wrong: [['đi tiếp', 'Đèn đỏ là phải dừng.'], ['chạy nhanh qua', 'Rất nguy hiểm!']], ex: 'Đèn đỏ: dừng lại.' },
    { lv: 1, q: 'Ngồi sau xe máy, em cần làm gì?', a: 'đội mũ bảo hiểm', wrong: [['đứng lên ghế', 'Rất nguy hiểm.'], ['bỏ tay ra vẫy bạn', 'Phải bám chắc người lái.']], ex: 'Đội mũ bảo hiểm, cài quai.' },
    { lv: 2, q: 'Em đi bộ ở đâu khi ra đường?', a: 'trên vỉa hè', wrong: [['giữa lòng đường', 'Xe cộ đi giữa đường rất nguy hiểm.']], ex: 'Đi bộ trên vỉa hè.' },
    { lv: 2, q: 'Trước khi qua đường, em nhìn thế nào?', a: 'nhìn trái, phải, rồi trái lần nữa', wrong: [['chỉ nhìn thẳng', 'Xe đến từ hai bên.'], ['không cần nhìn', 'Phải quan sát kỹ.']], ex: 'Trái – phải – trái rồi mới qua.' },
  ]),
  teachBack: tb('Vì sao phải đội mũ bảo hiểm khi ngồi xe máy?', ['🦊 Cáo', 'Vì nếu bị ngã, mũ bảo vệ đầu — bộ phận rất quan trọng.', 'Chính xác!'], [['🐻 Gấu', 'Để không bị công an phạt.', 'Quan trọng nhất là bảo vệ đầu em.'], ['🐸 Ếch', 'Để che nắng.', 'Mũ bảo hiểm để bảo vệ đầu khi va chạm.']]),
  remember: ['🔴 dừng · 🟡 chậm · 🟢 đi', 'Đi trên vỉa hè', 'Đội mũ bảo hiểm'],
  games: ['bongbay', 'chuotchui'],
})

const xhMoiTruong = defineLesson({
  ...K(2),
  id: 'xh2-moi-truong',
  title: 'Môi trường sống của thực vật và động vật',
  emoji: '🌿',
  essenceLine: 'Mỗi loài sống ở môi trường phù hợp với cơ thể của nó: dưới nước, trên cạn, trên không.',
  standards: [g('Tự nhiên và Xã hội 2 · Thực vật và động vật · Môi trường sống'), ng('2-LS4-1')],
  prereqs: ['choi.phan-loai'],
  hook: 'Cây lúa sống ở ruộng nước, cây xương rồng sống ở sa mạc khô cằn. Vì sao mỗi cây lại "chọn" một nơi?',
  hookVisual: '🌾🌵',
  explore: sortExplore(
    'Em xếp mỗi loài vào môi trường sống phù hợp nhé!',
    [
      { name: 'Dưới nước', emoji: '🌊' },
      { name: 'Trên cạn', emoji: '🌳' },
    ],
    [
      { emoji: '🪷', name: 'cây sen', bin: 0, why: 'Đúng! Sen sống ở ao, hồ.' },
      { emoji: '🐠', name: 'cá', bin: 0, why: 'Đúng! Cá thở bằng mang dưới nước.' },
      { emoji: '🦀', name: 'cua biển', bin: 0, why: 'Đúng! Cua biển sống dưới nước.' },
      { emoji: '🌵', name: 'xương rồng', bin: 1, why: 'Đúng! Xương rồng sống trên cạn, nơi khô hạn.' },
      { emoji: '🐯', name: 'hổ', bin: 1, why: 'Đúng! Hổ sống trong rừng.' },
      { emoji: '🌻', name: 'hoa hướng dương', bin: 1, why: 'Đúng! Hướng dương sống trên cạn.' },
    ],
    'Em giỏi lắm! Mỗi loài hợp với một môi trường.',
  ),
  essence: { bigIdea: 'Cơ thể hợp với môi trường.', points: ['Cá có mang để thở dưới nước.', 'Xương rồng có gai, thân trữ nước để sống nơi khô.', 'Phá môi trường sống làm loài vật mất nhà.'] },
  practice: bank([
    { lv: 1, q: 'Cây sen sống ở đâu?', a: 'dưới nước', wrong: [['trên cạn', 'Sen mọc ở ao, hồ.']], ex: 'Sen sống dưới nước.' },
    { lv: 2, q: 'Vì sao cá sống được dưới nước?', a: 'vì cá có mang để thở', wrong: [['vì cá có phổi', 'Cá thở bằng mang.'], ['vì cá không cần thở', 'Cá vẫn cần thở.']], ex: 'Mang lấy khí từ nước.' },
    { lv: 3, q: 'Điều gì xảy ra khi rừng bị chặt phá?', a: 'nhiều loài vật mất nơi sống', wrong: [['loài vật sống tốt hơn', 'Mất rừng là mất nhà.'], ['không ảnh hưởng gì', 'Ảnh hưởng rất lớn.']], ex: 'Bảo vệ rừng là bảo vệ nhà của muôn loài.' },
  ]),
  teachBack: tb('Vì sao xương rồng sống được ở sa mạc?', ['🦉 Cú', 'Vì thân xương rồng trữ nước, lá biến thành gai để giữ nước.', 'Tuyệt vời!'], [['🐻 Gấu', 'Vì xương rồng thích nóng.', 'Đúng một phần, nhưng lý do là cơ thể giữ nước.'], ['🐸 Ếch', 'Vì sa mạc nhiều nước.', 'Sa mạc rất khô.']]),
  remember: ['Cá: mang thở dưới nước', 'Xương rồng: trữ nước', 'Bảo vệ môi trường sống'],
  games: ['bongbay', 'cauca'],
})

const xhPhuongHuong = defineLesson({
  ...K(3),
  id: 'xh3-phuong-huong',
  title: 'Phương hướng và Mặt Trời',
  emoji: '🧭',
  essenceLine: 'Mặt Trời mọc ở phía Đông, lặn ở phía Tây; đứng giang tay phải phía Đông thì trước mặt là Bắc.',
  standards: [g('Tự nhiên và Xã hội 3 · Trái Đất và bầu trời · Phương hướng')],
  prereqs: ['th.ngay-dem'],
  hook: 'Bị lạc trong rừng mà không có la bàn, làm sao biết hướng Bắc? Mặt Trời sẽ chỉ đường cho em!',
  hookVisual: '🌅🧭',
  explore: cardsExplore(
    'Em chạm vào từng hướng nhé!',
    [
      { key: 'dong', name: 'Đông', emoji: '🌅', say: 'Phía Đông: nơi Mặt Trời mọc buổi sáng.' },
      { key: 'tay', name: 'Tây', emoji: '🌇', say: 'Phía Tây: nơi Mặt Trời lặn buổi chiều.' },
      { key: 'bac', name: 'Bắc', emoji: '⬆️', say: 'Giang tay phải về phía Đông, tay trái về phía Tây, thì trước mặt là phía Bắc.' },
      { key: 'nam', name: 'Nam', emoji: '⬇️', say: 'Sau lưng em là phía Nam.' },
    ],
    'Em giỏi lắm! Đông mọc, Tây lặn — rồi suy ra Bắc và Nam.',
    { big: false },
  ),
  essence: { bigIdea: 'Mặt Trời là chiếc la bàn tự nhiên.', points: ['Sáng: Mặt Trời ở phía Đông.', 'Chiều: Mặt Trời ở phía Tây.', 'Tay phải Đông → trước mặt Bắc, sau lưng Nam.'] },
  practice: bank([
    { lv: 1, q: 'Mặt Trời mọc ở phía nào?', a: 'phía Đông', wrong: [['phía Tây', 'Phía Tây là nơi Mặt Trời lặn.'], ['phía Bắc', 'Mặt Trời mọc ở Đông.']], ex: 'Đông mọc, Tây lặn.' },
    { lv: 2, q: 'Đứng giang tay phải về phía Mặt Trời mọc. Trước mặt em là phía nào?', a: 'phía Bắc', wrong: [['phía Nam', 'Phía Nam ở sau lưng.'], ['phía Tây', 'Phía Tây ở bên tay trái.']], ex: 'Tay phải Đông, trước mặt Bắc.' },
    { lv: 3, q: 'Buổi chiều, bóng cây đổ về phía nào?', a: 'phía Đông', wrong: [['phía Tây', 'Mặt Trời ở phía Tây nên bóng ngược lại.'], ['không có bóng', 'Có nắng là có bóng.']], ex: 'Bóng luôn đổ ngược phía Mặt Trời.' },
  ]),
  teachBack: tb('Làm sao tìm hướng Bắc khi không có la bàn vào buổi sáng?', ['🐬 Cá heo', 'Giang tay phải về phía Mặt Trời mọc (Đông), trước mặt em là hướng Bắc.', 'Thông minh!'], [['🐻 Gấu', 'Đi thẳng là hướng Bắc.', 'Không phải lúc nào phía trước cũng là Bắc.'], ['🐸 Ếch', 'Nhìn theo Mặt Trời là Bắc.', 'Buổi sáng Mặt Trời ở phía Đông.']]),
  remember: ['Đông mọc, Tây lặn', 'Tay phải Đông → trước Bắc', 'Bóng ngược phía Mặt Trời'],
  games: ['bongbay'],
})

// ───────────────────────── KHOA HỌC 4–5 ─────────────────────────

const khNuoc = defineLesson({
  ...K(4),
  id: 'kh4-nuoc',
  title: 'Nước và vòng tuần hoàn của nước',
  emoji: '💧',
  essenceLine: 'Nước không mất đi, chỉ đổi thể: bay hơi → ngưng tụ thành mây → mưa → chảy về sông biển.',
  standards: [g('Khoa học 4 · Chất · Nước: tính chất, sự chuyển thể, vòng tuần hoàn'), ng('5-ESS2-1')],
  prereqs: ['xh2-moi-truong'],
  hook: 'Nước mưa hôm nay có thể là nước biển từ tuần trước! Nước đi một vòng thế nào nhỉ?',
  hookVisual: '🌊☁️🌧️',
  explore: stepsExplore(
    'Em bấm để theo giọt nước đi một vòng nhé!',
    [
      { emoji: '🌊', title: 'Nước ở biển, sông', say: 'Nắng chiếu xuống biển, sông, hồ.' },
      { emoji: '♨️', title: 'Bay hơi', say: 'Nước nóng lên, bay hơi thành hơi nước bay lên cao.' },
      { emoji: '☁️', title: 'Ngưng tụ', say: 'Lên cao gặp lạnh, hơi nước ngưng tụ thành những giọt nước nhỏ, tạo thành mây.' },
      { emoji: '🌧️', title: 'Mưa', say: 'Giọt nước to và nặng dần, rơi xuống thành mưa.' },
      { emoji: '🏞️', title: 'Chảy về sông biển', say: 'Nước mưa chảy về sông, ra biển, rồi lại bay hơi. Vòng tuần hoàn lặp lại mãi.' },
    ],
    'Em giỏi lắm! Nước không mất đi, chỉ đổi từ thể này sang thể khác.',
    { cycle: true },
  ),
  essence: { bigIdea: 'Nước tuần hoàn mãi, chỉ đổi thể.', points: ['Ba thể: rắn (đá), lỏng (nước), khí (hơi nước).', 'Bay hơi: lỏng → khí (cần nóng).', 'Ngưng tụ: khí → lỏng (gặp lạnh).', 'Nước không có màu, mùi, vị; chảy từ cao xuống thấp.'] },
  practice: bank([
    { lv: 1, q: 'Nước đá là nước ở thể gì?', a: 'thể rắn', wrong: [['thể lỏng', 'Nước uống là thể lỏng.'], ['thể khí', 'Hơi nước là thể khí.']], ex: 'Nước đá: thể rắn.' },
    { lv: 1, q: 'Mây được tạo thành từ gì?', a: 'những giọt nước rất nhỏ', wrong: [['bông gòn', 'Mây không phải bông.'], ['khói', 'Mây là nước.']], ex: 'Hơi nước ngưng tụ thành giọt nhỏ tạo mây.' },
    { lv: 2, q: 'Phơi quần áo ướt ngoài nắng, nước đi đâu?', a: 'bay hơi vào không khí', wrong: [['biến mất hoàn toàn', 'Nước không mất đi, chỉ thành hơi.'], ['thấm vào áo', 'Áo khô vì nước đã bay hơi.']], ex: 'Nước bay hơi nhờ nắng và gió.' },
    { lv: 2, q: 'Vì sao nắp nồi canh có những giọt nước?', a: 'hơi nước gặp nắp lạnh hơn nên ngưng tụ', wrong: [['nước từ ngoài thấm vào', 'Không phải từ ngoài.'], ['nắp nồi tự sinh ra nước', 'Nước từ hơi canh ngưng tụ lại.']], ex: 'Ngưng tụ: khí → lỏng khi gặp lạnh.' },
    { lv: 3, q: 'Vì sao nói "nước trên Trái Đất không mất đi"?', a: 'vì nước luôn chuyển thể và tuần hoàn', wrong: [['vì nước không bao giờ bay hơi', 'Nước vẫn bay hơi, nhưng lại thành mưa.'], ['vì ai cũng tiết kiệm nước', 'Đó là việc nên làm, nhưng không phải lý do.']], ex: 'Bay hơi → mây → mưa → sông biển → bay hơi…' },
  ]),
  teachBack: tb('Vì sao trời mưa?', ['🦉 Cú', 'Vì hơi nước bay lên cao gặp lạnh, ngưng tụ thành giọt nước tạo mây; giọt to nặng dần thì rơi xuống thành mưa.', 'Đầy đủ!'], [['🐻 Gấu', 'Vì mây buồn nên khóc.', 'Đó là cách nói vui, lý do thật là ngưng tụ.'], ['🐸 Ếch', 'Vì ông trời tưới cây.', 'Mưa là một phần của vòng tuần hoàn nước.']]),
  remember: ['Bay hơi → ngưng tụ → mưa', 'Ba thể: rắn, lỏng, khí', 'Nước không mất đi'],
  games: ['bongbay', 'cauca'],
})

const khKhongKhi = defineLesson({
  ...K(4),
  id: 'kh4-khong-khi',
  title: 'Không khí',
  emoji: '🌬️',
  essenceLine: 'Không khí có ở khắp nơi, gồm chủ yếu khí ni-tơ và ô-xi; ô-xi cần cho sự thở và sự cháy.',
  standards: [g('Khoa học 4 · Chất · Không khí: thành phần, vai trò, bảo vệ'), ng('5-PS1-1')],
  hook: 'Úp cốc rỗng xuống chậu nước, nước không tràn vào đầy cốc. Có gì ở trong cốc "rỗng" vậy?',
  hookVisual: '🥛🌊',
  explore: cardsExplore(
    'Em chạm vào từng thí nghiệm nhé!',
    [
      { key: 'coc', name: 'Úp cốc vào nước', emoji: '🥛', say: 'Nước không tràn đầy cốc vì trong cốc có không khí chiếm chỗ.' },
      { key: 'bong', name: 'Thổi bóng bay', emoji: '🎈', say: 'Thổi không khí vào, quả bóng phồng lên: không khí có thể bị nén và chiếm chỗ.' },
      { key: 'nen', name: 'Úp cốc lên nến', emoji: '🕯️', say: 'Úp cốc lên nến đang cháy, một lúc sau nến tắt vì hết ô-xi. Ô-xi duy trì sự cháy.' },
      { key: 'cay', name: 'Cây xanh', emoji: '🌳', say: 'Cây xanh hấp thụ khí các-bô-níc và thải ra ô-xi, làm không khí trong lành.' },
    ],
    'Em giỏi lắm! Không khí ở khắp nơi và rất cần cho sự sống.',
    { big: false },
  ),
  essence: { bigIdea: 'Không khí vô hình nhưng có thật và rất cần thiết.', points: ['Không khí không màu, không mùi, không vị.', 'Chiếm chỗ, có thể bị nén, có thể giãn ra.', 'Ô-xi cần cho sự thở và sự cháy.', 'Trồng cây, không đốt rác để giữ không khí sạch.'] },
  practice: bank([
    { lv: 1, q: 'Không khí có màu gì?', a: 'không màu', wrong: [['màu xanh', 'Bầu trời xanh do ánh sáng, không khí thì không màu.'], ['màu trắng', 'Không khí trong suốt.']], ex: 'Không khí không màu, không mùi, không vị.' },
    { lv: 2, q: 'Úp cốc lên ngọn nến, vì sao nến tắt?', a: 'vì hết ô-xi duy trì sự cháy', wrong: [['vì cốc làm nến lạnh', 'Không phải vì lạnh.'], ['vì nến hết sáp', 'Nến vẫn còn sáp.']], ex: 'Ô-xi cần cho sự cháy.' },
    { lv: 3, q: 'Việc nào giúp không khí trong lành?', a: 'trồng nhiều cây xanh', wrong: [['đốt rác', 'Đốt rác tạo khói bụi độc hại.'], ['xả khói xe nhiều', 'Khói xe làm ô nhiễm không khí.']], ex: 'Cây xanh tạo ô-xi, lọc bụi.' },
  ]),
  teachBack: tb('Làm sao biết "cốc rỗng" thật ra có không khí?', ['🐬 Cá heo', 'Úp cốc xuống nước, nước không tràn đầy cốc vì không khí đang chiếm chỗ bên trong.', 'Rất khoa học!'], [['🐻 Gấu', 'Vì nhìn thấy không khí.', 'Không khí trong suốt, không nhìn thấy.'], ['🐸 Ếch', 'Cốc rỗng thì không có gì.', 'Thí nghiệm cho thấy có không khí.']]),
  remember: ['Không màu, mùi, vị', 'Chiếm chỗ, nén được', 'Ô-xi: thở và cháy'],
  games: ['bongbay'],
})

const khAmThanhAnhSang = defineLesson({
  ...K(4),
  id: 'kh4-am-thanh-anh-sang',
  title: 'Âm thanh và ánh sáng',
  emoji: '🔊',
  essenceLine: 'Âm thanh do vật rung động sinh ra; ta nhìn thấy vật khi có ánh sáng từ vật truyền vào mắt.',
  standards: [g('Khoa học 4 · Năng lượng · Âm thanh, ánh sáng'), ng('1-PS4-1'), ng('4-PS4-2')],
  prereqs: ['xh1-giac-quan'],
  hook: 'Đặt tay lên cổ khi nói, em thấy gì? Và vì sao trong phòng tối om em không thấy gì cả?',
  hookVisual: '🗣️💡',
  explore: cardsExplore(
    'Em chạm vào từng thẻ nhé!',
    [
      { key: 'rung', name: 'Vật rung động', emoji: '🥁', say: 'Gõ trống, mặt trống rung lên tạo ra âm thanh. Đặt tay lên cổ khi nói, em thấy cổ rung.' },
      { key: 'truyen', name: 'Âm thanh truyền đi', emoji: '📢', say: 'Âm thanh truyền qua không khí, nước và chất rắn đến tai em.' },
      { key: 'thay', name: 'Nhìn thấy vật', emoji: '👁️', say: 'Ánh sáng chiếu vào vật rồi hắt vào mắt, nhờ đó em nhìn thấy vật.' },
      { key: 'bong', name: 'Bóng tối', emoji: '🌑', say: 'Vật cản ánh sáng tạo ra bóng tối phía sau vật.' },
    ],
    'Em giỏi lắm! Rung động tạo âm thanh, ánh sáng vào mắt giúp ta nhìn thấy.',
    { big: false },
  ),
  essence: { bigIdea: 'Âm thanh = rung động; nhìn thấy = ánh sáng vào mắt.', points: ['Âm thanh truyền qua chất rắn, lỏng, khí — không truyền qua chân không.', 'Ánh sáng truyền thẳng; vật cản sáng tạo bóng.', 'Bảo vệ tai: tránh tiếng ồn; bảo vệ mắt: không nhìn thẳng Mặt Trời.'] },
  practice: bank([
    { lv: 1, q: 'Âm thanh do đâu mà có?', a: 'do vật rung động', wrong: [['do vật đứng yên', 'Vật đứng yên không phát ra âm thanh.'], ['do ánh sáng', 'Ánh sáng không tạo âm thanh.']], ex: 'Mọi âm thanh đều do rung động.' },
    { lv: 2, q: 'Vì sao trong phòng tối hoàn toàn em không thấy đồ vật?', a: 'vì không có ánh sáng từ vật truyền vào mắt', wrong: [['vì mắt nhắm lại', 'Mắt vẫn mở nhưng thiếu ánh sáng.'], ['vì đồ vật biến mất', 'Đồ vật vẫn ở đó.']], ex: 'Có ánh sáng từ vật đến mắt mới nhìn thấy.' },
    { lv: 3, q: 'Vì sao thấy tia chớp trước khi nghe tiếng sấm?', a: 'vì ánh sáng truyền nhanh hơn âm thanh rất nhiều', wrong: [['vì sấm xảy ra sau chớp', 'Hai thứ xảy ra cùng lúc.'], ['vì tai kém hơn mắt', 'Không phải do tai.']], ex: 'Ánh sáng nhanh hơn âm thanh.' },
  ]),
  teachBack: tb('Vì sao ta thấy chớp trước khi nghe sấm?', ['🦉 Cú', 'Chớp và sấm xảy ra cùng lúc, nhưng ánh sáng đi nhanh hơn âm thanh rất nhiều nên đến mắt trước.', 'Xuất sắc!'], [['🐻 Gấu', 'Vì sấm đến sau chớp.', 'Chúng xảy ra cùng lúc.'], ['🐸 Ếch', 'Vì mắt nhanh hơn tai.', 'Do tốc độ truyền, không do giác quan.']]),
  remember: ['Âm thanh: rung động', 'Nhìn thấy: ánh sáng vào mắt', 'Ánh sáng nhanh hơn âm thanh'],
  games: ['bongbay'],
})

const khThucVat = defineLesson({
  ...K(4),
  id: 'kh4-thuc-vat',
  title: 'Thực vật cần gì để sống',
  emoji: '🌱',
  essenceLine: 'Cây cần ánh sáng, nước, không khí và chất khoáng; lá dùng ánh sáng để tự làm thức ăn.',
  standards: [g('Khoa học 4 · Thực vật và động vật · Nhu cầu sống của thực vật'), ng('5-LS1-1')],
  prereqs: ['xh1-cay'],
  hook: 'Cô trồng ba chậu đậu: một chậu để trong tủ tối, một chậu không tưới, một chậu để ngoài nắng có tưới. Chậu nào lớn tốt?',
  hookVisual: '🌱🌱🌱',
  explore: stepsExplore(
    'Em bấm để xem cây làm thức ăn thế nào nhé!',
    [
      { emoji: '☀️', title: 'Ánh sáng', say: 'Lá hứng ánh sáng Mặt Trời.' },
      { emoji: '💧', title: 'Nước và chất khoáng', say: 'Rễ hút nước và chất khoáng từ đất, đưa lên lá.' },
      { emoji: '🌬️', title: 'Khí các-bô-níc', say: 'Lá lấy khí các-bô-níc từ không khí.' },
      { emoji: '🍃', title: 'Lá làm thức ăn', say: 'Nhờ ánh sáng, lá biến nước và khí các-bô-níc thành chất bột đường nuôi cây, và thải ra khí ô-xi.' },
    ],
    'Em giỏi lắm! Thiếu một trong các thứ đó, cây sẽ yếu và chết.',
  ),
  essence: { bigIdea: 'Cây tự làm thức ăn nhờ ánh sáng.', points: ['Thiếu ánh sáng: cây vàng úa, yếu.', 'Thiếu nước: cây héo.', 'Cây thải ra ô-xi giúp người và động vật thở.'] },
  practice: bank([
    { lv: 1, q: 'Chậu cây để trong tủ tối lâu ngày sẽ thế nào?', a: 'vàng úa, yếu ớt', wrong: [['xanh tốt hơn', 'Thiếu ánh sáng cây không làm được thức ăn.'], ['ra nhiều hoa', 'Cây yếu khó ra hoa.']], ex: 'Cây cần ánh sáng để làm thức ăn.' },
    { lv: 2, q: 'Lá cây làm thức ăn cần những gì?', a: 'ánh sáng, nước, khí các-bô-níc', wrong: [['chỉ cần nước', 'Còn cần ánh sáng và khí các-bô-níc.'], ['đất và đá', 'Lá không ăn đất đá.']], ex: 'Ánh sáng + nước + khí các-bô-níc → thức ăn.' },
    { lv: 3, q: 'Vì sao nói cây xanh là "lá phổi" của Trái Đất?', a: 'vì cây thải ra khí ô-xi', wrong: [['vì cây có phổi', 'Cây không có phổi.'], ['vì cây hút ô-xi', 'Khi làm thức ăn, cây thải ra ô-xi.']], ex: 'Cây tạo ô-xi cho sự sống.' },
  ]),
  teachBack: tb('Vì sao cây không cần "ăn" như con vật?', ['🐼 Gấu trúc', 'Vì lá cây tự làm thức ăn từ ánh sáng, nước và khí các-bô-níc.', 'Đúng bản chất!'], [['🐻 Gấu', 'Vì cây ăn đất.', 'Cây hút nước và chất khoáng, nhưng thức ăn chính do lá làm.'], ['🐸 Ếch', 'Vì cây không cần thức ăn.', 'Cây cần, nhưng tự làm được.']]),
  remember: ['Ánh sáng · nước · không khí · chất khoáng', 'Lá tự làm thức ăn', 'Cây thải ô-xi'],
  games: ['bongbay'],
})

const khChuoiThucAn = defineLesson({
  ...K(4),
  id: 'kh4-chuoi-thuc-an',
  title: 'Chuỗi thức ăn',
  emoji: '🦅',
  essenceLine: 'Năng lượng đi từ cây xanh → con ăn cây → con ăn thịt; mất một mắt xích, cả chuỗi bị ảnh hưởng.',
  standards: [g('Khoa học 4 · Thực vật và động vật · Chuỗi thức ăn'), ng('5-LS2-1')],
  prereqs: ['kh4-thuc-vat'],
  hook: 'Nếu không còn cỏ, con đại bàng có bị đói không? Đại bàng đâu có ăn cỏ!',
  hookVisual: '🌾🐛🐦🦅',
  explore: stepsExplore(
    'Em bấm để đi theo chuỗi thức ăn nhé!',
    [
      { emoji: '🌾', title: 'Cỏ', say: 'Cỏ tự làm thức ăn nhờ ánh sáng Mặt Trời. Cỏ là mắt xích đầu tiên.' },
      { emoji: '🦗', title: 'Châu chấu', say: 'Châu chấu ăn cỏ.' },
      { emoji: '🐸', title: 'Ếch', say: 'Ếch ăn châu chấu.' },
      { emoji: '🐍', title: 'Rắn', say: 'Rắn ăn ếch.' },
      { emoji: '🦅', title: 'Đại bàng', say: 'Đại bàng ăn rắn. Nếu không còn cỏ, châu chấu chết, rồi ếch, rắn, đại bàng cũng đói!' },
    ],
    'Em giỏi lắm! Mọi chuỗi thức ăn đều bắt đầu từ cây xanh.',
  ),
  essence: { bigIdea: 'Mọi chuỗi bắt đầu từ cây xanh.', points: ['Mũi tên chỉ "bị ăn bởi": cỏ → châu chấu.', 'Mất một mắt xích làm cả chuỗi bị ảnh hưởng.', 'Bảo vệ mọi loài là giữ cân bằng tự nhiên.'] },
  practice: bank([
    { lv: 1, q: 'Chuỗi thức ăn thường bắt đầu từ đâu?', a: 'cây xanh', wrong: [['con hổ', 'Hổ ở cuối chuỗi.'], ['con người', 'Chuỗi bắt đầu từ cây xanh.']], ex: 'Cây xanh tự làm thức ăn.' },
    { lv: 2, q: 'Trong chuỗi: cỏ → thỏ → cáo, con gì ăn thỏ?', a: 'cáo', wrong: [['cỏ', 'Cỏ bị thỏ ăn.'], ['thỏ', 'Thỏ ăn cỏ.']], ex: 'Cáo ăn thỏ.' },
    { lv: 3, q: 'Nếu ếch bị bắt hết, điều gì xảy ra?', a: 'châu chấu tăng nhiều, rắn bị đói', wrong: [['không có gì thay đổi', 'Mất một mắt xích ảnh hưởng cả chuỗi.'], ['cỏ mọc nhiều hơn', 'Châu chấu tăng sẽ ăn nhiều cỏ hơn.']], ex: 'Mất ếch: châu chấu không bị ăn nên tăng; rắn thiếu thức ăn.' },
  ]),
  teachBack: tb('Vì sao không còn cỏ thì đại bàng cũng đói?', ['🦉 Cú', 'Vì không có cỏ thì châu chấu chết, ếch không có gì ăn, rắn và đại bàng cũng thiếu thức ăn.', 'Hiểu cả chuỗi!'], [['🐻 Gấu', 'Vì đại bàng ăn cỏ.', 'Đại bàng không ăn cỏ, nhưng phụ thuộc gián tiếp.'], ['🐸 Ếch', 'Đại bàng không bị ảnh hưởng.', 'Các mắt xích nối với nhau.']]),
  remember: ['Bắt đầu từ cây xanh', 'Mũi tên: bị ăn bởi', 'Mất 1 mắt xích → cả chuỗi'],
  games: ['bongbay', 'latthe'],
  pairs: [['🌾', '🦗'], ['🦗', '🐸'], ['🐸', '🐍'], ['🐍', '🦅']],
})

const khDinhDuong = defineLesson({
  ...K(4),
  id: 'kh4-dinh-duong',
  title: 'Các nhóm chất dinh dưỡng',
  emoji: '🥗',
  essenceLine: 'Ăn đủ 4 nhóm chất: bột đường, đạm, béo, vi-ta-min và chất khoáng — mỗi nhóm một vai trò.',
  standards: [g('Khoa học 4 · Con người và sức khoẻ · Dinh dưỡng'), ng('5-PS3-1')],
  prereqs: ['mam.qua-rau'],
  hook: 'Chỉ ăn cơm trắng cả tháng thì có khỏe không? Cơ thể cần nhiều loại "nhiên liệu" khác nhau đấy!',
  hookVisual: '🍚🥩🥑🥦',
  explore: sortExplore(
    'Em xếp mỗi món ăn vào nhóm chất chính của nó nhé!',
    [
      { name: 'Bột đường', emoji: '🍚' },
      { name: 'Chất đạm', emoji: '🥩' },
      { name: 'Vi-ta-min', emoji: '🥦' },
    ],
    [
      { emoji: '🍚', name: 'cơm', bin: 0, why: 'Đúng! Cơm giàu chất bột đường, cho năng lượng.' },
      { emoji: '🍞', name: 'bánh mì', bin: 0, why: 'Đúng! Bánh mì giàu bột đường.' },
      { emoji: '🥚', name: 'trứng', bin: 1, why: 'Đúng! Trứng giàu chất đạm, giúp cơ thể lớn.' },
      { emoji: '🐟', name: 'cá', bin: 1, why: 'Đúng! Cá giàu chất đạm.' },
      { emoji: '🥕', name: 'cà rốt', bin: 2, why: 'Đúng! Cà rốt giàu vi-ta-min.' },
      { emoji: '🍊', name: 'cam', bin: 2, why: 'Đúng! Cam giàu vi-ta-min C.' },
    ],
    'Em giỏi lắm! Ăn đa dạng để có đủ các nhóm chất.',
  ),
  essence: { bigIdea: 'Ăn đa dạng, cân đối.', points: ['Bột đường: cho năng lượng (cơm, bánh mì).', 'Đạm: xây dựng cơ thể (thịt, cá, trứng, đậu).', 'Béo: dự trữ năng lượng (dầu, mỡ, lạc).', 'Vi-ta-min, khoáng: giúp cơ thể khỏe (rau, quả).'] },
  practice: bank([
    { lv: 1, q: 'Thức ăn nào giàu chất đạm?', a: 'thịt bò', wrong: [['bánh mì', 'Bánh mì giàu bột đường.'], ['dưa hấu', 'Dưa hấu giàu nước, vi-ta-min.']], ex: 'Thịt, cá, trứng, đậu giàu đạm.' },
    { lv: 2, q: 'Chất bột đường có vai trò gì?', a: 'cung cấp năng lượng', wrong: [['làm xương chắc', 'Đó là vai trò của canxi.'], ['chữa bệnh', 'Thức ăn không phải thuốc.']], ex: 'Bột đường cho năng lượng hoạt động.' },
    { lv: 3, q: 'Vì sao nên ăn nhiều loại thức ăn khác nhau?', a: 'vì mỗi loại cung cấp những chất khác nhau', wrong: [['vì cho đỡ chán', 'Lý do chính là đủ chất.'], ['vì món nào cũng giống nhau', 'Mỗi món có chất riêng.']], ex: 'Không món nào có đủ mọi chất.' },
  ]),
  teachBack: tb('Vì sao chỉ ăn cơm thì không đủ chất?', ['🐬 Cá heo', 'Vì cơm chủ yếu là bột đường; cơ thể còn cần đạm, béo, vi-ta-min và khoáng từ thức ăn khác.', 'Đúng!'], [['🐻 Gấu', 'Vì cơm không ngon.', 'Không phải vì ngon hay dở.'], ['🐸 Ếch', 'Cơm có đủ mọi chất.', 'Cơm thiếu đạm, vi-ta-min…']]),
  remember: ['Bột đường: năng lượng', 'Đạm: lớn lên', 'Vi-ta-min: khỏe mạnh', 'Ăn đa dạng'],
  games: ['bongbay', 'latthe'],
  pairs: [['🍚', 'bột đường'], ['🥚', 'đạm'], ['🥑', 'chất béo'], ['🥦', 'vi-ta-min']],
})

const khVongDoi = defineLesson({
  ...K(5),
  id: 'kh5-vong-doi',
  title: 'Sự sinh sản và vòng đời',
  emoji: '🦋',
  essenceLine: 'Sinh vật sinh ra, lớn lên, sinh sản rồi chết; vòng đời lặp lại qua các thế hệ.',
  standards: [g('Khoa học 5 · Sự sinh sản và phát triển của sinh vật'), ng('3-LS1-1')],
  prereqs: ['kh4-thuc-vat'],
  hook: 'Con sâu bé xíu làm sao biến thành con bướm xinh đẹp được nhỉ?',
  hookVisual: '🐛➡️🦋',
  explore: stepsExplore(
    'Em bấm để xem vòng đời của con bướm nhé!',
    [
      { emoji: '🥚', title: 'Trứng', say: 'Bướm mẹ đẻ trứng trên lá cây.' },
      { emoji: '🐛', title: 'Sâu', say: 'Trứng nở thành sâu. Sâu ăn lá rất nhiều để lớn nhanh.' },
      { emoji: '🫘', title: 'Nhộng', say: 'Sâu lớn kéo kén, thành nhộng nằm im bên trong.' },
      { emoji: '🦋', title: 'Bướm', say: 'Nhộng biến thành bướm, bay ra ngoài. Bướm lại đẻ trứng, vòng đời lặp lại.' },
    ],
    'Em giỏi lắm! Trứng, sâu, nhộng, bướm — rồi lại trứng.',
    { cycle: true },
  ),
  essence: { bigIdea: 'Vòng đời lặp lại qua các thế hệ.', points: ['Bướm: trứng → sâu → nhộng → bướm.', 'Ếch: trứng → nòng nọc → ếch con → ếch.', 'Cây: hạt → cây con → cây trưởng thành → hoa → quả → hạt.'] },
  practice: bank([
    { lv: 1, q: 'Sâu biến thành gì trước khi thành bướm?', a: 'nhộng', wrong: [['trứng', 'Trứng có trước sâu.'], ['nòng nọc', 'Nòng nọc là con của ếch.']], ex: 'Sâu → nhộng → bướm.' },
    { lv: 2, q: 'Nòng nọc là giai đoạn nào trong vòng đời của ếch?', a: 'giai đoạn sau khi trứng nở', wrong: [['giai đoạn trưởng thành', 'Ếch trưởng thành có chân, không có đuôi.'], ['giai đoạn trứng', 'Nòng nọc nở ra từ trứng.']], ex: 'Trứng → nòng nọc → ếch con → ếch.' },
    { lv: 3, q: 'Vì sao giai đoạn sâu, bướm có thể phá hại cây trồng?', a: 'vì sâu ăn rất nhiều lá để lớn', wrong: [['vì bướm ăn lá', 'Bướm hút mật hoa.'], ['vì nhộng ăn lá', 'Nhộng nằm im trong kén.']], ex: 'Sâu ăn lá rất nhiều.' },
  ]),
  teachBack: tb('Vì sao gọi là "vòng" đời?', ['🦉 Cú', 'Vì sau khi trưởng thành, sinh vật sinh sản ra thế hệ mới và các giai đoạn lặp lại như một vòng tròn.', 'Hiểu sâu!'], [['🐻 Gấu', 'Vì con vật đi vòng tròn.', 'Không phải di chuyển vòng tròn.'], ['🐸 Ếch', 'Vì sống lâu.', 'Gọi là vòng vì lặp lại.']]),
  remember: ['Bướm: trứng → sâu → nhộng → bướm', 'Ếch: trứng → nòng nọc → ếch', 'Vòng lặp qua thế hệ'],
  games: ['bongbay', 'latthe'],
  pairs: [['🥚', 'trứng'], ['🐛', 'sâu'], ['🫘', 'nhộng'], ['🦋', 'bướm']],
})

const khNangLuong = defineLesson({
  ...K(5),
  id: 'kh5-nang-luong',
  title: 'Năng lượng và sử dụng tiết kiệm',
  emoji: '⚡',
  essenceLine: 'Mọi hoạt động cần năng lượng; năng lượng Mặt Trời, gió, nước chảy là nguồn sạch, tái tạo được.',
  standards: [g('Khoa học 5 · Năng lượng · Năng lượng và sử dụng năng lượng'), ng('4-ESS3-1')],
  prereqs: ['kh4-thuc-vat'],
  hook: 'Đèn sáng, xe chạy, em chạy nhảy — tất cả đều cần một thứ giống nhau. Đó là gì?',
  hookVisual: '☀️🌬️💧',
  explore: cardsExplore(
    'Em chạm vào từng nguồn năng lượng nhé!',
    [
      { key: 'mt', name: 'Mặt Trời', emoji: '☀️', say: 'Năng lượng Mặt Trời: pin mặt trời biến ánh nắng thành điện. Sạch và không bao giờ hết.' },
      { key: 'gio', name: 'Gió', emoji: '🌬️', say: 'Năng lượng gió: cối xay gió quay tạo ra điện.' },
      { key: 'nuoc', name: 'Nước chảy', emoji: '💧', say: 'Năng lượng nước: nhà máy thủy điện dùng sức nước chảy.' },
      { key: 'than', name: 'Than, dầu', emoji: '🛢️', say: 'Than đá, dầu mỏ: dùng mãi sẽ hết và gây ô nhiễm khi đốt.' },
    ],
    'Em giỏi lắm! Nên dùng năng lượng sạch và tiết kiệm điện.',
    { big: false },
  ),
  essence: { bigIdea: 'Năng lượng sạch, tái tạo và tiết kiệm.', points: ['Tái tạo: Mặt Trời, gió, nước chảy.', 'Không tái tạo: than, dầu, khí đốt — sẽ cạn kiệt, gây ô nhiễm.', 'Tiết kiệm: tắt đèn khi ra khỏi phòng.'] },
  practice: bank([
    { lv: 1, q: 'Nguồn năng lượng nào sạch và không bao giờ hết?', a: 'năng lượng Mặt Trời', wrong: [['than đá', 'Than sẽ hết và gây ô nhiễm.'], ['dầu mỏ', 'Dầu sẽ hết.']], ex: 'Mặt Trời là nguồn tái tạo.' },
    { lv: 2, q: 'Việc nào giúp tiết kiệm điện?', a: 'tắt đèn khi ra khỏi phòng', wrong: [['mở tủ lạnh thật lâu', 'Tốn điện.'], ['bật quạt khi không có ai', 'Lãng phí.']], ex: 'Tắt thiết bị khi không dùng.' },
    { lv: 3, q: 'Vì sao nên hạn chế đốt than, dầu?', a: 'vì chúng sẽ cạn kiệt và gây ô nhiễm không khí', wrong: [['vì chúng không cháy được', 'Chúng cháy được, nhưng gây hại.'], ['vì chúng quá rẻ', 'Lý do là cạn kiệt và ô nhiễm.']], ex: 'Đốt nhiên liệu hóa thạch thải khói độc.' },
  ]),
  teachBack: tb('Vì sao năng lượng gió được gọi là "tái tạo"?', ['🐬 Cá heo', 'Vì gió luôn có trong tự nhiên, dùng không bao giờ hết.', 'Chuẩn!'], [['🐻 Gấu', 'Vì cối xay gió tái chế được.', 'Tái tạo nói về nguồn năng lượng, không phải cái máy.'], ['🐸 Ếch', 'Vì gió mạnh.', 'Vì gió không cạn kiệt.']]),
  remember: ['Tái tạo: Mặt Trời, gió, nước', 'Than, dầu: sẽ hết', 'Tiết kiệm điện'],
  games: ['bongbay'],
})

const khDien = defineLesson({
  ...K(5),
  id: 'kh5-dien',
  title: 'Mạch điện đơn giản và an toàn điện',
  emoji: '🔌',
  essenceLine: 'Dòng điện chỉ chạy khi mạch kín; vật dẫn điện cho dòng điện đi qua, vật cách điện thì không.',
  standards: [g('Khoa học 5 · Năng lượng · Mạch điện đơn giản; vật dẫn điện, cách điện; an toàn điện'), ng('4-PS3-2')],
  prereqs: ['kh5-nang-luong'],
  hook: 'Pin, dây điện, bóng đèn: nối thế nào thì đèn mới sáng? Và vì sao dây điện lại bọc nhựa?',
  hookVisual: '🔋💡',
  explore: sortExplore(
    'Em xếp mỗi vật vào nhóm dẫn điện hoặc cách điện nhé!',
    [
      { name: 'Dẫn điện', emoji: '⚡' },
      { name: 'Cách điện', emoji: '🛡️' },
    ],
    [
      { emoji: '🔩', name: 'đinh sắt', bin: 0, why: 'Đúng! Kim loại như sắt dẫn điện.' },
      { emoji: '🪙', name: 'đồng xu', bin: 0, why: 'Đúng! Kim loại dẫn điện.' },
      { emoji: '🧵', name: 'dây đồng', bin: 0, why: 'Đúng! Đồng dẫn điện rất tốt, nên làm lõi dây điện.' },
      { emoji: '🧴', name: 'vỏ nhựa', bin: 1, why: 'Đúng! Nhựa cách điện, nên bọc ngoài dây điện.' },
      { emoji: '🪵', name: 'thước gỗ khô', bin: 1, why: 'Đúng! Gỗ khô cách điện.' },
      { emoji: '🧤', name: 'găng tay cao su', bin: 1, why: 'Đúng! Cao su cách điện.' },
    ],
    'Em giỏi lắm! Lõi dây bằng đồng để dẫn điện, vỏ bằng nhựa để an toàn.',
  ),
  essence: { bigIdea: 'Mạch kín thì đèn sáng; cách điện để an toàn.', points: ['Mạch điện kín: pin → dây → bóng đèn → dây → pin.', 'Kim loại dẫn điện; nhựa, cao su, gỗ khô cách điện.', 'Không chạm tay ướt vào ổ điện; không chơi gần dây điện.'] },
  practice: bank([
    { lv: 1, q: 'Vật nào dẫn điện?', a: 'chiếc thìa inox', wrong: [['chiếc cốc nhựa', 'Nhựa cách điện.'], ['tờ giấy', 'Giấy khô cách điện.']], ex: 'Kim loại dẫn điện.' },
    { lv: 2, q: 'Vì sao dây điện có lõi bằng đồng, vỏ bằng nhựa?', a: 'lõi đồng dẫn điện, vỏ nhựa cách điện để an toàn', wrong: [['để dây điện đẹp hơn', 'Mục đích là dẫn điện và an toàn.'], ['vì đồng rẻ hơn nhựa', 'Không phải vì giá.']], ex: 'Đồng dẫn, nhựa cách.' },
    { lv: 3, q: 'Mạch điện bị hở một chỗ thì bóng đèn thế nào?', a: 'không sáng', wrong: [['sáng hơn', 'Dòng điện không chạy qua được.'], ['sáng nhấp nháy', 'Mạch hở thì không có dòng điện.']], ex: 'Phải là mạch kín đèn mới sáng.' },
    { lv: 3, q: 'Thấy dây điện đứt rơi xuống đường, em làm gì?', a: 'tránh xa và báo người lớn', wrong: [['nhặt lên cất đi', 'Rất nguy hiểm, có thể bị điện giật.'], ['dùng que sắt khều ra', 'Sắt dẫn điện, rất nguy hiểm.']], ex: 'Tránh xa, báo người lớn.' },
  ]),
  teachBack: tb('Vì sao không được cầm que sắt khều dây điện?', ['🦉 Cú', 'Vì sắt dẫn điện, dòng điện sẽ truyền qua que vào người gây giật.', 'Hiểu rõ an toàn!'], [['🐻 Gấu', 'Vì que sắt nặng.', 'Lý do là sắt dẫn điện.'], ['🐸 Ếch', 'Que sắt thì an toàn.', 'Rất nguy hiểm.']]),
  remember: ['Mạch kín → đèn sáng', 'Kim loại dẫn điện', 'Nhựa, cao su cách điện', 'Tránh xa dây điện đứt'],
  games: ['bongbay'],
})

export const KHOA_HOC: Defined[] = [xhGiaDinh, xhGiacQuan, xhCay, xhGiaoThong, xhMoiTruong, xhPhuongHuong, khNuoc, khKhongKhi, khAmThanhAnhSang, khThucVat, khChuoiThucAn, khDinhDuong, khVongDoi, khNangLuong, khDien]

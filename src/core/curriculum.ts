// Đồ thị tri thức: mỗi kỹ năng là một nút, nối với các kỹ năng nền (tiền đề) của nó.
// Học sinh chỉ mở được kỹ năng khi đã vững phần nền — gốc vững thì "học một lần là hiểu".

import type { StageId } from './stages'

export type SubjectId = 'toan' | 'khoahoc' | 'ngonngu' | 'tienganh' | 'nhanthuc'

export const SUBJECTS: Record<SubjectId, { name: string; icon: string; color: string }> = {
  nhanthuc: { name: 'Khám phá', icon: '🌈', color: '#ff7eb6' },
  toan: { name: 'Toán', icon: '🔢', color: '#4f8cff' },
  khoahoc: { name: 'Khoa học', icon: '🔬', color: '#22c55e' },
  ngonngu: { name: 'Tiếng Việt – Ngữ văn', icon: '📖', color: '#f59e0b' },
  tienganh: { name: 'Tiếng Anh', icon: '🌍', color: '#a855f7' },
}

export * from './standards'
import { cc, ce, g, mn, ng, type StandardRef } from './standards'
import { CONTENT_SKILLS } from '../content'

export interface Skill {
  id: string
  subject: SubjectId
  stage: StageId
  grade: string
  title: string
  /** Bản chất — một câu nói lên "cái gốc" của kiến thức. */
  essence: string
  standards: StandardRef[]
  prereqs: string[]
  /** Có bài học tương tác đầy đủ chưa. */
  lessonId?: string
  /** 0 = mầm non, 1–5 = lớp ở tiểu học (để xếp bài theo lớp). */
  gradeNum?: number
}

const LEGACY: Skill[] = [
  // Bài tương tác viết riêng (giữ nguyên mã để không mất tiến độ đã lưu).
  {
    id: 'choi.dem-10', subject: 'toan', stage: 'choi', grade: '4–6 tuổi',
    title: 'Đếm và số lượng đến 10',
    essence: 'Số cuối cùng ta đếm cho biết cả nhóm có bao nhiêu — xếp lại kiểu gì cũng không đổi.',
    standards: [mn('Phát triển nhận thức · Đếm trên đối tượng trong phạm vi 10'), cc('K.CC.B.4'), cc('K.CC.B.5')],
    prereqs: ['mam.mot-nhieu'], gradeNum: 0, lessonId: 'dem-10',
  },
  {
    id: 'th.cong-qua-10', subject: 'toan', stage: 'tieuhoc', grade: 'Lớp 2',
    title: 'Cộng qua 10 (có nhớ trong phạm vi 20)',
    essence: 'Lấp đầy 10 trước, rồi cộng phần còn lại — 10 là "cái bến" dễ tính nhất.',
    standards: [g('Toán 2 · Số và phép tính · Phép cộng có nhớ trong phạm vi 20'), cc('1.OA.C.6')],
    prereqs: ['choi.tach-gop', 'tieuhoc.t1-so-100'], gradeNum: 2, lessonId: 'cong-qua-10',
  },
  {
    id: 'th.phan-so', subject: 'toan', stage: 'tieuhoc', grade: 'Lớp 3–4',
    title: 'Phân số', essence: 'a/b: chia một cái thành b phần BẰNG NHAU, lấy a phần. Mẫu càng lớn, mỗi phần càng nhỏ.',
    standards: [g('Toán 3 · Làm quen với phân số'), g('Toán 4 · Phân số: so sánh, phân số bằng nhau'), cc('3.NF.A.1'), cc('3.NF.A.3')],
    prereqs: ['tieuhoc.t2-chia'], gradeNum: 3, lessonId: 'phan-so',
  },
  {
    id: 'th.ngay-dem', subject: 'khoahoc', stage: 'tieuhoc', grade: 'Lớp 3',
    title: 'Vì sao có ngày và đêm?',
    essence: 'Trái Đất tự quay; nửa hướng về Mặt Trời là ngày, nửa quay đi là đêm.',
    standards: [g('Tự nhiên và Xã hội 3 · Trái Đất và bầu trời'), ng('5-ESS1-2')],
    prereqs: [], gradeNum: 3, lessonId: 'ngay-dem',
  },
  {
    id: 'thcs.so-nguyen', subject: 'toan', stage: 'thcs', grade: 'Lớp 6',
    title: 'Số nguyên âm', essence: 'Số âm là khoảng cách về phía ngược lại của số 0 trên trục số.',
    standards: [g('Toán 6 · Số nguyên'), cc('6.NS.C.5')], prereqs: ['th.cong-qua-10'],
  },
  {
    id: 'thcs.bieu-thuc', subject: 'toan', stage: 'thcs', grade: 'Lớp 7',
    title: 'Biểu thức đại số', essence: 'Chữ thay cho một số chưa biết — viết một lần, dùng cho mọi giá trị.',
    standards: [g('Toán 7 · Biểu thức đại số'), cc('6.EE.A.2')], prereqs: ['tieuhoc.t2-nhan'],
  },
  {
    id: 'thcs.ti-le', subject: 'toan', stage: 'thcs', grade: 'Lớp 7',
    title: 'Đại lượng tỉ lệ', essence: 'Tỉ lệ thuận: tăng gấp bao nhiêu lần thì cái kia cũng gấp bấy nhiêu lần.',
    standards: [g('Toán 7 · Tỉ lệ thức và đại lượng tỉ lệ'), cc('7.RP.A.2')], prereqs: ['th.phan-so'],
  },
  {
    id: 'thcs.pt-bac-nhat', subject: 'toan', stage: 'thcs', grade: 'Lớp 8',
    title: 'Phương trình bậc nhất một ẩn',
    essence: 'Phương trình là chiếc cân thăng bằng: làm gì với bên này thì phải làm y hệt với bên kia.',
    standards: [g('Toán 8 · Phương trình bậc nhất một ẩn'), cc('7.EE.B.4'), cc('8.EE.C.7')],
    prereqs: ['thcs.so-nguyen', 'thcs.bieu-thuc'], lessonId: 'pt-bac-nhat',
  },
  {
    id: 'thcs.pythagore', subject: 'toan', stage: 'thcs', grade: 'Lớp 8',
    title: 'Định lí Pythagore',
    essence: 'Trong tam giác vuông, diện tích hình vuông dựng trên cạnh huyền bằng tổng hai hình vuông dựng trên hai cạnh góc vuông.',
    standards: [g('Toán 8 · Định lí Pythagore'), cc('8.G.B.6'), cc('8.G.B.7')],
    prereqs: ['tieuhoc.t3-chu-vi-dien-tich'], lessonId: 'pythagore',
  },
  {
    id: 'thcs.ham-bac-nhat', subject: 'toan', stage: 'thcs', grade: 'Lớp 8',
    title: 'Hàm số bậc nhất y = ax + b', essence: 'Đều đặn: x tăng 1 thì y luôn tăng a — nên đồ thị là đường thẳng.',
    standards: [g('Toán 8 · Hàm số và đồ thị'), cc('8.F.B.4')], prereqs: ['thcs.pt-bac-nhat', 'thcs.ti-le'],
  },
  {
    id: 'thcs.he-pt', subject: 'toan', stage: 'thcs', grade: 'Lớp 9',
    title: 'Hệ hai phương trình bậc nhất hai ẩn', essence: 'Nghiệm của hệ là giao điểm của hai đường thẳng.',
    standards: [g('Toán 9 · Hệ hai phương trình bậc nhất hai ẩn'), cc('8.EE.C.8')], prereqs: ['thcs.ham-bac-nhat'],
  },
  {
    id: 'thcs.y-ax2', subject: 'toan', stage: 'thcs', grade: 'Lớp 9',
    title: 'Hàm số y = ax²', essence: 'Bình phương làm mất dấu: x và −x cho cùng y — nên đồ thị đối xứng.',
    standards: [g('Toán 9 · Hàm số y = ax² (a ≠ 0)')], prereqs: ['thcs.ham-bac-nhat'],
  },
  {
    id: 'thcs.van-toc', subject: 'khoahoc', stage: 'thcs', grade: 'Lớp 7',
    title: 'Tốc độ chuyển động', essence: 'Tốc độ cho biết mỗi giây đi được bao xa: v = s / t.',
    standards: [g('KHTN 7 · Tốc độ')], prereqs: ['th.phan-so'],
  },
  {
    id: 'thcs.luc', subject: 'khoahoc', stage: 'thcs', grade: 'Lớp 6',
    title: 'Lực và biểu diễn lực', essence: 'Lực là lực đẩy hoặc kéo, có hướng và độ lớn — vẽ bằng mũi tên.',
    standards: [g('KHTN 6 · Lực'), ng('MS-PS2-2')], prereqs: [],
  },
  {
    id: 'thcs.te-bao', subject: 'khoahoc', stage: 'thcs', grade: 'Lớp 6',
    title: 'Tế bào — đơn vị của sự sống', essence: 'Mọi sinh vật đều được xây từ tế bào.',
    standards: [g('KHTN 6 · Tế bào'), ng('MS-LS1-1')], prereqs: ['tieuhoc.kh4-thuc-vat'],
  },
  {
    id: 'thcs.nguyen-tu', subject: 'khoahoc', stage: 'thcs', grade: 'Lớp 7',
    title: 'Nguyên tử', essence: 'Mọi chất được tạo từ nguyên tử; hạt nhân dương, electron âm bao quanh.',
    standards: [g('KHTN 7 · Nguyên tử'), ng('MS-PS1-1')], prereqs: [],
  },
  {
    id: 'thcs.quang-hop', subject: 'khoahoc', stage: 'thcs', grade: 'Lớp 7',
    title: 'Quang hợp', essence: 'Lá dùng năng lượng ánh sáng biến CO₂ và nước thành đường, thải ra O₂.',
    standards: [g('KHTN 7 · Trao đổi chất ở sinh vật'), ng('MS-LS1-6')], prereqs: ['thcs.te-bao', 'thcs.nguyen-tu'],
  },
  {
    id: 'thcs.nghi-luan', subject: 'ngonngu', stage: 'thcs', grade: 'Lớp 6–9',
    title: 'Văn nghị luận', essence: 'Thuyết phục bằng luận điểm – lí lẽ – bằng chứng, không bằng cảm xúc suông.',
    standards: [g('Ngữ văn 6–9 · Viết văn bản nghị luận'), cc('W.8.1')], prereqs: ['tieuhoc.tv-doc-hieu'],
  },
  {
    id: 'thcs.en-past', subject: 'tienganh', stage: 'thcs', grade: 'Lớp 6–9',
    title: 'Quá khứ đơn và hiện tại hoàn thành', essence: 'Quá khứ đơn: đã xong, có mốc. Hiện tại hoàn thành: còn liên quan đến bây giờ.',
    standards: [g('Tiếng Anh 6–9'), ce('A2')], prereqs: ['tieuhoc.en-hien-tai-don'],
  },
  {
    id: 'thpt.ham-bac-hai', subject: 'toan', stage: 'thpt', grade: 'Lớp 10',
    title: 'Hàm số bậc hai và đồ thị',
    essence: 'Mọi parabol y = ax² + bx + c chỉ là parabol y = ax² được dời đến đỉnh (−b/2a; −Δ/4a).',
    standards: [g('Toán 10 · Hàm số bậc hai và đồ thị'), cc('HSF-IF.C.7a'), cc('HSF-BF.B.3')],
    prereqs: ['thcs.y-ax2'], lessonId: 'ham-bac-hai',
  },
  {
    id: 'thpt.vecto', subject: 'toan', stage: 'thpt', grade: 'Lớp 10',
    title: 'Vectơ', essence: 'Vectơ là "mũi tên" có hướng và độ dài — cộng vectơ là đi nối tiếp.',
    standards: [g('Toán 10 · Vectơ'), cc('HSN-VM.A.1')], prereqs: ['thcs.pythagore'],
  },
  {
    id: 'thpt.newton', subject: 'khoahoc', stage: 'thpt', grade: 'Lớp 10',
    title: 'Ba định luật Newton', essence: 'Lực không giữ cho vật chuyển động — lực làm vận tốc thay đổi: F = ma.',
    standards: [g('Vật lí 10 · Động lực học'), ng('HS-PS2-1')], prereqs: ['thcs.luc', 'thcs.van-toc'],
  },
  {
    id: 'thpt.nem-xien', subject: 'khoahoc', stage: 'thpt', grade: 'Lớp 10',
    title: 'Chuyển động ném',
    essence: 'Ném xiên = hai chuyển động độc lập: ngang đều và đứng như ném lên — chạy cùng một đồng hồ.',
    standards: [g('Vật lí 10 · Chuyển động ném'), ng('HS-PS2-1')],
    prereqs: ['thpt.vecto', 'thpt.newton', 'thpt.ham-bac-hai'], lessonId: 'nem-xien',
  },
  {
    id: 'thpt.luong-giac', subject: 'toan', stage: 'thpt', grade: 'Lớp 11',
    title: 'Hàm số lượng giác', essence: 'sin, cos là toạ độ của một điểm quay trên đường tròn đơn vị.',
    standards: [g('Toán 11 · Hàm số lượng giác'), cc('HSF-TF.A.2')], prereqs: ['thpt.vecto'],
  },
  {
    id: 'thpt.dao-ham', subject: 'toan', stage: 'thpt', grade: 'Lớp 11',
    title: 'Đạo hàm', essence: 'Đạo hàm là tốc độ thay đổi tức thời — độ dốc của tiếp tuyến.',
    standards: [g('Toán 11 · Đạo hàm')], prereqs: ['thpt.ham-bac-hai'],
  },
  {
    id: 'thpt.tich-phan', subject: 'toan', stage: 'thpt', grade: 'Lớp 12',
    title: 'Nguyên hàm – tích phân', essence: 'Tích phân cộng dồn vô số mảnh nhỏ: diện tích là tổng các dải mỏng.',
    standards: [g('Toán 12 · Nguyên hàm và tích phân')], prereqs: ['thpt.dao-ham'],
  },
  {
    id: 'thpt.xac-suat', subject: 'toan', stage: 'thpt', grade: 'Lớp 12',
    title: 'Xác suất có điều kiện', essence: 'Biết thêm thông tin là thu hẹp "không gian" ta đang xét.',
    standards: [g('Toán 12 · Xác suất có điều kiện'), cc('HSS-CP.A.3')], prereqs: ['th.phan-so'],
  },
  {
    id: 'thpt.lien-ket', subject: 'khoahoc', stage: 'thpt', grade: 'Lớp 10',
    title: 'Liên kết hóa học', essence: 'Nguyên tử liên kết để đạt lớp vỏ bền — cho, nhận hoặc góp chung electron.',
    standards: [g('Hóa học 10 · Liên kết hóa học')], prereqs: ['thcs.nguyen-tu'],
  },
  {
    id: 'thpt.di-truyen', subject: 'khoahoc', stage: 'thpt', grade: 'Lớp 12',
    title: 'Cơ sở phân tử của di truyền', essence: 'ADN là bản mã; trình tự nucleotide quyết định protein, protein quyết định tính trạng.',
    standards: [g('Sinh học 12 · Di truyền phân tử'), ng('HS-LS3-1')], prereqs: ['thcs.te-bao'],
  },
  {
    id: 'thpt.nghi-luan-xh', subject: 'ngonngu', stage: 'thpt', grade: 'Lớp 10–12',
    title: 'Nghị luận xã hội', essence: 'Lập luận chặt: nêu vấn đề – giải thích – chứng minh – phản biện – bài học.',
    standards: [g('Ngữ văn 10–12 · Viết bài nghị luận'), cc('W.11-12.1')], prereqs: ['thcs.nghi-luan'],
  },
  {
    id: 'thpt.en-conditionals', subject: 'tienganh', stage: 'thpt', grade: 'Lớp 10–12',
    title: 'Câu điều kiện', essence: 'Lùi thì để lùi xa thực tế: càng "lùi", điều kiện càng khó xảy ra.',
    standards: [g('Tiếng Anh 10–12'), ce('B1')], prereqs: ['thcs.en-past'],
  },
]

/** Toàn bộ kỹ năng: bài viết riêng + bài soạn theo khuôn ở src/content. */
export const SKILLS: Skill[] = [...LEGACY, ...CONTENT_SKILLS]

export const SKILL_BY_ID: Record<string, Skill> = Object.fromEntries(SKILLS.map((s) => [s.id, s]))

export function skillsOf(stage: StageId): Skill[] {
  return SKILLS.filter((s) => s.stage === stage)
}

/** Tất cả kỹ năng nền (đệ quy) của một kỹ năng. */
export function ancestors(skillId: string): string[] {
  const out = new Set<string>()
  const walk = (id: string) => {
    for (const p of SKILL_BY_ID[id]?.prereqs ?? []) {
      if (!out.has(p)) {
        out.add(p)
        walk(p)
      }
    }
  }
  walk(skillId)
  return [...out]
}

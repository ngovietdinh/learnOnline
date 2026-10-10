// Các bộ chuẩn tham chiếu và hàm ghi mã chuẩn ngắn gọn.

export type Framework = 'GDMN' | 'GDPT2018' | 'CCSS' | 'NGSS' | 'CEFR'

export const FRAMEWORKS: Record<Framework, string> = {
  GDMN: 'Chương trình Giáo dục mầm non (Bộ GD&ĐT)',
  GDPT2018: 'Chương trình Giáo dục phổ thông 2018 (Thông tư 32/2018/TT-BGDĐT)',
  CCSS: 'Common Core State Standards (Hoa Kỳ) — đối chiếu quốc tế môn Toán, Đọc hiểu',
  NGSS: 'Next Generation Science Standards (Hoa Kỳ) — đối chiếu quốc tế môn Khoa học',
  CEFR: 'Khung tham chiếu ngôn ngữ chung châu Âu (CEFR) — Tiếng Anh',
}

/** Tên ngắn tiếng Việt hiển thị trên nhãn chuẩn. */
export const FRAMEWORK_SHORT: Record<Framework, string> = {
  GDMN: 'Mầm non',
  GDPT2018: 'GDPT 2018',
  CCSS: 'Chuẩn Toán Mỹ',
  NGSS: 'Chuẩn Khoa học Mỹ',
  CEFR: 'Khung châu Âu',
}

export interface StandardRef {
  framework: Framework
  code: string
}

export const g = (code: string): StandardRef => ({ framework: 'GDPT2018', code })
export const cc = (code: string): StandardRef => ({ framework: 'CCSS', code })
export const ng = (code: string): StandardRef => ({ framework: 'NGSS', code })
export const ce = (code: string): StandardRef => ({ framework: 'CEFR', code })
export const mn = (code: string): StandardRef => ({ framework: 'GDMN', code })


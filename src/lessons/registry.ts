import type { Lesson } from './types'
import { dem10 } from './counting'
import { congQua10 } from './makeTen'
import { phanSo } from './fractions'
import { ngayDem } from './dayNight'
import { ptBacNhat } from './balance'
import { pythagore } from './pythagoras'
import { hamBacHai } from './quadratic'
import { nemXien } from './projectile'
import { CONTENT_LESSONS } from '../content'

// Bài viết riêng (mô phỏng đặc biệt) + bài soạn theo khuôn.
const LEGACY: Lesson[] = [
  { ...dem10, grade: 0, games: ['bongbay', 'cauca', 'chuotchui'] },
  { ...congQua10, grade: 2, games: ['bongbay', 'chuotchui'], pairs: [['8 + 5', '13'], ['9 + 4', '13'], ['7 + 6', '13'], ['9 + 9', '18'], ['8 + 7', '15'], ['6 + 6', '12']] },
  { ...phanSo, grade: 3, games: ['bongbay', 'cauca'], pairs: [['1/2', '🍕 nửa cái'], ['1/4', '¼ cái'], ['2/4', '1/2'], ['3/6', '1/2'], ['2/3', '4/6']] },
  { ...ngayDem, grade: 3, games: ['bongbay'] },
  ptBacNhat,
  pythagore,
  hamBacHai,
  nemXien,
]

export const LESSONS: Lesson[] = [...LEGACY, ...CONTENT_LESSONS]

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]))

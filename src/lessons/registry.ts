import type { Lesson } from './types'
import { conVat, mauSac } from './toddler'
import { dem10 } from './counting'
import { congQua10 } from './makeTen'
import { phanSo } from './fractions'
import { ngayDem } from './dayNight'
import { ptBacNhat } from './balance'
import { pythagore } from './pythagoras'
import { hamBacHai } from './quadratic'
import { nemXien } from './projectile'

export const LESSONS: Lesson[] = [mauSac, conVat, dem10, congQua10, phanSo, ngayDem, ptBacNhat, pythagore, hamBacHai, nemXien]

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]))

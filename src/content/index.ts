// Toàn bộ nội dung soạn theo khuôn: mầm non + tiểu học.
import type { Defined } from './define'
import { MAM_NON } from './mamnon'
import { TOAN_12 } from './toan12'
import { TOAN_3 } from './toan3'
import { TOAN_45 } from './toan45'
import { TIENG_VIET } from './tiengviet'
import { KHOA_HOC } from './khoahoc'
import { TIENG_ANH } from './tienganh'

export const CONTENT: Defined[] = [...MAM_NON, ...TOAN_12, ...TOAN_3, ...TOAN_45, ...TIENG_VIET, ...KHOA_HOC, ...TIENG_ANH]
export const CONTENT_LESSONS = CONTENT.map((d) => d.lesson)
export const CONTENT_SKILLS = CONTENT.map((d) => d.skill)

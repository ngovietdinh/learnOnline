import { describe, expect, it } from 'vitest'
import { href, parse, type Route } from './router'

describe('định tuyến', () => {
  const routes: Route[] = [
    { name: 'profiles' },
    { name: 'home' },
    { name: 'lesson', id: 'phan-so', mode: 'learn' },
    { name: 'lesson', id: 'phan-so', mode: 'test' },
    { name: 'skill', id: 'th.phan-so' },
    { name: 'review' },
    { name: 'map' },
    { name: 'parent' },
  ]
  it.each(routes.map((r) => [href(r), r]))('%s', (h, r) => {
    expect(parse(h as string)).toEqual(r)
  })
  it('đường dẫn lạ về trang chọn hồ sơ', () => {
    expect(parse('#/khong-co')).toEqual({ name: 'profiles' })
  })
})

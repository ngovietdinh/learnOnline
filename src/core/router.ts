// Định tuyến bằng dấu # — chạy được trên mọi máy chủ tĩnh và khi mở trực tiếp tệp.
import { useEffect, useState } from 'react'

export type Route =
  | { name: 'profiles' }
  | { name: 'home' }
  | { name: 'lesson'; id: string; mode: 'learn' | 'test' }
  | { name: 'review' }
  | { name: 'map' }
  | { name: 'skill'; id: string }
  | { name: 'parent' }

export function parse(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?')
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent)
  const q = new URLSearchParams(query)
  switch (parts[0]) {
    case 'hoc':
      if (parts[1]) return { name: 'lesson', id: parts[1], mode: q.get('che-do') === 'kiem-tra' ? 'test' : 'learn' }
      break
    case 'ky-nang':
      if (parts[1]) return { name: 'skill', id: parts[1] }
      break
    case 'on-tap':
      return { name: 'review' }
    case 'chuong-trinh':
      return { name: 'map' }
    case 'phu-huynh':
      return { name: 'parent' }
    case 'nha':
      return { name: 'home' }
  }
  return { name: 'profiles' }
}

export function href(r: Route): string {
  switch (r.name) {
    case 'profiles':
      return '#/'
    case 'home':
      return '#/nha'
    case 'lesson':
      return `#/hoc/${encodeURIComponent(r.id)}${r.mode === 'test' ? '?che-do=kiem-tra' : ''}`
    case 'skill':
      return `#/ky-nang/${encodeURIComponent(r.id)}`
    case 'review':
      return '#/on-tap'
    case 'map':
      return '#/chuong-trinh'
    case 'parent':
      return '#/phu-huynh'
  }
}

export function go(r: Route) {
  window.location.hash = href(r)
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash))
  useEffect(() => {
    const on = () => {
      setRoute(parse(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

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
  | { name: 'play'; kind: string; view?: string }
  | { name: 'courses'; view?: string }
  | { name: 'progress' }

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
    case 'bai-hoc':
      return { name: 'courses', view: q.get('o') ?? undefined }
    case 'tien-bo':
      return { name: 'progress' }
    case 'choi':
      if (parts[1]) return { name: 'play', kind: parts[1], view: q.get('o') ?? undefined }
      break
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
    case 'play':
      return `#/choi/${r.kind}${r.view ? `?o=${r.view}` : ''}`
    case 'courses':
      return `#/bai-hoc${r.view ? `?o=${r.view}` : ''}`
    case 'progress':
      return '#/tien-bo'
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

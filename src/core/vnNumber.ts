// Đọc số bằng tiếng Việt đúng chuẩn sách giáo khoa: 21 "hai mươi mốt", 24 "hai mươi tư",
// 15 "mười lăm", 105 "một trăm linh năm", 1005 "một nghìn không trăm linh năm".

const D = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']

function under100(n: number, full: boolean): string {
  const t = Math.floor(n / 10)
  const u = n % 10
  if (t === 0) return full && u ? `linh ${D[u]}` : D[u]
  if (t === 1) return u === 0 ? 'mười' : `mười ${u === 5 ? 'lăm' : D[u]}`
  const unit = u === 0 ? '' : u === 1 ? ' mốt' : u === 4 ? ' tư' : u === 5 ? ' lăm' : ` ${D[u]}`
  return `${D[t]} mươi${unit}`
}

function under1000(n: number, full: boolean): string {
  const h = Math.floor(n / 100)
  const r = n % 100
  if (h === 0 && !full) return under100(r, false)
  if (r === 0) return `${D[h]} trăm`
  return `${D[h]} trăm ${under100(r, true)}`
}

export function readNumber(n: number): string {
  if (!Number.isFinite(n)) return ''
  if (n < 0) return `âm ${readNumber(-n)}`
  if (!Number.isInteger(n)) {
    const [i, f] = String(n).split('.')
    return `${readNumber(Number(i))} phẩy ${f.length <= 2 && f[0] !== '0' ? readNumber(Number(f)) : [...f].map((d) => D[+d]).join(' ')}`
  }
  if (n < 1000) return under1000(n, false)
  const groups: number[] = []
  let x = n
  while (x > 0) {
    groups.push(x % 1000)
    x = Math.floor(x / 1000)
  }
  const names = ['', 'nghìn', 'triệu', 'tỉ']
  const parts: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]
    if (g === 0) continue
    const isTop = i === groups.length - 1
    parts.push(`${under1000(g, !isTop)}${names[i] ? ` ${names[i]}` : ''}`)
  }
  return parts.join(' ')
}

/** Viết số có dấu chấm ngăn cách hàng nghìn: 12345 → 12.345 */
export function fmt(n: number): string {
  const [i, f] = String(n).split('.')
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return f ? `${g},${f}` : g
}

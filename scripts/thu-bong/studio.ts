// XƯỞNG THÚ BÔNG 3D — nặn từng bạn thú bằng khối 3D, phủ lông nhung nhiều lớp, chiếu đèn studio,
// rồi chụp thành ảnh trong suốt cho ứng dụng (public/thu-bong/<loài>.webp và <loài>-nham.webp).
// Chạy: npx vite scripts/thu-bong  →  mở /?kind=gau  (hoặc dùng scripts/thu-bong/chup.mjs để chụp tất cả).
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

type V = [number, number, number]
const q = new URLSearchParams(location.search)
const SIZE = Number(q.get('size') ?? 512)
const KIND = q.get('kind') ?? 'gau'
const BLINK = q.get('blink') === '1'
const BG = q.get('bg') // để xem thử: nền màu

// ───────────────────────── Bộ dựng hình ─────────────────────────

const SPHERE = new THREE.SphereGeometry(1, 72, 54)
const root = new THREE.Group()
const v3 = (a: V) => new THREE.Vector3(...a)

/** Một khối elip: tâm, bán kính 3 trục, góc xoay (radian). */
interface Ell {
  c: V
  r: V
  rot?: V
}

const SHELLS = 18
function furMaterials(color: string, scale: THREE.Vector3, len: number, density: number) {
  const col = new THREE.Color(color)
  const mats: THREE.Material[] = []
  for (let i = 1; i <= SHELLS; i++) {
    const f = i / SHELLS
    const m = new THREE.MeshStandardMaterial({ color: col.clone().multiplyScalar(0.7 + 0.38 * f), roughness: 1 })
    const off = new THREE.Vector3(len / scale.x, len / scale.y, len / scale.z).multiplyScalar(f)
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uOff = { value: off }
      sh.uniforms.uScale = { value: scale }
      sh.uniforms.uThr = { value: 0.08 + 0.86 * Math.pow(f, 0.85) }
      sh.uniforms.uDen = { value: density }
      sh.vertexShader =
        'uniform vec3 uOff; uniform vec3 uScale; varying vec3 vFurP;\n' +
        sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vFurP = position * uScale;\n transformed += normalize(objectNormal) * uOff;')
      sh.fragmentShader =
        'uniform float uThr; uniform float uDen; varying vec3 vFurP;\nfloat h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\n' +
        sh.fragmentShader.replace(
          '#include <clipping_planes_fragment>',
          '#include <clipping_planes_fragment>\n if (h3(floor(vFurP * uDen)) < uThr) discard;',
        )
    }
    m.customProgramCacheKey = () => 'long-nhung'
    mats.push(m)
  }
  return mats
}

function place(mesh: THREE.Object3D, e: Ell) {
  mesh.position.set(...e.c)
  mesh.scale.set(...e.r)
  if (e.rot) mesh.rotation.set(...e.rot)
}

/** Khối phủ lông nhung (vỏ lông nhiều lớp). */
function fur(e: Ell, color: string, o: { len?: number; den?: number; geo?: THREE.BufferGeometry; parent?: THREE.Object3D } = {}) {
  const g = new THREE.Group()
  const geo = o.geo ?? SPHERE
  const scale = o.geo ? new THREE.Vector3(1, 1, 1) : v3(e.r)
  const base = new THREE.Mesh(
    geo,
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(0.62), roughness: 1, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(color) }),
  )
  base.castShadow = true
  base.receiveShadow = true
  g.add(base)
  for (const m of furMaterials(color, scale, o.len ?? 0.042, o.den ?? 110)) {
    const s = new THREE.Mesh(geo, m)
    s.receiveShadow = true
    g.add(s)
  }
  if (!o.geo) place(g, e)
  ;(o.parent ?? root).add(g)
  return g
}

/** Khối trơn: nhựa bóng (mắt, mũi), vải nỉ (mỏ, chân vịt)… */
function solid(e: Ell, color: string, o: { gloss?: number; geo?: THREE.BufferGeometry; emissive?: string; parent?: THREE.Object3D } = {}) {
  const gloss = o.gloss ?? 0
  const m = new THREE.Mesh(
    o.geo ?? SPHERE,
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: gloss > 0 ? 0.25 : 0.85,
      clearcoat: gloss,
      clearcoatRoughness: 0.08,
      sheen: gloss > 0 ? 0 : 0.6,
      sheenColor: new THREE.Color(color),
      emissive: o.emissive ?? '#000000',
    }),
  )
  m.castShadow = true
  if (!o.geo) place(m, e)
  ;(o.parent ?? root).add(m)
  return m
}

/** Điểm trên bề mặt khối elip theo một hướng (khối không xoay) + pháp tuyến. */
function surf(e: Ell, dir: V, out = 0) {
  const d = v3(dir).normalize()
  const [a, b, c] = e.r
  const t = 1 / Math.sqrt((d.x / a) ** 2 + (d.y / b) ** 2 + (d.z / c) ** 2)
  const p = d.clone().multiplyScalar(t)
  const n = new THREE.Vector3(p.x / (a * a), p.y / (b * b), p.z / (c * c)).normalize()
  return { p: p.add(v3(e.c)).addScaledVector(n, out), n }
}

/** Đặt một khối dẹt áp lên bề mặt (mắt, mũi, má, đốm). */
function stick(on: Ell, dir: V, r: V, color: string, kind: 'fur' | 'gloss' | 'felt' = 'gloss', out = 0, len = 0.03) {
  const { p, n } = surf(on, dir, out)
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n)
  const e: Ell = { c: [p.x, p.y, p.z], r }
  const obj = kind === 'fur' ? fur(e, color, { len }) : solid(e, color, { gloss: kind === 'gloss' ? 1 : 0 })
  obj.quaternion.copy(quat)
  return { obj, p, n }
}

/** Đường chỉ thêu (miệng, mắt nhắm) chạy trên bề mặt. */
function thread(on: Ell, dirs: V[], color = '#3a2228', radius = 0.034, out = 0.05) {
  const pts = dirs.map((d) => surf(on, d, out).p)
  const curve = new THREE.CatmullRomCurve3(pts)
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 10, false), new THREE.MeshStandardMaterial({ color, roughness: 0.7 }))
  root.add(m)
  return m
}

function tube(points: V[], radius: number, color: string, furry = true, len = 0.04) {
  const curve = new THREE.CatmullRomCurve3(points.map(v3))
  const geo = new THREE.TubeGeometry(curve, 64, radius, 24, false)
  if (furry) return fur({ c: [0, 0, 0], r: [1, 1, 1] }, color, { geo, len })
  return solid({ c: [0, 0, 0], r: [1, 1, 1] }, color, { geo })
}

/** Mắt nhựa bóng có hai đốm sáng — hoặc chỉ thêu khi nhắm. */
function eyes(head: Ell, o: { x?: number; y?: number; size?: number; ring?: string } = {}) {
  const x = o.x ?? 0.36
  const y = o.y ?? 0.06
  const s = o.size ?? 1
  for (const k of [-1, 1]) {
    const dir: V = [k * x, y, 0.93]
    if (o.ring) stick(head, dir, [0.25 * s, 0.25 * s, 0.05], o.ring, 'felt', 0.0)
    if (BLINK) {
      thread(head, [[k * x - 0.12 * s, y - 0.02, 0.93], [k * x, y - 0.09 * s, 0.93], [k * x + 0.12 * s, y - 0.02, 0.93]], '#2a1a24', 0.03, 0.04)
      continue
    }
    const { p, n } = stick(head, dir, [0.15 * s, 0.185 * s, 0.1 * s], '#1b1220', 'gloss', 0.02)
    // đốm sáng lớn và nhỏ
    const up = new THREE.Vector3(0, 1, 0)
    const side = new THREE.Vector3().crossVectors(up, n).normalize()
    const hl = (dx: number, dy: number, r: number) => {
      const c = p.clone().addScaledVector(n, 0.11 * s).addScaledVector(side, dx * s).addScaledVector(up, dy * s)
      solid({ c: [c.x, c.y, c.z], r: [r * s, r * s, r * s * 0.5] }, '#ffffff', { emissive: '#ffffff' })
    }
    hl(-0.055, 0.075, 0.055)
    hl(0.06, -0.07, 0.028)
  }
}

function cheeks(head: Ell, color = '#ff9fb4', x = 0.62, y = -0.2) {
  for (const k of [-1, 1]) stick(head, [k * x, y, 0.76], [0.17, 0.11, 0.06], color, 'fur', 0.0, 0.02)
}

function mouthW(on: Ell, y = -0.15, w = 0.26, color = '#3a2228') {
  thread(on, [[-w, y + 0.07, 0.95], [-w / 2, y - 0.07, 0.95], [0, y + 0.03, 1], [w / 2, y - 0.07, 0.95], [w, y + 0.07, 0.95]], color)
}

// ───────────────────────── Thú bốn chân ─────────────────────────

interface Mammal {
  fur: string
  light: string
  inner: string
  ear: 'tron' | 'meo' | 'cao' | 'tho' | 'cup' | 'heo' | 'ngang' | 'voi' | 'chuot' | 'khi' | 'ngua'
  nose: 'tron' | 'tamgiac' | 'heo' | 'bo' | 'nho' | 'none'
  muzzle?: string
  tail?: 'tron' | 'dai' | 'cao' | 'xoan' | 'bom' | 'none'
  limbs?: string
  earColor?: string
  extra?: (h: Ell, ctx: { body: Ell; muzzle: Ell }) => void
}

const HEAD: Ell = { c: [0, 1.74, 0], r: [1.08, 0.96, 0.98] }
const BODY: Ell = { c: [0, 0.74, -0.02], r: [0.8, 0.74, 0.7] }
const MUZ: Ell = { c: [0, 1.46, 0.8], r: [0.4, 0.27, 0.24] }

function mammal(s: Mammal) {
  const limb = s.limbs ?? s.fur
  fur(HEAD, s.fur)
  fur(BODY, s.fur)
  fur({ c: [0, 0.66, 0.38], r: [0.5, 0.5, 0.38] }, s.light, { len: 0.04 })
  // chân
  for (const k of [-1, 1]) {
    fur({ c: [k * 0.42, 0.2, 0.4], r: [0.27, 0.2, 0.34] }, limb)
    stick({ c: [k * 0.42, 0.2, 0.4], r: [0.27, 0.2, 0.34] }, [0, 0.1, 1], [0.13, 0.1, 0.04], s.inner === s.fur ? s.light : s.inner, 'felt', 0.035)
    // tay
    fur({ c: [k * 0.72, 0.86, 0.2], r: [0.2, 0.36, 0.21], rot: [-0.35, 0, k * 0.5] }, limb)
  }
  // tai
  const ec = s.earColor ?? s.fur
  const ear = (e: Ell, inner: Ell | null, color = ec) => {
    fur(e, color)
    if (inner) solid(inner, s.inner)
  }
  for (const k of [-1, 1]) {
    switch (s.ear) {
      case 'tron':
        ear({ c: [k * 0.68, 2.5, -0.1], r: [0.34, 0.34, 0.2], rot: [0, 0, -k * 0.3] }, { c: [k * 0.68, 2.5, 0.06], r: [0.2, 0.2, 0.08] })
        break
      case 'chuot':
        ear({ c: [k * 0.86, 2.48, -0.15], r: [0.55, 0.55, 0.18], rot: [0, 0, -k * 0.3] }, { c: [k * 0.86, 2.48, 0.02], r: [0.36, 0.36, 0.06] })
        break
      case 'meo':
      case 'cao':
      case 'ngua': {
        const tall = s.ear === 'cao' ? 0.82 : s.ear === 'ngua' ? 0.7 : 0.62
        const geo = new THREE.ConeGeometry(0.36, tall, 48, 8)
        const g = new THREE.Group()
        fur({ c: [0, 0, 0], r: [1, 1, 1] }, ec, { geo, parent: g })
        const inner = solid({ c: [0, 0, 0], r: [1, 1, 1] }, s.inner, { geo: new THREE.ConeGeometry(0.22, tall * 0.72, 32), parent: g })
        inner.position.set(0, -0.06, 0.17)
        inner.scale.set(1, 1, 0.35)
        g.position.set(k * (s.ear === 'ngua' ? 0.48 : 0.58), 2.5 + tall * 0.18, -0.02)
        g.rotation.set(0, 0, -k * 0.38)
        g.scale.set(1, 1, 0.6)
        root.add(g)
        break
      }
      case 'tho':
        ear({ c: [k * 0.34, 2.95, -0.05], r: [0.22, 0.66, 0.14], rot: [0, 0, -k * 0.16] }, { c: [k * 0.34, 2.97, 0.07], r: [0.12, 0.5, 0.05], rot: [0, 0, -k * 0.16] })
        break
      case 'cup':
        ear({ c: [k * 0.98, 1.55, 0.12], r: [0.25, 0.52, 0.15], rot: [0, 0, k * 0.32] }, null, s.earColor ?? s.inner)
        break
      case 'heo':
        ear({ c: [k * 0.62, 2.48, 0.12], r: [0.26, 0.3, 0.12], rot: [0.7, 0, -k * 0.4] }, { c: [k * 0.62, 2.48, 0.22], r: [0.15, 0.18, 0.05], rot: [0.7, 0, -k * 0.4] })
        break
      case 'ngang':
        ear({ c: [k * 1.15, 1.95, 0], r: [0.34, 0.15, 0.13], rot: [0, 0, -k * 0.35] }, { c: [k * 1.17, 1.95, 0.08], r: [0.22, 0.08, 0.05], rot: [0, 0, -k * 0.35] })
        break
      case 'voi':
        ear({ c: [k * 1.12, 1.72, -0.18], r: [0.66, 0.76, 0.13], rot: [0, -k * 0.45, -k * 0.1] }, { c: [k * 1.1, 1.72, -0.06], r: [0.46, 0.55, 0.05], rot: [0, -k * 0.45, -k * 0.1] })
        break
      case 'khi':
        ear({ c: [k * 1.12, 1.78, -0.02], r: [0.28, 0.28, 0.12], rot: [0, k * 0.9, 0] }, { c: [k * 1.15, 1.78, 0.04], r: [0.17, 0.17, 0.05], rot: [0, k * 0.9, 0] })
        break
    }
  }
  // mõm, mũi, miệng
  if (s.muzzle) fur(MUZ, s.muzzle, { len: 0.035 })
  const face = s.muzzle ? MUZ : HEAD
  eyes(HEAD)
  cheeks(HEAD)
  switch (s.nose) {
    case 'tron':
      stick(MUZ, [0, 0.6, 0.8], [0.13, 0.095, 0.08], '#2b1b20', 'gloss', 0.02)
      mouthW(MUZ, -0.2, 0.24)
      thread(MUZ, [[0, 0.42, 0.9], [0, -0.17, 1]])
      break
    case 'tamgiac':
      stick(face, s.muzzle ? [0, 0.55, 0.83] : [0, -0.14, 1], [0.1, 0.07, 0.06], '#d9667f', 'gloss', 0.02)
      if (s.muzzle) {
        mouthW(MUZ, -0.2, 0.24)
        thread(MUZ, [[0, 0.4, 0.9], [0, -0.17, 1]])
      } else mouthW(HEAD, -0.3, 0.14)
      break
    case 'nho':
      stick(HEAD, [0, -0.13, 1], [0.07, 0.05, 0.05], '#ff7fa3', 'gloss', 0.02)
      mouthW(HEAD, -0.27, 0.12)
      break
    case 'heo': {
      const sn: Ell = { c: [0, 1.5, 0.88], r: [0.3, 0.21, 0.17] }
      fur(sn, s.light, { len: 0.02 })
      for (const k of [-1, 1]) stick(sn, [k * 0.35, 0, 1], [0.05, 0.08, 0.03], '#b5506f', 'felt', 0.0)
      thread(HEAD, [[-0.16, -0.5, 0.86], [0, -0.58, 0.82], [0.16, -0.5, 0.86]])
      break
    }
    case 'bo': {
      const sn: Ell = { c: [0, 1.42, 0.82], r: [0.52, 0.32, 0.26] }
      fur(sn, s.muzzle ?? '#ffc6d2', { len: 0.025 })
      for (const k of [-1, 1]) stick(sn, [k * 0.4, 0.2, 0.9], [0.06, 0.09, 0.03], '#a8536a', 'felt', 0.0)
      thread(sn, [[-0.25, -0.35, 0.92], [0, -0.48, 0.9], [0.25, -0.35, 0.92]])
      break
    }
  }
  // đuôi (nhìn thấy nhờ góc nghiêng 3/4)
  switch (s.tail) {
    case 'bom':
      fur({ c: [0.15, 0.45, -0.72], r: [0.25, 0.25, 0.25] }, s.light, { len: 0.07 })
      break
    case 'tron':
      fur({ c: [0.55, 0.55, -0.6], r: [0.16, 0.3, 0.16], rot: [0.6, 0, -0.7] }, s.fur)
      break
    case 'dai':
      tube([[0.3, 0.35, -0.62], [0.95, 0.3, -0.55], [1.25, 0.75, -0.3], [1.2, 1.2, -0.1], [1.35, 1.45, 0]], 0.11, s.fur)
      break
    case 'cao':
      fur({ c: [0.95, 0.62, -0.45], r: [0.36, 0.62, 0.34], rot: [0.2, 0, -0.95] }, s.fur, { len: 0.07 })
      fur({ c: [1.38, 1.05, -0.25], r: [0.2, 0.26, 0.2], rot: [0.2, 0, -0.95] }, '#ffffff', { len: 0.07 })
      break
    case 'xoan':
      tube([[0.35, 0.4, -0.65], [0.9, 0.35, -0.55], [1.05, 0.65, -0.45], [0.85, 0.75, -0.42], [0.85, 0.55, -0.42]], 0.045, s.limbs ?? s.fur, false)
      break
  }
  s.extra?.(HEAD, { body: BODY, muzzle: MUZ })
}

// ───────────────────────── Chim, ếch, cá… ─────────────────────────

interface Bird {
  fur: string
  light: string
  wing: string
  beak: 'nhon' | 'det'
  extra?: (b: Ell) => void
}
const BALL: Ell = { c: [0, 1.15, 0], r: [1.12, 1.1, 1.04] }
function bird(s: Bird) {
  fur(BALL, s.fur)
  fur({ c: [0, 0.82, 0.55], r: [0.75, 0.62, 0.5] }, s.light, { len: 0.04 })
  for (const k of [-1, 1]) {
    fur({ c: [k * 1.06, 1.0, 0.0], r: [0.22, 0.5, 0.36], rot: [0.2, 0, k * 0.35] }, s.wing)
    solid({ c: [k * 0.35, 0.06, 0.38], r: [0.24, 0.07, 0.3] }, '#ffa63a')
  }
  eyes(BALL, { y: 0.2, x: 0.34 })
  cheeks(BALL, '#ff9fb4', 0.6, -0.02)
  if (s.beak === 'nhon') {
    const g = solid({ c: [0, 0, 0], r: [1, 1, 1] }, '#ffa22e', { geo: new THREE.ConeGeometry(0.15, 0.3, 32) })
    const { p } = surf(BALL, [0, 0.0, 1], 0.08)
    g.position.copy(p)
    g.rotation.set(Math.PI / 2, 0, 0)
  } else {
    const { p } = surf(BALL, [0, -0.02, 1], 0.05)
    solid({ c: [p.x, p.y, p.z], r: [0.32, 0.11, 0.2] }, '#ff9a2a')
  }
  s.extra?.(BALL)
}

function frog() {
  const head: Ell = { c: [0, 1.55, 0], r: [1.2, 0.82, 0.95] }
  fur({ c: [0, 0.68, 0], r: [0.85, 0.7, 0.72] }, '#7cd65a')
  fur({ c: [0, 0.62, 0.38], r: [0.55, 0.5, 0.38] }, '#eaffcf', { len: 0.035 })
  fur(head, '#86dc62')
  for (const k of [-1, 1]) {
    const bump: Ell = { c: [k * 0.52, 2.2, 0.25], r: [0.38, 0.36, 0.34] }
    fur(bump, '#86dc62')
    stick(bump, [0, 0.1, 1], [0.27, 0.27, 0.06], '#ffffff', 'felt', 0.0)
    if (BLINK) thread(bump, [[-0.15, 0.08, 1], [0, -0.04, 1], [0.15, 0.08, 1]], '#2a1a24', 0.03, 0.08)
    else {
      const { p } = surf(bump, [0, 0.1, 1], 0.05)
      solid({ c: [p.x, p.y, p.z], r: [0.15, 0.17, 0.08] }, '#1b1220', { gloss: 1 })
      solid({ c: [p.x - 0.05, p.y + 0.06, p.z + 0.08], r: [0.045, 0.045, 0.02] }, '#fff', { emissive: '#fff' })
    }
    fur({ c: [k * 0.5, 0.18, 0.42], r: [0.36, 0.17, 0.36] }, '#7cd65a')
    fur({ c: [k * 0.8, 0.8, 0.2], r: [0.18, 0.34, 0.2], rot: [-0.3, 0, k * 0.5] }, '#7cd65a')
  }
  cheeks(head, '#ff9fb4', 0.66, -0.15)
  thread(head, [[-0.45, -0.05, 0.9], [-0.2, -0.3, 0.95], [0, -0.34, 1], [0.2, -0.3, 0.95], [0.45, -0.05, 0.9]], '#2c5a22', 0.032)
}

function fishLike(kind: 'ca' | 'cavoi' | 'caheo') {
  const col = kind === 'ca' ? ['#ff9a3d', '#fff0d6', '#ff7a1f'] : kind === 'cavoi' ? ['#5fb4f5', '#e5f5ff', '#3e93d8'] : ['#8fb3e3', '#eef5ff', '#6b90c6']
  const body: Ell = { c: [0, 1.15, 0], r: kind === 'cavoi' ? [1.3, 1.0, 1.0] : [1.2, 0.92, 0.85] }
  fur(body, col[0])
  fur({ c: [0.1, 0.72, 0.42], r: [0.95, 0.5, 0.48] }, col[1], { len: 0.035 })
  // đuôi phía sau-trái
  fur({ c: [-1.35, 1.25, -0.35], r: [0.18, 0.55, 0.4], rot: [0, 0.6, kind === 'cavoi' ? 1.2 : 0.2] }, col[2])
  if (kind !== 'cavoi') fur({ c: [-0.1, 2.0, -0.1], r: [0.45, 0.32, 0.14], rot: [0, 0, 0.5] }, col[2])
  if (kind === 'caheo') fur({ c: [0.0, 1.0, 0.95], r: [0.3, 0.2, 0.3] }, col[0])
  for (const k of [-1, 1]) fur({ c: [k * 1.05, 0.8, 0.25], r: [0.14, 0.3, 0.26], rot: [0.4, 0, k * 0.9] }, col[2])
  eyes(body, { y: 0.2, x: 0.36 })
  cheeks(body, '#ff9fb4', 0.6, -0.08)
  mouthW(body, kind === 'caheo' ? -0.35 : -0.15, 0.13)
}

function octopus() {
  const head: Ell = { c: [0, 1.5, 0], r: [1.08, 1.05, 1.0] }
  for (let i = 0; i < 6; i++) {
    const a = -2.4 + i * 0.96
    const x = Math.cos(a) * 0.62
    const z = Math.sin(a) * 0.3 + 0.25
    const d = i % 2 ? 1 : -1
    tube([[x, 0.75, z], [x * 1.25, 0.3, z + 0.15], [x * 1.5 + d * 0.15, 0.12, z + 0.35], [x * 1.5 + d * 0.32, 0.25, z + 0.45]], 0.17, i % 2 ? '#ff8fcf' : '#f879bf')
  }
  fur(head, '#ff94d1')
  eyes(head, { y: 0.0 })
  cheeks(head, '#ff6fa9', 0.62, -0.25)
  mouthW(head, -0.32, 0.13)
}

// ───────────────────────── Danh sách loài ─────────────────────────

const stripes = (h: Ell, color: string) => {
  for (const x of [-0.16, 0, 0.16]) stick(h, [x, 0.75, 0.66], [0.04, 0.17, 0.03], color, 'fur', 0.0, 0.03)
  for (const k of [-1, 1]) for (const y of [0.05, -0.15]) stick(h, [k * 0.95, y, 0.35], [0.05, 0.16, 0.03], color, 'fur', 0.0, 0.03).obj.rotateZ(k * 1.3)
}

const KINDS: Record<string, () => void> = {
  gau: () => mammal({ fur: '#9c6a45', light: '#f2d5b2', inner: '#f2d5b2', ear: 'tron', nose: 'tron', muzzle: '#f2d5b2' }),
  meo: () => mammal({ fur: '#ffb35c', light: '#fff1de', inner: '#ffb3c1', ear: 'meo', nose: 'tamgiac', muzzle: '#fff1de', tail: 'dai', extra: (h) => stripes(h, '#e8862a') }),
  cho: () => mammal({ fur: '#e0bf96', light: '#fff6ea', inner: '#a8805c', earColor: '#9c7552', ear: 'cup', nose: 'tron', muzzle: '#fff6ea', tail: 'tron' }),
  tho: () => mammal({ fur: '#f6f1fb', light: '#ffffff', inner: '#ffb7cf', ear: 'tho', nose: 'nho', tail: 'bom' }),
  gautruc: () =>
    mammal({
      fur: '#f7f7f5',
      light: '#ffffff',
      inner: '#3a3a44',
      earColor: '#33333c',
      limbs: '#33333c',
      ear: 'tron',
      nose: 'tron',
      muzzle: '#ffffff',
      extra: (h) => {
        for (const k of [-1, 1]) stick(h, [k * 0.36, 0.02, 0.93], [0.25, 0.3, 0.06], '#33333c', 'fur', -0.01, 0.03).obj.rotateZ(k * 0.5)
      },
    }),
  koala: () => mammal({ fur: '#aeb8c6', light: '#eef1f5', inner: '#f4f6fa', ear: 'chuot', nose: 'none', extra: (h) => stick(h, [0, -0.1, 1], [0.17, 0.22, 0.12], '#3a3540', 'gloss', 0.03) }),
  ho: () => mammal({ fur: '#ff9f3d', light: '#fff6e8', inner: '#fff1dc', ear: 'tron', nose: 'tamgiac', muzzle: '#fff6e8', tail: 'dai', extra: (h) => stripes(h, '#5a3622') }),
  sutu: () =>
    mammal({
      fur: '#ffc65c',
      light: '#fff4d9',
      inner: '#ffe2a1',
      ear: 'tron',
      nose: 'tamgiac',
      muzzle: '#fff4d9',
      tail: 'dai',
      extra: () => {
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2
          fur({ c: [Math.cos(a) * 1.08, 1.74 + Math.sin(a) * 0.98, -0.3], r: [0.42, 0.42, 0.36] }, i % 2 ? '#e8892c' : '#f29e3a', { len: 0.08 })
        }
      },
    }),
  cao: () => mammal({ fur: '#ff8a3d', light: '#ffffff', inner: '#4a3030', ear: 'cao', nose: 'tamgiac', muzzle: '#ffffff', tail: 'cao', limbs: '#5a3b2e' }),
  heo: () => mammal({ fur: '#ffb3c9', light: '#ffd3e0', inner: '#f28fae', ear: 'heo', nose: 'heo', tail: 'xoan', limbs: '#ffb3c9' }),
  bo: () =>
    mammal({
      fur: '#f7f3ef',
      light: '#ffffff',
      inner: '#ffc2cf',
      ear: 'ngang',
      nose: 'bo',
      muzzle: '#ffc6d2',
      tail: 'none',
      extra: (h) => {
        stick(h, [0.45, 0.65, 0.6], [0.3, 0.22, 0.05], '#3d3434', 'fur', -0.01, 0.03)
        stick(BODY, [-0.5, 0.2, 0.84], [0.22, 0.17, 0.05], '#3d3434', 'fur', -0.01, 0.03)
        for (const k of [-1, 1]) {
          const g = solid({ c: [0, 0, 0], r: [1, 1, 1] }, '#f4e3b5', { geo: new THREE.ConeGeometry(0.1, 0.36, 32) })
          g.position.set(k * 0.5, 2.62, 0)
          g.rotation.set(0, 0, -k * 0.5)
        }
      },
    }),
  de: () =>
    mammal({
      fur: '#e8d4b4',
      light: '#fbf3e6',
      inner: '#ffd2c2',
      ear: 'ngang',
      nose: 'bo',
      muzzle: '#f3dfc6',
      tail: 'bom',
      extra: () => {
        for (const k of [-1, 1]) tube([[k * 0.35, 2.5, 0.05], [k * 0.48, 2.85, -0.15], [k * 0.72, 2.9, -0.35], [k * 0.85, 2.7, -0.4]], 0.08, '#bfa982', false)
        fur({ c: [0, 1.08, 0.88], r: [0.13, 0.22, 0.12] }, '#fbf3e6', { len: 0.06 })
      },
    }),
  cuu: () =>
    mammal({
      fur: '#fffaf2',
      light: '#ffffff',
      inner: '#ffd2c2',
      ear: 'ngang',
      earColor: '#f1d8c8',
      nose: 'nho',
      tail: 'bom',
      extra: (h) => {
        stick(h, [0, -0.05, 1], [0.62, 0.56, 0.05], '#f6dccc', 'fur', -0.05, 0.02)
        for (let i = 0; i < 18; i++) {
          const a = (i / 18) * Math.PI * 2
          fur({ c: [Math.cos(a) * 0.95, 1.85 + Math.sin(a) * 0.82, -0.12 + (i % 2) * 0.1], r: [0.34, 0.34, 0.34] }, '#fffdf8', { len: 0.06 })
        }
      },
    }),
  chuot: () => mammal({ fur: '#c8c4d9', light: '#f6f5fb', inner: '#ffc0d3', ear: 'chuot', nose: 'nho', tail: 'xoan', limbs: '#c8c4d9' }),
  hamster: () =>
    mammal({
      fur: '#ffc98a',
      light: '#fff8ee',
      inner: '#ffc0c8',
      ear: 'tron',
      nose: 'nho',
      extra: (h) => {
        for (const k of [-1, 1]) stick(h, [k * 0.55, -0.35, 0.75], [0.32, 0.26, 0.2], '#fff8ee', 'fur', -0.1, 0.04)
      },
    }),
  khi: () =>
    mammal({
      fur: '#a8744c',
      light: '#f7dcc0',
      inner: '#f7dcc0',
      ear: 'khi',
      nose: 'nho',
      tail: 'xoan',
      limbs: '#a8744c',
      extra: (h) => {
        for (const k of [-1, 1]) stick(h, [k * 0.33, 0.12, 0.94], [0.36, 0.42, 0.1], '#f7dcc0', 'fur', -0.05, 0.02)
        stick(h, [0, -0.3, 0.95], [0.55, 0.36, 0.12], '#f7dcc0', 'fur', -0.05, 0.02)
      },
    }),
  ngua: () =>
    mammal({
      fur: '#b9805a',
      light: '#f0d2b8',
      inner: '#f0d2b8',
      ear: 'ngua',
      nose: 'bo',
      muzzle: '#e9c2a4',
      tail: 'dai',
      extra: () => {
        for (let i = 0; i < 6; i++) fur({ c: [0.08 - i * 0.02, 2.62 - i * 0.18, -0.35 - i * 0.12], r: [0.24, 0.24, 0.22] }, '#6b3f25', { len: 0.07 })
      },
    }),
  kylan: () =>
    mammal({
      fur: '#fbf6ff',
      light: '#ffffff',
      inner: '#ffc6e3',
      ear: 'ngua',
      nose: 'nho',
      tail: 'bom',
      extra: () => {
        const horn = solid({ c: [0, 0, 0], r: [1, 1, 1] }, '#ffd56b', { geo: new THREE.ConeGeometry(0.15, 0.7, 48), gloss: 1 })
        horn.position.set(0, 2.92, 0.25)
        horn.rotation.set(0.2, 0, 0)
        const cols = ['#c4a8ff', '#ffb3dd', '#9fe0ff', '#c4a8ff', '#ffb3dd']
        for (let i = 0; i < 5; i++) fur({ c: [0.3 + i * 0.06, 2.55 - i * 0.2, -0.3 - i * 0.12], r: [0.26, 0.26, 0.24] }, cols[i], { len: 0.07 })
      },
    }),
  voi: () =>
    mammal({
      fur: '#a9b6d1',
      light: '#e2e8f3',
      inner: '#ffc6d6',
      ear: 'voi',
      nose: 'none',
      extra: () => {
        tube([[0, 1.55, 0.85], [0.02, 1.2, 1.12], [0.12, 0.95, 1.25], [0.3, 0.98, 1.3]], 0.14, '#a9b6d1')
        thread(HEAD, [[-0.3, -0.45, 0.85], [-0.2, -0.55, 0.82]])
      },
    }),
  ga: () =>
    bird({
      fur: '#fbf8f3',
      light: '#ffffff',
      wing: '#ebe3d8',
      beak: 'nhon',
      extra: (b) => {
        for (const [x, y, r] of [[-0.18, 2.32, 0.17], [0.02, 2.42, 0.2], [0.22, 2.32, 0.17]] as V[]) fur({ c: [x, y, 0.1], r: [r, r, r * 0.8] }, '#ff4d5e', { len: 0.03 })
        const { p } = surf(b, [0, -0.18, 1], 0.05)
        fur({ c: [p.x, p.y, p.z], r: [0.08, 0.14, 0.06] }, '#ff4d5e', { len: 0.02 })
      },
    }),
  gacon: () => bird({ fur: '#ffe14d', light: '#fff6c2', wing: '#f5c400', beak: 'nhon', extra: () => tuft('#f5c400') }),
  vit: () => bird({ fur: '#ffe766', light: '#fffbe0', wing: '#f2c92e', beak: 'det', extra: () => tuft('#f2c92e') }),
  chim: () => bird({ fur: '#6cbcf7', light: '#eaf6ff', wing: '#3f95d9', beak: 'nhon', extra: () => tuft('#3f95d9') }),
  vet: () => bird({ fur: '#6fd64a', light: '#fff3a8', wing: '#ff6b4a', beak: 'nhon', extra: () => tuft('#ff6b4a') }),
  cu: () =>
    bird({
      fur: '#a47a55',
      light: '#f3dfc6',
      wing: '#7c5636',
      beak: 'nhon',
      extra: () => {
        for (const k of [-1, 1]) {
          const g = new THREE.Group()
          fur({ c: [0, 0, 0], r: [1, 1, 1] }, '#7c5636', { geo: new THREE.ConeGeometry(0.2, 0.5, 32), parent: g })
          g.position.set(k * 0.62, 2.18, 0)
          g.rotation.set(0, 0, -k * 0.5)
          root.add(g)
        }
      },
    }),
  canhcut: () =>
    bird({
      fur: '#3c4560',
      light: '#ffffff',
      wing: '#262d42',
      beak: 'nhon',
      extra: (b) => {
        for (const k of [-1, 1]) stick(b, [k * 0.3, 0.12, 0.95], [0.4, 0.42, 0.1], '#ffffff', 'fur', -0.06, 0.02)
      },
    }),
  ech: frog,
  ca: () => fishLike('ca'),
  cavoi: () => fishLike('cavoi'),
  caheo: () => fishLike('caheo'),
  bachtuoc: octopus,
}

function tuft(color: string) {
  for (const [x, r] of [[-0.1, 0.5], [0.08, -0.3]] as [number, number][]) {
    const g = new THREE.Group()
    fur({ c: [0, 0, 0], r: [1, 1, 1] }, color, { geo: new THREE.ConeGeometry(0.1, 0.4, 24), parent: g })
    g.position.set(x, 2.35, 0.05)
    g.rotation.set(0, 0, r)
    root.add(g)
  }
}

// ───────────────────────── Sân khấu & chụp ảnh ─────────────────────────

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(SIZE, SIZE)
renderer.toneMapping = THREE.NeutralToneMapping
renderer.toneMappingExposure = 1.05
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
if (BG) scene.background = new THREE.Color(BG)
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.55

scene.add(new THREE.HemisphereLight('#fffaf3', '#e8d3c4', 0.9))
const key = new THREE.DirectionalLight('#fff4e6', 2.4)
key.position.set(2.5, 7, 7)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.radius = 14
key.shadow.blurSamples = 24
key.shadow.bias = -0.0005
Object.assign(key.shadow.camera, { left: -4, right: 4, top: 5, bottom: -2, near: 1, far: 20 })
scene.add(key)
const rim = new THREE.DirectionalLight('#ffffff', 2.2)
rim.position.set(-4, 4, -5)
scene.add(rim)
const fill = new THREE.DirectionalLight('#ffe9f2', 0.7)
fill.position.set(-5, 1.5, 4)
scene.add(fill)

const ground = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.ShadowMaterial({ opacity: 0.16 }))
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

;(KINDS[KIND] ?? KINDS.gau)()
root.rotation.y = -0.32 // góc nghiêng 3/4 cho có chiều sâu
scene.add(root)

// Canh khung hình vừa khít bạn thú.
const box = new THREE.Box3().setFromObject(root)
const center = box.getCenter(new THREE.Vector3())
const size = box.getSize(new THREE.Vector3())
const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100)
const span = Math.max(size.x, size.y + 0.3) * 1.08
const dist = span / 2 / Math.tan(THREE.MathUtils.degToRad(13))
camera.position.set(center.x, center.y + dist * 0.18, center.z + dist)
camera.lookAt(center.x, center.y - 0.05, center.z)

renderer.render(scene, camera)
;(window as unknown as { __done: string }).__done = renderer.domElement.toDataURL('image/webp', 0.9)

// Chụp ảnh các bạn thú bông 3D → public/thu-bong/<loài>.webp (+ <loài>-nham.webp: mắt nhắm).
// Cần: npx vite scripts/thu-bong --port 5300 đang chạy, và playwright-core.
// Chạy: node scripts/thu-bong/chup.mjs [loài1,loài2…] [thư-mục-ra] [cỡ]
import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'

const ALL = 'gau,meo,cho,tho,gautruc,koala,ho,sutu,cao,heo,bo,de,cuu,chuot,hamster,khi,ngua,kylan,voi,ga,gacon,vit,chim,vet,cu,canhcut,ech,ca,cavoi,caheo,bachtuoc'
const kinds = (process.argv[2] && process.argv[2] !== 'all' ? process.argv[2] : ALL).split(',')
const out = process.argv[3] ?? 'public/thu-bong'
const size = process.argv[4] ?? '384'
const extra = process.argv[5] ?? ''
mkdirSync(out, { recursive: true })
const b = await chromium.launch({
  executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const p = await b.newPage({ viewport: { width: +size, height: +size } })
p.on('pageerror', (e) => console.error('LỖI', e.message))
for (const k of kinds) {
  for (const blink of process.env.NOBLINK ? ['0'] : ['0', '1']) {
    await p.goto(`http://localhost:5300/?kind=${k}&size=${size}&blink=${blink}${extra}`)
    await p.waitForFunction(() => window.__done, null, { timeout: 120000 })
    const url = await p.evaluate(() => window.__done)
    const buf = Buffer.from(url.split(',')[1], 'base64')
    writeFileSync(`${out}/${k}${blink === '1' ? '-nham' : ''}.webp`, buf)
    console.log(k, blink, (buf.length / 1024).toFixed(1) + 'KB')
  }
}
await b.close()

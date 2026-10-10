import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { speak } from '../core/speech'
import { useActiveProfile, useStore } from '../core/store'
import { stageForAge, type Stage } from '../core/stages'

export function useStage(): Stage {
  const p = useActiveProfile()
  return stageForAge(p?.age ?? 8)
}

/** Lời dẫn: đọc to nếu lứa tuổi cần (hoặc phụ huynh bật), luôn có nút 🔊 để nghe lại. */
export function useSay() {
  const stage = useStage()
  const pref = useStore((s) => s.settings.narrate)
  const on = pref ?? stage.narrate
  return useCallback((text: string, force = false) => {
    if (on || force) speak(text, { force: true })
  }, [on])
}

export function SpeakButton({ text, label = 'Nghe' }: { text: string; label?: string }) {
  return (
    <button className="speak-btn" onClick={() => speak(text, { force: true })} aria-label={`${label}: ${text}`} title="Đọc to">
      🔊
    </button>
  )
}

export function Mascot({ emoji, children, mood = 'idle' }: { emoji: string; children?: ReactNode; mood?: 'idle' | 'happy' | 'think' }) {
  return (
    <div className={`mascot mood-${mood}`}>
      <span className="mascot-face" aria-hidden>
        {emoji}
      </span>
      {children && <div className="bubble">{children}</div>}
    </div>
  )
}

export function ProgressRing({ value, size = 56, label }: { value: number; size?: number; label?: ReactNode }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} className="ring-bg" />
        <circle
          cx="26"
          cy="26"
          r={r}
          className="ring-fg"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))}
          transform="rotate(-90 26 26)"
        />
      </svg>
      <span className="ring-label">{label ?? `${Math.round(value * 100)}%`}</span>
    </div>
  )
}

const CONFETTI_COLORS = ['#ff5d8f', '#ffd23f', '#3bceac', '#4f8cff', '#a855f7', '#fb923c']

export function Confetti({ count = 80 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 2.2 + Math.random() * 1.6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rot: Math.random() * 360,
        size: 6 + Math.random() * 8,
      })),
    [count],
  )
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 4500)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <div className="confetti" aria-hidden>
      {bits.map((b, i) => (
        <i
          key={i}
          style={{
            left: `${b.left}%`,
            background: b.color,
            width: b.size,
            height: b.size * 0.45,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            transform: `rotate(${b.rot}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function Toast({ children }: { children: ReactNode }) {
  return <div className="toast">{children}</div>
}

export function Stars({ n, of = 3 }: { n: number; of?: number }) {
  return (
    <span className="stars" aria-label={`${n} trên ${of} sao`}>
      {Array.from({ length: of }, (_, i) => (
        <span key={i} className={i < n ? 'on' : ''}>
          ★
        </span>
      ))}
    </span>
  )
}

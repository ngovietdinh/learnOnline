import { useEffect, useState } from 'react'
import { onSpeaking } from '../core/speech'

export type Mood = 'idle' | 'happy' | 'oops' | 'think' | 'cheer'

function src(name: string) {
  const inline = (globalThis as { __THU_BONG?: Record<string, string> }).__THU_BONG
  return inline?.[name] ?? `thu-bong/${name}.webp`
}

/**
 * Cô Thỏ — cô giáo thú bông (cùng bộ thiết kế với các bạn thú): đeo kính tròn, thở nhẹ,
 * chớp mắt, mấp máy miệng theo giọng đọc, nhắm mắt cười khi bé làm đúng, nghiêng đầu khi suy nghĩ.
 */
export function Teacher({ size = 120, mood = 'idle', className = '' }: { size?: number; mood?: Mood; className?: string }) {
  const [talking, setTalking] = useState(false)
  useEffect(() => onSpeaking(setTalking), [])
  return (
    <span
      className={`teacher mood-${mood} ${talking ? 'talking' : ''} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Cô Thỏ"
    >
      <img className="t-base" src={src('cotho')} alt="" draggable={false} decoding="async" />
      <img className="t-blink" src={src('cotho-nham')} alt="" draggable={false} decoding="async" />
      <img className="t-talk" src={src('cotho-noi')} alt="" draggable={false} decoding="async" />
    </span>
  )
}

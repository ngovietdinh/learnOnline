import { useEffect, useState } from 'react'
import { onSpeaking } from '../core/speech'

export type Mood = 'idle' | 'happy' | 'oops' | 'think' | 'cheer'

/**
 * Cô Thỏ — cô giáo hoạt hình: chớp mắt, mấp máy môi khi đang đọc lời, đổi nét mặt theo câu trả lời.
 * Vẽ bằng SVG nên sắc nét ở mọi kích thước, không cần tệp ảnh.
 */
export function Teacher({ size = 120, mood = 'idle', className = '' }: { size?: number; mood?: Mood; className?: string }) {
  const [talking, setTalking] = useState(false)
  useEffect(() => onSpeaking(setTalking), [])
  const happy = mood === 'happy' || mood === 'cheer'
  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      className={`teacher mood-${mood} ${talking ? 'talking' : ''} ${className}`}
      role="img"
      aria-label="Cô Thỏ"
    >
      <defs>
        <radialGradient id="t-face" cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f3ecff" />
        </radialGradient>
        <linearGradient id="t-dress" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff8fb8" />
          <stop offset="100%" stopColor="#ff5d8f" />
        </linearGradient>
      </defs>
      {/* Tai */}
      <g className="t-ears">
        <g className="t-ear-l">
          <ellipse cx="72" cy="48" rx="17" ry="46" fill="url(#t-face)" stroke="#d9cdf2" strokeWidth="3" />
          <ellipse cx="72" cy="52" rx="8" ry="32" fill="#ffc2d6" />
        </g>
        <g className="t-ear-r">
          <ellipse cx="128" cy="48" rx="17" ry="46" fill="url(#t-face)" stroke="#d9cdf2" strokeWidth="3" />
          <ellipse cx="128" cy="52" rx="8" ry="32" fill="#ffc2d6" />
        </g>
      </g>
      {/* Thân: áo cô giáo */}
      <path d="M48 220 Q52 168 100 162 Q148 168 152 220 Z" fill="url(#t-dress)" />
      <path d="M86 166 L100 186 L114 166" fill="#fff" opacity="0.9" />
      <circle cx="100" cy="196" r="4" fill="#fff" opacity="0.85" />
      {/* Đầu */}
      <circle cx="100" cy="118" r="58" fill="url(#t-face)" stroke="#d9cdf2" strokeWidth="3" />
      {/* Nơ */}
      <g transform="translate(128 70) rotate(18)" className="t-bow">
        <path d="M0 0 L-16 -10 L-16 10 Z" fill="#ffd23f" />
        <path d="M0 0 L16 -10 L16 10 Z" fill="#ffd23f" />
        <circle r="5" fill="#ffb703" />
      </g>
      {/* Má hồng */}
      <ellipse cx="66" cy="134" rx="11" ry="7" fill="#ffb3c8" opacity={happy ? 0.95 : 0.7} />
      <ellipse cx="134" cy="134" rx="11" ry="7" fill="#ffb3c8" opacity={happy ? 0.95 : 0.7} />
      {/* Mắt */}
      {happy ? (
        <g stroke="#3b2a4a" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M70 116 Q80 104 90 116" />
          <path d="M110 116 Q120 104 130 116" />
        </g>
      ) : (
        <g className="t-eyes">
          <ellipse cx="80" cy="114" rx={mood === 'oops' ? 6 : 8} ry={mood === 'oops' ? 6 : 10} fill="#3b2a4a" />
          <ellipse cx="120" cy="114" rx={mood === 'oops' ? 6 : 8} ry={mood === 'oops' ? 6 : 10} fill="#3b2a4a" />
          <circle cx="83" cy="110" r="3" fill="#fff" />
          <circle cx="123" cy="110" r="3" fill="#fff" />
        </g>
      )}
      {/* Kính cô giáo */}
      <g stroke="#7c5cff" strokeWidth="3" fill="none" opacity="0.85">
        <circle cx="80" cy="114" r="16" />
        <circle cx="120" cy="114" r="16" />
        <path d="M96 112 Q100 108 104 112" />
      </g>
      {/* Mũi */}
      <ellipse cx="100" cy="132" rx="5" ry="3.5" fill="#ff8fb8" />
      {/* Miệng */}
      <g className="t-mouth">
        {mood === 'oops' ? (
          <ellipse cx="100" cy="150" rx="6" ry="7" fill="#7a2840" />
        ) : (
          <>
            <path className="t-mouth-closed" d="M86 144 Q100 160 114 144" stroke="#7a2840" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path className="t-mouth-open" d="M86 143 Q100 168 114 143 Z" fill="#7a2840" />
            <ellipse className="t-mouth-open" cx="100" cy="153" rx="7" ry="4" fill="#ff7aa2" />
          </>
        )}
      </g>
      {mood === 'think' && (
        <g className="t-think">
          <circle cx="170" cy="70" r="6" fill="#fff" stroke="#d9cdf2" strokeWidth="2" />
          <circle cx="182" cy="48" r="10" fill="#fff" stroke="#d9cdf2" strokeWidth="2" />
          <text x="182" y="54" textAnchor="middle" fontSize="16" fontWeight="800" fill="#7c5cff">?</text>
        </g>
      )}
    </svg>
  )
}

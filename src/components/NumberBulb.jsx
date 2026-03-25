// ─── NumberBulb Component ─────────────────────────────────────────────────
// Uses the Bulb asset as the background for numbers.
// Glows when being dragged.

import { ASSETS } from '../utils/constants'

export default function NumberBulb({
  word,
  onDragStart,
  onShowHint,
  isDragging,
  isCorrect,
  isWrong,
  style,
}) {
  if (isCorrect) return null

  const handleMouseDown = (e) => {
    e.preventDefault()
    onDragStart(e, word)
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: isDragging ? 9999 : 10,
        transition: 'all 0.2s ease',
        transform: isDragging ? 'scale(1.15)' : 'scale(1)',
        filter: isDragging
          ? 'drop-shadow(0 0 20px rgba(253, 224, 71, 0.8))'
          : 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
        ...style,
      }}
    >
      {/* ── Bulb background ── */}
      <img
        src={ASSETS.bulb}
        alt=""
        draggable={false}
        style={{ 
          width: 240, 
          height: 240, 
          objectFit: 'contain',
          filter: isDragging ? 'brightness(1.2) contrast(1.1)' : 'brightness(0.9)',
          transition: 'filter 0.3s ease',
        }}
      />

      {/* ── Number text — centered on the bulb ── */}
      <div style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: "'Courier New', 'Consolas', monospace",
          fontWeight: 900,
          fontSize: word.text.length > 4 ? 22 : 32,
          color: '#1e293b',
          letterSpacing: 1,
          pointerEvents: 'none',
          textShadow: '0 0 1px rgba(255,255,255,0.8)',
        }}>
          {word.text}
        </span>
        
        {/* ── '?' Hint Button ── */}
        <div 
          onClick={(e) => { e.stopPropagation(); onShowHint(word); }}
          onMouseEnter={() => onShowHint(word)}
          className="glass"
          style={{
            position: 'absolute',
            top: -50, right: 30,
            width: 32, height: 32,
            borderRadius: '50%',
            color: 'var(--accent-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900,
            cursor: 'help',
            boxShadow: '0 0 15px var(--accent-cyan)',
            border: '2px solid var(--accent-cyan)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            pointerEvents: 'auto',
            zIndex: 100,
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.25)'; e.currentTarget.style.boxShadow = '0 0 25px var(--accent-cyan)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 15px var(--accent-cyan)'; }}
        >
          ?
        </div>
      </div>

      {/* ── Red flash border on wrong drop ── */}
      {isWrong && (
        <div style={{
          position: 'absolute',
          inset: -10,
          border: '5px solid #ef4444',
          borderRadius: 20,
          animation: 'flash-shake 0.5s ease',
          pointerEvents: 'none',
          zIndex: 20,
        }} />
      )}

      <style>{`
        @keyframes flash-shake {
          0%, 100% { transform: translateX(0); opacity: 1; }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

import React from 'react';
import { ASSETS } from '../utils/constants';

export default function StartScreen({ onStart, onTutorial }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `url(${ASSETS.factoryBg}) center/cover no-repeat`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20000,
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }}>
      {/* ── Overlay for Glassmorphism effect ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
      }} />

      <div className="glass" style={{
        position: 'relative',
        padding: '60px 80px',
        borderRadius: 40,
        textAlign: 'center',
        border: '4px solid var(--accent-cyan)',
        boxShadow: '0 0 100px rgba(34, 211, 238, 0.25), 0 32px 64px rgba(0,0,0,0.8)',
        maxWidth: 600,
        animation: 'scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* ── Logo ── */}
        <div style={{
          marginBottom: 30,
          animation: 'float-up-down 3s ease-in-out infinite',
        }}>
          <img 
            src={ASSETS.robotGuide} 
            alt="Robot Logo" 
            style={{ width: 140, height: 140, filter: 'drop-shadow(0 0 20px var(--accent-cyan))' }} 
          />
        </div>

        {/* ── Title ── */}
        <h1 style={{
          fontSize: 48,
          margin: '0 0 10px 0',
          color: 'var(--accent-cyan)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: 4,
          textShadow: '0 0 30px rgba(34, 211, 238, 0.6)',
        }}>
          Number Sort Factory
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 40, fontWeight: 500 }}>
          Master the math logic on the assembly line! 🏭
        </p>

        {/* ── Buttons ── */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          <button 
            onClick={onTutorial}
            className="btn-premium"
            style={{
              padding: '18px 30px',
              fontSize: 18,
              background: 'rgba(34, 211, 238, 0.15)',
              border: '2px solid var(--accent-cyan)',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.25)',
              color: 'var(--accent-cyan)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(34, 211, 238, 0.25)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(34, 211, 238, 0.15)'; }}
          >
            📖 How to Play
          </button>
          
          <button 
            onClick={onStart}
            className="btn-premium"
            style={{
              padding: '18px 40px',
              fontSize: 18,
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 0 35px rgba(34, 211, 238, 0.4)',
            }}
          >
            🚀 Start Game
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float-up-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}

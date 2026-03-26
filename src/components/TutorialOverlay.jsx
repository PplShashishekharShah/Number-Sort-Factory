import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../utils/constants';
import { speak, stopSpeech } from '../utils/voice';

const TUTORIAL_STEPS = [
  {
    id: 0,
    text: "Welcome to the Number Sort Factory! I'm your guide. 🤖",
  },
  {
    id: 1,
    text: "Your goal: Sort bulbs into the correct bins below. 🏭",
  },
  {
    id: 2,
    text: "Look! A new bulb is arriving on the belt... 📦",
    action: 'bulb_arrive',
  },
  {
    id: 3,
    text: "Need help? Click '?' for a hint on the monitor! 💡",
    action: 'show_hint',
  },
  {
    id: 4,
    text: "Let's sort this '2'. It's a Prime number! ⭐",
    action: 'drag_correct_1',
  },
  {
    id: 5,
    text: "Great! Now let's try a Multiple of 5... 🎯",
    action: 'drag_correct_2',
  },
  {
    id: 6,
    text: "Warning! Wrong bins make the bulb flash red. 🛑",
    action: 'drag_wrong',
  },
  {
    id: 7,
    text: "Ready to start? Let's go and have fun! 🚀",
  }
];

export default function TutorialOverlay({ onComplete, onSkip }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [handPos, setHandPos] = useState({ x: -100, y: -100, opacity: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [demoBulb, setDemoBulb] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  
  const timerRef = useRef(null);
  const step = TUTORIAL_STEPS[stepIdx];

  // Automatic Step Progression (Synced with Voice)
  useEffect(() => {
    if (stepIdx >= TUTORIAL_STEPS.length) {
      onComplete();
      return;
    }

    setWrongFlash(false);
    setHintActive(false);

    if (step.action === 'bulb_arrive') {
      runBulbArrive();
    } else if (step.action === 'show_hint') {
      runHintDemo();
    } else if (step.action === 'drag_correct_1') {
      runDragDemo(400, '2', '25%', true);
    } else if (step.action === 'drag_correct_2') {
      runDragDemo(400, '10', '55%', true);
    } else if (step.action === 'drag_wrong') {
      runDragDemo(400, '7', '55%', false);
    } else {
      setHandPos(h => ({ ...h, opacity: 0 }));
    }

    // VOICE SYNC: Speak and then move to next step when done
    speak(step.text, true, 1.2, () => {
      // Small delay after speaking before next step
      timerRef.current = setTimeout(() => {
        setStepIdx(s => s + 1);
      }, 800);
    });

    return () => {
      clearTimeout(timerRef.current);
      stopSpeech();
    };
  }, [stepIdx]);

  const BULB_Y = 415; 

  const runBulbArrive = () => {
    setDemoBulb({ text: '2', x: -100, y: BULB_Y });
    setTimeout(() => {
      setDemoBulb(b => b ? { ...b, x: 400 } : null);
    }, 100);
  };

  const runHintDemo = () => {
    if (!demoBulb) setDemoBulb({ text: '2', x: 400, y: BULB_Y });
    setTimeout(() => {
      setHandPos({ x: 400 + 40, y: BULB_Y + 10, opacity: 1 });
      setTimeout(() => {
        setIsGrabbing(true); 
        setHintActive(true);
        setTimeout(() => setIsGrabbing(false), 300);
      }, 1000);
    }, 500);
  };

  const runDragDemo = (startX, text, binLeft, isCorrect) => {
    setDemoBulb({ text, x: startX, y: BULB_Y });
    setHandPos({ x: startX + 100, y: BULB_Y + 100, opacity: 0 });

    setTimeout(() => {
      setHandPos({ x: startX, y: BULB_Y, opacity: 1 });
      setTimeout(() => {
        setIsGrabbing(true);
        setTimeout(() => {
          const binX = binLeft === '25%' ? window.innerWidth * 0.25 + 100 : window.innerWidth * 0.55 + 100;
          const binY = window.innerHeight - 150;
          setHandPos({ x: binX, y: binY, opacity: 1 });
          setDemoBulb({ text, x: binX, y: binY });
          setTimeout(() => {
            setIsGrabbing(false);
            if (isCorrect) {
              setDemoBulb(null);
            } else {
              setWrongFlash(true);
              setTimeout(() => setDemoBulb(null), 800);
            }
            setTimeout(() => setHandPos(h => ({ ...h, opacity: 0 })), 500);
          }, 1200);
        }, 1000);
      }, 700);
    }, 300);
  };

  const handleNext = () => {
    stopSpeech();
    setStepIdx(s => s + 1);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30000,
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }}>
      
      {/* ── Robot Character & Speech Bubble (Right Side) ── */}
      <div style={{
        position: 'absolute', right: 20, top: '45%', transform: 'translateY(-50%)',
        width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 30005, pointerEvents: 'none',
      }}>
        {/* Speech Bubble */}
        <div style={{ position: 'relative', marginBottom: -15, width: '100%' }}>
          <img
            src={ASSETS.bubble}
            alt=""
            style={{ 
              width: '100%', 
              filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.5)) hue-rotate(185deg) brightness(1.1) saturate(0.8)',
            }}
          />
          <div style={{
            position: 'absolute', top: '25%', left: '20%', right: '20%', bottom: '30%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            fontWeight: 900, fontSize: 13, color: '#1e293b', paddingLeft: '40px', paddingRight: '20px',
          }}>
            {step?.text}
          </div>
        </div>

        {/* Robot */}
        <img
          src={ASSETS.robotGuide}
          alt=""
          style={{
            width: 300, height: 'auto', filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.8))',
            animation: 'robot-hover 3s ease-in-out infinite',
            transform: 'scaleX(-1)',
          }}
        />
      </div>

      {/* ── Monitor Hint Projection ── */}
      {hintActive && (
        <div className="glass" style={{
          position: 'absolute', top: '29%', left: '42.2%', width: '15.2%', height: '15.2%',
          background: 'rgba(34, 211, 238, 0.2)', border: '2px solid var(--accent-cyan)',
          zIndex: 30002, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'hint-flicker 0.2s infinite',
        }}>
           <div style={{ textAlign: 'center' }}>
             <h4 style={{ margin: 0, color: 'var(--accent-cyan)', fontSize: 18, fontWeight: 900 }}>{demoBulb?.text}</h4>
             <p style={{ margin: 0, color: '#fff', fontSize: 10, fontWeight: 600 }}>HINT ACTIVE</p>
           </div>
        </div>
      )}

      {/* ── Hand Emoji ── */}
      <div style={{
        position: 'absolute', left: handPos.x, top: handPos.y, fontSize: 70,
        transition: 'all 1s ease-in-out', opacity: handPos.opacity,
        zIndex: 30010, pointerEvents: 'none',
        transform: `translate(-50%, -50%) ${isGrabbing ? 'scale(1.2)' : 'scale(1)'}`,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
      }}>
        🫳
      </div>

      {/* ── Demo Bulb ── */}
      {demoBulb && (
        <div style={{
          position: 'absolute', left: demoBulb.x, top: demoBulb.y,
          transform: `translate(-50%, -50%) scale(${isGrabbing ? 1.4 : 1})`,
          transition: 'left 1.2s ease-in-out, top 1.2s ease-in-out',
          zIndex: 30009, pointerEvents: 'none',
          filter: isGrabbing 
            ? 'drop-shadow(0 0 35px rgba(253, 224, 71, 0.9)) drop-shadow(0 0 10px rgba(253, 224, 71, 0.5))' 
            : 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
        }}>
           <img src={ASSETS.bulb} alt="" style={{ width: 240, height: 240, objectFit: 'contain', filter: isGrabbing ? 'brightness(1.2)' : 'brightness(0.9)' }} />
           <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', textAlign: 'center' }}>
             <span style={{ fontFamily: "'Courier New', 'Consolas', monospace", fontWeight: 900, fontSize: 25, color: '#1e293b', lineHeight: 0.72 }}>{demoBulb.text}</span>
           </div>
           
           {/* Hint Tooltip (Lowered further as requested) */}
           {!isGrabbing && (
             <div style={{
               position: 'absolute', top: 10, right: 35, width: 32, height: 32,
               borderRadius: '50%', border: '2px solid var(--accent-cyan)', background: 'rgba(0,0,0,0.6)',
               color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900,
             }}>?</div>
           )}

           {wrongFlash && (
              <div style={{
                position: 'absolute', inset: -10, border: '6px solid #ef4444', borderRadius: '50%',
                animation: 'flash-shake 0.5s ease',
              }} />
           )}
        </div>
      )}

      {/* ── Control Buttons ── */}
      <div style={{
        position: 'absolute', bottom: 40, left: 20, 
        display: 'flex', gap: 15, zIndex: 30020,
      }}>
        <button 
          onClick={onSkip} className="glass"
          style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 800, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
        >
          Skip Tutorial
        </button>
        <button 
          onClick={handleNext} className="btn-premium"
          style={{ padding: '8px 20px', borderRadius: 10, fontSize: 13, minWidth: 90 }}
        >
          {stepIdx === TUTORIAL_STEPS.length - 1 ? "Start! 🚀" : "Next"}
        </button>
      </div>

      <style>{`
        @keyframes robot-hover {
          0%, 100% { transform: translateY(0) scaleX(-1); }
          50%       { transform: translateY(-20px) scaleX(-1); }
        }
        @keyframes flash-shake {
          0%, 100% { transform: translateX(0); opacity: 1; }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-8px); }
          80%       { transform: translateX(8px); }
        }
        @keyframes hint-flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

interface AlvidaSpriteProps {
  state: 'idle' | 'patrol' | 'chasing' | 'stunned' | 'attacking';
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
}

export const AlvidaSprite: React.FC<AlvidaSpriteProps> = ({ state, direction = 'down', hp }) => {
  const [frame, setFrame] = useState(0);

  // Micro walking / breathing cycles
  useEffect(() => {
    let delay = 220;
    if (state === 'chasing') delay = 130;  // moves aggressively!
    if (state === 'stunned') delay = 90;    // vibrates quickly!

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isAttacking = state === 'attacking';
  const isChasing = state === 'chasing';

  // Hair bouncing offsets
  let hairY = 0;
  let bodyY = 0;
  let maceAngle = 12;
  let scaleX = 1;

  if (state === 'chasing') {
    // Aggressive sprinting tilt
    bodyY = frame % 2 === 0 ? 0.8 : -0.8;
    hairY = frame % 2 === 0 ? 1.2 : -0.5;
    maceAngle = frame % 2 === 0 ? 35 : -10;
  } else if (isStunned) {
    // Comical dizzy vibration offsets
    bodyY = frame % 2 === 0 ? 1.5 : -1.5;
    hairY = frame % 2 === 0 ? -1.5 : 1.5;
    maceAngle = frame * 45;
  } else {
    // Light breathing idle
    bodyY = frame === 1 || frame === 3 ? 0.3 : 0;
    hairY = frame === 1 || frame === 3 ? 0.6 : 0;
  }

  // Facing flips for horizontal symmetry
  if (direction === 'left') {
    scaleX = -1;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 64 64" 
        className="w-14 h-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]"
        style={{ transform: `scaleX(${scaleX})` }}
      >
        {/* Shadow */}
        <rect x="18" y="52" width="28" height="4" rx="2" fill="rgba(15,23,42,0.55)" />

        {/* --- BACK HAIR (Fucsia Curly Volume) --- */}
        <g style={{ transform: `translateY(${hairY}px)` }}>
          {/* Big puffy curly background hair bulbs */}
          <rect x="9" y="18" width="18" height="18" rx="9" fill="#EC4899" stroke="#9D174D" strokeWidth="1.8" />
          <rect x="37" y="18" width="18" height="18" rx="9" fill="#EC4899" stroke="#9D174D" strokeWidth="1.8" />
          <rect x="6.5" y="28.5" width="19" height="19" rx="9.5" fill="#DB2777" stroke="#9D174D" strokeWidth="1.8" />
          <rect x="38.5" y="28.5" width="19" height="19" rx="9.5" fill="#DB2777" stroke="#9D174D" strokeWidth="1.8" />
          <rect x="15" y="36" width="16" height="16" rx="8" fill="#BE185D" stroke="#9D174D" strokeWidth="1.5" />
          <rect x="33" y="36" width="16" height="16" rx="8" fill="#BE185D" stroke="#9D174D" strokeWidth="1.5" />

          {/* Central top knot ponytail / high bun */}
          <rect x="25.5" y="3.5" width="13" height="15" rx="6.5" fill="#F43F5E" stroke="#9D174D" strokeWidth="1.8" />
          <rect x="28.5" y="15" width="7" height="3" rx="0.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
        </g>

        {/* --- CHARACTER BODY ASSEMBLY --- */}
        <g style={{ transform: `translateY(${bodyY}px)` }}>
          {/* Boots */}
          <rect x="23" y="47" width="5.5" height="8" rx="1.5" fill="#451A03" stroke="#270F01" strokeWidth="1.5" />
          <rect x="33.5" y="47" width="5.5" height="8" rx="1.5" fill="#451A03" stroke="#270F01" strokeWidth="1.5" />
          <rect x="21" y="51" width="7.5" height="4.5" rx="1" fill="#78350F" />
          <rect x="33.5" y="51" width="7.5" height="4.5" rx="1" fill="#78350F" />

          {/* Blue pants */}
          <path d="M22,42 L42,42 L39,48 C36,49 28,49 25,48 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />

          {/* Golden belt and sash details */}
          <path d="M20,37 L44,37 L41,43 L23,43 Z" fill="#FBBF24" stroke="#9A3412" strokeWidth="1.5" />
          <path d="M22,39 H42" stroke="#D97706" strokeWidth="1.2" />
          {/* Belt buckle */}
          <rect x="30" y="36.5" width="4.5" height="5.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />

          {/* Styled Sleeveless vest over striped undershirt */}
          <path d="M22,27 C22,23 25,23 32,23 C39,23 42,23 42,27 L41,38 L23,38 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.8" />
          {/* Undershirt white frill lines */}
          <rect x="25" y="25" width="14" height="12" fill="#FFFFFF" opacity="0.15" />
          <path d="M26,25 V37 M30,25 V37 M34,25 V37 M38,25 V37" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Lavender/pink neck collar scarf */}
          <path d="M26,23 L32,28 L38,23" stroke="#C084FC" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Arms */}
          <rect x="15.5" y="26.5" width="7" height="7" rx="3.5" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1" />
          <rect x="41.5" y="26.5" width="7" height="7" rx="3.5" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1" />

          {/* Head & Face */}
          <rect x="23" y="15" width="18" height="18" rx="9" fill="#FFE4E6" stroke="#970634" strokeWidth="1.8" />

          {/* Bright blushing cheeks */}
          <rect x="25" y="23.5" width="4" height="4" rx="2" fill="#F472B6" opacity="0.65" />
          <rect x="35" y="23.5" width="4" height="4" rx="2" fill="#F472B6" opacity="0.65" />

          {/* Face details: Eye Shock or Smirk */}
          {isStunned ? (
            <>
              {/* Massive shocked comically dizzy eyes */}
              <rect x="22.8" y="18.8" width="8.4" height="8.4" rx="4.2" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
              <rect x="32.8" y="18.8" width="8.4" height="8.4" rx="4.2" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
              <rect x="25.8" y="21.8" width="2.4" height="2.4" rx="1.2" fill="#000000" />
              <rect x="35.8" y="21.8" width="2.4" height="2.4" rx="1.2" fill="#000000" />
              {/* Shaking wavy mouth */}
              <path d="M28,29.5 Q32,28 36,29.5" stroke="#1E293B" strokeWidth="1.5" fill="none" />
              {/* Tiny crying teardrop */}
              <path d="M24,25 Q23,28 22,26 Z" fill="#38BDF8" />
            </>
          ) : (
            <>
              {/* Determination eyes and dark pupils */}
              <rect x="25.7" y="21.5" width="3.6" height="3" rx="1.5" fill="#0E172C" />
              <rect x="34.7" y="21.5" width="3.6" height="3" rx="1.5" fill="#0E172C" />
              {/* Thick dark pink eyebrows */}
              <path d="M25,20.5 Q27.5,19.5 29.5,21.5" stroke="#9D174D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M39,20.5 Q36.5,19.5 34.5,21.5" stroke="#9D174D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Arrogant smirk / pirate grin */}
              <path d="M29,28 Q32,29.5 35,28" stroke="#4C0519" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Front Curly Hair FrameLocks */}
          <path d="M23.5,21 S20,28 22.5,33" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M40.5,21 S44,28 41.5,33" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* --- THE IRON SPIKED MACE (MAZA DE HIERRO) COMPONENT --- */}
        {/* Attacking angle sweep, or default angle over her right hand */}
        {(() => {
          let rx = 14;
          let ry = 28;
          let rot = maceAngle;

          if (isAttacking) {
            rot = 135;
            rx = 26;
            ry = 18;
          } else if (direction === 'up') {
            rot = -25;
            rx = 12;
            ry = 26;
          }

          return (
            <g transform={`translate(${rx}, ${ry}) rotate(${rot} 16 16)`} className="transition-transform duration-150">
              {/* Wooden shaft handle */}
              <rect x="14.5" y="16" width="3" height="15" rx="1" fill="#4B5563" stroke="#1F2937" strokeWidth="1" />
              {/* Heavy Studded Iron Head */}
              <path d="M8,4 L24,4 L27,18 L5,18 Z" fill="#334155" stroke="#0F172A" strokeWidth="1.8" />
              <rect x="8" y="3.5" width="16" height="5" rx="2.5" fill="#475569" />

              {/* Steel shining studs (Spikes) */}
              <rect x="8.8" y="6.8" width="2.4" height="2.4" rx="1.2" fill="#E2E8F0" />
              <rect x="14.8" y="6.8" width="2.4" height="2.4" rx="1.2" fill="#E2E8F0" />
              <rect x="20.8" y="6.8" width="2.4" height="2.4" rx="1.2" fill="#E2E8F0" />
              <rect x="9.8" y="11.8" width="2.4" height="2.4" rx="1.2" fill="#E2E8F0" />
              <rect x="14.8" y="11.8" width="2.4" height="2.4" rx="1.2" fill="#E2E8F0" />
              <rect x="19.8" y="11.8" width="2.4" height="2.4" rx="1.2" fill="#E2E8F0" />

              {/* Spike thorns sticking outward of the outline */}
              <polygon points="5,8 1.5,6 5,10" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="27,8 30.5,6 27,10" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="4,13 0.5,12 4,15" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="28,13 31.5,12 28,15" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="16,3 16,-1 19,2" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
            </g>
          );
        })()}

        {/* --- SWEEPING CRESCENT COMBAT SWIPE EFFECT --- */}
        {isAttacking && (
          <g className="animate-ping">
            {/* Swirling energy arc */}
            <path 
              d="M 6 36 A 26 26 0 0 1 58 36" 
              stroke="#FEE2E2" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.8" 
            />
            {/* Sparkling star bursts around impact center */}
            <polygon points="48,16 52,8 55,14 62,14 56,19 59,26 52,22 47,26 49,19" fill="#FBBF24" />
          </g>
        )}
      </svg>
    </div>
  );
};

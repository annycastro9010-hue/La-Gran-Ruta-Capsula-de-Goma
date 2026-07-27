import React, { useState, useEffect } from 'react';
import { Direction } from '../types';

interface MarineSpriteProps {
  type: 'marine' | 'helmeppo' | 'morgan';
  state: 'idle' | 'patrolling' | 'chasing' | 'stunned';
  direction?: Direction;
  hp?: number;
}

const C_OUTLINE = "#18181b";
const C_SKIN = "#ffedd5";
const C_SKIN_SHADOW = "#fca5a5";
const C_NAVY_WHITE = "#f8fafc";
const C_NAVY_BLUE = "#1e3a8a";
const C_GOLD = "#f59e0b";
const C_STEEL = "#94a3b8";
const C_RED = "#dc2626";

export const MarineSprite: React.FC<MarineSpriteProps> = ({ 
  type, 
  state, 
  direction = 'down' 
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let delay = 240;
    if (state === 'chasing') delay = 120;
    if (state === 'stunned') delay = 80;

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isChasing = state === 'chasing';
  const isBoss = type === 'morgan';

  let dy = 0;
  let dx = 0;
  let axeAngle = 0;
  let scaleX = direction === 'left' ? -1 : 1;

  if (isChasing) {
    dy = frame % 2 === 0 ? 0.8 : -0.8;
    dx = frame % 2 === 0 ? 0.4 : -0.4;
    axeAngle = frame % 2 === 0 ? 30 : -10;
  } else if (isStunned) {
    dy = frame % 2 === 0 ? 1.4 : -1.4;
    dx = frame % 2 === 0 ? -1.2 : 1.2;
    axeAngle = frame * 40;
  } else {
    dy = frame === 1 || frame === 3 ? 0.4 : 0;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 24 24" 
        className={isBoss ? "w-14 h-14 drop-shadow-[0_4px_10px_rgba(220,38,38,0.7)]" : "w-11 h-11 drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]"}
        style={{ 
          imageRendering: 'pixelated',
          transform: `scaleX(${scaleX})`
        }}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Floor Shadow */}
        <rect x="7" y="21.5" width="10" height="2" rx="1" fill="#000000" opacity="0.38" />

        <g style={{ transform: `translate(${dx}px, ${dy}px)`, transformOrigin: '12px 22px' }}>
          
          {type === 'morgan' ? (
            /* ========================================================================= */
            /* 1. COMANDANTE HACHA-HIERRO (BOSS IRON-AXE MORGAN)                         */
            /* ========================================================================= */
            <g id="iron-axe-boss">
              {/* Massive Boots */}
              <rect x="7.5" y="19" width="3" height="3" fill="#0f172a" />
              <rect x="13.5" y="19" width="3" height="3" fill="#0f172a" />

              {/* White Military Trousers */}
              <rect x="7.5" y="15" width="9" height="4" fill={C_NAVY_WHITE} />
              <rect x="7" y="15" width="10" height="0.8" fill={C_OUTLINE} />

              {/* Blue & Gold Military Coat */}
              <rect x="6.5" y="9.5" width="11" height="6" fill={C_NAVY_BLUE} />
              <rect x="6" y="9.5" width="2.2" height="1.5" fill={C_GOLD} /> {/* Epaulet L */}
              <rect x="15.8" y="9.5" width="2.2" height="1.5" fill={C_GOLD} /> {/* Epaulet R */}
              <rect x="11.2" y="10" width="1.6" height="5.5" fill={C_RED} /> {/* Red inner sash */}

              {/* Head & Metal Jaw */}
              <rect x="10.8" y="8" width="2.4" height="1.8" fill={C_SKIN} />
              <rect x="8" y="3.5" width="8" height="5" fill={C_SKIN} />

              {/* Iron Jaw Mask */}
              <rect x="7.8" y="6" width="8.4" height="3" fill={C_STEEL} />
              <line x1="8" y1="7.5" x2="16" y2="7.5" stroke={C_OUTLINE} strokeWidth="0.8" />
              <rect x="11" y="6.5" width="2" height="2" fill={C_GOLD} /> {/* Metal Jaw Emblem */}

              {/* Blonde Hair & Military Cap */}
              <rect x="8" y="2" width="8" height="2.5" fill="#facc15" />
              <rect x="7" y="1.5" width="10" height="1.5" fill={C_NAVY_BLUE} /> {/* Cap Visor */}
              <rect x="11" y="1.5" width="2" height="1" fill={C_GOLD} />

              {/* Evil Red Eyes */}
              {isStunned ? (
                <>
                  <rect x="8.5" y="4.5" width="2" height="2" rx="1" fill="#ffffff" />
                  <rect x="13.5" y="4.5" width="2" height="2" rx="1" fill="#ffffff" />
                  <rect x="9" y="5" width="1" height="1" fill="#000000" />
                  <rect x="14" y="5" width="1" height="1" fill="#000000" />
                </>
              ) : (
                <>
                  <rect x="9" y="4.5" width="1.5" height="1.2" fill={C_RED} />
                  <rect x="13.5" y="4.5" width="1.5" height="1.2" fill={C_RED} />
                </>
              )}

              {/* GIANT IRON AXE ARM (RIGHT HAND IS A HUGE AXE BLADE!) */}
              <g transform={`translate(16, 12) rotate(${axeAngle} 0 0)`}>
                <rect x="0" y="-1.5" width="5" height="3" fill={C_STEEL} stroke={C_OUTLINE} strokeWidth="0.6" />
                {/* Crescent Axe Blade */}
                <path d="M 4 -7 C 9 -4, 9 4, 4 7 L 2 4 L 2 -4 Z" fill={C_STEEL} stroke={C_OUTLINE} strokeWidth="0.8" />
                <path d="M 5 -5 C 8 -2, 8 2, 5 5" stroke="#ffffff" strokeWidth="0.8" fill="none" /> {/* Shininess */}
              </g>
            </g>
          ) : (
            /* ========================================================================= */
            /* 2. CENTINELAS DE LA LEY / MARINOS REGULARES & HELMEPPO                   */
            /* ========================================================================= */
            <g id="marine-sentinel">
              {/* Black Boots */}
              <rect x="8.2" y="19.5" width="2.2" height="2.5" fill="#0f172a" />
              <rect x="13.6" y="19.5" width="2.2" height="2.5" fill="#0f172a" />

              {/* Dark Navy Blue Pants */}
              <rect x="8.5" y="16" width="7" height="3.8" fill={C_NAVY_BLUE} />

              {/* Crisp White Sailor Shirt with Blue Scarf */}
              <rect x="7.8" y="10.5" width="8.4" height="6" fill={C_NAVY_WHITE} />
              <path d="M 9 10.5 L 12 13 L 15 10.5" stroke={C_NAVY_BLUE} strokeWidth="1.8" fill="none" />
              <rect x="7.8" y="16.5" width="8.4" height="0.8" fill={C_OUTLINE} />

              {/* Head & Skin */}
              <rect x="11.2" y="9.5" width="1.6" height="1.2" fill={C_SKIN} />
              <rect x="8.5" y="5" width="7" height="5" fill={C_SKIN} />

              {/* Marine Sailor Cap with Seagull / Law Emblem */}
              <rect x="7.8" y="2.5" width="8.4" height="3" fill={C_NAVY_WHITE} />
              <rect x="7" y="5" width="10" height="0.8" fill={C_NAVY_BLUE} />
              {/* Blue Cap Ribbon */}
              <rect x="10.5" y="3" width="3" height="1.5" fill={C_NAVY_BLUE} />

              {/* Face Details */}
              {isStunned ? (
                <>
                  <rect x="9" y="6.5" width="2" height="2" rx="1" fill="#ffffff" />
                  <rect x="13" y="6.5" width="2" height="2" rx="1" fill="#ffffff" />
                  <rect x="9.5" y="7" width="1" height="1" fill="#000000" />
                  <rect x="13.5" y="7" width="1" height="1" fill="#000000" />
                </>
              ) : (
                <>
                  <rect x="9.5" y="6.5" width="1" height="1" fill={C_OUTLINE} />
                  <rect x="13.5" y="6.5" width="1" height="1" fill={C_OUTLINE} />
                  <line x1="10.5" y1="8.5" x2="13.5" y2="8.5" stroke={C_OUTLINE} strokeWidth="0.8" />
                </>
              )}

              {/* Rifle / Spear Weapon */}
              <g transform={`translate(16.5, 12) rotate(${axeAngle - 15} 0 0)`}>
                <rect x="0" y="-8" width="1.2" height="16" fill="#78350f" stroke={C_OUTLINE} strokeWidth="0.5" />
                <path d="M 0.6 -12 L 2 -8 L -0.8 -8 Z" fill={C_STEEL} stroke={C_OUTLINE} strokeWidth="0.5" />
              </g>
            </g>
          )}

        </g>
      </svg>
    </div>
  );
};

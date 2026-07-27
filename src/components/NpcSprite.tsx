import React, { useState, useEffect } from 'react';

interface NpcSpriteProps {
  type: 'nina' | 'villager';
  isHappy?: boolean;
}

const C_OUTLINE = "#18181b";
const C_SKIN = "#ffedd5";
const C_HAIR_NINA = "#38bdf8";      // Cute cyan blue braids
const C_DRESS_NINA = "#f472b6";     // Bright pink girl dress
const C_HAIR_VILLAGER = "#78350f";  // Brown hair
const C_SHIRT_VILLAGER = "#10b981"; // Emerald green villager shirt

export const NpcSprite: React.FC<NpcSpriteProps> = ({ type, isHappy = true }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 280);
    return () => clearInterval(timer);
  }, []);

  const dy = frame === 1 || frame === 3 ? 0.4 : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 24 24" 
        className="w-10 h-10 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" 
        style={{ imageRendering: 'pixelated' }}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="12" cy="21.5" rx="3.5" ry="1" fill="#000000" opacity="0.3" />

        <g style={{ transform: `translateY(${dy}px)`, transformOrigin: '12px 21px' }}>
          
          {type === 'nina' ? (
            /* ========================================================================= */
            /* 1. NINA - LA NIÑA DEL PUEBLO (RICE BALL SNACK GIRL)                       */
            /* ========================================================================= */
            <g id="nina-girl-npc">
              {/* Shoes */}
              <rect x="9" y="19.5" width="2" height="1.8" fill="#ec4899" />
              <rect x="13" y="19.5" width="2" height="1.8" fill="#ec4899" />

              {/* Cute Pink Dress with White Apron */}
              <path d="M 8 13 L 16 13 L 17 19.5 L 7 19.5 Z" fill={C_DRESS_NINA} />
              <rect x="9.5" y="13.5" width="5" height="6" fill="#ffffff" opacity="0.9" />

              {/* Head & Skin */}
              <rect x="11" y="10.5" width="2" height="1" fill={C_SKIN} />
              <rect x="8.5" y="6" width="7" height="5" fill={C_SKIN} />

              {/* Cyan Blue Braids */}
              <rect x="8" y="4.5" width="8" height="2.5" fill={C_HAIR_NINA} />
              {/* Left Braid */}
              <rect x="6.5" y="6" width="2" height="5" fill={C_HAIR_NINA} />
              {/* Right Braid */}
              <rect x="15.5" y="6" width="2" height="5" fill={C_HAIR_NINA} />

              {/* Big Cute Sparkly Eyes */}
              <circle cx="10" cy="8" r="0.9" fill="#000000" />
              <circle cx="14" cy="8" r="0.9" fill="#000000" />
              <rect x="9.7" y="7.7" width="0.4" height="0.4" fill="#ffffff" />
              <rect x="13.7" y="7.7" width="0.4" height="0.4" fill="#ffffff" />

              {/* Smile / Blushing Cheeks */}
              <circle cx="8.8" cy="9" r="0.8" fill="#f43f5e" opacity="0.6" />
              <circle cx="15.2" cy="9" r="0.8" fill="#f43f5e" opacity="0.6" />
              <path d="M 10.5 9.5 Q 12 10.5 13.5 9.5" stroke="#9f1239" strokeWidth="0.8" fill="none" />

              {/* Rice Ball Onigiri held in hands! 🍙 */}
              <g transform="translate(12, 14.5)" className="animate-bounce">
                <polygon points="0,-2 -2,1 2,1" fill="#ffffff" stroke={C_OUTLINE} strokeWidth="0.5" />
                <rect x="-1" y="-0.2" width="2" height="1" fill="#18181b" /> {/* Nori Seaweed */}
              </g>
            </g>
          ) : (
            /* ========================================================================= */
            /* 2. ALDEANO DEL PUEBLO SHELLPORT                                           */
            /* ========================================================================= */
            <g id="town-villager-npc">
              <rect x="8.5" y="19" width="2" height="2" fill="#451a03" />
              <rect x="13.5" y="19" width="2" height="2" fill="#451a03" />

              <rect x="8.5" y="15" width="7" height="4" fill="#334155" />
              <rect x="8" y="10.5" width="8" height="5" fill={C_SHIRT_VILLAGER} />

              <rect x="11.2" y="9.5" width="1.6" height="1" fill={C_SKIN} />
              <rect x="8.5" y="5" width="7" height="5" fill={C_SKIN} />

              <rect x="8" y="3.5" width="8" height="2" fill={C_HAIR_VILLAGER} />
              <rect x="9.5" y="6.5" width="1" height="1" fill={C_OUTLINE} />
              <rect x="13.5" y="6.5" width="1" height="1" fill={C_OUTLINE} />
              <line x1="10.5" y1="8.5" x2="13.5" y2="8.5" stroke={C_OUTLINE} strokeWidth="0.8" />
            </g>
          )}

        </g>
      </svg>
    </div>
  );
};

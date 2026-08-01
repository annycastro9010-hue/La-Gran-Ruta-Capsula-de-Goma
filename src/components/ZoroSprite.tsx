import React, { useState, useEffect } from 'react';

interface ZoroSpriteProps {
  isChained: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  actionState?: 'idle' | 'attacking' | 'victory';
}

const C_OUTLINE = "#18181b";
const C_HAIR_GREEN = "#16a34a";      // Bright Zoro moss green hair
const C_HAIR_SHADOW = "#15803d";
const C_SKIN = "#ffedd5";            // Peach skin
const C_SKIN_SHADOW = "#fca5a5";
const C_HARAMAKI = "#166534";        // Iconic green waist sash
const C_PANTS_BLACK = "#1e293b";     // Dark trousers
const C_BANDANA_BLACK = "#0f172a";   // Black head bandana
const C_KATANA_SABBARD = "#15803d";  // Green 3 Katana scabbards
const C_STEEL = "#cbd5e1";           // Blade steel

export const ZoroSprite: React.FC<ZoroSpriteProps> = ({ 
  isChained, 
  direction = 'down',
  actionState = 'idle' 
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, isChained ? 300 : 180);
    return () => clearInterval(timer);
  }, [isChained]);

  let dy = 0;
  let dx = 0;
  let scaleX = direction === 'left' ? -1 : 1;

  if (isChained) {
    // Shivering/tensed up while tied to post
    dy = frame % 2 === 0 ? 0.4 : -0.4;
  } else {
    // Breathing idle in combat stance
    dy = frame === 1 || frame === 3 ? 0.5 : 0;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 24 24" 
        className="w-12 h-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]" 
        style={{ 
          imageRendering: 'pixelated',
          transform: `scaleX(${scaleX})`
        }}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Floor Shadow */}
        <rect x="7" y="21.5" width="10" height="2" rx="1" fill="#000000" opacity="0.4" />

        <g style={{ transform: `translate(${dx}px, ${dy}px)`, transformOrigin: '12px 22px' }}>
          
          {isChained ? (
            /* ========================================================================= */
            /* 1. ZACK ENCADENADO AL POSTE CENTRAL DE MADERA (LEVEL 2 SHELLPORT)        */
            /* ========================================================================= */
            <g id="zack-chained">
              {/* Central Execution Wooden Stake Post behind Zack */}
              <rect x="10.5" y="1" width="3" height="21" fill="#78350f" />
              <rect x="11" y="1" width="1" height="21" fill="#b45309" />
              <rect x="10" y="1" width="4" height="1.5" fill="#451a03" />

              {/* Black Boots */}
              <rect x="8.5" y="19.5" width="2.2" height="2.5" fill="#0f172a" />
              <rect x="13.3" y="19.5" width="2.2" height="2.5" fill="#0f172a" />

              {/* Dark Trousers */}
              <rect x="8.5" y="16.5" width="7" height="3" fill={C_PANTS_BLACK} />
              <rect x="8" y="16.5" width="8" height="0.8" fill={C_OUTLINE} />

              {/* Green Haramaki Belt */}
              <rect x="8.5" y="13.5" width="7" height="3" fill={C_HARAMAKI} />
              <rect x="9" y="14" width="6" height="1" fill="#22c55e" opacity="0.6" />

              {/* White Open Sailor Shirt tied back */}
              <rect x="8" y="10" width="8" height="3.5" fill="#f8fafc" />
              <polygon points="10.5,10 13.5,10 12,12.5" fill={C_SKIN} />

              {/* Chains Wrapping Around Arms and Torso */}
              <rect x="6.5" y="11" width="11" height="1.2" fill="#94a3b8" />
              <rect x="7" y="13" width="10" height="1.2" fill="#94a3b8" />
              <rect x="6.5" y="11" width="1" height="3.2" fill="#64748b" />
              <rect x="16.5" y="11" width="1" height="3.2" fill="#64748b" />

              {/* Neck and Head */}
              <rect x="11.2" y="9" width="1.6" height="1.2" fill={C_SKIN} />
              <rect x="8.5" y="4.5" width="7" height="5" fill={C_SKIN} />

              {/* Intense Defiant Eyes */}
              <rect x="9.5" y="6" width="1.2" height="1.2" fill={C_OUTLINE} />
              <rect x="13.5" y="6" width="1.2" height="1.2" fill={C_OUTLINE} />
              {/* Dark Grin */}
              <line x1="10.5" y1="8" x2="13.5" y2="8" stroke={C_OUTLINE} strokeWidth="0.9" />

              {/* Iconic Green Spiky Hair */}
              <rect x="8.5" y="2.5" width="7" height="2.5" fill={C_HAIR_GREEN} />
              <polygon points="7.5,4.5 9,2 10.5,4.5" fill={C_HAIR_GREEN} />
              <polygon points="11,3 12.5,1 14,3" fill={C_HAIR_GREEN} />
              <polygon points="13.5,4.5 15,2 16.5,4.5" fill={C_HAIR_GREEN} />

              {/* Black Bandana tied on his left bicep */}
              <rect x="6.5" y="10.5" width="2" height="2" fill={C_BANDANA_BLACK} />

              {/* 3 Katana Scabbards resting beside the post */}
              <g transform="rotate(-15 7 14)">
                <rect x="4" y="10" width="1.2" height="10" fill={C_KATANA_SABBARD} />
                <rect x="5.5" y="10" width="1.2" height="10" fill="#991b1b" />
                <rect x="7" y="10" width="1.2" height="10" fill="#1e293b" />
                <rect x="3.5" y="9.5" width="5" height="0.8" fill="#f59e0b" /> {/* Sword Guards */}
              </g>
            </g>
          ) : (
            /* ========================================================================= */
            /* 2. ZACK LIBERADO (SANTORYU 3-KATANA COMBAT STANCE)                      */
            /* ========================================================================= */
            <g id="zack-free-combat">
              {/* Green Aura Shockwave around feet */}
              <rect x="5" y="15" width="14" height="6" rx="3" fill="#22c55e" opacity="0.18" className="animate-pulse" />

              {/* Boots */}
              <rect x="8" y="19" width="2.6" height="3" fill="#0f172a" />
              <rect x="13.4" y="19" width="2.6" height="3" fill="#0f172a" />

              {/* Trousers */}
              <rect x="8" y="15.5" width="8" height="4" fill={C_PANTS_BLACK} />

              {/* Green Haramaki Belt */}
              <rect x="8" y="12.5" width="8" height="3.2" fill={C_HARAMAKI} />
              <rect x="8.5" y="13" width="7" height="1" fill="#22c55e" opacity="0.7" />

              {/* White Open Vest */}
              <rect x="7.5" y="9.5" width="9" height="3.5" fill="#f8fafc" />
              <polygon points="10.5,9.5 13.5,9.5 12,12" fill={C_SKIN} />

              {/* Muscular Peach Arms Holding Katanas */}
              <rect x="5.5" y="9.5" width="2" height="4" fill={C_SKIN} />
              <rect x="16.5" y="9.5" width="2" height="4" fill={C_SKIN} />

              {/* Face & Head */}
              <rect x="11.2" y="8.5" width="1.6" height="1.2" fill={C_SKIN} />
              <rect x="8.5" y="4" width="7" height="5" fill={C_SKIN} />

              {/* Black Bandana tied over head in serious battle mode */}
              <rect x="8" y="2.5" width="8" height="2.8" fill={C_BANDANA_BLACK} />
              <rect x="7.5" y="4.5" width="9" height="1" fill="#334155" />

              {/* Green Hair Tufts sticking below bandana */}
              <rect x="7.5" y="5.2" width="1.2" height="2" fill={C_HAIR_GREEN} />
              <rect x="15.3" y="5.2" width="1.2" height="2" fill={C_HAIR_GREEN} />

              {/* Intense Battle Eyes */}
              <rect x="9.5" y="5.8" width="1.2" height="1.2" fill="#ffffff" />
              <rect x="13.5" y="5.8" width="1.2" height="1.2" fill="#ffffff" />
              <rect x="9.8" y="6" width="0.8" height="0.8" fill={C_OUTLINE} />
              <rect x="13.8" y="6" width="0.8" height="0.8" fill={C_OUTLINE} />

              {/* 3 KATANAS ASSEMBLY (SANTORYU!) */}
              {/* Katana 1: Held in Right Hand */}
              <g transform="rotate(-40 18 11)">
                <rect x="18" y="10" width="1.5" height="1.5" fill="#f59e0b" />
                <path d="M 19 10 L 19 -4 L 17 -3.5 L 17.5 10 Z" fill={C_STEEL} stroke={C_OUTLINE} strokeWidth="0.6" />
              </g>

              {/* Katana 2: Held in Left Hand */}
              <g transform="rotate(40 6 11)">
                <rect x="4.5" y="10" width="1.5" height="1.5" fill="#f59e0b" />
                <path d="M 5 10 L 5 -4 L 7 -3.5 L 6.5 10 Z" fill={C_STEEL} stroke={C_OUTLINE} strokeWidth="0.6" />
              </g>

              {/* Katana 3: Clenched in Teeth / Mouth! */}
              <g transform="translate(12, 7.5)">
                <rect x="-8" y="-0.8" width="16" height="1.6" fill={C_STEEL} stroke={C_OUTLINE} strokeWidth="0.6" />
                <rect x="-2" y="-1.2" width="4" height="2.4" fill="#f59e0b" /> {/* Mouth Guard */}
              </g>
            </g>
          )}

        </g>
      </svg>
    </div>
  );
};

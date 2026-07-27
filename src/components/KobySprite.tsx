import React, { useState, useEffect } from 'react';

interface KobySpriteProps {
  isScared: boolean;
}

// Pixel art palette exactly matching the classic anime sprite sheet
const C_OUTLINE = "#1e1b18";      // Black outline for crisp pixel aesthetics
const C_HAIR = "#f48fb1";         // Bright lavender pink locks
const C_HAIR_SHADOW = "#cc4e80";  // Deep pink shadow
const C_SKIN = "#ffedd5";         // Warm peach anime skin tone
const C_SKIN_SHADOW = "#fbcfe8";  // Blushed shadow
const C_GLASSES_FRAME = "#111111"; // Retro thick glasses frame
const C_GLASSES_BG = "#ffffff";    // Reflected high-contrast white lenses
const C_PUPIL = "#27272a";        // Dark focused pupil
const C_SHIRT_WHITE = "#f8fafc";   // Crisp white navy recruit shirt
const C_SHIRT_SHADOW = "#cbd5e1";  // Blue-gray clothing creases
const C_PANTS_NAVY = "#1e293b";    // Dark navy sailor trousers
const C_PANTS_SHADOW = "#0f172a";  // Midnight blue pants crease
const C_SHOES_BROWN = "#543820";   // Standard issue dark brown shoes

export const KobySprite: React.FC<KobySpriteProps> = ({ isScared }) => {
  const [frame, setFrame] = useState(0);

  // Maintain smooth looping animations matching classic gba timelines
  useEffect(() => {
    const delay = isScared ? 110 : 250; // Faster vibration if scared
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [isScared]);

  // Derive animation offsets for the frame-by-frame feel of the game's sprite engine
  let dx = 0;
  let dy = 0;
  let showSquat = false;
  let raisedShoulders = false;

  if (isScared) {
    // Timid trembling cycle
    if (frame === 1) { dx = -0.5; dy = -0.2; }
    else if (frame === 2) { dx = 0.5; dy = 0.2; raisedShoulders = true; }
    else if (frame === 3) { dx = -0.3; dy = 0.4; }
    else { raisedShoulders = true; }
  } else {
    // Normal deep-breathing idle sequence
    if (frame === 1 || frame === 3) {
      dy = 0.4;
      showSquat = true;
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 24 24" 
        className="w-12 h-12 drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]" 
        style={{ imageRendering: 'pixelated' }}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow floor base */}
        <rect x="7.5" y="21" width="9" height="2" rx="1" fill="#000" opacity="0.32" />

        <g style={{ transform: `translate(${dx}px, ${dy}px)`, transformOrigin: '12px 22px' }}>
          
          {/* --- LAYER 1: HAIR BACKSIDE & OUTLINES --- */}
          {/* Hair back bulk */}
          <rect x="7" y="3.5" width="10" height="7" fill={C_HAIR} />
          <rect x="8" y="2.5" width="8" height="1" fill={C_HAIR} />
          <rect x="6" y="5.5" width="12" height="4" fill={C_HAIR_SHADOW} />
          {/* Hair top-left lock highlights */}
          <rect x="9" y="3" width="3" height="1" fill="#fbcfe8" />
          
          {/* Hair outer dark boundaries */}
          <rect x="8" y="1.5" width="8" height="1" fill={C_OUTLINE} />
          <rect x="6" y="2.5" width="2" height="1" fill={C_OUTLINE} />
          <rect x="16" y="2.5" width="2" height="1" fill={C_OUTLINE} />
          <rect x="5" y="3.5" width="1" height="5" fill={C_OUTLINE} />
          <rect x="18" y="3.5" width="1" height="5" fill={C_OUTLINE} />

          {/* --- LAYER 2: PEACH SKIN & WORRIED FACE --- */}
          <rect x="7.5" y="8" width="9" height="6" fill={C_SKIN} />
          <rect x="7" y="10" width="1" height="3" fill={C_SKIN_SHADOW} />
          <rect x="16" y="10" width="1" height="3" fill={C_SKIN_SHADOW} />
          
          {/* Sideburns */}
          <rect x="7" y="8" width="1" height="3" fill={C_HAIR} />
          <rect x="16" y="8" width="1" height="3" fill={C_HAIR} />
          <rect x="7" y="9" width="1" height="1" fill={C_OUTLINE} />
          <rect x="16" y="9" width="1" height="1" fill={C_OUTLINE} />

          {/* Cute Round Glasses with bridge (Reflecting white as requested) */}
          {/* Left Lens white lens background */}
          <rect x="8" y="8.5" width="3" height="3" fill={C_GLASSES_FRAME} />
          <rect x="8.5" y="9" width="2" height="2" fill={C_GLASSES_BG} />
          <rect x="9.5" y="9" width="1" height="1" fill={C_PUPIL} /> {/* Tiny lens glint & eyes */}

          {/* Right Lens */}
          <rect x="13" y="8.5" width="3" height="3" fill={C_GLASSES_FRAME} />
          <rect x="13.5" y="9" width="2" height="2" fill={C_GLASSES_BG} />
          <rect x="14" y="9" width="1" height="1" fill={C_PUPIL} stroke={C_OUTLINE} strokeWidth="0.5" />

          {/* Glasses bridge */}
          <rect x="11" y="9.5" width="2" height="1" fill={C_GLASSES_FRAME} />

          {/* Worried squiggly nervous eyebrows */}
          <path d="M 8.5 7.5 L 10.5 8" stroke={C_OUTLINE} strokeWidth="0.8" />
          <path d="M 15.5 7.5 L 13.5 8" stroke={C_OUTLINE} strokeWidth="0.8" />

          {/* Timid quivering mouth */}
          {isScared ? (
            <path d="M 10.5 12.5 L 11 12 L 12 12.5 L 12.5 12 L 13.5 12.5" stroke="#991b1b" strokeWidth="0.85" />
          ) : (
            <line x1="11" y1="12.5" x2="13" y2="12.5" stroke="#4b5563" strokeWidth="0.8" />
          )}

          {/* Animated Sweat droplet from temple (Sign of classic anime shyness/scared) */}
          {isScared && (
            <g style={{ transform: `translate(${(frame % 2) * 0.3}px, ${(frame % 3) * 0.5}px)` }}>
              <rect x="17.5" y="8" width="1" height="1" fill="#38bdf8" />
              <rect x="17" y="9" width="1" height="1.5" fill="#0284c7" />
            </g>
          )}

          {/* --- LAYER 3: CLOTHING, SHOULDER POSES, AND ARMS --- */}
          {/* Neck connection */}
          <rect x="11.5" y="13.5" width="1" height="1.5" fill={C_SKIN} />
          <rect x="11.5" y="14" width="1" height="1" fill={C_OUTLINE} />

          {/* Main torso white shirt */}
          <rect x="8.5" y="14.5" width="7" height="4.5" fill={C_SHIRT_WHITE} />
          <rect x="9" y="15" width="6" height="4" fill={C_SHIRT_SHADOW} opacity="0.4" />
          <rect x="8" y="14.5" width="8" height="1" fill={C_OUTLINE} />

          {isScared ? (
            /* TIMID PROTECTIVE POSTURE (Row 2: Fists tucked high up into chest, shivering shoulders) */
            <>
              {/* Left raised shoulder sleeve */}
              <rect x="7" y={raisedShoulders ? "13.2" : "13.8"} width="2" height="4" fill={C_SHIRT_WHITE} />
              <rect x="7" y={raisedShoulders ? "12.7" : "13.3"} width="2" height="1" fill={C_OUTLINE} />
              <rect x="6" y={raisedShoulders ? "13.2" : "13.8"} width="1" height="4" fill={C_OUTLINE} />
              <rect x="9" y={raisedShoulders ? "13.8" : "14.4"} width="1" height="3" fill={C_OUTLINE} fillOpacity="0.8" />

              {/* Left Peach Fist near cheeks */}
              <rect x="7" y={raisedShoulders ? "12" : "12.6"} width="2.2" height="1.8" fill={C_SKIN} />
              <rect x="7" y={raisedShoulders ? "11.6" : "12.2"} width="2" height="1" fill={C_OUTLINE} />
              <rect x="6.8" y={raisedShoulders ? "12" : "12.6"} width="1" height="1.8" fill={C_OUTLINE} />

              {/* Right raised shoulder sleeve */}
              <rect x="15" y={raisedShoulders ? "13.2" : "13.8"} width="2" height="4" fill={C_SHIRT_WHITE} />
              <rect x="15" y={raisedShoulders ? "12.7" : "13.3"} width="2" height="1" fill={C_OUTLINE} />
              <rect x="17" y={raisedShoulders ? "13.2" : "13.8"} width="1" height="4" fill={C_OUTLINE} />
              <rect x="14" y={raisedShoulders ? "13.8" : "14.4"} width="1" height="3" fill={C_OUTLINE} fillOpacity="0.8" />

              {/* Right Peach Fist near cheeks */}
              <rect x="15" y={raisedShoulders ? "12" : "12.6"} width="2.2" height="1.8" fill={C_SKIN} />
              <rect x="15" y={raisedShoulders ? "11.6" : "12.2"} width="2" height="1" fill={C_OUTLINE} />
              <rect x="16.8" y={raisedShoulders ? "12" : "12.6"} width="1" height="1.8" fill={C_OUTLINE} />
            </>
          ) : (
            /* QUIET ARMS DOWN POSTURE (Row 1: Arms relaxed hanging alongside the trousers) */
            <>
              {/* Left hanging white sleeve */}
              <rect x="7" y="15" width="1.8" height="3" fill={C_SHIRT_WHITE} />
              <rect x="7" y="15.5" width="1.2" height="2.5" fill={C_SHIRT_SHADOW} />
              <rect x="6" y="15" width="1" height="3" fill={C_OUTLINE} />
              
              {/* Left relaxed peach hand */}
              <rect x="7" y="18" width="1.8" height="1" fill={C_SKIN} />
              <rect x="7" y="19" width="1.8" height="1" fill={C_OUTLINE} />
              <rect x="6" y="18" width="1" height="1" fill={C_OUTLINE} />

              {/* Right hanging white sleeve */}
              <rect x="15.2" y="15" width="1.8" height="3" fill={C_SHIRT_WHITE} />
              <rect x="15.2" y="15.5" width="1.2" height="2.5" fill={C_SHIRT_SHADOW} />
              <rect x="17" y="15" width="1" height="3" fill={C_OUTLINE} />
              
              {/* Right relaxed peach hand */}
              <rect x="15.2" y="18" width="1.8" height="1" fill={C_SKIN} />
              <rect x="15.2" y="19" width="1.8" height="1" fill={C_OUTLINE} />
              <rect x="17" y="18" width="1" height="1" fill={C_OUTLINE} />
            </>
          )}

          {/* Under-clothing boundary lines */}
          <rect x="8.5" y="18.5" width="7" height="1" fill={C_OUTLINE} />

          {/* --- LAYER 4: SAILOR TROUSERS / NAVY PANTS --- */}
          <rect x="8.5" y="19" width="7" height="2.5" fill={C_PANTS_NAVY} />
          <rect x="9.5" y="19" width="5" height="2.5" fill={C_PANTS_SHADOW} />

          {/* Legs separated (Slightly squatting look if animated, shivering bent feet) */}
          {showSquat ? (
            <>
              {/* Left squatting leg */}
              <rect x="8" y="21.5" width="2.2" height="1" fill={C_PANTS_NAVY} />
              <rect x="8" y="21" width="2.2" height="1" fill={C_OUTLINE} />
              {/* Right squatting leg */}
              <rect x="13.8" y="21.5" width="2.2" height="1" fill={C_PANTS_NAVY} />
              <rect x="13.8" y="21" width="2.2" height="1" fill={C_OUTLINE} />
            </>
          ) : (
            <>
              {/* Normal standing legs */}
              <rect x="8.5" y="21.5" width="2.2" height="1" fill={C_PANTS_NAVY} />
              <rect x="8.5" y="21" width="2.2" height="1" fill={C_OUTLINE} />
              
              <rect x="13.3" y="21.5" width="2.2" height="1" fill={C_PANTS_NAVY} />
              <rect x="13.3" y="21" width="2.2" height="1" fill={C_OUTLINE} />
            </>
          )}

          {/* Pant side trim outlines */}
          <rect x="7.5" y="19.5" width="1" height="3" fill={C_OUTLINE} />
          <rect x="15.5" y="19.5" width="1" height="3" fill={C_OUTLINE} />

          {/* --- LAYER 5: BOOTS / SHOES --- */}
          {showSquat ? (
            <>
              {/* Left squatting boot */}
              <rect x="7.6" y="22.2" width="2.8" height="1" fill={C_SHOES_BROWN} />
              <rect x="7.6" y="22" width="2.8" height="0.5" fill={C_OUTLINE} />
              <rect x="7" y="22.2" width="1" height="1" fill={C_OUTLINE} />
              
              {/* Right squatting boot */}
              <rect x="13.6" y="22.2" width="2.8" height="1" fill={C_SHOES_BROWN} />
              <rect x="13.6" y="22" width="2.8" height="0.5" fill={C_OUTLINE} />
              <rect x="16" y="22.2" width="1" height="1" fill={C_OUTLINE} />
            </>
          ) : (
            <>
              {/* Normal boots layout */}
              <rect x="8.1" y="22.2" width="2.8" height="1" fill={C_SHOES_BROWN} />
              <rect x="8.1" y="22.1" width="2.8" height="0.5" fill={C_OUTLINE} />
              <rect x="7.5" y="22.2" width="1" height="1" fill={C_OUTLINE} />
              
              {/* Right boots layout */}
              <rect x="13.1" y="22.2" width="2.8" height="1" fill={C_SHOES_BROWN} />
              <rect x="13.1" y="22.1" width="2.8" height="0.5" fill={C_OUTLINE} />
              <rect x="15.5" y="22.2" width="1" height="1" fill={C_OUTLINE} />
            </>
          )}

          {/* Shoe floor outlines */}
          <rect x="8" y="23.2" width="3" height="0.5" fill={C_OUTLINE} />
          <rect x="13" y="23.2" width="3" height="0.5" fill={C_OUTLINE} />

        </g>
      </svg>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Direction } from '../types';

interface PirateSpriteProps {
  type: 'pirate' | 'pirate-officer';
  state: 'idle' | 'patrolling' | 'chasing' | 'stunned';
  direction: Direction;
}

// Retro pixel-art colors matching the Alvida Pirates style
const C_OUTLINE = "#1e1b18";
const C_SKIN = "#ffedd5";
const C_SKIN_SHADOW = "#fbcfe8";
const C_BANDANA_RED = "#dc2626";
const C_BANDANA_SHADOW = "#991b1b";
const C_SHIRT_WHITE = "#f8fafc";
const C_STRIPE_BLUE = "#2563eb";
const C_PANTS_BROWN = "#78350f";
const C_BOOTS_BLACK = "#1e293b";
const C_METAL_GRAY = "#94a3b8";
const C_GOLD = "#f59e0b";

export const PirateSprite: React.FC<PirateSpriteProps> = ({ type, state, direction }) => {
  const [frame, setFrame] = useState(0);

  // Set up smooth walking/breathing loop ticks matching retro frames
  useEffect(() => {
    let delay = 250;
    if (state === 'chasing') delay = 130;  // Run aggressively
    if (state === 'stunned') delay = 90;    // Shivering out of dizziness

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isChasing = state === 'chasing';

  let dx = 0;
  let dy = 0;
  let weaponAngle = 0;
  let scaleX = 1;

  // Horizontal flipping base on direction
  if (direction === 'left') {
    scaleX = -1;
  }

  // Animation offsets
  if (isChasing) {
    dy = frame % 2 === 0 ? 0.6 : -0.6;
    dx = frame % 2 === 0 ? 0.3 : -0.3;
    weaponAngle = frame % 2 === 0 ? 25 : -5;
  } else if (isStunned) {
    dy = frame % 2 === 0 ? 1.2 : -1.2;
    dx = frame % 2 === 0 ? -1.0 : 1.0;
    weaponAngle = frame * 30;
  } else {
    // idle / patrolling breathing
    dy = frame === 1 || frame === 3 ? 0.3 : 0;
    weaponAngle = frame === 1 || frame === 3 ? 5 : 0;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 24 24" 
        className="w-11 h-11 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" 
        style={{ 
          imageRendering: 'pixelated',
          transform: `scaleX(${scaleX})`
        }}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow base on floor */}
        <ellipse cx="12" cy="22" rx="4.5" ry="1.2" fill="#000000" opacity="0.35" />

        {/* --- CHARACTER BODY ASSEMBLY --- */}
        <g style={{ transform: `translate(${dx}px, ${dy}px)`, transformOrigin: '12px 22px' }}>
          
          {/* --- LAYER 1: BACK HAIR / BANDANA FLAPS --- */}
          {type === 'pirate' ? (
            // Regular pirate bandana knot flaps in the wind
            <g style={{ transform: isChasing ? `rotate(${frame % 2 === 0 ? -15 : 15}deg)` : undefined, transformOrigin: '6px 5px' }}>
              <rect x="4.5" y="4.5" width="2" height="2" fill={C_BANDANA_SHADOW} />
              <rect x="3.5" y="5.5" width="2.2" height="1.2" fill={C_BANDANA_RED} />
              <rect x="4" y="4" width="2" height="2" fill={C_OUTLINE} fillOpacity="0.4" />
            </g>
          ) : (
            // Officer pirate bandana ties or hat tails
            <g style={{ transform: isChasing ? `rotate(${frame % 2 === 0 ? 10 : -10}deg)` : undefined, transformOrigin: '5px 6px' }}>
              <rect x="4" y="6" width="3" height="3" fill="#6b7280" />
              <rect x="3" y="7.5" width="2" height="2.5" fill="#374151" />
            </g>
          )}

          {/* --- LAYER 2: LEGS & BOOTS --- */}
          {/* Left Boot */}
          <rect x="8.2" y="20" width="2.2" height="2.5" fill={C_BOOTS_BLACK} />
          <rect x="7.8" y="21.5" width="2.6" height="1" fill={C_OUTLINE} />
          {/* Right Boot */}
          <rect x="13.2" y="20" width="2.2" height="2.5" fill={C_BOOTS_BLACK} />
          <rect x="13.2" y="21.5" width="2.6" height="1" fill={C_OUTLINE} />

          {/* --- LAYER 3: PANTS --- */}
          <rect x="8.5" y="17" width="7" height="3.2" fill={C_PANTS_BROWN} />
          <rect x="9.5" y="17.5" width="5" height="2.7" fill="#5c2e0b" /> {/* Pants shadows */}
          {/* Dark border */}
          <rect x="7.8" y="17.2" width="8.4" height="0.8" fill={C_OUTLINE} />

          {/* --- LAYER 4: CLOTHING / TORSO --- */}
          {type === 'pirate' ? (
            // Classic White-and-Blue Striped Sailor Shirt for recruits
            <g id="pirate-striped-shirt">
              <rect x="8" y="11" width="8" height="6.5" fill={C_SHIRT_WHITE} />
              {/* Blue Stripes */}
              <rect x="8" y="12" width="8" height="1" fill={C_STRIPE_BLUE} />
              <rect x="8" y="14" width="8" height="1" fill={C_STRIPE_BLUE} />
              <rect x="8" y="16" width="8" height="1" fill={C_STRIPE_BLUE} />
              {/* Sleeves */}
              <rect x="6.5" y="11.5" width="1.5" height="3.5" fill={C_SHIRT_WHITE} />
              <rect x="16" y="11.5" width="1.5" height="3.5" fill={C_SHIRT_WHITE} />
              <rect x="6.5" y="12.5" width="1.5" height="1" fill={C_STRIPE_BLUE} />
              <rect x="16" y="12.5" width="1.5" height="1" fill={C_STRIPE_BLUE} />
            </g>
          ) : (
            // Fancy Purple Sailor Vest / Gold Trim Coat for Pirate Officers
            <g id="officer-fancy-vest">
              {/* Purple Coat */}
              <rect x="7.5" y="11" width="9" height="6.5" fill="#8b5cf6" />
              {/* Crimson undershirt */}
              <rect x="9.5" y="11" width="5" height="4.5" fill="#be123c" />
              {/* Gold epaulets and coat trim */}
              <rect x="7" y="11" width="2" height="1.2" fill={C_GOLD} />
              <rect x="15" y="11" width="2" height="1.2" fill={C_GOLD} />
              <rect x="8.5" y="12" width="1" height="5" fill={C_GOLD} />
              <rect x="14.5" y="12" width="1" height="5" fill={C_GOLD} />
              {/* Black leather belt */}
              <rect x="7.5" y="16" width="9" height="1.2" fill="#18181b" />
              <rect x="11.2" y="15.8" width="1.6" height="1.6" fill={C_GOLD} /> {/* Buckle */}
            </g>
          )}

          {/* Torso outlines */}
          <rect x="7.2" y="11" width="0.8" height="6.5" fill={C_OUTLINE} />
          <rect x="16" y="11" width="0.8" height="6.5" fill={C_OUTLINE} />

          {/* --- LAYER 5: HEAD & FACE --- */}
          {/* Peach skin neck */}
          <rect x="11.2" y="10" width="1.6" height="1.5" fill={C_SKIN} />
          <rect x="11" y="10.2" width="2" height="0.8" fill={C_OUTLINE} />

          {/* Face */}
          <rect x="8.5" y="5.5" width="7" height="5" fill={C_SKIN} />
          <rect x="8.2" y="6.8" width="0.8" height="2.5" fill={C_SKIN_SHADOW} />

          {/* Eye Patch / Face styling */}
          {type === 'pirate' ? (
            // Classic Pirate Eye Patch on left eye
            <>
              <line x1="8.2" y1="5.8" x2="12.2" y2="9.8" stroke={C_OUTLINE} strokeWidth="0.8" />
              <rect x="11" y="6.8" width="1.8" height="1.8" fill={C_OUTLINE} />
              {/* Normal right eye */}
              <rect x="13.8" y="7" width="1" height="1" fill={C_OUTLINE} />
              {/* Angry eyebrow */}
              <line x1="13.2" y1="6" x2="15.2" y2="6.8" stroke={C_OUTLINE} strokeWidth="0.8" />
            </>
          ) : (
            // Pirate officer scars and growling expression
            <>
              <rect x="9.5" y="7" width="1" height="1.2" fill={C_OUTLINE} />
              <rect x="13.5" y="7" width="1" height="1.2" fill={C_OUTLINE} />
              {/* Face scar */}
              <line x1="14" y1="6" x2="14" y2="9" stroke="#ef4444" strokeWidth="0.8" opacity="0.85" />
              <line x1="9" y1="6" x2="11.2" y2="6.8" stroke={C_OUTLINE} strokeWidth="0.85" />
              <line x1="15" y1="6" x2="12.8" y2="6.8" stroke={C_OUTLINE} strokeWidth="0.85" />
            </>
          )}

          {/* Dizzy eyes / scared mouth when stunned */}
          {isStunned ? (
            <>
              <circle cx="10" cy="7.2" r="1.5" fill="#ffffff" stroke={C_OUTLINE} strokeWidth="0.5" />
              <circle cx="14" cy="7.2" r="1.5" fill="#ffffff" stroke={C_OUTLINE} strokeWidth="0.5" />
              <circle cx="10" cy="7.2" r="0.5" fill="#000000" />
              <circle cx="14" cy="7.2" r="0.5" fill="#000000" />
              {/* Squiggly mouth */}
              <path d="M 10.5 9.5 Q 12 8.5 13.5 9.5" stroke="#7f1d1d" strokeWidth="0.8" fill="none" />
            </>
          ) : (
            // Angry Grin / Growl
            <path d="M 10.5 9.2 L 13.5 9.2" stroke={C_OUTLINE} strokeWidth="1" />
          )}

          {/* --- LAYER 6: HEADWEAR (BANDANA / TRICORNE HAT) --- */}
          {type === 'pirate' ? (
            // Recruits Bandana
            <g id="bandana">
              <rect x="8" y="3.5" width="8" height="2.2" fill={C_BANDANA_RED} />
              <rect x="8.5" y="3" width="7" height="0.8" fill={C_BANDANA_RED} />
              <rect x="8" y="4.5" width="8" height="0.8" fill={C_BANDANA_SHADOW} />
              {/* Highlight print */}
              <rect x="11.2" y="3.8" width="1.6" height="0.8" fill="#fca5a5" />
            </g>
          ) : (
            // Officer Fancy Tricorne Hat
            <g id="tricorne-hat">
              {/* Gold borders */}
              <path d="M 6 3.5 L 12 1.5 L 18 3.5 L 17 5 L 7 5 Z" fill={C_GOLD} />
              {/* Dark Tricorne Base */}
              <path d="M 7 4 L 12 2.2 L 17 4 L 16 5.2 L 8 5.2 Z" fill="#374151" stroke={C_OUTLINE} strokeWidth="0.8" />
              <circle cx="12" cy="4.2" r="1.2" fill="#be123c" /> {/* Red feather emblem */}
            </g>
          )}

          {/* Head outlines */}
          <rect x="7.8" y="4.8" width="0.8" height="5.5" fill={C_OUTLINE} />
          <rect x="15.4" y="4.8" width="0.8" height="5.5" fill={C_OUTLINE} />

          {/* --- LAYER 7: PEACH HANDS & PIRATE CUTLASS/SABER --- */}
          {/* Hands holding weapon */}
          <rect x="4.5" y="13.2" width="2" height="2" fill={C_SKIN} stroke={C_OUTLINE} strokeWidth="0.5" />
          <rect x="17.5" y="13.2" width="2" height="2" fill={C_SKIN} stroke={C_OUTLINE} strokeWidth="0.5" />

          {/* Dynamic Pirate Saber Sword (Cutlass) */}
          <g transform={`translate(18.5, 14.5) rotate(${weaponAngle - 45} 1 1)`} className="transition-transform duration-100">
            {/* Hilt / Golden Guard */}
            <rect x="0" y="0" width="2" height="1.8" rx="0.5" fill={C_GOLD} stroke={C_OUTLINE} strokeWidth="0.6" />
            <rect x="-0.8" y="-0.5" width="3.6" height="0.8" fill={C_GOLD} />
            
            {/* Long Curved Steel Blade */}
            <path d="M 0.5 -0.5 L 0.5 -9 L -1.5 -8.5 L -1.5 -0.5 Z" fill={C_METAL_GRAY} stroke={C_OUTLINE} strokeWidth="0.75" />
            <path d="M 0 -0.5 L 0 -8.5" stroke="#e2e8f0" strokeWidth="0.5" /> {/* Shininess */}
            {/* Extra spike/detail for Officers */}
            {type === 'pirate-officer' && (
              <polygon points="-1.5,-4 -2.8,-5.2 -1.5,-6.5" fill={C_GOLD} stroke={C_OUTLINE} strokeWidth="0.5" />
            )}
          </g>

        </g>
      </svg>
    </div>
  );
};

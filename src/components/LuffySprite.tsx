import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Direction } from '../types';

interface LuffySpriteProps {
  direction: Direction;
  actionState: string;
  x: number;
  y: number;
}

// Crisp SNES/GBA-style colors
const C_HAIR = "#18181b"; // JetBlack
const C_SKIN = "#fed7aa"; // Soft peach skin
const C_SKIN_S = "#fca5a5"; // Soft pinkish scar/lip blush
const C_HAT = "#eab308"; // Gold straw
const C_HAT_S = "#ca8a04"; // Dark straw shadow
const C_HAT_R = "#dc2626"; // Hat red band
const C_VEST = "#ef4444"; // Red vest
const C_VEST_S = "#b91c1c"; // Shadow vest red
const C_SASH = "#f8fafc"; // White sash
const C_PANTS = "#2563eb"; // Luffy's iconic blue shorts
const C_PANTS_S = "#1d4ed8"; // Underpants shadow blue
const C_SLIPPER = "#78350f"; // Straw sandals brown

export const LuffySprite: React.FC<LuffySpriteProps> = ({ direction, actionState, x, y }) => {
  const [idleTick, setIdleTick] = useState(0);
  const [burstFrame, setBurstFrame] = useState(0);
  const [attackFrame, setAttackFrame] = useState(0);

  // Set up continuous ticking effect for Idle Hat-Adjustment loops
  useEffect(() => {
    const timer = setInterval(() => {
      setIdleTick((prev) => (prev + 1) % 12);
    }, 280);
    return () => clearInterval(timer);
  }, []);

  // Set up sequential frame cycle during the active barrel-burst explosion
  useEffect(() => {
    if (actionState === 'bursting-out') {
      const timer = setInterval(() => {
        setBurstFrame((prev) => (prev + 1) % 4);
      }, 250);
      return () => clearInterval(timer);
    }
  }, [actionState]);

  // Set up precise timed sub-state frames for Gomu-Gomu attacks matching reference sheets
  useEffect(() => {
    if (actionState === 'attacking-pistol') {
      setAttackFrame(0);
      const t1 = setTimeout(() => setAttackFrame(1), 160);
      const t2 = setTimeout(() => setAttackFrame(2), 320);
      const t3 = setTimeout(() => setAttackFrame(3), 660);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (actionState === 'attacking-gatling') {
      setAttackFrame(0); // Frame 0: Preparación
      const t1 = setTimeout(() => setAttackFrame(1), 120); // Frame 1: Impulso
      const t2 = setTimeout(() => setAttackFrame(2), 240); // Frame 2: Ataque Inicial
      const t3 = setTimeout(() => setAttackFrame(3), 400); // Frame 3: Ráfaga y Desenfoque
      const t4 = setTimeout(() => setAttackFrame(4), 580); // Frame 4: Ráfaga Intensificada
      const t5 = setTimeout(() => setAttackFrame(5), 760); // Frame 5: Recuperación

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    } else if (actionState.startsWith('attacking-')) {
      setAttackFrame(0);
      const t1 = setTimeout(() => setAttackFrame(1), 160);
      const t2 = setTimeout(() => setAttackFrame(2), 320);
      const t3 = setTimeout(() => setAttackFrame(3), 660);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [actionState]);

  // Frame translation helper matching user's "Reajustándose el sombrero" sheet:
  // idleTick 0-5: Frame C (Arms at sides, standing comfortable)
  // idleTick 6-7: Frame A (Raises left hand to touch the hat brim)
  // idleTick 8-9: Frame B (Hat tilted lower, face hidden looking down)
  // idleTick 10-11: Frame A (Returns arm)
  let idleFrame: 'A' | 'B' | 'C' = 'C';
  if (actionState === 'idle') {
    if (idleTick === 6 || idleTick === 7 || idleTick === 10 || idleTick === 11) {
      idleFrame = 'A';
    } else if (idleTick === 8 || idleTick === 9) {
      idleFrame = 'B';
    }
  }

  // Walk cycle has 4 distinct steps: A (Left foot forward), B (Standing), C (Right foot forward), D (Standing)
  const walkFrame = (x + y) % 4;

  // Render pixel clusters aligned to a crisp 24x24 retro grid!
  // Setting shape-rendering="crispEdges" makes standard vector rects look 100% retro-pixel!
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      <svg 
        viewBox="0 0 24 24" 
        className="w-12 h-12 drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]" 
        style={{ imageRendering: 'pixelated' }}
        shapeRendering="crispEdges"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.g
          animate={{
            y: actionState === 'hit' ? [0, -3, 3, -1, 1, 0] : 0,
            rotate: actionState === 'rolling' ? [0, 90, 180, 275, 360] : 0,
            scale: actionState === 'hit' ? 0.85 : 1,
          }}
          transition={{
            y: actionState === 'hit' ? { duration: 0.3 } : undefined,
            rotate: actionState === 'rolling' ? { duration: 0.3, ease: "linear" } : undefined,
            scale: { duration: 0.15 }
          }}
          style={{ transformOrigin: '12px 12px' }}
        >
          {/* ========================================================================= */}
          {/* SPECIAL ACTIONS CORE RENDERERS */}
          {/* ========================================================================= */}

          {/* 1. BARREL EXPLOSION SEQUENCE (MATCHES IMAGE SHEETS EXACTLY!) */}
          {(actionState === 'bursting-out' || actionState === 'burst') ? (
            <g id="luffy-burst">
              {/* Frame 0: cracked barrel, closed, no Luffy head yet */}
              {(burstFrame === 0 && actionState === 'bursting-out') && (
                <g id="burst-frame0">
                  {/* Outer barrel shape */}
                  <rect x="7" y="6" width="10" height="16" fill="#78350f" />
                  
                  {/* Alternating staves highlights */}
                  <rect x="9" y="6" width="2" height="16" fill="#b45309" />
                  <rect x="13" y="6" width="2" height="16" fill="#d97706" />

                  {/* Dark stave dividers */}
                  <line x1="9" y1="6" x2="9" y2="22" stroke="#18181b" strokeWidth="0.8" />
                  <line x1="11" y1="6" x2="11" y2="22" stroke="#18181b" strokeWidth="0.8" />
                  <line x1="13" y1="6" x2="13" y2="22" stroke="#18181b" strokeWidth="0.8" />
                  <line x1="15" y1="6" x2="15" y2="22" stroke="#18181b" strokeWidth="0.8" />

                  {/* Curved Top Lid & Bottom Base */}
                  <rect x="8" y="5" width="8" height="1" fill="#451a03" />
                  <rect x="8" y="22" width="8" height="1" fill="#451a03" />

                  {/* Iron Hoops */}
                  <rect x="6.5" y="9" width="11" height="1.5" fill="#4b5563" />
                  <rect x="6.5" y="18" width="11" height="1.5" fill="#4b5563" />

                  {/* Heavy jagged black cracks! */}
                  <path d="M12 6 L11 10 L13 13 M9 11 L11 10 M14 7 L13 11 M10 14 L9 17" stroke="#18181b" strokeWidth="1" fill="none" />
                </g>
              )}

              {/* Frame 1: Top cracked open, Luffy's dark hair peeking, peachy hands gripping barrel rim */}
              {(burstFrame === 1 && actionState === 'bursting-out') && (
                <g id="burst-frame1">
                  {/* Lower intact part of barrel */}
                  <rect x="7" y="12" width="10" height="10" fill="#78350f" />
                  <rect x="9" y="12" width="2" height="10" fill="#b45309" />
                  <rect x="13" y="12" width="2" height="10" fill="#d97706" />
                  <line x1="9" y1="12" x2="9" y2="22" stroke="#18181b" strokeWidth="0.8" />
                  <line x1="11" y1="12" x2="11" y2="22" stroke="#18181b" strokeWidth="0.8" />
                  <line x1="13" y1="12" x2="13" y2="22" stroke="#18181b" strokeWidth="0.8" />
                  <line x1="15" y1="12" x2="15" y2="22" stroke="#18181b" strokeWidth="0.8" />

                  {/* Lower Iron Hoop */}
                  <rect x="6.5" y="18" width="11" height="1.5" fill="#4b5563" />

                  {/* Top broken jagged rim staves */}
                  <rect x="7" y="10" width="1.5" height="2" fill="#78350f" />
                  <rect x="15.5" y="10" width="1.5" height="2" fill="#78350f" />

                  {/* Luffy's Peachy hands gripping the rim */}
                  <rect x="6" y="10.5" width="2" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.6" />
                  <rect x="16" y="10.5" width="2" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.6" />

                  {/* Luffy's wild black hair emerging from center */}
                  <rect x="9" y="8" width="6" height="4.5" fill={C_HAIR} />
                  <rect x="10" y="7" width="4" height="1" fill={C_HAIR} />

                  {/* Splinter wood particles flying left and right */}
                  <g id="splinters">
                    <rect x="3.5" y="7" width="2" height="1" fill="#78350f" transform="rotate(-15)" />
                    <rect x="18.5" y="7.5" width="1.2" height="2.2" fill="#b45309" transform="rotate(25)" />
                    <rect x="4.5" y="14" width="1" height="1" fill="#78350f" />
                    <rect x="18" y="15" width="1" height="1" fill="#b45309" />
                  </g>
                </g>
              )}

              {/* Frame 2: Luffy popping out halfway wearing straw hat, face & hands visible */}
              {(burstFrame === 2 && actionState === 'bursting-out') && (
                <g id="burst-frame2">
                  {/* Luffy's Straw Hat */}
                  <rect x="8" y="2" width="8" height="2" fill={C_HAT} />
                  <rect x="8" y="4" width="8" height="1" fill={C_HAT_R} />
                  <rect x="5" y="5" width="14" height="1.8" fill={C_HAT} />

                  {/* Luffy's Peach Face & Hair */}
                  <rect x="8" y="6.8" width="8" height="4.5" fill={C_SKIN} />
                  {/* Messenger Hair lock */}
                  <rect x="7.5" y="6.8" width="1" height="2.5" fill={C_HAIR} />
                  <rect x="15.5" y="6.8" width="1" height="2.5" fill={C_HAIR} />
                  
                  {/* Expressive happy eyes and grin */}
                  <rect x="9.5" y="7.8" width="1.2" height="1.2" fill={C_HAIR} />
                  <rect x="13.5" y="7.8" width="1.2" height="1.2" fill={C_HAIR} />
                  {/* Grinning teeth line */}
                  <rect x="10.5" y="9.2" width="3" height="1.2" fill="#ffffff" stroke="#18181b" strokeWidth="0.5" />

                  {/* Hands pushing out */}
                  <rect x="4" y="9" width="1.8" height="2.5" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />
                  <rect x="18" y="9" width="1.8" height="2.5" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />

                  {/* Red Vest neck top */}
                  <rect x="8.5" y="11" width="7" height="1.5" fill={C_VEST} />

                  {/* Shattered top barrel base */}
                  <rect x="6.5" y="12.5" width="11" height="9.5" fill="#78350f" />
                  <rect x="9" y="12.5" width="2" height="9.5" fill="#b45309" />
                  <rect x="13" y="12.5" width="2" height="9.5" fill="#d97706" />

                  {/* Heavily cracked bottom base */}
                  <path d="M12 12.5 L12 22 M9 15 L7.5 18 M15 15 L16.5 18" stroke="#18181b" strokeWidth="1" fill="none" />

                  {/* Huge flying wood pieces bursting sideways */}
                  <g id="big-burst-debris">
                    <rect x="1.5" y="6" width="3" height="1.5" fill="#b45309" transform="rotate(-35)" />
                    <rect x="19.5" y="5.5" width="2" height="3" fill="#78350f" transform="rotate(45)" />
                    <rect x="0.5" y="13" width="2.5" height="1.2" fill="#78350f" />
                    <rect x="21" y="12" width="2" height="1.6" fill="#b45309" />
                  </g>
                </g>
              )}

              {/* Frame 3: Great finale! Luffy standing stretching/screaming, barrel flat on ground as scattered debris */}
              {((burstFrame === 3 && actionState === 'bursting-out') || actionState === 'burst') && (
                <g id="burst-happy-scream">
                  {/* High Victory Arms raised in bliss! */}
                  <rect x="4" y="3" width="2" height="8" fill={C_SKIN} />
                  <rect x="18" y="3" width="2" height="8" fill={C_SKIN} />
                  
                  {/* Standard straw hat rotated slightly */}
                  <rect x="8" y="2" width="8" height="2" fill={C_HAT} />
                  <rect x="8" y="3.5" width="8" height="0.8" fill={C_HAT_R} />
                  <rect x="5" y="4.5" width="14" height="1.8" fill={C_HAT} />
                  
                  {/* Face with wide closed squeely loop eyes (^^) */}
                  <rect x="8" y="6.5" width="8" height="6" fill={C_SKIN} />
                  <rect x="10" y="8" width="1" height="1" fill={C_HAIR} /> {/* Left eye */}
                  <rect x="13" y="8" width="1" height="1" fill={C_HAIR} /> {/* Right eye */}
                  
                  {/* Huge wide open happy red mouth */}
                  <rect x="10.5" y="9.5" width="3" height="2" fill="#7f1d1d" />
                  <rect x="11.5" y="10.5" width="1" height="1" fill={C_SKIN_S} /> {/* Cute pink tongue! */}
                  <rect x="11" y="9.5" width="2" height="0.5" fill="#ffffff" /> {/* Shiny top white tooth strip */}

                  {/* Red open vest with white sash */}
                  <rect x="6" y="12.5" width="12" height="4.5" fill={C_VEST} />
                  <polygon points="10.5,12.5 13.5,12.5 12,15" fill={C_SKIN} /> {/* V chest exposure */}
                  <rect x="7.5" y="17" width="9" height="1" fill={C_SASH} />
                  <rect x="7.5" y="18" width="9" height="3" fill={C_PANTS} />
                  <rect x="8" y="21" width="2" height="1" fill="#ffffff" /> {/* White fuzzy cuffs L */}
                  <rect x="14" y="21" width="2" height="1" fill="#ffffff" /> {/* White fuzzy cuffs R */}
                  
                  {/* Sandals */}
                  <rect x="8" y="22" width="2.5" height="1" fill={C_SLIPPER} />
                  <rect x="13.5" y="22" width="2.5" height="1" fill={C_SLIPPER} />

                  {/* SCATTERED BARREL SHARDS AND DEBRIS FLAT ON GROUND (PRESERVING COHERENCE) */}
                  <g id="shattered-base-debris">
                    {/* Flat brown curved broken wood slats */}
                    <rect x="1" y="21" width="5.5" height="1.5" fill="#78350f" rx="0.5" />
                    <rect x="17.5" y="21.2" width="5.5" height="1.5" fill="#78350f" rx="0.5" />
                    
                    {/* Light/high wood splints flat */}
                    <rect x="3.5" y="22" width="3" height="1" fill="#b45309" />
                    <rect x="17.5" y="22.2" width="3" height="1" fill="#b45309" />

                    {/* Broken coiling iron hoops on the floor */}
                    <path d="M1 19.5 C2.5 21 4.5 22 5.5 20.8" stroke="#4b5563" strokeWidth="0.8" fill="none" />
                    <path d="M18.5 20.8 C19.5 22 21.5 21 23 19.5" stroke="#4b5563" strokeWidth="0.8" fill="none" />

                    {/* Small white dust/smoke rings puffing on ground */}
                    <rect x="1.5" y="17.5" width="2" height="2" rx="1" fill="#f1f5f9" opacity="0.75" />
                    <rect x="20.5" y="17.5" width="2" height="2" rx="1" fill="#f1f5f9" opacity="0.75" />
                    <rect x="0.8" y="16" width="1.2" height="1.2" rx="0.6" fill="#cbd5e1" opacity="0.5" />
                    <rect x="22" y="16" width="1.2" height="1.2" rx="0.6" fill="#cbd5e1" opacity="0.5" />
                  </g>
                </g>
              )}
            </g>
          ) : actionState.startsWith('attacking-') ? (
            /* ========================================================================= */
            /* 2. DETAILED ANIMATED ATTACK SEQUENCES (MATCHES SHEET DETAILS EXACTLY)     */
            /* ========================================================================= */
            <g id="luffy-attack-sequence" style={{ transform: direction === 'left' || direction === 'up' ? 'scaleX(-1)' : undefined, transformOrigin: '12px 12px' }}>
              {/* SPECIAL CASE: GOMU GOMU NO PISTOLA 4-FRAME TIMED CYCLE */}
              {actionState === 'attacking-pistol' ? (
                <>
                  {/* Frame 0: Preparación */}
                  {attackFrame === 0 && (
                    <g id="pistol-f0-prep">
                      {/* Straw Hat rotated forward */}
                      <rect x="7" y="2" width="7" height="2" fill={C_HAT} />
                      <rect x="7" y="3" width="7" height="1" fill={C_HAT_R} />
                      <rect x="4" y="4" width="12" height="2" fill={C_HAT} />

                      {/* Hair */}
                      <rect x="5" y="6" width="3" height="3" fill={C_HAIR} />
                      <rect x="13" y="6" width="2" height="2" fill={C_HAIR} />

                      {/* Angry Face looking forward (right) */}
                      <rect x="7" y="6" width="7" height="5" fill={C_SKIN} />
                      <rect x="11" y="7.5" width="2" height="1" fill={C_HAIR} />
                      <line x1="8" y1="9.5" x2="10.5" y2="9.5" stroke={C_HAIR} strokeWidth="1" />

                      {/* Cocked back fist (at hip) */}
                      <rect x="3" y="10.5" width="3.5" height="3.5" fill={C_SKIN} stroke={C_HAIR} strokeWidth="0.5" />
                      {/* Left resting arm */}
                      <rect x="13" y="10.5" width="2" height="3" fill={C_SKIN} />

                      {/* Red Vest with white floral dots */}
                      <rect x="5.5" y="11" width="8.5" height="5.5" fill={C_VEST} />
                      <rect x="6.5" y="12" width="1" height="1" fill="#ffffff" />
                      <rect x="10.5" y="14" width="1" height="1" fill="#ffffff" />
                      
                      {/* Blue Pants */}
                      <rect x="5.5" y="16.5" width="8.5" height="3.5" fill={C_PANTS} />
                      <rect x="5.5" y="20" width="3" height="1" fill="#ffffff" />
                      <rect x="11" y="20" width="3" height="1" fill="#ffffff" />

                      {/* Sandals */}
                      <rect x="5.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="11.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                    </g>
                  )}

                  {/* Frame 1: Estiramiento */}
                  {attackFrame === 1 && (
                    <g id="pistol-f1-estiramiento">
                      {/* Straw Hat */}
                      <rect x="7" y="2" width="7" height="2" fill={C_HAT} />
                      <rect x="7" y="3.1" width="7" height="1" fill={C_HAT_R} />
                      <rect x="4" y="4.2" width="12" height="2" fill={C_HAT} />

                      {/* Profile hair */}
                      <rect x="5" y="6.2" width="3.2" height="3" fill={C_HAIR} />
                      <rect x="13" y="6.2" width="2" height="2" fill={C_HAIR} />

                      {/* Face looking forward */}
                      <rect x="7" y="6.2" width="7" height="5" fill={C_SKIN} />
                      <rect x="11.5" y="7.5" width="2" height="1.2" fill={C_HAIR} />

                      {/* Body vest with floral dots */}
                      <rect x="5.5" y="11.2" width="8" height="5.3" fill={C_VEST} />
                      <rect x="7" y="12.5" width="1" height="1" fill="#ffffff" />
                      <rect x="11" y="14" width="1" height="1" fill="#ffffff" />

                      {/* Blue Shorts */}
                      <rect x="5.5" y="16.5" width="8" height="3.5" fill={C_PANTS} />
                      <rect x="5.5" y="20" width="3" height="1" fill="#ffffff" />
                      <rect x="10.5" y="20" width="3" height="1" fill="#ffffff" />

                      {/* Sandals */}
                      <rect x="5.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="11" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />

                      {/* Red sleeve stretching out slightly */}
                      <rect x="13.5" y="11" width="3" height="2.5" fill={C_VEST} />
                      <rect x="15" y="11.5" width="1" height="1" fill="#ffffff" />
                    </g>
                  )}

                  {/* Frame 2: Alcance Máximo (Pistola Completa!) */}
                  {attackFrame === 2 && (
                    <g id="pistol-f2-completo">
                      {/* Straw Hat */}
                      <rect x="7" y="1.8" width="7" height="2" fill={C_HAT} />
                      <rect x="7" y="2.9" width="7" height="1" fill={C_HAT_R} />
                      <rect x="4" y="4" width="12" height="2" fill={C_HAT} />

                      {/* Spiky Profile Hair */}
                      <rect x="5" y="6" width="3.2" height="3" fill={C_HAIR} />
                      <rect x="13.5" y="6" width="2" height="2" fill={C_HAIR} />

                      {/* Peach Face */}
                      <rect x="7" y="6" width="7" height="5" fill={C_SKIN} />
                      <rect x="11.8" y="7.2" width="1.8" height="1.2" fill={C_HAIR} />

                      {/* Red Vest with white flower prints */}
                      <rect x="5" y="11" width="8" height="5.5" fill={C_VEST} />
                      <rect x="7" y="12" width="1" height="1" fill="#ffffff" />
                      <rect x="10" y="14" width="1" height="1" fill="#ffffff" />
                      <polygon points="9.5,11 12.5,11 11,13" fill={C_SKIN} />

                      {/* Blue pants */}
                      <rect x="5.2" y="16.5" width="7.8" height="3.5" fill={C_PANTS} />
                      <rect x="5.2" y="20" width="2.8" height="1" fill="#ffffff" />
                      <rect x="10" y="20" width="2.8" height="1" fill="#ffffff" />

                      {/* Sandals */}
                      <rect x="5.2" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="10.2" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />

                      {/* Shoulder Connection structure of the stretched arm */}
                      <rect x="13" y="10.5" width="3" height="2.5" fill={C_VEST} />
                      <rect x="14.5" y="11.2" width="1" height="1" fill="#ffffff" />
                    </g>
                  )}

                  {/* Frame 3: Retracción */}
                  {attackFrame === 3 && (
                    <g id="pistol-f3-retraccion">
                      {/* Straw Hat */}
                      <rect x="7" y="2" width="7" height="2" fill={C_HAT} />
                      <rect x="7" y="3.1" width="7" height="1" fill={C_HAT_R} />
                      <rect x="4" y="4.2" width="12" height="2" fill={C_HAT} />

                      {/* Profile Hair */}
                      <rect x="5" y="6.2" width="3" height="3" fill={C_HAIR} />
                      <rect x="13" y="6.2" width="2" height="1.8" fill={C_HAIR} />

                      {/* Face */}
                      <rect x="7" y="6.2" width="7" height="5" fill={C_SKIN} />
                      <rect x="11.5" y="7.5" width="1.8" height="1" fill={C_HAIR} />

                      {/* Body vest with prints */}
                      <rect x="5" y="11.2" width="8" height="5.3" fill={C_VEST} />
                      <rect x="6.5" y="12.5" width="1" height="1" fill="#ffffff" />
                      <rect x="10.5" y="14" width="1" height="1" fill="#ffffff" />

                      {/* Blue pants */}
                      <rect x="5" y="16.5" width="8" height="3.5" fill={C_PANTS} />
                      <rect x="5" y="20" width="2.8" height="1" fill="#ffffff" />
                      <rect x="10" y="20" width="2.8" height="1" fill="#ffffff" />

                      {/* Sandals */}
                      <rect x="5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="10" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />

                      {/* Arm sliding back */}
                      <rect x="13" y="11" width="1.5" height="2" fill={C_SKIN} stroke={C_HAIR} strokeWidth="0.5" />
                      {/* Motion lines behind returning fist */}
                      <line x1="15" y1="12" x2="19.5" y2="12" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                    </g>
                  )}
                </>
              ) : actionState === 'attacking-gatling' ? (
                <>
                  {/* Frame 0: Preparación */}
                  {attackFrame === 0 && (
                    <g id="gatling-f0-prep">
                      {/* Straw Hat adjusted forward */}
                      <rect x="7" y="2" width="7" height="2" fill={C_HAT} />
                      <rect x="7" y="3" width="7" height="1" fill={C_HAT_R} />
                      <rect x="4" y="4" width="12" height="2" fill={C_HAT} />

                      {/* Hair */}
                      <rect x="5" y="6" width="3" height="3" fill={C_HAIR} />
                      <rect x="13" y="6" width="2" height="2" fill={C_HAIR} />

                      {/* Angry focused face */}
                      <rect x="7" y="6" width="7" height="5" fill={C_SKIN} />
                      <rect x="11" y="7.5" width="2" height="1" fill={C_HAIR} />
                      <line x1="8.5" y1="9.5" x2="11.5" y2="9.5" stroke={C_HAIR} strokeWidth="1.2" />

                      {/* Right arm raised touching hat brim */}
                      <rect x="3.5" y="5.5" width="2" height="3.5" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />
                      <rect x="3" y="8" width="2.5" height="2" fill={C_VEST} />

                      {/* Left arm pulled back slightly inside vest */}
                      <rect x="13.5" y="11" width="2" height="2.5" fill={C_SKIN} />

                      {/* Body open Vest with white pattern */}
                      <rect x="5.5" y="11" width="8.5" height="5.5" fill={C_VEST} />
                      <rect x="6.5" y="12" width="1" height="1" fill="#ffffff" />
                      <rect x="11" y="14.5" width="1" height="1" fill="#ffffff" />

                      {/* Shorts and Sandals */}
                      <rect x="5.5" y="16.5" width="8.5" height="3.5" fill={C_PANTS} />
                      <rect x="5.5" y="20" width="3" height="1" fill="#ffffff" />
                      <rect x="11" y="20" width="3" height="1" fill="#ffffff" />

                      <rect x="5.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="11.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                    </g>
                  )}

                  {/* Frame 1: Impulso */}
                  {attackFrame === 1 && (
                    <g id="gatling-f1-impulso">
                      {/* Straw Hat tilted down/forward dramatically */}
                      <rect x="6" y="2.5" width="7" height="2" fill={C_HAT} />
                      <rect x="6" y="3.6" width="7" height="1" fill={C_HAT_R} />
                      <rect x="3" y="4.5" width="12" height="2" fill={C_HAT} />

                      {/* Spiky profile hair */}
                      <rect x="11" y="6.5" width="3.2" height="3" fill={C_HAIR} />
                      <rect x="5" y="6.5" width="2" height="2" fill={C_HAIR} />

                      {/* Head face profile looking forward */}
                      <rect x="7" y="6.5" width="6.5" height="4.5" fill={C_SKIN} />
                      <rect x="11.5" y="7.8" width="1.5" height="1" fill={C_HAIR} />
                      <line x1="10" y1="9.5" x2="12" y2="9.5" stroke={C_HAIR} strokeWidth="1" />

                      {/* Cocking elbow far back */}
                      <rect x="1.5" y="11" width="3.2" height="2.5" fill={C_VEST} />
                      <rect x="0.5" y="11.5" width="2.5" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />

                      {/* Support hand on the right */}
                      <rect x="13.2" y="11" width="2.5" height="2.2" fill={C_SKIN} />

                      {/* Body vest with print */}
                      <rect x="4.5" y="11" width="8.2" height="5.5" fill={C_VEST} />
                      <rect x="6" y="12" width="1" height="1" fill="#ffffff" />
                      <rect x="10" y="14" width="1" height="1" fill="#ffffff" />

                      {/* Blue shorts and sandals */}
                      <rect x="4.5" y="16.5" width="8" height="3.5" fill={C_PANTS} />
                      <rect x="4.5" y="20" width="2.8" height="1" fill="#ffffff" />
                      <rect x="9.5" y="20" width="2.8" height="1" fill="#ffffff" />

                      <rect x="4.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="9.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                    </g>
                  )}

                  {/* Frame 2: Ataque Inicial */}
                  {attackFrame === 2 && (
                    <g id="gatling-f2-inicial">
                      {/* Straw Hat hanging on his back / neck by string */}
                      <rect x="1.5" y="12" width="5" height="1.5" fill={C_HAT} />
                      <rect x="2" y="13.5" width="4" height="2" fill={C_HAT_R} />
                      <path d="M7 9 C6 10, 5 11, 4 12.5" stroke="#fca5a5" strokeWidth="0.8" fill="none" />

                      {/* Spiky, messy, wild black hair without the hat */}
                      <rect x="7" y="3.5" width="8.5" height="5" fill={C_HAIR} />
                      <polygon points="6,6 8,3 9,6.5" fill={C_HAIR} />
                      <polygon points="14,6 16.5,4 15,7" fill={C_HAIR} />
                      <polygon points="9.5,4.5 11,2 12,5" fill={C_HAIR} />

                      {/* Concentrated facial expression with open screaming mouth */}
                      <rect x="7.5" y="6.5" width="7.5" height="5.2" fill={C_SKIN} />
                      <circle cx="10" cy="8.2" r="0.8" fill={C_HAIR} />
                      <circle cx="14" cy="8.2" r="0.8" fill={C_HAIR} />
                      <rect x="10.5" y="9.5" width="3" height="1.8" fill="#7f1d1d" />

                      {/* Open chest Red Vest with visible open peachy torso in center */}
                      <rect x="5.5" y="11.5" width="8" height="5" fill={C_VEST} />
                      <polygon points="9,11.5 11,11.5 10,14" fill={C_SKIN} />

                      {/* Two initial fists punching forward! */}
                      <g id="initial-punches">
                        {/* Upper punching arm */}
                        <rect x="13.5" y="9.5" width="6" height="2.2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />
                        <rect x="19.5" y="8.8" width="3" height="3" fill={C_SKIN} rx="1" stroke="#18181b" strokeWidth="0.6" />

                        {/* Lower punching arm */}
                        <rect x="13.5" y="13" width="7" height="2.2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />
                        <rect x="20.5" y="12.3" width="3" height="3" fill={C_SKIN} rx="1" stroke="#18181b" strokeWidth="0.6" />
                        
                        {/* Speed lines */}
                        <line x1="12.5" y1="9" x2="13.5" y2="9" stroke="#ffffff" strokeWidth="1" />
                        <line x1="12" y1="14" x2="13.5" y2="14" stroke="#ffffff" strokeWidth="1" />
                      </g>

                      {/* Legs and sandals */}
                      <rect x="5.5" y="16.5" width="8.2" height="3.5" fill={C_PANTS} />
                      <rect x="5.5" y="20" width="2.8" height="1" fill="#ffffff" />
                      <rect x="11" y="20" width="2.8" height="1" fill="#ffffff" />

                      <rect x="5.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="11" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                    </g>
                  )}

                  {/* Frame 3: Ráfaga y Desenfoque */}
                  {attackFrame === 3 && (
                    <g id="gatling-f3-rafaga">
                      {/* Straw Hat hanging at back by string */}
                      <rect x="1.5" y="12.5" width="5" height="1.5" fill={C_HAT} />
                      <rect x="2" y="14" width="4" height="2" fill={C_HAT_R} />
                      <path d="M7 9.5 C6.2 10.5 5 11.5 4 12.8" stroke="#fca5a5" strokeWidth="0.8" fill="none" />

                      {/* Wild spiky black hair */}
                      <rect x="7" y="3.5" width="8.5" height="5" fill={C_HAIR} />
                      <polygon points="5.5,5.5 7.5,2.5 8.5,6" fill={C_HAIR} />
                      <polygon points="14.5,5.5 16.8,3.5 15,6.5" fill={C_HAIR} />
                      <polygon points="10,4.2 11.5,1.8 12.5,4.5" fill={C_HAIR} />

                      {/* Roaring, screaming face */}
                      <rect x="7.5" y="6.5" width="7.5" height="5.2" fill={C_SKIN} />
                      <circle cx="10" cy="8" r="0.8" fill={C_HAIR} />
                      <circle cx="14" cy="8" r="0.8" fill={C_HAIR} />
                      {/* Wide screaming mouth with pink inside */}
                      <rect x="10.2" y="9.2" width="3.5" height="2.2" fill="#7f1d1d" rx="1" />
                      <rect x="11.2" y="10.4" width="1.5" height="1" fill={C_SKIN_S} />

                      {/* Vest open */}
                      <rect x="5.5" y="11.5" width="8" height="5" fill={C_VEST} />
                      <polygon points="9,11.5 11,11.5 10,14" fill={C_SKIN} />

                      {/* THREE OVERLAPPING BULLET STRETCH ARMS */}
                      <g id="gatling-3-arms">
                        <g transform="rotate(-15 13.5 11.5)">
                          <rect x="13.5" y="10.5" width="7" height="2.2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />
                          <rect x="20.5" y="9.8" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.6" />
                          <line x1="23.5" y1="11.5" x2="25" y2="11.5" stroke="#ffffff" strokeWidth="0.8" />
                        </g>
                        <g>
                          <rect x="13.5" y="12" width="8" height="2.2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />
                          <rect x="21.5" y="11.3" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.6" />
                          <line x1="24.5" y1="13" x2="26.5" y2="13" stroke="#ffffff" strokeWidth="0.8" />
                        </g>
                        <g transform="rotate(18 13.5 12.5)">
                          <rect x="13.5" y="12.5" width="6.5" height="2.2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.5" />
                          <rect x="20" y="11.8" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.6" />
                          <line x1="23" y1="13.5" x2="24.5" y2="13.5" stroke="#ffffff" strokeWidth="0.8" />
                        </g>
                      </g>

                      {/* Shorts and Sandals */}
                      <rect x="5.5" y="16.5" width="8.2" height="3.5" fill={C_PANTS} />
                      <rect x="5.5" y="20" width="2.8" height="1" fill="#ffffff" />
                      <rect x="11" y="20" width="2.8" height="1" fill="#ffffff" />

                      <rect x="5.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="11" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                    </g>
                  )}

                  {/* Frame 4: Ráfaga Intensificada */}
                  {attackFrame === 4 && (
                    <g id="gatling-f4-intensified">
                      {/* Straw Hat hanging at back by string */}
                      <rect x="1.5" y="12.5" width="5" height="1.5" fill={C_HAT} />
                      <rect x="2" y="14" width="4" height="2" fill={C_HAT_R} />
                      <path d="M7 9.5 C6.2 10.5 5 11.5 4 12.8" stroke="#fca5a5" strokeWidth="0.8" fill="none" />

                      {/* Spiky wild back hair */}
                      <rect x="7" y="3.5" width="8.5" height="5" fill={C_HAIR} />
                      <polygon points="5,5 7,2 8,5.5" fill={C_HAIR} />
                      <polygon points="15,5 17.5,3 15.5,6" fill={C_HAIR} />
                      <polygon points="10,4 11.5,1.5 12.8,4.2" fill={C_HAIR} />

                      {/* Roaring face */}
                      <rect x="7.5" y="6.5" width="7.5" height="5.2" fill={C_SKIN} />
                      <circle cx="10" cy="8" r="0.8" fill={C_HAIR} />
                      <circle cx="14" cy="8" r="0.8" fill={C_HAIR} />
                      <rect x="9.8" y="9.2" width="4.4" height="2.2" fill="#7f1d1d" rx="1.2" />
                      <rect x="10.8" y="10.4" width="2.4" height="1" fill={C_SKIN_S} />

                      {/* Open vest */}
                      <rect x="5.5" y="11.5" width="8" height="5" fill={C_VEST} strokeWidth="0.6" />
                      <polygon points="9,11.5 11,11.5 10,14" fill={C_SKIN} />

                      {/* FIVE CHAOTIC GATLING FISTS IN AN ARC */}
                      <g id="gatling-5-arms">
                        <g transform="rotate(-30 13.5 11)">
                          <rect x="13.5" y="10.5" width="7.5" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.4" />
                          <rect x="21" y="9.8" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.5" />
                        </g>
                        <g transform="rotate(-12 13.5 11.5)">
                          <rect x="13.5" y="11" width="8.5" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.4" />
                          <rect x="22" y="10.3" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.5" />
                        </g>
                        <g>
                          <rect x="13.5" y="12" width="9" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.4" />
                          <rect x="22.5" y="11.3" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.5" />
                          <line x1="25.5" y1="13" x2="27.5" y2="13" stroke="#ffffff" strokeWidth="1" />
                        </g>
                        <g transform="rotate(12 13.5 12.5)">
                          <rect x="13.5" y="12.2" width="8.2" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.4" />
                          <rect x="21.7" y="11.5" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.5" />
                        </g>
                        <g transform="rotate(30 13.5 12.5)">
                          <rect x="13.5" y="12.5" width="7" height="2" fill={C_SKIN} stroke="#18181b" strokeWidth="0.4" />
                          <rect x="20.5" y="11.8" width="3" height="3" fill="#fed7aa" rx="1" stroke="#18181b" strokeWidth="0.5" />
                        </g>
                        <path d="M21 6 C23 9, 24 13, 22 18" stroke="#f1f5f9" strokeWidth="0.8" fill="none" strokeDasharray="2 1" />
                        <path d="M23 8 C25 11, 25 14, 24 16" stroke="#fbbf24" strokeWidth="0.6" fill="none" opacity="0.8" />
                      </g>

                      {/* Shorts and Sandals */}
                      <rect x="5.5" y="16.5" width="8.2" height="3.5" fill={C_PANTS} />
                      <rect x="5.5" y="20" width="2.8" height="1" fill="#ffffff" />
                      <rect x="11" y="20" width="2.8" height="1" fill="#ffffff" />

                      <rect x="5.5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                      <rect x="11" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                    </g>
                  )}

                  {/* Frame 5: Recuperación */}
                  {attackFrame === 5 && (
                    <g id="gatling-f5-recovery">
                      {/* Straw Hat sitting back on head comfortably */}
                      <rect x="7" y="4.5" width="7.5" height="2" fill={C_HAT} />
                      <rect x="7" y="5.5" width="7.5" height="1" fill={C_HAT_R} />
                      <rect x="4" y="6.5" width="13.5" height="2" fill={C_HAT} />

                      {/* Black messy hair */}
                      <rect x="5.2" y="8" width="3" height="3.2" fill={C_HAIR} />
                      <rect x="13.2" y="8" width="3" height="2.5" fill={C_HAIR} />

                      {/* Happy face */}
                      <rect x="7.5" y="8" width="7.5" height="4.5" fill={C_SKIN} />
                      <circle cx="10" cy="9.2" r="0.6" fill={C_HAIR} />
                      <circle cx="13" cy="9.2" r="0.6" fill={C_HAIR} />
                      <path d="M10.2 10.8 Q11.5 11.8 12.8 10.8" stroke={C_HAIR} strokeWidth="1" fill="none" />

                      {/* Both hands raised up adjusting the hat rim (coherence) */}
                      <rect x="3" y="8" width="2" height="3.5" fill={C_VEST} />
                      <rect x="3" y="6.8" width="1.8" height="2" fill={C_SKIN} />
                      <rect x="16" y="8" width="2" height="3.5" fill={C_VEST} />
                      <rect x="16.2" y="6.8" width="1.8" height="2" fill={C_SKIN} />

                      {/* Solid closed Red Vest under */}
                      <rect x="5.2" y="12" width="11" height="5.2" fill={C_VEST} />
                      <rect x="8" y="13" width="1.2" height="1.2" fill="#ffffff" />
                      <rect x="12" y="14.8" width="1.2" height="1.2" fill="#ffffff" />

                      {/* Pants and sandals */}
                      <rect x="5.2" y="17.2" width="11" height="3" fill={C_PANTS} />
                      <rect x="5.2" y="20.2" width="3" height="1.2" fill="#ffffff" />
                      <rect x="13.2" y="20.2" width="3" height="1.2" fill="#ffffff" />

                      <rect x="5.2" y="21.4" width="2.5" height="1" fill={C_SLIPPER} />
                      <rect x="13.7" y="21.4" width="2.5" height="1" fill={C_SLIPPER} />
                    </g>
                  )}
                </>
              ) : (
                /* FALLBACK COMBAT POSE FOR EXTRA ATTACKS */
                <g id="luffy-attack-other">
                  <rect x="7" y="2" width="7" height="2" fill={C_HAT} />
                  <rect x="7" y="3" width="7" height="1" fill={C_HAT_R} />
                  <rect x="4" y="4" width="12" height="2" fill={C_HAT} />
                  <rect x="5" y="6" width="3" height="3" fill={C_HAIR} />
                  <rect x="13" y="6" width="2" height="2" fill={C_HAIR} />
                  <rect x="7" y="6" width="7" height="5" fill={C_SKIN} />
                  <rect x="12" y="7" width="2" height="1" fill={C_HAIR} />
                  <line x1="8" y1="9" x2="10" y2="9" stroke={C_HAIR} strokeWidth="1" />
                  <rect x="3" y="10" width="3" height="3" fill={C_SKIN} />
                  <rect x="2" y="11" width="2" height="2" fill={C_VEST} />
                  <rect x="14" y="9" width="4" height="2.5" fill={C_SKIN} />
                  <rect x="5" y="11" width="9" height="5" fill={C_VEST} />
                  <rect x="6" y="16" width="8" height="1" fill={C_SASH} />
                  <rect x="5" y="17" width="8" height="3" fill={C_PANTS} />
                  <rect x="5" y="20" width="3" height="1" fill="#ffffff" />
                  <rect x="10" y="20" width="3" height="1" fill="#ffffff" />
                  <rect x="5" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                  <rect x="11" y="21" width="2.5" height="1.5" fill={C_SLIPPER} />
                </g>
              )}
            </g>
          ) : (
            /* ========================================================================= */
            /* 3. STANDARD GAME NAVIGATION NAVIGATION AND IDLE STATES */
            /* ========================================================================= */
            <g id="luffy-nav" style={{ transform: direction === 'left' ? 'scaleX(-1)' : undefined, transformOrigin: '12px 12px' }}>
              
              {/* ==================== A. BACK VIEW (UP / NORTH) ==================== */}
              {direction === 'up' && (
                <g id="luffy-nav-back">
                  {/* Back view Straw Hat (Fully circular gold & big red ribbon) */}
                  <rect x="8" y="2" width="8" height="2" fill={C_HAT} />
                  <rect x="8" y="3.5" width="8" height="0.8" fill={C_HAT_R} />
                  <rect x="5" y="4.5" width="14" height="1.8" fill={C_HAT} stroke={C_HAT_S} strokeWidth="0.5" />
                  
                  {/* Black spiky head hair peaking from back */}
                  <rect x="6" y="6.3" width="12" height="2.5" fill={C_HAIR} />
                  
                  {/* Red Vest (Solid color coat from back, no peach skin visible) */}
                  <rect x="6" y="9" width="12" height="5" fill={C_VEST} />

                  {/* Arms Swinging on Back Walk Cycle */}
                  {walkFrame === 0 ? (
                    <>
                      {/* Left hand swinging up */}
                      <rect x="4" y="8" width="2.2" height="4" fill={C_SKIN} />
                      {/* Right hand swinging down */}
                      <rect x="18" y="10" width="2.2" height="4.5" fill={C_SKIN} />
                    </>
                  ) : walkFrame === 2 ? (
                    <>
                      {/* Right hand swinging up */}
                      <rect x="18" y="8" width="2.2" height="4" fill={C_SKIN} />
                      {/* Left hand swinging down */}
                      <rect x="4" y="10" width="2.2" height="4.5" fill={C_SKIN} />
                    </>
                  ) : (
                    <>
                      <rect x="4" y="9" width="2" height="4.5" fill={C_SKIN} />
                      <rect x="18" y="9" width="2" height="4.5" fill={C_SKIN} />
                    </>
                  )}

                  {/* White sash belt */}
                  <rect x="7" y="14" width="10" height="1" fill={C_SASH} />

                  {/* Blue Shorts Back */}
                  <rect x="7" y="15" width="10" height="4" fill={C_PANTS} />
                  <rect x="7" y="19" width="3.2" height="1" fill="#ffffff" /> {/* Left white cuff */}
                  <rect x="13.8" y="19" width="3.2" height="1" fill="#ffffff" /> {/* Right white cuff */}

                  {/* Back legs walking stepping offsets */}
                  {walkFrame === 0 ? (
                    <>
                      {/* Left leg extended back, right leg passing */}
                      <rect x="7.5" y="20" width="2" height="2" fill={C_SKIN} />
                      <rect x="7" y="21.5" width="2.5" height="1" fill={C_SLIPPER} />
                      
                      <rect x="14.5" y="20" width="2" height="1" fill={C_SKIN} />
                      <rect x="14" y="21" width="2.5" height="1" fill={C_SLIPPER} />
                    </>
                  ) : walkFrame === 2 ? (
                    <>
                      {/* Right leg extended back, left leg passing */}
                      <rect x="7.5" y="20" width="2" height="1" fill={C_SKIN} />
                      <rect x="7" y="21" width="2.5" height="1" fill={C_SLIPPER} />
                      
                      <rect x="14.5" y="20" width="2" height="2" fill={C_SKIN} />
                      <rect x="14" y="21.5" width="2.5" height="1" fill={C_SLIPPER} />
                    </>
                  ) : (
                    <>
                      {/* Normal standing still legs */}
                      <rect x="7.5" y="20" width="2" height="1.5" fill={C_SKIN} />
                      <rect x="7" y="21.5" width="2.5" height="1" fill={C_SLIPPER} />
                      <rect x="14.5" y="20" width="2" height="1.5" fill={C_SKIN} />
                      <rect x="14" y="21.5" width="2.5" height="1" fill={C_SLIPPER} />
                    </>
                  )}
                </g>
              )}

              {/* ==================== B. IDLE FRAME B (HEAD TILTED COVERING FACE) ==================== */}
              {(actionState === 'idle' && idleFrame === 'B') && (
                <g id="luffy-nav-idle-b">
                  {/* Large straw hat tilted low covering the face completely */}
                  <rect x="8" y="4" width="8" height="3" fill={C_HAT} />
                  <rect x="8" y="5.8" width="8" height="1" fill={C_HAT_R} />
                  <rect x="4" y="6.8" width="16" height="2" fill={C_HAT} stroke={C_HAT_S} strokeWidth="0.5" />
                  
                  {/* Spiky hair locks poking out below the hat on sides */}
                  <rect x="5" y="8.8" width="2.5" height="2.5" fill={C_HAIR} />
                  <rect x="16.5" y="8.8" width="2.5" height="2.5" fill={C_HAIR} />
                  
                  {/* Only his chin/neck is visible (no eyes, no mouth since he's looking straight down!) */}
                  <rect x="9.5" y="8.8" width="5" height="1.2" fill={C_SKIN} />

                  {/* Body vest, sash & shorts */}
                  <rect x="6" y="10" width="12" height="5.5" fill={C_VEST} />
                  <polygon points="10,10 14,10 12,12" fill={C_SKIN} /> {/* V chest skin peaking out */}
                  
                  {/* Arms at sides */}
                  <rect x="4" y="10" width="2" height="4.5" fill={C_SKIN} />
                  <rect x="18" y="10" width="2" height="4.5" fill={C_SKIN} />

                  {/* Sash & pants */}
                  <rect x="7" y="15.5" width="10" height="1" fill={C_SASH} />
                  <rect x="7" y="16.5" width="10" height="3.5" fill={C_PANTS} stroke={C_PANTS_S} strokeWidth="0.3" />
                  <rect x="7" y="20" width="3" height="1" fill="#ffffff" />
                  <rect x="14" y="20" width="3" height="1" fill="#ffffff" />

                  {/* Legs & slippers */}
                  <rect x="7.5" y="21" width="2" height="1" fill={C_SKIN} />
                  <rect x="14.5" y="21" width="2" height="1" fill={C_SKIN} />
                  <rect x="7.2" y="22" width="2.5" height="1" fill={C_SLIPPER} />
                  <rect x="14.2" y="22" width="2.5" height="1" fill={C_SLIPPER} />
                </g>
              )}

              {/* ==================== C. PROFILE VIEW WALKING (EAST/WEST) ==================== */}
              {((direction === 'left' || direction === 'right') && actionState !== 'idle') && (
                <g id="luffy-nav-profile">
                  {/* Hat oriented asymmetrically for profile views */}
                  <rect x="8" y="2" width="6" height="2" fill={C_HAT} />
                  <rect x="8" y="3" width="6" height="1" fill={C_HAT_R} />
                  <rect x="4" y="4" width="13" height="2.2" fill={C_HAT} />

                  {/* Peach Face showing cute profile details */}
                  <rect x="7" y="6.1" width="7" height="4.5" fill={C_SKIN} />
                  <rect x="6" y="6.1" width="2.2" height="2.2" fill={C_HAIR} /> {/* Back spiky hair */}
                  
                  {/* Eye, Nose and Mouth pointing east */}
                  <rect x="12" y="7" width="1.2" height="1.2" fill={C_HAIR} /> {/* Eye */}
                  <rect x="14" y="8" width="1" height="0.8" fill={C_SKIN} /> {/* Protruding cute nose */}
                  <rect x="11.5" y="9" width="1.8" height="0.6" stroke={C_HAIR} strokeWidth="0.8" /> {/* Smile */}

                  {/* Profile red coat vest and pants steps */}
                  <rect x="7" y="10.5" width="7" height="4.5" fill={C_VEST} />
                  
                  {/* Dynamic side swinging limbs */}
                  {walkFrame === 0 ? (
                    <>
                      <rect x="5.5" y="10.5" width="2" height="4.5" fill={C_SKIN} /> {/* back arm */}
                      <rect x="10.5" y="16" width="3" height="4" fill={C_PANTS} /> {/* front leg stepping */}
                      <rect x="10.5" y="20" width="3" height="1" fill="#ffffff" />
                      <rect x="10.5" y="21" width="3" height="1" fill={C_SLIPPER} />
                      
                      <rect x="6.5" y="15" width="3" height="3" fill={C_PANTS} /> {/* passing leg */}
                      <rect x="6.5" y="18" width="2.8" height="1" fill={C_SLIPPER} />
                    </>
                  ) : walkFrame === 2 ? (
                    <>
                      <rect x="9.5" y="10.5" width="2" height="4" fill={C_SKIN} /> {/* forward arm */}
                      <rect x="5.5" y="16" width="3" height="4" fill={C_PANTS} /> {/* step back */}
                      <rect x="5.5" y="20" width="3" height="1" fill="#ffffff" />
                      <rect x="5" y="21" width="3" height="1" fill={C_SLIPPER} />
                      
                      <rect x="9.5" y="15" width="3" height="3" fill={C_PANTS} /> {/* step forward */}
                      <rect x="9.5" y="18" width="2.8" height="1" fill={C_SLIPPER} />
                    </>
                  ) : (
                    <>
                      {/* Neutral standing side pose */}
                      <rect x="7" y="15" width="6" height="5" fill={C_PANTS} />
                      <rect x="7" y="20" width="6" height="1" fill="#ffffff" />
                      <rect x="7" y="21" width="2.5" height="1" fill={C_SLIPPER} />
                      <rect x="10.5" y="21" width="2.5" height="1" fill={C_SLIPPER} />
                    </>
                  )}
                </g>
              )}

              {/* ==================== D. DEFAULT FRONT-FACING CORE (DOWN OR IDLE A/C) ==================== */}
              {/* Handles facing DOWN and facing EAST/WEST during IDLE states */}
              {(direction === 'down' || (actionState === 'idle' && idleFrame !== 'B')) && (
                <g id="luffy-nav-front">
                  {/* Straw Hat Crown & Band */}
                  <rect x="8" y="2" width="8" height="2" fill={C_HAT} />
                  <rect x="8" y="3.5" width="8" height="0.8" fill={C_HAT_R} />
                  <rect x="5" y="4.5" width="14" height="1.8" fill={C_HAT} stroke={C_HAT_S} strokeWidth="0.5" />
                  
                  {/* Spiky hair lock framing eyes */}
                  <rect x="6" y="6.1" width="12" height="2" fill={C_HAIR} />
                  <rect x="6" y="8" width="1.8" height="2" fill={C_HAIR} /> {/* Left lock */}
                  <rect x="16.2" y="8" width="1.8" height="2" fill={C_HAIR} /> {/* Right lock */}

                  {/* Soft peach face skin */}
                  <rect x="7.8" y="6.3" width="8.4" height="4.5" fill={C_SKIN} />
                  
                  {/* Cute anime large black round eyes */}
                  <rect x="9.3" y="8.2" width="1.2" height="1.2" fill={C_HAIR} />
                  <rect x="13.5" y="8.2" width="1.2" height="1.2" fill={C_HAIR} />
                  {/* Stitch scar under left eye (Luffy signature) */}
                  <line x1="13.5" y1="10" x2="15" y2="10" stroke={C_VEST} strokeWidth="0.6" />
                  
                  {/* Happy curved smile */}
                  <path d="M10.8 10.3 Q12 11.5 13.2 10.3" stroke={C_HAIR} strokeWidth="0.8" fill="none" />

                  {/* Red sleeveless coat vest exposing chest */}
                  <rect x="6" y="10.8" width="12" height="4.8" fill={C_VEST} />
                  {/* Peachy V collar neck exposure */}
                  <polygon points="10,10.8 14,10.8 12,13" fill={C_SKIN} />
                  {/* Gold blazer buttons */}
                  <rect x="8.5" y="12" width="0.8" height="0.8" fill={C_HAT} />
                  <rect x="14.7" y="12" width="0.8" height="0.8" fill={C_HAT} />

                  {/* ------------------- HANDS & ARMS MOVEMENT STEPS ------------------- */}
                  {(actionState === 'carrying-swords' || actionState === 'swords') ? (
                    <>
                      {/* Luffy's arms outstretched carrying Zoro's 3 katanas */}
                      <rect x="2" y="11" width="4" height="2" fill={C_SKIN} />
                      <rect x="18" y="11" width="4" height="2" fill={C_SKIN} />

                      {/* Zoro's 3 Katanas bundle across Luffy's chest/arms */}
                      <rect x="1" y="9.5" width="22" height="1.4" fill="#15803d" stroke="#18181b" strokeWidth="0.4" />
                      <rect x="4" y="9" width="1.2" height="2.4" fill="#f59e0b" />

                      <rect x="1" y="11" width="22" height="1.4" fill="#991b1b" stroke="#18181b" strokeWidth="0.4" />
                      <rect x="5.5" y="10.5" width="1.2" height="2.4" fill="#f59e0b" />

                      <rect x="1" y="12.5" width="22" height="1.4" fill="#0f172a" stroke="#18181b" strokeWidth="0.4" />
                      <rect x="7" y="12" width="1.2" height="2.4" fill="#f59e0b" />
                    </>
                  ) : (actionState === 'defending-fuusen' || actionState === 'fuusen') ? (
                    <>
                      {/* Gomu Gomu no Fuusen rubber balloon shield */}
                      <circle cx="12" cy="13" r="8" fill={C_VEST} stroke="#18181b" strokeWidth="0.8" />
                      <rect x="2" y="12" width="2" height="2" fill={C_SKIN} rx="1" />
                      <rect x="20" y="12" width="2" height="2" fill={C_SKIN} rx="1" />
                    </>
                  ) : (actionState === 'idle' && idleFrame === 'A') ? (
                    <>
                      {/* Left hand raised up high touching hat brim */}
                      <rect x="16.5" y="5.5" width="2" height="3" fill={C_SKIN} />
                      <rect x="17.2" y="8.5" width="1.8" height="3" fill={C_VEST} /> {/* Raised sleeve */}
                      
                      {/* Right hand hanging normal */}
                      <rect x="4" y="11" width="2" height="4" fill={C_SKIN} />
                    </>
                  ) : walkFrame === 0 && actionState !== 'idle' ? (
                    <>
                      {/* Left arm swung forward, right arm swung back */}
                      <rect x="4" y="9.5" width="2" height="4" fill={C_SKIN} />
                      <rect x="18" y="11.5" width="2" height="4" fill={C_SKIN} />
                    </>
                  ) : walkFrame === 2 && actionState !== 'idle' ? (
                    <>
                      {/* Right arm swung forward, left arm swung back */}
                      <rect x="18" y="9.5" width="2" height="4" fill={C_SKIN} />
                      <rect x="4" y="11.5" width="2" height="4" fill={C_SKIN} />
                    </>
                  ) : (
                    <>
                      {/* Neutral standing idle arms hanging comfy */}
                      <rect x="4" y="11" width="2" height="4.5" fill={C_SKIN} />
                      <rect x="18" y="11" width="2" height="4.5" fill={C_SKIN} />
                    </>
                  )}

                  {/* White sash sash belt */}
                  <rect x="7" y="15.6" width="10" height="1" fill={C_SASH} />

                  {/* Walk Stepping Feet loops */}
                  {walkFrame === 0 && actionState !== 'idle' ? (
                    <>
                      {/* Left leg step down, right leg step higher */}
                      <rect x="7" y="16.6" width="10" height="3" fill={C_PANTS} />
                      <rect x="7" y="19.6" width="3.2" height="1" fill="#ffffff" />
                      <rect x="13.8" y="19.6" width="3.2" height="1" fill="#ffffff" />
                      
                      <rect x="14.2" y="20.6" width="2" height="1" fill={C_SKIN} />
                      <rect x="13.8" y="21.6" width="2.5" height="1.2" fill={C_SLIPPER} />
                      
                      <rect x="7.4" y="20.6" width="2" height="1.8" fill={C_SKIN} />
                      <rect x="7" y="22.4" width="2.5" height="1.2" fill={C_SLIPPER} />
                    </>
                  ) : walkFrame === 2 && actionState !== 'idle' ? (
                    <>
                      {/* Right leg step down, left leg step higher */}
                      <rect x="7" y="16.6" width="10" height="3" fill={C_PANTS} />
                      <rect x="7" y="19.6" width="3.2" height="1" fill="#ffffff" />
                      <rect x="13.8" y="19.6" width="3.2" height="1" fill="#ffffff" />
                      
                      <rect x="7.4" y="20.6" width="2" height="1" fill={C_SKIN} />
                      <rect x="7" y="21.6" width="2.5" height="1.2" fill={C_SLIPPER} />
                      
                      <rect x="14.2" y="20.6" width="2" height="1.8" fill={C_SKIN} />
                      <rect x="13.8" y="22.4" width="2.5" height="1.2" fill={C_SLIPPER} />
                    </>
                  ) : (
                    <>
                      {/* Neutral standing legs */}
                      <rect x="7" y="16.6" width="10" height="3.5" fill={C_PANTS} stroke={C_PANTS_S} strokeWidth="0.3" />
                      <rect x="7" y="20.1" width="3.2" height="1" fill="#ffffff" />
                      <rect x="13.8" y="20.1" width="3.2" height="1" fill="#ffffff" />
                      
                      <rect x="7.6" y="21.1" width="2" height="1" fill={C_SKIN} />
                      <rect x="14.4" y="21.1" width="2" height="1" fill={C_SKIN} />
                      <rect x="7" y="22.1" width="2.8" height="1.1" fill={C_SLIPPER} />
                      <rect x="14" y="22.1" width="2.8" height="1.1" fill={C_SLIPPER} />
                    </>
                  )}
                </g>
              )}
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
};

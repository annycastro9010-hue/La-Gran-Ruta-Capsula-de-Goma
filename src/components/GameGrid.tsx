import React, { useMemo } from 'react';
import { Cell, CellType, Direction, Enemy, PlayerState, Position } from '../types';
import { Swords, Anchor, Award, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getPasherTheme, getPasherCellClass } from '../utils/pasher';
import { LuffySprite } from './LuffySprite';
import { KobySprite } from './KobySprite';
import { AlvidaSprite } from './AlvidaSprite';
import { PirateSprite } from './PirateSprite';
import { ZoroSprite } from './ZoroSprite';
import { MarineSprite } from './MarineSprite';
import { NpcSprite } from './NpcSprite';

interface GameGridProps {
  grid: Cell[][];
  player: PlayerState;
  enemies: Enemy[];
  onCellClick?: (x: number, y: number) => void;
  floatingTexts: { id: string; x: number; y: number; text: string; color: string }[];
  showVirtualControls?: boolean;
  isSidebarLayout?: boolean;
  currentLevel?: number;
}

export const GameGrid: React.FC<GameGridProps> = ({ 
  grid, 
  player, 
  enemies, 
  onCellClick, 
  floatingTexts,
  showVirtualControls = true,
  isSidebarLayout = false,
  currentLevel = 1
}) => {

  const [attackFrame, setAttackFrame] = React.useState(0);

  React.useEffect(() => {
    if (player.actionState.startsWith('attacking-')) {
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
  }, [player.actionState]);

  // Map enemy list to coordinate maps for lightning fast lookups
  const enemyMap = useMemo(() => {
    const map = new Map<string, Enemy>();
    enemies.forEach((enemy) => {
      // Avoid dead or unspawned enemies
      if (enemy.hp > 0) {
        map.set(`${enemy.x},${enemy.y}`, enemy);
      }
    });
    return map;
  }, [enemies]);

  // Determine standard colors or graphics for each cell type
  const getCellClassName = (cell: Cell) => {
    return getPasherCellClass(currentLevel, cell);
  };

  // Render Luffy's stretch GUM-GUM PISTOL fist extending
  const renderLuffyAttackVector = () => {
    if (!player.actionState.startsWith('attacking-')) return null;

    // Calculate reach of the stretching fist (2 tiles ahead)
    const stretchDistance = player.actionState === 'attacking-gatling' ? 1.5 : 2;
    let deltaX = 0;
    let deltaY = 0;

    switch (player.direction) {
      case 'up': deltaY = -1; break;
      case 'down': deltaY = 1; break;
      case 'left': deltaX = -1; break;
      case 'right': deltaX = 1; break;
    }

    const startLeft = `${player.x * 6.25 + 3.125}%`;
    const startTop = `${player.y * 8.33 + 4.16}%`;
    const endLeft = `${(player.x + deltaX * stretchDistance) * 6.25 + 3.125}%`;
    const endTop = `${(player.y + deltaY * stretchDistance) * 8.33 + 4.16}%`;

    const isGatling = player.actionState === 'attacking-gatling';
    const isWhip = player.actionState === 'attacking-whip';

    if (isWhip) {
      // Area sweep loop with multiple expanding, rotating slash particles (GUM-GUM WHIP!)
      return (
        <div 
          className="absolute z-35 pointer-events-none"
          style={{
            left: `${player.x * 6.25 + 3.125}%`,
            top: `${player.y * 8.33 + 4.16}%`,
            transform: 'translate(-50%, -50%)',
            width: '18.75%', // covers 3x3 tiles
            height: '25%',
          }}
        >
          {/* Main explosive shockwave expansion */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ 
              scale: [0.5, 2.3, 2.6], 
              opacity: [0.3, 0.9, 0],
              borderWidth: ["8px", "2px", "0px"]
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-4 border-dashed border-red-500 bg-red-500/10 flex items-center justify-center"
          />

          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ 
              scale: [0.8, 2.1, 2.5], 
              opacity: [0.4, 0.8, 0],
            }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
            className="absolute inset-0 rounded-full border-2 border-yellow-400 bg-yellow-400/5"
          />

          {/* Sweeping rotating whip leg/blast */}
          <motion.div 
            initial={{ rotate: 0, scale: 0.5 }}
            animate={{ rotate: 360, scale: [0.8, 2.2, 0.8] }}
            transition={{ duration: 0.25, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Whip particles on the edge of the sweep */}
            <div className="absolute top-0 text-xl font-bold">🦵🌪️</div>
            <div className="absolute right-0 text-xl font-bold">💥💦</div>
            <div className="absolute bottom-0 text-xl font-bold">👟🌪️</div>
            <div className="absolute left-0 text-xl font-bold">💥💨</div>
          </motion.div>
          
          {/* Sparkles / dust puffs */}
          <div className="absolute inset-x-0 top-0 flex justify-between">
            <motion.span animate={{ x: [-10, -50], y: [-10, -50], opacity: [1, 0] }} transition={{ duration: 0.22 }} className="text-sm">✨</motion.span>
            <motion.span animate={{ x: [10, 50], y: [-10, -50], opacity: [1, 0] }} transition={{ duration: 0.22 }} className="text-sm">✨</motion.span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between">
            <motion.span animate={{ x: [-10, -50], y: [10, 50], opacity: [1, 0] }} transition={{ duration: 0.22 }} className="text-sm">💨</motion.span>
            <motion.span animate={{ x: [10, 50], y: [10, 50], opacity: [1, 0] }} transition={{ duration: 0.22 }} className="text-sm">💨</motion.span>
          </div>
        </div>
      );
    }

    if (isGatling) {
      // Calculate the 2x3 tiles in front of luffy to form the exact "Ráfaga Elástica de 2x3"
      const cones: { x: number; y: number }[] = [];
      const dir = player.direction;
      if (dir === 'up') {
        for (let dy = -1; dy >= -2; dy--) {
          for (let dx = -1; dx <= 1; dx++) {
            cones.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      } else if (dir === 'down') {
        for (let dy = 1; dy <= 2; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            cones.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      } else if (dir === 'left') {
        for (let dx = -1; dx >= -2; dx--) {
          for (let dy = -1; dy <= 1; dy++) {
            cones.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      } else if (dir === 'right') {
        for (let dx = 1; dx <= 2; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            cones.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      }

      return (
        <>
          {/* Pulsing red-orange impact areas matching reference Section III */}
          {cones.map((tile, idx) => {
            if (tile.x < 0 || tile.x >= 16 || tile.y < 0 || tile.y >= 12) return null;
            return (
              <motion.div
                key={`cone-${idx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.22, 0.45, 0.22], scale: 1 }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.02 }}
                className="absolute z-10 border border-yellow-500 bg-red-600/15 ring-1 ring-yellow-400 pointer-events-none"
                style={{
                  left: `${tile.x * 6.25}%`,
                  top: `${tile.y * 8.33}%`,
                  width: '6.25%',
                  height: '8.33%',
                  boxShadow: '0 0 8px rgba(245, 158, 11, 0.3)',
                }}
              />
            );
          })}

          {/* Label banner overlay on the central foremost impact tile */}
          {(() => {
            const labelTile = cones[4] || cones[1]; // central forward tile
            if (!labelTile || labelTile.x < 0 || labelTile.x >= 16 || labelTile.y < 0 || labelTile.y >= 12) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-20 px-2 py-0.5 pointer-events-none bg-red-950/90 text-red-100 text-[8px] sm:text-[10px] font-black border border-yellow-500 rounded shadow-md uppercase tracking-wider text-center flex flex-col items-center justify-center whitespace-nowrap"
                style={{
                  left: `${labelTile.x * 6.25 + 3.125}%`,
                  top: `${labelTile.y * 8.33 + 4.16}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span>¡Gomu Gomu no... GATLING!</span>
                <span className="text-yellow-400 text-[6px] sm:text-[7px]">Ráfaga de Goma 2x3</span>
              </motion.div>
            );
          })()}

          {/* Dynamic multi-overlapping chaotic fists */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-35">
            <defs>
              <radialGradient id="fistGlowRed" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="fistGlowYellow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {cones.map((targetTile, idx) => {
              if (targetTile.x < 0 || targetTile.x >= 16 || targetTile.y < 0 || targetTile.y >= 12) return null;

              const punchStartLeft = `${player.x * 6.25 + 3.125}%`;
              const punchStartTop = `${player.y * 8.33 + 4.16}%`;

              // Scatter the fist positions slightly to simulate rapid random strikes inside that cell
              const scatterX = (Math.sin(idx * 79.3) * 1.2) * 6.25;
              const scatterY = (Math.cos(idx * 43.1) * 1.2) * 8.33;

              const punchEndLeft = `${targetTile.x * 6.25 + 3.125 + scatterX}%`;
              const punchEndTop = `${targetTile.y * 8.33 + 4.16 + scatterY}%`;

              return (
                <React.Fragment key={`fist-punch-${idx}`}>
                  {/* Punch speed trail */}
                  <motion.line
                    x1={punchStartLeft}
                    y1={punchStartTop}
                    x2={punchEndLeft}
                    y2={punchEndTop}
                    stroke={idx % 2 === 0 ? "#fca5a5" : "#fed7aa"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "100", strokeDashoffset: "100" }}
                    animate={{ strokeDashoffset: ["100", "0", "100"] }}
                    transition={{
                      duration: 0.18,
                      repeat: 2,
                      ease: "easeInOut",
                      delay: idx * 0.03
                    }}
                  />

                  {/* Fist bullet icons */}
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0.6, 1.5, 0.6],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 0.20,
                      repeat: 2,
                      delay: idx * 0.03
                    }}
                  >
                    <rect
                      x={punchEndLeft}
                      y={punchEndTop}
                      width="30"
                      height="30"
                      rx="15"
                      fill={idx % 2 === 0 ? "url(#fistGlowRed)" : "url(#fistGlowYellow)"}
                      style={{ transform: 'translate(-15px, -15px)' }}
                    />
                    <text
                      x={punchEndLeft}
                      y={punchEndTop}
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="black"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      👊
                    </text>
                  </motion.g>
                </React.Fragment>
              );
            })}
          </svg>
        </>
      );
    }

    const x1 = parseFloat(startLeft);
    const y1 = parseFloat(startTop);
    const x2 = parseFloat(endLeft);
    const y2 = parseFloat(endTop);

    // Calculate reach of the stretching arm based on current frame
    // Frame 0: Prep (0%)
    // Frame 1: Estiramiento (55%)
    // Frame 2: Alcance Máximo (100%)
    // Frame 3: Retracción (15%)
    let reachedFactor = 0;
    if (attackFrame === 1) reachedFactor = 0.55;
    else if (attackFrame === 2) reachedFactor = 1.0;
    else if (attackFrame === 3) reachedFactor = 0.15;

    const dx = x2 - x1;
    const dy = y2 - y1;

    // Active endpoint based on stretching reachedFactor
    const xe = x1 + dx * reachedFactor;
    const ye = y1 + dy * reachedFactor;

    // Sleeve reaches maximum 25% of the total distance
    const sleeveFactor = Math.min(0.25, reachedFactor);
    const xs = x1 + dx * sleeveFactor;
    const ys = y1 + dy * sleeveFactor;

    // Vector rotation angle based on player direction
    let angle = 0;
    switch (player.direction) {
      case 'down': angle = 90; break;
      case 'left': angle = 180; break;
      case 'up': angle = 270; break;
      case 'right': angle = 0; break;
    }

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-35">
        <defs>
          <radialGradient id="fistGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. DUST IMPACT PUFF RINGS ON FRAME 3 (RETRACCION / IMPACT PUFFS) */}
        {attackFrame === 3 && (
          <g id="impact-dust-puffs">
            <motion.rect
              x={`${x2 - 3}%`}
              y={`${y2 - 3}%`}
              width="6%"
              height="6%"
              rx="50%"
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              stroke="#f1f5f9"
              fill="none"
            />
          </g>
        )}

        {/* DRAW STRETCHING ARM ONLY IF ACTIVE & IN TRANSIT (FRAMES 1, 2, 3) */}
        {reachedFactor > 0 && (
          <g id="stretchy-arm">
            {/* Outline layers for crisp retro black line boundaries */}
            <line
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${xe}%`}
              y2={`${ye}%`}
              stroke="#18181b"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* A. BARE PEACH fore-arm skin bridge */}
            <line
              x1={`${xs}%`}
              y1={`${ys}%`}
              x2={`${xe}%`}
              y2={`${ye}%`}
              stroke="#fed7aa"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Muscle Shadow segment (Peach Shadow line running along the bottom/side half) */}
            <line
              x1={`${xs + (player.direction === 'up' || player.direction === 'down' ? -1 : 0) * 0.5}%`}
              y1={`${ys + (player.direction === 'left' || player.direction === 'right' ? 1.5 : 0) * 0.5}%`}
              x2={`${xe + (player.direction === 'up' || player.direction === 'down' ? -1 : 0) * 0.5}%`}
              y2={`${ye + (player.direction === 'left' || player.direction === 'right' ? 1.5 : 0) * 0.5}%`}
              stroke="#fca5a5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* B. RED SLEEVE wrapper near Luffy's shoulder */}
            <line
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${xs}%`}
              y2={`${ys}%`}
              stroke="#ef4444"
              strokeWidth="8.5"
              strokeLinecap="round"
            />

            {/* SLEEVE FLOWER PATTERN PRINTS (CRISP WHITE DOTS ALONG THE SLEEVE VECTOR) */}
            {sleeveFactor > 0 && (
              <g>
                <rect
                  x={`${x1 + dx * sleeveFactor * 0.4}%`}
                  y={`${y1 + dy * sleeveFactor * 0.4}%`}
                  width="2.4"
                  height="2.4"
                  rx="1.2"
                  fill="#ffffff"
                />
                <rect
                  x={`${x1 + dx * sleeveFactor * 0.75}%`}
                  y={`${y1 + dy * sleeveFactor * 0.75}%`}
                  width="2.4"
                  height="2.4"
                  rx="1.2"
                  fill="#ffffff"
                />
              </g>
            )}

            {/* C. CRISP RETRO CLENCHED PIXEL FIST */}
            <g transform={`translate(${xe} ${ye}) rotate(${angle}) scale(1.15)`} style={{ transformOrigin: '0px 0px' }}>
              <g transform="translate(-5, -5)">
                {/* Backplate boundary */}
                <rect x="-1" y="-1" width="12" height="12" rx="3" fill="#18181b" />
                {/* Knuckle skin fill */}
                <rect x="0" y="0" width="10" height="10" rx="2" fill="#fed7aa" />
                {/* Lower muscle shadow */}
                <rect x="0" y="5" width="10" height="5" rx="1" fill="#fca5a5" />
                {/* Knuckle creases outline */}
                <line x1="4" y1="2" x2="8" y2="2" stroke="#18181b" strokeWidth="0.8" />
                <line x1="4" y1="5" x2="8" y2="5" stroke="#18181b" strokeWidth="0.8" />
                <line x1="4" y1="8" x2="8" y2="8" stroke="#18181b" strokeWidth="0.8" />
              </g>
            </g>
          </g>
        )}

        {/* D. IMPACT SPARKLES & ATTACK WARNING CIRCLES ON MAX REACH FRAME 2 */}
        {attackFrame === 2 && (
          <g id="impact-sparks">
            <rect
              x={`${x2 - 3}%`}
              y={`${y2 - 3}%`}
              width="6%"
              height="6%"
              rx="50%"
              fill="url(#fistGlow)"
            />
            {/* Quick electric retro sparks radiating out */}
            {[-1.5, 1.5].map((sx) =>
              [-1.5, 1.5].map((sy) => (
                <line
                  key={`${sx}-${sy}`}
                  x1={`${x2}%`}
                  y1={`${y2}%`}
                  x2={`${x2 + sx * 2.5}%`}
                  y2={`${y2 + sy * 2.5}%`}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))
            )}
          </g>
        )}
      </svg>
    );
  };

  const renderLevel1Decorations = (x: number, y: number) => {
    if (currentLevel !== 1) return null;

    // Bed, crates, ropes, table setup matching client design
    if (x === 2 && y === 1) {
      return (
        <div className="absolute inset-0 flex flex-col gap-0.5 items-center justify-center pointer-events-none select-none z-10 scale-90">
          <span className="text-xs leading-none drop-shadow">📦</span>
          <span className="text-[5.5px] font-black text-[#5c401f] bg-white/70 px-0.5 rounded leading-none">CAJAS</span>
        </div>
      );
    }
    if (x === 2 && y === 2) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
          <span className="text-sm leading-none drop-shadow filter saturate-150">🪢</span>
          <span className="text-[5px] font-bold text-[#e11d48] bg-slate-900/60 px-0.5 rounded leading-none mt-0.5">SOGAS</span>
        </div>
      );
    }
    if (x === 1 && y === 1) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
          <span className="text-xs leading-none drop-shadow">🔵🛢️</span>
          <span className="text-[5px] font-black text-sky-400 bg-slate-950/70 px-0.5 rounded leading-none mt-0.5">AGUA</span>
        </div>
      );
    }
    if (x === 1 && y === 6) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-80 scale-[0.8]">
          <span className="text-xs drop-shadow">🍖</span>
        </div>
      );
    }
    if (x === 2 && y === 5) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-85 scale-[0.75]">
          <span className="text-xs drop-shadow">🦴</span>
        </div>
      );
    }
    if (x === 7 && y === 1) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 scale-90">
          <span className="text-sm leading-none drop-shadow animate-float">🛏️</span>
          <span className="text-[5px] font-bold text-sky-200 bg-blue-900/40 px-0.5 rounded leading-none mt-0.5">BUNKS</span>
        </div>
      );
    }
    if (x === 9 && y === 1) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 scale-90">
          <span className="text-sm leading-none drop-shadow">🛏️</span>
          <span className="text-[5px] font-bold text-sky-200 bg-blue-900/40 px-0.5 rounded leading-none mt-0.5">LITERAS</span>
        </div>
      );
    }
    if (x === 8 && y === 1) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 scale-90">
          <span className="text-xs">🪵📖</span>
          <span className="text-[5px] text-[#4a2e16] font-bold">ESTANTE</span>
        </div>
      );
    }
    if (x === 8 && y === 2) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20">
          <span className="text-xs">⚓</span>
        </div>
      );
    }
    if (x === 8 && y === 4) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
          <span className="text-xs leading-none drop-shadow">🪵🪑</span>
          <span className="text-[5px] font-semibold text-slate-350 bg-slate-900/30 px-0.5 rounded mt-0.5">MESA</span>
        </div>
      );
    }
    if (x === 13 && y === 7) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
          <span className="text-sm leading-none drop-shadow saturate-150 scale-105">🛏️👑</span>
          <span className="text-[5px] font-black text-rose-200 bg-rose-900/60 px-0.5 rounded leading-none mt-0.5 uppercase tracking-tighter">ROYAL BED</span>
        </div>
      );
    }
    if (x === 12 && y === 8) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 scale-90">
          <span className="text-xs leading-none">🪞🚪</span>
          <span className="text-[4.5px] font-bold text-pink-300">TOCADOR</span>
        </div>
      );
    }
    return null;
  };

  const gridMaxHeightPadding = isSidebarLayout
    ? '170px'
    : '140px'; // Floating controls on mobile don't take vertical layout flow space

  return (
    <div 
      className="relative w-full aspect-[16/12] bg-slate-950 border-4 border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl select-none transition-all duration-350"
      style={{
        maxWidth: isSidebarLayout
          ? `min(100%, calc((100vh - ${gridMaxHeightPadding}) * 1.333), 920px)`
          : '100vw' // Expand fully to screen limits on small mobile ports
      }}
    >
      {/* 2D Grid Cells Background */}
      <div 
        className="absolute inset-0 w-full h-full grid"
        style={{
          gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(12, minmax(0, 1fr))',
        }}
      >
        {grid.flatMap((row, y) =>
          row.map((cell, x) => {
            const hasEnemy = enemyMap.get(`${x},${y}`);
            const cellClass = getCellClassName(cell);

            return (
              <div
                key={`${x}-${y}`}
                id={`cell-${x}-${y}`}
                onClick={() => onCellClick?.(x, y)}
                className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-all ${cellClass}`}
              >
                {/* 1. Deck Texture Overlays customized by active island */}
                {cell.type === 'deck' && (
                  <>
                    {(currentLevel !== 3 && currentLevel !== 4 && currentLevel !== 5) && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-40">
                        <div className="w-full h-[1px] bg-amber-950/70" />
                        <div className="w-full h-[1px] bg-amber-950/70" />
                        <div className="w-full h-[1px] bg-amber-950/70" />
                        {/* Metal copper pins/nails inside the planks */}
                        <div className="absolute top-1 left-1.5 w-[2px] h-[2px] rounded-full bg-amber-950/80" />
                        <div className="absolute bottom-1 right-2 w-[2px] h-[2px] rounded-full bg-amber-950/80" />
                        {/* Small vertical plank gap variations */}
                        {((x + y) % 3 === 0) && (
                          <div className="absolute top-0 bottom-0 left-[45%] w-[1px] bg-amber-950/50" />
                        )}
                      </div>
                    )}
                    {currentLevel === 3 && (
                      <div className="absolute inset-0 pointer-events-none opacity-40">
                        {/* Thin cross joint lines mimicking bricks and gray stones */}
                        <div className="absolute inset-y-0 left-[50%] w-[1px] bg-slate-900/30" />
                        <div className="absolute inset-x-0 top-[50%] h-[1px] bg-slate-900/30" />
                        {/* Pixel grit */}
                        <div className="absolute top-1.5 left-2 w-[2px] h-[1px] bg-slate-950/40" />
                        <div className="absolute bottom-2 right-1 w-[2px] h-[1px] bg-slate-950/40" />
                      </div>
                    )}
                    {currentLevel === 4 && (
                      <div className="absolute inset-0 pointer-events-none opacity-25">
                        <div className="absolute inset-x-0 bottom-1 h-[1px] bg-red-500/15" />
                        {((x * 7 + y * 13) % 4 === 0) && (
                          <div className="absolute top-1 right-1 text-[7px] text-yellow-500/45 select-none animate-pulse">✨</div>
                        )}
                      </div>
                    )}
                    {currentLevel === 5 && (
                      <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="absolute inset-x-0 top-0 bottom-0 left-[25%] w-[1px] bg-emerald-950/15" />
                        {((x * 11 + y * 3) % 5 === 0) && (
                          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-600/20" />
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* 2. Deluxe Royal Cabin Carpet on Inside Cabin Floors */}
                {cell.type === 'floor' && (
                  <div className="absolute inset-0 pointer-events-none animate-pulse-slow">
                    <div className="w-full h-full bg-rose-900/40 flex items-center justify-center">
                      <div className="w-3 h-3 border border-yellow-500/10 rotate-45 flex items-center justify-center">
                        <div className="w-1 h-1 bg-yellow-500/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Thematic Walls / Barriers details */}
                {cell.type === 'wall' && (
                  <>
                    {(currentLevel !== 3 && currentLevel !== 4 && currentLevel !== 5) && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                        {/* Dark wooden trim head */}
                        <div className="h-1.5 bg-amber-800 border-b border-amber-950 w-full" />
                        {/* Support cross ties */}
                        <div className="flex justify-around items-stretch h-full w-full px-0.5">
                          <div className="w-1 h-full bg-amber-950/60" />
                          <div className="w-1 h-full bg-amber-950/60" />
                        </div>
                        {/* Lower beam */}
                        <div className="h-1 bg-amber-950 w-full" />
                      </div>
                    )}
                    {currentLevel === 3 && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-50 bg-slate-950/10">
                        {/* Stone crown */}
                        <div className="h-2 bg-slate-800 border-b border-slate-950 w-full" />
                        {/* Dark stone brick joints */}
                        <div className="flex justify-between w-full h-full px-1">
                          <div className="w-[1px] h-full bg-slate-950" />
                          <div className="w-[1px] h-full bg-slate-950" />
                        </div>
                      </div>
                    )}
                    {currentLevel === 4 && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-50 bg-red-950/15">
                        <div className="h-1.5 bg-yellow-500 border-b border-orange-950 w-full" />
                        <div className="flex justify-between w-full h-full px-1.5">
                          <div className="w-[2px] h-full bg-red-800/40" />
                          <div className="w-[2px] h-full bg-yellow-500/40" />
                        </div>
                      </div>
                    )}
                    {currentLevel === 5 && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-45 bg-emerald-950/10">
                        <div className="h-2 bg-emerald-800 border-b border-emerald-950 w-full" />
                        <div className="flex justify-around w-full h-full">
                          <div className="w-[1px] h-full bg-emerald-900/50" />
                          <div className="w-[1px] h-full bg-emerald-900/50" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 4. Deep Sea ocean, lawns, or backyard waters animated dynamically */}
                {cell.type === 'water' && (
                  <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${
                    getPasherTheme(currentLevel).decorations.water?.bgGradient || 'from-indigo-950 to-slate-950'
                  } flex flex-col justify-around items-center p-0.5 overflow-hidden`}>
                    <motion.div
                      animate={currentLevel === 3 ? {
                        y: [-1, 2, -1],
                        rotate: [-6, 6, -6],
                      } : {
                        x: [-4, 4, -4],
                        y: [-1, 1, -1],
                        opacity: [0.25, 0.45, 0.25]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + (x % 3) * 1.2,
                        ease: "easeInOut"
                      }}
                      className="text-[9px] select-none tracking-widest text-cyan-400 font-bold"
                    >
                      {getPasherTheme(currentLevel).decorations.water?.waveEmoji || '~ ~'}
                    </motion.div>
                    
                    {/* Small passive water foam bubbles or sparkles */}
                    {((x * 11 + y * 7) % 9 === 0) && (
                      <div className="absolute top-1 left-2 w-1 h-1 rounded-full bg-blue-300/30 blur-[0.5px] animate-pulse" />
                    )}

                    {/* Cute responsive swimming animals or themed symbols */}
                    {((x * 5 + y * 17) % 19 === 0) && (
                      <motion.span
                        animate={{
                          x: [-12, 12, -12],
                          y: [-3, 3, -3],
                          scaleX: [-1, 1, -1]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 5.5,
                          ease: "linear"
                        }}
                        className="absolute text-[8px] opacity-40 select-none pointer-events-none"
                      >
                        {getPasherTheme(currentLevel).decorations.water?.fishEmoji || '🐟'}
                      </motion.span>
                    )}
                  </div>
                )}

                {/* 5. Giant Wood Flag/Mast/Post details populated by active theme */}
                {cell.type === 'mast' && (
                  <div className="absolute inset-0 flex items-center justify-center p-0.5 select-none">
                    <div className="absolute inset-1.5 bg-slate-950/75 rounded-full blur-[2px]" />
                    <div className={`w-8 h-8 rounded-full border bg-gradient-to-b from-amber-600 to-amber-900 flex items-center justify-center relative z-10 shadow-lg ${
                      getPasherTheme(currentLevel).decorations.mast?.glow || 'border-amber-950'
                    }`}>
                      <span className="text-[11px] drop-shadow-[0_1px_2px_black] select-none">
                        {getPasherTheme(currentLevel).decorations.mast?.symbol || '⚙️'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 6. GBA Wooden Stairs / Ladder up-down transition point */}
                {cell.type === 'stairs' && (
                  <div className={`absolute inset-0 pointer-events-none flex flex-col justify-around p-1 z-10 transition-all ${
                    player.hasKey 
                      ? 'bg-amber-500/30 ring-2 ring-yellow-400 animate-pulse' 
                      : 'bg-amber-950/20'
                  }`}>
                    <div className="w-full h-[3px] bg-amber-850 border-b border-amber-950 opacity-80" />
                    <div className="w-full h-[3px] bg-amber-850 border-b border-amber-950 opacity-80" />
                    <div className="w-full h-[3px] bg-amber-850 border-b border-amber-950 opacity-80" />
                    <div className="w-full h-[3px] bg-amber-850 border-b border-amber-950 opacity-80" />
                    {/* Floating indication emoji */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1">
                      <motion.span 
                        animate={{ y: [-2, 3, -2], scale: player.hasKey ? [1, 1.25, 1] : 1 }} 
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        className="text-sm sm:text-base font-bold text-amber-450 drop-shadow-md select-none"
                      >
                        {currentLevel === 5 ? '⛵🐑' : currentLevel >= 3 ? '⛵' : '🪜'}
                      </motion.span>
                      <span className="text-[6px] font-mono leading-none tracking-tight font-black text-yellow-300 bg-slate-950/90 px-0.5 rounded border border-yellow-500/30 uppercase animate-pulse">
                        {currentLevel === 5 ? 'GO_MERRY' : currentLevel >= 3 ? 'ZARPAR' : 'SUBIR'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Visual grid coordinates marker in subtle mono for level design check */}
                <span className="absolute top-0.5 left-0.5 text-[7px] text-slate-500/20 font-mono pointer-events-none select-none">
                  {x},{y}
                </span>

                {/* Coordinate specific custom background room decorations */}
                {renderLevel1Decorations(x, y)}

                {/* Draw environmental items */}
                {/* 1. Smashable Barrel */}
                {cell.type === 'barrel' && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center relative z-10"
                  >
                    <span className="text-xl">🛢️</span>
                    <span className="absolute bottom-[-1px] text-[6px] font-bold text-amber-300 bg-slate-950/70 px-0.5 py-0.1 border border-amber-500/20 rounded scale-90 whitespace-nowrap leading-none font-mono">BREAK</span>
                  </motion.div>
                )}
                {cell.type === 'barrel-broken' && (
                  <span className="text-sm select-none opacity-60">🪵</span>
                )}

                {/* Starting barrel for Luffy */}
                {cell.type === 'barrel-luffy' && player.actionState !== 'bursting-out' && (
                  <motion.div 
                    animate={{ y: [0, -2, 0], scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="text-2xl relative drop-shadow-[0_4px_8px_rgba(245,158,11,0.7)] z-10 flex flex-col items-center justify-center cursor-cell"
                  >
                    🛢️
                    <span className="absolute -top-1.5 -right-1 text-[8px] animate-pulse">✨</span>
                    <span className="absolute bottom-[-1px] text-[6px] font-black tracking-widest text-[#92400e] bg-[#fef08a] border border-[#f59e0b] px-1 rounded scale-90 whitespace-nowrap leading-none uppercase">LUFFY!</span>
                  </motion.div>
                )}

                {/* Koby Scared */}
                {cell.type === 'koby-scared' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                    <div className="absolute inset-1.5 bg-pink-950/20 rounded-full blur-[2px]" />
                    <div className="w-full h-full relative z-10">
                      <KobySprite isScared={true} />
                      <div className="absolute -top-1.5 -right-1 text-[9px] leading-none animate-bounce">💬</div>
                    </div>
                    <div className="absolute bottom-0 bg-pink-600/90 border border-pink-300 text-[6px] font-mono text-white font-extrabold px-1 rounded-full scale-90 whitespace-nowrap leading-none z-15">
                      KOBY
                    </div>
                  </div>
                )}

                {/* Koby Free */}
                {cell.type === 'koby-free' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                    <div className="absolute inset-1.5 bg-emerald-950/20 rounded-full blur-[2px]" />
                    <div className="w-full h-full relative z-10">
                      <KobySprite isScared={false} />
                    </div>
                    <div className="absolute bottom-0 bg-emerald-600/90 border border-emerald-300 text-[6px] font-mono text-white font-extrabold px-1 rounded-full scale-90 whitespace-nowrap leading-none z-15">
                      LIBRE
                    </div>
                  </div>
                )}

                {/* 2. Treasured Chest slots */}
                {cell.type === 'chest' && (
                  <motion.div 
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-xl relative drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)] z-10"
                  >
                    👑
                    <span className="absolute -top-1 -right-1 text-[8px] animate-pulse">✨</span>
                  </motion.div>
                )}
                {cell.type === 'chest-opened' && (
                  <span className="text-lg opacity-60 select-none">🔓</span>
                )}

                {/* 3. Zoro / Zack tied / free representation */}
                {cell.type === 'zoro-chained' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                    <ZoroSprite isChained={true} />
                    <div className="absolute bottom-0 bg-emerald-950/90 border border-emerald-400 text-[6px] font-mono text-emerald-300 font-extrabold px-1 rounded-full scale-90 whitespace-nowrap leading-none z-15">
                      ⛓️ ZACK ENCADENADO
                    </div>
                  </div>
                )}
                {cell.type === 'zoro-free' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                    <ZoroSprite isChained={false} />
                    <div className="absolute bottom-0 bg-emerald-600/90 border border-emerald-300 text-[6px] font-mono text-white font-extrabold px-1 rounded-full scale-90 whitespace-nowrap leading-none z-15">
                      ⚔️ ZACK SOCIO
                    </div>
                  </div>
                )}

                {/* 4. Locked Door with caution stripe theme */}
                {cell.type === 'door-locked' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10 overflow-hidden">
                    {/* Yellow and black diagonal caution stripes border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ef4444] via-[#7f1d1d] to-[#ef4444] opacity-90 border-[2px] border-amber-500 rounded animate-pulse" />
                    {currentLevel === 1 ? (
                      <div className="absolute inset-0.5 border border-dashed border-yellow-450 bg-slate-950 flex flex-col items-center justify-center p-0.5">
                        <span className="text-[9px] leading-none select-none">⚙️</span>
                        <span className="text-[5px] font-black text-yellow-300 bg-red-650 px-0.5 rounded mt-0.5 uppercase tracking-tighter">CERRADO</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-1 bg-slate-900/50 rounded">
                        <span className="text-[7px] text-amber-400 font-extrabold font-mono tracking-wider leading-none">CERRADO</span>
                        <span className="text-sm leading-none mt-1">🚧</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Zelda Minish Cap House Roof Tile */}
                {cell.type === 'house-roof' && (
                  <div className="relative w-full h-full bg-gradient-to-b from-red-700 via-red-800 to-rose-950 flex flex-col items-center justify-center border border-red-950 z-10 shadow-md">
                    <div className="w-full h-1 bg-amber-500/80" />
                    <span className="text-sm leading-none drop-shadow">🏠</span>
                    <span className="text-[5px] font-mono font-black text-red-200 uppercase tracking-tighter bg-red-950/80 px-0.5 rounded scale-90">CASA</span>
                  </div>
                )}

                {/* 6. Interactive House Door */}
                {cell.type === 'house-door' && (
                  <div className="relative w-full h-full bg-amber-950 border-2 border-amber-800 flex flex-col items-center justify-center z-10 cursor-pointer hover:brightness-125 transition-all">
                    <span className="text-sm leading-none animate-pulse">🚪</span>
                    <span className="text-[5.5px] font-mono font-black text-yellow-300 bg-slate-950/90 px-0.5 rounded border border-yellow-500/40 uppercase">ENTRAR</span>
                  </div>
                )}

                {/* 7. Minish Cap Flowers */}
                {cell.type === 'flower' && (
                  <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10">
                    <motion.span 
                      animate={{ scale: [0.9, 1.1, 0.9], rotate: [-4, 4, -4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-sm filter drop-shadow"
                    >
                      🌸
                    </motion.span>
                  </div>
                )}

                {/* 8. NPC Nina (Rice Ball Girl) */}
                {cell.type === 'npc-nina' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                    <NpcSprite type="nina" />
                    <div className="absolute -top-1.5 -right-1 text-[9px] leading-none animate-bounce">💬</div>
                    <div className="absolute bottom-0 bg-pink-600/90 border border-pink-300 text-[5.5px] font-mono text-white font-black px-1 rounded-full scale-90 leading-none z-15">
                      NINA 🍙
                    </div>
                  </div>
                )}

                {/* 9. NPC Villager */}
                {cell.type === 'npc-villager' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                    <NpcSprite type="villager" />
                    <div className="absolute -top-1.5 -right-1 text-[9px] leading-none animate-bounce">💬</div>
                    <div className="absolute bottom-0 bg-emerald-700/90 border border-emerald-300 text-[5.5px] font-mono text-white font-black px-1 rounded-full scale-90 leading-none z-15">
                      ALDEANO
                    </div>
                  </div>
                )}

                {/* 10. Minish Cap Pressure Plate Switches */}
                {cell.type === 'switch-off' && (
                  <div className="relative w-full h-full bg-slate-800 border-2 border-slate-600 rounded flex flex-col items-center justify-center z-10 shadow-inner">
                    <div className="w-5 h-5 bg-amber-600 border border-amber-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      <span className="text-[7px] text-amber-200 font-mono font-black">🔘</span>
                    </div>
                    <span className="text-[5px] text-amber-300 font-mono font-black uppercase tracking-tighter leading-none mt-0.5">BOTÓN</span>
                  </div>
                )}

                {cell.type === 'switch-on' && (
                  <div className="relative w-full h-full bg-emerald-900 border-2 border-emerald-500 rounded flex flex-col items-center justify-center z-10 shadow-[0_0_12px_rgba(16,185,129,0.8)]">
                    <div className="w-5 h-5 bg-emerald-400 border border-white rounded-full flex items-center justify-center scale-90 shadow-md">
                      <span className="text-[7px] text-emerald-950 font-mono font-black">✔</span>
                    </div>
                    <span className="text-[5px] text-emerald-300 font-mono font-black uppercase tracking-tighter leading-none mt-0.5">ACTIVADO</span>
                  </div>
                )}

                {/* 11. Minish Cap Clay Pots */}
                {cell.type === 'pot' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center z-10 cursor-pointer hover:brightness-125 transition-all">
                    <span className="text-base filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">🏺</span>
                    <span className="text-[5px] font-mono font-black text-amber-300 bg-slate-950/80 px-0.5 rounded border border-amber-600/50 scale-85 uppercase">VASIJA</span>
                  </div>
                )}

                {cell.type === 'pot-broken' && (
                  <div className="relative w-full h-full flex items-center justify-center z-10 opacity-70 scale-90">
                    <span className="text-xs filter drop-shadow">🧱</span>
                  </div>
                )}

                {/* 12. Animated Wall Torches */}
                {cell.type === 'torch' && (
                  <div className="relative w-full h-full bg-slate-900 border border-slate-750 rounded flex flex-col items-center justify-center z-10 shadow-inner">
                    <motion.span 
                      animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="text-base filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                    >
                      🔥
                    </motion.span>
                    <span className="text-[5px] text-amber-400 font-mono font-black tracking-tighter uppercase leading-none">ANTORCHA</span>
                  </div>
                )}

                {/* 13. Wooden Bridge Planks */}
                {cell.type === 'bridge' && (
                  <div className="relative w-full h-full bg-[#855529] border-y-2 border-[#4d2f13] flex items-center justify-center z-10 shadow-md">
                    <div className="w-full h-0.5 bg-[#4d2f13]/60 my-0.5" />
                    <span className="text-[6px] font-mono font-bold text-amber-200 uppercase tracking-widest opacity-60">PUENTE</span>
                  </div>
                )}

                {/* 14. Minish Cap White Stone Fortress Wall */}
                {cell.type === 'wall-stone' && (
                  <div className="relative w-full h-full bg-slate-200 border-2 border-slate-400 flex flex-col items-center justify-center z-10 shadow-md">
                    <div className="w-full h-1 bg-slate-400/80" />
                    <span className="text-[5.5px] font-mono font-black text-slate-800 uppercase tracking-widest">MURO</span>
                  </div>
                )}

                {/* 5. Draw decorative map boat/anchor at bottom-left */}
                {x === 1 && y === 10 && cell.type === 'grass' && player.x !== 1 && (
                  <div className="absolute flex flex-col items-center justify-center filter drop-shadow z-10">
                    <span className="text-2xl animate-float leading-none">⛵</span>
                    <span className="text-[7px] font-mono text-slate-100 bg-blue-900 px-1 rounded border border-blue-600 scale-90 mt-0.5">BOTE</span>
                  </div>
                )}

                {/* 6. Spawning static drops left on floor */}
                {cell.item && (
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute z-10 w-7 h-7 flex items-center justify-center text-lg drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] bg-slate-900/40 rounded-full"
                  >
                    {cell.item === 'meat' ? '🍖' : cell.item === 'key' ? '🔑' : cell.item === 'heart' ? '❤️' : '⚔️'}
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>





      {/* Draw Patrolling Enemies */}
      {enemies.map((enemy) => {
        if (enemy.hp <= 0) return null;

        // Custom visuals for pirate recruits, officers, and Captain Alvida
        let sprite = '🏴‍☠️';
        let spriteName = 'PIRATA';
        let spriteColor = 'border-amber-600 bg-amber-950/30';
        let size = 'w-10 h-10';

        if (enemy.type === 'pirate-officer') {
          sprite = '🗡️🏴‍☠️';
          spriteName = 'OFICIAL';
          spriteColor = 'border-pink-500 bg-pink-950/40 text-pink-300';
        } else if (enemy.type === 'alvida') {
          sprite = '🪡🦹‍♀️';
          spriteName = 'C. ALVIDA';
          spriteColor = 'border-rose-600 bg-rose-950/70 text-rose-100 font-extrabold shadow-[0_0_15px_rgba(244,63,94,0.6)]';
          size = 'w-14 h-14';
        } else if (enemy.type === 'marine') {
          sprite = '💂‍♂️👮‍♂️';
          spriteName = 'MARINO';
          spriteColor = 'border-sky-500 bg-blue-950/40 text-sky-200';
        } else if (enemy.type === 'helmeppo') {
          sprite = '👱‍♂️🗡️';
          spriteName = 'HELMEPPO';
          spriteColor = 'border-purple-500 bg-purple-950/40 text-purple-300';
        } else if (enemy.type === 'morgan') {
          sprite = '🪓💂‍♂️';
          spriteName = 'C. MORGAN';
          spriteColor = 'border-red-650 bg-red-955/75 text-red-105 font-black shadow-[0_0_15px_rgba(239,68,68,0.7)]';
          size = 'w-14 h-14';
        } else if (enemy.type === 'buggy') {
          sprite = '🤡🎪';
          spriteName = 'C. BUGGY';
          spriteColor = 'border-blue-600 bg-blue-950/70 text-yellow-250 font-black shadow-[0_0_15px_rgba(59,130,246,0.7)]';
          size = 'w-14 h-14';
        } else if (enemy.type === 'kuro') {
          sprite = '🐈🕶️';
          spriteName = 'C. KURO';
          spriteColor = 'border-slate-550 bg-stone-950/80 text-slate-105 font-black shadow-[0_0_15px_rgba(241,245,249,0.7)]';
          size = 'w-14 h-14';
        }

        const isTargeted = player.actionState.startsWith('attacking-') && 
          Math.abs(player.x - enemy.x) <= 2 && Math.abs(player.y - enemy.y) <= 2;

        return (
          <motion.div
            key={enemy.id}
            id={`enemy-id-${enemy.id}`}
            animate={{
              x: `${enemy.x * 100}%`,
              y: `${enemy.y * 100}%`,
              scale: enemy.state === 'stunned' ? [1, 0.90, 1.10, 1] : isTargeted ? [1, 1.08, 1] : 1,
              rotate: enemy.state === 'stunned' ? [0, -12, 12, -12, 12, -12, 0] : 0,
            }}
            transition={{
              x: { type: "spring", stiffness: 220, damping: 20 },
              y: { type: "spring", stiffness: 220, damping: 20 },
              scale: { type: "tween", duration: 0.22 },
              rotate: enemy.state === 'stunned' ? { duration: 0.35, repeat: Infinity, ease: "linear" } : { duration: 0.1 }
            }}
            className="absolute z-20 pointer-events-none flex flex-col items-center justify-center py-2"
            style={{
              left: 0,
              top: 0,
              width: '6.25%',
              height: '8.33%',
            }}
          >
            {/* Health Bar above Enemy */}
            {enemy.hp < enemy.maxHp && (
              <div className="absolute -top-4 w-10 h-1.5 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                />
              </div>
            )}

            {/* Orbiting dizzy star layout */}
            {enemy.state === 'stunned' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: -16 }}
                className="absolute z-30 text-[8px] font-mono font-black pointer-events-none tracking-wider whitespace-nowrap bg-amber-500/90 text-slate-950 border border-amber-300 rounded px-1.5 py-0.5 font-bold shadow-[0_0_10px_rgba(245,158,11,0.7)] flex items-center gap-0.5 animate-pulse"
              >
                💫 MAREADO! 💫
              </motion.div>
            )}

            <div className={`rounded-xl border-2 shadow-lg flex items-center justify-center text-lg ${size} ${spriteColor} relative transition-all ${
              enemy.state === 'stunned' ? 'border-amber-400 drop-shadow-[0_0_12px_rgba(245,158,0,0.6)] animate-pulse' : ''
            } ${enemy.state === 'chasing' ? 'border-orange-500 border-dashed ring-2 ring-orange-500' : ''}`}>
              {enemy.type === 'alvida' ? (
                <AlvidaSprite state={enemy.state} direction={enemy.direction || 'down'} hp={enemy.hp} />
              ) : enemy.type === 'pirate' || enemy.type === 'pirate-officer' ? (
                <PirateSprite type={enemy.type} state={enemy.state} direction={enemy.direction || 'down'} />
              ) : enemy.type === 'marine' || enemy.type === 'helmeppo' || enemy.type === 'morgan' ? (
                <MarineSprite type={enemy.type} state={enemy.state} direction={enemy.direction || 'down'} hp={enemy.hp} />
              ) : (
                sprite
              )}
              {enemy.state === 'chasing' && (
                <span className="absolute -top-2.5 right-0.5 text-[9px] text-orange-400 font-extrabold animate-pulse">⚡❗</span>
              )}
            </div>
            
            <div className="mt-0.5 bg-slate-950/80 text-[7px] font-mono text-slate-300 px-1 py-0.1 border border-slate-700 pointer-events-none rounded scale-90 whitespace-nowrap leading-none uppercase">
              {spriteName}
            </div>
          </motion.div>
        );
      })}

      {/* Dynamic tactical target laser sight guide line and targeting indicators (Minish Cap / Zelda style feedback) */}
      {(() => {
        let dx = 0;
        let dy = 0;
        if (player.direction === 'up') dy = -1;
        else if (player.direction === 'down') dy = 1;
        else if (player.direction === 'left') dx = -1;
        else if (player.direction === 'right') dx = 1;

        const maxRange = player.actionState.startsWith('attacking-whip') ? 3 : 2;
        const cellsList = [];
        for (let i = 1; i <= maxRange; i++) {
          const tx = player.x + dx * i;
          const ty = player.y + dy * i;
          if (tx >= 0 && tx < 16 && ty >= 0 && ty < 12) {
            cellsList.push({ x: tx, y: ty, step: i });
          }
        }

        const startX = player.x * 6.25 + 3.125;
        const startY = player.y * 8.33 + 4.16;
        
        return (
          <>
            {/* Blinking tile target guides in the active direction */}
            {cellsList.map((c, index) => (
              <motion.div
                key={`sight-cell-${index}`}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.25, 0.65, 0.25], scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 1.0, delay: index * 0.12 }}
                className="absolute z-10 border border-amber-400/35 bg-amber-400/5 rounded pointer-events-none flex items-center justify-center"
                style={{
                  left: `${c.x * 6.25}%`,
                  top: `${c.y * 8.33}%`,
                  width: '6.25%',
                  height: '8.33%',
                }}
              >
                {index === cellsList.length - 1 ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-ping" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                )}
              </motion.div>
            ))}

            {/* Faint laser tracer line pointing straight forward */}
            {cellsList.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-15 opacity-50">
                <motion.line
                  x1={`${startX}%`}
                  y1={`${startY}%`}
                  x2={`${(player.x + dx * maxRange) * 6.25 + 3.125}%`}
                  y2={`${(player.y + dy * maxRange) * 8.33 + 4.16}%`}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  animate={{ strokeDashoffset: [0, -10] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.6 }}
                />
              </svg>
            )}
          </>
        );
      })()}

      {/* Render Player: Luffy */}
      {!(grid[player.y] && grid[player.y][player.x] && grid[player.y][player.x].type === 'barrel-luffy' && player.actionState !== 'bursting-out') ? (
        <motion.div
          animate={{
            x: `${player.x * 100}%`,
            y: `${player.y * 100}%`,
            rotate: player.actionState === 'rolling' ? 360 : 0,
            scale: player.actionState === 'hit' ? 0.8 : 1,
          }}
          transition={{
            x: { type: "spring", stiffness: 210, damping: 18 },
            y: { type: "spring", stiffness: 210, damping: 18 },
            rotate: { type: "tween", duration: 0.25, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300, damping: 10 },
          }}
          className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
          style={{
            left: 0,
            top: 0,
            width: '6.25%',
            height: '8.33%',
          }}
        >
          <div className={`relative w-12 h-12 flex flex-col items-center justify-center transition-all ${
            player.actionState.startsWith('attacking-') 
              ? 'scale-115 filter saturate-125 drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]' 
              : player.actionState === 'rolling' 
                ? 'scale-90 opacity-80' 
                : player.actionState === 'hit' 
                  ? 'animate-bounce' 
                  : ''
          }`}>
            {/* Custom Animated Pixel-style Luffy Character */}
            <LuffySprite 
              direction={player.direction} 
              actionState={player.actionState} 
              x={player.x} 
              y={player.y} 
            />
            
            {/* Golden Pointer Crown (Zelda/Minish Cap inspired 3D navigation reticle) */}
            <motion.div
              animate={{ 
                rotate: player.direction === 'up' ? 0 : player.direction === 'right' ? 90 : player.direction === 'down' ? 180 : 270 
              }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <motion.span 
                animate={{ y: [-18, -21, -18] }}
                transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
                className="absolute text-[11px] text-yellow-400 font-extrabold select-none drop-shadow-[0_2px_4px_rgba(245,158,11,0.9)]"
                style={{ top: '-18px' }}
              >
                ▲
              </motion.span>
            </motion.div>
          </div>

          {/* Action / State tags */}
          <div className="mt-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-amber-500/80 text-[8px] font-mono text-amber-400 font-extrabold text-center uppercase whitespace-nowrap leading-none scale-90">
            {player.actionState === 'rolling' ? '🌀 DASH' : player.actionState.startsWith('attacking-') ? '👊 ATTACK' : '⚓ LUFFY'}
          </div>
        </motion.div>
      ) : null}

      {/* Render Fists / Actions Attack Vector overlay graphics */}
      {renderLuffyAttackVector()}

      {/* Floating Minish-Cap Style Cloud Overlays drifting slowly across the screen */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-35 overflow-hidden">
        {/* Cloud 1 */}
        <motion.div
          initial={{ x: "-30%", y: "15%" }}
          animate={{ x: "120%" }}
          transition={{ repeat: Infinity, duration: 42, ease: "linear" }}
          className="absolute w-44 h-11 bg-white/10 rounded-full blur-md opacity-70"
        />
        {/* Cloud 2 */}
        <motion.div
          initial={{ x: "-50%", y: "65%" }}
          animate={{ x: "120%" }}
          transition={{ repeat: Infinity, duration: 55, ease: "linear", delay: 12 }}
          className="absolute w-60 h-16 bg-white/5 rounded-full blur-lg opacity-50"
        />
        {/* Cloud 3 */}
        <motion.div
          initial={{ x: "120%", y: "30%" }}
          animate={{ x: "-30%" }}
          transition={{ repeat: Infinity, duration: 48, ease: "linear" }}
          className="absolute w-40 h-10 bg-white/8 rounded-full blur-md opacity-40"
        />
      </div>

      {/* Floating Retro Damage and Sparkle labels (Zelda-style feedback) */}
      {floatingTexts.map((item) => (
        <div
          key={item.id}
          style={{
            left: `${item.x * 6.25}%`,
            top: `${(item.y - 0.6) * 8.33}%`,
            width: '6.25%',
          }}
          className={`absolute z-40 text-center font-mono text-[11px] font-extrabold select-none whitespace-nowrap bg-slate-950/90 px-1.5 py-0.5 border border-slate-700/80 rounded-md pointer-events-none animate-bounce transition-all ${item.color}`}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

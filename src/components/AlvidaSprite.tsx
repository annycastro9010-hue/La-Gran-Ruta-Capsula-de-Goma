import React, { useState, useEffect } from 'react';

interface AlvidaSpriteProps {
  state: 'idle' | 'patrol' | 'chasing' | 'stunned' | 'attacking';
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
}

// Colores del paleta Minis Cap Alvida (One Piece)
const C_OUTLINE = "#0f172a";
const C_HAT_PINK = "#ec4899";
const C_HAT_RED = "#f43f5e";
const C_FEATHER = "#ffffff";
const C_HAIR = "#1e1b4b";
const C_SKIN = "#ffedd5";
const C_COAT = "#7e22ce";
const C_VEST = "#9333ea";
const C_GOLD = "#f59e0b";
const C_MACE = "#334155";
const C_SPIKE = "#f8fafc";

export const AlvidaSprite: React.FC<AlvidaSpriteProps> = ({ state, direction = 'down' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let delay = 180;
    if (state === 'chasing') delay = 90;
    if (state === 'stunned') delay = 60;

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isAttacking = state === 'attacking';
  const isChasing = state === 'chasing';

  let scaleX = direction === 'left' ? -1 : 1;
  let dy = 0;
  let maceAngle = 15;

  if (isChasing) {
    dy = frame % 2 === 0 ? -1 : 1;
    maceAngle = frame % 2 === 0 ? 35 : -15;
  } else if (isStunned) {
    dy = frame % 2 === 0 ? -2 : 2;
    maceAngle = frame * 45;
  } else {
    dy = frame === 1 || frame === 3 ? -0.8 : 0;
  }

  if (isAttacking) {
    maceAngle = 110;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 24 24" 
        className="w-12 h-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
        style={{ imageRendering: 'pixelated', transform: `scaleX(${scaleX})` }}
        shapeRendering="crispEdges"
      >
        {/* Sube Sube Aura Shadow */}
        <ellipse 
          cx="12" 
          cy="22" 
          rx={isChasing ? "7" : "5"} 
          ry="1.5" 
          fill={isChasing ? "rgba(244,114,182,0.8)" : "rgba(15,23,42,0.6)"} 
          className={isChasing ? "animate-pulse" : ""}
        />

        {/* CONTENEDOR ANIMADO */}
        <g style={{ transform: `translateY(${dy}px)` }}>
          {/* Cabello largo oscuro posterior */}
          <path d="M5,8 Q3,16 6,21 Q10,18 9,10 Z" fill={C_HAIR} stroke={C_OUTLINE} strokeWidth="0.5" />
          <path d="M19,8 Q21,16 18,21 Q14,18 15,10 Z" fill={C_HAIR} stroke={C_OUTLINE} strokeWidth="0.5" />

          {/* Botas de Capitana */}
          <rect x="8.5" y="19" width="2.5" height="3" rx="0.5" fill="#3b0764" stroke={C_OUTLINE} strokeWidth="0.4" />
          <rect x="13" y="19" width="2.5" height="3" rx="0.5" fill="#3b0764" stroke={C_OUTLINE} strokeWidth="0.4" />

          {/* Abrigo Morado / Carmesí */}
          <path d="M6,11 L18,11 L19,19 L5,19 Z" fill={C_COAT} stroke={C_OUTLINE} strokeWidth="0.5" />
          <path d="M9,11 L15,11 L14,18 L10,18 Z" fill={C_VEST} />

          {/* Fajín Dorado y hebilla */}
          <rect x="7.5" y="16.5" width="9" height="1.8" fill={C_GOLD} stroke={C_OUTLINE} strokeWidth="0.3" />
          <rect x="11" y="16.2" width="2" height="2.4" fill="#fef08a" stroke="#78350f" strokeWidth="0.3" />

          {/* Cabeza / Rostro Minis */}
          <rect x="8" y="5.5" width="8" height="7.5" rx="3.5" fill={C_SKIN} stroke={C_OUTLINE} strokeWidth="0.5" />

          {/* Ojos y sonrisa */}
          {isStunned ? (
            <>
              <circle cx="10" cy="9" r="1" fill="#ffffff" stroke="#000000" strokeWidth="0.4" />
              <circle cx="14" cy="9" r="1" fill="#ffffff" stroke="#000000" strokeWidth="0.4" />
              <path d="M10.5,11.5 Q12,10.5 13.5,11.5" stroke="#991b1b" strokeWidth="0.5" fill="none" />
            </>
          ) : (
            <>
              <ellipse cx="10" cy="8.8" rx="0.9" ry="1.2" fill="#1e1b4b" />
              <ellipse cx="14" cy="8.8" rx="0.9" ry="1.2" fill="#1e1b4b" />
              <circle cx="9.7" cy="8.3" r="0.3" fill="#ffffff" />
              <circle cx="13.7" cy="8.3" r="0.3" fill="#ffffff" />
              <path d="M10.5,11 Q12,12 13.5,11" stroke="#be185d" strokeWidth="0.6" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Sombrero rosa de Capitana Alvida con pluma blanca */}
          <path d="M4,6.5 Q12,2 20,6.5 Q12,7.5 4,6.5 Z" fill={C_HAT_PINK} stroke={C_OUTLINE} strokeWidth="0.5" />
          <path d="M7,6 Q12,1.5 17,6 Z" fill={C_HAT_RED} />
          {/* Pluma blanca lateral */}
          <path d="M5,6 Q2,2 0.5,4 Q3,5 5.5,6.5 Z" fill={C_FEATHER} stroke="#cbd5e1" strokeWidth="0.4" />
          {/* Emblema Dorado */}
          <circle cx="12" cy="5" r="1" fill={C_GOLD} stroke="#78350f" strokeWidth="0.3" />

          {/* MAZA DE HIERRO CON ESPINAS (Sostenida a la derecha) */}
          <g transform={`rotate(${maceAngle} 16 14)`}>
            {/* Mango */}
            <rect x="15.5" y="10" width="1" height="8" rx="0.3" fill="#475569" stroke={C_OUTLINE} strokeWidth="0.3" />
            {/* Cabeza metálica con espinas */}
            <path d="M14,4 L18,4 L19,10 L13,10 Z" fill={C_MACE} stroke={C_OUTLINE} strokeWidth="0.4" />
            {/* Puntas relucientes */}
            <polygon points="13,6 11.5,5 13,7" fill={C_SPIKE} />
            <polygon points="19,6 20.5,5 19,7" fill={C_SPIKE} />
            <polygon points="16,3.5 16,1.5 17.5,3" fill={C_SPIKE} />
          </g>
        </g>

        {/* Efecto de ataque */}
        {isAttacking && (
          <g className="animate-ping">
            <circle cx="18" cy="6" r="3" fill="#f59e0b" opacity="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
};








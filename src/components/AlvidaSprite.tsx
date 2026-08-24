import React, { useState, useEffect } from 'react';

interface AlvidaSpriteProps {
  state: 'idle' | 'patrol' | 'chasing' | 'stunned' | 'attacking';
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
}

export const AlvidaSprite: React.FC<AlvidaSpriteProps> = ({ state, direction = 'down', hp }) => {
  const [frame, setFrame] = useState(0);

  // Micro walking / breathing cycles estilo Minish Cap (Minis)
  useEffect(() => {
    let delay = 200;
    if (state === 'chasing') delay = 110;  // Persecución veloz
    if (state === 'stunned') delay = 80;    // Vibración dazed/aturdida

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isAttacking = state === 'attacking';

  // Minish Cap sprite bouncing / sliding offsets
  let hairY = 0;
  let bodyY = 0;
  let maceAngle = 15;
  let scaleX = 1;
  let slideGlow = false;

  if (state === 'chasing') {
    bodyY = frame % 2 === 0 ? 1 : -1;
    hairY = frame % 2 === 0 ? 1.5 : -1;
    maceAngle = frame % 2 === 0 ? 40 : -15;
    slideGlow = true; // Efecto Sube Sube no Mi al perseguir
  } else if (isStunned) {
    bodyY = frame % 2 === 0 ? 2 : -2;
    hairY = frame % 2 === 0 ? -2 : 2;
    maceAngle = frame * 45;
  } else {
    bodyY = frame === 1 || frame === 3 ? 0.5 : 0;
    hairY = frame === 1 || frame === 3 ? 1 : 0;
  }

  if (direction === 'left') {
    scaleX = -1;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg 
        viewBox="0 0 64 64" 
        className="w-14 h-14 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
        style={{ transform: `scaleX(${scaleX})` }}
      >
        {/* Sube Sube Smooth aura shadow */}
        <ellipse 
          cx="32" 
          cy="53" 
          rx={slideGlow ? "18" : "14"} 
          ry="3.5" 
          fill={slideGlow ? "rgba(244,114,182,0.6)" : "rgba(15,23,42,0.6)"} 
          className={slideGlow ? "animate-pulse" : ""}
        />

        {/* --- PABELLÓN DE CABELLO OSCURO / ONDULADO (MINIS CAP ALVIDA) --- */}
        <g style={{ transform: `translateY(${hairY}px)` }}>
          <path d="M14,22 Q8,34 16,46 Q24,40 22,26 Z" fill="#0F172A" stroke="#020617" strokeWidth="1.5" />
          <path d="M50,22 Q56,34 48,46 Q40,40 42,26 Z" fill="#0F172A" stroke="#020617" strokeWidth="1.5" />
        </g>

        {/* --- BODY ASSEMBLY --- */}
        <g style={{ transform: `translateY(${bodyY}px)` }}>
          {/* Botas pirata moradas/oscuras */}
          <rect x="23" y="46" width="6" height="8" rx="2" fill="#3B0764" stroke="#1E1B4B" strokeWidth="1.2" />
          <rect x="35" y="46" width="6" height="8" rx="2" fill="#3B0764" stroke="#1E1B4B" strokeWidth="1.2" />

          {/* Abrigo de Capitana Pirata (Morado / Carmesí) */}
          <path d="M19,26 L45,26 L47,45 L17,45 Z" fill="#7E22CE" stroke="#581C87" strokeWidth="1.5" />
          <path d="M24,26 L40,26 L38,43 L26,43 Z" fill="#9333EA" />

          {/* Solapa dorada y fajín pirata */}
          <path d="M22,38 L42,38 L40,42 L24,42 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
          <rect x="30" y="37.5" width="4" height="5" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />

          {/* Manos / Brazos con pulseras doradas */}
          <circle cx="17" cy="30" r="3.5" fill="#FED7AA" stroke="#9A3412" strokeWidth="0.8" />
          <circle cx="47" cy="30" r="3.5" fill="#FED7AA" stroke="#9A3412" strokeWidth="0.8" />
          <rect x="15" y="28" width="2" height="4" rx="1" fill="#F59E0B" />
          <rect x="47" y="28" width="2" height="4" rx="1" fill="#F59E0B" />

          {/* Cabeza / Rostro elegante estilo Minish Cap */}
          <rect x="22" y="14" width="20" height="18" rx="9" fill="#FFEDD5" stroke="#9A3412" strokeWidth="1.5" />

          {/* Ojos expresivos Minis */}
          {isStunned ? (
            <>
              {/* Ojos aturdidos estilo cómic */}
              <circle cx="27" cy="22" r="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
              <circle cx="37" cy="22" r="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
              <path d="M26,22 L28,22 M36,22 L38,22" stroke="#000000" strokeWidth="1.5" />
              <path d="M28,27 Q32,25 36,27" stroke="#991B1B" strokeWidth="1.5" fill="none" />
            </>
          ) : (
            <>
              {/* Ojos oscuros y firmes de capitana */}
              <ellipse cx="27" cy="21.5" rx="2" ry="3" fill="#1E1B4B" />
              <ellipse cx="37" cy="21.5" rx="2" ry="3" fill="#1E1B4B" />
              {/* Brillo en las pupilas */}
              <circle cx="26.3" cy="20.5" r="0.7" fill="#FFFFFF" />
              <circle cx="36.3" cy="20.5" r="0.7" fill="#FFFFFF" />
              {/* Cejas expresivas */}
              <path d="M24,18 Q27,17 29,19" stroke="#581C87" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M40,18 Q37,17 35,19" stroke="#581C87" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Sonrisa confiada / Labio carmesí */}
              <path d="M29,27 Q32,29 35,27" stroke="#BE185D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Mechones frontales ondulados */}
          <path d="M21,18 Q18,24 21,30" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M43,18 Q46,24 43,30" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* --- SOMBRERO PIRATA ROSA DE ALVIDA (ICONICO CON PLUMA BLANCA) --- */}
          <g transform="translate(0, -2)">
            {/* Ala ancha rosa del sombrero pirata */}
            <path d="M12,16 Q32,8 52,16 Q32,18 12,16 Z" fill="#EC4899" stroke="#9D174D" strokeWidth="1.5" />
            {/* Copa del sombrero */}
            <path d="M20,15 Q32,5 44,15 Z" fill="#F43F5E" stroke="#9D174D" strokeWidth="1.2" />
            {/* Pluma blanca lateral */}
            <path d="M14,15 Q8,6 4,10 Q10,12 16,16 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            {/* Calavera / Emblema dorado del sombrero */}
            <circle cx="32" cy="13" r="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
          </g>
        </g>

        {/* --- MAZA DE HIERRO CON ESPINAS (GARROTE ALVIDA MINIS) --- */}
        {(() => {
          let rx = 12;
          let ry = 24;
          let rot = maceAngle;

          if (isAttacking) {
            rot = 120;
            rx = 24;
            ry = 16;
          } else if (direction === 'up') {
            rot = -30;
            rx = 10;
            ry = 22;
          }

          return (
            <g transform={`translate(${rx}, ${ry}) rotate(${rot} 16 16)`} className="transition-transform duration-150">
              {/* Mango de madera reforzado */}
              <rect x="14.5" y="16" width="3.5" height="16" rx="1" fill="#475569" stroke="#0F172A" strokeWidth="1" />
              {/* Cabeza metálica de la maza de espinas */}
              <path d="M7,3 L25,3 L28,17 L4,17 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.8" />
              <rect x="7" y="2.5" width="18" height="5" rx="2.5" fill="#334155" />

              {/* Puntas de acero relucientes */}
              <polygon points="4,7 0.5,5 4,9" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="28,7 31.5,5 28,9" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="3,13 -0.5,12 3,15" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="29,13 32.5,12 29,15" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
              <polygon points="16,2 16,-2 19,1" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.8" />
            </g>
          );
        })()}

        {/* --- EFECTO DE ATAQUE Y RAFAGA SUBE SUBE --- */}
        {isAttacking && (
          <g className="animate-ping">
            <path 
              d="M 4 38 A 28 28 0 0 1 60 38" 
              stroke="#F472B6" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.9" 
            />
            <polygon points="48,16 52,8 55,14 62,14 56,19 59,26 52,22 47,26 49,19" fill="#F59E0B" />
          </g>
        )}
      </svg>
    </div>
  );
};


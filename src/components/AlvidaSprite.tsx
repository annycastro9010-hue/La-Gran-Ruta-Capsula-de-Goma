import React, { useState, useEffect } from 'react';

interface AlvidaSpriteProps {
  state: 'idle' | 'patrol' | 'chasing' | 'stunned' | 'attacking';
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
}

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
  let bounceY = 0;
  let rotate = 0;

  if (isChasing) {
    bounceY = frame % 2 === 0 ? -3 : 2;
    rotate = frame % 2 === 0 ? 8 : -8;
  } else if (isStunned) {
    rotate = (frame % 2 === 0 ? 15 : -15);
    bounceY = frame % 2 === 0 ? -4 : 4;
  } else {
    bounceY = frame === 1 || frame === 3 ? -2 : 0;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Glow Aura Sube Sube */}
      <div 
        className={`absolute bottom-0 w-10 h-3 rounded-full blur-xs transition-all ${
          isChasing ? 'bg-pink-500/70 scale-125 animate-pulse' : 'bg-slate-950/60'
        }`} 
      />

      <div 
        className={`relative w-12 h-12 flex items-center justify-center transition-transform duration-75 ${
          isAttacking ? 'scale-125' : ''
        }`}
        style={{ 
          transform: `scaleX(${scaleX}) translateY(${bounceY}px) rotate(${rotate}deg)` 
        }}
      >
        {/* Renderizado de la Alvida Minis Chibi elegida */}
        <img 
          src="https://raw.githubusercontent.com/annycastro9010-hue/La-Gran-Ruta-Capsula-de-Goma/main/src/assets/alvida_minis.png" 
          alt="Alvida Minis"
          className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
          onError={(e) => {
            // Fallback por si la imagen se sirve localmente
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Capa SVG de respaldo de alta fidelidad Minis */}
        <svg 
          viewBox="0 0 64 64" 
          className="w-12 h-12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] absolute inset-0 hidden"
        >
          {/* Sombrero rosa con pluma blanca */}
          <path d="M10,18 Q32,8 54,18 Q32,20 10,18 Z" fill="#EC4899" stroke="#9D174D" strokeWidth="1.5" />
          <path d="M18,17 Q32,6 46,17 Z" fill="#F43F5E" stroke="#9D174D" strokeWidth="1.2" />
          <path d="M12,16 Q6,6 2,10 Q8,12 14,17 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="32" cy="14" r="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
        </svg>

        {/* Animación de ataque / mazo */}
        {isAttacking && (
          <div className="absolute -right-3 -top-3 w-8 h-8 text-2xl animate-ping">
            💥
          </div>
        )}
      </div>
    </div>
  );
};



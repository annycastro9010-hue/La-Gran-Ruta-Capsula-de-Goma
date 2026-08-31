import React, { useState, useEffect } from 'react';
import alvidaImg from './alvida_minis.jpg';

interface AlvidaSpriteProps {
  state: 'idle' | 'patrol' | 'chasing' | 'stunned' | 'attacking';
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
}

export const AlvidaSprite: React.FC<AlvidaSpriteProps> = ({ state, direction = 'down' }) => {
  const [frame, setFrame] = useState(0);

  // Animación de pulso/rebote continuo en tiempo real
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
      {/* Sube Sube Aura rosa flotante */}
      <div 
        className={`absolute bottom-0 w-10 h-3 rounded-full blur-xs transition-all ${
          isChasing ? 'bg-pink-500/80 scale-125 animate-pulse' : 'bg-slate-950/60'
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
        {/* Renderizado de la imagen oficial de Alvida Minis (Opción C) */}
        <img 
          src={alvidaImg} 
          alt="Alvida Minis"
          className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
        />

        {/* Efecto de impacto en combate */}
        {isAttacking && (
          <div className="absolute -right-2 -top-2 w-7 h-7 text-xl animate-ping">
            💥
          </div>
        )}

        {/* Indicador de mareo */}
        {isStunned && (
          <div className="absolute -top-2 right-0 text-xs animate-spin">
            💫
          </div>
        )}
      </div>
    </div>
  );
};







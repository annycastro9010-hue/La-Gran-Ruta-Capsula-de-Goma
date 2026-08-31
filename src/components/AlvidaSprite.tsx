import React, { useState, useEffect } from 'react';
import alvidaSpriteSheet from './alvida_spritesheet.jpg';

interface AlvidaSpriteProps {
  state: 'idle' | 'patrol' | 'chasing' | 'stunned' | 'attacking';
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
}

export const AlvidaSprite: React.FC<AlvidaSpriteProps> = ({ state, direction = 'down' }) => {
  const [frame, setFrame] = useState(0);

  // Ciclo de animación de fotogramas según estado de acción
  useEffect(() => {
    let delay = 220;
    if (state === 'chasing') delay = 110;
    if (state === 'stunned') delay = 80;
    if (state === 'attacking') delay = 100;

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isAttacking = state === 'attacking';
  const isChasing = state === 'chasing';

  let scaleX = direction === 'left' ? -1 : 1;

  // Selección de fila y columna dentro de la hoja de sprites de 3x3 / 4x4
  // Fila 0 (0%): Idle / Frente-Perfil
  // Fila 1 (50%): Correr / Caminar / Movimiento
  // Fila 2 (100%): Ataque con Maza / Sube Sube
  let rowPercent = 0; // Top row (Idle)
  if (isChasing || state === 'patrol') {
    rowPercent = 50; // Middle row (Walking / Running)
  } else if (isAttacking || isStunned) {
    rowPercent = 100; // Bottom row (Attacking / Special ability)
  }

  // Columnas dinámicas según el frame actual (0%, 33.3%, 66.6%, 100%)
  const colPercent = (frame % 3) * 50;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Sube Sube Aura al deslizarse o perseguir */}
      <div 
        className={`absolute bottom-0 w-10 h-3 rounded-full blur-xs transition-all ${
          isChasing ? 'bg-pink-500/70 scale-125 animate-pulse' : 'bg-slate-950/60'
        }`} 
      />

      <div 
        className={`relative w-14 h-14 overflow-hidden rounded-xl border-2 border-pink-500/80 shadow-lg bg-slate-900/60 flex items-center justify-center transition-transform duration-75 ${
          isAttacking ? 'scale-125 border-yellow-400' : ''
        } ${isStunned ? 'animate-bounce border-amber-400' : ''}`}
        style={{ 
          transform: `scaleX(${scaleX})` 
        }}
      >
        {/* Recorte viewport interactivo de la Hoja de Sprites */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${alvidaSpriteSheet})`,
            backgroundSize: '300% 300%',
            backgroundPosition: `${colPercent}% ${rowPercent}%`,
            imageRendering: 'pixelated',
          }}
        />

        {/* Efecto de impacto cuando ataca con la maza */}
        {isAttacking && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl animate-ping">
            💥
          </div>
        )}

        {/* Indicador mareado */}
        {isStunned && (
          <div className="absolute -top-1 right-0 text-xs animate-spin">
            💫
          </div>
        )}
      </div>
    </div>
  );
};





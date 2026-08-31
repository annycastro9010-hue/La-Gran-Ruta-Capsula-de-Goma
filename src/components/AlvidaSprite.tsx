import React, { useState, useEffect } from 'react';
import alvidaSpriteSheet from './alvida_spritesheet.jpg';

interface AlvidaSpriteProps {
  state: 'idle' | 'patrol' | 'chasing' | 'stunned' | 'attacking';
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
}

export const AlvidaSprite: React.FC<AlvidaSpriteProps> = ({ state, direction = 'down' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let delay = 200;
    if (state === 'chasing') delay = 100;
    if (state === 'stunned') delay = 70;

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 3);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isAttacking = state === 'attacking';
  const isChasing = state === 'chasing';

  let scaleX = direction === 'left' ? -1 : 1;

  // Calculamos la posición del encuadre
  // Fila 0: Top (0%), Fila 1: Middle (50%), Fila 2: Bottom (100%)
  let rowPos = '0%';
  if (isChasing || state === 'patrol') {
    rowPos = '50%';
  } else if (isAttacking || isStunned) {
    rowPos = '100%';
  }

  const colPos = `${(frame % 3) * 50}%`;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Sube Sube Aura */}
      <div 
        className={`absolute bottom-0 w-10 h-3 rounded-full blur-xs transition-all ${
          isChasing ? 'bg-pink-500/80 scale-125 animate-pulse' : 'bg-slate-950/60'
        }`} 
      />

      <div 
        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 border-pink-400 bg-slate-900 shadow-md flex items-center justify-center ${
          isAttacking ? 'scale-125 border-yellow-300' : ''
        } ${isStunned ? 'animate-bounce border-amber-400' : ''}`}
        style={{ transform: `scaleX(${scaleX})` }}
      >
        <img 
          src={alvidaSpriteSheet}
          alt="Alvida Animated Sprite"
          className="w-[300%] h-[300%] max-w-none max-h-none object-cover"
          style={{
            objectPosition: `${colPos} ${rowPos}`,
          }}
        />

        {isAttacking && (
          <div className="absolute inset-0 flex items-center justify-center text-xl animate-ping">
            💥
          </div>
        )}
      </div>
    </div>
  );
};






import React, { useState, useEffect } from 'react';
import alvidaSpriteSheetImg from './alvida_sheet_real.jpg';

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
    if (state === 'attacking') delay = 90;

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 3);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
  const isAttacking = state === 'attacking';
  const isChasing = state === 'chasing';

  let scaleX = direction === 'left' ? -1 : 1;

  let rowPos = '0%';
  if (isChasing || state === 'patrol') {
    rowPos = '50%';
  } else if (isAttacking || isStunned) {
    rowPos = '100%';
  }

  const colPos = `${(frame % 3) * 50}%`;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div 
        className={`absolute bottom-0 w-10 h-3 rounded-full blur-xs transition-all ${
          isChasing ? 'bg-pink-500/80 scale-125 animate-pulse' : 'bg-slate-950/60'
        }`} 
      />

      <div 
        className={`relative w-14 h-14 rounded-xl overflow-hidden shadow-xl border-2 border-pink-400/80 bg-slate-950 flex items-center justify-center transition-transform duration-75 ${
          isAttacking ? 'scale-125 border-yellow-300' : ''
        } ${isStunned ? 'animate-bounce border-amber-400' : ''}`}
        style={{ transform: `scaleX(${scaleX})` }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${alvidaSpriteSheetImg})`,
            backgroundSize: '300% 300%',
            backgroundPosition: `${colPos} ${rowPos}`,
            imageRendering: 'pixelated',
          }}
        />

        {isAttacking && (
          <div className="absolute inset-0 flex items-center justify-center text-xl animate-ping">
            💥
          </div>
        )}

        {isStunned && (
          <div className="absolute -top-1 right-0 text-xs animate-spin">
            💫
          </div>
        )}
      </div>
    </div>
  );
};

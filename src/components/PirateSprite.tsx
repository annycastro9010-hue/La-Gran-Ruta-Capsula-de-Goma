import React, { useState, useEffect } from 'react';
import { Direction } from '../types';

interface PirateSpriteProps {
  type: 'pirate' | 'pirate-officer';
  state: 'idle' | 'patrolling' | 'chasing' | 'stunned';
  direction: Direction;
}

export const PirateSprite: React.FC<PirateSpriteProps> = ({ state, direction }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let delay = 250;
    if (state === 'chasing') delay = 130;
    if (state === 'stunned') delay = 90;

    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, delay);
    return () => clearInterval(timer);
  }, [state]);

  const isStunned = state === 'stunned';
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

  const alvidaImageSrc = `${import.meta.env.BASE_URL}alvida_chibi.jpg`;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div 
        className={`relative w-12 h-12 flex items-center justify-center transition-transform duration-75`}
        style={{ 
          transform: `scaleX(${scaleX}) translateY(${bounceY}px) rotate(${rotate}deg)` 
        }}
      >
        <img 
          src={alvidaImageSrc} 
          alt="Alvida Chibi"
          className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] rounded-full border border-pink-400"
        />

        {isStunned && (
          <div className="absolute -top-2 right-0 text-xs animate-spin">
            💫
          </div>
        )}
      </div>
    </div>
  );
};

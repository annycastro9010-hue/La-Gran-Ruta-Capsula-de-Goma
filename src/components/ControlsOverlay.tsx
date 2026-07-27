import React, { useState } from 'react';

interface ControlsOverlayProps {
  onMove: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onAttack: (type: 'pistol' | 'gatling' | 'whip') => void;
  onRoll: () => void;
  onEatMeat: () => void;
  meatCount: number;
  haki: number;
}

// Keyboard key badge component
const Key: React.FC<{ k: string; wide?: boolean }> = ({ k, wide }) => (
  <span className={`inline-flex items-center justify-center h-5 bg-slate-800 border border-slate-600 border-b-2 border-b-slate-500 rounded text-[9px] font-black text-slate-200 font-mono px-1 leading-none shadow-sm ${wide ? 'min-w-[28px]' : 'min-w-[18px]'}`}>
    {k}
  </span>
);

// D-Pad button
const DBtn: React.FC<{
  label: string;
  keyLabel: string;
  icon: string;
  pos: 'top' | 'bottom' | 'left' | 'right';
  onClick: () => void;
}> = ({ label, keyLabel, icon, pos, onClick }) => {
  const posClass = {
    top:    'absolute top-0 left-1/2 -translate-x-1/2',
    bottom: 'absolute bottom-0 left-1/2 -translate-x-1/2',
    left:   'absolute left-0 top-1/2 -translate-y-1/2',
    right:  'absolute right-0 top-1/2 -translate-y-1/2',
  }[pos];

  const roundClass = {
    top:    'rounded-t-xl',
    bottom: 'rounded-b-xl',
    left:   'rounded-l-xl',
    right:  'rounded-r-xl',
  }[pos];

  return (
    <button
      onClick={onClick}
      onTouchStart={(e) => { e.preventDefault(); onClick(); }}
      className={`${posClass} w-11 h-11 ${roundClass} flex flex-col items-center justify-center gap-0.5 bg-slate-700 hover:bg-amber-600 active:bg-amber-500 border-2 border-slate-600 hover:border-amber-400 active:scale-95 transition-all cursor-pointer shadow-md z-10 select-none`}
      title={label}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[7px] font-mono font-black text-slate-300 leading-none">{keyLabel}</span>
    </button>
  );
};

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  onMove, onAttack, onRoll, onEatMeat, meatCount, haki,
}) => {
  const [tab, setTab] = useState<'move' | 'attack'>('move');

  return (
    <div className="w-full flex flex-col gap-3 bg-slate-900/98 border-2 border-slate-700 p-3 rounded-2xl shadow-2xl select-none">

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-950 rounded-lg p-1">
        <button
          onClick={() => setTab('move')}
          className={`flex-1 py-1.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'move' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          🕹️ Mover
        </button>
        <button
          onClick={() => setTab('attack')}
          className={`flex-1 py-1.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'attack' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚔️ Ataques
        </button>
      </div>

      {tab === 'move' && (
        <>
          {/* D-Pad */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest text-center">
              Toca los botones o usa el teclado
            </p>

            {/* D-Pad grid */}
            <div className="relative w-36 h-36">
              {/* Cross background */}
              <div className="absolute inset-x-8 inset-y-0 bg-slate-800 rounded-sm" />
              <div className="absolute inset-y-8 inset-x-0 bg-slate-800 rounded-sm" />
              {/* Center */}
              <div className="absolute inset-0 m-auto w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-lg z-20">⚓</div>

              <DBtn label="Arriba" keyLabel="W/↑" icon="▲" pos="top"    onClick={() => onMove('up')} />
              <DBtn label="Abajo"  keyLabel="S/↓" icon="▼" pos="bottom" onClick={() => onMove('down')} />
              <DBtn label="Izq"    keyLabel="A/←" icon="◀" pos="left"   onClick={() => onMove('left')} />
              <DBtn label="Der"    keyLabel="D/→" icon="▶" pos="right"  onClick={() => onMove('right')} />
            </div>

            {/* Keyboard reference row */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="flex flex-col items-center gap-0.5">
                <Key k="W" />
                <div className="flex gap-0.5">
                  <Key k="A" />
                  <Key k="S" />
                  <Key k="D" />
                </div>
              </div>
              <span className="text-slate-600 text-sm font-bold">o</span>
              <div className="flex flex-col items-center gap-0.5">
                <Key k="↑" />
                <div className="flex gap-0.5">
                  <Key k="←" />
                  <Key k="↓" />
                  <Key k="→" />
                </div>
              </div>
            </div>
          </div>

          {/* Roll button */}
          <button
            onClick={onRoll}
            onTouchStart={(e) => { e.preventDefault(); onRoll(); }}
            className="w-full py-2 rounded-xl bg-teal-700 hover:bg-teal-600 active:bg-teal-500 border-2 border-teal-500 text-white font-mono font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>🌀</span>
            <span>GIRO EVASIVO</span>
            <Key k="Shift" wide />
          </button>
        </>
      )}

      {tab === 'attack' && (
        <div className="flex flex-col gap-2">

          {/* GUM-GUM PISTOLA */}
          <button
            onClick={() => onAttack('pistol')}
            onTouchStart={(e) => { e.preventDefault(); onAttack('pistol'); }}
            className="w-full p-3 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-500 border-2 border-red-400 text-white font-mono cursor-pointer active:scale-95 transition-all flex items-center gap-3"
          >
            <span className="text-2xl">👊</span>
            <div className="flex-1 text-left">
              <div className="font-black text-[11px] uppercase tracking-wider text-yellow-300">GUM-GUM PISTOLA</div>
              <div className="text-[9px] text-red-200">Ataque básico • 8 daño</div>
            </div>
            <Key k="Espacio" wide />
          </button>

          {/* GUM-GUM METRALLETA */}
          <button
            onClick={() => onAttack('gatling')}
            onTouchStart={(e) => { e.preventDefault(); onAttack('gatling'); }}
            disabled={haki < 10}
            className={`w-full p-3 rounded-xl border-2 font-mono cursor-pointer active:scale-95 transition-all flex items-center gap-3 ${
              haki >= 10
                ? 'bg-amber-700 hover:bg-amber-600 border-amber-400 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-600 opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">💥</span>
            <div className="flex-1 text-left">
              <div className="font-black text-[11px] uppercase tracking-wider text-yellow-300">GUM-GUM METRALLETA</div>
              <div className="text-[9px] text-amber-200">{haki >= 10 ? 'Cono 3x2 • 15 daño • 10 Haki' : `🔒 Necesitas 10 Haki (tienes ${haki})`}</div>
            </div>
            <Key k="E" />
          </button>

          {/* GUM-GUM LÁTIGO */}
          <button
            onClick={() => onAttack('whip')}
            onTouchStart={(e) => { e.preventDefault(); onAttack('whip'); }}
            disabled={haki < 15}
            className={`w-full p-3 rounded-xl border-2 font-mono cursor-pointer active:scale-95 transition-all flex items-center gap-3 ${
              haki >= 15
                ? 'bg-purple-700 hover:bg-purple-600 border-purple-400 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-600 opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">🌪️</span>
            <div className="flex-1 text-left">
              <div className="font-black text-[11px] uppercase tracking-wider text-purple-200">GUM-GUM LÁTIGO</div>
              <div className="text-[9px] text-purple-200">{haki >= 15 ? 'Área 360° • 12 daño • 15 Haki' : `🔒 Necesitas 15 Haki (tienes ${haki})`}</div>
            </div>
            <Key k="R" />
          </button>

          {/* COMER CARNE */}
          <button
            onClick={onEatMeat}
            onTouchStart={(e) => { e.preventDefault(); onEatMeat(); }}
            disabled={meatCount === 0}
            className={`w-full p-3 rounded-xl border-2 font-mono cursor-pointer active:scale-95 transition-all flex items-center gap-3 ${
              meatCount > 0
                ? 'bg-rose-700 hover:bg-rose-600 border-rose-400 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-600 opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">🍖</span>
            <div className="flex-1 text-left">
              <div className="font-black text-[11px] uppercase tracking-wider text-rose-200">COMER CARNE ({meatCount})</div>
              <div className="text-[9px] text-rose-200">{meatCount > 0 ? 'Recupera 4 HP' : '🔒 Sin carne en inventario'}</div>
            </div>
            <Key k="Q" />
          </button>

          {/* Roll button in attack tab too */}
          <button
            onClick={onRoll}
            onTouchStart={(e) => { e.preventDefault(); onRoll(); }}
            className="w-full py-2 rounded-xl bg-teal-800 hover:bg-teal-700 border-2 border-teal-600 text-teal-100 font-mono font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            🌀 Giro Evasivo <Key k="Shift" wide />
          </button>
        </div>
      )}

      {/* Quick legend always visible */}
      <div className="border-t border-slate-800 pt-2 flex flex-wrap gap-1.5 justify-center">
        {[
          { icon: '🗺️', label: 'Cofre = Llave/Item' },
          { icon: '🚪', label: 'Puerta bloqueada' },
          { icon: '🪜', label: 'Escaleras' },
          { icon: '🍖', label: 'Carne = Vida' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1 text-[8px] font-mono text-slate-500 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5">
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

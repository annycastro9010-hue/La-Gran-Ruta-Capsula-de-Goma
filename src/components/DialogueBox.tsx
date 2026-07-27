import React, { useState, useEffect } from 'react';
import { Dialogue } from '../types';
import { ChevronRight } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: Dialogue;
  onNext: () => void;
}

// Character portrait configs with expression + scene background
const SPEAKER_CONFIG: Record<string, {
  emoji: string;
  name: string;
  color: string;       // Tailwind text color for name
  border: string;      // border color class
  bg: string;          // portrait bg gradient
  sceneBg: string;     // cinematic scene gradient behind whole box
  expression: Record<string, string>; // mood -> emoji
}> = {
  Luffy: {
    emoji: '👒',
    name: 'MONKEY D. LUFFY',
    color: 'text-amber-400',
    border: 'border-amber-400',
    bg: 'from-red-700 via-rose-600 to-amber-500',
    sceneBg: 'from-red-950/60 via-slate-950/80 to-slate-950/95',
    expression: {
      default: '😄', excited: '😆', angry: '😤', serious: '😠',
      surprised: '😲', sad: '😢', determined: '💪',
    },
  },
  Koby: {
    emoji: '👓',
    name: 'KOBY',
    color: 'text-pink-400',
    border: 'border-pink-400',
    bg: 'from-pink-500 via-purple-500 to-indigo-500',
    sceneBg: 'from-purple-950/60 via-slate-950/80 to-slate-950/95',
    expression: {
      default: '😟', excited: '😊', scared: '😨', surprised: '😮', crying: '😭',
    },
  },
  Zoro: {
    emoji: '⚔️',
    name: 'RORONOA ZORO',
    color: 'text-emerald-400',
    border: 'border-emerald-400',
    bg: 'from-emerald-700 via-green-700 to-teal-600',
    sceneBg: 'from-emerald-950/60 via-slate-950/80 to-slate-950/95',
    expression: {
      default: '😐', angry: '😤', determined: '😏', serious: '🗿', surprised: '😒',
    },
  },
  Morgan: {
    emoji: '🪓',
    name: 'CAPITÁN MORGAN',
    color: 'text-blue-400',
    border: 'border-blue-500',
    bg: 'from-slate-700 via-blue-900 to-slate-900',
    sceneBg: 'from-blue-950/70 via-slate-950/85 to-slate-950/95',
    expression: {
      default: '😠', angry: '🤬', screaming: '😤', shocked: '😳',
    },
  },
  Helmeppo: {
    emoji: '😏',
    name: 'HELMEPPO',
    color: 'text-yellow-300',
    border: 'border-yellow-400',
    bg: 'from-yellow-400 via-amber-500 to-orange-600',
    sceneBg: 'from-amber-950/60 via-slate-950/80 to-slate-950/95',
    expression: { default: '😏', scared: '😨', crying: '😭' },
  },
  Alvida: {
    emoji: '🦹‍♀️',
    name: 'CAPITANA ALVIDA',
    color: 'text-pink-400',
    border: 'border-rose-500',
    bg: 'from-pink-700 via-rose-800 to-slate-900',
    sceneBg: 'from-rose-950/70 via-slate-950/85 to-slate-950/95',
    expression: { default: '😤', angry: '🤬', vain: '💅', surprised: '😱' },
  },
  Rika: {
    emoji: '👧',
    name: 'RIKA',
    color: 'text-lime-400',
    border: 'border-lime-400',
    bg: 'from-lime-500 via-green-500 to-emerald-600',
    sceneBg: 'from-lime-950/50 via-slate-950/80 to-slate-950/95',
    expression: { default: '😊', crying: '😭', scared: '😨' },
  },
  Nami: {
    emoji: '🗺️',
    name: 'NAMI',
    color: 'text-orange-400',
    border: 'border-orange-400',
    bg: 'from-orange-500 via-amber-600 to-yellow-700',
    sceneBg: 'from-orange-950/60 via-slate-950/80 to-slate-950/95',
    expression: { default: '😒', happy: '😁', surprised: '😲', scheming: '🙄' },
  },
  Buggy: {
    emoji: '🤡',
    name: 'BUGGY EL PAYASO',
    color: 'text-blue-400',
    border: 'border-blue-500',
    bg: 'from-blue-700 via-red-600 to-yellow-500',
    sceneBg: 'from-blue-950/70 via-red-950/50 to-slate-950/95',
    expression: { default: '🤡', angry: '🤬', laughing: '😂', shocked: '😱' },
  },
  Usopp: {
    emoji: '🎯',
    name: 'USOPP',
    color: 'text-yellow-400',
    border: 'border-yellow-500',
    bg: 'from-yellow-600 via-amber-700 to-stone-700',
    sceneBg: 'from-yellow-950/60 via-slate-950/80 to-slate-950/95',
    expression: { default: '😅', lying: '🤥', scared: '😨', brave: '😤' },
  },
  Kuro: {
    emoji: '🐈‍⬛',
    name: 'CAPITÁN KURO',
    color: 'text-slate-300',
    border: 'border-slate-500',
    bg: 'from-slate-800 via-zinc-800 to-stone-900',
    sceneBg: 'from-slate-950/80 via-zinc-950/80 to-slate-950/95',
    expression: { default: '🧐', cold: '😏', angry: '😤', shocked: '😱' },
  },
};

const DEFAULT_CONFIG = {
  emoji: '💬',
  name: 'SISTEMA',
  color: 'text-slate-300',
  border: 'border-slate-600',
  bg: 'from-slate-700 to-slate-800',
  sceneBg: 'from-slate-950/80 via-slate-950/85 to-slate-950/95',
  expression: { default: '💬' },
};

function detectMood(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('!!') || t.includes('¡¡') || t.includes('emocion') || t.includes('increíble')) return 'excited';
  if (t.includes('grrrr') || t.includes('furioso') || t.includes('¡maldito') || t.includes('¡cómo')) return 'angry';
  if (t.includes('llorar') || t.includes('lloro') || t.includes('waaa') || t.includes('boooo')) return 'crying';
  if (t.includes('miedo') || t.includes('temblando') || t.includes('¿qu') || t.includes('peligro')) return 'scared';
  if (t.includes('rey') || t.includes('pirata') || t.includes('soy el más') || t.includes('juro')) return 'determined';
  if (t.includes('sorprendido') || t.includes('¿qué?') || t.includes('imposible') || t.includes('¿cómo?')) return 'surprised';
  return 'default';
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onNext }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  // Reset typewriter on dialogue change
  useEffect(() => {
    if (!dialogue || !dialogue.text) return;
    setDisplayedText('');
    setIsFinished(false);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < dialogue.text.length) {
        setDisplayedText(dialogue.text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [dialogue?.id ?? dialogue?.text]);

  if (!dialogue || !dialogue.text) return null;

  const cfg = SPEAKER_CONFIG[dialogue.speaker] ?? DEFAULT_CONFIG;
  const mood = detectMood(dialogue.text);
  const expression = cfg.expression[mood] ?? cfg.expression['default'] ?? cfg.emoji;

  const handleClick = () => {
    if (!isFinished) {
      // Skip typewriter — show full text immediately
      setDisplayedText(dialogue.text);
      setIsFinished(true);
    } else {
      onNext();
    }
  };

  return (
    /* Full-screen semi-transparent overlay — game grid stays mounted underneath */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none"
      style={{ paddingBottom: '0' }}
    >
      {/* Cinematic letterbox gradient at bottom */}
      <div className={`absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t ${cfg.sceneBg} pointer-events-none`} />

      {/* Dialogue card */}
      <div
        onClick={handleClick}
        className="relative pointer-events-auto w-full max-w-3xl mx-auto mb-0 cursor-pointer select-none"
        style={{ zIndex: 51 }}
      >
        {/* Scene label top-left (e.g. "⛵ Barco de Alvida — Nivel 1") */}
        <div className="absolute -top-7 left-4 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
          {dialogue.speaker !== 'Sistema' ? `${cfg.emoji} ${dialogue.speaker}` : '📍 NARRADOR'}
        </div>

        {/* Main box */}
        <div
          className={`w-full bg-slate-950/95 border-t-4 ${cfg.border} flex gap-0 overflow-hidden shadow-[0_-10px_60px_rgba(0,0,0,0.9)]`}
          style={{ minHeight: '120px' }}
        >
          {/* Left: Character portrait block */}
          <div className={`flex flex-col items-center justify-end shrink-0 bg-gradient-to-b ${cfg.bg} relative`}
            style={{ width: '88px', minHeight: '120px' }}>
            {/* Expression badge */}
            <span
              className="absolute top-2 right-1 text-base drop-shadow-lg z-10 select-none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
            >
              {expression}
            </span>
            {/* Big emoji sprite portrait */}
            <span className="text-5xl pb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] select-none z-10">
              {cfg.emoji}
            </span>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-white/5 pointer-events-none" />
          </div>

          {/* Right: Text area */}
          <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 min-h-0">
            {/* Speaker name bar */}
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-mono text-[10px] sm:text-xs font-black tracking-widest uppercase ${cfg.color}`}>
                {cfg.name}
              </span>
              {/* Pixel corner decoration */}
              <div className="flex gap-0.5">
                <div className={`w-1.5 h-1.5 ${cfg.border.replace('border-','bg-')} opacity-60`} />
                <div className={`w-1.5 h-1.5 ${cfg.border.replace('border-','bg-')} opacity-40`} />
                <div className={`w-1.5 h-1.5 ${cfg.border.replace('border-','bg-')} opacity-20`} />
              </div>
            </div>

            {/* Dialogue text with typewriter cursor */}
            <p className="font-sans text-[13px] sm:text-[15px] leading-relaxed text-slate-100 tracking-wide flex-1 min-h-[44px]">
              {displayedText}
              {!isFinished && (
                <span className="inline-block w-2.5 h-[1em] ml-0.5 bg-amber-400 animate-pulse align-middle" />
              )}
            </p>

            {/* Footer: advance hint */}
            <div className="flex justify-end items-center mt-2 gap-1.5 text-[9px] sm:text-[10px] font-mono text-slate-500 select-none">
              {isFinished ? (
                <>
                  <span className="text-amber-400 font-bold">Siguiente</span>
                  <ChevronRight className="w-3 h-3 text-amber-400 animate-bounce" />
                  <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-black text-[8px]">
                    ESPACIO / CLICK
                  </kbd>
                </>
              ) : (
                <span className="text-slate-600 italic">click para saltar...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Dialogue } from '../types';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: Dialogue;
  onNext: () => void;
}

const SPEAKER_CONFIG: Record<
  string,
  {
    emoji: string;
    name: string;
    color: string;
    border: string;
    bg: string;
    sceneBg: string;
    expression: Record<string, string>;
  }
> = {
  Luffy: {
    emoji: '👒',
    name: 'MONKEY D. LUFFY',
    color: 'text-yellow-400',
    border: 'border-yellow-400',
    bg: 'from-amber-600 via-red-600 to-rose-700',
    sceneBg: 'from-amber-950/80 via-red-950/70 to-slate-950/95',
    expression: { default: '😆', excited: '🤩', angry: '😡', determined: '😤', surprised: '😯' },
  },
  Koby: {
    emoji: '👓',
    name: 'KOBY (Navegante)',
    color: 'text-sky-300',
    border: 'border-sky-400',
    bg: 'from-sky-600 via-indigo-600 to-slate-700',
    sceneBg: 'from-sky-950/80 via-slate-950/80 to-slate-950/95',
    expression: { default: '😨', scared: '😱', crying: '😭', determined: '🥺' },
  },
  Alvida: {
    emoji: '🦹‍♀️',
    name: 'CAPITANA ALVIDA',
    color: 'text-rose-400',
    border: 'border-rose-500',
    bg: 'from-rose-700 via-red-800 to-stone-900',
    sceneBg: 'from-rose-950/85 via-red-950/75 to-slate-950/95',
    expression: { default: '👸', angry: '🤬', laughing: '😈', defeated: '😵' },
  },
  Zoro: {
    emoji: '⚔️',
    name: 'RORONOA ZORO',
    color: 'text-emerald-400',
    border: 'border-emerald-400',
    bg: 'from-emerald-700 via-teal-800 to-slate-900',
    sceneBg: 'from-emerald-950/80 via-teal-950/70 to-slate-950/95',
    expression: { default: '🥷', angry: '⚡', confident: '😏', chained: '⛓️' },
  },
  Morgan: {
    emoji: '🪓',
    name: 'CAPITÁN MORGAN (Hacha)',
    color: 'text-amber-400',
    border: 'border-amber-500',
    bg: 'from-amber-700 via-orange-800 to-stone-900',
    sceneBg: 'from-amber-950/80 via-slate-950/90 to-slate-950/95',
    expression: { default: '🪓', angry: '😤', laughing: 'HAHA' },
  },
  Helmeppo: {
    emoji: '👱‍♂️',
    name: 'HELMEPPO',
    color: 'text-purple-300',
    border: 'border-purple-400',
    bg: 'from-purple-700 via-indigo-800 to-slate-900',
    sceneBg: 'from-purple-950/80 via-slate-950/90 to-slate-950/95',
    expression: { default: '😏', scared: '😰' },
  },
};

const DEFAULT_CONFIG = {
  emoji: '📜',
  name: 'GUÍA DE AVENTURA',
  color: 'text-amber-300',
  border: 'border-amber-400',
  bg: 'from-slate-800 via-amber-900 to-slate-900',
  sceneBg: 'from-slate-950/85 via-slate-950/90 to-slate-950/98',
  expression: { default: '📜' },
};

function detectMood(text: string = ''): string {
  if (!text) return 'default';
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
  const textRef = useRef<string>('');

  useEffect(() => {
    if (!dialogue || !dialogue.text) return;
    textRef.current = dialogue.text;
    setDisplayedText('');
    setIsFinished(false);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < textRef.current.length) {
        setDisplayedText(textRef.current.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [dialogue?.id, dialogue?.text]);

  if (!dialogue || !dialogue.text) return null;

  const cfg = SPEAKER_CONFIG[dialogue.speaker] ?? DEFAULT_CONFIG;
  const mood = detectMood(dialogue.text);
  const expression = cfg.expression[mood] ?? cfg.expression['default'] ?? cfg.emoji;

  const handleAction = () => {
    if (!isFinished) {
      setDisplayedText(dialogue.text);
      setIsFinished(true);
    } else {
      onNext();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-[2px] pointer-events-auto select-none"
      onClick={handleAction}
    >
      <div 
        className="w-full max-w-2xl bg-slate-950 border-2 sm:border-4 border-amber-400 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.4)] flex flex-col cursor-pointer"
      >
        {/* Speaker Top Bar */}
        <div className={`w-full px-3.5 py-2 bg-gradient-to-r ${cfg.bg} border-b border-amber-400/50 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow">{cfg.emoji}</span>
            <span className="font-mono font-black text-xs sm:text-sm tracking-wider uppercase text-yellow-200">
              {cfg.name}
            </span>
          </div>
          <span className="text-xs bg-slate-950/90 px-2.5 py-1 rounded-full border border-amber-400/50 text-amber-300 font-mono font-bold">
            {expression} {dialogue.speaker}
          </span>
        </div>

        {/* Dialogue Text Content Area */}
        <div className="p-4 sm:p-6 flex flex-col justify-between gap-4 bg-slate-950 min-h-[120px] max-h-[260px] overflow-y-auto">
          <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-100 font-semibold tracking-wide">
            {displayedText}
            <span className={`inline-block w-2.5 h-4 ml-1 bg-amber-400 align-middle ${isFinished ? 'opacity-0' : 'animate-pulse opacity-100'}`} />
          </p>

          {/* Action guidance footer bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-[11px] sm:text-xs font-mono text-slate-300 flex items-center gap-1.5 font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Haz clic o presiona <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-black">ESPACIO</kbd></span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAction();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>{isFinished ? 'Siguiente ▶' : 'Completar Text ▶'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Dialogue } from '../types';
import { motion } from 'motion/react';
import { Star, ChevronRight } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: Dialogue;
  onNext: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onNext }) => {
  if (!dialogue || !dialogue.text) return null;

  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < dialogue.text.length) {
        setDisplayedText((prev) => prev + dialogue.text.charAt(idx));
        idx++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 20); // 20ms per character for snap-quick dialogue feel

    return () => clearInterval(interval);
  }, [dialogue]);

  // Handle skip/force-finish on click
  const handleContainerClick = () => {
    if (!isFinished) {
      setDisplayedText(dialogue.text);
      setIsFinished(true);
    } else {
      onNext();
    }
  };

  // Keyboard binding inside App will trigger onNext, but we also handle clicks securely here
  const getSpeakerAvatarStyle = (speaker: string) => {
    switch (speaker) {
      case 'Luffy':
        return {
          bg: 'bg-gradient-to-br from-red-600 via-rose-500 to-amber-400',
          border: 'border-amber-400',
          emoji: '👒',
          textColor: 'text-rose-400',
          title: 'MONKEY D. LUFFY',
        };
      case 'Koby':
        return {
          bg: 'bg-gradient-to-br from-pink-400 to-purple-500',
          border: 'border-pink-300',
          emoji: '👓',
          textColor: 'text-pink-300',
          title: 'KOBY (MARINA)',
        };
      case 'Zoro':
        return {
          bg: 'bg-gradient-to-br from-emerald-600 to-teal-500',
          border: 'border-emerald-300',
          emoji: '⚔️',
          textColor: 'text-emerald-400',
          title: 'RORONOA ZORO',
        };
      case 'Morgan':
        return {
          bg: 'bg-gradient-to-br from-slate-700 via-blue-900 to-stone-800',
          border: 'border-blue-400',
          emoji: '🪓',
          textColor: 'text-blue-300',
          title: 'CAPITÁN MORGAN',
        };
      case 'Helmeppo':
        return {
          bg: 'bg-gradient-to-br from-yellow-300 to-amber-500',
          border: 'border-yellow-100',
          emoji: '😏',
          textColor: 'text-yellow-300',
          title: 'HELMEPPO',
        };
      case 'Alvida':
        return {
          bg: 'bg-gradient-to-br from-pink-700 via-rose-800 to-slate-900',
          border: 'border-rose-400',
          emoji: '🦹‍♀️',
          textColor: 'text-pink-400',
          title: 'CAPITANA ALVIDA',
        };
      case 'Rika':
        return {
          bg: 'bg-gradient-to-br from-lime-500 to-green-600',
          border: 'border-lime-200',
          emoji: '👧',
          textColor: 'text-lime-300',
          title: 'RIKA',
        };
      case 'Nami':
        return {
          bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
          border: 'border-orange-300',
          emoji: '👩‍🦰',
          textColor: 'text-orange-400',
          title: 'NAMI (NAVEGANTE)',
        };
      case 'Buggy':
        return {
          bg: 'bg-gradient-to-br from-blue-700 via-red-600 to-yellow-500',
          border: 'border-blue-400',
          emoji: '🤡',
          textColor: 'text-blue-300',
          title: 'BUGGY EL PAYASO',
        };
      case 'Usopp':
        return {
          bg: 'bg-gradient-to-br from-yellow-600 to-amber-700',
          border: 'border-yellow-400',
          emoji: '🤥',
          textColor: 'text-yellow-400',
          title: 'USOPP (GUERRERO)',
        };
      case 'Kuro':
        return {
          bg: 'bg-gradient-to-br from-slate-800 to-stone-900',
          border: 'border-stone-400',
          emoji: '👓🐈',
          textColor: 'text-slate-400',
          title: 'CAPITÁN KURO',
        };
      default:
        return {
          bg: 'bg-slate-700',
          border: 'border-slate-500',
          emoji: '💬',
          textColor: 'text-slate-200',
          title: 'SISTEMA',
        };
    }
  };

  const style = getSpeakerAvatarStyle(dialogue.speaker);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={handleContainerClick}
        className="w-full bg-slate-900/95 border-4 border-amber-600/80 p-5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex gap-4 select-none cursor-pointer outline-none relative hover:border-amber-500 transition-colors"
      >
        {/* Pixel style corner decorations */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-amber-500" />
        <div className="absolute top-1 right-1 w-2 h-2 bg-amber-500" />
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-amber-500" />
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-amber-500" />

        {/* Character Portrait */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-xl border-4 ${style.border} ${style.bg} flex items-center justify-center text-4xl shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform`}>
            {/* Animating shine */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">{style.emoji}</span>
          </div>
          <div className={`mt-2 font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-center uppercase whitespace-nowrap text-slate-400`}>
            {dialogue.speaker}
          </div>
        </div>

        {/* Dialogue main text body */}
        <div className="flex-grow flex flex-col justify-between pt-1">
          <div>
            <div className={`font-mono text-xs font-bold tracking-wider mb-2 flex items-center gap-1.5 ${style.textColor}`}>
              <Star className="w-3 h-3 fill-current rotate-12" />
              {style.title}
            </div>
            <p className="font-sans text-[15px] font-medium leading-relaxed text-slate-100 tracking-wide text-left">
              {displayedText}
              {!isFinished && <span className="inline-block w-2.5 h-4 ml-1 bg-amber-400 animate-pulse" />}
            </p>
          </div>

          <div className="flex justify-end items-center mt-3 text-[10px] font-mono text-slate-400 gap-1 select-none">
            <span>Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500 animate-ping-subtle" />
            <kbd className="px-1.5 py-0.5 bg-slate-950 rounded text-[9px] text-amber-500 border border-slate-800 font-extrabold ml-1">ESPACIO</kbd>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import { Cell, CellType } from '../types';

export interface PasherTheme {
  id: number;
  name: string;
  island: string;
  gridBackground: string;
  borderColor: string;
  mastEmoji: string;
  accentColor: string;
  
  // Dynamic cell styling config
  cellStyles: Record<CellType, string>;
  
  // Custom decorations (can return emojis, animations, borders, etc.)
  decorations: {
    deck?: {
      glow?: string;
      customElements?: string;
    };
    wall?: {
      headerBg?: string;
      pillarColor?: string;
    };
    water?: {
      bgGradient: string;
      waveEmoji?: string;
      bubbleChance?: number;
      fishEmoji?: string;
    };
    mast?: {
      caption: string;
      symbol: string;
      glow?: string;
    };
  };
  
  // Scaling & Layout properties (Web vs Mobile adjustments)
  layout: {
    mobileTileSize: string; // Tailored sizing for mobile view ports
    desktopTileSize: string; // Tailored size for desktop screens
    animationDuration: number; // movement speed multiplier
  };
}

/**
 * PASHER_THEMES provides a single source of truth for the entire visual style,
 * backgrounds, colors, custom cell decorators, and scaling configurations for each level.
 * Adding a new level or changing the themes is as simple as adding/editing a config object here!
 */
export const PASHER_THEMES: Record<number, PasherTheme> = {
  1: {
    id: 1,
    name: 'El Sótano de la Bodega',
    island: 'Barco de Alvida',
    gridBackground: 'bg-[#1e140d]',
    borderColor: 'border-[#4a2f1b]',
    mastEmoji: '⚓',
    accentColor: 'amber',
    cellStyles: {
      wall: 'bg-[#2f1d11] border-[#1f120a] border-2 shadow-inner',
      water: 'bg-blue-955/85',
      deck: 'bg-[#b68c5d] hover:brightness-105',
      'deck-dark': 'bg-[#9f7447] hover:brightness-105',
      floor: 'bg-[#be9566]',
      'door-locked': 'bg-[#5a1b1b] border-red-650 border-2 flex items-center justify-center',
      'door-open': 'bg-[#704d2e]/90 border-[0.5px] border-[#5a3a1f]',
      barrel: 'bg-[#9f7447] hover:brightness-110 border-[#1f120a]/40 border flex items-center justify-center relative cursor-cell rounded shadow-sm',
      'barrel-broken': 'brightness-50 flex items-center justify-center opacity-75 scale-90',
      'barrel-luffy': 'bg-[#ce4e4e] border-[#ffd43f] border-2 rounded flex items-center justify-center relative cursor-cell shadow-md',
      chest: 'bg-[#d97706] border-[#78350f] border-2 rounded flex items-center justify-center relative shadow-md shadow-stone-950',
      'chest-opened': 'bg-[#78350f]/60 border-[#5c240a] rounded opacity-85 flex items-center justify-center scale-95',
      mast: 'bg-[#402a18] border-[#5c3c20] border-2 rounded flex items-center justify-center select-none shadow-lg',
      'koby-scared': 'bg-pink-950/20 border-pink-900/40 border-2 rounded relative flex items-center justify-center',
      'koby-free': 'bg-emerald-950/30 border-emerald-900 border-2 rounded relative flex items-center justify-center',
      'zoro-chained': 'bg-amber-955/50 border-amber-900 border-2 rounded flex items-center justify-center relative',
      'zoro-free': 'bg-emerald-955/40 border-emerald-900 border-2 rounded flex items-center justify-center relative',
      stairs: 'bg-[#855930] border-[#4a2e16] border-2 rounded relative flex items-center justify-center shadow-inner cursor-pointer',
      'house-door': 'bg-amber-900 border-amber-700 border-2 flex items-center justify-center cursor-pointer',
      'house-roof': 'bg-red-800 border-red-950 border flex items-center justify-center',
      flower: 'bg-emerald-900/30 flex items-center justify-center',
      'npc-nina': 'bg-pink-950/20 border-pink-900/40 border rounded relative flex items-center justify-center',
      'npc-villager': 'bg-emerald-950/20 border-emerald-900/40 border rounded relative flex items-center justify-center',
      'switch-off': 'bg-amber-950 border-amber-800 border-2 rounded flex items-center justify-center cursor-pointer',
      'switch-on': 'bg-yellow-500 border-yellow-300 border-2 rounded flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.6)]',
      pot: 'bg-amber-900 border-amber-950 border rounded flex items-center justify-center relative cursor-cell',
      'pot-broken': 'brightness-50 flex items-center justify-center opacity-60 scale-85',
      torch: 'bg-stone-900 border-stone-800 border rounded flex items-center justify-center relative',
      bridge: 'bg-[#a07040] border-[#654020] border-y-2 flex items-center justify-center',
      'wall-stone': 'bg-slate-200 border-slate-400 border-2 shadow-md rounded-sm',
    },
    decorations: {
      wall: {
        headerBg: 'bg-amber-900',
        pillarColor: 'bg-amber-950/70'
      },
      water: {
        bgGradient: 'from-amber-950 via-slate-950 to-amber-900',
        waveEmoji: '🌊',
        bubbleChance: 0.1,
        fishEmoji: '🦐'
      },
      mast: {
        caption: 'MÁSTIL',
        symbol: '⚓',
      }
    },
    layout: {
      mobileTileSize: 'w-7 h-7 sm:w-10 sm:h-10',
      desktopTileSize: 'w-12 h-12 lg:w-14 lg:h-14',
      animationDuration: 0.2,
    }
  },
  2: {
    id: 2,
    name: 'La Cubierta Superior',
    island: 'Barco de Alvida',
    gridBackground: 'bg-slate-950',
    borderColor: 'border-amber-900/80',
    mastEmoji: '⚙️',
    accentColor: 'teal',
    cellStyles: {
      wall: 'bg-amber-955/80 border-amber-900/90 shadow-stone-955 border-[2px] shadow-md',
      water: 'bg-blue-950 relative animate-pulse-slow overflow-hidden',
      deck: 'bg-amber-900/35 hover:brightness-105 transition-all',
      'deck-dark': 'bg-amber-955/55 hover:brightness-105 transition-all',
      floor: 'bg-slate-700/85',
      'door-locked': 'bg-slate-950 border-amber-655 border-2 flex items-center justify-center',
      'door-open': 'bg-slate-900/90 hover:brightness-110 border-[0.5px] border-slate-800',
      barrel: 'bg-amber-800/80 hover:brightness-110 flex items-center justify-center relative cursor-cell border border-amber-900 rounded',
      'barrel-broken': 'brightness-50 flex items-center justify-center opacity-70 scale-90',
      'barrel-luffy': 'bg-amber-700 border-yellow-500 border-2 rounded flex items-center justify-center relative cursor-cell',
      chest: 'bg-amber-600 border-amber-900 border-2 rounded flex items-center justify-center relative shadow-md shadow-black',
      'chest-opened': 'bg-amber-900/60 border-amber-950 rounded opacity-80 flex items-center justify-center scale-95',
      mast: 'bg-amber-950 border-amber-900 border-4 rounded-full flex items-center justify-center select-none shadow-lg',
      'koby-scared': 'bg-fuchsia-950/20 border-fuchsia-900/40 border-2 rounded relative flex items-center justify-center',
      'koby-free': 'bg-emerald-950/30 border-emerald-900 border-2 rounded relative flex items-center justify-center',
      'zoro-chained': 'bg-amber-950/50 border-amber-900 border-2 rounded flex items-center justify-center relative',
      'zoro-free': 'bg-emerald-950/40 border-emerald-900 border-2 rounded flex items-center justify-center relative',
      stairs: 'bg-amber-900/60 border-amber-950 border-2 rounded relative flex items-center justify-center shadow-inner cursor-pointer',
      'house-door': 'bg-amber-900 border-amber-700 border-2 flex items-center justify-center cursor-pointer',
      'house-roof': 'bg-red-800 border-red-950 border flex items-center justify-center',
      flower: 'bg-emerald-900/30 flex items-center justify-center',
      'npc-nina': 'bg-pink-950/20 border-pink-900/40 border rounded relative flex items-center justify-center',
      'npc-villager': 'bg-emerald-950/20 border-emerald-900/40 border rounded relative flex items-center justify-center',
      'switch-off': 'bg-amber-950 border-amber-800 border-2 rounded flex items-center justify-center cursor-pointer',
      'switch-on': 'bg-yellow-500 border-yellow-300 border-2 rounded flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.6)]',
      pot: 'bg-amber-900 border-amber-950 border rounded flex items-center justify-center relative cursor-cell',
      'pot-broken': 'brightness-50 flex items-center justify-center opacity-60 scale-85',
      torch: 'bg-stone-900 border-stone-800 border rounded flex items-center justify-center relative',
      bridge: 'bg-[#a07040] border-[#654020] border-y-2 flex items-center justify-center',
      'wall-stone': 'bg-slate-200 border-slate-400 border-2 shadow-md rounded-sm',
    },
    decorations: {
      wall: {
        headerBg: 'bg-amber-800',
        pillarColor: 'bg-amber-950/60'
      },
      water: {
        bgGradient: 'from-indigo-950 via-blue-950 to-slate-950',
        waveEmoji: '~ ~',
        bubbleChance: 0.15,
        fishEmoji: '🐟'
      },
      mast: {
        caption: 'VELA',
        symbol: '⚙️',
      }
    },
    layout: {
      mobileTileSize: 'w-7 h-7 sm:w-10 sm:h-10',
      desktopTileSize: 'w-12 h-12 lg:w-14 lg:h-14',
      animationDuration: 0.2,
    }
  },
  3: {
    id: 3,
    name: 'Base de la Marina',
    island: 'Shells Town',
    gridBackground: 'bg-slate-900',
    borderColor: 'border-slate-850',
    mastEmoji: '⛓️',
    accentColor: 'indigo',
    cellStyles: {
      wall: 'bg-slate-700 border-slate-900 shadow-stone-950 border-[2px] shadow-2xl rounded',
      water: 'bg-emerald-950 relative overflow-hidden',
      deck: 'bg-slate-800 hover:brightness-105 transition-all shadow-inner',
      'deck-dark': 'bg-slate-900 hover:brightness-105 transition-all shadow-inner',
      floor: 'bg-rose-955 shadow-inner',
      'door-locked': 'bg-slate-950 border-red-650 border-2 flex items-center justify-center',
      'door-open': 'bg-slate-900/90 hover:brightness-110 border-[0.5px] border-slate-800',
      barrel: 'bg-slate-850 hover:brightness-110 border-slate-700 border flex items-center justify-center relative cursor-cell rounded',
      'barrel-broken': 'brightness-50 flex items-center justify-center opacity-70 scale-90',
      'barrel-luffy': 'bg-amber-700 border-yellow-500 border-2 rounded flex items-center justify-center relative cursor-cell',
      chest: 'bg-amber-600 border-amber-900 border-2 rounded flex items-center justify-center relative shadow-md shadow-black',
      'chest-opened': 'bg-amber-900/60 border-amber-950 rounded opacity-80 flex items-center justify-center scale-95',
      mast: 'bg-amber-950/60 border-amber-900 border-2 rounded flex items-center justify-center select-none shadow-lg',
      'koby-scared': 'bg-fuchsia-950/20 border-fuchsia-900/40 border-2 rounded relative flex items-center justify-center',
      'koby-free': 'bg-emerald-950/30 border-emerald-900 border-2 rounded relative flex items-center justify-center',
      'zoro-chained': 'bg-amber-955 border-amber-900 border-2 rounded flex items-center justify-center relative',
      'zoro-free': 'bg-emerald-950 text-emerald-300 border-emerald-500 border-2 rounded flex items-center justify-center relative',
      stairs: 'bg-slate-800 border-slate-650 border-2 rounded relative flex items-center justify-center shadow-inner cursor-pointer',
      'house-door': 'bg-amber-900 border-amber-700 border-2 flex items-center justify-center cursor-pointer',
      'house-roof': 'bg-red-800 border-red-950 border flex items-center justify-center',
      flower: 'bg-emerald-900/30 flex items-center justify-center',
      'npc-nina': 'bg-pink-950/20 border-pink-900/40 border rounded relative flex items-center justify-center',
      'npc-villager': 'bg-emerald-950/20 border-emerald-900/40 border rounded relative flex items-center justify-center',
      'switch-off': 'bg-amber-950 border-amber-800 border-2 rounded flex items-center justify-center cursor-pointer',
      'switch-on': 'bg-yellow-500 border-yellow-300 border-2 rounded flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.6)]',
      pot: 'bg-amber-900 border-amber-950 border rounded flex items-center justify-center relative cursor-cell',
      'pot-broken': 'brightness-50 flex items-center justify-center opacity-60 scale-85',
      torch: 'bg-stone-900 border-stone-800 border rounded flex items-center justify-center relative',
      bridge: 'bg-[#a07040] border-[#654020] border-y-2 flex items-center justify-center',
      'wall-stone': 'bg-slate-200 border-slate-400 border-2 shadow-md rounded-sm',
    },
    decorations: {
      wall: {
        headerBg: 'bg-slate-800',
        pillarColor: 'bg-slate-950'
      },
      water: {
        bgGradient: 'from-emerald-950 via-[#0d2a1c] to-[#041a10]',
        waveEmoji: '🌱',
        bubbleChance: 0.1,
        fishEmoji: '🍀'
      },
      mast: {
        caption: 'POSTE',
        symbol: '🪵',
        glow: 'border-amber-900'
      }
    },
    layout: {
      mobileTileSize: 'w-7 h-7 sm:w-10 sm:h-10',
      desktopTileSize: 'w-12 h-12 lg:w-14 lg:h-14',
      animationDuration: 0.22,
    }
  },
  4: {
    id: 4,
    name: 'Orange Town Arena',
    island: 'Orange Town',
    gridBackground: 'bg-orange-950/80',
    borderColor: 'border-orange-800/80',
    mastEmoji: '🎪',
    accentColor: 'orange',
    cellStyles: {
      wall: 'bg-orange-950 border-orange-900 shadow-stone-950 border-[2px] shadow-2xl rounded',
      water: 'bg-blue-950 relative overflow-hidden',
      deck: 'bg-orange-900/20 hover:brightness-105 transition-all shadow-inner',
      'deck-dark': 'bg-amber-955/50 hover:brightness-105 transition-all shadow-inner',
      floor: 'bg-indigo-950 shadow-inner',
      'door-locked': 'bg-slate-950 border-amber-550 border-2 flex items-center justify-center',
      'door-open': 'bg-slate-900/95 hover:brightness-110 border-[0.5px] border-slate-800',
      barrel: 'bg-orange-900/35 hover:brightness-110 border-orange-850 border flex items-center justify-center relative cursor-cell rounded',
      'barrel-broken': 'brightness-50 flex items-center justify-center opacity-70 scale-90',
      'barrel-luffy': 'bg-amber-700 border-yellow-500 border-2 rounded flex items-center justify-center relative cursor-cell',
      chest: 'bg-amber-600 border-amber-900 border-2 rounded flex items-center justify-center relative shadow-md shadow-black',
      'chest-opened': 'bg-amber-900/60 border-amber-950 rounded opacity-80 flex items-center justify-center scale-95',
      mast: 'bg-indigo-950 border-indigo-950 border-2 rounded flex items-center justify-center select-none shadow-lg',
      'koby-scared': 'bg-fuchsia-950/20 border-fuchsia-900/40 border-2 rounded relative flex items-center justify-center',
      'koby-free': 'bg-emerald-950/30 border-emerald-950 border-2 rounded relative flex items-center justify-center',
      'zoro-chained': 'bg-amber-950/50 border-amber-900 border-2 rounded flex items-center justify-center relative',
      'zoro-free': 'bg-emerald-950/40 border-emerald-900 border-2 rounded flex items-center justify-center relative',
      stairs: 'bg-slate-800 border-slate-650 border-2 rounded relative flex items-center justify-center shadow-inner cursor-pointer',
      'house-door': 'bg-amber-900 border-amber-700 border-2 flex items-center justify-center cursor-pointer',
      'house-roof': 'bg-red-800 border-red-950 border flex items-center justify-center',
      flower: 'bg-emerald-900/30 flex items-center justify-center',
      'npc-nina': 'bg-pink-950/20 border-pink-900/40 border rounded relative flex items-center justify-center',
      'npc-villager': 'bg-emerald-950/20 border-emerald-900/40 border rounded relative flex items-center justify-center',
      'switch-off': 'bg-amber-950 border-amber-800 border-2 rounded flex items-center justify-center cursor-pointer',
      'switch-on': 'bg-yellow-500 border-yellow-300 border-2 rounded flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.6)]',
      pot: 'bg-amber-900 border-amber-950 border rounded flex items-center justify-center relative cursor-cell',
      'pot-broken': 'brightness-50 flex items-center justify-center opacity-60 scale-85',
      torch: 'bg-stone-900 border-stone-800 border rounded flex items-center justify-center relative',
      bridge: 'bg-[#a07040] border-[#654020] border-y-2 flex items-center justify-center',
      'wall-stone': 'bg-slate-200 border-slate-400 border-2 shadow-md rounded-sm',
    },
    decorations: {
      wall: {
        headerBg: 'bg-red-800',
        pillarColor: 'bg-orange-950'
      },
      water: {
        bgGradient: 'from-blue-950 via-sky-950 to-slate-950',
        waveEmoji: '🎈',
        bubbleChance: 0.12,
        fishEmoji: '🤡'
      },
      mast: {
        caption: 'POSTE',
        symbol: '🎪',
        glow: 'border-red-900'
      }
    },
    layout: {
      mobileTileSize: 'w-7 h-7 sm:w-10 sm:h-10',
      desktopTileSize: 'w-12 h-12 lg:w-14 lg:h-14',
      animationDuration: 0.18,
    }
  },
  5: {
    id: 5,
    name: 'Syrup Village Mansion',
    island: 'Syrup Village',
    gridBackground: 'bg-emerald-950/60',
    borderColor: 'border-emerald-800',
    mastEmoji: '🏡',
    accentColor: 'rose',
    cellStyles: {
      wall: 'bg-emerald-955 border-emerald-900 shadow-stone-955 border-[2px] shadow-2l rounded',
      water: 'bg-indigo-950 relative overflow-hidden',
      deck: 'bg-emerald-900/20 hover:brightness-105 transition-all shadow-inner',
      'deck-dark': 'bg-emerald-900/35 hover:brightness-105 transition-all shadow-inner',
      floor: 'bg-amber-950 shadow-inner',
      'door-locked': 'bg-slate-950 border-green-555 border-2 flex items-center justify-center',
      'door-open': 'bg-slate-900/90 hover:brightness-110 border-[0.5px] border-slate-800',
      barrel: 'bg-emerald-950 hover:brightness-110 border-emerald-850 border flex items-center justify-center relative cursor-cell rounded',
      'barrel-broken': 'brightness-50 flex items-center justify-center opacity-70 scale-90',
      'barrel-luffy': 'bg-amber-700 border-yellow-500 border-2 rounded flex items-center justify-center relative cursor-cell',
      chest: 'bg-amber-600 border-amber-900 border-2 rounded flex items-center justify-center relative shadow-md shadow-black',
      'chest-opened': 'bg-amber-900/60 border-amber-950 rounded opacity-80 flex items-center justify-center scale-95',
      mast: 'bg-emerald-900 border-green-900 border-2 rounded flex items-center justify-center select-none shadow-lg',
      'koby-scared': 'bg-fuchsia-950/20 border-fuchsia-900/40 border-2 rounded relative flex items-center justify-center',
      'koby-free': 'bg-emerald-950/30 border-emerald-900 border-2 rounded relative flex items-center justify-center',
      'zoro-chained': 'bg-amber-950/50 border-amber-900 border-2 rounded flex items-center justify-center relative',
      'zoro-free': 'bg-emerald-950/40 border-emerald-950 border-2 rounded flex items-center justify-center relative',
      stairs: 'bg-slate-800 border-slate-650 border-2 rounded relative flex items-center justify-center shadow-inner cursor-pointer',
      'house-door': 'bg-amber-900 border-amber-700 border-2 flex items-center justify-center cursor-pointer',
      'house-roof': 'bg-red-800 border-red-950 border flex items-center justify-center',
      flower: 'bg-emerald-900/30 flex items-center justify-center',
      'npc-nina': 'bg-pink-950/20 border-pink-900/40 border rounded relative flex items-center justify-center',
      'npc-villager': 'bg-emerald-950/20 border-emerald-900/40 border rounded relative flex items-center justify-center',
      'switch-off': 'bg-amber-950 border-amber-800 border-2 rounded flex items-center justify-center cursor-pointer',
      'switch-on': 'bg-yellow-500 border-yellow-300 border-2 rounded flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.6)]',
      pot: 'bg-amber-900 border-amber-950 border rounded flex items-center justify-center relative cursor-cell',
      'pot-broken': 'brightness-50 flex items-center justify-center opacity-60 scale-85',
      torch: 'bg-stone-900 border-stone-800 border rounded flex items-center justify-center relative',
      bridge: 'bg-[#a07040] border-[#654020] border-y-2 flex items-center justify-center',
      'wall-stone': 'bg-slate-200 border-slate-400 border-2 shadow-md rounded-sm',
    },
    decorations: {
      wall: {
        headerBg: 'bg-emerald-800',
        pillarColor: 'bg-emerald-950'
      },
      water: {
        bgGradient: 'from-[#052b14] via-[#051c0f] to-stone-950',
        waveEmoji: '🌹',
        bubbleChance: 0.1,
        fishEmoji: '🏡'
      },
      mast: {
        caption: 'PILAR',
        symbol: '🌳',
        glow: 'border-emerald-900'
      }
    },
    layout: {
      mobileTileSize: 'w-7 h-7 sm:w-10 sm:h-10',
      desktopTileSize: 'w-12 h-12 lg:w-14 lg:h-14',
      animationDuration: 0.2,
    }
  }
};

/**
 * Returns the corresponding theme config object, falling back gracefully to basement theme.
 */
export function getPasherTheme(level: number): PasherTheme {
  return PASHER_THEMES[level] || PASHER_THEMES[1];
}

/**
 * Generates custom dynamic Tailwind classes based on the active level theme
 */
export function getPasherCellClass(level: number, cell: Cell): string {
  const theme = getPasherTheme(level);
  const baseClass = theme.cellStyles[cell.type] || 'bg-slate-900';
  return baseClass;
}

/**
 * High-performance, lightweight screen-ratio adapter that helps scale the entire game layout
 * dynamically for any screen size (from small phones like iPhone SE to 4k desktop monitors).
 * Generates styles that restrict boundaries inside the safe area without overflowing.
 */
export function getAdaptiveLayoutStyles(
  containerEl: HTMLDivElement | null,
  isSidebarLayout: boolean
) {
  if (!containerEl) {
    return {
      maxWidth: isSidebarLayout ? 'min(100%, calc((100vh - 170px) * 1.333), 920px)' : '100vw',
      transform: 'none'
    };
  }

  // Pure mathematical adaptive scaling limits
  const padding = isSidebarLayout ? 170 : 120;
  return {
    maxWidth: `min(100%, calc((100vh - ${padding}px) * 1.333), 960px)`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
}

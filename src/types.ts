export interface Position {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PlayerState {
  x: number;
  y: number;
  direction: Direction;
  hp: number;
  maxHp: number;
  haki: number; // For special attacks
  maxHaki: number;
  meatCount: number;
  hasKey: boolean;
  hasMap: boolean; // Map of the Grand Line
  hasSwords: boolean; // Zoro's three heavy swords
  actionState: 'idle' | 'attacking-pistol' | 'attacking-gatling' | 'attacking-whip' | 'rolling' | 'hit' | 'burst' | 'bursting-out';
  actionTimer: number; // Cooldown or duration of action animation
}

export type EnemyType = 'pirate' | 'pirate-officer' | 'alvida' | 'marine' | 'helmeppo' | 'morgan' | 'buggy' | 'kuro';

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  direction: Direction;
  hp: number;
  maxHp: number;
  speed: number; // Steps per turn / frequency of updates
  patrolPath: Position[];
  patrolIndex: number;
  state: 'idle' | 'patrolling' | 'chasing' | 'attacking' | 'stunned';
  actionTimer: number;
  isBoss?: boolean;
}

export type CellType = 
  | 'deck' 
  | 'deck-dark' 
  | 'wall' 
  | 'water' 
  | 'mast' 
  | 'door-locked' 
  | 'door-open' 
  | 'barrel' 
  | 'barrel-broken' 
  | 'barrel-luffy' // The starting barrel Luffy bursts out of
  | 'chest' 
  | 'chest-opened' 
  | 'koby-scared' 
  | 'koby-free'
  | 'zoro-chained'
  | 'zoro-free'
  | 'floor'
  | 'stairs'
  | 'house-door'
  | 'house-roof'
  | 'flower'
  | 'npc-nina'
  | 'npc-villager'
  | 'switch-off'
  | 'switch-on'
  | 'pot'
  | 'pot-broken'
  | 'torch'
  | 'bridge'
  | 'wall-stone';

export interface Cell {
  x: number;
  y: number;
  type: CellType;
  item?: 'meat' | 'key' | 'map' | 'heart' | 'swords' | null;
}

export interface Dialogue {
  id: string;
  speaker: string;
  avatar: string; // Emojis or descriptions
  text: string;
}

export interface DialogueSequence {
  dialogues: Dialogue[];
  currentIndex: number;
  onComplete?: () => void;
}

export type GameStatus = 'intro' | 'playing' | 'gameover' | 'victory';

export interface MapData {
  width: number;
  height: number;
  grid: Cell[][];
  enemies: Enemy[];
  playerSpawn: Position;
}

import { Cell, CellType, Enemy, Position, DialogueSequence } from '../types';

export const MAP_WIDTH = 16;
export const MAP_HEIGHT = 12;

// LEVEL 1: EL SÓTANO DE LA BODEGA (Cargo hold of Alvida's ship)
const BASEMENT_TEMPLATE = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 0
  ['W', 'W', 'E', 'B', 'E', 'W', 'W', 'E', 'E', 'E', 'W', 'W', 'W', 'W', 'W', 'W'], // 1
  ['W', 'W', 'E', 'M', 'E', 'W', 'W', 'E', 'M', 'E', 'W', 'W', 'E', 'T', 'W', 'W'], // 2  -- T = Stairs UP!
  ['W', 'E', 'E', 'E', 'E', 'L', 'E', 'E', 'E', 'E', 'L', 'E', 'E', 'E', 'E', 'W'], // 3  -- L = Locked cellar gate
  ['W', 'E', 'B', 'B', 'E', 'W', 'E', 'K', 'E', 'W', 'E', 'B', 'B', 'E', 'E', 'W'], // 4  -- K = Scared Koby
  ['W', 'X', 'E', 'E', 'E', 'W', 'E', 'E', 'E', 'W', 'E', 'E', 'E', 'E', 'E', 'W'], // 5  -- X = Luffy's starting barrel
  ['W', 'E', 'E', 'B', 'E', 'W', 'W', 'W', 'W', 'W', 'E', 'E', 'B', 'E', 'E', 'W'], // 6
  ['W', 'W', 'E', 'M', 'E', 'E', 'D', 'D', 'E', 'E', 'E', 'M', 'E', 'E', 'W', 'W'], // 7
  ['W', 'W', 'E', 'E', 'B', 'E', 'D', 'D', 'E', 'E', 'D', 'E', 'B', 'C', 'W', 'W'], // 8  -- C = Chest with Cellar Key to unlock gate L
  ['W', 'W', 'W', 'W', 'W', 'E', 'E', 'B', 'E', 'E', 'W', 'W', 'W', 'W', 'W', 'W'], // 9
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 10
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 11
];

// LEVEL 2: PUEBLO Y FORTALEZA SHELLPORT (Estilo Zelda: Minish Cap)
const DECK_TEMPLATE = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 0
  ['W', 'H', 'H', 'W', 'D', 'F', 'D', 'W', 'G', 'G', 'G', 'W', 'G', 'Y', 'S', 'W'], // 1 -- H = Casa, S = Katanas de Zack, Y = Vasija
  ['W', 'P', 'N', 'W', 'D', 'D', 'D', 'W', 'G', 'R', 'G', 'W', 'G', 'E', 'G', 'W'], // 2 -- P = Puerta Casa, N = Nina, R = Antorcha
  ['W', 'W', 'D', 'W', 'W', 'D', 'W', 'L', 'D', 'L', 'W', 'W', 'D', 'W', 'W', 'W'], // 3 -- L = Rejas Fortaleza
  ['W', 'D', 'F', 'D', 'D', 'D', 'W', 'R', 'Z', 'R', 'W', 'D', 'D', 'D', 'D', 'W'], // 4 -- Z = Zack encadenado entre R (antorchas)
  ['W', 'D', 'V', 'B', 'D', 'D', 'W', 'D', 'U', 'D', 'W', 'D', 'Y', 'Y', 'D', 'W'], // 5 -- V = Aldeano, U = Botón que abre rejas (8,5)
  ['W', 'D', 'D', 'D', 'D', 'D', 'W', 'W', 'L', 'W', 'W', 'D', 'D', 'D', 'D', 'W'], // 6
  ['W', 'D', 'W', 'D', 'W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'D', 'W', 'W'], // 7
  ['W', 'E', 'B', 'E', 'W', 'O', 'O', '=', '=', 'O', 'O', 'D', 'W', 'E', 'C', 'W'], // 8 -- = = Puente de Madera sobre arroyo O
  ['W', 'E', 'E', 'E', 'W', 'O', 'O', 'D', 'D', 'O', 'O', 'D', 'W', 'E', 'E', 'W'], // 9
  ['O', 'O', 'T', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'W', 'W', 'W'], // 10 -- T = Bote de escape (2,10)
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'], // 11
];

// LEVEL 3: BASE DE LA MARINA - SHELLS TOWN (Rescue of Roronoa Zoro, on outdoor land)
const MARINE_BASE_TEMPLATE = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 0
  ['W', 'E', 'B', 'E', 'W', 'D', 'W', 'E', 'E', 'E', 'W', 'E', 'B', 'S', 'W', 'W'], // 1 -- S = Chest with Zoro's Swords
  ['W', 'E', 'E', 'E', 'W', 'D', 'W', 'E', 'M', 'E', 'W', 'E', 'E', 'E', 'W', 'W'], // 2 -- M = Stake post for Zoro
  ['W', 'W', 'D', 'W', 'W', 'D', 'W', 'L', 'D', 'L', 'W', 'W', 'D', 'W', 'W', 'W'], // 3 -- L = Gates, no stairs, on ground
  ['W', 'D', 'D', 'D', 'D', 'D', 'W', 'D', 'Z', 'D', 'W', 'D', 'D', 'D', 'D', 'W'], // 4 -- Z = Zoro chained outdoor in Navy yard (8,4)
  ['W', 'D', 'B', 'B', 'D', 'D', 'W', 'D', 'D', 'D', 'W', 'D', 'B', 'B', 'D', 'W'], // 5
  ['W', 'D', 'D', 'D', 'D', 'D', 'W', 'W', 'L', 'W', 'W', 'D', 'D', 'D', 'D', 'W'], // 6
  ['W', 'D', 'W', 'D', 'W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'D', 'W', 'W'], // 7
  ['W', 'E', 'B', 'E', 'W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'E', 'C', 'W'], // 8 -- C = Chest with Base Gate key
  ['W', 'E', 'E', 'E', 'W', 'D', 'D', 'B', 'D', 'D', 'D', 'D', 'W', 'E', 'E', 'W'], // 9
  ['O', 'O', 'T', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'W', 'W', 'W'], // 10 -- T = Escape boat in harbor (2,10)
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'], // 11
];

// LEVEL 4: ORANGE TOWN (Buggy the Clown's Circus Arena showdown)
const ORANGE_TOWN_TEMPLATE = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 0
  ['W', 'E', 'B', 'E', 'E', 'E', 'W', 'D', 'W', 'E', 'E', 'E', 'E', 'S', 'W', 'W'], // 1 -- S = Grand Line Map inside Buggy's vault (13,1)
  ['W', 'E', 'M', 'E', 'E', 'E', 'W', 'D', 'W', 'E', 'M', 'E', 'E', 'E', 'W', 'W'], // 2 -- M = Circus tent banners
  ['W', 'W', 'L', 'W', 'W', 'W', 'W', 'D', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W'], // 3 -- L = Heavy cage doors
  ['W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W'], // 4
  ['W', 'D', 'B', 'B', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'B', 'B', 'D', 'W'], // 5
  ['W', 'D', 'D', 'D', 'D', 'W', 'W', 'L', 'W', 'W', 'D', 'D', 'D', 'D', 'D', 'W'], // 6
  ['W', 'D', 'W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'D', 'W', 'W'], // 7
  ['W', 'E', 'B', 'E', 'W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'E', 'C', 'W'], // 8 -- C = Circus Key (14,8)
  ['W', 'E', 'E', 'E', 'W', 'D', 'D', 'B', 'D', 'D', 'D', 'D', 'W', 'E', 'E', 'W'], // 9
  ['O', 'O', 'T', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'W', 'W', 'W'], // 10 -- T = Harbor pier escape dock (2,10)
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'], // 11
];

// LEVEL 5: SYRUP VILLAGE (Saga de Captain Kuro & Saving Lady Kaya)
const SYRUP_VILLAGE_TEMPLATE = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 0
  ['W', 'E', 'B', 'E', 'E', 'E', 'W', 'D', 'W', 'E', 'E', 'E', 'E', 'S', 'W', 'W'], // 1 -- S = Going Merry plans in Kaya's safe (13,1)
  ['W', 'E', 'M', 'E', 'E', 'E', 'W', 'D', 'W', 'E', 'M', 'E', 'E', 'E', 'W', 'W'], // 2 -- M = Garden high pines / pillars
  ['W', 'W', 'L', 'W', 'W', 'W', 'W', 'D', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W'], // 3 -- L = Locked mahogany double doors
  ['W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W'], // 4
  ['W', 'D', 'B', 'B', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'B', 'B', 'D', 'W'], // 5
  ['W', 'D', 'D', 'D', 'D', 'W', 'W', 'L', 'W', 'W', 'D', 'D', 'D', 'D', 'D', 'W'], // 6
  ['W', 'D', 'M', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'D', 'M', 'W'], // 7
  ['W', 'E', 'B', 'E', 'W', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'E', 'C', 'W'], // 8 -- C = Mansion secret garden key (14,8)
  ['W', 'E', 'E', 'E', 'W', 'D', 'D', 'B', 'D', 'D', 'D', 'D', 'W', 'E', 'E', 'W'], // 9
  ['O', 'O', 'T', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'W', 'W', 'W', 'W'], // 10 -- T = Dock of the Going Merry (2,10)
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'], // 11
];

// LEVEL 2 HOUSE INTERIOR - 1ST FLOOR (Interior de la Casa del Pueblo - Mazmorra Minish Cap)
const HOUSE_1F_TEMPLATE = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 0
  ['W', 'R', 'E', 'R', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'E', 'T', 'W', 'W'], // 1 -- T = Escaleras al 2do Piso (13,1)
  ['W', 'E', 'Y', 'E', 'W', 'E', 'E', 'U', 'E', 'E', 'E', 'W', 'E', 'E', 'W', 'W'], // 2 -- U = Interruptor en piso (7,2), Y = Vasijas
  ['W', 'E', 'E', 'E', 'W', 'E', 'M', 'E', 'E', 'M', 'E', 'W', 'E', 'Y', 'W', 'W'], // 3 -- M = Mesa de madera
  ['W', 'W', 'L', 'W', 'W', 'E', 'E', 'E', 'E', 'E', 'E', 'W', 'W', 'E', 'W', 'W'], // 4 -- L = Reja bloqueada
  ['W', 'E', 'E', 'E', 'W', 'E', 'E', 'N', 'E', 'E', 'E', 'W', 'E', 'E', 'W', 'W'], // 5 -- N = Nina
  ['W', 'E', 'Y', 'E', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'E', 'C', 'W', 'W'], // 6 -- P = Puerta de salida al pueblo (7,6), C = Cofre de Llave
  ['W', 'R', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'R', 'W', 'W'], // 7 -- R = Antorchas en pared
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 8
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 9
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 10
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 11
];

// LEVEL 2 HOUSE INTERIOR - 2ND FLOOR (Segundo Piso / Armería Secreta)
const HOUSE_2F_TEMPLATE = [
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 0 -- G = Muros de piedra blanca
  ['G', 'R', 'Y', 'R', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'E', 'T', 'G', 'G'], // 1 -- T = Escaleras al 1er Piso (13,1)
  ['G', 'E', 'E', 'E', 'G', 'E', 'E', 'E', 'E', 'E', 'E', 'G', 'E', 'E', 'G', 'G'], // 2
  ['G', 'E', 'Y', 'E', 'G', 'R', 'Y', 'E', 'E', 'Y', 'R', 'G', 'E', 'S', 'G', 'G'], // 3 -- S = Cofre de las 3 Katanas de Zack (13,3)
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 4
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 5
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 6
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 7
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 8
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 9
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 10
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'], // 11
];

export function buildInitialGrid(level: number = 1, subMap: string = 'main'): Cell[][] {
  const template = 
    subMap === 'house_1f' ? HOUSE_1F_TEMPLATE :
    subMap === 'house_2f' ? HOUSE_2F_TEMPLATE :
    level === 1 ? BASEMENT_TEMPLATE : 
    level === 2 ? DECK_TEMPLATE : 
    level === 3 ? MARINE_BASE_TEMPLATE :
    level === 4 ? ORANGE_TOWN_TEMPLATE :
    SYRUP_VILLAGE_TEMPLATE;

  const grid: Cell[][] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      const char = template[y][x];
      let type: CellType = 'deck';
      let item: Cell['item'] = null;

      switch (char) {
        case 'O':
          type = 'water';
          break;
        case 'W':
          type = 'wall';
          break;
        case 'D':
          type = 'deck';
          break;
        case 'E':
          type = 'floor';
          break;
        case 'M':
          type = 'mast';
          break;
        case 'L':
          type = 'door-locked';
          break;
        case 'T':
          type = 'stairs';
          break;
        case 'Z':
          type = 'zoro-chained';
          break;
        case 'B':
          type = 'barrel';
          item = Math.random() < 0.35 ? 'meat' : Math.random() < 0.1 ? 'heart' : null;
          break;
        case 'X':
          type = 'barrel-luffy';
          break;
        case 'K':
          type = 'koby-scared';
          break;
        case 'C':
          type = 'chest';
          item = 'key';
          break;
        case 'H':
          type = 'house-roof';
          break;
        case 'P':
          type = 'house-door';
          break;
        case 'F':
          type = 'flower';
          break;
        case 'N':
          type = 'npc-nina';
          break;
        case 'V':
          type = 'npc-villager';
          break;
        case 'U':
          type = 'switch-off';
          break;
        case 'Y':
          type = 'pot';
          break;
        case 'R':
          type = 'torch';
          break;
        case '=':
          type = 'bridge';
          break;
        case 'G':
          type = 'wall-stone';
          break;
        case 'S':
          type = 'chest';
          item = level === 3 ? 'swords' : level === 5 ? 'swords' : 'map'; 
          // reusing switches: lvl 3 = swords, lvl 4 = map, lvl 5 = going merry plans (reused swords slot in inventory UI)
          break;
        default:
          type = 'deck';
          break;
      }

      row.push({ x, y, type, item });
    }
    grid.push(row);
  }
  return grid;
}

export function getInitialEnemies(level: number = 1): Enemy[] {
  if (level === 1) {
    // LEVEL 1: Cargo Basement Recruit patrols
    return [
      {
        id: 'basement_pirate_1',
        type: 'pirate',
        x: 4,
        y: 8,
        direction: 'right',
        hp: 12,
        maxHp: 12,
        speed: 0.9,
        patrolPath: [
          { x: 4, y: 8 },
          { x: 8, y: 8 },
          { x: 8, y: 7 },
          { x: 4, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'basement_pirate_2',
        type: 'pirate',
        x: 10,
        y: 4,
        direction: 'down',
        hp: 12,
        maxHp: 12,
        speed: 1,
        patrolPath: [
          { x: 10, y: 4 },
          { x: 10, y: 8 },
          { x: 12, y: 8 },
          { x: 12, y: 4 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'basement_officer',
        type: 'pirate-officer',
        x: 12,
        y: 3,
        direction: 'left',
        hp: 18,
        maxHp: 18,
        speed: 1.1,
        patrolPath: [
          { x: 12, y: 3 },
          { x: 8, y: 3 },
          { x: 12, y: 3 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      }
    ];
  } else if (level === 2) {
    // LEVEL 2: Pueblo y Fortaleza Shellport (Rescate de Zack)
    return [
      {
        id: 'sentinel_1',
        type: 'marine',
        x: 3,
        y: 5,
        direction: 'right',
        hp: 25,
        maxHp: 25,
        speed: 1,
        patrolPath: [
          { x: 3, y: 5 },
          { x: 5, y: 5 },
          { x: 5, y: 7 },
          { x: 3, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'sentinel_2',
        type: 'marine',
        x: 11,
        y: 5,
        direction: 'left',
        hp: 25,
        maxHp: 25,
        speed: 1.1,
        patrolPath: [
          { x: 11, y: 5 },
          { x: 14, y: 5 },
          { x: 14, y: 7 },
          { x: 11, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'helmuto',
        type: 'helmeppo',
        x: 12,
        y: 2,
        direction: 'up',
        hp: 45,
        maxHp: 45,
        speed: 1.25,
        patrolPath: [
          { x: 12, y: 2 },
          { x: 14, y: 2 },
          { x: 14, y: 1 },
          { x: 12, y: 1 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'boss_iron_axe',
        type: 'morgan',
        x: 8,
        y: 5,
        direction: 'left',
        hp: 110,
        maxHp: 110,
        speed: 1.4,
        patrolPath: [
          { x: 8, y: 5 },
          { x: 9, y: 5 },
          { x: 9, y: 6 },
          { x: 8, y: 6 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
        isBoss: true,
      },
    ];
  } else if (level === 3) {
    // LEVEL 3: Marine Base (Shells Town on Land)
    return [
      {
        id: 'marine_1',
        type: 'marine',
        x: 3,
        y: 5,
        direction: 'right',
        hp: 25,
        maxHp: 25,
        speed: 1,
        patrolPath: [
          { x: 3, y: 5 },
          { x: 5, y: 5 },
          { x: 5, y: 7 },
          { x: 3, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'marine_2',
        type: 'marine',
        x: 11,
        y: 5,
        direction: 'left',
        hp: 25,
        maxHp: 25,
        speed: 1.1,
        patrolPath: [
          { x: 11, y: 5 },
          { x: 14, y: 5 },
          { x: 14, y: 7 },
          { x: 11, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'marine_sergeant',
        type: 'pirate-officer',
        x: 9,
        y: 2,
        direction: 'down',
        hp: 40,
        maxHp: 40,
        speed: 1.2,
        patrolPath: [
          { x: 9, y: 2 },
          { x: 11, y: 2 },
          { x: 9, y: 2 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'marine_helmeppo',
        type: 'helmeppo',
        x: 12,
        y: 2,
        direction: 'up',
        hp: 50,
        maxHp: 50,
        speed: 1.25,
        patrolPath: [
          { x: 12, y: 2 },
          { x: 14, y: 2 },
          { x: 14, y: 1 },
          { x: 12, y: 1 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'boss_morgan',
        type: 'morgan',
        x: 8,
        y: 5,
        direction: 'left',
        hp: 130,
        maxHp: 130,
        speed: 1.4,
        patrolPath: [
          { x: 8, y: 5 },
          { x: 9, y: 5 },
          { x: 9, y: 6 },
          { x: 8, y: 6 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
        isBoss: true,
      },
    ];
  } else if (level === 4) {
    // LEVEL 4: Orange Town (Saga de Buggy)
    return [
      {
        id: 'clown_1',
        type: 'pirate',
        x: 3,
        y: 5,
        direction: 'right',
        hp: 35,
        maxHp: 35,
        speed: 1,
        patrolPath: [
          { x: 3, y: 5 },
          { x: 6, y: 5 },
          { x: 6, y: 7 },
          { x: 3, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'clown_2',
        type: 'pirate',
        x: 11,
        y: 5,
        direction: 'left',
        hp: 35,
        maxHp: 35,
        speed: 1.1,
        patrolPath: [
          { x: 11, y: 5 },
          { x: 14, y: 5 },
          { x: 14, y: 7 },
          { x: 11, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'cabaji_unicycle',
        type: 'pirate-officer',
        x: 9,
        y: 2,
        direction: 'down',
        hp: 60,
        maxHp: 60,
        speed: 1.3,
        patrolPath: [
          { x: 9, y: 2 },
          { x: 11, y: 2 },
          { x: 9, y: 2 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'richie_lion',
        type: 'pirate-officer',
        x: 12,
        y: 2,
        direction: 'up',
        hp: 70,
        maxHp: 70,
        speed: 1.2,
        patrolPath: [
          { x: 12, y: 2 },
          { x: 14, y: 2 },
          { x: 14, y: 1 },
          { x: 12, y: 1 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'boss_buggy',
        type: 'buggy',
        x: 8,
        y: 5,
        direction: 'left',
        hp: 160,
        maxHp: 160,
        speed: 1.5,
        patrolPath: [
          { x: 8, y: 5 },
          { x: 9, y: 5 },
          { x: 9, y: 6 },
          { x: 8, y: 6 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
        isBoss: true,
      }
    ];
  } else {
    // LEVEL 5: Syrup Village (Saga de Captain Kuro)
    return [
      {
        id: 'blackcat_1',
        type: 'pirate',
        x: 3,
        y: 5,
        direction: 'right',
        hp: 45,
        maxHp: 45,
        speed: 1.1,
        patrolPath: [
          { x: 3, y: 5 },
          { x: 6, y: 5 },
          { x: 6, y: 7 },
          { x: 3, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'blackcat_2',
        type: 'pirate',
        x: 11,
        y: 5,
        direction: 'left',
        hp: 45,
        maxHp: 45,
        speed: 1.1,
        patrolPath: [
          { x: 11, y: 5 },
          { x: 14, y: 5 },
          { x: 14, y: 7 },
          { x: 11, y: 7 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'hypnotist_jango',
        type: 'pirate-officer',
        x: 9,
        y: 2,
        direction: 'down',
        hp: 75,
        maxHp: 75,
        speed: 1.3,
        patrolPath: [
          { x: 9, y: 2 },
          { x: 11, y: 2 },
          { x: 9, y: 2 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'siro_bro',
        type: 'pirate-officer',
        x: 12,
        y: 2,
        direction: 'up',
        hp: 80,
        maxHp: 80,
        speed: 1.35,
        patrolPath: [
          { x: 12, y: 2 },
          { x: 14, y: 2 },
          { x: 14, y: 1 },
          { x: 12, y: 1 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
      },
      {
        id: 'boss_kuro',
        type: 'kuro',
        x: 8,
        y: 5,
        direction: 'left',
        hp: 200,
        maxHp: 200,
        speed: 1.6,
        patrolPath: [
          { x: 8, y: 5 },
          { x: 9, y: 5 },
          { x: 9, y: 6 },
          { x: 8, y: 6 },
        ],
        patrolIndex: 0,
        state: 'patrolling',
        actionTimer: 0,
        isBoss: true,
      }
    ];
  }
}

// Conversation arrays for One Piece East Blue Legend story
export const INTRO_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'd1',
      speaker: 'Pirate',
      avatar: ' Pirata dócil',
      text: '¡Oigan, miren este enorme barril que sacamos del mar! ¡Seguro que está lleno de delicioso vino de sake!',
    },
    {
      id: 'd2',
      speaker: 'Koby',
      avatar: ' Koby asustado',
      text: 'O-oh, chicos... l-les sugiero no abrirlo aquí en la bodega. Si Alvida-sama se entera, nos aplastará con su enorme maza de hierro...',
    },
    {
      id: 'd3',
      speaker: 'Luffy',
      avatar: ' Luffy saliendo',
      text: '¡¡GUM-GUM PISTO... POP!! ¡VAYA! ¡Qué gran siesta dormí! ¡Casi me ahogo en ese remolino de agua!',
    },
    {
      id: 'd4',
      speaker: 'Koby',
      avatar: ' Koby horrorizado',
      text: '¡¡¿Q-QUÉ?!! ¡¿Salió un chico con sombrero de paja de adentro del barril?! ¡¿Quién eres tú?!',
    },
    {
      id: 'd5',
      speaker: 'Luffy',
      avatar: ' Luffy Strawhat',
      text: '¡Hola! Soy Monkey D. Luffy, ¡el hombre que se convertirá en el REY de los PIRATAS! ¡Shishishi! ¡Tengo hambre!',
    },
    {
      id: 'd6',
      speaker: 'Luffy',
      avatar: ' Luffy',
      text: '¡Empecemos nuestra fuga! Derrotemos a los guardias en este sótano, busquemos la llave del portón y subamos las escaleras en (13, 2).',
    },
  ],
};

export const ZORO_MEET_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'zm1',
      speaker: 'Koby',
      avatar: ' Koby',
      text: '¡L-Luffy-san! ¡Por favor ten cuidado! Este es el Sótano de Suministros. Arriba está la cubierta donde ronda la capitana Alvida.',
    },
    {
      id: 'zm2',
      speaker: 'Luffy',
      avatar: ' Luffy',
      text: '¿Eh? ¿Quién es Alvida? ¿Me dará carne?',
    },
    {
      id: 'zm3',
      speaker: 'Koby',
      avatar: ' Koby llorando',
      text: '¡¡NO!! ¡Es una tirana implacable! Yo era un simple pescador y me obligó a ser su navegante esclavo. ¡Quiero unirme a la Marina!',
    },
    {
      id: 'zm4',
      speaker: 'Luffy',
      avatar: ' Luffy alegre',
      text: '¡Qué bien! ¡Entonces te ayudaré a escapar! Pero primero busquemos la LLAVE del portón en (13, 8) para subir las escaleras.',
    },
  ],
};

// Dialogue triggered when arriving on Level 2 (Pueblo Shellport)
export const DECK_TRANSITION_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'dt1',
      speaker: 'Koby',
      avatar: ' Koby con esperanza',
      text: '¡Llegamos a Pueblo Shellport! El hábil espadachín Zack está prisionero en el patio de la Fortaleza militar.',
    },
    {
      id: 'dt2',
      speaker: 'Luffy',
      avatar: ' Luffy sonriendo',
      text: '¡Genial! Si es tan fuerte como dicen, ¡le pediré que sea el primer socio de nuestra tripulación! ¡Shishishi!',
    },
    {
      id: 'dt3',
      speaker: 'Koby',
      avatar: ' Koby tenso',
      text: '¡Ten cuidado, Luffy! El tirano Comandante Hacha-Hierro gobierna el pueblo. Sus guardias patrullan la plaza y tienen las 3 katanas de Zack bajo llave.',
    },
    {
      id: 'dt4',
      speaker: 'Luffy',
      avatar: ' Luffy puño',
      text: '¡Buscamos la llave en el cofre en (14, 8), recuperamos sus espadas en (14, 1), liberamos a Zack y vencemos a Hacha-Hierro! ¡A la carga!',
    },
  ],
};

export const BOSS_FIGHT_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'bm1',
      speaker: 'Alvida',
      avatar: ' Alvida furiosa',
      text: '¡¿QUIÉN ES ESTE ENANO DE GOMA QUE SE ATREVIÓ A COLARSE EN MI CUBIERTA?! ¡Koby! ¡Contesta rápido! ¡¿Quién es la mujer más hermosa de los mares?!',
    },
    {
      id: 'bm2',
      speaker: 'Koby',
      avatar: ' Koby temblando',
      text: 'La mujer más hermosa de los mares es... s-su majestad Alvida-sa...',
    },
    {
      id: 'bm3',
      speaker: 'Luffy',
      avatar: ' Luffy asombrado',
      text: '¡¿De qué hablas, Koby?! ¡¿Quién es esta vieja gorda y fea con pecas?! ¡Shishishi!',
    },
    {
      id: 'bm4',
      speaker: 'Alvida',
      avatar: ' Alvida demente',
      text: '¡¡MALDITO BARRIGÓN INSOLENTE!! ¡¡TE REVENTARÉ EL CRÁNEO CON MI MAZO DE HIERRO!! ¡¡MUEREEEEE!!',
    },
  ],
};

export const VICTORY_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'vd1',
      speaker: 'Luffy',
      avatar: ' Luffy bazooka',
      text: '¡A mí el mazo de hierro no me hace nada! ¡¡Porque soy de GOMA!! ¡¡GUM-GUM... PISTOLA!! ¡Vuela lejos!',
    },
    {
      id: 'vd2',
      speaker: 'Alvida',
      avatar: ' Alvida derrotada',
      text: '¡¿C-Cómo es que no se rompe su cuerpo...? NOOOO! *Sale disparada por las nubes* AAAAAHH!',
    },
    {
      id: 'vd3',
      speaker: 'Koby',
      avatar: ' Koby asombrado',
      text: '¡La mandó a volar por los aires de un golpe! Koby se salva y consiguen un bote salvavidas ⛵. ¡Vayamos al bote en (1, 10) para viajar a Shells Town en busca del cazador de piratas Zoro!',
    },
    {
      id: 'vd4',
      speaker: 'Luffy',
      avatar: ' Luffy feliz',
      text: '¡SIII! ¡Zarpemos en nuestro bote! ¡Próxima escala: Shells Town! ¡A liberar a Zoro! ¡Shishishi!',
    },
  ],
};

// ================== LEVEL 3: SHELLS TOWN DIALOGUES ==================
export const ZORO_PRISON_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'zp1',
      speaker: 'Zoro',
      avatar: ' Zoro amarrado ⛓️',
      text: '¿Eh? ¿Quién eres tú y qué haces aquí? Desátame y lárgate antes de que llamen al Capitán Morgan.',
    },
    {
      id: 'zp2',
      speaker: 'Luffy',
      avatar: ' Luffy Strawhat',
      text: '¡Hola! ¡Soy Luffy! Escuché que eres increíblemente fuerte. ¡Quiero que te unas a mi tripulación de piratas! ¡Shishishi!',
    },
    {
      id: 'zp3',
      speaker: 'Zoro',
      avatar: ' Zoro serio ⚔️',
      text: '¡¿Un pirata?! Estás loco. Estoy amarrado outdoor bajo el sol abrasador sin ingerir bocado alguno porque defendí a una niñita llamada Rika del lobo de Helmeppo. Si no me desatas, moriré aquí.',
    },
    {
      id: 'zp4',
      speaker: 'Luffy',
      avatar: ' Luffy alegre',
      text: '¡Te unirá a mí de inmediato! Pero Helmeppo confiscó tus tres Katanas en su oficina militar en (13, 1). ¡Iré por ellas! Primero encontremos la Llave del patio en el cofre (14, 8) de la alcaldía.',
    },
    {
      id: 'zp5',
      speaker: 'Zoro',
      avatar: ' Zoro confiado',
      text: 'Si recuperas mis tres katanas y me desatas de este poste de tortura en el patio... aceptaré unirme a ti. ¡Luffy, apresúrate!',
    }
  ]
};

export const SWORDS_FOUND_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'sf1',
      speaker: 'Luffy',
      avatar: ' Luffy alegre',
      text: '¡SIII! ¡Encontré las tres espadas de Zoro en el cofre secreto de Helmeppo en su oficina militar!',
    },
    {
      id: 'sf2',
      speaker: 'Rika',
      avatar: ' Rika feliz',
      text: '¡Qué gran héroe eres, Luffy-niichan! ¡Por favor desata rápido a Zoro-san en el centro (8, 4) del patio exterior antes de que Morgan aplique su hacha!',
    }
  ]
};

export const MORGAN_CONFRONTATION_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'mc1',
      speaker: 'Morgan',
      avatar: ' Capitán Morgan 🪓',
      text: '¡¿QUIÉN OSA DESAFIAR MI DICTADURA MILITAR ABSOLUTA?! ¡En esta isla de la Marina, cualquiera que me desobedezca sufrirá la pena de muerte! ¡Marinos, fusílenlos!',
    },
    {
      id: 'mc2',
      speaker: 'Helmeppo',
      avatar: ' Helmeppo cobarde',
      text: '¡Sí, mi padre los cortará en dos con su enorme brazo de hacha! ¡Luffy, estás muerto!',
    },
    {
      id: 'mc3',
      speaker: 'Zoro',
      avatar: ' Zoro libre ⚔️',
      text: '¡Tengo mis katanas al fin! Luffy, déjamelo a mí. ¡Es hora de mostrarles el Estilo de las Tres Espadas (Santoryu) del inframundo!',
    },
    {
      id: 'mc4',
      speaker: 'Luffy',
      avatar: ' Luffy puño',
      text: '¡¡SHISHISHI!! ¡Hagámoslo juntos, Zoro! ¡¡GUM-GUM... GATLINA!!',
    }
  ]
};

export const LEVEL3_VICTORY_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'lv1',
      speaker: 'Morgan',
      avatar: ' Morgan derrotado',
      text: '¡¿C-Cómo es posible...? Mi ley impía... mi fortaleza inquebrantable... destruida por unos infames rebeldes...',
    },
    {
      id: 'lv2',
      speaker: 'Zoro',
      avatar: ' Zoro sonriendo ⚔️',
      text: 'Parece que hiciste un pacto con el demonio, Luffy. Desde hoy, seré el espadachín de tu tripulación.',
    },
    {
      id: 'lv3',
      speaker: 'Koby',
      avatar: ' Koby de la Marina',
      text: '¡Muchachos! ¡Yo me quedo aquí en Shells Town para alistarme y ser el mejor oficial de la Marina! ¡Gracias, Luffy-san!',
    },
    {
      id: 'lv4',
      speaker: 'Luffy',
      avatar: ' Luffy feliz',
      text: '¡Genial Koby! ¡Lucha por tu sueño! ¡Zoro, volvamos a nuestro bote en el puerto en (2, 10)! ¡Zarpemos de inmediato hacia Orange Town en busca de provisiones! ¡Shishishi!',
    }
  ]
};

// ================== LEVEL 4: ORANGE TOWN DIALOGUES ==================
export const LEVEL4_INTRO_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'buggy1',
      speaker: 'Luffy',
      avatar: ' Luffy sonriendo',
      text: '¡Llegamos a Orange Town, Zoro! El pueblo está completamente desierto... ¡Qué extraño!',
    },
    {
      id: 'buggy2',
      speaker: 'Zoro',
      avatar: ' Zoro serio ⚔️',
      text: 'Ten cuidado, Luffy. Escuché que este puerto fue asaltado por la tripulación del temido pirata Buggy el Payaso.',
    },
    {
      id: 'buggy3',
      speaker: 'Nami',
      avatar: ' Nami asustada',
      text: '¡¡O-Oigan, ustedes!! ¡Por favor ayúdenme! ¡Esos payasos piratas me están persiguiendo porque les robé la Carta de Navegación del Grand Line!',
    },
    {
      id: 'buggy4',
      speaker: 'Luffy',
      avatar: ' Luffy alegre',
      text: '¡¿Una navegante?! ¡Genial, te defendernos! Busquemos la llave del Circo en el cofre (14, 8) y vayamos a patear el trasero de Buggy.',
    }
  ]
};

export const BUGGY_CONFRONTATION_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'bcon1',
      speaker: 'Buggy',
      avatar: ' Buggy el Payaso 🤡',
      text: '¡¡MWAHAHAHA!! ¡Soy Buggy el Payaso, Capitán de la tripulación más extravagante de los mares! ¡¿Cómo osan perturbar mi función?!',
    },
    {
      id: 'bcon2',
      speaker: 'Luffy',
      avatar: ' Luffy asombrado',
      text: '¡Shishishi! ¡Miren esa enorme, gorda y brillante NARIZ ROJA de payaso que tiene! ¡Qué chistoso!',
    },
    {
      id: 'bcon3',
      speaker: 'Buggy',
      avatar: ' Buggy furioso',
      text: '¡¡MALDITO ENANO DE GOMA!! ¡¿CÓMO TE ATREVES A CONCENTRARTE EN MI NARIZ ROJA?! ¡Vivirás el pánico de mi Fruta Bara Bara! ¡Mi cuerpo se dividirá y te destrozará! ¡Cabaji, Mohji, ataquen!',
    },
    {
      id: 'bcon4',
      speaker: 'Nami',
      avatar: ' Nami táctica',
      text: '¡Es hora de luchar! ¡Luffy, utiliza tu ataque especial para desarmar aBuggy mientras recojo la carta marítima en el cofre (13,1)!',
    }
  ]
};

export const LEVEL4_VICTORY_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'bvic1',
      speaker: 'Buggy',
      avatar: ' Buggy derrotado',
      text: '¡¿N-No puede ser...?! ¡Mis partes corporales están amarradas...! ¡¡AAAHHH!! *Sale disparado como un misil*',
    },
    {
      id: 'bvic2',
      speaker: 'Nami',
      avatar: ' Nami contenta',
      text: '¡Estupendo! ¡Tengo el mapa del Grand Line! Como me salvaron de Buggy, aceptaré ser su navegante aliada... ¡Pero no piensen que soy su amiga! ¡Mi meta es recolectar 100 millones de berries!',
    },
    {
      id: 'bvic3',
      speaker: 'Zoro',
      avatar: ' Zoro sonriendo',
      text: 'Una navegante codiciosa nos vendrá bien. Luffy, regresemos al puerto en (2, 10). ¡Zarpemos hacia Syrup Village!',
    },
    {
      id: 'bvic4',
      speaker: 'Luffy',
      avatar: ' Luffy feliz',
      text: '¡¡SIII!! ¡Rumbo a Syrup Village en el bote salvavidas en (2, 10)! ¡Estamos armando una gran tripulación! ¡Shishishi!',
    }
  ]
};

// ================== LEVEL 5: SYRUP VILLAGE DIALOGUES ==================
export const LEVEL5_INTRO_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'syrup1',
      speaker: 'Usopp',
      avatar: ' Usopp alborotador',
      text: '¡¡QUE VIENEN LOS PIRATAS!! ¡¡PÁNICOOO!! ¡¡UN EJÉRCITO DE 80 MILLONES DE HOMBRES SE ACERCA AL MUELLE!! *Corre de un lado a otro*',
    },
    {
      id: 'syrup2',
      speaker: 'Nami',
      avatar: ' Nami escéptica',
      text: 'Ese chico con nariz larga tiene pinta de mentiroso compulsivo...',
    },
    {
      id: 'syrup3',
      speaker: 'Luffy',
      avatar: ' Luffy divertido',
      text: '¡Shishishi! ¡Qué gracioso es! ¡Oye, soy Luffy y soy un pirata real!',
    },
    {
      id: 'syrup4',
      speaker: 'Usopp',
      avatar: ' Usopp temblando',
      text: '¡¿P-P-Piratas de verdad?! ¡M-Mi tirachinas los mantendrá a raya! Escuchen, el mayordomo Klahadore planea asesinar a Lady Kaya para heredar su fortuna. ¡Es el Capitán Kuro camuflado! Deben ayudarme a protegerla en su Mansión.',
    },
    {
      id: 'syrup5',
      speaker: 'Zoro',
      avatar: ' Zoro serio',
      text: 'Un complot de asesinato... No podemos ignorar eso. La mansión está cerrada. Busquemos la llave de los jardines en (14, 8) y adentrémonos.',
    }
  ]
};

export const KURO_CONFRONTATION_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'kurocon1',
      speaker: 'Kuro',
      avatar: ' Capitán Kuro con garras',
      text: 'Vaya, vaya... Parece que unos entrometidos descubrieron mi identidad secreta. Llevo 3 años planeando este pacífico retiro de la piratería. Nadie vivirá para contarlo.',
    },
    {
      id: 'kurocon2',
      speaker: 'Usopp',
      avatar: ' Usopp heroico',
      text: '¡¡No permitiré que lastimes a Kaya!! ¡Incluso si soy débil, daré la vida por defender Syrup Village!',
    },
    {
      id: 'kurocon3',
      speaker: 'Kuro',
      avatar: ' Kuro sonriendo con maldad',
      text: '¿Un cobarde como tú? Patético. Mi técnica de sigilo "Shakushi" me hace invisible y cortará sus gargantas con mis garras de acero de 10 katanas. ¡Muerrran!',
    },
    {
      id: 'kurocon4',
      speaker: 'Luffy',
      avatar: ' Luffy furioso',
      text: '¡¡NO ME GUSTAN LOS TIPOS QUE TRAICIONAN A SUS AMIGOS!! ¡¡CAPITÁN KURO, TE MANDARÉ A VOLAR DE UN GOLPE!! ¡¡GUM-GUM... CAMPANA!!',
    }
  ]
};

export const LEVEL5_VICTORY_DIALOGUES: DialogueSequence = {
  currentIndex: 0,
  dialogues: [
    {
      id: 'kurovic1',
      speaker: 'Kuro',
      avatar: ' Kuro derrotado',
      text: '¡¿Mi velocidad ultrasónica superada...?! ¡¡M-Maldición...!! *Se desvanece noqueado*',
    },
    {
      id: 'kurovic2',
      speaker: 'Usopp',
      avatar: ' Usopp llorando de alegría',
      text: '¡¡Luffy, lo lograste! ¡Kaya está a salvo! He decidido zarpar al mar para convertirme en un glorioso guerrero de los mares...',
    },
    {
      id: 'kurovic3',
      speaker: 'Luffy',
      avatar: ' Luffy alegre',
      text: '¿De qué hablas Usopp? ¡Sube a bordo! ¡Ya eres nuestro francotirador oficial! ¡Shishishi!',
    },
    {
      id: 'kurovic4',
      speaker: 'Nami',
      avatar: ' Nami entusiasmada',
      text: '¡Y miren lo que nos dio Kaya como agradecimiento! ¡Es una carabela real, el majestuoso barco **GOING MERRY**! ¡Está anclado en nuestro puerto en (2, 10)!',
    },
    {
      id: 'kurovic5',
      speaker: 'Luffy',
      avatar: ' Luffy tocando el sombrero',
      text: '¡¡EXCELENTE!! ¡Tenemos un barco de verdad, el Going Merry, con una navegante talentosa Nami, el espadachín Zoro, el tirador Usopp, y yo, Luffy, seré el Rey de los Piratas! ¡¡VAMOS HACIA EL GRAND LINE!! ¡¡A ZARPAR EN EL MUELLE EN (2, 10)!!',
    }
  ]
};

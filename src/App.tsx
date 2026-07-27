import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  buildInitialGrid, 
  getInitialEnemies, 
  INTRO_DIALOGUES, 
  ZORO_MEET_DIALOGUES, 
  DECK_TRANSITION_DIALOGUES,
  BOSS_FIGHT_DIALOGUES, 
  VICTORY_DIALOGUES,
  ZORO_PRISON_DIALOGUES,
  SWORDS_FOUND_DIALOGUES,
  MORGAN_CONFRONTATION_DIALOGUES,
  LEVEL3_VICTORY_DIALOGUES,
  LEVEL4_INTRO_DIALOGUES,
  BUGGY_CONFRONTATION_DIALOGUES,
  LEVEL4_VICTORY_DIALOGUES,
  LEVEL5_INTRO_DIALOGUES,
  KURO_CONFRONTATION_DIALOGUES,
  LEVEL5_VICTORY_DIALOGUES,
  MAP_WIDTH,
  MAP_HEIGHT
} from './data/maps';
import { Cell, Direction, Enemy, GameStatus, PlayerState, Position } from './types';
import { GameGrid } from './components/GameGrid';
import { GameHUD } from './components/GameHUD';
import { DialogueBox } from './components/DialogueBox';
import { ControlsOverlay } from './components/ControlsOverlay';
import { playSound, playAmbientMusic, stopAmbientMusic, getAmbientZoneForLevel } from './utils/sound';
import { getPasherTheme } from './utils/pasher';
import { PhaserGameContainer } from './game/PhaserGameContainer';
import { Volume2, Trophy, RefreshCw, Flame, Navigation, Key, HelpCircle, Swords, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Game running state
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('romance_dawn_max_unlocked_level');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 5) return parsed;
      }
    } catch (e) {
      // Ignore
    }
    return 1;
  });

  const unlockToLevel = useCallback((lvl: number) => {
    setMaxUnlockedLevel((prev) => {
      const next = Math.max(prev, lvl);
      try {
        localStorage.setItem('romance_dawn_max_unlocked_level', next.toString());
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);
  const [showVirtualControls, setShowVirtualControls] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  // Ambient music: starts/changes when level changes, user must interact first
  useEffect(() => {
    const zone = getAmbientZoneForLevel(currentLevel);
    // Music only starts after first user interaction (browser policy)
    const startMusic = () => {
      playAmbientMusic(zone);
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
    };
    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);
    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
    };
  }, [currentLevel]);

  const [status, setStatus] = useState<GameStatus>('playing');
  const [engineMode, setEngineMode] = useState<'phaser' | 'grid'>('grid');
  const [subMap, setSubMap] = useState<string>('main');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [player, setPlayer] = useState<PlayerState>({
    x: 1,
    y: 5, // Starts inside the barrel at (1, 5)
    direction: 'right',
    hp: 12,
    maxHp: 12,
    haki: 12,
    maxHaki: 20,
    meatCount: 1,
    hasKey: false,
    hasMap: false,
    hasSwords: false,
    actionState: 'idle',
    actionTimer: 0
  });

  // Story dialogue configurations
  const [dialogueSeq, setDialogueSeq] = useState<{
    dialogues: typeof INTRO_DIALOGUES.dialogues;
    currentIndex: number;
    triggerType: string | null;
  }>({
    dialogues: INTRO_DIALOGUES.dialogues,
    currentIndex: 0,
    triggerType: null
  });

  // Triggers tracker to make sure story cutscenes only play once!
  const triggersHit = useRef({
    kobyMeet: false,
    bossFight: false,
    victoryDone: false,
    zoroMeet: false,
    morganConfront: false,
    buggyConfront: false,
    kuroConfront: false
  });

  // Track step timestamp to prevent rapid continuous sliding on keys keep-down
  const lastMoveTimeRef = useRef<number>(0);

  // Floating notifications queue (Zelda style "+1 Meat", "-10 HP")
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; x: number; y: number; text: string; color: string }[]>([]);

  // Function to spawn dynamic feedback labels
  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string = 'text-yellow-400') => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingTexts((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1500);
  }, []);

  // Initialize/Reset Level State — keeps playing status so grid never unmounts
  const handleResetLevel = useCallback(() => {
    stopAmbientMusic();
    setCurrentLevel(1);
    setGrid(buildInitialGrid(1));
    setEnemies(getInitialEnemies(1));
    setPlayer({
      x: 1,
      y: 5,
      direction: 'right',
      hp: 12,
      maxHp: 12,
      haki: 10,
      maxHaki: 20,
      meatCount: 1,
      hasKey: false,
      hasMap: false,
      hasSwords: false,
      actionState: 'idle',
      actionTimer: 0
    });
    triggersHit.current = {
      kobyMeet: false,
      bossFight: false,
      victoryDone: false,
      zoroMeet: false,
      morganConfront: false,
      buggyConfront: false,
      kuroConfront: false
    };
    setFloatingTexts([]);
    setDialogueSeq({
      dialogues: INTRO_DIALOGUES.dialogues,
      currentIndex: 0,
      triggerType: 'intro'
    });
    // CRITICAL: keep status = 'playing' so GameGrid never unmounts
    setStatus('playing');
    playSound('unlock');
  }, []);

  // Set specific chapter/level directly for debugging and custom play
  const changeToLevel = useCallback((lvl: number) => {
    setCurrentLevel(lvl);
    setGrid(buildInitialGrid(lvl));
    setEnemies(getInitialEnemies(lvl));
    setFloatingTexts([]);

    if (lvl === 1) {
      setPlayer({
        x: 1,
        y: 5,
        direction: 'right',
        hp: 12,
        maxHp: 12,
        haki: 10,
        maxHaki: 20,
        meatCount: 1,
        hasKey: false,
        hasMap: false,
        hasSwords: false,
        actionState: 'idle',
        actionTimer: 0
      });
      triggersHit.current = {
        kobyMeet: false,
        bossFight: false,
        victoryDone: false,
        zoroMeet: false,
        morganConfront: false,
        buggyConfront: false,
        kuroConfront: false
      };
      setDialogueSeq({
        dialogues: INTRO_DIALOGUES.dialogues,
        currentIndex: 0,
        triggerType: 'intro'
      });
    } else if (lvl === 2) {
      setPlayer({
        x: 2,
        y: 5,
        direction: 'right',
        hp: 12,
        maxHp: 12,
        haki: 12,
        maxHaki: 20,
        meatCount: 2,
        hasKey: false,
        hasMap: false,
        hasSwords: false,
        actionState: 'idle',
        actionTimer: 0
      });
      triggersHit.current = {
        kobyMeet: true,
        bossFight: false,
        victoryDone: false,
        zoroMeet: false,
        morganConfront: false,
        buggyConfront: false,
        kuroConfront: false
      };
      setDialogueSeq({
        dialogues: DECK_TRANSITION_DIALOGUES.dialogues,
        currentIndex: 0,
        triggerType: 'zoro-meet'
      });
    } else if (lvl === 3) {
      setPlayer({
        x: 1,
        y: 5,
        direction: 'right',
        hp: 12,
        maxHp: 12,
        haki: 15,
        maxHaki: 20,
        meatCount: 2,
        hasKey: false,
        hasMap: false,
        hasSwords: false,
        actionState: 'idle',
        actionTimer: 0
      });
      triggersHit.current = {
        kobyMeet: true,
        bossFight: true,
        victoryDone: false,
        zoroMeet: false,
        morganConfront: false,
        buggyConfront: false,
        kuroConfront: false
      };
      setDialogueSeq({
        dialogues: ZORO_PRISON_DIALOGUES.dialogues,
        currentIndex: 0,
        triggerType: 'zoro-prison'
      });
    } else if (lvl === 4) {
      setPlayer({
        x: 1,
        y: 5,
        direction: 'right',
        hp: 14,
        maxHp: 14,
        haki: 18,
        maxHaki: 25,
        meatCount: 2,
        hasKey: false,
        hasMap: false,
        hasSwords: false,
        actionState: 'idle',
        actionTimer: 0
      });
      triggersHit.current = {
        kobyMeet: true,
        bossFight: true,
        victoryDone: true,
        zoroMeet: true,
        morganConfront: true,
        buggyConfront: false,
        kuroConfront: false
      };
      setDialogueSeq({
        dialogues: LEVEL4_INTRO_DIALOGUES.dialogues,
        currentIndex: 0,
        triggerType: 'level4-intro'
      });
    } else {
      setPlayer({
        x: 1,
        y: 5,
        direction: 'right',
        hp: 16,
        maxHp: 16,
        haki: 22,
        maxHaki: 30,
        meatCount: 3,
        hasKey: false,
        hasMap: false,
        hasSwords: false,
        actionState: 'idle',
        actionTimer: 0
      });
      triggersHit.current = {
        kobyMeet: true,
        bossFight: true,
        victoryDone: true,
        zoroMeet: true,
        morganConfront: true,
        buggyConfront: true,
        kuroConfront: false
      };
      setDialogueSeq({
        dialogues: LEVEL5_INTRO_DIALOGUES.dialogues,
        currentIndex: 0,
        triggerType: 'level5-intro'
      });
    }
    
    setStatus('playing');
    setDialogueSeq({
      dialogues: [],
      currentIndex: 0,
      triggerType: null
    });
    playSound('unlock');
  }, []);

  // Trigger grid creation immediately on mount
  useEffect(() => {
    setGrid(buildInitialGrid(1));
    setEnemies(getInitialEnemies(1));
  }, []);

  // Haki automatic slow recharge logic or cooldown countdowns
  useEffect(() => {
    if (status !== 'playing') return;

    const timer = setInterval(() => {
      // Recharge player stamina
      setPlayer((prev) => {
        const nextHaki = Math.min(prev.maxHaki, prev.haki + 1);
        let nextActionState = prev.actionState;
        let nextActionTimer = prev.actionTimer;

        if (prev.actionTimer > 0) {
          nextActionTimer -= 1;
          if (nextActionTimer === 0) {
            nextActionState = 'idle';
          }
        }

        return {
          ...prev,
          haki: nextHaki,
          actionState: nextActionState,
          actionTimer: nextActionTimer
        };
      });
    }, 450); // Recharge rate

    return () => clearInterval(timer);
  }, [status]);

  // Main game loop trigger for enemy patrols and chasing AI
  useEffect(() => {
    if (status !== 'playing' || dialogueSeq.triggerType !== null) return;

    const enemyIntelInterval = setInterval(() => {
      setEnemies((prevEnemies) => {
        return prevEnemies.map((enemy) => {
          if (enemy.hp <= 0) return enemy;

          // If the enemy is stunned, they skip their main AI movement turn to recover
          if (enemy.state === 'stunned') {
            return {
              ...enemy,
              state: 'patrolling'
            };
          }

          // Compute distance to player
          const distToPlayer = Math.abs(player.x - enemy.x) + Math.abs(player.y - enemy.y);

          let nextX = enemy.x;
          let nextY = enemy.y;
          let nextState = enemy.state;
          let nextDir = enemy.direction;

          // Unified helper to check if a specific cell contains an obstacle, NPC, or another enemy
          const isCellBlocked = (tx: number, ty: number) => {
            if (!grid[ty] || !grid[ty][tx]) return true;
            
            const cell = grid[ty][tx];
            const isObstacle = 
              cell.type === 'wall' || 
              cell.type === 'water' || 
              cell.type === 'mast' || 
              cell.type === 'door-locked' ||
              cell.type === 'barrel' ||
              cell.type === 'barrel-luffy' ||
              cell.type === 'koby-scared' ||
              cell.type === 'zoro-chained';
            
            if (isObstacle) return true;

            // Prevent stepping on top of another live enemy
            const hasOtherEnemy = prevEnemies.some(
              (oe) => oe.id !== enemy.id && oe.hp > 0 && oe.x === tx && oe.y === ty
            );
            if (hasOtherEnemy) return true;

            // Prevent overlap with player cell
            if (tx === player.x && ty === player.y) return true;

            return false;
          };

          // Check if Luffy is still hiding / sleeping inside the starting barrel
          const isLuffyInsideBarrel = grid[player.y] && grid[player.y][player.x] && grid[player.y][player.x].type === 'barrel-luffy';

          if (!isLuffyInsideBarrel) {
            // Once Luffy breaks containment, all live enemies enter High-Alert Chasing Mode!
            nextState = 'chasing';

            // Check potential movement directions
            const directions = [
              { dir: 'up' as const, dx: 0, dy: -1 },
              { dir: 'down' as const, dx: 0, dy: 1 },
              { dir: 'left' as const, dx: -1, dy: 0 },
              { dir: 'right' as const, dx: 1, dy: 0 }
            ];

            // Filter unblocked moves and calculate potential proximities to player
            const validMoves = directions
              .map(m => {
                const tx = enemy.x + m.dx;
                const ty = enemy.y + m.dy;
                const dist = Math.abs(player.x - tx) + Math.abs(player.y - ty);
                return { ...m, tx, ty, dist, blocked: isCellBlocked(tx, ty) };
              })
              .filter(m => !m.blocked);

            if (validMoves.length > 0) {
              // Best moves bring us closer to Luffy
              validMoves.sort((a, b) => a.dist - b.dist);

              // Step forward if from a distance (if already 1 step away, stay adjacent to execute attack)
              if (distToPlayer > 1) {
                const bestMove = validMoves[0];
                nextX = bestMove.tx;
                nextY = bestMove.ty;
                nextDir = bestMove.dir;
              }
            }
          } else {
            // Default peaceful patrol mode before Luffy wakes up
            nextState = 'patrolling';
            if (enemy.patrolPath && enemy.patrolPath.length > 0) {
              const currentTgt = enemy.patrolPath[enemy.patrolIndex];
              if (enemy.x === currentTgt.x && enemy.y === currentTgt.y) {
                const nextPatrolIdx = (enemy.patrolIndex + 1) % enemy.patrolPath.length;
                const nextTgtIdx = enemy.patrolPath[nextPatrolIdx];
                
                if (nextTgtIdx.x > enemy.x) nextDir = 'right';
                else if (nextTgtIdx.x < enemy.x) nextDir = 'left';
                else if (nextTgtIdx.y > enemy.y) nextDir = 'down';
                else if (nextTgtIdx.y < enemy.y) nextDir = 'up';

                return {
                  ...enemy,
                  patrolIndex: nextPatrolIdx,
                  direction: nextDir,
                  state: 'patrolling'
                };
              } else {
                const stepX = Math.sign(currentTgt.x - enemy.x);
                const stepY = Math.sign(currentTgt.y - enemy.y);
                const idealX = enemy.x + stepX;
                const idealY = enemy.y + stepY;

                if (!isCellBlocked(idealX, idealY)) {
                  nextX = idealX;
                  nextY = idealY;
                  if (stepX > 0) nextDir = 'right';
                  else if (stepX < 0) nextDir = 'left';
                  else if (stepY > 0) nextDir = 'down';
                  else if (stepY < 0) nextDir = 'up';
                }
              }
            }
          }

          // Damage Contact Event! Triggers if enemy is adjacent (1 cell away) to Luffy:
          const isAdjacentToPlayer = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y) === 1;
          if (isAdjacentToPlayer && player.actionState !== 'rolling' && player.actionState !== 'hit') {
            // Player takes damage!
            const damage = enemy.type === 'alvida' ? 3 : enemy.type === 'morgan' ? 4 : enemy.type === 'pirate-officer' ? 2 : 1;
            
            // Decrement player hp
            setPlayer((prev) => {
              const newHp = Math.max(0, prev.hp - damage);
              if (newHp <= 0) {
                setTimeout(() => {
                  setStatus('gameover');
                  playSound('gameover');
                }, 300);
              }
              return {
                ...prev,
                hp: newHp,
                actionState: 'hit',
                actionTimer: 2 // Flashing animation frames
              };
            });

            playSound('hit');
            spawnFloatingText(player.x, player.y, `-${damage} CORAZÓN ❤️`, 'text-rose-500 font-bold animate-bounce');
          }

          return {
            ...enemy,
            x: nextX,
            y: nextY,
            direction: nextDir,
            state: nextState
          };
        });
      });
    }, 700); // Enemy thinking speed

    return () => clearInterval(enemyIntelInterval);
  }, [status, player.x, player.y, player.actionState, grid, dialogueSeq.triggerType, spawnFloatingText]);

  // Trigger epic cinematic starting barrel explosion event 
  const triggerBarrelBurst = useCallback(() => {
    playSound('hit');
    setPlayer(prev => ({ ...prev, actionState: 'bursting-out' }));
    
    // Spawn wooden chip flying texts/particles!
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnFloatingText(1, 5, '🪵', i % 2 === 0 ? 'animate-bounce text-sm' : 'animate-ping text-xs');
      }, i * 150);
    }
    
    setTimeout(() => {
      setGrid((prevGrid) => {
        const copied = prevGrid.map(row => row.map(cell => {
          if (cell.x === 1 && cell.y === 5 && cell.type === 'barrel-luffy') {
            return { ...cell, type: 'barrel-broken' };
          }
          return cell;
        }));
        return copied;
      });
      
      playSound('victory');
      spawnFloatingText(1, 5, '🗣️ Luffy: "¡Qué buen sueño dormí!" 😴✨', 'text-amber-500 font-extrabold animate-bounce text-base');
      setPlayer(prev => ({ ...prev, actionState: 'idle' }));
    }, 1200);
  }, [setGrid, setPlayer, playSound, spawnFloatingText]);

  // Execute Luffy's standard movement step
  const movePlayer = useCallback((dir: Direction) => {
    if (status !== 'playing' || player.actionState === 'hit' || dialogueSeq.triggerType !== null) return;

    // Snappy classic walkthrough: throttle steps to exactly one grid cell per 150ms
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 150) {
      return;
    }
    lastMoveTimeRef.current = now;

    // Intercept if sleeping inside starting barrel
    const isInsideBarrel = grid[player.y] && grid[player.y][player.x] && grid[player.y][player.x].type === 'barrel-luffy';
    if (isInsideBarrel) {
      triggerBarrelBurst();
      return;
    }

    setPlayer((prev) => {
      let targetX = prev.x;
      let targetY = prev.y;

      switch (dir) {
        case 'up': targetY = Math.max(0, prev.y - 1); break;
        case 'down': targetY = Math.min(MAP_HEIGHT - 1, prev.y + 1); break;
        case 'left': targetX = Math.max(0, prev.x - 1); break;
        case 'right': targetX = Math.min(MAP_WIDTH - 1, prev.x + 1); break;
      }

      // Check collision
      let canMove = true;

      // Prevent moving onto live enemies (avoids ghost overlapping)
      const enemyAtTarget = enemies.some(e => e.hp > 0 && e.x === targetX && e.y === targetY);
      if (enemyAtTarget) {
        canMove = false;
        playSound('hit');
        // Retrieve the name of the enemy to show custom text
        const targetEnemy = enemies.find(e => e.hp > 0 && e.x === targetX && e.y === targetY);
        const nameLabel = targetEnemy?.type === 'alvida' ? 'Alvida' : targetEnemy?.type === 'morgan' ? 'Morgan' : 'Cuerpo';
        spawnFloatingText(targetX, targetY, `💥 ¡Enemigo ${nameLabel}!`, 'text-rose-450 font-extrabold');
      }

      if (grid[targetY] && grid[targetY][targetX]) {
        const cell = grid[targetY][targetX];

        // Hit list obstacles
        if (cell.type === 'wall' || cell.type === 'wall-stone' || cell.type === 'water' || cell.type === 'mast' || cell.type === 'koby-scared' || cell.type === 'zoro-chained') {
          canMove = false;
          playSound('hit');
        } else if (cell.type === 'switch-off') {
          canMove = true;
          playSound('unlock');
          spawnFloatingText(targetX, targetY, '🔘 ¡INTERRUPTOR ACTIVADO!', 'text-yellow-300 font-extrabold animate-bounce');
          setGrid((prevGrid) => {
            const copied = prevGrid.map(row => [...row]);
            copied[targetY][targetX] = { ...copied[targetY][targetX], type: 'switch-on' };
            // Unlock locked doors in dungeon
            for (let r = 0; r < copied.length; r++) {
              for (let c = 0; c < copied[r].length; c++) {
                if (copied[r][c].type === 'door-locked') {
                  copied[r][c] = { ...copied[r][c], type: 'door-open' };
                }
              }
            }
            return copied;
          });
        } else if (cell.type === 'pot') {
          canMove = true;
          playSound('pickup');
          spawnFloatingText(targetX, targetY, '🏺 ¡VASIJA ROTA! 🍖', 'text-amber-400 font-bold');
          setGrid((prevGrid) => {
            const copied = prevGrid.map(row => [...row]);
            copied[targetY][targetX] = {
              ...copied[targetY][targetX],
              type: 'pot-broken',
              item: Math.random() < 0.5 ? 'meat' : 'heart'
            };
            return copied;
          });
        } else if (cell.type === 'door-locked') {
          if (prev.hasKey) {
            // Unlock standard gates
            canMove = true;
            playSound('unlock');
            setGrid((prevGrid) => {
              const copied = [...prevGrid];
              copied[targetY][targetX] = { 
                ...copied[targetY][targetX], 
                type: 'door-open' 
              };
              return copied;
            });
            spawnFloatingText(targetX, targetY, '🔒 ¡ABIERTO!', 'text-emerald-400 font-bold');
          } else {
            canMove = false;
            playSound('hit');
            if (currentLevel === 1) {
              spawnFloatingText(targetX, targetY, '¡PORTÓN CERRADO! 🔑', 'text-yellow-400');
            } else {
              spawnFloatingText(targetX, targetY, '¡CAMAROTE CERRADO! 🔑', 'text-yellow-400');
            }
          }
        } else if (cell.type === 'barrel' || cell.type === 'barrel-luffy') {
          canMove = false; // Luffy must punch barrels to smash and advance
        } else if (cell.type === 'chest') {
          canMove = false; // Luffy must interact with chests
        }
      }

      // Handle entering/exiting house door (Minish Cap 1st Floor / Town transition)
      if (canMove && grid[targetY] && grid[targetY][targetX] && grid[targetY][targetX].type === 'house-door') {
        if (currentLevel === 2) {
          if (subMap === 'main') {
            setSubMap('house_1f');
            setGrid(buildInitialGrid(2, 'house_1f'));
            setPlayer(pos => ({ ...pos, x: 7, y: 5 }));
            playSound('unlock');
            spawnFloatingText(7, 5, '🏠 ¡ENTRASTE A LA CASA!', 'text-amber-400 font-extrabold animate-bounce');
          } else {
            setSubMap('main');
            setGrid(buildInitialGrid(2, 'main'));
            setPlayer(pos => ({ ...pos, x: 1, y: 3 }));
            playSound('unlock');
            spawnFloatingText(1, 3, '🚪 ¡SALISTE AL PUEBLO!', 'text-yellow-400 font-extrabold animate-bounce');
          }
          return prev;
        }
      }

      // Handle stairs level transition trigger
      if (canMove && grid[targetY] && grid[targetY][targetX] && grid[targetY][targetX].type === 'stairs') {
        if (currentLevel === 1) {
          // Transition to Level 2 (Deck)
          unlockToLevel(2);
          setTimeout(() => {
            setCurrentLevel(2);
            setGrid(buildInitialGrid(2));
            setEnemies(getInitialEnemies(2));
            setPlayer((posPrev) => ({
              ...posPrev,
              x: 2,
              y: 5,
              hasKey: false, // Reset Key so they search for the Cabin Key on Level 2
            }));
            playSound('unlock');
            setDialogueSeq({
              dialogues: DECK_TRANSITION_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'zoro-meet'
            });
            spawnFloatingText(2, 5, '🪜 ¡SUBISTE A LA CUBIERTA!', 'text-yellow-404 font-extrabold animate-bounce');
          }, 100);
          return prev;
        } else if (currentLevel === 2) {
          if (subMap === 'house_1f') {
            setSubMap('house_2f');
            setGrid(buildInitialGrid(2, 'house_2f'));
            setPlayer(pos => ({ ...pos, x: 12, y: 1 }));
            playSound('unlock');
            spawnFloatingText(12, 1, '🪜 ¡SUBISTE AL 2DO PISO!', 'text-amber-400 font-extrabold animate-bounce');
          } else if (subMap === 'house_2f') {
            setSubMap('house_1f');
            setGrid(buildInitialGrid(2, 'house_1f'));
            setPlayer(pos => ({ ...pos, x: 12, y: 1 }));
            playSound('unlock');
            spawnFloatingText(12, 1, '🪜 ¡BAJASTE AL 1ER PISO!', 'text-amber-400 font-extrabold animate-bounce');
          }
          return prev;
        } else if (currentLevel === 3) {
          // Stepping on harbor wharf (2,10) to escape Shells Town
          const isMorganDefeated = !enemies.some(e => e.type === 'morgan' && e.hp > 0);
          if (isMorganDefeated && prev.hasSwords) {
            canMove = false;
            playSound('victory');
            setDialogueSeq({
              dialogues: LEVEL3_VICTORY_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'level3-victory'
            });
            return prev;
          } else {
            canMove = false;
            playSound('hit');
            if (!isMorganDefeated) {
              spawnFloatingText(2, 10, '⛵ ¡Derrota al Capitán Morgan primero! 🪓', 'text-rose-450 font-bold');
            } else {
              spawnFloatingText(2, 10, '⛵ ¡Zoro necesita sus espadas para huir! ⚔️', 'text-yellow-405 font-bold');
            }
            return prev;
          }
        } else if (currentLevel === 4) {
          // Stepping on harbor wharf (2,10) to escape Orange Town
          const isBuggyDefeated = !enemies.some(e => e.type === 'buggy' && e.hp > 0);
          if (isBuggyDefeated && prev.hasMap) {
            canMove = false;
            playSound('victory');
            setDialogueSeq({
              dialogues: LEVEL4_VICTORY_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'level4-victory'
            });
            return prev;
          } else {
            canMove = false;
            playSound('hit');
            if (!isBuggyDefeated) {
              spawnFloatingText(2, 10, '⛵ ¡Derrota al Capitán Buggy primero! 🤡', 'text-rose-450 font-bold');
            } else {
              spawnFloatingText(2, 10, '⛵ ¡Busca el mapa en el cofre secreto! 🗺️', 'text-yellow-405 font-bold');
            }
            return prev;
          }
        } else if (currentLevel === 5) {
          // Stepping on harbor wharf (2,10) to escape Syrup Village
          const isKuroDefeated = !enemies.some(e => e.type === 'kuro' && e.hp > 0);
          if (isKuroDefeated && prev.hasSwords) {
            canMove = false;
            playSound('victory');
            setDialogueSeq({
              dialogues: LEVEL5_VICTORY_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'level5-victory'
            });
            return prev;
          } else {
            canMove = false;
            playSound('hit');
            if (!isKuroDefeated) {
              spawnFloatingText(2, 10, '⛵ ¡Derrota al Capitán Kuro primero! 🐈', 'text-rose-450 font-bold');
            } else {
              spawnFloatingText(2, 10, '⛵ ¡Consigue los planos del cofre! 📜', 'text-yellow-405 font-bold');
            }
            return prev;
          }
        }
      }

      // Handle escape lifeboat trigger (Level 2)
      if (currentLevel === 2 && targetX === 1 && targetY === 10) {
        const isAlvidaDefeated = !enemies.some(e => e.isBoss && e.hp > 0);
        if (prev.hasMap && isAlvidaDefeated) {
          canMove = false;
          playSound('victory');
          setDialogueSeq({
            dialogues: VICTORY_DIALOGUES.dialogues,
            currentIndex: 0,
            triggerType: 'victory'
          });
          return prev;
        } else if (!isAlvidaDefeated) {
          canMove = false;
          playSound('hit');
          spawnFloatingText(1, 10, '⛵ ¡Derrota a Alvida primero! 🏴‍☠️', 'text-rose-455 font-bold');
        } else {
          canMove = false;
          playSound('hit');
          spawnFloatingText(1, 10, '⛵ ¡Necesitas el Mapa del Grand Line! 🗺️', 'text-yellow-405 font-bold');
        }
      }

      const finalX = canMove ? targetX : prev.x;
      const finalY = canMove ? targetY : prev.y;

      // Break starting barrel if player moves out of it
      if (canMove && grid[prev.y] && grid[prev.y][prev.x].type === 'barrel-luffy') {
        playSound('hit');
        setGrid((prevGrid) => {
          const copied = [...prevGrid];
          copied[prev.y][prev.x] = {
            ...copied[prev.y][prev.x],
            type: 'barrel-broken'
          };
          return copied;
        });
        spawnFloatingText(prev.x, prev.y, '💥 ¡BUM! ¡Luffy sale del Barril!', 'text-amber-500 font-bold');
      }

      // Triggers corresponding cutscene coordinates check
      // 1. Zoom meet Koby near x:7, y:4
      if (currentLevel === 1 && finalX >= 6 && finalX <= 9 && finalY >= 3 && finalY <= 5 && !triggersHit.current.kobyMeet) {
        triggersHit.current.kobyMeet = true;
        // Trigger Koby dialogue sequence!
        setTimeout(() => {
          setDialogueSeq({
            dialogues: ZORO_MEET_DIALOGUES.dialogues,
            currentIndex: 0,
            triggerType: 'zoro-meet'
          });
        }, 100);
      }

      // 2. Boss suite confrontation
      if (currentLevel === 2 && finalX >= 10 && finalY <= 3 && !triggersHit.current.bossFight) {
        triggersHit.current.bossFight = true;
        setTimeout(() => {
          setDialogueSeq({
            dialogues: BOSS_FIGHT_DIALOGUES.dialogues,
            currentIndex: 0,
            triggerType: 'boss-fight'
          });
        }, 150);
      }

      // 3. Meet Zoro/Free Zoro near (8,4) on Level 3
      if (currentLevel === 3 && Math.abs(finalX - 8) + Math.abs(finalY - 4) === 1) {
        if (!prev.hasSwords) {
          spawnFloatingText(8, 4, "🗣️ Zoro: ¡Luffy! Trae mis espadas del cofre de la alcaldía en (13, 1).", "text-green-400 font-black");
        } else if (!triggersHit.current.zoroMeet) {
          triggersHit.current.zoroMeet = true;
          playSound('unlock');
          // Update Zoro's status in grid
          setGrid((prevGrid) => {
            const copied = [...prevGrid];
            if (copied[4] && copied[4][8]) {
              copied[4][8] = { ...copied[4][8], type: 'zoro-free' };
            }
            // Unlock all doors on level 3
            for (let r = 0; r < copied.length; r++) {
              for (let c = 0; c < copied[r].length; c++) {
                if (copied[r][c].type === 'door-locked') {
                  copied[r][c] = { ...copied[r][c], type: 'door-open' };
                }
              }
            }
            return copied;
          });
          spawnFloatingText(8, 4, "⚔️ ¡Zoro Liberado!", "text-green-400 font-black animate-bounce");
          setTimeout(() => {
            setDialogueSeq({
              dialogues: MORGAN_CONFRONTATION_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'morgan-confront'
            });
          }, 200);
        }
      }

      // 3b. Confront Buggy on Level 4
      if (currentLevel === 4 && Math.abs(finalX - 8) + Math.abs(finalY - 5) <= 1 && !triggersHit.current.buggyConfront) {
        triggersHit.current.buggyConfront = true;
        playSound('unlock');
        spawnFloatingText(8, 5, "🤡 ¡Buggy el Payaso se enfurece!", "text-red-400 font-extrabold animate-bounce");
        setEnemies((prevEnemies) =>
          prevEnemies.map((e) =>
            e.type === 'buggy' ? { ...e, state: 'chasing' } : e
          )
        );
        setTimeout(() => {
          setDialogueSeq({
            dialogues: BUGGY_CONFRONTATION_DIALOGUES.dialogues,
            currentIndex: 0,
            triggerType: 'buggy-confront'
          });
        }, 200);
      }

      // 3c. Confront Kuro on Level 5
      if (currentLevel === 5 && Math.abs(finalX - 8) + Math.abs(finalY - 5) <= 1 && !triggersHit.current.kuroConfront) {
        triggersHit.current.kuroConfront = true;
        playSound('unlock');
        spawnFloatingText(8, 5, "🐈 ¡Kuro desenvaina sus garras!", "text-slate-200 font-extrabold animate-bounce");
        setEnemies((prevEnemies) =>
          prevEnemies.map((e) =>
            e.type === 'kuro' ? { ...e, state: 'chasing' } : e
          )
        );
        setTimeout(() => {
          setDialogueSeq({
            dialogues: KURO_CONFRONTATION_DIALOGUES.dialogues,
            currentIndex: 0,
            triggerType: 'kuro-confront'
          });
        }, 200);
      }

      // 4. Collect drops logic
      if (canMove && grid[finalY] && grid[finalY][finalX].item) {
        const activeItem = grid[finalY][finalX].item;
         
        let inventoryUpdates = {};
        if (activeItem === 'meat') {
          playSound('pickup');
          spawnFloatingText(finalX, finalY, '🍖 Carne +1', 'text-rose-400 font-bold');
          inventoryUpdates = { meatCount: prev.meatCount + 1 };
        } else if (activeItem === 'key') {
          playSound('pickup');
          if (currentLevel === 1) {
            spawnFloatingText(finalX, finalY, '🔑 Portón Sótano!', 'text-amber-400 font-bold');
          } else {
            spawnFloatingText(finalX, finalY, '🔑 Llave Base Marina!', 'text-amber-400 font-bold');
          }
          inventoryUpdates = { hasKey: true };
        } else if (activeItem === 'map') {
          playSound('pickup');
          spawnFloatingText(finalX, finalY, '🗺️ ¡Mapa de Grand Line!', 'text-emerald-400 font-extrabold animate-pulse');
          inventoryUpdates = { hasMap: true };
        } else if (activeItem === 'swords') {
          playSound('pickup');
          spawnFloatingText(finalX, finalY, '⚔️ ¡Espadas de Zoro!', 'text-green-450 font-extrabold animate-pulse');
          inventoryUpdates = { hasSwords: true };
        } else if (activeItem === 'heart') {
          playSound('pickup');
          spawnFloatingText(finalX, finalY, '❤️ ¡Fuerza +4 HP!', 'text-red-400 font-bold');
          inventoryUpdates = { hp: Math.min(prev.maxHp, prev.hp + 4) };
        }

        // Wipe item from map
        setGrid((prevGrid) => {
          const copied = prevGrid.map(row => [...row]);
          copied[finalY][finalX] = {
            ...copied[finalY][finalX],
            item: null
          };
          return copied;
        });

        return {
          ...prev,
          x: finalX,
          y: finalY,
          direction: dir,
          ...inventoryUpdates
        };
      }

      return {
        ...prev,
        x: finalX,
        y: finalY,
        direction: dir
      };
    });
  }, [status, grid, dialogueSeq.triggerType, spawnFloatingText, currentLevel, enemies]);

  // Execute quick dodge dash rolling animation
  const makeRoll = useCallback(() => {
    if (status !== 'playing' || player.actionState !== 'idle' || dialogueSeq.triggerType !== null) return;
    
    playSound('dash');
    setPlayer((prev) => {
      let nextX = prev.x;
      let nextY = prev.y;

      // Shift character forwards 2 grid spaces with zero obstacles check 
      switch (prev.direction) {
        case 'up': nextY = Math.max(1, prev.y - 2); break;
        case 'down': nextY = Math.min(MAP_HEIGHT - 2, prev.y + 2); break;
        case 'left': nextX = Math.max(1, prev.x - 2); break;
        case 'right': nextX = Math.min(MAP_WIDTH - 2, prev.x + 2); break;
      }

      // Verify final cell eligibility
      let pathBlocked = false;
      if (grid[nextY] && grid[nextY][nextX]) {
        const cell = grid[nextY][nextX];
        if (cell.type === 'wall' || cell.type === 'water' || cell.type === 'mast' || cell.type === 'door-locked' || cell.type === 'barrel' || cell.type === 'barrel-luffy') {
          pathBlocked = true;
        }
      }

      const finalX = pathBlocked ? prev.x : nextX;
      const finalY = pathBlocked ? prev.y : nextY;

      return {
        ...prev,
        x: finalX,
        y: finalY,
        actionState: 'rolling',
        actionTimer: 2 // lasts for 2 frames
      };
    });
  }, [status, player.direction, player.actionState, grid, dialogueSeq.triggerType]);

  // Perform combat attack or smash barrels
  const executeAttack = useCallback((type: 'pistol' | 'gatling' | 'whip') => {
    if (status !== 'playing' || player.actionState !== 'idle' || dialogueSeq.triggerType !== null) return;

    // Intercept if sleeping inside starting barrel
    const isInsideBarrel = grid[player.y] && grid[player.y][player.x] && grid[player.y][player.x].type === 'barrel-luffy';
    if (isInsideBarrel) {
      triggerBarrelBurst();
      return;
    }

    // Stamina/Haki consumption checks
    if (type === 'gatling' && player.haki < 10) {
      spawnFloatingText(player.x, player.y, '¡HAKI INSUFICIENTE!', 'text-slate-400');
      return;
    }
    if (type === 'whip' && player.haki < 15) {
      spawnFloatingText(player.x, player.y, '¡HAKI INSUFICIENTE!', 'text-slate-400');
      return;
    }

    // Spend Haki if valid
    const spentHaki = type === 'gatling' ? 10 : type === 'whip' ? 15 : 0;
    playSound(type === 'pistol' ? 'punch' : type === 'gatling' ? 'gatling' : 'whip');

    setPlayer((prev) => ({
      ...prev,
      actionState: `attacking-${type}` as any,
      actionTimer: 2,
      haki: Math.max(0, prev.haki - spentHaki)
    }));

    // Target coordinates to register damage vector (Pistol stretches to 2 spaces straight, Gatling has frontal 3x3 cone, Whip radial sweep)
    let targets: Position[] = [];
    if (type === 'whip') {
      // 1-tile radial sweep circle around luffy
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0) {
            targets.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      }
    } else if (type === 'gatling') {
      // GOMU GOMU NO GATLING: 2x3 frontal rubber burst of destruction (depth of 2 tiles, width of 3 tiles centered)
      const dir = player.direction;
      if (dir === 'up') {
        for (let dy = -1; dy >= -2; dy--) {
          for (let dx = -1; dx <= 1; dx++) {
            targets.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      } else if (dir === 'down') {
        for (let dy = 1; dy <= 2; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            targets.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      } else if (dir === 'left') {
        for (let dx = -1; dx >= -2; dx--) {
          for (let dy = -1; dy <= 1; dy++) {
            targets.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      } else if (dir === 'right') {
        for (let dx = 1; dx <= 2; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            targets.push({ x: player.x + dx, y: player.y + dy });
          }
        }
      }
    } else {
      // Straight vector line in facing direction for Gomu Gomu no Pistola
      let reach = 2;
      let dx = 0;
      let dy = 0;

      switch (player.direction) {
        case 'up': dy = -1; break;
        case 'down': dy = 1; break;
        case 'left': dx = -1; break;
        case 'right': dx = 1; break;
      }

      for (let i = 1; i <= reach; i++) {
        targets.push({ x: player.x + dx * i, y: player.y + dy * i });
      }
    }

    // Process targets interaction
    targets.forEach((tgt) => {
      // 1. Deconstruct wooden barrels if present in blast vector
      if (grid[tgt.y] && grid[tgt.y][tgt.x] && grid[tgt.y][tgt.x].type === 'barrel') {
        playSound('hit');
        setGrid((prevGrid) => {
          const copied = [...prevGrid];
          copied[tgt.y][tgt.x] = {
            ...copied[tgt.y][tgt.x],
            type: 'barrel-broken'
          };
          return copied;
        });
        spawnFloatingText(tgt.x, tgt.y, '💥 BARRIL ROTO!', 'text-amber-500 font-bold');
      }

      // 2. Open heavy chests
      if (grid[tgt.y] && grid[tgt.y][tgt.x] && grid[tgt.y][tgt.x].type === 'chest') {
        playSound('pickup');
        setGrid((prevGrid) => {
          const copied = [...prevGrid];
          copied[tgt.y][tgt.x] = {
            ...copied[tgt.y][tgt.x],
            type: 'chest-opened'
          };
          return copied;
        });

        const chestsItem = grid[tgt.y][tgt.x].item;
        if (chestsItem === 'key') {
          spawnFloatingText(tgt.x, tgt.y, '🔑 LLAVE ENCONTRADA!', 'text-amber-300 font-extrabold animate-bounce');
          setPlayer((prev) => ({ ...prev, hasKey: true }));
          if (currentLevel === 1) {
            setTimeout(() => {
              setDialogueSeq({
                dialogues: [
                  {
                    id: 'koby_immediate_key_1',
                    speaker: 'Koby',
                    avatar: ' Koby aliviado',
                    text: '¡¡SIII!! ¡Luffy-san, has encontrado la Llave del Sótano! ¡Ahora podemos escapar!',
                  },
                  {
                    id: 'koby_immediate_key_2',
                    speaker: 'Koby',
                    avatar: ' Koby señalando',
                    text: '¡Rápido! Abre el portón de madera y sube por las escaleras de madera en la esquina superior derecha en la posición (13, 2). ¡Eso nos llevará al Segundo Nivel (La Cubierta)!',
                  }
                ],
                currentIndex: 0,
                triggerType: 'koby-guidance-immediate'
              });
              // Keep status as 'playing' so gameplay map does NOT unmount!
            }, 600);
          }
        } else if (chestsItem === 'map') {
          spawnFloatingText(tgt.x, tgt.y, '🗺️ MAPA DEL GRAND LINE!', 'text-emerald-400 font-extrabold animate-pulse');
          setPlayer((prev) => ({ ...prev, hasMap: true }));
        } else if (chestsItem === 'swords') {
          spawnFloatingText(tgt.x, tgt.y, '⚔️ ¡ESPADAS DE ZORO DESTRABADAS!', 'text-green-450 font-extrabold animate-pulse');
          setPlayer((prev) => ({ ...prev, hasSwords: true }));
        }
      }

      // 3. Trigger damage to active Marines
      setEnemies((prevEnemies) => {
        return prevEnemies.map((enemy) => {
          if (enemy.hp <= 0 || enemy.x !== tgt.x || enemy.y !== tgt.y) return enemy;

          // Compute Luffy attack impact depending on style selection
          const damageValue = type === 'gatling' ? 15 : type === 'whip' ? 12 : 8;
          const nextHp = Math.max(0, enemy.hp - damageValue);

          spawnFloatingText(enemy.x, enemy.y, `💥 -${damageValue} PS`, 'text-red-400 font-extrabold animate-bounce');

          if (nextHp <= 0) {
            playSound('victory');
            spawnFloatingText(enemy.x, enemy.y, '💀 ¡DERROTADO!', 'text-slate-300 font-bold');

            if (enemy.type === 'alvida') {
              setTimeout(() => {
                setDialogueSeq({
                  dialogues: VICTORY_DIALOGUES.dialogues,
                  currentIndex: 0,
                  triggerType: 'victory'
                });
              }, 400);
            } else if (enemy.type === 'morgan') {
              // Trigger final level 3 story cutscene
              setTimeout(() => {
                setDialogueSeq({
                  dialogues: LEVEL3_VICTORY_DIALOGUES.dialogues,
                  currentIndex: 0,
                  triggerType: 'level3-victory'
                });
              }, 400);
            }
          }

          return {
            ...enemy,
            hp: nextHp,
            state: 'stunned'
          };
        });
      });
    });
  }, [status, player.x, player.y, player.direction, player.actionState, player.haki, grid, spawnFloatingText, triggerBarrelBurst]);

  // Consuming healing meat
  const eatMeat = useCallback(() => {
    if (player.meatCount <= 0) return;
    if (player.hp >= player.maxHp) {
      spawnFloatingText(player.x, player.y, '¡VIDA LLENA!', 'text-slate-300');
      return;
    }

    playSound('pickup');
    setPlayer((prev) => {
      return {
        ...prev,
        meatCount: prev.meatCount - 1,
        hp: Math.min(prev.maxHp, prev.hp + 4)
      };
    });
    spawnFloatingText(player.x, player.y, '🍖 CORAZÓN RELLENADO (+4 HP)', 'text-emerald-400 font-extrabold');
  }, [player.meatCount, player.hp, player.maxHp, player.x, player.y, spawnFloatingText]);

  // Action to free Koby (Koby-scared is at 7,4 coordinate in maps layout template)
  const interactWithKoby = useCallback(() => {
    if (currentLevel === 1) {
      playSound('pickup');
      if (player.hasKey) {
        setDialogueSeq({
          dialogues: [
            {
              id: 'koby_talk_has_key_1',
              speaker: 'Koby',
              avatar: ' Koby aliviado',
              text: '¡Luffy-san! ¡Ya tienes la llave en tus manos! ¡No dejes que los guardias te detengan!',
            },
            {
              id: 'koby_talk_has_key_2',
              speaker: 'Koby',
              avatar: ' Koby señalando',
              text: 'Abre el portón de madera con la llave y sube por las escaleras en la esquina superior derecha del sótano en la posición (13, 2). ¡Vamos de una vez a la cubierta!',
            }
          ],
          currentIndex: 0,
          triggerType: 'koby-guidance-talk'
        });
        setStatus('intro'); // Pause and show dialogue overlay
      } else {
        setDialogueSeq({
          dialogues: [
            {
              id: 'koby_talk_no_key_1',
              speaker: 'Koby',
              avatar: ' Koby asustado',
              text: '¡Luffy-san! Para poder llegar a las escaleras de escape, necesitamos abrir el portón de madera que bloquea el camino.',
            },
            {
              id: 'koby_talk_no_key_2',
              speaker: 'Koby',
              avatar: ' Koby indicando',
              text: 'Busca el cofre en la parte inferior derecha del sótano, en la posición (13, 8). ¡Allí adentro debe estar escondida la Llave del Portón!',
            }
          ],
          currentIndex: 0,
          triggerType: 'koby-guidance-talk'
        });
        setStatus('intro'); // Pause and show dialogue overlay
      }
    }
  }, [currentLevel, player.hasKey, playSound]);

  // Trigger grid interaction clicks manually
  const handleGridCellClick = (x: number, y: number) => {
    if (status !== 'playing') return;

    const dist = Math.abs(x - player.x) + Math.abs(y - player.y);
    if (dist > 1) return; // Must be in adjacent contact range

    // Interact with Koby
    if (currentLevel === 1 && x === 7 && y === 4 && grid[4] && grid[4][7].type === 'koby-scared') {
      interactWithKoby();
    }
  };

  // Keyboard layout listeners hooking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') {
        // Advance dialogs if intro/cutscenes are going
        if (dialogueSeq.triggerType !== null && e.key === ' ') {
          e.preventDefault();
          handleNextDialogue();
        }
        return;
      }

      // If text sequence pop-up active, override keyboard movement
      if (dialogueSeq.triggerType !== null) {
        if (e.key === ' ') {
          e.preventDefault();
          handleNextDialogue();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          movePlayer('up');
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          movePlayer('right');
          break;
        case ' ':
          e.preventDefault();
          executeAttack('pistol');
          break;
        case '1':
        case 'e':
          e.preventDefault();
          executeAttack('gatling');
          break;
        case '2':
        case 'r':
          e.preventDefault();
          executeAttack('whip');
          break;
        case 'shift':
          e.preventDefault();
          makeRoll();
          break;
        case 'h':
        case 'q':
          e.preventDefault();
          eatMeat();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, dialogueSeq.triggerType, movePlayer, executeAttack, makeRoll, eatMeat]);

  // Cycles forward active conversations frames
  const handleNextDialogue = () => {
    setDialogueSeq((prev) => {
      const isLast = prev.currentIndex >= prev.dialogues.length - 1;
      if (isLast) {
        // Close dialogue system and handle level transition or story triggers
        if (prev.triggerType === 'intro') {
          setStatus('playing');
        } else if (prev.triggerType === 'zoro-meet') {
          setStatus('playing');
        } else if (prev.triggerType === 'boss-fight') {
          setStatus('playing');
        } else if (prev.triggerType === 'victory') {
          // Transition from Level 1 (Alvida) to Level 2 (Pueblo y Puerto Shellport - Rescate de Zack)
          unlockToLevel(2);
          setCurrentLevel(2);
          setGrid(buildInitialGrid(2));
          setEnemies(getInitialEnemies(2));
          setPlayer((posPrev) => ({
            ...posPrev,
            x: 1,
            y: 5,
            hasKey: false,
            hasMap: true,
            hasSwords: false,
            haki: 15,
          }));
          playSound('unlock');
          setTimeout(() => {
            setDialogueSeq({
              dialogues: DECK_TRANSITION_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'zoro-meet'
            });
          }, 100);
          spawnFloatingText(1, 5, '⛵ ¡LLEGASTE AL PUERTO DE SHELLPORT!', 'text-emerald-400 font-extrabold animate-bounce');
        } else if (prev.triggerType === 'zoro-prison') {
          setStatus('playing');
        } else if (prev.triggerType === 'swords-found') {
          setStatus('playing');
        } else if (prev.triggerType === 'morgan-confront') {
          setStatus('playing');
          // Command Morgan and Helmeppo to chase Luffy immediately
          setEnemies((prevEnemies) =>
            prevEnemies.map((e) =>
              e.type === 'morgan' || e.type === 'helmeppo' ? { ...e, state: 'chasing' } : e
            )
          );
        } else if (prev.triggerType === 'level3-victory') {
          // Transition to LEVEL 4 (Orange Town - Town Map)
          unlockToLevel(4);
          setCurrentLevel(4);
          setGrid(buildInitialGrid(4));
          setEnemies(getInitialEnemies(4));
          setPlayer((posPrev) => ({
            ...posPrev,
            x: 1,
            y: 5,
            hasKey: false,
            hasMap: false,
            hasSwords: false,
            haki: 18,
          }));
          playSound('unlock');
          setTimeout(() => {
            setDialogueSeq({
              dialogues: LEVEL4_INTRO_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'level4-intro'
            });
          }, 100);
          spawnFloatingText(1, 5, '🤡 ¡LLEGASTE A ORANGE TOWN!', 'text-sky-400 font-extrabold animate-bounce');
        } else if (prev.triggerType === 'level4-intro') {
          setStatus('playing');
        } else if (prev.triggerType === 'buggy-confront') {
          setStatus('playing');
        } else if (prev.triggerType === 'level4-victory') {
          // Transition to LEVEL 5 (Syrup Village - Town Map)
          unlockToLevel(5);
          setCurrentLevel(5);
          setGrid(buildInitialGrid(5));
          setEnemies(getInitialEnemies(5));
          setPlayer((posPrev) => ({
            ...posPrev,
            x: 1,
            y: 5,
            hasKey: false,
            hasMap: false,
            hasSwords: false,
            haki: 22,
          }));
          playSound('unlock');
          setTimeout(() => {
            setDialogueSeq({
              dialogues: LEVEL5_INTRO_DIALOGUES.dialogues,
              currentIndex: 0,
              triggerType: 'level5-intro'
            });
          }, 100);
          spawnFloatingText(1, 5, '🐏 ¡SOPORTA SYRUP VILLAGE!', 'text-teal-400 font-extrabold animate-bounce');
        } else if (prev.triggerType === 'level5-intro') {
          setStatus('playing');
        } else if (prev.triggerType === 'kuro-confront') {
          setStatus('playing');
        } else if (prev.triggerType === 'level5-victory') {
          // Final Victory Screen!
          setStatus('victory');
          playSound('victory');
        } else {
          setStatus('playing');
        }
        return { ...prev, triggerType: null, currentIndex: 0 };
      } else {
        playSound('dash');
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-start md:justify-between font-sans relative overflow-x-hidden antialiased">
      {/* Visual background sea pattern decoration */}
      <div className="absolute inset-x-0 bottom-0 top-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1e3a8a_2px,transparent_2px)] [background-size:16px_16px]" />

      {/* Retro Upper Title Bar HUD */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-2 py-1.5 sm:px-6 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-2.5 z-10">
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex w-9 h-9 bg-rose-600 rounded-lg items-center justify-center border-2 border-rose-400 shadow shadow-rose-950 font-extrabold text-white text-lg select-none shrink-0">
            👒
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xs sm:text-sm font-mono font-black tracking-wide bg-gradient-to-r from-amber-400 via-rose-400 to-rose-600 bg-clip-text text-transparent uppercase flex items-center justify-center sm:justify-start gap-1">
              👒 Romance Dawn: Gomu Capsule
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider leading-tight">
              Fase {currentLevel}: {getPasherTheme(currentLevel).name} ({getPasherTheme(currentLevel).island})
            </p>
          </div>
        </div>

        {/* Toggle and Level Objectives checklist and badges */}
        <div className="flex items-center gap-2 sm:gap-3 select-none flex-nowrap overflow-x-auto max-w-full justify-center">
          
          {/* Selector de Motor de Juego (Phaser 3 vs Grid) */}
          <div className="bg-slate-955 border border-emerald-700/60 p-0.5 rounded-lg flex items-center gap-1 font-mono text-[9px] shadow-md shrink-0">
            <button
              onClick={() => setEngineMode('phaser')}
              className={`px-2 py-0.5 rounded transition-all font-bold cursor-pointer uppercase text-[8px] flex items-center gap-1 ${
                engineMode === 'phaser'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🕹️ Phaser 3 (60FPS)
            </button>
            <button
              onClick={() => setEngineMode('grid')}
              className={`px-2 py-0.5 rounded transition-all font-bold cursor-pointer uppercase text-[8px] flex items-center gap-1 ${
                engineMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ▦ Retícula
            </button>
          </div>
          
          {/* Selector de Niveles / Partes del juego (No wrapping scrollable row on mobile) */}
          <div className="bg-slate-950/80 border border-slate-800 p-0.5 rounded-lg flex items-center gap-1 font-mono text-[9px] shadow-inner flex-nowrap overflow-x-auto scrollbar-none max-w-full">
             <span className="text-slate-500 font-black px-1.5 py-0.5 uppercase text-[7.5px] tracking-wider shrink-0">Parte:</span>
             <button
               onClick={() => changeToLevel(1)}
               className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer uppercase text-[8px] shrink-0 ${
                 currentLevel === 1
                   ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                   : 'text-slate-400 hover:text-white hover:bg-slate-900'
               }`}
             >
               1. Sótano
             </button>
             <button
               onClick={() => {
                 if (maxUnlockedLevel >= 2) {
                   changeToLevel(2);
                 } else {
                   playSound('hit');
                   spawnFloatingText(player.x, player.y, '🔒 ¡Completa el Sótano primero!', 'text-rose-450 font-extrabold animate-bounce');
                 }
               }}
               className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer uppercase text-[8px] shrink-0 ${
                 currentLevel === 2
                   ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                   : maxUnlockedLevel >= 2
                   ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                   : 'text-slate-600 opacity-60 cursor-not-allowed'
               }`}
             >
               {maxUnlockedLevel >= 2 ? '2. Cubierta' : '🔒 2. Bloqueado'}
             </button>
             <button
               onClick={() => {
                 if (maxUnlockedLevel >= 3) {
                   changeToLevel(3);
                 } else {
                   playSound('hit');
                   spawnFloatingText(player.x, player.y, '🔒 ¡Derrota a Alvida primero! 🏴‍☠️', 'text-rose-450 font-extrabold animate-bounce');
                 }
               }}
               className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer uppercase text-[8px] shrink-0 ${
                 currentLevel === 3
                   ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                   : maxUnlockedLevel >= 3
                   ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                   : 'text-slate-600 opacity-60 cursor-not-allowed'
               }`}
             >
               {maxUnlockedLevel >= 3 ? '3. Zoro' : '🔒 3. Bloqueado'}
             </button>
             <button
               onClick={() => {
                 if (maxUnlockedLevel >= 4) {
                   changeToLevel(4);
                 } else {
                   playSound('hit');
                   spawnFloatingText(player.x, player.y, '🔒 ¡Completa Shells Town primero! ⚔️', 'text-rose-450 font-extrabold animate-bounce');
                 }
               }}
               className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer uppercase text-[8px] shrink-0 ${
                 currentLevel === 4
                   ? 'bg-orange-500 text-slate-950 font-black shadow-sm'
                   : maxUnlockedLevel >= 4
                   ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                   : 'text-slate-600 opacity-60 cursor-not-allowed'
               }`}
             >
               {maxUnlockedLevel >= 4 ? '4. Buggy' : '🔒 4. Bloqueado'}
             </button>
             <button
               onClick={() => {
                 if (maxUnlockedLevel >= 5) {
                   changeToLevel(5);
                 } else {
                   playSound('hit');
                   spawnFloatingText(player.x, player.y, '🔒 ¡Completa Orange Town primero! 🤡', 'text-rose-450 font-extrabold animate-bounce');
                 }
               }}
               className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer uppercase text-[8px] shrink-0 ${
                 currentLevel === 5
                   ? 'bg-red-500 text-slate-950 font-black shadow-sm'
                   : maxUnlockedLevel >= 5
                   ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                   : 'text-slate-600 opacity-60 cursor-not-allowed'
               }`}
             >
               {maxUnlockedLevel >= 5 ? '5. Kuro' : '🔒 5. Bloqueado'}
             </button>
          </div>

          <button
            onClick={() => {
              setShowVirtualControls(!showVirtualControls);
              playSound('unlock');
            }}
            className={`px-2 py-1 rounded-lg border font-mono text-[9px] sm:text-[10px] font-black tracking-wide uppercase flex items-center gap-1 transition-all shadow-md cursor-pointer active:scale-95 shrink-0 ${
              showVirtualControls 
                ? 'bg-slate-800 hover:bg-slate-755 border-slate-700 text-slate-300' 
                : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 border-yellow-300 text-slate-950 font-black'
            }`}
          >
            {showVirtualControls ? '⌨️ PC' : '📱 Táctil'}
          </button>

          <div className="hidden md:flex items-center gap-2.5 text-[10px] font-mono">
            <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
              player.hasKey ? 'bg-amber-500/10 border-amber-500 text-amber-300 animate-pulse' : 'bg-slate-950/50 border-slate-800 text-slate-500'
            }`}>
              <Key className="w-3 h-3" />
              <span>
                {currentLevel === 5 ? 'LLAVE MANSIÓN 🔑' : currentLevel === 4 ? 'LLAVE CIRCO 🔑' : currentLevel === 3 ? 'LLAVE BASE 🔑' : 'LLAVE CABINA 🔑'}
              </span>
            </div>
            <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
              currentLevel === 3 || currentLevel === 5
                ? (player.hasSwords ? 'bg-green-500/10 border-green-500 text-green-300 animate-pulse' : 'bg-slate-950/50 border-slate-800 text-slate-500')
                : (player.hasMap ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 animate-pulse' : 'bg-slate-950/50 border-slate-800 text-slate-500')
            }`}>
              {currentLevel === 3 || currentLevel === 5 ? <Swords className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
              <span>
                {currentLevel === 5 ? 'PLANOS MERRY 📜' : currentLevel === 4 ? 'MAPA MARINO 🗺️' : currentLevel === 3 ? 'ESPADAS ZORO ⚔️' : 'MAPA GRAND LINE 🗺️'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Core Game Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-1.5 py-1.5 sm:px-4 sm:py-6 flex flex-col gap-2 sm:gap-5 items-center justify-start md:justify-center z-10">
        
        {/* State A: Splash intro screens and credits */}
        {status === 'intro' && dialogueSeq.triggerType === null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border-4 border-amber-600 p-8 rounded-2xl text-center shadow-2xl relative"
          >
            <div className="absolute top-1 left-1 w-3 h-3 bg-amber-500" />
            <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500" />
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-amber-500" />
            
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center border-4 border-yellow-300 text-5xl shadow-xl shadow-red-950/40">
              👒
            </div>

            <h2 className="text-2xl font-mono font-black tracking-wider text-amber-400 uppercase mt-4">
              ROMANCE DAWN
            </h2>
            <div className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mb-4">BARCO DE ALVIDA</div>
            
            <p className="text-sm text-slate-300 font-sans leading-relaxed text-center mb-6">
              ¡Luffy ha aparecido dentro de un barril a bordo del barco pirata de la temible Capitana Alvida! Ayúdalo a irrumpir del barril, rescatar al joven Koby, recuperar el Mapa del Grand Line y derrotar a Alvida para emprender el viaje.
            </p>

            <button
              onClick={() => {
                playSound('unlock');
                setDialogueSeq({
                  dialogues: INTRO_DIALOGUES.dialogues,
                  currentIndex: 0,
                  triggerType: 'intro'
                });
              }}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 border-2 border-yellow-300 text-slate-950 uppercase font-mono font-black tracking-widest shadow-lg active:scale-95 transition-all text-sm cursor-pointer"
            >
              🏴‍☠️ Comenzar Aventura
            </button>
          </motion.div>
        )}

        {/* State B: Active Gameplay Viewport — always shown when grid is loaded */}
        {(status === 'playing' || status === 'gameover' || status === 'victory' || (status === 'intro' && dialogueSeq.triggerType !== null)) && (
          <div className="w-full flex flex-col gap-4">
            {/* Primary HUD bar showing hearts, keys and stats */}
            <GameHUD 
              player={player} 
              onEatMeat={eatMeat} 
              onReset={handleResetLevel} 
              currentLevel={currentLevel}
            />

            {/* Responsive Split Screen Layout: Left = Game Grid (with overlay on mobile), Right = Powers column (on desktop) */}
            <div className="w-full flex flex-col lg:flex-row gap-5 items-stretch justify-center relative">
              
              {/* Left Column: Phaser 3 Canvas or Game Grid Viewport */}
              <div className="flex-1 w-full flex flex-col items-center justify-center relative max-w-[920px] mx-auto">
                {engineMode === 'phaser' ? (
                  <PhaserGameContainer 
                    currentLevel={currentLevel}
                    subMap={subMap}
                  />
                ) : (
                  <GameGrid 
                    grid={grid} 
                    player={player} 
                    enemies={enemies}
                    floatingTexts={floatingTexts}
                    onCellClick={handleGridCellClick}
                    showVirtualControls={showVirtualControls}
                    isSidebarLayout={isLargeScreen}
                  />
                )}

                {/* Tactical controls container placed at the bottom space (No overlay over gameplay map view) */}
                {!isLargeScreen && showVirtualControls && (
                  <div className="w-full flex flex-row items-center justify-around gap-4 mt-4 px-3 py-3 bg-slate-900 border-2 border-slate-800 rounded-2xl max-w-[500px] mx-auto select-none pointer-events-auto shadow-2xl shadow-black/90">
                    
                    {/* Left side: Tactile high-contrast retro D-Pad */}
                    <div className="bg-slate-905 border border-slate-700/60 p-1.5 rounded-full select-none flex items-center justify-center pointer-events-auto scale-90 sm:scale-100 shadow-md">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        {/* Center core cross */}
                        <div className="absolute w-9 h-28 bg-slate-850 rounded-lg border border-slate-700 shadow-inner" />
                        <div className="absolute h-9 w-28 bg-slate-850 rounded-lg border border-slate-700 shadow-inner" />
                        <div className="absolute w-9 h-9 bg-slate-950 rounded-full z-10 border border-slate-700/80 shadow-md flex items-center justify-center text-slate-300 text-[10px] font-bold">⚓</div>

                        {/* UP ARROW BUTTON */}
                        <button
                          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); movePlayer('up'); }}
                          onClick={() => movePlayer('up')}
                          className="absolute top-0 w-9.5 h-9.5 flex flex-col items-center justify-center rounded-t-lg bg-slate-705 border-b border-slate-600 active:bg-amber-500 active:border-amber-400 text-amber-550 active:text-white active:scale-95 z-20 transition-all cursor-pointer shadow-md"
                          title="Arriba"
                        >
                          <ArrowUp className="w-4 h-4 text-amber-500 active:text-white" />
                        </button>

                        {/* DOWN ARROW BUTTON */}
                        <button
                          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); movePlayer('down'); }}
                          onClick={() => movePlayer('down')}
                          className="absolute bottom-0 w-9.5 h-9.5 flex flex-col items-center justify-center rounded-b-lg bg-slate-705 border-t border-slate-600 active:bg-amber-550 active:border-amber-405 text-amber-550 active:text-white active:scale-95 z-20 transition-all cursor-pointer shadow-md"
                          title="Abajo"
                        >
                          <ArrowDown className="w-4 h-4 text-amber-500 active:text-white" />
                        </button>

                        {/* LEFT ARROW BUTTON */}
                        <button
                          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); movePlayer('left'); }}
                          onClick={() => movePlayer('left')}
                          className="absolute left-0 w-9.5 h-9.5 flex items-center justify-center rounded-l-lg bg-slate-705 border-r border-slate-600 active:bg-amber-500 active:border-amber-400 text-amber-550 active:text-white active:scale-95 z-20 transition-all cursor-pointer shadow-md"
                          title="Izquierda"
                        >
                          <ArrowLeft className="w-4 h-4 text-amber-500 active:text-white" />
                        </button>

                        {/* RIGHT ARROW BUTTON */}
                        <button
                          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); movePlayer('right'); }}
                          onClick={() => movePlayer('right')}
                          className="absolute right-0 w-9.5 h-9.5 flex items-center justify-center rounded-r-lg bg-slate-705 border-l border-slate-600 active:bg-amber-500 active:border-amber-450 text-amber-550 active:text-white active:scale-95 z-20 transition-all cursor-pointer shadow-md"
                          title="Derecha"
                        >
                          <ArrowRight className="w-4 h-4 text-amber-500 active:text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Right side: Vibrant High-contrast Skills Round Console */}
                    <div className="select-none pointer-events-auto bg-slate-905 border border-slate-700/60 rounded-full p-1 flex items-center justify-center w-[136px] h-[136px] sm:w-[150px] sm:h-[150px] shadow-md">
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 scale-90 sm:scale-100 flex items-center justify-center">
                        
                        {/* Main Attack (GUM-GUM PISTOL) - Large Red Button at the center bottom/right */}
                        <button
                          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); executeAttack('pistol'); }}
                          onClick={() => executeAttack('pistol')}
                          className="absolute bottom-0 right-0 w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-b from-red-600 to-red-750 hover:from-red-500 hover:to-red-600 border border-red-450 rounded-full flex flex-col items-center justify-center text-white active:scale-95 shadow-md focus:outline-none z-20 transition-all cursor-pointer active:brightness-125"
                          title="Pistola Gum-Gum (Básico)"
                        >
                          <span className="text-sm sm:text-xl">👊</span>
                          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black tracking-tighter uppercase text-yellow-300">PISTOLA</span>
                        </button>

                        {/* Giro Evasivo (Dash/Slide) - Teal Button bottom left */}
                        <button
                          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); makeRoll(); }}
                          onClick={() => makeRoll()}
                          className="absolute bottom-0 left-2 w-9 h-9 sm:w-11 sm:h-11 bg-teal-600 hover:bg-teal-500 border border-teal-400 rounded-full flex flex-col items-center justify-center text-white active:scale-95 shadow-md focus:outline-none z-10 transition-all cursor-pointer active:brightness-125"
                          title="Giro Evasivo"
                        >
                          <span className="text-xs sm:text-base text-teal-100">🌀</span>
                          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black tracking-tighter uppercase text-teal-200 leading-none">GIRO</span>
                        </button>

                        {/* Gum-Gum Metralleta (Requires Haki 10) - Yellow Button mid left */}
                        <button
                          onTouchStart={(e) => { if (player.haki >= 10) { e.preventDefault(); e.stopPropagation(); executeAttack('gatling'); } }}
                          onClick={() => executeAttack('gatling')}
                          disabled={player.haki < 10}
                          className={`absolute top-1 sm:top-4 left-0 w-9 h-9 sm:w-11 sm:h-11 border rounded-full flex flex-col items-center justify-center active:scale-95 shadow-md focus:outline-none z-10 transition-all cursor-pointer ${
                            player.haki >= 10
                              ? 'bg-amber-500 border-yellow-300 active:bg-amber-400 text-slate-950 font-black hover:brightness-110'
                              : 'bg-slate-955 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                          }`}
                          title="Metralleta (10 Haki)"
                        >
                          <span className="text-xs sm:text-base">💥</span>
                          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black tracking-tighter uppercase leading-none">METRAL</span>
                        </button>

                        {/* Gum-Gum Látigo (Requires Haki 15) - Purple Button top right */}
                        <button
                          onTouchStart={(e) => { if (player.haki >= 15) { e.preventDefault(); e.stopPropagation(); executeAttack('whip'); } }}
                          onClick={() => executeAttack('whip')}
                          disabled={player.haki < 15}
                          className={`absolute top-0 right-1 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 border rounded-full flex flex-col items-center justify-center active:scale-95 shadow-md focus:outline-none z-10 transition-all cursor-pointer ${
                            player.haki >= 15
                              ? 'bg-purple-600 border-purple-400 active:bg-purple-500 text-purple-100 font-extrabold hover:brightness-110'
                              : 'bg-slate-955 border-slate-800 text-slate-600 opacity-45 cursor-not-allowed'
                          }`}
                          title="Látigo (15 Haki)"
                        >
                          <span className="text-xs sm:text-base">🌪️</span>
                          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black tracking-tighter uppercase leading-none">LÁTIGO</span>
                        </button>

                        {/* Eat Meat / Carne (Quick Heal) - Coral Button offset top center */}
                        <button
                          onTouchStart={(e) => { if (player.meatCount > 0) { e.preventDefault(); e.stopPropagation(); eatMeat(); } }}
                          onClick={() => eatMeat()}
                          disabled={player.meatCount === 0}
                          className={`absolute top-[-8px] sm:top-[-5px] left-[32px] sm:left-[42px] w-8.5 h-8.5 sm:w-10 sm:h-10 border rounded-full flex flex-col items-center justify-center active:scale-95 shadow-md focus:outline-none z-15 transition-all cursor-pointer ${
                            player.meatCount > 0
                              ? 'bg-rose-500 border-rose-350 text-rose-50 hover:brightness-110 active:bg-rose-400'
                              : 'bg-slate-955 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                          }`}
                          title="Comer Carne (Cura HP)"
                        >
                          <span className="text-xs sm:text-sm">🍖</span>
                          <span className="text-[6.5px] sm:text-[8px] font-black leading-none bg-rose-955 border border-rose-500 px-0.8 py-0.2 rounded-full absolute -top-1 -right-1 text-rose-350 shrink-0">
                            {player.meatCount}
                          </span>
                        </button>
                        
                      </div>
                    </div>

                  </div>
                )}
              </div>
 
              {/* Right Column: Powers, Controls and PC Bindings Information (Shown only on Desktop screen width >= 1024px) */}
              {isLargeScreen && (
                <div className="w-full lg:w-[410px] shrink-0 flex flex-col gap-4 justify-start">
                  {showVirtualControls ? (
                    <ControlsOverlay 
                      onMove={movePlayer} 
                      onAttack={executeAttack} 
                      onRoll={makeRoll} 
                      onEatMeat={eatMeat} 
                      meatCount={player.meatCount}
                      haki={player.haki}
                    />
                  ) : (
                  <div className="w-full bg-slate-900/95 border-2 border-slate-700/60 p-4 rounded-xl shadow-xl flex flex-col gap-3.5 text-xs select-none font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-amber-500 font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        ⚙️ CONTROLES DE PORTÁTIL / PC
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase ms-auto">Teclado Activo</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">🔥 ATAQUES Y PODERES (CLICK / TECLAS)</span>

                      {/* GUM-GUM PISTOL */}
                      <button
                        onClick={() => executeAttack('pistol')}
                        className="flex items-center justify-between p-2 rounded border border-red-500/30 bg-red-650/10 hover:bg-red-650/20 text-red-300 transition-all cursor-pointer text-left active:scale-98"
                        title="Ataque básico (Espacio)"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[10px]">👊 GUM-GUM PISTOLA</span>
                          <span className="text-[9px] text-slate-400">Normal (8 DMG)</span>
                        </div>
                        <span className="bg-slate-800 border-b-2 border-slate-600 text-slate-200 px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono shadow">Espacio</span>
                      </button>

                      {/* METRALLETA */}
                      <button
                        onClick={() => { executeAttack('gatling'); }}
                        disabled={player.haki < 10}
                        className={`flex items-center justify-between p-2 rounded border transition-all text-left active:scale-98 ${
                          player.haki >= 10
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 border-yellow-500 text-amber-300 cursor-pointer'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
                        }`}
                        title="Ataque múltiple Gum-Gum Gatling (Tecla E o 1)"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[10px]">💥 METRALLETA (10 Hk)</span>
                          <span className="text-[9px] text-slate-400">Rápido (6x3 DMG)</span>
                        </div>
                        <span className="bg-slate-800 border-b-2 border-slate-600 text-slate-200 px-1.5 py-0.5 rounded text-[9px] font-black uppercase shadow">E / 1</span>
                      </button>

                      {/* LÁTIGO */}
                      <button
                        onClick={() => { executeAttack('whip'); }}
                        disabled={player.haki < 15}
                        className={`flex items-center justify-between p-2 rounded border transition-all text-left active:scale-98 ${
                          player.haki >= 15
                            ? 'bg-purple-600/15 hover:bg-purple-600/25 border-purple-500 text-purple-300 animate-pulse cursor-pointer'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
                        }`}
                        title="Giro de 360 grados Gum-Gum Látigo (Tecla R o 2)"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[10px]">🌪️ LÁTIGO (15 Hk)</span>
                          <span className="text-[9px] text-slate-400">Área (12 DMG)</span>
                        </div>
                        <span className="bg-slate-800 border-b-2 border-slate-600 text-slate-200 px-1.5 py-0.5 rounded text-[9px] font-black uppercase shadow">R / 2</span>
                      </button>

                      {/* GIRO */}
                      <button
                        onClick={makeRoll}
                        className="flex items-center justify-between p-2 rounded border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-all cursor-pointer text-left active:scale-98"
                        title="Esquivar proyectiles enemigos (Tecla Shift)"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[10px]">🌀 GIRO EVASIVO</span>
                          <span className="text-[9px] text-teal-400">Esquivar / Roll</span>
                        </div>
                        <span className="bg-slate-800 border-b-2 border-slate-600 text-slate-200 px-1.5 py-0.5 rounded text-[9px] font-black uppercase shadow">Shift</span>
                      </button>

                      {/* COMER CARNE */}
                      <button
                        onClick={eatMeat}
                        disabled={player.meatCount === 0}
                        className={`flex items-center justify-between p-2 rounded border transition-all text-left active:scale-98 ${
                          player.meatCount > 0
                            ? 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500 text-rose-300 cursor-pointer'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-600 cursor-not-allowed'
                        }`}
                        title="Comer carne para recuperar 4 de salud (Tecla Q o H)"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[10px]">🍖 COMER CARNE ({player.meatCount})</span>
                          <span className="text-[9px] text-rose-405">Cura HP (+4)</span>
                        </div>
                        <span className="bg-slate-800 border-b-2 border-slate-600 text-slate-200 px-1.5 py-0.5 rounded text-[9px] font-black uppercase shadow">Q / H</span>
                      </button>
                    </div>

                    {/* WASD dpad keyboard schema */}
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex flex-col items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center leading-none">Navegación / Movimiento</span>
                      <div className="flex flex-col gap-1 items-center">
                        {/* Key W */}
                        <div className="flex items-center justify-center bg-slate-900 border-2 border-slate-750 rounded text-[11px] font-black border-b-4 border-slate-600 w-8 h-8 select-none text-slate-100">W</div>
                        <div className="flex gap-1">
                          {/* Key A, S, D */}
                          <div className="flex items-center justify-center bg-slate-900 border-2 border-slate-755 rounded text-[11px] font-black border-b-4 border-slate-600 w-8 h-8 select-none text-slate-100">A</div>
                          <div className="flex items-center justify-center bg-slate-900 border-2 border-slate-755 rounded text-[11px] font-black border-b-4 border-slate-600 w-8 h-8 select-none text-slate-100">S</div>
                          <div className="flex items-center justify-center bg-slate-900 border-2 border-slate-755 rounded text-[11px] font-black border-b-4 border-slate-600 w-8 h-8 select-none text-slate-100">D</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 text-center leading-normal">
                        Usa las teclas <strong className="text-yellow-400 font-bold">WASD</strong> o las <strong className="text-yellow-400 font-bold">Flechas</strong> de dirección de tu teclado físico para moverte.
                      </span>
                    </div>

                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        )}

        {/* State C: Game Over — floating overlay, does NOT unmount gameplay */}
        {status === 'gameover' && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-sm bg-slate-900 border-4 border-rose-600 p-6 rounded-2xl text-center shadow-2xl mx-4"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-4xl mb-3 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                💀
              </div>
              <h2 className="text-xl font-mono font-black text-rose-500 tracking-wider uppercase mb-1">
                ¡HAS SIDO DERROTADO!
              </h2>
              <div className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mb-4">Luffy se desmayó por el hambre y cansancio...</div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed text-center mb-5">
                "¡¿Quién es la mujer más hermosa de todos los mares y quién te dio permiso para dormir en mi precioso barco?!" - Capitana Alvida
              </p>
              <button
                onClick={handleResetLevel}
                className="w-full py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white uppercase font-mono font-black text-xs tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Intentarlo de Nuevo
              </button>
            </motion.div>
          </div>
        )}

        {/* State D: Level Completed Victory — floating overlay */}
        {status === 'victory' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border-4 border-yellow-500 p-8 rounded-2xl text-center shadow-2xl relative"
          >
            <div className="absolute top-1 left-1 w-3 h-3 bg-yellow-400" />
            <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400" />
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-yellow-400" />
            
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-yellow-500 via-emerald-600 to-green-500 flex items-center justify-center border-4 border-yellow-300 text-5xl shadow-2xl animate-bounce">
              {currentLevel === 3 ? '👒⚔️' : '👑🪓'}
            </div>

            {currentLevel === 3 ? (
              <>
                <h2 className="text-2xl font-mono font-black tracking-wider text-yellow-400 uppercase mt-4">
                  ¡SAGA ROMANCE DAWN COMPLETADA!
                </h2>
                <div className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase mb-4">🏆 ¡Roronoa Zoro se ha unido a tu tripulación!</div>
                
                <p className="text-sm text-slate-300 font-sans leading-relaxed text-center mb-6 text-slate-300">
                  ¡ESPECTACULAR! Lograste infiltrarte en la Base de la Marina de Shells Town, recuperaste las legendarias tres espadas de Zoro del cofre de Helmeppo, lo liberaste de su poste de calvario y juntos desmantelaron el corrupto régimen dictatorial del Capitán Morgan "Mano de Hacha". ¡Zoro y Luffy zarpan victoriosos hacia el Grand Line!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-mono font-black tracking-wider text-yellow-400 uppercase mt-4">
                  ¡BARCO DE ALVIDA LIBERADO!
                </h2>
                <div className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase mb-4">¡Koby se ha salvado y tienes el mapa!</div>
                
                <p className="text-sm text-slate-300 font-sans leading-relaxed text-center mb-6 text-slate-300">
                  ¡Increíble! Mandaste a volar a la Capitana Alvida de un puñetazo, recuperaste el Mapa de Navegación del Grand Line y liberaste al asustado Koby del cautiverio. ¡El viaje de los Piratas de Sombrero de Paja ha comenzado de forma legendaria!
                </p>
              </>
            )}

            <button
              onClick={handleResetLevel}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-emerald-500 text-slate-950 uppercase font-mono font-black tracking-widest shadow-lg active:scale-95 transition-all text-sm cursor-pointer"
            >
              {currentLevel === 3 ? '🎮 Volver a Jugar la Saga' : '🎮 Volver a Jugar el Nivel'}
            </button>
          </motion.div>
        )}

        {/* Dialog system — fixed overlay, renders on top of everything */}
        {dialogueSeq.triggerType !== null && dialogueSeq.dialogues[dialogueSeq.currentIndex] && (
          <DialogueBox 
            dialogue={dialogueSeq.dialogues[dialogueSeq.currentIndex]} 
            onNext={handleNextDialogue} 
          />
        )}
      </main>

      {/* Retro Footer bar explaining controls and capabilities */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-3 text-center text-[10px] font-mono text-slate-500 z-10 select-none">
        <p>One Piece Dungeon RPG • Hecho en GBA Pixel Style Studio • Presiona R o Haz Click para Curar HP</p>
      </footer>
    </div>
  );
}

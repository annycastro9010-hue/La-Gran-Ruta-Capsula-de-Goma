import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface PhaserGameProps {
  currentLevel: number;
  subMap: string;
  onLevelComplete?: () => void;
  onOpenHouse?: () => void;
}

export const PhaserGameContainer: React.FC<PhaserGameProps> = ({
  currentLevel,
  subMap,
  onLevelComplete,
  onOpenHouse
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuración del Motor Phaser 3 con renderizado Pixel Art nativo
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      pixelArt: true, // Renderizado nítido de gráficos 8-bit / 16-bit
      backgroundColor: '#0f172a',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: {
        preload: function () {
          // Generación de texturas dinámicas pixel art para el juego
          const graphics = this.add.graphics();

          // Luffy Pixel Art Texture
          graphics.fillStyle(0xef4444);
          graphics.fillRect(0, 0, 32, 32);
          graphics.fillStyle(0xfbbf24);
          graphics.fillRect(4, 0, 24, 8); // Sombrero de Paja
          graphics.fillStyle(0x38bdf8);
          graphics.fillRect(8, 20, 16, 12); // Pantalón Azul
          graphics.generateTexture('luffy_sprite', 32, 32);
          graphics.clear();

          // Zack (Zoro) Pixel Art Texture
          graphics.fillStyle(0x10b981);
          graphics.fillRect(0, 0, 32, 32); // Ropa Verde
          graphics.fillStyle(0x064e3b);
          graphics.fillRect(8, 0, 16, 8); // Pañuelo Verde
          graphics.fillStyle(0xf59e0b);
          graphics.fillRect(4, 16, 24, 4); // Fajín Dorado
          graphics.generateTexture('zack_sprite', 32, 32);
          graphics.clear();

          // Centinela Marina Texture
          graphics.fillStyle(0x3b82f6);
          graphics.fillRect(0, 0, 32, 32);
          graphics.fillStyle(0xffffff);
          graphics.fillRect(4, 0, 24, 6); // Gorra Marina
          graphics.generateTexture('marine_sprite', 32, 32);
          graphics.clear();

          // Hacha Hierro Boss Texture
          graphics.fillStyle(0x475569);
          graphics.fillRect(0, 0, 48, 48);
          graphics.fillStyle(0x94a3b8);
          graphics.fillRect(32, 12, 16, 24); // Brazo de Hacha
          graphics.generateTexture('morgan_sprite', 48, 48);
          graphics.clear();

          // Vasija de Arcilla Texture
          graphics.fillStyle(0xb45309);
          graphics.fillCircle(16, 16, 12);
          graphics.fillStyle(0x78350f);
          graphics.fillRect(10, 4, 12, 4);
          graphics.generateTexture('pot_texture', 32, 32);
          graphics.clear();

          // Botón de Presión Suelo Texture
          graphics.fillStyle(0x334155);
          graphics.fillRect(2, 2, 28, 28);
          graphics.fillStyle(0xd97706);
          graphics.fillCircle(16, 16, 8);
          graphics.generateTexture('switch_off', 32, 32);
          graphics.clear();

          // Botón Activado Texture
          graphics.fillStyle(0x065f46);
          graphics.fillRect(2, 2, 28, 28);
          graphics.fillStyle(0x10b981);
          graphics.fillCircle(16, 16, 8);
          graphics.generateTexture('switch_on', 32, 32);
          graphics.clear();

          // Antorcha de Pared Texture
          graphics.fillStyle(0x78350f);
          graphics.fillRect(12, 16, 8, 16);
          graphics.fillStyle(0xf59e0b);
          graphics.fillCircle(16, 10, 8);
          graphics.generateTexture('torch_texture', 32, 32);
          graphics.clear();

          // Muro de Piedra Blanca Texture
          graphics.fillStyle(0xe2e8f0);
          graphics.fillRect(0, 0, 32, 32);
          graphics.fillStyle(0x94a3b8);
          graphics.fillRect(0, 0, 32, 2);
          graphics.fillRect(0, 30, 32, 2);
          graphics.generateTexture('wall_stone', 32, 32);
          graphics.clear();
        },
        create: function () {
          // Fondo de retícula RPG
          const bgGrid = this.add.grid(400, 300, 800, 600, 32, 32, 0x1e293b, 1, 0x0f172a, 1);
          
          // Título en pantalla
          const levelTitle = currentLevel === 1 
            ? 'PARTE 1: BARCO DE ALVIDA (MOTORES PHASER 3)' 
            : 'PARTE 2: PUEBLO Y FORTALEZA SHELLPORT (ZELDA MINISH CAP)';
          
          this.add.text(16, 16, levelTitle, {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#fbbf24',
            backgroundColor: '#0f172a',
            padding: { x: 8, y: 4 }
          }).setDepth(100);

          // Creación del Jugador Luffy con Físicas Arcade de Phaser
          const luffy = this.physics.add.sprite(100, 300, 'luffy_sprite');
          luffy.setCollideWorldBounds(true);

          // Zack encadenado en el centro (Nivel 2)
          if (currentLevel === 2) {
            const zack = this.add.sprite(400, 250, 'zack_sprite');
            this.add.text(400, 215, '⚔️ ZACK', {
              fontSize: '10px',
              fontFamily: 'monospace',
              color: '#34d399'
            }).setOrigin(0.5);

            // Botón de presión que activa rejas
            const btnSwitch = this.physics.add.sprite(320, 300, 'switch_off');
            this.physics.add.overlap(luffy, btnSwitch, () => {
              btnSwitch.setTexture('switch_on');
              this.add.text(320, 260, '🔓 REJAS ABIERTAS', {
                fontSize: '10px',
                color: '#10b981',
                fontFamily: 'monospace'
              }).setOrigin(0.5);
            });

            // Vasijas rompibles Minish Cap
            const pot = this.physics.add.sprite(480, 300, 'pot_texture');
            this.physics.add.overlap(luffy, pot, () => {
              pot.destroy();
              this.add.text(480, 280, '🏺 VASIJA ROTA (+4 HP)', {
                fontSize: '10px',
                color: '#fbbf24',
                fontFamily: 'monospace'
              }).setOrigin(0.5);
            });

            // Antorchas animadas
            const torch1 = this.add.sprite(350, 180, 'torch_texture');
            const torch2 = this.add.sprite(450, 180, 'torch_texture');

            this.tweens.add({
              targets: [torch1, torch2],
              alpha: 0.6,
              duration: 400,
              yoyo: true,
              repeat: -1
            });
          }

          // Controles de Teclado Cursor Keys
          const cursors = this.input.keyboard?.createCursorKeys();
          const wasd = this.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
          }) as any;

          // Bucle de actualización de físicas y movimiento en tiempo real
          this.events.on('update', () => {
            const speed = 180;
            luffy.setVelocity(0);

            if (cursors?.left.isDown || wasd?.left.isDown) {
              luffy.setVelocityX(-speed);
            } else if (cursors?.right.isDown || wasd?.right.isDown) {
              luffy.setVelocityX(speed);
            }

            if (cursors?.up.isDown || wasd?.up.isDown) {
              luffy.setVelocityY(-speed);
            } else if (cursors?.down.isDown || wasd?.down.isDown) {
              luffy.setVelocityY(speed);
            }

            // Ataque con Barra Espaciadora
            if (Phaser.Input.Keyboard.JustDown(wasd?.space || cursors?.space)) {
              const punchText = this.add.text(luffy.x + 20, luffy.y - 10, '👊 PISTOLA GUM-GUM!', {
                fontSize: '12px',
                color: '#ef4444',
                fontStyle: 'bold',
                fontFamily: 'monospace'
              });
              this.tweens.add({
                targets: punchText,
                y: luffy.y - 40,
                alpha: 0,
                duration: 800,
                onComplete: () => punchText.destroy()
              });
            }
          });
        }
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [currentLevel, subMap]);

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <div 
        ref={containerRef} 
        className="w-full max-w-[800px] h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border-4 border-amber-600 shadow-2xl shadow-black relative"
      />
      <div className="mt-2 text-[10px] font-mono text-slate-400 text-center">
        🕹️ MOTOR PHASER 3 ACTIVO • Usa WASD / Flechas para Moverte • Espacio para Atacar • Físicas Arcade 60FPS
      </div>
    </div>
  );
};

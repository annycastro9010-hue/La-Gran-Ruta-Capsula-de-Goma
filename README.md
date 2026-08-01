# 🏴‍☠️ La Gran Ruta: Cápsula de Goma

> **RPG de acción pixel-art estilo Zelda: Minish Cap basado en el arco Romance Dawn de One Piece**

🌐 **Juega en vivo:** [https://annycastro9010-hue.github.io/La-Gran-Ruta-Capsula-de-Goma/](https://annycastro9010-hue.github.io/La-Gran-Ruta-Capsula-de-Goma/)  
📦 **Repositorio:** [github.com/annycastro9010-hue/La-Gran-Ruta-Capsula-de-Goma](https://github.com/annycastro9010-hue/La-Gran-Ruta-Capsula-de-Goma)

---

## 🎮 Descripción

Un RPG de exploración top-down inspirado en **Zelda: Minish Cap** y **One Piece**, construido completamente en el navegador sin motores externos. Luffy debe escapar del barco de Alvida, rescatar a Koby, liberar a Zack "Tres Filos" y derrotar a los jefes de la Marina en 5 niveles únicos.

---

## 🗺️ Niveles

| # | Nivel | Jefe | Objetivo |
|---|-------|------|----------|
| 1 | **Sótano de Alvida** 🏴‍☠️ | Capitana Alvida | Encuentra la llave en (13,8), sube las escaleras en (13,2), derrota a Alvida |
| 2 | **Shellport** ⚓ | Comandante Hacha-Hierro | Busca la llave (14,8), recupera espadas de Zack (14,1), presiona botón para abrir rejas (8,5) |
| 3 | **Base Marina — Shells Town** ⚔️ | Capitán Morgan | Llave en (14,8), espadas de Zoro en (13,1), libera a Zoro en (8,4) |
| 4 | **Orange Town** 🤡 | Buggy el Payaso | Llave en (14,8), mapa del Grand Line en (13,1) |
| 5 | **Syrup Village** 🐈 | Capitán Kuro | Llave en (14,8), planos del Going Merry en (13,1) |

---

## 🕹️ Controles

### ⌨️ Teclado (PC / Laptop)
| Acción | Tecla |
|--------|-------|
| Mover | `W` `A` `S` `D` o flechas `↑ ↓ ← →` |
| **Gum-Gum Pistola** | `Espacio` |
| **Gum-Gum Metralleta** (10 Haki) | `E` |
| **Gum-Gum Látigo** (15 Haki) | `R` |
| **Giro Evasivo** | `Shift` |
| **Comer Carne** (curar HP) | `Q` |
| Avanzar diálogo | `Espacio` |

### 📱 Móvil / Táctil
Usa el **D-Pad** y los botones de ataque visibles en pantalla.

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Rol |
|-----------|---------|-----|
| **React** | 19 | UI y gestión de estado del juego |
| **TypeScript** | 5.x | Tipado seguro de toda la lógica |
| **Vite** | 6.4 | Bundler y servidor de desarrollo |
| **Tailwind CSS** | v4 | Estilos de UI (HUD, diálogos, controles) |
| **Framer Motion** | latest | Animaciones de entrada/salida de pantallas |
| **Lucide React** | latest | Iconos de la interfaz |

### Motor del Juego (custom — sin librerías externas)
| Sistema | Descripción |
|---------|-------------|
| **GameGrid (SVG)** | Renderizado del mapa en grilla CSS/SVG pixel-art |
| **Sprites SVG** | Personajes animados con `<rect>` pixel-art (sin `<circle>` para evitar crashes) |
| **Web Audio API** | Efectos de sonido y música ambiental sintetizada por zona (estilo GBA) |
| **Sistema de diálogos** | Overlay `fixed` con efecto typewriter, detección de expresión automática |
| **IA de enemigos** | Patrullaje por waypoints + chase mode cuando detectan al jugador |

### Deploy / CI-CD
| Herramienta | Uso |
|------------|-----|
| **GitHub Pages** | Hosting gratuito de producción |
| **GitHub Actions** | Deploy automático en cada `git push origin main` |
| **Vite Build** | Bundle de producción (`dist/`) |

---

## 📁 Estructura del Proyecto

```
La-Gran-Ruta/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: build → deploy a Pages automático
├── src/
│   ├── App.tsx                 # Estado central del juego, lógica principal
│   ├── types.ts                # Tipos TypeScript: Cell, Enemy, PlayerState, etc.
│   ├── components/
│   │   ├── GameGrid.tsx        # Renderizado del mapa y sprites en grilla
│   │   ├── GameHUD.tsx         # Barra de vida, haki, inventario
│   │   ├── DialogueBox.tsx     # Overlay cinematográfico de diálogos con expresiones
│   │   ├── ControlsOverlay.tsx # Panel de controles táctil/teclado (D-Pad + ataques)
│   │   ├── LuffySprite.tsx     # Sprite pixel-art animado de Luffy
│   │   ├── ZoroSprite.tsx      # Sprite pixel-art animado de Zack/Zoro
│   │   ├── MarineSprite.tsx    # Sprites de enemigos (Morgan, Alvida, Helmeppo)
│   │   ├── KobySprite.tsx      # Sprite de Koby
│   │   ├── AlvidaSprite.tsx    # Sprite de Alvida
│   │   └── NpcSprite.tsx       # NPCs del pueblo
│   ├── data/
│   │   └── maps.ts             # Plantillas de mapas, enemigos, todos los diálogos
│   ├── utils/
│   │   ├── sound.ts            # Web Audio API: efectos de sonido + música ambiental
│   │   └── pasher.ts           # Tema visual por nivel (colores, nombre de isla)
│   └── game/
│       └── PhaserGameContainer.tsx  # Contenedor experimental Phaser 3 (no activo)
├── vite.config.ts              # Config de Vite con base='/La-Gran-Ruta-Capsula-de-Goma/'
├── package.json
└── README.md                   # Este archivo
```

---

## 🚀 Cómo Actualizar y Publicar

```bash
# 1. Hacer cambios en el código
# 2. Verificar que no hay errores
npm run lint

# 3. Subir a GitHub (el deploy es automático)
git add .
git commit -m "Descripción de los cambios"
git push origin main

# 4. En ~60 segundos el juego estará actualizado en:
# https://annycastro9010-hue.github.io/La-Gran-Ruta-Capsula-de-Goma/
```

---

## 🧪 Desarrollo Local (opcional)

```bash
npm install
npm run dev
# → http://localhost:3000/La-Gran-Ruta-Capsula-de-Goma/
```

---

## 🎯 Próximas Mejoras Planeadas

- [ ] **Sprites animados** pixel-art con sprite sheets PNG (frames reales de animación)
- [ ] **Mapas más grandes** — exploración estilo Minish Cap con casas con interiores
- [ ] **Botones de presión** 🔘 y vasijas rompibles 🏺 en mazmorras
- [ ] **Minimapa** en esquina superior izquierda
- [ ] **Nami** — personaje jugable con habilidades de navegación
- [ ] **Efectos de clima** — lluvia en alta mar, niebla en mazmorras

---

## 🛡️ Legal

Este proyecto es una **parodia/fan game educativo** sin fines de lucro.  
Los nombres de personajes son variantes originales (Zack "Tres Filos", Hacha-Hierro, etc.).  
One Piece es propiedad de Eiichiro Oda / Shueisha.

<!-- LAST_DEPLOY --> `2026-08-01 17:01 UTC` · commit `f2e8b89 — fix: Implementar motionMock nativo para desterrar el 100% de errores removeChild y parpadeos de reconciliacion DOM`

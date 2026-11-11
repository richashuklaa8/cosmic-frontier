# 🚀 COSMIC FRONTIER
### Beyond the Known Universe

A 2D browser-based space exploration and survival game built with **JavaScript and Phaser 3**.

Explore unfamiliar worlds, collect resources, scan geological samples, decode mysterious signals, survive environmental hazards and complete five increasingly challenging missions.

All game graphics are generated procedurally, and sound effects and ambience are created using the Web Audio API.

---

## 🌌 Features

- **Five missions:** Explore different environments with unique objectives and challenges.
- **Space exploration:** Navigate planets, asteroid fields and fictional celestial environments.
- **Scanning mechanics:** Collect samples, activate signal beacons and stun enemy drones.
- **Survival systems:** Manage hull integrity, oxygen and energy.
- **Environmental hazards:** Avoid toxic vents, asteroid impacts, hostile drones and gravity wells.
- **Mission progression:** Unlock levels, earn stars and track achievements.
- **Dynamic audio:** Procedurally generated ambience, music and sound effects.
- **Science learning:** Discover real astronomical and scientific facts alongside clearly labelled game fiction.
- **Persistent progress:** Save unlocked missions, achievements and settings locally.

## 🪐 Missions

| Level | Mission | Main objective |
|---|---|---|
| 01 | The First Contact | Scan geological samples |
| 02 | Crystal Valley | Collect energy crystals |
| 03 | The Lost Signal | Decode a beacon sequence |
| 04 | Asteroid Field | Navigate an asteroid field |
| 05 | The Final Frontier | Complete combined objectives |

## 🎮 Controls

| Action | Control |
|---|---|
| Move | W, A, S, D |
| Alternative movement | Arrow keys |
| Scan pulse | SPACE or mouse click |
| Pause / Resume | P or ESC |

## ⚙️ Technology Stack

- **HTML5** — Game structure
- **CSS3** — Interface and styling
- **JavaScript** — Game logic and interactions
- **Phaser 3.80.1** — 2D game framework
- **Web Audio API** — Procedural audio
- **Canvas API** — Procedural graphics generation
- **LocalStorage** — Persistent game progress

## 💻 Getting Started

### Prerequisites

- A modern web browser
- Python 3 (for running a local development server)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/richashuklaa8/cosmic-frontier.git
   ```

2. Open the project directory:

   ```bash
   cd cosmic-frontier
   ```

3. Start a local server:

   ```bash
   py -m http.server 8000
   ```

4. Open your browser and visit:

   `http://localhost:8000`

**Note:** Phaser 3 is loaded from CDN by default. An optional local fallback can be placed at `lib/phaser.min.js` for offline use.

## 📁 Project Structure

```text
cosmic-frontier/
│
├── index.html
├── style.css
├── main.js
├── audio.js
├── levels.js
├── ui.js
│
├── scenes/
│   ├── BootScene.js
│   ├── MenuScene.js
│   └── GameScene.js
│
└── lib/
    └── phaser.min.js  (optional)
```

### Core modules

- `main.js` — Phaser configuration and game initialization.
- `levels.js` — Mission definitions, objectives, facts and achievements.
- `ui.js` — Interface, game state, progression and local save system.
- `audio.js` — Procedural sound and music.
- `BootScene.js` — Procedural texture and environment generation.
- `MenuScene.js` — Animated main menu environment.
- `GameScene.js` — Core gameplay, movement, physics, hazards and mission logic.

## 🔬 Science vs Fiction

COSMIC FRONTIER combines educational science references with fictional gameplay elements.

Science cards distinguish between:
- **REAL SCIENCE:** Based on established scientific knowledge.
- **GAME FICTION:** Invented concepts used for the game's exploration and storytelling.

## 🤖 Development

Developed through hands-on experimentation and AI-assisted development using Claude.

The project explores browser-based game development, Phaser 3, procedural graphics, physics, interactive interfaces and game-state management.

## 🛠️ Future Improvements

- Touch-friendly mobile controls.
- Additional missions and environments.
- More gameplay challenges and exploration mechanics.
- Further accessibility and performance improvements.



**Explore. Discover. Survive.**

*The universe is waiting.* 🌌

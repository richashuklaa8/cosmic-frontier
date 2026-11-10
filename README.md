# COSMIC FRONTIER: Beyond the Known Universe
A complete 2D space exploration / survival game built with Phaser 3, HTML5, CSS3 and JavaScript.
All graphics and audio are generated procedurally: there are no asset files.

## Structure
```
cosmic-frontier/
  index.html            screens (menu, missions, settings, pause, level/game-over/victory) + HUD markup
  style.css             glassmorphism UI
  main.js               Phaser game config
  audio.js              procedural WebAudio (ambience, music, SFX)
  levels.js             the 5 levels, facts vs fiction, achievements
  ui.js                 DOM UI, saves (localStorage), pause/flow control
  scenes/BootScene.js   texture generation + real loading progress
  scenes/MenuScene.js   animated menu backdrop
  scenes/GameScene.js   gameplay
  assets/               (empty: everything is generated)
  lib/phaser.min.js     OPTIONAL offline copy (see below)
```
## Run locally
Phaser 3.80.1 loads from cdnjs. For offline use, download that file into `lib/phaser.min.js` (a fallback is already wired in index.html).
```
cd cosmic-frontier
python3 -m http.server 8000      # or: npx serve .
```
Open http://localhost:8000

## Controls
WASD / Arrows move · SPACE or mouse click: scan pulse (15 energy) · P / Esc: pause

## Mechanics
- Hull, oxygen (constant drain), energy (regenerates; crystals refill; scan costs 15).
- Scan pulse: collects samples, stuns drones 2.5s, activates beacons (puzzle levels).
- Hazards: pulsing toxic vents, chasing drones, drifting asteroids (inertial flight in L4), gravity wells (L5). 1s invulnerability after a hit.
- Finish all objectives, a warp gate opens; enter it to complete the level.
- Score = pickups + time bonus + hull bonus + oxygen bonus. Stars: finish, hull ≥ 50%, beat par time.
- Levels unlock sequentially; progress, stars, achievements and audio settings are saved.
- Science cards are tagged REAL SCIENCE or GAME FICTION.

## Test checklist
- [ ] Menu: PLAY, HOW TO PLAY, MISSIONS, SETTINGS, sound toggle all respond
- [ ] Missions: only level 1 is open on a fresh save; others show a lock
- [ ] Brief screen shows, BEGIN MISSION starts play; WASD/arrows move, SPACE/click scans
- [ ] Oxygen drains; canister +30; medkit +25; crystals add energy
- [ ] Vents, drones, asteroids and wells damage you; hull 0 or oxygen 0 gives game over; TRY AGAIN restarts
- [ ] L1 scan 5 samples → gate → complete screen; Next unlocks L2
- [ ] L3 wrong beacon order resets; right order completes
- [ ] L5 completion shows the VICTORY screen
- [ ] P/Esc pauses; resume, restart, settings and main menu work from pause
- [ ] Volume sliders and Sound/Music toggles work; browser console shows no errors

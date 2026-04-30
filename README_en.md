# Code Pet

<p align="center">
  <img src="media/icon.png" alt="Code Pet Icon" width="128" />
</p>

<p align="center">
  <strong>An Interactive Desktop Pet Companion Living in VS Code Explorer</strong>
</p>

<p align="center">
  <a href="README_en.md">English</a> · <a href="README_cn.md">中文</a>
</p>

---

## 📖 About

Code Pet is an interactive desktop pet extension for VS Code. It spawns a cute animated character in your editor's Explorer sidebar, keeping you company while you code. You can drag it around, give it headpats, watch it react to your typing, and switch between different room backgrounds.

## ✨ Features

| Feature                        | Description                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| 🎭**Explorer Companion** | Code Pet appears in a dedicated sidebar view without taking over your editor tabs          |
| 👆**Direct Interaction** | Drag the pet around, click for headpats, or press `Enter`/`Space` when it's focused    |
| ⌨️**Work Reactions**   | Code Pet waves when spawned and reacts to your typing with excited or surprised animations |
| 😴**Idle Behavior**      | Gets bored after sustained inactivity, then eventually falls asleep                        |
| 🖼️**Room Backgrounds** | 4 bundled beautiful backgrounds, switchable via controls in the pet view                   |
| 🔊**Reaction Sounds**    | Short sound effects for headpats, pickup, drops, and drag movements                        |
| 🔄**Position Reset**     | Quickly reset the pet's position via Command Palette or the `R` button                   |

## 🎮 Pet Interaction System

### Interactive Animations (9 types)

1. **idle** - Calm standing and breathing
2. **bored** - Gets bored after 45 seconds of inactivity
3. **sleep** - Falls asleep after 2 minutes 15 seconds of inactivity
4. **wave** - Greeting animation when spawned
5. **cheering** - Excited reaction to typing
6. **wow** - Surprised reaction to typing
7. **headpat** - Happy reaction when clicked ❤️
8. **dragged** - Animation while being dragged
9. **dropRecovery** - Recovery animation after being dropped

### Interaction Methods

| Action                             | Trigger                                    | Effect                                                   |
| ---------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| 🫳**Headpat**                | Click on the pet                           | Plays headpat animation + happy sound                    |
| 🖱️**Drag**                 | Hold and drag the pet                      | Follows mouse, plays dragged animation + startled sound  |
| 🪂**Drop**                   | Release while dragging                     | Pet falls with gravity + landing animation and sound     |
| ⌨️**Keyboard Interaction** | Press `Enter` or `Space` while focused | Same as clicking (headpat)                               |
| 🚶**Autonomous Wandering**   | During idle time                           | Pet randomly walks left and right in the view            |
| 💬**Typing Reaction**        | Type in the editor                         | Alternates between cheering/wow animations (3s cooldown) |

### Sound System (7 sounds)

| Sound                    | Trigger                     | Cooldown |
| ------------------------ | --------------------------- | -------- |
| 🎵**happy**        | Headpat                     | 200ms    |
| 😱**startled**     | Drag start                  | 700ms    |
| 💥**dropped1/2**   | Landing (randomly selected) | 700ms    |
| 😰**apprehensive** | Dragged far away            | 1000ms   |
| 🤔**curious**      | Reserved for future use     | 700ms    |

## 🚀 Quick Start

### Method 1: Install from VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for "Code Pet"
4. Click "Install"

### Method 2: Local Development Installation

1. Clone or download this project

```bash
git clone https://github.com/zhanshuo-art/code-pet.git
cd code-pet
```

2. Install dependencies

```bash
npm install
```

3. Compile the extension

```bash
npm run compile
```

4. Open the project folder in VS Code and press `F5` to start debugging
5. In the Extension Development Host window, press `Ctrl+Shift+P` and type `Code Pet: Spawn Pet`

## 🎯 Usage Guide

### Spawning the Pet

- **Command Palette**: `Ctrl+Shift+P` → `Code Pet: Spawn Pet`
- **Status Bar**: Click the `✨ Code Pet` button in the bottom status bar
- **Sidebar**: Open Explorer - the pet automatically appears in the `CODE PET` panel

### Control Buttons

Hover over the pet view to reveal 4 control buttons:

| Button | Function                      |
| ------ | ----------------------------- |
| `‹` | Switch to previous background |
| `›` | Switch to next background     |
| `S`  | Mute/unmute sounds            |
| `R`  | Reset pet position to center  |

### Command List

| Command                          | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| `Code Pet: Spawn Pet`          | Reveals the pet in the Explorer view              |
| `Code Pet: Reset Pet Position` | Moves the pet back to the default center position |

## ⚙️ Configuration

Search for "Code Pet" in VS Code settings to find these options:

| Setting                    | Type        | Default  | Description                        |
| -------------------------- | ----------- | -------- | ---------------------------------- |
| `code-pet.sound.enabled` | `boolean` | `true` | Enable/disable pet reaction sounds |
| `code-pet.sound.volume`  | `number`  | `45`   | Sound volume (0-100)               |

How to open settings:

- `Ctrl+,` → Search "Code Pet"
- Or edit `settings.json` directly:

```json
{
  "code-pet.sound.enabled": true,
  "code-pet.sound.volume": 45
}
```

## 🛠️ Technical Details

### Project Structure

```
Code Pet/
├── src/
│   └── extension.ts              # TypeScript backend (430 lines)
├── media/
│   ├── qutedva.js                # Frontend WebView logic (1,060 lines)
│   ├── qutedva.css               # Styling and animations (426 lines)
│   ├── icon.png                  # Extension icon
│   ├── audio/                    # 7 sound effect files
│   │   ├── sound-happy.mp3
│   │   ├── sound-startled.mp3
│   │   ├── sound-land1.mp3
│   │   ├── sound-land2.mp3
│   │   ├── sound-apprehensive.mp3
│   │   ├── sound-apprehensive2.mp3
│   │   └── sound-curious.mp3
│   └── images/
│       ├── pet/
│       │   ├── manifest.json     # Animation definitions
│       │   └── sheet*.png        # 100 sprite frames (50+50)
│       └── backgrounds/          # 4 background images
│           ├── bg-01.png
│           ├── bg-02.png
│           ├── bg-03.png
│           └── bg-04.png
├── dist/
│   └── extension.js              # Compiled extension bundle
└── package.json                  # Project configuration
```

### Sprite Assets

- **Total Frames**: 100 frames (sheet1: 50 frames, sheet2: 50 frames)
- **Naming Convention**: `sheet{1|2}-r{1-5}-c{1-5}.png`
- **Frame Size**: 288×288 pixels (transparent PNG)
- **Animation Config**: `media/images/pet/manifest.json`

The manifest.json contains:

- `frames`: Catalog of all sprite frames with coordinates
- `source`: Cropping region of each frame from the original sheet
- `pivot`: Transform origin for each frame (used by animation and physics)
- `animations`: Named animation sequences defined from the frame catalog

### Physics Engine Parameters

```javascript
// Gravity system
gravityAcceleration: 0.0018      // Gravity acceleration
maxVelocity: 1.1                 // Maximum fall speed
floorInsetRatio: 0.46            // Floor inset ratio

// Drag feel
positionLerp: 0.24               // Position smoothing factor
anchorLerp: 0.055                // Head anchor smoothing factor
apprehensiveDistancePx: 118      // Distance to trigger apprehensive sound

// Wandering behavior
wanderSpeed: 0.034 px/ms         // Wandering movement speed
minDelayMs: 4000                 // Minimum wait time
maxDelayMs: 10000                // Maximum wait time
```

### Development Commands

| Task                     | Command                    |
| ------------------------ | -------------------------- |
| Type-check and bundle    | `npm run compile`        |
| Production bundle        | `npm run package`        |
| Full local verification  | `npm run ci`             |
| Lint                     | `npm run lint`           |
| Format                   | `npm run format`         |
| Check formatting         | `npm run format:check`   |
| Regenerate sprite assets | `npm run process-assets` |
| Package VSIX             | `npm run vsix`           |

## 🐛 Troubleshooting

**Q: Can't see the pet panel after pressing F5 for debugging**
A: Click the Explorer icon on the left sidebar, the panel might be collapsed - scroll down to find the `CODE PET` section.

**Q: Pet appears but has no background (solid color background)**
A: This is normal if the background images haven't been replaced yet. Replace the images in `media/images/backgrounds/`.

**Q: Code changes don't take effect after restarting debug**
A: Run `npm run compile` in the terminal first, then press `Ctrl+Shift+F5` to restart debugging.

**Q: No sound effects**
A: Check if the `S` button in the panel is in mute state, and also check your system volume settings.

**Q: How to quickly reload the extension without closing the debug window**
A: In the Extension Development Host window, press `Ctrl+Shift+P` → `Developer: Reload Window`.

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

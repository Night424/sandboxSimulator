# GUI Developer
Goal: Build a clean Electron interface with real-time logging, malware sim launcher, and basic file access.

## Phase 1: Setup & Foundation
Set up Electron project (npm init, install electron, folder structure)

Create main window (800x600 or fullscreen, fixed size, dark theme)

Add sidebar with placeholder buttons:
 Launch Simulated Malware
 View Logs
 Open Quarantine Folder

Implement basic dark CSS with terminal-style aesthetics(e.g. green on black or white on black)

## Phase 2: Core Features
Connect sidebar buttons to backend logic
 Launch Sim: call a fakevirus.py or shell command
 View Logs: read and display live-updated log file
 Open Folder: use shell.openPath() to open a specific directory

Set up IPC between renderer and main for executing malware sim securely

Display status or logs in main panel (<pre> or scrollable text area)

## Phase 3: Real-time Log Viewer
Use Node.js fs.watch() or polling to detect log changes
Auto-update log panel with new lines (tail-like view)
Add toggle to pause/resume auto-refresh
Style the log viewer (scroll, word-wrap, monospace font)

## Phase 4: Polish and Extras
Improve CSS with animations (glow, fade-in text)
Add simple error/success alerts (e.g. for failed launch)
Create basic app icon (terminal/skull/purple theme)
Optionally: Add a “Theme” toggle or titlebar customization (frameless, draggable)

## Deliverables
main.js – Electron setup and app entry

index.html – UI layout (sidebar + main panel)

style.css – Dark theme and terminal look

renderer.js – UI logic: button handlers, log display

log.txt – sample or real-time updated logs
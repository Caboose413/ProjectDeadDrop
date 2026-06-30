# Project Dead Drop
Interactive ARG prototype built as a static web page.

## Play Locally
https://Caboose413.github.io/ProjectDeadDrop/

## Requirements

Project Dead Drop currently uses Star Citizen locations and in-game evidence as part of the investigation, so Star Citizen access is required for the full intended experience. A future standalone play path is planned so the ARG can be played without needing Star Citizen.

## Current Features

- Static terminal ARG flow with in-world command discovery.
- CCTV fragments now play recovered video with an accompanying recovery tone.
- Chapter-aware core modules keep future depots and Operator context scoped to recovered story layers.

## Project Layout

- `index.html` and `styles.css` stay at the project root for the static site entrypoint.
- `core/` contains the browser modules that drive commands, chapters, rewards, media, and Operator chat.
- `Audio/` and `Videos/` contain playable evidence assets.
- `docs/` contains local design/lore notes.
- `logs/` contains local launcher output and is ignored by Git.

## Local Operator AI

Run the local bridge before using `operator <message>` or `cd operator` in the terminal:

```powershell
G:\LLM\NPCAi\operator-server.cmd
```

The page calls `http://127.0.0.1:8787/operator` when available and falls back
to static in-world Operator replies when the bridge is offline. The Operator
channel is part of the terminal flow through `ls`, `cd operator`, `operator`,
`op`, and `contact`.

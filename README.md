<img align=center src="README_ASSETS/Cool Text - Iron OS 516058731425365.png" alt="IRON OS"></img>

## An Web based OS with the tech of *Stark* and Power of *IRON*

[Hero picture](README_ASSETS/Screenshot 2026-10-15 163357.png)

# Live Demo

>>> [Click Here!](https://ironman-themed-webos.vercel.app/)

# Quick Start
if you are techie or a programmer, and want to start a development server to make your own *IRON OS*.

👇Here is the guide

___

```bash
npx serve . 
# npx can only be used when you have node.js
# opens a development server on http://localhost:3000 
```
![npx demo](README_ASSETS/Node-Server-Demo.gif)

___

```bash
python -m http.server 8000
# works only with python
# opens a development server on http://localhost:8000
```
![python_server](README_ASSETS/Python-Server-Demo.gif)

___

# Features

- A Welcome window(Just want to brag bout' it)

- IronBook stores all your thoughts in one place. Got a plan of attack...No, just attack you don't need to store it, but when it comes to actual thoughts and plan...open Ironbook.

- IronCalc when you can't prove 2 + 2 = 5(Oh it's not😅).

- Time and Workstation Info on top of your screen.

- Iron PC metrics at the top

- A Music Player so you can listen to all  the Iron favourites

- Background playback like spotify in Iron Player

- A Terminal so, all the "BTW, I use arch" people can navigate the OS

- Resizable Windows

- Thats it!

___

# HOW IT WORKS

Static site i.e. no framework, no build. `index.html` = desktop, `style.css` = theme, `script.js` = OS.

```mermaid
flowchart TD

subgraph group_desktop["Desktop"]
  node_desktop_ui["Desktop UI<br/>[index.html]"]
  node_theme["Desktop Theme<br/>[style.css]"]
  node_clock["Clock<br/>[script.js]"]
  node_metrics["System Metrics<br/>[script.js]"]
end

subgraph group_windows["Window System"]
  node_window_controls["Window Controls<br/>[script.js]"]
  node_welcome["Welcome Window<br/>[index.html]"]
end

subgraph group_apps["Built-in Apps"]
  node_ironbook["IronBook Notes<br/>[script.js]"]
  node_ironcalc["IronCalc<br/>[script.js]"]
  node_terminal["Jarvis Terminal<br/>[script.js]"]
  node_music["Music Player<br/>[script.js]"]
end

subgraph group_runtime["Browser Runtime"]
  node_audio_tracks["Audio Tracks"]
  node_browser_storage[("Local Storage")]
  node_browser["Web Browser"]
end

node_user(("User"))

node_user -->|"opens"| node_desktop_ui
node_desktop_ui -.->|"shows"| node_clock
node_desktop_ui -.->|"shows"| node_metrics
node_desktop_ui -->|"provides window"| node_welcome
node_desktop_ui -->|"launches"| node_ironbook
node_desktop_ui -->|"launches"| node_ironcalc
node_desktop_ui -.->|"launches"| node_terminal
node_desktop_ui -.->|"launches"| node_music
node_desktop_ui -->|"styled by"| node_theme
node_desktop_ui -.->|"uses"| node_window_controls
node_ironbook -->|"reads and writes notes"| node_browser_storage
node_music -->|"loads tracks"| node_audio_tracks
node_browser -->|"renders"| node_desktop_ui

click node_desktop_ui "https://github.com/yobo-dance/ironman-themed_webos/blob/main/index.html"
click node_theme "https://github.com/yobo-dance/ironman-themed_webos/blob/main/style.css"
click node_clock "https://github.com/yobo-dance/ironman-themed_webos/blob/main/script.js"
click node_metrics "https://github.com/yobo-dance/ironman-themed_webos/blob/main/script.js"
click node_window_controls "https://github.com/yobo-dance/ironman-themed_webos/blob/main/script.js"
click node_welcome "https://github.com/yobo-dance/ironman-themed_webos/blob/main/index.html"
click node_ironbook "https://github.com/yobo-dance/ironman-themed_webos/blob/main/script.js"
click node_ironcalc "https://github.com/yobo-dance/ironman-themed_webos/blob/main/script.js"
click node_terminal "https://github.com/yobo-dance/ironman-themed_webos/blob/main/script.js"
click node_music "https://github.com/yobo-dance/ironman-themed_webos/blob/main/script.js"
click node_audio_tracks "https://github.com/yobo-dance/ironman-themed_webos/tree/main/Test_playlist"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_desktop_ui,node_theme,node_clock,node_metrics,node_user toneBlue
class node_window_controls,node_welcome toneAmber
class node_ironbook,node_ironcalc,node_terminal,node_music toneMint
class node_audio_tracks,node_browser_storage,node_browser toneRose
```

# HALL OF ARMOR — CREDITS

| Suit Part | Credit |
|---|---|
| Theme | Iron Man / Stark Industries (Marvel) |
| Fonts | `Orbitron` + `Caacupe One` via Google Fonts|
| Art | `assets/` wallpapers, icons, chibi overlay, Most made by me except that chibi overlay and the wallpaper|
| Stack | Vanilla HTML/CSS/JS, zero deps — Vercel deploy, Mermaid diagram |

# Badges

<p align=center>
<img alt="GitHub followers" src="https://img.shields.io/github/followers/YOBO-DANCE">
<img alt="GitHub forks" src="https://img.shields.io/github/forks/YOBO-DANCE/IRONMAN-THEMED_WEBOS">
<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/YOBO-DANCE/IRONMAN-THEMED_WEBOS">
<img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fironman-themed-webos.vercel.app%2F">
</p>

___

*Iron Man "Doth mother know you weareth her drapes?"*<br>
*Thor(Point Break) ...*

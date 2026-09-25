<img align=center src="README_ASSETS/Cool Text - Iron OS 516058731425365.png" alt="IRON OS"></img>

## An Web based OS with the tech of *Stark* and Power of *IRON*

![Hero picture](<README_ASSETS/Screenshot 2026-09-06 180519.png>)

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

- Thats it!

___

# HOW IT WORKS

Static site - no framework, no build. `index.html` = desktop, `style.css` = theme, `script.js` = OS.

```mermaid
graph TD
    A[index.html] --> B[TopBar<br/>Clock #Current_Time]
    A --> C[StartIcons<br/>3 icons]
    C --> D[WelcomeWindow #WelcomeWindow]
    C --> E[IronBook #IronPad]
    C --> F[IronCalc #IronCalc]
    B -.-> G[script.js:2<br/>setInterval]
    D & E & F -.-> H[script.js:7<br/>makeDraggable]
    D & E & F -.-> I[script.js:34<br/>open/closeWindow<br/>setupIcon]
    E -.-> J[script.js:63<br/>IronBook<br/>localStorage ironbook-notes]
    F -.-> K[script.js:150<br/>IronCalc<br/>disp/code + DEG/RAD]
    A -.-> L[style.css:14 .window base]
    F -.-> M[style.css:224<br/>Calculator Stark theme]
    J --> N[(localStorage)]
    K --> N
```

# HALL OF ARMOR — CREDITS

| Suit Part | Credit |
|---|---|
| Theme | Iron Man / Stark Industries (Marvel) |
| Fonts | `Orbitron` + `Caacupe One` via Google Fonts (`style.css:1`) |
| Art | `assets/` wallpapers, icons, chibi overlay (`style.css:88` — pngtree, rest artist-unknown) |
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

# ILLUSIVE STUDIO — Interactive Cinematic Portfolio Reel

> A production-ready, spatial interactive portfolio reel for **ILLUSIVE STUDIO**, a professional video editor.

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat&logo=greensock&logoColor=white)](https://greensock.com/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-000000?style=flat)](https://github.com/darkroomengineering/lenis)

---

## 🎬 Core Concept: Pinned Cinematic Camera Architecture

This is not a conventional portfolio website with generic sections. **The portfolio itself is an interactive cinematic reel.** The visitor controls a 3D camera traveling through the editor's world using scroll.

- **SCROLL = CAMERA MOVEMENT**
- **CLICK = MEDIA INTERACTION**
- **PINNING = CAMERA CONTROL MECHANISM** (gives each camera movement enough scroll distance to control comfortably)

The entire experience is continuous and structured as 8 pinned cinematic sequence chapters:

```
01 EDITOR & DESK ──► 02 TIMELINE / EDIT WORLD ──► 03 THE SHOWREEL ──► 04 STUDIO REVEAL
                                                                               │
                                                                               ▼
08 FINAL CTA & BLACK ◄── 07 ABOUT ◄── 06 BEHIND THE EDIT ◄── 05 PROJECTS (CRIMEXBT)
```

---

## 📽️ The 8 Pinned Cinematic Sequences

| Shot | Pin Distance | Scene Name | Description | Key Component |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `~250vh` | **The Editor & Desk** | Starts immediately on the editor seated at desk (not black!). `ILLUSIVE STUDIO` title overlays and fades out. Editor stretches, arm lowers, camera accelerates toward monitor. | `src/components/scenes/Scene01Editor.tsx` |
| **02** | `~300vh` | **Monitor / Editing World** | Breaches monitor glass into 3D NLE tracks (`V1-V3`, `A1-A2`), traverses audio waveforms and post milestones, locking onto target clip. | `src/components/scenes/Scene02Timeline.tsx` |
| **03** | `~200vh` | **The Showreel** | Hero clip balloons into dominant 16:9 MP4 showreel. Custom controls & audio on play. Camera scroll lock holds while watching. | `src/components/scenes/Scene03Showreel.tsx` |
| **04** | `~250vh` | **Studio Reveal** | Camera pulls backward in 3D: reel shrinks to monitor, revealing full edit suite, desk, and client stations. | `src/components/scenes/Scene04PullOut.tsx` |
| **05** | `~300vh` | **Project Destinations** | Camera navigates through studio toward `CRIMEXBT` monitor destination; dominant interactive project playback and editorial dossier. | `src/components/scenes/Scene05Projects.tsx` |
| **06** | `~250vh` | **Behind the Edit (Process)** | Travel through 6 spatial milestones: `RAW` $\to$ `EDIT` $\to$ `MOTION` $\to$ `SOUND` $\to$ `COLOR` $\to$ `FINAL` inside the studio world. | `src/components/scenes/Scene06Process.tsx` |
| **07** | `~200vh` | **The Person Behind the Timeline** | Pinned camera at editorial craft statement, philosophy, completed edit metrics & software toolkit. | `src/components/scenes/Scene07About.tsx` |
| **08** | `~200vh` | **Start a Project $\to$ True Black** | `GOT FOOTAGE?` $\to$ `LET'S MAKE SOMETHING OUT OF IT.` $\to$ `START A PROJECT` button $\to$ camera moves into deep space and fades to **TRUE BLACK**! | `src/components/scenes/Scene08CTA.tsx` |

---

## 🛠️ Architecture & Features

- **Pinned Cinematic Camera Stages**: Pinned ScrollTriggers across ~1950vh total scroll depth provide ample scrub precision for every camera move.
- **Immediate Visual Start**: The website starts immediately in the editor's suite with title overlay fading out as scroll begins (no opening black gap).
- **True Black Finale**: "Black is the end, not the intro." Screen fades to pitch black exclusively after the Scene 08 CTA.
- **Interpolated WebP Sequences**: `ScrollFrameSequence` uses a `requestAnimationFrame` damping loop between target scroll progress and current frame, preventing frame tearing or flickering.
- **Cinematic Video Engine**: HTML5 video with custom scrub controls, SMPTE timecodes, real audio playback, and scroll pause support.
- **Hidden Admin Gate**: Subtle "Developer" button in footer; 5 clicks opens the Admin Gate with access restricted to `yhanlhester@gmail.com`.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/illusivestudioph/Cinematic-Portfolio.git
cd Cinematic-Portfolio

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## 📄 License

Private portfolio for ILLUSIVE STUDIO. All rights reserved.

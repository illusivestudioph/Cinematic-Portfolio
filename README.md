# ILLUSIVE STUDIO — Interactive Cinematic Portfolio Reel

> A production-ready, spatial interactive portfolio reel for **ILLUSIVE STUDIO**, a professional video editor.

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat&logo=greensock&logoColor=white)](https://greensock.com/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-000000?style=flat)](https://github.com/darkroomengineering/lenis)

---

## 🎬 Core Concept: The 7-Beat Continuous Cinematic Sequence

This is not a conventional portfolio website. **The portfolio itself is an interactive cinematic reel.** The visitor controls a 3D camera traveling through the editor's world using scroll.

- **SCROLL = CAMERA MOVEMENT**
- **CLICK = MEDIA INTERACTION**
- **SECTION PINNING = CAMERA CONTROL MECHANISM** (provides comfortable scroll distance for every cinematic movement)

The website experience is substantially longer (~2000vh total scroll depth). The footer is reached only after experiencing all 7 beats:

```
STATIC PORTRAIT (BEAT 01)
  │
  ▼
BREAK FRAME & SIT AT DESK (BEAT 02)
  │
  ▼
CAMERA PUSHES TO MONITOR & DAVINCI TIMELINE (BEAT 03)
  │
  ▼
REAL SHOWREEL MONTAGE (BEAT 04)
  │
  ▼
DECONSTRUCTION (REWIND / NODE TREE / RAW LOG) (BEAT 05)
  │
  ▼
CAMERA PULLBACK TO DESK / EXPORT / LOOK INTO CAMERA / CTA (BEAT 06)
  │
  ▼
TURN BACK TO MONITOR / SILHOUETTE / FOOTER FADE (BEAT 07)
```

---

## 📽️ The 7 Cinematic Beats

| Beat | Pin Distance | Title | Cinematic Choreography | Component |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `~250vh` | **Static Illusion** | Opens immediately on the editor completely still on the **RIGHT**, clean negative space on the **LEFT** with `ILLUSIVE STUDIO` title ident. No black opening. | `src/components/scenes/Beat01StaticIllusion.tsx` |
| **02** | `~300vh` | **Breaking the Frame** | Blink $\to$ break pose $\to$ pull chair $\to$ sit at desk in the edit suite. | `src/components/scenes/Beat02BreakFrame.tsx` |
| **03** | `~350vh` | **The Catalyst** | Camera pushes over the shoulder $\to$ keyboard shortcut trigger $\to$ DaVinci Resolve timeline fills monitor. | `src/components/scenes/Beat03Catalyst.tsx` |
| **04** | `~250vh` | **Showreel Peak** | Monitor expands into the user's **REAL showreel MP4** $\to$ fullscreen montage with audio & custom controls. | `src/components/scenes/Beat04ShowreelPeak.tsx` |
| **05** | `~350vh` | **Deconstruction** | Finished edit rewinds $\to$ layers strip away $\to$ DaVinci node tree $\to$ color grade $\to$ audio stems $\to$ raw sensor rushes. | `src/components/scenes/Beat05Deconstruction.tsx` |
| **06** | `~300vh` | **CTA Anchor** | Camera pulls back to original desk composition $\to$ editor presses Export $\to$ looks directly at camera $\to$ CTA appears in **LEFT negative space**. | `src/components/scenes/Beat06CTAAnchor.tsx` |
| **07** | `~200vh` | **Footer Fade** | Editor turns back to monitor $\to$ becomes silhouette $\to$ bottom gradually darkens $\to$ seamlessly becomes the footer with subtle Developer trigger. | `src/components/scenes/Beat07FooterFade.tsx` |

---

## 🛠️ Architecture & Performance

- **Pinned Camera Rig**: 3D perspective (`1200px`) stage with film grain, dynamic anamorphic lens flares, CRT scanlines, and vignette.
- **Master Normalized Timeline**: Single source of truth (`src/config/timeline.ts`) managing all 7 beats with cubic interpolation and ample scrub distance (~2000vh).
- **Smooth Physics Scrolling**: Integrated Lenis smooth scroll and GSAP `ScrollTrigger` scrubbing over the full sequence.
- **Cinematic Video Engine**: Real MP4 playback with custom controls, unmuted audio upon play, and scroll-locking support during playback.
- **Interpolated WebP Sequences**: `ScrollFrameSequence` uses a `requestAnimationFrame` damping loop between target scroll progress and rendered canvas frame, eliminating frame tearing or flashing.
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

# ILLUSIVE STUDIO — Interactive Cinematic Portfolio Reel

> A production-ready, spatial interactive portfolio reel for **ILLUSIVE STUDIO**, a professional video editor.

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat&logo=greensock&logoColor=white)](https://greensock.com/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-000000?style=flat)](https://github.com/darkroomengineering/lenis)

---

## 🎬 Core Concept

This is not a conventional portfolio website with generic sections. **The portfolio itself is an interactive cinematic reel.** The visitor controls a 3D camera traveling through the editor's world using scroll.

- **SCROLL = CAMERA MOVEMENT**
- **CLICK = MEDIA INTERACTION**

The entire experience is continuous and structured as 12 progressive shots:

```
01 IDENT ──► 02 THE EDITOR ──► 03 STRETCH/MONITOR ──► 04 ENTER THE EDIT ──► 05 TIMELINE TRAVEL
                                                                                   │
                                                                                   ▼
10 PROCESS ◄── 09 SELECTED WORK ◄── 08 STUDIO PULLOUT ◄── 07 SHOWREEL ◄── 06 ENTER FOOTAGE
     │
     ▼
11 ABOUT ──► 12 FINAL CTA ──► [TRUE BLACK]
```

---

## 📽️ The 12 Continuous Shots

| Shot | Time | Scroll % | Scene Name | Description | Key Component |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `0:00–0:05` | `0–5%` | **Studio Ident** | Starts pitch black $\to$ grand `ILLUSIVE STUDIO` typography $\to$ fades out completely. No permanent branding header. | `src/components/scenes/Scene01Ident.tsx` |
| **02** | `0:05–0:15` | `5–15%` | **The Editor** | Dark edit room revealed with acoustic diffusers, dual grading monitors, desk, and slow dolly towards the editor. | `src/components/scenes/Scene02Editor.tsx` |
| **03** | `0:15–0:25` | `15–25%` | **The Stretch & Monitor** | Editor stretches arm upward, arm lowers back down, camera accelerates directly into the monitor screen. | `src/components/scenes/Scene03Stretch.tsx` |
| **04** | `0:25–0:40` | `25–40%` | **Enter the Edit** | Breaches monitor into 3D NLE tracks (`V1`, `V2`, `V3`, `A1`, `A2`, `A3`), audio waveforms, playhead, timecode, adjustment layers. | `src/components/scenes/Scene04EditWorld.tsx` |
| **05** | `0:40–0:52` | `40–52%` | **Travel Through Timeline** | Camera traverses `RAW FOOTAGE` $\to$ `CUTS` $\to$ `B-ROLL` $\to$ `AUDIO` $\to$ `MOTION` $\to$ `COLOR`, locking onto target clip. | `src/components/scenes/Scene05TimelineTravel.tsx` |
| **06** | `0:52–1:00` | `52–60%` | **Enter Selected Footage** | Selected clip becomes enormous, surrounding timeline drops into deep dark, camera punches into footage horizon. | `src/components/scenes/Scene06EnterFootage.tsx` |
| **07** | `1:00–1:20+`| `60–72%` | **The Showreel** | Dominant high-definition visual ($85\text{--}100\%$ viewport). Custom player with unmuted audio playback on user play. Camera scroll lock holds while watching. | `src/components/scenes/Scene07Showreel.tsx` |
| **08** | `1:20–1:30` | `72–80%` | **Pull Out into Studio** | Holds final reel frame, camera pulls backward in 3D, revealing the reel playing on a large monitor in the studio environment. | `src/components/scenes/Scene08PullOut.tsx` |
| **09** | `1:30–1:45` | `80–90%` | **Selected Work** | Spatial project corridor. Dominant destination: `CRIMEXBT` with interactive video and editorial dossier. | `src/components/scenes/Scene09Projects.tsx` |
| **10** | `1:45–1:58` | `90–96%` | **Behind the Edit** | 6 post-production milestones: `RAW` $\to$ `EDIT` $\to$ `MOTION` $\to$ `SOUND` $\to$ `COLOR` $\to$ `FINAL`. | `src/components/scenes/Scene10Process.tsx` |
| **11** | `1:58–2:05` | `96–98%` | **About** | "The Person Behind the Timeline", editorial philosophy, metrics, and software stack. | `src/components/scenes/Scene11About.tsx` |
| **12** | `2:05–2:12` | `98–100%`| **Final CTA $\to$ Black** | `GOT FOOTAGE?` $\to$ `LET'S MAKE SOMETHING OUT OF IT.` $\to$ `START A PROJECT` button $\to$ ends on pure **BLACK**. | `src/components/scenes/Scene12CTA.tsx` |

---

## 🛠️ Architecture & Features

- **2.5D CSS/GSAP Spatial Camera Rig**: 3D perspective (`1200px`) stage with film grain, CRT scanlines, dynamic anamorphic lens flares, and vignette.
- **Master Normalized Timeline**: Single source of truth (`src/config/timeline.ts`) managing all 12 scenes and camera coordinates (`x, y, z, rotateX, rotateY, rotateZ, scale`) with cubic interpolation.
- **Smooth Physics Scrolling**: Integrated Lenis smooth scroll and GSAP `ScrollTrigger` scrubbing over an `850vh` distance.
- **Cinematic Video Player Engine**: Custom HTML5 video player with SMPTE timecode display, scrub bar, mute/volume controls, and camera scroll lock toggle.
- **WebP Sequence Loader**: Configurable sequence endpoint with sliding window preloading ($\pm 5$ frames), canvas rendering, and high-res fallback.
- **Hidden Admin Gate**: Subtle "Developer" button in footer; 5 clicks opens the Admin Gate. Only `yhanlhester@gmail.com` is authorized via Google OAuth or direct verification.
- **Content Management System**: Live in-browser editing of showreel MP4, WebP sequences, project videos/thumbnails/metadata, project ordering, and copy.
- **Supabase Integration**: Optional real-time cloud persistence for assets and metadata.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/illusivestudioph/Cinematic-Portfolio.git
cd Cinematic-Portfolio

# Install dependencies
npm install

# Start local development server
npm run dev
```

The site will be running at `http://localhost:5173/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔐 Environment Variables (Optional Supabase Sync)

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If Supabase is not configured, the app seamlessly runs using local persistent cache and the default master configuration.

---

## 📄 License

Private portfolio for ILLUSIVE STUDIO. All rights reserved.

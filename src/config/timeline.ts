export interface SceneConfig {
  id: string;
  name: string;
  code: string;
  start: number; // 0.00 to 1.00
  end: number;   // 0.00 to 1.00
  timecode: string;
  description: string;
  camera: {
    x: number;       // px
    y: number;       // px
    z: number;       // px (depth)
    rotateX: number; // degrees
    rotateY: number; // degrees
    rotateZ: number; // degrees
    scale: number;
  };
}

export const SCENES: Record<string, SceneConfig> = {
  ident: {
    id: 'ident',
    name: 'STUDIO IDENT',
    code: '01',
    start: 0.00,
    end: 0.05,
    timecode: '00:00:00:00',
    description: 'Black screen into grand studio typography, then fades completely out.',
    camera: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  editor: {
    id: 'editor',
    name: 'THE EDITOR',
    code: '02',
    start: 0.05,
    end: 0.15,
    timecode: '00:00:05:00',
    description: 'Wide shot of dark editing suite, slow dolly in toward editor at desk.',
    camera: { x: 0, y: 0, z: -300, rotateX: 2, rotateY: 0, rotateZ: 0, scale: 1.05 },
  },
  monitor: {
    id: 'monitor',
    name: 'THE STRETCH & MONITOR',
    code: '03',
    start: 0.15,
    end: 0.25,
    timecode: '00:00:15:00',
    description: 'Editor stretches, arm comes down, camera accelerates toward primary monitor.',
    camera: { x: 0, y: -20, z: -800, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.3 },
  },
  editWorld: {
    id: 'editWorld',
    name: 'ENTER THE EDIT',
    code: '04',
    start: 0.25,
    end: 0.40,
    timecode: '00:00:25:00',
    description: 'Camera punches through monitor glass into 3D NLE tracks, waveforms, and timecodes.',
    camera: { x: 0, y: 0, z: -1500, rotateX: -3, rotateY: 2, rotateZ: 0, scale: 1.5 },
  },
  timeline: {
    id: 'timeline',
    name: 'TRAVEL THROUGH TIMELINE',
    code: '05',
    start: 0.40,
    end: 0.52,
    timecode: '00:00:40:00',
    description: 'Spatial traversal through RAW -> CUTS -> B-ROLL -> AUDIO -> MOTION -> COLOR.',
    camera: { x: 200, y: 30, z: -2300, rotateX: -1, rotateY: -4, rotateZ: 0.5, scale: 1.7 },
  },
  footage: {
    id: 'footage',
    name: 'ENTER THE FOOTAGE',
    code: '06',
    start: 0.52,
    end: 0.60,
    timecode: '00:00:52:00',
    description: 'Selected clip expands to fill viewport, surrounding timeline falls away.',
    camera: { x: 0, y: 0, z: -3200, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 2.1 },
  },
  showreel: {
    id: 'showreel',
    name: 'THE SHOWREEL',
    code: '07',
    start: 0.60,
    end: 0.72,
    timecode: '00:01:00:00',
    description: 'Actual high-definition portfolio reel playing with full custom controls and audio.',
    camera: { x: 0, y: 0, z: -4000, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  studio: {
    id: 'studio',
    name: 'PULL OUT INTO STUDIO',
    code: '08',
    start: 0.72,
    end: 0.80,
    timecode: '00:01:20:00',
    description: 'Camera pulls back in 3D, revealing the reel playing on a huge studio monitor.',
    camera: { x: 0, y: -40, z: -3300, rotateX: 4, rotateY: -3, rotateZ: 0, scale: 0.9 },
  },
  projects: {
    id: 'projects',
    name: 'SELECTED WORK',
    code: '09',
    start: 0.80,
    end: 0.90,
    timecode: '00:01:30:00',
    description: 'Spatial project monitors (featuring CRIMEXBT) with in-situ video playback.',
    camera: { x: -150, y: 0, z: -2400, rotateX: 2, rotateY: 5, rotateZ: 0, scale: 1.1 },
  },
  process: {
    id: 'process',
    name: 'BEHIND THE EDIT',
    code: '10',
    start: 0.90,
    end: 0.96,
    timecode: '00:01:45:00',
    description: '6 spatial milestone stations: RAW -> EDIT -> MOTION -> SOUND -> COLOR -> FINAL.',
    camera: { x: 120, y: 20, z: -1400, rotateX: -2, rotateY: -3, rotateZ: 0, scale: 1.2 },
  },
  about: {
    id: 'about',
    name: 'THE EDITOR BEHIND THE TIMELINE',
    code: '11',
    start: 0.96,
    end: 0.98,
    timecode: '00:01:58:00',
    description: 'Cinematic profile, storytelling philosophy, and craft statement.',
    camera: { x: 0, y: 0, z: -600, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.05 },
  },
  contact: {
    id: 'contact',
    name: 'START A PROJECT',
    code: '12',
    start: 0.98,
    end: 1.00,
    timecode: '00:02:05:00',
    description: 'GOT FOOTAGE? LET\'S MAKE SOMETHING OUT OF IT. Fade to black.',
    camera: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
};

export const SCENE_LIST = Object.values(SCENES);

/**
 * Given normalized scroll progress (0.0 to 1.0), returns the current active scene
 */
export function getActiveScene(progress: number): SceneConfig {
  const p = Math.max(0, Math.min(1, progress));
  for (const scene of SCENE_LIST) {
    if (p >= scene.start && p <= scene.end) {
      return scene;
    }
  }
  return SCENE_LIST[SCENE_LIST.length - 1];
}

/**
 * Calculates current interpolated camera coordinates based on progress
 */
export function interpolateCamera(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const scenes = SCENE_LIST;
  
  // Find current and next scene indices
  let currentIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    if (p >= scenes[i].start && p <= scenes[i].end) {
      currentIndex = i;
      break;
    }
  }

  const current = scenes[currentIndex];
  const next = scenes[Math.min(currentIndex + 1, scenes.length - 1)];

  // Relative progress within the current scene
  const sceneDuration = Math.max(0.0001, current.end - current.start);
  const t = Math.max(0, Math.min(1, (p - current.start) / sceneDuration));

  // Smooth cubic easing
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const lerp = (a: number, b: number) => a + (b - a) * ease;

  return {
    x: lerp(current.camera.x, next.camera.x),
    y: lerp(current.camera.y, next.camera.y),
    z: lerp(current.camera.z, next.camera.z),
    rotateX: lerp(current.camera.rotateX, next.camera.rotateX),
    rotateY: lerp(current.camera.rotateY, next.camera.rotateY),
    rotateZ: lerp(current.camera.rotateZ, next.camera.rotateZ),
    scale: lerp(current.camera.scale, next.camera.scale),
    currentScene: current,
    nextScene: next,
    sceneProgress: t,
  };
}

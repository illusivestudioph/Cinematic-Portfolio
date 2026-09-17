export interface CameraCoordinates {
  x: number;       // px horizontal translation
  y: number;       // px vertical translation
  z: number;       // px depth translation
  rotateX: number; // degrees pitch
  rotateY: number; // degrees yaw
  rotateZ: number; // degrees roll
  scale: number;   // uniform scale
}

export interface PinnedSceneConfig {
  id: string;
  name: string;
  code: string;
  pinDistanceVh: number; // Viewport height units of pinned scroll distance
  timecode: string;
  description: string;
  cameraStart: CameraCoordinates;
  cameraEnd: CameraCoordinates;
}

export const PINNED_SCENES: Record<string, PinnedSceneConfig> = {
  editor: {
    id: 'editor',
    name: 'THE EDITOR & DESK',
    code: '01',
    pinDistanceVh: 250,
    timecode: '00:00:00:00',
    description: 'Editor seated with studio ident overlay -> stretch -> arm down -> push into monitor.',
    cameraStart: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
    cameraEnd:   { x: 0, y: -20, z: -850, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.55 },
  },
  timeline: {
    id: 'timeline',
    name: 'MONITOR / EDITING WORLD',
    code: '02',
    pinDistanceVh: 300,
    timecode: '00:00:25:00',
    description: 'Punches through monitor glass into 3D NLE tracks, waveforms, milestones -> locks onto selected clip.',
    cameraStart: { x: 0, y: 0, z: -850, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.55 },
    cameraEnd:   { x: 0, y: 0, z: -3200, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 2.3 },
  },
  showreel: {
    id: 'showreel',
    name: 'THE SHOWREEL',
    code: '03',
    pinDistanceVh: 200,
    timecode: '00:00:55:00',
    description: 'Enters footage horizon into dominant 16:9 MP4 showreel. Custom controls & audio on play.',
    cameraStart: { x: 0, y: 0, z: -3800, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
    cameraEnd:   { x: 0, y: 0, z: -3800, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  studio: {
    id: 'studio',
    name: 'STUDIO REVEAL',
    code: '04',
    pinDistanceVh: 250,
    timecode: '00:01:15:00',
    description: 'Camera pulls backward in 3D: reel shrinks to monitor, revealing full edit suite & desk.',
    cameraStart: { x: 0, y: 0, z: -3800, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
    cameraEnd:   { x: 0, y: -30, z: -2600, rotateX: 3.5, rotateY: -2, rotateZ: 0, scale: 0.88 },
  },
  projects: {
    id: 'projects',
    name: 'PROJECT DESTINATIONS',
    code: '05',
    pinDistanceVh: 300,
    timecode: '00:01:30:00',
    description: 'Camera navigates through studio toward CRIMEXBT monitor; dominant interactive project playback.',
    cameraStart: { x: 0, y: -30, z: -2600, rotateX: 3.5, rotateY: -2, rotateZ: 0, scale: 0.88 },
    cameraEnd:   { x: -120, y: 0, z: -1950, rotateX: 1.5, rotateY: 4, rotateZ: 0, scale: 1.2 },
  },
  process: {
    id: 'process',
    name: 'BEHIND THE EDIT',
    code: '06',
    pinDistanceVh: 250,
    timecode: '00:01:45:00',
    description: 'Travel through 6 spatial milestones: RAW -> EDIT -> MOTION -> SOUND -> COLOR -> FINAL.',
    cameraStart: { x: -120, y: 0, z: -1950, rotateX: 1.5, rotateY: 4, rotateZ: 0, scale: 1.2 },
    cameraEnd:   { x: 100, y: 15, z: -1350, rotateX: -2, rotateY: -3, rotateZ: 0, scale: 1.15 },
  },
  about: {
    id: 'about',
    name: 'THE PERSON BEHIND THE TIMELINE',
    code: '07',
    pinDistanceVh: 200,
    timecode: '00:01:58:00',
    description: 'Pinned camera at editorial craft statement, philosophy, metrics & toolkit.',
    cameraStart: { x: 100, y: 15, z: -1350, rotateX: -2, rotateY: -3, rotateZ: 0, scale: 1.15 },
    cameraEnd:   { x: 0, y: 0, z: -650, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.05 },
  },
  cta: {
    id: 'cta',
    name: 'START A PROJECT',
    code: '08',
    pinDistanceVh: 200,
    timecode: '00:02:08:00',
    description: 'GOT FOOTAGE? -> LET\'S MAKE SOMETHING OUT OF IT. -> START A PROJECT -> Fade to TRUE BLACK.',
    cameraStart: { x: 0, y: 0, z: -650, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.05 },
    cameraEnd:   { x: 0, y: 0, z: 200, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 0.95 },
  },
};

export const PINNED_SCENE_LIST = Object.values(PINNED_SCENES);

// Alias SCENES and SCENE_LIST for backward compatibility
export const SCENES = PINNED_SCENES;
export const SCENE_LIST = PINNED_SCENE_LIST;

// Total virtual scroll distance in vh across all pinned scenes
export const TOTAL_PIN_DISTANCE_VH = PINNED_SCENE_LIST.reduce((acc, s) => acc + s.pinDistanceVh, 0);

// Calculate normalized global thresholds for each pinned scene
let cumulativeVh = 0;
export const SCENE_INTERVALS = PINNED_SCENE_LIST.map((scene) => {
  const startFraction = cumulativeVh / TOTAL_PIN_DISTANCE_VH;
  cumulativeVh += scene.pinDistanceVh;
  const endFraction = cumulativeVh / TOTAL_PIN_DISTANCE_VH;
  return {
    ...scene,
    globalStart: startFraction,
    globalEnd: endFraction,
  };
});

/**
 * Returns the active scene and local progress (0.0 to 1.0) inside that scene
 */
export function getActiveSceneFromProgress(globalProgress: number): {
  scene: PinnedSceneConfig;
  sceneIndex: number;
  localProgress: number;
} {
  const p = Math.max(0, Math.min(1, globalProgress));
  
  for (let i = 0; i < SCENE_INTERVALS.length; i++) {
    const item = SCENE_INTERVALS[i];
    if (p >= item.globalStart && p <= item.globalEnd) {
      const span = Math.max(0.0001, item.globalEnd - item.globalStart);
      const local = Math.max(0, Math.min(1, (p - item.globalStart) / span));
      return { scene: item, sceneIndex: i, localProgress: local };
    }
  }

  const lastIdx = SCENE_INTERVALS.length - 1;
  return { scene: SCENE_INTERVALS[lastIdx], sceneIndex: lastIdx, localProgress: 1 };
}

// Backward compatible helper
export function getActiveScene(progress: number): PinnedSceneConfig {
  return getActiveSceneFromProgress(progress).scene;
}

/**
 * Calculates current interpolated camera coordinates based on active scene and local progress
 */
export function interpolateCamera(globalProgress: number): CameraCoordinates & {
  activeScene: PinnedSceneConfig;
  localProgress: number;
} {
  const { scene, localProgress } = getActiveSceneFromProgress(globalProgress);

  // Smooth cubic ease for natural camera motion
  const ease = localProgress < 0.5 
    ? 4 * localProgress * localProgress * localProgress 
    : 1 - Math.pow(-2 * localProgress + 2, 3) / 2;

  const lerp = (a: number, b: number) => a + (b - a) * ease;

  return {
    x: lerp(scene.cameraStart.x, scene.cameraEnd.x),
    y: lerp(scene.cameraStart.y, scene.cameraEnd.y),
    z: lerp(scene.cameraStart.z, scene.cameraEnd.z),
    rotateX: lerp(scene.cameraStart.rotateX, scene.cameraEnd.rotateX),
    rotateY: lerp(scene.cameraStart.rotateY, scene.cameraEnd.rotateY),
    rotateZ: lerp(scene.cameraStart.rotateZ, scene.cameraEnd.rotateZ),
    scale: lerp(scene.cameraStart.scale, scene.cameraEnd.scale),
    activeScene: scene,
    localProgress,
  };
}

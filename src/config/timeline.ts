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

export const PINNED_BEATS: Record<string, PinnedSceneConfig> = {
  staticIllusion: {
    id: 'staticIllusion',
    name: 'STATIC ILLUSION',
    code: '01',
    pinDistanceVh: 250,
    timecode: '00:00:00:00',
    description: 'Editor completely still on the RIGHT, clean negative space on LEFT with studio title.',
    cameraStart: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
    cameraEnd:   { x: 35, y: -5, z: 90, rotateX: 0.6, rotateY: 2.0, rotateZ: -0.3, scale: 1.02 },
  },
  breakFrame: {
    id: 'breakFrame',
    name: 'BREAKING THE FRAME',
    code: '02',
    pinDistanceVh: 300,
    timecode: '00:00:15:00',
    description: 'Blink -> break pose -> pull chair -> sit at desk in the edit suite.',
    cameraStart: { x: 35, y: -5, z: 90, rotateX: 0.6, rotateY: 2.0, rotateZ: -0.3, scale: 1.02 },
    cameraEnd:   { x: -25, y: -16, z: 280, rotateX: 2.6, rotateY: -2.0, rotateZ: 0.5, scale: 1.04 },
  },
  catalyst: {
    id: 'catalyst',
    name: 'THE CATALYST',
    code: '03',
    pinDistanceVh: 350,
    timecode: '00:00:35:00',
    description: 'Camera pushes over the shoulder -> keyboard shortcut -> DaVinci Resolve timeline fills monitor.',
    cameraStart: { x: -25, y: -16, z: 280, rotateX: 2.6, rotateY: -2.0, rotateZ: 0.5, scale: 1.04 },
    cameraEnd:   { x: 0, y: 0, z: 460, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.06 },
  },
  showreelPeak: {
    id: 'showreelPeak',
    name: 'SHOWREEL PEAK',
    code: '04',
    pinDistanceVh: 250,
    timecode: '00:00:55:00',
    description: 'Monitor expands into the REAL showreel MP4 -> fullscreen montage with audio & custom controls.',
    cameraStart: { x: 0, y: 0, z: 460, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.06 },
    cameraEnd:   { x: 0, y: 0, z: 460, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.06 },
  },
  deconstruction: {
    id: 'deconstruction',
    name: 'DECONSTRUCTION',
    code: '05',
    pinDistanceVh: 350,
    timecode: '00:01:20:00',
    description: 'Finished edit rewinds -> layers strip away -> raw footage / grading / node tree / editing process.',
    cameraStart: { x: 0, y: 0, z: 460, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.06 },
    cameraEnd:   { x: 50, y: -18, z: 140, rotateX: -2.8, rotateY: 3.8, rotateZ: -0.7, scale: 1.02 },
  },
  ctaAnchor: {
    id: 'ctaAnchor',
    name: 'CTA ANCHOR',
    code: '06',
    pinDistanceVh: 300,
    timecode: '00:01:45:00',
    description: 'Camera pulls back to original desk -> editor presses Export -> looks into camera -> CTA in LEFT space.',
    cameraStart: { x: 50, y: -18, z: 140, rotateX: -2.8, rotateY: 3.8, rotateZ: -0.7, scale: 1.02 },
    cameraEnd:   { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  footerFade: {
    id: 'footerFade',
    name: 'FOOTER FADE',
    code: '07',
    pinDistanceVh: 200,
    timecode: '00:02:05:00',
    description: 'Editor turns back to monitor -> becomes silhouette -> bottom darkens -> seamless footer.',
    cameraStart: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
    cameraEnd:   { x: 0, y: 36, z: -160, rotateX: 3.4, rotateY: 0, rotateZ: 0, scale: 0.94 },
  },
};

export const PINNED_SCENES = PINNED_BEATS;
export const PINNED_SCENE_LIST = Object.values(PINNED_BEATS);

export const SCENES = PINNED_BEATS;
export const SCENE_LIST = PINNED_SCENE_LIST;

// Total virtual scroll distance across all 7 beats: 250 + 300 + 350 + 250 + 350 + 300 + 200 = 2000vh
export const TOTAL_PIN_DISTANCE_VH = PINNED_SCENE_LIST.reduce((acc, s) => acc + s.pinDistanceVh, 0);

// Calculate normalized global thresholds for each pinned beat
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

export function getActiveScene(progress: number): PinnedSceneConfig {
  return getActiveSceneFromProgress(progress).scene;
}

export interface SceneWindow {
  scene: PinnedSceneConfig;
  /** Normalized global progress where this beat begins */
  globalStart: number;
  /** Normalized global progress where this beat ends */
  globalEnd: number;
  /** This beat's local progress (0.0 – 1.0) for the given global progress */
  localT: number;
}

/**
 * Single source of truth for a beat's scroll window.
 * Beat components use this instead of hard-coding magic numbers, so pin
 * distances in PINNED_BEATS can be tuned freely without desyncing the scenes.
 */
export function getSceneWindow(sceneId: string, globalProgress: number): SceneWindow {
  const scene = SCENE_INTERVALS.find((s) => s.id === sceneId) ?? SCENE_INTERVALS[0];
  const p = Math.max(0, Math.min(1, globalProgress));
  const span = Math.max(0.0001, scene.globalEnd - scene.globalStart);
  const localT = Math.max(0, Math.min(1, (p - scene.globalStart) / span));
  return {
    scene,
    globalStart: scene.globalStart,
    globalEnd: scene.globalEnd,
    localT,
  };
}

/** Visibility test with a small bleed so beats cross-fade during transitions */
export function isSceneVisible(sceneId: string, globalProgress: number, bleed = 0.03): boolean {
  const { globalStart, globalEnd } = getSceneWindow(sceneId, globalProgress);
  return globalProgress >= globalStart - bleed && globalProgress <= globalEnd + bleed;
}

/**
 * Calculates current interpolated camera coordinates based on active scene and local progress
 */
export function interpolateCamera(globalProgress: number): CameraCoordinates & {
  activeScene: PinnedSceneConfig;
  localProgress: number;
} {
  const { scene, localProgress } = getActiveSceneFromProgress(globalProgress);

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

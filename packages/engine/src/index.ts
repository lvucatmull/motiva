export type SceneMode = 'gallery' | 'scene';

export interface ProjectState {
  sceneMode: SceneMode;
  activeFrameId: number | null;
  meshRotation: {
    x: number;
    y: number;
    z: number;
  };
}

export function createDefaultProjectState(): ProjectState {
  return {
    sceneMode: 'gallery',
    activeFrameId: null,
    meshRotation: { x: 0, y: 0, z: 0 }
  };
}

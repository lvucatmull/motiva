export type SceneMode = 'gallery' | 'scene';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CameraState {
  position: Vec3;
  yaw: number;
  pitch: number;
}

export interface MeshRotation {
  x: number;
  y: number;
  z: number;
}

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
}

export interface FramePortal {
  id: number;
  position: Vec3;
  sceneName: string;
}

export interface ProjectState {
  sceneMode: SceneMode;
  activeFrameId: number | null;
  focusedFrameId: number | null;
  camera: CameraState;
  meshRotation: MeshRotation;
  portals: FramePortal[];
  velocity: Vec3;
}

const BASE_SPEED = 2.4;
const RUN_MULTIPLIER = 1.8;
const MOUSE_SENSITIVITY = 0.0022;
const PITCH_LIMIT = Math.PI * 0.45;

export function createDefaultProjectState(): ProjectState {
  return {
    sceneMode: 'gallery',
    activeFrameId: null,
    focusedFrameId: null,
    camera: {
      position: { x: 0, y: 1.65, z: 6 },
      yaw: Math.PI,
      pitch: 0
    },
    meshRotation: { x: 0, y: 0, z: 0 },
    portals: [
      { id: 1, position: { x: -4, y: 1.6, z: -2 }, sceneName: 'Neon Reef' },
      { id: 2, position: { x: 0, y: 1.6, z: -4 }, sceneName: 'Glass Forest' },
      { id: 3, position: { x: 4, y: 1.6, z: -2 }, sceneName: 'Orbit Room' }
    ],
    velocity: { x: 0, y: 0, z: 0 }
  };
}

export function applyMouseLook(state: ProjectState, dx: number, dy: number) {
  if (state.sceneMode !== 'gallery') return;
  state.camera.yaw -= dx * MOUSE_SENSITIVITY;
  state.camera.pitch -= dy * MOUSE_SENSITIVITY;
  state.camera.pitch = clamp(state.camera.pitch, -PITCH_LIMIT, PITCH_LIMIT);
}

export function updateGallerySimulation(state: ProjectState, input: InputState, dt: number) {
  if (state.sceneMode !== 'gallery') return;

  const speed = BASE_SPEED * (input.run ? RUN_MULTIPLIER : 1);
  const forward = (input.forward ? 1 : 0) - (input.backward ? 1 : 0);
  const strafe = (input.right ? 1 : 0) - (input.left ? 1 : 0);

  const yaw = state.camera.yaw;
  const fx = -Math.sin(yaw);
  const fz = -Math.cos(yaw);
  const rx = Math.cos(yaw);
  const rz = -Math.sin(yaw);

  state.velocity.x = (fx * forward + rx * strafe) * speed;
  state.velocity.z = (fz * forward + rz * strafe) * speed;

  state.camera.position.x += state.velocity.x * dt;
  state.camera.position.z += state.velocity.z * dt;

  state.camera.position.x = clamp(state.camera.position.x, -8, 8);
  state.camera.position.z = clamp(state.camera.position.z, -8, 8);

  state.focusedFrameId = pickFocusedPortal(state);
}

export function enterFocusedPortal(state: ProjectState) {
  if (state.focusedFrameId == null) return;
  state.sceneMode = 'scene';
  state.activeFrameId = state.focusedFrameId;
}

export function returnToGallery(state: ProjectState) {
  state.sceneMode = 'gallery';
  state.activeFrameId = null;
}

export function getActivePortalName(state: ProjectState): string {
  if (state.activeFrameId == null) return 'None';
  const portal = state.portals.find((p) => p.id === state.activeFrameId);
  return portal?.sceneName ?? 'Unknown';
}

function pickFocusedPortal(state: ProjectState): number | null {
  const eye = state.camera.position;
  const yaw = state.camera.yaw;
  const lookX = -Math.sin(yaw);
  const lookZ = -Math.cos(yaw);

  let best: { id: number; score: number } | null = null;

  for (const portal of state.portals) {
    const dx = portal.position.x - eye.x;
    const dz = portal.position.z - eye.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 5.6) continue;

    const nx = dx / Math.max(dist, 0.0001);
    const nz = dz / Math.max(dist, 0.0001);
    const facing = nx * lookX + nz * lookZ;
    if (facing < 0.7) continue;

    const score = facing * 2 - dist * 0.12;
    if (!best || score > best.score) {
      best = { id: portal.id, score };
    }
  }

  return best?.id ?? null;
}

function clamp(v: number, min: number, max: number): number {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

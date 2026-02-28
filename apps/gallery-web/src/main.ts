import {
  applyMouseLook,
  createDefaultProjectState,
  enterFocusedPortal,
  getActivePortalName,
  getFocusedPortalName,
  isPortalTransitionActive,
  returnToGallery,
  updateGallerySimulation,
  updatePortalTransition,
  type InputState
} from '@gallery/engine';
import './style.css';

type GPUNavigator = Navigator & {
  gpu?: {
    requestAdapter: () => Promise<{
      requestDevice: () => Promise<any>;
    } | null>;
    getPreferredCanvasFormat: () => string;
  };
};

type WasmApi = {
  damp_rotation: (current: number, target: number, dt: number) => number;
  clampf: (x: number, min: number, max: number) => number;
};

const canvas = document.getElementById('app') as HTMLCanvasElement;
const status = document.getElementById('status') as HTMLParagraphElement;

const projectState = createDefaultProjectState();

const inputState: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false
};

let lastTime = 0;
let simulationAccumulator = 0;
const FIXED_DT = 1 / 60;
let pointerLocked = false;

function setStatus(text: string) {
  status.textContent = text;
}

async function loadWasm(): Promise<WasmApi | null> {
  try {
    const wasmModuleUrl = '/wasm/gallery_wasm.js';
    const mod = await import(/* @vite-ignore */ wasmModuleUrl);
    if (!('default' in mod)) return null;
    const instance = await mod.default();
    return {
      damp_rotation: instance.cwrap('damp_rotation', 'number', ['number', 'number', 'number']),
      clampf: instance.cwrap('clampf', 'number', ['number', 'number', 'number'])
    };
  } catch {
    return null;
  }
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
}

function updateSimulation(dt: number) {
  updateGallerySimulation(projectState, inputState, dt);
  updatePortalTransition(projectState, dt);
}

function update(dt: number) {
  simulationAccumulator += dt;
  const maxFrame = 0.1;
  simulationAccumulator = Math.min(simulationAccumulator, maxFrame);

  while (simulationAccumulator >= FIXED_DT) {
    updateSimulation(FIXED_DT);
    simulationAccumulator -= FIXED_DT;
  }
}

function registerInputEvents() {
  window.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW':
        inputState.forward = true;
        break;
      case 'KeyS':
        inputState.backward = true;
        break;
      case 'KeyA':
        inputState.left = true;
        break;
      case 'KeyD':
        inputState.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        inputState.run = true;
        break;
      case 'KeyE':
        enterFocusedPortal(projectState);
        break;
      case 'KeyG':
        returnToGallery(projectState);
        break;
      default:
        break;
    }
  });

  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW':
        inputState.forward = false;
        break;
      case 'KeyS':
        inputState.backward = false;
        break;
      case 'KeyA':
        inputState.left = false;
        break;
      case 'KeyD':
        inputState.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        inputState.run = false;
        break;
      default:
        break;
    }
  });

  canvas.addEventListener('click', async () => {
    if (document.pointerLockElement !== canvas && projectState.sceneMode === 'gallery') {
      await canvas.requestPointerLock();
    }
  });

  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
  });

  window.addEventListener('mousemove', (event) => {
    if (!pointerLocked) return;
    if (projectState.sceneMode !== 'gallery') return;
    applyMouseLook(projectState, event.movementX, event.movementY);
  });
}

async function boot() {
  const gpuNavigator = navigator as GPUNavigator;
  resizeCanvas();

  if (!gpuNavigator.gpu) {
    setStatus('WebGPU를 지원하지 않는 브라우저입니다. Chrome 최신 버전에서 확인하세요.');
    return;
  }

  const adapter = await gpuNavigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) {
    setStatus('GPU 디바이스 초기화 실패');
    return;
  }

  const context = canvas.getContext('webgpu') as any;
  if (!context) {
    setStatus('webgpu canvas context를 가져올 수 없습니다.');
    return;
  }

  const format = gpuNavigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: 'opaque' });

  const wasm = await loadWasm();
  const source = wasm ? 'WASM' : 'TS fallback';

  let osc = 0;
  let target = Math.PI * 2;

  registerInputEvents();

  const draw = (timestampMs: number) => {
    const dt = Math.min((timestampMs - lastTime) / 1000 || FIXED_DT, 0.05);
    lastTime = timestampMs;
    update(dt);

    if (wasm) {
      osc = wasm.damp_rotation(osc, target, FIXED_DT);
    } else {
      osc += (target - osc) * (1 - Math.exp(-12 * FIXED_DT));
    }

    if (Math.abs(target - osc) < 0.002) {
      target = target > Math.PI ? 0 : Math.PI * 2;
    }

    const transition = projectState.transition;
    const t = transition.phase === 'idle' ? 0 : transition.progress;
    const transitionGlow = t * t;
    const focusGlow = projectState.focusedFrameStrength;

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: {
            r: 0.07 + 0.01 * Math.sin(projectState.camera.position.x + osc) + 0.06 * focusGlow + 0.08 * transitionGlow,
            g:
              0.11 +
              (projectState.sceneMode === 'scene' ? 0.08 : 0) +
              (transition.phase === 'entering' ? 0.1 * transitionGlow : 0) +
              (transition.phase === 'exiting' ? 0.04 * transitionGlow : 0),
            b: 0.15 + 0.015 * Math.cos(projectState.camera.position.z - osc) + 0.07 * transitionGlow,
            a: 1
          },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    });

    pass.end();
    device.queue.submit([encoder.finish()]);

    setStatus(
      `mode=${projectState.sceneMode} | pos=(${projectState.camera.position.x.toFixed(2)}, ${projectState.camera.position.z.toFixed(2)}) ` +
        `| focus=${projectState.focusedFrameId ?? '-'}:${projectState.focusedFrameStrength.toFixed(2)}(${getFocusedPortalName(projectState)}) ` +
        `| transition=${transition.phase}:${transition.progress.toFixed(2)} | activeScene=${getActivePortalName(projectState)} | source=${source}`
    );

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resizeCanvas);

window.render_game_to_text = () =>
  JSON.stringify({
    coordinateSystem: 'x-right y-up z-forward(negative viewed as forward in gallery movement)',
    mode: projectState.sceneMode,
    camera: {
      x: Number(projectState.camera.position.x.toFixed(3)),
      y: Number(projectState.camera.position.y.toFixed(3)),
      z: Number(projectState.camera.position.z.toFixed(3)),
      yaw: Number(projectState.camera.yaw.toFixed(3)),
      pitch: Number(projectState.camera.pitch.toFixed(3))
    },
    focusedFrameId: projectState.focusedFrameId,
    focusedFrameName: getFocusedPortalName(projectState),
    focusedFrameStrength: Number(projectState.focusedFrameStrength.toFixed(3)),
    activeFrameId: projectState.activeFrameId,
    activeSceneName: getActivePortalName(projectState),
    transition: {
      phase: projectState.transition.phase,
      progress: Number(projectState.transition.progress.toFixed(3)),
      running: isPortalTransitionActive(projectState)
    },
    portals: projectState.portals,
    input: {
      ...inputState,
      pointerLocked
    }
  });

window.advanceTime = (ms: number) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i++) {
    updateSimulation(FIXED_DT);
  }
};

void boot();

import { createDefaultProjectState } from '@gallery/engine';
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

  let angle = 0;
  let target = Math.PI * 2;

  const draw = () => {
    const dt = 1 / 60;
    if (wasm) {
      angle = wasm.damp_rotation(angle, target, dt);
    } else {
      angle += (target - angle) * (1 - Math.exp(-12 * dt));
    }

    if (Math.abs(target - angle) < 0.002) {
      target = target > Math.PI ? 0 : Math.PI * 2;
    }

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: {
            r: 0.06 + 0.02 * Math.sin(angle),
            g: 0.11,
            b: 0.16 + 0.03 * Math.cos(angle),
            a: 1
          },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    });

    pass.end();
    device.queue.submit([encoder.finish()]);

    setStatus(`Nx 구조 준비 완료 | scene: ${projectState.sceneMode} | rotation source: ${source}`);
    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resizeCanvas);

window.render_game_to_text = () =>
  JSON.stringify({
    mode: projectState.sceneMode,
    targetPhase: 'gallery-navigation-and-portal',
    monorepo: true,
    projects: ['gallery-web', 'engine', 'wasm-core']
  });

window.advanceTime = (_ms: number) => {
  // Starter stub for deterministic stepping. Real step loop will be added in engine integration.
};

void boot();

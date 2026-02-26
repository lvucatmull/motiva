export {};

declare global {
  interface Window {
    render_game_to_text: () => string;
    advanceTime: (ms: number) => void;
  }

  interface HTMLCanvasElement {
    getContext(contextId: 'webgpu'): any;
  }
}

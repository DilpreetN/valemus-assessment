import "@testing-library/jest-dom";

window.HTMLElement.prototype.scrollIntoView = () => {
};
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.releasePointerCapture = () => {
};

if (!window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, init?: PointerEventInit) {
      super(type, init);
    }
  }

  window.PointerEvent = PointerEvent as typeof window.PointerEvent;
}

// @ts-ignore
global.ResizeObserver = class ResizeObserver {
  observe() {
  }

  unobserve() {
  }

  disconnect() {
  }
};
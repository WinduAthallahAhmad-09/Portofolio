declare global {
  interface Window {
    __spaNavigated?: boolean;
    __spaNavigatedHome?: boolean;
  }

  interface HTMLElement {
    __cleanupWebGL?: () => void;
  }
}

export {};

export {};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  type ElectronAPI = {
    setTitle: (title: string) => void;
    toObj: (str: string) => Promise<{ word: string; definition: string }[]>;
  };
}

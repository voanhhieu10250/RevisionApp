export {};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  type ElectronAPI = {
    setTitle: (title: string) => void;
    saveData: (data: Word[]) => Promise<boolean>;
  };
  type Word = {
    text: string;
    definition: string;
  };
}

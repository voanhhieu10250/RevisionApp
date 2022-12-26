export {};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  type ElectronAPI = {
    setTitle: (title: string) => void;
    saveData: (data: Word[], filename: string) => Promise<boolean>;
    getDataInfo: () => Promise<{
      filename: string;
      size: number;
    }>;
    getData: (perPage: number) => Promise<Word[]>;
  };
  type Word = {
    text: string;
    definition: string;
  };
}

export {};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  type ElectronAPI = {
    setTitle: (title: string) => void;
    saveData: (
      data: Word[],
      filename: string,
      filePath: string
    ) => Promise<boolean>;
    getDataInfo: () => Promise<{
      filePath: string;
      filename: string;
      size: number;
    }>;
    getData: (
      start?: number,
      perPage?: number,
      addOnProps?: object
    ) => Promise<(Word & typeof addOnProps)[]>;
  };
  type Word = {
    text: string;
    definition: string;
  };
}

// typeof globalThis
interface Window {
  electronAPI: {
    setTitle: (title: string) => void;
    toHTML: (markdown: string) => Promise<string>;
  };
}

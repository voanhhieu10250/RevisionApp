import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title: string) => ipcRenderer.send("set:title", title),
  toHTML: (markdown: string): Promise<string> =>
    ipcRenderer.invoke("convert:html", markdown),
});

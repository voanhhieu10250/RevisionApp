import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title: string) => ipcRenderer.send("set:title", title),
  saveData: (data: Word[]) => ipcRenderer.invoke("submit:data", data),
} as ElectronAPI);

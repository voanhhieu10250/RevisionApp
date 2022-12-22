import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title: string) => ipcRenderer.send("set:title", title),
  toObj: (str: string) => ipcRenderer.invoke("convert:text:object", str),
} as ElectronAPI);

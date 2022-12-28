import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title: string) => ipcRenderer.send("set:title", title),
  saveData: (data: Word[], filename: string, filePath: string) =>
    ipcRenderer.invoke("submit:data", data, filename, filePath),
  getDataInfo: () => ipcRenderer.invoke("get:dataInfo"),
  getData: (start?: number, perPage?: number, addOnProps?: object) =>
    ipcRenderer.invoke("get:data", start, perPage, addOnProps),
} as ElectronAPI);

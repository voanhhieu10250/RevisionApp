import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title: string) => ipcRenderer.send("set:title", title),
  saveData: (data: Word[], filename: string) =>
    ipcRenderer.invoke("submit:data", data, filename),
  getDataInfo: () => ipcRenderer.invoke("get:dataInfo"),
  getData: (perPage: number) => ipcRenderer.invoke("get:data", perPage),
  handleWinResize: (callback) => ipcRenderer.on("win:resize", callback),
} as ElectronAPI);

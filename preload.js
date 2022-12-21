const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("set:title", title),
  toHTML: (markdown) => ipcRenderer.invoke("convert:html", markdown),
});

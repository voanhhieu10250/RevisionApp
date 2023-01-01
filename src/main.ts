import { app, BrowserWindow, Menu } from "electron";
import MainWindow from "./app/MainWindow";
import path from "path";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const isDev = process.env.NODE_ENV === "development";
const loadURL = isDev
  ? "http://localhost:3000"
  : path.join(__dirname, "renderer/index.html");
const preloadURL = path.join(__dirname, "preload.js");
const mainIconURL = path.join(__dirname, "renderer/assets/main-icon.png");

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click() {
          app.quit();
        },
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
      },
    ],
  },
];

app.whenReady().then(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mainWindow = new MainWindow(loadURL, preloadURL, mainIconURL);

  if (process.env.NODE_ENV === "production") {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = new MainWindow(loadURL, preloadURL, mainIconURL);
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

import { app, BrowserWindow } from "electron";
import MainWindow from "./app/MainWindow";
import path from "path";

app.whenReady().then(() => {
  let mainWindow = new MainWindow(
    "dist/index.html",
    path.join(__dirname, "preload.js"),
    path.join(__dirname, "../src/assets/main-icon.png")
  );

  if (process.env.NODE_ENV === "production") {
    mainWindow.removeMenu();
    // this.setResizable(false)
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = new MainWindow(
        "dist/index.html",
        path.join(__dirname, "preload.js"),
        path.join(__dirname, "../src/assets/main-icon.png")
      );
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
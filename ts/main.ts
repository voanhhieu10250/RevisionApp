import { app } from "electron";
import MainWindow from "./app/MainWindow";
import path from "path";

app.whenReady().then(() => {
  const mainWindow = new MainWindow(
    "src/menu/index.html",
    path.join(__dirname, "preload.js")
  );
  if (process.env.NODE_ENV === "production") {
    mainWindow.removeMenu();
    // this.setResizable(false);
  }
  mainWindow.load();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

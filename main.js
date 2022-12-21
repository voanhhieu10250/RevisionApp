const { app } = require("electron");
const MainWindow = require("./app/MainWindow");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new MainWindow(
    "src/menu/index.html",
    path.join(__dirname, "preload.js")
  );
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

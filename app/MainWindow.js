const electron = require("electron");
const showdown = require("showdown"); //https://github.com/showdownjs/showdown

const converter = new showdown.Converter();
const { BrowserWindow, app, ipcMain } = electron;

class MainWindow extends BrowserWindow {
  constructor(filePath, preloadPath) {
    super({
      width: 800,
      height: 600,
      webPreferences: {
        preload: preloadPath,
      },
    });

    if (process.env.NODE_ENV === "production") {
      this.removeMenu();
      this.setResizable(false);
    } else {
      this.autoHideMenuBar = true;
    }

    this._load();
    this.loadFile(filePath);
    this.on("closed", () => app.quit());
  }

  _load() {
    ipcMain.on("set:title", (event, title) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);
      win.setTitle(title);
    });

    ipcMain.handle("convert:html", (event, markdown) => {
      return converter.makeHtml(markdown);
    });
  }
}

module.exports = MainWindow;

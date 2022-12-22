import { BrowserWindow, app, ipcMain } from "electron";
import showdown from "showdown"; //https://github.com/showdownjs/showdown

class MainWindow extends BrowserWindow {
  private _converter: showdown.Converter;
  private _filePath: string;

  constructor(filePath: string, preloadPath: string) {
    super({
      width: 800,
      height: 600,
      webPreferences: {
        preload: preloadPath,
      },
    });
    this._filePath = filePath;
    this._converter = new showdown.Converter({
      tasklists: true,
      customizedHeaderId: true,
    });
  }

  load(): void {
    ipcMain.on("set:title", (event, title: string) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);
      win?.setTitle(title);
    });

    ipcMain.handle("convert:html", (_event, markdown: string) => {
      return this._converter.makeHtml(markdown);
    });

    this.loadFile(this._filePath);
    this.on("closed", () => app.quit());
  }
}

export default MainWindow;

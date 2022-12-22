import { BrowserWindow, app, ipcMain } from "electron";
import showdown from "showdown"; //https://github.com/showdownjs/showdown
import HashTable from "../utils/HashTable";

class MainWindow extends BrowserWindow {
  private _converter: showdown.Converter;
  private _filePath: string;
  private _data: HashTable<string, string> | null = null;
  private _isChanged: boolean = false;
  private _keys: string[] = [];

  constructor(filePath: string, preloadPath: string) {
    super({
      width: 800,
      height: 600,
      webPreferences: {
        preload: preloadPath,
      },
    });
    this._filePath = filePath;
    this.loadFile(this._filePath);
    this.on("closed", () => app.quit());

    this._converter = new showdown.Converter({
      tasklists: true,
      customizedHeaderId: true,
    });
    this._loadEvents();
  }

  _loadEvents(): void {
    ipcMain.on("set:title", (event, title: string) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);
      win?.setTitle(title);
    });

    ipcMain.handle("convert:text:object", (_event, markdown: string) => {
      let result = markdown
        .split("---")
        .filter((item) => item !== "")
        .map((item) => {
          let obj = item.split("__defi__");
          return { word: obj[0].trim(), definition: obj[1].trim() };
        });

      return result;
    });
  }

  _loadData(): void {}
}

export default MainWindow;

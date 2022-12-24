import { BrowserWindow, app, ipcMain } from "electron";
import HashTable from "../utils/HashTable";

class MainWindow extends BrowserWindow {
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

    this._loadEvents();
  }

  _loadEvents(): void {
    ipcMain.on("set:title", (event, title: string) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);
      win?.setTitle(title);
    });
    ipcMain.handle("submit:data", (_, data: Word[]) => {
      this._data = new HashTable<string, string>();
      data.forEach((word) => {
        this._data?.add(word.text, word.definition);
      });
      console.log(this._data);
      return true;
    });
  }

  _loadData(): void {}
}

export default MainWindow;

import { BrowserWindow, app, ipcMain } from "electron";
import HashTable from "../utils/HashTable";

class MainWindow extends BrowserWindow {
  private _clientFilePath: string;
  private _data: HashTable<string, string>;
  private _isDataChanged: boolean = false;
  private _keys: string[] = [];
  private _dataFilename: string = "";

  constructor(filePath: string, preloadPath: string) {
    super({
      width: 800,
      height: 600,
      minWidth: 400,
      minHeight: 600,
      webPreferences: {
        preload: preloadPath,
      },
    });
    this._clientFilePath = filePath;
    this.loadFile(this._clientFilePath);
    this._data = new HashTable<string, string>();

    this.on("closed", () => app.quit());

    this._loadEvents();
  }

  _loadEvents(): void {
    ipcMain.on("set:title", (event, title: string) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);
      win?.setTitle(title);
    });
    ipcMain.handle("submit:data", (_, data: Word[], filename: string) => {
      data.forEach((word) => {
        this._data?.add(word.text, word.definition);
        this._keys.push(word.text);
      });
      this._dataFilename = filename;
      return true;
    });
    ipcMain.handle("get:dataInfo", () => ({
      filename: this._dataFilename,
      size: this._data.size,
    }));
    ipcMain.handle("get:data", (_, perPage: number) =>
      this._data
        .toArray(perPage)
        .map((x) => ({ text: x.key, definition: x.value } as Word))
    );
  }

  _loadData(): void {}
}

export default MainWindow;

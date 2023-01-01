import { BrowserWindow, app, ipcMain } from "electron";
import HashTable from "../utils/HashTable";

const isDev = process.env.NODE_ENV === "development";
class MainWindow extends BrowserWindow {
  private _uiFile: string;
  private _data: HashTable<string, string>;
  private _isDataChanged = false;
  private _keys: string[] = [];
  private _dataFilename = "";
  private _dataFilePath = "";

  constructor(filePath: string, preloadPath: string, iconPath: string) {
    super({
      width: 800,
      height: 600,
      minWidth: 400,
      minHeight: 600,
      webPreferences: {
        preload: preloadPath,
      },
      icon: iconPath,
    });
    this._uiFile = filePath;
    if (isDev) {
      this.loadURL(this._uiFile);
      this.webContents.openDevTools();
    } else {
      this.loadFile(this._uiFile);
    }
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
    ipcMain.handle(
      "submit:data",
      (_, data: Word[], filename: string, filePath: string) => {
        data.forEach((word) => {
          this._data?.add(word.text, word.definition);
          this._keys.push(word.text);
        });
        this._dataFilename = filename;
        this._dataFilePath = filePath;
        return true;
      }
    );
    ipcMain.handle("get:dataInfo", () => ({
      filePath: this._dataFilePath,
      filename: this._dataFilename,
      size: this._data.size,
    }));
    ipcMain.handle(
      "get:data",
      (_, start?: number, perPage?: number, addOnProps?: object) => {
        const result: Word[] = [];
        const props = addOnProps || {};
        const startIdx = start || 0;
        const perPageIdx =
          perPage && perPage <= this._data.size ? perPage : this._data.size;

        for (let i = startIdx; i < perPageIdx + startIdx; i++) {
          result.push({
            text: this._keys[i],
            definition: this._data.get(this._keys[i]) || "",
            ...props,
          });
        }
        return result;
      }
    );
  }
}

export default MainWindow;

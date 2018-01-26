import { BrowserWindow, app } from "electron";

let win:BrowserWindow;

function createWindow ():void {
  win = new BrowserWindow({width: 1024, height: 600});
  win.loadURL(`file://${__dirname}/index.html`);
  // win.webContents.openDevTools();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({ width: 1024, height: 600 });
    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.openDevTools();
}
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("ready", createWindow);
electron_1.app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map
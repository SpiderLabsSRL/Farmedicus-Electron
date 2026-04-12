import { app, BrowserWindow, session } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Configurar CSP para permitir blob URLs
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: http: blob:;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: http: blob:;",
          "style-src 'self' 'unsafe-inline' https: http: data: blob:;",
          "font-src 'self' data: https: http: blob:;",
          "connect-src 'self' https: http: ws: wss: localhost:* 127.0.0.1:* data: blob:;",
          "img-src 'self' data: https: http: blob:;",  // ← Agregado para permitir blob images
        ].join(' '),
      },
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
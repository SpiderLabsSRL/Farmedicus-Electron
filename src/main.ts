import { app, BrowserWindow, session } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let backendProcess: any = null;

if (require('electron-squirrel-startup')) {
  app.quit();
}

function startBackend() {
  let backendPath = null;
  
  if (!app.isPackaged) {
    // Modo desarrollo
    const possiblePaths = [
      path.join(__dirname, '../../backend'),
      path.join(process.cwd(), 'backend'),
      path.join(app.getAppPath(), 'backend'),
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        backendPath = p;
        break;
      }
    }
  } else {
    // Modo producción - el backend está en resources
    backendPath = path.join(process.resourcesPath, 'backend');
    
    // Verificar si existe
    if (!fs.existsSync(backendPath)) {
      console.error('Backend no encontrado en:', backendPath);
      return;
    }
  }
  
  if (!backendPath) {
    console.error('No se encontró la carpeta backend');
    return;
  }
  
  console.log('Iniciando backend desde:', backendPath);
  
  // Buscar el archivo principal
  let entryFile = null;
  const possibleEntries = ['server.js', 'index.js', 'app.js'];
  
  for (const entry of possibleEntries) {
    const fullPath = path.join(backendPath, entry);
    if (fs.existsSync(fullPath)) {
      entryFile = fullPath;
      break;
    }
  }
  
  if (!entryFile) {
    console.error('No se encontró el archivo principal del backend');
    return;
  }
  
  console.log('Archivo principal:', entryFile);
  
  // Iniciar el proceso del backend
  backendProcess = spawn('node', [entryFile], {
    cwd: backendPath,
    env: {
      ...process.env,
      NODE_ENV: app.isPackaged ? 'production' : 'development',
      PORT: '5000',
    },
    stdio: 'pipe',
  });
  
  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend]: ${data}`);
  });
  
  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error]: ${data}`);
  });
  
  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
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
  
  // ABRIR DEVTOOLS EN PRODUCCIÓN PARA DEBUG (temporal)
  mainWindow.webContents.openDevTools();
  
  // Escuchar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Error cargando página:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  // Configurar CSP
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
          "img-src 'self' data: https: http: blob:;",
        ].join(' '),
      },
    });
  });

  startBackend();
  
  // Dar tiempo al backend para iniciar
  setTimeout(() => {
    createWindow();
  }, 3000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
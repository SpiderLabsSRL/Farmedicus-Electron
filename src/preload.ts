// preload.js
const { contextBridge } = require('electron');

// Exponer APIs seguras al proceso de renderizado
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.version,
  // Si necesitas información adicional del proceso
  getProcessInfo: () => ({
    platform: process.platform,
    version: process.version,
    arch: process.arch,
    env: process.env.NODE_ENV
  })
});

// Si necesitas manejar errores de carga
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded successfully');
});
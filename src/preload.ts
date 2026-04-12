import { contextBridge } from 'electron';

// Exponer APIs seguras al proceso de renderizado
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.version,
});
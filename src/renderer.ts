/**
 * Punto de entrada para el proceso de renderizado de Electron
 * Aquí se monta la aplicación React
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './renderer/App';
import './renderer/index.css';

// Obtener el elemento root del DOM
const container = document.getElementById('root');

// Crear y montar la aplicación React
if (container) {
  const root = createRoot(container);
  root.render(
    React.createElement(React.StrictMode, null,
      React.createElement(App, null)
    )
  );
} else {
  console.error('No se encontró el elemento root en el DOM');
}
// Configuración de API para diferentes entornos
const getApiUrl = () => {
  // En desarrollo
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // En producción (empaquetado)
  // El backend corre en localhost:5000 igualmente
  return 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();
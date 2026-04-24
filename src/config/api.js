// Configuración dinámica de la URL de la API
// Esto permite que el frontend se conecte al backend incluso desde otros dispositivos en la misma red
const getApiUrl = () => {
  const hostname = window.location.hostname;
  // Si estamos en desarrollo y accedemos vía IP, usamos esa misma IP para el backend
  return `http://${hostname}:3000/api`;
};

export const API_URL = getApiUrl();

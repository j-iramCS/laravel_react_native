/**
 * Configuración centralizada de la API
 * Una sola fuente de verdad para BASE_URL y PORT
 * 
 * Para cambiar a producción, solo edita BASE_URL aquí
 */

export const API_CONFIG = {
  // ─── DESARROLLO ───────────────────────
  // BASE_URL: 'http://localhost:8000',
  
  // ─── PRODUCCIÓN ────────────────────────
  // BASE_URL: 'https://tu-dominio.com',
  
  BASE_URL: 'http://localhost:8000',
  PORT: 8000,
};

export const API_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  USER: '/user',
  TASKS: '/tasks',
};

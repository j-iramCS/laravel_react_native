import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API_CONFIG } from '@/config/api.config';

const TOKEN_KEY = 'auth_token';

// ─── Calcular API_URL ───────────────────────────────────────
function getApiUrl(): string {
  if (Platform.OS === 'web') {
    return `${API_CONFIG.BASE_URL}/api`;
  }

  const debuggerHost = Constants.expoGoConfig?.debuggerHost
    ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (debuggerHost) {
    const hostIp = debuggerHost.split(':')[0];
    return `http://${hostIp}:${API_CONFIG.PORT}/api`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_CONFIG.PORT}/api`;
  }

  return `${API_CONFIG.BASE_URL}/api`;
}

export const API_URL = getApiUrl();

// ─── Token Helper ───────────────────────────────────────────
async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

// ─── Axios Instance Global ──────────────────────────────────
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales (opcional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores globales si lo necesitas
    return Promise.reject(error);
  }
);

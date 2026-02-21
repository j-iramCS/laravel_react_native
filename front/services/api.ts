import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ─── Configuración ──────────────────────────────────────────
// Detecta automáticamente la IP de tu máquina de desarrollo
// para que funcione en dispositivos físicos, emuladores y web.
function getApiUrl(): string {
  // En producción, cambia esto a tu URL de servidor real:
  // return 'https://tu-dominio.com/api';

  // Web siempre usa localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:8000/api';
  }

  // En móvil, detectar IP automáticamente
  const debuggerHost = Constants.expoGoConfig?.debuggerHost
    ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (debuggerHost) {
    const hostIp = debuggerHost.split(':')[0];
    return `http://${hostIp}:8000/api`;
  }

  // Fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api'; // Android emulator
  }

  return 'http://localhost:8000/api'; // iOS simulator
}

const API_URL = getApiUrl();

const TOKEN_KEY = 'auth_token';

// ─── Helpers ────────────────────────────────────────────────
async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ─── API Response Types ─────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ─── API Functions ──────────────────────────────────────────
export async function apiRegister(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data as ApiError;
  }

  await setToken(data.token);
  return data;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data as ApiError;
  }

  await setToken(data.token);
  return data;
}

export async function apiGetUser(): Promise<User> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/user`, { headers });

  const data = await res.json();

  if (!res.ok) {
    throw data as ApiError;
  }

  return data;
}

export async function apiLogout(): Promise<void> {
  const headers = await authHeaders();
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers,
  });

  await removeToken();
}

export { getToken, removeToken };

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, API_URL } from '@/config/axiosConfig';

// ─── Configuración ──────────────────────────────────────────
export { API_URL, apiClient };

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

export async function authHeaders(): Promise<Record<string, string>> {
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
  try {
    const { data } = await apiClient.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    await setToken(data.token);
    return data;
  } catch (error: any) {
    throw error.response?.data as ApiError;
  }
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post('/login', { email, password });
    await setToken(data.token);
    return data;
  } catch (error: any) {
    throw error.response?.data as ApiError;
  }
}

export async function apiGetUser(): Promise<User> {
  try {
    const { data } = await apiClient.get('/user');
    return data;
  } catch (error: any) {
    throw error.response?.data as ApiError;
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await apiClient.post('/logout');
    await removeToken();
  } catch (error: any) {
    throw error.response?.data as ApiError;
  }
}

export { getToken, removeToken };

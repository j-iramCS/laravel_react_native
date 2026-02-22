import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ──────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeColors {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    borderLight: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    textPlaceholder: string;
    primary: string;
    primaryText: string;
    inputBg: string;
    icon: string;
    iconMuted: string;
}

interface ThemeContextType {
    mode: ThemeMode;
    resolved: ResolvedTheme;
    colors: ThemeColors;
    setMode: (mode: ThemeMode) => void;
}

// ─── Color Palettes ─────────────────────────────────────────
const lightColors: ThemeColors = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    surfaceAlt: '#F5F5F5',
    border: '#F0F0F0',
    borderLight: '#E0E0E0',
    text: '#000000',
    textSecondary: '#333333',
    textMuted: '#999999',
    textPlaceholder: '#CCCCCC',
    primary: '#000000',
    primaryText: '#FFFFFF',
    inputBg: '#FAFAFA',
    icon: '#000000',
    iconMuted: '#999999',
};

const darkColors: ThemeColors = {
    background: '#0A0A0A',
    surface: '#141414',
    surfaceAlt: '#1A1A1A',
    border: '#222222',
    borderLight: '#333333',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textMuted: '#777777',
    textPlaceholder: '#555555',
    primary: '#FFFFFF',
    primaryText: '#000000',
    inputBg: '#141414',
    icon: '#FFFFFF',
    iconMuted: '#777777',
};

// ─── Context ────────────────────────────────────────────────
const THEME_KEY = 'theme_mode';

const ThemeContext = createContext<ThemeContextType>({
    mode: 'system',
    resolved: 'light',
    colors: lightColors,
    setMode: () => { },
});

export const useTheme = () => useContext(ThemeContext);

// ─── Provider ───────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useSystemColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('system');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    async function loadTheme() {
        try {
            const saved = await AsyncStorage.getItem(THEME_KEY);
            if (saved === 'light' || saved === 'dark' || saved === 'system') {
                setModeState(saved);
            }
        } catch { } finally {
            setLoaded(true);
        }
    }

    async function setMode(newMode: ThemeMode) {
        setModeState(newMode);
        try {
            await AsyncStorage.setItem(THEME_KEY, newMode);
        } catch { }
    }

    const resolved: ResolvedTheme =
        mode === 'system'
            ? (systemScheme === 'dark' ? 'dark' : 'light')
            : mode;

    const colors = resolved === 'dark' ? darkColors : lightColors;

    if (!loaded) return null;

    return (
        <ThemeContext.Provider value={{ mode, resolved, colors, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

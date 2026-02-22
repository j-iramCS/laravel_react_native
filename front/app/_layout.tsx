import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useToastConfig } from '@/components/CustomToast';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const toastConfig = useToastConfig();
  const { resolved, colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  // Solo redirige POST-LOGIN (cuando el user se autentica estando en login/register/welcome)
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return; // El logout se maneja explicitamente en cada pantalla

    const inTabsGroup = segments[0] === '(tabs)';
    if (!inTabsGroup) {
      setTimeout(() => router.replace('/(tabs)'), 0);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="small" color={colors.textMuted} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
      <Toast config={toastConfig} position="top" topOffset={50} visibilityTime={3000} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

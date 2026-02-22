import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowRight, Layers } from 'lucide-react-native';

export default function WelcomeScreen() {
    const router = useRouter();
    const { isLoading } = useAuth();
    const { colors } = useTheme();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="small" color={colors.textMuted} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={[styles.logoContainer, { backgroundColor: colors.surface }]}>
                    <Layers size={32} color={colors.icon} strokeWidth={1.5} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>Starter Kit</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                    Tu base para construir{'\n'}aplicaciones modernas
                </Text>

                <View style={styles.featuresContainer}>
                    {['Autenticacion lista', 'Multiplataforma', 'API conectada'].map((f, i) => (
                        <View key={i} style={styles.featureItem}>
                            <View style={[styles.featureDot, { backgroundColor: colors.text }]} />
                            <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/login')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.primaryButtonText, { color: colors.primaryText }]}>Iniciar Sesion</Text>
                    <ArrowRight size={18} color={colors.primaryText} strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: colors.borderLight, backgroundColor: colors.background }]}
                    onPress={() => router.push('/register')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Crear Cuenta</Text>
                </TouchableOpacity>
            </Animated.View>

            <Text style={[styles.footer, { color: colors.textPlaceholder }]}>Laravel + React Native</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    logoContainer: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 28 },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 8, letterSpacing: -0.5 },
    subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 36 },
    featuresContainer: { gap: 12, marginBottom: 44, alignSelf: 'stretch', paddingHorizontal: 20 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featureDot: { width: 6, height: 6, borderRadius: 3 },
    featureText: { fontSize: 14, fontWeight: '500' },
    primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14, alignSelf: 'stretch', marginHorizontal: 4, marginBottom: 12 },
    primaryButtonText: { fontSize: 16, fontWeight: '600' },
    secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14, alignSelf: 'stretch', marginHorizontal: 4, borderWidth: 1.5 },
    secondaryButtonText: { fontSize: 16, fontWeight: '600' },
    footer: { textAlign: 'center', paddingBottom: 36, fontSize: 12, fontWeight: '500' },
});

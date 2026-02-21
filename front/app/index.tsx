import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, Layers } from 'lucide-react-native';

export default function WelcomeScreen() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(30);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isLoading, isAuthenticated]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Layers size={32} color="#6366F1" strokeWidth={1.5} />
                </View>

                <Text style={styles.title}>Starter Kit</Text>
                <Text style={styles.subtitle}>
                    Tu base para construir{'\n'}aplicaciones modernas
                </Text>

                {/* Features */}
                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Autenticación lista</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Multiplataforma</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>API conectada</Text>
                    </View>
                </View>

                {/* Buttons */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/login')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
                    <ArrowRight size={18} color="#fff" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/register')}
                    activeOpacity={0.7}
                >
                    <Sparkles size={16} color="#6366F1" strokeWidth={2} />
                    <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>
            </Animated.View>

            <Text style={styles.footer}>Laravel + React Native</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    loadingText: {
        color: '#9CA3AF',
        fontSize: 15,
        fontWeight: '400',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 36,
    },
    featuresContainer: {
        gap: 12,
        marginBottom: 44,
        alignSelf: 'stretch',
        paddingHorizontal: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#6366F1',
    },
    featureText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 14,
        alignSelf: 'stretch',
        marginHorizontal: 4,
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 14,
        alignSelf: 'stretch',
        marginHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    secondaryButtonText: {
        color: '#6366F1',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        color: '#D1D5DB',
        textAlign: 'center',
        paddingBottom: 36,
        fontSize: 12,
        fontWeight: '500',
    },
});

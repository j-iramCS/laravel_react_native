import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    async function handleLogin() {
        setErrors({});
        setLoading(true);
        try {
            await login(email, password);
            // Root layout handles navigation
        } catch (error: any) {
            if (error?.errors) {
                setErrors(error.errors);
            } else {
                Alert.alert('Error', error?.message || 'Error al iniciar sesion');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={22} color={colors.textMuted} strokeWidth={2} />
                        <Text style={[styles.backText, { color: colors.textMuted }]}>Volver</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Hola de nuevo</Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Ingresa tus datos para continuar</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Correo electronico</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: errors.email ? colors.textMuted : colors.borderLight }]}>
                                <Mail size={18} color={colors.iconMuted} strokeWidth={1.5} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="tu@email.com"
                                    placeholderTextColor={colors.textPlaceholder}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && <Text style={[styles.errorText, { color: colors.textMuted }]}>{errors.email[0]}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Contrasena</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: errors.password ? colors.textMuted : colors.borderLight }]}>
                                <Lock size={18} color={colors.iconMuted} strokeWidth={1.5} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Tu contrasena"
                                    placeholderTextColor={colors.textPlaceholder}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                            {errors.password && <Text style={[styles.errorText, { color: colors.textMuted }]}>{errors.password[0]}</Text>}
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: loading ? colors.textMuted : colors.primary }]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            {loading ? <ActivityIndicator color={colors.primaryText} size="small" /> : <Text style={[styles.submitButtonText, { color: colors.primaryText }]}>Iniciar Sesion</Text>}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.footerLink} onPress={() => router.replace('/register')}>
                        <Text style={[styles.footerText, { color: colors.textMuted }]}>
                            No tienes cuenta? <Text style={[styles.footerHighlight, { color: colors.text }]}>Registrate</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 40, alignSelf: 'flex-start' },
    backText: { fontSize: 15, fontWeight: '500' },
    header: { marginBottom: 36 },
    title: { fontSize: 26, fontWeight: '700', marginBottom: 6, letterSpacing: -0.3 },
    subtitle: { fontSize: 15 },
    form: { gap: 20 },
    inputGroup: { gap: 6 },
    label: { fontSize: 13, fontWeight: '600', marginLeft: 2 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, gap: 10 },
    input: { flex: 1, paddingVertical: 14, fontSize: 15 },
    errorText: { fontSize: 12, fontWeight: '500', marginLeft: 2 },
    submitButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    submitButtonText: { fontSize: 16, fontWeight: '600' },
    footerLink: { marginTop: 32, alignItems: 'center' },
    footerText: { fontSize: 14 },
    footerHighlight: { fontWeight: '600' },
});

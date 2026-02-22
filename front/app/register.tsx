import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, User, Mail, Lock, ShieldCheck } from 'lucide-react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();
    const { colors } = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    async function handleRegister() {
        setErrors({});
        setLoading(true);
        try {
            await register(name, email, password, passwordConfirmation);
            // Root layout handles navigation
        } catch (error: any) {
            if (error?.errors) {
                setErrors(error.errors);
            } else {
                Alert.alert('Error', error?.message || 'Error al registrarse');
            }
        } finally {
            setLoading(false);
        }
    }

    const fields = [
        { key: 'name', label: 'Nombre completo', icon: User, placeholder: 'Tu nombre', value: name, onChange: setName, props: { autoCorrect: false } },
        { key: 'email', label: 'Correo electronico', icon: Mail, placeholder: 'tu@email.com', value: email, onChange: setEmail, props: { keyboardType: 'email-address' as const, autoCapitalize: 'none' as const, autoCorrect: false } },
        { key: 'password', label: 'Contrasena', icon: Lock, placeholder: 'Minimo 8 caracteres', value: password, onChange: setPassword, props: { secureTextEntry: true } },
        { key: 'password_confirmation', label: 'Confirmar contrasena', icon: ShieldCheck, placeholder: 'Repite tu contrasena', value: passwordConfirmation, onChange: setPasswordConfirmation, props: { secureTextEntry: true } },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={22} color={colors.textMuted} strokeWidth={2} />
                        <Text style={[styles.backText, { color: colors.textMuted }]}>Volver</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Crear Cuenta</Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Completa tus datos para comenzar</Text>
                    </View>

                    <View style={styles.form}>
                        {fields.map((field) => {
                            const Icon = field.icon;
                            const fieldErrors = errors[field.key];
                            return (
                                <View key={field.key} style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>{field.label}</Text>
                                    <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: fieldErrors ? colors.textMuted : colors.borderLight }]}>
                                        <Icon size={18} color={colors.iconMuted} strokeWidth={1.5} />
                                        <TextInput
                                            style={[styles.input, { color: colors.text }]}
                                            placeholder={field.placeholder}
                                            placeholderTextColor={colors.textPlaceholder}
                                            value={field.value}
                                            onChangeText={field.onChange}
                                            {...field.props}
                                        />
                                    </View>
                                    {fieldErrors && <Text style={[styles.errorText, { color: colors.textMuted }]}>{fieldErrors[0]}</Text>}
                                </View>
                            );
                        })}

                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: loading ? colors.textMuted : colors.primary }]}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            {loading ? <ActivityIndicator color={colors.primaryText} size="small" /> : <Text style={[styles.submitButtonText, { color: colors.primaryText }]}>Crear Cuenta</Text>}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.footerLink} onPress={() => router.replace('/login')}>
                        <Text style={[styles.footerText, { color: colors.textMuted }]}>
                            Ya tienes cuenta? <Text style={[styles.footerHighlight, { color: colors.text }]}>Inicia Sesion</Text>
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
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 36, alignSelf: 'flex-start' },
    backText: { fontSize: 15, fontWeight: '500' },
    header: { marginBottom: 32 },
    title: { fontSize: 26, fontWeight: '700', marginBottom: 6, letterSpacing: -0.3 },
    subtitle: { fontSize: 15 },
    form: { gap: 18 },
    inputGroup: { gap: 6 },
    label: { fontSize: 13, fontWeight: '600', marginLeft: 2 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, gap: 10 },
    input: { flex: 1, paddingVertical: 14, fontSize: 15 },
    errorText: { fontSize: 12, fontWeight: '500', marginLeft: 2 },
    submitButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
    submitButtonText: { fontSize: 16, fontWeight: '600' },
    footerLink: { marginTop: 28, alignItems: 'center' },
    footerText: { fontSize: 14 },
    footerHighlight: { fontWeight: '600' },
});

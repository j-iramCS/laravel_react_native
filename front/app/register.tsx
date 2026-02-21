import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, User, Mail, Lock, ShieldCheck } from 'lucide-react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();

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
            router.replace('/(tabs)');
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

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={22} color="#9CA3AF" strokeWidth={2} />
                        <Text style={styles.backText}>Volver</Text>
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>Completa tus datos para comenzar</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre completo</Text>
                            <View style={[styles.inputWrapper, errors.name && styles.inputWrapperError]}>
                                <User size={18} color="#9CA3AF" strokeWidth={1.5} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tu nombre"
                                    placeholderTextColor="#D1D5DB"
                                    value={name}
                                    onChangeText={setName}
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.name && (
                                <Text style={styles.errorText}>{errors.name[0]}</Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Correo electrónico</Text>
                            <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                                <Mail size={18} color="#9CA3AF" strokeWidth={1.5} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="tu@email.com"
                                    placeholderTextColor="#D1D5DB"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email[0]}</Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contraseña</Text>
                            <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
                                <Lock size={18} color="#9CA3AF" strokeWidth={1.5} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mínimo 8 caracteres"
                                    placeholderTextColor="#D1D5DB"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password[0]}</Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmar contraseña</Text>
                            <View style={styles.inputWrapper}>
                                <ShieldCheck size={18} color="#9CA3AF" strokeWidth={1.5} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Repite tu contraseña"
                                    placeholderTextColor="#D1D5DB"
                                    value={passwordConfirmation}
                                    onChangeText={setPasswordConfirmation}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Crear Cuenta</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <TouchableOpacity
                        style={styles.footerLink}
                        onPress={() => router.replace('/login')}
                    >
                        <Text style={styles.footerText}>
                            ¿Ya tienes cuenta?{' '}
                            <Text style={styles.footerHighlight}>Inicia Sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 36,
        alignSelf: 'flex-start',
    },
    backText: {
        color: '#9CA3AF',
        fontSize: 15,
        fontWeight: '500',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    form: {
        gap: 18,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        color: '#4B5563',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        gap: 10,
    },
    inputWrapperError: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FFF5F5',
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        color: '#111827',
        fontSize: 15,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 2,
    },
    submitButton: {
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#A5B4FC',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footerLink: {
        marginTop: 28,
        alignItems: 'center',
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    footerHighlight: {
        color: '#6366F1',
        fontWeight: '600',
    },
});

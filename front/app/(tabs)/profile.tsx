import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
    UserPen,
    ShieldCheck,
    Bell,
    Palette,
    HelpCircle,
    LogOut,
    ChevronRight,
} from 'lucide-react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    async function handleLogout() {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/');
                    },
                },
            ]
        );
    }

    const menuItems = [
        { icon: UserPen, label: 'Editar Perfil', subtitle: 'Nombre, email, foto' },
        { icon: ShieldCheck, label: 'Seguridad', subtitle: 'Contraseña, 2FA' },
        { icon: Bell, label: 'Notificaciones', subtitle: 'Push, email' },
        { icon: Palette, label: 'Apariencia', subtitle: 'Tema, idioma' },
        { icon: HelpCircle, label: 'Ayuda', subtitle: 'FAQ, soporte' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.headerTitle}>Perfil</Text>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <View style={styles.memberBadge}>
                        <Text style={styles.memberBadgeText}>
                            Miembro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }) : '—'}
                        </Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.menuItem,
                                    index === menuItems.length - 1 && styles.menuItemLast,
                                ]}
                                activeOpacity={0.6}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.menuIconBox}>
                                        <Icon size={18} color="#6366F1" strokeWidth={1.5} />
                                    </View>
                                    <View>
                                        <Text style={styles.menuItemLabel}>{item.label}</Text>
                                        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                                    </View>
                                </View>
                                <ChevronRight size={18} color="#D1D5DB" strokeWidth={1.5} />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <LogOut size={18} color="#EF4444" strokeWidth={1.5} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <Text style={styles.appVersion}>v1.0.0</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    scrollContent: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
        letterSpacing: -0.3,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 20,
    },
    avatarLarge: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    avatarText: {
        color: '#6366F1',
        fontSize: 28,
        fontWeight: '700',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 14,
    },
    memberBadge: {
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    memberBadgeText: {
        color: '#6366F1',
        fontSize: 11,
        fontWeight: '600',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemLabel: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600',
    },
    menuItemSubtitle: {
        color: '#D1D5DB',
        fontSize: 11,
        marginTop: 1,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFF5F5',
        borderRadius: 14,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        marginBottom: 20,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '600',
    },
    appVersion: {
        textAlign: 'center',
        color: '#D1D5DB',
        fontSize: 12,
        fontWeight: '500',
    },
});

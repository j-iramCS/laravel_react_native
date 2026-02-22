import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { UserPen, ShieldCheck, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { colors } = useTheme();
    const router = useRouter();
    const navigation = useNavigation();

    async function doLogout() {
        await logout();
        if (Platform.OS === 'web') {
            (window as any).location.href = '/';
        } else {
            // Reset root Stack navigator to welcome screen
            const parent = navigation.getParent();
            if (parent) {
                parent.dispatch(
                    CommonActions.reset({ index: 0, routes: [{ name: 'index' }] })
                );
            }
        }
    }

    function handleLogout() {
        if (Platform.OS === 'web') {
            doLogout();
            return;
        }
        Alert.alert('Cerrar sesion', 'Estas seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cerrar Sesion', style: 'destructive', onPress: doLogout },
        ]);
    }

    const menuItems = [
        { icon: UserPen, label: 'Editar Perfil', subtitle: 'Nombre, email, foto' },
        { icon: ShieldCheck, label: 'Seguridad', subtitle: 'Contrasena, 2FA' },
        { icon: Bell, label: 'Notificaciones', subtitle: 'Push, email' },
        { icon: HelpCircle, label: 'Ayuda', subtitle: 'FAQ, soporte' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Perfil</Text>

                <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.avatarLarge, { backgroundColor: colors.surfaceAlt }]}>
                        <Text style={[styles.avatarText, { color: colors.text }]}>{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
                    <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email}</Text>
                    <View style={[styles.memberBadge, { backgroundColor: colors.surfaceAlt }]}>
                        <Text style={[styles.memberBadgeText, { color: colors.textMuted }]}>
                            Miembro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }) : '—'}
                        </Text>
                    </View>
                </View>

                <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.menuItem, { borderBottomColor: colors.surfaceAlt }, index === menuItems.length - 1 && styles.menuItemLast]}
                                activeOpacity={0.6}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIconBox, { backgroundColor: colors.surfaceAlt }]}>
                                        <Icon size={18} color={colors.icon} strokeWidth={1.5} />
                                    </View>
                                    <View>
                                        <Text style={[styles.menuItemLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                                        <Text style={[styles.menuItemSubtitle, { color: colors.textPlaceholder }]}>{item.subtitle}</Text>
                                    </View>
                                </View>
                                <ChevronRight size={18} color={colors.textPlaceholder} strokeWidth={1.5} />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]} onPress={handleLogout} activeOpacity={0.7}>
                    <LogOut size={18} color={colors.text} strokeWidth={1.5} />
                    <Text style={[styles.logoutText, { color: colors.text }]}>Cerrar Sesion</Text>
                </TouchableOpacity>

                <Text style={[styles.appVersion, { color: colors.textPlaceholder }]}>v1.0.0</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
    headerTitle: { fontSize: 22, fontWeight: '700', marginBottom: 24, letterSpacing: -0.3 },
    profileCard: { borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
    avatarLarge: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
    avatarText: { fontSize: 28, fontWeight: '700' },
    userName: { fontSize: 20, fontWeight: '700', marginBottom: 2 },
    userEmail: { fontSize: 13, marginBottom: 14 },
    memberBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    memberBadgeText: { fontSize: 11, fontWeight: '600' },
    menuContainer: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, marginBottom: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1 },
    menuItemLast: { borderBottomWidth: 0 },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    menuIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    menuItemLabel: { fontSize: 14, fontWeight: '600' },
    menuItemSubtitle: { fontSize: 11, marginTop: 1, fontWeight: '500' },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, borderWidth: 1, marginBottom: 20 },
    logoutText: { fontSize: 15, fontWeight: '600' },
    appVersion: { textAlign: 'center', fontSize: 12, fontWeight: '500' },
});

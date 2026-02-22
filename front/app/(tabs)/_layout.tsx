import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LayoutDashboard, UserCircle, Settings, LogOut, CheckCircle2 } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── Sidebar para Web ───────────────────────────────────────
function WebSidebar({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: UserCircle, label: 'Perfil', path: '/profile' },
    { icon: CheckCircle2, label: 'Tareas', path: '/tasks' },
    { icon: Settings, label: 'Ajustes', path: '/settings' },
  ];

  return (
    <View style={[webStyles.layout, { backgroundColor: colors.background }]}>
      <View style={[webStyles.sidebar, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
        <View style={[webStyles.logoBox, { backgroundColor: colors.primary }]}>
          <Text style={[webStyles.logoText, { color: colors.primaryText }]}>SK</Text>
        </View>

        <View style={webStyles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <TouchableOpacity
                key={item.path}
                style={[webStyles.navItem, isActive && { backgroundColor: colors.surfaceAlt }]}
                onPress={() => router.push(`/(tabs)${item.path}` as any)}
                activeOpacity={0.7}
              >
                <Icon size={20} color={isActive ? colors.text : colors.textMuted} strokeWidth={isActive ? 2 : 1.5} />
                <Text style={[webStyles.navLabel, { color: isActive ? colors.text : colors.textMuted, fontWeight: isActive ? '600' : '500' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[webStyles.sidebarFooter, { borderTopColor: colors.border }]}>
          <View style={webStyles.userInfo}>
            <View style={[webStyles.userAvatar, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[webStyles.userAvatarText, { color: colors.text }]}>
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </Text>
            </View>
            <View style={webStyles.userMeta}>
              <Text style={[webStyles.userName, { color: colors.text }]} numberOfLines={1}>{user?.name}</Text>
              <Text style={[webStyles.userEmail, { color: colors.textMuted }]} numberOfLines={1}>{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={webStyles.logoutBtn} onPress={async () => { await logout(); (window as any).location.href = '/'; }} activeOpacity={0.7}>
            <LogOut size={16} color={colors.textMuted} strokeWidth={1.5} />
            <Text style={[webStyles.logoutText, { color: colors.textMuted }]}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={webStyles.main}>{children}</View>
    </View>
  );
}

// ─── Layout Principal ───────────────────────────────────────
export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  // Root layout handles redirect — just show loading or nothing
  if (isLoading || !isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="small" color={colors.textMuted} />
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <WebSidebar>
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="profile" />
          <Tabs.Screen name="settings" />
          <Tabs.Screen
            name="tasks"
            options={{
              title: 'Tareas',
              tabBarIcon: ({ color }) => <Ionicons size={28} name="checkmark-done" color={color} />,
            }}
          />
        </Tabs>
      </WebSidebar>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textPlaceholder,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size - 2} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <UserCircle size={size - 2} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => <Settings size={size - 2} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ color, size }) => <Ionicons size={size - 2} name="checkmark-done" color={color} />,
        }}
      />
    </Tabs>
  );
}

const webStyles = StyleSheet.create({
  layout: { flex: 1, flexDirection: 'row' as any },
  sidebar: { width: 240, borderRightWidth: 1, paddingTop: 24, paddingHorizontal: 16 },
  logoBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  logoText: { fontSize: 14, fontWeight: '700' },
  nav: { flex: 1, gap: 4 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  navLabel: { fontSize: 14 },
  sidebarFooter: { paddingVertical: 20, borderTopWidth: 1, gap: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userAvatar: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 13, fontWeight: '700' },
  userMeta: { flex: 1 },
  userName: { fontSize: 13, fontWeight: '600' },
  userEmail: { fontSize: 11 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { fontSize: 13, fontWeight: '500' },
  main: { flex: 1 },
});

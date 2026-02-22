import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { FolderKanban, CheckCircle2, Clock, Plus, ClipboardList, BarChart3, Settings, Lightbulb, Mail, CalendarDays } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const stats = [
    { icon: FolderKanban, label: 'Proyectos', value: '0' },
    { icon: CheckCircle2, label: 'Completados', value: '0' },
    { icon: Clock, label: 'Pendientes', value: '0' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Nuevo' },
    { icon: ClipboardList, label: 'Tareas' },
    { icon: BarChart3, label: 'Reportes' },
    { icon: Settings, label: 'Config' },
  ];

  const cardWidth = (width > 600 ? Math.min(width - 280, 800) : width - 50) / 2;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hola, {user?.name?.split(' ')[0] ?? 'Usuario'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>Bienvenido a tu dashboard</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <View key={i} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Icon size={20} color={colors.icon} strokeWidth={1.5} />
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Acciones Rapidas</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity key={i} style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border, width: cardWidth }]} activeOpacity={0.7}>
                <View style={[styles.actionIconBox, { backgroundColor: colors.surfaceAlt }]}>
                  <Icon size={20} color={colors.icon} strokeWidth={1.5} />
                </View>
                <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surfaceAlt }]}>
          <Lightbulb size={20} color={colors.icon} strokeWidth={1.5} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Starter Template</Text>
            <Text style={[styles.infoDesc, { color: colors.textMuted }]}>Personaliza este dashboard agregando tus propios modulos.</Text>
          </View>
        </View>

        <View style={[styles.sessionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sessionRow}>
            <Mail size={14} color={colors.iconMuted} strokeWidth={1.5} />
            <Text style={[styles.sessionText, { color: colors.textMuted }]}>{user?.email}</Text>
          </View>
          <View style={styles.sessionRow}>
            <CalendarDays size={14} color={colors.iconMuted} strokeWidth={1.5} />
            <Text style={[styles.sessionText, { color: colors.textMuted }]}>
              Miembro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-MX') : '—'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1 },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 14 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  actionCard: { borderRadius: 16, padding: 18, borderWidth: 1, gap: 10 },
  actionIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 14, fontWeight: '600' },
  infoCard: { flexDirection: 'row', borderRadius: 16, padding: 18, gap: 14, alignItems: 'flex-start', marginBottom: 16 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  infoDesc: { fontSize: 13, lineHeight: 18 },
  sessionCard: { borderRadius: 16, padding: 18, gap: 10, borderWidth: 1 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sessionText: { fontSize: 13, fontWeight: '500' },
});

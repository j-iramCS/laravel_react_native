import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  ClipboardList,
  BarChart3,
  Settings,
  Lightbulb,
  Mail,
  CalendarDays,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();

  const stats = [
    { icon: FolderKanban, label: 'Proyectos', value: '0', color: '#6366F1' },
    { icon: CheckCircle2, label: 'Completados', value: '0', color: '#10B981' },
    { icon: Clock, label: 'Pendientes', value: '0', color: '#F59E0B' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Nuevo', color: '#6366F1' },
    { icon: ClipboardList, label: 'Tareas', color: '#8B5CF6' },
    { icon: BarChart3, label: 'Reportes', color: '#10B981' },
    { icon: Settings, label: 'Config', color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hola, {user?.name?.split(' ')[0] ?? 'Usuario'}
            </Text>
            <Text style={styles.headerSubtitle}>Bienvenido a tu dashboard</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <Icon size={20} color={stat.color} strokeWidth={1.5} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: `${action.color}10` }]}>
                  <Icon size={20} color={action.color} strokeWidth={1.5} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Lightbulb size={20} color="#6366F1" strokeWidth={1.5} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Starter Template</Text>
            <Text style={styles.infoDesc}>
              Personaliza este dashboard agregando tus propios módulos.
            </Text>
          </View>
        </View>

        {/* Session Info */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionRow}>
            <Mail size={14} color="#9CA3AF" strokeWidth={1.5} />
            <Text style={styles.sessionText}>{user?.email}</Text>
          </View>
          <View style={styles.sessionRow}>
            <CalendarDays size={14} color="#9CA3AF" strokeWidth={1.5} />
            <Text style={styles.sessionText}>
              Miembro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-MX') : '—'}
            </Text>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#6366F1',
    fontSize: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 10,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 18,
    gap: 14,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: '#4338CA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  infoDesc: {
    color: '#6366F1',
    fontSize: 13,
    lineHeight: 18,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sessionText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
});

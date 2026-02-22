import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/context/ThemeContext';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/tasksApi';
import type { Task } from '@/services/tasksApi';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  X,
  ListTodo,
  Clock,
  CheckCheck,
} from 'lucide-react-native';

// ─── Types ──────────────────────────────────────────────────
type FilterType = 'all' | 'pending' | 'completed';

// ─── Task Item Component ────────────────────────────────────
function TaskItem({
  task,
  colors,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  colors: any;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.taskItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Toggle Button */}
      <TouchableOpacity
        onPress={onToggle}
        style={styles.toggleBtn}
        activeOpacity={0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {task.completed ? (
          <CheckCircle2 size={22} color={colors.primary} strokeWidth={2} />
        ) : (
          <Circle size={22} color={colors.textPlaceholder} strokeWidth={1.5} />
        )}
      </TouchableOpacity>

      {/* Content */}
      <TouchableOpacity onPress={onEdit} style={styles.taskContent} activeOpacity={0.7}>
        <Text
          style={[
            styles.taskTitle,
            {
              color: task.completed ? colors.textMuted : colors.text,
              textDecorationLine: task.completed ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text style={[styles.taskDescription, { color: colors.textMuted }]} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        <Text style={[styles.taskDate, { color: colors.textPlaceholder }]}>
          {new Date(task.created_at).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
          })}
        </Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={onDelete}
        style={[styles.deleteBtn, { backgroundColor: colors.surfaceAlt }]}
        activeOpacity={0.6}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Trash2 size={16} color={colors.textMuted} strokeWidth={1.5} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ────────────────────────────────────────────
export default function TasksScreen() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Confirm delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Data fetching ──────────────────────────────────────
  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'No se pudieron cargar las tareas' });
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadTasks();
      setLoading(false);
    })();
  }, [loadTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  // ─── Actions ────────────────────────────────────────────
  const handleToggle = async (task: Task) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
      await updateTask(task.id, { completed: !task.completed });
    } catch (error: any) {
      await loadTasks();
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'No se pudo actualizar' });
    }
  };

  const requestDelete = (id: number) => {
    setTaskToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete === null) return;
    setDeleting(true);
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      await deleteTask(taskToDelete);
      Toast.show({ type: 'success', text1: 'Eliminada', text2: 'La tarea fue eliminada correctamente' });
    } catch (error: any) {
      await loadTasks();
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'No se pudo eliminar' });
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
      setTaskToDelete(null);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTitleInput('');
    setDescInput('');
    setModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitleInput(task.title);
    setDescInput(task.description || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!titleInput.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'El título es obligatorio' });
      return;
    }

    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: titleInput.trim(),
          description: descInput.trim() || undefined,
        });
        Toast.show({ type: 'success', text1: 'Actualizada', text2: 'Tarea actualizada correctamente' });
      } else {
        await createTask(titleInput.trim(), descInput.trim() || undefined);
        Toast.show({ type: 'success', text1: 'Creada', text2: 'Nueva tarea agregada' });
      }
      setModalVisible(false);
      setTitleInput('');
      setDescInput('');
      setEditingTask(null);
      await loadTasks();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'No se pudo guardar' });
    } finally {
      setSaving(false);
    }
  };

  // ─── Filters ────────────────────────────────────────────
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  const filters: { key: FilterType; label: string; count: number; icon: any }[] = [
    { key: 'all', label: 'Todas', count: totalCount, icon: ListTodo },
    { key: 'pending', label: 'Pendientes', count: pendingCount, icon: Clock },
    { key: 'completed', label: 'Completadas', count: completedCount, icon: CheckCheck },
  ];

  // ─── Loading State ──────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="small" color={colors.textMuted} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textMuted} />
        }
      >
        {/* ─── Header ───────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Tareas</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              {totalCount === 0
                ? 'Sin tareas aún'
                : `${completedCount} de ${totalCount} completadas`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={openCreateModal}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Plus size={20} color={colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* ─── Stats / Filter Cards ─────────────────────── */}
        <View style={styles.statsRow}>
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.7}
              >
                <Icon
                  size={18}
                  color={isActive ? colors.primaryText : colors.icon}
                  strokeWidth={1.5}
                />
                <Text
                  style={[
                    styles.statValue,
                    { color: isActive ? colors.primaryText : colors.text },
                  ]}
                >
                  {f.count}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: isActive ? colors.primaryText : colors.textMuted },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Progress Bar ─────────────────────────────── */}
        {totalCount > 0 && (
          <View
            style={[
              styles.progressContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progreso</Text>
              <Text style={[styles.progressPct, { color: colors.text }]}>
                {Math.round((completedCount / totalCount) * 100)}%
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${(completedCount / totalCount) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* ─── Task List ────────────────────────────────── */}
        {filteredTasks.length === 0 ? (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.emptyIconBox, { backgroundColor: colors.surfaceAlt }]}>
              {filter === 'completed' ? (
                <CheckCheck size={28} color={colors.textPlaceholder} strokeWidth={1.5} />
              ) : filter === 'pending' ? (
                <Clock size={28} color={colors.textPlaceholder} strokeWidth={1.5} />
              ) : (
                <ListTodo size={28} color={colors.textPlaceholder} strokeWidth={1.5} />
              )}
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {filter === 'all'
                ? 'Sin tareas'
                : filter === 'pending'
                  ? 'Sin tareas pendientes'
                  : 'Sin tareas completadas'}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
              {filter === 'all'
                ? 'Toca el botón + para crear tu primera tarea'
                : 'Cambia el filtro para ver otras tareas'}
            </Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                colors={colors}
                onToggle={() => handleToggle(task)}
                onDelete={() => requestDelete(task.id)}
                onEdit={() => openEditModal(task)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* ─── Delete Confirm Modal ───────────────────────── */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => !deleting && setDeleteModalVisible(false)}>
          <Pressable
            style={[
              styles.confirmModal,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.confirmIconBox, { backgroundColor: '#FFEBEE' }]}>
              <Trash2 size={24} color="#C62828" strokeWidth={1.5} />
            </View>
            <Text style={[styles.confirmTitle, { color: colors.text }]}>Eliminar tarea</Text>
            <Text style={[styles.confirmMsg, { color: colors.textMuted }]}>
              ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={[styles.confirmCancelBtn, { backgroundColor: colors.surfaceAlt }]}
                activeOpacity={0.7}
                disabled={deleting}
              >
                <Text style={[styles.confirmCancelText, { color: colors.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={[styles.confirmDeleteBtn, { backgroundColor: '#C62828' }]}
                activeOpacity={0.8}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmDeleteText}>Eliminar</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ─── Create / Edit Modal ────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalCenter}
          >
            <Pressable
              style={[
                styles.modalContent,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceAlt }]}
                  activeOpacity={0.7}
                >
                  <X size={18} color={colors.textMuted} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Title Input */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Título</Text>
              <TextInput
                placeholder="¿Qué necesitas hacer?"
                placeholderTextColor={colors.textPlaceholder}
                value={titleInput}
                onChangeText={setTitleInput}
                style={[
                  styles.modalInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBg,
                    borderColor: colors.border,
                  },
                ]}
                autoFocus
                maxLength={255}
              />

              {/* Description Input */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Descripción{' '}
                <Text style={{ color: colors.textPlaceholder, fontWeight: '400' }}>(opcional)</Text>
              </Text>
              <TextInput
                placeholder="Agrega más detalles..."
                placeholderTextColor={colors.textPlaceholder}
                value={descInput}
                onChangeText={setDescInput}
                style={[
                  styles.modalInput,
                  styles.modalTextarea,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBg,
                    borderColor: colors.border,
                  },
                ]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[styles.modalCancelBtn, { backgroundColor: colors.surfaceAlt }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}
                  activeOpacity={0.8}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={colors.primaryText} />
                  ) : (
                    <Text style={[styles.modalSaveText, { color: colors.primaryText }]}>
                      {editingTask ? 'Guardar' : 'Crear'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
  },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500' },

  // Progress
  progressContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: { fontSize: 13, fontWeight: '600' },
  progressPct: { fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, minWidth: 2 },

  // Task List
  taskList: { gap: 8 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  toggleBtn: { padding: 2 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', letterSpacing: -0.1 },
  taskDescription: { fontSize: 12, marginTop: 3, lineHeight: 16, fontWeight: '500' },
  taskDate: { fontSize: 11, marginTop: 4, fontWeight: '500' },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
  emptyState: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 8,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyDesc: { fontSize: 13, fontWeight: '500', textAlign: 'center', lineHeight: 18 },

  // Confirm Delete Modal
  confirmModal: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
  },
  confirmIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, letterSpacing: -0.3 },
  confirmMsg: { fontSize: 13, fontWeight: '500', textAlign: 'center', lineHeight: 18, marginBottom: 24 },
  confirmActions: { flexDirection: 'row', gap: 10, width: '100%' },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmCancelText: { fontSize: 15, fontWeight: '600' },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmDeleteText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },

  // Create/Edit Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenter: { width: '100%', maxWidth: 440, paddingHorizontal: 20 },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }
      : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 20,
      }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 2 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 18,
  },
  modalTextarea: { minHeight: 80, paddingTop: 12 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600' },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveText: { fontSize: 15, fontWeight: '600' },
});

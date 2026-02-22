import { apiClient } from '@/config/axiosConfig';

export interface Task{
    id: number;
    user_id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface TaskResponse{
    success: boolean;
    task?: Task;
    tasks?: Task[];
    message?: string;
    error?: string;
}

// Obtener todas las tareas
export async function getTasks(): Promise<Task[]> {
    try {
        const { data } = await apiClient.get('/tasks');
        return data.tasks;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener tareas');
    }
}

// Crear una nueva tarea
export async function createTask(
    title: string,
    description?: string
): Promise<Task> {
    try {
        const { data } = await apiClient.post('/tasks', {
            title,
            description: description || '',
        });
        return data.task;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al crear tarea');
    }
}

// Obtener una tarea por ID
export async function getTask(
    id: number,
): Promise<Task> {
    try {
        const { data } = await apiClient.get('/tasks/' + id);
        return data.task;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener tarea');
    }
}

// Actualizar una tarea
export async function updateTask(
    id: number,
    updates: Partial<Task>
): Promise<Task> {
    try {
        const { data } = await apiClient.put('/tasks/' + id, updates);
        return data.task;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar tarea');
    }
}

// Eliminar una tarea
export async function deleteTask(
    id: number,
): Promise<void>{
    try {
        await apiClient.delete('/tasks/' + id);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al eliminar tarea');
    }
}
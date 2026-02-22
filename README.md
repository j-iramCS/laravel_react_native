# Laravel API + React Native Starter

Boilerplate para iniciar cualquier proyecto con **Laravel como API** y **React Native (Expo)** como frontend multiplataforma (Android, iOS, Web).

## Estructura del Proyecto

```
laravel_react_native/
├── back/          ← Laravel API (Sanctum Auth)
├── front/         ← React Native (Expo Router)
└── README.md      ← Este archivo
```

## Funcionalidades Incluidas

- **Welcome Screen** — Pantalla pública de bienvenida
- **Registro** — Crear cuenta con validación
- **Login** — Iniciar sesión con token Bearer
- **Dashboard** — Pantalla protegida con datos del usuario
- **Perfil** — Ver info del usuario + cerrar sesión
- **Tareas (CRUD)** — Módulo completo de ejemplo con crear, editar, eliminar y filtros
- **Ajustes** — Cambio de tema (Claro / Oscuro / Sistema)
- **Rutas protegidas** — Redirección automática si no hay sesión
- **Diseño minimalista** — Clean, Lucide icons, consistente en web y móvil
- **Toast Notifications** — Alertas bonitas cross-platform con `react-native-toast-message`
- **Tema Dark/Light** — Soporte completo con `ThemeContext`
- **Auto-detección de IP** — Funciona en dispositivos físicos sin config manual

## Requisitos

- **PHP** >= 8.2
- **Composer**
- **Node.js** >= 18
- **npm**
- **MariaDB / MySQL** (o SQLite si prefieres)

---

## Setup Rápido

### 1. Backend (Laravel API)

```bash
cd back

# Instalar dependencias
composer install

# Instalar Sanctum
composer require laravel/sanctum

# Copiar archivo de entorno y configurar tu base de datos
cp .env.example .env
# Edita .env con tus datos de DB (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

# Generar key
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor (--host=0.0.0.0 para que funcione con dispositivos móviles)
php artisan serve --host=0.0.0.0
```

> El API estará corriendo en `http://localhost:8000`
> ⚠️ **Nota importante:** Las migraciones de Sanctum **ya están incluidas** en el proyecto. NO ejecutes `php artisan vendor:publish` para Sanctum, causará migraciones duplicadas.

### 2. Frontend (React Native / Expo)

```bash
cd front

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar la app
npx expo start
```

> Presiona `w` para web, `a` para Android, `i` para iOS

### 3. URL del API

La app **detecta automáticamente** la IP de tu máquina para dispositivos físicos.
No necesitas configurar nada manualmente en desarrollo.

Para producción, edita `front/config/api.config.ts` y cambia la URL base.

---

## API Endpoints

| Método | Ruta              | Descripción                | Auth |
|--------|-------------------|----------------------------|------|
| POST   | `/api/register`   | Registro de usuario        | No   |
| POST   | `/api/login`      | Iniciar sesión             | No   |
| GET    | `/api/user`       | Obtener usuario actual     | Sí   |
| POST   | `/api/logout`     | Cerrar sesión              | Sí   |
| GET    | `/api/tasks`      | Listar tareas del usuario  | Sí   |
| POST   | `/api/tasks`      | Crear tarea                | Sí   |
| GET    | `/api/tasks/{id}` | Ver una tarea              | Sí   |
| PUT    | `/api/tasks/{id}` | Actualizar tarea           | Sí   |
| DELETE | `/api/tasks/{id}` | Eliminar tarea             | Sí   |

## Pantallas

| Pantalla   | Ruta                | Protegida |
|------------|---------------------|-----------|
| Welcome    | `/`                 | No        |
| Login      | `/login`            | No        |
| Register   | `/register`         | No        |
| Dashboard  | `/(tabs)/`          | Sí        |
| Perfil     | `/(tabs)/profile`   | Sí        |
| Tareas     | `/(tabs)/tasks`     | Sí        |
| Ajustes    | `/(tabs)/settings`  | Sí        |

---

## Dependencias Principales del Frontend

| Paquete | Uso |
|---------|-----|
| `expo` | Framework base |
| `expo-router` | Navegación basada en archivos |
| `axios` | Peticiones HTTP al API |
| `@react-native-async-storage/async-storage` | Almacenamiento local (token, tema) |
| `react-native-toast-message` | Alertas/notificaciones cross-platform |
| `lucide-react-native` | Iconos minimalistas |

---

## Cómo Crear un Nuevo Módulo (Paso a Paso)

Ejemplo: crear un módulo de **Notas**.

### Paso 1 — Backend: Modelo + Migración + Controlador

```bash
cd back
php artisan make:model Note -mcr
```

Esto crea 3 archivos:
- `app/Models/Note.php`
- `database/migrations/xxxx_create_notes_table.php`
- `app/Http/Controllers/NoteController.php`

### Paso 2 — Backend: Definir la migración

Edita `database/migrations/xxxx_create_notes_table.php`:

```php
public function up(): void
{
    Schema::create('notes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('content')->nullable();
        $table->timestamps();
    });
}
```

Luego ejecuta:

```bash
php artisan migrate
```

### Paso 3 — Backend: Modelo

Edita `app/Models/Note.php`:

```php
class Note extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### Paso 4 — Backend: Controlador

Edita `app/Http/Controllers/NoteController.php`:

```php
public function index()
{
    $notes = Note::where('user_id', auth()->id())->get();
    return response()->json(['notes' => $notes], 200);
}

public function store(Request $request)
{
    $data = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'nullable|string',
    ]);

    $note = Note::create([...$data, 'user_id' => auth()->id()]);
    return response()->json(['note' => $note], 201);
}

public function update(Request $request, string $id)
{
    $note = Note::where('user_id', auth()->id())->findOrFail($id);
    $data = $request->validate([
        'title' => 'sometimes|required|string|max:255',
        'content' => 'sometimes|nullable|string',
    ]);
    $note->update($data);
    return response()->json(['note' => $note], 200);
}

public function destroy(string $id)
{
    $note = Note::where('user_id', auth()->id())->findOrFail($id);
    $note->delete();
    return response()->json(['success' => 'Note deleted'], 200);
}
```

### Paso 5 — Backend: Registrar ruta

Edita `routes/api.php`:

```php
Route::apiResource('notes', NoteController::class);
```

> Debe estar **dentro** del grupo `middleware('auth:sanctum')`.

---

### Paso 6 — Frontend: Crear servicio API

Crea `front/services/notesApi.ts`:

```typescript
import { apiClient } from '@/config/axiosConfig';

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

export async function getNotes(): Promise<Note[]> {
  const { data } = await apiClient.get('/notes');
  return data.notes;
}

export async function createNote(title: string, content?: string): Promise<Note> {
  const { data } = await apiClient.post('/notes', { title, content });
  return data.note;
}

export async function updateNote(id: number, updates: Partial<Note>): Promise<Note> {
  const { data } = await apiClient.put('/notes/' + id, updates);
  return data.note;
}

export async function deleteNote(id: number): Promise<void> {
  await apiClient.delete('/notes/' + id);
}
```

### Paso 7 — Frontend: Crear pantalla

Crea `front/app/(tabs)/notes.tsx`. Usa el patrón de `tasks.tsx` como referencia:

```typescript
import Toast from 'react-native-toast-message';
import { useTheme } from '@/context/ThemeContext';
import { getNotes, createNote, deleteNote } from '@/services/notesApi';

export default function NotesScreen() {
  const { colors } = useTheme();
  // ... tu lógica aquí

  // Usar Toast para mensajes de éxito
  Toast.show({ type: 'success', text1: 'Creada', text2: 'Nota creada correctamente' });

  // Usar Toast para errores
  Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo crear la nota' });

  // Usar Toast para info
  Toast.show({ type: 'info', text1: 'Info', text2: 'Mensaje informativo' });
}
```

### Paso 8 — Frontend: Registrar en el layout

Edita `front/app/(tabs)/_layout.tsx`:

**En el array `menuItems` del sidebar (web):**

```typescript
import { StickyNote } from 'lucide-react-native'; // importar icono

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: UserCircle, label: 'Perfil', path: '/profile' },
  { icon: CheckCircle2, label: 'Tareas', path: '/tasks' },
  { icon: StickyNote, label: 'Notas', path: '/notes' },     // ← Agregar
  { icon: Settings, label: 'Ajustes', path: '/settings' },
];
```

**En los `<Tabs.Screen>` (móvil + web):**

```tsx
<Tabs.Screen
  name="notes"
  options={{
    title: 'Notas',
    tabBarIcon: ({ color, size }) => <StickyNote size={size - 2} color={color} strokeWidth={1.5} />,
  }}
/>
```

> Agregar tanto en la sección web como en la sección móvil del layout.

---

## Sistema de Tema

El proyecto incluye un `ThemeContext` con soporte para **Claro**, **Oscuro** y **Sistema**.

```typescript
import { useTheme } from '@/context/ThemeContext';

const { colors, mode, setMode } = useTheme();

// Usar colores del tema
<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Hola</Text>
</View>
```

**Colores disponibles:**

| Color | Uso |
|-------|-----|
| `colors.background` | Fondo principal |
| `colors.surface` | Fondo de tarjetas |
| `colors.surfaceAlt` | Fondo alternativo |
| `colors.border` | Bordes |
| `colors.text` | Texto principal |
| `colors.textSecondary` | Texto secundario |
| `colors.textMuted` | Texto difuminado |
| `colors.textPlaceholder` | Placeholders |
| `colors.primary` | Color principal (botones, acentos) |
| `colors.primaryText` | Texto sobre color principal |

---

## Toast Notifications

Usa `react-native-toast-message` para mostrar alertas bonitas en **web y móvil**:

```typescript
import Toast from 'react-native-toast-message';

// Éxito
Toast.show({
  type: 'success',
  text1: 'Guardado',
  text2: 'Los cambios se guardaron correctamente',
});

// Error
Toast.show({
  type: 'error',
  text1: 'Error',
  text2: 'No se pudo completar la operación',
});

// Información
Toast.show({
  type: 'info',
  text1: 'Aviso',
  text2: 'Tienes 3 tareas pendientes',
});
```

> El Toast ya está configurado en el layout raíz (`app/_layout.tsx`) con diseño personalizado que respeta el tema activo. No necesitas configurar nada adicional, solo importar y usar.

---

## Autenticación

Usa **Laravel Sanctum** con tokens Bearer. El token se almacena automáticamente en `AsyncStorage` y se envía en cada petición via interceptor de Axios.

```
Authorization: Bearer tu_token_aqui
```

---

## Licencia

MIT

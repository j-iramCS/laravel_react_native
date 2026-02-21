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
- **Rutas protegidas** — Redirección automática si no hay sesión
- **Diseño minimalista** — Clean, Lucide icons
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

# Publicar migraciones de Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor (--host=0.0.0.0 para que funcione con dispositivos móviles)
php artisan serve --host=0.0.0.0
```

> El API estará corriendo en `http://localhost:8000`

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

Para producción, edita `front/services/api.ts` y descomenta la línea con tu URL real.

---

## API Endpoints

| Método | Ruta           | Descripción              | Auth |
|--------|----------------|--------------------------|------|
| POST   | `/api/register`| Registro de usuario      | No   |
| POST   | `/api/login`   | Iniciar sesión           | No   |
| GET    | `/api/user`    | Obtener usuario actual   | Si   |
| POST   | `/api/logout`  | Cerrar sesión            | Si   |

## Autenticación

Usa **Laravel Sanctum** con tokens Bearer:

```
Authorization: Bearer tu_token_aqui
```

## Pantallas

| Pantalla   | Ruta               | Protegida |
|------------|---------------------|-----------|
| Welcome    | `/`                 | No        |
| Login      | `/login`            | No        |
| Register   | `/register`         | No        |
| Dashboard  | `/(tabs)/`          | Si        |
| Perfil     | `/(tabs)/profile`   | Si        |

---

## Como personalizar

1. **Agregar modelos/controladores** en `back/app/`
2. **Agregar rutas API** en `back/routes/api.php`
3. **Agregar pantallas** en `front/app/`
4. **Agregar tabs** en `front/app/(tabs)/`

## Licencia

MIT

# Autenticación del Sistema Escolar

Este documento describe el funcionamiento del sistema de **autenticación segura** implementado en el proyecto **ColeApp - Sistema Escolar**, utilizando **JWT (JSON Web Tokens)**, **bcrypt** y **cookie-parser**.

IMPORTANTE: Las contraseñas estan hasheadas y ya no son visibles en la db. Recordar para testing que todas son iguales al IdUsuario.

## Tecnologías utilizadas

| Paquete | Uso |
|----------|------|
| `jsonwebtoken` | Generar y verificar tokens JWT |
| `bcrypt` | Hashear contraseñas de usuarios |
| `cookie-parser` | Leer y escribir cookies HTTP seguras |
| `dotenv` | Manejar claves secretas y variables de entorno |
| `express` | Framework del servidor backend |
| `better-sqlite3` | Base de datos ligera y rápida |
| `cors` | Permitir peticiones del frontend React |

## Arquitectura general

El sistema se divide en **dos capas principales**:

- **Frontend (React):** muestra el formulario de login, guarda el token y maneja la sesión mediante `AuthContext`.
- **Backend (Node/Express):** valida las credenciales, genera el JWT, lo firma con una clave secreta y lo envía en una cookie segura.

---

## Flujo de autenticación

### 1. Registro (opcional / inicial)

Durante la creación de usuarios, la contraseña se **hashea con bcrypt**:

```js
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash(pass, 10);
db.prepare("INSERT INTO Usuarios (NombreUsuario, Pass, Tipo) VALUES (?, ?, ?)")
  .run(nombreUsuario, hashedPassword, tipo);
```

Así nunca se guarda una contraseña en texto plano.

---

### 2. Login (`POST /auth/login`)

El usuario envía su nombre y contraseña.  
El servidor:

1. Busca al usuario por nombre
2. Compara la contraseña ingresada con el hash guardado
3. Si es válida, genera un **JWT firmado**

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user.IdUsuario, tipo: user.Tipo },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: "1h" }
);
```

4. Devuelve el token como **cookie HTTP-only** (más segura frente a ataques XSS):

```js
res
  .cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  })
  .json({ user });
```

---

### 3. Autenticación persistente (`GET /auth/me`)

En cada recarga, el frontend llama al endpoint `/auth/me`.  
El backend lee la cookie, verifica el token y devuelve los datos del usuario:

```js
import cookieParser from "cookie-parser";
app.use(cookieParser());

app.get("/auth/me", (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = db.prepare("SELECT * FROM Usuarios WHERE IdUsuario = ?").get(decoded.id);
    res.json({ user });
  } catch {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
});
```

---

### 4. Logout (`POST /auth/logout`)

El cierre de sesión simplemente **borra la cookie**:

```js
res.clearCookie("accessToken").json({ message: "Sesión cerrada" });
```

---

## Variables de entorno (`.env`)

```env
# CONFIGURACIÓN GENERAL
APP_NAME=ColeApp
PORT=3002
NODE_ENV=development
DB_PATH=./db/sistema_escolar.db
CLIENT_ORIGIN=http://localhost:3000

# JWT
JWT_ACCESS_SECRET=COLEAPP_ACCESS_KEY_SUPER_SECRETA_2025
JWT_REFRESH_SECRET=COLEAPP_REFRESH_KEY_SUPER_SECRETA_2025
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# COOKIES
COOKIE_ACCESS=coleapp_access_token
COOKIE_REFRESH=coleapp_refresh_token
```

---
### Doble token (Access + Refresh)

El sistema utiliza un esquema de autenticación con dos tokens:

| Tipo de Token | Duración | Ubicación | Uso |
|----------------|-----------|-----------|-----|
| **Access Token** | 15 minutos | Respuesta JSON (en memoria React) | Autorizar peticiones a `/api` |
| **Refresh Token** | 7 días | Cookie HTTP-only (`coleapp_refresh_token`) | Generar nuevos access tokens sin volver a loguearse |

El **Access Token** se firma con `JWT_ACCESS_SECRET`, mientras que el **Refresh Token** usa `JWT_REFRESH_SECRET`, ambos definidos en `.env`.


## Seguridad aplicada

✅ Contraseñas hasheadas (bcrypt)  
✅ JWT firmados con clave privada  
✅ Cookies HTTP-only  
✅ Expiración automática del token  
✅ Validación de usuario en cada request (`/auth/me`)  

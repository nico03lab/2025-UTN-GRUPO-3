# ColeApp 2025 — 2025 UTN GRUPO 3

## ¿Como fue desarrollado este proyecto?
Proyecto fullstack desarrollado para la materia **Desarrollo de Software**.  
Incluye un **frontend en React** y un **backend en Node.js + Express + SQLite**, completamente dockerizado para facilitar la ejecución en cualquier entorno.

## Descripcion sobre el proyecto
El proyecto fue desarrollado con la finalidad de conseguir una correcta gestion academica para una escuela. Abarca:
    - Cursos: Gestion de alumnos
    - Alumnos: Seguimiento sobre la trayectoria escolar
    - Profesores: Gestión de calificaciones, inasistencias
    - Directivos: Manejo de solicitudes de inscripción
    - Tutores: Seguimiento de la trayectoria escolar de un alumno a cargo
Objetivo: Optimizar la administración escolar a través de la tecnología

## Estructura del proyecto
    2025-UTN-GRUPO-3/
    ├── backend/
    │   ├── src/
    │   ├── package.json
    │   ├── Dockerfile
    │   └── .env
    ├── frontend/
    │   ├── src/
    │   ├── package.json
    │   ├── Dockerfile
    │   └── .env
    ├── docker-compose.yml
    └── README.md

## Instrucciones para instalar y ejecutar el proyecto
### 1. Clonar el repositorio
```bash
git clone https://github.com/nico03lab/2025-UTN-GRUPO-3.git
cd 2025-UTN-GRUPO-3
```

### 2. Tener instalado:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/en) (Para correr el programa sin docker)
- [Git](https://git-scm.com/)

### 3. Configurar variables de entorno:
En el **backend**, crear el archivo `.env` con el siguiente contenido:
```bash
    DB_PATH=./db/sistema_escolar.db
    PORT=3002
    NODE_ENV=development````

En el **fronted**, crear el archivo .env con el siguiente contenido
```bash
    REACT_APP_API_URL=http://backend:5000
    PORT=3000
    NODE_ENV=development````

### 4. Construir y levantar los contenedores
```bash
	docker compose up --build````

Este comando:
- Construye las imágenes del **frontend** y **backend**.  
- Crea la red interna (`appnet`).  
- Levanta ambos servicios en paralelo.

### 5. Verificar que todo funcione
- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend → [http://localhost:3002](http://localhost:3002)

---

### 6. Ejecutar sin docker
# Backend
    cd backend
    npm install
    npm run dev
# Frontend
    cd frontend
    npm install
    npm run dev



##Comandos útiles
### Detener la ejecución
```bash
Ctrl + C
docker compose down
```

### Limpiar todo (contenedores, imágenes y volúmenes)
```bash
docker compose down --rmi all --volumes
```

### Levantar en segundo plano (modo daemon)
```bash
docker compose up -d
```

Ver contenedores activos:
```bash
docker ps
```

Ver logs en tiempo real:
```bash
docker compose logs -f
```


## Equipo de desarrollo
#### Integrante 1: Ciardullo Geraldine     | Usuario GitHub: https://github.com/geral912
#### Integrante 2: Laborde Nicolas         | Usuario GitHub: http://github.com/nico03lab
#### Integrante 3: Martinez Yanina         | Usuario GitHub: https://github.com/yamartinez03
#### Integrante 4: Morinigo Roger          | Usuario GitHub: https://github.com/rfmorinigo

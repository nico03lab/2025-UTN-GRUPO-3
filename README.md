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
    NODE_ENV=development
```

En el **fronted**, crear el archivo .env con el siguiente contenido
```bash
    REACT_APP_API_URL=http://backend:5000
    PORT=3000
    NODE_ENV=development
```

### 4. Construir y levantar los contenedores
```bash
	docker compose up --build
````

Este comando:
- Construye las imágenes del **frontend** y **backend**.  
- Crea la red interna (`appnet`).  
- Levanta ambos servicios en paralelo.

### 5. Verificar que todo funcione
- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend → [http://localhost:3002](http://localhost:3002)

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

## Arquitectura de Software
```mermaid
graph TD
    subgraph "CLIENTE (Frontend)"
        A["React + Tailwind CSS + DaisyUI<br>Puerto: 3000"]
        
        subgraph "CAPA DE VISTA"
            B1["Pages/<br>- HomePage<br>- Login<br>- Alumnos<br>- Tutores<br>- Inscripción<br>- Directivos"]
            B2["Components/<br>- Sidebar<br>- Dashboards<br>- Forms<br>- Tabs"]
            B3["Public/<br>- index.html<br>- assets"]
        end
        
        subgraph "CAPA DE LÓGICA (Services)"
            C1["AlumnoService<br>DirectivoService"]
            C2["DocenteService<br>TutorService"]
            C3["AuthContext<br>axios.jsx"]
        end
        
        subgraph "CAPA DE UTILIDADES"
            D["Context API, Utils, Toast Notifications"]
        end
    end
    
    A --> E["HTTP/REST(GET, POST, PUT…)<br>Axios (cliente HTTP)<br>Formato: JSON"]
    
    subgraph "SERVIDOR (Backend)"
        F["Node.js + Express.js<br>Puerto: 3002"]
        
        subgraph "CAPA DE RUTAS (Routes)"
            G1["index.js Router Principal"]
            G2["/api/alumnos -> alumnosRoutes.js"]
            G3["/api/docentes -> docentesRoutes.js"]
            G4["/api/cursos -> cursosRoutes.js"]
            G5["/api/asistencias -> asistenciasRoutes.js"]
            G6["/api/calificaciones -> calificacionesRoutes.js"]
            G7["/api/inscripcion -> inscripcionRoutes.js"]
            G8["/api/documentos -> documentosRoutes.js"]
            G9["/api/eventos -> eventosRoutes.js"]
            G10["/api/notificaciones -> notificacionesRoutes.js"]
            G11["/api/stats -> StatsRoutes.js"]
            G12["/api/users -> usersRoutes.js"]
            G13["/api/directivos -> directivosRoutes.js"]
            G14["/api/auth -> auth.js"]
        end
        
        subgraph "CAPA DE CONTROLADORES (Controllers)"
            H1["alumnos Controller<br>docentes Controller<br>tutores Controller<br>users Controller<br>directivo Controller"]
            H2["asistencias Controller<br>documentos Controller<br>calificaciones Controller<br>eventos Controller<br>localidad Controller<br>cursos Controller<br>inscripciones Controller<br>notificaciones Controller<br>stats Controller<br>padreModel"]
        end
        
        subgraph "CAPA DE CONFIGURACIÓN"
            I["db.js (Conexión a BD)<br>multerConfig (File Upload - carpeta: /Uploads)"]
        end
    end
    
    E --> F
    
    F --> J["SQLite <br>Driver: better-sqlite3"]
    
    subgraph "BASE DE DATOS (SQLite)"
        K["sistema_escolar.db"]
        
        subgraph "Tablas"
            subgraph COL3[" "]
                direction TB
                L9["DetalleAsistencia"]
                L10["DifusionCurso"]
                L11["Directivo"]
                L12["Docentes"]
            end
            subgraph COL4[" "]
                direction TB
                L13["Documentacion Inscripciones"]
                L14["Especialidades"]
                L15["Eventos"]
                L16["EventosCurso"]
            end
        
            %% COLUMNA 5
            subgraph COL5[" "]
                direction TB
                L17["EventosUsuario"]
                L18["HorarioMateria"]
                L19["Inscripciones"]
                L20["Localidades"]
            end
            subgraph COL6[" "]
                direction TB
                L21["Materias"]
                L22["Mensajes"]
                L23["Notificaciones"]
                L24["NotificacionesUsuarios"]
                L25["Tutores"]
                L26["Usuarios"]
            end
            subgraph COL2[" "]
                direction TB
                L5["Boletines"]
                L6["BoletinDetalle"]
                L7["Curso"]
                L8["CursoMateria"]
            end
            subgraph COL1[" "]
                direction TB
                L1["Alumnos"]
                L2["AlumnosTutor"]
                L3["Asistencias"]
                L4["Aulas"]
            end
        end
    end
    
    J --> K

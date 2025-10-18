# Sistema Escolar — 2025 UTN GRUPO 3

Proyecto fullstack desarrollado para la materia **Desarrollo de Software**.  
Incluye un **frontend en React** y un **backend en Node.js + Express + SQLite**, completamente dockerizado para facilitar la ejecución en cualquier entorno.


## Montar el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/nico03lab/2025-UTN-GRUPO-3.git
cd 2025-UTN-GRUPO-3
```

### 2. Crear el archivo `.env`
En la raíz del proyecto, crear el archivo `.env` con el siguiente contenido:
```bash
DB_PATH=./db/sistema_escolar.db
PORT=3002
NODE_ENV=development
```

### 3. Construir y levantar los contenedores
```bash
docker compose up --build
```

Este comando:
- Construye las imágenes del **frontend** y **backend**.  
- Crea la red interna (`appnet`).  
- Levanta ambos servicios en paralelo.

### 4. Verificar que todo funcione
- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend → [http://localhost:3002](http://localhost:3002)

---

## Comandos útiles

### Detener la ejecución
Si estás corriendo en primer plano:
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
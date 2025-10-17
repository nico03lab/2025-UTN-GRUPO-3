# 1. Imagen base de Node
FROM node:20.19.5-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar archivos de dependencias primero (para aprovechar el cache de Docker)
COPY package*.json ./

# 4. Instalar dependencias
RUN npm ci

# 5. Copiar el resto del código fuente
COPY . .

# 6. Exponer el puerto del backend (el mismo que definas en .env)
EXPOSE 3002

# 7. Comando que ejecuta el servidor
CMD ["node", "server.js"]

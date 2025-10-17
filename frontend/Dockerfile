# 1. Imagen base
FROM node:20.19.5-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copiar los archivos de dependencias
COPY package*.json ./

# 4. Instalar dependencias
RUN npm ci

# 5. Copiar el resto del código
COPY . .

# 6. Exponer el puerto donde CRA sirve la app
EXPOSE 3000

# 7. Comando por defecto al iniciar el contenedor
CMD ["npm", "start"]

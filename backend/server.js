const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT ;

//Middlewares

app.use(cors());
app.use(express.json());

// Importar rutas
app.use('/cursos', require('./routes/cursosRoutes'));
app.use('/alumnos', require('./routes/alumnosRoutes'));
app.use('/asistencias', require('./routes/asistenciasRoutes'));
app.use('/inscripcion', require('./routes/inscripcionRoutes'));



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

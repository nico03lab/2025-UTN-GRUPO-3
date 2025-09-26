const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const apiRouter = require('./routes/index');
const PORT = process.env.PORT || 3002;

//Middlewares

app.use(cors());
app.use(express.json());

//Importar ruta principal
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

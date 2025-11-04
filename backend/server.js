const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const PORT = process.env.PORT || 3002;

const app = express();
const apiRouter = require('./routes/index');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');

//Middlewares

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true // importante si usas cookies
}));
app.use(express.json());
app.use(cookieParser());

//Importar ruta principal
app.use('/api', apiRouter);
app.use('/auth', authRouter);
//Importar uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

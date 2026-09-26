import express from 'express';
import { config } from './config.js';
import { manejadorErrores } from './middlewares/errores.js';
import routerUsuarios from './routers/usuarios.js'; 

const app = express();

app.use(express.json());

app.use('/usuarios', routerUsuarios);


app.use(manejadorErrores);

app.listen(config.puerto, () => {
  console.log(`Servidor escuchando en http://localhost:5000`);
});

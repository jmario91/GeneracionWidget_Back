import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarDB } from './config/database.js';
import rutasUsuarios from './routes/usuarios.routes.js';
import catalogosRoutes from './routes/catalogos.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/catalogos', catalogosRoutes);
const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
});

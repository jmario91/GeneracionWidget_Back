import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarDB } from './config/database.js';
import rutasUsuarios from './routes/usuarios.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', rutasUsuarios);

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
});

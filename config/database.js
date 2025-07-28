import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error en conexión:', error.message);
    process.exit(1);
  }
};

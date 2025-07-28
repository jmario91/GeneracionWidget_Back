import mongoose from 'mongoose';
import { CATALOGOS } from '../utils/catalogos.js';
 
const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    apellidoPaterno: {
      type: String,
      required: [true, 'El apellido paterno es obligatorio'],
      trim: true,
      maxlength: [50, 'El apellido paterno no puede exceder 50 caracteres']
    },
    apellidoMaterno: {
      type: String,
      trim: true,
      maxlength: [50, 'El apellido materno no puede exceder 50 caracteres']
    },
    estatus: {
      type: String,
      enum: CATALOGOS.ESTATUS_USUARIO,
   
    },
    fechaNacimiento: {
      type: String,
      
    },
    sexo: {
      type: String,
      enum: CATALOGOS.SEXOS,
      required: [true, 'El sexo es obligatorio']
    },
    edad: {
      type: Number,
      required: [true, 'La edad es obligatoria'],
      min: [0, 'La edad no puede ser negativa'],
      max: [120, 'La edad no puede ser mayor a 120 años']
    },
    entidad: {
      type: String,
    trim: true
    },
    municipio: {
      type: String,
    
      trim: true
    },
    colonia: {
      type: String,
    
      trim: true
    },
    codigoPostal: {
      type: String,
      },
    talla: {
      type: Number,
      required: [true, 'La talla es obligatoria'],
      min: [0.5, 'La talla debe ser mayor a 0.5 metros'],
      max: [3.0, 'La talla no puede ser mayor a 3 metros']
    },
    peso: {
      type: Number,
      required: [true, 'El peso es obligatorio'],
      min: [1, 'El peso debe ser mayor a 1 kg'],
      max: [500, 'El peso no puede ser mayor a 500 kg']
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
    },
    aceptaTerminos: {
      type: Boolean,

    },
    // Nuevos campos opcionales
    ocupacion: {
      type: String,
      trim: true
    },
    estadoCivil: {
      type: String,
      enum: CATALOGOS.ESTADOS_CIVILES,
      trim: true
    },
    nivelEducativo: {
      type: String,
      enum: CATALOGOS.NIVELES_EDUCATIVOS,
      trim: true
    },
    idioma: {
      type: String,
      enum: CATALOGOS.IDIOMAS,
      trim: true
    },
    // Campos adicionales para el formulario Angular
    hobbies: {
      type: [String],
      enum: CATALOGOS.HOBBIES_DISPONIBLES,
      default: []
    },
    notasAdicionales: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas adicionales no pueden exceder 1000 caracteres']
    }
  },
  { 
    timestamps: true, 
    versionKey: false 
  }
);

/* Virtual opcional para edad calculada */
usuarioSchema.virtual('edadCalculada').get(function () {
  if (!this.fechaNacimiento) return null;
  const hoy = new Date();
  const nacimiento = new Date(this.fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
});
usuarioSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Usuario', usuarioSchema);

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  numeroUsuario: {
    type: Number,
    unique: true,
    index: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['ADMIN', 'ALUMNO'],
    default: 'ALUMNO',
    index: true
  },
  perfil: {
    grupo: { type: String, trim: true },
    semestre: { type: Number, min: 1, max: 20 },
    carrera: { type: String, trim: true, default: 'ISC' }
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para auto-incrementar numeroUsuario antes de guardar
usuarioSchema.pre('save', async function(next) {
  // Solo asignar número si es un documento nuevo y no tiene numeroUsuario
  if (this.isNew && !this.numeroUsuario) {
    try {
      const ultimoUsuario = await this.constructor.findOne({}, { numeroUsuario: 1 })
        .sort({ numeroUsuario: -1 })
        .limit(1);
      
      this.numeroUsuario = ultimoUsuario && ultimoUsuario.numeroUsuario 
        ? ultimoUsuario.numeroUsuario + 1 
        : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);

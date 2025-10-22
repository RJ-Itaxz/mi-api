const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Usuario', usuarioSchema);

const mongoose = require('mongoose');

const ejercicioSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  tema: { type: String, required: true, trim: true },
  dificultad: { type: String, enum: ['facil','media','dificil'], default: 'facil', index: true },
  descripcion: { type: String, required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Ejercicio', ejercicioSchema);

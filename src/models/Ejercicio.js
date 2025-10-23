const mongoose = require('mongoose');

const ejercicioSchema = new mongoose.Schema({
  numeroEjercicio: { type: Number, unique: true, index: true },
  titulo: { type: String, required: true, trim: true },
  tema: { type: String, required: true, trim: true },
  dificultad: { type: String, enum: ['facil','media','dificil'], default: 'facil', index: true },
  descripcion: { type: String, required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

// Middleware para auto-incrementar numeroEjercicio antes de guardar
ejercicioSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroEjercicio) {
    try {
      const ultimoEjercicio = await this.constructor.findOne({}, { numeroEjercicio: 1 })
        .sort({ numeroEjercicio: -1 })
        .limit(1);
      
      this.numeroEjercicio = ultimoEjercicio && ultimoEjercicio.numeroEjercicio 
        ? ultimoEjercicio.numeroEjercicio + 1 
        : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Ejercicio', ejercicioSchema);

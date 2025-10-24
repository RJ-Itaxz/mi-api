const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es requerido'], 
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: { 
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  autor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: [true, 'El autor es requerido']
  },
  activo: { 
    type: Boolean, 
    default: true 
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  icono: {
    type: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
MateriaSchema.index({ autor: 1, activo: 1 });
MateriaSchema.index({ nombre: 'text', descripcion: 'text' });

// Virtual para contar unidades
MateriaSchema.virtual('unidades', {
  ref: 'Unidad',
  localField: '_id',
  foreignField: 'materia'
});

module.exports = mongoose.model('Materia', MateriaSchema);
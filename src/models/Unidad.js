const mongoose = require('mongoose');

const UnidadSchema = new mongoose.Schema({
  materia: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Materia', 
    required: [true, 'La materia es requerida'],
    index: true 
  },
  numero: { 
    type: Number, 
    required: [true, 'El número de unidad es requerido'],
    min: [1, 'El número debe ser mayor a 0']
  },
  titulo: { 
    type: String, 
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [150, 'El título no puede exceder 150 caracteres']
  },
  descripcion: { 
    type: String,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  objetivos: [{
    type: String,
    maxlength: [200, 'Cada objetivo no puede exceder 200 caracteres']
  }],
  activo: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UnidadSchema.index({ materia: 1, numero: 1 }, { unique: true });
UnidadSchema.index({ activo: 1 });

UnidadSchema.virtual('temas', {
  ref: 'Tema',
  localField: '_id',
  foreignField: 'unidad'
});

module.exports = mongoose.model('Unidad', UnidadSchema);

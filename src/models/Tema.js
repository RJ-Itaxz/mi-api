const mongoose = require('mongoose');

const TemaSchema = new mongoose.Schema({
  unidad: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Unidad', 
    required: [true, 'La unidad es requerida'],
    index: true 
  },
  titulo: { 
    type: String, 
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [150, 'El título no puede exceder 150 caracteres']
  },
  contenido: { 
    type: String,
    maxlength: [10000, 'El contenido no puede exceder 10000 caracteres']
  },
  orden: { 
    type: Number, 
    default: 0,
    min: [0, 'El orden no puede ser negativo']
  },
  duracionEstimada: {
    type: Number,
    min: [1, 'La duración debe ser al menos 1 minuto']
  },
  recursos: [{
    tipo: {
      type: String,
      enum: ['VIDEO', 'PDF', 'LINK', 'IMAGEN']
    },
    url: String,
    titulo: String
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

TemaSchema.index({ unidad: 1, orden: 1 });
TemaSchema.index({ activo: 1 });

TemaSchema.virtual('ejercicios', {
  ref: 'Ejercicio',
  localField: '_id',
  foreignField: 'tema'
});

module.exports = mongoose.model('Tema', TemaSchema);

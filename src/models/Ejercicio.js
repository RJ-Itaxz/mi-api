const mongoose = require('mongoose');

const EjercicioSchema = new mongoose.Schema({
  tema: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tema', 
    required: [true, 'El tema es requerido'],
    // índice simple removido intencionalmente: existe un índice compuesto
    // EjercicioSchema.index({ tema: 1, numeroEjercicio: 1 }) que ya cubre
    // la necesidad de búsquedas por tema + número. Mantener ambos puede
    // provocar la advertencia de índice duplicado en Mongoose.
  },
  informacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Informacion',
    index: true
  },
  titulo: { 
    type: String, 
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  enunciado: { 
    type: String,
    required: [true, 'El enunciado es requerido'],
    maxlength: [5000, 'El enunciado no puede exceder 5000 caracteres']
  },
  tipo: {
    type: String,
    enum: ['OPCION_MULTIPLE', 'VERDADERO_FALSO', 'RESPUESTA_CORTA', 'DESARROLLO'],
    default: 'OPCION_MULTIPLE'
  },
  opciones: [{ 
    texto: {
      type: String,
      required: true,
      maxlength: [500, 'La opción no puede exceder 500 caracteres']
    },
    esCorrecta: {
      type: Boolean,
      default: false
    }
  }],
  respuestaCorrecta: { 
    type: mongoose.Schema.Types.Mixed 
  },
  explicacion: {
    type: String,
    maxlength: [1000, 'La explicación no puede exceder 1000 caracteres']
  },
  dificultad: { 
    type: String, 
    enum: ['FACIL', 'MEDIA', 'DIFICIL'], 
    default: 'MEDIA' 
  },
  numeroEjercicio: { 
    type: Number,
    min: [1, 'El número debe ser mayor a 0']
  },
  puntaje: {
    type: Number,
    default: 1,
    min: [0, 'El puntaje no puede ser negativo']
  },
  activo: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

EjercicioSchema.index({ tema: 1, numeroEjercicio: 1 });
EjercicioSchema.index({ dificultad: 1 });
EjercicioSchema.index({ activo: 1 });

EjercicioSchema.pre('save', function(next) {
  if (this.tipo === 'OPCION_MULTIPLE' && (!this.opciones || this.opciones.length < 2)) {
    return next(new Error('Los ejercicios de opción múltiple deben tener al menos 2 opciones'));
  }
  
  if (this.tipo === 'OPCION_MULTIPLE') {
    const correctas = this.opciones.filter(o => o.esCorrecta);
    if (correctas.length === 0) {
      return next(new Error('Debe haber al menos una opción correcta'));
    }
  }
  
  next();
});

module.exports = mongoose.model('Ejercicio', EjercicioSchema);

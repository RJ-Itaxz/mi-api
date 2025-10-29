const mongoose = require('mongoose');

// Sub-esquema para conceptos clave
const ConceptoClaveSchema = new mongoose.Schema({
  termino: {
    type: String,
    required: [true, 'El término es requerido'],
    trim: true,
    maxlength: [200, 'El término no puede exceder 200 caracteres']
  },
  definicion: {
    type: String,
    required: [true, 'La definición es requerida'],
    maxlength: [2000, 'La definición no puede exceder 2000 caracteres']
  },
  ejemplos: [{
    type: String,
    maxlength: [500, 'El ejemplo no puede exceder 500 caracteres']
  }]
}, { _id: false });

// Sub-esquema para ejercicios de ejemplo
const EjercicioEjemploSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['VERDADERO_FALSO', 'OPCION_MULTIPLE', 'PREGUNTA_ABIERTA', 'PRACTICA'],
    required: true
  },
  enunciado: {
    type: String,
    required: [true, 'El enunciado es requerido'],
    maxlength: [1000, 'El enunciado no puede exceder 1000 caracteres']
  },
  opciones: [{
    texto: {
      type: String,
      required: true,
      maxlength: [300, 'La opción no puede exceder 300 caracteres']
    },
    esCorrecta: {
      type: Boolean,
      default: false
    }
  }],
  respuestaCorrecta: {
    type: String,
    maxlength: [500, 'La respuesta correcta no puede exceder 500 caracteres']
  },
  explicacion: {
    type: String,
    maxlength: [800, 'La explicación no puede exceder 800 caracteres']
  }
}, { _id: false });

const InformacionSchema = new mongoose.Schema({
  tema: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tema', 
    required: [true, 'El tema es requerido'],
    unique: true // Un tema solo puede tener una información asociada
  },
  conceptosClave: [ConceptoClaveSchema],
  ejemploBreve: {
    type: String,
    maxlength: [1000, 'El ejemplo breve no puede exceder 1000 caracteres']
  },
  ejerciciosEjemplo: [EjercicioEjemploSchema],
  contenidoAdicional: {
    type: String,
    maxlength: [5000, 'El contenido adicional no puede exceder 5000 caracteres']
  },
  recursos: [{
    titulo: {
      type: String,
      maxlength: [200, 'El título del recurso no puede exceder 200 caracteres']
    },
    url: {
      type: String,
      maxlength: [500, 'La URL no puede exceder 500 caracteres']
    },
    tipo: {
      type: String,
      enum: ['LECTURA', 'VIDEO', 'EJERCICIO', 'HERRAMIENTA', 'OTRO'],
      default: 'LECTURA'
    }
  }],
  dificultad: { 
    type: String, 
    enum: ['FACIL', 'MEDIA', 'DIFICIL'], 
    default: 'MEDIA' 
  },
  estadisticas: {
    ejerciciosGenerados: {
      type: Number,
      default: 0
    },
    ultimaActualizacion: {
      type: Date,
      default: Date.now
    }
  },
  activo: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Índices
// Nota: el campo `tema` ya declara `unique: true` por lo que Mongoose crea el índice
// automáticamente. Evitamos declarar un índice redundante en schema.index() para
// no provocar la advertencia de 'Duplicate schema index on {"tema":1}'.
InformacionSchema.index({ dificultad: 1 });
InformacionSchema.index({ activo: 1 });
InformacionSchema.index({ 'estadisticas.ultimaActualizacion': 1 });

// Virtual para obtener ejercicios generados basados en esta información
InformacionSchema.virtual('ejerciciosGenerados', {
  ref: 'Ejercicio',
  localField: '_id',
  foreignField: 'informacion'
});

// Middleware para actualizar estadísticas
InformacionSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.estadisticas.ultimaActualizacion = new Date();
  }
  next();
});

// Método para obtener resumen de conceptos
InformacionSchema.methods.getResumenConceptos = function() {
  return this.conceptosClave.map(concepto => ({
    termino: concepto.termino,
    definicion: concepto.definicion.substring(0, 200) + (concepto.definicion.length > 200 ? '...' : '')
  }));
};

// Método para obtener contexto completo para LLM
InformacionSchema.methods.getContextoLLM = function() {
  const conceptos = this.conceptosClave.map(c => 
    `• ${c.termino}: ${c.definicion}${c.ejemplos.length > 0 ? ` Ejemplos: ${c.ejemplos.join(', ')}` : ''}`
  ).join('\n');
  
  const ejerciciosEjemplo = this.ejerciciosEjemplo.map(e => 
    `- ${e.tipo}: ${e.enunciado}${e.respuestaCorrecta ? ` (Respuesta: ${e.respuestaCorrecta})` : ''}`
  ).join('\n');
  
  return {
    conceptos,
    ejemploBreve: this.ejemploBreve || '',
    ejerciciosEjemplo,
    contenidoAdicional: this.contenidoAdicional || '',
    dificultad: this.dificultad
  };
};

module.exports = mongoose.model('Informacion', InformacionSchema);
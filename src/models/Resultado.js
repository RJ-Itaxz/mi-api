const mongoose = require('mongoose');

const resultadoSchema = new mongoose.Schema({
  alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  ejercicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Ejercicio', required: true, index: true },
  correcto: { type: Boolean, default: false },
  puntaje: { type: Number, default: 0 },
  tiempoSeg: { type: Number, default: 0 },
  detalles: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Resultado', resultadoSchema);

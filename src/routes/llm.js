const express = require('express');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Nota: Integración con LLM (Gemini) aún no configurada.
// Estas rutas devuelven respuestas simuladas para continuar el desarrollo del backend.

router.post('/explicacion', authMiddleware, async (req, res) => {
  const { pregunta, tema } = req.body;
  res.json({ success: true, data: { tipo: 'explicacion', tema, respuesta: `Explicación simulada para: ${pregunta}` } });
});

router.post('/feedback', authMiddleware, async (req, res) => {
  const { codigo, lenguaje } = req.body;
  res.json({ success: true, data: { tipo: 'feedback', lenguaje, retro: 'Buen intento. Considera mejorar la legibilidad y cubrir casos borde.' } });
});

module.exports = router;

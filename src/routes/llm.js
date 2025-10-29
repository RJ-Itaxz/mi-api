const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const Tema = require('../models/Tema');
const Unidad = require('../models/Unidad');
const Materia = require('../models/Materia');
const Informacion = require('../models/Informacion');
const { generateText, isConfigured } = require('../../services/geminiClient');
const { selfTest } = require('../../services/geminiClient');
const Ejercicio = require('../models/Ejercicio');

const router = express.Router();

// GET /api/llm/health - Estado de salud del cliente LLM (rápido) o test completo
// Query param: full=true para ejecutar un selfTest que realiza una llamada a Gemini
router.get('/health', async (req, res) => {
  try {
    const full = req.query.full === 'true' || req.query.full === '1';
    const configured = isConfigured();

    const mongoose = require('mongoose');
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const basic = {
      llmConfigured: configured,
      dbState: dbStateMap[mongoose.connection.readyState] || mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    };

    if (!full) return res.json({ success: true, data: basic });

    // full true -> ejecutar selfTest (puede demorar y hace una llamada a la API de Gemini)
    const test = await selfTest();
    return res.json({ success: true, data: { ...basic, selfTest: test } });
  } catch (err) {
    console.error('LLM health check error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/llm/generar-ejercicio - Genera ejercicio con Gemini basado en un tema
router.post('/generar-ejercicio', authMiddleware, async (req, res) => {
  try {
    const { temaId, dificultad = 'MEDIA', tipo = 'OPCION_MULTIPLE', guardar = false } = req.body;
    
    if (!temaId) {
      return res.status(400).json({ 
        success: false, 
        error: 'El ID del tema es requerido' 
      });
    }
    
    // Verificar que Gemini esté configurado
    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini no está configurado. Verifica GOOGLE_GEMINI_API_KEY en .env'
      });
    }
    
    // Buscar tema con su unidad y materia
    const tema = await Tema.findById(temaId)
      .populate({
        path: 'unidad',
        populate: { path: 'materia' }
      });
    
    if (!tema) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tema no encontrado' 
      });
    }
    
    // Buscar información detallada del tema
    const informacion = await Informacion.findOne({ tema: temaId });
    
    // Construir contexto para Gemini
    const materia = tema.unidad.materia.nombre;
    const unidad = tema.unidad.titulo;
    const tituloTema = tema.titulo;
    const contenidoTema = tema.contenido || '';
    
    // Si hay información disponible, usar el contexto enriquecido
    let contextoDetallado = '';
    if (informacion) {
      const contextoLLM = informacion.getContextoLLM();
      contextoDetallado = `
CONCEPTOS CLAVE:
${contextoLLM.conceptos}

${contextoLLM.ejemploBreve ? `EJEMPLO: ${contextoLLM.ejemploBreve}` : ''}

${contextoLLM.ejerciciosEjemplo ? `EJERCICIOS DE REFERENCIA:
${contextoLLM.ejerciciosEjemplo}` : ''}

${contextoLLM.contenidoAdicional ? `CONTENIDO ADICIONAL:
${contextoLLM.contenidoAdicional}` : ''}`;
    }
    
    // Crear prompt para Gemini
    const systemPrompt = `Eres un profesor experto en ${materia}. 
Tu tarea es generar ejercicios educativos de alta calidad basados en el tema proporcionado.
Debes responder ÚNICAMENTE con un objeto JSON válido, sin texto adicional antes o después.`;
    
    let userPrompt = '';
    
    if (tipo === 'OPCION_MULTIPLE') {
      userPrompt = `Genera un ejercicio de opción múltiple sobre el siguiente tema:

Materia: ${materia}
Unidad: ${unidad}
Tema: ${tituloTema}
${contenidoTema ? `Contenido: ${contenidoTema.substring(0, 500)}` : ''}
${contextoDetallado}

Dificultad: ${dificultad}

Responde SOLO con un objeto JSON con esta estructura exacta:
{
  "titulo": "Título breve y descriptivo del ejercicio",
  "enunciado": "Pregunta clara y específica del ejercicio",
  "opciones": [
    { "texto": "Opción A", "esCorrecta": false },
    { "texto": "Opción B", "esCorrecta": true },
    { "texto": "Opción C", "esCorrecta": false },
    { "texto": "Opción D", "esCorrecta": false }
  ],
  "explicacion": "Explicación detallada de por qué la respuesta correcta es la correcta",
  "dificultad": "${dificultad}",
  "puntaje": ${dificultad === 'FACIL' ? 1 : dificultad === 'MEDIA' ? 2 : 3}
}`;
    } else if (tipo === 'VERDADERO_FALSO') {
      userPrompt = `Genera un ejercicio de verdadero/falso sobre el siguiente tema:

Materia: ${materia}
Unidad: ${unidad}
Tema: ${tituloTema}
${contenidoTema ? `Contenido: ${contenidoTema.substring(0, 500)}` : ''}
${contextoDetallado}

Dificultad: ${dificultad}

Responde SOLO con un objeto JSON con esta estructura exacta:
{
  "titulo": "Título breve del ejercicio",
  "enunciado": "Afirmación clara que puede ser verdadera o falsa",
  "opciones": [
    { "texto": "Verdadero", "esCorrecta": true },
    { "texto": "Falso", "esCorrecta": false }
  ],
  "explicacion": "Explicación de por qué es verdadero o falso",
  "dificultad": "${dificultad}",
  "puntaje": ${dificultad === 'FACIL' ? 1 : dificultad === 'MEDIA' ? 2 : 3}
}`;
    }
    
    // Llamar a Gemini
    const { text } = await generateText({
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxOutputTokens: 1500
    });
    
    // Intentar parsear la respuesta como JSON
    let ejercicioGenerado;
    try {
      // Limpiar posibles marcadores de código
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      ejercicioGenerado = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Error parseando respuesta de Gemini:', text);
      return res.status(500).json({
        success: false,
        error: 'Error procesando la respuesta de Gemini',
        rawResponse: text
      });
    }
    
    // Agregar tipo y tema al ejercicio
    ejercicioGenerado.tipo = tipo;
    ejercicioGenerado.tema = temaId;

    // Si se solicita guardar, solo permitir a ADMIN y persistir en BD
    if (guardar) {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          error: 'No autorizado para guardar ejercicios. Requiere rol ADMIN.'
        });
      }

      try {
        // Preparar payload para el modelo Ejercicio
        const payload = {
          tema: temaId,
          titulo: ejercicioGenerado.titulo,
          enunciado: ejercicioGenerado.enunciado,
          tipo: ejercicioGenerado.tipo,
          opciones: ejercicioGenerado.opciones,
          respuestaCorrecta: ejercicioGenerado.respuestaCorrecta,
          explicacion: ejercicioGenerado.explicacion,
          dificultad: (ejercicioGenerado.dificultad || dificultad || 'MEDIA').toUpperCase(),
          puntaje: ejercicioGenerado.puntaje
        };

        // Asignar número correlativo si no viene en la respuesta
        if (!ejercicioGenerado.numeroEjercicio) {
          const count = await Ejercicio.countDocuments({ tema: temaId });
          payload.numeroEjercicio = count + 1;
        } else {
          payload.numeroEjercicio = ejercicioGenerado.numeroEjercicio;
        }

        // Si hay información disponible, relacionar el ejercicio con ella
        if (informacion) {
          payload.informacion = informacion._id;
          // Incrementar contador de ejercicios generados
          await Informacion.findByIdAndUpdate(
            informacion._id, 
            { 
              $inc: { 'estadisticas.ejerciciosGenerados': 1 },
              'estadisticas.ultimaActualizacion': new Date()
            }
          );
        }

        const saved = await Ejercicio.create(payload);

        return res.status(201).json({
          success: true,
          data: {
            ejercicio: saved,
            contexto: { 
              materia, 
              unidad, 
              tema: tituloTema,
              informacionUsada: !!informacion
            }
          },
          message: 'Ejercicio generado y guardado exitosamente'
        });
      } catch (saveErr) {
        return res.status(400).json({
          success: false,
          error: saveErr.message
        });
      }
    }

    // Si no se solicita guardar, solo devolver el ejercicio generado
    res.json({
      success: true,
      data: {
        ejercicio: ejercicioGenerado,
        contexto: {
          materia,
          unidad,
          tema: tituloTema,
          informacionUsada: !!informacion
        }
      },
      message: 'Ejercicio generado exitosamente por Gemini'
    });
    
  } catch (err) {
    console.error('Error generando ejercicio:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Rutas existentes
router.post('/explicacion', authMiddleware, async (req, res) => {
  const { pregunta, tema } = req.body;
  res.json({ success: true, data: { tipo: 'explicacion', tema, respuesta: `Explicación simulada para: ${pregunta}` } });
});

router.post('/feedback', authMiddleware, async (req, res) => {
  const { codigo, lenguaje } = req.body;
  res.json({ success: true, data: { tipo: 'feedback', lenguaje, retro: 'Buen intento. Considera mejorar la legibilidad y cubrir casos borde.' } });
});

module.exports = router;

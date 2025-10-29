// Ejemplo de implementación de evaluación con LLM
const { GoogleGenerativeAI } = require('@google/generative-ai');

class EvaluadorLLM {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async evaluarEjercicio(ejercicio, respuestaAlumno, contextoAlumno = {}) {
    try {
      // Construir prompt contextualizado
      const prompt = this.construirPromptEvaluacion(ejercicio, respuestaAlumno, contextoAlumno);
      
      // Generar evaluación con LLM
      const result = await this.model.generateContent(prompt);
      const evaluacion = this.procesarRespuestaLLM(result.response.text());
      
      return evaluacion;
    } catch (error) {
      console.error('Error en evaluación LLM:', error);
      return this.evaluacionFallback(ejercicio, respuestaAlumno);
    }
  }

  construirPromptEvaluacion(ejercicio, respuestaAlumno, contexto) {
    return `
# EVALUADOR EDUCATIVO EXPERTO

## CONTEXTO DEL ALUMNO:
- Nivel: ${contexto.nivel || 'Intermedio'}
- Materia: ${contexto.materia || 'Programación'}
- Ejercicios previos completados: ${contexto.ejerciciosCompletados || 0}
- Temas débiles identificados: ${contexto.temasDebiles?.join(', ') || 'Ninguno'}

## EJERCICIO A EVALUAR:
**Tipo:** ${ejercicio.tipo}
**Tema:** ${ejercicio.tema}
**Enunciado:** ${ejercicio.enunciado}
**Dificultad:** ${ejercicio.dificultad}

${ejercicio.tipo === 'OPCION_MULTIPLE' ? 
  `**Opciones:**\n${ejercicio.opciones.map((op, i) => `${i+1}. ${op.texto} ${op.esCorrecta ? '[CORRECTA]' : ''}`).join('\n')}` : 
  `**Respuesta Esperada:** ${ejercicio.respuestaCorrecta}`
}

## RESPUESTA DEL ALUMNO:
"${respuestaAlumno}"

## INSTRUCCIONES DE EVALUACIÓN:

1. **EVALÚA LA RESPUESTA:**
   - Para opción múltiple: verifica si eligió la opción correcta
   - Para verdadero/falso: verifica si la respuesta es correcta
   - Para desarrollo: analiza comprensión conceptual, completitud y precisión

2. **GENERA RETROALIMENTACIÓN CONSTRUCTIVA:**
   - Aspectos correctos de la respuesta
   - Errores específicos identificados
   - Conceptos que necesita reforzar
   - Sugerencias concretas de mejora

3. **PROPORCIONA CONTEXTO EDUCATIVO:**
   - Explica por qué la respuesta correcta es correcta
   - Identifica misconceptos comunes
   - Sugiere recursos o ejercicios adicionales

4. **ADAPTA AL NIVEL DEL ALUMNO:**
   - Usa lenguaje apropiado para su nivel
   - Proporciona ejemplos relevantes
   - Ajusta la complejidad de las explicaciones

## FORMATO DE RESPUESTA (JSON):
{
  "evaluacion": {
    "esCorrecta": boolean,
    "puntajeObtenido": number,
    "puntajeMaximo": number,
    "nivelComprension": "BASICO|INTERMEDIO|AVANZADO"
  },
  "retroalimentacion": {
    "mensaje": "Mensaje principal de retroalimentación",
    "aspectosCorrectos": ["lista de aspectos correctos"],
    "aspectosIncorrectos": ["lista de errores específicos"],
    "explicacionConcepto": "Explicación clara del concepto",
    "sugerencias": ["sugerencias específicas de mejora"],
    "recursosAdicionales": ["ejercicios o temas para repasar"]
  },
  "seguimiento": {
    "conceptosDominados": ["conceptos que maneja bien"],
    "conceptosDebiles": ["conceptos que necesita reforzar"],
    "proximosEjercicios": ["tipos de ejercicios recomendados"]
  }
}
`;
  }

  procesarRespuestaLLM(respuestaTexto) {
    try {
      // Extraer JSON de la respuesta del LLM
      const jsonMatch = respuestaTexto.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback si no hay JSON válido
      return this.crearEvaluacionBasica(respuestaTexto);
    } catch (error) {
      console.error('Error procesando respuesta LLM:', error);
      return this.crearEvaluacionBasica(respuestaTexto);
    }
  }

  crearEvaluacionBasica(respuestaTexto) {
    return {
      evaluacion: {
        esCorrecta: null,
        puntajeObtenido: 0,
        puntajeMaximo: 2,
        nivelComprension: "INTERMEDIO"
      },
      retroalimentacion: {
        mensaje: respuestaTexto,
        aspectosCorrectos: [],
        aspectosIncorrectos: [],
        explicacionConcepto: "Evaluación en proceso...",
        sugerencias: ["Revisa el material del tema"],
        recursosAdicionales: []
      },
      seguimiento: {
        conceptosDominados: [],
        conceptosDebiles: [],
        proximosEjercicios: []
      }
    };
  }

  evaluacionFallback(ejercicio, respuestaAlumno) {
    // Evaluación básica cuando el LLM no está disponible
    let esCorrecta = false;
    
    if (ejercicio.tipo === 'OPCION_MULTIPLE') {
      const opcionCorrecta = ejercicio.opciones.find(op => op.esCorrecta);
      esCorrecta = respuestaAlumno === opcionCorrecta?.texto;
    } else if (ejercicio.tipo === 'VERDADERO_FALSO') {
      esCorrecta = respuestaAlumno === ejercicio.respuestaCorrecta;
    }

    return {
      evaluacion: {
        esCorrecta,
        puntajeObtenido: esCorrecta ? ejercicio.puntaje : 0,
        puntajeMaximo: ejercicio.puntaje,
        nivelComprension: "INTERMEDIO"
      },
      retroalimentacion: {
        mensaje: esCorrecta ? "¡Respuesta correcta!" : "Respuesta incorrecta. Revisa el concepto.",
        aspectosCorrectos: esCorrecta ? ["Respuesta acertada"] : [],
        aspectosIncorrectos: esCorrecta ? [] : ["Selección incorrecta"],
        explicacionConcepto: ejercicio.explicacion || "Consulta el material del tema",
        sugerencias: esCorrecta ? ["Continúa con ejercicios similares"] : ["Repasa el tema antes de continuar"],
        recursosAdicionales: []
      },
      seguimiento: {
        conceptosDominados: esCorrecta ? [ejercicio.tema] : [],
        conceptosDebiles: esCorrecta ? [] : [ejercicio.tema],
        proximosEjercicios: []
      }
    };
  }

  // Método para evaluación masiva de sesión completa
  async evaluarSesionCompleta(ejerciciosResueltos, contextoAlumno) {
    const evaluaciones = [];
    let puntajeTotal = 0;
    let puntajeMaximo = 0;
    
    for (const item of ejerciciosResueltos) {
      const evaluacion = await this.evaluarEjercicio(
        item.ejercicio, 
        item.respuesta, 
        contextoAlumno
      );
      
      evaluaciones.push(evaluacion);
      puntajeTotal += evaluacion.evaluacion.puntajeObtenido;
      puntajeMaximo += evaluacion.evaluacion.puntajeMaximo;
    }

    // Análisis general de la sesión
    const analisisGeneral = await this.analizarSesionCompleta(evaluaciones, contextoAlumno);

    return {
      evaluacionesIndividuales: evaluaciones,
      resumenSesion: {
        puntajeTotal,
        puntajeMaximo,
        porcentaje: Math.round((puntajeTotal / puntajeMaximo) * 100),
        ejerciciosCorrectos: evaluaciones.filter(e => e.evaluacion.esCorrecta).length,
        totalEjercicios: evaluaciones.length
      },
      analisisGeneral,
      recomendaciones: this.generarRecomendaciones(evaluaciones)
    };
  }

  async analizarSesionCompleta(evaluaciones, contexto) {
    const prompt = `
Analiza esta sesión de ejercicios y proporciona un análisis integral:

EVALUACIONES: ${JSON.stringify(evaluaciones, null, 2)}
CONTEXTO: ${JSON.stringify(contexto, null, 2)}

Proporciona:
1. Análisis de fortalezas y debilidades
2. Progreso comparado con sesiones anteriores
3. Recomendaciones de estudio personalizadas
4. Próximos objetivos de aprendizaje
`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      return "Análisis general: Continúa practicando y repasa los conceptos donde tuviste dificultades.";
    }
  }

  generarRecomendaciones(evaluaciones) {
    const conceptosDebiles = [];
    const conceptosFuertes = [];
    
    evaluaciones.forEach(evaluacion => {
      if (evaluacion.evaluacion.esCorrecta) {
        conceptosFuertes.push(...evaluacion.seguimiento.conceptosDominados);
      } else {
        conceptosDebiles.push(...evaluacion.seguimiento.conceptosDebiles);
      }
    });

    return {
      temasParaRepasar: [...new Set(conceptosDebiles)],
      temasAReforzar: [...new Set(conceptosFuertes)],
      siguientesEjercicios: this.sugerirProximosEjercicios(conceptosDebiles),
      estrategiaEstudio: this.sugerirEstrategiaEstudio(evaluaciones)
    };
  }

  sugerirProximosEjercicios(conceptosDebiles) {
    // Lógica para sugerir ejercicios específicos basados en debilidades
    return conceptosDebiles.map(concepto => ({
      tema: concepto,
      tipo: 'REPASO',
      dificultad: 'FACIL'
    }));
  }

  sugerirEstrategiaEstudio(evaluaciones) {
    const rendimiento = evaluaciones.filter(evaluacion => evaluacion.evaluacion.esCorrecta).length / evaluaciones.length;
    
    if (rendimiento >= 0.8) {
      return "Excelente dominio. Avanza a temas más avanzados.";
    } else if (rendimiento >= 0.6) {
      return "Buen progreso. Refuerza conceptos específicos identificados.";
    } else {
      return "Necesitas repasar los fundamentos antes de continuar.";
    }
  }
}

module.exports = EvaluadorLLM;
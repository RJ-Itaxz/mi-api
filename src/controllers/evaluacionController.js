// Controlador para evaluación de ejercicios con LLM
const EvaluadorLLM = require('../services/evaluadorLLM');
const Ejercicio = require('../models/Ejercicio');
const Resultado = require('../models/Resultado');
const Usuario = require('../models/Usuario');

const evaluadorLLM = new EvaluadorLLM();

class EvaluacionController {
  
  // Evaluar un ejercicio individual
  static async evaluarEjercicio(req, res) {
    try {
      const { ejercicioId, respuestaAlumno } = req.body;
      const userId = req.user._id; // Del middleware de auth

      // Obtener ejercicio y contexto del alumno
      const ejercicio = await Ejercicio.findById(ejercicioId)
        .populate('tema')
        .populate('informacion');
      
      if (!ejercicio) {
        return res.status(404).json({ 
          error: 'Ejercicio no encontrado' 
        });
      }

      // Obtener contexto del alumno
      const contextoAlumno = await EvaluacionController.obtenerContextoAlumno(userId);

      // Evaluar con LLM
      const evaluacion = await evaluadorLLM.evaluarEjercicio(
        ejercicio, 
        respuestaAlumno, 
        contextoAlumno
      );

      // Guardar resultado
      const resultado = new Resultado({
        usuario: userId,
        ejercicio: ejercicioId,
        respuestaAlumno,
        esCorrecta: evaluacion.evaluacion.esCorrecta,
        puntajeObtenido: evaluacion.evaluacion.puntajeObtenido,
        puntajeMaximo: evaluacion.evaluacion.puntajeMaximo,
        retroalimentacion: evaluacion.retroalimentacion,
        fechaRealizacion: new Date()
      });

      await resultado.save();

      // Actualizar progreso del usuario
      await EvaluacionController.actualizarProgresoUsuario(userId, evaluacion);

      res.json({
        success: true,
        evaluacion,
        resultadoId: resultado._id
      });

    } catch (error) {
      console.error('Error evaluando ejercicio:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  // Evaluar sesión completa de ejercicios
  static async evaluarSesion(req, res) {
    try {
      const { ejerciciosResueltos } = req.body; // [{ ejercicioId, respuesta }]
      const userId = req.user._id;

      // Obtener ejercicios y contexto
      const ejerciciosCompletos = await Promise.all(
        ejerciciosResueltos.map(async (item) => {
          const ejercicio = await Ejercicio.findById(item.ejercicioId)
            .populate('tema')
            .populate('informacion');
          
          return {
            ejercicio,
            respuesta: item.respuesta
          };
        })
      );

      const contextoAlumno = await EvaluacionController.obtenerContextoAlumno(userId);

      // Evaluar sesión completa con LLM
      const evaluacionSesion = await evaluadorLLM.evaluarSesionCompleta(
        ejerciciosCompletos, 
        contextoAlumno
      );

      // Guardar todos los resultados
      const resultados = await Promise.all(
        evaluacionSesion.evaluacionesIndividuales.map(async (evaluacion, index) => {
          const resultado = new Resultado({
            usuario: userId,
            ejercicio: ejerciciosResueltos[index].ejercicioId,
            respuestaAlumno: ejerciciosResueltos[index].respuesta,
            esCorrecta: evaluacion.evaluacion.esCorrecta,
            puntajeObtenido: evaluacion.evaluacion.puntajeObtenido,
            puntajeMaximo: evaluacion.evaluacion.puntajeMaximo,
            retroalimentacion: evaluacion.retroalimentacion,
            fechaRealizacion: new Date()
          });
          
          return await resultado.save();
        })
      );

      // Actualizar progreso general del usuario
      await EvaluacionController.actualizarProgresoCompleto(userId, evaluacionSesion);

      res.json({
        success: true,
        evaluacionSesion,
        resultadosIds: resultados.map(r => r._id)
      });

    } catch (error) {
      console.error('Error evaluando sesión:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  // Obtener retroalimentación detallada de un resultado
  static async obtenerRetroalimentacion(req, res) {
    try {
      const { resultadoId } = req.params;
      const userId = req.user._id;

      const resultado = await Resultado.findOne({
        _id: resultadoId,
        usuario: userId
      })
      .populate('ejercicio')
      .populate('usuario');

      if (!resultado) {
        return res.status(404).json({ 
          error: 'Resultado no encontrado' 
        });
      }

      // Si no hay retroalimentación previa, generarla
      if (!resultado.retroalimentacion || !resultado.retroalimentacion.mensaje) {
        const contextoAlumno = await EvaluacionController.obtenerContextoAlumno(userId);
        
        const nuevaEvaluacion = await evaluadorLLM.evaluarEjercicio(
          resultado.ejercicio, 
          resultado.respuestaAlumno, 
          contextoAlumno
        );

        resultado.retroalimentacion = nuevaEvaluacion.retroalimentacion;
        await resultado.save();
      }

      res.json({
        success: true,
        resultado: {
          ejercicio: resultado.ejercicio,
          respuestaAlumno: resultado.respuestaAlumno,
          esCorrecta: resultado.esCorrecta,
          puntajeObtenido: resultado.puntajeObtenido,
          puntajeMaximo: resultado.puntajeMaximo,
          retroalimentacion: resultado.retroalimentacion,
          fechaRealizacion: resultado.fechaRealizacion
        }
      });

    } catch (error) {
      console.error('Error obteniendo retroalimentación:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  // Obtener análisis de progreso del alumno
  static async obtenerAnalisisProgreso(req, res) {
    try {
      const userId = req.user._id;
      const { periodo } = req.query; // 'semana', 'mes', 'todo'

      // Filtro de fecha según período
      let filtroFecha = {};
      const ahora = new Date();
      
      if (periodo === 'semana') {
        filtroFecha.fechaRealizacion = {
          $gte: new Date(ahora.setDate(ahora.getDate() - 7))
        };
      } else if (periodo === 'mes') {
        filtroFecha.fechaRealizacion = {
          $gte: new Date(ahora.setMonth(ahora.getMonth() - 1))
        };
      }

      // Obtener resultados del período
      const resultados = await Resultado.find({
        usuario: userId,
        ...filtroFecha
      })
      .populate('ejercicio')
      .sort({ fechaRealizacion: -1 });

      // Generar análisis con LLM
      const contextoAlumno = await EvaluacionController.obtenerContextoAlumno(userId);
      
      const analisisDetallado = await EvaluacionController.generarAnalisisProgreso(
        resultados, 
        contextoAlumno, 
        periodo
      );

      res.json({
        success: true,
        analisis: analisisDetallado,
        estadisticas: EvaluacionController.calcularEstadisticas(resultados)
      });

    } catch (error) {
      console.error('Error obteniendo análisis de progreso:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  // MÉTODOS AUXILIARES

  static async obtenerContextoAlumno(userId) {
    const usuario = await Usuario.findById(userId);
    
    const resultadosRecientes = await Resultado.find({ usuario: userId })
      .populate('ejercicio')
      .sort({ fechaRealizacion: -1 })
      .limit(20);

    // Analizar rendimiento por temas
    const rendimientoPorTema = {};
    resultadosRecientes.forEach(resultado => {
      const tema = resultado.ejercicio.tema?.toString();
      if (tema) {
        if (!rendimientoPorTema[tema]) {
          rendimientoPorTema[tema] = { correctas: 0, total: 0 };
        }
        rendimientoPorTema[tema].total++;
        if (resultado.esCorrecta) {
          rendimientoPorTema[tema].correctas++;
        }
      }
    });

    // Identificar temas débiles (menos del 60% de aciertos)
    const temasDebiles = Object.keys(rendimientoPorTema).filter(tema => {
      const rendimiento = rendimientoPorTema[tema];
      return (rendimiento.correctas / rendimiento.total) < 0.6;
    });

    return {
      nivel: usuario.nivel || 'Intermedio',
      materia: 'Programación',
      ejerciciosCompletados: resultadosRecientes.length,
      temasDebiles,
      rendimientoPorTema,
      promedioGeneral: resultadosRecientes.length > 0 ? 
        resultadosRecientes.filter(r => r.esCorrecta).length / resultadosRecientes.length : 0
    };
  }

  static async actualizarProgresoUsuario(userId, evaluacion) {
    // Aquí puedes implementar lógica para actualizar el progreso del usuario
    // Por ejemplo, ajustar su nivel, desbloquear nuevos temas, etc.
    
    const usuario = await Usuario.findById(userId);
    
    // Ejemplo: si tiene muy buen rendimiento, subir de nivel
    const contexto = await EvaluacionController.obtenerContextoAlumno(userId);
    
    if (contexto.promedioGeneral > 0.85 && contexto.ejerciciosCompletados > 10) {
      if (usuario.nivel === 'Principiante') {
        usuario.nivel = 'Intermedio';
      } else if (usuario.nivel === 'Intermedio') {
        usuario.nivel = 'Avanzado';
      }
      await usuario.save();
    }
  }

  static async actualizarProgresoCompleto(userId, evaluacionSesion) {
    // Actualizar progreso basado en sesión completa
    // Implementar lógica de gamificación, logros, etc.
  }

  static async generarAnalisisProgreso(resultados, contexto, periodo) {
    // Usar LLM para generar análisis personalizado de progreso
    const prompt = `
Genera un análisis detallado del progreso del alumno:

PERÍODO: ${periodo}
RESULTADOS: ${JSON.stringify(resultados.slice(0, 10), null, 2)}
CONTEXTO: ${JSON.stringify(contexto, null, 2)}

Proporciona:
1. Resumen de progreso en el período
2. Fortalezas identificadas
3. Áreas de mejora
4. Recomendaciones específicas
5. Objetivos para el próximo período
`;

    try {
      const result = await evaluadorLLM.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      return "Análisis de progreso en desarrollo...";
    }
  }

  static calcularEstadisticas(resultados) {
    const total = resultados.length;
    const correctas = resultados.filter(r => r.esCorrecta).length;
    const puntajeTotal = resultados.reduce((sum, r) => sum + r.puntajeObtenido, 0);
    const puntajeMaximo = resultados.reduce((sum, r) => sum + r.puntajeMaximo, 0);

    return {
      totalEjercicios: total,
      ejerciciosCorrectos: correctas,
      porcentajeAciertos: total > 0 ? Math.round((correctas / total) * 100) : 0,
      puntajeTotal,
      puntajeMaximo,
      promedioEficiencia: puntajeMaximo > 0 ? Math.round((puntajeTotal / puntajeMaximo) * 100) : 0
    };
  }
}

module.exports = EvaluacionController;
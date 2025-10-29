// Script de prueba para evaluación con LLM
require('dotenv').config();
const mongoose = require('mongoose');
const EvaluadorLLM = require('./src/services/evaluadorLLM');
const Ejercicio = require('./src/models/Ejercicio');
const Tema = require('./src/models/Tema');
const Unidad = require('./src/models/Unidad');
const Materia = require('./src/models/Materia');
const Informacion = require('./src/models/Informacion');

async function probarEvaluacionLLM() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Conectado a MongoDB');

    // Inicializar evaluador
    const evaluador = new EvaluadorLLM();
    console.log('🤖 Evaluador LLM inicializado');

    // Obtener un ejercicio de prueba
    const ejercicio = await Ejercicio.findOne({ tipo: 'OPCION_MULTIPLE' })
      .populate('tema');

    if (!ejercicio) {
      console.log('❌ No se encontraron ejercicios');
      return;
    }

    console.log('\n📝 EJERCICIO A EVALUAR:');
    console.log(`Tema: ${ejercicio.tema?.titulo || 'N/A'}`);
    console.log(`Tipo: ${ejercicio.tipo}`);
    console.log(`Dificultad: ${ejercicio.dificultad}`);
    console.log(`Enunciado: ${ejercicio.enunciado}`);
    
    if (ejercicio.opciones && ejercicio.opciones.length > 0) {
      console.log('\nOpciones:');
      ejercicio.opciones.forEach((opcion, i) => {
        console.log(`${i + 1}. ${opcion.texto} ${opcion.esCorrecta ? '✅' : ''}`);
      });
    }

    // Simular diferentes tipos de respuestas del alumno
    const respuestasTest = [
      {
        descripcion: "Respuesta correcta",
        respuesta: ejercicio.opciones.find(op => op.esCorrecta)?.texto || "Verdadero"
      },
      {
        descripcion: "Respuesta incorrecta",
        respuesta: ejercicio.opciones.find(op => !op.esCorrecta)?.texto || "Falso"
      },
      {
        descripcion: "Respuesta parcial (para desarrollo)",
        respuesta: "Los objetos son instancias de clases que encapsulan datos"
      }
    ];

    // Contexto del alumno simulado
    const contextoAlumno = {
      nivel: 'Intermedio',
      materia: 'Programación Orientada a Objetos',
      ejerciciosCompletados: 15,
      temasDebiles: ['Herencia', 'Polimorfismo'],
      rendimientoPorTema: {
        'Clases y Objetos': { correctas: 8, total: 10 },
        'Herencia': { correctas: 3, total: 6 },
        'Polimorfismo': { correctas: 2, total: 5 }
      },
      promedioGeneral: 0.72
    };

    console.log('\n👤 CONTEXTO DEL ALUMNO:');
    console.log(JSON.stringify(contextoAlumno, null, 2));

    // Probar evaluaciones
    for (const [index, test] of respuestasTest.entries()) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🧪 PRUEBA ${index + 1}: ${test.descripcion}`);
      console.log(`Respuesta del alumno: "${test.respuesta}"`);
      console.log(`${'='.repeat(60)}`);

      try {
        console.log('⏳ Evaluando con LLM...');
        const evaluacion = await evaluador.evaluarEjercicio(
          ejercicio,
          test.respuesta,
          contextoAlumno
        );

        console.log('\n✅ EVALUACIÓN COMPLETADA:');
        console.log('\n📊 RESULTADO:');
        console.log(`Es correcta: ${evaluacion.evaluacion.esCorrecta ? '✅ Sí' : '❌ No'}`);
        console.log(`Puntaje: ${evaluacion.evaluacion.puntajeObtenido}/${evaluacion.evaluacion.puntajeMaximo}`);
        console.log(`Nivel comprensión: ${evaluacion.evaluacion.nivelComprension}`);

        console.log('\n💬 RETROALIMENTACIÓN:');
        console.log(`Mensaje: ${evaluacion.retroalimentacion.mensaje}`);
        
        if (evaluacion.retroalimentacion.aspectosCorrectos?.length > 0) {
          console.log('\n✅ Aspectos correctos:');
          evaluacion.retroalimentacion.aspectosCorrectos.forEach(aspecto => {
            console.log(`  • ${aspecto}`);
          });
        }

        if (evaluacion.retroalimentacion.aspectosIncorrectos?.length > 0) {
          console.log('\n❌ Aspectos incorrectos:');
          evaluacion.retroalimentacion.aspectosIncorrectos.forEach(aspecto => {
            console.log(`  • ${aspecto}`);
          });
        }

        if (evaluacion.retroalimentacion.sugerencias?.length > 0) {
          console.log('\n💡 Sugerencias:');
          evaluacion.retroalimentacion.sugerencias.forEach(sugerencia => {
            console.log(`  • ${sugerencia}`);
          });
        }

        console.log('\n📈 SEGUIMIENTO:');
        if (evaluacion.seguimiento.conceptosDominados?.length > 0) {
          console.log(`Conceptos dominados: ${evaluacion.seguimiento.conceptosDominados.join(', ')}`);
        }
        if (evaluacion.seguimiento.conceptosDebiles?.length > 0) {
          console.log(`Conceptos a reforzar: ${evaluacion.seguimiento.conceptosDebiles.join(', ')}`);
        }

      } catch (error) {
        console.error(`❌ Error en evaluación ${index + 1}:`, error.message);
        
        // Mostrar evaluación fallback
        console.log('\n🔄 Usando evaluación fallback...');
        const evaluacionFallback = evaluador.evaluacionFallback(ejercicio, test.respuesta);
        console.log('Resultado fallback:', evaluacionFallback);
      }

      // Pausa entre evaluaciones
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎯 DEMO DE EVALUACIÓN DE SESIÓN COMPLETA');
    console.log('='.repeat(60));

    // Simular evaluación de sesión completa
    const ejerciciosSimulados = [
      { ejercicio, respuesta: respuestasTest[0].respuesta },
      { ejercicio, respuesta: respuestasTest[1].respuesta }
    ];

    try {
      console.log('⏳ Evaluando sesión completa...');
      const evaluacionSesion = await evaluador.evaluarSesionCompleta(
        ejerciciosSimulados,
        contextoAlumno
      );

      console.log('\n📊 RESUMEN DE SESIÓN:');
      console.log(`Ejercicios: ${evaluacionSesion.resumenSesion.totalEjercicios}`);
      console.log(`Correctos: ${evaluacionSesion.resumenSesion.ejerciciosCorrectos}`);
      console.log(`Puntaje: ${evaluacionSesion.resumenSesion.puntajeTotal}/${evaluacionSesion.resumenSesion.puntajeMaximo}`);
      console.log(`Porcentaje: ${evaluacionSesion.resumenSesion.porcentaje}%`);

      console.log('\n📝 ANÁLISIS GENERAL:');
      console.log(evaluacionSesion.analisisGeneral);

      console.log('\n🎯 RECOMENDACIONES:');
      if (evaluacionSesion.recomendaciones.temasParaRepasar?.length > 0) {
        console.log(`Temas para repasar: ${evaluacionSesion.recomendaciones.temasParaRepasar.join(', ')}`);
      }
      console.log(`Estrategia: ${evaluacionSesion.recomendaciones.estrategiaEstudio}`);

    } catch (error) {
      console.error('❌ Error en evaluación de sesión:', error.message);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar prueba
if (require.main === module) {
  probarEvaluacionLLM().catch(console.error);
}

module.exports = probarEvaluacionLLM;
require('dotenv').config();
const mongoose = require('mongoose');
const Materia = require('../models/Materia');
const Unidad = require('../models/Unidad');
const Tema = require('../models/Tema');
const Informacion = require('../models/Informacion');
const Ejercicio = require('../models/Ejercicio');

const MONGO_URI = process.env.MONGODB_URI;

async function seedEjercicios() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar ejercicios anteriores
    console.log('\n🗑️  Eliminando ejercicios anteriores...');
    await Ejercicio.deleteMany({});
    console.log('   - Ejercicios eliminados');

    console.log('\n🧪 Creando ejercicios desde información existente...\n');

    let ejerciciosCreados = 0;

    // Obtener toda la información de ambas materias
    const informacionRecords = await Informacion.find({})
      .populate({
        path: 'tema',
        populate: {
          path: 'unidad',
          populate: {
            path: 'materia'
          }
        }
      });

    console.log(`📚 Encontrados ${informacionRecords.length} registros de información para procesar`);

    // Procesar cada registro de información
    for (const info of informacionRecords) {
      const materia = info.tema.unidad.materia.nombre;
      const unidadNumero = info.tema.unidad.numero;
      const temaOrden = info.tema.orden;
      const temaTitulo = info.tema.titulo;

      console.log(`\n📖 Procesando: ${materia} - Unidad ${unidadNumero} - Tema ${temaOrden}: ${temaTitulo}`);

      // Crear ejercicios desde los ejerciciosEjemplo de la información
      if (info.ejerciciosEjemplo && info.ejerciciosEjemplo.length > 0) {
        for (let i = 0; i < info.ejerciciosEjemplo.length; i++) {
          const ejemploEjercicio = info.ejerciciosEjemplo[i];
          
          try {
            // Adaptar el tipo de ejercicio al modelo
            let tipoEjercicio = ejemploEjercicio.tipo;
            if (tipoEjercicio === 'PREGUNTA_ABIERTA') {
              tipoEjercicio = 'DESARROLLO';
            }

            // Crear el ejercicio base
            const ejercicioData = {
              tema: info.tema._id,
              informacion: info._id,
              titulo: `${temaTitulo} - Ejercicio ${i + 1}`,
              enunciado: ejemploEjercicio.enunciado,
              tipo: tipoEjercicio,
              explicacion: ejemploEjercicio.explicacion || '',
              dificultad: ejemploEjercicio.dificultad || info.dificultad || 'MEDIA',
              puntaje: getDificultadPuntaje(ejemploEjercicio.dificultad || info.dificultad || 'MEDIA'),
              activo: true
            };

            // Agregar opciones y respuesta según el tipo
            if (tipoEjercicio === 'VERDADERO_FALSO') {
              ejercicioData.opciones = [
                { texto: 'Verdadero', esCorrecta: ejemploEjercicio.respuestaCorrecta === 'VERDADERO' || ejemploEjercicio.respuestaCorrecta === 'Verdadero' },
                { texto: 'Falso', esCorrecta: ejemploEjercicio.respuestaCorrecta === 'FALSO' || ejemploEjercicio.respuestaCorrecta === 'Falso' }
              ];
              ejercicioData.respuestaCorrecta = ejemploEjercicio.respuestaCorrecta;
              
            } else if (tipoEjercicio === 'OPCION_MULTIPLE') {
              if (ejemploEjercicio.opciones && Array.isArray(ejemploEjercicio.opciones)) {
                ejercicioData.opciones = ejemploEjercicio.opciones.map(opcion => {
                  if (typeof opcion === 'string') {
                    return {
                      texto: opcion,
                      esCorrecta: opcion === ejemploEjercicio.respuestaCorrecta
                    };
                  } else {
                    return {
                      texto: opcion.texto,
                      esCorrecta: opcion.esCorrecta
                    };
                  }
                });
              }
              ejercicioData.respuestaCorrecta = ejemploEjercicio.respuestaCorrecta;
              
            } else if (tipoEjercicio === 'DESARROLLO') {
              ejercicioData.opciones = [];
              ejercicioData.respuestaCorrecta = ejemploEjercicio.respuestaSugerida || '';
            }

            // Crear el ejercicio
            const ejercicio = new Ejercicio(ejercicioData);
            await ejercicio.save();
            ejerciciosCreados++;
            console.log(`   ✅ Ejercicio ${i + 1}: ${tipoEjercicio} - ${ejemploEjercicio.enunciado.substring(0, 50)}...`);

          } catch (error) {
            console.log(`   ❌ Error creando ejercicio ${i + 1}: ${error.message}`);
          }
        }
      }

      // Crear ejercicios adicionales basados en conceptos clave
      if (info.conceptosClave && info.conceptosClave.length > 0) {
        const conceptosParaEjercicios = info.conceptosClave.slice(0, 2); // Tomar los primeros 2 conceptos
        
        for (let j = 0; j < conceptosParaEjercicios.length; j++) {
          const concepto = conceptosParaEjercicios[j];
          const numeroEjercicio = info.ejerciciosEjemplo.length + j + 1;
          
          try {
            // Crear ejercicio de definición (opción múltiple)
            const ejercicioConcepto = new Ejercicio({
              tema: info.tema._id,
              informacion: info._id,
              titulo: `${temaTitulo} - Concepto: ${concepto.termino}`,
              enunciado: `¿Cuál es la definición correcta de "${concepto.termino}"?`,
              tipo: 'OPCION_MULTIPLE',
              opciones: generarOpcionesDefinicion(concepto),
              respuestaCorrecta: concepto.definicion,
              explicacion: `${concepto.termino}: ${concepto.definicion}`,
              dificultad: info.dificultad || 'MEDIA',
              puntaje: getDificultadPuntaje(info.dificultad || 'MEDIA'),
              activo: true
            });

            await ejercicioConcepto.save();
            ejerciciosCreados++;
            console.log(`   ✅ Ejercicio concepto ${j + 1}: ${concepto.termino}`);

          } catch (error) {
            console.log(`   ❌ Error creando ejercicio de concepto ${j + 1}: ${error.message}`);
          }
        }
      }
    }

    // Resumen final
    const totalEjercicios = await Ejercicio.countDocuments();

    console.log('\n📊 RESUMEN:');
    console.log(`   ✅ ${ejerciciosCreados} ejercicios creados`);
    console.log(`   🧪 ${totalEjercicios} total en base de datos`);

    // Estadísticas por materia
    await mostrarEstadisticasEjercicios();

    console.log('\n🎉 Seed de ejercicios completado exitosamente!\n');

  } catch (error) {
    console.error('❌ Error en seed de ejercicios:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

function getDificultadPuntaje(dificultad) {
  switch (dificultad) {
    case 'FACIL': return 1;
    case 'MEDIA': return 2;
    case 'DIFICIL': return 3;
    default: return 2;
  }
}

function generarOpcionesDefinicion(concepto) {
  // Generar opciones con la definición correcta y distractores
  const opciones = [
    { texto: concepto.definicion, esCorrecta: true }
  ];

  // Agregar distractores genéricos basados en el contexto
  const distractores = [
    'Técnica de programación que no se utiliza en desarrollo moderno',
    'Concepto obsoleto que ha sido reemplazado por metodologías ágiles',
    'Herramienta exclusiva para lenguajes de programación interpretados'
  ];

  distractores.slice(0, 3).forEach(distractor => {
    opciones.push({ texto: distractor, esCorrecta: false });
  });

  // Mezclar las opciones
  return opciones.sort(() => Math.random() - 0.5);
}

async function mostrarEstadisticasEjercicios() {
  console.log('\n📈 ESTADÍSTICAS DE EJERCICIOS POR MATERIA:\n');

  const materias = await Materia.find({});

  for (const materia of materias) {
    const unidades = await Unidad.find({ materia: materia._id }).sort({ numero: 1 });
    
    console.log(`📚 ${materia.nombre}:`);
    
    let totalEjerciciosMateria = 0;
    
    for (const unidad of unidades) {
      const temas = await Tema.find({ unidad: unidad._id }).sort({ orden: 1 });
      let ejerciciosUnidad = 0;
      
      for (const tema of temas) {
        const ejerciciosTema = await Ejercicio.countDocuments({ tema: tema._id });
        ejerciciosUnidad += ejerciciosTema;
      }
      
      if (ejerciciosUnidad > 0) {
        console.log(`   Unidad ${unidad.numero}: ${unidad.nombre} → ${ejerciciosUnidad} ejercicios`);
        totalEjerciciosMateria += ejerciciosUnidad;
      }
    }
    
    console.log(`   📊 Total ${materia.nombre}: ${totalEjerciciosMateria} ejercicios\n`);
  }

  // Estadísticas por tipo y dificultad
  const tipoStats = await Ejercicio.aggregate([
    { $group: { _id: '$tipo', count: { $sum: 1 } } }
  ]);

  const dificultadStats = await Ejercicio.aggregate([
    { $group: { _id: '$dificultad', count: { $sum: 1 } } }
  ]);

  console.log('📊 ESTADÍSTICAS POR TIPO:');
  tipoStats.forEach(stat => {
    console.log(`   ${stat._id}: ${stat.count} ejercicios`);
  });

  console.log('\n📊 ESTADÍSTICAS POR DIFICULTAD:');
  dificultadStats.forEach(stat => {
    console.log(`   ${stat._id}: ${stat.count} ejercicios`);
  });
}

// Ejecutar el seed
seedEjercicios();
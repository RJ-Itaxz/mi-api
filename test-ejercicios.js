require('dotenv').config();
const mongoose = require('mongoose');
const Materia = require('./src/models/Materia');
const Unidad = require('./src/models/Unidad');
const Tema = require('./src/models/Tema');
const Ejercicio = require('./src/models/Ejercicio');

const MONGODB_URI = process.env.MONGODB_URI;

async function verificarEjercicios() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Estadísticas generales
    const totalEjercicios = await Ejercicio.countDocuments();
    console.log(`📊 TOTAL DE EJERCICIOS: ${totalEjercicios}\n`);

    // Mostrar algunos ejercicios de ejemplo por materia
    const materias = await Materia.find({}).sort({ nombre: 1 });

    for (const materia of materias) {
      console.log(`📚 ${materia.nombre}:`);
      
      const ejerciciosMateria = await Ejercicio.find({})
        .populate({
          path: 'tema',
          populate: {
            path: 'unidad',
            match: { materia: materia._id },
            populate: {
              path: 'materia'
            }
          }
        })
        .limit(3);

      const ejerciciosFiltrados = ejerciciosMateria.filter(ej => 
        ej.tema && ej.tema.unidad && ej.tema.unidad.materia && 
        ej.tema.unidad.materia._id.toString() === materia._id.toString()
      );

      if (ejerciciosFiltrados.length > 0) {
        ejerciciosFiltrados.forEach((ejercicio, index) => {
          console.log(`   ${index + 1}. 📝 ${ejercicio.titulo}`);
          console.log(`      🎯 Tipo: ${ejercicio.tipo}`);
          console.log(`      📝 Enunciado: ${ejercicio.enunciado.substring(0, 80)}...`);
          console.log(`      🎯 Dificultad: ${ejercicio.dificultad} (${ejercicio.puntaje} pts)`);
          
          if (ejercicio.opciones && ejercicio.opciones.length > 0) {
            console.log(`      🔘 Opciones: ${ejercicio.opciones.length}`);
            ejercicio.opciones.forEach((opcion, idx) => {
              const mark = opcion.esCorrecta ? '✅' : '❌';
              console.log(`         ${mark} ${idx + 1}. ${opcion.texto}`);
            });
          }
          
          if (ejercicio.explicacion) {
            console.log(`      💡 Explicación: ${ejercicio.explicacion.substring(0, 100)}...`);
          }
          console.log('');
        });
      } else {
        console.log('   No se encontraron ejercicios para esta materia\n');
      }
    }

    // Estadísticas por tipo
    console.log('📊 ESTADÍSTICAS DETALLADAS:\n');
    
    const tipoStats = await Ejercicio.aggregate([
      { $group: { _id: '$tipo', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('📊 Por tipo de ejercicio:');
    tipoStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} ejercicios`);
    });

    const dificultadStats = await Ejercicio.aggregate([
      { $group: { _id: '$dificultad', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Por dificultad:');
    dificultadStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} ejercicios`);
    });

    // Contar ejercicios por materia
    console.log('\n📊 Por materia:');
    
    for (const materia of materias) {
      const count = await Ejercicio.countDocuments({
        tema: {
          $in: await Tema.find({
            unidad: {
              $in: await Unidad.find({ materia: materia._id }).distinct('_id')
            }
          }).distinct('_id')
        }
      });
      
      if (count > 0) {
        console.log(`   ${materia.nombre}: ${count} ejercicios`);
      }
    }

    console.log('\n✅ Verificación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

verificarEjercicios();
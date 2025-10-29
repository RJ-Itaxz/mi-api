require('dotenv').config();
const mongoose = require('mongoose');
const Materia = require('./src/models/Materia');
const Unidad = require('./src/models/Unidad');
const Tema = require('./src/models/Tema');
const Informacion = require('./src/models/Informacion');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi-api-db';

async function testInformacionPOO() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 1. Buscar la materia "PROGRAMACIÓN ORIENTADA A OBJETOS"
    console.log('📚 Buscando materia: PROGRAMACIÓN ORIENTADA A OBJETOS...');
    const materia = await Materia.findOne({ nombre: /PROGRAMACIÓN ORIENTADA A OBJETOS/i });
    
    if (!materia) {
      console.log('❌ No se encontró la materia');
      process.exit(1);
    }
    console.log(`✅ Materia encontrada: ${materia.nombre}\n`);

    // 2. Buscar todas las unidades de POO
    console.log('📖 Buscando unidades de POO...');
    const unidades = await Unidad.find({ materia: materia._id }).sort({ numero: 1 });
    console.log(`✅ Encontradas ${unidades.length} unidades:\n`);

    for (const unidad of unidades) {
      console.log(`📖 UNIDAD ${unidad.numero}: ${unidad.titulo}`);
      
      // Buscar temas de esta unidad
      const temas = await Tema.find({ unidad: unidad._id }).sort({ orden: 1 });
      console.log(`   📄 ${temas.length} temas encontrados:`);
      
      for (const tema of temas) {
        console.log(`   📄 ${unidad.numero}.${tema.orden}: ${tema.titulo}`);
        
        // Buscar información detallada del tema
        const informacion = await Informacion.findOne({ tema: tema._id });
        if (informacion) {
          console.log(`      ✅ Información detallada disponible`);
          console.log(`      🔑 ${informacion.conceptosClave.length} conceptos clave`);
          console.log(`      🧪 ${informacion.ejerciciosEjemplo.length} ejercicios ejemplo`);
          
          // Mostrar el primer concepto como ejemplo
          if (informacion.conceptosClave.length > 0) {
            const primerConcepto = informacion.conceptosClave[0];
            console.log(`      💡 Ejemplo: "${primerConcepto.termino}" - ${primerConcepto.definicion.substring(0, 60)}...`);
          }
          
          // Mostrar el primer ejercicio como ejemplo
          if (informacion.ejerciciosEjemplo.length > 0) {
            const primerEjercicio = informacion.ejerciciosEjemplo[0];
            console.log(`      🎯 Ejercicio: ${primerEjercicio.tipo} - "${primerEjercicio.enunciado.substring(0, 60)}..."`);
          }
        } else {
          console.log(`      ⚠️  Sin información detallada`);
        }
        console.log('');
      }
      console.log('');
    }

    // Estadísticas finales
    const totalTemas = await Tema.countDocuments({ 
      unidad: { $in: unidades.map(u => u._id) } 
    });
    
    const temasConInformacion = await Informacion.countDocuments({
      tema: { 
        $in: await Tema.find({ 
          unidad: { $in: unidades.map(u => u._id) } 
        }).distinct('_id')
      }
    });

    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`   📚 Materia: ${materia.nombre}`);
    console.log(`   📖 Unidades: ${unidades.length}`);
    console.log(`   📄 Temas totales: ${totalTemas}`);
    console.log(`   ✅ Temas con información: ${temasConInformacion}`);
    console.log(`   📈 Progreso: ${Math.round((temasConInformacion/totalTemas)*100)}%`);

    console.log('\n✅ Verificación completada exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar la verificación
testInformacionPOO();
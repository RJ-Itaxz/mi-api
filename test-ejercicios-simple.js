require('dotenv').config();
const mongoose = require('mongoose');
const Ejercicio = require('./src/models/Ejercicio');

async function verificarSimple() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  console.log('📊 RESUMEN DE EJERCICIOS CREADOS\n');
  
  const total = await Ejercicio.countDocuments();
  console.log(`✅ Total ejercicios: ${total}`);
  
  // Por tipo
  const tipos = await Ejercicio.aggregate([
    { $group: { _id: '$tipo', count: { $sum: 1 } } }
  ]);
  
  console.log('\n📊 Por tipo:');
  tipos.forEach(t => console.log(`   ${t._id}: ${t.count}`));
  
  // Por dificultad  
  const dificultad = await Ejercicio.aggregate([
    { $group: { _id: '$dificultad', count: { $sum: 1 } } }
  ]);
  
  console.log('\n📊 Por dificultad:');
  dificultad.forEach(d => console.log(`   ${d._id}: ${d.count}`));
  
  // Ejemplos
  console.log('\n📝 EJEMPLOS DE EJERCICIOS:');
  
  const ejemplos = await Ejercicio.find({}).limit(5);
  
  ejemplos.forEach((ej, i) => {
    console.log(`\n${i+1}. ${ej.titulo}`);
    console.log(`   📝 ${ej.enunciado.substring(0, 100)}...`);
    console.log(`   🎯 Tipo: ${ej.tipo} | Dificultad: ${ej.dificultad}`);
    
    if (ej.opciones && ej.opciones.length > 0) {
      console.log(`   📋 Opciones:`);
      ej.opciones.forEach((op, idx) => {
        const mark = op.esCorrecta ? '✅' : '  ';
        console.log(`     ${mark} ${idx+1}. ${op.texto}`);
      });
    }
  });
  
  console.log('\n🎉 ¡Ejercicios creados exitosamente desde la información de ambas materias!');
  process.exit(0);
}

verificarSimple().catch(console.error);
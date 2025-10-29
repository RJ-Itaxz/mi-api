require('dotenv').config();
const mongoose = require('mongoose');
const Materia = require('./src/models/Materia');
const Unidad = require('./src/models/Unidad');
const Tema = require('./src/models/Tema');
const { generateText } = require('./services/geminiClient');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi-api-db';

async function testGenerarEjercicioPOO() {
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
    console.log(`✅ Materia encontrada: ${materia.nombre} (ID: ${materia._id})\n`);

    // 2. Buscar la Unidad 1: Introducción al paradigma de la POO
    console.log('📖 Buscando Unidad 1: Introducción al paradigma de la POO...');
    const unidad = await Unidad.findOne({ 
      materia: materia._id, 
      numero: 1 
    });
    
    if (!unidad) {
      console.log('❌ No se encontró la unidad');
      process.exit(1);
    }
    console.log(`✅ Unidad encontrada: ${unidad.titulo} (ID: ${unidad._id})\n`);

    // 3. Buscar el Tema 1.1: Elementos del modelo de objetos
    console.log('📄 Buscando Tema 1.1: Elementos del modelo de objetos...');
    const tema = await Tema.findOne({ 
      unidad: unidad._id, 
      orden: 1 
    });
    
    if (!tema) {
      console.log('❌ No se encontró el tema');
      process.exit(1);
    }
    console.log(`✅ Tema encontrado: ${tema.titulo} (ID: ${tema._id})\n`);

    // 4. Generar ejercicio usando el endpoint LLM
    console.log('🤖 Generando ejercicio con Gemini...\n');
    
    // Simular la llamada al endpoint /api/llm/generar-ejercicio
    const response = await fetch('http://localhost:3000/api/llm/generar-ejercicio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        temaId: tema._id.toString(),
        dificultad: 'MEDIA',
        guardar: false // Solo para prueba, no guardar
      })
    });

    if (!response.ok) {
      console.log('❌ Error en la respuesta:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      process.exit(1);
    }

    const ejercicioGenerado = await response.json();
    
    console.log('📝 Respuesta de Gemini:\n');
    console.log('```json');
    console.log(JSON.stringify(ejercicioGenerado, null, 2));
    console.log('```\n');

    // 5. Mostrar el ejercicio formateado
    console.log('========================================');
    console.log('========================================');
    console.log('✅ Ejercicio generado exitosamente:\n');
    
    console.log(`📌 TÍTULO: ${ejercicioGenerado.titulo}`);
    console.log(`❓ ENUNCIADO: ${ejercicioGenerado.enunciado}`);
    console.log('📋 OPCIONES:');
    
    ejercicioGenerado.opciones.forEach((opcion, index) => {
      const letra = String.fromCharCode(65 + index); // A, B, C, D
      const marca = opcion.esCorrecta ? '✅' : '  ';
      console.log(`  ${marca} ${letra}) ${opcion.texto}`);
    });
    
    console.log(`💡 EXPLICACIÓN: ${ejercicioGenerado.explicacion}`);
    console.log(`🎯 DIFICULTAD: ${ejercicioGenerado.dificultad}`);
    console.log(`⭐ PUNTAJE: ${ejercicioGenerado.puntaje}`);
    
    console.log('\n✅ Prueba completada exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar la prueba
testGenerarEjercicioPOO();
require('dotenv').config();
const mongoose = require('mongoose');
const Materia = require('./src/models/Materia');
const Unidad = require('./src/models/Unidad');
const Tema = require('./src/models/Tema');
const { generateText } = require('./services/geminiClient');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi-api-db';

async function testGenerarEjercicio() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 1. Buscar la materia "FUNDAMENTOS DE PROGRAMACIÓN"
    console.log('📚 Buscando materia: FUNDAMENTOS DE PROGRAMACIÓN...');
    const materia = await Materia.findOne({ nombre: /FUNDAMENTOS DE PROGRAMACIÓN/i });
    
    if (!materia) {
      console.log('❌ No se encontró la materia');
      process.exit(1);
    }
    console.log(`✅ Materia encontrada: ${materia.nombre} (ID: ${materia._id})\n`);

    // 2. Buscar la Unidad 1: Diseño Algorítmico
    console.log('📖 Buscando Unidad 1: Diseño Algorítmico...');
    const unidad = await Unidad.findOne({ 
      materia: materia._id, 
      numero: 1 
    });
    
    if (!unidad) {
      console.log('❌ No se encontró la unidad');
      process.exit(1);
    }
    console.log(`✅ Unidad encontrada: ${unidad.titulo} (ID: ${unidad._id})\n`);

    // 3. Buscar el Tema 1.1: Conceptos básicos
    console.log('📄 Buscando Tema 1.1: Conceptos básicos...');
    const tema = await Tema.findOne({ 
      unidad: unidad._id, 
      orden: 1 
    });
    
    if (!tema) {
      console.log('❌ No se encontró el tema');
      process.exit(1);
    }
    console.log(`✅ Tema encontrado: ${tema.titulo} (ID: ${tema._id})\n`);

    // 4. Generar ejercicio con Gemini
    console.log('🤖 Generando ejercicio con Gemini...\n');
    
    const systemPrompt = `Eres un profesor experto en ${materia.nombre}. 
Tu tarea es generar ejercicios educativos de alta calidad basados en el tema proporcionado.
Debes responder ÚNICAMENTE con un objeto JSON válido, sin texto adicional antes o después.`;
    
    const userPrompt = `Genera un ejercicio de opción múltiple sobre el siguiente tema:

Materia: ${materia.nombre}
Unidad: ${unidad.titulo}
Tema: ${tema.titulo}

Dificultad: MEDIA

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
  "dificultad": "MEDIA",
  "puntaje": 2
}`;

    const { text } = await generateText({
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxOutputTokens: 1500
    });

    console.log('📝 Respuesta de Gemini:\n');
    console.log(text);
    console.log('\n' + '='.repeat(80) + '\n');

    // Intentar parsear como JSON
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const ejercicio = JSON.parse(cleanText);
      
      console.log('✅ Ejercicio generado exitosamente:\n');
      console.log('📌 TÍTULO:', ejercicio.titulo);
      console.log('\n❓ ENUNCIADO:', ejercicio.enunciado);
      console.log('\n📋 OPCIONES:');
      ejercicio.opciones.forEach((op, idx) => {
        const marca = op.esCorrecta ? '✅' : '  ';
        console.log(`   ${marca} ${String.fromCharCode(65 + idx)}) ${op.texto}`);
      });
      console.log('\n💡 EXPLICACIÓN:', ejercicio.explicacion);
      console.log('\n🎯 DIFICULTAD:', ejercicio.dificultad);
      console.log('⭐ PUNTAJE:', ejercicio.puntaje);
      
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError.message);
    }

    console.log('\n✅ Prueba completada exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testGenerarEjercicio();

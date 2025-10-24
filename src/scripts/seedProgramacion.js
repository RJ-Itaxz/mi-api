require('dotenv').config();
const mongoose = require('mongoose');
const Materia = require('../models/Materia');
const Unidad = require('../models/Unidad');
const Tema = require('../models/Tema');
const Ejercicio = require('../models/Ejercicio');
const Usuario = require('../models/Usuario');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi-api-db';

// Datos estructurados de las materias
const materiasData = [
  {
    nombre: 'FUNDAMENTOS DE PROGRAMACIÓN',
    descripcion: 'Introducción a la programación mediante el diseño de algoritmos y conceptos básicos de control de flujo.',
    color: '#3B82F6',
    unidades: [
      {
        numero: 1,
        titulo: 'Diseño Algorítmico',
        descripcion: 'Conceptos fundamentales del diseño de algoritmos',
        temas: [
          { orden: 1, titulo: 'Conceptos básicos' },
          { orden: 2, titulo: 'Representación de algoritmos: gráfica y pseudocódigo' },
          { orden: 3, titulo: 'Diseño de algoritmos' },
          { orden: 4, titulo: 'Diseño de funciones' }
        ]
      },
      {
        numero: 2,
        titulo: 'Introducción a la Programación',
        descripcion: 'Fundamentos del lenguaje de programación',
        temas: [
          { orden: 1, titulo: 'Conceptos básicos' },
          { orden: 2, titulo: 'Características del lenguaje de programación' },
          { orden: 3, titulo: 'Estructura básica de un programa' },
          { orden: 4, titulo: 'Elementos del lenguaje: tipos de datos, literales, constantes, variables, identificadores, parámetros, operadores y salida de datos' },
          { orden: 5, titulo: 'Traducción de un programa: compilación, enlace, ejecución y errores' }
        ]
      },
      {
        numero: 3,
        titulo: 'Control de Flujo',
        descripcion: 'Estructuras de control de programación',
        temas: [
          { orden: 1, titulo: 'Estructuras secuenciales' },
          { orden: 2, titulo: 'Estructuras selectivas: simple, doble y múltiple' },
          { orden: 3, titulo: 'Estructuras iterativas: repetir mientras, hasta, desde' }
        ]
      },
      {
        numero: 4,
        titulo: 'Organización de datos',
        descripcion: 'Manejo de estructuras de datos básicas',
        temas: [
          { orden: 1, titulo: 'Arreglos' },
          { orden: 2, titulo: 'Unidimensionales: conceptos básicos, operaciones y aplicaciones' },
          { orden: 3, titulo: 'Multidimensionales: conceptos básicos, operaciones y aplicaciones' },
          { orden: 4, titulo: 'Estructuras o registros' }
        ]
      },
      {
        numero: 5,
        titulo: 'Modularidad',
        descripcion: 'Programación modular y funciones',
        temas: [
          { orden: 1, titulo: 'Declaración y uso de módulos' },
          { orden: 2, titulo: 'Paso de parámetros o argumentos' },
          { orden: 3, titulo: 'Implementación' }
        ]
      }
    ]
  },
  {
    nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    descripcion: 'Paradigma de programación orientada a objetos, clases, herencia y polimorfismo.',
    color: '#10B981',
    unidades: [
      {
        numero: 1,
        titulo: 'Introducción al paradigma de la programación orientada a objetos',
        descripcion: 'Conceptos fundamentales de POO',
        temas: [
          { orden: 1, titulo: 'Elementos del modelo de objetos: clases, objetos, abstracción, modularidad, encapsulamiento, herencia y polimorfismo' },
          { orden: 2, titulo: 'Lenguaje de modelado unificado: diagrama de clases' }
        ]
      },
      {
        numero: 2,
        titulo: 'Clases y objetos',
        descripcion: 'Declaración y uso de clases y objetos',
        temas: [
          { orden: 1, titulo: 'Declaración de clases: atributos, métodos, encapsulamiento' },
          { orden: 2, titulo: 'Instanciación de una clase' },
          { orden: 3, titulo: 'Referencia al objeto actual' },
          { orden: 4, titulo: 'Métodos: declaración, mensajes, paso de parámetros, retorno de valores' },
          { orden: 5, titulo: 'Constructores y destructores declaración, uso y aplicaciones' },
          { orden: 6, titulo: 'Sobrecarga de métodos' },
          { orden: 7, titulo: 'Sobrecarga de operadores: Concepto y utilidad, operadores unarios y binarios' }
        ]
      },
      {
        numero: 3,
        titulo: 'Herencia',
        descripcion: 'Herencia y reutilización de código',
        temas: [
          { orden: 1, titulo: 'Definición: clase base, clase derivada' },
          { orden: 2, titulo: 'Clasificación: herencia simple, herencia múltiple' },
          { orden: 3, titulo: 'Reutilización de miembros heredados' },
          { orden: 4, titulo: 'Referencia al objeto de la clase base' },
          { orden: 5, titulo: 'Constructores y destructores en clases derivadas' },
          { orden: 6, titulo: 'Redefinición de métodos en clases derivadas' }
        ]
      },
      {
        numero: 4,
        titulo: 'Polimorfismo',
        descripcion: 'Polimorfismo, clases abstractas e interfaces',
        temas: [
          { orden: 1, titulo: 'Definición' },
          { orden: 2, titulo: 'Clases abstractas: definición, métodos abstractos, implementación de clases abstractas, modelado de clases abstractas' },
          { orden: 3, titulo: 'Interfaces: definición, implementación de interfaces, herencia de interfaces' },
          { orden: 4, titulo: 'Variables polimórficas (plantillas): definición, uso y aplicaciones' },
          { orden: 5, titulo: 'Reutilización de código' }
        ]
      },
      {
        numero: 5,
        titulo: 'Excepciones',
        descripcion: 'Manejo de excepciones y errores',
        temas: [
          { orden: 1, titulo: 'Definición' },
          { orden: 2, titulo: 'Tipos de excepciones' },
          { orden: 3, titulo: 'Propagación de excepciones' },
          { orden: 4, titulo: 'Gestión de excepciones: manejo de excepciones, lanzamiento de excepciones' },
          { orden: 5, titulo: 'Creación y manejo de excepciones definidas por el usuario' }
        ]
      },
      {
        numero: 6,
        titulo: 'Flujos y archivos',
        descripcion: 'Manejo de archivos y persistencia',
        temas: [
          { orden: 1, titulo: 'Definición' },
          { orden: 2, titulo: 'Clasificación: Archivos de texto y binarios' },
          { orden: 3, titulo: 'Operaciones básicas y tipos de acceso' },
          { orden: 4, titulo: 'Manejo de objetos persistentes' }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar o crear usuario ADMIN para asignar como autor
    let admin = await Usuario.findOne({ role: 'ADMIN' });
    if (!admin) {
      console.log('⚠️  No se encontró usuario ADMIN. Creando uno temporal...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      
      admin = await Usuario.create({
        nombre: 'Administrador del Sistema',
        email: 'admin@sistema.com',
        password: passwordHash,
        role: 'ADMIN'
      });
      console.log('✅ Usuario ADMIN temporal creado (email: admin@sistema.com, password: admin123)');
    }

    // Limpiar datos anteriores
    console.log('\n🗑️  Eliminando datos anteriores...');
    await Ejercicio.deleteMany({});
    console.log('   - Ejercicios eliminados');
    await Tema.deleteMany({});
    console.log('   - Temas eliminados');
    await Unidad.deleteMany({});
    console.log('   - Unidades eliminadas');
    await Materia.deleteMany({});
    console.log('   - Materias eliminadas');

    console.log('\n📚 Creando materias, unidades y temas...\n');

    for (const materiaData of materiasData) {
      // Crear materia
      const materia = await Materia.create({
        nombre: materiaData.nombre,
        descripcion: materiaData.descripcion,
        color: materiaData.color,
        autor: admin._id
      });
      console.log(`✅ Materia creada: ${materia.nombre}`);

      // Crear unidades de la materia
      for (const unidadData of materiaData.unidades) {
        const unidad = await Unidad.create({
          materia: materia._id,
          numero: unidadData.numero,
          titulo: unidadData.titulo,
          descripcion: unidadData.descripcion
        });
        console.log(`   ├─ Unidad ${unidad.numero}: ${unidad.titulo}`);

        // Crear temas de la unidad
        for (const temaData of unidadData.temas) {
          const tema = await Tema.create({
            unidad: unidad._id,
            titulo: temaData.titulo,
            orden: temaData.orden
          });
          console.log(`   │  └─ Tema ${tema.orden}: ${tema.titulo}`);
        }
      }
      console.log('');
    }

    // Resumen final
    const totalMaterias = await Materia.countDocuments();
    const totalUnidades = await Unidad.countDocuments();
    const totalTemas = await Tema.countDocuments();

    console.log('📊 RESUMEN:');
    console.log(`   ✅ ${totalMaterias} Materias creadas`);
    console.log(`   ✅ ${totalUnidades} Unidades creadas`);
    console.log(`   ✅ ${totalTemas} Temas creados`);
    console.log('\n🎉 Seed completado exitosamente!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seed();

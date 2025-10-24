/* Seed de Materias → Unidades → Temas
   Uso:
     MONGO_URI="mongodb://localhost/miapi" ADMIN_ID="64f..." node src/scripts/seedMaterias.js
     o
     node src/scripts/seedMaterias.js --autor=64f... (requiere MONGO_URI en env)
*/
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// Modelos (usando los que ya tienes en src/models)
const Materia = require('../models/Materia');
const Unidad = require('../models/Unidad');
const Tema = require('../models/Tema');

function getArgAutor() {
  const arg = process.argv.find(a => a.startsWith('--autor='));
  return arg ? arg.split('=')[1] : undefined;
}

const ADMIN_ID = getArgAutor() || process.env.ADMIN_ID;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('Error: Debes definir MONGO_URI en el entorno (.env) o variables de entorno.');
  process.exit(1);
}
if (!ADMIN_ID) {
  console.error('Error: Debes pasar el ID del usuario ADMIN como --autor=<ObjectId> o ADMIN_ID en env.');
  process.exit(1);
}

const data = [
  {
    nombre: 'Fundamentos de Programación',
    descripcion: 'Estructura base de algoritmos y programación inicial.',
    color: '#3B82F6',
    unidades: [
      {
        numero: 1,
        titulo: 'Diseño Algorítmico',
        temas: [
          'Conceptos básicos.',
          'Representación de algoritmos: gráfica y pseudocódigo.',
          'Diseño de algoritmos.',
          'Diseño de funciones.'
        ]
      },
      {
        numero: 2,
        titulo: 'Introducción a la Programación',
        temas: [
          'Conceptos básicos.',
          'Características del lenguaje de programación.',
          'Estructura básica de un programa.',
          'Elementos del lenguaje: tipos de datos, literales, constantes, variables, identificadores, parámetros, operadores y salida de datos.',
          'Traducción de un programa: compilación, enlace, ejecución y errores.'
        ]
      },
      {
        numero: 3,
        titulo: 'Control de Flujo',
        temas: [
          'Estructuras secuenciales.',
          'Estructuras selectivas: simple, doble y múltiple.',
          'Estructuras iterativas: repetir mientras, hasta, desde.'
        ]
      },
      {
        numero: 4,
        titulo: 'Organización de datos',
        temas: [
          'Arreglos',
          'Unidimensionales: conceptos básicos, operaciones y aplicaciones.',
          'Multidimensionales: conceptos básicos, operaciones y aplicaciones.',
          'Estructuras o registros.'
        ]
      },
      {
        numero: 5,
        titulo: 'Modularidad',
        temas: [
          'Declaración y uso de módulos.',
          'Paso de parámetros o argumentos.',
          'Implementación.'
        ]
      }
    ]
  },
  {
    nombre: 'Programación Orientada a Objetos',
    descripcion: 'Conceptos y prácticas de OOP: clases, herencia, polimorfismo y más.',
    color: '#10B981',
    unidades: [
      {
        numero: 1,
        titulo: 'Introducción al paradigma de la programación orientada a objetos',
        temas: [
          'Elementos del modelo de objetos: clases, objetos, abstracción, modularidad, encapsulamiento, herencia y polimorfismo',
          'Lenguaje de modelado unificado: diagrama de clases'
        ]
      },
      {
        numero: 2,
        titulo: 'Clases y objetos',
        temas: [
          'Declaración de clases: atributos, métodos, encapsulamiento',
          'Instanciación de una clase',
          'Referencia al objeto actual',
          'Métodos: declaración, mensajes, paso de parámetros, retorno de valores',
          'Constructores y destructores declaración, uso y aplicaciones',
          'Sobrecarga de métodos',
          'Sobrecarga de operadores: Concepto y utilidad, operadores unarios y binarios'
        ]
      },
      {
        numero: 3,
        titulo: 'Herencia',
        temas: [
          'Definición: clase base, clase derivada',
          'Clasificación: herencia simple, herencia múltiple',
          'Reutilización de miembros heredados',
          'Referencia al objeto de la clase base',
          'Constructores y destructores en clases derivadas',
          'Redefinición de métodos en clases derivadas'
        ]
      },
      {
        numero: 4,
        titulo: 'Polimorfismo',
        temas: [
          'Definición',
          'Clases abstractas: definición, métodos abstractos, implementación de clases abstractas, modelado de clases abstractas',
          'Interfaces: definición, implementación de interfaces, herencia de interfaces',
          'Variables polimórficas (plantillas): definición, uso y aplicaciones',
          'Reutilización de código'
        ]
      },
      {
        numero: 5,
        titulo: 'Excepciones',
        temas: [
          'Definición',
          'Tipos de excepciones',
          'Propagación de excepciones',
          'Gestión de excepciones: manejo de excepciones, lanzamiento de excepciones',
          'Creación y manejo de excepciones definidas por el usuario'
        ]
      },
      {
        numero: 6,
        titulo: 'Flujos y archivos',
        temas: [
          'Definición',
          'Clasificación: Archivos de texto y binarios',
          'Operaciones básicas y tipos de acceso',
          'Manejo de objetos persistentes'
        ]
      }
    ]
  }
];

async function main() {
  await mongoose.connect(MONGO_URI, { autoIndex: true });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const materiaData of data) {
      // Idempotencia por nombre
      const existing = await Materia.findOne({ nombre: materiaData.nombre }).session(session);
      if (existing) {
        console.log(`↷ Materia ya existe, se omite: ${materiaData.nombre}`);
        continue;
      }

      const [materia] = await Materia.create([{
        nombre: materiaData.nombre,
        descripcion: materiaData.descripcion,
        color: materiaData.color,
        autor: ADMIN_ID,
        activo: true
      }], { session });

      console.log(`✓ Materia creada: ${materia.nombre}`);

      for (const u of materiaData.unidades) {
        const [unidad] = await Unidad.create([{
          materia: materia._id,
          numero: u.numero,
          titulo: u.titulo,
          descripcion: '',
          objetivos: [],
          activo: true
        }], { session });

        // Temas con orden incremental
        const temasDocs = (u.temas || []).map((titulo, idx) => ({
          unidad: unidad._id,
          titulo,
          contenido: '',
          orden: idx + 1,
          activo: true
        }));

        if (temasDocs.length) {
          await Tema.insertMany(temasDocs, { session });
        }

        console.log(`  - Unidad creada: ${u.numero}. ${u.titulo} (${temasDocs.length} temas)`);
      }
    }

    await session.commitTransaction();
    console.log('✔ Seed completado.');
  } catch (err) {
    await session.abortTransaction();
    console.error('✖ Error en seed:', err.message);
    process.exitCode = 1;
  } finally {
    session.endSession();
    await mongoose.disconnect();
  }
}

main();

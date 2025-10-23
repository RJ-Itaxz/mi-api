require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Ejercicio = require('../models/Ejercicio');
const Resultado = require('../models/Resultado');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi-api-db';

async function seed() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes
    await Usuario.deleteMany({});
    await Ejercicio.deleteMany({});
    await Resultado.deleteMany({});
    console.log('🗑️  Colecciones limpiadas');

    // Crear usuario ADMIN
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    const admin = await Usuario.create({
      numeroUsuario: 1,
      nombre: 'Administrador ITO',
      email: 'admin@ito.edu.mx',
      password: adminPassword,
      role: 'ADMIN',
      activo: true
    });
    console.log('👤 Admin creado:', admin.email, '- Usuario #' + admin.numeroUsuario);

    // Crear usuarios ALUMNO de ejemplo
    const alumno1Password = await bcrypt.hash('alumno123', salt);
    const alumno2Password = await bcrypt.hash('alumno123', salt);
    
    const alumno1 = await Usuario.create({
      numeroUsuario: 2,
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@alumno.ito.edu.mx',
      password: alumno1Password,
      role: 'ALUMNO',
      perfil: { grupo: 'ISC-1A', semestre: 1, carrera: 'ISC' },
      activo: true
    });

    const alumno2 = await Usuario.create({
      numeroUsuario: 3,
      nombre: 'María García',
      email: 'maria.garcia@alumno.ito.edu.mx',
      password: alumno2Password,
      role: 'ALUMNO',
      perfil: { grupo: 'ISC-1A', semestre: 1, carrera: 'ISC' },
      activo: true
    });
    console.log('👥 Alumnos creados:');
    console.log('   -', alumno1.email, '- Usuario #' + alumno1.numeroUsuario);
    console.log('   -', alumno2.email, '- Usuario #' + alumno2.numeroUsuario);

    // Crear ejercicios - Fundamentos de Programación
    const ejercicios = [
      // Tema 1: Diseño Algorítmico
      {
        titulo: 'Algoritmo para calcular el área de un círculo',
        tema: 'Diseño Algorítmico',
        dificultad: 'facil',
        descripcion: 'Diseña un algoritmo que calcule el área de un círculo dado su radio. Usa pseudocódigo.',
        autor: admin._id
      },
      {
        titulo: 'Diagrama de flujo: Mayor de tres números',
        tema: 'Diseño Algorítmico',
        dificultad: 'facil',
        descripcion: 'Crea un diagrama de flujo que determine cuál es el mayor de tres números ingresados.',
        autor: admin._id
      },
      {
        titulo: 'Función para factorial',
        tema: 'Diseño Algorítmico',
        dificultad: 'media',
        descripcion: 'Diseña una función que calcule el factorial de un número entero positivo.',
        autor: admin._id
      },

      // Tema 2: Introducción a la Programación
      {
        titulo: 'Hola Mundo en C',
        tema: 'Introducción a la Programación',
        dificultad: 'facil',
        descripcion: 'Escribe un programa que imprima "Hola Mundo" en la consola.',
        autor: admin._id
      },
      {
        titulo: 'Declaración de variables y tipos de datos',
        tema: 'Introducción a la Programación',
        dificultad: 'facil',
        descripcion: 'Declara variables de tipo entero, flotante, carácter y cadena. Asigna valores e imprímelos.',
        autor: admin._id
      },
      {
        titulo: 'Operadores aritméticos',
        tema: 'Introducción a la Programación',
        dificultad: 'facil',
        descripcion: 'Crea un programa que solicite dos números y muestre la suma, resta, multiplicación y división.',
        autor: admin._id
      },

      // Tema 3: Control de Flujo
      {
        titulo: 'Número par o impar',
        tema: 'Control de Flujo',
        dificultad: 'facil',
        descripcion: 'Escribe un programa que determine si un número es par o impar.',
        autor: admin._id
      },
      {
        titulo: 'Calculadora básica con switch',
        tema: 'Control de Flujo',
        dificultad: 'media',
        descripcion: 'Implementa una calculadora que use estructuras selectivas múltiples (switch) para operaciones básicas.',
        autor: admin._id
      },
      {
        titulo: 'Tabla de multiplicar con ciclo while',
        tema: 'Control de Flujo',
        dificultad: 'facil',
        descripcion: 'Imprime la tabla de multiplicar del 1 al 10 de un número dado usando ciclo while.',
        autor: admin._id
      },
      {
        titulo: 'Suma de números pares hasta N',
        tema: 'Control de Flujo',
        dificultad: 'media',
        descripcion: 'Calcula la suma de todos los números pares desde 1 hasta N usando ciclo for.',
        autor: admin._id
      },

      // Tema 4: Organización de datos
      {
        titulo: 'Promedio de calificaciones con arreglo',
        tema: 'Organización de datos',
        dificultad: 'media',
        descripcion: 'Lee N calificaciones, guárdalas en un arreglo y calcula el promedio.',
        autor: admin._id
      },
      {
        titulo: 'Búsqueda lineal en arreglo',
        tema: 'Organización de datos',
        dificultad: 'media',
        descripcion: 'Implementa búsqueda lineal para encontrar un elemento en un arreglo unidimensional.',
        autor: admin._id
      },
      {
        titulo: 'Matriz transpuesta',
        tema: 'Organización de datos',
        dificultad: 'dificil',
        descripcion: 'Crea un programa que calcule la matriz transpuesta de una matriz 3x3.',
        autor: admin._id
      },
      {
        titulo: 'Registro de estudiante',
        tema: 'Organización de datos',
        dificultad: 'media',
        descripcion: 'Define una estructura (struct) para almacenar datos de un estudiante (nombre, matrícula, promedio).',
        autor: admin._id
      },

      // Tema 5: Modularidad
      {
        titulo: 'Función para validar edad',
        tema: 'Modularidad',
        dificultad: 'facil',
        descripcion: 'Crea una función que reciba una edad y retorne si es mayor de edad o no.',
        autor: admin._id
      },
      {
        titulo: 'Paso de parámetros por valor y referencia',
        tema: 'Modularidad',
        dificultad: 'media',
        descripcion: 'Implementa dos funciones que demuestren paso de parámetros por valor y por referencia.',
        autor: admin._id
      },

      // Programación Orientada a Objetos
      {
        titulo: 'Clase Persona con atributos básicos',
        tema: 'POO - Clases y Objetos',
        dificultad: 'facil',
        descripcion: 'Define una clase Persona con atributos nombre, edad y métodos para mostrar información.',
        autor: admin._id
      },
      {
        titulo: 'Constructor y destructor',
        tema: 'POO - Clases y Objetos',
        dificultad: 'media',
        descripcion: 'Implementa una clase con constructor parametrizado y destructor que muestre mensajes.',
        autor: admin._id
      },
      {
        titulo: 'Encapsulamiento con getters y setters',
        tema: 'POO - Clases y Objetos',
        dificultad: 'media',
        descripcion: 'Crea una clase Cuenta bancaria con atributos privados y métodos públicos de acceso.',
        autor: admin._id
      },
      {
        titulo: 'Herencia simple: Clase Estudiante',
        tema: 'POO - Herencia',
        dificultad: 'media',
        descripcion: 'Crea clase Estudiante que herede de Persona y agregue atributo matrícula.',
        autor: admin._id
      },
      {
        titulo: 'Polimorfismo con interfaces',
        tema: 'POO - Polimorfismo',
        dificultad: 'dificil',
        descripcion: 'Implementa una interfaz Figura con método calcularArea() y clases Círculo y Rectángulo.',
        autor: admin._id
      },
      {
        titulo: 'Manejo de excepciones',
        tema: 'POO - Excepciones',
        dificultad: 'media',
        descripcion: 'Implementa try-catch para manejar división por cero y entrada inválida.',
        autor: admin._id
      },
      {
        titulo: 'Lectura y escritura de archivos de texto',
        tema: 'POO - Flujos y Archivos',
        dificultad: 'media',
        descripcion: 'Crea un programa que lea un archivo de texto y cuente el número de líneas y palabras.',
        autor: admin._id
      }
    ];

    // Crear ejercicios uno por uno para que se ejecute el middleware de auto-incremento
    const ejerciciosCreados = [];
    for (let i = 0; i < ejercicios.length; i++) {
      const ejercicio = await Ejercicio.create(ejercicios[i]);
      ejerciciosCreados.push(ejercicio);
    }
    console.log(`📝 ${ejerciciosCreados.length} ejercicios creados (números 1-${ejerciciosCreados.length})`);

    // Crear algunos resultados de ejemplo
    const resultados = [
      {
        alumno: alumno1._id,
        ejercicio: ejerciciosCreados[0]._id,
        correcto: true,
        puntaje: 10,
        tiempoSeg: 120
      },
      {
        alumno: alumno1._id,
        ejercicio: ejerciciosCreados[1]._id,
        correcto: true,
        puntaje: 10,
        tiempoSeg: 180
      },
      {
        alumno: alumno1._id,
        ejercicio: ejerciciosCreados[6]._id,
        correcto: false,
        puntaje: 5,
        tiempoSeg: 90
      },
      {
        alumno: alumno2._id,
        ejercicio: ejerciciosCreados[0]._id,
        correcto: true,
        puntaje: 10,
        tiempoSeg: 150
      },
      {
        alumno: alumno2._id,
        ejercicio: ejerciciosCreados[3]._id,
        correcto: true,
        puntaje: 10,
        tiempoSeg: 60
      }
    ];

    await Resultado.insertMany(resultados);
    console.log(`📊 ${resultados.length} resultados de ejemplo creados`);

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n📋 Credenciales creadas:');
    console.log('ADMIN:');
    console.log('  Email: admin@ito.edu.mx');
    console.log('  Password: admin123');
    console.log('\nALUMNOS:');
    console.log('  Email: carlos.mendoza@alumno.ito.edu.mx');
    console.log('  Password: alumno123');
    console.log('  Email: maria.garcia@alumno.ito.edu.mx');
    console.log('  Password: alumno123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();

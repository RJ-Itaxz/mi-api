require('dotenv').config();
const mongoose = require('mongoose');
const Materia = require('../models/Materia');
const Unidad = require('../models/Unidad');
const Tema = require('../models/Tema');
const Informacion = require('../models/Informacion');
const Usuario = require('../models/Usuario');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi-api-db';

// Datos de información para Fundamentos de Programación
const informacionData = [
  // UNIDAD 1: Diseño Algorítmico
  {
    unidad: 1,
    tema: 1,
    titulo: 'Conceptos básicos',
    conceptosClave: [
      {
        termino: 'Algoritmo',
        definicion: 'Conjunto finito y ordenado de pasos que describe cómo resolver un problema o realizar una tarea. Debe ser claro, finito, preciso y determinista.',
        ejemplos: ['algoritmo para calcular el área de un rectángulo: leer base y altura, multiplicar, mostrar resultado']
      },
      {
        termino: 'Entrada / salida',
        definicion: 'Datos que recibe el algoritmo y resultados que produce.',
        ejemplos: ['En cálculo de área: entrada = base y altura, salida = área calculada']
      },
      {
        termino: 'Correctitud',
        definicion: 'Un algoritmo es correcto si produce la salida esperada para todas las entradas válidas.',
        ejemplos: ['Un algoritmo de ordenamiento es correcto si ordena cualquier lista de números']
      },
      {
        termino: 'Eficiencia',
        definicion: 'Mide recursos (tiempo, memoria). Notación para analizar (concepto básico de complejidad).',
        ejemplos: ['Búsqueda lineal O(n) vs búsqueda binaria O(log n)']
      },
      {
        termino: 'Variables, constantes y tipos',
        definicion: 'Símbolos que almacenan datos durante la ejecución.',
        ejemplos: ['variable: contador = 0, constante: PI = 3.14159, tipo: entero, real, cadena']
      }
    ],
    ejemploBreve: 'Algoritmo para calcular el área de un rectángulo: 1) leer base, 2) leer altura, 3) área = base * altura, 4) mostrar área.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un algoritmo puede tener un número infinito de pasos.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: false },
          { texto: 'Falso', esCorrecta: true }
        ],
        respuestaCorrecta: 'Falso',
        explicacion: 'Un algoritmo debe ser finito, es decir, debe terminar después de un número finito de pasos.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál de estas NO es característica de un algoritmo correcto?',
        opciones: [
          { texto: 'Finitud', esCorrecta: false },
          { texto: 'Determinismo', esCorrecta: false },
          { texto: 'Ambigüedad', esCorrecta: true },
          { texto: 'Entrada y salida', esCorrecta: false }
        ],
        respuestaCorrecta: 'Ambigüedad',
        explicacion: 'Un algoritmo debe ser preciso y no ambiguo. La ambigüedad impide la correcta ejecución.'
      }
    ],
    dificultad: 'FACIL'
  },
  {
    unidad: 1,
    tema: 2,
    titulo: 'Representación de algoritmos: gráfica y pseudocódigo',
    conceptosClave: [
      {
        termino: 'Pseudocódigo',
        definicion: 'Representación textual semi-formal de un algoritmo, usa palabras en lenguaje natural mezcladas con estructuras (si, mientras, para, etc.). Facilita pasar a código.',
        ejemplos: ['INICIO, LEER a,b, c = a + b, ESCRIBIR c, FIN']
      },
      {
        termino: 'Diagrama de flujo',
        definicion: 'Representación gráfica con símbolos (óvalo inicio/fin, rectángulo proceso, rombo decisión, paralelogramo entrada/salida, flechas de control).',
        ejemplos: ['Óvalo para inicio/fin, rectángulo para procesos, rombo para decisiones']
      },
      {
        termino: 'Elementos del diagrama',
        definicion: 'Inicio/fin, procesos, decisiones (condiciones booleanas), entradas/salidas, conectores.',
        ejemplos: ['Rombo: ¿x > 0?, Paralelogramo: LEER nombre, Rectángulo: suma = a + b']
      }
    ],
    ejemploBreve: 'Pseudocódigo para sumar dos números: INICIO, LEER a, LEER b, c = a + b, ESCRIBIR c, FIN. Diagrama: inicio → leer a,b → c=a+b → mostrar c → fin.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un rombo en un diagrama de flujo representa una decisión/condición.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'El rombo es el símbolo estándar para representar decisiones o condiciones en diagramas de flujo.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué símbolo se usa para inicio/fin en la mayoría de diagramas de flujo?',
        opciones: [
          { texto: 'Rectángulo', esCorrecta: false },
          { texto: 'Óvalo', esCorrecta: true },
          { texto: 'Rombo', esCorrecta: false },
          { texto: 'Paralelogramo', esCorrecta: false }
        ],
        respuestaCorrecta: 'Óvalo',
        explicacion: 'El óvalo (elipse) es el símbolo estándar para indicar el inicio y fin de un diagrama de flujo.'
      }
    ],
    dificultad: 'FACIL'
  },
  {
    unidad: 1,
    tema: 3,
    titulo: 'Diseño de algoritmos',
    conceptosClave: [
      {
        termino: 'Estrategias de diseño',
        definicion: 'Dividir y vencerás (divide & conquer), programación funcional simple, algoritmos voraces (greedy), uso de estructuras de datos adecuadas.',
        ejemplos: ['Ordenamiento por mezcla (divide y vencerás)', 'Algoritmo de cambio de monedas (greedy)']
      },
      {
        termino: 'Refinamiento sucesivo',
        definicion: 'Empezar con una solución general y detallar pasos hasta obtener instrucciones ejecutables.',
        ejemplos: ['1) Ordenar lista → 2) Comparar elementos → 3) Intercambiar si es necesario']
      },
      {
        termino: 'Pruebas',
        definicion: 'Casos de prueba, casos límite, prueba de caja negra (entradas/salidas) y caja blanca (cobertura interna).',
        ejemplos: ['Caso normal: lista [3,1,4], Caso límite: lista vacía [], Caso borde: un elemento [5]']
      }
    ],
    ejemploBreve: 'Diseño de algoritmo para ordenar 3 números: comparar a con b, si a>b intercambiar, comparar b con c, si b>c intercambiar, repetir primera comparación.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Dividir problemas grandes en subproblemas facilita el diseño.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Dividir y vencerás es una estrategia fundamental que hace los problemas más manejables.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Para validar un algoritmo, es importante:',
        opciones: [
          { texto: 'Probar sólo un caso', esCorrecta: false },
          { texto: 'Probar casos normales, límite y erróneos', esCorrecta: true },
          { texto: 'Cambiar el algoritmo constantemente sin pruebas', esCorrecta: false },
          { texto: 'Ignorar entradas inválidas', esCorrecta: false }
        ],
        respuestaCorrecta: 'Probar casos normales, límite y erróneos',
        explicacion: 'Una validación completa requiere probar diferentes tipos de casos para asegurar robustez.'
      }
    ],
    dificultad: 'MEDIA'
  },
  {
    unidad: 1,
    tema: 4,
    titulo: 'Diseño de funciones',
    conceptosClave: [
      {
        termino: 'Función',
        definicion: 'Bloque de código con un propósito, puede recibir parámetros y devolver un resultado (o no).',
        ejemplos: ['función promedio(números) que devuelve la media aritmética']
      },
      {
        termino: 'Firma',
        definicion: 'Nombre, parámetros (tipos), valor de retorno.',
        ejemplos: ['calcularArea(base: real, altura: real): real']
      },
      {
        termino: 'Alcance (scope)',
        definicion: 'Variables locales vs globales; evitar efectos secundarios.',
        ejemplos: ['Variable local solo existe dentro de la función, variable global accesible desde cualquier parte']
      },
      {
        termino: 'Recursión',
        definicion: 'Función que se llama a sí misma; condición base y caso recursivo.',
        ejemplos: ['factorial(n) = 1 si n=0, sino n * factorial(n-1)']
      }
    ],
    ejemploBreve: 'Función promedio(números): suma = 0, para cada número en números: suma += número, devolver suma / cantidad_números.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Es buena práctica que una función realice una sola tarea bien definida.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'El principio de responsabilidad única mejora la legibilidad, mantenimiento y reutilización del código.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué NO forma parte de la firma de una función?',
        opciones: [
          { texto: 'Nombre', esCorrecta: false },
          { texto: 'Parámetros', esCorrecta: false },
          { texto: 'Comentarios internos', esCorrecta: true },
          { texto: 'Tipo de retorno', esCorrecta: false }
        ],
        respuestaCorrecta: 'Comentarios internos',
        explicacion: 'La firma incluye nombre, parámetros y tipo de retorno. Los comentarios son parte de la implementación.'
      }
    ],
    dificultad: 'MEDIA'
  },
  // UNIDAD 2: Introducción a la Programación
  {
    unidad: 2,
    tema: 1,
    titulo: 'Conceptos básicos',
    conceptosClave: [
      {
        termino: 'Programación',
        definicion: 'Proceso de traducir algoritmos a un lenguaje que una computadora pueda ejecutar.',
        ejemplos: ['Convertir pseudocódigo a Python, Java o C++']
      },
      {
        termino: 'Lenguaje de programación',
        definicion: 'Conjunto de reglas y sintaxis para expresar instrucciones (ej.: C, Java, Python).',
        ejemplos: ['Python: print("Hola"), Java: System.out.println("Hola"), C: printf("Hola")']
      },
      {
        termino: 'Fuente, compilador/intérprete',
        definicion: 'Código fuente es el texto del programa, compilador/intérprete lo convierte a código ejecutable.',
        ejemplos: ['archivo.py (fuente) → intérprete Python → ejecución', 'archivo.c (fuente) → compilador gcc → ejecutable']
      }
    ],
    ejemploBreve: 'Programa "Hola mundo": print("Hola mundo") en Python, System.out.println("Hola mundo"); en Java.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un intérprete ejecuta el código línea por línea (normalmente).',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Los intérpretes procesan y ejecutan el código fuente línea por línea durante la ejecución.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es la primera línea tradicional para comprobar un entorno de programación?',
        opciones: [
          { texto: 'Leer datos', esCorrecta: false },
          { texto: 'Declarar variables', esCorrecta: false },
          { texto: 'Imprimir "Hola mundo"', esCorrecta: true },
          { texto: 'Compilar librerías', esCorrecta: false }
        ],
        respuestaCorrecta: 'Imprimir "Hola mundo"',
        explicacion: '"Hola mundo" es el programa tradicional para verificar que el entorno de desarrollo funciona correctamente.'
      }
    ],
    dificultad: 'FACIL'
  },
  {
    unidad: 2,
    tema: 2,
    titulo: 'Características del lenguaje de programación',
    conceptosClave: [
      {
        termino: 'Sintaxis y semántica',
        definicion: 'Sintaxis = forma correcta de escribir código; semántica = significado del código.',
        ejemplos: ['Sintaxis: if (x > 0), Semántica: ejecutar bloque si x es positivo']
      },
      {
        termino: 'Tipado',
        definicion: 'Estático vs dinámico (cuando se verifican tipos); fuerte vs débil (qué tan estrictas son las reglas).',
        ejemplos: ['Java: tipado estático fuerte, Python: tipado dinámico fuerte, JavaScript: tipado dinámico débil']
      },
      {
        termino: 'Paradigmas',
        definicion: 'Imperativo, procedural, orientado a objetos, funcional, declarativo.',
        ejemplos: ['Imperativo: C, OOP: Java, Funcional: Haskell, Declarativo: SQL']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'En tipado estático los tipos se verifican en tiempo de compilación.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'El tipado estático verifica la compatibilidad de tipos antes de la ejecución, durante la compilación.'
      }
    ],
    dificultad: 'MEDIA'
  },
  {
    unidad: 2,
    tema: 3,
    titulo: 'Estructura básica de un programa',
    conceptosClave: [
      {
        termino: 'Partes típicas',
        definicion: 'Declaración de módulos/imports, definiciones de funciones/procedimientos, función principal (main), manejo de entradas/salidas, comentarios/documentación.',
        ejemplos: ['import math, def calcular(), if __name__ == "__main__":', '//comentario', '/*bloque*/']
      },
      {
        termino: 'Orden lógico',
        definicion: 'Inicialización → procesamiento → salida → limpieza.',
        ejemplos: ['1) Configurar variables, 2) Procesar datos, 3) Mostrar resultados, 4) Liberar recursos']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'La función main usualmente:',
        opciones: [
          { texto: 'No se ejecuta nunca', esCorrecta: false },
          { texto: 'Es el punto de entrada donde empieza la ejecución', esCorrecta: true },
          { texto: 'Sólo sirve para pruebas', esCorrecta: false },
          { texto: 'Debe contener toda la lógica del programa', esCorrecta: false }
        ],
        respuestaCorrecta: 'Es el punto de entrada donde empieza la ejecución',
        explicacion: 'La función main es el punto de entrada estándar donde el sistema operativo inicia la ejecución del programa.'
      }
    ],
    dificultad: 'FACIL'
  },
  {
    unidad: 2,
    tema: 4,
    titulo: 'Elementos del lenguaje: tipos de datos, literales, constantes, variables, identificadores, parámetros, operadores y salida de datos',
    conceptosClave: [
      {
        termino: 'Tipos primitivos',
        definicion: 'Entero, real (float/double), carácter, cadena, booleano.',
        ejemplos: ['int: 42, float: 3.14, char: "A", string: "Hola", bool: True/False']
      },
      {
        termino: 'Literales',
        definicion: 'Representación literal de un valor en el código.',
        ejemplos: ['42 (entero), 3.14 (real), "hola" (cadena), True (booleano)']
      },
      {
        termino: 'Variables vs Constantes',
        definicion: 'Variables: ubicación nombrada que almacena valores mutables; Constantes: valores que no cambian.',
        ejemplos: ['variable: contador = 0; constante: const PI = 3.14159']
      },
      {
        termino: 'Operadores',
        definicion: 'Aritméticos (+,-,*,/), relacionales (>,<,==), lógicos (&&,||, !), de asignación (=).',
        ejemplos: ['5 + 3 = 8, 5 > 3 = True, True && False = False, x = 10']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Las constantes se usan para valores que no deben cambiar.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Las constantes protegen valores importantes de modificaciones accidentales durante la ejecución.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Operador lógico que NIEGA una condición:',
        opciones: [
          { texto: '&&', esCorrecta: false },
          { texto: '||', esCorrecta: false },
          { texto: '!', esCorrecta: true },
          { texto: '==', esCorrecta: false }
        ],
        respuestaCorrecta: '!',
        explicacion: 'El operador ! (NOT) invierte el valor de verdad: !True = False, !False = True.'
      }
    ],
    dificultad: 'FACIL'
  },
  {
    unidad: 2,
    tema: 5,
    titulo: 'Traducción de un programa: compilación, enlace, ejecución y errores',
    conceptosClave: [
      {
        termino: 'Compilación',
        definicion: 'Traducción del código fuente a código objeto o binario por un compilador; detección de errores de sintaxis.',
        ejemplos: ['gcc programa.c → programa.o (objeto)', 'javac Programa.java → Programa.class']
      },
      {
        termino: 'Enlace (linking)',
        definicion: 'Combinar objetos y librerías en un ejecutable; enlazar referencias externas.',
        ejemplos: ['enlazar programa.o con libc para crear programa.exe']
      },
      {
        termino: 'Tipos de errores',
        definicion: 'Sintaxis (compile-time), semánticos, runtime (división por cero), lógicos (resultado incorrecto).',
        ejemplos: ['Sintaxis: if x > 0 (falta :), Runtime: 5/0, Lógico: suma en lugar de promedio']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El linker puede fallar si falta una librería externa.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'El enlazador necesita resolver todas las referencias externas; si falta una librería, el enlace falla.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Un error que ocurre por dividir por cero se clasifica como:',
        opciones: [
          { texto: 'Sintaxis', esCorrecta: false },
          { texto: 'Semántico', esCorrecta: false },
          { texto: 'Runtime', esCorrecta: true },
          { texto: 'Lógico', esCorrecta: false }
        ],
        respuestaCorrecta: 'Runtime',
        explicacion: 'La división por cero es detectada durante la ejecución del programa, no durante la compilación.'
      }
    ],
    dificultad: 'MEDIA'
  },
  // UNIDAD 3: Control de Flujo
  {
    unidad: 3,
    tema: 1,
    titulo: 'Estructuras secuenciales',
    conceptosClave: [
      {
        termino: 'Ejecución línea a línea',
        definicion: 'Instrucciones que se ejecutan en orden sin saltos, una después de la otra de forma secuencial.',
        ejemplos: ['1) Leer base, 2) Leer altura, 3) Calcular área, 4) Mostrar resultado']
      },
      {
        termino: 'Uso en inicialización',
        definicion: 'Las estructuras secuenciales son ideales para procesos de inicialización y operaciones simples.',
        ejemplos: ['Configurar variables iniciales, cargar datos, establecer valores por defecto']
      },
      {
        termino: 'Importancia del orden',
        definicion: 'El orden correcto de las instrucciones es fundamental para obtener resultados válidos.',
        ejemplos: ['Primero leer datos, luego procesarlos, finalmente mostrar resultados']
      }
    ],
    ejemploBreve: 'Calcular área de triángulo: 1) LEER base, 2) LEER altura, 3) area = (base * altura) / 2, 4) ESCRIBIR area.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'En estructuras secuenciales no se usan condiciones ni bucles.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Las estructuras secuenciales ejecutan instrucciones en orden lineal sin decisiones ni repeticiones.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Estructura secuencial significa:',
        opciones: [
          { texto: 'Saltos incondicionales', esCorrecta: false },
          { texto: 'Ejecución en orden línea por línea', esCorrecta: true },
          { texto: 'Uso obligatorio de funciones recursivas', esCorrecta: false },
          { texto: 'Ejecución aleatoria', esCorrecta: false }
        ],
        respuestaCorrecta: 'Ejecución en orden línea por línea',
        explicación: 'La estructura secuencial implica ejecutar instrucciones una tras otra en el orden especificado.'
      }
    ],
    dificultad: 'FACIL'
  },
  {
    unidad: 3,
    tema: 2,
    titulo: 'Estructuras selectivas: simple, doble y múltiple',
    conceptosClave: [
      {
        termino: 'Selección simple (if)',
        definicion: 'Ejecuta una acción solo si la condición es verdadera. Si es falsa, no hace nada.',
        ejemplos: ['if (edad >= 18) { print("Es mayor de edad") }']
      },
      {
        termino: 'Selección doble (if-else)',
        definicion: 'Elige entre dos caminos: ejecuta una acción si es verdadera, otra si es falsa.',
        ejemplos: ['if (nota >= 60) { print("Aprobado") } else { print("Reprobado") }']
      },
      {
        termino: 'Selección múltiple (switch/case)',
        definicion: 'Elige entre múltiples opciones según el valor de una variable o expresión.',
        ejemplos: ['switch(dia) { case 1: print("Lunes"); case 2: print("Martes"); ... }']
      },
      {
        termino: 'Condiciones booleanas',
        definicion: 'Expresiones que evalúan a verdadero o falso, pueden combinarse con AND, OR, NOT.',
        ejemplos: ['(edad >= 18) AND (licencia == true)', '(nota < 60) OR (faltas > 5)']
      }
    ],
    ejemploBreve: 'Clasificar nota: if (nota >= 90) print("A") else if (nota >= 80) print("B") else if (nota >= 70) print("C") else print("F").',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Las condiciones deben evaluarse con operadores lógicos cuando hay varias comprobaciones.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Los operadores lógicos (AND, OR, NOT) permiten combinar múltiples condiciones en una sola expresión.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál estructura es adecuada para elegir entre tres valores discretos de una variable?',
        opciones: [
          { texto: 'Bucle while', esCorrecta: false },
          { texto: 'Selección múltiple (switch)', esCorrecta: true },
          { texto: 'Selección simple', esCorrecta: false },
          { texto: 'Estructura secuencial', esCorrecta: false }
        ],
        respuestaCorrecta: 'Selección múltiple (switch)',
        explicacion: 'Switch/case es ideal para elegir entre múltiples valores discretos de una misma variable.'
      }
    ],
    dificultad: 'MEDIA'
  },
  {
    unidad: 3,
    tema: 3,
    titulo: 'Estructuras iterativas: repetir mientras, hasta, desde',
    conceptosClave: [
      {
        termino: 'Bucles while (mientras)',
        definicion: 'Repetir un bloque de código mientras la condición sea verdadera. Evalúa condición antes de cada iteración.',
        ejemplos: ['while (contador < 10) { print(contador); contador++; }']
      },
      {
        termino: 'Do-while (hasta)',
        definicion: 'Ejecutar al menos una vez y repetir mientras condición sea verdadera. Evalúa condición después de cada iteración.',
        ejemplos: ['do { numero = leerNumero(); } while (numero < 0);']
      },
      {
        termino: 'For (desde)',
        definicion: 'Iteración con contador inicial, condición final y paso de incremento. Ideal para repeticiones conocidas.',
        ejemplos: ['for (i = 0; i < 10; i++) { print(i); }']
      },
      {
        termino: 'Bucles infinitos',
        definicion: 'Riesgo cuando la condición de salida nunca se cumple. Requiere condiciones de salida bien definidas.',
        ejemplos: ['while (true) sin break; while (x > 0) sin modificar x']
      },
      {
        termino: 'Break/Continue',
        definicion: 'Break sale del bucle completamente, continue salta a la siguiente iteración.',
        ejemplos: ['if (numero == 0) break; if (numero < 0) continue;']
      }
    ],
    ejemploBreve: 'Suma de números pares hasta N: suma = 0; for (i = 2; i <= N; i += 2) { suma += i; } print(suma);',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un do-while asegura al menos una ejecución.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Do-while ejecuta el bloque primero y luego evalúa la condición, garantizando al menos una ejecución.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál estructura es más adecuada para recorrer un arreglo con índice i desde 0 a n-1?',
        opciones: [
          { texto: 'if-else', esCorrecta: false },
          { texto: 'for', esCorrecta: true },
          { texto: 'switch', esCorrecta: false },
          { texto: 'recursion', esCorrecta: false }
        ],
        respuestaCorrecta: 'for',
        explicacion: 'El bucle for es ideal para iteraciones con contador conocido como recorrer arreglos por índice.'
      }
    ],
    dificultad: 'MEDIA'
  },
  // UNIDAD 4: Organización de datos
  {
    unidad: 4,
    tema: 1,
    titulo: 'Arreglos',
    conceptosClave: [
      {
        termino: 'Arreglo (array)',
        definicion: 'Colección ordenada y homogénea de elementos del mismo tipo, accesibles por índice numérico.',
        ejemplos: ['int numeros[5] = {1, 2, 3, 4, 5}', 'string nombres[] = {"Ana", "Luis", "Carlos"}']
      },
      {
        termino: 'Índices',
        definicion: 'Posición numérica que identifica cada elemento. Generalmente empiezan en 0 o 1 según el lenguaje.',
        ejemplos: ['arreglo[0] = primer elemento, arreglo[4] = quinto elemento en array de base 0']
      },
      {
        termino: 'Homogeneidad',
        definicion: 'Todos los elementos del arreglo deben ser del mismo tipo de datos.',
        ejemplos: ['Array de enteros: [1, 2, 3, 4], Array de strings: ["a", "b", "c"]']
      },
      {
        termino: 'Operaciones básicas',
        definicion: 'Acceso por índice O(1), actualización O(1), recorrido O(n), búsqueda O(n), ordenamiento O(n log n).',
        ejemplos: ['Acceso: x = arr[3], Actualización: arr[2] = 10, Búsqueda: encontrar valor 5']
      }
    ],
    ejemploBreve: 'Declarar y usar arreglo: int calificaciones[5]; calificaciones[0] = 85; calificaciones[1] = 92; promedio = suma(calificaciones) / 5;',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El acceso por índice permite tiempo constante O(1).',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Los arreglos permiten acceso directo por índice en tiempo constante, sin importar el tamaño del arreglo.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Índice válido para un arreglo de longitud 5 (0-based) incluye:',
        opciones: [
          { texto: '5', esCorrecta: false },
          { texto: '4', esCorrecta: true },
          { texto: '-1', esCorrecta: false },
          { texto: '6', esCorrecta: false }
        ],
        respuestaCorrecta: '4',
        explicacion: 'En un arreglo de longitud 5 con base 0, los índices válidos son 0, 1, 2, 3, 4.'
      }
    ],
    dificultad: 'FACIL'
  },
  {
    unidad: 4,
    tema: 2,
    titulo: 'Unidimensionales: conceptos básicos, operaciones y aplicaciones',
    conceptosClave: [
      {
        termino: 'Arreglo unidimensional',
        definicion: 'Lista lineal de elementos del mismo tipo, organizados en una sola dimensión (fila).',
        ejemplos: ['Lista de edades: [18, 22, 19, 25, 30]', 'Secuencia de temperaturas: [23.5, 25.0, 22.8]']
      },
      {
        termino: 'Operaciones de inserción',
        definicion: 'Agregar elementos en posiciones específicas. Costoso si requiere desplazar elementos existentes.',
        ejemplos: ['Insertar 15 en posición 2: desplazar elementos desde posición 2 hacia la derecha']
      },
      {
        termino: 'Operaciones de eliminación',
        definicion: 'Remover elementos en posiciones específicas. Requiere desplazar elementos para llenar el hueco.',
        ejemplos: ['Eliminar elemento en posición 3: desplazar elementos desde posición 4 hacia la izquierda']
      },
      {
        termino: 'Aplicaciones típicas',
        definicion: 'Listas de calificaciones, secuencias de entrada, vectores en cálculo, histogramas, contadores.',
        ejemplos: ['Calificaciones de estudiantes, lecturas de sensores, inventario de productos']
      }
    ],
    ejemploBreve: 'Encontrar máximo: max = arr[0]; for (i = 1; i < n; i++) { if (arr[i] > max) max = arr[i]; } return max;',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Insertar en medio de un arreglo en general es O(n).',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Insertar en el medio requiere desplazar todos los elementos posteriores, resultando en complejidad O(n).'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Para buscar un elemento en un arreglo sin orden se usa típicamente:',
        opciones: [
          { texto: 'Búsqueda binaria', esCorrecta: false },
          { texto: 'Búsqueda lineal', esCorrecta: true },
          { texto: 'Ordenamiento primero', esCorrecta: false },
          { texto: 'Recursión infinita', esCorrecta: false }
        ],
        respuestaCorrecta: 'Búsqueda lineal',
        explicacion: 'En arreglos no ordenados, la búsqueda lineal es la única opción, revisando elemento por elemento.'
      }
    ],
    dificultad: 'MEDIA'
  },
  {
    unidad: 4,
    tema: 3,
    titulo: 'Multidimensionales: conceptos básicos, operaciones y aplicaciones',
    conceptosClave: [
      {
        termino: 'Arreglos multidimensionales',
        definicion: 'Colección de elementos indexados por múltiples índices (fila, columna, etc.). Las matrices 2D son el caso más común.',
        ejemplos: ['int matriz[3][4] = matriz de 3 filas y 4 columnas', 'Cubo 3D: datos[x][y][z]']
      },
      {
        termino: 'Representación matricial',
        definicion: 'Organización de datos en filas y columnas, como una tabla. Acceso mediante [fila][columna].',
        ejemplos: ['Tabla de calificaciones: estudiantes (filas) x materias (columnas)']
      },
      {
        termino: 'Operaciones matriciales',
        definicion: 'Recorrido por filas/columnas, suma de filas, transposición, multiplicación de matrices.',
        ejemplos: ['Suma fila: sumar todos elementos de matriz[i][j] donde i es constante']
      },
      {
        termino: 'Aplicaciones prácticas',
        definicion: 'Tablas de datos, imágenes (píxeles), juegos (tableros), mapas, gráficos, bases de datos relacionales.',
        ejemplos: ['Imagen: matriz[altura][anchura] de píxeles', 'Tablero ajedrez: tablero[8][8]']
      }
    ],
    ejemploBreve: 'Suma diagonal principal: suma = 0; for (i = 0; i < n; i++) { suma += matriz[i][i]; } return suma;',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un arreglo 2D con m filas y n columnas tiene m*n elementos.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Una matriz de m filas y n columnas contiene exactamente m × n elementos en total.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Para sumar todos los elementos de una matriz m x n necesitas:',
        opciones: [
          { texto: 'Un solo bucle', esCorrecta: false },
          { texto: 'Dos bucles anidados', esCorrecta: true },
          { texto: 'Recursión mínima', esCorrecta: false },
          { texto: 'Ninguno', esCorrecta: false }
        ],
        respuestaCorrecta: 'Dos bucles anidados',
        explicacion: 'Se necesita un bucle para filas y otro anidado para columnas: for(i) for(j) suma += matriz[i][j].'
      }
    ],
    dificultad: 'MEDIA'
  },
  {
    unidad: 4,
    tema: 4,
    titulo: 'Estructuras o registros',
    conceptosClave: [
      {
        termino: 'Registro (struct)',
        definicion: 'Colección de campos heterogéneos (diferentes tipos) agrupados bajo una sola entidad con nombre.',
        ejemplos: ['struct Alumno { string nombre; int edad; float promedio; }']
      },
      {
        termino: 'Campos heterogéneos',
        definicion: 'Los campos de un registro pueden ser de diferentes tipos de datos, a diferencia de los arreglos.',
        ejemplos: ['Persona: nombre (string), edad (int), salario (float), activo (boolean)']
      },
      {
        termino: 'Acceso por nombre',
        definicion: 'Los campos se acceden usando el nombre del campo, no por índice numérico.',
        ejemplos: ['estudiante.nombre = "Ana"; estudiante.promedio = 8.5;']
      },
      {
        termino: 'Modelado de entidades',
        definicion: 'Los registros permiten modelar entidades del mundo real con sus atributos característicos.',
        ejemplos: ['Producto: {id, nombre, precio, stock, categoria}', 'Empleado: {cedula, nombre, departamento, salario}']
      },
      {
        termino: 'Arrays de registros',
        definicion: 'Combinación poderosa: arreglos donde cada elemento es un registro completo.',
        ejemplos: ['Alumno estudiantes[50]; // Array de 50 registros de estudiantes']
      }
    ],
    ejemploBreve: 'struct Alumno { int id; string nombre; float promedio; }; Alumno estudiante; estudiante.id = 123; estudiante.nombre = "Juan"; estudiante.promedio = 8.7;',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un arreglo de registros permite representar múltiples entidades con los mismos campos.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Un arreglo de registros es ideal para manejar múltiples instancias de la misma estructura de datos.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál sería un campo adecuado para un registro "Alumno"?',
        opciones: [
          { texto: 'códigoMateria', esCorrecta: false },
          { texto: 'promedio', esCorrecta: true },
          { texto: 'tamañoDePantalla', esCorrecta: false },
          { texto: 'velocidadCPU', esCorrecta: false }
        ],
        respuestaCorrecta: 'promedio',
        explicacion: 'El promedio es un atributo relevante y característico de un estudiante, a diferencia de las otras opciones.'
      }
    ],
    dificultad: 'MEDIA'
  },
  // UNIDAD 5: Modularidad
  {
    unidad: 5,
    tema: 1,
    titulo: 'Declaración y uso de módulos',
    conceptosClave: [
      {
        termino: 'Módulo',
        definicion: 'Unidad de código que agrupa funciones, tipos y datos relacionados. Puede ser un archivo, paquete o librería.',
        ejemplos: ['módulo matemáticas.py con funciones suma, resta, multiplicación']
      },
      {
        termino: 'Encapsulación',
        definicion: 'Los módulos ocultan detalles internos y exponen solo las interfaces necesarias.',
        ejemplos: ['Módulo de base de datos: expone conectar(), consultar(), pero oculta detalles de conexión']
      },
      {
        termino: 'Reutilización',
        definicion: 'Los módulos pueden ser utilizados en múltiples partes del programa o en diferentes proyectos.',
        ejemplos: ['Módulo de validaciones usado en formularios de registro y actualización']
      },
      {
        termino: 'Importación/Exportación',
        definicion: 'Mecanismo para usar funciones de otros módulos (import) y hacer disponibles las propias (export).',
        ejemplos: ['import math; from utils import validar_email; export function calcular();']
      },
      {
        termino: 'Espacios de nombres',
        definicion: 'Los módulos crean espacios de nombres separados para evitar colisiones entre identificadores.',
        ejemplos: ['math.sqrt() vs string.sqrt() - mismo nombre, diferentes módulos']
      }
    ],
    ejemploBreve: 'Módulo calculadora: export { sumar, restar, multiplicar }; En main: import { sumar } from calculadora; resultado = sumar(5, 3);',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Los módulos facilitan el trabajo en equipo distribuyendo responsabilidad.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Los módulos permiten dividir el trabajo en componentes independientes que diferentes desarrolladores pueden crear y mantener.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Un módulo sirve para:',
        opciones: [
          { texto: 'Reunir código relacionado', esCorrecta: true },
          { texto: 'Aumentar tamaño del programa sin motivo', esCorrecta: false },
          { texto: 'Eliminar funciones', esCorrecta: false },
          { texto: 'Reemplazar la base de datos', esCorrecta: false }
        ],
        respuestaCorrecta: 'Reunir código relacionado',
        explicacion: 'Los módulos agrupan funcionalidades relacionadas, mejorando la organización y mantenibilidad del código.'
      }
    ],
    dificultad: 'MEDIA'
  },
  {
    unidad: 5,
    tema: 2,
    titulo: 'Paso de parámetros o argumentos',
    conceptosClave: [
      {
        termino: 'Parámetros por valor',
        definicion: 'La función recibe una copia del valor. Los cambios en la función no afectan la variable original.',
        ejemplos: ['function incrementar(int x) { x++; } // x original no cambia']
      },
      {
        termino: 'Parámetros por referencia',
        definicion: 'La función recibe la dirección de memoria. Los cambios sí afectan la variable original.',
        ejemplos: ['function incrementar(int &x) { x++; } // x original sí cambia']
      },
      {
        termino: 'Parámetros por defecto',
        definicion: 'Valores predefinidos que se usan si no se proporciona el argumento en la llamada.',
        ejemplos: ['function saludar(string nombre = "Usuario") { print("Hola " + nombre); }']
      },
      {
        termino: 'Paso de arreglos',
        definicion: 'Los arreglos generalmente se pasan por referencia para evitar copiar grandes cantidades de datos.',
        ejemplos: ['function procesar(int arr[]) { arr[0] = 100; } // modifica el arreglo original']
      },
      {
        termino: 'Efectos secundarios',
        definicion: 'Modificaciones a variables fuera del alcance local de la función. Deben minimizarse.',
        ejemplos: ['Modificar variables globales, cambiar parámetros por referencia sin documentar']
      }
    ],
    ejemploBreve: 'Por valor: void duplicar(int x) { x *= 2; } // no afecta original. Por referencia: void duplicar(int &x) { x *= 2; } // sí afecta original.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Usar muchos parámetros es una buena práctica.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: false },
          { texto: 'Falso', esCorrecta: true }
        ],
        respuestaCorrecta: 'Falso',
        explicacion: 'Muchos parámetros hacen las funciones difíciles de usar y mantener. Es mejor usar estructuras o limitar el número.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es ventaja del paso por valor?',
        opciones: [
          { texto: 'Menor seguridad', esCorrecta: false },
          { texto: 'Evitar modificación accidental de la variable original', esCorrecta: true },
          { texto: 'Siempre más rápido', esCorrecta: false },
          { texto: 'Requiere menos memoria', esCorrecta: false }
        ],
        respuestaCorrecta: 'Evitar modificación accidental de la variable original',
        explicacion: 'El paso por valor protege la variable original de modificaciones no intencionadas dentro de la función.'
      }
    ],
    dificultad: 'MEDIA'
  },
  {
    unidad: 5,
    tema: 3,
    titulo: 'Implementación',
    conceptosClave: [
      {
        termino: 'Implementación de módulos',
        definicion: 'Convertir el diseño y pseudocódigo en código real funcional, con validaciones y manejo de errores.',
        ejemplos: ['Convertir función promedio(lista) de pseudocódigo a Python, Java o C++']
      },
      {
        termino: 'Documentación de interfaces',
        definicion: 'Especificar qué parámetros recibe, tipos esperados, valores de retorno y posibles excepciones.',
        ejemplos: ['/** Calcula promedio. @param numeros array de números @return float promedio @throws Error si array vacío */']
      },
      {
        termino: 'Pruebas unitarias',
        definicion: 'Verificar que cada función/módulo funciona correctamente de forma aislada con casos de prueba.',
        ejemplos: ['test_promedio([1,2,3]) debe retornar 2.0; test_promedio([]) debe lanzar excepción']
      },
      {
        termino: 'Versionamiento',
        definicion: 'Control de cambios usando sistemas como Git para rastrear modificaciones y colaborar.',
        ejemplos: ['git commit -m "Implementar función de búsqueda binaria"']
      },
      {
        termino: 'Despliegue y validación',
        definicion: 'Compilar, ejecutar pruebas completas y validar que el comportamiento es correcto.',
        ejemplos: ['Ejecutar suite de pruebas, verificar performance, validar con datos reales']
      }
    ],
    ejemploBreve: 'Implementar buscar(arr, valor): 1) Validar entrada, 2) Recorrer array, 3) Retornar índice o -1, 4) Documentar, 5) Crear pruebas.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Documentar la interfaz de una función ayuda a otros desarrolladores a usarla.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'La documentación clara de interfaces es esencial para que otros desarrolladores puedan usar correctamente las funciones.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Paso típico tras implementar una función:',
        opciones: [
          { texto: 'Subir a producción sin pruebas', esCorrecta: false },
          { texto: 'Escribir pruebas unitarias y validar', esCorrecta: true },
          { texto: 'Eliminar la documentación', esCorrecta: false },
          { texto: 'Cambiar la firma sin avisar', esCorrecta: false }
        ],
        respuestaCorrecta: 'Escribir pruebas unitarias y validar',
        explicacion: 'Después de implementar, es crucial escribir pruebas para verificar que la función trabaja correctamente.'
      }
    ],
    dificultad: 'MEDIA'
  }
];

// ==========================================
// INFORMACIÓN DETALLADA - PROGRAMACIÓN ORIENTADA A OBJETOS
// ==========================================

const informacionPOOData = [
  // UNIDAD 1: Introducción al paradigma de la programación orientada a objetos
  {
    unidad: 1,
    tema: 1,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'Objeto',
        definicion: 'Entidad que representa una cosa del mundo real o conceptual. Tiene estado (atributos/campos) y comportamiento (métodos/funciones).',
        ejemplos: ['Un estudiante con nombre, matrícula y métodos como inscribirse()']
      },
      {
        termino: 'Clase',
        definicion: 'Plantilla o molde que define la estructura (atributos) y comportamiento (métodos) de objetos similares. Una clase describe qué propiedades y acciones tendrán sus instancias.',
        ejemplos: ['class Alumno { String nombre; int matricula; void inscribirse() {...} }']
      },
      {
        termino: 'Abstracción',
        definicion: 'Técnica para centrarse en los aspectos esenciales de un objeto y ocultar detalles irrelevantes. Permite modelar entidades reduciendo complejidad.',
        ejemplos: ['Un auto se modela con acelerar() sin mostrar detalles del motor']
      },
      {
        termino: 'Modularidad',
        definicion: 'Organizar el sistema en unidades independientes (clases/módulos) que facilitan mantenimiento y comprensión.',
        ejemplos: ['Separar clases Estudiante, Curso, Profesor en módulos distintos']
      },
      {
        termino: 'Encapsulamiento',
        definicion: 'Ocultar el estado interno del objeto y exponer sólo lo necesario mediante interfaces (getters/setters, métodos públicos). Protege la integridad del dato.',
        ejemplos: ['private saldo; public getSaldo() { return saldo; }']
      },
      {
        termino: 'Herencia',
        definicion: 'Mecanismo para crear nuevas clases (derivadas) que reutilizan y extienden la definición de una clase base (padre). Facilita la reutilización de código.',
        ejemplos: ['class Empleado extends Persona { ... }']
      },
      {
        termino: 'Polimorfismo',
        definicion: 'Capacidad de tratar objetos de diferentes clases de forma uniforme a través de interfaces comunes; incluye polimorfismo por sobrecarga y por subtipo (dinámico).',
        ejemplos: ['Animal[] animales = {new Perro(), new Gato()}; todos pueden hacer sonido()']
      }
    ],
    ejemploBreve: 'Clase: Alumno { nombre, matricula, semestre } métodos: inscribirse(), calcularPromedio(). Objeto: alumno1 = Alumno("Ana", "A001", 4)',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Una clase define el comportamiento y el estado que tendrán sus objetos.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Una clase es efectivamente una plantilla que define tanto los atributos (estado) como los métodos (comportamiento) que tendrán los objetos creados a partir de ella.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El encapsulamiento consiste en hacer públicos todos los atributos para facilitar el acceso.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: false },
          { texto: 'Falso', esCorrecta: true }
        ],
        respuestaCorrecta: 'Falso',
        explicacion: 'El encapsulamiento busca ocultar el estado interno y exponer solo lo necesario a través de métodos controlados, no hacer todo público.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es la finalidad principal de la abstracción?',
        opciones: [
          { texto: 'Hacer el código más lento', esCorrecta: false },
          { texto: 'Ocultar detalles irrelevantes y mostrar lo esencial', esCorrecta: true },
          { texto: 'Aumentar el número de variables globales', esCorrecta: false },
          { texto: 'Forzar duplicación de código', esCorrecta: false }
        ],
        respuestaCorrecta: 'Ocultar detalles irrelevantes y mostrar lo esencial',
        explicacion: 'La abstracción permite centrarse en los aspectos esenciales de un objeto mientras oculta la complejidad innecesaria.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'El polimorfismo permite:',
        opciones: [
          { texto: 'Usar la misma interfaz para diferentes implementaciones', esCorrecta: true },
          { texto: 'Declarar sólo variables locales', esCorrecta: false },
          { texto: 'Evitar el uso de clases', esCorrecta: false },
          { texto: 'Compilar código más rápido', esCorrecta: false }
        ],
        respuestaCorrecta: 'Usar la misma interfaz para diferentes implementaciones',
        explicacion: 'El polimorfismo permite que objetos de diferentes clases respondan de manera específica a la misma interfaz o método.'
      }
    ],
    contenidoAdicional: 'Los pilares de la POO (abstracción, encapsulamiento, herencia y polimorfismo) trabajan juntos para crear código más mantenible, reutilizable y escalable.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 1,
    tema: 2,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'UML',
        definicion: 'Lenguaje Unificado de Modelado, estándar para modelar sistemas orientados a objetos; el diagrama de clases muestra clases, atributos, métodos y relaciones.',
        ejemplos: ['Diagrama que muestra clase Persona con atributos -nombre, +edad y método +caminar()']
      },
      {
        termino: 'Elementos del diagrama de clases',
        definicion: 'Nombre de la clase (parte superior), atributos (parte central) y métodos (parte inferior).',
        ejemplos: ['┌─────────┐', '│ Persona │ <- nombre', '├─────────┤', '│-nombre  │ <- atributos', '│+edad    │', '├─────────┤', '│+caminar()│ <- métodos', '└─────────┘']
      },
      {
        termino: 'Visibilidades',
        definicion: 'Símbolos que indican accesibilidad: + público, - privado, # protegido.',
        ejemplos: ['+public', '-private', '#protected']
      },
      {
        termino: 'Asociación',
        definicion: 'Vínculo entre dos clases (puede ser bidireccional o unidireccional).',
        ejemplos: ['Estudiante ——— Curso (estudiante toma curso)']
      },
      {
        termino: 'Agregación',
        definicion: 'Relación "tiene un" débil (parte independiente del todo).',
        ejemplos: ['Departamento ◇——— Empleado (empleado puede existir sin departamento)']
      },
      {
        termino: 'Composición',
        definicion: 'Relación "parte de" fuerte (vida del componente ligada al todo).',
        ejemplos: ['Casa ◆——— Habitación (habitación no existe sin casa)']
      },
      {
        termino: 'Herencia',
        definicion: 'Flecha con triángulo vacío hacia la clase base (generalización).',
        ejemplos: ['Empleado ———▷ Persona (empleado es una persona)']
      },
      {
        termino: 'Multiplicidad',
        definicion: 'Indica cuántas instancias de una clase se relacionan con otra (1, 0..*, 1..).',
        ejemplos: ['Curso 1 ——— * Estudiante (un curso, muchos estudiantes)']
      }
    ],
    ejemploBreve: 'Diagrama: Clase Curso (titulo, codigo) 1 — * Alumno (nombre, matricula): un curso tiene muchos alumnos.',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'En UML, el símbolo "-" antes de un atributo indica que es privado.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'En UML, el símbolo "-" indica visibilidad privada, "+" pública y "#" protegida.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'La composición indica una relación en la que el ciclo de vida de la parte depende del todo.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'En composición, si se destruye el objeto contenedor, también se destruyen sus partes componentes.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué flecha se usa para representar herencia en UML?',
        opciones: [
          { texto: 'Línea punteada con flecha vacía', esCorrecta: false },
          { texto: 'Flecha con triángulo vacío apuntando a la clase base', esCorrecta: true },
          { texto: 'Doble línea curva', esCorrecta: false },
          { texto: 'Rectángulo', esCorrecta: false }
        ],
        respuestaCorrecta: 'Flecha con triángulo vacío apuntando a la clase base',
        explicacion: 'La herencia se representa con una línea sólida terminada en un triángulo vacío que apunta hacia la superclase.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'La agregación difiere de la composición en que:',
        opciones: [
          { texto: 'La agregación es más fuerte que la composición', esCorrecta: false },
          { texto: 'La composición implica dependencia de ciclo de vida, la agregación no', esCorrecta: true },
          { texto: 'No hay diferencia', esCorrecta: false },
          { texto: 'La composición permite multiplicidad 0..*', esCorrecta: false }
        ],
        respuestaCorrecta: 'La composición implica dependencia de ciclo de vida, la agregación no',
        explicacion: 'En agregación, las partes pueden existir independientemente del todo; en composición, no.'
      }
    ],
    contenidoAdicional: 'Los diagramas UML son fundamentales para diseñar y comunicar la arquitectura de sistemas orientados a objetos antes de la implementación.',
    dificultad: 'MEDIA'
  },
  
  // UNIDAD 2: Clases y objetos
  {
    unidad: 2,
    tema: 1,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'Declaración de clase',
        definicion: 'Definir nombre, atributos (estado) y métodos (comportamiento). Atributos pueden tener visibilidad (público, privado, protegido).',
        ejemplos: ['class Persona { private String nombre; public void hablar() {...} }']
      },
      {
        termino: 'Métodos de instancia vs estáticos',
        definicion: 'Funciones asociadas a la clase; pueden ser de instancia (requieren objeto) o estáticos (pertenecen a la clase).',
        ejemplos: ['static int contarPersonas() vs void caminar()']
      },
      {
        termino: 'Encapsulamiento aplicado',
        definicion: 'Usar atributos privados y exponer acceso controlado mediante métodos públicos (get/set); validaciones dentro de setters.',
        ejemplos: ['private int edad; public void setEdad(int e) { if(e > 0) edad = e; }']
      },
      {
        termino: 'Propiedades calculadas',
        definicion: 'Atributos no almacenados sino devueltos por métodos (ej.: getEdad() calcula a partir de fechaNacimiento).',
        ejemplos: ['public int getEdad() { return calcularEdad(fechaNacimiento); }']
      }
    ],
    ejemploBreve: 'class CuentaBancaria { private double saldo; public void depositar(double monto) { if(monto > 0) saldo += monto; } }',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un método estático pertenece a la clase y no a una instancia específica.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Los métodos estáticos pertenecen a la clase y se pueden invocar sin crear una instancia.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un atributo privado se puede acceder directamente desde cualquier otra clase sin restricciones.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: false },
          { texto: 'Falso', esCorrecta: true }
        ],
        respuestaCorrecta: 'Falso',
        explicacion: 'Los atributos privados solo son accesibles dentro de la misma clase, no desde otras clases.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué visibilidad se usa para evitar acceso desde fuera de la clase?',
        opciones: [
          { texto: '+', esCorrecta: false },
          { texto: '-', esCorrecta: true },
          { texto: '#', esCorrecta: false },
          { texto: '$', esCorrecta: false }
        ],
        respuestaCorrecta: '-',
        explicacion: 'El símbolo "-" indica visibilidad privada, que impide el acceso desde fuera de la clase.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'El propósito de usar setters en vez de asignar directamente un atributo es:',
        opciones: [
          { texto: 'Aumentar la complejidad sin beneficio', esCorrecta: false },
          { texto: 'Aplicar validaciones y controlar cambios', esCorrecta: true },
          { texto: 'Hacer código más corto', esCorrecta: false },
          { texto: 'Evitar el uso de métodos', esCorrecta: false }
        ],
        respuestaCorrecta: 'Aplicar validaciones y controlar cambios',
        explicacion: 'Los setters permiten validar datos y controlar cómo se modifican los atributos, manteniendo la integridad del objeto.'
      }
    ],
    contenidoAdicional: 'La declaración correcta de clases con encapsulamiento es fundamental para crear código mantenible y seguro.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 2,
    tema: 2,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'Instancia/objeto',
        definicion: 'Creación de una entidad concreta a partir de una clase (operación: new Clase(...) en muchos lenguajes).',
        ejemplos: ['Persona p = new Persona("Juan", 25);']
      },
      {
        termino: 'Constructor',
        definicion: 'Método especial invocado al crear el objeto para inicializar atributos.',
        ejemplos: ['public Persona(String nombre) { this.nombre = nombre; }']
      },
      {
        termino: 'Memoria y referencia',
        definicion: 'La variable que guarda el objeto suele ser una referencia/puntero al lugar en memoria donde está el objeto.',
        ejemplos: ['Persona p1 = new Persona(); Persona p2 = p1; // ambas apuntan al mismo objeto']
      },
      {
        termino: 'Tiempo de vida',
        definicion: 'Cuándo se crea y cuándo se destruye (recolección de basura o destructor).',
        ejemplos: ['Objeto se crea con new, se destruye cuando no hay referencias (garbage collection)']
      }
    ],
    ejemploBreve: 'Libro libro1 = new Libro("1984", "Orwell"); Libro libro2 = new Libro("Cien años", "García Márquez");',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Instanciar una clase siempre ejecuta su constructor.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Al crear una instancia con new, siempre se ejecuta el constructor para inicializar el objeto.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Al instanciar un objeto, ¿qué se ejecuta normalmente?',
        opciones: [
          { texto: 'El destructor', esCorrecta: false },
          { texto: 'El constructor', esCorrecta: true },
          { texto: 'Un compilador', esCorrecta: false },
          { texto: 'Nada', esCorrecta: false }
        ],
        respuestaCorrecta: 'El constructor',
        explicacion: 'El constructor se ejecuta automáticamente al instanciar un objeto para inicializarlo.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'La variable que almacena el objeto suele contener:',
        opciones: [
          { texto: 'El objeto por valor', esCorrecta: false },
          { texto: 'Una referencia al objeto en memoria', esCorrecta: true },
          { texto: 'El constructor', esCorrecta: false },
          { texto: 'Un puntero nulo siempre', esCorrecta: false }
        ],
        respuestaCorrecta: 'Una referencia al objeto en memoria',
        explicacion: 'En la mayoría de lenguajes orientados a objetos, las variables contienen referencias a los objetos, no los objetos mismos.'
      }
    ],
    contenidoAdicional: 'La instanciación es el proceso fundamental para crear objetos concretos a partir de plantillas (clases).',
    dificultad: 'MEDIA'
  },
  {
    unidad: 2,
    tema: 3,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'this/self',
        definicion: 'Palabras reservadas como this (Java, C++, JavaScript) o self (Python) que dentro de métodos apuntan a la instancia sobre la cual se llamó el método.',
        ejemplos: ['public void setNombre(String nombre) { this.nombre = nombre; }']
      },
      {
        termino: 'Usos de this/self',
        definicion: 'Acceder a atributos/métodos de la instancia, distinguir variables locales de atributos, encadenamiento de métodos.',
        ejemplos: ['return this.setNombre(nombre).setEdad(edad); // encadenamiento']
      },
      {
        termino: 'Ambigüedad de nombres',
        definicion: 'Usar this/self explícito para claridad cuando hay ambigüedad en nombres entre parámetros y atributos.',
        ejemplos: ['void setEdad(int edad) { this.edad = edad; } // distingue parámetro de atributo']
      },
      {
        termino: 'Restricciones con métodos estáticos',
        definicion: 'En métodos estáticos no se puede usar this porque no hay instancia específica.',
        ejemplos: ['static void metodoEstatico() { // this.nombre; ERROR! }']
      }
    ],
    ejemploBreve: 'class Persona { private String nombre; public Persona setNombre(String nombre) { this.nombre = nombre; return this; } }',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'En un método estático no se puede usar this porque no hay instancia.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Los métodos estáticos pertenecen a la clase, no a una instancia específica, por lo que this no está disponible.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es un uso común de this/self?',
        opciones: [
          { texto: 'Llamar al constructor desde fuera de la clase', esCorrecta: false },
          { texto: 'Acceder a atributos de la instancia dentro de un método', esCorrecta: true },
          { texto: 'Compilar el programa', esCorrecta: false },
          { texto: 'Declarar variables globales', esCorrecta: false }
        ],
        respuestaCorrecta: 'Acceder a atributos de la instancia dentro de un método',
        explicacion: 'this/self se usa principalmente para referirse a los atributos y métodos de la instancia actual.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Si un parámetro del método tiene el mismo nombre que un atributo, usar this.param sirve para:',
        opciones: [
          { texto: 'Acceder al parámetro', esCorrecta: false },
          { texto: 'Acceder al atributo de la instancia', esCorrecta: true },
          { texto: 'Declarar un nuevo parámetro', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'Acceder al atributo de la instancia',
        explicacion: 'this.param accede al atributo de la instancia, mientras que param sin this accede al parámetro del método.'
      }
    ],
    contenidoAdicional: 'La referencia al objeto actual es esencial para distinguir entre variables locales y atributos de instancia.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 2,
    tema: 4,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'Declaración de métodos',
        definicion: 'Nombre, lista de parámetros, tipo de retorno (si aplica) y cuerpo del método.',
        ejemplos: ['public double calcular(int a, double b) { return a * b; }']
      },
      {
        termino: 'Mensajes',
        definicion: 'Llamar a un método en un objeto (obj.metodo(args)) es enviar un mensaje al objeto.',
        ejemplos: ['persona.caminar(); // enviar mensaje "caminar" a persona']
      },
      {
        termino: 'Paso de parámetros',
        definicion: 'Por valor o por referencia; parámetros opcionales y por defecto si el lenguaje lo permite.',
        ejemplos: ['void saludar(String nombre = "Usuario") { ... } // parámetro por defecto']
      },
      {
        termino: 'Valores de retorno',
        definicion: 'Métodos pueden devolver datos o no (procedimientos). Algunos lenguajes permiten múltiples valores de retorno.',
        ejemplos: ['int sumar(int a, int b) { return a + b; } vs void imprimir() { ... }']
      },
      {
        termino: 'Signatura del método',
        definicion: 'Combinación de nombre del método y tipos/orden de parámetros que lo identifica únicamente.',
        ejemplos: ['calcular(int, double) vs calcular(double, int) son signaturas diferentes']
      }
    ],
    ejemploBreve: 'public double calculaDescuento(double precio, double porcentaje) { return precio * (1 - porcentaje/100); }',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El envío de un mensaje a un objeto equivale a invocar uno de sus métodos.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'En POO, enviar un mensaje a un objeto significa llamar a uno de sus métodos.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué contiene la firma de un método?',
        opciones: [
          { texto: 'Nombre y parámetros (tipos/orden)', esCorrecta: true },
          { texto: 'Sólo el cuerpo del método', esCorrecta: false },
          { texto: 'El historial de ejecución', esCorrecta: false },
          { texto: 'El gestor de memoria', esCorrecta: false }
        ],
        respuestaCorrecta: 'Nombre y parámetros (tipos/orden)',
        explicacion: 'La signatura incluye el nombre del método y la lista de tipos de parámetros en orden.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Un método sin tipo de retorno explícito normalmente:',
        opciones: [
          { texto: 'Devuelve null', esCorrecta: false },
          { texto: 'Se considera procedimiento (no devuelve valor)', esCorrecta: true },
          { texto: 'Devuelve un entero por defecto', esCorrecta: false },
          { texto: 'No se puede declarar', esCorrecta: false }
        ],
        respuestaCorrecta: 'Se considera procedimiento (no devuelve valor)',
        explicacion: 'Los métodos sin tipo de retorno (void) son procedimientos que realizan acciones pero no retornan valores.'
      }
    ],
    contenidoAdicional: 'Los métodos son la interfaz principal para que los objetos interactúen entre sí mediante el envío de mensajes.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 2,
    tema: 5,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'Constructor',
        definicion: 'Método especial que inicializa la instancia; puede haber sobrecarga de constructores con distintos parámetros.',
        ejemplos: ['public Persona() {...} // constructor por defecto', 'public Persona(String nombre) {...} // con parámetros']
      },
      {
        termino: 'Destructores/finalizadores',
        definicion: 'Métodos llamados cuando el objeto se destruye (C++). En lenguajes con garbage collector existen finalizadores pero su uso es limitado.',
        ejemplos: ['~Persona() {...} // destructor C++', 'finalize() {...} // Java (obsoleto)']
      },
      {
        termino: 'Usos del constructor',
        definicion: 'Reservar recursos (memoria, archivos), inicializar estructuras internas, establecer invariantes del objeto.',
        ejemplos: ['public Archivo(String ruta) { this.file = new File(ruta); this.file.open(); }']
      },
      {
        termino: 'Buenas prácticas',
        definicion: 'Mantener constructor simple, liberar recursos con métodos explícitos (close(), dispose()) o patrones RAII/try-with-resources.',
        ejemplos: ['try (Archivo arch = new Archivo("datos.txt")) { arch.leer(); } // auto-close']
      }
    ],
    ejemploBreve: 'class Archivo { public Archivo(String ruta) { abrir(ruta); } public void close() { cerrar(); } }',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'En Java el destructor se controla manualmente por el programador.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: false },
          { texto: 'Falso', esCorrecta: true }
        ],
        respuestaCorrecta: 'Falso',
        explicacion: 'Java usa garbage collection automático. Los destructores no se controlan manualmente.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué se recomienda hacer en lugar de confiar en destructores en lenguajes con garbage collector?',
        opciones: [
          { texto: 'No liberar nada', esCorrecta: false },
          { texto: 'Usar métodos explícitos como close()/dispose() o bloques try-with-resources', esCorrecta: true },
          { texto: 'Forzar el garbage collector constantemente', esCorrecta: false },
          { texto: 'Usar destructores para sincronización', esCorrecta: false }
        ],
        respuestaCorrecta: 'Usar métodos explícitos como close()/dispose() o bloques try-with-resources',
        explicacion: 'Es mejor usar métodos explícitos para liberar recursos de forma determinística.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Un constructor sobrecargado permite:',
        opciones: [
          { texto: 'Tener múltiples constructores con distinta lista de parámetros', esCorrecta: true },
          { texto: 'Declarar variables sin tipo', esCorrecta: false },
          { texto: 'Evitar inicialización', esCorrecta: false },
          { texto: 'Cambiar el nombre de la clase', esCorrecta: false }
        ],
        respuestaCorrecta: 'Tener múltiples constructores con distinta lista de parámetros',
        explicacion: 'La sobrecarga de constructores permite crear objetos de diferentes formas según los parámetros proporcionados.'
      }
    ],
    contenidoAdicional: 'Los constructores y destructores manejan el ciclo de vida de los objetos, desde su creación hasta su destrucción.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 2,
    tema: 6,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'Sobrecarga (overloading)',
        definicion: 'Definir varios métodos con el mismo nombre pero distinta signatura (diferente número/tipo de parámetros). Facilita interfaces limpias y legibilidad.',
        ejemplos: ['void sumar(int a, int b)', 'void sumar(double a, double b)', 'void sumar(int[] numeros)']
      },
      {
        termino: 'Diferencia con sobrescritura',
        definicion: 'Sobrecarga es a nivel de una misma clase; sobrescritura (overriding) es redefinir un método heredado en clase derivada.',
        ejemplos: ['Sobrecarga: múltiples sumar() en Calculadora', 'Sobrescritura: redefinir hablar() en subclase Gato']
      },
      {
        termino: 'Resolución de sobrecarga',
        definicion: 'El compilador elige la versión correcta según los parámetros en la llamada (matching por tipos y cantidad).',
        ejemplos: ['calc.sumar(5, 3) → sumar(int, int)', 'calc.sumar(5.5, 3.2) → sumar(double, double)']
      },
      {
        termino: 'Ventajas de la sobrecarga',
        definicion: 'Permite usar el mismo nombre para operaciones conceptualmente similares, mejorando la consistencia de la API.',
        ejemplos: ['println(int), println(String), println(Object) - todas imprimen pero con tipos diferentes']
      }
    ],
    ejemploBreve: 'class Calculadora { int sumar(int a, int b) {...} double sumar(double a, double b) {...} int sumar(int[] arr) {...} }',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'La sobrecarga permite tener dos métodos con el mismo nombre y exactamente la misma signatura.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: false },
          { texto: 'Falso', esCorrecta: true }
        ],
        respuestaCorrecta: 'Falso',
        explicacion: 'La sobrecarga requiere diferentes signaturas (tipos o número de parámetros). Misma signatura sería un error.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'La sobrecarga mejora la legibilidad cuando las operaciones conceptualmente iguales aceptan distintos tipos de entrada.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'La sobrecarga permite usar nombres consistentes para operaciones similares con diferentes tipos, mejorando la legibilidad.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál de los siguientes es un ejemplo de sobrecarga válida?',
        opciones: [
          { texto: 'void sumar(int a, int b) y void sumar(double a, double b)', esCorrecta: true },
          { texto: 'void sumar(int a) y int sumar(int a)', esCorrecta: false },
          { texto: 'void x() y void x() (idénticas)', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'void sumar(int a, int b) y void sumar(double a, double b)',
        explicacion: 'Estos métodos tienen el mismo nombre pero diferentes tipos de parámetros, lo que constituye sobrecarga válida.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Al compilar, ¿cómo se distingue qué método sobrecargado invocar?',
        opciones: [
          { texto: 'Por la visibilidad del método', esCorrecta: false },
          { texto: 'Por la signatura (tipos/numero de parámetros)', esCorrecta: true },
          { texto: 'Por el nombre del archivo', esCorrecta: false },
          { texto: 'Por la fecha de creación', esCorrecta: false }
        ],
        respuestaCorrecta: 'Por la signatura (tipos/numero de parámetros)',
        explicacion: 'El compilador selecciona el método correcto basándose en la coincidencia de tipos y número de parámetros.'
      }
    ],
    contenidoAdicional: 'La sobrecarga de métodos es una forma de polimorfismo estático que se resuelve en tiempo de compilación.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 2,
    tema: 7,
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    conceptosClave: [
      {
        termino: 'Sobrecarga de operadores',
        definicion: 'Permitir que operadores (como +, -, ==) funcionen con objetos definiendo su comportamiento para tipos definidos por el usuario.',
        ejemplos: ['Vector3D a + Vector3D b // suma componente a componente', 'Fraccion f1 == Fraccion f2 // compara valores']
      },
      {
        termino: 'Operadores unarios',
        definicion: 'Actúan sobre un solo operando (ej.: ++, --, - unario, ! lógico).',
        ejemplos: ['-vector // negación', '++contador // incremento', '!bandera // negación lógica']
      },
      {
        termino: 'Operadores binarios',
        definicion: 'Actúan sobre dos operandos (ej.: +, -, *, /, ==, <, >).',
        ejemplos: ['matriz1 + matriz2', 'punto1 == punto2', 'fecha1 < fecha2']
      },
      {
        termino: 'Beneficios y riesgos',
        definicion: 'Beneficios: código más natural y legible. Riesgos: abuso puede causar confusión si no está bien documentado o es contra-intuitivo.',
        ejemplos: ['Bueno: string1 + string2 (concatenación)', 'Malo: fecha + persona (sin sentido semántico)']
      },
      {
        termino: 'Soporte por lenguaje',
        definicion: 'Soportado en C++, Python (métodos especiales __add__, etc.), no disponible en Java directamente.',
        ejemplos: ['C++: Vector operator+(const Vector& other)', 'Python: def __add__(self, other)']
      }
    ],
    ejemploBreve: 'class Vector2D { Vector2D operator+(Vector2D otro) { return Vector2D(x + otro.x, y + otro.y); } }',
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Sobrecargar operadores siempre está disponible en todos los lenguajes.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: false },
          { texto: 'Falso', esCorrecta: true }
        ],
        respuestaCorrecta: 'Falso',
        explicacion: 'No todos los lenguajes soportan sobrecarga de operadores. Por ejemplo, Java no la permite directamente.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Definir el operador + para concatenar objetos puede mejorar la legibilidad.',
        opciones: [
          { texto: 'Verdadero', esCorrecta: true },
          { texto: 'Falso', esCorrecta: false }
        ],
        respuestaCorrecta: 'Verdadero',
        explicacion: 'Cuando es semánticamente apropiado, sobrecargar + puede hacer el código más intuitivo y legible.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Un operador unario típicamente requiere:',
        opciones: [
          { texto: 'Dos operandos', esCorrecta: false },
          { texto: 'Un operando', esCorrecta: true },
          { texto: 'No puede ser definido por el usuario', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'Un operando',
        explicacion: 'Los operadores unarios, por definición, operan sobre un solo operando.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué riesgo implica la sobrecarga excesiva de operadores?',
        opciones: [
          { texto: 'Mejora inmediata del rendimiento', esCorrecta: false },
          { texto: 'Código menos claro si el comportamiento no es intuitivo', esCorrecta: true },
          { texto: 'Hace imposible compilar', esCorrecta: false },
          { texto: 'Evita el uso de clases', esCorrecta: false }
        ],
        respuestaCorrecta: 'Código menos claro si el comportamiento no es intuitivo',
        explicacion: 'El abuso de sobrecarga de operadores puede hacer el código confuso si los operadores no tienen un significado semántico claro.'
      }
    ],
    contenidoAdicional: 'La sobrecarga de operadores debe usarse con moderación y solo cuando el significado semántico sea claro e intuitivo.',
    dificultad: 'MEDIA'
  },
  // ======================= UNIDAD 3: HERENCIA =======================
  {
    unidad: 3,
    tema: 1,
    titulo: 'Definición: clase base, clase derivada',
    conceptosClave: [
      {
        termino: 'Clase base (superclase)',
        definicion: 'Definición genérica que contiene atributos y métodos compartidos que pueden ser heredados por otras clases.',
        ejemplos: [
          'class Animal { protected String nombre; public void comer() {...} }',
          'class Vehiculo { protected int velocidad; public void acelerar() {...} }'
        ]
      },
      {
        termino: 'Clase derivada (subclase)',
        definicion: 'Extiende la clase base, hereda miembros (atributos/métodos) y puede añadir o modificar comportamiento específico.',
        ejemplos: [
          'class Perro extends Animal { public void ladrar() {...} }',
          'class Coche extends Vehiculo { private int numPuertas; }'
        ]
      },
      {
        termino: 'Sintaxis de herencia',
        definicion: 'Forma típica de declarar herencia usando palabras clave como "extends" o ":" según el lenguaje de programación.',
        ejemplos: [
          'Java: class Subclase extends Superclase { ... }',
          'C++: class Subclase : public Superclase { ... }',
          'Python: class Subclase(Superclase): ...'
        ]
      },
      {
        termino: 'Relación "es un" (is-a)',
        definicion: 'Principio de herencia donde la subclase representa una especialización de la superclase, permitiendo polimorfismo.',
        ejemplos: [
          'Perro es un Animal',
          'Coche es un Vehículo',
          'Estudiante es una Persona'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Una subclase hereda todos los miembros (incluyendo privados) de la superclase de forma accesible.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Los miembros privados se heredan pero no son accesibles directamente desde la subclase, solo los públicos y protegidos son accesibles.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Herencia permite modelar relaciones de tipo "es un".',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'La herencia modela relaciones is-a donde la subclase es una especialización de la superclase.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es una ventaja de usar herencia?',
        opciones: [
          { texto: 'Aumentar duplicación de código', esCorrecta: false },
          { texto: 'Reutilización de comportamiento común', esCorrecta: true },
          { texto: 'Hacer más difícil la extensión', esCorrecta: false },
          { texto: 'Eliminar la modularidad', esCorrecta: false }
        ],
        respuestaCorrecta: 'Reutilización de comportamiento común',
        explicacion: 'La herencia permite reutilizar código común en la superclase, evitando duplicación.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Escribe una jerarquía simple con clase Animal (método hacerSonido) y dos subclases Perro y Gato que implementen hacerSonido. Muestra pseudocódigo.',
        respuestaSugerida: 'class Animal { public void hacerSonido() { print("Sonido genérico"); } } class Perro extends Animal { public void hacerSonido() { print("Guau"); } } class Gato extends Animal { public void hacerSonido() { print("Miau"); } }'
      }
    ],
    contenidoAdicional: 'La herencia es fundamental en POO para crear jerarquías de clases que modelan relaciones del mundo real. Permite reutilización de código y polimorfismo, pero debe usarse cuando existe una verdadera relación "es un".',
    dificultad: 'MEDIA'
  },
  {
    unidad: 3,
    tema: 2,
    titulo: 'Clasificación: herencia simple, herencia múltiple',
    conceptosClave: [
      {
        termino: 'Herencia simple',
        definicion: 'Una clase deriva de una única clase base, permitiendo una jerarquía lineal y clara de herencia.',
        ejemplos: [
          'class B extends A',
          'class Empleado extends Persona',
          'class Rectangulo extends Figura'
        ]
      },
      {
        termino: 'Herencia múltiple',
        definicion: 'Una clase puede derivar de múltiples clases base simultáneamente, soportada en C++ pero no directamente en Java.',
        ejemplos: [
          'C++: class C : public A, public B',
          'Python: class C(A, B)',
          'Java usa interfaces para simular: class C extends A implements InterfaceB'
        ]
      },
      {
        termino: 'Problema del diamante',
        definicion: 'Ambigüedad que surge en herencia múltiple cuando múltiples rutas heredan de la misma clase base, causando conflictos de nombres.',
        ejemplos: [
          'A → B, A → C, B y C → D: ¿qué método de A usa D?',
          'Resolución con virtual inheritance en C++',
          'Java evita esto con interfaces'
        ]
      },
      {
        termino: 'Alternativas a herencia múltiple',
        definicion: 'Técnicas como composición e interfaces que proporcionan flexibilidad sin los problemas de herencia múltiple.',
        ejemplos: [
          'Composición: class C { A objetoA; B objetoB; }',
          'Interfaces: class C implements InterfaceA, InterfaceB',
          'Mixins en algunos lenguajes'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Java soporta herencia múltiple directa de clases.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Java solo permite herencia simple de clases, pero soporta implementación múltiple de interfaces.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El problema del diamante aparece por la herencia múltiple cuando múltiples rutas heredan de la misma clase base.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Cuando hay múltiples caminos de herencia desde una misma clase base, puede haber ambigüedad sobre qué implementación usar.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué técnica es preferible si la herencia múltiple complica el diseño?',
        opciones: [
          { texto: 'Usar composición', esCorrecta: true },
          { texto: 'Duplicar código', esCorrecta: false },
          { texto: 'Eliminar la clase base', esCorrecta: false },
          { texto: 'Añadir más herencias', esCorrecta: false }
        ],
        respuestaCorrecta: 'Usar composición',
        explicacion: 'La composición ofrece flexibilidad sin los problemas de ambigüedad de la herencia múltiple.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Da un ejemplo donde la herencia múltiple sea útil y explica cómo evitar el problema del diamante.',
        respuestaSugerida: 'class AnfibioCoche extends Vehiculo, BarcoMotor - útil para un vehículo anfibio. Para evitar el diamante: usar interfaces o composición, definir claramente qué implementación usar mediante resolución explícita.'
      }
    ],
    contenidoAdicional: 'La herencia múltiple puede ser poderosa pero compleja. La mayoría de lenguajes modernos prefieren herencia simple + interfaces para mantener claridad y evitar ambigüedades.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 3,
    tema: 3,
    titulo: 'Reutilización de miembros heredados',
    conceptosClave: [
      {
        termino: 'Reutilización de miembros',
        definicion: 'Una subclase usa métodos y atributos definidos en la superclase sin necesidad de reescribirlos, promoviendo eficiencia.',
        ejemplos: [
          'Heredar método toString() de Object',
          'Usar atributos protected de la superclase',
          'Invocar métodos públicos heredados'
        ]
      },
      {
        termino: 'Extensión de funcionalidad',
        definicion: 'La subclase puede añadir nuevos miembros o extender el comportamiento de funciones heredadas manteniendo la funcionalidad base.',
        ejemplos: [
          'Añadir métodos específicos en la subclase',
          'Sobrescribir métodos pero llamar a super()',
          'Agregar nuevos atributos específicos'
        ]
      },
      {
        termino: 'Palabra clave super',
        definicion: 'Referencia explícita a la superclase que permite invocar constructores, métodos y acceder a miembros de la clase padre.',
        ejemplos: [
          'super() en constructor',
          'super.metodo() para llamar implementación padre',
          'super.atributo para acceder a miembro heredado'
        ]
      },
      {
        termino: 'Llamadas a métodos base',
        definicion: 'Mecanismo para invocar la implementación de la superclase desde la subclase, útil para extender sin duplicar código.',
        ejemplos: [
          'super.inicializar() luego código específico',
          'super.procesar() + procesamiento adicional',
          'Cadena de llamadas en jerarquías profundas'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Llamar a super() en un constructor de subclase inicializa la parte heredada del objeto.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'super() invoca el constructor de la superclase, asegurando que la parte heredada del objeto se inicialice correctamente.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cómo se suele invocar un método de la clase base desde la subclase?',
        opciones: [
          { texto: 'this.super()', esCorrecta: false },
          { texto: 'super.metodo()', esCorrecta: true },
          { texto: 'base.metodo()', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'super.metodo()',
        explicacion: 'super.metodo() es la sintaxis estándar para invocar un método de la superclase.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'En pseudocódigo, muestra una subclase que sobrescribe un método heredado pero invoca el método de la superclase mediante super.',
        respuestaSugerida: 'class Empleado extends Persona { public void presentarse() { super.presentarse(); // llama método de Persona print("Soy empleado de " + empresa); } }'
      }
    ],
    contenidoAdicional: 'La reutilización efectiva de miembros heredados es clave para mantener código DRY (Don\'t Repeat Yourself) y facilitar el mantenimiento de jerarquías de clases.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 3,
    tema: 4,
    titulo: 'Referencia al objeto de la clase base',
    conceptosClave: [
      {
        termino: 'Referencia super',
        definicion: 'Palabra clave que permite referenciar a la parte de la superclase desde la subclase para invocar constructores, métodos y acceder a miembros.',
        ejemplos: [
          'super() para constructor base',
          'super.metodo() para método heredado',
          'super.atributo para miembro protegido'
        ]
      },
      {
        termino: 'Invocación de constructores base',
        definicion: 'Mecanismo para llamar al constructor de la superclase desde el constructor de la subclase, esencial para inicialización correcta.',
        ejemplos: [
          'super(parametros) como primera línea',
          'Pasar argumentos al constructor padre',
          'Inicialización en cadena de jerarquías'
        ]
      },
      {
        termino: 'Acceso a miembros protegidos',
        definicion: 'Capacidad de la subclase para acceder a miembros protegidos de la superclase usando super, facilitando extensión controlada.',
        ejemplos: [
          'super.atributoProtegido',
          'Modificar estado heredado',
          'Acceso desde métodos de la subclase'
        ]
      },
      {
        termino: 'Extensión de comportamiento',
        definicion: 'Uso de super para aprovechar funcionalidad existente en la superclase mientras se añade comportamiento específico en la subclase.',
        ejemplos: [
          'super.procesar() + lógica adicional',
          'Reutilizar validaciones base',
          'Mantener consistencia con comportamiento padre'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'super() sólo puede usarse en el constructor de la subclase.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'super() se usa típicamente en constructores, pero super.metodo() puede usarse en cualquier método para invocar implementaciones de la superclase.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'super.metodo() invoca la implementación de la superclase incluso si la subclase la ha sobrescrito.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'super.metodo() específicamente invoca la versión de la superclase, ignorando cualquier sobrescritura en la subclase actual.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Para qué se utiliza super() en una subclase?',
        opciones: [
          { texto: 'Invocar constructor de la superclase', esCorrecta: true },
          { texto: 'Crear una nueva superclase', esCorrecta: false },
          { texto: 'Borrar la superclase', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'Invocar constructor de la superclase',
        explicacion: 'super() se utiliza para invocar el constructor de la superclase, inicializando la parte heredada del objeto.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Escribe pseudocódigo donde una subclase llama al constructor base con parámetros y luego añade inicialización propia.',
        respuestaSugerida: 'class Empleado extends Persona { private String puesto; public Empleado(String nombre, int edad, String puesto) { super(nombre, edad); // llama constructor de Persona this.puesto = puesto; // inicialización específica } }'
      }
    ],
    contenidoAdicional: 'El uso correcto de super es fundamental para mantener la integridad de la jerarquía de herencia y asegurar que todas las partes del objeto se inicialicen correctamente.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 3,
    tema: 5,
    titulo: 'Constructores y destructores en clases derivadas',
    conceptosClave: [
      {
        termino: 'Orden de construcción',
        definicion: 'El constructor de la superclase se invoca antes del constructor de la subclase para asegurar inicialización correcta del objeto completo.',
        ejemplos: [
          'Superclase → Subclase → Subsubclase',
          'super() debe ser primera línea en constructor',
          'Inicialización en cadena ascendente'
        ]
      },
      {
        termino: 'Orden de destrucción',
        definicion: 'En lenguajes con destructores explícitos, se ejecutan en orden inverso: subclase antes que superclase para liberar recursos correctamente.',
        ejemplos: [
          'C++: ~Subclase() luego ~Superclase()',
          'Liberación de recursos específicos primero',
          'Orden inverso al de construcción'
        ]
      },
      {
        termino: 'Constructor base obligatorio',
        definicion: 'Cuando la superclase no tiene constructor por defecto, la subclase debe invocar explícitamente un constructor de la superclase con parámetros.',
        ejemplos: [
          'super(parametros) obligatorio',
          'Error de compilación sin super()',
          'Pasar argumentos necesarios al padre'
        ]
      },
      {
        termino: 'Inicialización correcta',
        definicion: 'Asegurar que todas las partes del objeto (heredadas y propias) se inicialicen en el orden correcto para evitar estados inconsistentes.',
        ejemplos: [
          'Atributos padre antes que hijo',
          'Validaciones en constructor base',
          'Estado consistente en toda la jerarquía'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Si la superclase no tiene constructor por defecto, la subclase debe invocar explícitamente un constructor de la superclase.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Sin constructor por defecto en la superclase, el compilador no puede invocar automáticamente super(), por lo que debe hacerse explícitamente.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El orden de destrucción siempre es el inverso al de construcción.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Para liberar recursos correctamente, los destructores se ejecutan en orden inverso: primero la subclase, luego la superclase.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué sucede si no invocas el constructor de la superclase cuando es obligatorio?',
        opciones: [
          { texto: 'El programa compilará sin problemas', esCorrecta: false },
          { texto: 'Podría fallar la compilación o ejecución por falta de inicialización', esCorrecta: true },
          { texto: 'Se crea un constructor por defecto automáticamente sin consecuencias', esCorrecta: false },
          { texto: 'Nada', esCorrecta: false }
        ],
        respuestaCorrecta: 'Podría fallar la compilación o ejecución por falta de inicialización',
        explicacion: 'Sin la invocación obligatoria del constructor base, el compilador generará error o el objeto no se inicializará correctamente.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Muestra pseudocódigo con una clase base Persona(nombre) y una subclase Empleado(nombre, salario) que invoca el constructor base.',
        respuestaSugerida: 'class Persona { String nombre; Persona(String n) { nombre = n; } } class Empleado extends Persona { double salario; Empleado(String n, double s) { super(n); salario = s; } }'
      }
    ],
    contenidoAdicional: 'El manejo correcto de constructores y destructores en herencia es crucial para la gestión de recursos y la integridad del objeto a lo largo de su ciclo de vida.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 3,
    tema: 6,
    titulo: 'Redefinición de métodos en clases derivadas (overriding)',
    conceptosClave: [
      {
        termino: 'Sobrescritura (overriding)',
        definicion: 'Una subclase proporciona su propia implementación para un método declarado en la superclase con la misma firma, reemplazando el comportamiento heredado.',
        ejemplos: [
          '@Override public void metodo()',
          'Misma firma: nombre, parámetros, tipo retorno',
          'Implementación específica en subclase'
        ]
      },
      {
        termino: 'Polimorfismo dinámico',
        definicion: 'Las llamadas a métodos se resuelven en tiempo de ejecución según el tipo real del objeto, no el tipo de la referencia (binding dinámico).',
        ejemplos: [
          'Animal a = new Perro(); a.hacerSonido(); // ejecuta versión de Perro',
          'Resolución en runtime',
          'Virtual method table'
        ]
      },
      {
        termino: 'Binding dinámico',
        definicion: 'Mecanismo por el cual la implementación correcta del método se selecciona durante la ejecución basándose en el tipo real del objeto.',
        ejemplos: [
          'Late binding vs early binding',
          'Virtual functions en C++',
          'Resolución automática en Java'
        ]
      },
      {
        termino: 'Anotación @Override',
        definicion: 'Marcador en Java que indica intención de sobrescribir un método, proporcionando verificación en tiempo de compilación y claridad en el código.',
        ejemplos: [
          '@Override public String toString()',
          'Verificación de firma correcta',
          'Documentación de intención'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Overriding solo es posible si la firma del método coincide exactamente.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Para sobrescribir un método, la firma (nombre, parámetros y tipo de retorno) debe coincidir exactamente con la del método en la superclase.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Overriding impide usar la implementación de la superclase por completo.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Aunque se sobrescribe el método, aún se puede acceder a la implementación de la superclase usando super.metodo().'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué característica permite que un objeto de tipo Super referencie a una instancia de Sub y ejecute el método sobrescrito de Sub?',
        opciones: [
          { texto: 'Composición', esCorrecta: false },
          { texto: 'Polimorfismo dinámico', esCorrecta: true },
          { texto: 'Encapsulamiento', esCorrecta: false },
          { texto: 'Herencia múltiple', esCorrecta: false }
        ],
        respuestaCorrecta: 'Polimorfismo dinámico',
        explicacion: 'El polimorfismo dinámico permite que la referencia de superclase ejecute la implementación sobrescrita de la subclase en runtime.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Da un ejemplo de clase Animal con método mover(), y subclase Pez que sobrescribe mover() para nadar; muestra cómo el polimorfismo selecciona la implementación correcta.',
        respuestaSugerida: 'class Animal { void mover() { print("se mueve"); } } class Pez extends Animal { @Override void mover() { print("nada"); } } Animal a = new Pez(); a.mover(); // imprime "nada" por polimorfismo dinámico'
      }
    ],
    contenidoAdicional: 'La sobrescritura de métodos es la base del polimorfismo en POO, permitiendo que objetos de diferentes tipos respondan de manera específica al mismo mensaje, manteniendo una interfaz uniforme.',
    dificultad: 'MEDIA'
  },
  // ======================= UNIDAD 4: POLIMORFISMO =======================
  {
    unidad: 4,
    tema: 1,
    titulo: 'Definición',
    conceptosClave: [
      {
        termino: 'Polimorfismo',
        definicion: '"Muchas formas". Permite que una operación (método) actúe de manera distinta según el tipo del objeto que la recibe.',
        ejemplos: [
          'Animal a = new Perro(); a.hacerSonido(); // "Guau"',
          'Animal b = new Gato(); b.hacerSonido(); // "Miau"',
          'Misma llamada, diferentes comportamientos'
        ]
      },
      {
        termino: 'Tipos de polimorfismo',
        definicion: 'Polimorfismo por subtipo (dinámico), por sobrecarga (estático), y paramétrico (genéricos/templates).',
        ejemplos: [
          'Subtipo: Animal → Perro, Gato (runtime)',
          'Sobrecarga: metodo(int) vs metodo(String) (compile time)',
          'Paramétrico: List<T>, Array<T> (generics)'
        ]
      },
      {
        termino: 'Polimorfismo dinámico',
        definicion: 'La implementación del método se selecciona en tiempo de ejecución basándose en el tipo real del objeto.',
        ejemplos: [
          'Virtual method dispatch',
          'Late binding vs early binding',
          'Resolución en runtime según tipo concreto'
        ]
      },
      {
        termino: 'Beneficios del polimorfismo',
        definicion: 'Código más flexible y extensible; permite escribir algoritmos que trabajan con interfaces o clases base.',
        ejemplos: [
          'Menos código tipo-específico',
          'Extensibilidad sin modificar código existente',
          'Algoritmos genéricos que funcionan con múltiples tipos'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El polimorfismo reduce la necesidad de comprobar el tipo concreto en el código (instanceof).',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'El polimorfismo permite tratar objetos de diferentes tipos uniformemente, evitando verificaciones explícitas de tipo.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'La sobrecarga es un tipo de polimorfismo en tiempo de compilación.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'La sobrecarga de métodos se resuelve en tiempo de compilación basándose en los tipos de parámetros (polimorfismo estático).'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué permite el polimorfismo por subtipo?',
        opciones: [
          { texto: 'Ejecutar siempre la misma implementación', esCorrecta: false },
          { texto: 'Tratar objetos de distintas subclases a través de la referencia de una superclase', esCorrecta: true },
          { texto: 'Evitar el uso de interfaces', esCorrecta: false },
          { texto: 'Reemplazar la herencia', esCorrecta: false }
        ],
        respuestaCorrecta: 'Tratar objetos de distintas subclases a través de la referencia de una superclase',
        explicacion: 'El polimorfismo por subtipo permite usar una referencia de superclase para trabajar con objetos de diferentes subclases.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Escribe pseudocódigo que muestre una función procesar(Animal a) que llame a a.hacerSonido(); demuestra cómo distintas subclases producen distintos sonidos.',
        respuestaSugerida: 'function procesar(Animal a) { a.hacerSonido(); } // Uso: procesar(new Perro()); // imprime "Guau" procesar(new Gato()); // imprime "Miau" procesar(new Vaca()); // imprime "Muu"'
      }
    ],
    contenidoAdicional: 'El polimorfismo es uno de los pilares fundamentales de la POO que permite crear código más flexible, extensible y mantenible mediante el uso de interfaces comunes.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 4,
    tema: 2,
    titulo: 'Clases abstractas: definición, métodos abstractos, implementación de clases abstractas, modelado de clases abstractas',
    conceptosClave: [
      {
        termino: 'Clase abstracta',
        definicion: 'Clase que no se instancia directamente y que puede contener métodos abstractos y concretos. Sirve como plantilla parcial.',
        ejemplos: [
          'abstract class Figura { abstract double area(); void mostrar() {...} }',
          'No se puede hacer: new Figura()',
          'Puede tener constructores para subclases'
        ]
      },
      {
        termino: 'Método abstracto',
        definicion: 'Declaración sin implementación que obliga a subclases concretas a implementar dicho método.',
        ejemplos: [
          'abstract double calcular();',
          'abstract void procesar(String datos);',
          'Sin cuerpo, solo firma del método'
        ]
      },
      {
        termino: 'Implementación obligatoria',
        definicion: 'Las subclases concretas deben implementar todos los métodos abstractos de la superclase.',
        ejemplos: [
          'class Circulo extends Figura { double area() { return Math.PI * radio * radio; } }',
          'Compilador verifica implementación completa',
          'Subclase abstracta puede no implementar todos'
        ]
      },
      {
        termino: 'Plantilla parcial',
        definicion: 'Clase abstracta define comportamiento común y fuerza contrato mínimo para subclases.',
        ejemplos: [
          'Comportamiento común en métodos concretos',
          'Contrato específico en métodos abstractos',
          'Combinación de implementación y especificación'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Una clase abstracta puede tener métodos con implementación.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Las clases abstractas pueden combinar métodos abstractos (sin implementación) con métodos concretos (con implementación).'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'No se puede declarar una variable cuyo tipo sea una clase abstracta.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Se puede declarar una variable de tipo clase abstracta, pero no se puede instanciar directamente. La variable puede referenciar objetos de subclases concretas.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Por qué usamos clases abstractas?',
        opciones: [
          { texto: 'Para impedir herencia', esCorrecta: false },
          { texto: 'Para definir una interfaz parcial que las subclases deben completar', esCorrecta: true },
          { texto: 'Para evitar probar código', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'Para definir una interfaz parcial que las subclases deben completar',
        explicacion: 'Las clases abstractas proporcionan una plantilla parcial con implementación común y contratos que las subclases deben cumplir.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Diseña una clase abstracta "Figura" con método abstracto area() y subclases Circulo y Rectangulo que implementen area(). Muestra pseudocódigo.',
        respuestaSugerida: 'abstract class Figura { abstract double area(); void mostrarInfo() { print("Área: " + area()); } } class Circulo extends Figura { double radio; double area() { return 3.14 * radio * radio; } } class Rectangulo extends Figura { double ancho, alto; double area() { return ancho * alto; } }'
      }
    ],
    contenidoAdicional: 'Las clases abstractas proporcionan un equilibrio entre interfaces puras y clases concretas, permitiendo compartir implementación común mientras se fuerza un contrato específico.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 4,
    tema: 3,
    titulo: 'Interfaces: definición, implementación de interfaces, herencia de interfaces',
    conceptosClave: [
      {
        termino: 'Interfaz',
        definicion: 'Contrato que especifica métodos que una clase debe implementar; tradicionalmente no define estado. Permite comportamientos compartidos por clases no relacionadas.',
        ejemplos: [
          'interface Drawable { void draw(); void resize(int factor); }',
          'interface Comparable<T> { int compareTo(T other); }',
          'Solo especificación, no implementación (tradicionalmente)'
        ]
      },
      {
        termino: 'Implementación de interfaces',
        definicion: 'Una clase "implementa" una interfaz y provee código para todos sus métodos declarados.',
        ejemplos: [
          'class Circle implements Drawable { void draw() {...} void resize(int f) {...} }',
          'class Button implements Drawable { void draw() {...} void resize(int f) {...} }',
          'Diferentes clases, mismo contrato'
        ]
      },
      {
        termino: 'Herencia de interfaces',
        definicion: 'Una interfaz puede extender otra interfaz, heredando sus métodos y añadiendo nuevos.',
        ejemplos: [
          'interface Shape3D extends Drawable { double volume(); }',
          'interface MovableDrawable extends Drawable { void move(int x, int y); }',
          'Jerarquías de contratos'
        ]
      },
      {
        termino: 'Desacoplamiento',
        definicion: 'Las interfaces permiten desacoplar el código del tipo concreto, facilitando flexibilidad y testing.',
        ejemplos: [
          'function process(Drawable d) { d.draw(); } // funciona con cualquier implementación',
          'Dependency injection mediante interfaces',
          'Mock objects para testing'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Una interfaz puede contener implementación por defecto en todos los lenguajes.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'No todos los lenguajes soportan métodos por defecto en interfaces. Java 8+ los soporta, pero lenguajes más antiguos no.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Implementar una interfaz obliga a escribir todos sus métodos en la clase.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Una clase debe implementar todos los métodos declarados en la interfaz, a menos que la clase sea abstracta.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es una ventaja de usar interfaces?',
        opciones: [
          { texto: 'Permiten múltiples comportamientos sin herencia múltiple de clases', esCorrecta: true },
          { texto: 'Obligan a usar variables globales', esCorrecta: false },
          { texto: 'Evitan la reutilización de código', esCorrecta: false },
          { texto: 'Reducen la claridad', esCorrecta: false }
        ],
        respuestaCorrecta: 'Permiten múltiples comportamientos sin herencia múltiple de clases',
        explicacion: 'Las interfaces permiten que una clase implemente múltiples contratos sin los problemas de la herencia múltiple.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Define una interfaz "Persistible" con métodos guardar() y cargar(); muestra una clase "Usuario" que la implementa y guarda datos en disco (pseudocódigo).',
        respuestaSugerida: 'interface Persistible { void guardar(); void cargar(); } class Usuario implements Persistible { String nombre, email; void guardar() { writeToFile("usuario.dat", nombre + "," + email); } void cargar() { String data = readFromFile("usuario.dat"); String[] parts = data.split(","); nombre = parts[0]; email = parts[1]; } }'
      }
    ],
    contenidoAdicional: 'Las interfaces son fundamentales para el diseño flexible y testeable, permitiendo programar contra contratos en lugar de implementaciones concretas.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 4,
    tema: 4,
    titulo: 'Variables polimórficas (plantillas): definición, uso y aplicaciones',
    conceptosClave: [
      {
        termino: 'Variables polimórficas',
        definicion: 'Variables declaradas con tipo de superclase o interfaz que pueden referir a instancias de subclases concretas.',
        ejemplos: [
          'Animal animal = new Perro(); // variable polimórfica',
          'List<String> lista = new ArrayList<>(); // implementación específica',
          'Drawable objeto = new Circle(); // interfaz → implementación'
        ]
      },
      {
        termino: 'Plantillas/Genéricos',
        definicion: 'Permiten definir clases/funciones parametrizadas por tipos para reutilizar código fuertemente tipado.',
        ejemplos: [
          'List<T>, Array<T>, Map<K,V>',
          'class Stack<T> { T[] items; T pop() {...} void push(T item) {...} }',
          'function<T> T max(T a, T b) { return a > b ? a : b; }'
        ]
      },
      {
        termino: 'Seguridad de tipos',
        definicion: 'Los genéricos proporcionan verificación de tipos en tiempo de compilación, eliminando conversiones inseguras.',
        ejemplos: [
          'List<String> vs List (raw type)',
          'No necesidad de casting: String s = lista.get(0)',
          'Errores de tipo detectados en compilación'
        ]
      },
      {
        termino: 'Colecciones homogéneas',
        definicion: 'Estructuras de datos que contienen elementos del mismo tipo o interfaz común, facilitando operaciones uniformes.',
        ejemplos: [
          'List<Figura> figuras = Arrays.asList(new Circulo(), new Rectangulo())',
          'for (Figura f : figuras) f.dibujar();',
          'Stream<Empleado> empleados.filter(e -> e.getSalario() > 1000)'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Una variable declarada como Super clase puede referir a un objeto de Subclase.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'El polimorfismo permite que una variable de tipo superclase referencie cualquier objeto de sus subclases (principio de sustitución).'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Generics eliminan la necesidad de conversiones (casts) en colecciones tipadas.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Los genéricos proporcionan seguridad de tipos en tiempo de compilación, eliminando la necesidad de casts explícitos al extraer elementos.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué ventaja dan los generics?',
        opciones: [
          { texto: 'Más conversiones en tiempo de ejecución', esCorrecta: false },
          { texto: 'Seguridad de tipos en tiempo de compilación', esCorrecta: true },
          { texto: 'Impiden la reutilización', esCorrecta: false },
          { texto: 'Requieren herencia múltiple', esCorrecta: false }
        ],
        respuestaCorrecta: 'Seguridad de tipos en tiempo de compilación',
        explicacion: 'Los genéricos verifican tipos en compilación, detectando errores temprano y eliminando casts inseguros.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Escribe pseudocódigo de una función genérica swap<T>(a:T, b:T) que intercambie dos valores (describe restricciones si aplican).',
        respuestaSugerida: 'function<T> void swap(ref T a, ref T b) { T temp = a; a = b; b = temp; } // Restricción: T debe ser copiable. Uso: swap<int>(x, y); swap<String>(s1, s2);'
      }
    ],
    contenidoAdicional: 'Las variables polimórficas y los genéricos permiten escribir código reutilizable y type-safe, combinando flexibilidad con seguridad de tipos.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 4,
    tema: 5,
    titulo: 'Reutilización de código',
    conceptosClave: [
      {
        termino: 'Mecanismos de reutilización',
        definicion: 'Herencia, composición, módulos y librerías son diferentes estrategias para reutilizar código eficientemente.',
        ejemplos: [
          'Herencia: class Manager extends Employee',
          'Composición: class Car { Engine engine; }',
          'Módulos: import utils; librerías: include <vector>'
        ]
      },
      {
        termino: 'Composición vs Herencia',
        definicion: 'Preferir composición sobre herencia cuando la relación es de uso ("tiene un") más que de tipo ("es un").',
        ejemplos: [
          'Car HAS-A Engine (composición) vs Car IS-A Vehicle (herencia)',
          'class Printer { Cartridge cartridge; } vs class LaserPrinter extends Printer',
          'Composición ofrece más flexibilidad'
        ]
      },
      {
        termino: 'Principios SOLID',
        definicion: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
        ejemplos: [
          'SRP: Una clase, una responsabilidad',
          'OCP: Abierto para extensión, cerrado para modificación',
          'LSP: Subclases deben ser sustituibles por su superclase'
        ]
      },
      {
        termino: 'Principio de sustitución de Liskov',
        definicion: 'Los objetos de subclases deben poder reemplazar objetos de la superclase sin alterar el comportamiento del programa.',
        ejemplos: [
          'Si S es subtipo de T, objetos de T pueden ser reemplazados por objetos de S',
          'Precondiciones no más fuertes, postcondiciones no más débiles',
          'Fundamental para polimorfismo seguro'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'La composición facilita la reutilización evitando problemas de jerarquía.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'La composición evita problemas como jerarquías profundas, herencia múltiple y acoplamiento fuerte inherente a la herencia.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El principio de sustitución de Liskov permite reemplazar una clase base por una derivada sin romper el sistema.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'LSP garantiza que las subclases mantengan el contrato de la superclase, permitiendo sustitución segura.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es un motivo para preferir composición sobre herencia?',
        opciones: [
          { texto: 'Cuando se necesita compartir comportamiento sin implicar relación "es un"', esCorrecta: true },
          { texto: 'Para duplicar código', esCorrecta: false },
          { texto: 'Para evitar pruebas unitarias', esCorrecta: false },
          { texto: 'Ninguno', esCorrecta: false }
        ],
        respuestaCorrecta: 'Cuando se necesita compartir comportamiento sin implicar relación "es un"',
        explicacion: 'La composición es preferible cuando queremos reutilizar funcionalidad sin establecer una relación de tipo "es un".'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Da un ejemplo en pseudocódigo donde uses composición para reutilizar funcionalidad (p. ej., Motor dentro de Automovil).',
        respuestaSugerida: 'class Motor { void encender() {...} void apagar() {...} int getPotencia() {...} } class Automovil { Motor motor; Transmision transmision; void acelerar() { motor.encender(); transmision.cambiarVelocidad(); } } // Reutilización: el mismo Motor puede usarse en Automovil, Motocicleta, Barco'
      }
    ],
    contenidoAdicional: 'La reutilización efectiva de código requiere equilibrar herencia y composición, aplicando principios de diseño que promuevan flexibilidad y mantenibilidad.',
    dificultad: 'MEDIA'
  },
  // ======================= UNIDAD 5: EXCEPCIONES =======================
  {
    unidad: 5,
    tema: 1,
    titulo: 'Definición',
    conceptosClave: [
      {
        termino: 'Excepción',
        definicion: 'Evento inesperado o condición anómala que interrumpe el flujo normal de ejecución del programa.',
        ejemplos: [
          'División por cero: 10 / 0',
          'Acceso a índice fuera de rango: array[10] cuando size = 5',
          'Referencia nula: objeto.metodo() cuando objeto es null'
        ]
      },
      {
        termino: 'Manejo de excepciones',
        definicion: 'Mecanismo para detectar, capturar y responder a errores sin terminar abruptamente la aplicación.',
        ejemplos: [
          'try-catch para capturar errores',
          'Mensajes de error controlados al usuario',
          'Recuperación graceful de errores'
        ]
      },
      {
        termino: 'Flujo de control',
        definicion: 'Las excepciones alteran el flujo normal de ejecución, saltando desde el punto de error hasta el manejador más cercano.',
        ejemplos: [
          'Interrupción inmediata de la función actual',
          'Búsqueda de manejador en la pila de llamadas',
          'Continuación desde el bloque catch correspondiente'
        ]
      },
      {
        termino: 'Robustez del software',
        definicion: 'El manejo adecuado de excepciones mejora la estabilidad y confiabilidad del programa ante condiciones inesperadas.',
        ejemplos: [
          'Prevención de crashes inesperados',
          'Recuperación automática de errores',
          'Experiencia de usuario más fluida'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Las excepciones sólo existen en lenguajes interpretados.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Las excepciones existen tanto en lenguajes compilados (Java, C++, C#) como interpretados (Python, JavaScript).'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Manejar excepciones permite ofrecer mensajes de error controlados al usuario.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'El manejo de excepciones permite capturar errores y mostrar mensajes amigables en lugar de terminar abruptamente.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué es una excepción?',
        opciones: [
          { texto: 'Un requerimiento del compilador', esCorrecta: false },
          { texto: 'Un mecanismo para tratar condiciones de error en tiempo de ejecución', esCorrecta: true },
          { texto: 'Un tipo de variable', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'Un mecanismo para tratar condiciones de error en tiempo de ejecución',
        explicacion: 'Las excepciones son el mecanismo estándar para manejar condiciones de error que ocurren durante la ejecución.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Explica la diferencia entre un error y una excepción.',
        respuestaSugerida: 'Un error es una condición que impide la ejecución correcta (ej: error de sintaxis, falta de memoria). Una excepción es un evento durante la ejecución que puede ser manejado y del cual el programa puede recuperarse (ej: división por cero, archivo no encontrado).'
      }
    ],
    contenidoAdicional: 'Las excepciones son fundamentales para crear aplicaciones robustas que puedan manejar condiciones inesperadas de manera elegante y controlada.',
    dificultad: 'FACIL'
  },
  {
    unidad: 5,
    tema: 2,
    titulo: 'Tipos de excepciones',
    conceptosClave: [
      {
        termino: 'Excepciones de validación',
        definicion: 'Errores causados por datos inválidos o que no cumplen con las reglas de negocio establecidas.',
        ejemplos: [
          'IllegalArgumentException: parámetro inválido',
          'ValidationException: email mal formateado',
          'BusinessRuleException: edad fuera de rango permitido'
        ]
      },
      {
        termino: 'Excepciones de E/O (Input/Output)',
        definicion: 'Errores relacionados con operaciones de entrada y salida de datos, especialmente archivos y red.',
        ejemplos: [
          'FileNotFoundException: archivo no existe',
          'IOException: error leyendo/escribiendo archivo',
          'NetworkException: falla de conexión de red'
        ]
      },
      {
        termino: 'Excepciones aritméticas',
        definicion: 'Errores en operaciones matemáticas que producen resultados indefinidos o inválidos.',
        ejemplos: [
          'ArithmeticException: división por cero',
          'NumberFormatException: conversión inválida',
          'OverflowException: resultado fuera de rango'
        ]
      },
      {
        termino: 'Checked vs Unchecked (Java)',
        definicion: 'Checked: deben ser declaradas o manejadas obligatoriamente. Unchecked: no requieren manejo explícito.',
        ejemplos: [
          'Checked: IOException, SQLException (obligatorio manejar)',
          'Unchecked: NullPointerException, RuntimeException',
          'Checked verificadas en tiempo de compilación'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'En Java, NullPointerException es unchecked.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'NullPointerException es una RuntimeException (unchecked), no requiere manejo obligatorio en tiempo de compilación.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Las excepciones de E/O suelen requerir manejo explícito en algunos lenguajes.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'En Java, las excepciones de E/O como IOException son checked y requieren manejo obligatorio.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál de estos es un ejemplo de excepción de E/O?',
        opciones: [
          { texto: 'ArrayIndexOutOfBounds', esCorrecta: false },
          { texto: 'FileNotFoundException', esCorrecta: true },
          { texto: 'NullPointerException', esCorrecta: false },
          { texto: 'ArithmeticException', esCorrecta: false }
        ],
        respuestaCorrecta: 'FileNotFoundException',
        explicacion: 'FileNotFoundException es una excepción de E/O que ocurre cuando no se encuentra un archivo especificado.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Describe cómo manejarías una excepción de archivo no encontrado al intentar abrir un archivo de configuración.',
        respuestaSugerida: 'try { abrirArchivo("config.properties"); } catch (FileNotFoundException e) { log.warn("Archivo config no encontrado, usando valores por defecto"); cargarConfiguracionPorDefecto(); mostrarMensaje("Usando configuración predeterminada"); }'
      }
    ],
    contenidoAdicional: 'Conocer los diferentes tipos de excepciones ayuda a anticipar problemas y implementar estrategias de manejo específicas para cada categoría de error.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 5,
    tema: 3,
    titulo: 'Propagación de excepciones',
    conceptosClave: [
      {
        termino: 'Propagación en la pila',
        definicion: 'Si una excepción no es capturada en el método actual, sube automáticamente la pila de llamadas hasta encontrar un manejador.',
        ejemplos: [
          'metodoA() llama metodoB() que lanza excepción',
          'Si metodoB() no maneja, propaga a metodoA()',
          'Continúa hasta encontrar try-catch o terminar programa'
        ]
      },
      {
        termino: 'Declaración con throws',
        definicion: 'Palabras clave como throws (Java) o throw (C#) indican que un método puede lanzar excepciones específicas.',
        ejemplos: [
          'public void leerArchivo() throws IOException',
          'void procesar() throws ValidationException, SQLException',
          'Contrato explícito sobre excepciones posibles'
        ]
      },
      {
        termino: 'Nivel apropiado de manejo',
        definicion: 'Las excepciones deben manejarse en el nivel que tenga suficiente contexto para decidir la acción correcta.',
        ejemplos: [
          'UI layer: mostrar mensajes al usuario',
          'Service layer: lógica de recuperación de negocio',
          'DAO layer: reintentos de conexión'
        ]
      },
      {
        termino: 'Stack unwinding',
        definicion: 'Proceso de desenrollar la pila de llamadas, ejecutando finally blocks y destructores durante la propagación.',
        ejemplos: [
          'Liberación automática de recursos locales',
          'Ejecución de cleanup code en finally',
          'Mantenimiento de integridad del estado'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Si no se captura una excepción en ninguna parte, el programa puede terminar abruptamente.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Si una excepción llega hasta el hilo principal sin ser capturada, el programa terminará con un error no manejado.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Propagar excepciones siempre es la mejor práctica.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'No siempre es mejor propagar. A veces es mejor manejar localmente si se puede recuperar o si se tiene el contexto adecuado.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué instrucción lanza una excepción en la mayoría de los lenguajes?',
        opciones: [
          { texto: 'try', esCorrecta: false },
          { texto: 'throw', esCorrecta: true },
          { texto: 'catch', esCorrecta: false },
          { texto: 'finally', esCorrecta: false }
        ],
        respuestaCorrecta: 'throw',
        explicacion: 'La palabra clave "throw" se usa para lanzar excepciones explícitamente en la mayoría de lenguajes.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Escribe pseudocódigo que muestre una función leerArchivo() que lance una excepción si no existe y un bloque superior que la capture.',
        respuestaSugerida: 'function leerArchivo(nombre) throws FileNotFoundException { if (!existe(nombre)) throw new FileNotFoundException("Archivo no encontrado: " + nombre); return contenido; } // Uso: try { datos = leerArchivo("config.txt"); } catch (FileNotFoundException e) { mostrar("Error: " + e.getMessage()); }'
      }
    ],
    contenidoAdicional: 'La propagación de excepciones permite un diseño modular donde cada capa maneja los errores que puede resolver y propaga los que requieren decisiones de nivel superior.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 5,
    tema: 4,
    titulo: 'Gestión de excepciones: manejo de excepciones, lanzamiento de excepciones',
    conceptosClave: [
      {
        termino: 'Estructura try-catch-finally',
        definicion: 'Patrón estándar para manejo de excepciones: try contiene código riesgoso, catch maneja errores, finally ejecuta limpieza.',
        ejemplos: [
          'try { operacionRiesgosa(); } catch (Exception e) { manejarError(e); } finally { limpiarRecursos(); }',
          'Múltiples catch para diferentes tipos de excepción',
          'finally siempre se ejecuta, con o sin excepción'
        ]
      },
      {
        termino: 'Manejo en bloque catch',
        definicion: 'En catch se procesa el error: logging, recuperación, notificación al usuario, o re-lanzamiento con más contexto.',
        ejemplos: [
          'logger.error("Error procesando: " + e.getMessage())',
          'mostrarMensajeUsuario("Operación falló, intente nuevamente")',
          'throw new BusinessException("Error en validación", e)'
        ]
      },
      {
        termino: 'Bloque finally',
        definicion: 'Se ejecuta siempre para liberar recursos (archivos, conexiones) independientemente de si ocurrió excepción.',
        ejemplos: [
          'finally { if (archivo != null) archivo.close(); }',
          'finally { conexion.disconnect(); }',
          'Se ejecuta incluso con return en try/catch'
        ]
      },
      {
        termino: 'Buenas prácticas',
        definicion: 'No capturar excepciones genéricas sin tratamiento, usar logging detallado, no ocultar errores, mensajes útiles.',
        ejemplos: [
          'Evitar: catch (Exception e) { /* ignorar */ }',
          'Preferir: catch (SpecificException e) { log y manejar }',
          'Usar try-with-resources cuando esté disponible'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'finally se ejecuta incluso si hay return dentro de try.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'El bloque finally se ejecuta siempre, incluso si hay return, break o continue en try o catch.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Atrapar Exception genérica y no hacer nada es buena práctica.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Capturar excepciones genéricas sin procesarlas es mala práctica porque oculta errores y dificulta el debugging.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'En un bloque try/catch/finally, ¿qué sección se utiliza para liberar recursos garantizando ejecución?',
        opciones: [
          { texto: 'try', esCorrecta: false },
          { texto: 'catch', esCorrecta: false },
          { texto: 'finally', esCorrecta: true },
          { texto: 'Ninguna', esCorrecta: false }
        ],
        respuestaCorrecta: 'finally',
        explicacion: 'El bloque finally se ejecuta siempre, lo que lo hace ideal para liberación de recursos.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Muestra pseudocódigo que abra una conexión a BD dentro de try y la cierre en finally, y que en catch vuelva a lanzar una excepción con mensaje más claro.',
        respuestaSugerida: 'Connection conn = null; try { conn = database.connect(); resultado = conn.query(sql); } catch (SQLException e) { logger.error("Error BD: " + e); throw new DataAccessException("Falla accediendo a datos del usuario", e); } finally { if (conn != null) conn.close(); }'
      }
    ],
    contenidoAdicional: 'Una gestión correcta de excepciones no solo previene crashes sino que proporciona información valiosa para debugging y mejora la experiencia del usuario.',
    dificultad: 'MEDIA'
  },
  {
    unidad: 5,
    tema: 5,
    titulo: 'Creación y manejo de excepciones definidas por el usuario',
    conceptosClave: [
      {
        termino: 'Excepciones personalizadas',
        definicion: 'Clases de excepción específicas del dominio que extienden la jerarquía de excepciones del lenguaje.',
        ejemplos: [
          'class ErrorMatriculaException extends Exception',
          'class ValidacionNegocioException extends RuntimeException',
          'class ErrorAutenticacionException extends SecurityException'
        ]
      },
      {
        termino: 'Ventajas de excepciones específicas',
        definicion: 'Expresan errores de negocio claramente y permiten manejo diferenciado según el tipo de problema.',
        ejemplos: [
          'catch (ErrorMatriculaException e) vs catch (Exception e)',
          'Manejo específico por tipo de error de negocio',
          'Mejor documentación del API mediante tipos'
        ]
      },
      {
        termino: 'Información contextual',
        definicion: 'Las excepciones personalizadas pueden incluir datos adicionales relevantes al error específico.',
        ejemplos: [
          'ErrorMatriculaException(String mensaje, int codigoError, String idEstudiante)',
          'ValidacionException con campo específico que falló',
          'ErrorPagoException con monto y código de transacción'
        ]
      },
      {
        termino: 'Jerarquía de excepciones',
        definicion: 'Organizar excepciones personalizadas en jerarquías que reflejen la estructura del dominio de negocio.',
        ejemplos: [
          'ExcepcionAcademica → ErrorMatricula, ErrorEvaluacion',
          'ExcepcionFinanciera → ErrorPago, ErrorFacturacion',
          'Permite catch por categoría o tipo específico'
        ]
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Las excepciones personalizadas ayudan a clarificar el tipo de fallo a manejar.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Las excepciones específicas del dominio hacen el código más expresivo y permiten manejo diferenciado por tipo de error.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'No es posible incluir información adicional (código, datos) en una excepción personalizada.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Las excepciones personalizadas pueden incluir campos adicionales como códigos de error, IDs, y datos contextuales.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué incluirías en una excepción personalizada?',
        opciones: [
          { texto: 'Mensaje descriptivo', esCorrecta: false },
          { texto: 'Código de error opcional', esCorrecta: false },
          { texto: 'Datos contextuales (idAlumno)', esCorrecta: false },
          { texto: 'Todas las anteriores', esCorrecta: true }
        ],
        respuestaCorrecta: 'Todas las anteriores',
        explicacion: 'Una excepción personalizada completa incluye mensaje descriptivo, códigos de error opcionales y datos contextuales relevantes.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Define una clase de excepción ExcepcionEvaluacion que incluya un campo codigoError y escribe cómo lanzarla.',
        respuestaSugerida: 'class ExcepcionEvaluacion extends Exception { private int codigoError; public ExcepcionEvaluacion(String mensaje, int codigo) { super(mensaje); this.codigoError = codigo; } public int getCodigoError() { return codigoError; } } // Uso: throw new ExcepcionEvaluacion("Nota inválida", 400);'
      }
    ],
    contenidoAdicional: 'Las excepciones personalizadas son herramientas poderosas para crear APIs expresivas y facilitar el mantenimiento del código mediante un manejo de errores específico del dominio.',
    dificultad: 'MEDIA'
  },

  // UNIDAD 6: Flujos y archivos
  {
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    unidad: 6,
    tema: 1,
    titulo: 'Definición',
    conceptosClave: [
      {
        termino: 'Flujo (stream)',
        definicion: 'Secuencia de bytes o datos que puede leerse o escribirse de forma continua, proporcionando abstracción para operaciones de entrada y salida',
        ejemplos: ['InputStream para leer archivos', 'OutputStream para escribir datos', 'BufferedReader para lectura eficiente', 'FileWriter para escritura de texto']
      },
      {
        termino: 'Archivos',
        definicion: 'Representación persistente de datos almacenados en disco, accesibles mediante flujos de entrada y salida para operaciones de lectura/escritura',
        ejemplos: ['archivo.txt con datos de texto', 'imagen.jpg como archivo binario', 'config.json para configuraciones', 'datos.csv con información tabular']
      },
      {
        termino: 'Abstracción de streams',
        definicion: 'Mecanismo que permite trabajar con streams (InputStream/OutputStream, Readers/Writers) para operar con datos independientemente de la fuente',
        ejemplos: ['Leer desde archivo o red con mismo código', 'Escribir a consola o archivo indistintamente', 'Procesar datos sin conocer origen', 'Usar interfaces comunes para diferentes fuentes']
      },
      {
        termino: 'Procesamiento secuencial',
        definicion: 'Técnica de leer/escribir datos de manera continua sin cargar todo el contenido en memoria simultáneamente',
        ejemplos: ['Leer archivo línea por línea', 'Procesar stream de datos grandes', 'Transferir archivos por chunks', 'Análisis de logs en tiempo real']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un stream permite procesar datos de manera secuencial sin cargar todo en memoria.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'Los streams permiten procesamiento incremental, leyendo/escribiendo datos por bloques sin necesidad de cargar archivos completos en memoria.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Leer un archivo siempre copia todo su contenido en memoria automáticamente.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Los streams permiten lectura secuencial por bloques, evitando cargar archivos completos en memoria si no es necesario.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Un stream de entrada sirve para:',
        opciones: [
          { texto: 'Escribir en disco', esCorrecta: false },
          { texto: 'Leer datos secuencialmente', esCorrecta: true },
          { texto: 'Compilar código', esCorrecta: false },
          { texto: 'Ejecutar tests', esCorrecta: false }
        ],
        respuestaCorrecta: 'Leer datos secuencialmente',
        explicacion: 'Los streams de entrada (InputStream) están diseñados específicamente para leer datos de manera secuencial desde diversas fuentes.'
      },
      {
        tipo: 'PREGUNTA_ABIERTA',
        enunciado: 'Explica la diferencia entre leer un archivo por bloques y leerlo todo de una vez (ventajas/desventajas).',
        respuestaSugerida: 'Lectura por bloques: menor uso de memoria, procesamiento streaming, mejor para archivos grandes. Lectura completa: acceso aleatorio, procesamiento más simple, pero consume más memoria.',
        dificultad: 'MEDIA'
      }
    ],
    contenidoAdicional: 'Los streams son fundamentales en programación para manejar eficientemente grandes volúmenes de datos. Proporcionan abstracción que permite tratar uniformemente diferentes fuentes de datos (archivos, red, memoria) usando las mismas interfaces y patrones de programación.',
    dificultad: 'FACIL'
  },
  {
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    unidad: 6,
    tema: 2,
    titulo: 'Clasificación: Archivos de texto y binarios',
    conceptosClave: [
      {
        termino: 'Archivos de texto',
        definicion: 'Archivos que almacenan datos en formato legible por humanos usando codificación de caracteres como ASCII o UTF-8, útiles para configuraciones y logs',
        ejemplos: ['Archivos .txt con texto plano', 'Archivos .json de configuración', 'Logs de aplicaciones', 'Código fuente .java/.py']
      },
      {
        termino: 'Archivos binarios',
        definicion: 'Archivos que almacenan datos en formato nativo de la máquina (bytes), requiriendo interpretación específica según el formato o estructura',
        ejemplos: ['Imágenes .jpg/.png', 'Ejecutables .exe/.jar', 'Videos .mp4/.avi', 'Bases de datos .db']
      },
      {
        termino: 'Codificación de caracteres',
        definicion: 'Sistema que mapea caracteres a representaciones numéricas, siendo crucial especificar la correcta al leer/escribir archivos de texto',
        ejemplos: ['UTF-8 para caracteres internacionales', 'ASCII para texto básico', 'ISO-8859-1 para caracteres latinos', 'UTF-16 para sistemas Windows']
      },
      {
        termino: 'Readers/Writers vs Streams',
        definicion: 'Readers/Writers para texto con manejo automático de codificación, Streams para datos binarios con control byte por byte',
        ejemplos: ['FileReader para leer texto', 'FileInputStream para binarios', 'BufferedWriter para escritura eficiente', 'DataOutputStream para tipos primitivos']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Un archivo de texto puede interpretarse correctamente si se usa la codificación equivocada.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Usar codificación incorrecta puede resultar en caracteres mal interpretados, especialmente con caracteres especiales o no ASCII.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Los archivos binarios no pueden contener texto.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Los archivos binarios pueden contener texto como parte de su estructura, pero no están diseñados primariamente para ser legibles como texto.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es una diferencia entre archivo de texto y binario?',
        opciones: [
          { texto: 'El texto no tiene codificación', esCorrecta: false },
          { texto: 'Binario requiere interpretación del formato', esCorrecta: true },
          { texto: 'Texto sólo puede leerse en Windows', esCorrecta: false },
          { texto: 'Ninguna', esCorrecta: false }
        ],
        respuestaCorrecta: 'Binario requiere interpretación del formato',
        explicacion: 'Los archivos binarios necesitan conocimiento específico del formato para interpretarse correctamente, mientras que texto usa codificaciones estándar.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Para leer un archivo UTF-8 correctamente debes:',
        opciones: [
          { texto: 'Usar un Reader con codificación UTF-8', esCorrecta: true },
          { texto: 'Usar Reader sin especificar nada', esCorrecta: false },
          { texto: 'Convertir a binario siempre', esCorrecta: false },
          { texto: 'Abrir en modo binario sólo', esCorrecta: false }
        ],
        respuestaCorrecta: 'Usar un Reader con codificación UTF-8',
        explicacion: 'Es importante especificar la codificación correcta al crear el Reader para interpretar correctamente los caracteres.'
      }
    ],
    contenidoAdicional: 'La distinción entre archivos de texto y binarios es fundamental para elegir las herramientas apropiadas de lectura/escritura. Los archivos de texto requieren consideraciones de codificación, mientras que los binarios necesitan conocimiento del formato específico.',
    dificultad: 'FACIL'
  },
  {
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    unidad: 6,
    tema: 3,
    titulo: 'Operaciones básicas y tipos de acceso',
    conceptosClave: [
      {
        termino: 'Operaciones básicas de archivos',
        definicion: 'Conjunto de operaciones fundamentales para manipular archivos: abrir, leer, escribir, cerrar, eliminar, renombrar y copiar',
        ejemplos: ['open() para abrir archivo', 'read()/write() para E/S', 'close() para liberar recursos', 'delete() y rename() para gestión']
      },
      {
        termino: 'Acceso secuencial',
        definicion: 'Tipo de acceso que procesa archivo desde el inicio hasta el fin de manera ordenada, sin saltos a posiciones arbitrarias',
        ejemplos: ['Leer log línea por línea', 'Procesar archivo CSV completo', 'Generar reporte secuencial', 'Streaming de audio/video']
      },
      {
        termino: 'Acceso aleatorio (random access)',
        definicion: 'Capacidad de moverse a posiciones específicas del archivo usando operaciones como seek(), útil para archivos indexados',
        ejemplos: ['Base de datos simple con registros fijos', 'Índices de archivos grandes', 'Edición de archivos binarios', 'Acceso directo a registros']
      },
      {
        termino: 'Bloqueo y concurrencia',
        definicion: 'Mecanismos para coordinar acceso simultáneo a archivos desde múltiples procesos/hilos, evitando corrupción de datos',
        ejemplos: ['File locks exclusivos/compartidos', 'Semáforos para coordinación', 'Transacciones atómicas', 'Control de versiones']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'El acceso aleatorio permite posicionarse en cualquier offset del archivo.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'El acceso aleatorio permite usar seek() para moverse a cualquier posición válida dentro del archivo.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Es seguro que múltiples procesos escriban simultáneamente en el mismo archivo sin coordinación.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Escritura concurrente sin coordinación puede causar corrupción de datos. Se necesitan mecanismos de bloqueo o sincronización.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué operación se utiliza para moverse a una posición concreta en un archivo?',
        opciones: [
          { texto: 'read()', esCorrecta: false },
          { texto: 'seek()', esCorrecta: true },
          { texto: 'close()', esCorrecta: false },
          { texto: 'write()', esCorrecta: false }
        ],
        respuestaCorrecta: 'seek()',
        explicacion: 'La operación seek() permite posicionar el cursor de lectura/escritura en un offset específico del archivo.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Para evitar corrupción al escribir desde múltiples hilos, usarías:',
        opciones: [
          { texto: 'Bloqueo/lock', esCorrecta: true },
          { texto: 'Ignorar el problema', esCorrecta: false },
          { texto: 'Leer sólo', esCorrecta: false },
          { texto: 'No usar archivos', esCorrecta: false }
        ],
        respuestaCorrecta: 'Bloqueo/lock',
        explicacion: 'Los mecanismos de bloqueo (locks) coordinan el acceso concurrente evitando que múltiples hilos escriban simultáneamente.'
      }
    ],
    contenidoAdicional: 'Las operaciones de archivo y tipos de acceso son fundamentales para el diseño eficiente de sistemas. El acceso secuencial es óptimo para procesamiento streaming, mientras que el aleatorio permite estructuras de datos más complejas como índices y bases de datos.',
    dificultad: 'MEDIA'
  },
  {
    materia: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    unidad: 6,
    tema: 4,
    titulo: 'Manejo de objetos persistentes',
    conceptosClave: [
      {
        termino: 'Persistencia de objetos',
        definicion: 'Capacidad de guardar y recuperar objetos (serialización) para que mantengan su estado más allá del ciclo de vida del programa',
        ejemplos: ['Guardar configuración de usuario', 'Caché de objetos complejos', 'Sesiones de aplicación', 'Estado de juegos guardados']
      },
      {
        termino: 'Serialización',
        definicion: 'Proceso de convertir objetos en flujo de bytes o representación textual (JSON, XML, binario) y viceversa (deserialización)',
        ejemplos: ['JSON para APIs web', 'XML para configuraciones', 'Serialización binaria nativa', 'Protocol Buffers para eficiencia']
      },
      {
        termino: 'Consideraciones de compatibilidad',
        definicion: 'Aspectos críticos como versionado de clases, compatibilidad entre versiones, seguridad y validación de datos deserializados',
        ejemplos: ['Schema evolution en bases datos', 'Validación de entrada deserializada', 'Versionado de APIs', 'Migración de formatos']
      },
      {
        termino: 'Alternativas de persistencia',
        definicion: 'Opciones como bases de datos relacionales/NoSQL que ofrecen persistencia más estructurada, transaccional y escalable que archivos simples',
        ejemplos: ['PostgreSQL para datos relacionales', 'MongoDB para documentos', 'Redis para caché', 'SQLite para apps locales']
      }
    ],
    ejerciciosEjemplo: [
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'Serializar objetos con JSON es siempre seguro sin validación.',
        respuestaCorrecta: 'FALSO',
        explicacion: 'Deserializar datos sin validación puede causar vulnerabilidades de seguridad. Siempre se debe validar la estructura y contenido.'
      },
      {
        tipo: 'VERDADERO_FALSO',
        enunciado: 'La serialización binaria puede ser más eficiente en espacio que JSON pero menos portable.',
        respuestaCorrecta: 'VERDADERO',
        explicacion: 'La serialización binaria es más compacta y rápida, pero menos portable entre plataformas y lenguajes que formatos texto como JSON.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Qué problema puede ocurrir al deserializar objetos después de cambiar la clase?',
        opciones: [
          { texto: 'Nada', esCorrecta: false },
          { texto: 'Incompatibilidad de versión y errores', esCorrecta: true },
          { texto: 'Mejora de rendimiento', esCorrecta: false },
          { texto: 'El objeto se actualiza automáticamente', esCorrecta: false }
        ],
        respuestaCorrecta: 'Incompatibilidad de versión y errores',
        explicacion: 'Cambios en la estructura de clase pueden romper la deserialización si no hay estrategia de versionado adecuada.'
      },
      {
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Para persistir datos complejos y relaciones, sería apropiado usar:',
        opciones: [
          { texto: 'Solo archivos de texto', esCorrecta: false },
          { texto: 'Bases de datos relacionales o NoSQL según necesidad', esCorrecta: true },
          { texto: 'Variables globales', esCorrecta: false },
          { texto: 'Ninguna de las anteriores', esCorrecta: false }
        ],
        respuestaCorrecta: 'Bases de datos relacionales o NoSQL según necesidad',
        explicacion: 'Para datos complejos con relaciones, las bases de datos ofrecen mejor estructura, consultas, transacciones y escalabilidad.'
      }
    ],
    contenidoAdicional: 'La persistencia de objetos es crucial en aplicaciones modernas. Mientras que la serialización simple funciona para casos básicos, aplicaciones complejas requieren bases de datos que ofrecen transacciones, consultas eficientes, y manejo de concurrencia.',
    dificultad: 'MEDIA'
  }
];

async function seedInformacion() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar información anterior
    console.log('\n🗑️  Eliminando información anterior...');
    await Informacion.deleteMany({});
    console.log('   - Información eliminada');

    console.log('\n📝 Creando información para temas...\n');

    let creados = 0;
    
    // PROCESAR FUNDAMENTOS DE PROGRAMACIÓN
    console.log('� Procesando: FUNDAMENTOS DE PROGRAMACIÓN...');
    const materiaFP = await Materia.findOne({ nombre: /FUNDAMENTOS DE PROGRAMACIÓN/i });
    
    if (!materiaFP) {
      console.log('❌ No se encontró la materia Fundamentos de Programación.');
    } else {
      console.log(`✅ Materia encontrada: ${materiaFP.nombre}`);
      
      for (const info of informacionData) {
        creados += await procesarInformacion(info, materiaFP);
      }
    }

    // PROCESAR PROGRAMACIÓN ORIENTADA A OBJETOS
    console.log('\n📗 Procesando: PROGRAMACIÓN ORIENTADA A OBJETOS...');
    const materiaPOO = await Materia.findOne({ nombre: /PROGRAMACIÓN ORIENTADA A OBJETOS/i });
    
    if (!materiaPOO) {
      console.log('❌ No se encontró la materia Programación Orientada a Objetos.');
    } else {
      console.log(`✅ Materia encontrada: ${materiaPOO.nombre}`);
      
      for (const info of informacionPOOData) {
        creados += await procesarInformacion(info, materiaPOO);
      }
    }

    // Resumen final
    const totalInformacion = await Informacion.countDocuments();

    console.log('\n� RESUMEN:');
    console.log(`   ✅ ${creados} registros de información creados`);
    console.log(`   📖 ${totalInformacion} total en base de datos`);
    console.log('\n🎉 Seed de información completado exitosamente!\n');

    // Mostrar estadísticas por materia y unidad
    await mostrarEstadisticas();

    console.log('\n💡 Próximos pasos:');
    console.log('   1. Usa GET /api/informacion para ver toda la información');
    console.log('   2. Usa GET /api/temas/:temaId/informacion para información específica');
    console.log('   3. Los ejercicios generados ahora usarán esta información detallada');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed de información:', error);
    process.exit(1);
  }
}

// Función auxiliar para procesar información
async function procesarInformacion(info, materia) {
  try {
    // Buscar la unidad
    const unidad = await Unidad.findOne({ 
      materia: materia._id, 
      numero: info.unidad 
    });
    
    if (!unidad) {
      console.log(`⚠️  Unidad ${info.unidad} no encontrada en ${materia.nombre}, saltando...`);
      return 0;
    }
    
    // Buscar el tema
    const tema = await Tema.findOne({ 
      unidad: unidad._id, 
      orden: info.tema 
    });
    
    if (!tema) {
      console.log(`⚠️  Tema ${info.unidad}.${info.tema} no encontrado en ${materia.nombre}, saltando...`);
      return 0;
    }

    // Crear la información
    const informacion = await Informacion.create({
      tema: tema._id,
      conceptosClave: info.conceptosClave,
      ejemploBreve: info.ejemploBreve,
      ejerciciosEjemplo: info.ejerciciosEjemplo,
      contenidoAdicional: info.contenidoAdicional || '',
      dificultad: info.dificultad || 'MEDIA'
    });

    console.log(`   ✅ Información creada para: ${unidad.titulo} → ${tema.titulo}`);
    return 1;

  } catch (err) {
    console.log(`   ❌ Error creando información para ${info.unidad}.${info.tema} en ${materia.nombre}: ${err.message}`);
    return 0;
  }
}

// Función para mostrar estadísticas
async function mostrarEstadisticas() {
  const stats = await Informacion.aggregate([
    {
      $lookup: {
        from: 'temas',
        localField: 'tema',
        foreignField: '_id',
        as: 'tema'
      }
    },
    {
      $unwind: '$tema'
    },
    {
      $lookup: {
        from: 'unidads',
        localField: 'tema.unidad',
        foreignField: '_id',
        as: 'unidad'
      }
    },
    {
      $unwind: '$unidad'
    },
    {
      $lookup: {
        from: 'materias',
        localField: 'unidad.materia',
        foreignField: '_id',
        as: 'materia'
      }
    },
    {
      $unwind: '$materia'
    },
    {
      $group: {
        _id: { 
          materia: '$materia.nombre',
          unidad: '$unidad.numero', 
          titulo: '$unidad.titulo' 
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.materia': 1, '_id.unidad': 1 }
    }
  ]);

  console.log('📈 ESTADÍSTICAS POR MATERIA Y UNIDAD:');
  let currentMateria = null;
  stats.forEach(stat => {
    if (currentMateria !== stat._id.materia) {
      currentMateria = stat._id.materia;
      console.log(`\n📚 ${currentMateria}:`);
    }
    console.log(`   Unidad ${stat._id.unidad}: ${stat._id.titulo} → ${stat.count} temas con información`);
  });
}


// Ejecutar seed
seedInformacion();
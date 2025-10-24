# 🤖 Guía: Generar Ejercicios con Gemini AI

## ✅ Prueba Exitosa

Se probó exitosamente la generación de un ejercicio usando Gemini AI para el **Tema 1.1: Conceptos básicos** de la **Unidad 1: Diseño Algorítmico** de la materia **FUNDAMENTOS DE PROGRAMACIÓN**.

### Ejercicio Generado:

**Título:** Propiedades Esenciales de un Algoritmo: Característica 'Definido'

**Enunciado:** Un algoritmo se caracteriza por ser 'definido' (o determinista), lo que implica que para un mismo conjunto de datos de entrada, siempre debe producir la misma salida. ¿Cuál de las siguientes situaciones **viola** directamente esta característica fundamental de un algoritmo?

**Opciones:**
- A) El algoritmo consume una cantidad excesiva de memoria...
- B) Un paso dentro del algoritmo no especifica con claridad...
- **C) ✅ Al ejecutar el algoritmo dos veces con exactamente los mismos datos de entrada, se obtienen resultados diferentes...**
- D) Para ciertos valores de entrada, el algoritmo entra en un bucle infinito...

---

## 📍 ENDPOINT DISPONIBLE

### POST `/api/llm/generar-ejercicio`

Genera un ejercicio educativo usando Gemini AI basado en un tema específico.

---

## 🔧 CÓMO USAR EN POSTMAN

### 1️⃣ Primera vez: Obtener IDs

Para generar un ejercicio, necesitas el **ID del tema**. Aquí está cómo obtenerlo:

#### Paso 1: Listar Materias
**GET** `http://localhost:3000/api/materias`

**Headers:**
```
Authorization: Bearer TU_TOKEN
```

**Response:** Copia el `_id` de "FUNDAMENTOS DE PROGRAMACIÓN"
```json
{
  "success": true,
  "data": [
    {
      "_id": "68fafecd196196c45b250cd2",  // ← COPIA ESTE ID
      "nombre": "FUNDAMENTOS DE PROGRAMACIÓN"
    }
  ]
}
```

#### Paso 2: Obtener Unidades de la Materia
**GET** `http://localhost:3000/api/materias/68fafecd196196c45b250cd2/unidades`

**Headers:**
```
Authorization: Bearer TU_TOKEN
```

**Response:** Copia el `_id` de la "Unidad 1: Diseño Algorítmico"
```json
{
  "success": true,
  "data": [
    {
      "_id": "68fafecd196196c45b250cd4",  // ← COPIA ESTE ID
      "numero": 1,
      "titulo": "Diseño Algorítmico"
    }
  ]
}
```

#### Paso 3: Obtener Temas de la Unidad
**GET** `http://localhost:3000/api/unidades/68fafecd196196c45b250cd4/temas`

**Headers:**
```
Authorization: Bearer TU_TOKEN
```

**Response:** Copia el `_id` del tema "Conceptos básicos"
```json
{
  "success": true,
  "data": [
    {
      "_id": "68fafecd196196c45b250cd6",  // ← USA ESTE ID
      "titulo": "Conceptos básicos",
      "orden": 1
    }
  ]
}
```

---

### 2️⃣ Generar Ejercicio con Gemini

**POST** `http://localhost:3000/api/llm/generar-ejercicio`

**Headers:**
```json
{
  "Authorization": "Bearer TU_TOKEN",
  "Content-Type": "application/json"
}
```

**Body (JSON):**
```json
{
  "temaId": "68fafecd196196c45b250cd6",
  "tipo": "OPCION_MULTIPLE",
  "dificultad": "MEDIA"
}
```

#### Parámetros:

| Campo | Tipo | Requerido | Valores | Descripción |
|-------|------|-----------|---------|-------------|
| `temaId` | String | ✅ Sí | ID MongoDB | ID del tema sobre el que generar el ejercicio |
| `tipo` | String | ❌ No | `OPCION_MULTIPLE`, `VERDADERO_FALSO` | Tipo de ejercicio (default: `OPCION_MULTIPLE`) |
| `dificultad` | String | ❌ No | `FACIL`, `MEDIA`, `DIFICIL` | Nivel de dificultad (default: `MEDIA`) |

---

### 3️⃣ Response Esperada (201 Created)

```json
{
  "success": true,
  "data": {
    "ejercicio": {
      "titulo": "Propiedades Esenciales de un Algoritmo: Característica 'Definido'",
      "enunciado": "Un algoritmo se caracteriza por ser 'definido' (o determinista)...",
      "opciones": [
        {
          "texto": "El algoritmo consume una cantidad excesiva de memoria...",
          "esCorrecta": false
        },
        {
          "texto": "Un paso dentro del algoritmo no especifica con claridad...",
          "esCorrecta": false
        },
        {
          "texto": "Al ejecutar el algoritmo dos veces con exactamente los mismos datos...",
          "esCorrecta": true
        },
        {
          "texto": "Para ciertos valores de entrada, el algoritmo entra en un bucle infinito...",
          "esCorrecta": false
        }
      ],
      "explicacion": "La característica 'definido' (o determinista) es crucial...",
      "dificultad": "MEDIA",
      "puntaje": 2,
      "tipo": "OPCION_MULTIPLE",
      "tema": "68fafecd196196c45b250cd6"
    },
    "contexto": {
      "materia": "FUNDAMENTOS DE PROGRAMACIÓN",
      "unidad": "Diseño Algorítmico",
      "tema": "Conceptos básicos"
    }
  },
  "message": "Ejercicio generado exitosamente por Gemini"
}
```

---

## 📝 EJEMPLO COMPLETO EN POSTMAN

### Ejercicio de Opción Múltiple (MEDIA)

**POST** `http://localhost:3000/api/llm/generar-ejercicio`

```json
{
  "temaId": "68fafecd196196c45b250cd6",
  "tipo": "OPCION_MULTIPLE",
  "dificultad": "MEDIA"
}
```

### Ejercicio de Verdadero/Falso (FÁCIL)

**POST** `http://localhost:3000/api/llm/generar-ejercicio`

```json
{
  "temaId": "68fafecd196196c45b250cd6",
  "tipo": "VERDADERO_FALSO",
  "dificultad": "FACIL"
}
```

### Ejercicio Difícil

**POST** `http://localhost:3000/api/llm/generar-ejercicio`

```json
{
  "temaId": "68fafecd196196c45b250cd6",
  "tipo": "OPCION_MULTIPLE",
  "dificultad": "DIFICIL"
}
```

---

## 🎯 PUNTAJES POR DIFICULTAD

| Dificultad | Puntaje |
|------------|---------|
| `FACIL` | 1 punto |
| `MEDIA` | 2 puntos |
| `DIFICIL` | 3 puntos |

---

## ⚠️ POSIBLES ERRORES

### Error 400: Tema ID requerido
```json
{
  "success": false,
  "error": "El ID del tema es requerido"
}
```
**Solución:** Asegúrate de enviar el campo `temaId` en el body.

### Error 404: Tema no encontrado
```json
{
  "success": false,
  "error": "Tema no encontrado"
}
```
**Solución:** Verifica que el `temaId` sea válido y exista en la base de datos.

### Error 503: Gemini no configurado
```json
{
  "success": false,
  "error": "Gemini no está configurado. Verifica GOOGLE_GEMINI_API_KEY en .env"
}
```
**Solución:** Asegúrate de tener la API key de Gemini en tu archivo `.env`:
```
GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
```

### Error 500: Error parseando respuesta
```json
{
  "success": false,
  "error": "Error procesando la respuesta de Gemini",
  "rawResponse": "..."
}
```
**Solución:** Gemini no devolvió un JSON válido. Esto es raro, intenta nuevamente.

---

## 🚀 FLUJO COMPLETO DE USO

1. **Login** → Obtener token
2. **Listar Materias** → Elegir materia
3. **Listar Unidades** → Elegir unidad
4. **Listar Temas** → Elegir tema
5. **Generar Ejercicio** → Gemini crea ejercicio basado en el tema
6. **(Opcional) Guardar Ejercicio** → POST `/api/ejercicios` (próximamente)

---

## 💡 TIPS

1. **Diferentes temas generan ejercicios diferentes:** Prueba con diferentes temas de la misma unidad para ver la variedad.

2. **Gemini es creativo:** Cada vez que llames al endpoint con el mismo tema, generará un ejercicio diferente.

3. **Usa la dificultad apropiada:** 
   - `FACIL` → Conceptos básicos, definiciones simples
   - `MEDIA` → Aplicación de conceptos, análisis
   - `DIFICIL` → Casos complejos, pensamiento crítico

4. **El contexto importa:** Gemini usa el título del tema, unidad y materia para generar ejercicios relevantes.

---

## 🧪 SCRIPT DE PRUEBA

Si quieres probar directamente desde Node.js sin Postman:

```bash
node test-gemini-ejercicio.js
```

Este script:
- Se conecta a MongoDB
- Busca automáticamente "Fundamentos de Programación" → Unidad 1 → Tema 1
- Genera un ejercicio con Gemini
- Muestra el resultado formateado en consola

---

## 📊 IDs DE REFERENCIA (De tu base de datos actual)

| Elemento | Nombre | ID |
|----------|--------|-----|
| Materia | FUNDAMENTOS DE PROGRAMACIÓN | `68fafecd196196c45b250cd2` |
| Unidad 1 | Diseño Algorítmico | `68fafecd196196c45b250cd4` |
| Tema 1.1 | Conceptos básicos | `68fafecd196196c45b250cd6` |

**Nota:** Estos IDs son de tu base de datos actual. Si vuelves a ejecutar el seed, los IDs cambiarán.

---

¿Necesitas ayuda para integrar esto en tu frontend o crear más endpoints relacionados? 🚀

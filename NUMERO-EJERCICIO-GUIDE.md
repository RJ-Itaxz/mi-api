# 🔢 Guía: numeroEjercicio

## 📌 ¿Qué es?

Ahora **todos los ejercicios** tienen un **número consecutivo** (1, 2, 3..., 23) además del ObjectId de MongoDB, facilitando el acceso rápido en pruebas.

---

## 📚 Ejercicios con Números Asignados

```
#1  → Algoritmo para calcular el área de un círculo (fácil)
#2  → Diagrama de flujo: Mayor de tres números (fácil)
#3  → Función para factorial (media)
#4  → Hola Mundo en C (fácil)
#5  → Declaración de variables y tipos de datos (fácil)
...
#21 → Polimorfismo con interfaces (difícil)
#22 → Manejo de excepciones (media)
#23 → Lectura y escritura de archivos de texto (media)
#24 → Próximo ejercicio... (auto-incrementa)
```

---

## 🔗 Nuevo Endpoint

### **GET** `/api/ejercicios/numero/:numero`

Obtiene un ejercicio por su número consecutivo.

#### Ejemplo en PowerShell:
```powershell
# Ejercicio #1
Invoke-RestMethod -Uri "http://localhost:3000/api/ejercicios/numero/1" -Method GET

# Ejercicio #10
Invoke-RestMethod -Uri "http://localhost:3000/api/ejercicios/numero/10" -Method GET

# Ejercicio #23
Invoke-RestMethod -Uri "http://localhost:3000/api/ejercicios/numero/23" -Method GET
```

#### Ejemplo en Postman:
```
GET http://localhost:3000/api/ejercicios/numero/5
```

#### Respuesta:
```json
{
  "success": true,
  "data": {
    "_id": "68f85a7c6229e4d7798ac956",
    "numeroEjercicio": 5,
    "titulo": "Declaración de variables y tipos de datos",
    "tema": "Introducción a la Programación",
    "dificultad": "facil",
    "descripcion": "Declara variables de tipo entero, flotante...",
    "autor": "68f85a7c6229e4d7798ac952",
    "activo": true,
    "createdAt": "2025-10-22T04:26:04.123Z",
    "updatedAt": "2025-10-22T04:26:04.123Z"
  }
}
```

---

## 🎯 Casos de Uso en Postman

### Caso 1: Acceso rápido a un ejercicio específico
```
GET /api/ejercicios/numero/10
→ Devuelve "Suma de números pares hasta N"
```

### Caso 2: Probar diferentes dificultades
```
# Fácil
GET /api/ejercicios/numero/1

# Media
GET /api/ejercicios/numero/3

# Difícil
GET /api/ejercicios/numero/21
```

### Caso 3: Usar variables en Postman
```
1. En Environment, agrega:
   - numeroEjercicio: 5

2. Usa en URLs:
   GET {{baseUrl}}/api/ejercicios/numero/{{numeroEjercicio}}
```

---

## 🔄 Auto-incremento Automático

Al crear un ejercicio nuevo, el `numeroEjercicio` se asigna automáticamente:

```json
POST /api/ejercicios
Authorization: Bearer {{adminToken}}
Body:
{
  "titulo": "Nuevo Ejercicio",
  "tema": "Testing",
  "dificultad": "media",
  "descripcion": "Ejercicio de prueba"
}

Respuesta:
{
  "data": {
    "numeroEjercicio": 24,  ← Auto-asignado
    "titulo": "Nuevo Ejercicio",
    ...
  }
}
```

---

## 📊 Distribución por Dificultad

| Dificultad | Cantidad | Números |
|------------|----------|---------|
| Fácil      | 9        | 1, 2, 4, 5, 6, 7, 9, 15, 17 |
| Media      | 9        | 3, 8, 10, 11, 12, 14, 16, 18, 19, 20, 22 |
| Difícil    | 5        | 13, 21 |

---

## 🧪 Ejemplos de Filtros

### Listar por dificultad (con números visibles):
```
GET /api/ejercicios?dificultad=facil&limit=20
```

Respuesta incluye `numeroEjercicio`:
```json
{
  "data": [
    { "numeroEjercicio": 1, "titulo": "Algoritmo...", "dificultad": "facil" },
    { "numeroEjercicio": 2, "titulo": "Diagrama...", "dificultad": "facil" },
    ...
  ]
}
```

---

## 📋 Endpoints Disponibles

### 1️⃣ Obtener Ejercicio por Número
```
GET /api/ejercicios/numero/:numero
```
**Ejemplo:** `/api/ejercicios/numero/5`

### 2️⃣ Obtener Ejercicio por ID MongoDB
```
GET /api/ejercicios/:id
```
**Ejemplo:** `/api/ejercicios/68f85a7c6229e4d7798ac956`

### 3️⃣ Listar Todos los Ejercicios
```
GET /api/ejercicios?limit=23
```
Retorna todos ordenados por fecha (más reciente primero), pero incluye `numeroEjercicio`.

### 4️⃣ Crear Ejercicio (Admin)
```
POST /api/ejercicios
Authorization: Bearer {{adminToken}}
```
El `numeroEjercicio` se asigna automáticamente.

---

## 🎨 Pruebas en PowerShell

```powershell
# Ver todos los ejercicios con números
$ejercicios = (Invoke-RestMethod "http://localhost:3000/api/ejercicios?limit=25").data
$ejercicios | Select-Object numeroEjercicio, titulo, dificultad | Format-Table

# Obtener ejercicio específico por número
Invoke-RestMethod "http://localhost:3000/api/ejercicios/numero/10"

# Crear nuevo ejercicio (requiere login admin)
$login = @{ email = "admin@ito.edu.mx"; password = "admin123" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $login -ContentType "application/json"
$headers = @{ "Authorization" = "Bearer $($loginResp.token)" }

$newEx = @{
    titulo = "Mi Ejercicio #24"
    tema = "Pruebas"
    dificultad = "media"
    descripcion = "Ejercicio de prueba"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ejercicios" `
    -Method POST `
    -Headers $headers `
    -Body $newEx `
    -ContentType "application/json"
```

---

## 📊 Comparación: ObjectId vs numeroEjercicio

| Característica | ObjectId (_id) | numeroEjercicio |
|----------------|----------------|-----------------|
| Formato | 24 chars hex | Número entero |
| Ejemplo | 68f85a7c6229e4d7798ac956 | 5 |
| Generado por | MongoDB | Middleware |
| Único | ✅ Sí | ✅ Sí |
| Fácil de recordar | ❌ No | ✅ Sí |
| Indexado | ✅ Sí | ✅ Sí |
| Uso principal | Base de datos | APIs/Testing |

---

## 🚀 Flujo Completo en Postman

### Escenario: Alumno resuelve ejercicio #10

```
1. GET /api/ejercicios/numero/10
   → Ver detalles de "Suma de números pares hasta N"

2. POST /api/auth/login (alumno)
   → Obtener token

3. POST /api/resultados
   Body:
   {
     "ejercicio": "{{ejercicioId}}",  // Del paso 1
     "correcto": true,
     "puntaje": 10,
     "tiempoSeg": 180
   }

4. GET /api/ranking
   → Ver posición actualizada
```

---

## 🎯 Resumen

✅ **Antes:**
```
Solo: /api/ejercicios/68f85a7c6229e4d7798ac956
```

✅ **Ahora:**
```
Puedes usar:
- /api/ejercicios/numero/5              (¡Más fácil!)
- /api/ejercicios/68f85a7c6229e4d7798ac956  (Sigue funcionando)
```

---

## 📌 Notas Importantes

1. **Números únicos**: Cada ejercicio tiene un número diferente
2. **No reutilizable**: Si borras un ejercicio, su número NO se reutiliza
3. **Ordenado**: Nuevos ejercicios: 24, 25, 26...
4. **23 ejercicios iniciales**: Del curriculum de Fundamentos y POO
5. **Auto-incremento**: Al crear con POST, el número se asigna automáticamente

---

**¡Ahora tienes acceso rápido a ejercicios usando números del 1 al 23!** 🎯

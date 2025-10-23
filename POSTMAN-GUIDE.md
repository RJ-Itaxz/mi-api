# 📮 Guía de Pruebas con Postman

## 🚀 Configuración Inicial

### 1. Importar la Colección en Postman

1. Abre **Postman**
2. Click en **Import** (esquina superior izquierda)
3. Selecciona el archivo: `postman_collection.json`
4. Importa también el environment: `postman_environment.json`
5. En la esquina superior derecha, selecciona el environment: **ITO API - Local Development**

### 2. Asegúrate de que el servidor esté corriendo

```powershell
npm run dev
```

El servidor debe estar en: `http://localhost:3000`

---

## 📋 Orden de Pruebas Recomendado

### PASO 1: Autenticación 🔐

#### 1.1 Login ADMIN
- **Request**: `POST - Login ADMIN`
- **Carpeta**: 🔐 Autenticación
- **Credenciales**:
  ```json
  {
    "email": "admin@ito.edu.mx",
    "password": "admin123"
  }
  ```
- ✅ **Resultado esperado**: Token guardado automáticamente en `{{adminToken}}`

#### 1.2 Login ALUMNO
- **Request**: `POST - Login ALUMNO`
- **Carpeta**: 🔐 Autenticación
- **Credenciales**:
  ```json
  {
    "email": "carlos.mendoza@alumno.ito.edu.mx",
    "password": "alumno123"
  }
  ```
- ✅ **Resultado esperado**: Token guardado automáticamente en `{{alumnoToken}}`

---

### PASO 2: Ejercicios 📚

#### 2.1 GET - Listar ejercicios
- **Request**: `GET - Listar todos los ejercicios`
- **Carpeta**: 📚 Ejercicios
- **Auth**: No requiere
- ✅ **Resultado esperado**: Lista de 10 ejercicios (paginados)

#### 2.2 GET - Filtrar por dificultad
- **Request**: `GET - Filtrar ejercicios por dificultad`
- **Carpeta**: 📚 Ejercicios
- **Query params**: `dificultad=facil&limit=5`
- ✅ **Resultado esperado**: Solo ejercicios fáciles

#### 2.3 POST - Crear ejercicio (ADMIN)
- **Request**: `POST - Crear ejercicio (ADMIN)`
- **Carpeta**: 📚 Ejercicios
- **Auth**: Bearer Token `{{adminToken}}`
- **Body**:
  ```json
  {
    "titulo": "Recursividad: Torres de Hanoi",
    "tema": "Modularidad",
    "dificultad": "dificil",
    "descripcion": "Implementa el problema clásico..."
  }
  ```
- ✅ **Resultado esperado**: Ejercicio creado, ID guardado en `{{nuevoEjercicioId}}`

#### 2.4 GET - Obtener ejercicio por ID
- **Request**: `GET - Obtener ejercicio por ID`
- **Carpeta**: 📚 Ejercicios
- **URL**: Usa `{{ejercicioId}}` (se autocompleta tras listar)
- ✅ **Resultado esperado**: Detalles del ejercicio

#### 2.5 PUT - Actualizar ejercicio (ADMIN)
- **Request**: `PUT - Actualizar ejercicio (ADMIN)`
- **Carpeta**: 📚 Ejercicios
- **Auth**: Bearer Token `{{adminToken}}`
- **URL**: Usa `{{nuevoEjercicioId}}`
- **Body**:
  ```json
  {
    "titulo": "Recursividad: Torres de Hanoi - ACTUALIZADO",
    "dificultad": "media"
  }
  ```
- ✅ **Resultado esperado**: Ejercicio actualizado

#### 2.6 DELETE - Eliminar ejercicio (ADMIN)
- **Request**: `DELETE - Eliminar ejercicio (ADMIN)`
- **Carpeta**: 📚 Ejercicios
- **Auth**: Bearer Token `{{adminToken}}`
- **URL**: Usa `{{nuevoEjercicioId}}`
- ✅ **Resultado esperado**: Ejercicio eliminado

---

### PASO 3: Alumnos 👥

#### 3.1 GET - Ver perfil y estadísticas
- **Request**: `GET - Ver perfil y estadísticas`
- **Carpeta**: 👥 Alumnos
- **Auth**: Bearer Token `{{alumnoToken}}`
- **URL**: `/api/alumnos/{{alumnoId}}`
- ✅ **Resultado esperado**: Perfil del alumno + estadísticas (puntos, correctos, intentos)

#### 3.2 GET - Ver historial de resultados
- **Request**: `GET - Ver historial de resultados`
- **Carpeta**: 👥 Alumnos
- **Auth**: Bearer Token `{{alumnoToken}}`
- ✅ **Resultado esperado**: Lista de ejercicios resueltos con detalles

#### 3.3 GET - Ver ranking del alumno
- **Request**: `GET - Ver ranking del alumno`
- **Carpeta**: 👥 Alumnos
- **Auth**: Bearer Token `{{alumnoToken}}`
- ✅ **Resultado esperado**: Posición en el ranking

#### 3.4 PATCH - Actualizar perfil
- **Request**: `PATCH - Actualizar perfil alumno`
- **Carpeta**: 👥 Alumnos
- **Auth**: Bearer Token `{{alumnoToken}}`
- **Body**:
  ```json
  {
    "nombre": "Carlos Mendoza López - ACTUALIZADO",
    "perfil": {
      "grupo": "ISC-2A",
      "semestre": 2
    }
  }
  ```
- ✅ **Resultado esperado**: Perfil actualizado

---

### PASO 4: Resultados 📊

#### 4.1 POST - Registrar resultado correcto
- **Request**: `POST - Registrar resultado correcto`
- **Carpeta**: 📊 Resultados
- **Auth**: Bearer Token `{{alumnoToken}}`
- **Body**:
  ```json
  {
    "ejercicio": "{{ejercicioId}}",
    "correcto": true,
    "puntaje": 10,
    "tiempoSeg": 180
  }
  ```
- ✅ **Resultado esperado**: Resultado registrado

#### 4.2 POST - Registrar resultado incorrecto
- **Request**: `POST - Registrar resultado incorrecto`
- **Carpeta**: 📊 Resultados
- **Auth**: Bearer Token `{{alumnoToken}}`
- **Body**:
  ```json
  {
    "ejercicio": "{{ejercicioId}}",
    "correcto": false,
    "puntaje": 3,
    "tiempoSeg": 120
  }
  ```
- ✅ **Resultado esperado**: Resultado registrado con puntaje parcial

#### 4.3 GET - Mis resultados
- **Request**: `GET - Mis resultados`
- **Carpeta**: 📊 Resultados
- **Auth**: Bearer Token `{{alumnoToken}}`
- ✅ **Resultado esperado**: Historial completo de resultados del alumno

#### 4.4 GET - Ranking global
- **Request**: `GET - Ranking global`
- **Carpeta**: 📊 Resultados
- **Auth**: No requiere
- ✅ **Resultado esperado**: Top 10 alumnos ordenados por puntaje

---

## 🎯 Prueba Completa de Flujo

### Flujo 1: Alumno resuelve ejercicio

1. **Login ALUMNO** → Obtiene token
2. **GET - Listar ejercicios** → Selecciona un ejercicio
3. **POST - Registrar resultado** → Registra que lo resolvió
4. **GET - Mis resultados** → Verifica que se guardó
5. **GET - Ranking global** → Ve su posición

### Flujo 2: Admin gestiona ejercicios

1. **Login ADMIN** → Obtiene token
2. **POST - Crear ejercicio** → Crea uno nuevo
3. **GET - Obtener ejercicio por ID** → Verifica que existe
4. **PUT - Actualizar ejercicio** → Modifica título y dificultad
5. **DELETE - Eliminar ejercicio** → Lo elimina

---

## 🔐 Pruebas de Autorización

### ❌ Casos que deben FALLAR (403 Forbidden):

1. **ALUMNO intenta crear ejercicio**:
   - Request: `POST - Crear ejercicio`
   - Auth: `{{alumnoToken}}`
   - ❌ Esperado: `403 - No autorizado`

2. **ALUMNO intenta editar ejercicio**:
   - Request: `PUT - Actualizar ejercicio`
   - Auth: `{{alumnoToken}}`
   - ❌ Esperado: `403 - No autorizado`

3. **Sin token intenta ver perfil**:
   - Request: `GET - Ver perfil y estadísticas`
   - Auth: Ninguno
   - ❌ Esperado: `401 - No autenticado`

---

## 📊 Variables de Environment

Estas se guardan automáticamente al ejecutar los requests:

| Variable | Descripción | Se setea en |
|----------|-------------|-------------|
| `baseUrl` | URL base de la API | Manual: `http://localhost:3000` |
| `adminToken` | JWT del admin | POST - Login ADMIN |
| `alumnoToken` | JWT del alumno | POST - Login ALUMNO |
| `adminId` | ID del admin | POST - Login ADMIN |
| `alumnoId` | ID del alumno | POST - Login ALUMNO |
| `ejercicioId` | ID de un ejercicio | GET - Listar ejercicios |
| `nuevoEjercicioId` | ID del ejercicio creado | POST - Crear ejercicio |

---

## 🧪 Checklist de Pruebas

### Autenticación
- [ ] POST - Registrar ADMIN (con código)
- [ ] POST - Registrar ALUMNO
- [ ] POST - Login ADMIN
- [ ] POST - Login ALUMNO
- [ ] GET - Obtener mi perfil

### Ejercicios
- [ ] GET - Listar todos
- [ ] GET - Filtrar por dificultad
- [ ] GET - Filtrar por tema
- [ ] GET - Obtener por ID
- [ ] POST - Crear (ADMIN)
- [ ] PUT - Actualizar (ADMIN)
- [ ] DELETE - Eliminar (ADMIN)

### Alumnos
- [ ] GET - Ver perfil y stats
- [ ] GET - Ver ranking
- [ ] GET - Ver historial
- [ ] PATCH - Actualizar perfil

### Resultados
- [ ] POST - Registrar correcto
- [ ] POST - Registrar incorrecto
- [ ] GET - Mis resultados
- [ ] GET - Ranking global

### LLM
- [ ] POST - Solicitar explicación
- [ ] POST - Solicitar feedback

### Seguridad
- [ ] Alumno NO puede crear ejercicios (403)
- [ ] Alumno NO puede editar ejercicios (403)
- [ ] Sin token NO puede ver perfil (401)
- [ ] Alumno NO puede ver perfil de otros (403)

---

## 💡 Tips

1. **Orden recomendado**: Siempre ejecuta primero los logins para tener los tokens
2. **Variables automáticas**: Los scripts en "Tests" guardan IDs automáticamente
3. **Ver variables**: Click en el ojo 👁️ (esquina superior derecha) para ver los valores
4. **Errores comunes**:
   - `401 Unauthorized`: Token expirado o inválido → Vuelve a hacer login
   - `403 Forbidden`: Rol incorrecto para esta operación
   - `404 Not Found`: ID de recurso no existe
   - `500 Server Error`: Revisa los logs del servidor

---

## 🎨 Ejemplos de Respuestas

### Login exitoso:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "671234abcd...",
    "nombre": "Carlos Mendoza",
    "email": "carlos.mendoza@alumno.ito.edu.mx",
    "role": "ALUMNO"
  }
}
```

### Ranking:
```json
{
  "success": true,
  "data": [
    {
      "alumnoId": "671234...",
      "nombre": "Carlos Mendoza",
      "email": "carlos.mendoza@alumno.ito.edu.mx",
      "puntos": 25,
      "correctos": 2,
      "intentos": 3
    }
  ]
}
```

---

**¡Listo para probar! 🚀**

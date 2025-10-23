# 🚀 Guía Rápida - Probar APIs con Postman

## 📥 PASO 1: Importar en Postman

### Opción A: Importar ambos archivos
1. Abre **Postman Desktop** o **Postman Web**
2. Click en **"Import"** (botón arriba a la izquierda)
3. Arrastra estos 2 archivos:
   - `postman_collection.json`
   - `postman_environment.json`
4. Click **"Import"**

### Opción B: Desde la terminal
```powershell
# Abrir Postman directamente
Start-Process "postman://app/import?path=C:\Users\Carlo\mi-api\postman_collection.json"
```

---

## ⚙️ PASO 2: Configurar el Entorno

1. En Postman, arriba a la derecha verás: **"No Environment"**
2. Click y selecciona: **"mi-api Environment"**
3. ✅ Ahora todas las variables están listas: `{{baseUrl}}`, `{{adminToken}}`, etc.

---

## 🧪 PASO 3: Probar en Orden Recomendado

### 🔐 1. AUTENTICACIÓN (Empieza aquí)

#### A) Login como Alumno
```
📁 Autenticación → 📄 Login Alumno

Click "Send"
✅ Guarda automáticamente el token en {{alumnoToken}}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "nombre": "Carlos Mendoza",
    "role": "ALUMNO"
  }
}
```

#### B) Login como Admin
```
📁 Autenticación → 📄 Login Admin

Click "Send"
✅ Guarda automáticamente el token en {{adminToken}}
```

---

### 📚 2. EJERCICIOS (CRUD Completo)

#### A) Listar Todos (Público - sin token)
```
📁 Ejercicios → 📄 Listar Ejercicios

Click "Send"
✅ Verás los 23 ejercicios del curriculum
```

#### B) Filtrar por Dificultad
```
📁 Ejercicios → 📄 Filtrar por Dificultad (Fácil)

Click "Send"
✅ Solo ejercicios fáciles (9 totales)
```

#### C) Buscar por Tema
```
📁 Ejercicios → 📄 Buscar por Tema POO

Params ya incluidos: ?q=POO
Click "Send"
```

#### D) Crear Ejercicio (Solo ADMIN)
```
📁 Ejercicios → 📄 Crear Ejercicio (Admin)

🔑 Requiere: Authorization: Bearer {{adminToken}}

Body (JSON):
{
  "titulo": "Mi Nuevo Ejercicio",
  "tema": "Testing",
  "dificultad": "media",
  "descripcion": "Creado desde Postman"
}

Click "Send"
✅ Guarda el ID en {{nuevoEjercicioId}}
```

#### E) Actualizar Ejercicio (Solo ADMIN)
```
📁 Ejercicios → 📄 Actualizar Ejercicio (Admin)

Modifica el body y click "Send"
```

#### F) Eliminar Ejercicio (Solo ADMIN)
```
📁 Ejercicios → 📄 Eliminar Ejercicio (Admin)

⚠️ Usa {{nuevoEjercicioId}} para no borrar datos del seed
```

---

### 👨‍🎓 3. ALUMNOS (Perfiles y Estadísticas)

#### A) Ver Mi Perfil
```
📁 Alumnos → 📄 Obtener Perfil Alumno

🔑 Usa: {{alumnoToken}}
URL: /api/alumnos/{{alumnoId}}

Click "Send"
✅ Verás perfil + estadísticas agregadas
```

**Respuesta incluye:**
```json
{
  "alumno": { "nombre", "email", "perfil": {...} },
  "stats": {
    "puntos": 35,
    "correctos": 3,
    "intentos": 4
  }
}
```

#### B) Ver Mi Ranking
```
📁 Alumnos → 📄 Ranking de Alumno

Muestra tu posición global
```

#### C) Ver Mis Resultados
```
📁 Alumnos → 📄 Resultados de Alumno

Historial completo con ejercicios poblados
```

#### D) Actualizar Mi Perfil
```
📁 Alumnos → 📄 Actualizar Perfil

Body:
{
  "perfil": {
    "grupo": "ISC-2B",
    "semestre": 2
  }
}
```

---

### 📊 4. RESULTADOS (Registro y Ranking)

#### A) Registrar Resultado
```
📁 Resultados → 📄 Registrar Resultado

Body:
{
  "ejercicio": "{{ejercicioId}}",
  "correcto": true,
  "puntaje": 10,
  "tiempoSeg": 120,
  "detalles": {
    "intentos": 1,
    "ayudas": 0
  }
}

Click "Send"
✅ El alumno se toma de {{alumnoToken}} automáticamente
```

#### B) Ver Mis Resultados
```
📁 Resultados → 📄 Obtener Mis Resultados

Lista todos tus intentos
```

#### C) Ranking Global
```
📁 Resultados → 📄 Ranking Global (Top 10)

Sin autenticación requerida
Muestra los mejores alumnos
```

---

### 🏆 5. RANKING

```
📁 Ranking → 📄 Ranking Top 10

Endpoint dedicado: /api/ranking?top=10
```

---

### 🤖 6. LLM (Stubs para Gemini)

#### A) Solicitar Explicación
```
📁 LLM → 📄 Explicación de Ejercicio

Body:
{
  "ejercicioId": "{{ejercicioId}}",
  "contexto": "No entiendo cómo usar clases"
}
```

#### B) Feedback de Código
```
📁 LLM → 📄 Feedback de Código

Body:
{
  "codigo": "class Persona:\n  pass",
  "ejercicioId": "{{ejercicioId}}"
}
```

---

## 🎯 Escenarios de Prueba Completos

### Escenario 1: Alumno Resuelve Ejercicio
1. **Login Alumno** → Obtén token
2. **Listar Ejercicios** → Escoge uno (guarda el ID)
3. **Registrar Resultado** → Envía tu respuesta
4. **Ver Mis Resultados** → Verifica que se guardó
5. **Ranking Global** → Mira tu posición

### Escenario 2: Admin Gestiona Ejercicios
1. **Login Admin** → Obtén token admin
2. **Crear Ejercicio** → Nuevo ejercicio
3. **Listar Ejercicios** → Verifica que aparece
4. **Actualizar Ejercicio** → Modifica descripción
5. **Eliminar Ejercicio** → Limpia ejercicio de prueba

### Escenario 3: Autorización RBAC
1. **Login Alumno**
2. **Intentar Crear Ejercicio** con `{{alumnoToken}}`
   - ❌ Debe retornar 403 Forbidden
3. **Login Admin**
4. **Crear Ejercicio** con `{{adminToken}}`
   - ✅ Debe funcionar

---

## 🔍 Verificar Variables de Entorno

Click en el icono del **👁️ ojo** arriba a la derecha:

```
✅ baseUrl: http://localhost:3000
✅ adminToken: eyJhbGci... (después del login)
✅ alumnoToken: eyJhbGci... (después del login)
✅ adminId: 68f84933...
✅ alumnoId: 68f84933...
✅ ejercicioId: 68f84933...
✅ nuevoEjercicioId: (se llena al crear)
```

---

## ⚠️ Troubleshooting

### Error: "Cannot connect to server"
```powershell
# Verifica que el servidor esté corriendo
npm run dev
```

### Error: "Token inválido"
1. Vuelve a hacer login (Admin o Alumno)
2. El token se guarda automáticamente en las variables

### Error: 403 Forbidden
- Verifica que estás usando el token correcto:
  - `{{adminToken}}` para crear/editar/eliminar ejercicios
  - `{{alumnoToken}}` para registrar resultados

### No veo las variables
1. Asegúrate de seleccionar **"mi-api Environment"** arriba a la derecha
2. Re-importa `postman_environment.json`

---

## 📱 Tips Avanzados

### 1. Ver Requests como cURL
Click en **"Code"** (lado derecho) → Selecciona "cURL"

### 2. Tests Automáticos
Cada request tiene **Tests** que:
- Verifican status 200/201
- Guardan tokens automáticamente
- Validan estructura JSON

### 3. Ejecutar Collection Completa
1. Click derecho en "mi-api Collection"
2. **"Run collection"**
3. Ver todos los tests pasar ✅

---

## 🎓 Datos de Prueba

### Credenciales
```
Admin:
- Email: admin@ito.edu.mx
- Password: admin123

Alumno 1:
- Email: carlos.mendoza@alumno.ito.edu.mx
- Password: alumno123

Alumno 2:
- Email: maria.garcia@alumno.ito.edu.mx
- Password: alumno123
```

### Ejercicios Disponibles
- **9 fáciles**: Operadores, Variables, If-Else, etc.
- **9 medios**: Arreglos, Funciones, POO básico
- **5 difíciles**: Herencia, Polimorfismo, Excepciones

---

## 🚀 Próximos Pasos

1. ✅ Probar todos los endpoints
2. ✅ Verificar autorización RBAC
3. ✅ Registrar resultados y ver ranking
4. 🔜 Integrar Gemini API en `/api/llm/*`
5. 🔜 Frontend móvil (React Native / Flutter)

---

**¿Listo para probar?** 🎯

1. Importa los archivos en Postman
2. Selecciona el environment "mi-api Environment"
3. Empieza con "Login Alumno" o "Login Admin"
4. ¡Explora todos los endpoints!

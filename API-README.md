# API de Asistente Virtual - Instituto Tecnológico de Oaxaca

API REST para el proyecto de asistente virtual móvil con inteligencia artificial para mejorar el aprendizaje de lenguajes de programación en la carrera de Ingeniería en Sistemas Computacionales.

## 🚀 Inicio Rápido

### 1. Instalación
```powershell
npm install
```

### 2. Configurar Variables de Entorno
El archivo `.env` ya está configurado con:
- `MONGODB_URI`: Conexión a MongoDB local
- `JWT_SECRET`: Clave secreta para tokens JWT
- `ADMIN_REG_CODE`: Código para registrar administradores

### 3. Poblar Base de Datos
```powershell
npm run seed
```

Esto crea:
- 1 usuario ADMIN
- 2 usuarios ALUMNO
- 23 ejercicios (Fundamentos de Programación + POO)
- 5 resultados de ejemplo

### 4. Iniciar Servidor
```powershell
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 👤 Credenciales de Prueba

### Administrador
- **Email**: `admin@ito.edu.mx`
- **Password**: `admin123`

### Alumnos
- **Email**: `carlos.mendoza@alumno.ito.edu.mx` | **Password**: `alumno123`
- **Email**: `maria.garcia@alumno.ito.edu.mx` | **Password**: `alumno123`

## 📚 Endpoints de la API

### Autenticación (`/api/auth`)

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@alumno.ito.edu.mx",
  "password": "123456",
  "role": "ALUMNO",
  "perfil": {
    "grupo": "ISC-1A",
    "semestre": 1,
    "carrera": "ISC"
  }
}
```

**Para registrar ADMIN** (requiere código):
```json
{
  "nombre": "Admin",
  "email": "admin@example.com",
  "password": "123456",
  "role": "ADMIN",
  "adminCode": "ITO-ADMIN-2025"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ito.edu.mx",
  "password": "admin123"
}
```

**Respuesta**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "nombre": "Administrador ITO",
    "email": "admin@ito.edu.mx",
    "role": "ADMIN"
  }
}
```

#### Obtener Usuario Actual
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Ejercicios (`/api/ejercicios`)

#### Listar Ejercicios (público)
```http
GET /api/ejercicios?tema=Control%20de%20Flujo&dificultad=facil&page=1&limit=10
```

**Parámetros**:
- `tema`: Filtrar por tema
- `dificultad`: `facil`, `media`, `dificil`
- `q`: Buscar por título
- `page`: Número de página (default: 1)
- `limit`: Ejercicios por página (default: 10)

#### Obtener Ejercicio por ID
```http
GET /api/ejercicios/:id
```

#### Crear Ejercicio (solo ADMIN)
```http
POST /api/ejercicios
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "titulo": "Bucles anidados",
  "tema": "Control de Flujo",
  "dificultad": "media",
  "descripcion": "Implementa un patrón de asteriscos usando bucles anidados."
}
```

#### Actualizar Ejercicio (solo ADMIN)
```http
PUT /api/ejercicios/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "titulo": "Título actualizado",
  "dificultad": "dificil",
  "activo": true
}
```

#### Eliminar Ejercicio (solo ADMIN)
```http
DELETE /api/ejercicios/:id
Authorization: Bearer <admin-token>
```

### Alumnos (`/api/alumnos`)

#### Obtener Perfil y Estadísticas
```http
GET /api/alumnos/:id
Authorization: Bearer <token>
```
*Requiere ser el mismo alumno o ADMIN*

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "alumno": {
      "_id": "...",
      "nombre": "Carlos Mendoza",
      "email": "carlos.mendoza@alumno.ito.edu.mx",
      "role": "ALUMNO",
      "perfil": {
        "grupo": "ISC-1A",
        "semestre": 1,
        "carrera": "ISC"
      }
    },
    "stats": {
      "puntos": 25,
      "correctos": 2,
      "intentos": 3
    }
  }
}
```

#### Ver Ranking del Alumno
```http
GET /api/alumnos/:id/ranking
Authorization: Bearer <token>
```

#### Ver Historial de Resultados
```http
GET /api/alumnos/:id/resultados
Authorization: Bearer <token>
```

#### Actualizar Perfil
```http
PATCH /api/alumnos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Carlos Mendoza López",
  "perfil": {
    "grupo": "ISC-2A",
    "semestre": 2
  }
}
```

### Resultados (`/api/resultados`)

#### Registrar Resultado (ALUMNO/ADMIN)
```http
POST /api/resultados
Authorization: Bearer <alumno-token>
Content-Type: application/json

{
  "ejercicio": "67890abcdef...",
  "correcto": true,
  "puntaje": 10,
  "tiempoSeg": 120,
  "detalles": {
    "intentos": 2,
    "ayudaSolicitada": false
  }
}
```

#### Ver Mis Resultados
```http
GET /api/resultados/mios
Authorization: Bearer <token>
```

#### Ranking Global
```http
GET /api/resultados/ranking?top=10
```

### Ranking (`/api/ranking`)

#### Ver Ranking (alias)
```http
GET /api/ranking?top=20
```

### LLM - Asistente Virtual (`/api/llm`)

#### Solicitar Explicación
```http
POST /api/llm/explicacion
Authorization: Bearer <token>
Content-Type: application/json

{
  "pregunta": "¿Qué es un arreglo multidimensional?",
  "tema": "Organización de datos"
}
```

#### Solicitar Retroalimentación
```http
POST /api/llm/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo": "int main() { printf(\"Hello\"); }",
  "lenguaje": "C"
}
```

*Nota: Actualmente devuelven respuestas simuladas. Para integrar Gemini u otro LLM real, edita `src/routes/llm.js`*

## 🔐 Autorización por Roles

| Recurso | ALUMNO | ADMIN |
|---------|--------|-------|
| Login/Register | ✅ | ✅ |
| Ver ejercicios | ✅ | ✅ |
| Resolver ejercicios | ✅ | ❌ |
| Crear/Editar/Eliminar ejercicios | ❌ | ✅ |
| Ver ranking | ✅ | ✅ |
| Ver resultados propios | ✅ | ✅ |
| Ver resultados de otros | ❌ | ✅ |
| Acceso a LLM | ✅ | ✅ |
| Gestión de usuarios | ❌ | ✅ |

## 📊 Contenido de Ejercicios

Los ejercicios cubren los temas del plan de estudios:

### Fundamentos de Programación
1. **Diseño Algorítmico**: Pseudocódigo, diagramas de flujo, funciones
2. **Introducción a la Programación**: Variables, tipos de datos, operadores
3. **Control de Flujo**: Condicionales, ciclos (while, for, do-while)
4. **Organización de datos**: Arreglos unidimensionales/multidimensionales, estructuras
5. **Modularidad**: Funciones, paso de parámetros

### Programación Orientada a Objetos
1. **Clases y Objetos**: Atributos, métodos, encapsulamiento, constructores
2. **Herencia**: Simple y múltiple, reutilización
3. **Polimorfismo**: Interfaces, clases abstractas, plantillas
4. **Excepciones**: Try-catch, manejo de errores
5. **Flujos y Archivos**: Lectura/escritura de archivos

## 🧪 Ejemplos PowerShell

### Login y crear ejercicio (ADMIN)
```powershell
# Login
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{
  "email":"admin@ito.edu.mx",
  "password":"admin123"
}'

$token = $login.token
$headers = @{ "Content-Type"="application/json"; "Authorization"="Bearer $token" }

# Crear ejercicio
$ej = Invoke-RestMethod -Uri "http://localhost:3000/api/ejercicios" -Method POST -Headers $headers -Body '{
  "titulo":"Recursividad: Fibonacci",
  "tema":"Modularidad",
  "dificultad":"dificil",
  "descripcion":"Implementa la serie de Fibonacci usando recursión."
}'

Write-Host "Ejercicio creado con ID: $($ej.data._id)"
```

### Resolver ejercicio y ver ranking (ALUMNO)
```powershell
# Login alumno
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{
  "email":"carlos.mendoza@alumno.ito.edu.mx",
  "password":"alumno123"
}'

$token = $login.token
$alumnoId = $login.user.id
$headers = @{ "Content-Type"="application/json"; "Authorization"="Bearer $token" }

# Listar ejercicios
$ejercicios = Invoke-RestMethod -Uri "http://localhost:3000/api/ejercicios?dificultad=facil&limit=1" -Method GET
$ejercicioId = $ejercicios.data[0]._id

# Registrar resultado
Invoke-RestMethod -Uri "http://localhost:3000/api/resultados" -Method POST -Headers $headers -Body "{
  `"ejercicio`":`"$ejercicioId`",
  `"correcto`":true,
  `"puntaje`":10,
  `"tiempoSeg`":90
}"

# Ver ranking
$ranking = Invoke-RestMethod -Uri "http://localhost:3000/api/ranking?top=10" -Method GET
$ranking.data | Format-Table
```

## 🗄️ Modelos de Datos

### Usuario
```javascript
{
  nombre: String,
  email: String (único),
  password: String (encriptado),
  role: 'ADMIN' | 'ALUMNO',
  perfil: {
    grupo: String,
    semestre: Number,
    carrera: String
  },
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Ejercicio
```javascript
{
  titulo: String,
  tema: String,
  dificultad: 'facil' | 'media' | 'dificil',
  descripcion: String,
  autor: ObjectId (Usuario),
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Resultado
```javascript
{
  alumno: ObjectId (Usuario),
  ejercicio: ObjectId (Ejercicio),
  correcto: Boolean,
  puntaje: Number,
  tiempoSeg: Number,
  detalles: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Comandos Útiles

```powershell
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start

# Poblar base de datos
npm run seed

# Ver logs de MongoDB (en MongoDB Compass)
# Conectar a: mongodb://localhost:27017
# Base de datos: mi-api-db
```

## 📁 Estructura del Proyecto

```
mi-api/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración MongoDB
│   ├── middlewares/
│   │   └── auth.js              # JWT y autorización por roles
│   ├── models/
│   │   ├── Usuario.js           # Modelo de usuario
│   │   ├── Ejercicio.js         # Modelo de ejercicio
│   │   └── Resultado.js         # Modelo de resultado
│   ├── routes/
│   │   ├── auth.js              # Autenticación
│   │   ├── alumnos.js           # Gestión de alumnos
│   │   ├── ejercicios.js        # CRUD de ejercicios
│   │   ├── resultados.js        # Registro de resultados
│   │   ├── ranking.js           # Ranking global
│   │   └── llm.js               # Integración con LLM
│   ├── scripts/
│   │   └── seed.js              # Script de población
│   └── server.js                # Servidor principal
├── .env                         # Variables de entorno
├── package.json
└── README.md
```

## 🔒 Seguridad

- **JWT**: Tokens con expiración de 7 días
- **Bcrypt**: Contraseñas encriptadas con salt de 10 rondas
- **CORS**: Habilitado para desarrollo
- **Middlewares**: Autenticación y autorización por roles
- **Código de Administrador**: Protege registro de usuarios ADMIN

## 🚧 Próximas Mejoras

- [ ] Integración real con Gemini API
- [ ] Rate limiting para endpoints de LLM
- [ ] Validación de esquemas con Joi o Zod
- [ ] Tests unitarios y de integración
- [ ] Paginación mejorada con cursores
- [ ] Filtros avanzados de búsqueda
- [ ] Sistema de notificaciones
- [ ] Exportación de reportes (PDF/Excel)

## 📄 Licencia

ISC

---

**Instituto Tecnológico de Oaxaca - Ingeniería en Sistemas Computacionales**

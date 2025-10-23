# 🔢 Guía de Uso: numeroUsuario

## 📌 ¿Qué es?

Ahora **todos los usuarios** tienen un **número consecutivo** (1, 2, 3...) además del ObjectId de MongoDB, lo que facilita las pruebas y el acceso rápido.

---

## 👥 Usuarios con Números Asignados

```
#1 → Administrador ITO    (ADMIN)
#2 → Carlos Mendoza       (ALUMNO)
#3 → María García         (ALUMNO)
#4 → Próximo usuario...   (auto-incrementa)
```

---

## 🔗 Nuevo Endpoint

### **GET** `/api/usuarios/numero/:numero`

Obtiene un usuario por su número consecutivo.

#### Ejemplo en PowerShell:
```powershell
# Usuario #1 (Admin)
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/numero/1" -Method GET

# Usuario #2 (Carlos)
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/numero/2" -Method GET

# Usuario #3 (María)
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/numero/3" -Method GET
```

#### Ejemplo en Postman:
```
GET http://localhost:3000/api/usuarios/numero/2
```

#### Respuesta:
```json
{
  "success": true,
  "data": {
    "_id": "68f85463e658b8612c126b4a",
    "numeroUsuario": 2,
    "nombre": "Carlos Mendoza",
    "email": "carlos.mendoza@alumno.ito.edu.mx",
    "role": "ALUMNO",
    "perfil": {
      "grupo": "ISC-1A",
      "semestre": 1,
      "carrera": "ISC"
    },
    "activo": true
  }
}
```

---

## 🔐 Login Actualizado

Ahora el login también retorna el `numeroUsuario`:

```json
POST /api/auth/login
Body:
{
  "email": "carlos.mendoza@alumno.ito.edu.mx",
  "password": "alumno123"
}

Respuesta:
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": "68f85463e658b8612c126b4a",
    "numeroUsuario": 2,           ← NUEVO CAMPO
    "nombre": "Carlos Mendoza",
    "email": "carlos.mendoza@alumno.ito.edu.mx",
    "role": "ALUMNO"
  }
}
```

---

## 📚 Endpoints Disponibles

### 1️⃣ Obtener Usuario por Número
```
GET /api/usuarios/numero/:numero
```
**Ejemplo:** `/api/usuarios/numero/2`

### 2️⃣ Obtener Usuario por ID MongoDB
```
GET /api/usuarios/:id
```
**Ejemplo:** `/api/usuarios/68f85463e658b8612c126b4a`

### 3️⃣ Listar Todos los Usuarios
```
GET /api/usuarios
```
**Nota:** Retorna todos los usuarios ordenados por `numeroUsuario`

---

## 🎯 Casos de Uso en Postman

### Caso 1: Obtener datos de un usuario específico
```
1. GET /api/usuarios/numero/2
2. Verás toda la información de Carlos Mendoza
```

### Caso 2: Probar con diferentes usuarios
```
# Admin
GET /api/usuarios/numero/1

# Alumno 1
GET /api/usuarios/numero/2

# Alumno 2
GET /api/usuarios/numero/3
```

### Caso 3: Crear una variable en Postman
```
1. En Postman Environment, agrega:
   - numeroUsuario: 2

2. Usa en las URLs:
   GET {{baseUrl}}/api/usuarios/numero/{{numeroUsuario}}
```

---

## 🔄 Auto-incremento Automático

Cuando creas un nuevo usuario (registro), el `numeroUsuario` se asigna automáticamente:

```json
POST /api/auth/register
Body:
{
  "nombre": "Nuevo Alumno",
  "email": "nuevo@alumno.ito.edu.mx",
  "password": "alumno456",
  "perfil": {
    "grupo": "ISC-1B",
    "semestre": 1,
    "carrera": "ISC"
  }
}

Respuesta:
{
  "user": {
    "numeroUsuario": 4,  ← Auto-asignado
    "nombre": "Nuevo Alumno",
    ...
  }
}
```

---

## ⚠️ Notas Importantes

1. **Números únicos:** Cada usuario tiene un número diferente
2. **No reutilizable:** Si borras un usuario, su número NO se reutiliza
3. **Ordenado:** Los usuarios se crean en orden: 1, 2, 3, 4...
4. **Independiente del ObjectId:** El número es diferente al `_id` de MongoDB

---

## 🧪 Pruebas Rápidas en PowerShell

```powershell
# 1. Ver todos los números de usuario
$usuarios = (Invoke-RestMethod "http://localhost:3000/api/usuarios").data
$usuarios | Select-Object numeroUsuario, nombre, email, role | Format-Table

# 2. Obtener usuario específico
Invoke-RestMethod "http://localhost:3000/api/usuarios/numero/2"

# 3. Login y ver tu número
$login = @{ email = "carlos.mendoza@alumno.ito.edu.mx"; password = "alumno123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $login -ContentType "application/json"
Write-Host "Tu número de usuario es: $($response.user.numeroUsuario)"
```

---

## 📊 Comparación: ObjectId vs numeroUsuario

| Característica | ObjectId (_id) | numeroUsuario |
|----------------|----------------|---------------|
| Formato | 24 chars hex | Número entero |
| Ejemplo | 68f85463e658b8612c126b4a | 2 |
| Generado por | MongoDB | Middleware |
| Único | ✅ Sí | ✅ Sí |
| Fácil de recordar | ❌ No | ✅ Sí |
| Indexado | ✅ Sí | ✅ Sí |
| Uso principal | Base de datos | APIs/Testing |

---

## 🚀 Resumen

✅ **Antes:**
```
Solo podías usar: /api/usuarios/68f85463e658b8612c126b4a
```

✅ **Ahora:**
```
Puedes usar:
- /api/usuarios/numero/2              (¡Más fácil!)
- /api/usuarios/68f85463e658b8612c126b4a  (Sigue funcionando)
```

---

## 📱 Próximos Pasos

1. **Importa la colección actualizada** en Postman (si hay actualización)
2. **Prueba el nuevo endpoint:** `/api/usuarios/numero/:numero`
3. **Verifica en el login** que ahora retorna `numeroUsuario`
4. **Usa números consecutivos** para pruebas rápidas

---

**¿Dudas?** Este sistema hace que las pruebas sean mucho más simples:
- En vez de copiar IDs largos, solo usa 1, 2, 3... 🎯

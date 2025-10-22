# Mi API - Conexión con MongoDB

## 📋 Pasos para conectar con MongoDB Compass

### 1. Asegúrate de tener MongoDB Community Edition instalado y corriendo

Verifica que el servicio de MongoDB esté activo:
```powershell
# En PowerShell como Administrador
Get-Service MongoDB
```

Si no está corriendo, inícialo:
```powershell
Start-Service MongoDB
```

### 2. Conectar con MongoDB Compass

1. Abre **MongoDB Compass**
2. En la pantalla de conexión, usa esta URI:
   ```
   mongodb://localhost:27017
   ```
3. Haz clic en **Connect**
4. Verás tu base de datos `mi-api-db` aparecer cuando crees el primer registro

### 3. Probar la API

El servidor debe estar corriendo en `http://localhost:3000`

#### Crear un usuario (POST)
```powershell
# Con PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"nombre":"Juan Pérez","email":"juan@example.com","password":"123456"}'
```

O usa **Postman/Thunder Client**:
- URL: `http://localhost:3000/api/usuarios`
- Method: `POST`
- Body (JSON):
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

#### Obtener todos los usuarios (GET)
```
GET http://localhost:3000/api/usuarios
```

#### Obtener un usuario por ID (GET)
```
GET http://localhost:3000/api/usuarios/{id}
```

#### Actualizar usuario (PUT)
```
PUT http://localhost:3000/api/usuarios/{id}
```
Body:
```json
{
  "nombre": "Juan Actualizado",
  "email": "juan.nuevo@example.com"
}
```

#### Eliminar usuario (DELETE)
```
DELETE http://localhost:3000/api/usuarios/{id}
```

### 4. Ver los datos en MongoDB Compass

1. En MongoDB Compass, actualiza la vista
2. Verás la base de datos `mi-api-db`
3. Dentro encontrarás la colección `usuarios`
4. Haz clic en la colección para ver los documentos guardados

## 🗂️ Estructura del Proyecto

```
mi-api/
├── src/
│   ├── config/
│   │   └── database.js      # Configuración de MongoDB
│   ├── models/
│   │   └── Usuario.js       # Modelo de Usuario
│   ├── routes/
│   │   └── usuarios.js      # Rutas de usuarios
│   └── server.js            # Servidor principal
├── .env                     # Variables de entorno
└── package.json
```

## ⚙️ Variables de Entorno (.env)

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mi-api-db
```

## 🚀 Comandos

```powershell
# Iniciar servidor en desarrollo
npm run dev

# Iniciar servidor en producción
npm start
```

## 📝 Notas

- Las contraseñas se guardan encriptadas con bcrypt
- Timestamps automáticos (createdAt, updatedAt)
- Validaciones en el modelo
- Manejo de errores en todas las rutas

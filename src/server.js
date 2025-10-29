require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { isConfigured } = require('../services/geminiClient'); // <-- nuevo

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/alumnos', require('./routes/alumnos'));
app.use('/api/ejercicios', require('./routes/ejercicios'));
app.use('/api/resultados', require('./routes/resultados'));
app.use('/api/ranking', require('./routes/ranking'));
// Rutas LLM (usar la que existe dentro de src)
app.use('/api/llm', require('./routes/llm'));
// Rutas de evaluación (evaluar ejercicios / sesiones)
app.use('/api/evaluacion', require('./routes/evaluacion'));

// Rutas jerárquicas adicionales (consolidadas desde el server.js raíz)
app.use('/api/materias', require('./routes/materias'));
app.use('/api/materias/:materiaId/unidades', require('./routes/unidades'));
app.use('/api/unidades', require('./routes/unidades'));
app.use('/api/unidades/:unidadId/temas', require('./routes/temas'));
app.use('/api/temas', require('./routes/temas'));
app.use('/api/temas/:temaId/ejercicios', require('./routes/ejercicios'));
app.use('/api/temas/:temaId/informacion', require('./routes/informacion'));
app.use('/api/informacion', require('./routes/informacion'));
app.use('/api/ejercicios/:ejercicioId/resultados', require('./routes/resultados'));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido a mi API',
    status: 'OK'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada' 
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor' 
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Gemini configurado: ${isConfigured()}`); // <-- log útil
});
// nodemon: reload marker

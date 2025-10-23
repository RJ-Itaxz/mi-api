'use strict';

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Quitar el throw a nivel de módulo y agregar un fallback de fetch (Node <=17)
const fetchFn = typeof fetch === 'function'
  ? fetch
  : (...args) => import('node-fetch').then(m => m.default(...args));

/**
 * generateText
 * params:
 *  - prompt: string (requerido)
 *  - system: string (opcional)
 *  - model, temperature, maxOutputTokens, topP, topK (opcionales)
 */
async function generateText({
  prompt,
  system,
  model = DEFAULT_MODEL,
  temperature = 0.4,
  maxOutputTokens = 1024,
  topP = 0.95,
  topK = 40
} = {}) {
  if (!prompt) throw new Error('prompt is required');
  if (!API_KEY) throw new Error('Missing GOOGLE_GEMINI_API_KEY in environment.');
  const url = `${BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(API_KEY)}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }]}],
    generationConfig: { temperature, maxOutputTokens, topP, topK }
  };
  if (system) {
    body.systemInstruction = { role: 'system', parts: [{ text: system }] };
  }

  const res = await fetchFn(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText;
    const code = data?.error?.code || res.status;
    throw new Error(`Gemini API error ${code}: ${msg}`);
  }

  const text = (data.candidates || [])
    .flatMap(c => (c.content?.parts || []).map(p => p.text || ''))
    .join('')
    .trim();

  return { text, raw: data };
}

// Comprobar configuración
function isConfigured() {
  return Boolean(API_KEY);
}

// Self-test sencillo para verificar conectividad/respuesta
async function selfTest() {
  if (!API_KEY) {
    return { ok: false, reason: 'Missing GOOGLE_GEMINI_API_KEY' };
  }
  try {
    const { text } = await generateText({ prompt: 'ping' });
    return { ok: true, sample: text?.slice(0, 80) };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

const express = require('express');
const llmRouter = require('./routes/llm.routes');

const app = express();

app.use(express.json());
app.use('/api/llm', llmRouter);

// Asegúrate que cualquier middleware 404 venga DESPUÉS de montar /api/llm
// app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = app;
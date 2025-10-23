'use strict';

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const API_VERSION = process.env.GEMINI_API_VERSION || 'v1';
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const BASE = `https://generativelanguage.googleapis.com/${API_VERSION}`;

// Quitar el throw a nivel de módulo y agregar un fallback de fetch (Node <=17)
const fetchFn = typeof fetch === 'function'
  ? fetch
  : (...args) => import('node-fetch').then(m => m.default(...args));

// Quita el prefijo "models/" si viene desde ListModels
function normalizeModel(name) {
  return (name || '').replace(/^models\//, '');
}

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
  model = normalizeModel(model);
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

// Listar modelos disponibles (útil para diagnosticar 404/soporte)
async function listModels() {
  if (!API_KEY) throw new Error('Missing GOOGLE_GEMINI_API_KEY in environment.');
  const url = `${BASE}/models?key=${encodeURIComponent(API_KEY)}`;
  const res = await fetchFn(url, { method: 'GET' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText;
    const code = data?.error?.code || res.status;
    throw new Error(`Gemini API error ${code}: ${msg}`);
  }
  return (data.models || []).map(m => ({
    name: m.name,
    displayName: m.displayName,
    supported: m.supportedGenerationMethods
  }));
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
    return { ok: true, sample: text?.slice(0, 80), model: DEFAULT_MODEL, version: API_VERSION };
  } catch (err) {
    return { ok: false, reason: err.message, model: DEFAULT_MODEL, version: API_VERSION };
  }
}

module.exports = { generateText, isConfigured, selfTest, listModels };

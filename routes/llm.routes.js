const express = require('express');
const router = express.Router();
const { selfTest, generateText, isConfigured, listModels } = require('../services/geminiClient');

router.get('/health', async (req, res) => {
  try {
    const status = await selfTest();
    res.status(status.ok ? 200 : 503).json({ configured: isConfigured(), ...status });
  } catch (e) {
    res.status(500).json({ configured: isConfigured(), ok: false, reason: e.message });
  }
});

router.post('/generate', async (req, res) => {
  const { prompt, system, temperature, maxOutputTokens, topP, topK, model } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });
  try {
    const { text } = await generateText({ prompt, system, temperature, maxOutputTokens, topP, topK, model });
    res.json({ text });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

router.get('/models', async (req, res) => {
  try {
    const models = await listModels();
    res.json({ models });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

module.exports = router;

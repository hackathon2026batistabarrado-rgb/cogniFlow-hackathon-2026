// backend/routes/agents.js
const express = require('express');
const router = express.Router();

// Importar agentes
const calmGuard = require('../agents/calmGuard');

// ==================== CALMGUARD ====================
router.post('/calmguard', async (req, res) => {
  try {
    const { texto, agenteOrigem } = req.body;
    console.log(`🛡️ CalmGuard: validando texto de ${agenteOrigem}`);
    console.log(`📝 Texto original: "${texto}"`);
    
    const resultado = await calmGuard.validar(texto, agenteOrigem);
    
    console.log(`✅ Texto validado: "${resultado.texto_validado}"`);
    
    res.json({
      success: true,
      agent: 'CalmGuard',
      ...resultado,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// ==================== FOCUSAGENT ====================
router.post('/focus', async (req, res) => {
  try {
    const { tarefa } = req.body;
    console.log('🎯 FocusAgent chamado');
    
    res.json({
      success: true,
      agent: 'FocusAgent',
      intervencao: `## 📋 Tarefas organizadas\n\n1. ${tarefa || 'Definir objetivo'}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CONTEXTAGENT ====================
router.post('/context', async (req, res) => {
  try {
    console.log('🔍 ContextAgent chamado');
    res.json({
      success: true,
      agent: 'ContextAgent',
      resumo_claro: 'Vamos esclarecer o contexto.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PHONAGENT ====================
router.post('/phon', async (req, res) => {
  try {
    const { texto } = req.body;
    console.log('📖 PhonAgent chamado');
    
    let textoCorrigido = texto || '';
    textoCorrigido = textoCorrigido
      .replace(/dazer/gi, 'fazer')
      .replace(/documendo/gi, 'documento');
    
    res.json({
      success: true,
      agent: 'PhonAgent',
      textoCorrigido: textoCorrigido
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== NOTIFYAGENT ====================
router.post('/notify', async (req, res) => {
  try {
    const { tempoInativo } = req.body;
    console.log(`🔔 NotifyAgent chamado (inativo: ${tempoInativo}s)`);
    
    res.json({
      success: true,
      agent: 'NotifyAgent',
      deve_notificar: tempoInativo > 30,
      mensagem_titulo: '⏸️ Pausa detectada',
      mensagem_corpo: tempoInativo > 60 ? 'Quer retomar onde parou?' : 'Precisa de ajuda?'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== BLENDIT ====================
router.post('/blendit', async (req, res) => {
  try {
    console.log('🔄 BlendIt chamado');
    res.json({
      success: true,
      agent: 'BlendIt',
      intervencao_final: 'Vamos organizar as tarefas juntos.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
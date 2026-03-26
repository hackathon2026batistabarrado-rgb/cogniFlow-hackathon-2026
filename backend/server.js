// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');

console.log('🚀 Iniciando servidor CogniFlow...');

// Importar serviços
let cosmos, rag, profileSenseService;

try {
  cosmos = require('./services/cosmos');
  console.log('✅ Cosmos carregado');
} catch (e) {
  console.warn('⚠️ Cosmos não disponível:', e.message);
  cosmos = null;
}

try {
  rag = require('./services/rag');
  console.log('✅ RAG carregado');
} catch (e) {
  console.warn('⚠️ RAG não disponível:', e.message);
  rag = null;
}

try {
  profileSenseService = require('./services/profilesense');
  console.log('✅ ProfileSense carregado');
} catch (e) {
  console.warn('⚠️ ProfileSense não disponível:', e.message);
  profileSenseService = null;
}

// Importar rotas
const agents = require('./routes/agents');
const data = require('./routes/data');
const profileSenseRoutes = require('./routes/profilesense');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== ROTAS ====================
app.use('/api/agents', agents);
app.use('/api', data);
app.use('/api/profilesense', profileSenseRoutes);

// ==================== ROTA HEALTH CHECK ====================
app.get('/api/health', async (req, res) => {
  try {
    const stats = await cosmos.estatisticas();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        mode: stats.modo,
        connected: cosmos.connected(),
        registros: stats.registros,
        cacheSize: stats.cacheSize
      },
      services: {
        cosmos: cosmos.connected(),
        rag: rag ? true : false,
        profilesense: profileSenseService ? true : false
      }
    });
  } catch (error) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        mode: 'in-memory',
        connected: false,
        error: error.message
      }
    });
  }
});

// ==================== ROTA DB STATUS ====================
app.get('/api/db-status', async (req, res) => {
  try {
    const stats = await cosmos.estatisticas();
    res.json({
      mode: stats.modo,
      connected: cosmos.connected(),
      registros: stats.registros,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      mode: 'in-memory',
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== ROTA RAG ====================
app.get('/api/rag/historico/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;
    
    console.log(`🔍 RAG: buscando histórico para ${userId} (limit: ${limit})`);
    
    let historico = [];
    let perfil = null;
    let fonte = 'cache';
    
    if (rag && typeof rag.buscarHistorico === 'function') {
      const result = await rag.buscarHistorico(userId, { limit: parseInt(limit) });
      if (result.success) {
        historico = result.historico.itens || [];
        perfil = result.historico.perfil;
        fonte = result.fonte;
      }
    }
    
    res.json({
      success: true,
      userId,
      total: historico.length,
      historico: historico,
      perfil: perfil,
      fonte: fonte,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro no RAG:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ROTA EVENTOS ====================
app.post('/api/eventos', async (req, res) => {
  try {
    const evento = req.body;
    console.log(`📊 Evento recebido: ${evento.tipo || 'desconhecido'}`);
    if (cosmos && typeof cosmos.salvar === 'function') {
      await cosmos.salvar('eventos', { ...evento, timestamp: new Date().toISOString() });
    }
    res.json({ success: true, message: 'Evento registrado' });
  } catch (error) {
    console.error('❌ Erro ao salvar evento:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/eventos', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    let eventos = [];
    if (cosmos && typeof cosmos.listar === 'function') {
      eventos = await cosmos.listar('eventos', parseInt(limit));
    }
    res.json({ success: true, total: eventos.length, eventos: eventos });
  } catch (error) {
    console.error('❌ Erro ao listar eventos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ROTA PRINCIPAL ====================
app.get('/', (req, res) => {
  res.json({
    nome: 'CogniFlow API',
    versao: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      dbStatus: 'GET /api/db-status',
      agents: {
        focus: 'POST /api/agents/focus',
        context: 'POST /api/agents/context',
        phon: 'POST /api/agents/phon',
        calmguard: 'POST /api/agents/calmguard',
        notify: 'POST /api/agents/notify',
        blendit: 'POST /api/agents/blendit'
      },
      rag: { historico: 'GET /api/rag/historico/:userId' },
      eventos: { listar: 'GET /api/eventos', criar: 'POST /api/eventos' },
      profilesense: { classificar: 'GET /api/profilesense/classify', register: 'POST /api/profilesense/register' }
    }
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    error: `Rota não encontrada: ${req.method} ${req.path}`,
    endpoints_disponiveis: [
      'GET /',
      'GET /api/health',
      'GET /api/db-status',
      'POST /api/agents/focus',
      'POST /api/agents/context',
      'POST /api/agents/phon',
      'POST /api/agents/calmguard',
      'POST /api/agents/notify',
      'POST /api/agents/blendit',
      'GET /api/rag/historico/:userId',
      'GET /api/eventos',
      'POST /api/eventos',
      'GET /api/profilesense/classify',
      'POST /api/profilesense/register'
    ]
  });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error('❌ Erro interno:', err);
  res.status(500).json({ error: 'Erro interno no servidor', message: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// ==================== INICIAR SERVIDOR ====================
async function startServer() {
  console.log('\n🔄 Inicializando Cosmos DB...');
  await cosmos.init();
  console.log('✅ Cosmos DB inicializado\n');
  
  if (rag && typeof rag.init === 'function') await rag.init();
  if (profileSenseService && typeof profileSenseService.init === 'function') await profileSenseService.init();
  
  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(`🚀 Servidor CogniFlow rodando em http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('\n📡 Endpoints disponíveis:');
    console.log('   GET  /                              - Informações da API');
    console.log('   GET  /api/health                    - Health check');
    console.log('   GET  /api/db-status                 - Status do banco');
    console.log('   POST /api/agents/focus              - FocusAgent');
    console.log('   POST /api/agents/context            - ContextAgent');
    console.log('   POST /api/agents/phon               - PhonAgent');
    console.log('   POST /api/agents/calmguard          - CalmGuard');
    console.log('   POST /api/agents/notify             - NotifyAgent');
    console.log('   POST /api/agents/blendit            - BlendIt');
    console.log('   GET  /api/rag/historico/:userId     - RAG');
    console.log('   GET  /api/eventos                   - Listar eventos');
    console.log('   POST /api/eventos                   - Criar evento');
    console.log('\n📊 Status do Banco:');
    console.log(`   Cosmos DB: ${cosmos.connected() ? '✅ CONECTADO' : '⚠️ IN-MEMORY'}`);
    console.log('\n💡 Teste rápido:');
    console.log(`   curl http://localhost:${PORT}/api/health`);
    console.log(`   curl http://localhost:${PORT}/api/db-status`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/agents/focus -H "Content-Type: application/json" -d '{"tarefa":"teste","contexto":"teste"}'`);
    console.log('\n');
  });
}

// Iniciar servidor
startServer().catch(console.error);
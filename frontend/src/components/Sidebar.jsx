import React, { useState, useEffect } from 'react'

export default function Sidebar({ surface, onSwitch }) {
  const docs = [
    { id: 'arch', icon: '📄', name: 'Arquitetura CogniFlow', badge: 'docx' },
    { id: 'sprint', icon: '📋', name: 'Sprint Planning v2', badge: 'md' },
    { id: 'rfc', icon: '⚙', name: 'RFC: Multi-Agent Orch…', badge: 'md' },
  ]

  const pills = [
    { id: 'editor', label: 'Editor' },
    { id: 'inbox', label: 'Inbox', badge: 2 },
    { id: 'examples', label: 'Exemplos' },
    { id: 'tasks', label: 'Tarefas' },
  ]

  // Estados para o Cosmos DB
  const [cosmosConnected, setCosmosConnected] = useState(false)
  const [totalDocumentos, setTotalDocumentos] = useState(0)
  const [tps, setTps] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Buscar status do Cosmos DB
  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        console.log('🔄 Buscando status do Cosmos DB...')
        
        const response = await fetch('http://localhost:3000/api/db-status')
        const data = await response.json()
        
        console.log('📊 Dados recebidos do backend:', data)
        
        setCosmosConnected(data.connected || false)
        
        // Calcular total de documentos
        const total = (data.registros?.eventos || 0) + (data.registros?.insights || 0)
        setTotalDocumentos(total)
        
        // Calcular TPS aproximado (baseado no número de documentos)
        const tpsCalculado = total > 1000 ? 3 : total > 100 ? 2 : 1
        setTps(tpsCalculado)
        
        setError(null)
        
      } catch (error) {
        console.error('❌ Erro ao buscar status do banco:', error)
        setError(error.message)
        setCosmosConnected(false)
        setTotalDocumentos(0)
        setTps(0)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDbStatus()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchDbStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  // Formatar número com separadores
  const formatNumber = (num) => {
    return num.toLocaleString('pt-BR')
  }

  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Botão Novo Documento */}
      <button
        onClick={() => onSwitch('editor')}
        style={{
          margin: '8px 12px 4px',
          padding: '8px 12px',
          background: 'var(--ink)',
          color: 'var(--surface)',
          border: 'none',
          borderRadius: 7,
          fontFamily: 'var(--sans)',
          fontSize: '.78rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        + Novo documento
      </button>

      {/* Pills de navegação */}
      <div style={{ display: 'flex', gap: 2, padding: '8px 12px 4px', flexWrap: 'wrap' }}>
        {pills.map((p) => (
          <button
            key={p.id}
            onClick={() => onSwitch(p.id)}
            style={{
              flex: p.id === 'examples' ? '1 0 100%' : 1,
              padding: '5px 4px',
              borderRadius: 6,
              border: '1px solid transparent',
              fontSize: '.7rem',
              fontWeight: 500,
              cursor: 'pointer',
              background: surface === p.id ? 'var(--accent-s)' : 'transparent',
              color: surface === p.id ? 'var(--accent)' : 'var(--ink3)',
              borderColor: surface === p.id ? 'rgba(43,92,230,.15)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            {p.label}
            {p.badge && (
              <span
                style={{
                  fontSize: 8,
                  padding: '1px 5px',
                  borderRadius: 8,
                  background: 'var(--accent)',
                  color: 'white',
                  fontFamily: 'var(--mono)',
                }}
              >
                {p.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recentes */}
      <div style={{ padding: '12px 12px 8px' }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '.1em',
            color: 'var(--ink3)',
            textTransform: 'uppercase',
            padding: '0 6px',
            marginBottom: 6,
          }}
        >
          Recentes
        </div>

        {docs.map((doc, i) => (
          <div
            key={doc.id}
            onClick={() => onSwitch('editor')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 8px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '.8rem',
              color: 'var(--ink2)',
              background: i === 0 ? 'var(--accent-s)' : 'transparent',
              marginBottom: 2,
            }}
            onMouseEnter={(e) => {
              if (i !== 0) e.currentTarget.style.background = 'var(--bg2)'
            }}
            onMouseLeave={(e) => {
              if (i !== 0) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{doc.icon}</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.name}
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 8,
                padding: '1px 5px',
                borderRadius: 3,
                background: 'var(--bg3)',
                color: 'var(--ink3)',
              }}
            >
              {doc.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Atividades */}
      <div style={{ padding: '4px 12px 8px' }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '.1em',
            color: 'var(--ink3)',
            textTransform: 'uppercase',
            padding: '0 6px',
            marginBottom: 6,
          }}
        >
          Atividades
        </div>

        {[
          { icon: '✓', label: 'Lista de tarefas', surf: 'tasks' },
          { icon: '✉', label: 'Inbox', surf: 'inbox', dot: true },
          { icon: '▣', label: 'Exemplos', surf: 'examples' },
        ].map((item) => (
          <div
            key={item.surf}
            onClick={() => onSwitch(item.surf)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 8px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '.8rem',
              color: 'var(--ink2)',
              marginBottom: 2,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.dot && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
          </div>
        ))}
      </div>

      {/* Cosmos DB Status */}
      <div style={{ marginTop: 'auto', padding: '12px' }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '.1em',
            color: 'var(--ink3)',
            textTransform: 'uppercase',
            padding: '0 6px',
            marginBottom: 6,
          }}
        >
          Cosmos DB
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px' }}>
          <span style={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: cosmosConnected ? '#22c55e' : '#f97316',
            display: 'inline-block',
            animation: cosmosConnected ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', color: 'var(--ink3)' }}>
            {cosmosConnected ? '☁️ Cosmos DB' : '📦 Modo Local'} · {formatNumber(totalDocumentos)} docs · {tps}/s
          </span>
        </div>
        {isLoading && (
          <div style={{ fontSize: '.65rem', color: 'var(--ink3)', padding: '4px 8px' }}>
            🔄 sincronizando...
          </div>
        )}
        {error && (
          <div style={{ fontSize: '.65rem', color: '#ef4444', padding: '4px 8px' }}>
            ⚠️ Erro: {error}
          </div>
        )}
      </div>
    </div>
  )
}
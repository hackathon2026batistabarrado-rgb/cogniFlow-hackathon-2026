import { useState } from 'react'

export default function Topbar({
  surface,
  onOpenNewDocument,
  onTogglePanel,
  isSpeaking,
  onStopSpeech,
}) {
  const [capturing] = useState(true)

  const surfaceLabel = {
    editor: 'Editor',
    inbox: 'Inbox',
    tasks: 'Tarefas',
    examples: 'Exemplos',
  }

  return (
    <div
      style={{
        height: 48,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 16,
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div
          style={{
            width: 22,
            height: 22,
            background: 'var(--ink)',
            borderRadius: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--surface)',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          CF
        </div>

        <span
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '-.02em',
          }}
        >
          CogniFlow
        </span>
      </div>

      <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

      <div style={{ display: 'flex', gap: 2 }}>
        {['Arquivo', 'Editar', 'Exibir', 'Agentes', 'Ajuda'].map((item) => (
          <span
            key={item}
            style={{
              padding: '4px 10px',
              borderRadius: 5,
              fontSize: '.78rem',
              color: 'var(--ink2)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--bg2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <div
        style={{
          marginLeft: 8,
          padding: '3px 8px',
          borderRadius: 999,
          background: 'var(--bg2)',
          color: 'var(--ink3)',
          fontFamily: 'var(--mono)',
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: '.05em',
        }}
      >
        {surfaceLabel[surface] || 'Editor'}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {onOpenNewDocument && (
          <button
            onClick={onOpenNewDocument}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--ink2)',
              fontSize: '.73rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
            }}
          >
            + Novo documento
          </button>
        )}

        {isSpeaking && onStopSpeech && (
          <button
            onClick={onStopSpeech}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: '1px solid rgba(180,35,24,.18)',
              background: 'var(--red-s)',
              color: 'var(--red)',
              fontSize: '.73rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
            }}
          >
            ⏹ Parar voz
          </button>
        )}

        <button
          onClick={onTogglePanel}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--ink2)',
            fontSize: '.73rem',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
          }}
        >
          ◈ Demo
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: 'var(--green-s)',
            border: '1px solid rgba(26,122,74,.2)',
            borderRadius: 20,
            fontFamily: 'var(--mono)',
            fontSize: 9,
            color: 'var(--green)',
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--green)',
              animation: capturing ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          />
          <span>Capturando comportamento</span>
        </div>

        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--ink)',
            color: 'var(--surface)',
            fontSize: 10,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          US
        </div>
      </div>
    </div>
  )
}
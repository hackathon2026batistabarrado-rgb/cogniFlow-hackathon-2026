import { useState, useRef } from 'react'
import InsightsPanel from '../components/InsightsPanel'

const BACKEND = 'http://localhost:3000'

const EMAILS = [
  { id:'vp',     de:'Rafael V. (VP Produto)', email:'rafael.v@empresa.com',  avatar:'RV', cor:'#6d28d9', assunto:'Roadmap — conversa rápida',          corpo:'Preciso conversar sobre o roadmap. Você tem 15 minutos hoje?',                                        hora:'14:32', lido:false },
  { id:'sprint', de:'Maria C. (Tech Lead)',   email:'maria.c@empresa.com',   avatar:'MC', cor:'#1a7a4a', assunto:'Sprint review — precisamos alinhar', corpo:'Alguns pontos do sprint ficaram em aberto. Consegue olhar antes da reunião de amanhã?',               hora:'11:18', lido:false },
  { id:'onboard',de:'Lucas S. (RH)',          email:'lucas.s@empresa.com',   avatar:'LS', cor:'#b45309', assunto:'Onboarding — semana que vem',        corpo:'O João começa semana que vem. Você toparia participar de uma sessão de boas-vindas na terça?',         hora:'09:05', lido:true  },
  { id:'pr47',   de:'Thiago N. (Eng)',        email:'thiago.n@empresa.com',  avatar:'TN', cor:'#2b5ce6', assunto:'PR #47 aprovada ✓',                  corpo:'Merge feito. Deploy em staging concluído com sucesso.',                                               hora:'Ter',   lido:true  },
]

// ── Rascunho editável ─────────────────────────────
function RascunhoResposta({ texto, onChange, onEnviar, onDescartar, enviado }) {
  if (!texto && !enviado) return null

  if (enviado) return (
    <div style={{ margin:'16px 24px', padding:'12px 16px', background:'var(--green-s)', border:'1px solid rgba(26,122,74,.2)', borderRadius:8, fontSize:'.82rem', color:'var(--green)', display:'flex', alignItems:'center', gap:8 }}>
      <span>✓</span>
      <span>Resposta enviada — bom trabalho.</span>
    </div>
  )

  return (
    <div style={{ margin:'16px 24px', flexShrink:0 }}>
      <div style={{ fontSize:'.72rem', fontFamily:'var(--mono)', color:'var(--ink3)', marginBottom:6, textTransform:'uppercase', letterSpacing:'.08em' }}>
        ◈ Rascunho sugerido pelo ContextAgent — edite como quiser
      </div>
      <div style={{ background:'white', border:'1px solid rgba(43,92,230,.25)', borderRadius:8, overflow:'hidden', boxShadow:'0 2px 8px rgba(26,24,20,.06)' }}>
        <textarea
          value={texto}
          onChange={e => onChange(e.target.value)}
          style={{ width:'100%', minHeight:90, padding:'12px 14px', fontFamily:'var(--sans)', fontSize:'.88rem', lineHeight:1.7, color:'var(--ink)', border:'none', outline:'none', resize:'none', background:'transparent', caretColor:'var(--accent)' }}
        />
        <div style={{ display:'flex', gap:6, padding:'8px 12px', borderTop:'1px solid var(--border)', background:'var(--bg2)' }}>
          <button onClick={onEnviar}
            style={{ padding:'5px 16px', background:'var(--accent)', color:'white', border:'none', borderRadius:6, fontSize:'.75rem', fontWeight:500, cursor:'pointer' }}>
            ↩ Enviar resposta
          </button>
          <button onClick={onDescartar}
            style={{ padding:'5px 12px', background:'transparent', color:'var(--ink3)', border:'none', fontSize:'.75rem', cursor:'pointer' }}>
            Descartar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────
export default function Inbox({ panelVisible }) {
  const [emails, setEmails]         = useState(EMAILS)
  const [emailAtivo, setEmailAtivo] = useState(null)
  const [cognitive, setCognitive]   = useState({})
  const [interpretacoes, setInterp] = useState([])
  const [loading, setLoading]       = useState(false)
  const [hesitacao, setHesitacao]   = useState(false)
  const [rascunho, setRascunho]     = useState(null)
  const [enviado, setEnviado]       = useState(false)
  const hesTimer                    = useRef(null)
  const [calmguard, setCalmguard]   = useState(null)

  const abrirEmail = (id) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, lido: true } : e))
    setEmailAtivo(id)
    setHesitacao(false)
    setInterp([])
    setRascunho(null)
    setEnviado(false)
    setCalmguard(null)
    clearTimeout(hesTimer.current)

    if (id === 'vp') {
      hesTimer.current = setTimeout(() => setHesitacao(true), 3000)
    }
  }

  const emailAtual = emails.find(e => e.id === emailAtivo)

  // ✅ FUNÇÃO CORRIGIDA
  const chamarContextAgent = async () => {
    if (!emailAtual) return
    
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/agents/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: emailAtual.corpo || '',
          remetente: emailAtual.de || 'colega'
        })
      })
      const data = await res.json()
      setInterp(data.interpretacoes || [])
      setCognitive({
        carga: 'contextual',
        confianca: 0.85,
        agente: 'ContextAgent',
        justificativa: data.recomendacao || ''
      })
      if (data.calmguard) setCalmguard(data.calmguard)
    } catch (e) {
      console.error('Erro no ContextAgent:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Toolbar */}
        <div style={{ height:40, background:'var(--surface)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 16px', gap:8, flexShrink:0 }}>
          {['↩','↪','📁'].map(icon => (
            <button key={icon} style={{ width:28, height:28, border:'none', background:'transparent', borderRadius:5, cursor:'pointer', fontSize:12, color:'var(--ink2)' }}
              onMouseEnter={e => e.target.style.background='var(--bg2)'}
              onMouseLeave={e => e.target.style.background='transparent'}
            >{icon}</button>
          ))}
          <div style={{ flex:1 }} />
          <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--amber)' }}>2 não lidas</span>
          <button
            onClick={chamarContextAgent}
            disabled={!emailAtivo || loading}
            style={{ padding:'5px 12px', background:!emailAtivo?'var(--bg3)':'#6d28d9', color:!emailAtivo?'var(--ink3)':'#fff', border:'none', borderRadius:6, fontSize:'.75rem', fontWeight:500, cursor:!emailAtivo?'not-allowed':'pointer' }}
          >
            {loading ? '⏳' : '◈'} ContextAgent
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ height:38, background:'var(--bg2)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'flex-end', padding:'0 16px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'0 12px', height:32, borderRadius:'6px 6px 0 0', border:'1px solid var(--border)', borderBottom:'none', background:'var(--surface)', fontSize:'.77rem', color:'var(--ink)', fontWeight:500, position:'relative', bottom:-1 }}>
            <span style={{ fontSize:11 }}>✉</span> Inbox — 2 não lidas
            <span style={{ fontSize:10, opacity:.5, marginLeft:2 }}>×</span>
          </div>
        </div>

        {/* Inbox body */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* Lista de emails */}
          <div style={{ width:300, flexShrink:0, borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ display:'flex', gap:4, padding:'8px 12px', borderBottom:'1px solid var(--border)' }}>
              {['Todos','Não lidos','Urgente'].map((f, i) => (
                <div key={f} style={{ padding:'3px 10px', borderRadius:20, fontSize:'.7rem', fontWeight:500, cursor:'pointer', color:i===0?'var(--accent)':'var(--ink3)', background:i===0?'var(--accent-s)':'transparent', border:`1px solid ${i===0?'rgba(43,92,230,.2)':'var(--border)'}` }}>{f}</div>
              ))}
            </div>
            <div style={{ flex:1, overflowY:'auto' }}>
              {emails.map(e => (
                <div key={e.id}
                  onClick={() => abrirEmail(e.id)}
                  style={{ padding:'12px 16px', borderBottom:'1px solid rgba(216,212,204,.5)', cursor:'pointer', background:emailAtivo===e.id?'var(--accent-s)':'transparent', position:'relative' }}
                  onMouseEnter={ev => { if(emailAtivo!==e.id) ev.currentTarget.style.background='var(--bg)' }}
                  onMouseLeave={ev => { if(emailAtivo!==e.id) ev.currentTarget.style.background='transparent' }}
                >
                  {!e.lido && <div style={{ position:'absolute', left:5, top:'50%', transform:'translateY(-50%)', width:5, height:5, borderRadius:'50%', background:'var(--accent)' }} />}
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <div style={{ width:26, height:26, borderRadius:'50%', background:e.cor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:600, color:'white', flexShrink:0 }}>{e.avatar}</div>
                    <span style={{ fontSize:'.78rem', fontWeight:e.lido?400:600, flex:1, color:'var(--ink)' }}>{e.de}</span>
                    <span style={{ fontFamily:'var(--mono)', fontSize:8, color:'var(--ink3)' }}>{e.hora}</span>
                  </div>
                  <div style={{ fontSize:'.76rem', fontWeight:e.lido?400:600, color:e.lido?'var(--ink2)':'var(--ink)', marginBottom:2 }}>{e.assunto}</div>
                  <div style={{ fontSize:'.73rem', color:'var(--ink3)', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{e.corpo}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Painel de leitura */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg)' }}>
            {!emailAtual ? (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--ink3)', gap:8 }}>
                <div style={{ fontSize:'2.5rem', opacity:.3 }}>✉</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:'.78rem' }}>Selecione uma mensagem</div>
              </div>
            ) : (
              <>
                {/* Barra de hesitação */}
                {hesitacao && (
                  <div style={{ padding:'8px 24px', background:'var(--amber-s)', borderBottom:'1px solid rgba(180,83,9,.15)', display:'flex', alignItems:'center', gap:8, fontSize:'.75rem', color:'var(--amber)', fontWeight:500, flexShrink:0 }}>
                    ⏸ Hesitação detectada — ContextAgent analisando ambiguidade…
                  </div>
                )}

                {/* Cabeçalho do email */}
                <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--border)', background:'var(--surface)', flexShrink:0 }}>
                  <div style={{ fontFamily:'var(--serif)', fontSize:'1.2rem', fontWeight:600, color:'var(--ink)', marginBottom:12, lineHeight:1.3 }}>{emailAtual.assunto}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:emailAtual.cor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color:'white' }}>{emailAtual.avatar}</div>
                    <div>
                      <div style={{ fontSize:'.8rem', fontWeight:600, color:'var(--ink)' }}>{emailAtual.de}</div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:'.68rem', color:'var(--ink3)' }}>{emailAtual.email}</div>
                    </div>
                    <div style={{ marginLeft:'auto', fontFamily:'var(--mono)', fontSize:'.7rem', color:'var(--ink3)' }}>Hoje, {emailAtual.hora}</div>
                  </div>
                  <div style={{ display:'flex', gap:6, marginTop:12 }}>
                    <button onClick={chamarContextAgent} disabled={loading}
                      style={{ padding:'5px 12px', borderRadius:6, fontSize:'.74rem', fontWeight:500, cursor:'pointer', background:'#6d28d9', color:'white', border:'none' }}>
                      ◈ Analisar com ContextAgent
                    </button>
                    {['↩ Responder','📁 Arquivar'].map(btn => (
                      <button key={btn} style={{ padding:'5px 12px', borderRadius:6, fontSize:'.74rem', fontWeight:500, cursor:'pointer', background:'var(--surface)', color:'var(--ink2)', border:'1px solid var(--border)' }}>{btn}</button>
                    ))}
                  </div>
                </div>

                {/* Corpo do email */}
                <div style={{ flex:1, overflowY:'auto', padding:'24px', fontSize:'.9rem', lineHeight:1.8, color:'var(--ink2)' }}>
                  {emailAtual.corpo}
                </div>

                {/* Rascunho editável */}
                <RascunhoResposta
                  texto={rascunho}
                  onChange={setRascunho}
                  onEnviar={() => { setEnviado(true); setRascunho(null) }}
                  onDescartar={() => setRascunho(null)}
                  enviado={enviado}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <InsightsPanel
        visible={panelVisible}
        cognitive={cognitive}
        calmguard={calmguard}
        interpretacoes={interpretacoes}
        onInterpSelect={(resposta) => {
          setRascunho(resposta)
          setEnviado(false)
        }}
      />
    </div>
  )
}
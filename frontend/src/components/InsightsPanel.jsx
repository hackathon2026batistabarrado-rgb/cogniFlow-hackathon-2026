export default function InsightsPanel({
  visible,
  metrics = {},
  cognitive = {},
  mti = null,
  interpretacoes = [],
  calmguard = null,
}) {
  if (!visible) return null

  const {
    latencia = 0,
    variacao = 'baixa',
    revisoes = 0,
    retornos = false,
    abandono = false,
    scrolls = 0,
    palavras = 0,
    tempo = '00:00',
  } = metrics

  const {
    carga = 'neutro',
    confianca = 0,
    agente = 'Monitoramento Passivo',
    justificativa = '',
  } = cognitive

  return (
    <aside style={styles.panel}>
      <section style={styles.section}>
        <h3 style={styles.title}>Insights Cognitivos</h3>
        <div style={styles.card}><strong>Carga:</strong> {carga}</div>
        <div style={styles.card}><strong>Confiança:</strong> {Math.round(confianca * 100)}%</div>
        <div style={styles.card}><strong>Agente:</strong> {agente}</div>
        <div style={styles.card}><strong>Justificativa:</strong> {justificativa || '—'}</div>
      </section>

    

      {mti && (
        <section style={styles.section}>
          <h3 style={styles.title}>MTI</h3>
          <div style={styles.card}>Before: {mti.before}</div>
          <div style={styles.card}>After: {mti.after}</div>
        </section>
      )}

      {calmguard && (
        <section style={styles.section}>
          <h3 style={styles.title}>CalmGuard</h3>
          <div style={styles.card}>Aprovado: {String(calmguard.aprovado)}</div>
          <div style={styles.card}>Acolhimento: {calmguard.nivel_acolhimento}</div>
        </section>
      )}

      {interpretacoes?.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.title}>Interpretações</h3>
          {interpretacoes.map((item, idx) => (
            <div key={idx} style={styles.card}>
              {item.titulo || item.resposta_sugerida || 'Sugestão'}
            </div>
          ))}
        </section>
      )}
    </aside>
  )
}

const styles = {
  panel: {
    width: 280,
    borderLeft: '1px solid #e5e7eb',
    background: '#fff',
    overflowY: 'auto',
    padding: 12,
  },
  section: {
    marginBottom: 18,
  },
  title: {
    fontSize: 14,
    margin: '0 0 10px',
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    fontSize: 13,
    background: '#fafafa',
  },
}
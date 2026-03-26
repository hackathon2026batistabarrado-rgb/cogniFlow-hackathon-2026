export default function QuickActions({ onAction, loading }) {
  return (
    <div style={styles.wrap}>
      <button style={styles.button} onClick={() => onAction('focus')} disabled={loading}>Focus</button>
      <button style={styles.button} onClick={() => onAction('context')} disabled={loading}>Context</button>
      <button style={styles.button} onClick={() => onAction('phon')} disabled={loading}>Phon</button>
      <button style={styles.button} onClick={() => onAction('pause')} disabled={loading}>Pause</button>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    gap: 8,
    padding: 10,
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
  },
  button: {
    border: '1px solid #d1d5db',
    background: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
}
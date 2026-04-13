// ── Badge ────────────────────────────────────────────────────────────
export function Badge({ type = 'academic', children, size = 'sm' }) {
  const classes = {
    academic: 'badge-academic',
    stability: 'badge-stability',
    welfare: 'badge-welfare',
    active: 'status-active',
    pending: 'status-pending',
    new: 'status-new',
  }
  const cls = classes[type] || 'badge-academic'
  return (
    <span
      className={cls}
      style={{
        fontSize: size === 'xs' ? 10.5 : 11.5,
        padding: size === 'xs' ? '2px 7px' : '3px 9px',
        borderRadius: 20,
        fontWeight: 500,
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  )
}

// ── StatCard ─────────────────────────────────────────────────────────
export function StatCard({ label, value, change, changeType = 'up' }) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>{value}</div>
      {change && (
        <div style={{
          fontSize: 11,
          color: changeType === 'up' ? 'var(--teal-600)' : 'var(--coral-400)',
          display: 'flex', alignItems: 'center', gap: 3
        }}>
          {changeType === 'up' ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}

// ── ServiceCard ───────────────────────────────────────────────────────
export function ServiceCard({ service, onClick }) {
  const catColors = {
    academic: { bg: 'var(--primary-50)', text: 'var(--primary-600)' },
    stability: { bg: 'var(--teal-50)', text: 'var(--teal-600)' },
    welfare: { bg: 'var(--accent-50)', text: 'var(--accent-600)' },
  }
  const cat = catColors[service.category] || catColors.academic

  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary-100)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--gray-100)' }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: cat.bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 20, marginBottom: 10,
      }}>{service.icon || '📋'}</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{service.title}</div>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 10, lineHeight: 1.5 }}>
        {service.description?.slice(0, 70)}{service.description?.length > 70 ? '...' : ''}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-900)' }}>
          {service.price || 'مجاني'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>
          ★ {service.rating || '4.8'}
        </span>
      </div>
    </div>
  )
}

// ── Loading Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid var(--primary-100)`,
      borderTopColor: 'var(--primary-600)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

// ── Empty state ───────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>{subtitle}</div>}
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a18' }}>{title}</h2>
      {action && (
        <button
          onClick={onAction}
          style={{ fontSize: 12, color: 'var(--primary-400)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}
        >{action}</button>
      )}
    </div>
  )
}

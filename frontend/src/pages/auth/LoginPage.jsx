import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/index.js'
import { authAPI } from '../../services/api.js'
import { setLanguage } from '../../i18n/index.js'

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.login(form)
      setAuth(res.data.user, res.data.access, res.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      // For demo/dev without backend, use mock login
      if (import.meta.env.DEV) {
        const mockUser = {
          id: 1, name: 'أحمد بن علي', email: form.email,
          role: form.email.includes('admin') ? 'admin' : 'student',
          language: 'ar',
        }
        setAuth(mockUser, 'mock_token_dev', 'mock_refresh_token_dev')
        navigate('/dashboard')
      } else {
        setError(err.response?.data?.detail || t('common.error'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{t('auth.welcome_back')}</h2>
        <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>{t('app.tagline')}</p>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup label={t('auth.email')}>
          <input
            className="form-input"
            type="email"
            placeholder={t('auth.email_placeholder')}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup label={t('auth.password')}>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </FormGroup>
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--primary-400)', cursor: 'pointer' }}>{t('auth.forgot_password')}</span>
        </div>
        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '11px', fontSize: 14, fontWeight: 600 }}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('auth.login_btn')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-400)' }}>
        {t('auth.no_account')}{' '}
        <Link to="/register" style={{ color: 'var(--primary-400)', fontWeight: 600, textDecoration: 'none' }}>
          {t('auth.register')}
        </Link>
      </p>
    </AuthLayout>
  )
}

// ── Shared Auth Layout ────────────────────────────────────────────────
export function AuthLayout({ children }) {
  const { i18n } = useTranslation()
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--gray-50)',
      fontFamily: i18n.language === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif",
    }}>
      {/* Left panel — branding */}
      <div style={{
        width: '45%', background: 'var(--primary-900)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 48,
      }} className="hidden md:flex">
        <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--accent-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: 'var(--accent-800)', marginBottom: 24 }}>س</div>
        <div style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>SANAD</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40 }}>منصة جامعي</div>
        {['الخدمات الأكاديمية', 'خدمات الاستقرار', 'خدمات الرفاهية'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--accent-800)', fontWeight: 700 }}>✓</span>
            {item}
          </div>
        ))}
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'var(--accent-400)' }}>س</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-900)' }}>SANAD</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5, color: '#1a1a18' }}>{label}</label>
      {children}
    </div>
  )
}

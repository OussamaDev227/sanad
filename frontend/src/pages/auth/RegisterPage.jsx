import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/index.js'
import { authAPI } from '../../services/api.js'
import { AuthLayout } from './LoginPage.jsx'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '', role: 'student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isMobile = window.innerWidth < 768

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.register(form)
      setAuth(res.data.user, res.data.access, res.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      if (import.meta.env.DEV) {
        const mockUser = { id: Date.now(), name: form.name, email: form.email, role: form.role, language: 'ar' }
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
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{t('auth.create_account')}</h2>
        <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>انضم إلى آلاف الطلاب والأساتذة</p>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('auth.full_name')}</label>
          <input className="form-input" placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('auth.email')}</label>
          <input className="form-input" type="email" placeholder={t('auth.email_placeholder')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('auth.password')}</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('auth.confirm_password')}</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.confirm_password} onChange={e => setForm({ ...form, confirm_password: e.target.value })} required />
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('auth.role')}</label>
          <select className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="student">{t('auth.student')}</option>
            <option value="professor">{t('auth.professor')}</option>
            <option value="provider">{t('auth.provider')}</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px', fontSize: 14, fontWeight: 600 }} disabled={loading}>
          {loading ? t('common.loading') : t('auth.register_btn')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-400)' }}>
        {t('auth.have_account')}{' '}
        <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 600, textDecoration: 'none' }}>
          {t('auth.login')}
        </Link>
      </p>
    </AuthLayout>
  )
}

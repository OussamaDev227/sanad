import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/index.js'
import { setLanguage } from '../i18n/index.js'

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || 'أحمد بن علي',
    email: user?.email || 'ahmed.benali@univ-oran.dz',
    speciality: user?.speciality || 'الفيزياء النظرية — السنة الثالثة',
    language: i18n.language,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    updateUser(form)
    if (form.language !== i18n.language) setLanguage(form.language)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = form.name.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div className="animate-slide-up" style={{ maxWidth: 640 }}>
      {/* Profile header card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          background: 'var(--primary-600)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{form.name}</div>
          <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 8 }}>{form.email}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'var(--primary-50)', color: 'var(--primary-600)', fontWeight: 500 }}>
              {user?.role === 'admin' ? 'مدير' : user?.role === 'professor' ? t('auth.professor') : t('auth.student')}
            </span>
            {user?.role !== 'admin' && (
              <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'var(--teal-50)', color: 'var(--teal-600)', fontWeight: 500 }}>
                {form.speciality?.split('—')[0]?.trim()}
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2 }}>التقييم</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-400)' }}>★ 4.8</div>
        </div>
      </div>

      {/* Stats mini row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'الطلبات المكتملة', value: '8' },
          { label: 'الخدمات المفضلة', value: '5' },
          { label: 'أيام العضوية', value: '124' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '14px 8px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-900)', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="card">
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>{t('profile.account_info')}</h2>

        {saved && (
          <div style={{ background: 'var(--teal-50)', border: '0.5px solid var(--teal-400)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--teal-600)', marginBottom: 16 }}>
            ✓ تم حفظ التغييرات بنجاح
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('profile.full_name')}</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('profile.email')}</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('profile.speciality')}</label>
            <input className="form-input" value={form.speciality} onChange={e => setForm({ ...form, speciality: e.target.value })} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{t('profile.preferred_lang')}</label>
            <select className="form-input" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
              <option value="ar">{t('profile.arabic')}</option>
              <option value="fr">{t('profile.french')}</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px', fontSize: 14 }}>
            {t('profile.save')}
          </button>
        </form>
      </div>
    </div>
  )
}

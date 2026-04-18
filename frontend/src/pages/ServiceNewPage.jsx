import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/** Placeholder until a full provider “create service” form is wired to the API. */
export default function ServiceNewPage() {
  const { t } = useTranslation()
  return (
    <div className="card animate-slide-up" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>➕</div>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t('services.add_service')}</h1>
      <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 20 }}>
        نموذج إضافة الخدمة قيد الإعداد. يمكنك العودة إلى قائمة الخدمات أو لوحة التحكم.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link className="btn-primary" to="/services" style={{ textDecoration: 'none', padding: '10px 18px', borderRadius: 10, fontSize: 13 }}>
          {t('nav.services')}
        </Link>
        <Link className="btn-secondary" to="/dashboard" style={{ textDecoration: 'none', padding: '10px 18px', borderRadius: 10, fontSize: 13 }}>
          {t('nav.dashboard')}
        </Link>
      </div>
    </div>
  )
}

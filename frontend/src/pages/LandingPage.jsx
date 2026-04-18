import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n/index.js'
import appLogo from '../assets/WhatsApp Image 2026-04-12 at 11.11.44.jpeg'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const features = [
    { icon: '📚', key: 'academic' },
    { icon: '🏠', key: 'stability' },
    { icon: '🚌', key: 'welfare' },
  ]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-900)', fontFamily: i18n.language === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: isMobile ? '14px 16px' : '20px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={appLogo} alt="SANAD logo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>SANAD</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{t('app.subtitle')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setLanguage(i18n.language === 'ar' ? 'fr' : 'ar')}
            style={{ padding: '6px 14px', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}
          >{i18n.language === 'ar' ? 'FR' : 'ع'}</button>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: 8, background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            {t('auth.login')}
          </button>
          <button onClick={() => navigate('/register')} style={{ padding: '8px 18px', border: 'none', borderRadius: 8, background: 'var(--accent-400)', color: 'var(--accent-800)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            {t('auth.register')}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: isMobile ? '44px 16px 36px' : '80px 40px 60px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'rgba(239,159,39,0.15)', border: '0.5px solid rgba(239,159,39,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--accent-100)', marginBottom: 24 }}>
          منصة جامعي #1 في الجزائر
        </div>
        <h1 style={{ fontSize: isMobile ? 34 : 52, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 20 }}>
          {t('app.name')} <span style={{ color: 'var(--accent-400)' }}>سند</span>
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.6)', marginBottom: 36, lineHeight: 1.7 }}>
          {t('app.tagline')}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} style={{ padding: '13px 32px', background: 'var(--accent-400)', color: 'var(--accent-800)', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            {t('auth.register')} ←
          </button>
          <button onClick={() => navigate('/login')} style={{ padding: '13px 32px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
            {t('auth.login')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/services')}
            style={{ padding: '13px 28px', background: 'transparent', color: 'rgba(255,255,255,0.9)', border: '0.5px solid rgba(255,255,255,0.35)', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {t('dashboard.explore_btn')}
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto 60px', padding: isMobile ? '0 16px' : '0 40px' }}>
        {features.map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => navigate(`/category/${f.key}`)}
            style={{
              textAlign: 'inherit',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: 24,
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'inherit',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{t(`categories.${f.key}.name`)}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{t(`categories.${f.key}.desc`)}</div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 24 : 48, padding: isMobile ? '24px 16px' : '30px 40px', borderTop: '0.5px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
        {[
          { val: '+1,200', label: 'طالب مسجل' },
          { val: '24', label: 'خدمة متاحة' },
          { val: '98%', label: 'معدل الرضا' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-400)' }}>{s.val}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

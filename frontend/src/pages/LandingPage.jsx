import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n/index.js'
import appLogo from '../assets/WhatsApp Image 2026-04-12 at 11.11.44.jpeg'

/** رابط المنصة: نفس النطاق أو عنوان منفصل عبر VITE_PLATFORM_URL */
function usePlatformUrl() {
  return useMemo(() => {
    const raw = import.meta.env.VITE_PLATFORM_URL
    if (typeof raw === 'string' && raw.trim()) return raw.trim()
    return ''
  }, [])
}

function ServiceCard({ title, items }) {
  return (
    <div
      className="card"
      style={{
        padding: '1.25rem 1.35rem',
        height: '100%',
        background: 'rgba(255,255,255,0.97)',
        border: '0.5px solid rgba(255,255,255,0.35)',
        boxShadow: '0 12px 40px rgba(4, 44, 83, 0.12)',
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary-900)', marginBottom: 14, lineHeight: 1.5 }}>
        {title}
      </h3>
      <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.85 }}>
        {items.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const platformUrl = usePlatformUrl()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [heroImgOk, setHeroImgOk] = useState(true)

  const heroImageSrc = import.meta.env.VITE_VITRINE_HERO_URL?.trim() || '/sanad-vitrine-hero.jpg'

  const academicItems = t('vitrine.academic_items', { returnObjects: true })
  const stabilityItems = t('vitrine.stability_items', { returnObjects: true })
  const socialItems = t('vitrine.social_items', { returnObjects: true })

  const lists = [
    { title: t('vitrine.cat_academic'), items: Array.isArray(academicItems) ? academicItems : [] },
    { title: t('vitrine.cat_stability'), items: Array.isArray(stabilityItems) ? stabilityItems : [] },
    { title: t('vitrine.cat_social'), items: Array.isArray(socialItems) ? socialItems : [] },
  ]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /** المنصة منفصلة: إما نفس النطاق (/login) أو عنوان كامل في VITE_PLATFORM_URL (يفضّل صفحة الدخول) */
  const openPlatform = () => {
    if (platformUrl) {
      window.location.href = platformUrl
      return
    }
    navigate('/login')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: i18n.language === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif",
      }}
    >
      {/* خلفية: صورة + طبقة داكنة — إذا لم تُضف الصورة يبقى التدرج فقط */}
      {heroImgOk && (
        <img
          src={heroImageSrc}
          alt=""
          aria-hidden
          onError={() => setHeroImgOk(false)}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: heroImgOk
            ? 'linear-gradient(165deg, rgba(4, 44, 83, 0.88) 0%, rgba(4, 44, 83, 0.78) 45%, rgba(10, 61, 107, 0.82) 100%)'
            : 'linear-gradient(165deg, var(--primary-900) 0%, #0a3d6b 50%, var(--primary-600) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* شريط علوي: شعار + سند + أزرار */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            padding: isMobile ? '14px 16px' : '18px 32px',
            borderBottom: '0.5px solid rgba(255,255,255,0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={appLogo}
              alt=""
              style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
            />
            <div>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: 0.5 }}>
                {i18n.language === 'ar' ? 'سند' : 'SANAD'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{t('vitrine.site_label')} · {t('app.subtitle')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setLanguage(i18n.language === 'ar' ? 'fr' : 'ar')}
              style={{
                padding: '7px 14px',
                border: '0.5px solid rgba(255,255,255,0.25)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'inherit',
              }}
            >
              {i18n.language === 'ar' ? 'FR' : 'ع'}
            </button>
            <button
              type="button"
              onClick={openPlatform}
              style={{
                padding: '9px 16px',
                border: '0.5px solid rgba(255,255,255,0.35)',
                borderRadius: 10,
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'inherit',
              }}
            >
              {t('vitrine.nav_login')}
            </button>
            <button
              type="button"
              onClick={openPlatform}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: 10,
                background: 'var(--accent-400)',
                color: 'var(--accent-800)',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 18px rgba(239, 159, 39, 0.35)',
              }}
            >
              {t('vitrine.cta_platform')}
            </button>
          </div>
        </header>

        {/* محتوى */}
        <main style={{ flex: 1, padding: isMobile ? '28px 16px 40px' : '48px 32px 56px', maxWidth: 1040, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>{t('vitrine.hero_kicker')}</p>
          <h1
            style={{
              fontSize: isMobile ? 36 : 46,
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            {t('vitrine.hero_title')}
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 18, color: 'rgba(255,255,255,0.75)', marginBottom: 22, maxWidth: 640, lineHeight: 1.75 }}>
            {t('app.tagline')}
          </p>

          <button
            type="button"
            onClick={openPlatform}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              border: 'none',
              borderRadius: 12,
              background: 'var(--accent-400)',
              color: 'var(--accent-800)',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginBottom: 36,
              boxShadow: '0 8px 28px rgba(239, 159, 39, 0.4)',
            }}
          >
            {t('vitrine.cta_platform')} ←
          </button>

          <section
            className="card"
            style={{
              padding: '1.5rem 1.6rem',
              marginBottom: 28,
              background: 'rgba(255,255,255,0.96)',
              border: '0.5px solid rgba(255,255,255,0.4)',
            }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--primary-900)', marginBottom: 12 }}>
              {t('vitrine.intro_title')}
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--gray-600)', lineHeight: 1.9, margin: 0 }}>
              {t('vitrine.intro_body')}
            </p>
          </section>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{t('vitrine.services_title')}</h2>
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.6 }}>
            {t('vitrine.services_note')}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {lists.map((block) => (
              <ServiceCard key={block.title} title={block.title} items={block.items} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={openPlatform}
              className="btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t('vitrine.cta_platform')}
            </button>
          </div>
        </main>

        <footer
          style={{
            textAlign: 'center',
            padding: '16px',
            fontSize: 12,
            color: 'rgba(255,255,255,0.45)',
            borderTop: '0.5px solid rgba(255,255,255,0.08)',
          }}
        >
          {t('vitrine.footer')}
        </footer>
      </div>
    </div>
  )
}

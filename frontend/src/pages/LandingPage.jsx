import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n/index.js'
import appLogo from '../assets/WhatsApp Image 2026-04-12 at 11.11.44.jpeg'

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
        padding: '1.35rem 1.45rem',
        height: '100%',
        background: '#fff',
        border: '0.5px solid var(--gray-100)',
        boxShadow: '0 8px 32px rgba(4, 44, 83, 0.08)',
        borderRadius: 'var(--radius-lg, 12px)',
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary-900)', marginBottom: 14, lineHeight: 1.5 }}>
        {title}
      </h3>
      <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.9 }}>
        {items.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

function ValueCard({ icon, title, text }) {
  return (
    <div
      style={{
        padding: '1.35rem',
        background: '#fff',
        borderRadius: 12,
        border: '0.5px solid var(--gray-100)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary-900)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.8, margin: 0 }}>{text}</p>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const platformUrl = usePlatformUrl()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [heroImgOk, setHeroImgOk] = useState(true)
  const [headerSolid, setHeaderSolid] = useState(false)

  const heroImageSrc = import.meta.env.VITE_VITRINE_HERO_URL?.trim() || '/sanad-vitrine-hero.jpg'

  const academicItems = t('vitrine.academic_items', { returnObjects: true })
  const stabilityItems = t('vitrine.stability_items', { returnObjects: true })
  const socialItems = t('vitrine.social_items', { returnObjects: true })

  const lists = [
    { title: t('vitrine.cat_academic'), items: Array.isArray(academicItems) ? academicItems : [] },
    { title: t('vitrine.cat_stability'), items: Array.isArray(stabilityItems) ? stabilityItems : [] },
    { title: t('vitrine.cat_social'), items: Array.isArray(socialItems) ? socialItems : [] },
  ]

  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    const onScroll = () => setHeaderSolid(window.scrollY > 48)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const openPlatform = () => {
    if (platformUrl) {
      window.location.href = platformUrl
      return
    }
    navigate('/login')
  }

  const isRtl = i18n.language === 'ar'

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif",
        background: '#f0f4f8',
      }}
    >
      {/* ——— Hero: خلفية كاملة ——— */}
      <section
        style={{
          position: 'relative',
          minHeight: isMobile ? 'auto' : '88vh',
          paddingBottom: isMobile ? 36 : 56,
          overflow: 'hidden',
        }}
      >
        {heroImgOk && (
          <img
            src={heroImageSrc}
            alt=""
            aria-hidden
            onError={() => setHeroImgOk(false)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: heroImgOk
              ? 'linear-gradient(165deg, rgba(4, 44, 83, 0.9) 0%, rgba(4, 44, 83, 0.82) 50%, rgba(10, 61, 107, 0.88) 100%)'
              : 'linear-gradient(165deg, var(--primary-900) 0%, #0a3d6b 55%, var(--primary-600) 100%)',
          }}
        />

        {/* شريط علوي لاصق */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            padding: isMobile ? '12px 14px' : '14px 28px',
            background: headerSolid ? 'rgba(4, 44, 83, 0.97)' : 'rgba(4, 44, 83, 0.35)',
            backdropFilter: headerSolid ? 'blur(10px)' : 'none',
            borderBottom: headerSolid ? '0.5px solid rgba(255,255,255,0.1)' : 'none',
            transition: 'background 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={appLogo}
              alt=""
              style={{ width: 42, height: 42, borderRadius: 12, objectFit: 'cover', boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}
            />
            <div>
              <div style={{ color: '#fff', fontSize: 19, fontWeight: 800 }}>
                {i18n.language === 'ar' ? 'سند' : 'SANAD'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{t('vitrine.site_label')}</div>
            </div>
          </div>

          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                ['about', t('vitrine.nav_about')],
                ['services', t('vitrine.nav_services')],
                ['how', t('vitrine.nav_how')],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToId(id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: '8px 12px',
                    borderRadius: 8,
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setLanguage(i18n.language === 'ar' ? 'fr' : 'ar')}
              style={{
                padding: '7px 12px',
                border: '0.5px solid rgba(255,255,255,0.25)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
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
                padding: '9px 14px',
                border: '0.5px solid rgba(255,255,255,0.4)',
                borderRadius: 10,
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'inherit',
              }}
            >
              {t('vitrine.nav_login')}
            </button>
            <button
              type="button"
              onClick={openPlatform}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: 10,
                background: 'var(--accent-400)',
                color: 'var(--accent-800)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 18px rgba(239, 159, 39, 0.35)',
              }}
            >
              {t('vitrine.cta_platform')}
            </button>
          </div>
        </header>

        <div style={{ position: 'relative', zIndex: 2, padding: isMobile ? '36px 18px 0' : '56px 40px 0', maxWidth: 920, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 12, letterSpacing: 0.3 }}>
            {t('vitrine.hero_kicker')}
          </p>
          <h1
            style={{
              fontSize: isMobile ? 38 : 52,
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.12,
              marginBottom: 12,
            }}
          >
            {t('vitrine.hero_title')}
            <span style={{ color: 'var(--accent-400)', marginInlineStart: 8 }}>· {t('vitrine.hero_subtitle')}</span>
          </h1>
          <p
            style={{
              fontSize: isMobile ? 15 : 17,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.85,
              marginBottom: 26,
              maxWidth: 640,
            }}
          >
            {t('vitrine.hero_lead')}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={openPlatform}
              style={{
                padding: '15px 28px',
                border: 'none',
                borderRadius: 12,
                background: 'var(--accent-400)',
                color: 'var(--accent-800)',
                fontWeight: 800,
                fontSize: 16,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 10px 32px rgba(239, 159, 39, 0.42)',
              }}
            >
              {t('vitrine.cta_platform')} ←
            </button>
            <button
              type="button"
              onClick={() => scrollToId('services')}
              style={{
                padding: '14px 22px',
                borderRadius: 12,
                border: '0.5px solid rgba(255,255,255,0.45)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t('vitrine.cta_secondary')}
            </button>
          </div>
        </div>

        {isMobile && (
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', padding: '20px 14px 8px' }}>
            {['about', 'services', 'how'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToId(id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '0.5px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                {id === 'about' && t('vitrine.nav_about')}
                {id === 'services' && t('vitrine.nav_services')}
                {id === 'how' && t('vitrine.nav_how')}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ——— محتوى فاتح: أقسام كاملة ——— */}
      <div style={{ position: 'relative', zIndex: 3, marginTop: isMobile ? -24 : -40 }}>
        {/* عن المشروع */}
        <section
          id="about"
          style={{
            scrollMarginTop: 88,
            maxWidth: 1040,
            margin: '0 auto',
            padding: isMobile ? '40px 18px 28px' : '56px 32px 36px',
          }}
        >
          <div
            className="card"
            style={{
              padding: isMobile ? '1.5rem' : '2rem 2.25rem',
              background: '#fff',
              border: '0.5px solid var(--gray-100)',
              boxShadow: '0 12px 48px rgba(4, 44, 83, 0.07)',
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-900)', marginBottom: 14 }}>
              {t('vitrine.intro_title')}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.95, marginBottom: 16 }}>
              {t('vitrine.intro_body')}
            </p>
            <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.9, margin: 0, padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 10, border: '0.5px solid var(--gray-100)' }}>
              {t('vitrine.intro_extra')}
            </p>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary-900)', marginTop: 44, marginBottom: 20, textAlign: 'center' }}>
            {t('vitrine.values_title')}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            <ValueCard icon="⏱️" title={t('vitrine.value_1_title')} text={t('vitrine.value_1_text')} />
            <ValueCard icon="📋" title={t('vitrine.value_2_title')} text={t('vitrine.value_2_text')} />
            <ValueCard icon="🔷" title={t('vitrine.value_3_title')} text={t('vitrine.value_3_text')} />
          </div>
        </section>

        {/* الخدمات */}
        <section
          id="services"
          style={{
            scrollMarginTop: 88,
            background: 'linear-gradient(180deg, #e8eef5 0%, #f0f4f8 100%)',
            padding: isMobile ? '44px 18px 48px' : '56px 32px 64px',
          }}
        >
          <div style={{ maxWidth: 1040, margin: '0 auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-900)', marginBottom: 8, textAlign: 'center' }}>
              {t('vitrine.services_title')}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', textAlign: 'center', maxWidth: 640, margin: '0 auto 28px', lineHeight: 1.75 }}>
              {t('vitrine.services_note')}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                gap: 18,
              }}
            >
              {lists.map((block) => (
                <ServiceCard key={block.title} title={block.title} items={block.items} />
              ))}
            </div>
          </div>
        </section>

        {/* آلية العمل */}
        <section
          id="how"
          style={{
            scrollMarginTop: 88,
            maxWidth: 1040,
            margin: '0 auto',
            padding: isMobile ? '44px 18px' : '56px 32px',
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-900)', marginBottom: 24, textAlign: 'center' }}>
            {t('vitrine.how_title')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {[t('vitrine.how_step_1'), t('vitrine.how_step_2'), t('vitrine.how_step_3')].map((step, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '1.25rem',
                  background: '#fff',
                  borderRadius: 12,
                  border: '0.5px solid var(--gray-100)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.8 }}>{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* أرقام */}
        <section style={{ padding: isMobile ? '28px 18px 44px' : '36px 32px 52px', maxWidth: 900, margin: '0 auto' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-400)', textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            {t('vitrine.stats_title')}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 20 : 48, flexWrap: 'wrap' }}>
            {[
              [t('vitrine.stat_1_val'), t('vitrine.stat_1_label')],
              [t('vitrine.stat_2_val'), t('vitrine.stat_2_label')],
              [t('vitrine.stat_3_val'), t('vitrine.stat_3_label')],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary-600)', lineHeight: 1.1 }}>{val}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* شريط دعوة */}
        <section
          id="platform-cta"
          style={{
            scrollMarginTop: 88,
            background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-600) 100%)',
            padding: isMobile ? '40px 20px' : '52px 32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            {t('vitrine.cta_band_title')}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.75 }}>
            {t('vitrine.cta_band_text')}
          </p>
          <button
            type="button"
            onClick={openPlatform}
            style={{
              padding: '16px 36px',
              border: 'none',
              borderRadius: 12,
              background: 'var(--accent-400)',
              color: 'var(--accent-800)',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 8px 28px rgba(239, 159, 39, 0.4)',
            }}
          >
            {t('vitrine.cta_platform')} ←
          </button>
        </section>

        {/* تذييل */}
        <footer
          style={{
            background: '#0a2540',
            color: 'rgba(255,255,255,0.75)',
            padding: isMobile ? '28px 18px' : '36px 32px',
          }}
        >
          <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <img src={appLogo} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                <span style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>{i18n.language === 'ar' ? 'سند' : 'SANAD'}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, maxWidth: 360 }}>{t('vitrine.footer_tagline')}</p>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <button
                type="button"
                onClick={openPlatform}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: '0.5px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  marginBottom: 12,
                }}
              >
                {t('vitrine.nav_contact_cta')}
              </button>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{t('vitrine.footer_note')}</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 20, borderTop: '0.5px solid rgba(255,255,255,0.12)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            {t('vitrine.footer')}
          </div>
        </footer>
      </div>
    </div>
  )
}

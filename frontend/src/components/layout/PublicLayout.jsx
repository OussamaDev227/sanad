import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../../i18n/index.js'
import { useAuthStore } from '../../store/index.js'
import appLogo from '../../assets/WhatsApp Image 2026-04-12 at 11.11.44.jpeg'

/**
 * Public site shell: discover services and categories without an account.
 * Platform (dashboard, requests, profile, admin) stays behind ProtectedRoute + MainLayout.
 */
export default function PublicLayout() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const isRtl = i18n.language === 'ar'

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--gray-50)',
        fontFamily: isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          padding: '12px 20px',
          background: 'var(--primary-900)',
          borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}
        >
          <img src={appLogo} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>SANAD</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{t('app.subtitle')}</div>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Link
            to="/services"
            style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, textDecoration: 'none', padding: '6px 10px' }}
          >
            {t('nav.services')}
          </Link>
          <Link
            to="/category/academic"
            style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, textDecoration: 'none', padding: '6px 8px' }}
          >
            {t('nav.academic')}
          </Link>
          <Link
            to="/category/stability"
            style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, textDecoration: 'none', padding: '6px 8px' }}
          >
            {t('nav.stability')}
          </Link>
          <Link
            to="/category/welfare"
            style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, textDecoration: 'none', padding: '6px 8px' }}
          >
            {t('nav.welfare')}
          </Link>

          <button
            type="button"
            onClick={() => setLanguage(i18n.language === 'ar' ? 'fr' : 'ar')}
            style={{
              padding: '5px 12px',
              border: '0.5px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              background: 'transparent',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'inherit',
            }}
          >
            {i18n.language === 'ar' ? 'FR' : 'ع'}
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 14px',
                border: 'none',
                borderRadius: 8,
                background: 'var(--accent-400)',
                color: 'var(--accent-800)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t('nav.dashboard')}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  padding: '8px 14px',
                  border: '0.5px solid rgba(255,255,255,0.35)',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#fff',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {t('auth.login')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'var(--accent-400)',
                  color: 'var(--accent-800)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {t('auth.register')}
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={{ flex: 1, padding: '20px', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  )
}

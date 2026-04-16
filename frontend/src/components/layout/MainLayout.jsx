import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const pageTitles = {
  '/dashboard': { ar: 'لوحة التحكم', fr: 'Tableau de bord' },
  '/services': { ar: 'الخدمات', fr: 'Services' },
  '/requests': { ar: 'طلباتي', fr: 'Mes demandes' },
  '/profile': { ar: 'الملف الشخصي', fr: 'Profil' },
  '/admin': { ar: 'لوحة الإدارة', fr: 'Administration' },
  '/category/academic': { ar: 'الخدمات الأكاديمية', fr: 'Services académiques' },
  '/category/stability': { ar: 'خدمات الحياة اليومية و الاستقرار', fr: 'Services de stabilité' },
  '/category/welfare': { ar: 'الخدمات الاجتماعية، الثقافية و الترفيهية', fr: 'Services de bien-être' },
}

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992)
  const { i18n } = useTranslation()
  const location = useLocation()
  const isRtl = i18n.language === 'ar'

  const pageTitle = pageTitles[location.pathname]?.[i18n.language] || 'SANAD'

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>
      <Sidebar open={sidebarOpen} />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 25,
          }}
        />
      )}

      {/* Main content — offset by sidebar width */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        [isRtl ? 'marginRight' : 'marginLeft']: sidebarOpen && !isMobile ? 'var(--sidebar-width)' : 0,
        transition: 'margin 0.3s',
        minWidth: 0,
      }}>
        <Topbar
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          isMobile={isMobile}
          title={pageTitle}
        />
        <main style={{ flex: 1, padding: isMobile ? '14px' : '24px', overflowY: 'auto' }} className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

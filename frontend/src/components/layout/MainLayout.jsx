import { useState } from 'react'
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
  '/category/stability': { ar: 'خدمات الاستقرار', fr: 'Services de stabilité' },
  '/category/welfare': { ar: 'خدمات الرفاهية', fr: 'Services de bien-être' },
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { i18n } = useTranslation()
  const location = useLocation()
  const isRtl = i18n.language === 'ar'

  const pageTitle = pageTitles[location.pathname]?.[i18n.language] || 'SANAD'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>
      <Sidebar open={sidebarOpen} />

      {/* Main content — offset by sidebar width */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        [isRtl ? 'marginRight' : 'marginLeft']: sidebarOpen ? 'var(--sidebar-width)' : 0,
        transition: 'margin 0.3s',
        minWidth: 0,
      }}>
        <Topbar
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          title={pageTitle}
        />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }} className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

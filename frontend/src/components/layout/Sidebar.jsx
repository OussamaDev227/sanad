import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/index.js'

const navItems = [
  { key: 'dashboard', path: '/dashboard', icon: '⊞' },
  { key: 'services', path: '/services', icon: '◈', badge: 12 },
  { key: 'requests', path: '/requests', icon: '◎' },
]

const categoryItems = [
  { key: 'academic', path: '/category/academic', icon: '📚' },
  { key: 'stability', path: '/category/stability', icon: '🏠' },
  { key: 'welfare', path: '/category/welfare', icon: '🚌' },
]

export default function Sidebar({ open }) {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const isRtl = i18n.language === 'ar'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className="flex flex-col h-screen fixed top-0 z-30 transition-all duration-300"
      style={{
        width: open ? 'var(--sidebar-width)' : '0',
        [isRtl ? 'right' : 'left']: 0,
        background: 'var(--primary-900)',
        overflow: 'hidden',
        minWidth: open ? 'var(--sidebar-width)' : 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--accent-400)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: 'var(--accent-800)',
          flexShrink: 0
        }}>س</div>
        <div>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>SANAD</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{t('app.subtitle')}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        <SectionLabel label={t('common.home')} />
        {navItems.map(item => (
          <SideNavItem key={item.key} item={item} label={t(`nav.${item.key}`)} />
        ))}

        <SectionLabel label={t('nav.categories')} />
        {categoryItems.map(item => (
          <SideNavItem key={item.key} item={item} label={t(`nav.${item.key}`)} />
        ))}

        <SectionLabel label={t('nav.profile')} />
        <SideNavItem item={{ key: 'profile', path: '/profile', icon: '◯' }} label={t('nav.profile')} />
        {user?.role === 'admin' && (
          <SideNavItem item={{ key: 'admin', path: '/admin', icon: '⚙' }} label={t('nav.admin')} />
        )}
      </nav>

      {/* User section */}
      <div className="px-4 py-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <UserAvatar name={user?.name || 'User'} />
          <div className="flex-1 min-w-0">
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'مستخدم'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
              {user?.role === 'admin' ? 'مدير' : user?.role === 'professor' ? 'أستاذ' : 'طالب'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={t('nav.logout')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 16, padding: '4px' }}
          >⏻</button>
        </div>
      </div>
    </aside>
  )
}

function SectionLabel({ label }) {
  return (
    <div style={{ padding: '8px 16px 4px', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, whiteSpace: 'nowrap' }}>
      {label}
    </div>
  )
}

function SideNavItem({ item, label }) {
  return (
    <NavLink
      to={item.path}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 16px',
        cursor: 'pointer',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
        background: isActive ? 'rgba(55,138,221,0.2)' : 'transparent',
        fontSize: 13.5,
        fontWeight: isActive ? 500 : 400,
        textDecoration: 'none',
        position: 'relative',
        whiteSpace: 'nowrap',
      })}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span style={{
              position: 'absolute', right: 0, top: 6, bottom: 6,
              width: 3, background: 'var(--accent-400)',
              borderRadius: '3px 0 0 3px'
            }} />
          )}
          <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{item.icon}</span>
          <span>{label}</span>
          {item.badge && (
            <span style={{
              marginRight: 'auto', background: 'var(--accent-400)',
              color: 'var(--accent-800)', fontSize: 10, padding: '1px 6px',
              borderRadius: 10, fontWeight: 700
            }}>{item.badge}</span>
          )}
        </>
      )}
    </NavLink>
  )
}

function UserAvatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: 'var(--primary-400)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0
    }}>{initials}</div>
  )
}

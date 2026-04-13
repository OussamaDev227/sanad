import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store/index.js'
import { setLanguage } from '../../i18n/index.js'

export default function Topbar({ onToggleSidebar, title }) {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuthStore()
  const { notifications, markRead } = useUIStore()
  const navigate = useNavigate()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const isRtl = i18n.language === 'ar'
  const unread = notifications.filter(n => !n.read).length

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'fr' : 'ar'
    setLanguage(next)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('') || 'U'

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'white',
      borderBottom: '0.5px solid var(--gray-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--gray-600)', padding: '4px 6px', borderRadius: 6 }}
        >☰</button>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a18' }}>{title}</h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2" style={{ position: 'relative' }}>
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          style={{
            padding: '5px 12px',
            border: '0.5px solid var(--gray-200)',
            borderRadius: 8,
            fontSize: 12,
            cursor: 'pointer',
            background: 'var(--gray-50)',
            color: 'var(--gray-600)',
            fontFamily: 'inherit',
            fontWeight: 600,
          }}
        >
          {i18n.language === 'ar' ? 'FR' : 'ع'}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false) }}
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: '0.5px solid var(--gray-100)',
              background: 'transparent',
              cursor: 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
          >
            🔔
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 5, right: 5,
                width: 7, height: 7,
                background: 'var(--accent-400)',
                borderRadius: '50%',
                border: '1.5px solid white',
              }} />
            )}
          </button>
          {showNotifs && (
            <NotifDropdown
              notifications={notifications}
              markRead={markRead}
              lang={i18n.language}
              onClose={() => setShowNotifs(false)}
              isRtl={isRtl}
            />
          )}
        </div>

        {/* User avatar */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false) }}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--primary-600)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white',
              fontFamily: 'inherit',
            }}
          >{initials}</button>
          {showUserMenu && (
            <UserMenu user={user} onProfile={() => { navigate('/profile'); setShowUserMenu(false) }} onLogout={handleLogout} t={t} isRtl={isRtl} />
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(showNotifs || showUserMenu) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: -1 }}
          onClick={() => { setShowNotifs(false); setShowUserMenu(false) }}
        />
      )}
    </header>
  )
}

function NotifDropdown({ notifications, markRead, lang, onClose, isRtl }) {
  const { t } = useTranslation()
  const typeColors = { success: 'var(--teal-400)', warning: 'var(--accent-400)', info: 'var(--primary-400)' }
  return (
    <div style={{
      position: 'absolute',
      [isRtl ? 'left' : 'right']: 0,
      top: 40, width: 300,
      background: 'white',
      border: '0.5px solid var(--gray-100)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-md)',
      zIndex: 50,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--gray-100)', fontSize: 13, fontWeight: 600 }}>
        {t('notifications.title')}
      </div>
      {notifications.map(n => (
        <div
          key={n.id}
          onClick={() => markRead(n.id)}
          style={{
            display: 'flex', gap: 10, padding: '10px 16px',
            cursor: 'pointer', background: n.read ? 'transparent' : 'var(--primary-50)',
            borderBottom: '0.5px solid var(--gray-50)',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[n.type], marginTop: 5, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, color: '#1a1a18', lineHeight: 1.6 }}>{lang === 'ar' ? n.text_ar : n.text_fr}</div>
            <div style={{ fontSize: 10.5, color: 'var(--gray-400)', marginTop: 2 }}>{lang === 'ar' ? n.time_ar : n.time_fr}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function UserMenu({ user, onProfile, onLogout, t, isRtl }) {
  return (
    <div style={{
      position: 'absolute',
      [isRtl ? 'left' : 'right']: 0,
      top: 40, width: 180,
      background: 'white',
      border: '0.5px solid var(--gray-100)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-md)',
      zIndex: 50,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--gray-100)' }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{user?.email}</div>
      </div>
      <button onClick={onProfile} style={{ display: 'block', width: '100%', textAlign: 'inherit', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: '#1a1a18' }}>
        {t('nav.profile')}
      </button>
      <button onClick={onLogout} style={{ display: 'block', width: '100%', textAlign: 'inherit', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: 'var(--coral-400)' }}>
        {t('nav.logout')}
      </button>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/index.js'
import { StatCard, SectionHeader } from '../components/ui/index.jsx'

const MOCK_SERVICES = [
  { id: 1, icon: '📖', title: 'مراجع الفيزياء النظرية', category: 'academic', price: 'مجاني', status: 'new', status_label: 'جديد' },
  { id: 2, icon: '🏠', title: 'غرفة مفروشة قرب الجامعة', category: 'stability', price: '8,000 د', status: 'active', status_label: 'متاح' },
  { id: 3, icon: '🚌', title: 'حافلة جامعة — المدينة', category: 'welfare', price: '200 د', status: 'active', status_label: 'يومي' },
  { id: 4, icon: '🖨️', title: 'خدمة طباعة وتجليد', category: 'academic', price: '150 د', status: 'pending', status_label: 'مؤقت' },
]

const CATEGORIES = [
  {
    key: 'academic', icon: '📚', slug: 'academic',
    tags: ['مراجع ومذكرات', 'طباعة', 'تدقيق'],
    color: 'var(--primary-50)', tagClass: 'badge-academic',
    gradient: 'linear-gradient(135deg, var(--primary-900), var(--primary-600))',
  },
  {
    key: 'stability', icon: '🏠', slug: 'stability',
    tags: ['السكن', 'التجهيزات'],
    color: 'var(--teal-50)', tagClass: 'badge-stability',
    gradient: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
  },
  {
    key: 'welfare', icon: '🚌', slug: 'welfare',
    tags: ['النقل', 'الرحلات'],
    color: 'var(--accent-50)', tagClass: 'badge-welfare',
    gradient: 'linear-gradient(135deg, var(--accent-600), var(--accent-400))',
  },
]

const QUICK_ACTIONS = [
  { icon: '📄', key: 'new_request', path: '/requests' },
  { icon: '🔍', key: 'search_services', path: '/services' },
  { icon: '📚', key: 'download_ref', path: '/category/academic' },
  { icon: '💬', key: 'contact_provider', path: '/services' },
]

const NOTIFICATIONS = [
  { type: 'success', text: 'تم قبول طلب السكن الخاص بك', time: 'منذ ساعة' },
  { type: 'warning', text: 'موعد تسليم المذكرة: 3 أيام', time: 'منذ 3 ساعات' },
  { type: 'info', text: 'خدمة جديدة متاحة في فئة الرفاهية', time: 'أمس' },
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const statusColors = {
    active: { bg: 'var(--teal-50)', color: 'var(--teal-600)' },
    pending: { bg: 'var(--accent-50)', color: 'var(--accent-600)' },
    new: { bg: 'var(--primary-50)', color: 'var(--primary-600)' },
  }
  const notifColors = { success: 'var(--teal-400)', warning: 'var(--accent-400)', info: 'var(--primary-400)' }

  return (
    <div className="animate-slide-up">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-600) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: isMobile ? '16px' : '24px 28px',
        marginBottom: 24,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 12 : 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', left: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', left: 80, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            {t('dashboard.welcome')}، {user?.name?.split(' ')[0] || 'أحمد'} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{t('dashboard.welcome_sub')}</p>
        </div>
        <button
          onClick={() => navigate('/services')}
          style={{ background: 'var(--accent-400)', color: 'var(--accent-800)', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', zIndex: 1, whiteSpace: 'nowrap' }}
        >{t('dashboard.explore_btn')} ←</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label={t('dashboard.active_requests')} value="3" change="2 هذا الأسبوع" changeType="up" />
        <StatCard label={t('dashboard.available_services')} value="24" change="5 جديدة" changeType="up" />
        <StatCard label={t('dashboard.total_requests')} value="11" change="مكتملة" changeType="up" />
        <StatCard label={t('dashboard.rating')} value="4.8" change="★ ممتاز" changeType="up" />
      </div>

      {/* Categories */}
      <SectionHeader title={t('dashboard.categories_title')} action={t('dashboard.see_all')} onAction={() => navigate('/services')} />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <div
            key={cat.key}
            className="card"
            onClick={() => navigate(`/category/${cat.slug}`)}
            style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary-100)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--gray-100)' }}
          >
            <div style={{ position: 'absolute', top: 14, left: 14, width: 22, height: 22, borderRadius: '50%', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--gray-400)' }}>←</div>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>{cat.icon}</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{t(`categories.${cat.key}.name`)}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', lineHeight: 1.6, marginBottom: 12 }}>{t(`categories.${cat.key}.desc`)}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {cat.tags.map(tag => (
                <span key={tag} className={cat.tagClass} style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 20, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent services + Quick access */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        {/* Recent services */}
        <div>
          <SectionHeader title={t('dashboard.recent_services')} action={t('dashboard.see_all')} onAction={() => navigate('/services')} />
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {MOCK_SERVICES.map((svc, i) => (
              <div
                key={svc.id}
                onClick={() => navigate(`/services/${svc.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: i < MOCK_SERVICES.length - 1 ? '0.5px solid var(--gray-50)' : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{svc.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{svc.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{t(`categories.${svc.category}.name`)}</div>
                </div>
                <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 500, background: statusColors[svc.status]?.bg, color: statusColors[svc.status]?.color }}>{svc.status_label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, minWidth: 55, textAlign: 'left' }}>{svc.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick access + Notifications */}
        <div>
          <SectionHeader title={t('dashboard.quick_access')} />
          <div style={{ marginBottom: 16 }}>
            {QUICK_ACTIONS.map(qa => (
              <button
                key={qa.key}
                onClick={() => navigate(qa.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  border: '0.5px solid var(--gray-100)',
                  marginBottom: 8, cursor: 'pointer',
                  background: 'white', width: '100%',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-50)'; e.currentTarget.style.borderColor = 'var(--primary-100)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--gray-100)' }}
              >
                <span style={{ fontSize: 16 }}>{qa.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{t(`dashboard.${qa.key}`)}</span>
                <span style={{ marginRight: 'auto', fontSize: 12, color: 'var(--gray-400)' }}>←</span>
              </button>
            ))}
          </div>

          <SectionHeader title={t('dashboard.notifications')} />
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '10px 14px',
                borderBottom: i < NOTIFICATIONS.length - 1 ? '0.5px solid var(--gray-50)' : 'none',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: notifColors[n.type], marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, lineHeight: 1.6 }}>{n.text}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--gray-400)', marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

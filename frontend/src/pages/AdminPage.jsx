import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { adminAPI, servicesAPI } from '../services/api.js'
import { EmptyState, Spinner, StatCard } from '../components/ui/index.jsx'

export default function AdminPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const roleLabels = {
    student: t('auth.student'),
    professor: t('auth.professor'),
    provider: t('auth.provider'),
    admin: t('admin.title'),
  }

  const tabs = [
    { key: 'overview', label: t('admin.overview') },
    { key: 'users', label: t('admin.users_tab') },
    { key: 'services', label: t('admin.services_tab') },
  ]

  const serviceCategoryDistribution = useMemo(() => {
    const total = services.length || 1
    const counts = services.reduce((acc, service) => {
      const key = service.category_slug || 'academic'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    return [
      { label: t('admin.category_academic'), val: Math.round(((counts.academic || 0) / total) * 100), color: 'var(--primary-400)' },
      { label: t('admin.category_stability'), val: Math.round(((counts.stability || 0) / total) * 100), color: 'var(--teal-400)' },
      { label: t('admin.category_welfare'), val: Math.round(((counts.welfare || 0) / total) * 100), color: 'var(--accent-400)' },
    ]
  }, [services, t])

  const userRoleDistribution = useMemo(() => {
    const total = users.length || 1
    const counts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})
    return [
      { label: t('admin.users_students'), val: Math.round(((counts.student || 0) / total) * 100), color: 'var(--primary-400)' },
      { label: t('admin.users_professors'), val: Math.round(((counts.professor || 0) / total) * 100), color: 'var(--teal-400)' },
      { label: t('admin.users_providers'), val: Math.round(((counts.provider || 0) / total) * 100), color: 'var(--accent-400)' },
    ]
  }, [users, t])

  useEffect(() => {
    let mounted = true
    const loadAdminData = async () => {
      setLoading(true)
      setError('')
      try {
        const [statsRes, usersRes, servicesRes] = await Promise.all([
          adminAPI.stats(),
          adminAPI.users({ page_size: 25 }),
          servicesAPI.list({ page_size: 25 }),
        ])
        if (!mounted) return
        const usersList = Array.isArray(usersRes.data?.results) ? usersRes.data.results : (Array.isArray(usersRes.data) ? usersRes.data : [])
        const servicesList = Array.isArray(servicesRes.data?.results) ? servicesRes.data.results : (Array.isArray(servicesRes.data) ? servicesRes.data : [])
        setStats(statsRes.data || {})
        setUsers(usersList)
        setServices(servicesList)
      } catch {
        if (!mounted) return
        setError(t('admin.load_error'))
        setStats(null)
        setUsers([])
        setServices([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadAdminData()
    return () => { mounted = false }
  }, [t])

  return (
    <div className="animate-slide-up">
      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'white', border: '0.5px solid var(--gray-100)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '7px 18px', borderRadius: 7, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: activeTab === tab.key ? 'var(--primary-900)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--gray-600)',
            }}
          >{tab.label}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label={t('admin.total_users')} value={String(stats?.total_users ?? 0)} />
            <StatCard label={t('admin.active_services')} value={String(stats?.active_services ?? 0)} />
            <StatCard label={t('admin.pending_requests')} value={String(stats?.pending_requests ?? 0)} />
            <StatCard label={t('admin.satisfaction')} value="94%" change={t('admin.excellent')} changeType="up" />
          </div>

          {/* Quick charts (visual bars) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{t('admin.distribution_services')}</h3>
              {serviceCategoryDistribution.map(item => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{item.label}</span><span style={{ fontWeight: 600 }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.val}%`, background: item.color, borderRadius: 10 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{t('admin.distribution_users')}</h3>
              {userRoleDistribution.map(item => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{item.label}</span><span style={{ fontWeight: 600 }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.val}%`, background: item.color, borderRadius: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 12, padding: '12px 16px', borderBottom: '0.5px solid var(--gray-100)', fontSize: 12, fontWeight: 600, color: 'var(--gray-400)' }}>
            <span>{t('admin.user')}</span>
            <span>{t('admin.role')}</span>
            <span>{t('admin.joined_at')}</span>
            <span>{t('admin.status')}</span>
            <span>{t('admin.action')}</span>
          </div>
          {users.map((user, i) => (
            <div key={user.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
              gap: 12, padding: '14px 16px', alignItems: 'center',
              borderBottom: i < MOCK_USERS.length - 1 ? '0.5px solid var(--gray-50)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary-600)', flexShrink: 0 }}>
                  {user.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{user.email}</div>
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>{roleLabels[user.role]}</span>
              <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{user.created_at?.slice(0, 10)}</span>
              <span style={{
                fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 500, display: 'inline-block',
                background: user.is_active ? 'var(--teal-50)' : 'var(--accent-50)',
                color: user.is_active ? 'var(--teal-600)' : 'var(--accent-600)',
              }}>{user.is_active ? t('admin.active') : t('admin.pending')}</span>
              <button style={{ padding: '5px 10px', border: '0.5px solid var(--gray-200)', borderRadius: 6, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'transparent' }}>
                {t('admin.manage')}
              </button>
            </div>
          ))}
          {!users.length && <EmptyState icon="👥" title={t('admin.no_users')} />}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 12, padding: '12px 16px', borderBottom: '0.5px solid var(--gray-100)', fontSize: 12, fontWeight: 600, color: 'var(--gray-400)' }}>
            <span>{t('admin.service')}</span>
            <span>{t('admin.category')}</span>
            <span>{t('admin.provider')}</span>
            <span>{t('admin.requests_count')}</span>
            <span>{t('admin.status')}</span>
          </div>
          {services.map((svc, i) => (
            <div key={svc.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
              gap: 12, padding: '14px 16px', alignItems: 'center',
              borderBottom: i < MOCK_SERVICES_ADMIN.length - 1 ? '0.5px solid var(--gray-50)' : 'none',
            }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{svc.title}</span>
              <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                {svc.category === 'academic' ? t('admin.category_academic') : svc.category === 'stability' ? t('admin.category_stability') : t('admin.category_welfare')}
              </span>
              <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>{svc.provider_name}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-900)' }}>{svc.reviews_count || 0}</span>
              <span style={{
                fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 500, display: 'inline-block', textAlign: 'center',
                background: svc.status === 'active' ? 'var(--teal-50)' : 'var(--accent-50)',
                color: svc.status === 'active' ? 'var(--teal-600)' : 'var(--accent-600)',
              }}>{svc.status === 'active' ? t('admin.active') : t('admin.pending')}</span>
            </div>
          ))}
          {!services.length && <EmptyState icon="🧩" title={t('admin.no_services')} />}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spinner size={30} />
        </div>
      )}
      {!loading && error && <EmptyState icon="⚠️" title={error} subtitle={t('common.retry')} />}
    </div>
  )
}

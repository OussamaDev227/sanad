import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { categoriesAPI, servicesAPI } from '../services/api.js'
import { useAuthStore } from '../store/index.js'
import { ServiceCard, EmptyState, Spinner } from '../components/ui/index.jsx'

export default function ServicesPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)

  const sortOrdering = useMemo(() => {
    if (sortBy === 'rating') return '-views_count'
    if (sortBy === 'price_asc') return 'price'
    return '-created_at'
  }, [sortBy])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let mounted = true
    const loadCategories = async () => {
      try {
        const res = await categoriesAPI.list()
        if (mounted) {
          setCategories(Array.isArray(res.data) ? res.data : [])
        }
      } catch {
        if (mounted) {
          setCategories([])
        }
      }
    }
    loadCategories()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    const loadServices = async () => {
      setLoading(true)
      setError('')
      try {
        const params = {
          page,
          ordering: sortOrdering,
        }
        if (search.trim()) params.search = search.trim()
        if (category !== 'all') params.category = category

        const res = await servicesAPI.list(params)
        const payload = res.data || {}
        const list = Array.isArray(payload.results) ? payload.results : (Array.isArray(payload) ? payload : [])

        if (!mounted) return
        setServices(list.map((item) => ({
          id: item.id,
          icon: item.icon || '📋',
          title: item.title,
          description: item.description,
          category: item.category_slug,
          price: item.price_label || (item.price ? `${item.price} ${t('services.price_unit')}` : t('services.free')),
          rating: item.average_rating || null,
        })))
        setHasNextPage(Boolean(payload.next))
        setHasPrevPage(Boolean(payload.previous))
      } catch {
        if (!mounted) return
        setError(t('services.load_error'))
        setServices([])
        setHasNextPage(false)
        setHasPrevPage(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadServices()
    return () => { mounted = false }
  }, [category, page, search, sortOrdering, t])

  const categoryOptions = useMemo(() => categories.map((cat) => ({
    value: cat.slug,
    label: i18n.language === 'ar' ? cat.name_ar : cat.name_fr,
  })), [categories, i18n.language])

  return (
    <div className="animate-slide-up">
      {/* Search & Filter Bar */}
      <div className="card" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ flex: 1, minWidth: isMobile ? '100%' : 200 }}
          placeholder={t('services.search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          style={{ width: isMobile ? '100%' : 160 }}
          value={category}
          onChange={e => {
            setCategory(e.target.value)
            setPage(1)
          }}
        >
          <option value="all">{t('services.all_categories')}</option>
          {categoryOptions.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          className="form-input"
          style={{ width: isMobile ? '100%' : 140 }}
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value)
            setPage(1)
          }}
        >
          <option value="newest">{t('services.sort_newest')}</option>
          <option value="rating">{t('services.sort_rating')}</option>
          <option value="price_asc">{t('services.sort_price_low')}</option>
        </select>
        <button className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '9px 18px', width: isMobile ? '100%' : 'auto' }} onClick={() => setPage(1)}>
          {t('services.search_btn')}
        </button>
      </div>

      {/* Results count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>
          {t('services.available_count', { count: services.length })}
        </span>
        <button
          className="btn-primary"
          style={{ fontSize: 12, padding: '7px 14px' }}
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/login', { state: { from: '/services' } })
              return
            }
            navigate('/services/new')
          }}
        >+ {t('services.add_service')}</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size={32} />
        </div>
      ) : error ? (
        <EmptyState icon="⚠️" title={error} subtitle={t('common.retry')} />
      ) : services.length === 0 ? (
        <EmptyState icon="🔍" title={t('services.no_results')} subtitle={t('services.search_hint')} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
          {services.map(svc => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onClick={() => navigate(`/services/${svc.id}`)}
            />
          ))}
        </div>
      )}

      {!loading && !error && (hasPrevPage || hasNextPage) && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
          <button className="btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!hasPrevPage}>
            {t('common.back')}
          </button>
          <button className="btn-primary" onClick={() => setPage((p) => p + 1)} disabled={!hasNextPage}>
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  )
}

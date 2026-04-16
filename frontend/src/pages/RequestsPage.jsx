import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/ui/index.jsx'

const MOCK_REQUESTS = [
  { id: 1, icon: '🏠', title: 'وساطة عقارية لسكن قريب من الجامعة', category: 'stability', status: 'accepted', date: '2025-11-01', price: '8,000 د' },
  { id: 2, icon: '🖨️', title: 'رقمنة وثائق مذكرة التخرج', category: 'academic', status: 'processing', date: '2025-11-03', price: '150 د' },
  { id: 9, icon: '🚌', title: 'رحلة سياحية لطلبة الجامعة', category: 'welfare', status: 'new', date: '2025-11-05', price: '3,500 د' },
  { id: 4, icon: '✍️', title: 'تدقيق لغوي — الفصل الثالث', category: 'academic', status: 'completed', date: '2025-10-20', price: '500 د' },
]

const statusMap = {
  accepted: { label: 'مقبول', bg: 'var(--teal-50)', color: 'var(--teal-600)' },
  processing: { label: 'قيد المعالجة', bg: 'var(--accent-50)', color: 'var(--accent-600)' },
  new: { label: 'جديد', bg: 'var(--primary-50)', color: 'var(--primary-600)' },
  completed: { label: 'مكتمل', bg: 'var(--gray-100)', color: 'var(--gray-600)' },
  rejected: { label: 'مرفوض', bg: '#FEF2F2', color: '#DC2626' },
}

export default function RequestsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const isMobile = window.innerWidth < 992

  const filtered = filter === 'all' ? MOCK_REQUESTS : MOCK_REQUESTS.filter(r => r.status === filter)

  return (
    <div className="animate-slide-up">
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'new', 'processing', 'accepted', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              border: '0.5px solid', cursor: 'pointer', fontFamily: 'inherit',
              background: filter === f ? 'var(--primary-900)' : 'white',
              color: filter === f ? '#fff' : 'var(--gray-600)',
              borderColor: filter === f ? 'var(--primary-900)' : 'var(--gray-200)',
            }}
          >
            {f === 'all' ? 'الكل' : statusMap[f]?.label}
          </button>
        ))}
        <button
          className="btn-primary"
          style={{ marginRight: 'auto', fontSize: 12, padding: '7px 14px', width: isMobile ? '100%' : 'auto' }}
          onClick={() => navigate('/services')}
        >+ طلب جديد</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📭" title={t('requests.no_requests')} subtitle="تصفح الخدمات لتقديم طلب جديد" />
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', gap: 12, padding: '12px 16px', borderBottom: '0.5px solid var(--gray-100)', fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', minWidth: 700 }}>
            <span>الخدمة</span>
            <span>الفئة</span>
            <span>السعر</span>
            <span>التاريخ</span>
            <span>الحالة</span>
          </div>

          {filtered.map((req, i) => {
            const s = statusMap[req.status]
            return (
              <div
                key={req.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
                  gap: 12,
                  padding: '14px 16px',
                  alignItems: 'center',
                  minWidth: 700,
                  borderBottom: i < filtered.length - 1 ? '0.5px solid var(--gray-50)' : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => navigate(`/services/${req.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{req.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{req.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>#REQ-{String(req.id).padStart(4, '0')}</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                  {req.category === 'academic' ? t('categories.academic.name') : req.category === 'stability' ? t('categories.stability.name') : t('categories.welfare.name')}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-900)' }}>{req.price}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{req.date}</span>
                <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: s.bg, color: s.color, fontWeight: 500, display: 'inline-block', textAlign: 'center' }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

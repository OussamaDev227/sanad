import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { requestsAPI } from '../services/api.js'

const MOCK_SERVICES = {
  1: { id: 1, icon: '📖', title: 'مراجع الفيزياء النظرية', description: 'مجموعة شاملة من الكتب والملخصات لمادة الفيزياء النظرية. تشمل دروس السنة الثالثة ليسانس وماستر. جميع المراجع بصيغة PDF قابلة للتنزيل.', category: 'academic', price: 'مجاني', rating: '4.9', reviews: 42, provider: 'د. محمد بوعزيز', provider_role: 'أستاذ محاضر', phone: '+213 555 123 456', available: true },
  2: { id: 2, icon: '🖨️', title: 'رقمنة الوثائق الورقية', description: 'خدمة تحويل الوثائق الورقية الجامعية والإدارية إلى ملفات رقمية واضحة ومرتبة، مع إمكانية دمج الصفحات وتحسين الجودة.', category: 'academic', price: '150 د', rating: '4.7', reviews: 38, provider: 'مكتبة النجاح', provider_role: 'مزود خدمة', phone: '+213 555 789 012', available: true },
  3: { id: 3, icon: '✍️', title: 'تدقيق لغوي للمذكرات', description: 'مراجعة لغوية شاملة للمذكرات والبحوث مع تصحيح الصياغة والأخطاء وتحسين الانسجام العام للنص.', category: 'academic', price: '500 د', rating: '4.8', reviews: 27, provider: 'أ. سمية قادة', provider_role: 'مزود خدمة', phone: '+213 555 654 210', available: true },
  4: { id: 4, icon: '📝', title: 'تدقيق لغوي للبحوث', description: 'خدمة موجهة للبحوث الجامعية والتقارير الأكاديمية مع تحسين الأسلوب والمحافظة على سلامة اللغة.', category: 'academic', price: '400 د', rating: '4.6', reviews: 21, provider: 'أ. مريم زروقي', provider_role: 'مزود خدمة', phone: '+213 555 654 211', available: true },
  5: { id: 5, icon: '🏠', title: 'وساطة عقارية لسكن قريب من الجامعة', description: 'خدمة مرافقة للعثور على سكن مناسب قريب من الجامعة مع توجيه في الاختيار ومساعدة أولية في الاستقرار.', category: 'stability', price: '8,000 د/شهر', rating: '4.6', reviews: 15, provider: 'حسين مالكي', provider_role: 'وسيط عقاري', phone: '+213 555 456 789', available: true },
  8: { id: 8, icon: '🚌', title: 'تنظيم رحلات سياحية جماعية', description: 'تنظيم رحلات سياحية للطلبة تشمل التنسيق، الحجوزات، وبرمجة الأنشطة الترفيهية والثقافية خلال الرحلة.', category: 'welfare', price: '200 د/يوم', rating: '4.9', reviews: 64, provider: 'جمعية النشاطات الطلابية', provider_role: 'مزود خدمة', phone: '+213 555 321 654', available: true },
  9: { id: 9, icon: '✈️', title: 'تنظيم أمسية ثقافية جامعية', description: 'تنظيم أمسية ثقافية للطلبة تتضمن فقرات أدبية وفنية ومسابقات بجوائز في أجواء تفاعلية.', category: 'welfare', price: '3,500 د', rating: '4.7', reviews: 18, provider: 'نادي الثقافة الجامعي', provider_role: 'مزود خدمة', phone: '+213 555 321 655', available: true },
}

export default function ServiceDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [requested, setRequested] = useState(false)
  const [loading, setLoading] = useState(false)

  const service = MOCK_SERVICES[parseInt(id)] || MOCK_SERVICES[1]

  const catColors = {
    academic: { bg: 'var(--primary-50)', color: 'var(--primary-600)', name: t('categories.academic.name') },
    stability: { bg: 'var(--teal-50)', color: 'var(--teal-600)', name: t('categories.stability.name') },
    welfare: { bg: 'var(--accent-50)', color: 'var(--accent-600)', name: t('categories.welfare.name') },
  }
  const cat = catColors[service.category]

  const handleRequest = async () => {
    setLoading(true)
    try {
      await requestsAPI.create({ service_id: service.id, notes: '' })
    } catch {
      // mock
    }
    setTimeout(() => { setRequested(true); setLoading(false) }, 800)
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: 800, margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--gray-400)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
      >→ {t('common.back')}</button>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{service.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>{service.title}</h1>
              <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: cat.bg, color: cat.color, fontWeight: 500 }}>{cat.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray-400)' }}>
              <span>★ {service.rating} ({service.reviews} تقييم)</span>
              <span style={{ color: service.available ? 'var(--teal-600)' : 'var(--coral-400)' }}>
                {service.available ? '● متاح الآن' : '● غير متاح'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-900)' }}>{service.price}</div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>وصف الخدمة</h3>
          <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.8 }}>{service.description}</p>
        </div>

        {requested ? (
          <div style={{ background: 'var(--teal-50)', border: '0.5px solid var(--teal-400)', borderRadius: 10, padding: '14px 18px', fontSize: 14, color: 'var(--teal-600)', textAlign: 'center', fontWeight: 500 }}>
            ✓ تم تقديم طلبك بنجاح! سيتم التواصل معك قريباً.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleRequest}
              className="btn-primary"
              style={{ flex: 1, padding: '12px', fontSize: 14 }}
              disabled={loading}
            >
              {loading ? '...' : t('services.book_now')}
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '12px 20px', fontSize: 13 }}
            >مشاركة</button>
          </div>
        )}
      </div>

      {/* Provider info */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>معلومات المزود</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>
            {service.provider[0]}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{service.provider}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{service.provider_role}</div>
            <div style={{ fontSize: 12, color: 'var(--primary-400)', marginTop: 2 }}>{service.phone}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

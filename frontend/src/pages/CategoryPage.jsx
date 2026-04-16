import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ServiceCard, SectionHeader } from '../components/ui/index.jsx'

const CATEGORY_DATA = {
  academic: {
    icon: '📚', gradient: 'linear-gradient(135deg, var(--primary-900), var(--primary-600))',
    subcategories: [
      { icon: '📖', key: 'references', services: [
        { id: 1, icon: '📖', title: 'مراجع الفيزياء النظرية', description: 'توفير مراجع وملخصات دروس بصيغة رقمية', category: 'academic', price: 'مجاني', rating: '4.9' },
        { id: 11, icon: '📗', title: 'مراجع الرياضيات', description: 'مراجع وتمارين محلولة حسب المستوى', category: 'academic', price: 'مجاني', rating: '4.8' },
      ]},
      { icon: '🖨️', key: 'printing', services: [
        { id: 2, icon: '🖨️', title: 'رقمنة الوثائق الورقية', description: 'تحويل الوثائق إلى ملفات رقمية جاهزة', category: 'academic', price: '150 د', rating: '4.7' },
      ]},
      { icon: '✍️', key: 'proofreading', services: [
        { id: 3, icon: '✍️', title: 'تدقيق لغوي للمذكرات', description: 'مراجعة لغوية وصياغية دقيقة', category: 'academic', price: '500 د', rating: '4.8' },
        { id: 4, icon: '📝', title: 'تدقيق لغوي للبحوث', description: 'تحسين الأسلوب وسلامة اللغة', category: 'academic', price: '400 د', rating: '4.6' },
      ]},
    ]
  },
  stability: {
    icon: '🏠', gradient: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
    subcategories: [
      { icon: '🏠', key: 'housing', services: [
        { id: 5, icon: '🏠', title: 'وساطة عقارية لسكن قريب من الجامعة', description: 'اقتراحات ومرافقة لاختيار سكن مناسب', category: 'stability', price: '8,000 د', rating: '4.6' },
        { id: 6, icon: '🏢', title: 'مرافقة للبحث عن شقة للطلاب', description: 'خيارات سكن مستقلة بمرافق مناسبة', category: 'stability', price: '14,000 د', rating: '4.4' },
      ]},
      { icon: '💺', key: 'equipment', services: [
        { id: 7, icon: '💺', title: 'تجهيز سكن الطالب', description: 'أثاث وتجهيزات أساسية للسكن', category: 'stability', price: '2,000 د', rating: '4.5' },
      ]},
    ]
  },
  welfare: {
    icon: '🚌', gradient: 'linear-gradient(135deg, var(--accent-600), var(--accent-400))',
    subcategories: [
      { icon: '🚌', key: 'transport', services: [
        { id: 8, icon: '🚌', title: 'تنظيم رحلات سياحية جماعية', description: 'رحلات مبرمجة للطلبة داخل وخارج الولاية', category: 'welfare', price: '200 د', rating: '4.9' },
        { id: 10, icon: '🚗', title: 'حجز تنقل للرحلات الطلابية', description: 'تنسيق وسائل التنقل للأنشطة والخرجات', category: 'welfare', price: '1,500 د', rating: '4.3' },
      ]},
      { icon: '✈️', key: 'trips', services: [
        { id: 9, icon: '✈️', title: 'تنظيم أمسية ثقافية جامعية', description: 'أمسية منظمة بفقرات ثقافية متنوعة', category: 'welfare', price: '3,500 د', rating: '4.7' },
      ]},
    ]
  }
}

export default function CategoryPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const data = CATEGORY_DATA[slug] || CATEGORY_DATA.academic

  return (
    <div className="animate-slide-up">
      {/* Banner */}
      <div style={{ background: data.gradient, borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 40 }}>{data.icon}</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t(`categories.${slug}.name`)}</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{t(`categories.${slug}.desc`)}</p>
        </div>
      </div>

      {/* Subcategories */}
      {data.subcategories.map(sub => (
        <div key={sub.key} style={{ marginBottom: 28 }}>
          <SectionHeader
            title={`${sub.icon} ${t(`categories.${slug}.${sub.key}`)}`}
            action={t('dashboard.see_all')}
            onAction={() => navigate('/services')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 14 }}>
            {sub.services.map(svc => (
              <ServiceCard key={svc.id} service={svc} onClick={() => navigate(`/services/${svc.id}`)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

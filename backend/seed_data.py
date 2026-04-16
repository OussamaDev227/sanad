"""
Run with: python manage.py shell < seed_data.py
Or: python manage.py runscript seed_data  (with django-extensions)
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sanad_project.settings')
django.setup()

from apps.users.models import User
from apps.services_app.models import Category, SubCategory, Service

print("🌱 Seeding SANAD database...")

# ── Categories ───────────────────────────────────────────────────────
categories_data = [
    {
        'slug': 'academic',
        'name_ar': 'الخدمات الأكاديمية',
        'name_fr': 'Services académiques',
        'description_ar': 'توفير مراجع، طباعة، تحويل الوثائق الورقية إلى ملفات رقمية، التدقيق اللغوي',
        'description_fr': 'Références, impression, correction',
        'icon': '📚',
        'order': 1,
        'subs': [
            {'slug': 'references', 'name_ar': 'توفير مراجع', 'name_fr': 'Fourniture de references', 'icon': '📖'},
            {'slug': 'printing', 'name_ar': 'تحويل الوثائق الورقية إلى ملفات رقمية', 'name_fr': 'Numerisation des documents papier', 'icon': '🖨️'},
            {'slug': 'proofreading', 'name_ar': 'التدقيق اللغوي', 'name_fr': 'Correction linguistique', 'icon': '✍️'},
        ]
    },
    {
        'slug': 'stability',
        'name_ar': 'خدمات الحياة اليومية و الاستقرار',
        'name_fr': 'Services de stabilité',
        'description_ar': 'الوساطة العقارية، تجهيز السكن، المساعدة في نقل الأمتعة، حجز تذاكر التنقل',
        'description_fr': 'Location logement et équipements',
        'icon': '🏠',
        'order': 2,
        'subs': [
            {'slug': 'housing', 'name_ar': 'الوساطة العقارية', 'name_fr': 'Intermédiation immobilière', 'icon': '🏠'},
            {'slug': 'equipment', 'name_ar': 'تجهيز السكن', 'name_fr': 'Aménagement du logement', 'icon': '💺'},
        ]
    },
    {
        'slug': 'welfare',
        'name_ar': 'الخدمات الاجتماعية، الثقافية و الترفيهية',
        'name_fr': 'Services de bien-être',
        'description_ar': 'تنظيم رحلات سياحية، تنظيم أمسيات ثقافية، ورشات، مسابقات بجوائز',
        'description_fr': 'Voyages touristiques, soirées culturelles, ateliers, concours avec prix',
        'icon': '🚌',
        'order': 3,
        'subs': [
            {'slug': 'transport', 'name_ar': 'تنظيم رحلات سياحية', 'name_fr': 'Organisation de voyages touristiques', 'icon': '🚌'},
            {'slug': 'trips', 'name_ar': 'تنظيم أمسيات ثقافية', 'name_fr': 'Organisation de soirées culturelles', 'icon': '✈️'},
        ]
    },
]

for cat_data in categories_data:
    subs = cat_data.pop('subs')
    cat, _ = Category.objects.update_or_create(slug=cat_data['slug'], defaults=cat_data)
    for sub in subs:
        SubCategory.objects.update_or_create(category=cat, slug=sub['slug'], defaults=sub)
    print(f"  ✓ Category: {cat.name_ar}")

# ── Admin user ───────────────────────────────────────────────────────
admin_user, created = User.objects.get_or_create(
    email='admin@sanad.dz',
    defaults={
        'name': 'مدير النظام',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True,
    }
)
if created:
    admin_user.set_password('admin1234')
    admin_user.save()
    print("  ✓ Admin user: admin@sanad.dz / admin1234")

# ── Demo provider ────────────────────────────────────────────────────
provider, created = User.objects.get_or_create(
    email='provider@sanad.dz',
    defaults={'name': 'مكتبة النجاح', 'role': 'provider'}
)
if created:
    provider.set_password('provider1234')
    provider.save()
    print("  ✓ Provider: provider@sanad.dz / provider1234")

# ── Demo student ─────────────────────────────────────────────────────
student, created = User.objects.get_or_create(
    email='student@sanad.dz',
    defaults={'name': 'أحمد بن علي', 'role': 'student', 'speciality': 'الفيزياء النظرية'}
)
if created:
    student.set_password('student1234')
    student.save()
    print("  ✓ Student: student@sanad.dz / student1234")

# ── Sample services ──────────────────────────────────────────────────
academic = Category.objects.get(slug='academic')
stability = Category.objects.get(slug='stability')
welfare = Category.objects.get(slug='welfare')

services_data = [
    {
        'title': 'مراجع الفيزياء النظرية',
        'description': 'خدمة توفير مراجع وملخصات أكاديمية للطلبة حسب التخصص والمقياس.',
        'category': academic,
        'price_label': 'مجاني',
        'icon': '📖',
        'provider': provider,
    },
    {
        'title': 'رقمنة الوثائق الورقية',
        'description': 'تحويل الوثائق الورقية إلى ملفات رقمية واضحة ومنظمة بصيغ مناسبة للاستعمال الأكاديمي والإداري.',
        'category': academic,
        'price': 150,
        'price_label': '150 د',
        'icon': '🖨️',
        'provider': provider,
    },
    {
        'title': 'تدقيق لغوي للمذكرات',
        'description': 'مراجعة لغوية دقيقة للمذكرات والبحوث الجامعية لتحسين الصياغة وسلامة اللغة.',
        'category': academic,
        'price': 500,
        'price_label': '500 د',
        'icon': '✍️',
        'provider': provider,
    },
    {
        'title': 'وساطة عقارية لسكن قريب من الجامعة',
        'description': 'مرافقة في البحث عن سكن مناسب قريب من الجامعة مع اقتراحات وتجهيز أولي للسكن.',
        'category': stability,
        'price': 8000,
        'price_label': '8,000 د/شهر',
        'icon': '🏠',
        'provider': provider,
        'location': 'شارع الجامعة، وهران',
    },
    {
        'title': 'تنظيم رحلة سياحية للطلبة',
        'description': 'تنظيم خرجة ترفيهية وثقافية للطلبة تشمل التنسيق، الحجز، والمتابعة.',
        'category': welfare,
        'price': 200,
        'price_label': '200 د/يوم',
        'icon': '🚌',
        'provider': provider,
    },
]

for svc_data in services_data:
    svc, created = Service.objects.get_or_create(
        title=svc_data['title'],
        provider=provider,
        defaults=svc_data
    )
    if created:
        print(f"  ✓ Service: {svc.title}")

print("\n✅ Seeding complete!")
print("\nDemo accounts:")
print("  Admin:    admin@sanad.dz    / admin1234")
print("  Provider: provider@sanad.dz / provider1234")
print("  Student:  student@sanad.dz  / student1234")

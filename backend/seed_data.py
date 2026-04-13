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
        'description_ar': 'مراجع علمية، طباعة، تدقيق لغوي',
        'description_fr': 'Références, impression, correction',
        'icon': '📚',
        'order': 1,
        'subs': [
            {'slug': 'references', 'name_ar': 'مراجع ومذكرات', 'name_fr': 'Références et mémoires', 'icon': '📖'},
            {'slug': 'printing', 'name_ar': 'خدمات الطباعة', 'name_fr': "Services d'impression", 'icon': '🖨️'},
            {'slug': 'proofreading', 'name_ar': 'التدقيق اللغوي', 'name_fr': 'Correction linguistique', 'icon': '✍️'},
        ]
    },
    {
        'slug': 'stability',
        'name_ar': 'خدمات الاستقرار',
        'name_fr': 'Services de stabilité',
        'description_ar': 'إيجار السكن والتجهيزات',
        'description_fr': 'Location logement et équipements',
        'icon': '🏠',
        'order': 2,
        'subs': [
            {'slug': 'housing', 'name_ar': 'السكن', 'name_fr': 'Logement', 'icon': '🏠'},
            {'slug': 'equipment', 'name_ar': 'التجهيزات', 'name_fr': 'Équipements', 'icon': '💺'},
        ]
    },
    {
        'slug': 'welfare',
        'name_ar': 'خدمات الرفاهية',
        'name_fr': 'Services de bien-être',
        'description_ar': 'النقل والرحلات والترفيه',
        'description_fr': 'Transport, voyages, loisirs',
        'icon': '🚌',
        'order': 3,
        'subs': [
            {'slug': 'transport', 'name_ar': 'النقل', 'name_fr': 'Transport', 'icon': '🚌'},
            {'slug': 'trips', 'name_ar': 'الرحلات', 'name_fr': 'Voyages', 'icon': '✈️'},
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
        'description': 'مجموعة شاملة من الكتب والملخصات لمادة الفيزياء النظرية. تشمل دروس السنة الثالثة ليسانس وماستر.',
        'category': academic,
        'price_label': 'مجاني',
        'icon': '📖',
        'provider': provider,
    },
    {
        'title': 'طباعة وتجليد المذكرات',
        'description': 'خدمة طباعة احترافية لمذكرات التخرج والوثائق الجامعية. طباعة ملونة، تجليد صلب أو ناعم.',
        'category': academic,
        'price': 150,
        'price_label': '150 د',
        'icon': '🖨️',
        'provider': provider,
    },
    {
        'title': 'تدقيق لغوي فرنسي',
        'description': 'تدقيق وتصحيح المذكرات بالفرنسية من طرف متخصصين في اللغة الفرنسية.',
        'category': academic,
        'price': 500,
        'price_label': '500 د',
        'icon': '✍️',
        'provider': provider,
    },
    {
        'title': 'غرفة مفروشة شارع الجامعة',
        'description': 'غرفة مفروشة بالكامل في شقة مشتركة على بعد 5 دقائق من الحرم الجامعي.',
        'category': stability,
        'price': 8000,
        'price_label': '8,000 د/شهر',
        'icon': '🏠',
        'provider': provider,
        'location': 'شارع الجامعة، وهران',
    },
    {
        'title': 'حافلة يومية الجامعة',
        'description': 'خدمة النقل اليومي من المدينة إلى الحرم الجامعي. مواعيد: 7:30 و 8:30 صباحاً.',
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

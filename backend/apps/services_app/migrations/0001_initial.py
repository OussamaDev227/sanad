from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(unique=True)),
                ("name_ar", models.CharField(max_length=100)),
                ("name_fr", models.CharField(max_length=100)),
                ("description_ar", models.TextField(blank=True)),
                ("description_fr", models.TextField(blank=True)),
                ("icon", models.CharField(blank=True, max_length=10)),
                ("order", models.PositiveIntegerField(default=0)),
            ],
            options={
                "db_table": "categories",
                "ordering": ["order"],
                "verbose_name": "فئة",
                "verbose_name_plural": "الفئات",
            },
        ),
        migrations.CreateModel(
            name="Service",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("price", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("price_label", models.CharField(blank=True, help_text="e.g. مجاني / شهرياً", max_length=50)),
                ("icon", models.CharField(blank=True, max_length=10)),
                ("images", models.JSONField(blank=True, default=list)),
                ("status", models.CharField(choices=[("active", "نشط"), ("inactive", "غير نشط"), ("pending", "قيد المراجعة")], default="active", max_length=20)),
                ("is_active", models.BooleanField(default=True)),
                ("phone", models.CharField(blank=True, max_length=20)),
                ("location", models.CharField(blank=True, max_length=200)),
                ("tags", models.JSONField(blank=True, default=list)),
                ("views_count", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="services", to="services_app.category")),
                ("provider", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="services", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "db_table": "services",
                "ordering": ["-created_at"],
                "verbose_name": "خدمة",
                "verbose_name_plural": "الخدمات",
            },
        ),
        migrations.CreateModel(
            name="SubCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField()),
                ("name_ar", models.CharField(max_length=100)),
                ("name_fr", models.CharField(max_length=100)),
                ("icon", models.CharField(blank=True, max_length=10)),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="subcategories", to="services_app.category")),
            ],
            options={
                "db_table": "subcategories",
                "unique_together": {("category", "slug")},
            },
        ),
        migrations.AddField(
            model_name="service",
            name="subcategory",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="services_app.subcategory"),
        ),
        migrations.CreateModel(
            name="ServiceReview",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("rating", models.PositiveSmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ("comment", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("service", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="reviews", to="services_app.service")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "db_table": "service_reviews",
                "unique_together": {("service", "user")},
            },
        ),
    ]

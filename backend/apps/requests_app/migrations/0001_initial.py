from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("services_app", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Request",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("status", models.CharField(choices=[("new", "جديد"), ("processing", "قيد المعالجة"), ("accepted", "مقبول"), ("rejected", "مرفوض"), ("completed", "مكتمل"), ("cancelled", "ملغى")], default="new", max_length=20)),
                ("notes", models.TextField(blank=True)),
                ("provider_notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("service", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="requests", to="services_app.service")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="requests", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "db_table": "requests",
                "ordering": ["-created_at"],
                "verbose_name": "طلب",
                "verbose_name_plural": "الطلبات",
            },
        ),
        migrations.CreateModel(
            name="Notification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("type", models.CharField(choices=[("info", "معلومة"), ("success", "نجاح"), ("warning", "تحذير"), ("error", "خطأ")], default="info", max_length=10)),
                ("title", models.CharField(max_length=200)),
                ("body", models.TextField(blank=True)),
                ("is_read", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("related_request", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="requests_app.request")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="notifications", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "db_table": "notifications",
                "ordering": ["-created_at"],
            },
        ),
    ]

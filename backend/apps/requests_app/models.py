from django.db import models
from django.conf import settings


class Request(models.Model):
    STATUS_CHOICES = [
        ('new', 'جديد'),
        ('processing', 'قيد المعالجة'),
        ('accepted', 'مقبول'),
        ('rejected', 'مرفوض'),
        ('completed', 'مكتمل'),
        ('cancelled', 'ملغى'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='requests',
        on_delete=models.CASCADE
    )
    service = models.ForeignKey(
        'services_app.Service',
        related_name='requests',
        on_delete=models.CASCADE
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    notes = models.TextField(blank=True)
    provider_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'requests'
        ordering = ['-created_at']
        verbose_name = 'طلب'
        verbose_name_plural = 'الطلبات'

    def __str__(self):
        return f'طلب #{self.pk} — {self.service.title} ({self.user.name})'


class Notification(models.Model):
    TYPE_CHOICES = [('info', 'معلومة'), ('success', 'نجاح'), ('warning', 'تحذير'), ('error', 'خطأ')]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='notifications',
        on_delete=models.CASCADE
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    related_request = models.ForeignKey(Request, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.name} — {self.title}'

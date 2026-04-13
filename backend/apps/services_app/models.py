from django.db import models
from django.conf import settings


class Category(models.Model):
    slug = models.SlugField(unique=True)
    name_ar = models.CharField(max_length=100)
    name_fr = models.CharField(max_length=100)
    description_ar = models.TextField(blank=True)
    description_fr = models.TextField(blank=True)
    icon = models.CharField(max_length=10, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'categories'
        ordering = ['order']
        verbose_name = 'فئة'
        verbose_name_plural = 'الفئات'

    def __str__(self):
        return self.name_ar


class SubCategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    slug = models.SlugField()
    name_ar = models.CharField(max_length=100)
    name_fr = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, blank=True)

    class Meta:
        db_table = 'subcategories'
        unique_together = ('category', 'slug')

    def __str__(self):
        return self.name_ar


class Service(models.Model):
    STATUS_CHOICES = [
        ('active', 'نشط'),
        ('inactive', 'غير نشط'),
        ('pending', 'قيد المراجعة'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name='services', on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, null=True, blank=True, on_delete=models.SET_NULL)
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='services',
        on_delete=models.CASCADE
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_label = models.CharField(max_length=50, blank=True, help_text='e.g. مجاني / شهرياً')
    icon = models.CharField(max_length=10, blank=True)
    images = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_active = models.BooleanField(default=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    tags = models.JSONField(default=list, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'services'
        ordering = ['-created_at']
        verbose_name = 'خدمة'
        verbose_name_plural = 'الخدمات'

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    @property
    def reviews_count(self):
        return self.reviews.count()


class ServiceReview(models.Model):
    service = models.ForeignKey(Service, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'service_reviews'
        unique_together = ('service', 'user')

    def __str__(self):
        return f'{self.service.title} — {self.rating}★'

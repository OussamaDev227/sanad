from django.contrib import admin
from .models import Category, SubCategory, Service, ServiceReview


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name_ar', 'slug', 'order']
    prepopulated_fields = {'slug': ('name_ar',)}


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_ar', 'category', 'slug']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'provider', 'price', 'status', 'is_active', 'created_at']
    list_filter = ['category', 'status', 'is_active']
    search_fields = ['title', 'description']
    readonly_fields = ['views_count', 'created_at', 'updated_at']


@admin.register(ServiceReview)
class ServiceReviewAdmin(admin.ModelAdmin):
    list_display = ['service', 'user', 'rating', 'created_at']

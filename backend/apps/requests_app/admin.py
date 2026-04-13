from django.contrib import admin
from .models import Request, Notification


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'service', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['user__name', 'service__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'type', 'is_read', 'created_at']
    list_filter = ['type', 'is_read']

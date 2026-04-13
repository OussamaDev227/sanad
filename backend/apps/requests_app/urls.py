from django.urls import path
from . import views

urlpatterns = [
    # User requests
    path('', views.UserRequestListCreateView.as_view(), name='request-list-create'),
    path('<int:pk>/', views.RequestDetailView.as_view(), name='request-detail'),
    path('<int:pk>/cancel/', views.cancel_request, name='request-cancel'),

    # Provider
    path('provider/', views.ProviderRequestListView.as_view(), name='provider-requests'),
    path('<int:pk>/status/', views.update_request_status, name='request-status-update'),

    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/read/', views.mark_notifications_read, name='notifications-read'),
]

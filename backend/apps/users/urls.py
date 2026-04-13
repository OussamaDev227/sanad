from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('me/', views.me, name='me'),
    path('me/update/', views.update_profile, name='update-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    # Admin
    path('admin/users/', views.AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', views.admin_update_user, name='admin-user-update'),
    path('admin/stats/', views.admin_stats, name='admin-stats'),
]

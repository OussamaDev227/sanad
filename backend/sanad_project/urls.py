from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', lambda request: JsonResponse({'status': 'ok'}), name='health'),

    # API v1
    path('api/auth/', include('apps.users.urls')),
    path('api/services/', include('apps.services_app.urls')),
    path('api/requests/', include('apps.requests_app.urls')),

    # API docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

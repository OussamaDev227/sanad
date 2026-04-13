from django.urls import path
from . import views

urlpatterns = [
    path('', views.ServiceListCreateView.as_view(), name='service-list-create'),
    path('<int:pk>/', views.ServiceDetailView.as_view(), name='service-detail'),
    path('mine/', views.MyServicesView.as_view(), name='my-services'),
    path('<int:service_id>/reviews/', views.add_review, name='add-review'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
]

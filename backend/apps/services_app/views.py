from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Category, Service, ServiceReview
from .serializers import (
    CategorySerializer, ServiceListSerializer,
    ServiceDetailSerializer, ServiceCreateSerializer, ServiceReviewSerializer
)
from .permissions import IsProviderOrAdminWrite


# ── Categories ──────────────────────────────────────────────────────
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# ── Services ────────────────────────────────────────────────────────
class ServiceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsProviderOrAdminWrite]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'price', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Service.objects.filter(is_active=True).select_related('category', 'provider')
        category = self.request.query_params.get('category')
        subcategory = self.request.query_params.get('subcategory')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if category:
            qs = qs.filter(category__slug=category)
        if subcategory:
            qs = qs.filter(subcategory__slug=subcategory)
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ServiceCreateSerializer
        return ServiceListSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_staff or user.role in ("provider", "admin")):
            raise PermissionDenied('إنشاء الخدمات متاح للمزود أو المدير فقط')
        serializer.save()


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.select_related('category', 'provider').prefetch_related('reviews__user')
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ServiceCreateSerializer
        return ServiceDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        return Response(ServiceDetailSerializer(instance).data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.provider != request.user and not request.user.is_staff:
            return Response({'detail': 'ليس لديك صلاحية التعديل'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.provider != request.user and not request.user.is_staff:
            return Response({'detail': 'ليس لديك صلاحية الحذف'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


# ── My services (provider) ──────────────────────────────────────────
class MyServicesView(generics.ListAPIView):
    serializer_class = ServiceListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(provider=self.request.user)


# ── Reviews ─────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, service_id):
    try:
        service = Service.objects.get(pk=service_id)
    except Service.DoesNotExist:
        return Response({'detail': 'الخدمة غير موجودة'}, status=404)

    if ServiceReview.objects.filter(service=service, user=request.user).exists():
        return Response({'detail': 'لقد قيّمت هذه الخدمة من قبل'}, status=400)

    serializer = ServiceReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(service=service, user=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

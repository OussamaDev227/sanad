from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UpdateUserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UpdateUserSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(UserSerializer(request.user).data)


# ── Admin views ──────────────────────────────────────────────────────
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'detail': 'المستخدم غير موجود'}, status=404)
    serializer = UpdateUserSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(UserSerializer(user).data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    from apps.services_app.models import Service
    from apps.requests_app.models import Request
    return Response({
        'total_users': User.objects.count(),
        'active_services': Service.objects.filter(is_active=True).count(),
        'pending_requests': Request.objects.filter(status='pending').count(),
    })

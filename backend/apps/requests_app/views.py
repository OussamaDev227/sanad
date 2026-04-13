from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Request, Notification
from .serializers import RequestSerializer, RequestStatusUpdateSerializer, NotificationSerializer


# ── User: create + list own requests ────────────────────────────────
class UserRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Request.objects.filter(user=self.request.user).select_related('service__category', 'user')

    def perform_create(self, serializer):
        req = serializer.save()
        # Create notification for user
        Notification.objects.create(
            user=self.request.user,
            type='info',
            title='تم استلام طلبك',
            body=f'تم استلام طلبك للخدمة: {req.service.title}',
            related_request=req,
        )
        # Notify provider
        Notification.objects.create(
            user=req.service.provider,
            type='info',
            title='طلب جديد',
            body=f'لديك طلب جديد على خدمة: {req.service.title}',
            related_request=req,
        )


class RequestDetailView(generics.RetrieveAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Request.objects.filter(user=self.request.user)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancel_request(request, pk):
    try:
        req = Request.objects.get(pk=pk, user=request.user)
    except Request.DoesNotExist:
        return Response({'detail': 'الطلب غير موجود'}, status=404)

    if req.status not in ('new', 'processing'):
        return Response({'detail': 'لا يمكن إلغاء هذا الطلب'}, status=400)

    req.status = 'cancelled'
    req.save()
    return Response(RequestSerializer(req).data)


# ── Provider: list & update requests on own services ────────────────
class ProviderRequestListView(generics.ListAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not (self.request.user.is_staff or self.request.user.role in ('provider', 'admin')):
            return Request.objects.none()
        if self.request.user.is_staff or self.request.user.role == 'admin':
            return Request.objects.all().select_related('service__category', 'user')
        return Request.objects.filter(service__provider=self.request.user).select_related('service__category', 'user')


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_request_status(request, pk):
    if not (request.user.is_staff or request.user.role in ('provider', 'admin')):
        return Response({'detail': 'غير مصرح لك بتعديل حالة الطلب'}, status=403)
    try:
        if request.user.is_staff or request.user.role == 'admin':
            req = Request.objects.get(pk=pk)
        else:
            req = Request.objects.get(pk=pk, service__provider=request.user)
    except Request.DoesNotExist:
        return Response({'detail': 'الطلب غير موجود أو غير مصرح لك'}, status=404)

    serializer = RequestStatusUpdateSerializer(req, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    updated = serializer.save()

    # Notify user of status change
    status_labels = {
        'accepted': 'تم قبول طلبك',
        'rejected': 'تم رفض طلبك',
        'completed': 'تم إتمام طلبك',
    }
    if updated.status in status_labels:
        notif_type = 'success' if updated.status in ('accepted', 'completed') else 'warning'
        Notification.objects.create(
            user=req.user,
            type=notif_type,
            title=status_labels[updated.status],
            body=f'الخدمة: {req.service.title}',
            related_request=req,
        )

    return Response(RequestSerializer(updated).data)


# ── Notifications ────────────────────────────────────────────────────
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'detail': 'تم تحديد جميع الإشعارات كمقروءة'})

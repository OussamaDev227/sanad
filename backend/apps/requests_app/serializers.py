from rest_framework import serializers
from .models import Request, Notification
from apps.users.serializers import UserSerializer
from apps.services_app.serializers import ServiceListSerializer


class RequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service = ServiceListSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('apps.services_app.models', fromlist=['Service']).Service.objects.all(),
        write_only=True,
        source='service'
    )

    class Meta:
        model = Request
        fields = [
            'id', 'user', 'service', 'service_id',
            'status', 'notes', 'provider_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'provider_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class RequestStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ['status', 'provider_notes']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'body', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']

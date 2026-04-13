from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'language', 'speciality', 'phone', 'avatar', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'confirm_password', 'role', 'language']

    def validate(self, data):
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'كلمتا المرور غير متطابقتين'})
        return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('بيانات الدخول غير صحيحة')
        if not user.is_active:
            raise serializers.ValidationError('الحساب غير مفعل')
        data['user'] = user
        return data


class AuthResponseSerializer(serializers.Serializer):
    user = UserSerializer()
    access = serializers.CharField()
    refresh = serializers.CharField()


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'speciality', 'phone', 'language', 'avatar']

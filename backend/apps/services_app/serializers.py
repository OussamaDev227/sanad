from rest_framework import serializers
from .models import Category, SubCategory, Service, ServiceReview
from apps.users.serializers import UserSerializer


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'slug', 'name_ar', 'name_fr', 'icon']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    services_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'slug', 'name_ar', 'name_fr', 'description_ar', 'description_fr', 'icon', 'subcategories', 'services_count']

    def get_services_count(self, obj):
        return obj.services.filter(is_active=True).count()


class ServiceReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ServiceReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ServiceListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    category_name_fr = serializers.CharField(source='category.name_fr', read_only=True)
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'description', 'icon', 'price', 'price_label',
            'category_slug', 'category_name_ar', 'category_name_fr',
            'provider_name', 'average_rating', 'reviews_count',
            'status', 'is_active', 'location', 'tags', 'created_at'
        ]


class ServiceDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    provider = UserSerializer(read_only=True)
    reviews = ServiceReviewSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Service
        fields = '__all__'


class ServiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'title', 'description', 'category', 'subcategory',
            'price', 'price_label', 'icon', 'images',
            'phone', 'location', 'tags'
        ]

    def create(self, validated_data):
        validated_data['provider'] = self.context['request'].user
        return super().create(validated_data)

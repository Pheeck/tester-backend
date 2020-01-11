from rest_framework import serializers
from backend.models import TestObject

class TestObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestObject
        fields = '__all__'

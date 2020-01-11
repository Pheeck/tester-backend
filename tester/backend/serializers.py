from rest_framework import serializers
from backend.models import TestObject, Question

class TestObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestObject
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
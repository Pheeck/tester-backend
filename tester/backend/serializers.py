from rest_framework import serializers
from backend.models import Question


def test_func()


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    size = serializers.IntegerField(source='test_func', read_only=True)
    
    class Meta:
        model = Question
        fields = ['name', 'question']
from rest_framework import serializers
from backend.models import Question, Set


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class SetRetrieveSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Set
        fields = ('name', 'questions', 'size')
        read_only_fields = ('questions', 'size')
    
    def get_size(self, obj):
        return obj.size

class SetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ('name', 'questions')
        read_only_fields = ('questions',)

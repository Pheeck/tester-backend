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
        fields = ('name', 'questions', 'size', 'uuid')
        read_only_fields = ('questions', 'size', 'uuid')
    
    def get_size(self, obj):
        return obj.size

class SetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ('name', 'questions', 'uuid')
        read_only_fields = ('questions', 'uuid')

class SetCreateFromTextSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    text = serializers.CharField(max_length=20000)
from rest_framework import serializers
from backend.models import Question, Answer, Set, Result


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = '__all__'

class SetRetrieveSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Set
        fields = ('name', 'choose', 'questions', 'size', 'uuid', 'totalAnswered', 'totalSuccesses')
        read_only_fields = ('questions', 'size', 'uuid', 'totalAnswered', 'totalSuccesses')
    
    def get_size(self, obj):
        return obj.size

class SetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ('name', 'choose', 'questions', 'uuid', 'totalAnswered', 'totalSuccesses')
        read_only_fields = ('questions', 'uuid', 'totalAnswered', 'totalSuccesses')

class SetCreateFromTextSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    choose = serializers.BooleanField(default=False)
    text = serializers.CharField(max_length=20000)

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'

from django.shortcuts import render

from rest_framework import generics

from backend.models import TestObject, Question
from backend.serializers import TestObjectSerializer, QuestionSerializer

class TestObjectListCreate(generics.ListCreateAPIView):
    queryset = TestObject.objects.all()
    serializer_class = TestObjectSerializer

class QuestionListCreate(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
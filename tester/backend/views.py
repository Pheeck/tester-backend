from django.shortcuts import render

from rest_framework import generics

from backend.models import Question
from backend.serializers import QuestionSerializer


class QuestionListCreate(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
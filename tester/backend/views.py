from django.shortcuts import render

from django.db.models import Count

from rest_framework import generics, status
from rest_framework.response import Response

from backend.models import Question, Set
from backend.serializers import QuestionSerializer, SetRetrieveSerializer, SetCreateSerializer


class QuestionList(generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionRetrieve(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionCreate(generics.CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class SetList(generics.ListAPIView):
    queryset = Set.objects.all().annotate(size=Count('questions'))
    serializer_class = SetRetrieveSerializer

class SetRetrieve(generics.RetrieveAPIView):
    queryset = Set.objects.all().annotate(size=Count('questions'))
    serializer_class = SetRetrieveSerializer

class SetCreate(generics.CreateAPIView):
    queryset = Set.objects.all()
    serializer_class = SetCreateSerializer

from django.shortcuts import render

from django.http import Http404

from django.db.models import Count

from django.core.exceptions import ObjectDoesNotExist

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

class SetRetrieveByUUID(generics.GenericAPIView):
    queryset = Set.objects.all().annotate(size=Count('questions'))
    serializer_class = SetRetrieveSerializer

    def get(self, request, uuid=None):
        lookup = {'uuid': uuid}
        try:
            questionSet = self.queryset.get(**lookup)
        except ObjectDoesNotExist:
            raise Http404('Invalid UUID')
        serializer = SetRetrieveSerializer(questionSet, context={'request': request})
        return Response(serializer.data)

class SetCreate(generics.CreateAPIView):
    queryset = Set.objects.all()
    serializer_class = SetCreateSerializer

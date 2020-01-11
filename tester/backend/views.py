from django.shortcuts import render

from rest_framework import generics

from backend.models import TestObject
from backend.serializers import TestObjectSerializer

class TestObjectListCreate(generics.ListCreateAPIView):
    queryset = TestObject.objects.all()
    serializer_class = TestObjectSerializer

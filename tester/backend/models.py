from django.db import models

class TestObject(models.Model):
    name = models.CharField(max_length=100)

class Question(models.Model):
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)
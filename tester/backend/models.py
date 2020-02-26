from django.db import models


class Question(models.Model):
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)

class Set(models.Model):
    name = models.CharField(max_length=100)
    size = models.IntegerField()
    # TODO Size field which gets computed from number of questions
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

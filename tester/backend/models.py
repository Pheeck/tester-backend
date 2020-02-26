from django.db import models


class Set(models.Model):
    name = models.CharField(max_length=100)

class Question(models.Model):
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)
    set = models.ForeignKey(Set, related_name='questions', on_delete=models.CASCADE)

from django.db import models

from uuid import uuid4


def make_uuid():
   return str(uuid4())


class Set(models.Model):
   name = models.CharField(max_length=100)
   choose = models.BooleanField(default=False)
   uuid = models.CharField(
      editable=False, max_length=36, db_index=True, 
      unique=True, default=make_uuid
   )
   totalAnswered = models.PositiveIntegerField(default=0)
   totalSuccesses = models.PositiveIntegerField(default=0)

class Question(models.Model):
   set = models.ForeignKey(Set, related_name='questions', on_delete=models.CASCADE)
   question = models.CharField(max_length=100)
   category = models.CharField(max_length=100, default='')

class Answer(models.Model):
   question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
   correct = models.BooleanField()
   answer = models.CharField(max_length=100)

class Result(models.Model):
   set = models.ForeignKey(Set, to_field='uuid', related_name='results', on_delete=models.CASCADE)
   answered = models.IntegerField()
   successes = models.IntegerField()

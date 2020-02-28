from django.db import models

from uuid import uuid4


def make_uuid():
   return str(uuid4())


class Set(models.Model):
    name = models.CharField(max_length=100)
    uuid = models.CharField(
      editable=False, max_length=36, db_index=True, 
      unique=True, default=make_uuid
   )

class Question(models.Model):
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)
    set = models.ForeignKey(Set, related_name='questions', on_delete=models.CASCADE)

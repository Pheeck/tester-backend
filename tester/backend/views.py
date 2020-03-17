from django.shortcuts import render

from django.http import Http404

from django.db.models import Count

from django.core.exceptions import ObjectDoesNotExist

from rest_framework import generics, status
from rest_framework.response import Response

from backend.models import *
from backend.serializers import *


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

class SetDestroy(generics.DestroyAPIView):
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

class SetCreateFromText(generics.GenericAPIView):
    serializer_class = SetCreateFromTextSerializer

    def _tab_parse(self, text, category_seq='#', comment_seq='//'):
        '''
        Parse user inputed question set text into list of python dicts
        representing individual questions (question, answer, category)
        '''
        result = []

        curr_question = None
        curr_answer = ''
        curr_category = ''

        text = text.replace('\r', '')
        text = text.split('\n')

        for line in text:
            if line.startswith(comment_seq):  # The line is a comment
                continue
            elif line == '' or line == '\t':  # The line is empty
                continue
            elif line.startswith('\t'):       # The line is an answer
                line = line[1:]               # Get rid of the tab first
                curr_answer += line
            elif line.startswith(category_seq):  # The line is a category
                # If there is a question, create a question dict
                if curr_question is not None:
                    # Create a new question dict and append it
                    result.append({
                        'question': curr_question,
                        'answer': curr_answer,
                        'category': curr_category
                    })

                # Reset question and answer
                curr_question = None
                curr_answer = ''

                # Set new category
                line = line[len(category_seq):]  # Get rid of the category sequence first
                curr_category = line
            else:                             # The line is a question
                # If there is a question, create a question dict
                if curr_question is not None:
                    # Create a new question dict and append it
                    result.append({
                        'question': curr_question,
                        'answer': curr_answer,
                        'category': curr_category
                    })

                # Set new question and reset answer
                curr_question = line
                curr_answer = ''

        # Append the last question
        result.append({
            'question': curr_question,
            'answer': curr_answer,
            'category': curr_category
        })

        return result

    def post(self, request):
        name = request.POST.get('name')
        text = request.POST.get('text')

        question_dicts = self._tab_parse(text)

        set = Set(name=name)
        set.save()

        for question_dict in question_dicts:
            question = Question(set=set, **question_dict)
            question.save()
        
        return Response({'UUID': set.uuid})

class ResultRetrieve(generics.RetrieveAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

class ResultList(generics.ListAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

class ResultCreate(generics.GenericAPIView):
    serializer_class = ResultSerializer

    def post(self, request):
        answered = request.POST.get('answered')
        successes = request.POST.get('successes')
        uuid = request.POST.get('set')

        set = Set.objects.get(uuid=uuid)
        set.totalAnswered += int(answered)
        set.totalSuccesses += int(successes)
        set.save()

        result = Result(answered=answered, successes=successes, set=set)
        result.save()

        return Response({'totalSuccesses': set.totalSuccesses, 'totalAnswered': set.totalAnswered})

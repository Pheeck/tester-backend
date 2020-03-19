from django.shortcuts import render

from django.http import Http404

from django.db.models import Count

from django.core.exceptions import ObjectDoesNotExist

from rest_framework import generics, status
from rest_framework.response import Response

from backend.models import Question, Answer, Set, Result
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

class AnswerList(generics.ListAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerRetrieve(generics.RetrieveAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerCreate(generics.CreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

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

    def _parse(self, text, category_seq='#', comment_seq='//', separator=';'):
        '''
        Parse user inputed question set text into list of python dicts
        representing individual questions (question, answers, category)
        '''
        result = []

        curr_question = None
        curr_answers = []
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
                curr_answers.append(line)
            elif line.startswith(category_seq):  # The line is a category
                # If there is a question, create a question dict
                if curr_question is not None:
                    # Create a new question dict and append it
                    result.append({
                        'question': curr_question,
                        'answers': curr_answers,
                        'category': curr_category
                    })

                # Reset question and answers
                curr_question = None
                curr_answers = []

                # Set new category
                line = line[len(category_seq):]  # Get rid of the category sequence first
                curr_category = line
            else:                             # The line is a question
                # If there is a question, create a question dict
                if curr_question is not None:
                    # Create a new question dict and append it
                    result.append({
                        'question': curr_question,
                        'answers': curr_answers,
                        'category': curr_category
                    })

                # Set new question and reset answers
                curr_question = line
                curr_answers = []

        # Append the last question
        result.append({
            'question': curr_question,
            'answers': curr_answers,
            'category': curr_category
        })

        return result

    def post(self, request):
        name = request.POST.get('name')
        text = request.POST.get('text')
        choose = request.POST.get('choose')

        choose = True if choose.lower() == "true" else False

        question_dicts = self._parse(text)

        set_model = Set(name=name, choose=choose)
        set_model.save()

        for question_dict in question_dicts:  # Create questions
            question = question_dict['question']
            category = question_dict['category']
            answers = question_dict['answers']

            question_model = Question(set=set_model, question=question, category=category)
            question_model.save()

            if not choose:
                answers = [' '.join(answers)]  # There is only one answer if the set isn't choose-from-multiple

            answer_model = Answer(answer=answers.pop(0), question=question_model, correct=True)  # Create correct answer (it should be the first one)
            answer_model.save()

            for answer in answers:  # Create false answers
                answer_model = Answer(answer=answer, question=question_model, correct=False)
                answer_model.save()
        
        return Response({'UUID': set_model.uuid})

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

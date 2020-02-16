from django.urls import path
from . import views


urlpatterns = [
    path('questions/', views.QuestionListCreate.as_view()),
]

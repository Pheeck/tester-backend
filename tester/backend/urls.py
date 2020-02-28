from django.urls import path
from . import views


urlpatterns = [
    path('question/list/', views.QuestionList.as_view()),
    path('question/retrieve/<int:pk>/', views.QuestionRetrieve.as_view()),
    path('question/create/', views.QuestionCreate.as_view()),
    path('set/list/', views.SetList.as_view()),
    path('set/retrieve/<int:pk>/', views.SetRetrieve.as_view()),
    path('set/create/', views.SetCreate.as_view()),
    path('set/retrieve-by-uuid/<slug:uuid>/', views.SetRetrieveByUUID.as_view()),
]

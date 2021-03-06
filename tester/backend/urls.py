from django.urls import path
from . import views


# Commented out urls are for debug only, not to be used in prod 
urlpatterns = [
#    path('question/list/', views.QuestionList.as_view()),
#    path('question/retrieve/<int:pk>/', views.QuestionRetrieve.as_view()),
#    path('question/create/', views.QuestionCreate.as_view()),
#    path('set/list/', views.SetList.as_view()),
#    path('set/destroy/<int:pk>/', views.SetDestroy.as_view()),
#    path('set/retrieve/<int:pk>/', views.SetRetrieve.as_view()),
    path('set/retrieve-by-uuid/<slug:uuid>/', views.SetRetrieveByUUID.as_view()),
#    path('set/create/', views.SetCreate.as_view()),
    path('set/create-from-text/', views.SetCreateFromText.as_view()),
#    path('result/list/', views.ResultList.as_view()),
#    path('result/retrieve/', views.ResultRetrieve.as_view()),
    path('result/create/', views.ResultCreate.as_view()),
]

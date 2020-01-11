from django.urls import path
from . import views

urlpatterns = [
    path('testobjects/', views.TestObjectListCreate.as_view() ),
]

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('ahoj/', views.index),
    path('<slug:uuid>/', views.index),
]

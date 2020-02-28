from django.shortcuts import render

def index(request, *args, **kvargs):
    return render(request, 'frontend/index.html')
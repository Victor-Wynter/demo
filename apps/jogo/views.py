from django.shortcuts import render

def index(request):
    return render(request, 'xbbpet/index.html')
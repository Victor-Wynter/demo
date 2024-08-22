from django.shortcuts import render, redirect
from django.contrib import messages

def index(request):
    if not request.user.is_authenticated:
        messages.error(request, 'Jogador não logado')
        return redirect('login')

    return render(request, 'login.html')
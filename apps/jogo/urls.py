from django.urls import path
from apps.jogo.views import index

urlpatterns = [
    path('play/', index)
]

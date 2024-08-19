from django.urls import path
from jogo.views import index

urlpatterns = [
    path('', index)
]

from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.spotify_login, name='spotify-login'),
    path('callback/', views.spotify_callback, name='spotify-callback'),
]


from django.urls import path
from . import views

urlpatterns = [
    path('create-playlist/', views.create_playlist, name='create_playlist'),
    path('search-music/', views.search_music, name='search_music'),
    path('add-to-playlist/', views.add_to_playlist, name='add_to_playlist'),
    path('user-info/', views.user_info, name='user_info'),
    path('get-auth-url/', views.get_auth_url, name='get_auth_url'),
    path('callback/', views.callback, name='callback'),
]
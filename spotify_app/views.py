from django.shortcuts import render

# Create your views here.
from django.shortcuts import redirect
from django.http import JsonResponse
from spotipy import Spotify, SpotifyOAuth
from django.conf import settings

def spotify_login(request):
    sp_oauth = SpotifyOAuth(
        client_id=settings.SPOTIFY_CLIENT_ID,
        client_secret=settings.SPOTIFY_CLIENT_SECRET,
        redirect_uri=settings.SPOTIFY_REDIRECT_URI,
        scope="user-library-read"
    )
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

def spotify_callback(request):
    sp_oauth = SpotifyOAuth(
        client_id=settings.SPOTIFY_CLIENT_ID,
        client_secret=settings.SPOTIFY_CLIENT_SECRET,
        redirect_uri=settings.SPOTIFY_REDIRECT_URI,
        scope="user-library-read"
    )
    code = request.GET.get('code')
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info['access_token']

    sp = Spotify(auth=access_token)
    user_info = sp.current_user()
    return JsonResponse(user_info)

from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to My Spotify App!")
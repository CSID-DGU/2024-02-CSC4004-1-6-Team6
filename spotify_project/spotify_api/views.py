from django.http import JsonResponse
from urllib.parse import urlencode
from django.conf import settings
import requests

def create_playlist(request):
    access_token = request.GET.get('access_token')  # 토큰을 요청 파라미터에서 가져온다고 가정
    if not access_token:
        return JsonResponse({'error': 'Access token is required'}, status=400)

    url = "https://api.spotify.com/v1/users/me/playlists"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "name": "New Playlist",
        "description": "Created with Django app",
        "public": False
    }
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 201:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Failed to create playlist'}, status=response.status_code)

def search_music(request):
    return JsonResponse({'message': 'Music searched'})

def add_to_playlist(request):
    return JsonResponse({'message': 'Music added to playlist'})

def user_info(request):
    return JsonResponse({'message': 'User info retrieved'})

def get_auth_url(request):
    auth_url = "https://accounts.spotify.com/authorize"
    params = {
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": "http://127.0.0.1:8000/api/spotify/callback/",  # 리다이렉션 URL
        "scope": "playlist-modify-public playlist-modify-private",
    }
    return JsonResponse({"auth_url": f"{auth_url}?{urlencode(params)}"})

def callback(request):
    code = request.GET.get('code')
    url = "https://accounts.spotify.com/api/token"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:8000/api/spotify/callback/",
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "client_secret": settings.SPOTIFY_CLIENT_SECRET,
    }
    response = requests.post(url, data=data)

    if response.status_code == 200:
        tokens = response.json()
        # 액세스 토큰 반환
        return JsonResponse({"access_token": tokens['access_token']})
    else:
        return JsonResponse({'error': 'Failed to get access token'}, status=response.status_code)
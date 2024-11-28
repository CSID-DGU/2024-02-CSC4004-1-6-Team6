from django.http import JsonResponse
from urllib.parse import urlencode
from django.conf import settings
import requests

def create_playlist(request):
    access_token = request.GET.get('access_token')  # 요청 파라미터에서 Access Token 가져옴
    if not access_token:
        return JsonResponse({'error': 'Access token is required'}, status=400)

    url = "https://api.spotify.com/v1/me/playlists"  # Spotify API Endpoint
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "name": "New Playlist",
        "description": "Created with Django app",
        "public": False
    }

    # Spotify API로 요청 보내기
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 201:  # 성공적으로 생성된 경우
        return JsonResponse(response.json())
    elif response.status_code == 401:  # Access Token 문제
        return JsonResponse({'error': 'Invalid or expired access token'}, status=401)
    else:  # 기타 오류
        return JsonResponse({'error': 'Failed to create playlist', 'detail': response.json()}, status=response.status_code)


def search_music(request):
    query = request.GET.get('query', '')  # 검색어 가져오기
    access_token = request.GET.get('access_token')  # Access Token 가져오기

    # 필수 값 확인
    if not query:
        return JsonResponse({'error': 'Search query is required'}, status=400)
    if not access_token:
        return JsonResponse({'error': 'Access token is required'}, status=400)

    # Spotify API URL 및 헤더 설정
    url = "https://api.spotify.com/v1/search"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "q": query,
        "type": "track",  # 트랙 검색
        "limit": 10  # 최대 10개의 결과만 반환
    }

    # Spotify API로 요청 보내기
    response = requests.get(url, headers=headers, params=params)

    # 응답 처리
    if response.status_code == 200:
        results = response.json()
        tracks = results.get('tracks', {}).get('items', [])

        # 필요한 데이터만 추출해 정리
        formatted_results = [
            {
                "id": track['id'],
                "name": track['name'],
                "artist": ", ".join(artist['name'] for artist in track['artists']),
                "album": track['album']['name'],
                "uri": track['uri']
            }
            for track in tracks
        ]
        return JsonResponse({'results': formatted_results})
    elif response.status_code == 401:  # 인증 문제
        return JsonResponse({'error': 'Invalid or expired access token'}, status=401)
    else:  # 기타 문제
        return JsonResponse({'error': 'Failed to search music', 'detail': response.json()}, status=response.status_code)

def add_to_playlist(request):
    access_token = request.GET.get('access_token')  # 요청에서 Access Token 가져오기
    playlist_id = request.GET.get('playlist_id')  # 플레이리스트 ID 가져오기
    uris = request.GET.getlist('uris')  # 추가할 트랙의 URI 리스트 가져오기

    # 필수 값 확인
    if not access_token:
        return JsonResponse({'error': 'Access token is required'}, status=400)
    if not playlist_id:
        return JsonResponse({'error': 'Playlist ID is required'}, status=400)
    if not uris:
        return JsonResponse({'error': 'At least one track URI is required'}, status=400)

    # Spotify API URL 및 헤더 설정
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "uris": uris  # 트랙 URI 리스트를 API로 전달
    }

    # Spotify API로 요청 보내기
    response = requests.post(url, headers=headers, json=data)

    # 응답 처리
    if response.status_code == 201:  # 성공적으로 추가된 경우
        return JsonResponse({'message': 'Tracks added to playlist successfully!'})
    elif response.status_code == 401:  # 인증 문제
        return JsonResponse({'error': 'Invalid or expired access token'}, status=401)
    else:  # 기타 문제
        return JsonResponse({'error': 'Failed to add tracks to playlist', 'detail': response.json()}, status=response.status_code)

def user_info(request):
    access_token = request.GET.get('access_token')  # 요청에서 Access Token 가져오기

    # 필수 값 확인
    if not access_token:
        return JsonResponse({'error': 'Access token is required'}, status=400)

    # Spotify API URL 및 헤더 설정
    url = "https://api.spotify.com/v1/me"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Spotify API로 요청 보내기
    response = requests.get(url, headers=headers)

    # 응답 처리
    if response.status_code == 200:
        user_data = response.json()

        # 필요한 정보만 정리
        formatted_data = {
            "id": user_data.get("id"),
            "name": user_data.get("display_name"),
            "email": user_data.get("email"),
            "profile_url": user_data.get("external_urls", {}).get("spotify"),
            "profile_image": user_data.get("images", [{}])[0].get("url") if user_data.get("images") else None
        }
        return JsonResponse(formatted_data)
    elif response.status_code == 401:  # 인증 문제
        return JsonResponse({'error': 'Invalid or expired access token'}, status=401)
    else:  # 기타 문제
        return JsonResponse({'error': 'Failed to fetch user info', 'detail': response.json()}, status=response.status_code)

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
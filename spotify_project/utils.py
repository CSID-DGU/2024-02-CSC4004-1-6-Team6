import requests
import os

def get_spotify_token():
    """
    Spotify API 토큰을 요청합니다.
    """
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": os.getenv("SPOTIFY_CLIENT_ID"),
        "client_secret": os.getenv("SPOTIFY_CLIENT_SECRET"),
    }
    response = requests.post(url, headers=headers, data=data)
    response_data = response.json()
    return response_data.get("access_token")

def search_music_by_emotion(emotion):
    """
    감정 키워드를 기반으로 Spotify에서 음악을 검색합니다.
    """
    token = get_spotify_token()
    url = f"https://api.spotify.com/v1/search?q={emotion}&type=track&limit=5"
    headers = {
        "Authorization": f"Bearer {token}",
    }
    response = requests.get(url, headers=headers)
    return response.json()

emotion_to_keyword = {
    "happiness": "happy",
    "sadness": "sad",
    "anger": "angry",
    "fear": "calm",
    "surprise": "surprising",
    "disgust": "relaxing",
}

def get_emotion_keyword(emotions):
    """
    감정 점수를 기반으로 주요 감정 키워드 반환.
    """
    max_emotion = max(emotions, key=emotions.get)  # 가장 높은 감정 찾기
    return emotion_to_keyword.get(max_emotion, "mood")

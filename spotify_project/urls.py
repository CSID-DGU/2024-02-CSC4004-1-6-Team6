from django.urls import path
from .views import RecommendMusicByEmotionView

urlpatterns = [
    path("recommend-by-emotion/", RecommendMusicByEmotionView.as_view(), name="recommend-music-by-emotion"),
]

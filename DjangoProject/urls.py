from django.contrib import admin
from django.urls import path, include  # include 함수 임포트

urlpatterns = [
    path("admin/", admin.site.urls),
    path("emotion/", include("emotion_analysis.urls")),  # emotion_analysis 앱 URL 연결
    path("data/", include("data_processing.urls")),
    path("spotify/", include("spotify_project.urls")),# data_processing 앱 URL 연결
]



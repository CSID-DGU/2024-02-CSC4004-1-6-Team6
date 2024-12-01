from django.urls import path
from .views import DiaryCreateView, SaveDiaryEmotionView

urlpatterns = [
    path('diary/', DiaryCreateView.as_view(), name='create-diary'),  # 일기 생성
    path('diary/emotion/', SaveDiaryEmotionView.as_view(), name='save-diary-emotion'),  # 감정 데이터 저장
]

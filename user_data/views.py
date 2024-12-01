from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Diary
from rest_framework.permissions import IsAuthenticated
from diary.emotion_model_management import save_diary_emotion

class DiaryCreateView(APIView):
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

    def post(self, request):
        """새로운 일기 저장"""
        user = request.user  # 현재 로그인한 사용자
        title = request.data.get('title')  # 프론트에서 전송한 제목
        content = request.data.get('content')  # 프론트에서 전송한 내용

        # 제목과 내용이 비어있으면 에러 반환
        if not title or not content:
            return Response({'error': '제목과 내용이 있어야 합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        # 일기 저장
        diary = Diary.objects.create(user=user, title=title, content=content)

        # 성공 응답 반환
        return Response(
            {
                'message': '일기 생성 완료',
                'id': diary.id,
                'created_at': diary.created_at,
            },
            status=status.HTTP_201_CREATED
        )


class SaveDiaryEmotionView(APIView):
    """
    일기의 감정 데이터를 저장하는 API
    """
    def post(self, request):
        diary_id = request.data.get("diary_id")  # 일기 ID
        emotion_data = request.data.get("emotion_data")  # 감정 데이터

        # 필수 값 검증
        if not diary_id or not emotion_data:
            return Response({"error": "Diary ID and emotion data are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            diary = Diary.objects.get(id=diary_id)  # 일기 가져오기
        except Diary.DoesNotExist:
            return Response({"error": "Diary not found"}, status=status.HTTP_404_NOT_FOUND)

        # 감정 데이터 저장
        emotion, weekly_emotion = save_diary_emotion(diary, emotion_data)

        return Response(
            {
                "message": "Emotion data saved successfully",
                "diary_id": diary_id,
                "emotion": {
                    "happiness": emotion.happiness,
                    "sadness": emotion.sadness,
                    "anger": emotion.anger,
                    "fear": emotion.fear,
                    "surprise": emotion.surprise,
                    "disgust": emotion.disgust,
                },
                "weekly_emotion": {
                    "happiness": weekly_emotion.happiness,
                    "sadness": weekly_emotion.sadness,
                    "anger": weekly_emotion.anger,
                    "fear": weekly_emotion.fear,
                    "surprise": weekly_emotion.surprise,
                    "disgust": weekly_emotion.disgust,
                }
            },
            status=status.HTTP_200_OK,
        )

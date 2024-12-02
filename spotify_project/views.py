from rest_framework.views import APIView
from rest_framework.response import Response
from user_data.models import DiaryEmotion
from .utils import search_music_by_emotion, get_emotion_keyword

class RecommendMusicByEmotionView(APIView):
    """
    감정 분석 결과를 기반으로 음악 추천 API
    """
    def post(self, request):
        diary_id = request.data.get("diary_id")  # 일기 ID 받기
        if not diary_id:
            return Response({"error": "Diary ID is required"}, status=400)

        try:
            # 감정 데이터 가져오기
            diary_emotion = DiaryEmotion.objects.get(diary_id=diary_id)
        except DiaryEmotion.DoesNotExist:
            return Response({"error": "Emotion data not found for the diary"}, status=404)

        # 감정 데이터에서 키워드 추출
        emotions = {
            "happiness": diary_emotion.happiness,
            "sadness": diary_emotion.sadness,
            "anger": diary_emotion.anger,
            "fear": diary_emotion.fear,
            "surprise": diary_emotion.surprise,
            "disgust": diary_emotion.disgust,
        }
        keyword = get_emotion_keyword(emotions)

        # Spotify API 호출
        music_results = search_music_by_emotion(keyword)

        return Response({
            "emotion": keyword,
            "music_recommendations": music_results,
        }, status=200)

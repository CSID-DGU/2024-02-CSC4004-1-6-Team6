from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user_data.models import Diary, DiaryEmotion, WeeklyEmotion, MonthlyEmotion, AlertLog
from .utils import analyze_emotions, send_sms_alert, log_alert, calculate_weekly_emotion, calculate_monthly_emotion

class AnalyzeEmotionView(APIView):
    """
    일기 텍스트에 대한 감정 분석을 수행하는 API
    """
    def post(self, request):
        diary_id = request.data.get("diary_id")
        try:
            diary = Diary.objects.get(id=diary_id)
        except Diary.DoesNotExist:
            return Response({"error": "Diary not found"}, status=status.HTTP_404_NOT_FOUND)

        # 감정 분석 수행
        emotion_scores = analyze_emotions(diary.content)

        # 결과 저장
        emotion = DiaryEmotion.objects.create(
            diary=diary,
            happiness=emotion_scores["happiness"],
            sadness=emotion_scores["sadness"],
            anger=emotion_scores["anger"],
            fear=emotion_scores["fear"],
            surprise=emotion_scores["surprise"],
            disgust=emotion_scores["disgust"],
        )

        # 감정 점수 기준으로 알림 전송
        if emotion_scores["sadness"] > 0.8:  # 예시: 슬픔 점수가 0.8 이상일 경우
            phone_number = diary.user.phone_number
            message = "주의: 최근 일기에서 슬픔 점수가 매우 높습니다. 필요한 도움을 받으세요."
            send_sms_alert(phone_number, message)
            log_alert(diary.user, "슬픔 알림", message)

        # 응답 반환
        return Response({
            "message": "Emotion analysis completed",
            "diary_id": diary.id,
            "emotions": emotion_scores,
        }, status=status.HTTP_200_OK)


class WeeklyEmotionView(APIView):
    """
    주간 감정 데이터를 계산하고, 임계값을 초과한 감정 점수에 대해 알림을 보냄
    """
    def post(self, request):
        user = request.user
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        # 주간 감정 데이터 계산
        weekly_data = calculate_weekly_emotion(user, start_date, end_date)

        # 감정 점수 기준으로 알림 전송
        if weekly_data["sadness"] > 0.8:  # 예시: 슬픔 점수가 0.8 이상일 경우
            phone_number = user.phone_number
            message = "주의: 최근 주간 감정 분석에서 슬픔 점수가 매우 높습니다. 필요한 도움을 받으세요."
            send_sms_alert(phone_number, message)
            log_alert(user, "슬픔 알림", message)

        # 감정 데이터 저장
        WeeklyEmotion.objects.create(
            user=user,
            week_start=start_date,
            week_end=end_date,
            **weekly_data
        )

        return Response({"message": "Weekly emotion data saved and alert sent if needed.", "data": weekly_data}, status=200)


class MonthlyEmotionView(APIView):
    """
    월간 감정 데이터를 계산하여 저장하는 API
    """
    def post(self, request):
        user = request.user
        year = request.data.get("year")
        month = request.data.get("month")

        # 월간 감정 데이터 계산
        monthly_data = calculate_monthly_emotion(user, year, month)

        # 저장
        MonthlyEmotion.objects.create(
            user=user,
            year=year,
            month=month,
            **monthly_data
        )

        # 감정 점수 기준으로 알림 전송 (예시: 슬픔 점수가 0.8 이상일 경우)
        if monthly_data["sadness"] > 0.9:
            phone_number = user.phone_number
            message = "주의: 최근 월간 감정 분석에서 슬픔 점수가 매우 높습니다. 필요한 도움을 받으세요."
            send_sms_alert(phone_number, message)
            log_alert(user, "슬픔 알림", message)

        return Response({"message": "Monthly emotion data saved", "data": monthly_data}, status=200)


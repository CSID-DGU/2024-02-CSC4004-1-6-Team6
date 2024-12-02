from user_data.models import DiaryEmotion  # 추가
from datetime import timedelta

# 기존 함수들 그대로 유지


def analyze_emotions(text):
    """
    텍스트 데이터를 기반으로 감정 점수를 반환합니다.
    """
    emotions = {
        "happiness": ["행복", "기쁨", "좋아"],
        "sadness": ["슬픔", "우울", "눈물"],
        "anger": ["화남", "분노", "짜증"],
        "fear": ["무서움", "두려움", "겁남"],
        "surprise": ["놀람", "깜짝", "감동"],
        "disgust": ["싫음", "혐오", "역겨움"],
    }
    scores = {key: 0 for key in emotions}

    for emotion, keywords in emotions.items():
        for keyword in keywords:
            scores[emotion] += text.count(keyword)

    # 감정 점수를 정규화(0~1 범위로 조정)
    max_score = max(scores.values(), default=1)
    normalized_scores = {k: v / max_score for k, v in scores.items()}
    return normalized_scores


from datetime import timedelta


def calculate_weekly_emotion(user, start_date, end_date):
    """
    주간 감정 데이터를 계산하여 반환합니다.
    """
    diary_emotions = DiaryEmotion.objects.filter(
        diary__user=user,
        diary__created_at__date__gte=start_date,
        diary__created_at__date__lte=end_date
    )

    # 초기화
    weekly_data = {"happiness": 0, "sadness": 0, "anger": 0, "fear": 0, "surprise": 0, "disgust": 0}
    count = diary_emotions.count()

    if count == 0:
        return weekly_data  # 데이터가 없으면 기본값 반환

    # 총합 계산
    for emotion in diary_emotions:
        weekly_data["happiness"] += emotion.happiness
        weekly_data["sadness"] += emotion.sadness
        weekly_data["anger"] += emotion.anger
        weekly_data["fear"] += emotion.fear
        weekly_data["surprise"] += emotion.surprise
        weekly_data["disgust"] += emotion.disgust

    # 평균 계산
    for key in weekly_data:
        weekly_data[key] /= count

    return weekly_data

def calculate_monthly_emotion(user, year, month):
    """
    월간 감정 데이터를 계산하여 반환합니다.
    """
    diary_emotions = DiaryEmotion.objects.filter(
        diary__user=user,
        diary__created_at__year=year,
        diary__created_at__month=month
    )

    # 초기화
    monthly_data = {"happiness": 0, "sadness": 0, "anger": 0, "fear": 0, "surprise": 0, "disgust": 0}
    count = diary_emotions.count()

    if count == 0:
        return monthly_data  # 데이터가 없으면 기본값 반환

    # 총합 계산
    for emotion in diary_emotions:
        monthly_data["happiness"] += emotion.happiness
        monthly_data["sadness"] += emotion.sadness
        monthly_data["anger"] += emotion.anger
        monthly_data["fear"] += emotion.fear
        monthly_data["surprise"] += emotion.surprise
        monthly_data["disgust"] += emotion.disgust

    # 평균 계산
    for key in monthly_data:
        monthly_data[key] /= count

    return monthly_data


from twilio.rest import Client
import os


def send_sms_alert(phone_number, message):
    """
    특정 전화번호로 알림 메시지를 전송합니다.
    """
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_phone_number = os.getenv("TWILIO_PHONE_NUMBER")

    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body=message,
        from_=from_phone_number,
        to=phone_number
    )

    return message.sid

from user_data.models import AlertLog

def log_alert(user, alert_type, message):
    """
    알림 기록을 데이터베이스에 저장합니다.
    """
    AlertLog.objects.create(
        user=user,
        alert_type=alert_type,
        message=message
    )

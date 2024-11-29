from datetime import timedelta
from django.db.models import Avg
from django.utils.timezone import now
from backend_API.twilio_api.models import *
from backend_API.twilio_api.utils.send_sms import emotion_alarm_for_user

# 1) 일기를 저장
# 2) 일기의 감정을 저장
# 3) 주간 감정상태 계산
# 4) 월간 감정상태 계산

# 일기저장 - 프론트의 저장버튼에 트리거되는 일기 저장 함수
def save_diary(user, title, content) :
    diary = Diary.objects.create(user=user, title=title, content=content)
    return diary

# 일기 감정 데이터 저장 - gpt api에서 감정데이터 뽑혔을때 트리거, 일기 저장 후 주간 감정 모델 업데이트
def save_diary_emotion(diary, emotion_data):
    # 일기 감정 데이터 업데이트 또는 생성
    emotion, created = DiaryEmotion.objects.update_or_create(
        diary=diary,
        defaults={
            'happiness': emotion_data.get('happiness', 0),
            'sadness': emotion_data.get('sadness', 0),
            'anger': emotion_data.get('anger', 0),
            'fear': emotion_data.get('fear', 0),
            'surprise': emotion_data.get('surprise', 0),
            'disgust': emotion_data.get('disgust', 0),
        }
    )

    if created:
        print(f"일기 '{diary.title}'에 대한 감정 데이터가 새로 생성되었습니다.")
    else:
        print(f"일기 '{diary.title}'의 감정 데이터가 업데이트되었습니다.")

    # 주간 감정 상태 업데이트
    weekly_emotion = update_weekly_emotion(diary.user)

    return emotion, weekly_emotion


# 주간 감정 데이터 계산/저장, 일기 감정 데이터 저장시 트리거, 계산 후 슬픔 감정수치가 기준 이상일 시 사용자에게 경고 문자
def update_weekly_emotion(user):

    today = now().date()
    start_date = today - timedelta(days=7)  # 최근 7일 시작일

    # 최근 7일 동안의 일기 감정 데이터 가져오기
    diary_emotions = DiaryEmotion.objects.filter(
        diary__user=user,
        diary__created_at__date__range=(start_date, today)
    )

    # 평균 계산
    weekly_happiness = diary_emotions.aggregate(Avg('happiness'))['happiness__avg']
    weekly_sadness = diary_emotions.aggregate(Avg('sadness'))['sadness__avg']
    weekly_anger = diary_emotions.aggregate(Avg('anger'))['anger__avg']
    weekly_fear = diary_emotions.aggregate(Avg('fear'))['fear__avg']
    weekly_surprise = diary_emotions.aggregate(Avg('surprise'))['surprise__avg']
    weekly_disgust = diary_emotions.aggregate(Avg('disgust'))['disgust__avg']

    # 저장 또는 업데이트
    weekly_emotion, created = WeeklyEmotion.objects.update_or_create(
        user=user,
        week_start=start_date,
        week_end=today,
        defaults={
            'happiness': weekly_happiness,
            'sadness': weekly_sadness,
            'anger': weekly_anger,
            'fear': weekly_fear,
            'surprise': weekly_surprise,
            'disgust': weekly_disgust,
        }
    )

    # 최소 데이터 개수 기준: 3개 이상의 데이터가 있어야 계산, 일주일동안 일기 안쓰다가 하루 썼는데
    # 감정 기준치 넘겨서 문자 발송되는 상황을 막고 싶었습니다. 이 부분은 좋은 의견이 필요할 거 같습니다...
    if diary_emotions.count() >= 3:
        emotion_alarm_for_user(user)

    if created:
        print(f"{user.username}님의 주간 감정 상태가 새로 생성되었습니다.")
    else:
        print(f"{user.username}님의 주간 감정 상태가 업데이트되었습니다.")

    # 월간 감정 데이터 저장
    update_monthly_emotion(user)

    return weekly_emotion


def update_monthly_emotion(user):

    today = now().date()
    start_date = today - timedelta(days=30)  # 최근 30일 시작일

    # 최근 30일 동안의 일기 감정 데이터 가져오기
    diary_emotions = DiaryEmotion.objects.filter(
        diary__user=user,
        diary__created_at__date__range=(start_date, today)
    )

    # 데이터가 없으면 월간 감정 상태를 생성하지 않음
    if not diary_emotions.exists():
        print(f"{user.username}님의 최근 30일 일기 데이터가 부족하여 월간 감정 상태를 생성하지 않습니다.")
        return None

    # 평균 계산
    monthly_happiness = diary_emotions.aggregate(Avg('happiness'))['happiness__avg']
    monthly_sadness = diary_emotions.aggregate(Avg('sadness'))['sadness__avg']
    monthly_anger = diary_emotions.aggregate(Avg('anger'))['anger__avg']
    monthly_fear = diary_emotions.aggregate(Avg('fear'))['fear__avg']
    monthly_surprise = diary_emotions.aggregate(Avg('surprise'))['surprise__avg']
    monthly_disgust = diary_emotions.aggregate(Avg('disgust'))['disgust__avg']

    # 저장 또는 업데이트
    monthly_emotion, created = MonthlyEmotion.objects.update_or_create(
        user=user,
        year=today.year,
        month=today.month,
        defaults={
            'happiness': monthly_happiness or 0,
            'sadness': monthly_sadness or 0,
            'anger': monthly_anger or 0,
            'fear': monthly_fear or 0,
            'surprise': monthly_surprise or 0,
            'disgust': monthly_disgust or 0,
        }
    )

    if created:
        print(f"{user.username}님의 월간 감정 상태가 새로 생성되었습니다.")
    else:
        print(f"{user.username}님의 월간 감정 상태가 업데이트되었습니다.")

    return monthly_emotion
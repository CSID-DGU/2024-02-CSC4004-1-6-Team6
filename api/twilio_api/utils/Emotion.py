import math
from datetime import timedelta, datetime
from api.twilio_api.models import SentenceEmotion, DiaryEmotion, WeeklyEmotion, MonthlyEmotion
# models.py에 작성된 class 들은 동기화 하지 않은 상태라 현재 참조할 수 없는 상태 입니다. 어떻게 될지 몰라 작성만 해 두었습니다.

# 현재 작성된 감정 처리 관련 함수들
# 1) 대표 감정 포인트 설정
# 2) 일기를 받아 일기의 감정 평균 치를 계산 하는 함수
# 3) 감정 수치를 받아 평균 감정과 가장 가까운 감정 포인트 3개를 반환 하는 함수
# 4) 일기를 받아 감정 평균과 가장 가까운 기준 감정 3개를 저장 하는 함수
# 5) 유저 일주일 치 감정 계산
# 6) 유저 한 달 치 감정 계산


# 기준 감정, 추후 세세하게 감정을 추가 해도 될 거 같 습니다. 이 방식이 채택 된다면 감정 이모티콘이 많이 필요 하겠지 만
emotion_point = [
    (0, 3, "흥분"),
    (3, 3, "신남"),
    (3, 0, "행복"),
    (3, -3, "만족/침착함"),
    (0, -3, "피곤"),
    (-3,-3, "실망/지루함"),
    (-3, 0, "비참/슬픔"),
    (-3, 3, "좌절/짜증/분노")
]

# 일기를 받아 일기의 감정 평균 치를 계산 하는 함수
def calculate_average_emotions(diary):
    emotions = SentenceEmotion.objects.filter(diary=diary)

    total_arousal = sum(e.arousal for e in emotions)
    total_valence = sum(e.valence for e in emotions)

    count = emotions.count()

    if count == 0:
        return 0, 0

    average_arousal = total_arousal / count
    average_valence = total_valence / count

    return average_arousal, average_valence

# 감정 수치를 받아 평균 감정과 가장 가까운 감정 포인트 3개를 반환 하는 함수
def find_emotion(arousal, valence, emotion_point=emotion_point):
    distances = []
    for x, y, emotion in emotion_point:
        distance = math.sqrt((arousal - x) ** 2 + (valence - y) ** 2)
        distances.append((distance, emotion))
    distances.sort()
    # 가장 가까운 3개 반환
    return [emotion for _, emotion in distances[:3]]

# 일기를 받아 감정 평균과 가장 가까운 기준 감정 3개를 저장 하는 함수
def process_diary_emotion(diary):
    average_arousal, average_valence = calculate_average_emotions(diary)
    closest_emotions = find_emotion(average_arousal, average_valence, emotion_point)

    diary_emotion, created = DiaryEmotion.objects.get_or_create(diary=diary)
    diary_emotion.average_arousal = average_arousal
    diary_emotion.average_valence = average_valence
    diary_emotion.first_closest_emotion = closest_emotions[0]
    diary_emotion.second_closest_emotion = closest_emotions[1]
    diary_emotion.third_closest_emotion = closest_emotions[2]
    diary_emotion.save()

# 유저의 일주일 일기를 통한 주간 감정 계산
def calculate_weekly_emotions(user):
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)

    diary_emotions = DiaryEmotion.objects.filter(
        diary__user=user,
        diary__created__date__gte=week_start,
        diary__created__date__lte=week_end
    )

    if not diary_emotions.exists():
        return

    total_arousal = sum(e.average_arousal for e in diary_emotions)
    total_valence = sum(e.average_valence for e in diary_emotions)
    count = diary_emotions.count()

    average_arousal = total_arousal / count
    average_valence = total_valence / count

    risk_level = average_valence if average_valence <= -2 else 0

    WeeklyEmotion.objects.update_or_create(
        user=user,
        week_start=week_start,
        week_end=week_end,
        defaults={
            "average_arousal": average_arousal,
            "average_valence": average_valence,
            "risk_level": risk_level
        }
    )

# 유저의 한달치 감정 데이터를 통해 월간 감정 계산
def calculate_monthly_emotions(user, year, month):
    diary_emotions = DiaryEmotion.objects.filter(
        diary__user=user,
        diary__created__date__year=year,
        diary__created__date__month=month
    )
    if not diary_emotions.exists():
        return
    total_arousal = sum(e.average_arousal for e in diary_emotions)
    total_valence = sum(e.average_valence for e in diary_emotions)
    count = diary_emotions.count()

    average_arousal = total_arousal / count
    average_valence = total_valence / count

    risk_level = average_valence if average_valence <= -2 else 0

    MonthlyEmotion.objects.update_or_create(
        user=user,
        year=year,
        month=month,
        defaluts={
            "average_arousal": average_arousal,
            "average_valence": average_valence,
            "risk_level": risk_level
        }
    )
from django.db import models
from django.contrib.auth.models import User

# 일기 모델
class Diary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

# 문장 별 감정 모델
class SentenceEmotion(models.Model):
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE)
    sentence = models.TextField() # 문장 내용
    arousal = models.IntegerField() # 문장의 각성 수치 (-3~3)
    valence = models.IntegerField() # 문장의 긍정 수치 (-3~3)

# 일기 별 감정 모델
class DiaryEmotion(models.Model):
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE)
    average_arousal = models.FloatField() # 일기의 평균 각성 수치 (-3~3)
    average_valence = models.FloatField() # 일기의 평균 긍정 수치 (-3~3)
    first_closest_emotion = models.CharField(max_length=20)
    second_closest_emotion = models.CharField(max_length=20)
    third_closest_emotion = models.CharField(max_length=20)

# 유저 주간 감정 모델
class WeeklyEmotion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    week_start = models.DateField()
    week_end = models.DateField()
    average_arousal = models.FloatField()
    average_valence = models.FloatField()
    risk_level = models.FloatField() # 감정 분류중 부정 감정 위주로 수치 값을 저장
    created_at = models.DateTimeField(auto_now_add=True)

# 유저 월간 감정 모델
class MonthlyEmotion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    average_arousal = models.FloatField()
    average_valence = models.FloatField()
    risk_level = models.FloatField() # 감정 분류중 부정 감정 위주로 수치 값을 저장
    created_at = models.DateTimeField(auto_now_add=True)
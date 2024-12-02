from django.db import models
from django.contrib.auth.models import AbstractUser

# 사용자 모델
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)

# 일기 모델
class Diary(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# 감정 모델
class DiaryEmotion(models.Model):
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE)
    happiness = models.FloatField(default=0)
    sadness = models.FloatField(default=0)
    anger = models.FloatField(default=0)
    fear = models.FloatField(default=0)
    surprise = models.FloatField(default=0)
    disgust = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

# 주간 감정 모델
class WeeklyEmotion(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    week_start = models.DateField()
    week_end = models.DateField()
    happiness = models.FloatField(default=0)
    sadness = models.FloatField(default=0)
    anger = models.FloatField(default=0)
    fear = models.FloatField(default=0)
    surprise = models.FloatField(default=0)
    disgust = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

# 월간 감정 모델
class MonthlyEmotion(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    year = models.IntegerField()
    month = models.IntegerField()
    happiness = models.FloatField(default=0)
    sadness = models.FloatField(default=0)
    anger = models.FloatField(default=0)
    fear = models.FloatField(default=0)
    surprise = models.FloatField(default=0)
    disgust = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

# 알림 기록 모델
class AlertLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=100)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

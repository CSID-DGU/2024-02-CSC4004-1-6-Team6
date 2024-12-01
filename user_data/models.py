from django.db import models
from django.contrib.auth.models import AbstractUser

# 현재 작성된 모델 목록
# 1) 일기 모델
# 3) 일기 별 감정 모델
# 4) 유저 주간 감정 모델
# 5) 유저 월간 감정 모델

# 유저 모델, 일단 전화 번호를 가지고 있게 만듬
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # 전화번호
    def __str__(self):
        return self.username

# 일기 모델, 유저에 귀속, 제목,
class Diary(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=100) # 일기 제목
    content = models.TextField() # 일기 내용
    created_at = models.DateTimeField(auto_now_add=True)

# 일기 별 감정 모델, 일기에 귀속, 현재 6감정 모델 사용, 추후 변경 가능
class DiaryEmotion(models.Model):
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE)
    happiness = models.FloatField(default=0)  # 기쁨
    sadness = models.FloatField(default=0)  # 슬픔
    anger = models.FloatField(default=0)  # 분노
    fear = models.FloatField(default=0)  # 두려움
    surprise = models.FloatField(default=0)  # 놀라움
    disgust = models.FloatField(default=0)  # 혐오
    created_at = models.DateTimeField(auto_now_add=True)

# 유저 주간 감정 모델, 일기별 감정 모델을 이용해 감정 평균치를 내는 방식
class WeeklyEmotion(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    week_start = models.DateField()
    week_end = models.DateField()
    happiness = models.FloatField(default=0)  # 기쁨
    sadness = models.FloatField(default=0)  # 슬픔
    anger = models.FloatField(default=0)  # 분노
    fear = models.FloatField(default=0)  # 두려움
    surprise = models.FloatField(default=0)  # 놀라움
    disgust = models.FloatField(default=0)  # 혐오
    created_at = models.DateTimeField(auto_now_add=True)

# 유저 월간 감정 모델, 주간 감정 모델을 이용해 감정 평균치를 내는 방식
class MonthlyEmotion(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    happiness = models.FloatField(default=0)  # 기쁨
    sadness = models.FloatField(default=0)  # 슬픔
    anger = models.FloatField(default=0)  # 분노
    fear = models.FloatField(default=0)  # 두려움
    surprise = models.FloatField(default=0)  # 놀라움
    disgust = models.FloatField(default=0)  # 혐오
    created_at = models.DateTimeField(auto_now_add=True)
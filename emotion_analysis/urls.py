from django.urls import path
from .views import AnalyzeEmotionView, WeeklyEmotionView, MonthlyEmotionView

urlpatterns = [
    path("analyze/", AnalyzeEmotionView.as_view(), name="analyze-emotion"),
    path("weekly/", WeeklyEmotionView.as_view(), name="weekly-emotion"),
    path("monthly/", MonthlyEmotionView.as_view(), name="monthly-emotion"),
]

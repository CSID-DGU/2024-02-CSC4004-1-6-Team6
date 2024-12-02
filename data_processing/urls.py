# data_processing/urls.py
from django.urls import path
from .views import ProcessDiaryView  # views에서 ProcessDataView 가져오기

urlpatterns = [
    path('process-data/', ProcessDiaryView.as_view(), name='process-data'),
]

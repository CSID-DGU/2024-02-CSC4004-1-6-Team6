# logincheck/urls.py
from django.urls import path
from .views import SignUpView, LoginView
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/', admin.site.urls),
    path('logincheck/', include('logincheck.urls')),
]



# logincheck/views.py
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password

class SignUpView(APIView):
    """
    새로운 사용자 등록 (회원가입) API
    """
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        if not username or not password or not email:
            return Response({"error": "모든 필드를 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        # 비밀번호 해시화
        hashed_password = make_password(password)

        # 사용자 생성
        user = User.objects.create(
            username=username,
            password=hashed_password,
            email=email
        )

        return Response({"message": "회원가입 완료"}, status=status.HTTP_201_CREATED)

# logincheck/views.py
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LoginView(APIView):
    """
    사용자 로그인 API
    """
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "아이디와 비밀번호를 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        # 사용자 인증
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # 세션에 사용자 로그인
            return Response({"message": "로그인 성공", "username": user.username}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "아이디 또는 비밀번호가 잘못되었습니다."}, status=status.HTTP_401_UNAUTHORIZED)

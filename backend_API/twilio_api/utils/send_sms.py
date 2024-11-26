import os
import django
from twilio.rest import Client # twilio 라이브러리
from dotenv import load_dotenv
from backend_API.twilio_api.models import WeeklyEmotion

# 감정 상태가 위험 상태일 때 사용자에게 기관 연락처를 알려주고 연락을 권유함
# 일단 유저 에게 메시지 를 보내는 쪽으로 작성 했 습니다.
# 계정 코드가 커밋에 문제가 되어 env 파일로 빼 놨 습니다. env 파일은 github 로 옮기기 힘들 것 같 습니다.

# 구현 된 내용들
# 1) 문자를 전송하는 함수
# 2) 주간 감정데이터를 기반으로 사용자에게 경고 문자를 발송하는 함수

# 환경 변수 로드
load_dotenv()

# Django 프로젝트 설정 파일 지정
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DjangoProject.settings")
django.setup()

# twilio 클라이언트 초기화
def init_twilio_client():
    account_sid = os.getenv("account_sid")
    auth_token = os.getenv("auth_token")

    if not account_sid or not auth_token:
        raise ValueError("Twilio 계정 정보(account_sid 또는 auth_token)가 누락되었습니다.")

    return Client(account_sid, auth_token)


# 임시 설정값
user_phone_number = "+821024137915"  # 유저 전화번호를 저장할 값, 지금은 테스트 계정이라 이 번호에만 문자가 갑니다.

# 문자 전송 함수, (receiver 사용자 번호)에게 (text 메시지 내용)을 보내는 함수
def send_message(receiver, text):
    client = init_twilio_client()
    message = client.messages.create(
        body=text, # 메시지 내용
        from_="+12672143141",  # Twilio 제공 번호, 송신자 번호
        to=receiver  # 수신자 번호, 체험판에서는 인증된 번호에만 보낼 수 있음
    )
    return message.sid


# 사용자에게 경고 문자 발송
def Emotion_alarm_for_user(user, user_phone_number,threshold=-2):
    recent_week = WeeklyEmotion.objects.filter(user=user).order_by("-week_start").first()

    if recent_week.risk_level <= threshold:
        # 메시지 내용
        message_body = (
            "아래의 기관에 연락하는 것을 권장드립니다.\n"
            "기관 연락처 : xxx-xxxx-xxxx\n"
            f"주간 감정 상태 : {recent_week.risk_level}점"
        )
        send_message(user_phone_number, message_body)
        print("사용자에게 주간 데이터를 기반으로 메시지를 전송했습니다.")
    else:
        print("현재 사용자의 감정 상태는 위험 수준이 아닙니다.")


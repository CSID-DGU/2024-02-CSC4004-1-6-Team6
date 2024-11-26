import os
import django
import random
from twilio.rest import Client # twilio 라이브러리
from dotenv import load_dotenv
from backend_API.twilio_api.models import WeeklyEmotion
from django.core.cache import cache

# 감정 상태가 위험 상태일 때 사용자에게 기관 연락처를 알려주고 연락을 권유함
# 일단 유저 에게 메시지 를 보내는 쪽으로 작성 했 습니다.
# 계정 코드가 커밋에 문제가 되어 env 파일로 빼 놨 습니다. env 파일은 github 로 옮기기 힘들 것 같 습니다.

# 구현 된 내용들
# 1) 문자를 전송하는 함수
# 2) 사용자에게 인증 코드를 발송하는 함수
#   - 인증 코드를 생성하는 함수
#   - 인증 번호 일치 여부 확인 함수
#   - 인증 횟수 5회 제한 함수
# 3) 주간 감정데이터를 기반으로 사용자에게 경고 문자를 발송하는 함수
# 4) 발송한 메시지의 상태를 확인하는 함수
# 5) 발송한 메시지의 상태를 출력하는 함수

# 환경 변수 로드
load_dotenv()

# Django 프로젝트 설정 파일 지정
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DjangoProject.settings")
django.setup()

# twilioex 클라이언트 초기화
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

# 메시지 상태 확인 함수 입니다.
def check_message(message_sid):
    client = init_twilio_client()
    try:
        message = client.messages(message_sid).fetch()
        return{
            "status": message.status, # 상태 정보
            "to" : message.to, # 수신자 번호
            "from" : message.from_, # 발신자 번호
            "body" : message.body, # 메시지 내용
        }
    except Exception as e:
        print(f"메시지 상태 확인 중 오류가 발생했습니다 : {e}")
        return None


# 메시지 상태 출력 함수입니다.
def print_message_status(message_sid):
    status_info = check_message(message_sid)
    status = status_info["status"]

    if status == "sent":
        print("메시지가 성공적으로 전송되었습니다.")
    elif status == "delivered":
        print("수신자가 메시지를 받았습니다.")
    elif status == "failed":
        print("메시지 전송이 실패했습니다.")
    elif status == "undelivered":
        print("메시지가 전달되지 않았습니다. 수신자 번호를 다시 확인하세요.")
    else:
        print(f"현재 메시지 상태 : {status}")

# 인증 코드 생성 함수
def generate_verification_code():
    return f"{random.randint(0, 999999):06d}"

# 사용자에게 인증코드 발송
def send_verification_code(user, phone_number):
    verification_code = generate_verification_code()
    # 인증번호 캐시에 3분 간 저장
    cache.set(f"verification_code_{user.id}", verification_code, timeout=180)
    message_body = f"인증 코드는 {verification_code} 입니다. 3분 안에 입력해주세요. "
    send_message(user, message_body)

# 인증 번호 확인
def verify_code(user, entered_code):
    stored_code = cache.get(f"verification_code_{user.id}")

    if not stored_code:
        return {"status": "expired", "message": "인증번호가 만료되었습니다."}
    if stored_code == entered_code:
        return {"status": "success", "message": "인증번호가 일치합니다."}
    else:
        return {"status": "success", "message": "인증번호가 일치하지 않습니다."}

# 인증 시도 회수 제한
def verify_code_attempt(user, entered_code):
    attempt_key = f"verification_code_{user.id}"
    locked_key = f"verification_code_{user.id}"

    if cache.get(locked_key):
        return {"status" : "locked", "message": "현재 잠금 상태입니다. 잠시 후 다시 시도하세요"}

    attempts = cache.get(attempt_key,0)

    if attempts >= 5:
        cache.set(locked_key, True, timeout=300)
        return {"status" :"locked", "message": "5회 실패하여 잠겼습니다. 잠시 후 다시 시도하세요"}

    result = verify_code(user, entered_code)

    if result["status"] == "failure":
        cache.set(attempt_key, attempts + 1, timeout=180)
    else:
        cache.delete(attempt_key)

    return result

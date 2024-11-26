import random
from send_sms import *
from django.core.cache import cache

# 추가했던 함수 중 쓰일지 모르는것들 따로 빼놨습니다.


# 구현 된 내용들
# 1) 사용자에게 인증 코드를 발송하는 함수
#   - 인증 코드를 생성하는 함수
#   - 인증 번호 일치 여부 확인 함수
#   - 인증 횟수 5회 제한 함수
# 2) 발송한 메시지의 상태를 확인하는 함수
# 3) 발송한 메시지의 상태를 출력하는 함수


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

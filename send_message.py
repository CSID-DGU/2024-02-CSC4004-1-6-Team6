from twilio.rest import Client
from dotenv import load_dotenv
import os

# 감정 상태가 위험 상태일때 사용자에게 기관 연락처를 알려주고 연락을 권유함
# 일단 유저에게 메시지를 보내는 쪽으로 작성했습니다.
# 계정 코드가 커밋에 문제가 되어 env 파일로 빼놨습니다. env 파일은 github로 옮기기 힘들거같습니다.

load_dotenv()

# 환경 변수 불러오기
account_sid = os.getenv("account_sid")
auth_token = os.getenv("auth_token")

# Twilio 클라이언트 초기화
client = Client(account_sid, auth_token)

# 확인용 출력 (문제가 해결되면 삭제 가능)
print(f"Account SID: {os.getenv('account_sid')}")
print(f"Auth Token: {os.getenv('auth_token')}")

# 임시 설정값
sadness = 80  # 감정치 상태를 저장할 값
user_phone_number = "+821024137915"  # 유저 전화번호를 저장할 값, 지금은 테스트 계정이라 이 번호에만 문자가 갑니다.

# 메시지 내용, 한번에 보낼 수 있는 문자량이 제한되어있어 많은 글자를 입력하기 힘듭니다. 이 정도 텍스트도 두개로 나눠져서 전송됩니다.
message_body = (
    "아래의 기관에 연락하는 것을 권장드립니다.\n"
    "기관 연락처 : xxx-xxxx-xxxx\n"
    f"현재 감정상태 : {sadness}점"
)

# 문자 전송, (receiver 사용자 번호)에게 (text 메시지 내용)을 보내는 함수
def send_message(receiver, text):
    message = client.messages.create(
        body=text, # 메시지 내용
        from_="+12672143141",  # Twilio 제공 번호, 송신자 번호
        to=receiver  # 수신자 번호, 체험판에서는 인증된 번호에만 보낼 수 있음
    )


if sadness >= 80: # 감정상태가 기준치 이상일 시 메시지를 보냄
    send_message(user_phone_number, message_body)
    print("기관 연락처를 전송했습니다.")
else:
    print("현재 감정 상태는 위험 수준이 아닙니다.")
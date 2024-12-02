import openai
import os

# 환경 변수에서 GPT API 키 가져오기
openai.api_key = os.getenv("GPT_API_KEY")

def call_gpt_api(prompt):
    """
    GPT API를 호출하여 결과를 반환합니다.
    """
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # 사용할 GPT 모델
            prompt=prompt,
            max_tokens=100,  # 결과의 최대 토큰 수
            temperature=0.7,  # 창의성 조정
        )
        return response.choices[0].text.strip()
    except Exception as e:
        return f"Error: {str(e)}"

import re

def prepare_text_for_gpt(text):
    # 한글 조사의 정규식 (예: 가, 이, 를, 은 등)
    josa_pattern = re.compile(r'\b[가-힣]+(이|가|를|은|는|에|의|와|과|도|으로|로|에서)\b')

    # 1. 조사 제거
    text_without_josa = josa_pattern.sub(lambda m: m.group(0)[:-1], text)

    # 2. 중복 제거
    words = text_without_josa.split()
    unique_words = list(dict.fromkeys(words))  # 순서를 유지하며 중복 제거

    # 3. 결과를 다시 문장으로 결합
    result_text = ' '.join(unique_words)
    return result_text

# 테스트 데이터
diary_text = ("오늘은 공개 소프트웨어 자연어 처리하기 전 토큰을 처리하는 방법에 대해서 해보았다. 이렇게 하면 되는걸까 불안하다. 그래도 열"
              "심히 했으니까 어떻게든 되지 않을까? 토큰을 처리하는건 정말 귀찮다 그래도 라이브러리를 쓰지 않고 만들어보았다")

# 알고리즘 실행
processed_text = prepare_text_for_gpt(diary_text)
print("처리된 텍스트:")
print(processed_text)

import re
from konlpy.tag import Okt

okt = Okt()

def clean_text(text):
    """특수문자 및 불필요한 기호 제거"""
    text = re.sub(r"[^가-힣\s]", "", text)  # 한글과 공백만 남김
    text = re.sub(r"\s+", " ", text).strip()  # 불필요한 공백 제거
    return text

def extract_nouns(text):
    """형태소 분석 후 명사 추출"""
    return okt.nouns(text)

def remove_stopwords(tokens, stopwords_list):
    """불용어 제거"""
    return [word for word in tokens if word not in stopwords_list]

def prepare_text_for_gpt(text, stopwords_list):
    """전처리 전체 과정"""
    cleaned_text = clean_text(text)
    nouns = extract_nouns(cleaned_text)
    filtered_nouns = remove_stopwords(nouns, stopwords_list)
    return " ".join(filtered_nouns)

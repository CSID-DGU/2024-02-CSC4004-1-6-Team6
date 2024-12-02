from rest_framework.views import APIView
from rest_framework.response import Response
from .preprocess import prepare_text_for_gpt
from .utils import get_stopwords
from GPT_API.utils import call_gpt_api  # GPT API 호출 함수 임포트

class ProcessDiaryView(APIView):
    """
    일기 데이터를 전처리하고 GPT API로 보낸 후 결과 반환
    """
    def post(self, request):
        diary_text = request.data.get("text")  # 클라이언트에서 받은 데이터
        if not diary_text:
            return Response({"error": "일기 데이터가 제공되지 않았습니다."}, status=400)

        # 불용어 리스트 가져오기
        stopwords_list = get_stopwords()

        # 전처리 수행
        processed_text = prepare_text_for_gpt(diary_text, stopwords_list)

        # GPT API 호출
        gpt_response = call_gpt_api(processed_text)

        # 결과 반환
        return Response({
            "processed_text": processed_text,  # 전처리된 데이터
            "gpt_response": gpt_response,      # GPT API 결과
        }, status=200)

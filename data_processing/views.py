from rest_framework.views import APIView
from rest_framework.response import Response
from .preprocess import prepare_text_for_gpt
from .utils import get_stopwords

class ProcessDiaryView(APIView):
    """
    일기 데이터를 전처리하여 토큰을 최소화하는 API
    """
    def post(self, request):
        diary_text = request.data.get("text")  # 클라이언트에서 받은 데이터
        if not diary_text:
            return Response({"error": "일기 데이터가 제공되지 않았습니다."}, status=400)

        try:
            # 불용어 리스트 가져오기
            stopwords_list = get_stopwords()

            # 전처리 수행
            processed_text = prepare_text_for_gpt(diary_text, stopwords_list)

            # 성공 응답 반환
            return Response({"processed_text": processed_text}, status=200)

        except Exception as e:
            # 에러 발생 시
            return Response({"error": str(e)}, status=500)


# Create your views here.

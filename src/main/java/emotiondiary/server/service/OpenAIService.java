package emotiondiary.server.service;

import emotiondiary.server.dto.openai.OpenAIRequest;
import emotiondiary.server.dto.openai.OpenAIResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OpenAIService {

    private final WebClient webClient;

    @Value("${openai.api-key}")
    private String apiKey;

    public OpenAIService() {
        this.webClient = WebClient.builder().baseUrl("https://api.openai.com/v1/chat/completions").build();
    }

    public String analyzeEmotion(String diaryText) {
        // 프롬프트 작성
        String prompt = """
                    아래는 사용자가 작성한 일기입니다. 일기에서 감정을 분석하고 각 감정의 강도를 0에서 1 사이의 값으로 반환하세요.
                    응답은 반드시 JSON 형식으로 반환해주세요.
                
                    감정 분석 기준:
                    기쁨 : 0 - 1 사이의 값
                    슬픔 : 0 - 1 사이의 값
                    분노 : 0 - 1 사이의 값
                    두려움 : 0 - 1 사이의 값
                    놀라움 : 0 - 1 사이의 값
                    혐오 : 0 - 1 사이의 값
                
              
                    
                    예시 응답:
                    {
                      "기쁨": 0.5,
                      "슬픔": 0.3,
                      "분노": 0.1,
                      "두려움": 0.2,
                      "놀라움": 0.4,
                      "혐오": 0.0
                    }
                    일기 내용:
                    "{diary_text}"
                
                
                """.formatted(diaryText);

        OpenAIRequest request = new OpenAIRequest(
                "gpt-3.5-turbo",
                List.of(new OpenAIRequest.Message("user", prompt))
        );

        OpenAIResponse response = webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OpenAIResponse.class)
                .block();

        return response.getChoices().get(0).getMessage().getContent();
    }

}

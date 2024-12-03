package emotiondiary.server.dto.openai;

import java.util.List;
import lombok.Data;

@Data
public class OpenAIResponse {
    private List<Choice> choices;

    @Data
    public static class Choice {
        private Message message;

        @Data
        public static class Message{
            private String content;
        }
    }
}
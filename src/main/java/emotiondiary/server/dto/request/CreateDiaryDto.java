package emotiondiary.server.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.Builder;

@Builder
public record CreateDiaryDto(
        @JsonProperty("title") String title,
        @JsonProperty("content") String content,
        @JsonProperty("user_id") Long userId
) implements Serializable {
    public static CreateDiaryDto of(
            final String title,
            final String content,
            final Long userId
    ) {
        return CreateDiaryDto.builder()
                .title(title)
                .content(content)
                .userId(userId)
                .build();
    }
}

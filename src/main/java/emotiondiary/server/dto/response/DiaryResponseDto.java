package emotiondiary.server.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record DiaryResponseDto(
        @JsonProperty("user_id") Long userId,
        @JsonProperty("title") String title,
        @JsonProperty("content") String content,
        @JsonProperty("created_at")LocalDateTime createdAt,
        @JsonProperty("fixed_at") LocalDateTime fixedAt
        ) implements Serializable {
    public static DiaryResponseDto of(
            final Long userId,
            final String title,
            final String content,
            final LocalDateTime createdAt,
            final LocalDateTime fixedAt
    ) {
        return DiaryResponseDto.builder()
                .userId(userId)
                .title(title)
                .content(content)
                .createdAt(createdAt)
                .fixedAt(fixedAt)
                .build();
    }
}

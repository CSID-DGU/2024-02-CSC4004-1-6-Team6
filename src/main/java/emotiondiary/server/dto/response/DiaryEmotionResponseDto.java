package emotiondiary.server.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record DiaryEmotionResponseDto(
        @JsonProperty("diary_id") Long diaryId,
        @JsonProperty("happiness") float happiness,
        @JsonProperty("sadness") float sadness,
        @JsonProperty("anger") float anger,
        @JsonProperty("fear") float fear,
        @JsonProperty("surprise") float surprise,
        @JsonProperty("disgust") float disgust,
        @JsonProperty("created_at") LocalDateTime createdAt
) implements Serializable {
    public static DiaryEmotionResponseDto of(
            final Long diaryId,
            final float happiness,
            final float sadness,
            final float anger,
            final float fear,
            final float surprise,
            final float disgust,
            final LocalDateTime createdAt
    ) {
        return DiaryEmotionResponseDto.builder()
                .diaryId(diaryId)
                .happiness(happiness)
                .sadness(sadness)
                .anger(anger)
                .fear(fear)
                .surprise(surprise)
                .disgust(disgust)
                .createdAt(createdAt)
                .build();
    }
}

package emotiondiary.server.dto.global;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.Builder;

@Builder
public record JwtResponseDto(
        @JsonProperty("jwt") String jwt,
        @JsonProperty("username") String username
) implements Serializable {
    public static JwtResponseDto of(
            final String jwt,
            final String username
    ) {
        return JwtResponseDto.builder()
                .jwt(jwt)
                .username(username)
                .build();
    }
}
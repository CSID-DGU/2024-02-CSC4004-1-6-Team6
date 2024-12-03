package emotiondiary.server.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.Builder;

@Builder
public record UserLoginDto(
        @JsonProperty("username") String username,
        @JsonProperty("password") String password
) implements Serializable {
    public static UserLoginDto of(
            final String username,
            final String password
    ) {
        return UserLoginDto.builder()
                .username(username)
                .password(password)
                .build();
    }
}

package emotiondiary.server.service;

import emotiondiary.server.component.JwtTokenService;
import emotiondiary.server.domain.User;
import emotiondiary.server.dto.global.JwtResponseDto;
import emotiondiary.server.dto.request.CreateUserDto;
import emotiondiary.server.dto.request.UserLoginDto;
import emotiondiary.server.exception.CommonException;
import emotiondiary.server.exception.ErrorCode;
import emotiondiary.server.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtTokenService jwtTokenService;

    @Transactional
    public boolean craeteUser(CreateUserDto createUserDto) {
        String encodedPassword = passwordEncoder.encode(createUserDto.password());

        User save = userRepository.save(
                User.builder().username(createUserDto.username()).password(encodedPassword).email(createUserDto.email())
                        .firstName(createUserDto.firstName()).lastName(createUserDto.lastName())
                        .phoneNumber(createUserDto.phoneNumber()).build());

        return Boolean.TRUE;
    }

    @Transactional
    public JwtResponseDto login(UserLoginDto userLoginDto) {
        User user = userRepository.findByUsername(userLoginDto.username())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));
        if (user != null && passwordEncoder.matches(userLoginDto.password(), user.getPassword())) {
            String jwt = jwtTokenService.generateToken(user.getUsername());
            return JwtResponseDto.builder().jwt(jwt).username(user.getUsername()).build();
        }
        return JwtResponseDto.builder().jwt(null).username(null).build();
    }
}

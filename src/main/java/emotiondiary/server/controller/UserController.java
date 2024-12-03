package emotiondiary.server.controller;

import emotiondiary.server.dto.global.ResponseDto;
import emotiondiary.server.dto.request.CreateUserDto;
import emotiondiary.server.dto.request.UserLoginDto;
import emotiondiary.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseDto<?> signup(@RequestBody CreateUserDto createUserDto) {
        return ResponseDto.created(userService.craeteUser(createUserDto));
    }

    @PostMapping("/login")
    public ResponseDto<?> login(@RequestBody UserLoginDto userLoginDto) {
        return ResponseDto.ok(userService.login(userLoginDto));
    }
}

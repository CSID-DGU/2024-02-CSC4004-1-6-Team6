package emotiondiary.server.controller;

import emotiondiary.server.dto.global.ResponseDto;
import emotiondiary.server.dto.request.CreateDiaryDto;
import emotiondiary.server.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping("/post")
    public ResponseDto<?> postDiary(@RequestBody CreateDiaryDto createDiaryDto) {
        return ResponseDto.created(diaryService.postDiary(createDiaryDto));
    }

    @GetMapping("/{username}")
    public ResponseDto<?> getDiariesByUserName(@PathVariable("username") String username) {
        return ResponseDto.ok(diaryService.getDiariesByUsername(username));
    }

    @PutMapping("/{diaryId}")
    public ResponseDto<?> fixDiary(@PathVariable Long diaryId, @RequestBody CreateDiaryDto createDiaryDto) {
        return ResponseDto.ok(diaryService.fixDiary(diaryId, createDiaryDto));
    }

    @DeleteMapping("/{diaryId}")
    public ResponseDto<?> deleteDiary(@PathVariable Long diaryId) {
        return ResponseDto.ok(diaryService.deleteDiary(diaryId));
    }
}

package emotiondiary.server.controller;

import emotiondiary.server.dto.global.ResponseDto;
import emotiondiary.server.service.DiaryEmotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diary-emotion")
@RequiredArgsConstructor
public class DiaryEmotionController {

    private final DiaryEmotionService diaryEmotionService;

    @PostMapping("/{diaryId}")
    public ResponseDto<?> analyzeAndSaveEmotion(@PathVariable("diaryId") Long diaryId) {
        return ResponseDto.ok(diaryEmotionService.analyzeAndSaveEmotion(diaryId));
    }

    @GetMapping("/{diaryId}")
    public ResponseDto<?> getEmotionsById(@PathVariable("diaryId") Long diaryId) {
        return ResponseDto.ok(diaryEmotionService.getEmotionsByDiaryId(diaryId));
    }

    @GetMapping("/all/{username}")
    public ResponseDto<?> getEmotionsByusername(@PathVariable("username") String username) {
        return ResponseDto.ok(diaryEmotionService.getEmotionsByUserName(username));
    }
    @GetMapping
    public ResponseDto<?> getEmotionsByDate(@RequestParam("date") String date) {
        return ResponseDto.ok(this.diaryEmotionService.getEmotionsByDate(date));
    }
}

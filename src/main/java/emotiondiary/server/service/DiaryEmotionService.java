package emotiondiary.server.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import emotiondiary.server.domain.Diary;
import emotiondiary.server.domain.DiaryEmotion;
import emotiondiary.server.domain.User;
import emotiondiary.server.dto.response.DiaryEmotionResponseDto;
import emotiondiary.server.exception.CommonException;
import emotiondiary.server.exception.ErrorCode;
import emotiondiary.server.repository.DiaryEmotionRepository;
import emotiondiary.server.repository.DiaryRepository;
import emotiondiary.server.repository.UserRepository;
import emotiondiary.server.util.DiaryProcessor;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiaryEmotionService {

    private final OpenAIService openAIService;
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final DiaryEmotionRepository diaryEmotionRepository;
    private final DiaryProcessor diaryProcessor;

    public DiaryEmotionResponseDto analyzeAndSaveEmotion(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

        // 다이어리 내용 전처리
        String parsedContent = diaryProcessor.prepareTextForGpt(diary.getContent());

        // OpenAI 감정 분석 요청 및 JSON 응답 처리
        String result = openAIService.analyzeEmotion(parsedContent);
        Map<String, Float> emotions = parseEmotionFromJson(result);

        // DiaryEmotion 저장
        DiaryEmotion savedEmotion = diaryEmotionRepository.save(DiaryEmotion.builder()
                .diary(diary)
                .happiness(emotions.getOrDefault("기쁨", 0.0f))
                .sadness(emotions.getOrDefault("슬픔", 0.0f))
                .anger(emotions.getOrDefault("분노", 0.0f))
                .fear(emotions.getOrDefault("두려움", 0.0f))
                .surprise(emotions.getOrDefault("놀라움", 0.0f))
                .disgust(emotions.getOrDefault("혐오", 0.0f))
                .build());

        return DiaryEmotionResponseDto.of(
                savedEmotion.getDiary().getId(),
                savedEmotion.getHappiness(),
                savedEmotion.getSadness(),
                savedEmotion.getAnger(),
                savedEmotion.getFear(),
                savedEmotion.getSurprise(),
                savedEmotion.getDisgust(),
                savedEmotion.getCreatedAt()
        );
    }

    public DiaryEmotionResponseDto getEmotionsByDiaryId(Long diaryId) {
        DiaryEmotion diaryEmotion = diaryEmotionRepository.findDiaryEmotionByDiaryId(diaryId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

        return DiaryEmotionResponseDto.builder()
                .diaryId(diaryId)
                .happiness(diaryEmotion.getHappiness())
                .sadness(diaryEmotion.getSadness())
                .anger(diaryEmotion.getAnger())
                .fear(diaryEmotion.getFear())
                .surprise(diaryEmotion.getSurprise())
                .disgust(diaryEmotion.getDisgust())
                .createdAt(diaryEmotion.getCreatedAt())
                .build();
    }

    public List<DiaryEmotionResponseDto> getEmotionsByUserName(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));
        List<Diary> diaries = diaryRepository.findAllByUserId(user.getId());
        List<DiaryEmotion> emotions = diaryEmotionRepository.findAllByDiaryIn(diaries);

        return emotions.stream()
                .map(diaryEmotion -> DiaryEmotionResponseDto.of(
                        diaryEmotion.getDiary().getId(),
                        diaryEmotion.getHappiness(),
                        diaryEmotion.getSadness(),
                        diaryEmotion.getAnger(),
                        diaryEmotion.getFear(),
                        diaryEmotion.getSurprise(),
                        diaryEmotion.getDisgust(),
                        diaryEmotion.getCreatedAt()
                ))
                .toList();
    }

    // OpenAI JSON 응답 파싱
    private Map<String, Float> parseEmotionFromJson(String jsonResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(jsonResponse, new TypeReference<Map<String, Float>>() {});
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }
}

package emotiondiary.server.service;

import emotiondiary.server.domain.Diary;
import emotiondiary.server.domain.User;
import emotiondiary.server.dto.request.CreateDiaryDto;
import emotiondiary.server.dto.response.DiaryResponseDto;
import emotiondiary.server.exception.CommonException;
import emotiondiary.server.exception.ErrorCode;
import emotiondiary.server.repository.DiaryRepository;
import emotiondiary.server.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;

    public boolean postDiary(CreateDiaryDto createDiaryDto) {
        User user = userRepository.findById(createDiaryDto.userId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

        diaryRepository.save(Diary.builder()
                .title(createDiaryDto.title())
                .content(createDiaryDto.content())
                .user(user)
                .build());

        return Boolean.TRUE;
    }

    public boolean fixDiary(Long diaryId, CreateDiaryDto createDiaryDto) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

        diary.fixDiary(createDiaryDto.title(), createDiaryDto.content());
        return Boolean.TRUE;
    }

    public List<DiaryResponseDto> getDiariesByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

        return diaryRepository.findAllByUserId(user.getId()).stream()
                .map(diary ->
                        DiaryResponseDto.of(
                                diary.getUser().getId(),
                                diary.getTitle(),
                                diary.getContent(),
                                diary.getCreatedAt(),
                                diary.getFixedAt()
                        )).toList();
    }

    public boolean deleteDiary(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

        diaryRepository.delete(diary);
        return Boolean.TRUE;
    }
}

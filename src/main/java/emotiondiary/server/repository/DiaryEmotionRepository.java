package emotiondiary.server.repository;

import emotiondiary.server.domain.Diary;
import emotiondiary.server.domain.DiaryEmotion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryEmotionRepository extends JpaRepository<DiaryEmotion, Long> {
    Optional<DiaryEmotion> findDiaryEmotionByDiaryId(Long diaryId);
    List<DiaryEmotion> findAllByDiaryIn(List<Diary> diaries);
}

package emotiondiary.server.repository;

import emotiondiary.server.domain.WeeklyEmotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeeklyEmotionRepository extends JpaRepository<WeeklyEmotion, Long> {
}
